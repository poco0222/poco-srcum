/**
 * @file Document version summary schema for Phase 2 version snapshots.
 * @author PopoY
 * @created 2026-06-10
 */
export type CreateDocumentVersionInput = {
  documentId: string;
  actorId: string;
  changeSummary: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * Parse the version snapshot command shared by API and future UI entry points.
 */
export const CreateDocumentVersionInputSchema: Schema<CreateDocumentVersionInput> =
  {
    parse(input) {
      if (typeof input !== "object" || input === null) {
        throw new TypeError("DOCUMENT_VERSION_INPUT_INVALID");
      }

      const candidate = input as Partial<CreateDocumentVersionInput>;

      return {
        documentId: normalizeRequiredText(
          candidate.documentId,
          "DOCUMENT_VERSION_INPUT_INVALID"
        ),
        actorId: normalizeRequiredText(
          candidate.actorId,
          "DOCUMENT_VERSION_INPUT_INVALID"
        ),
        changeSummary: normalizeRequiredText(
          candidate.changeSummary,
          "DOCUMENT_VERSION_INPUT_INVALID"
        )
      };
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
