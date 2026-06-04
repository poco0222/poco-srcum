/**
 * @file Document Markdown preview component for Phase 1 documents.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

import { renderMarkdownPreviewHtml } from "../lib/markdown-sanitize";

type DocumentPreviewProps = {
  markdown: string;
};

const previewStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#111827",
  lineHeight: 1.7,
  padding: "16px"
};

/**
 * @param markdown The document markdown body to preview.
 * @returns A sanitized preview of the P1 markdown whitelist.
 */
export function DocumentPreview({ markdown }: DocumentPreviewProps) {
  return (
    <section
      aria-label="Document preview"
      dangerouslySetInnerHTML={{
        __html: renderMarkdownPreviewHtml(markdown)
      }}
      style={previewStyle}
    />
  );
}
