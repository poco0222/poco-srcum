/**
 * @file Update-planning DTO parser for the Phase 1 sprint planning API.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  UpdateSprintPlanningInputSchema,
  type UpdateSprintPlanningInput
} from "@poco-scrum/shared";

export type { UpdateSprintPlanningInput };

/**
 * Re-export the shared Sprint planning parser so API modules reuse one contract.
 */
export const UpdateSprintPlanningDtoSchema = UpdateSprintPlanningInputSchema;
