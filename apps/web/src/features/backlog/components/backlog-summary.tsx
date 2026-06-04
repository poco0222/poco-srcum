/**
 * @file Backlog summary cards for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import { WorkItemType, type WorkItemRecord } from "@poco-scrum/domain";
import { getWorkItemReadyPresentation } from "../lib/backlog-ready";
import {
  summaryCardStyle,
  summaryGridStyle,
  summaryLabelStyle,
  summaryValueStyle
} from "./backlog-layout.styles";

type BacklogSummaryProps = {
  items: WorkItemRecord[];
};

/**
 * @param items The backlog items currently displayed on the page.
 * @returns High-signal summary cards for total work items, stories, and ready stories.
 */
export function BacklogSummary({ items }: BacklogSummaryProps) {
  const storyItems = items.filter((item) => item.type === WorkItemType.STORY);
  const readyStories = storyItems.filter((item) => {
    return getWorkItemReadyPresentation(item).tone === "ready";
  });

  return (
    <section style={summaryGridStyle}>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Total Backlog Items</p>
        <p style={summaryValueStyle}>{items.length}</p>
      </article>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Stories</p>
        <p style={summaryValueStyle}>{storyItems.length}</p>
      </article>
      <article style={summaryCardStyle}>
        <p style={summaryLabelStyle}>Ready Stories</p>
        <p style={summaryValueStyle}>{readyStories.length}</p>
      </article>
    </section>
  );
}
