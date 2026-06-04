/**
 * @file Story ready gate regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { WorkItemPriority, WorkItemStatus, WorkItemType } from "@poco-scrum/domain";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { assertStoryReadyForSprint } from "../src/modules/work-items/validators/story-ready.validator";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

describe("assertStoryReadyForSprint", () => {
  it("rejects a story that has no acceptance criteria", () => {
    assert.throws(
      () =>
        assertStoryReadyForSprint({
          id: "story-1",
          type: WorkItemType.STORY,
          title: "Prepare backlog fields",
          status: WorkItemStatus.BACKLOG,
          priority: WorkItemPriority.HIGH,
          storyPoints: 3,
          acceptanceCriteria: [],
          projectId: "project-1",
          sprintId: null,
          parentId: null,
          assigneeId: null,
          sortOrder: 100,
          description: "Story must fail until acceptance criteria are recorded."
        }),
      {
        message: "WORK_ITEM_NOT_READY_FOR_SPRINT"
      }
    );
  });

  it("accepts a story that satisfies the minimum ready gate", () => {
    assert.doesNotThrow(() => {
      assertStoryReadyForSprint({
        id: "story-2",
        type: WorkItemType.STORY,
        title: "Review backlog ordering",
        status: WorkItemStatus.READY_FOR_SPRINT,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 5,
        acceptanceCriteria: [
          "Backlog order can be updated from the product backlog page."
        ],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 200,
        description: "The ready gate should accept a complete story payload."
      });
    });
  });

  it("rejects sprint commitment when the story is still not ready", async () => {
    const repository = new InMemoryWorkItemsRepository([
      {
        id: "story-3",
        type: WorkItemType.STORY,
        title: "Incomplete ready story",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.HIGH,
        storyPoints: 3,
        acceptanceCriteria: [],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: null,
        sortOrder: 100,
        description: null
      }
    ]);
    const service = new WorkItemsService(repository);

    await assert.rejects(
      () =>
        service.addStoryToSprint({
          workItemId: "story-3",
          sprintId: "sprint-1"
        }),
      {
        message: "WORK_ITEM_NOT_READY_FOR_SPRINT"
      }
    );
  });

  it("commits a ready story into the sprint and updates its status", async () => {
    const repository = new InMemoryWorkItemsRepository([
      {
        id: "story-4",
        type: WorkItemType.STORY,
        title: "Ready for sprint commitment",
        status: WorkItemStatus.READY_FOR_SPRINT,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 5,
        acceptanceCriteria: ["Story satisfies the planning entry criteria."],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 200,
        description: null
      }
    ]);
    const service = new WorkItemsService(repository);

    const committedStory = await service.addStoryToSprint({
      workItemId: "story-4",
      sprintId: "sprint-1"
    });

    assert.equal(committedStory.sprintId, "sprint-1");
    assert.equal(committedStory.status, WorkItemStatus.COMMITTED_TO_SPRINT);
  });
});
