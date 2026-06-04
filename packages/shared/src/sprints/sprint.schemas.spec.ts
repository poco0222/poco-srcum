/**
 * @file Shared Sprint DTO and schema regression test for the Phase 1 sprint planning baseline.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { SprintStatus } from "@poco-scrum/domain";
import {
  CreateSprintInputSchema,
  UpdateSprintPlanningInputSchema
} from "../index";

describe("shared sprint DTO schemas", () => {
  it("parses a sprint creation payload and normalizes optional planning fields", () => {
    const parsed = CreateSprintInputSchema.parse({
      projectId: " project-1 ",
      name: "  Sprint 24  ",
      status: SprintStatus.DRAFT,
      goal: "  Stabilize sprint execution flow  ",
      planningNote: "  Team commits only ready stories.  ",
      startsAt: "2026-06-09T09:00:00.000Z",
      endsAt: "2026-06-20T09:00:00.000Z"
    });

    assert.equal(parsed.projectId, "project-1");
    assert.equal(parsed.name, "Sprint 24");
    assert.equal(parsed.status, SprintStatus.DRAFT);
    assert.equal(parsed.goal, "Stabilize sprint execution flow");
    assert.equal(parsed.planningNote, "Team commits only ready stories.");
    assert.equal(parsed.startsAt, "2026-06-09T09:00:00.000Z");
    assert.equal(parsed.endsAt, "2026-06-20T09:00:00.000Z");
  });

  it("parses a sprint planning payload and de-duplicates commitment ids", () => {
    const parsed = UpdateSprintPlanningInputSchema.parse({
      sprintId: " sprint-1 ",
      goal: "  Deliver the board MVP  ",
      commitmentWorkItemIds: [" story-1 ", "story-2", "story-1"],
      planningNote: "  Start with two ready stories.  ",
      planningSnapshot: {
        goal: "  Deliver the board MVP  ",
        commitmentWorkItemIds: [" story-1 ", "story-2", "story-1"],
        planningNote: "  Start with two ready stories.  ",
        capturedAt: "2026-06-04T08:30:00.000Z"
      }
    });

    assert.equal(parsed.sprintId, "sprint-1");
    assert.equal(parsed.goal, "Deliver the board MVP");
    assert.deepEqual(parsed.commitmentWorkItemIds, ["story-1", "story-2"]);
    assert.equal(parsed.planningNote, "Start with two ready stories.");
    assert.deepEqual(parsed.planningSnapshot, {
      goal: "Deliver the board MVP",
      commitmentWorkItemIds: ["story-1", "story-2"],
      planningNote: "Start with two ready stories.",
      capturedAt: "2026-06-04T08:30:00.000Z"
    });
  });

  it("rejects a planning payload with no commitment work items", () => {
    assert.throws(
      () =>
        UpdateSprintPlanningInputSchema.parse({
          sprintId: "sprint-1",
          goal: "Deliver board MVP",
          commitmentWorkItemIds: [],
          planningNote: null
        }),
      {
        message: "SPRINT_PLANNING_INPUT_INVALID"
      }
    );
  });
});
