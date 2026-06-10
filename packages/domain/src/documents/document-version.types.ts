/**
 * @file Formal document version record types for Phase 2 collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import type { DocumentRecord } from "./document.types";

export type DocumentVersionRecord = {
  id: string;
  documentId: string;
  versionNumber: number;
  snapshot: DocumentRecord;
  changeSummary: string;
  createdById: string;
  createdAt: string;
};
