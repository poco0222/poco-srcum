/**
 * @file Search API client regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentReviewStatus,
  LinkageObjectType
} from "@poco-scrum/domain";
import { buildSearchQueryPath } from "./search-client";

describe("search client helpers", () => {
  it("builds a stable search query path from keyword and filters", () => {
    const path = buildSearchQueryPath({
      keyword: " release evidence ",
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      reviewStatus: DocumentReviewStatus.IN_REVIEW
    });

    assert.equal(
      path,
      "/search?keyword=release+evidence&objectType=REQUIREMENT_DOCUMENT&reviewStatus=in-review"
    );
  });
});
