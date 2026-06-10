/**
 * @file Document review lifecycle transition contract for Phase 2 collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  DocumentReviewStatus,
  type DocumentReviewStatusValue
} from "./review.enums";

export type DocumentReviewTransitionMap = Record<
  DocumentReviewStatusValue,
  readonly DocumentReviewStatusValue[]
>;

/**
 * Keep review transitions small so P2 does not become a workflow engine.
 */
export const DocumentReviewAllowedTransitions: DocumentReviewTransitionMap = {
  [DocumentReviewStatus.DRAFT]: [DocumentReviewStatus.IN_REVIEW],
  [DocumentReviewStatus.IN_REVIEW]: [
    DocumentReviewStatus.APPROVED,
    DocumentReviewStatus.REJECTED,
    DocumentReviewStatus.DRAFT
  ],
  [DocumentReviewStatus.APPROVED]: [DocumentReviewStatus.DRAFT],
  [DocumentReviewStatus.REJECTED]: [DocumentReviewStatus.DRAFT]
};

/**
 * @param currentStatus The current formal document review status.
 * @param nextStatus The next target formal document review status.
 * @returns True when the transition is allowed by the P2 contract.
 */
export function canTransitionDocumentReviewStatus(
  currentStatus: DocumentReviewStatusValue,
  nextStatus: DocumentReviewStatusValue
) {
  return DocumentReviewAllowedTransitions[currentStatus].includes(nextStatus);
}

/**
 * @param currentStatus The current formal document review status.
 * @param nextStatus The next target formal document review status.
 * @throws Error when the transition is outside the P2 contract.
 */
export function assertDocumentReviewStatusTransition(
  currentStatus: DocumentReviewStatusValue,
  nextStatus: DocumentReviewStatusValue
) {
  if (!canTransitionDocumentReviewStatus(currentStatus, nextStatus)) {
    throw new Error("DOCUMENT_REVIEW_STATUS_TRANSITION_INVALID");
  }
}

/**
 * @param submittedVersionId The version that was submitted for review.
 * @param latestVersionId The latest known document version.
 * @returns True when a review decision may approve or reject that version.
 */
export function canApproveDocumentReviewVersion(
  submittedVersionId: string,
  latestVersionId: string
) {
  return submittedVersionId === latestVersionId;
}
