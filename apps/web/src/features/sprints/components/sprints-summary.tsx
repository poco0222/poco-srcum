/**
 * @file Sprint overview summary cards for the Phase 1 frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import type { SprintRecord } from "@poco-scrum/domain";
import {
  summaryCardStyle,
  summaryGridStyle,
  summaryLabelStyle,
  summaryValueStyle
} from "./sprints-layout.styles";

type SprintsSummaryProps = {
  sprints: SprintRecord[];
};

/**
 * @param sprints The sprint records currently loaded for the shell.
 * @returns High-signal cards for the current sprint overview list.
 */
export function SprintsSummary({ sprints }: SprintsSummaryProps) {
  const activeCount = sprints.filter((sprint) => sprint.status === "ACTIVE").length;
  const plannedCount = sprints.filter((sprint) => sprint.status === "PLANNED").length;

  return (
    <section style={summaryGridStyle}>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Visible Sprints</p>
        <p style={summaryValueStyle}>{sprints.length}</p>
      </article>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Planned</p>
        <p style={summaryValueStyle}>{plannedCount}</p>
      </article>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Active</p>
        <p style={summaryValueStyle}>{activeCount}</p>
      </article>
    </section>
  );
}
