/**
 * @file Minimal audit log regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentTargetType, WorkItemPriority, WorkItemStatus, WorkItemType } from "@poco-scrum/domain";
import { AcceptanceService } from "../src/modules/acceptance/acceptance.service";
import { InMemoryStoryAcceptanceRepository } from "../src/modules/acceptance/acceptance.repository";
import { MinimalAuditService } from "../src/modules/audit/minimal-audit.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";

describe("minimal audit log", () => {
  it("records approval, rejection, reopen, and document update actions", async () => {
    const auditService = new MinimalAuditService();
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Audit acceptance events",
        status: WorkItemStatus.IN_REVIEW,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["Audit logs are written for acceptance events."],
        projectId: "project-1",
        sprintId: "sprint-1",
        parentId: null,
        assigneeId: "developer-1",
        sortOrder: 100,
        description: null
      }
    ]);
    const acceptanceService = new AcceptanceService(
      new InMemoryStoryAcceptanceRepository(),
      workItemsRepository,
      undefined,
      auditService
    );
    const documentsService = new DocumentsService(
      undefined,
      1,
      undefined,
      auditService
    );
    const document = await documentsService.createDocument({
      title: "Acceptance Notes",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "writer-1",
      structuredFields: {
        outcome: "pending"
      },
      markdown: "Initial notes"
    });

    await acceptanceService.rejectStory({
      storyId: "story-1",
      actorId: "reviewer-1",
      reason: "Criterion missing.",
      operatedAt: "2026-06-04T22:00:00.000Z"
    });
    await acceptanceService.reopenStory({
      storyId: "story-1",
      actorId: "developer-1",
      reason: "Fix is in progress.",
      operatedAt: "2026-06-04T23:00:00.000Z"
    });
    await acceptanceService.approveStory({
      storyId: "story-1",
      actorId: "reviewer-1",
      operatedAt: "2026-06-05T00:00:00.000Z"
    });
    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "writer-1",
      markdown: "Updated notes"
    });

    assert.deepEqual(
      (await auditService.listByObject("story", "story-1")).map(
        (entry) => entry.action
      ),
      [
        "ACCEPTANCE_REJECTED",
        "ACCEPTANCE_REOPENED",
        "ACCEPTANCE_APPROVED"
      ]
    );
    assert.deepEqual(
      (await auditService.listByObject("document", document.id)).map(
        (entry) => entry.action
      ),
      ["DOCUMENT_UPDATED"]
    );
  });
});
