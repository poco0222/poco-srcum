/**
 * @file Shared document DTO and validation schemas for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { DocumentTargetType } from "@poco-scrum/domain";
import type {
  DocumentStructuredFields,
  DocumentTargetTypeValue
} from "@poco-scrum/domain";

export type CreateDocumentInput = {
  title: string;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  authorId: string;
  structuredFields: DocumentStructuredFields;
  markdown: string;
};

export type UpdateDocumentInput = {
  documentId: string;
  editorId: string;
  title?: string;
  structuredFields?: DocumentStructuredFields;
  markdown?: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

const documentTargetTypeValues = new Set(Object.values(DocumentTargetType));

/**
 * Normalize a required text field used by document commands.
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
 * Keep P1 structured form fields JSON-safe and shallow.
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

    normalized[normalizedKey] = fieldValue;
  }

  return normalized;
}

/**
 * Parse document creation payloads shared by acceptance, Sprint, and retrospective forms.
 */
export const CreateDocumentInputSchema: Schema<CreateDocumentInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("DOCUMENT_CREATE_INPUT_INVALID");
    }

    const candidate = input as Partial<CreateDocumentInput>;

    if (
      typeof candidate.targetType !== "string" ||
      !documentTargetTypeValues.has(candidate.targetType as DocumentTargetTypeValue)
    ) {
      throw new TypeError("DOCUMENT_CREATE_INPUT_INVALID");
    }

    return {
      title: normalizeRequiredText(
        candidate.title,
        "DOCUMENT_CREATE_INPUT_INVALID"
      ),
      targetType: candidate.targetType as DocumentTargetTypeValue,
      targetId: normalizeRequiredText(
        candidate.targetId,
        "DOCUMENT_CREATE_INPUT_INVALID"
      ),
      authorId: normalizeRequiredText(
        candidate.authorId,
        "DOCUMENT_CREATE_INPUT_INVALID"
      ),
      structuredFields: normalizeStructuredFields(
        candidate.structuredFields,
        "DOCUMENT_CREATE_INPUT_INVALID"
      ),
      markdown: normalizeRequiredText(
        candidate.markdown,
        "DOCUMENT_CREATE_INPUT_INVALID"
      )
    };
  }
};

/**
 * Parse document update payloads while requiring at least one editable field.
 */
export const UpdateDocumentInputSchema: Schema<UpdateDocumentInput> = {
  parse(input) {
    if (typeof input !== "object" || input === null) {
      throw new TypeError("DOCUMENT_UPDATE_INPUT_INVALID");
    }

    const candidate = input as Partial<UpdateDocumentInput>;
    const parsed: UpdateDocumentInput = {
      documentId: normalizeRequiredText(
        candidate.documentId,
        "DOCUMENT_UPDATE_INPUT_INVALID"
      ),
      editorId: normalizeRequiredText(
        candidate.editorId,
        "DOCUMENT_UPDATE_INPUT_INVALID"
      )
    };

    if (candidate.title !== undefined) {
      parsed.title = normalizeRequiredText(
        candidate.title,
        "DOCUMENT_UPDATE_INPUT_INVALID"
      );
    }

    if (candidate.structuredFields !== undefined) {
      parsed.structuredFields = normalizeStructuredFields(
        candidate.structuredFields,
        "DOCUMENT_UPDATE_INPUT_INVALID"
      );
    }

    if (candidate.markdown !== undefined) {
      parsed.markdown = normalizeRequiredText(
        candidate.markdown,
        "DOCUMENT_UPDATE_INPUT_INVALID"
      );
    }

    if (
      parsed.title === undefined &&
      parsed.structuredFields === undefined &&
      parsed.markdown === undefined
    ) {
      throw new TypeError("DOCUMENT_UPDATE_INPUT_INVALID");
    }

    return parsed;
  }
};
