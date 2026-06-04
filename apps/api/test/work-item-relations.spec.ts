/**
 * @file Work item parent-child rule regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { WorkItemType } from "@poco-scrum/domain";
import { assertWorkItemParentRelation } from "../src/modules/work-items/validators/work-item-parent.validator";

describe("assertWorkItemParentRelation", () => {
  it("allows a story to link under an epic in the same project", () => {
    assert.doesNotThrow(() => {
      assertWorkItemParentRelation({
        workItemType: WorkItemType.STORY,
        projectId: "project-1",
        parent: {
          id: "epic-1",
          type: WorkItemType.EPIC,
          projectId: "project-1"
        }
      });
    });
  });

  it("allows a bug to stay independent without a parent item", () => {
    assert.doesNotThrow(() => {
      assertWorkItemParentRelation({
        workItemType: WorkItemType.BUG,
        projectId: "project-1",
        parent: null
      });
    });
  });

  it("rejects a task when no parent story is supplied", () => {
    assert.throws(
      () =>
        assertWorkItemParentRelation({
          workItemType: WorkItemType.TASK,
          projectId: "project-1",
          parent: null
        }),
      {
        message: "WORK_ITEM_PARENT_REQUIRED"
      }
    );
  });

  it("rejects a story when the parent type is not allowed", () => {
    assert.throws(
      () =>
        assertWorkItemParentRelation({
          workItemType: WorkItemType.STORY,
          projectId: "project-1",
          parent: {
            id: "bug-1",
            type: WorkItemType.BUG,
            projectId: "project-1"
          }
        }),
      {
        message: "WORK_ITEM_PARENT_TYPE_INVALID"
      }
    );
  });
});
