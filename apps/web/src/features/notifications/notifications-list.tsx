/**
 * @file Minimal in-app notification list for Phase 1 Scrum events.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

import type { NotificationRecord } from "@poco-scrum/domain";
import { getNotificationLabel } from "./notification-labels";

type NotificationsListProps = {
  notifications: NotificationRecord[];
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  listStyle: "none",
  margin: 0,
  padding: 0
};

const itemStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  display: "grid",
  gap: "4px",
  padding: "12px"
};

/**
 * @param notifications The in-app notification records to show.
 * @returns A compact notification feed for key P1 events.
 */
export function NotificationsList({ notifications }: NotificationsListProps) {
  return (
    <ul style={listStyle}>
      {notifications.map((notification) => (
        <li key={notification.id} style={itemStyle}>
          <strong>{getNotificationLabel(notification.eventType)}</strong>
          <span>{notification.reason}</span>
        </li>
      ))}
    </ul>
  );
}
