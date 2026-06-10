/**
 * @file Document comment panel regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CommentAnchorType } from "@poco-scrum/domain";
import { DocumentCommentPanel } from "./comment-panel";

describe("DocumentCommentPanel", () => {
  it("renders anchored comments, replies, and mentioned users", () => {
    const html = renderToStaticMarkup(
      createElement(DocumentCommentPanel, {
        comments: [
          {
            id: "comment-1",
            documentId: "document-1",
            parentCommentId: null,
            authorId: "author-1",
            anchorType: CommentAnchorType.FIELD,
            anchorRef: "businessGoal",
            body: "请 @user:reviewer-1 评审业务目标。",
            mentionedUserIds: ["reviewer-1"],
            createdAt: "2026-06-10T12:00:00.000Z",
            updatedAt: "2026-06-10T12:00:00.000Z"
          },
          {
            id: "comment-2",
            documentId: "document-1",
            parentCommentId: "comment-1",
            authorId: "reviewer-1",
            anchorType: CommentAnchorType.FIELD,
            anchorRef: "businessGoal",
            body: "业务目标已确认。",
            mentionedUserIds: [],
            createdAt: "2026-06-10T12:05:00.000Z",
            updatedAt: "2026-06-10T12:05:00.000Z"
          }
        ]
      })
    );

    assert.match(html, /Document comments/);
    assert.match(html, /businessGoal/);
    assert.match(html, /请 @user:reviewer-1 评审业务目标。/);
    assert.match(html, /Mentioned: reviewer-1/);
    assert.match(html, /Reply to comment-1/);
    assert.match(html, /业务目标已确认。/);
  });
});
