/**
 * @file Search page for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import type {
  DocumentReviewStatusValue,
  LinkageObjectTypeValue
} from "@poco-scrum/domain";
import { listSearchResults } from "../../../features/search/api/search-client";
import {
  copyStyle,
  headerStyle,
  headingStyle,
  pageStyle,
  panelStyle,
  resultsGridStyle,
  shellStyle
} from "../../../features/search/components/search-layout.styles";
import { SearchFilters } from "../../../features/search/components/search-filters";
import { SearchResultCard } from "../../../features/search/components/search-result-card";

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * @param value The raw query string value from Next.js searchParams.
 * @returns A single string value.
 */
function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

/**
 * @param props The route props containing URL search parameters.
 * @returns The global search page for P2 document collaboration evidence.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) ?? {};
  const keyword = firstQueryValue(params.keyword);
  const objectType = firstQueryValue(params.objectType) as
    | LinkageObjectTypeValue
    | "";
  const reviewStatus = firstQueryValue(params.reviewStatus) as
    | DocumentReviewStatusValue
    | "";
  const hasQuery =
    keyword.trim().length > 0 ||
    objectType.length > 0 ||
    reviewStatus.length > 0;
  const results = hasQuery
    ? await listSearchResults({
        keyword,
        objectType: objectType || undefined,
        reviewStatus: reviewStatus || undefined
      }).catch(() => [])
    : [];

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={headerStyle}>
          <h1 style={headingStyle}>Evidence Search</h1>
          <p style={copyStyle}>
            Search formal document titles, structured fields, Markdown body, and
            review metadata without indexing attachment full text.
          </p>
        </header>
        <SearchFilters
          keyword={keyword}
          objectType={objectType || undefined}
          reviewStatus={reviewStatus || undefined}
        />
        <section aria-label="Search results" style={resultsGridStyle}>
          {results.length > 0 ? (
            results.map((result) => (
              <SearchResultCard key={`${result.objectType}:${result.objectId}`} result={result} />
            ))
          ) : (
            <div style={panelStyle}>
              <p style={copyStyle}>
                {hasQuery
                  ? "No matching evidence found for the current filters."
                  : "Enter a keyword to search the Phase 2 evidence chain."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
