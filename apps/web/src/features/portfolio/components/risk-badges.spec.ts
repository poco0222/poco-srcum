/**
 * @file Portfolio signal badge regression tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { RiskBadges } from "./risk-badges";

describe("RiskBadges", () => {
  it("renders risk, dependency, and delay labels from the provided Task2 signal snapshot", () => {
    const html = renderToStaticMarkup(
      createElement(RiskBadges, {
        signals: {
          risk: {
            severity: "HIGH",
            label: "Release risk",
            count: 2,
            sourceIds: ["risk-1", "risk-2"]
          },
          dependency: {
            severity: "MEDIUM",
            label: "Dependency watch",
            count: 1,
            sourceIds: ["dependency-1"]
          },
          delay: {
            severity: "NONE",
            label: "No delay signal",
            count: 0,
            sourceIds: []
          },
          source: "task-02-reporting-and-risk-tracking.md",
          updatedAt: "2026-06-11T14:30:00.000Z"
        }
      })
    );

    assert.match(html, /Release risk/);
    assert.match(html, /2/);
    assert.match(html, /Dependency watch/);
    assert.match(html, /No delay signal/);
    assert.match(html, /task-02-reporting-and-risk-tracking/);
  });
});
