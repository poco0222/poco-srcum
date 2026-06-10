/**
 * @file Document collaboration dashboard service for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  DocumentReviewStatus,
  DocumentType,
  LinkageObjectType,
  LinkageRelationType,
  getReverseLinkageRelation,
  type DocumentRecord,
  type DocumentReviewStatusValue,
  type LinkageObjectTypeValue,
  type LinkageRelationTypeValue
} from "@poco-scrum/domain";
import { SearchResultCardSchema, type SearchResultCard } from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";
import { LinkageService } from "../linkage/linkage.service";
import { type DocumentReviewStatusResolver } from "../search/search.service";

export type IncompleteLinkCard = {
  objectType: LinkageObjectTypeValue;
  objectId: string;
  title: string;
  missingRelation: LinkageRelationTypeValue;
  updatedAt: string;
};

export type DocumentCollaborationDashboard = {
  pendingReviewDocuments: SearchResultCard[];
  recentUpdates: SearchResultCard[];
  incompleteLinks: IncompleteLinkCard[];
};

export type DashboardServiceDependencies = {
  documentsService: DocumentsService;
  linkageService: LinkageService;
  reviewStatusResolver?: DocumentReviewStatusResolver;
};

const documentTypeToDashboardObjectType = {
  [DocumentType.REQUIREMENT]: LinkageObjectType.REQUIREMENT_DOCUMENT,
  [DocumentType.TECHNICAL_SOLUTION]: LinkageObjectType.DESIGN_DOCUMENT,
  [DocumentType.ACCEPTANCE]: LinkageObjectType.ACCEPTANCE_RECORD,
  [DocumentType.RETROSPECTIVE]: LinkageObjectType.RETROSPECTIVE_DOCUMENT
} as const;

/**
 * Builds the fixed P2 dashboard cards without introducing P3 reporting metrics.
 */
export class DashboardService {
  constructor(private readonly dependencies: DashboardServiceDependencies) {}

  /**
   * @returns Pending review, recent update, and incomplete-link dashboard cards.
   */
  async getDocumentCollaborationDashboard(): Promise<DocumentCollaborationDashboard> {
    const documents = await this.dependencies.documentsService.listAllDocuments();
    const documentCards = (
      await Promise.all(documents.map((document) => this.buildDocumentCard(document)))
    ).filter((card): card is SearchResultCard => card !== null);
    const pendingReviewDocuments = documentCards.filter(
      (card) => card.reviewStatus === DocumentReviewStatus.IN_REVIEW
    );
    const recentUpdates = [...documentCards]
      .sort(compareCardsByUpdatedAtDescending)
      .slice(0, 5);
    const incompleteLinks = (
      await Promise.all(documents.map((document) => this.buildIncompleteLinkCard(document)))
    )
      .filter((card): card is IncompleteLinkCard => card !== null)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

    return {
      pendingReviewDocuments,
      recentUpdates,
      incompleteLinks
    };
  }

  /**
   * @param document The formal document to project into a dashboard result card.
   * @returns A search-compatible dashboard card or null for non-formal documents.
   */
  private async buildDocumentCard(document: DocumentRecord) {
    const objectType = getDashboardObjectTypeForDocument(document);

    if (!objectType) {
      return null;
    }

    return SearchResultCardSchema.parse({
      objectType,
      objectId: document.id,
      title: document.title,
      snippet: buildDashboardSnippet(document),
      relationSummary: await this.buildRelationSummary(objectType, document.id),
      reviewStatus: await this.resolveReviewStatus(document.id),
      updatedAt: document.updatedAt
    });
  }

  /**
   * @param document The formal document to inspect.
   * @returns Missing link information or null when the minimum link exists.
   */
  private async buildIncompleteLinkCard(document: DocumentRecord) {
    const objectType = getDashboardObjectTypeForDocument(document);

    if (!objectType) {
      return null;
    }

    const missingRelation = await this.findMissingRequiredRelation(
      objectType,
      document.id
    );

    return missingRelation
      ? {
          objectType,
          objectId: document.id,
          title: document.title,
          missingRelation,
          updatedAt: document.updatedAt
        }
      : null;
  }

  /**
   * @param objectType The dashboard object type.
   * @param objectId The dashboard object identifier.
   * @returns The first missing required relation for the object, if any.
   */
  private async findMissingRequiredRelation(
    objectType: LinkageObjectTypeValue,
    objectId: string
  ): Promise<LinkageRelationTypeValue | null> {
    if (objectType === LinkageObjectType.REQUIREMENT_DOCUMENT) {
      const links = await this.dependencies.linkageService.listForwardLinks({
        sourceType: objectType,
        sourceId: objectId
      });

      return links.some(
        (link) => link.relationType === LinkageRelationType.REQUIREMENT_TO_DESIGN
      )
        ? null
        : LinkageRelationType.REQUIREMENT_TO_DESIGN;
    }

    if (objectType === LinkageObjectType.DESIGN_DOCUMENT) {
      const links = await this.dependencies.linkageService.listForwardLinks({
        sourceType: objectType,
        sourceId: objectId
      });

      return links.some(
        (link) => link.relationType === LinkageRelationType.DESIGN_TO_STORY
      )
        ? null
        : LinkageRelationType.DESIGN_TO_STORY;
    }

    if (objectType === LinkageObjectType.ACCEPTANCE_RECORD) {
      const links = await this.dependencies.linkageService.listReverseLinks({
        targetType: objectType,
        targetId: objectId
      });

      return links.some(
        (link) => link.relationType === LinkageRelationType.STORY_TO_ACCEPTANCE
      )
        ? null
        : LinkageRelationType.STORY_TO_ACCEPTANCE;
    }

    if (objectType === LinkageObjectType.RETROSPECTIVE_DOCUMENT) {
      const links = await this.dependencies.linkageService.listReverseLinks({
        targetType: objectType,
        targetId: objectId
      });

      return links.some(
        (link) => link.relationType === LinkageRelationType.SPRINT_TO_RETROSPECTIVE
      )
        ? null
        : LinkageRelationType.SPRINT_TO_RETROSPECTIVE;
    }

    return null;
  }

  /**
   * @param documentId The formal document identifier.
   * @returns The current review status or draft when no resolver is configured.
   */
  private async resolveReviewStatus(documentId: string) {
    const resolver = this.dependencies.reviewStatusResolver;

    if (!resolver) {
      return DocumentReviewStatus.DRAFT;
    }

    return (await resolver(documentId)) ?? DocumentReviewStatus.DRAFT;
  }

  /**
   * @param objectType The indexed object type.
   * @param objectId The indexed object identifier.
   * @returns Stable relation summary strings for dashboard cards.
   */
  private async buildRelationSummary(
    objectType: LinkageObjectTypeValue,
    objectId: string
  ) {
    const forwardLinks = await this.dependencies.linkageService.listForwardLinks({
      sourceType: objectType,
      sourceId: objectId
    });
    const reverseLinks = await this.dependencies.linkageService.listReverseLinks({
      targetType: objectType,
      targetId: objectId
    });

    return [
      ...forwardLinks.map((link) => `${link.relationType}: ${link.targetId}`),
      ...reverseLinks.map(
        (link) => `${getReverseLinkageRelation(link.relationType)}: ${link.sourceId}`
      )
    ];
  }
}

/**
 * @param document The formal document whose dashboard object type should be derived.
 * @returns Dashboard object type or null for non-formal documents.
 */
function getDashboardObjectTypeForDocument(
  document: DocumentRecord
): LinkageObjectTypeValue | null {
  if (!document.documentType) {
    return null;
  }

  return documentTypeToDashboardObjectType[document.documentType] ?? null;
}

/**
 * @param document The formal document source.
 * @returns A compact dashboard snippet.
 */
function buildDashboardSnippet(document: DocumentRecord) {
  return document.markdown.replace(/\s+/g, " ").trim().slice(0, 120);
}

/**
 * @param left The first result card.
 * @param right The second result card.
 * @returns Newest-first sort order with id fallback.
 */
function compareCardsByUpdatedAtDescending(
  left: SearchResultCard,
  right: SearchResultCard
) {
  const updatedAtOrder = right.updatedAt.localeCompare(left.updatedAt);

  return updatedAtOrder === 0
    ? right.objectId.localeCompare(left.objectId)
    : updatedAtOrder;
}
