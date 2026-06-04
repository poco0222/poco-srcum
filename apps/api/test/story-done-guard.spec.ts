/**
 * @file Story done guard integration tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  AcceptanceStatus,
  type AcceptanceStatusValue,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { StoryDoneGuard } from "../src/modules/work-items/guards/story-done.guard";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

describe("WorkItemsService Story done guard", () => {
  it("rejects completing a Story when acceptance is still pending", async () => {
    const service = createWorkItemsService(AcceptanceStatus.PENDING);

    await assert.rejects(
      () =>
        service.completeStory({
          workItemId: "story-1",
          actorId: "user-1"
        }),
      {
        message: "STORY_ACCEPTANCE_NOT_APPROVED"
      }
    );
  });

  it("moves an approved Story to done", async () => {
    const service = createWorkItemsService(AcceptanceStatus.APPROVED);

    const completed = await service.completeStory({
      workItemId: "story-1",
      actorId: "user-1"
    });

    assert.equal(completed.status, WorkItemStatus.DONE);
  });
});

/**
 * @param acceptanceStatus The synthetic current acceptance status for the tested Story.
 * @returns A work item service wired with the Story done guard.
 */
function createWorkItemsService(acceptanceStatus: AcceptanceStatusValue) {
  const repository = new InMemoryWorkItemsRepository([
    {
      id: "story-1",
      type: WorkItemType.STORY,
      title: "Story requires formal acceptance before done",
      status: WorkItemStatus.IN_REVIEW,
      priority: WorkItemPriority.HIGH,
      storyPoints: 5,
      acceptanceCriteria: ["Reviewer approves the accepted behavior."],
      projectId: "project-1",
      sprintId: "sprint-1",
      parentId: null,
      assigneeId: "user-1",
      sortOrder: 100,
      description: null
    }
  ]);
  const guard = new StoryDoneGuard({
    getCurrentStatus: async () => acceptanceStatus
  });

  return new WorkItemsService(repository, 1, guard);
}
