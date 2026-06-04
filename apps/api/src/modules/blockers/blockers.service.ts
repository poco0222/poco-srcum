/**
 * @file Sprint blocker service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { NotFoundException } from "@nestjs/common";

export type BlockerEventRecord = {
  id: string;
  actorId: string;
  sprintId: string;
  workItemId: string;
  action: "BLOCKER_CREATED" | "BLOCKER_RESOLVED";
  reason: string;
  createdAt: string;
};

export type CreateBlockerInput = {
  actorId: string;
  sprintId: string;
  workItemId: string;
  reason: string;
};

export type ResolveBlockerInput = {
  blockerId: string;
  actorId: string;
  reason: string;
};

/**
 * Keep blocker tracking minimal and append-only so active Sprint impediments stay auditable.
 */
export class BlockersService {
  private readonly events = new Map<string, BlockerEventRecord[]>();
  private nextSequence = 1;

  /**
   * @param input The blocker creation payload.
   * @returns The persisted blocker creation event.
   */
  async createBlocker(input: CreateBlockerInput) {
    const entry: BlockerEventRecord = {
      id: `blocker-${this.nextSequence++}`,
      actorId: input.actorId,
      sprintId: input.sprintId,
      workItemId: input.workItemId,
      action: "BLOCKER_CREATED",
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.appendEvent(entry);
    return entry;
  }

  /**
   * @param input The blocker resolution payload.
   * @returns The persisted blocker resolution event.
   */
  async resolveBlocker(input: ResolveBlockerInput) {
    const existing = this.findEventById(input.blockerId);

    if (!existing) {
      throw new NotFoundException("BLOCKER_NOT_FOUND");
    }

    const entry: BlockerEventRecord = {
      id: `blocker-${this.nextSequence++}`,
      actorId: input.actorId,
      sprintId: existing.sprintId,
      workItemId: existing.workItemId,
      action: "BLOCKER_RESOLVED",
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.appendEvent(entry);
    return entry;
  }

  private appendEvent(entry: BlockerEventRecord) {
    const current = this.events.get(entry.sprintId) ?? [];

    current.push({
      ...entry
    });
    this.events.set(entry.sprintId, current);
  }

  private findEventById(blockerId: string) {
    for (const sprintEvents of this.events.values()) {
      const match = sprintEvents.find((entry) => entry.id === blockerId);

      if (match) {
        return {
          ...match
        };
      }
    }

    return null;
  }
}
