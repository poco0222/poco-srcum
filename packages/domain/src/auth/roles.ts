/**
 * @file Shared authentication and project role enums for the Phase 1 naming freeze step.
 * @author PopoY
 * @created 2026-06-04
 */

export const SystemRole = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  TEAM_MEMBER: "TEAM_MEMBER"
} as const;

export type SystemRoleValue = (typeof SystemRole)[keyof typeof SystemRole];

export const ProjectRole = {
  PROJECT_OWNER: "PROJECT_OWNER",
  SCRUM_MASTER: "SCRUM_MASTER",
  DEVELOPER: "DEVELOPER",
  REVIEWER: "REVIEWER"
} as const;

export type ProjectRoleValue = (typeof ProjectRole)[keyof typeof ProjectRole];
