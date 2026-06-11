/**
 * @file Portfolio view API contract for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */

/**
 * Frozen upstream source documents for the Portfolio view consumer contract.
 */
export const PortfolioViewContractSource = {
  project: "P1/P2 frozen project model",
  milestone: "P1 frozen sprint model",
  signals: "task-02-reporting-and-risk-tracking.md"
} as const;

/**
 * Consumer fields the Portfolio view is allowed to read from API responses.
 */
export const PortfolioViewContractFields = {
  project: [
    "id",
    "key",
    "name",
    "teamId",
    "status",
    "portfolioId",
    "portfolioName",
    "activeSprintCount",
    "doneWorkItemCount",
    "totalWorkItemCount"
  ],
  milestone: [
    "id",
    "projectId",
    "title",
    "kind",
    "status",
    "startsAt",
    "endsAt",
    "sourceType",
    "sourceId"
  ],
  signal: [
    "risk",
    "dependency",
    "delay",
    "source",
    "updatedAt"
  ]
} as const;
