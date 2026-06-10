/**
 * @file Shared document review schemas for Phase 2 review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
export type SubmitDocumentReviewInput = {
  documentId: string;
  actorId: string;
  versionId: string;
};

export type DecideDocumentReviewInput = {
  documentId: string;
  actorId: string;
  versionId: string;
  conclusion: string;
};

export type ReturnDocumentReviewToDraftInput = {
  documentId: string;
  actorId: string;
  reason: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * Parse the command that submits a formal document version for review.
 */
export const SubmitDocumentReviewInputSchema: Schema<SubmitDocumentReviewInput> =
  {
    parse(input) {
      const candidate = parseRecord(input, "DOCUMENT_REVIEW_INPUT_INVALID");

      return {
        documentId: normalizeRequiredText(
          candidate.documentId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        actorId: normalizeRequiredText(
          candidate.actorId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        versionId: normalizeRequiredText(
          candidate.versionId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        )
      };
    }
  };

/**
 * Parse the command that approves or rejects a submitted document version.
 */
export const DecideDocumentReviewInputSchema: Schema<DecideDocumentReviewInput> =
  {
    parse(input) {
      const candidate = parseRecord(input, "DOCUMENT_REVIEW_INPUT_INVALID");

      return {
        documentId: normalizeRequiredText(
          candidate.documentId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        actorId: normalizeRequiredText(
          candidate.actorId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        versionId: normalizeRequiredText(
          candidate.versionId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        conclusion: normalizeRequiredText(
          candidate.conclusion,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        )
      };
    }
  };

/**
 * Parse the command that reopens a reviewed document into draft.
 */
export const ReturnDocumentReviewToDraftInputSchema: Schema<ReturnDocumentReviewToDraftInput> =
  {
    parse(input) {
      const candidate = parseRecord(input, "DOCUMENT_REVIEW_INPUT_INVALID");

      return {
        documentId: normalizeRequiredText(
          candidate.documentId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        actorId: normalizeRequiredText(
          candidate.actorId,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        ),
        reason: normalizeRequiredText(
          candidate.reason,
          "DOCUMENT_REVIEW_INPUT_INVALID"
        )
      };
    }
  };

/**
 * @param input The unknown payload to treat as an object.
 * @param errorMessage The validation error code to throw on failure.
 * @returns The payload as a record for field-level parsing.
 */
function parseRecord(input: unknown, errorMessage: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(errorMessage);
  }

  return input as Record<string, unknown>;
}

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
