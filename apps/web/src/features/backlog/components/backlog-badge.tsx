/**
 * @file Backlog badge component for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

import {
  badgeBaseStyle
} from "./backlog-layout.styles";

type BacklogBadgeProps = {
  label: string;
  tone: "ready" | "blocked" | "neutral" | "priority";
};

const toneStyles: Record<BacklogBadgeProps["tone"], CSSProperties> = {
  ready: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#047857"
  },
  blocked: {
    backgroundColor: "rgba(248, 113, 113, 0.15)",
    color: "#b91c1c"
  },
  neutral: {
    backgroundColor: "rgba(148, 163, 184, 0.16)",
    color: "#334155"
  },
  priority: {
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    color: "#c2410c"
  }
};

/**
 * @param label The pill text rendered for backlog metadata.
 * @param tone The visual treatment mapped to the metadata state.
 * @returns A consistently styled metadata pill.
 */
export function BacklogBadge({ label, tone }: BacklogBadgeProps) {
  return <span style={{ ...badgeBaseStyle, ...toneStyles[tone] }}>{label}</span>;
}
