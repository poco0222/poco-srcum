/**
 * @file Sprint lifecycle transition contract for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { SprintStatus, type SprintStatusValue } from "./sprint.enums";

export type SprintTransitionMap = Record<
  SprintStatusValue,
  readonly SprintStatusValue[]
>;

/**
 * Keep the allowed Sprint status transitions in one place so every API flow reuses it.
 */
export const SprintAllowedTransitions: SprintTransitionMap = {
  [SprintStatus.DRAFT]: [SprintStatus.PLANNED],
  [SprintStatus.PLANNED]: [SprintStatus.ACTIVE],
  [SprintStatus.ACTIVE]: [SprintStatus.ENDED],
  [SprintStatus.ENDED]: [SprintStatus.CLOSED],
  [SprintStatus.CLOSED]: []
};

/**
 * @param currentStatus The current Sprint lifecycle status.
 * @param nextStatus The next target status.
 * @returns True when the transition is allowed by the frozen Phase 1 contract.
 */
export function canTransitionSprintStatus(
  currentStatus: SprintStatusValue,
  nextStatus: SprintStatusValue
) {
  return SprintAllowedTransitions[currentStatus].includes(nextStatus);
}

/**
 * @param currentStatus The current Sprint lifecycle status.
 * @param nextStatus The next target status.
 * @throws Error when the transition is outside the frozen Phase 1 contract.
 */
export function assertSprintStatusTransition(
  currentStatus: SprintStatusValue,
  nextStatus: SprintStatusValue
) {
  if (!canTransitionSprintStatus(currentStatus, nextStatus)) {
    throw new Error("SPRINT_STATUS_TRANSITION_INVALID");
  }
}
