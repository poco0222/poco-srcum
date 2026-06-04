/**
 * @file Formal document editor schema regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentTargetType, DocumentType } from "@poco-scrum/domain";
import { CreateFormalDocumentInputSchema } from "../index";

describe("formal document editor schema", () => {
  it("parses a template-backed document creation payload", () => {
    const parsed = CreateFormalDocumentInputSchema.parse({
      title: " Requirement Draft ",
      documentType: DocumentType.REQUIREMENT,
      templateId: " default-requirement ",
      targetType: DocumentTargetType.STORY,
      targetId: " story-1 ",
      authorId: " author-1 ",
      structuredFields: {
        businessGoal: "Reduce release risk",
        requester: "PopoY",
        priority: "HIGH",
        targetRelease: "2026-Q3"
      },
      markdown: "## Background\n\nRelease risk needs a shared document."
    });

    assert.deepEqual(parsed, {
      title: "Requirement Draft",
      documentType: DocumentType.REQUIREMENT,
      templateId: "default-requirement",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "author-1",
      structuredFields: {
        businessGoal: "Reduce release risk",
        requester: "PopoY",
        priority: "HIGH",
        targetRelease: "2026-Q3"
      },
      markdown: "## Background\n\nRelease risk needs a shared document."
    });
  });

  it("rejects payloads that omit required structured fields", () => {
    assert.throws(
      () =>
        CreateFormalDocumentInputSchema.parse({
          title: "Requirement Draft",
          documentType: DocumentType.REQUIREMENT,
          templateId: "default-requirement",
          targetType: DocumentTargetType.STORY,
          targetId: "story-1",
          authorId: "author-1",
          structuredFields: {
            businessGoal: "Reduce release risk",
            requester: "PopoY"
          },
          markdown: "## Background\n\nMissing priority should fail."
        }),
      {
        message: "FORMAL_DOCUMENT_FIELD_REQUIRED:priority"
      }
    );
  });
});
