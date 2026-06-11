/**
 * @file Roadmap timeline regression tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  RoadmapMilestoneKind,
  RoadmapMilestoneStatus
} from "@poco-scrum/domain";
import { RoadmapTimeline } from "./roadmap-timeline";

describe("RoadmapTimeline", () => {
  it("renders roadmap milestones without drag scheduling controls", () => {
    const html = renderToStaticMarkup(
      createElement(RoadmapTimeline, {
        milestones: [
          {
            id: "milestone-sprint-1",
            projectId: "project-1",
            title: "Portfolio Sprint",
            kind: RoadmapMilestoneKind.SPRINT,
            status: RoadmapMilestoneStatus.ACTIVE,
            startsAt: "2026-06-01T00:00:00.000Z",
            endsAt: "2026-06-14T00:00:00.000Z",
            sourceType: "SPRINT",
            sourceId: "sprint-1"
          }
        ]
      })
    );

    assert.match(html, /Portfolio Sprint/);
    assert.match(html, /ACTIVE/);
    assert.match(html, /project-1/);
    assert.doesNotMatch(html, /drag/i);
  });

  it("renders an empty roadmap state", () => {
    const html = renderToStaticMarkup(
      createElement(RoadmapTimeline, {
        milestones: []
      })
    );

    assert.match(html, /No roadmap milestones match the current filters/);
  });
});
