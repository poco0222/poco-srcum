/**
 * @file Search filters regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DocumentReviewStatus,
  LinkageObjectType
} from "@poco-scrum/domain";
import { SearchFilters } from "./search-filters";

describe("SearchFilters", () => {
  it("renders keyword, object type, and review status filters with selected values", () => {
    const html = renderToStaticMarkup(
      createElement(SearchFilters, {
        keyword: "release evidence",
        objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        reviewStatus: DocumentReviewStatus.IN_REVIEW
      })
    );

    assert.match(html, /method="get"/);
    assert.match(html, /name="keyword"/);
    assert.match(html, /value="release evidence"/);
    assert.match(html, /REQUIREMENT_DOCUMENT/);
    assert.match(html, /selected=""/);
    assert.match(html, /in-review/);
  });
});
