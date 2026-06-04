/**
 * @file Story completion guard for the Phase 1 formal acceptance gate.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException } from "@nestjs/common";

import {
  canCompleteStoryWithAcceptance,
  WorkItemType,
  type AcceptanceStatusValue,
  type WorkItemRecord
} from "@poco-scrum/domain";

export type StoryAcceptanceStatusReader = {
  getCurrentStatus: (storyId: string) => Promise<AcceptanceStatusValue>;
};

/**
 * Centralize the Story Definition of Done acceptance check so services cannot bypass it.
 */
export class StoryDoneGuard {
  constructor(private readonly acceptanceReader: StoryAcceptanceStatusReader) {}

  /**
   * @param story The work item that is attempting to enter Done.
   * @returns Promise that resolves when the Story satisfies the formal acceptance gate.
   */
  async assertCanCompleteStory(story: WorkItemRecord) {
    if (story.type !== WorkItemType.STORY) {
      return;
    }

    const acceptanceStatus = await this.acceptanceReader.getCurrentStatus(story.id);

    if (!canCompleteStoryWithAcceptance(acceptanceStatus)) {
      throw new BadRequestException("STORY_ACCEPTANCE_NOT_APPROVED");
    }
  }
}
