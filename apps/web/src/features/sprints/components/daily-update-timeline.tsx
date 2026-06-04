/**
 * @file Sprint daily update timeline for the Phase 1 frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import type { SprintDailyUpdateRecord } from "@poco-scrum/domain";

import {
  emptyStateStyle,
  stackStyle,
  subtleCopyStyle,
  timelineCardStyle,
  timelineStyle
} from "./sprints-layout.styles";

type DailyUpdateTimelineProps = {
  updates: SprintDailyUpdateRecord[];
};

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-CA");
}

/**
 * @param updates The saved daily update timeline entries.
 * @returns The minimum newest-first timeline for the Sprint detail page.
 */
export function DailyUpdateTimeline({ updates }: DailyUpdateTimelineProps) {
  if (updates.length === 0) {
    return (
      <div style={emptyStateStyle}>
        No daily updates are exposed by the current API yet. The form stays available
        so the UI shell is ready when the endpoint is connected.
      </div>
    );
  }

  return (
    <div style={timelineStyle}>
      {updates.map((entry) => (
        <article key={entry.id} style={timelineCardStyle}>
          <div style={stackStyle}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
              {entry.authorId} · {formatTimestamp(entry.createdAt)}
            </p>
            <p style={subtleCopyStyle}>
              Work item: <strong>{entry.workItemId ?? "Sprint-level update"}</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: "#334155" }}>{entry.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
