/**
 * @file Story acceptance state machine API regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AcceptanceStatus, WorkItemPriority, WorkItemStatus, WorkItemType } from "@poco-scrum/domain";
import { StoryDoneGuard } from "../src/modules/work-items/guards/story-done.guard";

describe("Story acceptance state machine guard", () => {
  it("rejects story completion before formal acceptance approval", () => {
    const guard = new StoryDoneGuard({
      getCurrentStatus: async () => AcceptanceStatus.PENDING
    });

    assert.rejects(
      () =>
        guard.assertCanCompleteStory({
          id: "story-1",
          type: WorkItemType.STORY,
          title: "Acceptance gated story",
          status: WorkItemStatus.IN_REVIEW,
          priority: WorkItemPriority.HIGH,
          storyPoints: 5,
          acceptanceCriteria: ["Reviewer formally approves the story."],
          projectId: "project-1",
          sprintId: "sprint-1",
          parentId: null,
          assigneeId: "user-1",
          sortOrder: 100,
          description: "Story cannot be completed without formal approval."
        }),
      {
        message: "STORY_ACCEPTANCE_NOT_APPROVED"
      }
    );
  });

  it("accepts story completion after formal acceptance approval", async () => {
    const guard = new StoryDoneGuard({
      getCurrentStatus: async () => AcceptanceStatus.APPROVED
    });

    await assert.doesNotReject(() =>
      guard.assertCanCompleteStory({
        id: "story-2",
        type: WorkItemType.STORY,
        title: "Approved story",
        status: WorkItemStatus.IN_REVIEW,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 3,
        acceptanceCriteria: ["Acceptance approval is recorded before done."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-2",
        sortOrder: 200,
        description: null
      })
    );
  });
});
