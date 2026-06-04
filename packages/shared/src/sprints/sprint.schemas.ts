/**
 * @file Shared Sprint DTO and validation schemas for the Phase 1 sprint planning baseline.
 * @author PopoY
 * @created 2026-06-04
 */
import { SprintStatus } from "@poco-scrum/domain";
import type {
  SprintPlanningSnapshot,
  SprintStatusValue
} from "@poco-scrum/domain";

export type CreateSprintInput = {
  projectId: string;
  name: string;
  status?: SprintStatusValue;
  goal?: string | null;
  planningNote?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type UpdateSprintPlanningInput = {
  sprintId: string;
  goal: string;
  commitmentWorkItemIds: string[];
  planningNote: string | null;
  planningSnapshot?: SprintPlanningSnapshot;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const sprintStatusValues = new Set(Object.values(SprintStatus));

/**
 * Normalize optional text once so Sprint forms and API handlers share the same contract.
 */
function normalizeOptionalText(
  value: unknown,
  errorMessage: string
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new TypeError(errorMessage);
  }

  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
}

/**
 * Normalize a required free-text field used by Sprint planning payloads.
 */
function normalizeRequiredText(
  value: unknown,
  errorMessage: string
): string {
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
 * Normalize a unique list of work item identifiers captured during Sprint planning.
 */
function normalizeCommitmentWorkItemIds(
  value: unknown,
  errorMessage: string
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(errorMessage);
  }

  const normalizedIds = value.map((entry) =>
    normalizeRequiredText(entry, errorMessage)
  );

  return [...new Set(normalizedIds)];
}

function normalizeIsoDateLike(
  value: unknown,
  errorMessage: string
): string | null {
  const normalized = normalizeOptionalText(value, errorMessage);

  if (normalized === null) {
    return null;
  }

  const timestamp = Date.parse(normalized);

  if (Number.isNaN(timestamp)) {
    throw new TypeError(errorMessage);
  }

  return new Date(timestamp).toISOString();
}

function parsePlanningSnapshot(
  value: unknown,
  errorMessage: string
): SprintPlanningSnapshot {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(errorMessage);
  }

  const candidate = value as Partial<SprintPlanningSnapshot>;

  return {
    goal: normalizeRequiredText(candidate.goal, errorMessage),
    commitmentWorkItemIds: normalizeCommitmentWorkItemIds(
      candidate.commitmentWorkItemIds,
      errorMessage
    ),
    planningNote: normalizeOptionalText(candidate.planningNote, errorMessage),
    capturedAt: normalizeRequiredText(candidate.capturedAt, errorMessage)
  };
}

/**
 * Parse Sprint creation payloads shared by Sprint lifecycle endpoints.
 */
export const CreateSprintInputSchema: Schema<CreateSprintInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SPRINT_CREATE_INPUT_INVALID");
    }

    const candidate = input as Partial<CreateSprintInput>;
    const parsed: CreateSprintInput = {
      projectId: normalizeRequiredText(
        candidate.projectId,
        "SPRINT_CREATE_INPUT_INVALID"
      ),
      name: normalizeRequiredText(candidate.name, "SPRINT_CREATE_INPUT_INVALID")
    };

    if (candidate.status !== undefined) {
      if (
        typeof candidate.status !== "string" ||
        !sprintStatusValues.has(candidate.status as SprintStatusValue)
      ) {
        throw new TypeError("SPRINT_CREATE_INPUT_INVALID");
      }

      parsed.status = candidate.status as SprintStatusValue;
    }

    parsed.goal = normalizeOptionalText(candidate.goal, "SPRINT_CREATE_INPUT_INVALID");
    parsed.planningNote = normalizeOptionalText(
      candidate.planningNote,
      "SPRINT_CREATE_INPUT_INVALID"
    );
    parsed.startsAt = normalizeIsoDateLike(
      candidate.startsAt,
      "SPRINT_CREATE_INPUT_INVALID"
    );
    parsed.endsAt = normalizeIsoDateLike(
      candidate.endsAt,
      "SPRINT_CREATE_INPUT_INVALID"
    );

    return parsed;
  }
};

/**
 * Parse Sprint planning payloads so planning state, commitment IDs, and snapshots stay aligned.
 */
export const UpdateSprintPlanningInputSchema: Schema<UpdateSprintPlanningInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SPRINT_PLANNING_INPUT_INVALID");
    }

    const candidate = input as Partial<UpdateSprintPlanningInput>;
    const parsed: UpdateSprintPlanningInput = {
      sprintId: normalizeRequiredText(
        candidate.sprintId,
        "SPRINT_PLANNING_INPUT_INVALID"
      ),
      goal: normalizeRequiredText(candidate.goal, "SPRINT_PLANNING_INPUT_INVALID"),
      commitmentWorkItemIds: normalizeCommitmentWorkItemIds(
        candidate.commitmentWorkItemIds,
        "SPRINT_PLANNING_INPUT_INVALID"
      ),
      planningNote: normalizeOptionalText(
        candidate.planningNote,
        "SPRINT_PLANNING_INPUT_INVALID"
      )
    };

    if (candidate.planningSnapshot !== undefined) {
      parsed.planningSnapshot = parsePlanningSnapshot(
        candidate.planningSnapshot,
        "SPRINT_PLANNING_INPUT_INVALID"
      );
    }

    return parsed;
  }
};
