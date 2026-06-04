/**
 * @file Document template creation end-to-end regression test for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { createApiApp } from "../../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Document template flow", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the document template flow API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  /**
   * Verifies the main template-backed formal document creation and reopen path.
   */
  it("selects a default template, saves a structured Markdown document, and reopens it", async () => {
    const templatesResponse = await fetch(`${baseUrl}/document-templates`);

    assert.equal(templatesResponse.status, 200);

    const templates = (await templatesResponse.json()) as Array<{
      documentType: string;
      id: string;
      isDefault: boolean;
      requiredFieldKeys: string[];
    }>;
    const requirementTemplate = templates.find(
      (template) => template.documentType === DocumentType.REQUIREMENT
    );

    assert.ok(requirementTemplate);
    assert.equal(requirementTemplate.id, "default-requirement");
    assert.deepEqual(requirementTemplate.requiredFieldKeys, [
      "businessGoal",
      "requester",
      "priority"
    ]);

    const createResponse = await fetch(`${baseUrl}/documents/formal`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        title: "Phase 2 Requirement Template Flow",
        documentType: DocumentType.REQUIREMENT,
        templateId: requirementTemplate.id,
        targetType: DocumentTargetType.STORY,
        targetId: "story-1",
        authorId: "user-1",
        structuredFields: {
          businessGoal: "让团队基于模板稳定沉淀正式文档",
          requester: "PopoY",
          priority: "HIGH",
          targetRelease: "P2"
        },
        markdown: [
          "## Background",
          "",
          "Phase 2 needs a repeatable document creation path.",
          "",
          "## Acceptance Criteria",
          "",
          "- Template selection is saved.",
          "- Structured fields are saved.",
          "- Markdown can be reopened."
        ].join("\n")
      })
    });

    assert.equal(createResponse.status, 201);

    const createdDocument = (await createResponse.json()) as { id: string };
    const reopenResponse = await fetch(
      `${baseUrl}/documents/${createdDocument.id}`
    );

    assert.equal(reopenResponse.status, 200);

    const reopenedDocument = (await reopenResponse.json()) as {
      documentType: string;
      markdown: string;
      structuredFields: Record<string, string>;
      targetId: string;
      targetType: string;
      templateId: string;
      title: string;
    };

    assert.equal(reopenedDocument.title, "Phase 2 Requirement Template Flow");
    assert.equal(reopenedDocument.documentType, DocumentType.REQUIREMENT);
    assert.equal(reopenedDocument.templateId, requirementTemplate.id);
    assert.equal(reopenedDocument.targetType, DocumentTargetType.STORY);
    assert.equal(reopenedDocument.targetId, "story-1");
    assert.deepEqual(reopenedDocument.structuredFields, {
      businessGoal: "让团队基于模板稳定沉淀正式文档",
      requester: "PopoY",
      priority: "HIGH",
      targetRelease: "P2"
    });
    assert.match(reopenedDocument.markdown, /## Background/);
    assert.match(reopenedDocument.markdown, /Markdown can be reopened/);
  });

  /**
   * Verifies template type mismatch protection keeps formal document payloads consistent.
   */
  it("rejects a formal document when the selected template type does not match", async () => {
    const response = await fetch(`${baseUrl}/documents/formal`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        title: "Mismatched Acceptance Draft",
        documentType: DocumentType.ACCEPTANCE,
        templateId: "default-requirement",
        targetType: DocumentTargetType.STORY,
        targetId: "story-1",
        authorId: "user-1",
        structuredFields: {
          acceptanceResult: "APPROVED",
          reviewerId: "reviewer-1",
          acceptedAt: "2026-06-04"
        },
        markdown: "## Scope\n\nTemplate mismatch should be rejected."
      })
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Bad Request",
      message: "DOCUMENT_TEMPLATE_TYPE_MISMATCH",
      statusCode: 400
    });
  });
});
