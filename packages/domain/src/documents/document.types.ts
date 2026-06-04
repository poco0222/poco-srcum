/**
 * @file Document record types for the Phase 1 Form plus Markdown model.
 * @author PopoY
 * @created 2026-06-04
 */
import type { DocumentTargetTypeValue } from "./document.enums";

export type DocumentStructuredFields = Record<string, string | number | boolean | null>;

export type DocumentRecord = {
  id: string;
  title: string;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  authorId: string;
  updatedById: string;
  structuredFields: DocumentStructuredFields;
  markdown: string;
  createdAt: string;
  updatedAt: string;
};
