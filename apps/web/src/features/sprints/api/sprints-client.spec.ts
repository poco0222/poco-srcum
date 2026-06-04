/**
 * @file Sprint API client regression test for the Phase 1 board shell.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
  type WorkItemRecord
} from "@poco-scrum/domain";
import { buildSprintBoardFromItems } from "./sprints-client";

describe("sprints client helpers", () => {
  it("groups sprint-scoped items into todo, in-progress, and done lanes", () => {
    const items: WorkItemRecord[] = [
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Todo item",
        status: WorkItemStatus.COMMITTED_TO_SPRINT,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["The todo lane is visible."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 100,
        description: null
      },
      {
        id: "story-2",
        type: WorkItemType.STORY,
        title: "In progress item",
        status: WorkItemStatus.IN_PROGRESS,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 3,
        acceptanceCriteria: ["The in-progress lane is visible."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-2",
        sortOrder: 200,
        description: null
      },
      {
        id: "story-3",
        type: WorkItemType.STORY,
        title: "Done item",
        status: WorkItemStatus.DONE,
        priority: WorkItemPriority.LOW,
        storyPoints: 2,
        acceptanceCriteria: ["The done lane is visible."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-3",
        sortOrder: 300,
        description: null
      }
    ];

    const board = buildSprintBoardFromItems(items);

    assert.equal(board.todo[0]?.id, "story-1");
    assert.equal(board.inProgress[0]?.id, "story-2");
    assert.equal(board.done[0]?.id, "story-3");
  });
});
