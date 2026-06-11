/**
 * @file Document review and versioning API-level e2e for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  DocumentReviewStatus,
  DocumentTargetType,
  DocumentType,
  NotificationEventType
} from "@poco-scrum/domain";
import { CommentsService, InMemoryDocumentCommentsRepository } from "../../../apps/api/src/modules/comments/comments.service";
import { DocumentTemplatesService } from "../../../apps/api/src/modules/document-templates/document-templates.service";
import { DocumentVersionsService } from "../../../apps/api/src/modules/document-versions/document-versions.service";
import { DocumentsService } from "../../../apps/api/src/modules/documents/documents.service";
import { NotificationsService } from "../../../apps/api/src/modules/notifications/notifications.service";
import {
  InMemoryDocumentReviewsRepository,
  ReviewsService
} from "../../../apps/api/src/modules/reviews/reviews.service";

describe("Document review and versioning flow", () => {
  it("creates a document, comments, mentions, reviews, and reads version history", async () => {
    const notificationsService = new NotificationsService();
    const documentsService = new DocumentsService(
      undefined,
      1,
      notificationsService,
      undefined,
      new DocumentTemplatesService()
    );
    const versionsService = new DocumentVersionsService(documentsService);
    const commentsService = new CommentsService(
      documentsService,
      notificationsService,
      new InMemoryDocumentCommentsRepository()
    );
    const reviewsService = new ReviewsService(
      documentsService,
      new InMemoryDocumentReviewsRepository(),
      (documentId) => versionsService.getLatestVersionId(documentId),
      (versionId) => versionsService.getVersionById(versionId)
    );
    const document = await documentsService.createFormalDocument({
      title: "Reviewable Requirement",
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
      markdown: "## Background\n\nInitial reviewable requirement."
    });
    const version1 = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Initial formal draft"
    });
    const comment = await commentsService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.MARKDOWN_BLOCK,
      anchorRef: "Background",
      body: "请 @user:reviewer-1 先看背景。"
    });

    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: version1.id
    });
    const rejected = await reviewsService.rejectReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: version1.id,
      conclusion: "需要补充验收标准。"
    });
    await reviewsService.returnToDraft({
      documentId: document.id,
      actorId: "author-1",
      reason: "补充验收标准后重新提交。"
    });
    await documentsService.updateDocument({
      documentId: document.id,
      editorId: "author-1",
      markdown: "## Background\n\nUpdated requirement.\n\n## Acceptance Criteria\n\n- Review evidence is stored."
    });
    const version2 = await versionsService.createVersionSnapshot({
      documentId: document.id,
      actorId: "author-1",
      changeSummary: "Added acceptance criteria"
    });
    await reviewsService.submitReview({
      documentId: document.id,
      actorId: "author-1",
      versionId: version2.id
    });
    const approved = await reviewsService.approveReview({
      documentId: document.id,
      actorId: "reviewer-1",
      versionId: version2.id,
      conclusion: "评审通过。"
    });
    const versions = await versionsService.listVersionsForDocument(document.id);
    const reviewerNotifications =
      await notificationsService.listByRecipient("reviewer-1");

    assert.equal(comment.mentionedUserIds[0], "reviewer-1");
    assert.equal(rejected.status, DocumentReviewStatus.REJECTED);
    assert.equal(approved.status, DocumentReviewStatus.APPROVED);
    assert.equal(approved.submittedVersionId, version2.id);
    assert.deepEqual(
      versions.map((version) => version.changeSummary),
      ["Initial formal draft", "Added acceptance criteria"]
    );
    assert.equal(
      reviewerNotifications[0]?.eventType,
      NotificationEventType.DOCUMENT_COMMENT_MENTIONED
    );
  });
});
