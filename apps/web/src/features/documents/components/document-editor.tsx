/**
 * @file Document editor component for the Phase 1 Form plus Markdown workflow.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import { DocumentPreview } from "./document-preview";

type DocumentEditorProps = {
  defaultTitle: string;
  defaultMarkdown: string;
};

const editorGridStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)"
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#334155"
};

const inputStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.45)",
  borderRadius: "8px",
  color: "#0f172a",
  fontSize: "15px",
  padding: "12px 14px",
  width: "100%"
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: "280px",
  resize: "vertical"
};

/**
 * @param defaultTitle The initial document title.
 * @param defaultMarkdown The initial markdown body.
 * @returns A textarea editor paired with the sanitized preview.
 */
export function DocumentEditor({
  defaultTitle,
  defaultMarkdown
}: DocumentEditorProps) {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  return (
    <div style={editorGridStyle}>
      <div style={{ display: "grid", gap: "16px" }}>
        <label style={fieldStyle}>
          Title
          <input defaultValue={defaultTitle} name="title" style={inputStyle} />
        </label>
        <label style={fieldStyle}>
          Markdown
          <textarea
            defaultValue={defaultMarkdown}
            name="markdown"
            onChange={(event) => setMarkdown(event.currentTarget.value)}
            style={textareaStyle}
          />
        </label>
      </div>
      <DocumentPreview markdown={markdown} />
    </div>
  );
}
