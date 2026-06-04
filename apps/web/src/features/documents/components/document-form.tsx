/**
 * @file Formal document creation form for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import { useActionState, useMemo, useState } from "react";

import {
  DocumentFieldRequirement,
  DocumentTargetType,
  DocumentTypeMatrix
} from "@poco-scrum/domain";
import type {
  DocumentTargetTypeValue,
  DocumentTypeValue
} from "@poco-scrum/domain";
import type { DocumentTemplateOption } from "../api/documents-client";
import {
  idleDocumentActionState,
  type DocumentActionState
} from "../lib/document-action-state";
import { DocumentPreview } from "./document-preview";
import { TemplateSelector } from "./template-selector";
import {
  actionStateStyle,
  formGridStyle,
  fullSpanStyle,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  stackStyle,
  textareaStyle
} from "./documents-layout.styles";

type DocumentFormProps = {
  action: (
    state: DocumentActionState,
    formData: FormData
  ) => Promise<DocumentActionState>;
  templates: DocumentTemplateOption[];
  defaultAuthorId: string;
  defaultTargetId: string;
  defaultTargetType: DocumentTargetTypeValue;
};

function getTemplateById(
  templates: DocumentTemplateOption[],
  templateId: string
) {
  return (
    templates.find((template) => template.id === templateId) ??
    templates[0] ??
    null
  );
}

/**
 * @param action The server action that persists the formal document.
 * @param templates The server-provided formal document templates.
 * @param defaultAuthorId The current author identifier.
 * @param defaultTargetId The default Scrum object identifier.
 * @param defaultTargetType The default Scrum object type.
 * @returns A template-backed formal document create form with live Markdown preview.
 */
export function DocumentForm({
  action,
  templates,
  defaultAuthorId,
  defaultTargetId,
  defaultTargetType
}: DocumentFormProps) {
  const initialTemplate = templates[0] ?? null;
  const [state, formAction, isPending] = useActionState(
    action,
    idleDocumentActionState
  );
  const [templateId, setTemplateId] = useState(initialTemplate?.id ?? "");
  const [markdown, setMarkdown] = useState(initialTemplate?.markdown ?? "");
  const selectedTemplate = useMemo(
    () => getTemplateById(templates, templateId),
    [templateId, templates]
  );
  const selectedDocumentType = selectedTemplate?.documentType;
  const matrix = selectedDocumentType
    ? DocumentTypeMatrix[selectedDocumentType]
    : null;

  return (
    <form action={formAction} style={stackStyle}>
      <div style={formGridStyle}>
        <input
          name="documentType"
          type="hidden"
          value={selectedDocumentType ?? ""}
        />
        <div style={fullSpanStyle}>
          <TemplateSelector
            defaultTemplateId={initialTemplate?.id ?? ""}
            onTemplateChange={(nextTemplateId) => {
              const nextTemplate = getTemplateById(templates, nextTemplateId);
              setTemplateId(nextTemplateId);
              setMarkdown(nextTemplate?.markdown ?? "");
            }}
            selectedTemplateId={selectedTemplate?.id ?? ""}
            templates={templates}
          />
        </div>
        <label style={labelStyle}>
          Title
          <input
            name="title"
            placeholder="Example: Requirement Draft"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Target Type
          <select
            defaultValue={defaultTargetType}
            name="targetType"
            style={inputStyle}
          >
            <option value={DocumentTargetType.STORY}>Story</option>
            <option value={DocumentTargetType.SPRINT}>Sprint</option>
            <option value={DocumentTargetType.RETROSPECTIVE}>Retrospective</option>
          </select>
        </label>
        <label style={labelStyle}>
          Target ID
          <input
            defaultValue={defaultTargetId}
            name="targetId"
            placeholder="Example: story-1"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Author ID
          <input
            defaultValue={defaultAuthorId}
            name="authorId"
            placeholder="Example: user-1"
            style={inputStyle}
          />
        </label>
        {selectedTemplate && matrix
          ? Object.entries(selectedTemplate.structuredFields).map(
              ([fieldName, requirement]) => (
                <label key={fieldName} style={labelStyle}>
                  {fieldName}
                  <input
                    name={`field:${fieldName}`}
                    placeholder={
                      requirement === DocumentFieldRequirement.REQUIRED
                        ? "Required"
                        : "Optional"
                    }
                    style={inputStyle}
                  />
                </label>
              )
            )
          : null}
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Markdown
          <textarea
            name="markdown"
            onChange={(event) => setMarkdown(event.currentTarget.value)}
            style={textareaStyle}
            value={markdown}
          />
        </label>
      </div>
      <DocumentPreview markdown={markdown} />
      {state.status !== "idle" ? (
        <p
          style={{
            ...actionStateStyle,
            backgroundColor:
              state.status === "error"
                ? "rgba(254, 226, 226, 0.78)"
                : "rgba(209, 250, 229, 0.78)",
            color: state.status === "error" ? "#b91c1c" : "#047857"
          }}
        >
          {state.message}
        </p>
      ) : null}
      <button disabled={isPending || !selectedTemplate} style={primaryButtonStyle} type="submit">
        {isPending ? "Saving Formal Document..." : "Create Formal Document"}
      </button>
    </form>
  );
}

export type { DocumentTargetTypeValue, DocumentTypeValue };
