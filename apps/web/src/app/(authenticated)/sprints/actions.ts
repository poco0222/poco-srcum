/**
 * @file Sprint page server actions for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
"use server";

import { revalidatePath } from "next/cache";

import {
  createSprintDailyUpdate,
  moveSprintBoardItem
} from "../../../features/sprints/api/sprints-client";
import { type SprintActionState } from "../../../features/sprints/lib/sprint-action-state";
import {
  buildCreateDailyUpdateInput,
  buildMoveBoardItemInput
} from "../../../features/sprints/lib/sprint-form.utils";

/**
 * Move one Sprint board item and refresh both the list and detail pages.
 */
export async function moveSprintBoardItemAction(
  sprintId: string,
  formData: FormData
) {
  const payload = buildMoveBoardItemInput(formData, sprintId);

  await moveSprintBoardItem(payload);
  revalidatePath("/sprints");
  revalidatePath(`/sprints/${sprintId}`);
}

/**
 * Save one Sprint daily update entry and refresh the Sprint detail page.
 */
export async function createSprintDailyUpdateAction(
  sprintId: string,
  authorId: string,
  _state: SprintActionState,
  formData: FormData
): Promise<SprintActionState> {
  try {
    const payload = buildCreateDailyUpdateInput(formData, sprintId, authorId);

    await createSprintDailyUpdate(payload);
    revalidatePath(`/sprints/${sprintId}`);

    return {
      status: "success",
      message: "Sprint daily update saved successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "SPRINT_DAILY_UPDATE_FAILED"
    };
  }
}
