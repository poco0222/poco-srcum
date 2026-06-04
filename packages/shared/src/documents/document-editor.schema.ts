/**
 * @file Formal document editor payload schemas for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  DocumentFieldRequirement,
  DocumentTargetType,
  DocumentType,
  DocumentTypeMatrix
} from "@poco-scrum/domain";
import type {
  DocumentStructuredFields,
  DocumentTargetTypeValue,
  DocumentTypeValue
} from "@poco-scrum/domain";

export type CreateFormalDocumentInput = {
  title: string;
  documentType: DocumentTypeValue;
  templateId: string;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  authorId: string;
  structuredFields: DocumentStructuredFields;
  markdown: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const documentTypeValues = new Set<DocumentTypeValue>(Object.values(DocumentType));
const documentTargetTypeValues = new Set(Object.values(DocumentTargetType));

/**
 * Parse a template-backed formal document creation payload.
 */
export const CreateFormalDocumentInputSchema: Schema<CreateFormalDocumentInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("FORMAL_DOCUMENT_CREATE_INPUT_INVALID");
    }

    const candidate = input as Partial<CreateFormalDocumentInput>;

    if (
      typeof candidate.documentType !== "string" ||
      !documentTypeValues.has(candidate.documentType as DocumentTypeValue)
    ) {
      throw new TypeError("FORMAL_DOCUMENT_CREATE_INPUT_INVALID");
    }

    if (
      typeof candidate.targetType !== "string" ||
      !documentTargetTypeValues.has(candidate.targetType as DocumentTargetTypeValue)
    ) {
      throw new TypeError("FORMAL_DOCUMENT_CREATE_INPUT_INVALID");
    }

    const structuredFields = normalizeStructuredFields(
      candidate.structuredFields,
      "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
    );
    const documentType = candidate.documentType as DocumentTypeValue;

    assertRequiredFields(documentType, structuredFields);

    return {
      title: normalizeRequiredText(
        candidate.title,
        "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
      ),
      documentType,
      templateId: normalizeRequiredText(
        candidate.templateId,
        "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
      ),
      targetType: candidate.targetType as DocumentTargetTypeValue,
      targetId: normalizeRequiredText(
        candidate.targetId,
        "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
      ),
      authorId: normalizeRequiredText(
        candidate.authorId,
        "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
      ),
      structuredFields,
      markdown: normalizeRequiredText(
        candidate.markdown,
        "FORMAL_DOCUMENT_CREATE_INPUT_INVALID"
      )
    };
  }
};

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The validation error code to throw on failure.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string): string {
  if (typeof value !== "string") {
    throw new TypeError(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new TypeError(errorMessage);
  }

  return normalized;
}

/**
 * @param value The unknown structured field bag to normalize.
 * @param errorMessage The validation error code to throw on failure.
 * @returns A JSON-safe shallow field bag.
 */
function normalizeStructuredFields(
  value: unknown,
  errorMessage: string
): DocumentStructuredFields {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(errorMessage);
  }

  const normalized: DocumentStructuredFields = {};

  for (const [key, fieldValue] of Object.entries(value)) {
    const normalizedKey = key.trim();

    if (normalizedKey.length === 0) {
      throw new TypeError(errorMessage);
    }

    if (
      typeof fieldValue !== "string" &&
      typeof fieldValue !== "number" &&
      typeof fieldValue !== "boolean" &&
      fieldValue !== null
    ) {
      throw new TypeError(errorMessage);
    }

    normalized[normalizedKey] =
      typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;
  }

  return normalized;
}

/**
 * @param documentType The formal document type being validated.
 * @param structuredFields The normalized structured field bag.
 */
function assertRequiredFields(
  documentType: DocumentTypeValue,
  structuredFields: DocumentStructuredFields
) {
  const matrix = DocumentTypeMatrix[documentType];

  for (const [fieldName, requirement] of Object.entries(matrix.structuredFields)) {
    if (requirement !== DocumentFieldRequirement.REQUIRED) {
      continue;
    }

    const value = structuredFields[fieldName];

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0)
    ) {
      throw new TypeError(`FORMAL_DOCUMENT_FIELD_REQUIRED:${fieldName}`);
    }
  }
}
