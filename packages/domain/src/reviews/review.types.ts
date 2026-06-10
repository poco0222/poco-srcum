/**
 * @file Document review record types for Phase 2 collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import type { DocumentReviewStatusValue } from "./review.enums";

export type DocumentReviewRecord = {
  id: string;
  documentId: string;
  status: DocumentReviewStatusValue;
  submittedVersionId: string;
  submittedById: string | null;
  submittedAt: string | null;
  decidedById: string | null;
  conclusion: string | null;
  decidedAt: string | null;
  updatedAt: string;
};
