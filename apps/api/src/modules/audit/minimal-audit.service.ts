/**
 * @file Minimal operation audit service for Phase 1 traceability.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import type { MinimalAuditLogRecord } from "@poco-scrum/domain";

export type RecordMinimalAuditInput = {
  actorId: string;
  objectType: string;
  objectId: string;
  action: string;
  payload: Record<string, string | number | boolean | null>;
};

/**
 * Capture only the minimum P1 action trail; full audit governance belongs to Phase 4.
 */
export class MinimalAuditService {
  private readonly logs = new Map<string, MinimalAuditLogRecord[]>();
  private nextSequence = 1;

  /**
   * @param input The action metadata to append to the minimal audit timeline.
   * @returns The persisted audit log entry.
   */
  async record(input: RecordMinimalAuditInput) {
    const payload = normalizeAuditInput(input);
    const record: MinimalAuditLogRecord = {
      id: `audit-${this.nextSequence++}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    const key = buildObjectKey(record.objectType, record.objectId);
    const current = this.logs.get(key) ?? [];

    this.logs.set(key, [
      ...current,
      {
        ...record,
        payload: {
          ...record.payload
        }
      }
    ]);

    return {
      ...record,
      payload: {
        ...record.payload
      }
    };
  }

  /**
   * @param objectType The audited object type.
   * @param objectId The audited object identifier.
   * @returns Oldest-first audit entries for the object.
   */
  async listByObject(objectType: string, objectId: string) {
    const key = buildObjectKey(
      normalizeRequiredText(objectType, "AUDIT_OBJECT_REQUIRED"),
      normalizeRequiredText(objectId, "AUDIT_OBJECT_REQUIRED")
    );

    return (this.logs.get(key) ?? []).map((record) => ({
      ...record,
      payload: {
        ...record.payload
      }
    }));
  }
}

export const sharedMinimalAuditService = new MinimalAuditService();

function normalizeAuditInput(
  input: RecordMinimalAuditInput
): RecordMinimalAuditInput {
  return {
    actorId: normalizeRequiredText(input.actorId, "AUDIT_INPUT_INVALID"),
    objectType: normalizeRequiredText(input.objectType, "AUDIT_INPUT_INVALID"),
    objectId: normalizeRequiredText(input.objectId, "AUDIT_INPUT_INVALID"),
    action: normalizeRequiredText(input.action, "AUDIT_INPUT_INVALID"),
    payload: {
      ...input.payload
    }
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

function buildObjectKey(objectType: string, objectId: string) {
  return `${objectType}:${objectId}`;
}
