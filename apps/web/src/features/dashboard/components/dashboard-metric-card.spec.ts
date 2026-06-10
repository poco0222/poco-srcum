/**
 * @file Dashboard metric card regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { DashboardMetricCard } from "./dashboard-metric-card";

describe("DashboardMetricCard", () => {
  it("renders a fixed metric card with a search target", () => {
    const html = renderToStaticMarkup(
      createElement(DashboardMetricCard, {
        title: "Pending review",
        value: 3,
        description: "Documents currently in review.",
        href: "/search?reviewStatus=in-review"
      })
    );

    assert.match(html, /Pending review/);
    assert.match(html, />3</);
    assert.match(html, /Documents currently in review/);
    assert.match(html, /href="\/search\?reviewStatus=in-review"/);
  });
});
