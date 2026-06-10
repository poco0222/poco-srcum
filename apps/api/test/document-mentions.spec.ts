/**
 * @file Document mention notification regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  DocumentTargetType,
  DocumentType,
  NotificationEventType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import { NotificationsService } from "../src/modules/notifications/notifications.service";
import {
  CommentsService,
  InMemoryDocumentCommentsRepository
} from "../src/modules/comments/comments.service";

describe("Document comment mentions", () => {
  it("notifies each mentioned user once when a comment is created", async () => {
    const notificationsService = new NotificationsService();
    const documentsService = new DocumentsService(
      undefined,
      1,
      undefined,
      undefined,
      new DocumentTemplatesService()
    );
    const document = await documentsService.createFormalDocument({
      title: "Mention Notification Draft",
      documentType: DocumentType.TECHNICAL_SOLUTION,
      templateId: "default-technical-solution",
      targetType: DocumentTargetType.STORY,
      targetId: "story-1",
      authorId: "author-1",
      structuredFields: {
        architectureSummary: "Use the existing modular monolith boundary.",
        ownerTeam: "Platform",
        riskLevel: "MEDIUM"
      },
      markdown: "## Context\n\nMention notifications should stay in-app."
    });
    const commentsService = new CommentsService(
      documentsService,
      notificationsService,
      new InMemoryDocumentCommentsRepository()
    );

    const comment = await commentsService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.MARKDOWN_BLOCK,
      anchorRef: "Architecture",
      body: "请 @user:reviewer-1 和 @user:qa-1 看一下，@user:reviewer-1 已重复。"
    });
    const reviewerNotifications =
      await notificationsService.listByRecipient("reviewer-1");
    const qaNotifications = await notificationsService.listByRecipient("qa-1");

    assert.deepEqual(comment.mentionedUserIds, ["reviewer-1", "qa-1"]);
    assert.equal(reviewerNotifications.length, 1);
    assert.equal(qaNotifications.length, 1);
    assert.equal(
      reviewerNotifications[0]?.eventType,
      NotificationEventType.DOCUMENT_COMMENT_MENTIONED
    );
    assert.equal(reviewerNotifications[0]?.actorId, "author-1");
    assert.equal(reviewerNotifications[0]?.objectType, "document-comment");
    assert.equal(reviewerNotifications[0]?.objectId, comment.id);
    assert.equal(reviewerNotifications[0]?.reason, "Document comment mentioned user");
  });
});
