/**
 * @file Search contract regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  LinkageObjectType,
  DocumentReviewStatus
} from "@poco-scrum/domain";
import {
  SearchQueryInputSchema,
  SearchResultCardSchema,
  SearchScopeField
} from "@poco-scrum/shared";

describe("search contract", () => {
  it("freezes the Phase 2 search scope without attachment full text", () => {
    assert.deepEqual(SearchScopeField, {
      TITLE: "title",
      NUMBER: "number",
      TAG: "tag",
      STRUCTURED_FIELD: "structured-field",
      MARKDOWN_BODY: "markdown-body"
    });
    assert.equal(
      Object.values(SearchScopeField).includes("attachment-full-text"),
      false
    );
  });

  it("parses search query filters for keyword, object type, and review status", () => {
    const query = SearchQueryInputSchema.parse({
      keyword: "  release evidence  ",
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      reviewStatus: DocumentReviewStatus.IN_REVIEW
    });

    assert.deepEqual(query, {
      keyword: "release evidence",
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      reviewStatus: DocumentReviewStatus.IN_REVIEW
    });
  });

  it("validates the stable search result card structure", () => {
    const card = SearchResultCardSchema.parse({
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      objectId: "document-1",
      title: "Requirement: Release Evidence",
      snippet: "Evidence chain references the release checklist.",
      relationSummary: ["requirement-to-design: document-design-1"],
      reviewStatus: DocumentReviewStatus.IN_REVIEW,
      updatedAt: "2026-06-10T12:00:00.000Z"
    });

    assert.equal(card.objectType, LinkageObjectType.REQUIREMENT_DOCUMENT);
    assert.equal(card.objectId, "document-1");
    assert.equal(card.title, "Requirement: Release Evidence");
    assert.equal(card.snippet, "Evidence chain references the release checklist.");
    assert.deepEqual(card.relationSummary, [
      "requirement-to-design: document-design-1"
    ]);
    assert.equal(card.reviewStatus, DocumentReviewStatus.IN_REVIEW);
    assert.equal(card.updatedAt, "2026-06-10T12:00:00.000Z");
  });
});
