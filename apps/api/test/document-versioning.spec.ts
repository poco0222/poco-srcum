/**
 * @file Document versioning regression tests for Phase 2 Task 2.
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
 * @returns A formal requirement document and its service for versioning tests.
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
    title: "Versioned Requirement",
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
    markdown: "## Background\n\nInitial requirement."
  });

  return {
    document,
    documentsService
  };
}

describe("Document versioning", () => {
  it("creates full snapshots with sequential version numbers and change summaries", async () => {
    const { document, documentsService } = await createFormalDocument();
    const versionsService = new DocumentVersionsService(documentsService);
    const firstVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial formal draft"
    });

    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "author-1",
      markdown: "## Background\n\nUpdated requirement."
    });

    const secondVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Refined requirement background"
    });
    const versions = await versionsService.listVersionsForDocument(document.id);
    const reloadedFirst = await versionsService.getVersionById(firstVersion.id);

    assert.equal(firstVersion.versionNumber, 1);
    assert.equal(secondVersion.versionNumber, 2);
    assert.equal(secondVersion.changeSummary, "Refined requirement background");
    assert.deepEqual(
      versions.map((version) => version.id),
      [firstVersion.id, secondVersion.id]
    );
    assert.equal(reloadedFirst.snapshot.markdown, "## Background\n\nInitial requirement.");
    assert.equal(secondVersion.snapshot.markdown, "## Background\n\nUpdated requirement.");
  });

  it("binds review decisions to the latest document version", async () => {
    const { document, documentsService } = await createFormalDocument();
    const versionsService = new DocumentVersionsService(documentsService);
    const firstVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial formal draft"
    });

    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "author-1",
      markdown: "## Background\n\nUpdated requirement."
    });

    const secondVersion = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Updated formal draft"
    });
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      (documentId) => versionsService.getLatestVersionId(documentId)
    );

    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: secondVersion.id
    });
    const approved = await reviewsService.approveReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: secondVersion.id,
      conclusion: "评审通过。"
    });

    assert.equal(approved.status, DocumentReviewStatus.APPROVED);
    assert.equal(approved.submittedVersionId, secondVersion.id);

    const staleReviewService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      (documentId) => versionsService.getLatestVersionId(documentId)
    );

    await staleReviewService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: firstVersion.id
    });

    await assert.rejects(
      () =>
        staleReviewService.approveReview({
          documentId: document.id,
          actorId: "reviewer-1",
          versionId: firstVersion.id,
          conclusion: "旧版本不能通过。"
        }),
      {
        message: "DOCUMENT_REVIEW_VERSION_NOT_LATEST"
      }
    );
  });
});
