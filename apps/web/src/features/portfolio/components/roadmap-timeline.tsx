/**
 * @file Portfolio roadmap timeline component for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type { RoadmapMilestone } from "@poco-scrum/domain";
import React from "react";

import {
  cardTitleStyle,
  copyStyle,
  metricPillStyle,
  metricRowStyle,
  stateStyle,
  timelineItemStyle,
  timelineStyle
} from "./portfolio-layout.styles";

type RoadmapTimelineProps = {
  milestones: RoadmapMilestone[];
};

/**
 * @param timestamp A nullable ISO timestamp from the API.
 * @returns A compact date label for management views.
 */
function formatDate(timestamp: string | null) {
  return timestamp ? new Date(timestamp).toLocaleDateString("en-CA") : "Unscheduled";
}

/**
 * @param props The roadmap milestones to display.
 * @returns A read-only milestone timeline without scheduling controls.
 */
export function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div style={stateStyle}>
        No roadmap milestones match the current filters.
      </div>
    );
  }

  return (
    <div style={timelineStyle}>
      {milestones.map((milestone) => (
        <article key={milestone.id} style={timelineItemStyle}>
          <div style={metricRowStyle}>
            <span style={metricPillStyle}>{milestone.status}</span>
            <span style={metricPillStyle}>{milestone.kind}</span>
            <span style={metricPillStyle}>{milestone.projectId}</span>
          </div>
          <h2 style={cardTitleStyle}>{milestone.title}</h2>
          <p style={copyStyle}>
            {formatDate(milestone.startsAt)} to {formatDate(milestone.endsAt)}
          </p>
        </article>
      ))}
    </div>
  );
}
