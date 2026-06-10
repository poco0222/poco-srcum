/**
 * @file Comment anchor and mention token helpers for Phase 2 document collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { CommentAnchorType } from "./comment.enums";
import type { CommentAnchorTypeValue } from "./comment.enums";

export type DocumentCommentAnchor = {
  type: typeof CommentAnchorType.DOCUMENT;
  documentId: string;
};

export type FieldCommentAnchor = {
  type: typeof CommentAnchorType.FIELD;
  documentId: string;
  fieldKey: string;
};

export type MarkdownBlockCommentAnchor = {
  type: typeof CommentAnchorType.MARKDOWN_BLOCK;
  documentId: string;
  blockRef: string;
};

export type CommentAnchor =
  | DocumentCommentAnchor
  | FieldCommentAnchor
  | MarkdownBlockCommentAnchor;

/**
 * Canonical mention token syntax shared by API notification triggers.
 */
export const CommentMentionTokenPattern = /@user:([A-Za-z0-9_-]+)/g;

/**
 * Creates a stable document-level comment anchor.
 *
 * @param documentId Formal document identifier.
 * @returns A document-level anchor.
 */
export function buildDocumentCommentAnchor(documentId: string): DocumentCommentAnchor {
  return {
    type: CommentAnchorType.DOCUMENT,
    documentId: normalizeAnchorPart(documentId, "documentId")
  };
}

/**
 * Creates a stable structured-field comment anchor.
 *
 * @param documentId Formal document identifier.
 * @param fieldKey Structured field key from the document type matrix.
 * @returns A field-level anchor.
 */
export function buildFieldCommentAnchor(
  documentId: string,
  fieldKey: string
): FieldCommentAnchor {
  return {
    type: CommentAnchorType.FIELD,
    documentId: normalizeAnchorPart(documentId, "documentId"),
    fieldKey: normalizeAnchorPart(fieldKey, "fieldKey")
  };
}

/**
 * Creates a stable markdown-block comment anchor without text-range selection.
 *
 * @param documentId Formal document identifier.
 * @param blockRef Markdown heading or canonical block reference.
 * @returns A markdown-block-level anchor.
 */
export function buildMarkdownBlockCommentAnchor(
  documentId: string,
  blockRef: string
): MarkdownBlockCommentAnchor {
  return {
    type: CommentAnchorType.MARKDOWN_BLOCK,
    documentId: normalizeAnchorPart(documentId, "documentId"),
    blockRef: normalizeAnchorPart(blockRef, "blockRef")
  };
}

/**
 * Parses unique user mention identifiers from the canonical `@user:<id>` syntax.
 *
 * @param body Comment body or review conclusion content.
 * @returns User identifiers in first-seen order.
 */
export function parseCommentMentionTokens(body: string): string[] {
  const mentionedUserIds = new Set<string>();

  for (const match of body.matchAll(CommentMentionTokenPattern)) {
    const userId = match[1];

    if (userId) {
      mentionedUserIds.add(userId);
    }
  }

  return [...mentionedUserIds];
}

/**
 * Checks whether a raw anchor type is part of the Phase 2 vocabulary.
 *
 * @param type Raw anchor type value.
 * @returns Whether the value is supported.
 */
export function isCommentAnchorType(
  type: string
): type is CommentAnchorTypeValue {
  return Object.values(CommentAnchorType).includes(
    type as CommentAnchorTypeValue
  );
}

/**
 * Normalizes an anchor component and rejects empty identifiers early.
 *
 * @param value Raw anchor part.
 * @param name Field name for the validation error.
 * @returns Trimmed anchor part.
 */
function normalizeAnchorPart(value: string, name: string): string {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new Error(`${name} is required for a comment anchor.`);
  }

  return normalizedValue;
}
