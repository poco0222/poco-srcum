/**
 * @file Shared project and member status enums for the Phase 1 naming freeze step.
 * @author PopoY
 * @created 2026-06-04
 */

export const MemberStatus = {
  INVITED: "INVITED",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
} as const;

export type MemberStatusValue = (typeof MemberStatus)[keyof typeof MemberStatus];

export const ProjectStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED"
} as const;

export type ProjectStatusValue = (typeof ProjectStatus)[keyof typeof ProjectStatus];
