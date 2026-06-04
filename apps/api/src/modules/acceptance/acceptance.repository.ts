/**
 * @file In-memory Story acceptance repository for the Phase 1 formal acceptance API.
 * @author PopoY
 * @created 2026-06-04
 */
import { AcceptanceStatus, type StoryAcceptanceRecord } from "@poco-scrum/domain";

export type SaveStoryAcceptanceRecordInput = StoryAcceptanceRecord;

/**
 * Keep Story acceptance persistence narrow so a later Prisma repository can replace it behind the same contract.
 */
export class InMemoryStoryAcceptanceRepository {
  private readonly records = new Map<string, StoryAcceptanceRecord[]>();

  async create(record: SaveStoryAcceptanceRecordInput) {
    const current = this.records.get(record.storyId) ?? [];
    const nextRecords = [
      ...current,
      {
        ...record
      }
    ];

    this.records.set(record.storyId, nextRecords);
    return {
      ...record
    };
  }

  async listByStory(storyId: string) {
    return (this.records.get(storyId) ?? []).map((record) => ({
      ...record
    }));
  }

  async getCurrentStatus(storyId: string) {
    const current = this.records.get(storyId) ?? [];
    const latest = current.at(-1);

    return latest?.status ?? AcceptanceStatus.PENDING;
  }
}

export const sharedStoryAcceptanceRepository =
  new InMemoryStoryAcceptanceRepository();
