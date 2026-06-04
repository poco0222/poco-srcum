/**
 * @file Daily update DTO parser for the Phase 1 sprint execution API.
 * @author PopoY
 * @created 2026-06-04
 */
export type RecordDailyUpdateDto = {
  workItemId?: string | null;
  authorId: string;
  summary: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * Parse the minimum daily update payload before the Sprint timeline appends a record.
 */
export const RecordDailyUpdateDtoSchema: Schema<RecordDailyUpdateDto> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SPRINT_DAILY_UPDATE_INPUT_INVALID");
    }

    const candidate = input as Partial<RecordDailyUpdateDto>;

    if (
      typeof candidate.authorId !== "string" ||
      candidate.authorId.trim().length === 0 ||
      typeof candidate.summary !== "string" ||
      candidate.summary.trim().length === 0
    ) {
      throw new TypeError("SPRINT_DAILY_UPDATE_INPUT_INVALID");
    }

    if (
      candidate.workItemId !== undefined &&
      candidate.workItemId !== null &&
      (typeof candidate.workItemId !== "string" ||
        candidate.workItemId.trim().length === 0)
    ) {
      throw new TypeError("SPRINT_DAILY_UPDATE_INPUT_INVALID");
    }

    return {
      workItemId: candidate.workItemId?.trim() ?? null,
      authorId: candidate.authorId.trim(),
      summary: candidate.summary.trim()
    };
  }
};
