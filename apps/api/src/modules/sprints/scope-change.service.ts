/**
 * @file Sprint scope change service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  SprintStatus,
  WorkItemStatus,
  type WorkItemRecord
} from "@poco-scrum/domain";
import { InMemorySprintsRepository } from "./sprints.repository";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";

export type ScopeChangeEventRecord = {
  id: string;
  actorId: string;
  sprintId: string;
  workItemId: string;
  action: "SCOPE_IN" | "SCOPE_OUT";
  reason: string;
  createdAt: string;
};

export type ScopeChangeInput = {
  actorId: string;
  sprintId: string;
  workItemId: string;
  reason: string;
};

/**
 * Record scope changes explicitly so active Sprint additions and removals remain auditable.
 */
export class ScopeChangeService {
  private readonly events = new Map<string, ScopeChangeEventRecord[]>();
  private nextSequence = 1;

  constructor(
    private readonly sprintsRepository: InMemorySprintsRepository,
    private readonly workItemsRepository: InMemoryWorkItemsRepository
  ) {}

  /**
   * @param input The active Sprint scope-in payload.
   * @returns The persisted scope-in event.
   */
  async addWorkItemToActiveSprint(input: ScopeChangeInput) {
    const sprint = await this.getActiveSprint(input.sprintId);
    const workItem = await this.getWorkItem(input.workItemId);

    const updatedWorkItem = await this.workItemsRepository.update(workItem.id, {
      ...workItem,
      sprintId: sprint.id,
      status: WorkItemStatus.COMMITTED_TO_SPRINT
    });

    if (!updatedWorkItem) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    return this.appendEvent({
      id: `scope-change-${this.nextSequence++}`,
      actorId: input.actorId,
      sprintId: sprint.id,
      workItemId: updatedWorkItem.id,
      action: "SCOPE_IN",
      reason: input.reason,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * @param input The active Sprint scope-out payload.
   * @returns The persisted scope-out event.
   */
  async removeWorkItemFromActiveSprint(input: ScopeChangeInput) {
    const sprint = await this.getActiveSprint(input.sprintId);
    const workItem = await this.getWorkItem(input.workItemId);

    if (workItem.sprintId !== sprint.id) {
      throw new BadRequestException("WORK_ITEM_NOT_IN_SPRINT");
    }

    const updatedWorkItem = await this.workItemsRepository.update(workItem.id, {
      ...workItem,
      sprintId: null,
      status: WorkItemStatus.READY_FOR_SPRINT
    });

    if (!updatedWorkItem) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    return this.appendEvent({
      id: `scope-change-${this.nextSequence++}`,
      actorId: input.actorId,
      sprintId: sprint.id,
      workItemId: updatedWorkItem.id,
      action: "SCOPE_OUT",
      reason: input.reason,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * @param sprintId The Sprint whose scope change timeline should be returned.
   * @returns Scope change events sorted from newest to oldest.
   */
  async listScopeChangeEvents(sprintId: string) {
    return [...(this.events.get(sprintId) ?? [])].sort((left, right) => {
      const createdAtOrder = right.createdAt.localeCompare(left.createdAt);

      if (createdAtOrder !== 0) {
        return createdAtOrder;
      }

      return right.id.localeCompare(left.id);
    });
  }

  private async getActiveSprint(sprintId: string) {
    const sprint = await this.sprintsRepository.getById(sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    if (sprint.status !== SprintStatus.ACTIVE) {
      throw new BadRequestException("SPRINT_NOT_ACTIVE");
    }

    return sprint;
  }

  private async getWorkItem(workItemId: string): Promise<WorkItemRecord> {
    const workItem = await this.workItemsRepository.getById(workItemId);

    if (!workItem) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    return workItem;
  }

  private appendEvent(entry: ScopeChangeEventRecord) {
    const current = this.events.get(entry.sprintId) ?? [];

    current.push({
      ...entry
    });
    this.events.set(entry.sprintId, current);
    return entry;
  }
}
