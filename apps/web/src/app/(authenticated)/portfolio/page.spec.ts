/**
 * @file Portfolio route query parsing tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ProjectStatus } from "@poco-scrum/domain";
import { buildPortfolioFilters, firstQueryValue } from "./page";

describe("Portfolio route query parsing", () => {
  it("normalizes URL-driven filters before loading the Portfolio overview", () => {
    const filters = buildPortfolioFilters({
      portfolioId: " portfolio-alpha ",
      projectId: [" project-1 ", "project-ignored"],
      projectStatus: ProjectStatus.ACTIVE,
      milestoneFrom: " 2026-06-01 ",
      milestoneTo: " "
    });

    assert.deepEqual(filters, {
      portfolioId: "portfolio-alpha",
      projectId: "project-1",
      projectStatus: ProjectStatus.ACTIVE,
      milestoneFrom: "2026-06-01"
    });
  });

  it("uses the first array value when Next.js provides repeated query keys", () => {
    assert.equal(firstQueryValue(["alpha", "beta"]), "alpha");
    assert.equal(firstQueryValue([]), "");
  });
});
