/**
 * @file Dashboard page for Phase 2 document collaboration status.
 * @author PopoY
 * @created 2026-06-10
 */
import { getDocumentDashboard } from "../../../features/dashboard/api/dashboard-client";
import {
  contentGridStyle,
  copyStyle,
  headingStyle,
  metricsGridStyle,
  pageStyle,
  shellStyle
} from "../../../features/dashboard/components/dashboard-layout.styles";
import { DashboardListCard } from "../../../features/dashboard/components/dashboard-list-card";
import { DashboardMetricCard } from "../../../features/dashboard/components/dashboard-metric-card";
import { SearchResultCard } from "../../../features/search/components/search-result-card";

/**
 * @returns The lightweight document collaboration dashboard required by P2.
 */
export default async function DashboardPage() {
  const dashboard = await getDocumentDashboard().catch(() => ({
    pendingReviewDocuments: [],
    recentUpdates: [],
    incompleteLinks: []
  }));

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header>
          <h1 style={headingStyle}>Document Collaboration Dashboard</h1>
          <p style={copyStyle}>
            Track pending reviews, recent updates, and incomplete evidence links
            without expanding into portfolio reporting.
          </p>
        </header>
        <section aria-label="Dashboard metrics" style={metricsGridStyle}>
          <DashboardMetricCard
            description="Formal documents currently waiting for review decision."
            href="/search?reviewStatus=in-review"
            title="Pending review"
            value={dashboard.pendingReviewDocuments.length}
          />
          <DashboardMetricCard
            description="Recently updated evidence objects available for inspection."
            href="/search"
            title="Recent updates"
            value={dashboard.recentUpdates.length}
          />
          <DashboardMetricCard
            description="Objects missing the next required delivery-chain relation."
            href="/dashboard"
            title="Incomplete links"
            value={dashboard.incompleteLinks.length}
          />
        </section>
        <section aria-label="Dashboard detail cards" style={contentGridStyle}>
          <DashboardListCard
            emptyText="No incomplete evidence links."
            items={dashboard.incompleteLinks}
            title="Incomplete links"
          />
          <div style={{ display: "grid", gap: "12px" }}>
            {dashboard.recentUpdates.map((result) => (
              <SearchResultCard
                key={`${result.objectType}:${result.objectId}`}
                result={result}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
