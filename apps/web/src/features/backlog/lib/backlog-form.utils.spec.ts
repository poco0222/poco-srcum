/**
 * @file Backlog form helper regression test for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildAddToSprintInput,
  buildCreateWorkItemInput,
  buildUpdateWorkItemInput,
  parseAcceptanceCriteriaInput
} from "./backlog-form.utils";

describe("backlog form helpers", () => {
  it("normalizes acceptance criteria lines from the textarea input", () => {
    assert.deepEqual(
      parseAcceptanceCriteriaInput("  First rule  \n\n Second rule "),
      ["First rule", "Second rule"]
    );
  });

  it("builds a validated create payload from native form data", () => {
    const formData = new FormData();

    formData.set("type", "STORY");
    formData.set("title", "  Review backlog ordering  ");
    formData.set("priority", "HIGH");
    formData.set("storyPoints", "5");
    formData.set("acceptanceCriteria", "  Order is visible  \n Story is ready ");
    formData.set("parentId", "");
    formData.set("assigneeId", "user-1");
    formData.set("description", "  Product owner can sequence work.  ");

    assert.deepEqual(buildCreateWorkItemInput(formData, "project-1", 300), {
      type: "STORY",
      title: "Review backlog ordering",
      projectId: "project-1",
      priority: "HIGH",
      storyPoints: 5,
      acceptanceCriteria: ["Order is visible", "Story is ready"],
      parentId: null,
      assigneeId: "user-1",
      description: "Product owner can sequence work.",
      sortOrder: 300
    });
  });

  it("builds a validated update payload from native form data", () => {
    const formData = new FormData();

    formData.set("title", "  Update backlog detail  ");
    formData.set("priority", "MEDIUM");
    formData.set("storyPoints", "");
    formData.set("acceptanceCriteria", "  Detail page saves criteria  ");
    formData.set("parentId", "");
    formData.set("assigneeId", "");
    formData.set("description", "");

    assert.deepEqual(buildUpdateWorkItemInput(formData, "work-item-1"), {
      id: "work-item-1",
      title: "Update backlog detail",
      priority: "MEDIUM",
      storyPoints: null,
      acceptanceCriteria: ["Detail page saves criteria"],
      parentId: null,
      assigneeId: null,
      description: null
    });
  });

  it("rejects an empty sprint identifier before the commit request is sent", () => {
    const formData = new FormData();

    formData.set("sprintId", "   ");

    assert.throws(() => buildAddToSprintInput(formData), {
      message: "SPRINT_COMMIT_INPUT_INVALID"
    });
  });
});
