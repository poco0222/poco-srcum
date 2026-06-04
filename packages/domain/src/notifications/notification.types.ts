/**
 * @file Notification record types for Phase 1 in-app notifications.
 * @author PopoY
 * @created 2026-06-04
 */
import type { NotificationEventTypeValue } from "./notification.enums";

export type NotificationRecord = {
  id: string;
  recipientId: string;
  actorId: string;
  eventType: NotificationEventTypeValue;
  objectType: string;
  objectId: string;
  reason: string;
  createdAt: string;
  readAt: string | null;
};
