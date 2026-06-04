/**
 * @file Attachment metadata types for Phase 1 document delivery evidence.
 * @author PopoY
 * @created 2026-06-04
 */
import type { DocumentTargetTypeValue } from "./document.enums";

export type AttachmentPreviewKind = "image" | "pdf" | "download";

export type DocumentAttachmentRecord = {
  id: string;
  documentId: string;
  actorId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  previewKind: AttachmentPreviewKind;
  createdAt: string;
};

export type DocumentLinkRecord = {
  id: string;
  documentId: string;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  actorId: string;
  createdAt: string;
};
