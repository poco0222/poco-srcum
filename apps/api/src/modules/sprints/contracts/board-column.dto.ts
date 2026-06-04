/**
 * @file Board column DTO parser for the Phase 1 sprint execution API.
 * @author PopoY
 * @created 2026-06-04
 */
import type { SprintBoardColumn } from "../daily-updates.service";

export type MoveBoardWorkItemInput = {
  workItemId: string;
  column: SprintBoardColumn;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const boardColumns = new Set<SprintBoardColumn>(["todo", "in-progress", "done"]);

/**
 * Parse the minimum board transition payload before an execution status update runs.
 */
export const MoveBoardWorkItemDtoSchema: Schema<MoveBoardWorkItemInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SPRINT_BOARD_MOVE_INPUT_INVALID");
    }

    const candidate = input as Partial<MoveBoardWorkItemInput>;

    if (
      typeof candidate.workItemId !== "string" ||
      candidate.workItemId.trim().length === 0 ||
      typeof candidate.column !== "string" ||
      !boardColumns.has(candidate.column as SprintBoardColumn)
    ) {
      throw new TypeError("SPRINT_BOARD_MOVE_INPUT_INVALID");
    }

    return {
      workItemId: candidate.workItemId.trim(),
      column: candidate.column as SprintBoardColumn
    };
  }
};
