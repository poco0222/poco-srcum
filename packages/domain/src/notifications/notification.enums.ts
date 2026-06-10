/**
 * @file Notification event enum for Phase 1 Scrum core events.
 * @author PopoY
 * @created 2026-06-04
 */

export const NotificationEventType = {
  ACCEPTANCE_APPROVED: "ACCEPTANCE_APPROVED",
  ACCEPTANCE_REJECTED: "ACCEPTANCE_REJECTED",
  ACCEPTANCE_REOPENED: "ACCEPTANCE_REOPENED",
  DOCUMENT_COMMENT_MENTIONED: "DOCUMENT_COMMENT_MENTIONED",
  DOCUMENT_UPDATED: "DOCUMENT_UPDATED"
} as const;

export type NotificationEventTypeValue =
  (typeof NotificationEventType)[keyof typeof NotificationEventType];
