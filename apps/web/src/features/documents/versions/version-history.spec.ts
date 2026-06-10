/**
 * @file Document version history regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { VersionHistoryList } from "./version-history";

describe("VersionHistoryList", () => {
  it("renders version number, summary, timestamp, and actor", () => {
    const html = renderToStaticMarkup(
      createElement(VersionHistoryList, {
        versions: [
          {
            id: "version-1",
            documentId: "document-1",
            versionNumber: 1,
            snapshot: {
              id: "document-1",
              title: "Requirement Draft",
              documentType: "REQUIREMENT",
              templateId: "default-requirement",
              targetType: "STORY",
              targetId: "story-1",
              authorId: "author-1",
              updatedById: "author-1",
              structuredFields: {},
              markdown: "## Background",
              createdAt: "2026-06-10T12:00:00.000Z",
              updatedAt: "2026-06-10T12:00:00.000Z"
            },
            changeSummary: "Initial formal draft",
            createdById: "author-1",
            createdAt: "2026-06-10T12:00:00.000Z"
          }
        ]
      })
    );

    assert.match(html, /Version history/);
    assert.match(html, /Version 1/);
    assert.match(html, /Initial formal draft/);
    assert.match(html, /author-1/);
    assert.match(html, /2026-06-10T12:00:00.000Z/);
  });
});
