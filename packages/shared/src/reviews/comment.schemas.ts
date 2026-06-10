/**
 * @file Shared document comment schemas for Phase 2 review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { CommentAnchorType } from "@poco-scrum/domain";
import type { CommentAnchorTypeValue } from "@poco-scrum/domain";

export type CreateDocumentCommentInput = {
  documentId: string;
  parentCommentId?: string;
  authorId: string;
  anchorType: CommentAnchorTypeValue;
  anchorRef: string;
  body: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const commentAnchorTypeValues = new Set<CommentAnchorTypeValue>(
  Object.values(CommentAnchorType)
);

/**
 * Parse the minimum command used to create document comments and replies.
 */
export const CreateDocumentCommentInputSchema: Schema<CreateDocumentCommentInput> =
  {
    parse(input) {
      if (typeof input !== "object" || input === null) {
        throw new TypeError("DOCUMENT_COMMENT_INPUT_INVALID");
      }

      const candidate = input as Partial<CreateDocumentCommentInput>;

      if (
        typeof candidate.anchorType !== "string" ||
        !commentAnchorTypeValues.has(
          candidate.anchorType as CommentAnchorTypeValue
        )
      ) {
        throw new TypeError("DOCUMENT_COMMENT_INPUT_INVALID");
      }

      const parsed: CreateDocumentCommentInput = {
        documentId: normalizeRequiredText(
          candidate.documentId,
          "DOCUMENT_COMMENT_INPUT_INVALID"
        ),
        authorId: normalizeRequiredText(
          candidate.authorId,
          "DOCUMENT_COMMENT_INPUT_INVALID"
        ),
        anchorType: candidate.anchorType as CommentAnchorTypeValue,
        anchorRef: normalizeRequiredText(
          candidate.anchorRef,
          "DOCUMENT_COMMENT_INPUT_INVALID"
        ),
        body: normalizeRequiredText(
          candidate.body,
          "DOCUMENT_COMMENT_INPUT_INVALID"
        )
      };

      if (candidate.parentCommentId !== undefined) {
        parsed.parentCommentId = normalizeRequiredText(
          candidate.parentCommentId,
          "DOCUMENT_COMMENT_INPUT_INVALID"
        );
      }

      return parsed;
    }
  };

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The validation error code to throw on failure.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string): string {
  if (typeof value !== "string") {
    throw new TypeError(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new TypeError(errorMessage);
  }

  return normalized;
}
