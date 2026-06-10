/**
 * @file Basic search scope regression tests for Phase 2 Task 3.
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
  LinkageRelationType,
  SprintStatus,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { LinkageService } from "../src/modules/linkage/linkage.service";
import { SearchService } from "../src/modules/search/search.service";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { SprintsService } from "../src/modules/sprints/sprints.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";
import { WorkItemsService } from "../src/modules/work-items/work-items.service";

/**
 * @returns A document service seeded with requirement and design documents.
 */
async function createSearchFixture() {
  const documentsService = new DocumentsService(
    undefined,
    1,
    undefined,
    undefined,
    new DocumentTemplatesService()
  );
  const requirement = await documentsService.createFormalDocument({
    title: "Release Evidence Requirement",
    documentType: DocumentType.REQUIREMENT,
    templateId: "default-requirement",
    targetType: DocumentTargetType.STORY,
    targetId: "story-1",
    authorId: "author-1",
    structuredFields: {
      businessGoal: "Mobile approval evidence",
      requester: "PopoY",
      priority: "HIGH"
    },
    markdown: "## Background\n\nThe release checklist must stay searchable."
  });
  const design = await documentsService.createFormalDocument({
    title: "Release Evidence Design",
    documentType: DocumentType.TECHNICAL_SOLUTION,
    templateId: "default-technical-solution",
    targetType: DocumentTargetType.STORY,
    targetId: "story-1",
    authorId: "author-1",
    structuredFields: {
      architectureSummary: "Search reads formal documents",
      ownerTeam: "Platform",
      riskLevel: "MEDIUM"
    },
    markdown: "## Architecture\n\nNo attachment full text is indexed."
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

  return {
    design,
    documentsService,
    linkageService,
    requirement
  };
}

describe("SearchService", () => {
  it("finds formal documents by title, structured fields, and markdown body", async () => {
    const { documentsService, linkageService, requirement } =
      await createSearchFixture();
    const searchService = new SearchService({
      documentsService,
      linkageService
    });

    const titleResults = await searchService.search({
      keyword: "Release Evidence Requirement"
    });
    const fieldResults = await searchService.search({
      keyword: "Mobile approval evidence"
    });
    const markdownResults = await searchService.search({
      keyword: "release checklist"
    });

    assert.equal(titleResults[0]?.objectId, requirement.id);
    assert.equal(fieldResults[0]?.objectId, requirement.id);
    assert.equal(markdownResults[0]?.objectId, requirement.id);
    assert.match(markdownResults[0]?.snippet ?? "", /release checklist/);
  });

  it("adds relation summary and review status to document result cards", async () => {
    const { design, documentsService, linkageService, requirement } =
      await createSearchFixture();
    const searchService = new SearchService({
      documentsService,
      linkageService,
      reviewStatusResolver: async (documentId) =>
        documentId === requirement.id ? DocumentReviewStatus.IN_REVIEW : null
    });

    const results = await searchService.search({
      keyword: "Release Evidence Requirement",
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      reviewStatus: DocumentReviewStatus.IN_REVIEW
    });

    assert.equal(results.length, 1);
    assert.equal(results[0]?.objectId, requirement.id);
    assert.equal(results[0]?.reviewStatus, DocumentReviewStatus.IN_REVIEW);
    assert.deepEqual(results[0]?.relationSummary, [
      `${LinkageRelationType.REQUIREMENT_TO_DESIGN}: ${design.id}`
    ]);
  });

  it("supports filter-only review status searches without a keyword", async () => {
    const { documentsService, linkageService, requirement } =
      await createSearchFixture();
    const searchService = new SearchService({
      documentsService,
      linkageService,
      reviewStatusResolver: async (documentId) =>
        documentId === requirement.id ? DocumentReviewStatus.IN_REVIEW : null
    });

    const results = await searchService.search({
      keyword: "",
      reviewStatus: DocumentReviewStatus.IN_REVIEW
    });

    assert.deepEqual(
      results.map((result) => result.objectId),
      [requirement.id]
    );
  });

  it("finds Story and Sprint core objects through the same search contract", async () => {
    const { documentsService, linkageService } = await createSearchFixture();
    const workItemsService = new WorkItemsService(
      new InMemoryWorkItemsRepository([
        {
          id: "story-1",
          type: WorkItemType.STORY,
          title: "Release Evidence Story",
          status: WorkItemStatus.IN_PROGRESS,
          priority: WorkItemPriority.HIGH,
          storyPoints: 5,
          acceptanceCriteria: ["Search shows Story evidence."],
          projectId: "project-1",
          sprintId: "sprint-1",
          parentId: null,
          assigneeId: "user-1",
          sortOrder: 100,
          description: "Story body mentions searchable execution evidence."
        },
        {
          id: "task-1",
          type: WorkItemType.TASK,
          title: "Release Evidence Task",
          status: WorkItemStatus.IN_PROGRESS,
          priority: WorkItemPriority.MEDIUM,
          storyPoints: null,
          acceptanceCriteria: [],
          projectId: "project-1",
          sprintId: "sprint-1",
          parentId: "story-1",
          assigneeId: "user-1",
          sortOrder: 200,
          description: "Task body should not be mislabeled as Story."
        }
      ])
    );
    const sprintsService = new SprintsService(
      new InMemorySprintsRepository([
        {
          id: "sprint-1",
          projectId: "project-1",
          name: "Release Evidence Sprint",
          status: SprintStatus.ACTIVE,
          goal: "Deliver searchable evidence",
          planningNote: null,
          planningSnapshot: null,
          startsAt: "2026-06-10T00:00:00.000Z",
          endsAt: null,
          activatedAt: "2026-06-10T00:00:00.000Z",
          endedAt: null,
          closedAt: null,
          retrospectiveId: null
        }
      ])
    );
    const searchService = new SearchService({
      documentsService,
      linkageService,
      workItemsService,
      sprintsService
    });

    const storyResults = await searchService.search({
      keyword: "execution evidence",
      objectType: LinkageObjectType.STORY
    });
    const sprintResults = await searchService.search({
      keyword: "searchable evidence",
      objectType: LinkageObjectType.SPRINT
    });
    const storyFilteredTaskResults = await searchService.search({
      keyword: "mislabeled",
      objectType: LinkageObjectType.STORY
    });

    assert.equal(storyResults[0]?.objectId, "story-1");
    assert.equal(storyResults[0]?.reviewStatus, null);
    assert.deepEqual(storyFilteredTaskResults, []);
    assert.equal(sprintResults[0]?.objectId, "sprint-1");
    assert.equal(sprintResults[0]?.reviewStatus, null);
  });

  it("returns a stable empty result array when no indexed field matches", async () => {
    const { documentsService, linkageService } = await createSearchFixture();
    const searchService = new SearchService({
      documentsService,
      linkageService
    });

    const results = await searchService.search({
      keyword: "attachment binary payload"
    });

    assert.deepEqual(results, []);
  });
});
