/**
 * @file Backlog form parsing helpers for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  CreateWorkItemInputSchema,
  UpdateWorkItemInputSchema,
  type CreateWorkItemInput,
  type UpdateWorkItemInput
} from "@poco-scrum/shared";

function readStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value : "";
}

/**
 * Convert the textarea value into a trimmed list so the web shell matches API validation semantics.
 */
export function parseAcceptanceCriteriaInput(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseOptionalNumber(rawValue: string) {
  const normalized = rawValue.trim();

  if (normalized.length === 0) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

/**
 * Build a create payload from native form data and immediately validate it against the shared schema.
 */
export function buildCreateWorkItemInput(
  formData: FormData,
  projectId: string,
  sortOrder: number
): CreateWorkItemInput {
  return CreateWorkItemInputSchema.parse({
    type: readStringField(formData, "type"),
    title: readStringField(formData, "title"),
    projectId,
    priority: readStringField(formData, "priority"),
    storyPoints: parseOptionalNumber(readStringField(formData, "storyPoints")),
    acceptanceCriteria: parseAcceptanceCriteriaInput(
      readStringField(formData, "acceptanceCriteria")
    ),
    parentId: readStringField(formData, "parentId"),
    assigneeId: readStringField(formData, "assigneeId"),
    description: readStringField(formData, "description"),
    sortOrder
  });
}

/**
 * Build an update payload from native form data and validate it against the shared schema.
 */
export function buildUpdateWorkItemInput(
  formData: FormData,
  workItemId: string
): UpdateWorkItemInput {
  return UpdateWorkItemInputSchema.parse({
    id: workItemId,
    title: readStringField(formData, "title"),
    priority: readStringField(formData, "priority"),
    storyPoints: parseOptionalNumber(readStringField(formData, "storyPoints")),
    acceptanceCriteria: parseAcceptanceCriteriaInput(
      readStringField(formData, "acceptanceCriteria")
    ),
    parentId: readStringField(formData, "parentId"),
    assigneeId: readStringField(formData, "assigneeId"),
    description: readStringField(formData, "description")
  });
}

/**
 * Read the sprint commitment payload from the detail page form.
 */
export function buildAddToSprintInput(formData: FormData) {
  const sprintId = readStringField(formData, "sprintId").trim();

  if (sprintId.length === 0) {
    throw new TypeError("SPRINT_COMMIT_INPUT_INVALID");
  }

  return {
    sprintId
  };
}
