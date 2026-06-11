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
import { DocumentVersionsService } from "../src/modules/document-versions/document-versions.service";
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
    const versionsService = new DocumentVersionsService(documentsService);
    const firstVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial review draft"
    });

    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "author-1",
      markdown: "## Background\n\nFormal review flow payload with updates."
    });

    const secondVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Updated review draft"
    });
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      (documentId) => versionsService.getLatestVersionId(documentId),
      (versionId) => versionsService.getVersionById(versionId)
    );

    const submitted = await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: secondVersion.id
    });
    const rejected = await reviewsService.rejectReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: secondVersion.id,
      conclusion: "Needs clearer acceptance criteria"
    });
    const draft = await reviewsService.returnToDraft({
      documentId: document.id,
      actorId: "author-1",
      reason: "Update after review feedback"
    });
    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: secondVersion.id
    });
    const approved = await reviewsService.approveReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: secondVersion.id,
      conclusion: "Review approved"
    });

    assert.equal(firstVersion.versionNumber, 1);
    assert.equal(submitted.status, DocumentReviewStatus.IN_REVIEW);
    assert.equal(rejected.status, DocumentReviewStatus.REJECTED);
    assert.equal(rejected.conclusion, "Needs clearer acceptance criteria");
    assert.equal(draft.status, DocumentReviewStatus.DRAFT);
    assert.equal(approved.status, DocumentReviewStatus.APPROVED);
    assert.equal(approved.submittedVersionId, secondVersion.id);
    assert.equal(approved.decidedById, "reviewer-1");
    assert.equal(approved.conclusion, "Review approved");
  });

  it("rejects approving a submitted version that is no longer latest", async () => {
    const { document, documentsService } = await createFormalDocument();
    const versionsService = new DocumentVersionsService(documentsService);
    const firstVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial review draft"
    });

    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "author-1",
      markdown: "## Background\n\nUpdated formal review payload."
    });

    await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Latest review draft"
    });
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      (documentId) => versionsService.getLatestVersionId(documentId),
      (versionId) => versionsService.getVersionById(versionId)
    );

    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: firstVersion.id
    });

    await assert.rejects(
      () =>
        reviewsService.approveReview({
          documentId: document.id,
          actorId: "reviewer-1",
          versionId: firstVersion.id,
          conclusion: "Old version cannot be approved"
        }),
      {
        message: "DOCUMENT_REVIEW_VERSION_NOT_LATEST"
      }
    );
  });

  it("rejects submitting a review for a missing document version", async () => {
    const { document, documentsService } = await createFormalDocument();
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      async () => "missing-version",
      async () => null
    );

    await assert.rejects(
      () =>
        reviewsService.submitReview({
          documentId: document.id,
          actorId: "author-1",
          versionId: "missing-version"
        }),
      {
        message: "DOCUMENT_REVIEW_VERSION_NOT_FOUND"
      }
    );
  });

  it("rejects submitting a review for a version owned by another document", async () => {
    const { document, documentsService } = await createFormalDocument();
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      async () => "foreign-version",
      async () => ({
        id: "foreign-version",
        documentId: "another-document"
      })
    );

    await assert.rejects(
      () =>
        reviewsService.submitReview({
          documentId: document.id,
          actorId: "author-1",
          versionId: "foreign-version"
        }),
      {
        message: "DOCUMENT_REVIEW_VERSION_DOCUMENT_MISMATCH"
      }
    );
  });
});
