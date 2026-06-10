/**
 * @file Document review panel regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { DocumentReviewStatus } from "@poco-scrum/domain";
import { DocumentReviewPanel } from "./review-panel";

describe("DocumentReviewPanel", () => {
  it("disables approval actions when the submitted version is not latest", () => {
    const html = renderToStaticMarkup(
      createElement(DocumentReviewPanel, {
        review: {
          id: "review-1",
          documentId: "document-1",
          status: DocumentReviewStatus.IN_REVIEW,
          submittedVersionId: "version-1",
          submittedById: "author-1",
          submittedAt: "2026-06-10T12:00:00.000Z",
          decidedById: null,
          conclusion: null,
          decidedAt: null,
          updatedAt: "2026-06-10T12:00:00.000Z"
        },
        latestVersionId: "version-2"
      })
    );

    assert.match(html, /Review status/);
    assert.match(html, /in-review/);
    assert.match(html, /Submitted version: version-1/);
    assert.match(html, /Latest version: version-2/);
    assert.match(html, /Approve latest version only/);
    assert.match(html, /disabled=""/);
  });
});
