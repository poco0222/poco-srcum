/**
 * @file Dashboard API client for Phase 2 document collaboration status.
 * @author PopoY
 * @created 2026-06-10
 */
import type {
  LinkageObjectTypeValue,
  LinkageRelationTypeValue
} from "@poco-scrum/domain";
import type { SearchResultCard } from "@poco-scrum/shared";

export type IncompleteLinkCard = {
  objectType: LinkageObjectTypeValue;
  objectId: string;
  title: string;
  missingRelation: LinkageRelationTypeValue;
  updatedAt: string;
};

export type DocumentCollaborationDashboard = {
  pendingReviewDocuments: SearchResultCard[];
  recentUpdates: SearchResultCard[];
  incompleteLinks: IncompleteLinkCard[];
};

/**
 * Resolve the API origin without coupling dashboard pages to environment variables.
 */
export function getDashboardApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * @returns The fixed document collaboration dashboard API path.
 */
export function buildDocumentDashboardPath() {
  return "/dashboard/documents";
}

/**
 * @returns The document collaboration dashboard payload, or an empty shell on malformed responses.
 */
export async function getDocumentDashboard() {
  const response = await fetch(
    `${getDashboardApiBaseUrl()}${buildDocumentDashboardPath()}`,
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

    throw new Error(payload?.message ?? "DASHBOARD_API_REQUEST_FAILED");
  }

  return (await response.json()) as DocumentCollaborationDashboard;
}
