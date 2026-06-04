/**
 * @file Shared work item field matrix and relation rules for the Phase 1 backlog model freeze step.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  WorkItemPriorityValue,
  WorkItemStatusValue,
  WorkItemTypeValue
} from "./work-item.enums";
import { WorkItemType } from "./work-item.enums";

export const WorkItemFieldRequirement = {
  REQUIRED: "REQUIRED",
  OPTIONAL: "OPTIONAL",
  FORBIDDEN: "FORBIDDEN"
} as const;

export type WorkItemFieldRequirementValue =
  (typeof WorkItemFieldRequirement)[keyof typeof WorkItemFieldRequirement];

export type WorkItemFieldKey =
  | "id"
  | "type"
  | "title"
  | "status"
  | "priority"
  | "storyPoints"
  | "acceptanceCriteria"
  | "projectId"
  | "sprintId"
  | "parentId"
  | "assigneeId"
  | "sortOrder";

export type WorkItemFieldMatrix = Record<
  WorkItemTypeValue,
  Record<WorkItemFieldKey, WorkItemFieldRequirementValue>
>;

export type WorkItemParentRule = {
  required: boolean;
  allowedParentTypes: readonly WorkItemTypeValue[];
};

export type WorkItemParentRules = Record<WorkItemTypeValue, WorkItemParentRule>;

export type WorkItemRecord = {
  id: string;
  type: WorkItemTypeValue;
  title: string;
  status: WorkItemStatusValue;
  priority: WorkItemPriorityValue;
  storyPoints: number | null;
  acceptanceCriteria: string[];
  projectId: string;
  sprintId: string | null;
  parentId: string | null;
  assigneeId: string | null;
  sortOrder: number;
  description: string | null;
};

export type WorkItemReadySnapshot = {
  isReady: boolean;
  reasons: string[];
};

/**
 * Keep the matrix close to the domain package so Prisma, API DTOs, and UI forms
 * can all read the same contract for required, optional, and forbidden fields.
 */
export const WorkItemFieldMatrix: WorkItemFieldMatrix = {
  EPIC: {
    id: WorkItemFieldRequirement.REQUIRED,
    type: WorkItemFieldRequirement.REQUIRED,
    title: WorkItemFieldRequirement.REQUIRED,
    status: WorkItemFieldRequirement.REQUIRED,
    priority: WorkItemFieldRequirement.REQUIRED,
    storyPoints: WorkItemFieldRequirement.FORBIDDEN,
    acceptanceCriteria: WorkItemFieldRequirement.FORBIDDEN,
    projectId: WorkItemFieldRequirement.REQUIRED,
    sprintId: WorkItemFieldRequirement.FORBIDDEN,
    parentId: WorkItemFieldRequirement.FORBIDDEN,
    assigneeId: WorkItemFieldRequirement.OPTIONAL,
    sortOrder: WorkItemFieldRequirement.REQUIRED
  },
  STORY: {
    id: WorkItemFieldRequirement.REQUIRED,
    type: WorkItemFieldRequirement.REQUIRED,
    title: WorkItemFieldRequirement.REQUIRED,
    status: WorkItemFieldRequirement.REQUIRED,
    priority: WorkItemFieldRequirement.REQUIRED,
    storyPoints: WorkItemFieldRequirement.REQUIRED,
    acceptanceCriteria: WorkItemFieldRequirement.REQUIRED,
    projectId: WorkItemFieldRequirement.REQUIRED,
    sprintId: WorkItemFieldRequirement.OPTIONAL,
    parentId: WorkItemFieldRequirement.OPTIONAL,
    assigneeId: WorkItemFieldRequirement.OPTIONAL,
    sortOrder: WorkItemFieldRequirement.REQUIRED
  },
  TASK: {
    id: WorkItemFieldRequirement.REQUIRED,
    type: WorkItemFieldRequirement.REQUIRED,
    title: WorkItemFieldRequirement.REQUIRED,
    status: WorkItemFieldRequirement.REQUIRED,
    priority: WorkItemFieldRequirement.REQUIRED,
    storyPoints: WorkItemFieldRequirement.OPTIONAL,
    acceptanceCriteria: WorkItemFieldRequirement.FORBIDDEN,
    projectId: WorkItemFieldRequirement.REQUIRED,
    sprintId: WorkItemFieldRequirement.OPTIONAL,
    parentId: WorkItemFieldRequirement.REQUIRED,
    assigneeId: WorkItemFieldRequirement.OPTIONAL,
    sortOrder: WorkItemFieldRequirement.REQUIRED
  },
  BUG: {
    id: WorkItemFieldRequirement.REQUIRED,
    type: WorkItemFieldRequirement.REQUIRED,
    title: WorkItemFieldRequirement.REQUIRED,
    status: WorkItemFieldRequirement.REQUIRED,
    priority: WorkItemFieldRequirement.REQUIRED,
    storyPoints: WorkItemFieldRequirement.OPTIONAL,
    acceptanceCriteria: WorkItemFieldRequirement.OPTIONAL,
    projectId: WorkItemFieldRequirement.REQUIRED,
    sprintId: WorkItemFieldRequirement.OPTIONAL,
    parentId: WorkItemFieldRequirement.OPTIONAL,
    assigneeId: WorkItemFieldRequirement.OPTIONAL,
    sortOrder: WorkItemFieldRequirement.REQUIRED
  }
};

export const WorkItemParentRules: WorkItemParentRules = {
  EPIC: {
    required: false,
    allowedParentTypes: []
  },
  STORY: {
    required: false,
    allowedParentTypes: [WorkItemType.EPIC]
  },
  TASK: {
    required: true,
    allowedParentTypes: [WorkItemType.STORY]
  },
  BUG: {
    required: false,
    allowedParentTypes: [WorkItemType.STORY]
  }
};
