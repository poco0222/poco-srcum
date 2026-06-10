/**
 * @file Document review lifecycle enums for Phase 2 collaboration.
 * @author PopoY
 * @created 2026-06-10
 */

/**
 * Minimum formal review statuses supported by Phase 2 Task 2.
 */
export const DocumentReviewStatus = {
  DRAFT: "draft",
  IN_REVIEW: "in-review",
  APPROVED: "approved",
  REJECTED: "rejected"
} as const;

export type DocumentReviewStatusValue =
  (typeof DocumentReviewStatus)[keyof typeof DocumentReviewStatus];
