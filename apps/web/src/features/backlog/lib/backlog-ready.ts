/**
 * @file Backlog ready-state presentation helpers for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  evaluateStoryReadyState,
  WorkItemType,
  type WorkItemRecord
} from "@poco-scrum/domain";

const readyReasonLabels: Record<string, string> = {
  WORK_ITEM_READY_GATE_STORY_ONLY: "Only Story items can be committed into a Sprint.",
  WORK_ITEM_TITLE_REQUIRED: "Story title is still empty.",
  WORK_ITEM_STORY_POINTS_REQUIRED: "Story points are required before Sprint planning.",
  WORK_ITEM_ACCEPTANCE_CRITERIA_REQUIRED:
    "Acceptance criteria are required before Sprint planning."
};

export type WorkItemReadyPresentation = {
  label: string;
  tone: "ready" | "blocked" | "neutral";
  reasons: string[];
};

/**
 * Reuse the domain evaluator and map it into user-facing copy for the backlog pages.
 */
export function getWorkItemReadyPresentation(
  workItem: WorkItemRecord
): WorkItemReadyPresentation {
  if (workItem.type !== WorkItemType.STORY) {
    return {
      label: "Not Applicable",
      tone: "neutral",
      reasons: ["Only Story items require the Sprint ready gate."]
    };
  }

  const readyState = evaluateStoryReadyState(workItem);

  if (readyState.isReady) {
    return {
      label: "Ready for Sprint",
      tone: "ready",
      reasons: ["The story satisfies the current Sprint entry criteria."]
    };
  }

  return {
    label: "Blocked",
    tone: "blocked",
    reasons: readyState.reasons.map((reason) => readyReasonLabels[reason] ?? reason)
  };
}
