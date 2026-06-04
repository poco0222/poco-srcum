/**
 * @file Sprint closure and retrospective service for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import { SprintStatus } from "@poco-scrum/domain";
import { InMemorySprintsRepository } from "./sprints.repository";

export type RetrospectiveRecord = {
  id: string;
  sprintId: string;
  actorId: string;
  title: string;
  markdown: string;
  createdAt: string;
};

export type CreateRetrospectiveRecordInput = {
  sprintId: string;
  actorId: string;
  title: string;
  markdown: string;
};

/**
 * Keep Sprint closure separate from lifecycle transitions so retrospective creation stays explicit.
 */
export class ClosureService {
  private nextRetrospectiveSequence = 1;

  constructor(private readonly sprintsRepository: InMemorySprintsRepository) {}

  /**
   * @param input The retrospective creation payload recorded after the Sprint ends.
   * @returns The created retrospective record and a Sprint back-reference.
   */
  async createRetrospectiveRecord(input: CreateRetrospectiveRecordInput) {
    const sprint = await this.sprintsRepository.getById(input.sprintId);

    if (!sprint) {
      throw new NotFoundException("SPRINT_NOT_FOUND");
    }

    if (sprint.status !== SprintStatus.ENDED) {
      throw new BadRequestException("SPRINT_RETROSPECTIVE_PREREQUISITE_INVALID");
    }

    const retrospective: RetrospectiveRecord = {
      id: `retrospective-${this.nextRetrospectiveSequence++}`,
      sprintId: sprint.id,
      actorId: input.actorId,
      title: input.title,
      markdown: input.markdown,
      createdAt: new Date().toISOString()
    };

    await this.sprintsRepository.update(sprint.id, {
      ...sprint,
      retrospectiveId: retrospective.id
    });

    return retrospective;
  }
}
