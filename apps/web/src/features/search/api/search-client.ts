/**
 * @file Search API client for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import type {
  DocumentReviewStatusValue,
  LinkageObjectTypeValue
} from "@poco-scrum/domain";
import type { SearchResultCard } from "@poco-scrum/shared";

export type SearchClientQuery = {
  keyword: string;
  objectType?: LinkageObjectTypeValue;
  reviewStatus?: DocumentReviewStatusValue;
};

/**
 * Resolve the API origin without coupling search pages to environment variables.
 */
export function getSearchApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * @param query The keyword and optional filters to encode.
 * @returns A stable API search path with trimmed query parameters.
 */
export function buildSearchQueryPath(query: SearchClientQuery) {
  const params = new URLSearchParams();
  const keyword = query.keyword.trim();

  if (keyword.length > 0) {
    params.set("keyword", keyword);
  }

  if (query.objectType) {
    params.set("objectType", query.objectType);
  }

  if (query.reviewStatus) {
    params.set("reviewStatus", query.reviewStatus);
  }

  const queryString = params.toString();

  return queryString.length > 0 ? `/search?${queryString}` : "/search";
}

/**
 * @param query The keyword and optional filters to send to the API.
 * @returns Basic search result cards.
 */
export async function listSearchResults(query: SearchClientQuery) {
  const response = await fetch(`${getSearchApiBaseUrl()}${buildSearchQueryPath(query)}`, {
    headers: {
      "content-type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "SEARCH_API_REQUEST_FAILED");
  }

  const payload = (await response.json()) as unknown;

  return Array.isArray(payload) ? (payload as SearchResultCard[]) : [];
}
