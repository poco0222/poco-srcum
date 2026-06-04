/**
 * @file Formal document template selector for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import type { CSSProperties } from "react";

import { DocumentTypeMatrix } from "@poco-scrum/domain";
import type { DocumentTypeValue } from "@poco-scrum/domain";
import type { DocumentTemplateOption } from "../api/documents-client";
import {
  badgeStyle,
  inputStyle,
  labelStyle,
  mutedTextStyle,
  stackStyle
} from "./documents-layout.styles";

export type TemplateSelectorOption = {
  documentType: DocumentTypeValue;
  documentTypeLabel: string;
  templateId: string;
  templateName: string;
  requiredFieldKeys: string[];
};

type TemplateSelectorProps = {
  templates: DocumentTemplateOption[];
  defaultTemplateId: string;
  selectedTemplateId?: string;
  onTemplateChange?: (templateId: string) => void;
};

const optionListStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  margin: 0,
  padding: 0,
  listStyle: "none"
};

const optionCardStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: "16px",
  padding: "14px",
  display: "grid",
  gap: "8px",
  backgroundColor: "#fff"
};

/**
 * @param templates The default template records returned by the API.
 * @returns Stable selector options enriched with domain labels.
 */
export function buildTemplateSelectorOptions(
  templates: DocumentTemplateOption[]
): TemplateSelectorOption[] {
  return templates.map((template) => ({
    documentType: template.documentType,
    documentTypeLabel: DocumentTypeMatrix[template.documentType].label,
    templateId: template.id,
    templateName: template.name,
    requiredFieldKeys: [...template.requiredFieldKeys]
  }));
}

/**
 * @param templates The available formal document templates.
 * @param defaultTemplateId The initially selected template identifier.
 * @returns A template picker backed by the server-provided defaults.
 */
export function TemplateSelector({
  templates,
  defaultTemplateId,
  selectedTemplateId,
  onTemplateChange
}: TemplateSelectorProps) {
  const options = buildTemplateSelectorOptions(templates);
  const currentTemplateId = selectedTemplateId ?? defaultTemplateId;

  return (
    <section style={stackStyle}>
      <label style={labelStyle}>
        Template
        <select
          name="templateId"
          onChange={(event) => onTemplateChange?.(event.currentTarget.value)}
          style={inputStyle}
          value={currentTemplateId}
        >
          {options.map((option) => (
            <option key={option.templateId} value={option.templateId}>
              {option.documentTypeLabel} / {option.templateName}
            </option>
          ))}
        </select>
      </label>
      <ul style={optionListStyle}>
        {options.map((option) => (
          <li key={option.templateId} style={optionCardStyle}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={badgeStyle}>{option.documentTypeLabel}</span>
              <span style={badgeStyle}>{option.templateId}</span>
            </div>
            <p style={mutedTextStyle}>
              Required fields: {option.requiredFieldKeys.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
