/**
 * @file Sprint blocker and scope change regression test for the Phase 1 sprint execution task.
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
import { BlockersService } from "../src/modules/blockers/blockers.service";
import { ScopeChangeService } from "../src/modules/sprints/scope-change.service";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";

describe("Sprint blockers and scope change", () => {
  it("records blocker create and resolve events with actor, reason, and time", async () => {
    const blockersService = new BlockersService();

    const createdBlocker = await blockersService.createBlocker({
      actorId: "user-1",
      sprintId: "sprint-1",
      workItemId: "story-1",
      reason: "Waiting on API credentials from another team."
    });
    const resolvedBlocker = await blockersService.resolveBlocker({
      blockerId: createdBlocker.id,
      actorId: "user-2",
      reason: "Credentials were delivered and validated."
    });

    assert.equal(createdBlocker.action, "BLOCKER_CREATED");
    assert.equal(createdBlocker.actorId, "user-1");
    assert.equal(createdBlocker.reason, "Waiting on API credentials from another team.");
    assert.notEqual(createdBlocker.createdAt, "");

    assert.equal(resolvedBlocker.action, "BLOCKER_RESOLVED");
    assert.equal(resolvedBlocker.actorId, "user-2");
    assert.equal(resolvedBlocker.reason, "Credentials were delivered and validated.");
    assert.equal(resolvedBlocker.workItemId, "story-1");
  });

  it("records scope-in and scope-out events for active sprint work items", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-2",
        projectId: "project-1",
        name: "Sprint 26",
        status: SprintStatus.ACTIVE,
        goal: "Track scope changes",
        planningNote: null,
        planningSnapshot: {
          goal: "Track scope changes",
          commitmentWorkItemIds: ["story-2"],
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
        id: "story-2",
        type: WorkItemType.STORY,
        title: "Existing sprint scope item",
        status: WorkItemStatus.COMMITTED_TO_SPRINT,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["Existing commitment stays visible."],
        projectId: "project-1",
        sprintId: "sprint-2",
        parentId: null,
        assigneeId: "user-1",
        sortOrder: 100,
        description: "The baseline sprint commitment."
      },
      {
        id: "story-3",
        type: WorkItemType.STORY,
        title: "Incoming scope change item",
        status: WorkItemStatus.READY_FOR_SPRINT,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 3,
        acceptanceCriteria: ["Scope-in item is tracked."],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: "user-2",
        sortOrder: 200,
        description: "This story joins the sprint after scope changes."
      }
    ]);
    const scopeChangeService = new ScopeChangeService(
      sprintsRepository,
      workItemsRepository
    );

    const scopeInEvent = await scopeChangeService.addWorkItemToActiveSprint({
      actorId: "user-1",
      sprintId: "sprint-2",
      workItemId: "story-3",
      reason: "Urgent customer issue was prioritized into the sprint."
    });
    const scopeOutEvent = await scopeChangeService.removeWorkItemFromActiveSprint({
      actorId: "user-2",
      sprintId: "sprint-2",
      workItemId: "story-2",
      reason: "The story was deferred after the architecture review."
    });

    assert.equal(scopeInEvent.action, "SCOPE_IN");
    assert.equal(scopeOutEvent.action, "SCOPE_OUT");

    const updatedScopeInItem = await workItemsRepository.getById("story-3");
    const updatedScopeOutItem = await workItemsRepository.getById("story-2");

    assert.equal(updatedScopeInItem?.sprintId, "sprint-2");
    assert.equal(updatedScopeInItem?.status, WorkItemStatus.COMMITTED_TO_SPRINT);
    assert.equal(updatedScopeOutItem?.sprintId, null);
    assert.equal(updatedScopeOutItem?.status, WorkItemStatus.READY_FOR_SPRINT);

    const timeline = await scopeChangeService.listScopeChangeEvents("sprint-2");

    assert.equal(timeline.length, 2);
    assert.equal(timeline[0]?.action, "SCOPE_OUT");
    assert.equal(timeline[1]?.action, "SCOPE_IN");
  });
});
