/**
 * @file Portfolio filters regression tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProjectStatus } from "@poco-scrum/domain";
import { PortfolioFilters } from "./portfolio-filters";

describe("PortfolioFilters", () => {
  it("renders URL-driven portfolio, project, status, and milestone filters", () => {
    const html = renderToStaticMarkup(
      createElement(PortfolioFilters, {
        filters: {
          portfolioId: "portfolio-alpha",
          projectId: "project-1",
          projectStatus: ProjectStatus.ACTIVE,
          milestoneFrom: "2026-06-01",
          milestoneTo: "2026-06-30"
        }
      })
    );

    assert.match(html, /method="get"/);
    assert.match(html, /name="portfolioId"/);
    assert.match(html, /value="portfolio-alpha"/);
    assert.match(html, /name="projectStatus"/);
    assert.match(html, /ACTIVE/);
    assert.match(html, /selected=""/);
    assert.match(html, /name="milestoneFrom"/);
    assert.match(html, /value="2026-06-01"/);
  });
});
