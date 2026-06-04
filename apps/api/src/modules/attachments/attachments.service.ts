/**
 * @file Attachment metadata service for Phase 1 document delivery evidence.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import type {
  AttachmentPreviewKind,
  DocumentAttachmentRecord
} from "@poco-scrum/domain";

export type AttachToDocumentInput = {
  documentId: string;
  actorId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

/**
 * Store only attachment metadata in P1; binary upload and storage lifecycle are later concerns.
 */
export class AttachmentsService {
  private readonly attachments = new Map<string, DocumentAttachmentRecord[]>();
  private nextSequence = 1;

  /**
   * @param input The metadata payload for a document attachment.
   * @returns The persisted attachment metadata with preview classification.
   */
  async attachToDocument(input: AttachToDocumentInput) {
    const payload = normalizeAttachInput(input);
    const record: DocumentAttachmentRecord = {
      id: `attachment-${this.nextSequence++}`,
      ...payload,
      previewKind: getAttachmentPreviewKind(payload.mimeType),
      createdAt: new Date().toISOString()
    };
    const current = this.attachments.get(record.documentId) ?? [];

    this.attachments.set(record.documentId, [
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
   * @param documentId The document whose attachment metadata should be listed.
   * @returns Oldest-first attachment metadata linked to the document.
   */
  async listByDocument(documentId: string) {
    const normalizedDocumentId = normalizeRequiredText(
      documentId,
      "DOCUMENT_ATTACHMENT_DOCUMENT_ID_REQUIRED"
    );

    return (this.attachments.get(normalizedDocumentId) ?? []).map((record) => ({
      ...record
    }));
  }
}

/**
 * @param mimeType The attachment MIME type.
 * @returns The P1 preview kind allowed for this attachment.
 */
export function getAttachmentPreviewKind(mimeType: string): AttachmentPreviewKind {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "download";
}

function normalizeAttachInput(input: AttachToDocumentInput): AttachToDocumentInput {
  const sizeBytes = input.sizeBytes;

  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0) {
    throw new BadRequestException("DOCUMENT_ATTACHMENT_SIZE_INVALID");
  }

  return {
    documentId: normalizeRequiredText(
      input.documentId,
      "DOCUMENT_ATTACHMENT_INPUT_INVALID"
    ),
    actorId: normalizeRequiredText(input.actorId, "DOCUMENT_ATTACHMENT_INPUT_INVALID"),
    fileName: normalizeRequiredText(
      input.fileName,
      "DOCUMENT_ATTACHMENT_INPUT_INVALID"
    ),
    mimeType: normalizeRequiredText(
      input.mimeType,
      "DOCUMENT_ATTACHMENT_INPUT_INVALID"
    ),
    sizeBytes,
    url: normalizeRequiredText(input.url, "DOCUMENT_ATTACHMENT_INPUT_INVALID")
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
