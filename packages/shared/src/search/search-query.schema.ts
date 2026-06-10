/**
 * @file Shared search query schema for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  DocumentReviewStatus,
  LinkageObjectType,
  type DocumentReviewStatusValue,
  type LinkageObjectTypeValue
} from "@poco-scrum/domain";

export type SearchQueryInput = {
  keyword: string;
  objectType?: LinkageObjectTypeValue;
  reviewStatus?: DocumentReviewStatusValue;
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
 * Parse user-entered search filters while keeping scope fixed to Phase 2 fields.
 */
export const SearchQueryInputSchema: Schema<SearchQueryInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("SEARCH_QUERY_INPUT_INVALID");
    }

    const candidate = input as Partial<SearchQueryInput>;
    const parsed: SearchQueryInput = {
      keyword: normalizeKeyword(candidate.keyword)
    };

    if (candidate.objectType !== undefined) {
      parsed.objectType = normalizeObjectType(candidate.objectType);
    }

    if (candidate.reviewStatus !== undefined) {
      parsed.reviewStatus = normalizeReviewStatus(candidate.reviewStatus);
    }

    return parsed;
  }
};

/**
 * @param value The unknown keyword value.
 * @returns A trimmed keyword string, or an empty string for omitted filters.
 */
function normalizeKeyword(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new TypeError("SEARCH_QUERY_INPUT_INVALID");
  }

  return value.trim();
}

/**
 * @param value The unknown object type filter.
 * @returns A frozen linkage object type.
 */
function normalizeObjectType(value: unknown): LinkageObjectTypeValue {
  if (
    typeof value !== "string" ||
    !linkageObjectTypeValues.has(value as LinkageObjectTypeValue)
  ) {
    throw new TypeError("SEARCH_QUERY_INPUT_INVALID");
  }

  return value as LinkageObjectTypeValue;
}

/**
 * @param value The unknown review status filter.
 * @returns A frozen document review status.
 */
function normalizeReviewStatus(value: unknown): DocumentReviewStatusValue {
  if (
    typeof value !== "string" ||
    !documentReviewStatusValues.has(value as DocumentReviewStatusValue)
  ) {
    throw new TypeError("SEARCH_QUERY_INPUT_INVALID");
  }

  return value as DocumentReviewStatusValue;
}
