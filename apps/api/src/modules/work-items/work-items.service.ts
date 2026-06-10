/**
 * @file Work items service for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  evaluateStoryReadyState,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
  type WorkItemRecord
} from "@poco-scrum/domain";
import {
  CreateWorkItemInputSchema,
  ReorderBacklogItemsInputSchema,
  UpdateWorkItemInputSchema,
  type CreateWorkItemInput,
  type ReorderBacklogItemsInput,
  type UpdateWorkItemInput
} from "@poco-scrum/shared";
import { assertStoryReadyForSprint } from "./validators/story-ready.validator";
import { assertWorkItemParentRelation } from "./validators/work-item-parent.validator";
import { StoryDoneGuard } from "./guards/story-done.guard";
import { InMemoryWorkItemsRepository } from "./work-items.repository";

export type AddStoryToSprintInput = {
  workItemId: string;
  sprintId: string;
};

export type CompleteStoryInput = {
  workItemId: string;
  actorId: string;
};

export class WorkItemsService {
  constructor(
    private readonly repository: InMemoryWorkItemsRepository = new InMemoryWorkItemsRepository(),
    private nextSequence = 1,
    private readonly storyDoneGuard?: StoryDoneGuard
  ) {}

  /**
   * @param input The validated creation payload for a backlog item.
   * @returns The created work item record.
   */
  async createWorkItem(input: CreateWorkItemInput) {
    const payload = CreateWorkItemInputSchema.parse(input);
    const parent = payload.parentId
      ? await this.repository.getById(payload.parentId)
      : null;

    assertWorkItemParentRelation({
      workItemType: payload.type,
      projectId: payload.projectId,
      parent: parent
        ? {
            id: parent.id,
            type: parent.type,
            projectId: parent.projectId
          }
        : null
    });

    const workItem: WorkItemRecord = {
      id: `work-item-${this.nextSequence++}`,
      type: payload.type,
      title: payload.title,
      status: WorkItemStatus.BACKLOG,
      priority: payload.priority,
      storyPoints: payload.storyPoints,
      acceptanceCriteria: payload.acceptanceCriteria,
      projectId: payload.projectId,
      sprintId: null,
      parentId: payload.parentId,
      assigneeId: payload.assigneeId,
      sortOrder: payload.sortOrder,
      description: payload.description
    };

    if (
      workItem.type === WorkItemType.STORY &&
      evaluateStoryReadyState(workItem).isReady
    ) {
      workItem.status = WorkItemStatus.READY_FOR_SPRINT;
    }

    return this.repository.create(workItem);
  }

  /**
   * @param projectId The project whose backlog should be listed.
   * @returns Backlog items ordered by their persisted sort order.
   */
  async listBacklogItems(projectId: string, sprintId?: string) {
    if (projectId.trim().length === 0) {
      throw new BadRequestException("WORK_ITEM_PROJECT_ID_REQUIRED");
    }

    return this.repository.listByProject(
      projectId.trim(),
      typeof sprintId === "string" && sprintId.trim().length > 0
        ? sprintId.trim()
        : undefined
    );
  }

  /**
   * @returns All work items for read-only aggregation surfaces.
   */
  async listAllWorkItems() {
    return this.repository.listAll();
  }

  /**
   * @param workItemId The unique work item identifier.
   * @returns The stored work item detail.
   */
  async getWorkItemById(workItemId: string) {
    const item = await this.repository.getById(workItemId);

    if (!item) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    return item;
  }

  /**
   * @param input The partial update payload that should be merged into the existing item.
   * @returns The updated work item record.
   */
  async updateWorkItem(input: UpdateWorkItemInput) {
    const payload = UpdateWorkItemInputSchema.parse(input);
    const current = await this.repository.getById(payload.id);

    if (!current) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    const nextItem: WorkItemRecord = {
      ...current,
      title: payload.title ?? current.title,
      priority: payload.priority ?? current.priority,
      storyPoints:
        payload.storyPoints === undefined ? current.storyPoints : payload.storyPoints,
      acceptanceCriteria:
        payload.acceptanceCriteria ?? [...current.acceptanceCriteria],
      parentId: payload.parentId === undefined ? current.parentId : payload.parentId,
      assigneeId:
        payload.assigneeId === undefined ? current.assigneeId : payload.assigneeId,
      description:
        payload.description === undefined ? current.description : payload.description
    };

    const parent = nextItem.parentId
      ? await this.repository.getById(nextItem.parentId)
      : null;

    assertWorkItemParentRelation({
      workItemType: nextItem.type,
      projectId: nextItem.projectId,
      parent: parent
        ? {
            id: parent.id,
            type: parent.type,
            projectId: parent.projectId
          }
        : null
    });

    if (
      nextItem.type === WorkItemType.STORY &&
      nextItem.sprintId === null &&
      evaluateStoryReadyState(nextItem).isReady
    ) {
      nextItem.status = WorkItemStatus.READY_FOR_SPRINT;
    }

    return this.repository.update(nextItem.id, nextItem);
  }

  /**
   * @param input The new sort order for a backlog subset within one project.
   * @returns The refreshed backlog order after persistence.
   */
  async reorderBacklogItems(input: ReorderBacklogItemsInput) {
    const payload = ReorderBacklogItemsInputSchema.parse(input);

    for (const entry of payload.itemOrders) {
      const current = await this.repository.getById(entry.id);

      if (!current) {
        throw new NotFoundException("WORK_ITEM_NOT_FOUND");
      }

      if (current.projectId !== payload.projectId) {
        throw new BadRequestException("WORK_ITEM_PROJECT_MISMATCH");
      }
    }

    await this.repository.reorder(payload.itemOrders);
    return this.repository.listByProject(payload.projectId);
  }

  /**
   * @param input The story and sprint pair that should be committed to planning.
   * @returns The updated story after the ready gate and sprint assignment succeed.
   */
  async addStoryToSprint(input: AddStoryToSprintInput) {
    if (
      typeof input.workItemId !== "string" ||
      input.workItemId.trim().length === 0 ||
      typeof input.sprintId !== "string" ||
      input.sprintId.trim().length === 0
    ) {
      throw new BadRequestException("SPRINT_COMMIT_INPUT_INVALID");
    }

    const workItem = await this.repository.getById(input.workItemId.trim());

    if (!workItem) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    assertStoryReadyForSprint(workItem);

    return this.repository.update(workItem.id, {
      ...workItem,
      sprintId: input.sprintId.trim(),
      status: WorkItemStatus.COMMITTED_TO_SPRINT
    });
  }

  /**
   * @param input The Story completion command including the acting user for future audit handoff.
   * @returns The completed Story after the formal acceptance guard passes.
   */
  async completeStory(input: CompleteStoryInput) {
    if (
      typeof input.workItemId !== "string" ||
      input.workItemId.trim().length === 0 ||
      typeof input.actorId !== "string" ||
      input.actorId.trim().length === 0
    ) {
      throw new BadRequestException("WORK_ITEM_COMPLETE_INPUT_INVALID");
    }

    const workItem = await this.repository.getById(input.workItemId.trim());

    if (!workItem) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    if (workItem.type !== WorkItemType.STORY) {
      throw new BadRequestException("WORK_ITEM_COMPLETE_STORY_ONLY");
    }

    if (!this.storyDoneGuard) {
      throw new BadRequestException("STORY_DONE_GUARD_REQUIRED");
    }

    await this.storyDoneGuard.assertCanCompleteStory(workItem);

    return this.repository.update(workItem.id, {
      ...workItem,
      status: WorkItemStatus.DONE
    });
  }
}
