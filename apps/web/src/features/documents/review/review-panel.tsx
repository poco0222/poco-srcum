/**
 * @file Read-only document review panel for Phase 2 formal review workflows.
 * @author PopoY
 * @created 2026-06-10
 */
import React, { type CSSProperties } from "react";

import type { DocumentReviewRecord } from "@poco-scrum/domain";
import {
  mutedTextStyle,
  panelStyle,
  primaryButtonStyle,
  sectionHeadingStyle,
  stackStyle
} from "../components/documents-layout.styles";

type DocumentReviewPanelProps = {
  review: DocumentReviewRecord;
  latestVersionId: string | null;
};

// Two-column metadata keeps status and version facts scannable in the review panel.
const detailGridStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
};

// Disabled approval styling makes the latest-version guard visible without adding another control.
const disabledButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: "#94a3b8",
  cursor: "not-allowed"
};

/**
 * @param review The current document review record.
 * @param latestVersionId The latest version id used to guard approval actions.
 * @returns A review status panel with a latest-version approval guard.
 */
export function DocumentReviewPanel({
  review,
  latestVersionId
}: DocumentReviewPanelProps) {
  // Approval is intentionally blocked unless the submitted version is still the latest version.
  const isLatestSubmitted =
    latestVersionId !== null && review.submittedVersionId === latestVersionId;
  const canApprove = review.status === "in-review" && isLatestSubmitted;

  return (
    <section aria-label="Review status" style={panelStyle}>
      <div style={stackStyle}>
        <h2 style={sectionHeadingStyle}>Review status</h2>
        <div style={detailGridStyle}>
          <p style={mutedTextStyle}>Status: {review.status}</p>
          <p style={mutedTextStyle}>
            Submitted version: {review.submittedVersionId || "not submitted"}
          </p>
          <p style={mutedTextStyle}>
            Latest version: {latestVersionId ?? "not available"}
          </p>
          <p style={mutedTextStyle}>
            Decision: {review.conclusion ?? "pending"}
          </p>
        </div>
        <button
          disabled={!canApprove}
          style={canApprove ? primaryButtonStyle : disabledButtonStyle}
          type="button"
        >
          {canApprove ? "Approve review" : "Approve latest version only"}
        </button>
      </div>
    </section>
  );
}
