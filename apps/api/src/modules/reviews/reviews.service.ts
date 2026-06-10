/**
 * @file Document review service for Phase 2 formal review workflows.
 * @author PopoY
 * @created 2026-06-10
 */
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

/**
 * Keeps one current review record per document for the P2 minimum workflow.
 */
export class InMemoryDocumentReviewsRepository {
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

/**
 * Coordinates the minimum formal document review lifecycle for Phase 2.
 */
export class ReviewsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly repository: InMemoryDocumentReviewsRepository = new InMemoryDocumentReviewsRepository(),
    private readonly latestVersionResolver: LatestDocumentVersionResolver = async (
      documentId
    ) => {
      const document = await this.documentsService.getDocumentById(documentId);

      return document.updatedAt;
    },
    private nextSequence = 1
  ) {}

  /**
   * @param input The command that submits a document version for review.
   * @returns The current review record after submission.
   */
  async submitReview(input: SubmitDocumentReviewInput) {
    const payload = SubmitDocumentReviewInputSchema.parse(input);

    await this.documentsService.getDocumentById(payload.documentId);

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
      id: `review-${this.nextSequence++}`,
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
