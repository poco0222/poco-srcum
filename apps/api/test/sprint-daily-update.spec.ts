/**
 * @file Sprint board and daily update regression test for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  SprintStatus,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { DailyUpdatesService } from "../src/modules/sprints/daily-updates.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";

describe("Sprint board and daily updates", () => {
  it("lists sprint board items and updates work item execution status", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-1",
        projectId: "project-1",
        name: "Sprint 24",
        status: SprintStatus.ACTIVE,
        goal: "Deliver board execution MVP",
        planningNote: "Ready stories are already committed.",
        planningSnapshot: {
          goal: "Deliver board execution MVP",
          commitmentWorkItemIds: ["story-1", "story-2"],
          planningNote: "Ready stories are already committed.",
          capturedAt: "2026-06-04T09:00:00.000Z"
        },
        startsAt: null,
        endsAt: null,
        activatedAt: "2026-06-09T09:00:00.000Z",
        endedAt: null,
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Todo board item",
        status: WorkItemStatus.COMMITTED_TO_SPRINT,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["Board shows the todo story."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 100,
        description: "This story should start in the todo column."
      },
      {
        id: "story-2",
        type: WorkItemType.STORY,
        title: "In progress board item",
        status: WorkItemStatus.IN_PROGRESS,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 3,
        acceptanceCriteria: ["Board shows the in-progress story."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "user-2",
        sortOrder: 200,
        description: "This story is already being executed."
      }
    ]);
    const service = new DailyUpdatesService(sprintsRepository, workItemsRepository);

    const initialBoard = await service.getBoard("sprint-1");

    assert.equal(initialBoard.todo.length, 1);
    assert.equal(initialBoard.inProgress.length, 1);
    assert.equal(initialBoard.done.length, 0);

    await service.moveWorkItemToBoardColumn({
      sprintId: "sprint-1",
      workItemId: "story-1",
      column: "in-progress"
    });
    await service.moveWorkItemToBoardColumn({
      sprintId: "sprint-1",
      workItemId: "story-2",
      column: "done"
    });

    const updatedBoard = await service.getBoard("sprint-1");

    assert.equal(updatedBoard.todo.length, 0);
    assert.equal(updatedBoard.inProgress.length, 1);
    assert.equal(updatedBoard.done.length, 1);
    assert.equal(updatedBoard.inProgress[0]?.id, "story-1");
    assert.equal(updatedBoard.done[0]?.id, "story-2");
  });

  it("records daily updates as a time-ordered timeline for the sprint and work item", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-2",
        projectId: "project-1",
        name: "Sprint 25",
        status: SprintStatus.ACTIVE,
        goal: "Track daily updates",
        planningNote: null,
        planningSnapshot: {
          goal: "Track daily updates",
          commitmentWorkItemIds: ["story-3"],
          planningNote: null,
          capturedAt: "2026-06-04T09:00:00.000Z"
        },
        startsAt: null,
        endsAt: null,
        activatedAt: "2026-06-10T09:00:00.000Z",
        endedAt: null,
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-3",
        type: WorkItemType.STORY,
        title: "Daily update board item",
        status: WorkItemStatus.IN_PROGRESS,
        priority: WorkItemPriority.HIGH,
        storyPoints: 8,
        acceptanceCriteria: ["Daily updates remain visible in order."],
        projectId: "project-1",
        sprintId: "sprint-2",
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 100,
        description: "This story will receive multiple daily updates."
      }
    ]);
    const service = new DailyUpdatesService(sprintsRepository, workItemsRepository);

    await service.recordDailyUpdate({
      sprintId: "sprint-2",
      workItemId: "story-3",
      authorId: "user-1",
      summary: "Started implementation and prepared the board structure."
    });
    await service.recordDailyUpdate({
      sprintId: "sprint-2",
      workItemId: "story-3",
      authorId: "user-1",
      summary: "Finished the first column transitions and validated the timeline order."
    });

    const timeline = await service.listDailyUpdates("sprint-2", "story-3");

    assert.equal(timeline.length, 2);
    assert.equal(
      timeline[0]?.summary,
      "Finished the first column transitions and validated the timeline order."
    );
    assert.equal(
      timeline[1]?.summary,
      "Started implementation and prepared the board structure."
    );
    assert.equal(timeline[0]?.workItemId, "story-3");
  });
});
