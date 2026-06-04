/**
 * @file Document link service for Phase 1 Scrum artifact attachments.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import {
  DocumentTargetType,
  type DocumentLinkRecord,
  type DocumentTargetTypeValue
} from "@poco-scrum/domain";
import { DocumentsService } from "./documents.service";

export type LinkDocumentToTargetInput = {
  documentId: string;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  actorId: string;
};

export type ListDocumentLinksInput = {
  targetType: DocumentTargetTypeValue;
  targetId: string;
};

const documentTargetTypeValues = new Set(Object.values(DocumentTargetType));

export class DocumentLinksService {
  private readonly links = new Map<string, DocumentLinkRecord[]>();
  private nextSequence = 1;

  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * @param input The link payload connecting an existing document to a Scrum artifact.
   * @returns The persisted document link record.
   */
  async linkDocumentToTarget(input: LinkDocumentToTargetInput) {
    const payload = normalizeLinkInput(input);

    await this.documentsService.getDocumentById(payload.documentId);

    const record: DocumentLinkRecord = {
      id: `document-link-${this.nextSequence++}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    const key = buildLinkKey(record.targetType, record.targetId);
    const current = this.links.get(key) ?? [];

    this.links.set(key, [
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
   * @param input The Scrum artifact target whose linked documents should be listed.
   * @returns Oldest-first document links for the target.
   */
  async listDocumentLinks(input: ListDocumentLinksInput) {
    const payload = normalizeListInput(input);
    const directDocuments = await this.documentsService.listDocumentsByTarget(
      payload.targetType,
      payload.targetId
    );
    const explicitLinks = this.links.get(buildLinkKey(payload.targetType, payload.targetId)) ?? [];
    const directLinks = directDocuments.map<DocumentLinkRecord>((document) => ({
      id: `document-link-direct-${document.id}`,
      documentId: document.id,
      targetType: document.targetType,
      targetId: document.targetId,
      actorId: document.authorId,
      createdAt: document.createdAt
    }));

    return [...directLinks, ...explicitLinks.map((record) => ({ ...record }))];
  }
}

function normalizeLinkInput(input: LinkDocumentToTargetInput): LinkDocumentToTargetInput {
  if (!documentTargetTypeValues.has(input.targetType)) {
    throw new BadRequestException("DOCUMENT_LINK_TARGET_INVALID");
  }

  return {
    documentId: normalizeRequiredText(input.documentId, "DOCUMENT_LINK_INPUT_INVALID"),
    targetType: input.targetType,
    targetId: normalizeRequiredText(input.targetId, "DOCUMENT_LINK_INPUT_INVALID"),
    actorId: normalizeRequiredText(input.actorId, "DOCUMENT_LINK_INPUT_INVALID")
  };
}

function normalizeListInput(input: ListDocumentLinksInput): ListDocumentLinksInput {
  if (!documentTargetTypeValues.has(input.targetType)) {
    throw new BadRequestException("DOCUMENT_LINK_TARGET_INVALID");
  }

  return {
    targetType: input.targetType,
    targetId: normalizeRequiredText(input.targetId, "DOCUMENT_LINK_INPUT_INVALID")
  };
}

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

function buildLinkKey(targetType: DocumentTargetTypeValue, targetId: string) {
  return `${targetType}:${targetId}`;
}
