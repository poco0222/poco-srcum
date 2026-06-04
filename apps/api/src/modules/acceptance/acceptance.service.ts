/**
 * @file Story acceptance command service for the Phase 1 formal acceptance API.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  AcceptanceStatus,
  NotificationEventType,
  WorkItemType,
  assertAcceptanceStatusTransition,
  type AcceptanceStatusValue,
  type StoryAcceptanceRecord
} from "@poco-scrum/domain";
import type {
  ApproveStoryAcceptanceInput,
  RejectStoryAcceptanceInput,
  ReopenStoryAcceptanceInput
} from "@poco-scrum/shared";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";
import { InMemoryStoryAcceptanceRepository } from "./acceptance.repository";
import { MinimalAuditService } from "../audit/minimal-audit.service";
import { NotificationsService } from "../notifications/notifications.service";

export class AcceptanceService {
  constructor(
    private readonly repository: InMemoryStoryAcceptanceRepository,
    private readonly workItemsRepository: InMemoryWorkItemsRepository,
    private readonly notificationsService?: NotificationsService,
    private readonly auditService?: MinimalAuditService,
    private nextSequence = 1
  ) {}

  /**
   * @param input The approved Story command payload.
   * @returns The persisted formal acceptance record.
   */
  async approveStory(input: ApproveStoryAcceptanceInput) {
    await this.assertStoryExists(input.storyId);
    const record = await this.createRecord({
      storyId: input.storyId,
      status: AcceptanceStatus.APPROVED,
      actorId: input.actorId,
      reason: null,
      operatedAt: input.operatedAt
    });

    await this.notifyAcceptanceEvent(record.storyId, {
      actorId: record.actorId,
      eventType: NotificationEventType.ACCEPTANCE_APPROVED,
      reason: "Story acceptance approved"
    });
    await this.recordAcceptanceAudit(record.storyId, {
      actorId: record.actorId,
      action: "ACCEPTANCE_APPROVED",
      reason: null
    });

    return record;
  }

  /**
   * @param input The rejected Story command payload with required reason.
   * @returns The persisted formal rejection record.
   */
  async rejectStory(input: RejectStoryAcceptanceInput) {
    await this.assertStoryExists(input.storyId);
    const record = await this.createRecord({
      storyId: input.storyId,
      status: AcceptanceStatus.REJECTED,
      actorId: input.actorId,
      reason: input.reason,
      operatedAt: input.operatedAt
    });

    await this.notifyAcceptanceEvent(record.storyId, {
      actorId: record.actorId,
      eventType: NotificationEventType.ACCEPTANCE_REJECTED,
      reason: "Story acceptance rejected"
    });
    await this.recordAcceptanceAudit(record.storyId, {
      actorId: record.actorId,
      action: "ACCEPTANCE_REJECTED",
      reason: record.reason
    });

    return record;
  }

  /**
   * @param input The reopened Story command payload with required reason.
   * @returns The persisted formal reopen record.
   */
  async reopenStory(input: ReopenStoryAcceptanceInput) {
    await this.assertStoryExists(input.storyId);
    const record = await this.createRecord({
      storyId: input.storyId,
      status: AcceptanceStatus.REOPENED,
      actorId: input.actorId,
      reason: input.reason,
      operatedAt: input.operatedAt
    });

    await this.notifyAcceptanceEvent(record.storyId, {
      actorId: record.actorId,
      eventType: NotificationEventType.ACCEPTANCE_REOPENED,
      reason: "Story acceptance reopened"
    });
    await this.recordAcceptanceAudit(record.storyId, {
      actorId: record.actorId,
      action: "ACCEPTANCE_REOPENED",
      reason: record.reason
    });

    return record;
  }

  /**
   * @param storyId The Story whose formal acceptance history should be returned.
   * @returns Oldest-first acceptance records for traceability.
   */
  async listStoryAcceptanceHistory(storyId: string) {
    await this.assertStoryExists(storyId);
    return this.repository.listByStory(storyId);
  }

  private async assertStoryExists(storyId: string) {
    const story = await this.workItemsRepository.getById(storyId);

    if (!story) {
      throw new NotFoundException("WORK_ITEM_NOT_FOUND");
    }

    if (story.type !== WorkItemType.STORY) {
      throw new BadRequestException("STORY_ACCEPTANCE_STORY_ONLY");
    }
  }

  private async createRecord(input: {
    storyId: string;
    status: AcceptanceStatusValue;
    actorId: string;
    reason: string | null;
    operatedAt: string;
  }) {
    const currentStatus = await this.repository.getCurrentStatus(input.storyId);

    try {
      assertAcceptanceStatusTransition(currentStatus, input.status);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    const record: StoryAcceptanceRecord = {
      id: `acceptance-${this.nextSequence++}`,
      storyId: input.storyId,
      status: input.status,
      actorId: input.actorId,
      reason: input.reason,
      operatedAt: input.operatedAt,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(record);
  }

  private async notifyAcceptanceEvent(
    storyId: string,
    input: {
      actorId: string;
      eventType: typeof NotificationEventType[keyof typeof NotificationEventType];
      reason: string;
    }
  ) {
    if (!this.notificationsService) {
      return;
    }

    const story = await this.workItemsRepository.getById(storyId);
    const recipients = new Set(
      [story?.assigneeId, input.actorId].filter(
        (recipientId): recipientId is string =>
          typeof recipientId === "string" && recipientId.trim().length > 0
      )
    );

    for (const recipientId of recipients) {
      await this.notificationsService.createNotification({
        recipientId,
        actorId: input.actorId,
        eventType: input.eventType,
        objectType: "story",
        objectId: storyId,
        reason: input.reason
      });
    }
  }

  private async recordAcceptanceAudit(
    storyId: string,
    input: {
      actorId: string;
      action: string;
      reason: string | null;
    }
  ) {
    if (!this.auditService) {
      return;
    }

    await this.auditService.record({
      actorId: input.actorId,
      objectType: "story",
      objectId: storyId,
      action: input.action,
      payload: {
        reason: input.reason
      }
    });
  }
}
