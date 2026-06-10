/**
 * @file Search result card regression tests for Phase 2 Task 3.
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
import { SearchResultCard, buildSearchResultHref } from "./search-result-card";

describe("SearchResultCard", () => {
  it("renders document results with review-page navigation and relation summary", () => {
    const html = renderToStaticMarkup(
      createElement(SearchResultCard, {
        result: {
          objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
          objectId: "document-1",
          title: "Release Evidence Requirement",
          snippet: "The release checklist must stay searchable.",
          relationSummary: ["requirement-to-design: document-2"],
          reviewStatus: DocumentReviewStatus.IN_REVIEW,
          updatedAt: "2026-06-10T12:00:00.000Z"
        }
      })
    );

    assert.match(html, /Release Evidence Requirement/);
    assert.match(html, /The release checklist must stay searchable/);
    assert.match(html, /requirement-to-design: document-2/);
    assert.match(html, /in-review/);
    assert.match(html, /href="\/documents\/document-1\/review"/);
  });

  it("builds stable target hrefs for Story and Sprint objects", () => {
    assert.equal(
      buildSearchResultHref({
        objectType: LinkageObjectType.STORY,
        objectId: "story-1"
      }),
      "/backlog/story-1"
    );
    assert.equal(
      buildSearchResultHref({
        objectType: LinkageObjectType.SPRINT,
        objectId: "sprint-1"
      }),
      "/sprints/sprint-1"
    );
  });
});
