/**
 * @file Shared work item enums for the Phase 1 backlog model freeze step.
 * @author PopoY
 * @created 2026-06-04
 */

export const WorkItemType = {
  EPIC: "EPIC",
  STORY: "STORY",
  TASK: "TASK",
  BUG: "BUG"
} as const;

export type WorkItemTypeValue =
  (typeof WorkItemType)[keyof typeof WorkItemType];

export const WorkItemStatus = {
  BACKLOG: "BACKLOG",
  READY_FOR_SPRINT: "READY_FOR_SPRINT",
  COMMITTED_TO_SPRINT: "COMMITTED_TO_SPRINT",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
  CANCELLED: "CANCELLED"
} as const;

export type WorkItemStatusValue =
  (typeof WorkItemStatus)[keyof typeof WorkItemStatus];

export const WorkItemPriority = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW"
} as const;

export type WorkItemPriorityValue =
  (typeof WorkItemPriority)[keyof typeof WorkItemPriority];
