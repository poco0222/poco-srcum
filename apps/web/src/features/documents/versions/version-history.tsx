/**
 * @file Read-only document version history list for Phase 2 collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import React, { type CSSProperties } from "react";

import type { DocumentVersionRecord } from "@poco-scrum/domain";
import {
  mutedTextStyle,
  panelStyle,
  sectionHeadingStyle,
  stackStyle
} from "../components/documents-layout.styles";

type VersionHistoryListProps = {
  versions: DocumentVersionRecord[];
};

// Grid spacing keeps version rows stable as the history grows.
const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  listStyle: "none",
  margin: 0,
  padding: 0
};

// Item styling groups version number, summary, actor, and timestamp as one snapshot.
const itemStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  display: "grid",
  gap: "6px",
  padding: "12px"
};

/**
 * @param versions The version snapshots to display oldest first.
 * @returns A compact version history panel.
 */
export function VersionHistoryList({ versions }: VersionHistoryListProps) {
  return (
    <section aria-label="Version history" style={panelStyle}>
      <div style={stackStyle}>
        <h2 style={sectionHeadingStyle}>Version history</h2>
        {versions.length === 0 ? (
          <p style={mutedTextStyle}>No versions yet.</p>
        ) : (
          <ul style={listStyle}>
            {versions.map((version) => (
              <li key={version.id} style={itemStyle}>
                <strong>Version {version.versionNumber}</strong>
                <span>{version.changeSummary}</span>
                <span style={mutedTextStyle}>By {version.createdById}</span>
                <span style={mutedTextStyle}>{version.createdAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
