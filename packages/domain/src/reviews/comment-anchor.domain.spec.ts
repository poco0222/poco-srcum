/**
 * @file Comment anchor and mention token regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  buildDocumentCommentAnchor,
  buildFieldCommentAnchor,
  buildMarkdownBlockCommentAnchor,
  parseCommentMentionTokens
} from "../index";

describe("comment anchors", () => {
  it("freezes the supported Phase 2 comment anchor types", () => {
    assert.deepEqual(CommentAnchorType, {
      DOCUMENT: "document",
      FIELD: "field",
      MARKDOWN_BLOCK: "markdown-block"
    });
  });

  it("builds a stable document-level anchor", () => {
    assert.deepEqual(buildDocumentCommentAnchor("doc-1"), {
      type: CommentAnchorType.DOCUMENT,
      documentId: "doc-1"
    });
  });

  it("builds a stable structured-field anchor", () => {
    assert.deepEqual(buildFieldCommentAnchor("doc-1", "businessGoal"), {
      type: CommentAnchorType.FIELD,
      documentId: "doc-1",
      fieldKey: "businessGoal"
    });
  });

  it("builds a stable markdown-block anchor without text-range selection", () => {
    assert.deepEqual(buildMarkdownBlockCommentAnchor("doc-1", "Acceptance Criteria"), {
      type: CommentAnchorType.MARKDOWN_BLOCK,
      documentId: "doc-1",
      blockRef: "Acceptance Criteria"
    });
  });
});

describe("comment mention tokens", () => {
  it("parses unique @user mention tokens in first-seen order", () => {
    assert.deepEqual(
      parseCommentMentionTokens("请 @user:po-1 和 @user:qa_2 评审，@user:po-1 已重复。"),
      ["po-1", "qa_2"]
    );
  });

  it("ignores unsupported free-text mention formats", () => {
    assert.deepEqual(
      parseCommentMentionTokens("请 @po-1、@team:backend 和 @user: 评审。"),
      []
    );
  });
});
