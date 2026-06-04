/**
 * @file Work item parent relation validator for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import {
  WorkItemParentRules,
  type WorkItemTypeValue
} from "@poco-scrum/domain";

export type WorkItemParentCandidate = {
  id: string;
  type: WorkItemTypeValue;
  projectId: string;
};

export type AssertWorkItemParentRelationInput = {
  workItemType: WorkItemTypeValue;
  projectId: string;
  parent: WorkItemParentCandidate | null;
};

/**
 * Validate the parent-child contract once so create and update flows reuse the same rule table.
 */
export function assertWorkItemParentRelation(
  input: AssertWorkItemParentRelationInput
) {
  const rule = WorkItemParentRules[input.workItemType];

  if (rule.required && input.parent === null) {
    throw new BadRequestException("WORK_ITEM_PARENT_REQUIRED");
  }

  if (input.parent === null) {
    return;
  }

  if (input.parent.projectId !== input.projectId) {
    throw new BadRequestException("WORK_ITEM_PARENT_PROJECT_MISMATCH");
  }

  if (!rule.allowedParentTypes.includes(input.parent.type)) {
    throw new BadRequestException("WORK_ITEM_PARENT_TYPE_INVALID");
  }
}
