/**
 * @file Formal document editor payload regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { createApiApp } from "../src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("formal document editor payload", () => {
  it("creates a formal document from the default template", async () => {
    const service = new DocumentsService(
      undefined,
      1,
      undefined,
      undefined,
      new DocumentTemplatesService()
    );
    const document = await service.createFormalDocument({
      title: "Requirement Draft",
      documentType: DocumentType.REQUIREMENT,
      templateId: "default-requirement",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "author-1",
      structuredFields: {
        businessGoal: "Reduce release risk",
        requester: "PopoY",
        priority: "HIGH"
      },
      markdown: "## Background\n\nRelease risk needs a shared document."
    });

    assert.equal(document.documentType, DocumentType.REQUIREMENT);
    assert.equal(document.templateId, "default-requirement");
    assert.equal(document.targetType, DocumentTargetType.STORY);
    assert.deepEqual(document.structuredFields, {
      businessGoal: "Reduce release risk",
      requester: "PopoY",
      priority: "HIGH"
    });
  });

  it("rejects a formal document whose template type does not match", async () => {
    const service = new DocumentsService(
      undefined,
      1,
      undefined,
      undefined,
      new DocumentTemplatesService()
    );

    await assert.rejects(
      () =>
        service.createFormalDocument({
          title: "Acceptance Draft",
          documentType: DocumentType.ACCEPTANCE,
          templateId: "default-requirement",
          targetType: DocumentTargetType.STORY,
          targetId: "story-1",
          authorId: "author-1",
          structuredFields: {
            acceptanceResult: "APPROVED",
            reviewerId: "reviewer-1",
            acceptedAt: "2026-06-04"
          },
          markdown: "## Scope\n\nTemplate type mismatch should fail."
        }),
      {
        message: "DOCUMENT_TEMPLATE_TYPE_MISMATCH"
      }
    );
  });
});

describe("formal document creation API", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the document API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("accepts a template-backed formal document payload", async () => {
    const response = await fetch(`${baseUrl}/documents/formal`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        title: "Requirement Draft",
        documentType: DocumentType.REQUIREMENT,
        templateId: "default-requirement",
        targetType: DocumentTargetType.STORY,
        targetId: "story-1",
        authorId: "author-1",
        structuredFields: {
          businessGoal: "Reduce release risk",
          requester: "PopoY",
          priority: "HIGH"
        },
        markdown: "## Background\n\nFormal document payload."
      })
    });

    assert.equal(response.status, 201);

    const payload = (await response.json()) as {
      documentType: string;
      templateId: string;
    };

    assert.equal(payload.documentType, DocumentType.REQUIREMENT);
    assert.equal(payload.templateId, "default-requirement");
  });
});
