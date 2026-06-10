/**
 * @file In-memory Sprint repository for the Phase 1 sprint lifecycle API.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  SprintCommitmentRecord,
  SprintDailyUpdateRecord,
  SprintRecord
} from "@poco-scrum/domain";

export type SaveSprintInput = SprintRecord;

/**
 * Keep Sprint persistence narrow so a later Prisma-backed repository can replace it behind the same contract.
 */
export class InMemorySprintsRepository {
  private readonly sprints = new Map<string, SprintRecord>();
  private readonly commitments = new Map<string, SprintCommitmentRecord[]>();
  private readonly dailyUpdates = new Map<string, SprintDailyUpdateRecord[]>();

  constructor(seedSprints: SprintRecord[] = []) {
    for (const sprint of seedSprints) {
      this.sprints.set(sprint.id, cloneSprintRecord(sprint));
    }
  }

  async create(sprint: SaveSprintInput) {
    this.sprints.set(sprint.id, cloneSprintRecord(sprint));
    this.commitments.set(sprint.id, []);
    this.dailyUpdates.set(sprint.id, []);
    return this.getById(sprint.id);
  }

  async update(id: string, sprint: SprintRecord) {
    this.sprints.set(id, cloneSprintRecord(sprint));
    return this.getById(id);
  }

  async getById(id: string) {
    const sprint = this.sprints.get(id);
    return sprint ? cloneSprintRecord(sprint) : null;
  }

  async listByProject(projectId: string) {
    return [...this.sprints.values()]
      .filter((sprint) => sprint.projectId === projectId)
      .sort((left, right) => {
        const leftStartsAt = left.startsAt ?? "";
        const rightStartsAt = right.startsAt ?? "";
        return leftStartsAt.localeCompare(rightStartsAt);
      })
      .map((sprint) => cloneSprintRecord(sprint));
  }

  /**
   * @returns All Sprint records in planned-date order for read models like search.
   */
  async listAll() {
    return [...this.sprints.values()]
      .sort((left, right) => {
        const leftStartsAt = left.startsAt ?? "";
        const rightStartsAt = right.startsAt ?? "";
        return leftStartsAt.localeCompare(rightStartsAt);
      })
      .map((sprint) => cloneSprintRecord(sprint));
  }

  async replaceCommitments(
    sprintId: string,
    entries: SprintCommitmentRecord[]
  ) {
    this.commitments.set(
      sprintId,
      entries.map((entry) => ({
        ...entry
      }))
    );
  }

  async listCommitmentsBySprint(sprintId: string) {
    return (this.commitments.get(sprintId) ?? []).map((entry) => ({
      ...entry
    }));
  }

  async addDailyUpdate(entry: SprintDailyUpdateRecord) {
    const current = this.dailyUpdates.get(entry.sprintId) ?? [];

    current.push({
      ...entry
    });
    this.dailyUpdates.set(entry.sprintId, current);
  }

  async listDailyUpdatesBySprint(sprintId: string) {
    return (this.dailyUpdates.get(sprintId) ?? []).map((entry) => ({
      ...entry
    }));
  }
}

function cloneSprintRecord(sprint: SprintRecord): SprintRecord {
  return {
    ...sprint,
    planningSnapshot: sprint.planningSnapshot
      ? {
          ...sprint.planningSnapshot,
          commitmentWorkItemIds: [...sprint.planningSnapshot.commitmentWorkItemIds]
        }
      : null
  };
}
