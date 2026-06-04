/**
 * @file Sprint board and daily update service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  SprintStatus,
  WorkItemStatus,
  type SprintDailyUpdateRecord,
  type WorkItemRecord
} from "@poco-scrum/domain";
import { InMemorySprintsRepository } from "./sprints.repository";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";

export type SprintBoardColumn = "todo" | "in-progress" | "done";

export type MoveWorkItemToBoardColumnInput = {
  sprintId: string;
  workItemId: string;
  column: SprintBoardColumn;
};

export type RecordDailyUpdateInput = {
  sprintId: string;
  workItemId: string | null;
  authorId: string;
  summary: string;
};

/**
 * Keep the active Sprint execution flow centered on one service so board state and daily updates stay aligned.
 */
export class DailyUpdatesService {
  private nextDailyUpdateSequence = 1;

  constructor(
    private readonly sprintsRepository: InMemorySprintsRepository,
    private readonly workItemsRepository: InMemoryWorkItemsRepository
  ) {}

  /**
   * @param sprintId The Sprint whose board should be returned.
   * @returns The board grouped into todo, in-progress, and done columns.
   */
  async getBoard(sprintId: string) {
    const sprint = await this.sprintsRepository.getById(sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    if (sprint.status !== SprintStatus.ACTIVE) {
      throw new BadRequestException("SPRINT_NOT_ACTIVE");
    }

    const allProjectItems = await this.workItemsRepository.listByProject(sprint.projectId);
    const sprintItems = allProjectItems.filter((item) => item.sprintId === sprintId);

    return {
      todo: sprintItems.filter(
        (item) => item.status === WorkItemStatus.COMMITTED_TO_SPRINT
      ),
      inProgress: sprintItems.filter(
        (item) => item.status === WorkItemStatus.IN_PROGRESS
      ),
      done: sprintItems.filter((item) => item.status === WorkItemStatus.DONE)
    };
  }

  /**
   * @param input The board column move request for one Sprint work item.
   * @returns The updated work item after the execution status changes.
   */
  async moveWorkItemToBoardColumn(input: MoveWorkItemToBoardColumnInput) {
    const workItem = await this.workItemsRepository.getById(input.workItemId);

    if (!workItem || workItem.sprintId !== input.sprintId) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    const nextStatus =
      input.column === "todo"
        ? WorkItemStatus.COMMITTED_TO_SPRINT
        : input.column === "in-progress"
          ? WorkItemStatus.IN_PROGRESS
          : WorkItemStatus.DONE;

    return this.workItemsRepository.update(workItem.id, {
      ...workItem,
      status: nextStatus
    });
  }

  /**
   * @param input The update payload to append to the Sprint daily timeline.
   * @returns The persisted daily update record.
   */
  async recordDailyUpdate(input: RecordDailyUpdateInput) {
    const sprint = await this.sprintsRepository.getById(input.sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    if (
      typeof input.authorId !== "string" ||
      input.authorId.trim().length === 0 ||
      typeof input.summary !== "string" ||
      input.summary.trim().length === 0
    ) {
      throw new BadRequestException("SPRINT_DAILY_UPDATE_INPUT_INVALID");
    }

    if (input.workItemId !== null) {
      const workItem = await this.workItemsRepository.getById(input.workItemId);

      if (!workItem || workItem.sprintId !== input.sprintId) {
        throw new NotFoundException("WORK_ITEM_NOT_FOUND");
      }
    }

    const entry: SprintDailyUpdateRecord = {
      id: `sprint-daily-update-${this.nextDailyUpdateSequence++}`,
      sprintId: input.sprintId,
      workItemId: input.workItemId,
      authorId: input.authorId.trim(),
      summary: input.summary.trim(),
      createdAt: new Date().toISOString()
    };

    await this.sprintsRepository.addDailyUpdate(entry);
    return entry;
  }

  /**
   * @param sprintId The Sprint whose timeline should be returned.
   * @param workItemId Optional work item filter within the Sprint timeline.
   * @returns Daily updates sorted from newest to oldest.
   */
  async listDailyUpdates(sprintId: string, workItemId?: string) {
    const updates = await this.sprintsRepository.listDailyUpdatesBySprint(sprintId);

    return updates
      .filter((entry) => workItemId === undefined || entry.workItemId === workItemId)
      .sort((left, right) => {
        const createdAtOrder = right.createdAt.localeCompare(left.createdAt);

        if (createdAtOrder !== 0) {
          return createdAtOrder;
        }

        return right.id.localeCompare(left.id);
      });
  }
}
