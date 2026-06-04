/**
 * @file Story ready gate validator for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import {
  evaluateStoryReadyState,
  type WorkItemRecord
} from "@poco-scrum/domain";

/**
 * Enforce the minimum Sprint-ready contract before a story can be committed to planning.
 */
export function assertStoryReadyForSprint(workItem: WorkItemRecord) {
  const readyState = evaluateStoryReadyState(workItem);

  if (!readyState.isReady) {
    throw new BadRequestException("WORK_ITEM_NOT_READY_FOR_SPRINT");
  }
}
