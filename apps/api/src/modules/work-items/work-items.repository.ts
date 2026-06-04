/**
 * @file In-memory work item repository for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { WorkItemRecord } from "@poco-scrum/domain";

export type SaveWorkItemInput = WorkItemRecord;

/**
 * Keep repository operations narrow so later Prisma integration can swap behind the same contract.
 */
export class InMemoryWorkItemsRepository {
  private readonly workItems = new Map<string, WorkItemRecord>();

  constructor(seedItems: WorkItemRecord[] = []) {
    for (const item of seedItems) {
      this.workItems.set(item.id, {
        ...item,
        acceptanceCriteria: [...item.acceptanceCriteria]
      });
    }
  }

  async create(item: SaveWorkItemInput) {
    this.workItems.set(item.id, {
      ...item,
      acceptanceCriteria: [...item.acceptanceCriteria]
    });

    return this.getById(item.id);
  }

  async update(id: string, item: WorkItemRecord) {
    this.workItems.set(id, {
      ...item,
      acceptanceCriteria: [...item.acceptanceCriteria]
    });

    return this.getById(id);
  }

  async getById(id: string) {
    const item = this.workItems.get(id);

    return item
      ? {
          ...item,
          acceptanceCriteria: [...item.acceptanceCriteria]
        }
      : null;
  }

  async listByProject(projectId: string, sprintId?: string) {
    return [...this.workItems.values()]
      .filter((item) => {
        if (item.projectId !== projectId) {
          return false;
        }

        if (sprintId !== undefined) {
          return item.sprintId === sprintId;
        }

        return true;
      })
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item) => ({
        ...item,
        acceptanceCriteria: [...item.acceptanceCriteria]
      }));
  }

  async reorder(items: Array<{ id: string; sortOrder: number }>) {
    for (const entry of items) {
      const current = this.workItems.get(entry.id);

      if (!current) {
        continue;
      }

      this.workItems.set(entry.id, {
        ...current,
        sortOrder: entry.sortOrder,
        acceptanceCriteria: [...current.acceptanceCriteria]
      });
    }
  }
}
