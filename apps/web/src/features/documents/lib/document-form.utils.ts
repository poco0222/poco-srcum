/**
 * @file Formal document form parsing helpers for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  CreateFormalDocumentInputSchema,
  type CreateFormalDocumentInput
} from "@poco-scrum/shared";

function readStringField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

/**
 * @param formData The native form data submitted by the formal document create page.
 * @returns A validated template-backed formal document creation payload.
 */
export function buildCreateFormalDocumentInput(
  formData: FormData
): CreateFormalDocumentInput {
  const structuredFields: Record<string, string> = {};

  // Field controls are named with a stable prefix so template-defined keys can be collected generically.
  for (const [fieldName, fieldValue] of formData.entries()) {
    if (!fieldName.startsWith("field:") || typeof fieldValue !== "string") {
      continue;
    }

    const structuredFieldKey = fieldName.slice("field:".length).trim();

    if (structuredFieldKey.length > 0) {
      structuredFields[structuredFieldKey] = fieldValue.trim();
    }
  }

  return CreateFormalDocumentInputSchema.parse({
    title: readStringField(formData, "title"),
    documentType: readStringField(formData, "documentType"),
    templateId: readStringField(formData, "templateId"),
    targetType: readStringField(formData, "targetType"),
    targetId: readStringField(formData, "targetId"),
    authorId: readStringField(formData, "authorId"),
    structuredFields,
    markdown: readStringField(formData, "markdown")
  });
}
