/**
 * @file Sprint overview list for the Phase 1 frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import Link from "next/link";

import type { SprintRecord } from "@poco-scrum/domain";
import { SprintBadge } from "./sprint-badge";
import {
  boardCardStyle,
  emptyStateStyle,
  pillRowStyle,
  sectionCopyStyle,
  stackStyle,
  subtleCopyStyle
} from "./sprints-layout.styles";

type SprintsOverviewListProps = {
  sprints: SprintRecord[];
};

function formatDateRange(startsAt: string | null, endsAt: string | null) {
  if (!startsAt && !endsAt) {
    return "Schedule not recorded yet";
  }

  const startLabel = startsAt ? new Date(startsAt).toLocaleDateString("en-CA") : "TBD";
  const endLabel = endsAt ? new Date(endsAt).toLocaleDateString("en-CA") : "TBD";

  return `${startLabel} -> ${endLabel}`;
}

/**
 * @param sprints The sprint records already loaded by the page route.
 * @returns The minimum overview list with one link per sprint.
 */
export function SprintsOverviewList({ sprints }: SprintsOverviewListProps) {
  if (sprints.length === 0) {
    return (
      <div style={emptyStateStyle}>
        No Sprint records are exposed by the current API yet. The shell is wired and
        will render real data as soon as the Sprint list endpoint is available.
      </div>
    );
  }

  return (
    <div style={stackStyle}>
      {sprints.map((sprint) => (
        <article key={sprint.id} style={boardCardStyle}>
          <div style={pillRowStyle}>
            <SprintBadge label={sprint.status} tone="status" />
            <SprintBadge label={sprint.id} tone="neutral" />
          </div>
          <div style={stackStyle}>
            <Link
              href={`/sprints/${sprint.id}`}
              style={{
                color: "#0f172a",
                textDecoration: "none",
                fontSize: "24px",
                lineHeight: 1.25,
                fontWeight: 700
              }}
            >
              {sprint.name}
            </Link>
            <p style={subtleCopyStyle}>
              Goal: <strong>{sprint.goal ?? "Not recorded yet"}</strong>
            </p>
            <p style={sectionCopyStyle}>
              Planning note: {sprint.planningNote ?? "No planning note saved for this Sprint yet."}
            </p>
            <p style={subtleCopyStyle}>Schedule: {formatDateRange(sprint.startsAt, sprint.endsAt)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
