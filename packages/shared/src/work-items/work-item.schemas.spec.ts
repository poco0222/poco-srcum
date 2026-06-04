/**
 * @file Shared work item DTO and schema regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { WorkItemPriority, WorkItemType } from "@poco-scrum/domain";
import {
  CreateWorkItemInputSchema,
  ReorderBacklogItemsInputSchema,
  UpdateWorkItemInputSchema
} from "../index";

describe("shared work item DTO schemas", () => {
  it("parses a story creation payload and normalizes acceptance criteria", () => {
    const parsed = CreateWorkItemInputSchema.parse({
      type: WorkItemType.STORY,
      title: "  Prepare sprint backlog  ",
      projectId: "project-1",
      priority: WorkItemPriority.HIGH,
      storyPoints: 5,
      acceptanceCriteria: ["  Backlog items are ordered  ", "Story is ready for planning"],
      parentId: null,
      assigneeId: "user-1",
      description: "  Product owner can maintain the backlog order.  ",
      sortOrder: 200
    });

    assert.deepEqual(parsed.acceptanceCriteria, [
      "Backlog items are ordered",
      "Story is ready for planning"
    ]);
    assert.equal(parsed.title, "Prepare sprint backlog");
    assert.equal(parsed.description, "Product owner can maintain the backlog order.");
  });

  it("rejects a create payload with no project identifier", () => {
    assert.throws(
      () =>
        CreateWorkItemInputSchema.parse({
          type: WorkItemType.BUG,
          title: "Fix order drift",
          projectId: "",
          priority: WorkItemPriority.CRITICAL,
          storyPoints: null,
          acceptanceCriteria: [],
          parentId: null,
          assigneeId: null,
          description: null,
          sortOrder: 100
        }),
      {
        message: "WORK_ITEM_CREATE_INPUT_INVALID"
      }
    );
  });

  it("parses an update payload with nullable planning fields", () => {
    const parsed = UpdateWorkItemInputSchema.parse({
      id: "story-1",
      title: "  Refine sprint scope  ",
      storyPoints: null,
      acceptanceCriteria: ["  Updated ready definition  "],
      parentId: null
    });

    assert.equal(parsed.id, "story-1");
    assert.equal(parsed.title, "Refine sprint scope");
    assert.deepEqual(parsed.acceptanceCriteria, ["Updated ready definition"]);
    assert.equal(parsed.storyPoints, null);
    assert.equal(parsed.parentId, null);
  });

  it("rejects a reorder payload with an empty item order list", () => {
    assert.throws(
      () =>
        ReorderBacklogItemsInputSchema.parse({
          projectId: "project-1",
          itemOrders: []
        }),
      {
        message: "WORK_ITEM_REORDER_INPUT_INVALID"
      }
    );
  });
});
