/**
 * @file Portfolio API filter and drilldown tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Portfolio API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the portfolio API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("lists filtered Portfolio summaries and drills into a project", async () => {
    const sprintResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-1",
        name: "Portfolio Sprint",
        status: "ACTIVE",
        goal: "Expose a roadmap milestone",
        startsAt: "2026-06-01",
        endsAt: "2026-06-14"
      })
    });

    assert.equal(sprintResponse.status, 201);

    const sprint = (await sprintResponse.json()) as { id: string };
    const storyResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Portfolio summary story",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: ["Portfolio summary lists this project."],
        parentId: null,
        assigneeId: "user-1",
        description: "Management can inspect the roadmap entry.",
        sortOrder: 100
      })
    });

    assert.equal(storyResponse.status, 201);

    const story = (await storyResponse.json()) as { id: string };
    await fetch(`${baseUrl}/work-items/${story.id}/add-to-sprint`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sprintId: sprint.id
      })
    });

    const overviewResponse = await fetch(
      `${baseUrl}/portfolio?projectId=project-1&milestoneFrom=2026-06-01&milestoneTo=2026-06-30`
    );
    const portfolioFilterResponse = await fetch(
      `${baseUrl}/portfolio?portfolioId=portfolio-alpha`
    );
    const statusFilterResponse = await fetch(
      `${baseUrl}/portfolio?projectStatus=ARCHIVED`
    );
    const drilldownResponse = await fetch(`${baseUrl}/portfolio/projects/project-1`);

    assert.equal(overviewResponse.status, 200);
    assert.equal(portfolioFilterResponse.status, 200);
    assert.equal(statusFilterResponse.status, 200);
    assert.equal(drilldownResponse.status, 200);

    const overview = (await overviewResponse.json()) as {
      projects: Array<{
        id: string;
        totalWorkItemCount: number;
        activeSprintCount: number;
        signals: { source: string };
      }>;
      milestones: Array<{ sourceId: string }>;
    };
    const portfolioFilteredOverview = (await portfolioFilterResponse.json()) as {
      projects: Array<{ id: string; portfolioId: string | null }>;
    };
    const statusFilteredOverview = (await statusFilterResponse.json()) as {
      projects: Array<{ id: string; status: string }>;
    };
    const drilldown = (await drilldownResponse.json()) as {
      project: { id: string };
      workItems: Array<{ id: string }>;
      milestones: Array<{ sourceId: string }>;
    };

    assert.equal(overview.projects[0]?.id, "project-1");
    assert.equal(overview.projects[0]?.totalWorkItemCount, 1);
    assert.equal(overview.projects[0]?.activeSprintCount, 1);
    assert.equal(
      overview.projects[0]?.signals.source,
      "task-02-reporting-and-risk-tracking.md"
    );
    assert.equal(overview.milestones[0]?.sourceId, sprint.id);
    assert.deepEqual(
      portfolioFilteredOverview.projects.map((project) => project.id),
      ["project-1"]
    );
    assert.equal(
      portfolioFilteredOverview.projects[0]?.portfolioId,
      "portfolio-alpha"
    );
    assert.deepEqual(
      statusFilteredOverview.projects.map((project) => project.id),
      ["project-2"]
    );
    assert.equal(statusFilteredOverview.projects[0]?.status, "ARCHIVED");
    assert.equal(drilldown.project.id, "project-1");
    assert.equal(drilldown.workItems[0]?.id, story.id);
    assert.equal(drilldown.milestones[0]?.sourceId, sprint.id);
  });
});
