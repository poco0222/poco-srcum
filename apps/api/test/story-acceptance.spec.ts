/**
 * @file Story acceptance command API regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Story acceptance API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the story acceptance API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("approves a story and returns a traceable acceptance record", async () => {
    const story = await createReadyStory("Story ready for formal acceptance");
    const response = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}/approve`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "reviewer-1",
          operatedAt: "2026-06-04T13:00:00.000Z"
        })
      }
    );
    const payload = (await response.json()) as {
      storyId: string;
      status: string;
      actorId: string;
      reason: string | null;
      operatedAt: string;
    };

    assert.equal(response.status, 200);
    assert.equal(payload.storyId, story.id);
    assert.equal(payload.status, "APPROVED");
    assert.equal(payload.actorId, "reviewer-1");
    assert.equal(payload.reason, null);
    assert.equal(payload.operatedAt, "2026-06-04T13:00:00.000Z");
  });

  it("rejects, reopens, and then approves a story through the formal loop", async () => {
    const story = await createReadyStory("Story rejected before acceptance");
    const rejectResponse = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}/reject`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "reviewer-2",
          reason: "Acceptance criteria were not fully demonstrated.",
          operatedAt: "2026-06-04T14:00:00.000Z"
        })
      }
    );
    const reopenResponse = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}/reopen`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "developer-1",
          reason: "Team will address the rejection and retry acceptance.",
          operatedAt: "2026-06-04T15:00:00.000Z"
        })
      }
    );
    const approveResponse = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}/approve`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "reviewer-2",
          operatedAt: "2026-06-04T16:00:00.000Z"
        })
      }
    );
    const historyResponse = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}`
    );
    const history = (await historyResponse.json()) as Array<{
      status: string;
      reason: string | null;
    }>;

    assert.equal(rejectResponse.status, 200);
    assert.equal(reopenResponse.status, 200);
    assert.equal(approveResponse.status, 200);
    assert.deepEqual(
      history.map((entry) => ({
        status: entry.status,
        reason: entry.reason
      })),
      [
        {
          status: "REJECTED",
          reason: "Acceptance criteria were not fully demonstrated."
        },
        {
          status: "REOPENED",
          reason: "Team will address the rejection and retry acceptance."
        },
        {
          status: "APPROVED",
          reason: null
        }
      ]
    );
  });

  it("rejects repeated rejection after approval", async () => {
    const story = await createReadyStory("Approved story cannot be rejected again");

    await fetch(`${baseUrl}/acceptance/stories/${story.id}/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        actorId: "reviewer-3",
        operatedAt: "2026-06-04T17:00:00.000Z"
      })
    });

    const rejectResponse = await fetch(
      `${baseUrl}/acceptance/stories/${story.id}/reject`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "reviewer-3",
          reason: "This rejection is not allowed after approval.",
          operatedAt: "2026-06-04T18:00:00.000Z"
        })
      }
    );

    assert.equal(rejectResponse.status, 400);
    assert.deepEqual(await rejectResponse.json(), {
      error: "Bad Request",
      message: "ACCEPTANCE_STATUS_TRANSITION_INVALID",
      statusCode: 400
    });
  });
});

/**
 * @param title The unique Story title for this test setup.
 * @returns The created ready Story payload.
 */
async function createReadyStory(title: string) {
  const response = await fetch(`${baseUrl}/work-items`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      type: "STORY",
      title,
      projectId: "project-1",
      priority: "HIGH",
      storyPoints: 5,
      acceptanceCriteria: ["Formal acceptance must be recorded."],
      parentId: null,
      assigneeId: "user-1",
      description: "Acceptance API test Story.",
      sortOrder: 100
    })
  });

  assert.equal(response.status, 201);
  return (await response.json()) as { id: string };
}
