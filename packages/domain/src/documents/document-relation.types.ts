/**
 * @file Formal document relation record types for Phase 2 Scrum artifact linkage.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  DocumentRelationTargetTypeValue,
  DocumentRelationTypeValue
} from "./document-relation.enums";

export type DocumentRelationRecord = {
  id: string;
  documentId: string;
  relationType: DocumentRelationTypeValue;
  targetType: DocumentRelationTargetTypeValue;
  targetId: string;
  actorId: string;
  createdAt: string;
};
