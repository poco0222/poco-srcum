/**
 * @file Basic search service for Phase 2 delivery evidence lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import { BadRequestException } from "@nestjs/common";

import {
  DocumentReviewStatus,
  DocumentType,
  LinkageObjectType,
  WorkItemType,
  getReverseLinkageRelation,
  type DocumentRecord,
  type DocumentReviewStatusValue,
  type LinkageObjectTypeValue,
  type SprintRecord,
  type WorkItemRecord
} from "@poco-scrum/domain";
import {
  SearchQueryInputSchema,
  SearchResultCardSchema,
  type SearchQueryInput,
  type SearchResultCard
} from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";
import { LinkageService } from "../linkage/linkage.service";
import { SprintsService } from "../sprints/sprints.service";
import { WorkItemsService } from "../work-items/work-items.service";

export type DocumentReviewStatusResolver = (
  documentId: string
) => DocumentReviewStatusValue | null | Promise<DocumentReviewStatusValue | null>;

export type SearchServiceDependencies = {
  documentsService: DocumentsService;
  linkageService: LinkageService;
  reviewStatusResolver?: DocumentReviewStatusResolver;
  sprintsService?: SprintsService;
  workItemsService?: WorkItemsService;
};

const documentTypeToSearchObjectType = {
  [DocumentType.REQUIREMENT]: LinkageObjectType.REQUIREMENT_DOCUMENT,
  [DocumentType.TECHNICAL_SOLUTION]: LinkageObjectType.DESIGN_DOCUMENT,
  [DocumentType.ACCEPTANCE]: LinkageObjectType.ACCEPTANCE_RECORD,
  [DocumentType.RETROSPECTIVE]: LinkageObjectType.RETROSPECTIVE_DOCUMENT
} as const;

/**
 * Aggregates P2 formal documents and object links into stable search result cards.
 */
export class SearchService {
  constructor(private readonly dependencies: SearchServiceDependencies) {}

  /**
   * @param input The keyword and optional filters used by basic search.
   * @returns Search result cards sorted by updated time descending.
   */
  async search(input: SearchQueryInput) {
    const query = parseSearchQuery(input);

    if (!hasSearchConstraint(query)) {
      return [];
    }

    const [documents, workItems, sprints] = await Promise.all([
      this.dependencies.documentsService.listAllDocuments(),
      this.dependencies.workItemsService?.listAllWorkItems() ?? [],
      this.dependencies.sprintsService?.listAllSprints() ?? []
    ]);
    const cards = await Promise.all([
      ...documents.map((document) => this.buildDocumentCard(document, query)),
      ...workItems.map((workItem) => this.buildWorkItemCard(workItem, query)),
      ...sprints.map((sprint) => this.buildSprintCard(sprint, query))
    ]);

    return cards
      .filter((card): card is SearchResultCard => card !== null)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  /**
   * @param document The formal document candidate.
   * @param query The normalized search query.
   * @returns A result card or null when the document does not match.
   */
  private async buildDocumentCard(
    document: DocumentRecord,
    query: SearchQueryInput
  ): Promise<SearchResultCard | null> {
    const objectType = getSearchObjectTypeForDocument(document);

    if (!objectType || (query.objectType && query.objectType !== objectType)) {
      return null;
    }

    const snippet = buildDocumentSnippet(document, query.keyword);

    if (!snippet) {
      return null;
    }

    const reviewStatus = await this.resolveReviewStatus(document.id);

    if (query.reviewStatus && query.reviewStatus !== reviewStatus) {
      return null;
    }

    return SearchResultCardSchema.parse({
      objectType,
      objectId: document.id,
      title: document.title,
      snippet,
      relationSummary: await this.buildRelationSummary(objectType, document.id),
      reviewStatus,
      updatedAt: document.updatedAt
    });
  }

  /**
   * @param workItem The work item candidate.
   * @param query The normalized search query.
   * @returns A result card or null when the work item does not match.
   */
  private async buildWorkItemCard(
    workItem: WorkItemRecord,
    query: SearchQueryInput
  ): Promise<SearchResultCard | null> {
    if (workItem.type !== WorkItemType.STORY) {
      return null;
    }

    if (query.objectType && query.objectType !== LinkageObjectType.STORY) {
      return null;
    }

    const snippet = buildWorkItemSnippet(workItem, query.keyword);

    if (!snippet) {
      return null;
    }

    return SearchResultCardSchema.parse({
      objectType: LinkageObjectType.STORY,
      objectId: workItem.id,
      title: workItem.title,
      snippet,
      relationSummary: await this.buildRelationSummary(
        LinkageObjectType.STORY,
        workItem.id
      ),
      reviewStatus: null,
      updatedAt: fallbackUpdatedAt
    });
  }

  /**
   * @param sprint The Sprint candidate.
   * @param query The normalized search query.
   * @returns A result card or null when the Sprint does not match.
   */
  private async buildSprintCard(
    sprint: SprintRecord,
    query: SearchQueryInput
  ): Promise<SearchResultCard | null> {
    if (query.objectType && query.objectType !== LinkageObjectType.SPRINT) {
      return null;
    }

    const snippet = buildSprintSnippet(sprint, query.keyword);

    if (!snippet) {
      return null;
    }

    return SearchResultCardSchema.parse({
      objectType: LinkageObjectType.SPRINT,
      objectId: sprint.id,
      title: sprint.name,
      snippet,
      relationSummary: await this.buildRelationSummary(
        LinkageObjectType.SPRINT,
        sprint.id
      ),
      reviewStatus: null,
      updatedAt:
        sprint.closedAt ??
        sprint.endedAt ??
        sprint.activatedAt ??
        sprint.startsAt ??
        fallbackUpdatedAt
    });
  }

  /**
   * @param documentId The formal document identifier.
   * @returns The current review status, or draft when no resolver is configured.
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
   * @returns Stable forward and reverse relation summary strings.
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

const fallbackUpdatedAt = "1970-01-01T00:00:00.000Z";

/**
 * @param input The raw search query.
 * @returns A normalized search query.
 */
function parseSearchQuery(input: SearchQueryInput) {
  try {
    return SearchQueryInputSchema.parse(input);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new BadRequestException(error.message);
    }

    throw error;
  }
}

/**
 * @param query The parsed search query.
 * @returns Whether the query has keyword or filter constraints.
 */
function hasSearchConstraint(query: SearchQueryInput) {
  return (
    query.keyword.length > 0 ||
    query.objectType !== undefined ||
    query.reviewStatus !== undefined
  );
}

/**
 * @param document The document whose type should be exposed in search.
 * @returns Search object type, or null for non-formal documents.
 */
function getSearchObjectTypeForDocument(
  document: DocumentRecord
): LinkageObjectTypeValue | null {
  if (!document.documentType) {
    return null;
  }

  return documentTypeToSearchObjectType[document.documentType] ?? null;
}

/**
 * @param document The document candidate.
 * @param keyword The normalized keyword.
 * @returns A matched snippet from title, structured fields, or Markdown body.
 */
function buildDocumentSnippet(document: DocumentRecord, keyword: string) {
  if (keyword.length === 0) {
    return buildDefaultSnippet(document.markdown);
  }

  const lowerKeyword = keyword.toLocaleLowerCase();
  const title = matchText(document.title, lowerKeyword);

  if (title) {
    return title;
  }

  for (const [key, value] of Object.entries(document.structuredFields)) {
    const line = `${key}: ${String(value)}`;
    const field = matchText(line, lowerKeyword);

    if (field) {
      return field;
    }
  }

  return matchText(document.markdown, lowerKeyword);
}

/**
 * @param workItem The work item candidate.
 * @param keyword The normalized keyword.
 * @returns A matched or default snippet.
 */
function buildWorkItemSnippet(workItem: WorkItemRecord, keyword: string) {
  if (keyword.length === 0) {
    return buildDefaultSnippet(
      workItem.description ?? workItem.acceptanceCriteria.join(" ")
    );
  }

  const lowerKeyword = keyword.toLocaleLowerCase();

  return (
    matchText(workItem.title, lowerKeyword) ??
    matchText(workItem.description ?? "", lowerKeyword) ??
    matchText(workItem.acceptanceCriteria.join(" "), lowerKeyword)
  );
}

/**
 * @param sprint The Sprint candidate.
 * @param keyword The normalized keyword.
 * @returns A matched or default snippet.
 */
function buildSprintSnippet(sprint: SprintRecord, keyword: string) {
  if (keyword.length === 0) {
    return buildDefaultSnippet(sprint.goal ?? sprint.planningNote ?? sprint.name);
  }

  const lowerKeyword = keyword.toLocaleLowerCase();

  return (
    matchText(sprint.name, lowerKeyword) ??
    matchText(sprint.goal ?? "", lowerKeyword) ??
    matchText(sprint.planningNote ?? "", lowerKeyword)
  );
}

/**
 * @param value The candidate text value.
 * @returns A non-empty compact snippet.
 */
function buildDefaultSnippet(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  return normalized.length > 0 ? normalized.slice(0, 120) : "No preview available.";
}

/**
 * @param value The candidate text value.
 * @param lowerKeyword The lowercase keyword to find.
 * @returns A compact snippet when the keyword is present.
 */
function matchText(value: string, lowerKeyword: string) {
  const normalizedValue = value.replace(/\s+/g, " ").trim();
  const matchIndex = normalizedValue.toLocaleLowerCase().indexOf(lowerKeyword);

  if (matchIndex === -1) {
    return null;
  }

  const snippetStart = Math.max(0, matchIndex - 32);
  const snippetEnd = Math.min(
    normalizedValue.length,
    matchIndex + lowerKeyword.length + 64
  );

  return normalizedValue.slice(snippetStart, snippetEnd);
}
