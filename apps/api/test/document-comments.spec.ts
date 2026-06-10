/**
 * @file Document comment regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentsService } from "../src/modules/documents/documents.service";
import {
  CommentsService,
  InMemoryDocumentCommentsRepository
} from "../src/modules/comments/comments.service";

/**
 * @returns A formal requirement document and its service for comment tests.
 */
async function createFormalDocument() {
  const documentsService = new DocumentsService(
    undefined,
    1,
    undefined,
    undefined,
    new DocumentTemplatesService()
  );
  const document = await documentsService.createFormalDocument({
    title: "Requirement Comment Draft",
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
    markdown: "## Background\n\nFormal document comment payload."
  });

  return {
    document,
    documentsService
  };
}

describe("Document comments", () => {
  it("creates a document-level comment with parsed mentions", async () => {
    const { document, documentsService } = await createFormalDocument();
    const commentsService = new CommentsService(
      documentsService,
      undefined,
      new InMemoryDocumentCommentsRepository()
    );

    const comment = await commentsService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.DOCUMENT,
      anchorRef: document.id,
      body: "请 @user:reviewer-1 评审这份需求说明。"
    });

    assert.equal(comment.documentId, document.id);
    assert.equal(comment.authorId, "author-1");
    assert.equal(comment.anchorType, CommentAnchorType.DOCUMENT);
    assert.equal(comment.anchorRef, document.id);
    assert.equal(comment.parentCommentId, null);
    assert.deepEqual(comment.mentionedUserIds, ["reviewer-1"]);
  });

  it("creates a reply comment under the same formal document", async () => {
    const { document, documentsService } = await createFormalDocument();
    const commentsService = new CommentsService(
      documentsService,
      undefined,
      new InMemoryDocumentCommentsRepository()
    );
    const rootComment = await commentsService.createComment({
      documentId: document.id,
      authorId: "author-1",
      anchorType: CommentAnchorType.FIELD,
      anchorRef: "businessGoal",
      body: "请确认业务目标。"
    });

    const reply = await commentsService.createComment({
      documentId: document.id,
      parentCommentId: rootComment.id,
      authorId: "reviewer-1",
      anchorType: CommentAnchorType.FIELD,
      anchorRef: "businessGoal",
      body: "业务目标已经确认。"
    });
    const comments = await commentsService.listCommentsForDocument(document.id);

    assert.equal(reply.parentCommentId, rootComment.id);
    assert.equal(reply.documentId, document.id);
    assert.deepEqual(
      comments.map((comment) => comment.id),
      [rootComment.id, reply.id]
    );
  });

  it("rejects comments from users that fail the document comment access policy", async () => {
    const { document, documentsService } = await createFormalDocument();
    const commentsService = new CommentsService(
      documentsService,
      undefined,
      new InMemoryDocumentCommentsRepository(),
      async () => false
    );

    await assert.rejects(
      () =>
        commentsService.createComment({
          documentId: document.id,
          authorId: "outsider-1",
          anchorType: CommentAnchorType.DOCUMENT,
          anchorRef: document.id,
          body: "我不应该能评论。"
        }),
      {
        message: "DOCUMENT_COMMENT_ACCESS_DENIED"
      }
    );
  });
});
