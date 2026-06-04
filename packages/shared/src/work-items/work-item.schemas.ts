/**
 * @file Shared work item DTO and validation schemas for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  WorkItemPriorityValue,
  WorkItemTypeValue
} from "@poco-scrum/domain";
import { WorkItemPriority, WorkItemType } from "@poco-scrum/domain";

export type CreateWorkItemInput = {
  type: WorkItemTypeValue;
  title: string;
  projectId: string;
  priority: WorkItemPriorityValue;
  storyPoints: number | null;
  acceptanceCriteria: string[];
  parentId: string | null;
  assigneeId: string | null;
  description: string | null;
  sortOrder: number;
};

export type UpdateWorkItemInput = {
  id: string;
  title?: string;
  priority?: WorkItemPriorityValue;
  storyPoints?: number | null;
  acceptanceCriteria?: string[];
  parentId?: string | null;
  assigneeId?: string | null;
  description?: string | null;
};

export type ReorderBacklogItemsInput = {
  projectId: string;
  itemOrders: Array<{
    id: string;
    sortOrder: number;
  }>;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const workItemTypeValues = new Set(Object.values(WorkItemType));
const workItemPriorityValues = new Set(Object.values(WorkItemPriority));

/**
 * Normalize free-text fields once so API and UI validation stay aligned.
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
 * Keep acceptance criteria normalization consistent across create and update payloads.
 */
function normalizeAcceptanceCriteria(
  value: unknown,
  errorMessage: string
): string[] {
  if (!Array.isArray(value)) {
    throw new TypeError(errorMessage);
  }

  return value.map((item) => {
    if (typeof item !== "string") {
      throw new TypeError(errorMessage);
    }

    const normalized = item.trim();

    if (normalized.length === 0) {
      throw new TypeError(errorMessage);
    }

    return normalized;
  });
}

/**
 * Parse work item creation payloads shared by backlog endpoints.
 */
export const CreateWorkItemInputSchema: Schema<CreateWorkItemInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("WORK_ITEM_CREATE_INPUT_INVALID");
    }

    const candidate = input as Partial<CreateWorkItemInput>;

    if (
      typeof candidate.type !== "string" ||
      !workItemTypeValues.has(candidate.type) ||
      typeof candidate.title !== "string" ||
      candidate.title.trim().length === 0 ||
      typeof candidate.projectId !== "string" ||
      candidate.projectId.trim().length === 0 ||
      typeof candidate.priority !== "string" ||
      !workItemPriorityValues.has(candidate.priority) ||
      typeof candidate.sortOrder !== "number" ||
      !Number.isFinite(candidate.sortOrder) ||
      !Number.isInteger(candidate.sortOrder)
    ) {
      throw new TypeError("WORK_ITEM_CREATE_INPUT_INVALID");
    }

    if (
      candidate.storyPoints !== null &&
      candidate.storyPoints !== undefined &&
      (typeof candidate.storyPoints !== "number" ||
        !Number.isFinite(candidate.storyPoints) ||
        candidate.storyPoints < 0)
    ) {
      throw new TypeError("WORK_ITEM_CREATE_INPUT_INVALID");
    }

    const normalizedParentId = normalizeOptionalText(
      candidate.parentId,
      "WORK_ITEM_CREATE_INPUT_INVALID"
    );
    const normalizedAssigneeId = normalizeOptionalText(
      candidate.assigneeId,
      "WORK_ITEM_CREATE_INPUT_INVALID"
    );
    const normalizedDescription = normalizeOptionalText(
      candidate.description,
      "WORK_ITEM_CREATE_INPUT_INVALID"
    );

    return {
      type: candidate.type,
      title: candidate.title.trim(),
      projectId: candidate.projectId.trim(),
      priority: candidate.priority,
      storyPoints: candidate.storyPoints ?? null,
      acceptanceCriteria: normalizeAcceptanceCriteria(
        candidate.acceptanceCriteria,
        "WORK_ITEM_CREATE_INPUT_INVALID"
      ),
      parentId: normalizedParentId,
      assigneeId: normalizedAssigneeId,
      description: normalizedDescription,
      sortOrder: candidate.sortOrder
    };
  }
};

/**
 * Parse work item update payloads shared by detail and inline-edit endpoints.
 */
export const UpdateWorkItemInputSchema: Schema<UpdateWorkItemInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
    }

    const candidate = input as Partial<UpdateWorkItemInput>;

    if (typeof candidate.id !== "string" || candidate.id.trim().length === 0) {
      throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
    }

    const parsed: UpdateWorkItemInput = {
      id: candidate.id.trim()
    };

    if (candidate.title !== undefined) {
      if (typeof candidate.title !== "string" || candidate.title.trim().length === 0) {
        throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
      }

      parsed.title = candidate.title.trim();
    }

    if (candidate.priority !== undefined) {
      if (
        typeof candidate.priority !== "string" ||
        !workItemPriorityValues.has(candidate.priority)
      ) {
        throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
      }

      parsed.priority = candidate.priority;
    }

    if (candidate.storyPoints !== undefined) {
      if (
        candidate.storyPoints !== null &&
        (typeof candidate.storyPoints !== "number" ||
          !Number.isFinite(candidate.storyPoints) ||
          candidate.storyPoints < 0)
      ) {
        throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
      }

      parsed.storyPoints = candidate.storyPoints;
    }

    if (candidate.acceptanceCriteria !== undefined) {
      parsed.acceptanceCriteria = normalizeAcceptanceCriteria(
        candidate.acceptanceCriteria,
        "WORK_ITEM_UPDATE_INPUT_INVALID"
      );
    }

    if (candidate.parentId !== undefined) {
      parsed.parentId = normalizeOptionalText(
        candidate.parentId,
        "WORK_ITEM_UPDATE_INPUT_INVALID"
      );
    }

    if (candidate.assigneeId !== undefined) {
      parsed.assigneeId = normalizeOptionalText(
        candidate.assigneeId,
        "WORK_ITEM_UPDATE_INPUT_INVALID"
      );
    }

    if (candidate.description !== undefined) {
      parsed.description = normalizeOptionalText(
        candidate.description,
        "WORK_ITEM_UPDATE_INPUT_INVALID"
      );
    }

    return parsed;
  }
};

/**
 * Parse backlog reorder payloads shared by service and controller layers.
 */
export const ReorderBacklogItemsInputSchema: Schema<ReorderBacklogItemsInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("WORK_ITEM_REORDER_INPUT_INVALID");
    }

    const candidate = input as Partial<ReorderBacklogItemsInput>;

    if (
      typeof candidate.projectId !== "string" ||
      candidate.projectId.trim().length === 0 ||
      !Array.isArray(candidate.itemOrders) ||
      candidate.itemOrders.length === 0
    ) {
      throw new TypeError("WORK_ITEM_REORDER_INPUT_INVALID");
    }

    return {
      projectId: candidate.projectId.trim(),
      itemOrders: candidate.itemOrders.map((entry) => {
        if (
          typeof entry !== "object" ||
          entry === null ||
          typeof entry.id !== "string" ||
          entry.id.trim().length === 0 ||
          typeof entry.sortOrder !== "number" ||
          !Number.isFinite(entry.sortOrder) ||
          !Number.isInteger(entry.sortOrder)
        ) {
          throw new TypeError("WORK_ITEM_REORDER_INPUT_INVALID");
        }

        return {
          id: entry.id.trim(),
          sortOrder: entry.sortOrder
        };
      })
    };
  }
};
