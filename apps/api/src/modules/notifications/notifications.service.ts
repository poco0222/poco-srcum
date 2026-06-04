/**
 * @file In-app notification service for Phase 1 key Scrum events.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import type {
  NotificationEventTypeValue,
  NotificationRecord
} from "@poco-scrum/domain";

export type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  eventType: NotificationEventTypeValue;
  objectType: string;
  objectId: string;
  reason: string;
};

/**
 * Keep notification delivery in-app only for P1; external channels belong to later phases.
 */
export class NotificationsService {
  private readonly notifications = new Map<string, NotificationRecord[]>();
  private nextSequence = 1;

  /**
   * @param input The notification payload describing who receives what and why.
   * @returns The persisted in-app notification record.
   */
  async createNotification(input: CreateNotificationInput) {
    const payload = normalizeNotificationInput(input);
    const record: NotificationRecord = {
      id: `notification-${this.nextSequence++}`,
      ...payload,
      createdAt: new Date().toISOString(),
      readAt: null
    };
    const current = this.notifications.get(record.recipientId) ?? [];

    this.notifications.set(record.recipientId, [
      ...current,
      {
        ...record
      }
    ]);

    return {
      ...record
    };
  }

  /**
   * @param recipientId The user whose in-app notifications should be listed.
   * @returns Oldest-first notifications for deterministic review.
   */
  async listByRecipient(recipientId: string) {
    const normalizedRecipientId = normalizeRequiredText(
      recipientId,
      "NOTIFICATION_RECIPIENT_REQUIRED"
    );

    return (this.notifications.get(normalizedRecipientId) ?? []).map((record) => ({
      ...record
    }));
  }
}

export const sharedNotificationsService = new NotificationsService();

function normalizeNotificationInput(
  input: CreateNotificationInput
): CreateNotificationInput {
  return {
    recipientId: normalizeRequiredText(
      input.recipientId,
      "NOTIFICATION_INPUT_INVALID"
    ),
    actorId: normalizeRequiredText(input.actorId, "NOTIFICATION_INPUT_INVALID"),
    eventType: input.eventType,
    objectType: normalizeRequiredText(input.objectType, "NOTIFICATION_INPUT_INVALID"),
    objectId: normalizeRequiredText(input.objectId, "NOTIFICATION_INPUT_INVALID"),
    reason: normalizeRequiredText(input.reason, "NOTIFICATION_INPUT_INVALID")
  };
}

function normalizeRequiredText(value: unknown, errorMessage: string) {
  if (typeof value !== "string") {
    throw new BadRequestException(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new BadRequestException(errorMessage);
  }

  return normalized;
}
