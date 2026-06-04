/**
 * @file Sprint form helper regression test for the Phase 1 frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildCreateDailyUpdateInput,
  buildMoveBoardItemInput,
  parseOptionalWorkItemId
} from "./sprint-form.utils";

describe("sprint form helpers", () => {
  it("builds a trimmed daily update payload from native form data", () => {
    const formData = new FormData();

    formData.set("workItemId", " story-1 ");
    formData.set(
      "summary",
      "  Finished wiring the board shell and prepared the daily update form.  "
    );

    assert.deepEqual(
      buildCreateDailyUpdateInput(formData, " sprint-1 ", " user-1 "),
      {
        sprintId: "sprint-1",
        workItemId: "story-1",
        authorId: "user-1",
        summary: "Finished wiring the board shell and prepared the daily update form."
      }
    );
  });

  it("normalizes an empty work item identifier to null for sprint-level updates", () => {
    const formData = new FormData();

    formData.set("workItemId", "   ");

    assert.equal(parseOptionalWorkItemId(formData), null);
  });

  it("rejects a board move when the column is outside the allowed shell lanes", () => {
    const formData = new FormData();

    formData.set("workItemId", "story-1");
    formData.set("column", "review");

    assert.throws(() => buildMoveBoardItemInput(formData, "sprint-1"), {
      message: "SPRINT_BOARD_MOVE_INPUT_INVALID"
    });
  });
});
