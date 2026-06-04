/**
 * @file Sprint planning regression test for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { SprintStatus, WorkItemPriority, WorkItemStatus, WorkItemType } from "@poco-scrum/domain";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { PlanningService } from "../src/modules/sprints/planning.service";
import { SprintsService } from "../src/modules/sprints/sprints.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";

describe("Sprint planning service", () => {
  it("records sprint goal, commitment items, and planning snapshot", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-1",
        projectId: "project-1",
        name: "Sprint 24",
        status: SprintStatus.PLANNED,
        goal: null,
        planningNote: null,
        planningSnapshot: null,
        startsAt: "2026-06-09T09:00:00.000Z",
        endsAt: "2026-06-20T09:00:00.000Z",
        activatedAt: null,
        endedAt: null,
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Ready board story",
        status: WorkItemStatus.READY_FOR_SPRINT,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["Board rendering is visible to the team."],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 100,
        description: "Planning should commit only ready stories."
      }
    ]);
    const planningService = new PlanningService(
      sprintsRepository,
      workItemsRepository
    );

    const updatedSprint = await planningService.updatePlanning({
      sprintId: "sprint-1",
      goal: "Deliver board MVP",
      commitmentWorkItemIds: ["story-1"],
      planningNote: "Start with one ready story."
    });

    assert.equal(updatedSprint.goal, "Deliver board MVP");
    assert.equal(updatedSprint.planningNote, "Start with one ready story.");
    assert.deepEqual(updatedSprint.planningSnapshot, {
      goal: "Deliver board MVP",
      commitmentWorkItemIds: ["story-1"],
      planningNote: "Start with one ready story.",
      capturedAt: updatedSprint.planningSnapshot?.capturedAt
    });

    const committedStory = await workItemsRepository.getById("story-1");

    assert.equal(committedStory?.sprintId, "sprint-1");
    assert.equal(committedStory?.status, WorkItemStatus.COMMITTED_TO_SPRINT);
  });

  it("rejects adding a story that has not passed the ready gate", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-2",
        projectId: "project-1",
        name: "Sprint 25",
        status: SprintStatus.PLANNED,
        goal: null,
        planningNote: null,
        planningSnapshot: null,
        startsAt: null,
        endsAt: null,
        activatedAt: null,
        endedAt: null,
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-2",
        type: WorkItemType.STORY,
        title: "Unready scope item",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 3,
        acceptanceCriteria: [],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: null,
        sortOrder: 200,
        description: "This story should be rejected during planning."
      }
    ]);
    const planningService = new PlanningService(
      sprintsRepository,
      workItemsRepository
    );

    await assert.rejects(
      () =>
        planningService.updatePlanning({
          sprintId: "sprint-2",
          goal: "Validate ready gate",
          commitmentWorkItemIds: ["story-2"],
          planningNote: null
        }),
      {
        message: "WORK_ITEM_NOT_READY_FOR_SPRINT"
      }
    );
  });

  it("rejects starting a sprint before goal and commitments are recorded", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-3",
        projectId: "project-1",
        name: "Sprint 26",
        status: SprintStatus.PLANNED,
        goal: null,
        planningNote: null,
        planningSnapshot: null,
        startsAt: null,
        endsAt: null,
        activatedAt: null,
        endedAt: null,
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const planningService = new PlanningService(
      sprintsRepository,
      new InMemoryWorkItemsRepository()
    );
    const sprintsService = new SprintsService(
      sprintsRepository,
      1,
      planningService
    );

    await assert.rejects(() => sprintsService.startSprint("sprint-3"), {
      message: "SPRINT_PLANNING_INCOMPLETE"
    });
  });
});
