/**
 * @file Dashboard list card regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  LinkageObjectType,
  LinkageRelationType
} from "@poco-scrum/domain";
import { DashboardListCard } from "./dashboard-list-card";

describe("DashboardListCard", () => {
  it("renders incomplete link items with missing relation labels", () => {
    const html = renderToStaticMarkup(
      createElement(DashboardListCard, {
        title: "Incomplete links",
        emptyText: "No incomplete links.",
        items: [
          {
            objectType: LinkageObjectType.DESIGN_DOCUMENT,
            objectId: "document-2",
            title: "Dashboard Design",
            missingRelation: LinkageRelationType.DESIGN_TO_STORY,
            updatedAt: "2026-06-10T12:00:00.000Z"
          }
        ]
      })
    );

    assert.match(html, /Incomplete links/);
    assert.match(html, /Dashboard Design/);
    assert.match(html, /design-to-story/);
    assert.match(html, /href="\/documents\/document-2\/review"/);
  });
});
