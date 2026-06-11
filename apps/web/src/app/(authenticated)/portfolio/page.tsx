/**
 * @file Portfolio roadmap page for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type {
  PortfolioFilter,
  ProjectStatusValue
} from "@poco-scrum/domain";
import {
  getPortfolioApiBaseUrl,
  getPortfolioOverview
} from "../../../features/portfolio/api/portfolio-client";
import { PortfolioPageContent } from "../../../features/portfolio/components/portfolio-page-content";
import { getCurrentUser } from "../../../lib/auth/get-current-user";

type PortfolioPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * @param value The raw query string value from Next.js searchParams.
 * @returns A single string value.
 */
export function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

/**
 * @param params The route search parameters.
 * @returns A Portfolio filter payload for API and UI state.
 */
export function buildPortfolioFilters(
  params: Record<string, string | string[] | undefined>
): PortfolioFilter {
  const filters: PortfolioFilter = {};
  const portfolioId = firstQueryValue(params.portfolioId).trim();
  const projectId = firstQueryValue(params.projectId).trim();
  const projectStatus = firstQueryValue(params.projectStatus).trim();
  const milestoneFrom = firstQueryValue(params.milestoneFrom).trim();
  const milestoneTo = firstQueryValue(params.milestoneTo).trim();

  if (portfolioId.length > 0) {
    filters.portfolioId = portfolioId;
  }

  if (projectId.length > 0) {
    filters.projectId = projectId;
  }

  if (projectStatus.length > 0) {
    filters.projectStatus = projectStatus as ProjectStatusValue;
  }

  if (milestoneFrom.length > 0) {
    filters.milestoneFrom = milestoneFrom;
  }

  if (milestoneTo.length > 0) {
    filters.milestoneTo = milestoneTo;
  }

  return filters;
}

/**
 * @param props The route props containing URL search parameters.
 * @returns The Portfolio roadmap page.
 */
export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = (await searchParams) ?? {};
  const filters = buildPortfolioFilters(params);
  const apiBaseUrl = getPortfolioApiBaseUrl();
  const currentUser = await getCurrentUser(
    apiBaseUrl,
    process.env.POCO_SESSION_USER_ID ?? "user-1"
  ).catch(() => null);
  let loadError: string | null = null;
  const overview = await getPortfolioOverview(filters).catch((error: unknown) => {
    loadError = error instanceof Error ? error.message : "PORTFOLIO_API_REQUEST_FAILED";
    return null;
  });

  return (
    <PortfolioPageContent
      currentUser={currentUser}
      filters={filters}
      loadError={loadError}
      overview={overview}
    />
  );
}
