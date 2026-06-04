/**
 * @file Minimal operation audit log types for Phase 1 traceability.
 * @author PopoY
 * @created 2026-06-04
 */

export type MinimalAuditLogRecord = {
  id: string;
  actorId: string;
  objectType: string;
  objectId: string;
  action: string;
  payload: Record<string, string | number | boolean | null>;
  createdAt: string;
};
