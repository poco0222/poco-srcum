/**
 * @file Backlog page server actions for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
"use server";

import { revalidatePath } from "next/cache";

import { defaultProjectId, getBacklogApiBaseUrl } from "../../../features/backlog/api/backlog-client";
import { idleBacklogActionState, type BacklogActionState } from "../../../features/backlog/lib/backlog-action-state";
import {
  buildCreateWorkItemInput,
  buildUpdateWorkItemInput
} from "../../../features/backlog/lib/backlog-form.utils";

function getKnownProjectId(formData: FormData) {
  const projectId = formData.get("projectId");

  return typeof projectId === "string" && projectId.trim().length > 0
    ? projectId.trim()
    : defaultProjectId;
}

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
 * Create a new backlog item and refresh the list page.
 */
export async function createBacklogWorkItemAction(
  _state: BacklogActionState,
  formData: FormData
): Promise<BacklogActionState> {
  try {
    const projectId = getKnownProjectId(formData);
    const sortOrderValue = formData.get("sortOrder");
    const sortOrder =
      typeof sortOrderValue === "string" && sortOrderValue.trim().length > 0
        ? Number(sortOrderValue)
        : Date.now();

    const payload = buildCreateWorkItemInput(formData, projectId, sortOrder);

    await requestJson("/work-items", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    revalidatePath("/backlog");

    return {
      status: "success",
      message: "Backlog item saved successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "BACKLOG_CREATE_FAILED"
    };
  }
}

/**
 * Update an existing backlog item and refresh both list and detail pages.
 */
export async function updateBacklogWorkItemAction(
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
      message: "Work item detail saved successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "BACKLOG_UPDATE_FAILED"
    };
  }
}

/**
 * Move a work item one slot up or down in the ordered backlog list.
 */
export async function reorderBacklogWorkItemsAction(formData: FormData) {
  const workItemId = formData.get("workItemId");
  const direction = formData.get("direction");
  const projectId = getKnownProjectId(formData);

  if (
    typeof workItemId !== "string" ||
    workItemId.trim().length === 0 ||
    (direction !== "up" && direction !== "down")
  ) {
    throw new TypeError("WORK_ITEM_REORDER_INPUT_INVALID");
  }

  const currentItems = (await requestJson(`/work-items?projectId=${projectId}`, {
    method: "GET"
  })) as Array<{ id: string; sortOrder: number }>;
  const currentIndex = currentItems.findIndex((item) => item.id === workItemId);
  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex < 0 || swapIndex < 0 || swapIndex >= currentItems.length) {
    return;
  }

  const currentItem = currentItems[currentIndex];
  const swapItem = currentItems[swapIndex];

  if (!currentItem || !swapItem) {
    return;
  }

  await requestJson("/work-items/reorder", {
    method: "POST",
    body: JSON.stringify({
      projectId,
      itemOrders: [
        {
          id: currentItem.id,
          sortOrder: swapItem.sortOrder
        },
        {
          id: swapItem.id,
          sortOrder: currentItem.sortOrder
        }
      ]
    })
  });

  revalidatePath("/backlog");
}
