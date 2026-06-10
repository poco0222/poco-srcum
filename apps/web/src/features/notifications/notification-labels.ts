/**
 * @file Notification labels for Phase 1 in-app notifications.
 * @author PopoY
 * @created 2026-06-04
 */
import { NotificationEventType, type NotificationEventTypeValue } from "@poco-scrum/domain";

/**
 * @param eventType The notification event type.
 * @returns The compact user-facing label for the notification list.
 */
export function getNotificationLabel(eventType: NotificationEventTypeValue) {
  switch (eventType) {
    case NotificationEventType.ACCEPTANCE_APPROVED:
      return "Acceptance approved";
    case NotificationEventType.ACCEPTANCE_REJECTED:
      return "Acceptance rejected";
    case NotificationEventType.ACCEPTANCE_REOPENED:
      return "Acceptance reopened";
    case NotificationEventType.DOCUMENT_COMMENT_MENTIONED:
      return "Document comment mention";
    case NotificationEventType.DOCUMENT_UPDATED:
      return "Document updated";
  }
}
