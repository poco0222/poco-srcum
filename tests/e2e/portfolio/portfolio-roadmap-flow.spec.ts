/**
 * @file Portfolio roadmap API-level e2e flow for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Portfolio roadmap flow", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the Portfolio roadmap API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("filters the Portfolio roadmap and drills into a project detail", async () => {
    const sprintResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-roadmap",
        name: "Roadmap Sprint",
        status: "ACTIVE",
        goal: "Make the cross-project roadmap visible",
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
        title: "Roadmap flow Story",
        projectId: "project-roadmap",
        priority: "HIGH",
        storyPoints: 8,
        acceptanceCriteria: ["Managers can filter and inspect the roadmap."],
        parentId: null,
        assigneeId: "user-1",
        description: "Portfolio should remove the spreadsheet summary step.",
        sortOrder: 100
      })
    });

    assert.equal(storyResponse.status, 201);

    const story = (await storyResponse.json()) as { id: string };
    const commitmentResponse = await fetch(
      `${baseUrl}/work-items/${story.id}/add-to-sprint`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sprintId: sprint.id
        })
      }
    );

    assert.equal(commitmentResponse.status, 200);

    const overviewResponse = await fetch(
      `${baseUrl}/portfolio?projectId=project-roadmap&milestoneFrom=2026-06-01&milestoneTo=2026-06-30`
    );
    const overview = (await overviewResponse.json()) as {
      projects: Array<{
        id: string;
        totalWorkItemCount: number;
        signals: { source: string };
      }>;
      milestones: Array<{ sourceId: string; title: string }>;
    };

    assert.equal(overviewResponse.status, 200);
    assert.equal(overview.projects[0]?.id, "project-roadmap");
    assert.equal(overview.projects[0]?.totalWorkItemCount, 1);
    assert.equal(
      overview.projects[0]?.signals.source,
      "task-02-reporting-and-risk-tracking.md"
    );
    assert.equal(overview.milestones[0]?.sourceId, sprint.id);
    assert.equal(overview.milestones[0]?.title, "Roadmap Sprint");

    const drilldownResponse = await fetch(
      `${baseUrl}/portfolio/projects/project-roadmap`
    );
    const drilldown = (await drilldownResponse.json()) as {
      project: { id: string };
      workItems: Array<{ id: string }>;
      milestones: Array<{ sourceId: string }>;
    };

    assert.equal(drilldownResponse.status, 200);
    assert.equal(drilldown.project.id, "project-roadmap");
    assert.equal(drilldown.workItems[0]?.id, story.id);
    assert.equal(drilldown.milestones[0]?.sourceId, sprint.id);
  });
});
