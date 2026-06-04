/**
 * @file Shared Sprint enums for the Phase 1 sprint lifecycle freeze step.
 * @author PopoY
 * @created 2026-06-04
 */

export const SprintStatus = {
  DRAFT: "DRAFT",
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED",
  CLOSED: "CLOSED"
} as const;

export type SprintStatusValue =
  (typeof SprintStatus)[keyof typeof SprintStatus];
