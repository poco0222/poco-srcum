/**
 * @file Sprint lifecycle service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  SprintStatus,
  assertSprintStatusTransition,
  type SprintRecord
} from "@poco-scrum/domain";
import type { CreateSprintInput } from "./contracts/create-sprint.dto";
import { PlanningService } from "./planning.service";
import { InMemorySprintsRepository } from "./sprints.repository";

export class SprintsService {
  constructor(
    private readonly repository: InMemorySprintsRepository = new InMemorySprintsRepository(),
    private nextSequence = 1,
    private readonly planningService?: PlanningService
  ) {}

  /**
   * @param input The validated payload used to create a Sprint shell.
   * @returns The created Sprint record.
   */
  async createSprint(input: CreateSprintInput) {
    const initialStatus = input.status ?? SprintStatus.DRAFT;

    return this.repository.create({
      id: `sprint-${this.nextSequence++}`,
      projectId: input.projectId,
      name: input.name,
      status: initialStatus,
      goal: input.goal ?? null,
      planningNote: input.planningNote ?? null,
      planningSnapshot: null,
      startsAt: input.startsAt ?? null,
      endsAt: input.endsAt ?? null,
      activatedAt: null,
      endedAt: null,
      closedAt: null,
      retrospectiveId: null
    });
  }

  /**
   * @param projectId The project whose Sprint records should be listed.
   * @returns The Sprint records ordered by their planned start date.
   */
  async listSprints(projectId: string) {
    if (typeof projectId !== "string" || projectId.trim().length === 0) {
      throw new BadRequestException("SPRINT_PROJECT_ID_REQUIRED");
    }

    return this.repository.listByProject(projectId.trim());
  }

  /**
   * @param sprintId The requested Sprint identifier.
   * @returns The stored Sprint detail.
   */
  async getSprintById(sprintId: string) {
    const sprint = await this.repository.getById(sprintId.trim());

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    return sprint;
  }

  /**
   * @param sprintId The Sprint to move from planned to active.
   * @returns The updated Sprint record.
   */
  async startSprint(sprintId: string) {
    if (this.planningService) {
      await this.planningService.assertSprintPlanningReady(sprintId);
    }

    return this.transitionSprint(sprintId, SprintStatus.ACTIVE);
  }

  /**
   * @param sprintId The Sprint to move from active to ended.
   * @returns The updated Sprint record.
   */
  async endSprint(sprintId: string) {
    return this.transitionSprint(sprintId, SprintStatus.ENDED);
  }

  /**
   * @param sprintId The Sprint to move from ended to closed.
   * @returns The updated Sprint record.
   */
  async closeSprint(sprintId: string) {
    return this.transitionSprint(sprintId, SprintStatus.CLOSED);
  }

  private async transitionSprint(sprintId: string, nextStatus: typeof SprintStatus[keyof typeof SprintStatus]) {
    const current = await this.repository.getById(sprintId.trim());

    if (!current) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    try {
      assertSprintStatusTransition(current.status, nextStatus);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    const now = new Date().toISOString();
    const updatedSprint: SprintRecord = {
      ...current,
      status: nextStatus,
      activatedAt:
        nextStatus === SprintStatus.ACTIVE ? now : current.activatedAt,
      endedAt: nextStatus === SprintStatus.ENDED ? now : current.endedAt,
      closedAt: nextStatus === SprintStatus.CLOSED ? now : current.closedAt
    };

    return this.repository.update(updatedSprint.id, updatedSprint);
  }
}
