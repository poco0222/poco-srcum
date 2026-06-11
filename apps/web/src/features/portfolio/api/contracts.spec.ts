/**
 * @file Portfolio API contract regression tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  PortfolioViewContractFields,
  PortfolioViewContractSource
} from "./contracts";

describe("Portfolio view contract", () => {
  it("freezes project, roadmap, milestone, and signal consumer fields", () => {
    assert.deepEqual(PortfolioViewContractFields.project, [
      "id",
      "key",
      "name",
      "teamId",
      "status",
      "portfolioId",
      "portfolioName",
      "activeSprintCount",
      "doneWorkItemCount",
      "totalWorkItemCount"
    ]);
    assert.deepEqual(PortfolioViewContractFields.milestone, [
      "id",
      "projectId",
      "title",
      "kind",
      "status",
      "startsAt",
      "endsAt",
      "sourceType",
      "sourceId"
    ]);
    assert.deepEqual(PortfolioViewContractFields.signal, [
      "risk",
      "dependency",
      "delay",
      "source",
      "updatedAt"
    ]);
  });

  it("keeps risk, dependency, and delay signals sourced from Task2", () => {
    assert.equal(
      PortfolioViewContractSource.signals,
      "task-02-reporting-and-risk-tracking.md"
    );
  });
});
