/**
 * @file Add-to-sprint DTO parser for the Phase 1 backlog ready gate.
 * @author PopoY
 * @created 2026-06-04
 */
export type AddToSprintInput = {
  sprintId: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * Parse the minimum sprint commitment payload before the ready gate runs.
 */
export const AddToSprintInputSchema: Schema<AddToSprintInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SPRINT_COMMIT_INPUT_INVALID");
    }

    const candidate = input as Partial<AddToSprintInput>;

    if (typeof candidate.sprintId !== "string" || candidate.sprintId.trim().length === 0) {
      throw new TypeError("SPRINT_COMMIT_INPUT_INVALID");
    }

    return {
      sprintId: candidate.sprintId.trim()
    };
  }
};
