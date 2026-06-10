/**
 * @file Comment collaboration enums for Phase 2 review workflows.
 * @author PopoY
 * @created 2026-06-10
 */

/**
 * Stable anchor levels supported by Phase 2 document comments.
 */
export const CommentAnchorType = {
  DOCUMENT: "document",
  FIELD: "field",
  MARKDOWN_BLOCK: "markdown-block"
} as const;

export type CommentAnchorTypeValue =
  (typeof CommentAnchorType)[keyof typeof CommentAnchorType];
