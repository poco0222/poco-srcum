/**
 * @file Document review flow regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentReviewStatus,
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import {
  InMemoryDocumentReviewsRepository,
  ReviewsService
} from "../src/modules/reviews/reviews.service";

/**
 * @returns A formal requirement document and its service for review flow tests.
 */
async function createFormalDocument() {
  const documentsService = new DocumentsService(
    undefined,
    1,
    undefined,
    undefined,
    new DocumentTemplatesService()
  );
  const document = await documentsService.createFormalDocument({
    title: "Review Flow Draft",
    documentType: DocumentType.REQUIREMENT,
    templateId: "default-requirement",
    targetType: DocumentTargetType.STORY,
    targetId: "story-1",
    authorId: "author-1",
    structuredFields: {
      businessGoal: "Reduce release risk",
      requester: "PopoY",
      priority: "HIGH"
    },
    markdown: "## Background\n\nFormal review flow payload."
  });

  return {
    document,
    documentsService
  };
}

describe("Document review flow", () => {
  it("submits, rejects, returns to draft, and approves a latest document version", async () => {
    const { document, documentsService } = await createFormalDocument();
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      async () => "version-2"
    );

    const submitted = await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: "version-2"
    });
    const rejected = await reviewsService.rejectReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: "version-2",
      conclusion: "验收标准还需要补充。"
    });
    const draft = await reviewsService.returnToDraft({
      documentId: document.id,
      actorId: "author-1",
      reason: "根据评审意见补充验收标准。"
    });
    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: "version-2"
    });
    const approved = await reviewsService.approveReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: "version-2",
      conclusion: "评审通过。"
    });

    assert.equal(submitted.status, DocumentReviewStatus.IN_REVIEW);
    assert.equal(rejected.status, DocumentReviewStatus.REJECTED);
    assert.equal(rejected.conclusion, "验收标准还需要补充。");
    assert.equal(draft.status, DocumentReviewStatus.DRAFT);
    assert.equal(approved.status, DocumentReviewStatus.APPROVED);
    assert.equal(approved.submittedVersionId, "version-2");
    assert.equal(approved.decidedById, "reviewer-1");
    assert.equal(approved.conclusion, "评审通过。");
  });

  it("rejects approving a submitted version that is no longer latest", async () => {
    const { document, documentsService } = await createFormalDocument();
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      async () => "version-2"
    );

    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: "version-1"
    });

    await assert.rejects(
      () =>
        reviewsService.approveReview({
          documentId: document.id,
          actorId: "reviewer-1",
          versionId: "version-1",
          conclusion: "不能审批旧版本。"
        }),
      {
        message: "DOCUMENT_REVIEW_VERSION_NOT_LATEST"
      }
    );
  });
});
