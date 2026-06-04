/**
 * @file Shared public exports for the Phase 1 domain package.
 * @author PopoY
 * @created 2026-06-04
 */
export { ProjectRole, SystemRole } from "./auth/roles.js";
export type { ProjectRoleValue, SystemRoleValue } from "./auth/roles.js";
export { MemberStatus, ProjectStatus } from "./projects/project.enums.js";
export type {
  MemberStatusValue,
  ProjectStatusValue
} from "./projects/project.enums.js";
