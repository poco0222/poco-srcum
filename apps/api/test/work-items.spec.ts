/**
 * @file Work items API regression test for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Work items API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the work items API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("creates a story and returns it from the backlog list and detail endpoints", async () => {
    const createResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "STORY",
        title: "Prepare backlog ordering",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 5,
        acceptanceCriteria: ["Backlog ordering is visible to the product owner."],
        parentId: null,
        assigneeId: null,
        description: "Users can maintain backlog order from one place.",
        sortOrder: 100
      })
    });

    assert.equal(createResponse.status, 201);

    const createdItem = (await createResponse.json()) as { id: string };
    const listResponse = await fetch(`${baseUrl}/work-items?projectId=project-1`);
    const detailResponse = await fetch(`${baseUrl}/work-items/${createdItem.id}`);

    assert.equal(listResponse.status, 200);
    assert.equal(detailResponse.status, 200);

    const listedItems = (await listResponse.json()) as Array<{ id: string }>;
    const detailItem = (await detailResponse.json()) as {
      id: string;
      title: string;
      acceptanceCriteria: string[];
    };

    assert.equal(listedItems.length, 1);
    assert.equal(listedItems[0]?.id, createdItem.id);
    assert.equal(detailItem.title, "Prepare backlog ordering");
    assert.deepEqual(detailItem.acceptanceCriteria, [
      "Backlog ordering is visible to the product owner."
    ]);
  });

  it("rejects a task whose parent type is not allowed", async () => {
    const createStoryResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "BUG",
        title: "Unexpected order reset",
        projectId: "project-1",
        priority: "CRITICAL",
        storyPoints: null,
        acceptanceCriteria: [],
        parentId: null,
        assigneeId: null,
        description: null,
        sortOrder: 200
      })
    });

    const bug = (await createStoryResponse.json()) as { id: string };
    const invalidTaskResponse = await fetch(`${baseUrl}/work-items`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "TASK",
        title: "Implement reset fix",
        projectId: "project-1",
        priority: "HIGH",
        storyPoints: 2,
        acceptanceCriteria: [],
        parentId: bug.id,
        assigneeId: null,
        description: null,
        sortOrder: 300
      })
    });

    assert.equal(invalidTaskResponse.status, 400);
    assert.deepEqual(await invalidTaskResponse.json(), {
      error: "Bad Request",
      message: "WORK_ITEM_PARENT_TYPE_INVALID",
      statusCode: 400
    });
  });
});
