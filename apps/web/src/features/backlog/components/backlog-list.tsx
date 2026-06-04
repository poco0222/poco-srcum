/**
 * @file Backlog list component for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import Link from "next/link";

import type { WorkItemRecord } from "@poco-scrum/domain";
import { getWorkItemReadyPresentation } from "../lib/backlog-ready";
import { BacklogBadge } from "./backlog-badge";
import {
  itemCardStyle,
  itemLinkStyle,
  pillRowStyle,
  secondaryButtonStyle,
  stackStyle,
  subtleCopyStyle
} from "./backlog-layout.styles";

type BacklogListProps = {
  items: WorkItemRecord[];
  moveUpAction: (formData: FormData) => Promise<void>;
  moveDownAction: (formData: FormData) => Promise<void>;
};

/**
 * @param items The ordered backlog items for the current project.
 * @param moveUpAction The server action for moving an item upward in the list.
 * @param moveDownAction The server action for moving an item downward in the list.
 * @returns The ordered backlog cards rendered on the page.
 */
export function BacklogList({
  items,
  moveUpAction,
  moveDownAction
}: BacklogListProps) {
  return (
    <section style={stackStyle}>
      {items.map((item, index) => {
        const readyPresentation = getWorkItemReadyPresentation(item);

        return (
          <article key={item.id} style={itemCardStyle}>
            <div style={pillRowStyle}>
              <BacklogBadge label={item.type} tone="neutral" />
              <BacklogBadge label={item.priority} tone="priority" />
              <BacklogBadge
                label={readyPresentation.label}
                tone={readyPresentation.tone}
              />
            </div>
            <div style={stackStyle}>
              <Link href={`/backlog/${item.id}`} style={itemLinkStyle}>
                {item.title}
              </Link>
              <p style={subtleCopyStyle}>
                {item.description ?? "No description has been recorded for this work item yet."}
              </p>
              <p style={subtleCopyStyle}>
                Sort order: <strong>{item.sortOrder}</strong> · Story points:{" "}
                <strong>{item.storyPoints ?? "Not set"}</strong>
              </p>
            </div>
            <div style={stackStyle}>
              <p style={subtleCopyStyle}>
                Ready hints: {readyPresentation.reasons.join(" ")}
              </p>
              <div style={pillRowStyle}>
                <form action={moveUpAction}>
                  <input name="workItemId" type="hidden" value={item.id} />
                  <input name="direction" type="hidden" value="up" />
                  <button
                    disabled={index === 0}
                    style={secondaryButtonStyle}
                    type="submit"
                  >
                    Move Up
                  </button>
                </form>
                <form action={moveDownAction}>
                  <input name="workItemId" type="hidden" value={item.id} />
                  <input name="direction" type="hidden" value="down" />
                  <button
                    disabled={index === items.length - 1}
                    style={secondaryButtonStyle}
                    type="submit"
                  >
                    Move Down
                  </button>
                </form>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
