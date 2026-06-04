/**
 * @file Sprint lifecycle API regression test for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Sprint lifecycle API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the sprint lifecycle API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("creates a sprint and drives it through start, end, and close", async () => {
    const createStoryResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Sprint lifecycle commitment",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: ["Sprint can start only after planning is recorded."],
        parentId: null,
        assigneeId: "user-1",
        description: "Lifecycle test now follows the planning precondition.",
        sortOrder: 100
      })
    });
    const createdStory = (await createStoryResponse.json()) as { id: string };
    const createResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-1",
        name: "Sprint 24",
        status: "PLANNED",
        goal: "Deliver Sprint lifecycle API",
        planningNote: "Initial sprint shell is ready.",
        startsAt: "2026-06-09T09:00:00.000Z",
        endsAt: "2026-06-20T09:00:00.000Z"
      })
    });

    assert.equal(createResponse.status, 201);

    const createdSprint = (await createResponse.json()) as {
      id: string;
      status: string;
      goal: string | null;
    };

    assert.equal(createdSprint.status, "PLANNED");
    assert.equal(createdSprint.goal, "Deliver Sprint lifecycle API");

    const planningResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/planning`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          goal: "Deliver Sprint lifecycle API",
          commitmentWorkItemIds: [createdStory.id],
          planningNote: "Lifecycle test commits one ready story."
        })
      }
    );

    assert.equal(planningResponse.status, 200);

    const startResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/start`,
      {
        method: "POST"
      }
    );
    const startedSprint = (await startResponse.json()) as {
      status: string;
      activatedAt: string | null;
    };

    assert.equal(startResponse.status, 200);
    assert.equal(startedSprint.status, "ACTIVE");
    assert.notEqual(startedSprint.activatedAt, null);

    const endResponse = await fetch(`${baseUrl}/sprints/${createdSprint.id}/end`, {
      method: "POST"
    });
    const endedSprint = (await endResponse.json()) as {
      status: string;
      endedAt: string | null;
    };

    assert.equal(endResponse.status, 200);
    assert.equal(endedSprint.status, "ENDED");
    assert.notEqual(endedSprint.endedAt, null);

    const closeResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/close`,
      {
        method: "POST"
      }
    );
    const closedSprint = (await closeResponse.json()) as {
      status: string;
      closedAt: string | null;
    };

    assert.equal(closeResponse.status, 200);
    assert.equal(closedSprint.status, "CLOSED");
    assert.notEqual(closedSprint.closedAt, null);
  });

  it("rejects closing a sprint twice", async () => {
    const createStoryResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Repeated close commitment",
        projectId: "project-1",
        priority: "MEDIUM",
        storyPoints: 3,
        acceptanceCriteria: ["Close can happen only after planning and start."],
        parentId: null,
        assigneeId: null,
        description: "Repeated close test also needs a ready commitment.",
        sortOrder: 200
      })
    });
    const createdStory = (await createStoryResponse.json()) as { id: string };
    const createResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-1",
        name: "Sprint 25",
        status: "PLANNED",
        goal: "Verify invalid close transitions",
        planningNote: null,
        startsAt: null,
        endsAt: null
      })
    });
    const createdSprint = (await createResponse.json()) as { id: string };

    const planningResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/planning`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          goal: "Verify invalid close transitions",
          commitmentWorkItemIds: [createdStory.id],
          planningNote: null
        })
      }
    );

    assert.equal(planningResponse.status, 200);

    await fetch(`${baseUrl}/sprints/${createdSprint.id}/start`, {
      method: "POST"
    });
    await fetch(`${baseUrl}/sprints/${createdSprint.id}/end`, {
      method: "POST"
    });

    const firstCloseResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/close`,
      {
        method: "POST"
      }
    );
    const secondCloseResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/close`,
      {
        method: "POST"
      }
    );

    assert.equal(firstCloseResponse.status, 200);
    assert.equal(secondCloseResponse.status, 400);
    assert.deepEqual(await secondCloseResponse.json(), {
      error: "Bad Request",
      message: "SPRINT_STATUS_TRANSITION_INVALID",
      statusCode: 400
    });
  });
});
