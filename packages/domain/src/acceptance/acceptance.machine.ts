/**
 * @file Acceptance lifecycle transition contract for the Phase 1 Story completion gate.
 * @author PopoY
 * @created 2026-06-04
 */
import { AcceptanceStatus, type AcceptanceStatusValue } from "./acceptance.enums";

export type AcceptanceTransitionMap = Record<
  AcceptanceStatusValue,
  readonly AcceptanceStatusValue[]
>;

/**
 * Keep the formal acceptance transitions strict so Story completion cannot bypass review.
 */
export const AcceptanceAllowedTransitions: AcceptanceTransitionMap = {
  [AcceptanceStatus.PENDING]: [
    AcceptanceStatus.APPROVED,
    AcceptanceStatus.REJECTED
  ],
  [AcceptanceStatus.APPROVED]: [],
  [AcceptanceStatus.REJECTED]: [AcceptanceStatus.REOPENED],
  [AcceptanceStatus.REOPENED]: [
    AcceptanceStatus.APPROVED,
    AcceptanceStatus.REJECTED
  ]
};

/**
 * @param currentStatus The current formal acceptance lifecycle status.
 * @param nextStatus The next target formal acceptance lifecycle status.
 * @returns True when the transition is allowed by the frozen Phase 1 contract.
 */
export function canTransitionAcceptanceStatus(
  currentStatus: AcceptanceStatusValue,
  nextStatus: AcceptanceStatusValue
) {
  return AcceptanceAllowedTransitions[currentStatus].includes(nextStatus);
}

/**
 * @param currentStatus The current formal acceptance lifecycle status.
 * @param nextStatus The next target formal acceptance lifecycle status.
 * @throws Error when the transition is outside the frozen Phase 1 contract.
 */
export function assertAcceptanceStatusTransition(
  currentStatus: AcceptanceStatusValue,
  nextStatus: AcceptanceStatusValue
) {
  if (!canTransitionAcceptanceStatus(currentStatus, nextStatus)) {
    throw new Error("ACCEPTANCE_STATUS_TRANSITION_INVALID");
  }
}

/**
 * @param acceptanceStatus The latest formal acceptance lifecycle status for a Story.
 * @returns True when the Story can satisfy the Phase 1 Definition of Done gate.
 */
export function canCompleteStoryWithAcceptance(
  acceptanceStatus: AcceptanceStatusValue
) {
  return acceptanceStatus === AcceptanceStatus.APPROVED;
}
