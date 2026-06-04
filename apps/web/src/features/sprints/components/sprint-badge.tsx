/**
 * @file Sprint badge primitive for lightweight board and overview labels.
 * @author PopoY
 * @created 2026-06-04
 */
import { badgeBaseStyle } from "./sprints-layout.styles";

type SprintBadgeProps = {
  label: string;
  tone: "neutral" | "status" | "priority";
};

const toneMap = {
  neutral: {
    backgroundColor: "rgba(226, 232, 240, 0.82)",
    color: "#0f172a"
  },
  status: {
    backgroundColor: "rgba(186, 230, 253, 0.82)",
    color: "#075985"
  },
  priority: {
    backgroundColor: "rgba(204, 251, 241, 0.86)",
    color: "#115e59"
  }
} as const;

/**
 * @param label The badge content.
 * @param tone The presentation tone aligned with the sprint shell.
 * @returns A compact badge used across the sprint overview and board.
 */
export function SprintBadge({ label, tone }: SprintBadgeProps) {
  return <span style={{ ...badgeBaseStyle, ...toneMap[tone] }}>{label}</span>;
}
