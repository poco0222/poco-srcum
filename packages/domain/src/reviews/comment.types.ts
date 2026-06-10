/**
 * @file Document comment record types for Phase 2 review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import type { CommentAnchorTypeValue } from "./comment.enums";

export type DocumentCommentRecord = {
  id: string;
  documentId: string;
  parentCommentId: string | null;
  authorId: string;
  anchorType: CommentAnchorTypeValue;
  anchorRef: string;
  body: string;
  mentionedUserIds: string[];
  createdAt: string;
  updatedAt: string;
};
