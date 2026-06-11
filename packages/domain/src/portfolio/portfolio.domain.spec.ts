/**
 * @file Portfolio domain contract tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ProjectStatus, SprintStatus, WorkItemStatus, WorkItemType } from "../index";
import {
  RoadmapMilestoneKind,
  RoadmapMilestoneStatus
} from "./milestone.enums";
import {
  buildPortfolioProjectSummary,
  createEmptyPortfolioOverview,
  createRoadmapMilestoneFromSprint,
  filterPortfolioProjectSummaries,
  sortRoadmapMilestones,
  type PortfolioSourceProject
} from "./portfolio.types";

describe("portfolio domain contract", () => {
  it("builds project summaries without defining reporting or risk formulas", () => {
    const project: PortfolioSourceProject = {
      id: "project-1",
      key: "CORE",
      name: "Core Platform",
      teamId: "team-platform",
      status: ProjectStatus.ACTIVE,
      portfolioId: "portfolio-alpha",
      portfolioName: "Alpha Portfolio"
    };

    const activeMilestone = createRoadmapMilestoneFromSprint({
      id: "sprint-1",
      projectId: project.id,
      name: "Sprint 1",
      status: SprintStatus.ACTIVE,
      goal: "Stabilize planning",
      planningNote: null,
      planningSnapshot: null,
      startsAt: "2026-06-01",
      endsAt: "2026-06-14",
      activatedAt: "2026-06-01",
      endedAt: null,
      closedAt: null,
      retrospectiveId: null
    });
    const summary = buildPortfolioProjectSummary({
      project,
      milestones: [activeMilestone],
      workItems: [
        {
          id: "story-1",
          type: WorkItemType.STORY,
          title: "Show portfolio",
          status: WorkItemStatus.DONE,
          priority: "HIGH",
          storyPoints: 5,
          acceptanceCriteria: ["Portfolio summary is visible."],
          projectId: project.id,
          sprintId: "sprint-1",
          parentId: null,
          assigneeId: null,
          sortOrder: 100,
          description: null
        },
        {
          id: "bug-1",
          type: WorkItemType.BUG,
          title: "Fix filter copy",
          status: WorkItemStatus.IN_PROGRESS,
          priority: "MEDIUM",
          storyPoints: null,
          acceptanceCriteria: [],
          projectId: project.id,
          sprintId: "sprint-1",
          parentId: null,
          assigneeId: null,
          sortOrder: 200,
          description: null
        }
      ]
    });

    assert.equal(summary.totalWorkItemCount, 2);
    assert.equal(summary.doneWorkItemCount, 1);
    assert.equal(summary.activeSprintCount, 1);
    assert.equal(summary.signals.source, "task-02-reporting-and-risk-tracking.md");
    assert.equal(summary.signals.risk.count, 0);
  });

  it("maps Sprints into read-only roadmap milestones and sorts them by date", () => {
    const baseSprint = {
      id: "sprint-2",
      projectId: "project-1",
      name: "Sprint 2",
      status: SprintStatus.PLANNED,
      goal: null,
      planningNote: null,
      planningSnapshot: null,
      startsAt: "2026-06-15",
      endsAt: "2026-06-28",
      activatedAt: null,
      endedAt: null,
      closedAt: null,
      retrospectiveId: null
    };
    const later = createRoadmapMilestoneFromSprint(baseSprint);
    const earlier = createRoadmapMilestoneFromSprint({
      ...baseSprint,
      id: "sprint-1",
      name: "Sprint 1",
      status: SprintStatus.CLOSED,
      startsAt: "2026-06-01",
      endsAt: "2026-06-14",
      closedAt: "2026-06-14"
    });

    assert.equal(earlier.kind, RoadmapMilestoneKind.SPRINT);
    assert.equal(earlier.status, RoadmapMilestoneStatus.COMPLETED);
    assert.deepEqual(sortRoadmapMilestones([later, earlier]).map((item) => item.id), [
      "milestone-sprint-1",
      "milestone-sprint-2"
    ]);
  });

  it("filters project summaries by portfolio, status, project, and milestone window", () => {
    const matching = buildPortfolioProjectSummary({
      project: {
        id: "project-1",
        key: "CORE",
        name: "Core Platform",
        teamId: "team-platform",
        status: ProjectStatus.ACTIVE,
        portfolioId: "portfolio-alpha",
        portfolioName: "Alpha Portfolio"
      },
      milestones: [
        {
          id: "milestone-1",
          projectId: "project-1",
          title: "June delivery",
          kind: RoadmapMilestoneKind.SPRINT,
          status: RoadmapMilestoneStatus.ACTIVE,
          startsAt: "2026-06-01",
          endsAt: "2026-06-14",
          sourceType: "SPRINT",
          sourceId: "sprint-1"
        }
      ],
      workItems: []
    });
    const other = buildPortfolioProjectSummary({
      project: {
        id: "project-2",
        key: "OPS",
        name: "Operations",
        teamId: "team-ops",
        status: ProjectStatus.ARCHIVED,
        portfolioId: "portfolio-beta",
        portfolioName: "Beta Portfolio"
      },
      milestones: [],
      workItems: []
    });

    assert.deepEqual(
      filterPortfolioProjectSummaries([matching, other], {
        portfolioId: "portfolio-alpha",
        projectId: "project-1",
        projectStatus: ProjectStatus.ACTIVE,
        milestoneFrom: "2026-06-01",
        milestoneTo: "2026-06-30"
      }).map((item) => item.id),
      ["project-1"]
    );
  });

  it("creates a stable empty overview for empty portfolios", () => {
    assert.deepEqual(createEmptyPortfolioOverview({ portfolioId: "portfolio-alpha" }), {
      filters: {
        portfolioId: "portfolio-alpha"
      },
      projects: [],
      milestones: [],
      generatedAt: null
    });
  });
});
