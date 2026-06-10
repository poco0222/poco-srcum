/**
 * @file Object linkage record types for Phase 2 delivery traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import type {
  LinkageObjectTypeValue,
  LinkageRelationTypeValue
} from "./linkage.enums";

export type ObjectLinkRecord = {
  id: string;
  relationType: LinkageRelationTypeValue;
  sourceType: LinkageObjectTypeValue;
  sourceId: string;
  targetType: LinkageObjectTypeValue;
  targetId: string;
  actorId: string;
  createdAt: string;
};
