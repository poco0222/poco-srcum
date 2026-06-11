/**
 * @file Portfolio signal contract tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  ProjectStatus,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { PortfolioService } from "../src/modules/portfolio/portfolio.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

describe("Portfolio signal contract", () => {
  it("exposes Task2-sourced neutral signals without recalculating risk from work item priority", async () => {
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
        }
      ],
      workItemsService: new WorkItemsService(
        new InMemoryWorkItemsRepository([
          {
            id: "bug-1",
            type: WorkItemType.BUG,
            title: "Critical production risk",
            status: WorkItemStatus.IN_PROGRESS,
            priority: WorkItemPriority.CRITICAL,
            storyPoints: null,
            acceptanceCriteria: [],
            projectId: "project-1",
            sprintId: null,
            parentId: null,
            assigneeId: "user-1",
            sortOrder: 100,
            description: "This high priority item must not become a Portfolio formula."
          }
        ])
      )
    });

    const overview = await portfolioService.listPortfolioOverview({
      projectId: "project-1"
    });
    const signals = overview.projects[0]?.signals;

    assert.equal(signals?.source, "task-02-reporting-and-risk-tracking.md");
    assert.equal(signals?.risk.severity, "NONE");
    assert.equal(signals?.risk.count, 0);
    assert.equal(signals?.dependency.count, 0);
    assert.equal(signals?.delay.count, 0);
  });
});
