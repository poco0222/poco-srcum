/**
 * @file Document review service for Phase 2 formal review workflows.
 * @author PopoY
 * @created 2026-06-10
 */
import { randomUUID } from "node:crypto";

import { BadRequestException } from "@nestjs/common";

import {
  DocumentReviewStatus,
  assertDocumentReviewStatusTransition,
  canApproveDocumentReviewVersion,
  type DocumentReviewRecord,
  type DocumentReviewStatusValue
} from "@poco-scrum/domain";
import {
  DecideDocumentReviewInputSchema,
  ReturnDocumentReviewToDraftInputSchema,
  SubmitDocumentReviewInputSchema,
  type DecideDocumentReviewInput,
  type ReturnDocumentReviewToDraftInput,
  type SubmitDocumentReviewInput
} from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";

export type LatestDocumentVersionResolver = (
  documentId: string
) => string | Promise<string>;

type SubmittedDocumentVersion = {
  id: string;
  documentId: string;
};

export type SubmittedDocumentVersionResolver = (
  versionId: string
) => SubmittedDocumentVersion | null | Promise<SubmittedDocumentVersion | null>;

export type PrismaDocumentReviewRow = {
  id: string;
  documentId: string;
  status: string;
  submittedVersionId: string;
  submittedById: string | null;
  submittedAt: Date | null;
  decidedById: string | null;
  conclusion: string | null;
  decidedAt: Date | null;
  updatedAt: Date;
};

type PrismaDocumentReviewDelegate = {
  findFirst(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaDocumentReviewRow | null>;
  upsert(args: Record<string, unknown>): Promise<PrismaDocumentReviewRow>;
};

export type PrismaDocumentReviewsClient = {
  documentReview?: PrismaDocumentReviewDelegate;
  $disconnect?: () => Promise<void>;
};

/**
 * @description Storage contract shared by document review adapters.
 */
export interface DocumentReviewsRepository {
  getByDocumentId(documentId: string): Promise<DocumentReviewRecord | null>;
  save(review: DocumentReviewRecord): Promise<DocumentReviewRecord>;
}

/**
 * Keeps one current review record per document for the P2 minimum workflow.
 */
export class InMemoryDocumentReviewsRepository
  implements DocumentReviewsRepository
{
  private readonly reviews = new Map<string, DocumentReviewRecord>();

  /**
   * @param documentId The document whose current review should be loaded.
   * @returns The current review record, or null before first submission.
   */
  async getByDocumentId(documentId: string) {
    const review = this.reviews.get(documentId);

    return review ? cloneReview(review) : null;
  }

  /**
   * @param review The current review state to persist.
   * @returns The persisted review clone.
   */
  async save(review: DocumentReviewRecord) {
    this.reviews.set(review.documentId, cloneReview(review));
    return this.getByDocumentId(review.documentId) as Promise<DocumentReviewRecord>;
  }
}

export class PrismaDocumentReviewsRepository
  implements DocumentReviewsRepository
{
  private readonly fallbackRepository = new InMemoryDocumentReviewsRepository();
  private useFallbackStorage = false;

  constructor(private readonly prisma: PrismaDocumentReviewsClient) {}

  /**
   * @param documentId The document whose current review should be loaded.
   * @returns The matching review from Prisma or fallback storage.
   */
  async getByDocumentId(documentId: string) {
    const documentReview = this.getDocumentReviewDelegate();

    if (!documentReview) {
      this.enableFallbackStorage();

      return this.fallbackRepository.getByDocumentId(documentId);
    }

    const row = await documentReview.findFirst({
      where: {
        documentId
      }
    });

    return row ? normalizePrismaReview(row) : null;
  }

  /**
   * @param review The current review state to persist.
   * @returns The saved review from Prisma or fallback storage.
   */
  async save(review: DocumentReviewRecord) {
    const documentReview = this.getDocumentReviewDelegate();

    if (!documentReview) {
      this.enableFallbackStorage();

      return this.fallbackRepository.save(review);
    }

    const row = await documentReview.upsert({
      where: {
        documentId: review.documentId
      },
      update: toPrismaReviewData(review),
      create: toPrismaReviewData(review)
    });

    return normalizePrismaReview(row);
  }

  /**
   * @returns The generated Prisma review delegate, or null when unavailable.
   */
  private getDocumentReviewDelegate() {
    if (this.useFallbackStorage) {
      return null;
    }

    return this.prisma.documentReview ?? null;
  }

  /**
   * @description Keeps reads consistent after a fallback write path is selected.
   */
  private enableFallbackStorage() {
    this.useFallbackStorage = true;
  }
}

/**
 * Coordinates the minimum formal document review lifecycle for Phase 2.
 */
export class ReviewsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly repository: DocumentReviewsRepository = new InMemoryDocumentReviewsRepository(),
    private readonly latestVersionResolver: LatestDocumentVersionResolver = async (
      documentId
    ) => {
      const document = await this.documentsService.getDocumentById(documentId);

      return document.updatedAt;
    },
    private readonly submittedVersionResolver: SubmittedDocumentVersionResolver = async () =>
      null,
    _nextSequence = 1
  ) {}

  /**
   * @param input The command that submits a document version for review.
   * @returns The current review record after submission.
   */
  async submitReview(input: SubmitDocumentReviewInput) {
    const payload = SubmitDocumentReviewInputSchema.parse(input);

    await this.documentsService.getDocumentById(payload.documentId);
    await this.assertSubmittedVersionBelongsToDocument(
      payload.versionId,
      payload.documentId
    );

    return this.transitionReview(payload.documentId, {
      nextStatus: DocumentReviewStatus.IN_REVIEW,
      actorId: payload.actorId,
      versionId: payload.versionId,
      conclusion: null
    });
  }

  /**
   * @param input The command that approves a submitted document version.
   * @returns The current review record after approval.
   */
  async approveReview(input: DecideDocumentReviewInput) {
    return this.decideReview(
      DecideDocumentReviewInputSchema.parse(input),
      DocumentReviewStatus.APPROVED
    );
  }

  /**
   * @param input The command that rejects a submitted document version.
   * @returns The current review record after rejection.
   */
  async rejectReview(input: DecideDocumentReviewInput) {
    return this.decideReview(
      DecideDocumentReviewInputSchema.parse(input),
      DocumentReviewStatus.REJECTED
    );
  }

  /**
   * @param input The command that returns a review to draft for edits.
   * @returns The current review record after reopening draft.
   */
  async returnToDraft(input: ReturnDocumentReviewToDraftInput) {
    const payload = ReturnDocumentReviewToDraftInputSchema.parse(input);

    await this.documentsService.getDocumentById(payload.documentId);

    return this.transitionReview(payload.documentId, {
      nextStatus: DocumentReviewStatus.DRAFT,
      actorId: payload.actorId,
      versionId: null,
      conclusion: payload.reason
    });
  }

  /**
   * @param documentId The document whose current review should be loaded.
   * @returns The current review record, or a draft shell before submission.
   */
  async getCurrentReview(documentId: string) {
    await this.documentsService.getDocumentById(documentId);

    return (
      (await this.repository.getByDocumentId(documentId)) ??
      this.buildDraftReview(documentId)
    );
  }

  /**
   * @param payload The validated approval or rejection command.
   * @param nextStatus The terminal review status requested by the decision.
   * @returns The review record after version and state checks.
   */
  private async decideReview(
    payload: DecideDocumentReviewInput,
    nextStatus: typeof DocumentReviewStatus.APPROVED | typeof DocumentReviewStatus.REJECTED
  ) {
    await this.documentsService.getDocumentById(payload.documentId);
    await this.assertSubmittedVersionBelongsToDocument(
      payload.versionId,
      payload.documentId
    );

    const currentReview = await this.getCurrentReview(payload.documentId);
    // Latest version id enforces that stale submissions cannot be approved.
    const latestVersionId = await this.latestVersionResolver(payload.documentId);

    if (currentReview.submittedVersionId !== payload.versionId) {
      throw new BadRequestException("DOCUMENT_REVIEW_VERSION_MISMATCH");
    }

    if (!canApproveDocumentReviewVersion(payload.versionId, latestVersionId)) {
      throw new BadRequestException("DOCUMENT_REVIEW_VERSION_NOT_LATEST");
    }

    return this.transitionReview(payload.documentId, {
      nextStatus,
      actorId: payload.actorId,
      versionId: payload.versionId,
      conclusion: payload.conclusion
    });
  }

  /**
   * @param versionId The submitted document version id.
   * @param documentId The document expected to own the version.
   */
  private async assertSubmittedVersionBelongsToDocument(
    versionId: string,
    documentId: string
  ) {
    const version = await this.submittedVersionResolver(versionId);

    if (!version) {
      throw new BadRequestException("DOCUMENT_REVIEW_VERSION_NOT_FOUND");
    }

    if (version.documentId !== documentId) {
      throw new BadRequestException("DOCUMENT_REVIEW_VERSION_DOCUMENT_MISMATCH");
    }
  }

  /**
   * @param documentId The document whose current review state should transition.
   * @param input The normalized state transition metadata.
   * @returns The persisted review record after applying lifecycle rules.
   */
  private async transitionReview(
    documentId: string,
    input: {
      nextStatus: DocumentReviewStatusValue;
      actorId: string;
      versionId: string | null;
      conclusion: string | null;
    }
  ) {
    const currentReview =
      (await this.repository.getByDocumentId(documentId)) ??
      this.buildDraftReview(documentId);

    try {
      assertDocumentReviewStatusTransition(
        currentReview.status,
        input.nextStatus
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    const now = new Date().toISOString();
    // Preserve submission metadata across decisions while resetting decision fields for draft or in-review states.
    const review: DocumentReviewRecord = {
      ...currentReview,
      status: input.nextStatus,
      submittedVersionId: input.versionId ?? currentReview.submittedVersionId,
      submittedById:
        input.nextStatus === DocumentReviewStatus.IN_REVIEW
          ? input.actorId
          : currentReview.submittedById,
      submittedAt:
        input.nextStatus === DocumentReviewStatus.IN_REVIEW
          ? now
          : currentReview.submittedAt,
      decidedById:
        input.nextStatus === DocumentReviewStatus.APPROVED ||
        input.nextStatus === DocumentReviewStatus.REJECTED
          ? input.actorId
          : null,
      conclusion: input.conclusion,
      decidedAt:
        input.nextStatus === DocumentReviewStatus.APPROVED ||
        input.nextStatus === DocumentReviewStatus.REJECTED
          ? now
          : null,
      updatedAt: now
    };

    return this.repository.save(review);
  }

  /**
   * @param documentId The document that has not entered formal review yet.
   * @returns A draft review shell used as the lifecycle starting point.
   */
  private buildDraftReview(documentId: string): DocumentReviewRecord {
    const now = new Date().toISOString();

    return {
      id: createReviewId(),
      documentId,
      status: DocumentReviewStatus.DRAFT,
      submittedVersionId: "",
      submittedById: null,
      submittedAt: null,
      decidedById: null,
      conclusion: null,
      decidedAt: null,
      updatedAt: now
    };
  }
}

/**
 * @param review The review record to clone before exposing repository state.
 * @returns A defensive copy of the review record.
 */
function cloneReview(review: DocumentReviewRecord): DocumentReviewRecord {
  return {
    ...review
  };
}

/**
 * @returns A restart-safe document review identifier.
 */
function createReviewId() {
  return `review-${randomUUID()}`;
}

/**
 * @param review The domain review record.
 * @returns A Prisma upsert data object with nullable decision fields.
 */
function toPrismaReviewData(review: DocumentReviewRecord) {
  return {
    id: review.id,
    documentId: review.documentId,
    status: review.status,
    submittedVersionId: review.submittedVersionId,
    submittedById: review.submittedById,
    submittedAt: review.submittedAt ? new Date(review.submittedAt) : null,
    decidedById: review.decidedById,
    conclusion: review.conclusion,
    decidedAt: review.decidedAt ? new Date(review.decidedAt) : null,
    updatedAt: new Date(review.updatedAt)
  };
}

/**
 * @param row The raw Prisma document review row.
 * @returns A domain review record with ISO datetime text.
 */
function normalizePrismaReview(
  row: PrismaDocumentReviewRow
): DocumentReviewRecord {
  return {
    id: row.id,
    documentId: row.documentId,
    status: row.status as DocumentReviewStatusValue,
    submittedVersionId: row.submittedVersionId,
    submittedById: row.submittedById,
    submittedAt: row.submittedAt?.toISOString() ?? null,
    decidedById: row.decidedById,
    conclusion: row.conclusion,
    decidedAt: row.decidedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString()
  };
}
