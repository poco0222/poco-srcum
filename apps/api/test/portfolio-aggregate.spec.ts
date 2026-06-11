/**
 * @file Portfolio aggregation service tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  ProjectStatus,
  SprintStatus,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { PortfolioService } from "../src/modules/portfolio/portfolio.service";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { SprintsService } from "../src/modules/sprints/sprints.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

describe("PortfolioService aggregation", () => {
  it("builds filtered project summaries and roadmap milestones from frozen P1 records", async () => {
    const portfolioService = new PortfolioService({
      projects: [
        {
          id: "project-1",
          key: "CORE",
          name: "Core Platform",
          teamId: "team-platform",
          status: ProjectStatus.ACTIVE,
          portfolioId: "portfolio-alpha",
          portfolioName: "Alpha Portfolio"
        },
        {
          id: "project-2",
          key: "OPS",
          name: "Operations",
          teamId: "team-ops",
          status: ProjectStatus.ARCHIVED,
          portfolioId: "portfolio-beta",
          portfolioName: "Beta Portfolio"
        }
      ],
      sprintsService: new SprintsService(
        new InMemorySprintsRepository([
          {
            id: "sprint-1",
            projectId: "project-1",
            name: "June delivery",
            status: SprintStatus.ACTIVE,
            goal: "Expose portfolio roadmap",
            planningNote: null,
            planningSnapshot: null,
            startsAt: "2026-06-01T00:00:00.000Z",
            endsAt: "2026-06-14T00:00:00.000Z",
            activatedAt: "2026-06-01T00:00:00.000Z",
            endedAt: null,
            closedAt: null,
            retrospectiveId: null
          }
        ])
      ),
      workItemsService: new WorkItemsService(
        new InMemoryWorkItemsRepository([
          {
            id: "story-1",
            type: WorkItemType.STORY,
            title: "Show portfolio",
            status: WorkItemStatus.DONE,
            priority: WorkItemPriority.HIGH,
            storyPoints: 5,
            acceptanceCriteria: ["Portfolio summary is visible."],
            projectId: "project-1",
            sprintId: "sprint-1",
            parentId: null,
            assigneeId: "user-1",
            sortOrder: 100,
            description: null
          }
        ])
      ),
      getNow: () => "2026-06-11T14:30:00.000Z"
    });

    const overview = await portfolioService.listPortfolioOverview({
      portfolioId: "portfolio-alpha",
      milestoneFrom: "2026-06-01",
      milestoneTo: "2026-06-30"
    });

    assert.equal(overview.generatedAt, "2026-06-11T14:30:00.000Z");
    assert.deepEqual(
      overview.projects.map((project) => project.id),
      ["project-1"]
    );
    assert.equal(overview.projects[0]?.doneWorkItemCount, 1);
    assert.equal(overview.projects[0]?.activeSprintCount, 1);
    assert.equal(overview.milestones[0]?.sourceType, "SPRINT");
    assert.equal(
      overview.projects[0]?.signals.source,
      "task-02-reporting-and-risk-tracking.md"
    );
  });
});
