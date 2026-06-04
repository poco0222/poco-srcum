/**
 * @file Sprint planning service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import { WorkItemStatus, type SprintCommitmentRecord } from "@poco-scrum/domain";
import type { UpdateSprintPlanningInput } from "./contracts/update-planning.dto";
import { InMemorySprintsRepository } from "./sprints.repository";
import { assertStoryReadyForSprint } from "../work-items/validators/story-ready.validator";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";

export class PlanningService {
  constructor(
    private readonly sprintsRepository: InMemorySprintsRepository,
    private readonly workItemsRepository: InMemoryWorkItemsRepository,
    private nextCommitmentSequence = 1
  ) {}

  /**
   * @param input The validated planning payload that updates goal, commitments, and snapshot.
   * @returns The updated Sprint aggregate after the planning snapshot is persisted.
   */
  async updatePlanning(input: UpdateSprintPlanningInput) {
    const sprint = await this.sprintsRepository.getById(input.sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    const committedItems = [];

    for (const workItemId of input.commitmentWorkItemIds) {
      const workItem = await this.workItemsRepository.getById(workItemId);

      if (!workItem) {
        throw new NotFoundException("WORK_ITEM_NOT_FOUND");
      }

      assertStoryReadyForSprint(workItem);

      const updatedWorkItem = await this.workItemsRepository.update(workItem.id, {
        ...workItem,
        sprintId: sprint.id,
        status: WorkItemStatus.COMMITTED_TO_SPRINT
      });

      if (!updatedWorkItem) {
        throw new NotFoundException("WORK_ITEM_NOT_FOUND");
      }

      committedItems.push(updatedWorkItem);
    }

    const capturedAt = new Date().toISOString();
    const updatedSprint = await this.sprintsRepository.update(sprint.id, {
      ...sprint,
      goal: input.goal,
      planningNote: input.planningNote,
      planningSnapshot: input.planningSnapshot ?? {
        goal: input.goal,
        commitmentWorkItemIds: [...input.commitmentWorkItemIds],
        planningNote: input.planningNote,
        capturedAt
      }
    });

    const commitments: SprintCommitmentRecord[] = committedItems.map((item) => ({
      id: `sprint-commitment-${this.nextCommitmentSequence++}`,
      sprintId: sprint.id,
      workItemId: item.id,
      createdAt: capturedAt
    }));

    await this.sprintsRepository.replaceCommitments(sprint.id, commitments);
    return updatedSprint;
  }

  /**
   * @param sprintId The Sprint that should be checked before entering active execution.
   * @throws BadRequestException when the Sprint planning baseline is still incomplete.
   */
  async assertSprintPlanningReady(sprintId: string) {
    const sprint = await this.sprintsRepository.getById(sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    const commitments = await this.sprintsRepository.listCommitmentsBySprint(sprintId);

    if (
      sprint.goal === null ||
      sprint.goal.trim().length === 0 ||
      commitments.length === 0
    ) {
      throw new BadRequestException("SPRINT_PLANNING_INCOMPLETE");
    }
  }
}
