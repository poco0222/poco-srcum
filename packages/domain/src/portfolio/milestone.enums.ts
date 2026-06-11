/**
 * @file Portfolio roadmap milestone enums for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */

export const RoadmapMilestoneKind = {
  SPRINT: "SPRINT"
} as const;

export type RoadmapMilestoneKindValue =
  (typeof RoadmapMilestoneKind)[keyof typeof RoadmapMilestoneKind];

export const RoadmapMilestoneStatus = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
} as const;

export type RoadmapMilestoneStatusValue =
  (typeof RoadmapMilestoneStatus)[keyof typeof RoadmapMilestoneStatus];

export const RoadmapMilestoneSourceType = {
  SPRINT: "SPRINT"
} as const;

export type RoadmapMilestoneSourceTypeValue =
  (typeof RoadmapMilestoneSourceType)[keyof typeof RoadmapMilestoneSourceType];
