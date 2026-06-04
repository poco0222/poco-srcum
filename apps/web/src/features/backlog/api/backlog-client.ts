/**
 * @file Backlog API client for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { WorkItemRecord } from "@poco-scrum/domain";
import type {
  CreateWorkItemInput,
  UpdateWorkItemInput
} from "@poco-scrum/shared";

export const defaultProjectId = process.env.POCO_DEFAULT_PROJECT_ID ?? "project-1";

/**
 * Resolve the API origin used by the web shell without hard-coding environment-specific URLs in components.
 */
export function getBacklogApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * Keep the demo shell aligned with the existing API session fixture.
 */
export function getDemoSessionUserId() {
  return process.env.POCO_DEMO_SESSION_USER ?? "user-1";
}

async function requestJson<TValue>(path: string, init?: RequestInit) {
  const response = await fetch(`${getBacklogApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "BACKLOG_API_REQUEST_FAILED");
  }

  return (await response.json()) as TValue;
}

/**
 * @param projectId The project whose backlog should be listed.
 * @returns Backlog items sorted by persisted order.
 */
export function listBacklogItems(projectId: string) {
  const query = new URLSearchParams({
    projectId
  });

  return requestJson<WorkItemRecord[]>(`/work-items?${query.toString()}`);
}

/**
 * @param workItemId The requested work item identifier.
 * @returns The work item detail payload.
 */
export function getBacklogWorkItem(workItemId: string) {
  return requestJson<WorkItemRecord>(`/work-items/${workItemId}`);
}

/**
 * @param payload The create payload collected from the backlog page form.
 * @returns The created work item record.
 */
export function createBacklogWorkItem(payload: CreateWorkItemInput) {
  return requestJson<WorkItemRecord>("/work-items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param workItemId The work item that should be updated.
 * @param payload The partial update payload.
 * @returns The updated work item detail.
 */
export function updateBacklogWorkItem(
  workItemId: string,
  payload: UpdateWorkItemInput
) {
  return requestJson<WorkItemRecord>(`/work-items/${workItemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param workItemId The story that should be committed into a sprint.
 * @param sprintId The target sprint identifier.
 * @returns The updated story payload after sprint commitment.
 */
export function addStoryToSprint(workItemId: string, sprintId: string) {
  return requestJson<WorkItemRecord>(`/work-items/${workItemId}/add-to-sprint`, {
    method: "POST",
    body: JSON.stringify({
      sprintId
    })
  });
}
