/**
 * @file Shared Sprint record contracts for the Phase 1 sprint planning baseline.
 * @author PopoY
 * @created 2026-06-04
 */
import type { SprintStatusValue } from "./sprint.enums";

export type SprintPlanningSnapshot = {
  goal: string;
  commitmentWorkItemIds: string[];
  planningNote: string | null;
  capturedAt: string;
};

export type SprintRecord = {
  id: string;
  projectId: string;
  name: string;
  status: SprintStatusValue;
  goal: string | null;
  planningNote: string | null;
  planningSnapshot: SprintPlanningSnapshot | null;
  startsAt: string | null;
  endsAt: string | null;
  activatedAt: string | null;
  endedAt: string | null;
  closedAt: string | null;
  retrospectiveId: string | null;
};

export type SprintCommitmentRecord = {
  id: string;
  sprintId: string;
  workItemId: string;
  createdAt: string;
};

export type SprintDailyUpdateRecord = {
  id: string;
  sprintId: string;
  workItemId: string | null;
  authorId: string;
  summary: string;
  createdAt: string;
};
