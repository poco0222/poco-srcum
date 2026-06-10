/**
 * @file Dashboard API client regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildDocumentDashboardPath } from "./dashboard-client";

describe("dashboard client helpers", () => {
  it("builds the fixed document collaboration dashboard API path", () => {
    assert.equal(buildDocumentDashboardPath(), "/dashboard/documents");
  });
});
