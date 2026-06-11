/**
 * @file Portfolio API client for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type {
  PortfolioFilter,
  PortfolioOverview
} from "@poco-scrum/domain";

/**
 * Resolve the API origin without coupling Portfolio pages to environment variables.
 */
export function getPortfolioApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * @param filters Optional Portfolio filters to encode in the query string.
 * @returns A stable Portfolio API path.
 */
export function buildPortfolioQueryPath(filters: PortfolioFilter = {}) {
  const params = new URLSearchParams();

  appendQueryParam(params, "portfolioId", filters.portfolioId);
  appendQueryParam(params, "projectId", filters.projectId);
  appendQueryParam(params, "projectStatus", filters.projectStatus);
  appendQueryParam(params, "milestoneFrom", filters.milestoneFrom);
  appendQueryParam(params, "milestoneTo", filters.milestoneTo);

  const queryString = params.toString();

  return queryString.length > 0 ? `/portfolio?${queryString}` : "/portfolio";
}

/**
 * @param filters Optional Portfolio filters to send to the API.
 * @returns Portfolio overview data.
 */
export async function getPortfolioOverview(filters: PortfolioFilter = {}) {
  const response = await fetch(
    `${getPortfolioApiBaseUrl()}${buildPortfolioQueryPath(filters)}`,
    {
      headers: {
        "content-type": "application/json"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "PORTFOLIO_API_REQUEST_FAILED");
  }

  return (await response.json()) as PortfolioOverview;
}

/**
 * @param params The query string builder.
 * @param key The query parameter key.
 * @param value The optional value to append.
 */
function appendQueryParam(
  params: URLSearchParams,
  key: string,
  value?: string
) {
  const normalized = value?.trim() ?? "";

  if (normalized.length > 0) {
    params.set(key, normalized);
  }
}
