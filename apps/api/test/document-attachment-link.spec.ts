/**
 * @file Document attachment link regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentTargetType } from "@poco-scrum/domain";
import { AttachmentsService } from "../src/modules/attachments/attachments.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { DocumentLinksService } from "../src/modules/documents/document-links.service";

describe("Document attachment links", () => {
  it("links one document to Story and Sprint targets", async () => {
    const documentsService = new DocumentsService();
    const documentLinksService = new DocumentLinksService(documentsService);
    const document = await documentsService.createDocument({
      title: "Acceptance Evidence",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "user-1",
      structuredFields: {
        outcome: "accepted"
      },
      markdown: "Acceptance evidence is attached."
    });

    await documentLinksService.linkDocumentToTarget({
      documentId: document.id,
      targetType: DocumentTargetType.SPRINT,
      targetId: "sprint-1",
      actorId: "user-1"
    });

    const storyLinks = await documentLinksService.listDocumentLinks({
      targetType: DocumentTargetType.STORY,
      targetId: "story-1"
    });
    const sprintLinks = await documentLinksService.listDocumentLinks({
      targetType: DocumentTargetType.SPRINT,
      targetId: "sprint-1"
    });

    assert.equal(storyLinks.length, 1);
    assert.equal(sprintLinks.length, 1);
    assert.equal(storyLinks[0]?.documentId, document.id);
    assert.equal(sprintLinks[0]?.documentId, document.id);
  });

  it("attaches metadata to a document and filters previewable files", async () => {
    const attachmentsService = new AttachmentsService();

    const image = await attachmentsService.attachToDocument({
      documentId: "document-1",
      actorId: "user-1",
      fileName: "acceptance.png",
      mimeType: "image/png",
      sizeBytes: 2048,
      url: "/files/acceptance.png"
    });
    const archive = await attachmentsService.attachToDocument({
      documentId: "document-1",
      actorId: "user-1",
      fileName: "raw.zip",
      mimeType: "application/zip",
      sizeBytes: 4096,
      url: "/files/raw.zip"
    });
    const attachments = await attachmentsService.listByDocument("document-1");

    assert.equal(image.previewKind, "image");
    assert.equal(archive.previewKind, "download");
    assert.deepEqual(
      attachments.map((attachment) => attachment.fileName),
      ["acceptance.png", "raw.zip"]
    );
  });
});
