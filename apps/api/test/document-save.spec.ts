/**
 * @file Document save regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentTargetType } from "@poco-scrum/domain";
import {
  CreateDocumentInputSchema,
  UpdateDocumentInputSchema
} from "@poco-scrum/shared";
import { DocumentsService } from "../src/modules/documents/documents.service";

describe("Document save API contract", () => {
  it("normalizes structured fields, markdown, and target input", () => {
    const payload = CreateDocumentInputSchema.parse({
      title: " Acceptance Notes ",
      targetType: DocumentTargetType.STORY,
      targetId: " story-1 ",
      authorId: " user-1 ",
      structuredFields: {
        outcome: "accepted",
        reviewer: "PopoY"
      },
      markdown: "# Accepted\n\n- Criteria satisfied"
    });

    assert.deepEqual(payload, {
      title: "Acceptance Notes",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "user-1",
      structuredFields: {
        outcome: "accepted",
        reviewer: "PopoY"
      },
      markdown: "# Accepted\n\n- Criteria satisfied"
    });
  });

  it("creates, updates, and reads a Form plus Markdown document", async () => {
    const service = new DocumentsService();
    const created = await service.createDocument({
      title: "Retrospective Draft",
      targetType: DocumentTargetType.RETROSPECTIVE,
      targetId: "retro-1",
      authorId: "user-1",
      structuredFields: {
        sprintId: "sprint-1",
        sentiment: "focused"
      },
      markdown: "## What went well\n\n- Planning stayed focused."
    });

    const updated = await service.updateDocument({
      documentId: created.id,
      editorId: "user-2",
      title: "Retrospective Notes",
      structuredFields: {
        sprintId: "sprint-1",
        sentiment: "improved"
      },
      markdown: "## What went well\n\n- Acceptance checks were explicit."
    });
    const reloaded = await service.getDocumentById(created.id);

    assert.equal(updated.title, "Retrospective Notes");
    assert.deepEqual(reloaded.structuredFields, {
      sprintId: "sprint-1",
      sentiment: "improved"
    });
    assert.equal(
      reloaded.markdown,
      "## What went well\n\n- Acceptance checks were explicit."
    );
    assert.equal(reloaded.updatedById, "user-2");
  });

  it("rejects an empty markdown update", () => {
    assert.throws(
      () =>
        UpdateDocumentInputSchema.parse({
          documentId: "document-1",
          editorId: "user-1",
          markdown: " "
        }),
      {
        message: "DOCUMENT_UPDATE_INPUT_INVALID"
      }
    );
  });
});
