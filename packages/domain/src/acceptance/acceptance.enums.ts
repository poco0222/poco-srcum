/**
 * @file Acceptance lifecycle enum for the Phase 1 formal Story approval gate.
 * @author PopoY
 * @created 2026-06-04
 */

export const AcceptanceStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REOPENED: "REOPENED"
} as const;

export type AcceptanceStatusValue =
  (typeof AcceptanceStatus)[keyof typeof AcceptanceStatus];
