/**
 * @file Portfolio view domain contracts and helpers for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type { ProjectStatusValue } from "../projects/project.enums";
import { SprintStatus } from "../sprints/sprint.enums";
import type { SprintRecord } from "../sprints/sprint.types";
import { WorkItemStatus } from "../work-items/work-item.enums";
import type { WorkItemRecord } from "../work-items/work-item.types";
import {
  RoadmapMilestoneKind,
  RoadmapMilestoneSourceType,
  RoadmapMilestoneStatus,
  type RoadmapMilestoneKindValue,
  type RoadmapMilestoneSourceTypeValue,
  type RoadmapMilestoneStatusValue
} from "./milestone.enums";

export const PortfolioSignalSeverity = {
  NONE: "NONE",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const;

export type PortfolioSignalSeverityValue =
  (typeof PortfolioSignalSeverity)[keyof typeof PortfolioSignalSeverity];

export type PortfolioSignalIndicator = {
  severity: PortfolioSignalSeverityValue;
  label: string;
  count: number;
  sourceIds: string[];
};

export type PortfolioSignalSnapshot = {
  risk: PortfolioSignalIndicator;
  dependency: PortfolioSignalIndicator;
  delay: PortfolioSignalIndicator;
  source: "task-02-reporting-and-risk-tracking.md";
  updatedAt: string | null;
};

export type PortfolioSourceProject = {
  id: string;
  key: string;
  name: string;
  teamId: string;
  status: ProjectStatusValue;
  portfolioId: string | null;
  portfolioName: string | null;
};

export type RoadmapMilestone = {
  id: string;
  projectId: string;
  title: string;
  kind: RoadmapMilestoneKindValue;
  status: RoadmapMilestoneStatusValue;
  startsAt: string | null;
  endsAt: string | null;
  sourceType: RoadmapMilestoneSourceTypeValue;
  sourceId: string;
};

export type PortfolioFilter = {
  portfolioId?: string;
  projectId?: string;
  projectStatus?: ProjectStatusValue;
  milestoneFrom?: string;
  milestoneTo?: string;
};

export type PortfolioProjectSummary = PortfolioSourceProject & {
  activeSprintCount: number;
  doneWorkItemCount: number;
  totalWorkItemCount: number;
  milestones: RoadmapMilestone[];
  signals: PortfolioSignalSnapshot;
};

export type PortfolioOverview = {
  filters: PortfolioFilter;
  projects: PortfolioProjectSummary[];
  milestones: RoadmapMilestone[];
  generatedAt: string | null;
};

export type BuildPortfolioProjectSummaryInput = {
  project: PortfolioSourceProject;
  workItems: WorkItemRecord[];
  milestones: RoadmapMilestone[];
  signals?: PortfolioSignalSnapshot;
};

/**
 * @param sprint The Sprint record to expose as a read-only roadmap milestone.
 * @returns A Portfolio roadmap milestone backed by the Sprint identifier.
 */
export function createRoadmapMilestoneFromSprint(
  sprint: SprintRecord
): RoadmapMilestone {
  return {
    id: `milestone-${sprint.id}`,
    projectId: sprint.projectId,
    title: sprint.name,
    kind: RoadmapMilestoneKind.SPRINT,
    status: mapSprintStatusToMilestoneStatus(sprint.status),
    startsAt: sprint.startsAt,
    endsAt: sprint.endsAt,
    sourceType: RoadmapMilestoneSourceType.SPRINT,
    sourceId: sprint.id
  };
}

/**
 * @param input The project plus frozen Sprint and work item records.
 * @returns A Portfolio project summary with only view-structure counts.
 */
export function buildPortfolioProjectSummary(
  input: BuildPortfolioProjectSummaryInput
): PortfolioProjectSummary {
  const projectWorkItems = input.workItems.filter(
    (workItem) => workItem.projectId === input.project.id
  );
  const projectMilestones = sortRoadmapMilestones(
    input.milestones.filter((milestone) => milestone.projectId === input.project.id)
  );

  return {
    ...input.project,
    activeSprintCount: projectMilestones.filter(
      (milestone) => milestone.status === RoadmapMilestoneStatus.ACTIVE
    ).length,
    doneWorkItemCount: projectWorkItems.filter(
      (workItem) => workItem.status === WorkItemStatus.DONE
    ).length,
    totalWorkItemCount: projectWorkItems.length,
    milestones: projectMilestones,
    signals: input.signals ?? createNeutralPortfolioSignalSnapshot()
  };
}

/**
 * @param milestones The roadmap milestones to sort without mutating callers.
 * @returns Milestones ordered by start date, end date, then identifier.
 */
export function sortRoadmapMilestones(
  milestones: RoadmapMilestone[]
): RoadmapMilestone[] {
  return [...milestones].sort(compareRoadmapMilestones);
}

/**
 * @param projects The project summaries to filter for the view.
 * @param filters The optional Portfolio filter values.
 * @returns Summaries that match portfolio, project, status, and milestone window.
 */
export function filterPortfolioProjectSummaries(
  projects: PortfolioProjectSummary[],
  filters: PortfolioFilter
): PortfolioProjectSummary[] {
  const normalizedFilters = normalizePortfolioFilter(filters);

  return projects.filter((project) => {
    if (
      normalizedFilters.portfolioId &&
      project.portfolioId !== normalizedFilters.portfolioId
    ) {
      return false;
    }

    if (normalizedFilters.projectId && project.id !== normalizedFilters.projectId) {
      return false;
    }

    if (
      normalizedFilters.projectStatus &&
      project.status !== normalizedFilters.projectStatus
    ) {
      return false;
    }

    if (normalizedFilters.milestoneFrom || normalizedFilters.milestoneTo) {
      return project.milestones.some((milestone) =>
        isMilestoneInsideWindow(
          milestone,
          normalizedFilters.milestoneFrom,
          normalizedFilters.milestoneTo
        )
      );
    }

    return true;
  });
}

/**
 * @param filters Optional filters to preserve for an empty Portfolio response.
 * @returns Stable empty overview shape for pages and API responses.
 */
export function createEmptyPortfolioOverview(
  filters: PortfolioFilter = {}
): PortfolioOverview {
  return {
    filters: normalizePortfolioFilter(filters),
    projects: [],
    milestones: [],
    generatedAt: null
  };
}

/**
 * @returns A neutral signal snapshot until Task 2 supplies formal signal output.
 */
export function createNeutralPortfolioSignalSnapshot(): PortfolioSignalSnapshot {
  const neutralIndicator: PortfolioSignalIndicator = {
    severity: PortfolioSignalSeverity.NONE,
    label: "No formal signal",
    count: 0,
    sourceIds: []
  };

  return {
    risk: { ...neutralIndicator },
    dependency: { ...neutralIndicator },
    delay: { ...neutralIndicator },
    source: "task-02-reporting-and-risk-tracking.md",
    updatedAt: null
  };
}

/**
 * @param status The Sprint lifecycle status.
 * @returns The milestone status used by read-only roadmap views.
 */
function mapSprintStatusToMilestoneStatus(
  status: SprintRecord["status"]
): RoadmapMilestoneStatusValue {
  if (status === SprintStatus.ACTIVE) {
    return RoadmapMilestoneStatus.ACTIVE;
  }

  if (status === SprintStatus.ENDED || status === SprintStatus.CLOSED) {
    return RoadmapMilestoneStatus.COMPLETED;
  }

  return RoadmapMilestoneStatus.UPCOMING;
}

/**
 * @param left The first milestone.
 * @param right The second milestone.
 * @returns Sort order by start date, end date, then id.
 */
function compareRoadmapMilestones(
  left: RoadmapMilestone,
  right: RoadmapMilestone
) {
  const startOrder = compareNullableDate(left.startsAt, right.startsAt);

  if (startOrder !== 0) {
    return startOrder;
  }

  const endOrder = compareNullableDate(left.endsAt, right.endsAt);

  return endOrder === 0 ? left.id.localeCompare(right.id) : endOrder;
}

/**
 * @param left The first nullable ISO date.
 * @param right The second nullable ISO date.
 * @returns Null-last chronological order.
 */
function compareNullableDate(left: string | null, right: string | null) {
  if (left === right) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left.localeCompare(right);
}

/**
 * @param filters Optional filters from API or page query input.
 * @returns Filters trimmed and stripped of empty values.
 */
function normalizePortfolioFilter(filters: PortfolioFilter): PortfolioFilter {
  return {
    ...normalizeOptionalText("portfolioId", filters.portfolioId),
    ...normalizeOptionalText("projectId", filters.projectId),
    ...(filters.projectStatus ? { projectStatus: filters.projectStatus } : {}),
    ...normalizeOptionalText("milestoneFrom", filters.milestoneFrom),
    ...normalizeOptionalText("milestoneTo", filters.milestoneTo)
  };
}

/**
 * @param key The filter key to return when value is present.
 * @param value The optional text value to trim.
 * @returns Empty object when text is blank, otherwise a one-property filter.
 */
function normalizeOptionalText<TKey extends keyof PortfolioFilter>(
  key: TKey,
  value: string | undefined
) {
  if (typeof value !== "string") {
    return {};
  }

  const normalized = value.trim();

  return normalized.length > 0 ? { [key]: normalized } : {};
}

/**
 * @param milestone The milestone to compare with the requested date window.
 * @param from The inclusive lower date bound.
 * @param to The inclusive upper date bound.
 * @returns True when the milestone overlaps the date window.
 */
function isMilestoneInsideWindow(
  milestone: RoadmapMilestone,
  from?: string,
  to?: string
) {
  if (milestone.startsAt === null && milestone.endsAt === null) {
    return false;
  }

  const startsAt = milestone.startsAt ?? milestone.endsAt;
  const endsAt = milestone.endsAt ?? milestone.startsAt;

  if (from && endsAt && endsAt < from) {
    return false;
  }

  if (to && startsAt && startsAt > to) {
    return false;
  }

  return true;
}
