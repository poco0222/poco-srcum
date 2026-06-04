/**
 * @file Session me endpoint regression test for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("GET /auth/me", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the API session endpoint address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("returns 401 when the request has no session user header", async () => {
    const response = await fetch(`${baseUrl}/auth/me`);

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), {
      error: "Unauthorized",
      message: "SESSION_REQUIRED",
      statusCode: 401
    });
  });

  it("returns the current user summary when the session header is present", async () => {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        "x-session-user": "user-1"
      }
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      id: "user-1",
      displayName: "PopoY Demo User",
      team: {
        id: "team-1",
        name: "POCO Core Team"
      },
      defaultProject: {
        id: "project-1",
        key: "POCO",
        name: "POCO Scrum Platform"
      }
    });
  });
});
