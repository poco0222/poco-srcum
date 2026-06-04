/**
 * @file Document template API regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentType } from "@poco-scrum/domain";
import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("document template API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the document template API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("lists default formal document templates for the creation page", async () => {
    const response = await fetch(`${baseUrl}/document-templates`);

    assert.equal(response.status, 200);

    const payload = (await response.json()) as Array<{
      documentType: string;
      id: string;
      isDefault: boolean;
      requiredFieldKeys: string[];
    }>;

    assert.deepEqual(
      payload.map((template) => template.documentType),
      [
        DocumentType.REQUIREMENT,
        DocumentType.TECHNICAL_SOLUTION,
        DocumentType.ACCEPTANCE,
        DocumentType.RETROSPECTIVE
      ]
    );
    assert.equal(payload.every((template) => template.isDefault), true);
    assert.equal(payload[0]?.id, "default-requirement");
    assert.deepEqual(payload[0]?.requiredFieldKeys, [
      "businessGoal",
      "requester",
      "priority"
    ]);
  });
});
