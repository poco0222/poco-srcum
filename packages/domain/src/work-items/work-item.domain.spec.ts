/**
 * @file Shared work item domain contract regression test for the Phase 1 backlog model freeze step.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateStoryReadyState,
  WorkItemFieldMatrix,
  WorkItemFieldRequirement,
  WorkItemParentRules,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "../index";

describe("shared work item domain contract", () => {
  it("exports the frozen work item enums", () => {
    assert.deepEqual(WorkItemType, {
      EPIC: "EPIC",
      STORY: "STORY",
      TASK: "TASK",
      BUG: "BUG"
    });

    assert.deepEqual(WorkItemStatus, {
      BACKLOG: "BACKLOG",
      READY_FOR_SPRINT: "READY_FOR_SPRINT",
      COMMITTED_TO_SPRINT: "COMMITTED_TO_SPRINT",
      IN_PROGRESS: "IN_PROGRESS",
      IN_REVIEW: "IN_REVIEW",
      DONE: "DONE",
      CANCELLED: "CANCELLED"
    });

    assert.deepEqual(WorkItemPriority, {
      CRITICAL: "CRITICAL",
      HIGH: "HIGH",
      MEDIUM: "MEDIUM",
      LOW: "LOW"
    });
  });

  it("freezes the story and task field requirements for backlog planning", () => {
    assert.equal(
      WorkItemFieldMatrix.STORY.acceptanceCriteria,
      WorkItemFieldRequirement.REQUIRED
    );
    assert.equal(
      WorkItemFieldMatrix.STORY.storyPoints,
      WorkItemFieldRequirement.REQUIRED
    );
    assert.equal(
      WorkItemFieldMatrix.TASK.parentId,
      WorkItemFieldRequirement.REQUIRED
    );
    assert.equal(
      WorkItemFieldMatrix.EPIC.sprintId,
      WorkItemFieldRequirement.FORBIDDEN
    );
  });

  it("freezes the parent-child rules that later API validators must reuse", () => {
    assert.deepEqual(WorkItemParentRules.EPIC, {
      required: false,
      allowedParentTypes: []
    });
    assert.deepEqual(WorkItemParentRules.STORY, {
      required: false,
      allowedParentTypes: [WorkItemType.EPIC]
    });
    assert.deepEqual(WorkItemParentRules.TASK, {
      required: true,
      allowedParentTypes: [WorkItemType.STORY]
    });
    assert.deepEqual(WorkItemParentRules.BUG, {
      required: false,
      allowedParentTypes: [WorkItemType.STORY]
    });
  });

  it("evaluates story readiness with reusable failure reasons", () => {
    assert.deepEqual(
      evaluateStoryReadyState({
        id: "story-1",
        type: WorkItemType.STORY,
        title: "",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.HIGH,
        storyPoints: null,
        acceptanceCriteria: [],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: null,
        sortOrder: 100,
        description: null
      }),
      {
        isReady: false,
        reasons: [
          "WORK_ITEM_TITLE_REQUIRED",
          "WORK_ITEM_STORY_POINTS_REQUIRED",
          "WORK_ITEM_ACCEPTANCE_CRITERIA_REQUIRED"
        ]
      }
    );
  });
});
