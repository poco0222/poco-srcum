/**
 * @file Shared Story acceptance DTO and validation schemas for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */

export type ApproveStoryAcceptanceInput = {
  storyId: string;
  actorId: string;
  operatedAt: string;
};

export type RejectStoryAcceptanceInput = {
  storyId: string;
  actorId: string;
  reason: string;
  operatedAt: string;
};

export type ReopenStoryAcceptanceInput = {
  storyId: string;
  actorId: string;
  reason: string;
  operatedAt: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * Normalize a required free-text field shared by all acceptance command payloads.
 */
function normalizeRequiredText(value: unknown, errorMessage: string): string {
  if (typeof value !== "string") {
    throw new TypeError(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new TypeError(errorMessage);
  }

  return normalized;
}

/**
 * Normalize date-like input so audit fields are stored as stable ISO strings.
 */
function normalizeOperatedAt(value: unknown, errorMessage: string): string {
  const normalized = normalizeRequiredText(value, errorMessage);
  const timestamp = Date.parse(normalized);

  if (Number.isNaN(timestamp)) {
    throw new TypeError(errorMessage);
  }

  return new Date(timestamp).toISOString();
}

/**
 * Parse the shared approval payload used by API and UI callers.
 */
export const ApproveStoryAcceptanceInputSchema: Schema<ApproveStoryAcceptanceInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("STORY_ACCEPTANCE_APPROVE_INPUT_INVALID");
    }

    const candidate = input as Partial<ApproveStoryAcceptanceInput>;

    return {
      storyId: normalizeRequiredText(
        candidate.storyId,
        "STORY_ACCEPTANCE_APPROVE_INPUT_INVALID"
      ),
      actorId: normalizeRequiredText(
        candidate.actorId,
        "STORY_ACCEPTANCE_APPROVE_INPUT_INVALID"
      ),
      operatedAt: normalizeOperatedAt(
        candidate.operatedAt,
        "STORY_ACCEPTANCE_APPROVE_INPUT_INVALID"
      )
    };
  }
};

/**
 * Parse the shared rejection payload and require a reason for traceability.
 */
export const RejectStoryAcceptanceInputSchema: Schema<RejectStoryAcceptanceInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("STORY_ACCEPTANCE_REJECT_INPUT_INVALID");
    }

    const candidate = input as Partial<RejectStoryAcceptanceInput>;

    return {
      storyId: normalizeRequiredText(
        candidate.storyId,
        "STORY_ACCEPTANCE_REJECT_INPUT_INVALID"
      ),
      actorId: normalizeRequiredText(
        candidate.actorId,
        "STORY_ACCEPTANCE_REJECT_INPUT_INVALID"
      ),
      reason: normalizeRequiredText(
        candidate.reason,
        "STORY_ACCEPTANCE_REJECT_INPUT_INVALID"
      ),
      operatedAt: normalizeOperatedAt(
        candidate.operatedAt,
        "STORY_ACCEPTANCE_REJECT_INPUT_INVALID"
      )
    };
  }
};

/**
 * Parse the shared reopen payload and require a reason for traceability.
 */
export const ReopenStoryAcceptanceInputSchema: Schema<ReopenStoryAcceptanceInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("STORY_ACCEPTANCE_REOPEN_INPUT_INVALID");
    }

    const candidate = input as Partial<ReopenStoryAcceptanceInput>;

    return {
      storyId: normalizeRequiredText(
        candidate.storyId,
        "STORY_ACCEPTANCE_REOPEN_INPUT_INVALID"
      ),
      actorId: normalizeRequiredText(
        candidate.actorId,
        "STORY_ACCEPTANCE_REOPEN_INPUT_INVALID"
      ),
      reason: normalizeRequiredText(
        candidate.reason,
        "STORY_ACCEPTANCE_REOPEN_INPUT_INVALID"
      ),
      operatedAt: normalizeOperatedAt(
        candidate.operatedAt,
        "STORY_ACCEPTANCE_REOPEN_INPUT_INVALID"
      )
    };
  }
};
