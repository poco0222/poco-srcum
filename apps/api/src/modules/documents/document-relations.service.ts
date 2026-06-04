/**
 * @file Formal document relation service for Phase 2 Scrum artifact linkage.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import {
  DocumentRelationTargetType,
  DocumentRelationType,
  type DocumentRelationRecord,
  type DocumentRelationTargetTypeValue,
  type DocumentRelationTypeValue
} from "@poco-scrum/domain";
import { DocumentsService } from "./documents.service";

export type LinkDocumentToArtifactInput = {
  documentId: string;
  relationType: DocumentRelationTypeValue;
  targetType: DocumentRelationTargetTypeValue;
  targetId: string;
  actorId: string;
};

export type ListDocumentRelationsInput = {
  targetType: DocumentRelationTargetTypeValue;
  targetId: string;
};

const documentRelationTypeValues = new Set<DocumentRelationTypeValue>(
  Object.values(DocumentRelationType)
);
const documentRelationTargetTypeValues = new Set<DocumentRelationTargetTypeValue>(
  Object.values(DocumentRelationTargetType)
);

// Each relation type has exactly one intended artifact kind so downstream readers do not infer meaning.
const relationTargetTypeByRelationType = {
  [DocumentRelationType.REFERENCES_STORY]: DocumentRelationTargetType.STORY,
  [DocumentRelationType.SUPPORTS_SPRINT]: DocumentRelationTargetType.SPRINT,
  [DocumentRelationType.RECORDS_ACCEPTANCE]: DocumentRelationTargetType.ACCEPTANCE,
  [DocumentRelationType.RECORDS_RETROSPECTIVE]:
    DocumentRelationTargetType.RETROSPECTIVE
} as const satisfies Record<
  DocumentRelationTypeValue,
  DocumentRelationTargetTypeValue
>;

export class DocumentRelationsService {
  private readonly relations = new Map<string, DocumentRelationRecord[]>();
  private nextSequence = 1;

  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * @param input The relation payload connecting a formal document to a Scrum artifact.
   * @returns The persisted document relation record.
   */
  async linkDocumentToArtifact(input: LinkDocumentToArtifactInput) {
    const payload = normalizeLinkInput(input);

    await this.documentsService.getDocumentById(payload.documentId);

    const record: DocumentRelationRecord = {
      id: `document-relation-${this.nextSequence++}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    const key = buildRelationKey(record.targetType, record.targetId);
    const current = this.relations.get(key) ?? [];

    this.relations.set(key, [
      ...current,
      {
        ...record
      }
    ]);

    return {
      ...record
    };
  }

  /**
   * @param input The Scrum artifact target whose document relations should be listed.
   * @returns Oldest-first formal document relations for the target.
   */
  async listRelationsForArtifact(input: ListDocumentRelationsInput) {
    const payload = normalizeListInput(input);
    const current =
      this.relations.get(buildRelationKey(payload.targetType, payload.targetId)) ??
      [];

    return current.map((record) => ({
      ...record
    }));
  }
}

/**
 * @param input The raw relation creation payload.
 * @returns A normalized and relation-compatible payload.
 */
function normalizeLinkInput(
  input: LinkDocumentToArtifactInput
): LinkDocumentToArtifactInput {
  if (!documentRelationTypeValues.has(input.relationType)) {
    throw new BadRequestException("DOCUMENT_RELATION_TYPE_INVALID");
  }

  if (!documentRelationTargetTypeValues.has(input.targetType)) {
    throw new BadRequestException("DOCUMENT_RELATION_TARGET_INVALID");
  }

  if (relationTargetTypeByRelationType[input.relationType] !== input.targetType) {
    throw new BadRequestException("DOCUMENT_RELATION_TARGET_MISMATCH");
  }

  return {
    documentId: normalizeRequiredText(
      input.documentId,
      "DOCUMENT_RELATION_INPUT_INVALID"
    ),
    relationType: input.relationType,
    targetType: input.targetType,
    targetId: normalizeRequiredText(
      input.targetId,
      "DOCUMENT_RELATION_INPUT_INVALID"
    ),
    actorId: normalizeRequiredText(
      input.actorId,
      "DOCUMENT_RELATION_INPUT_INVALID"
    )
  };
}

/**
 * @param input The raw relation list payload.
 * @returns A normalized list query payload.
 */
function normalizeListInput(
  input: ListDocumentRelationsInput
): ListDocumentRelationsInput {
  if (!documentRelationTargetTypeValues.has(input.targetType)) {
    throw new BadRequestException("DOCUMENT_RELATION_TARGET_INVALID");
  }

  return {
    targetType: input.targetType,
    targetId: normalizeRequiredText(
      input.targetId,
      "DOCUMENT_RELATION_INPUT_INVALID"
    )
  };
}

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The error code used when normalization fails.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string) {
  if (typeof value !== "string") {
    throw new BadRequestException(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new BadRequestException(errorMessage);
  }

  return normalized;
}

/**
 * @param targetType The Scrum artifact kind.
 * @param targetId The Scrum artifact identifier.
 * @returns Stable in-memory relation bucket key.
 */
function buildRelationKey(
  targetType: DocumentRelationTargetTypeValue,
  targetId: string
) {
  return `${targetType}:${targetId}`;
}
