/**
 * @file Sprint board and daily update form helpers for the Phase 1 frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import type { SprintBoardColumn } from "../api/sprints-client";

function readStringField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

/**
 * Parse an optional work item identifier from native form data.
 */
export function parseOptionalWorkItemId(formData: FormData) {
  const workItemId = readStringField(formData, "workItemId").trim();
  return workItemId.length === 0 ? null : workItemId;
}

/**
 * Read the daily update payload from the route-local server action form.
 */
export function buildCreateDailyUpdateInput(
  formData: FormData,
  sprintId: string,
  authorId: string
) {
  const summary = readStringField(formData, "summary").trim();
  const workItemId = parseOptionalWorkItemId(formData);

  if (sprintId.trim().length === 0 || authorId.trim().length === 0 || summary.length === 0) {
    throw new TypeError("SPRINT_DAILY_UPDATE_INPUT_INVALID");
  }

  return {
    sprintId: sprintId.trim(),
    workItemId,
    authorId: authorId.trim(),
    summary
  };
}

/**
 * Read the board move request from native form data and validate the allowed columns.
 */
export function buildMoveBoardItemInput(formData: FormData, sprintId: string) {
  const workItemId = readStringField(formData, "workItemId").trim();
  const column = readStringField(formData, "column").trim() as SprintBoardColumn;

  if (
    sprintId.trim().length === 0 ||
    workItemId.length === 0 ||
    (column !== "todo" && column !== "in-progress" && column !== "done")
  ) {
    throw new TypeError("SPRINT_BOARD_MOVE_INPUT_INVALID");
  }

  return {
    sprintId: sprintId.trim(),
    workItemId,
    column
  };
}
