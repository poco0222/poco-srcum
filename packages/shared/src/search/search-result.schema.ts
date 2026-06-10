/**
 * @file Shared search result card schema for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  DocumentReviewStatus,
  LinkageObjectType,
  type DocumentReviewStatusValue,
  type LinkageObjectTypeValue
} from "@poco-scrum/domain";

/**
 * Frozen fields indexed by the Phase 2 basic search implementation.
 */
export const SearchScopeField = {
  TITLE: "title",
  NUMBER: "number",
  TAG: "tag",
  STRUCTURED_FIELD: "structured-field",
  MARKDOWN_BODY: "markdown-body"
} as const;

export type SearchScopeFieldValue =
  (typeof SearchScopeField)[keyof typeof SearchScopeField];

export type SearchResultCard = {
  objectType: LinkageObjectTypeValue;
  objectId: string;
  title: string;
  snippet: string;
  relationSummary: string[];
  reviewStatus: DocumentReviewStatusValue | null;
  updatedAt: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const linkageObjectTypeValues = new Set<LinkageObjectTypeValue>(
  Object.values(LinkageObjectType)
);
const documentReviewStatusValues = new Set<DocumentReviewStatusValue>(
  Object.values(DocumentReviewStatus)
);

/**
 * Validate the stable card contract shared by API and web search surfaces.
 */
export const SearchResultCardSchema: Schema<SearchResultCard> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SEARCH_RESULT_CARD_INVALID");
    }

    const candidate = input as Partial<SearchResultCard>;

    return {
      objectType: normalizeObjectType(candidate.objectType),
      objectId: normalizeRequiredText(
        candidate.objectId,
        "SEARCH_RESULT_CARD_INVALID"
      ),
      title: normalizeRequiredText(candidate.title, "SEARCH_RESULT_CARD_INVALID"),
      snippet: normalizeRequiredText(
        candidate.snippet,
        "SEARCH_RESULT_CARD_INVALID"
      ),
      relationSummary: normalizeRelationSummary(candidate.relationSummary),
      reviewStatus: normalizeNullableReviewStatus(candidate.reviewStatus),
      updatedAt: normalizeRequiredText(
        candidate.updatedAt,
        "SEARCH_RESULT_CARD_INVALID"
      )
    };
  }
};

/**
 * @param value The unknown object type value.
 * @returns A frozen linkage object type.
 */
function normalizeObjectType(value: unknown): LinkageObjectTypeValue {
  if (
    typeof value !== "string" ||
    !linkageObjectTypeValues.has(value as LinkageObjectTypeValue)
  ) {
    throw new TypeError("SEARCH_RESULT_CARD_INVALID");
  }

  return value as LinkageObjectTypeValue;
}

/**
 * @param value The unknown relation summary value.
 * @returns A list of non-empty relation summary strings.
 */
function normalizeRelationSummary(value: unknown) {
  if (!Array.isArray(value)) {
    throw new TypeError("SEARCH_RESULT_CARD_INVALID");
  }

  return value.map((item) =>
    normalizeRequiredText(item, "SEARCH_RESULT_CARD_INVALID")
  );
}

/**
 * @param value The unknown review status value.
 * @returns A review status or null for non-document objects.
 */
function normalizeNullableReviewStatus(
  value: unknown
): DocumentReviewStatusValue | null {
  if (value === null) {
    return null;
  }

  if (
    typeof value !== "string" ||
    !documentReviewStatusValues.has(value as DocumentReviewStatusValue)
  ) {
    throw new TypeError("SEARCH_RESULT_CARD_INVALID");
  }

  return value as DocumentReviewStatusValue;
}

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The validation error code to throw on failure.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string) {
  if (typeof value !== "string") {
    throw new TypeError(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new TypeError(errorMessage);
  }

  return normalized;
}
