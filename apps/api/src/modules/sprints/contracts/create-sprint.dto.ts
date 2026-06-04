/**
 * @file Create-sprint DTO parser for the Phase 1 sprint lifecycle API.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  CreateSprintInputSchema,
  type CreateSprintInput
} from "@poco-scrum/shared";

export type { CreateSprintInput };

/**
 * Re-export the shared Sprint creation parser so controllers stay thin.
 */
export const CreateSprintDtoSchema = CreateSprintInputSchema;
