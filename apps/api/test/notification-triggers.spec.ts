/**
 * @file Notification trigger regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentTargetType, NotificationEventType, WorkItemPriority, WorkItemStatus, WorkItemType } from "@poco-scrum/domain";
import { AcceptanceService } from "../src/modules/acceptance/acceptance.service";
import { InMemoryStoryAcceptanceRepository } from "../src/modules/acceptance/acceptance.repository";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { NotificationsService } from "../src/modules/notifications/notifications.service";
import { InMemoryWorkItemsRepository } from "../src/modules/work-items/work-items.repository";

describe("notification triggers", () => {
  it("notifies Story assignee and actor for acceptance approval, rejection, and reopen", async () => {
    const notificationsService = new NotificationsService();
    const workItemsRepository = new InMemoryWorkItemsRepository([
      {
        id: "story-1",
        type: WorkItemType.STORY,
        title: "Notify acceptance events",
        status: WorkItemStatus.IN_REVIEW,
        priority: WorkItemPriority.HIGH,
        storyPoints: 5,
        acceptanceCriteria: ["Acceptance events notify the owner."],
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
      notificationsService
    );

    await acceptanceService.rejectStory({
      storyId: "story-1",
      actorId: "reviewer-1",
      reason: "Result did not meet one acceptance criterion.",
      operatedAt: "2026-06-04T19:00:00.000Z"
    });
    await acceptanceService.reopenStory({
      storyId: "story-1",
      actorId: "developer-1",
      reason: "Implementation restarted after rejection.",
      operatedAt: "2026-06-04T20:00:00.000Z"
    });
    await acceptanceService.approveStory({
      storyId: "story-1",
      actorId: "reviewer-1",
      operatedAt: "2026-06-04T21:00:00.000Z"
    });

    const developerNotifications =
      await notificationsService.listByRecipient("developer-1");

    assert.deepEqual(
      developerNotifications.map((notification) => notification.eventType),
      [
        NotificationEventType.ACCEPTANCE_REJECTED,
        NotificationEventType.ACCEPTANCE_REOPENED,
        NotificationEventType.ACCEPTANCE_APPROVED
      ]
    );
    assert.equal(developerNotifications[0]?.reason, "Story acceptance rejected");
    assert.equal(developerNotifications[0]?.objectId, "story-1");
  });

  it("notifies the document target owner when a document is updated", async () => {
    const notificationsService = new NotificationsService();
    const documentsService = new DocumentsService(undefined, 1, notificationsService);
    const document = await documentsService.createDocument({
      title: "Acceptance Notes",
      targetType: DocumentTargetType.STORY,
      targetId: "story-2",
      authorId: "writer-1",
      structuredFields: {
        reviewer: "PopoY"
      },
      markdown: "Initial notes"
    });

    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "editor-1",
      markdown: "Updated notes"
    });

    const notifications = await notificationsService.listByRecipient("writer-1");

    assert.equal(notifications.length, 1);
    assert.equal(notifications[0]?.eventType, NotificationEventType.DOCUMENT_UPDATED);
    assert.equal(notifications[0]?.objectId, document.id);
    assert.equal(notifications[0]?.reason, "Document updated");
  });
});
