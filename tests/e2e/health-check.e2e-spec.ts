/**
 * @file API health-check smoke test for the Phase 1 application bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createApiApp } from "../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("GET /health", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the API health-check address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("returns a healthy payload for the API shell", async () => {
    const response = await fetch(`${baseUrl}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(payload, {
      service: "api",
      status: "ok"
    });
  });
});
