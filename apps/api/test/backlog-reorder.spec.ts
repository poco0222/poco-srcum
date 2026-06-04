/**
 * @file Backlog reorder regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

describe("WorkItemsService.reorderBacklogItems", () => {
  it("persists the updated sort order and returns the list in ascending backlog order", async () => {
    const repository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Prepare sprint goal",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.HIGH,
        storyPoints: 3,
        acceptanceCriteria: ["Sprint goal is visible in the backlog."],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: null,
        sortOrder: 100,
        description: null
      },
      {
        id: "story-2",
        type: WorkItemType.STORY,
        title: "Refine task splits",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.MEDIUM,
        storyPoints: 5,
        acceptanceCriteria: ["Task children are visible under the story."],
        projectId: "project-1",
        sprintId: null,
        parentId: null,
        assigneeId: null,
        sortOrder: 200,
        description: null
      }
    ]);
    const service = new WorkItemsService(repository);

    const reordered = await service.reorderBacklogItems({
      projectId: "project-1",
      itemOrders: [
        {
          id: "story-1",
          sortOrder: 400
        },
        {
          id: "story-2",
          sortOrder: 100
        }
      ]
    });

    assert.deepEqual(
      reordered.map((item) => ({
        id: item.id,
        sortOrder: item.sortOrder
      })),
      [
        {
          id: "story-2",
          sortOrder: 100
        },
        {
          id: "story-1",
          sortOrder: 400
        }
      ]
    );
  });

  it("rejects a reorder request when one item belongs to another project", async () => {
    const repository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Prepare sprint goal",
        status: WorkItemStatus.BACKLOG,
        priority: WorkItemPriority.HIGH,
        storyPoints: 3,
        acceptanceCriteria: ["Sprint goal is visible in the backlog."],
        projectId: "project-2",
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
        service.reorderBacklogItems({
          projectId: "project-1",
          itemOrders: [
            {
              id: "story-1",
              sortOrder: 200
            }
          ]
        }),
      {
        message: "WORK_ITEM_PROJECT_MISMATCH"
      }
    );
  });
});
