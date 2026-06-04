/**
 * @file Full Sprint flow end-to-end regression test for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Full Sprint flow", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the full sprint flow API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("runs the Sprint planning, execution, scope, close-out, and retrospective path", async () => {
    const createStoryResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Complete full sprint flow",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: ["The full sprint flow e2e remains green."],
        parentId: null,
        assigneeId: "user-1",
        description: "This story drives the end-to-end sprint flow.",
        sortOrder: 100
      })
    });
    const createdStory = (await createStoryResponse.json()) as { id: string };

    const createSprintResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-1",
        name: "Sprint 99",
        status: "PLANNED",
        goal: "Prove the complete sprint flow",
        planningNote: "The Sprint starts with one ready story.",
        startsAt: "2026-06-09T09:00:00.000Z",
        endsAt: "2026-06-20T09:00:00.000Z"
      })
    });
    const createdSprint = (await createSprintResponse.json()) as { id: string };

    const planningResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/planning`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          goal: "Prove the complete sprint flow",
          commitmentWorkItemIds: [createdStory.id],
          planningNote: "The sprint commits one ready story."
        })
      }
    );

    assert.equal(planningResponse.status, 200);

    const startResponse = await fetch(`${baseUrl}/sprints/${createdSprint.id}/start`, {
      method: "POST"
    });
    assert.equal(startResponse.status, 200);

    const boardResponse = await fetch(`${baseUrl}/sprints/${createdSprint.id}/board`);
    assert.equal(boardResponse.status, 200);

    const moveResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/board/move`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          workItemId: createdStory.id,
          column: "done"
        })
      }
    );
    assert.equal(moveResponse.status, 200);

    const dailyUpdateResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/daily-updates`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          workItemId: createdStory.id,
          authorId: "user-1",
          summary: "Completed the story and verified the board transition."
        })
      }
    );
    assert.equal(dailyUpdateResponse.status, 200);

    const scopeOutResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/scope/out`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "user-1",
          workItemId: createdStory.id,
          reason: "The story was delivered before sprint close-out."
        })
      }
    );
    assert.equal(scopeOutResponse.status, 200);

    const endResponse = await fetch(`${baseUrl}/sprints/${createdSprint.id}/end`, {
      method: "POST"
    });
    assert.equal(endResponse.status, 200);

    const retrospectiveResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/retrospective`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "user-1",
          title: "Sprint 99 Retrospective",
          markdown: "## Wins\n- Full sprint flow is stable."
        })
      }
    );
    assert.equal(retrospectiveResponse.status, 200);

    const closeResponse = await fetch(`${baseUrl}/sprints/${createdSprint.id}/close`, {
      method: "POST"
    });
    assert.equal(closeResponse.status, 200);
  });

  it("rejects planning a story that still fails the ready gate", async () => {
    const createStoryResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Unready full flow candidate",
        projectId: "project-1",
        priority: "MEDIUM",
        storyPoints: 3,
        acceptanceCriteria: [],
        parentId: null,
        assigneeId: null,
        description: "This story should be blocked during sprint planning.",
        sortOrder: 200
      })
    });
    const createdStory = (await createStoryResponse.json()) as { id: string };

    const createSprintResponse = await fetch(`${baseUrl}/sprints`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        projectId: "project-1",
        name: "Sprint 100",
        status: "PLANNED",
        goal: "Reject unready stories",
        planningNote: null,
        startsAt: null,
        endsAt: null
      })
    });
    const createdSprint = (await createSprintResponse.json()) as { id: string };

    const planningResponse = await fetch(
      `${baseUrl}/sprints/${createdSprint.id}/planning`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          goal: "Reject unready stories",
          commitmentWorkItemIds: [createdStory.id],
          planningNote: null
        })
      }
    );

    assert.equal(planningResponse.status, 400);
    assert.deepEqual(await planningResponse.json(), {
      error: "Bad Request",
      message: "WORK_ITEM_NOT_READY_FOR_SPRINT",
      statusCode: 400
    });
  });
});
