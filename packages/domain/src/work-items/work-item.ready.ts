/**
 * @file Shared story ready-state evaluator for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { WorkItemReadySnapshot, WorkItemRecord } from "./work-item.types";
import { WorkItemType } from "./work-item.enums";

/**
 * Evaluate Story readiness once so API gates and UI hints stay aligned.
 */
export function evaluateStoryReadyState(
  workItem: WorkItemRecord
): WorkItemReadySnapshot {
  const reasons: string[] = [];

  if (workItem.type !== WorkItemType.STORY) {
    reasons.push("WORK_ITEM_READY_GATE_STORY_ONLY");
  }

  if (workItem.title.trim().length === 0) {
    reasons.push("WORK_ITEM_TITLE_REQUIRED");
  }

  if (workItem.storyPoints === null || workItem.storyPoints <= 0) {
    reasons.push("WORK_ITEM_STORY_POINTS_REQUIRED");
  }

  if (workItem.acceptanceCriteria.length === 0) {
    reasons.push("WORK_ITEM_ACCEPTANCE_CRITERIA_REQUIRED");
  }

  return {
    isReady: reasons.length === 0,
    reasons
  };
}
