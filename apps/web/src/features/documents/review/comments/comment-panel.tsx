/**
 * @file Read-only document comment panel for Phase 2 review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import React, { type CSSProperties } from "react";

import type { DocumentCommentRecord } from "@poco-scrum/domain";
import {
  mutedTextStyle,
  panelStyle,
  sectionHeadingStyle,
  stackStyle
} from "../../components/documents-layout.styles";

type DocumentCommentPanelProps = {
  comments: DocumentCommentRecord[];
};

// Grid spacing preserves a stable timeline rhythm for comment review.
const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  listStyle: "none",
  margin: 0,
  padding: 0
};

// Each comment item is framed as one review event with anchor and reply metadata.
const itemStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  display: "grid",
  gap: "8px",
  padding: "12px"
};

// Metadata text separates anchor, reply, and mention context from the comment body.
const metaStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.4
};

// Comment body style keeps review text readable inside compact panels.
const bodyStyle: CSSProperties = {
  color: "#0f172a",
  fontSize: "14px",
  lineHeight: 1.6,
  margin: 0
};

/**
 * @param comments The document comments to render oldest first.
 * @returns A compact review comment panel with anchor and reply context.
 */
export function DocumentCommentPanel({ comments }: DocumentCommentPanelProps) {
  return (
    <section aria-label="Document comments" style={panelStyle}>
      <div style={stackStyle}>
        <h2 style={sectionHeadingStyle}>Document comments</h2>
        {comments.length === 0 ? (
          <p style={mutedTextStyle}>No comments yet.</p>
        ) : (
          <ul style={listStyle}>
            {comments.map((comment) => (
              <li key={comment.id} style={itemStyle}>
                <span style={metaStyle}>
                  {comment.authorId} on {comment.anchorType}: {comment.anchorRef}
                </span>
                {/* Reply context links threaded discussion back to the parent comment id. */}
                {comment.parentCommentId ? (
                  <span style={metaStyle}>
                    Reply to {comment.parentCommentId}
                  </span>
                ) : null}
                <p style={bodyStyle}>{comment.body}</p>
                {/* Mention metadata stays visible so reviewers can audit notification targets. */}
                {comment.mentionedUserIds.length > 0 ? (
                  <span style={metaStyle}>
                    Mentioned: {comment.mentionedUserIds.join(", ")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
