/**
 * @file Formal document form helper regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { buildCreateFormalDocumentInput } from "./document-form.utils";

describe("formal document form helpers", () => {
  it("builds a validated formal document payload from native form data", () => {
    const formData = new FormData();

    formData.set("title", " Requirement Draft ");
    formData.set("documentType", DocumentType.REQUIREMENT);
    formData.set("templateId", " default-requirement ");
    formData.set("targetType", DocumentTargetType.STORY);
    formData.set("targetId", " story-1 ");
    formData.set("authorId", " author-1 ");
    formData.set("field:businessGoal", " Reduce release risk ");
    formData.set("field:requester", " PopoY ");
    formData.set("field:priority", " HIGH ");
    formData.set("markdown", "## Background\n\nFormal document payload.");

    assert.deepEqual(buildCreateFormalDocumentInput(formData), {
      title: "Requirement Draft",
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
      markdown: "## Background\n\nFormal document payload."
    });
  });
});
