/**
 * @file Default document template seed data for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  DocumentFieldRequirement,
  DocumentType,
  DocumentTypeMatrix
} from "@poco-scrum/domain";
import type {
  DocumentFieldRequirementValue,
  DocumentTypeValue
} from "@poco-scrum/domain";

export type DocumentTemplateSeedRecord = {
  id: string;
  documentType: DocumentTypeValue;
  name: string;
  description: string;
  structuredFields: Record<string, DocumentFieldRequirementValue>;
  requiredFieldKeys: string[];
  markdown: string;
  isDefault: boolean;
  createdById: string;
};

const templateOrder = [
  DocumentType.REQUIREMENT,
  DocumentType.TECHNICAL_SOLUTION,
  DocumentType.ACCEPTANCE,
  DocumentType.RETROSPECTIVE
] as const;

/**
 * @param createdById The system or user identifier recorded as the seed actor.
 * @returns Default templates aligned with the frozen domain matrix.
 */
export function createDefaultDocumentTemplates(
  createdById: string
): DocumentTemplateSeedRecord[] {
  return templateOrder.map((documentType) => {
    const matrix = DocumentTypeMatrix[documentType];
    const requiredFieldKeys = Object.entries(matrix.structuredFields)
      .filter(([, requirement]) => requirement === DocumentFieldRequirement.REQUIRED)
      .map(([fieldName]) => fieldName);

    return {
      id: `default-${documentType.toLowerCase().replaceAll("_", "-")}`,
      documentType,
      name: `${matrix.label}默认模板`,
      description: matrix.description,
      structuredFields: {
        ...matrix.structuredFields
      },
      requiredFieldKeys,
      markdown: renderDefaultMarkdown(matrix.markdownSections),
      isDefault: true,
      createdById
    };
  });
}

/**
 * @param sections The ordered Markdown sections from the document matrix.
 * @returns A starter Markdown body with stable section headings.
 */
function renderDefaultMarkdown(sections: readonly string[]) {
  return sections
    .map((section) => `## ${section}\n\n请补充 ${section} 内容。`)
    .join("\n\n");
}
