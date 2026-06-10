/**
 * @file Document dashboard regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentReviewStatus,
  DocumentTargetType,
  DocumentType,
  LinkageObjectType,
  LinkageRelationType
} from "@poco-scrum/domain";
import { DashboardService } from "../src/modules/dashboard/dashboard.service";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { LinkageService } from "../src/modules/linkage/linkage.service";
import { SearchService } from "../src/modules/search/search.service";

describe("DashboardService", () => {
  it("builds fixed pending review, recent update, and incomplete link cards", async () => {
    const documentsService = new DocumentsService(
      undefined,
      1,
      undefined,
      undefined,
      new DocumentTemplatesService()
    );
    const requirement = await documentsService.createFormalDocument({
      title: "Dashboard Requirement",
      documentType: DocumentType.REQUIREMENT,
      templateId: "default-requirement",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "author-1",
      structuredFields: {
        businessGoal: "Track review work",
        requester: "PopoY",
        priority: "HIGH"
      },
      markdown: "## Background\n\nDashboard pending review candidate."
    });
    const design = await documentsService.createFormalDocument({
      title: "Dashboard Design",
      documentType: DocumentType.TECHNICAL_SOLUTION,
      templateId: "default-technical-solution",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "author-1",
      structuredFields: {
        architectureSummary: "Design still needs a Story link",
        ownerTeam: "Platform",
        riskLevel: "MEDIUM"
      },
      markdown: "## Architecture\n\nDashboard incomplete link candidate."
    });
    const linkageService = new LinkageService();

    await linkageService.createLink({
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: requirement.id,
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: design.id,
      actorId: "author-1"
    });

    const reviewStatusResolver = async (documentId: string) =>
      documentId === requirement.id ? DocumentReviewStatus.IN_REVIEW : null;
    const searchService = new SearchService({
      documentsService,
      linkageService,
      reviewStatusResolver
    });
    const dashboardService = new DashboardService({
      documentsService,
      linkageService,
      reviewStatusResolver,
      searchService
    });
    const dashboard = await dashboardService.getDocumentCollaborationDashboard();

    assert.deepEqual(
      dashboard.pendingReviewDocuments.map((item) => item.objectId),
      [requirement.id]
    );
    assert.deepEqual(
      dashboard.recentUpdates.map((item) => item.objectId),
      [design.id, requirement.id]
    );
    assert.deepEqual(dashboard.incompleteLinks, [
      {
        objectType: LinkageObjectType.DESIGN_DOCUMENT,
        objectId: design.id,
        title: "Dashboard Design",
        missingRelation: LinkageRelationType.DESIGN_TO_STORY,
        updatedAt: design.updatedAt
      }
    ]);
  });
});
