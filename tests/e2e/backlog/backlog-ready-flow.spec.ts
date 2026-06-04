/**
 * @file Backlog ready-flow end-to-end regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Backlog ready flow", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the backlog ready-flow API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("creates a story, records acceptance criteria, and turns the story ready for sprint planning", async () => {
    const createResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Prepare backlog readiness review",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: [],
        parentId: null,
        assigneeId: "user-1",
        description: "The product owner can refine the Story before Sprint planning.",
        sortOrder: 100
      })
    });

    assert.equal(createResponse.status, 201);

    const createdStory = (await createResponse.json()) as { id: string };
    const updateResponse = await fetch(`${baseUrl}/work-items/${createdStory.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        title: "Prepare backlog readiness review",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: [
          "Acceptance criteria are visible on the detail page.",
          "The backlog list highlights the Story as ready."
        ],
        parentId: null,
        assigneeId: "user-1",
        description: "Refined Story details for Sprint planning."
      })
    });

    assert.equal(updateResponse.status, 200);

    const detailResponse = await fetch(`${baseUrl}/work-items/${createdStory.id}`);
    const detailPayload = (await detailResponse.json()) as {
      status: string;
      acceptanceCriteria: string[];
    };

    assert.equal(detailResponse.status, 200);
    assert.equal(detailPayload.status, "READY_FOR_SPRINT");
    assert.deepEqual(detailPayload.acceptanceCriteria, [
      "Acceptance criteria are visible on the detail page.",
      "The backlog list highlights the Story as ready."
    ]);
  });

  it("rejects adding a story to a sprint when acceptance criteria are still missing", async () => {
    const createResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Unready sprint candidate",
        projectId: "project-1",
        priority: "MEDIUM",
        storyPoints: 3,
        acceptanceCriteria: [],
        parentId: null,
        assigneeId: null,
        description: "This Story should be blocked by the ready gate.",
        sortOrder: 200
      })
    });

    assert.equal(createResponse.status, 201);

    const createdStory = (await createResponse.json()) as { id: string };
    const commitResponse = await fetch(
      `${baseUrl}/work-items/${createdStory.id}/add-to-sprint`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sprintId: "sprint-1"
        })
      }
    );

    assert.equal(commitResponse.status, 400);
    assert.deepEqual(await commitResponse.json(), {
      error: "Bad Request",
      message: "WORK_ITEM_NOT_READY_FOR_SPRINT",
      statusCode: 400
    });
  });
});
