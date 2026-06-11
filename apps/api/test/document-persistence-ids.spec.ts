/**
 * @file Regression tests for restart-safe Phase 2 document collaboration ids.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import {
  CommentsService,
  InMemoryDocumentCommentsRepository
} from "../src/modules/comments/comments.service";
import {
  DocumentVersionsService,
  InMemoryDocumentVersionsRepository
} from "../src/modules/document-versions/document-versions.service";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import {
  InMemoryDocumentsRepository
} from "../src/modules/documents/documents.repository";
import { DocumentsService } from "../src/modules/documents/documents.service";
import {
  InMemoryDocumentReviewsRepository,
  ReviewsService
} from "../src/modules/reviews/reviews.service";

/**
 * @param repository The shared repository that survives service reconstruction.
 * @returns A document service wired to the shared repository.
 */
function createDocumentsService(repository = new InMemoryDocumentsRepository()) {
  return new DocumentsService(
    repository,
    1,
    undefined,
    undefined,
    new DocumentTemplatesService()
  );
}

/**
 * @param title The formal document title for the test record.
 * @param documentsService The document service used to persist the record.
 * @returns A persisted formal document.
 */
async function createFormalRequirement(
  title: string,
  documentsService: DocumentsService
) {
  return documentsService.createFormalDocument({
    title,
    documentType: DocumentType.REQUIREMENT,
    templateId: "default-requirement",
    targetType: DocumentTargetType.STORY,
    targetId: `story-${title.toLowerCase().replaceAll(" ", "-")}`,
    authorId: "author-1",
    structuredFields: {
      businessGoal: "Keep persisted records addressable after restarts",
      requester: "PopoY",
      priority: "HIGH"
    },
    markdown: "## Background\n\nRestart-safe persistence ids."
  });
}

describe("Phase 2 document collaboration persistence ids", () => {
  it("keeps document ids unique after document service reconstruction", async () => {
    const repository = new InMemoryDocumentsRepository();
    const firstService = createDocumentsService(repository);
    const firstDocument = await createFormalRequirement("First", firstService);
    const secondService = createDocumentsService(repository);
    const secondDocument = await createFormalRequirement("Second", secondService);
    const documents = await secondService.listAllDocuments();

    assert.notEqual(firstDocument.id, secondDocument.id);
    assert.equal(documents.length, 2);
  });

  it("keeps comment ids unique after comment service reconstruction", async () => {
    const documentsService = createDocumentsService();
    const document = await createFormalRequirement("Comments", documentsService);
    const repository = new InMemoryDocumentCommentsRepository();
    const firstService = new CommentsService(
      documentsService,
      undefined,
      repository
    );
    const firstComment = await firstService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.DOCUMENT,
      anchorRef: document.id,
      body: "First persisted comment"
    });
    const secondService = new CommentsService(
      documentsService,
      undefined,
      repository
    );
    const secondComment = await secondService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.DOCUMENT,
      anchorRef: document.id,
      body: "Second persisted comment"
    });
    const comments = await secondService.listCommentsForDocument(document.id);

    assert.notEqual(firstComment.id, secondComment.id);
    assert.equal(comments.length, 2);
  });

  it("keeps version ids unique after version service reconstruction", async () => {
    const documentsService = createDocumentsService();
    const document = await createFormalRequirement("Versions", documentsService);
    const repository = new InMemoryDocumentVersionsRepository();
    const firstService = new DocumentVersionsService(
      documentsService,
      repository
    );
    const firstVersion = await firstService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial snapshot"
    });
    const secondService = new DocumentVersionsService(
      documentsService,
      repository
    );
    const secondVersion = await secondService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Restart snapshot"
    });
    const versions = await secondService.listVersionsForDocument(document.id);

    assert.notEqual(firstVersion.id, secondVersion.id);
    assert.deepEqual(
      versions.map((version) => version.versionNumber),
      [1, 2]
    );
  });

  it("keeps review ids unique after review service reconstruction", async () => {
    const documentsService = createDocumentsService();
    const firstDocument = await createFormalRequirement("Review One", documentsService);
    const secondDocument = await createFormalRequirement("Review Two", documentsService);
    const versionsService = new DocumentVersionsService(documentsService);
    const firstVersion = await versionsService.createVersionSnapshot({
      documentId: firstDocument.id,
      actorId: "author-1",
      changeSummary: "First review snapshot"
    });
    const secondVersion = await versionsService.createVersionSnapshot({
      documentId: secondDocument.id,
      actorId: "author-1",
      changeSummary: "Second review snapshot"
    });
    const repository = new InMemoryDocumentReviewsRepository();
    const firstService = new ReviewsService(
      documentsService,
      repository,
      (documentId) => versionsService.getLatestVersionId(documentId),
      (versionId) => versionsService.getVersionById(versionId)
    );
    const firstReview = await firstService.submitReview({
      documentId: firstDocument.id,
      actorId: "author-1",
      versionId: firstVersion.id
    });
    const secondService = new ReviewsService(
      documentsService,
      repository,
      (documentId) => versionsService.getLatestVersionId(documentId),
      (versionId) => versionsService.getVersionById(versionId)
    );
    const secondReview = await secondService.submitReview({
      documentId: secondDocument.id,
      actorId: "author-1",
      versionId: secondVersion.id
    });

    assert.notEqual(firstReview.id, secondReview.id);
  });
});
