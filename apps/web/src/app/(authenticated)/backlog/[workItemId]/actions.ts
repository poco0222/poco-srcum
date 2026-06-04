/**
 * @file Backlog detail server actions for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
"use server";

import { revalidatePath } from "next/cache";

import { getBacklogApiBaseUrl } from "../../../../features/backlog/api/backlog-client";
import { type BacklogActionState } from "../../../../features/backlog/lib/backlog-action-state";
import {
  buildAddToSprintInput,
  buildUpdateWorkItemInput
} from "../../../../features/backlog/lib/backlog-form.utils";

async function requestJson(path: string, init: RequestInit) {
  const response = await fetch(`${getBacklogApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "BACKLOG_API_REQUEST_FAILED");
  }

  return response.json();
}

/**
 * Save detail-page edits and refresh the list/detail pages.
 */
export async function saveBacklogDetailAction(
  _state: BacklogActionState,
  formData: FormData
): Promise<BacklogActionState> {
  try {
    const workItemId = formData.get("workItemId");

    if (typeof workItemId !== "string" || workItemId.trim().length === 0) {
      throw new TypeError("WORK_ITEM_UPDATE_INPUT_INVALID");
    }

    const payload = buildUpdateWorkItemInput(formData, workItemId.trim());

    await requestJson(`/work-items/${workItemId.trim()}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    revalidatePath("/backlog");
    revalidatePath(`/backlog/${workItemId.trim()}`);

    return {
      status: "success",
      message: "Work item detail updated."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "BACKLOG_UPDATE_FAILED"
    };
  }
}

/**
 * Commit the current story into a sprint after the shared ready gate passes.
 */
export async function addStoryToSprintAction(
  _state: BacklogActionState,
  formData: FormData
): Promise<BacklogActionState> {
  try {
    const workItemId = formData.get("workItemId");

    if (typeof workItemId !== "string" || workItemId.trim().length === 0) {
      throw new TypeError("WORK_ITEM_NOT_FOUND");
    }

    const payload = buildAddToSprintInput(formData);

    await requestJson(`/work-items/${workItemId.trim()}/add-to-sprint`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    revalidatePath("/backlog");
    revalidatePath(`/backlog/${workItemId.trim()}`);

    return {
      status: "success",
      message: "Story committed into the Sprint successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "SPRINT_COMMIT_FAILED"
    };
  }
}
