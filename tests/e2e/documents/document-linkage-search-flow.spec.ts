/**
 * @file Document linkage, search, and dashboard API-level e2e for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType,
  LinkageObjectType,
  LinkageRelationType
} from "@poco-scrum/domain";
import { createApiApp } from "../../../apps/api/src/main";

let application: Awaited<ReturnType<typeof createApiApp>>;
let baseUrl = "";

describe("Document linkage search flow", () => {
  before(async () => {
    application = await createApiApp();
    await application.listen(0, "127.0.0.1");

    const address = application.getHttpServer().address();

    if (typeof address === "string" || address === null) {
      throw new Error("Unable to determine the linkage search flow API address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await application.close();
  });

  it("links requirement to design, finds it through search, and reports dashboard status", async () => {
    const requirement = await createFormalDocument({
      title: "Traceable Release Requirement",
      documentType: DocumentType.REQUIREMENT,
      templateId: "default-requirement",
      structuredFields: {
        businessGoal: "Traceable release evidence",
        requester: "PopoY",
        priority: "HIGH"
      },
      markdown: "## Background\n\nTraceable release evidence must be searchable."
    });
    const design = await createFormalDocument({
      title: "Traceable Release Design",
      documentType: DocumentType.TECHNICAL_SOLUTION,
      templateId: "default-technical-solution",
      structuredFields: {
        architectureSummary: "Search and dashboard read object links",
        ownerTeam: "Platform",
        riskLevel: "MEDIUM"
      },
      markdown: "## Architecture\n\nThe design remains missing its Story link."
    });
    const linkResponse = await fetch(`${baseUrl}/linkage`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
        sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        sourceId: requirement.id,
        targetType: LinkageObjectType.DESIGN_DOCUMENT,
        targetId: design.id,
        actorId: "user-1"
      })
    });

    assert.equal(linkResponse.status, 201);

    const submitReviewResponse = await fetch(
      `${baseUrl}/documents/${requirement.id}/review/submit`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          actorId: "user-1",
          versionId: "submitted-version-1"
        })
      }
    );

    assert.equal(submitReviewResponse.status, 201);

    const searchResponse = await fetch(
      `${baseUrl}/search?keyword=Traceable+release+evidence&objectType=${LinkageObjectType.REQUIREMENT_DOCUMENT}`
    );

    assert.equal(searchResponse.status, 200);

    const searchResults = (await searchResponse.json()) as Array<{
      objectId: string;
      relationSummary: string[];
      snippet: string;
      title: string;
    }>;

    assert.equal(searchResults[0]?.objectId, requirement.id);
    assert.match(searchResults[0]?.snippet ?? "", /Traceable release evidence/);
    assert.deepEqual(searchResults[0]?.relationSummary, [
      `${LinkageRelationType.REQUIREMENT_TO_DESIGN}: ${design.id}`
    ]);

    const reviewFilterResponse = await fetch(
      `${baseUrl}/search?reviewStatus=in-review`
    );

    assert.equal(reviewFilterResponse.status, 200);

    const reviewFilterResults = (await reviewFilterResponse.json()) as Array<{
      objectId: string;
      reviewStatus: string;
    }>;

    assert.deepEqual(reviewFilterResults, [
      {
        objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        objectId: requirement.id,
        title: "Traceable Release Requirement",
        snippet: "## Background Traceable release evidence must be searchable.",
        relationSummary: [`${LinkageRelationType.REQUIREMENT_TO_DESIGN}: ${design.id}`],
        reviewStatus: "in-review",
        updatedAt: requirement.updatedAt
      }
    ]);

    const dashboardResponse = await fetch(`${baseUrl}/dashboard/documents`);

    assert.equal(dashboardResponse.status, 200);

    const dashboard = (await dashboardResponse.json()) as {
      pendingReviewDocuments: Array<{ objectId: string; reviewStatus: string }>;
      incompleteLinks: Array<{
        objectId: string;
        missingRelation: string;
      }>;
      recentUpdates: Array<{ objectId: string }>;
    };

    assert.ok(
      dashboard.recentUpdates.some((item) => item.objectId === requirement.id)
    );
    assert.deepEqual(dashboard.pendingReviewDocuments, [
      {
        objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        objectId: requirement.id,
        title: "Traceable Release Requirement",
        snippet: "## Background Traceable release evidence must be searchable.",
        relationSummary: [`${LinkageRelationType.REQUIREMENT_TO_DESIGN}: ${design.id}`],
        reviewStatus: "in-review",
        updatedAt: requirement.updatedAt
      }
    ]);
    assert.deepEqual(dashboard.incompleteLinks, [
      {
        objectType: LinkageObjectType.DESIGN_DOCUMENT,
        objectId: design.id,
        title: "Traceable Release Design",
        missingRelation: LinkageRelationType.DESIGN_TO_STORY,
        updatedAt: design.updatedAt
      }
    ]);
  });
});

type CreateFormalDocumentFixture = {
  title: string;
  documentType: string;
  templateId: string;
  structuredFields: Record<string, string>;
  markdown: string;
};

/**
 * @param fixture The formal document fields to post through the API.
 * @returns The created formal document payload.
 */
async function createFormalDocument(fixture: CreateFormalDocumentFixture) {
  const response = await fetch(`${baseUrl}/documents/formal`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      ...fixture,
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "user-1"
    })
  });

  assert.equal(response.status, 201);

  return (await response.json()) as {
    id: string;
    updatedAt: string;
  };
}
