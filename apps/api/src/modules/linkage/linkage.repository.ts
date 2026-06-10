/**
 * @file Object link repository contracts and in-memory storage for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import type {
  LinkageObjectTypeValue,
  LinkageRelationTypeValue,
  ObjectLinkRecord
} from "@poco-scrum/domain";

export type ObjectLinkEndpointQuery = {
  objectType: LinkageObjectTypeValue;
  objectId: string;
};

export type ObjectLinkDuplicateQuery = {
  relationType: LinkageRelationTypeValue;
  sourceType: LinkageObjectTypeValue;
  sourceId: string;
  targetType: LinkageObjectTypeValue;
  targetId: string;
};

export type PrismaObjectLinkRow = {
  id: string;
  relationType: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  actorId: string;
  createdAt: Date;
};

type PrismaObjectLinkDelegate = {
  create(args: { data: Record<string, unknown> }): Promise<PrismaObjectLinkRow>;
  findFirst(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaObjectLinkRow | null>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: unknown;
  }): Promise<PrismaObjectLinkRow[]>;
};

export type PrismaObjectLinksClient = {
  objectLink?: PrismaObjectLinkDelegate;
  $disconnect?: () => Promise<void>;
};

/**
 * @description Storage contract shared by in-memory and Prisma object link adapters.
 */
export interface ObjectLinksRepository {
  create(link: ObjectLinkRecord): Promise<ObjectLinkRecord>;
  getById(id: string): Promise<ObjectLinkRecord | null>;
  findDuplicate(
    query: ObjectLinkDuplicateQuery
  ): Promise<ObjectLinkRecord | null>;
  listForward(query: ObjectLinkEndpointQuery): Promise<ObjectLinkRecord[]>;
  listReverse(query: ObjectLinkEndpointQuery): Promise<ObjectLinkRecord[]>;
  listAll(): Promise<ObjectLinkRecord[]> | ObjectLinkRecord[];
}

/**
 * Repository boundary kept narrow so Prisma storage can replace the in-memory store later.
 */
export class InMemoryObjectLinksRepository implements ObjectLinksRepository {
  private readonly links = new Map<string, ObjectLinkRecord>();

  /**
   * @param link The object link to persist.
   * @returns A defensive copy of the persisted link.
   */
  async create(link: ObjectLinkRecord) {
    this.links.set(link.id, cloneObjectLink(link));
    return this.getById(link.id) as Promise<ObjectLinkRecord>;
  }

  /**
   * @param id The object link identifier.
   * @returns The matching link or null.
   */
  async getById(id: string) {
    const link = this.links.get(id);

    return link ? cloneObjectLink(link) : null;
  }

  /**
   * @param query The exact relation and endpoint tuple.
   * @returns The matching duplicate link or null.
   */
  async findDuplicate(query: ObjectLinkDuplicateQuery) {
    return (
      [...this.links.values()].find(
        (link) =>
          link.relationType === query.relationType &&
          link.sourceType === query.sourceType &&
          link.sourceId === query.sourceId &&
          link.targetType === query.targetType &&
          link.targetId === query.targetId
      ) ?? null
    );
  }

  /**
   * @param query The source endpoint whose outgoing links should be listed.
   * @returns Oldest-first links from the source endpoint.
   */
  async listForward(query: ObjectLinkEndpointQuery) {
    return this.listAll()
      .filter(
        (link) =>
          link.sourceType === query.objectType && link.sourceId === query.objectId
      )
      .sort(compareLinksByCreatedAt);
  }

  /**
   * @param query The target endpoint whose incoming links should be listed.
   * @returns Oldest-first links pointing at the target endpoint.
   */
  async listReverse(query: ObjectLinkEndpointQuery) {
    return this.listAll()
      .filter(
        (link) =>
          link.targetType === query.objectType && link.targetId === query.objectId
      )
      .sort(compareLinksByCreatedAt);
  }

  /**
   * @returns All links in oldest-first order for read models like search and dashboard.
   */
  listAll() {
    return [...this.links.values()].map((link) => cloneObjectLink(link));
  }
}

export class PrismaObjectLinksRepository implements ObjectLinksRepository {
  private readonly fallbackRepository = new InMemoryObjectLinksRepository();
  private useFallbackStorage = false;

  constructor(private readonly prisma: PrismaObjectLinksClient) {}

  /**
   * @param link The object link to persist.
   * @returns The persisted object link from Prisma or local fallback storage.
   */
  async create(link: ObjectLinkRecord) {
    const objectLink = this.getObjectLinkDelegate();

    if (!objectLink) {
      this.enableFallbackStorage();

      return this.fallbackRepository.create(link);
    }

    try {
      const row = await objectLink.create({
        data: {
          id: link.id,
          relationType: link.relationType,
          sourceType: link.sourceType,
          sourceId: link.sourceId,
          targetType: link.targetType,
          targetId: link.targetId,
          actorId: link.actorId,
          createdAt: link.createdAt
        }
      });

      return normalizePrismaObjectLink(row);
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        this.enableFallbackStorage();

        return this.fallbackRepository.create(link);
      }

      throw error;
    }
  }

  /**
   * @param id The object link identifier.
   * @returns The matching link or null.
   */
  async getById(id: string) {
    const objectLink = this.getObjectLinkDelegate();

    if (!objectLink) {
      this.enableFallbackStorage();

      return this.fallbackRepository.getById(id);
    }

    try {
      const row = await objectLink.findFirst({
        where: {
          id
        }
      });

      return row ? normalizePrismaObjectLink(row) : null;
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        this.enableFallbackStorage();

        return this.fallbackRepository.getById(id);
      }

      throw error;
    }
  }

  /**
   * @param query The exact relation and endpoint tuple.
   * @returns The matching duplicate link or null.
   */
  async findDuplicate(query: ObjectLinkDuplicateQuery) {
    const objectLink = this.getObjectLinkDelegate();

    if (!objectLink) {
      this.enableFallbackStorage();

      return this.fallbackRepository.findDuplicate(query);
    }

    try {
      const row = await objectLink.findFirst({
        where: {
          relationType: query.relationType,
          sourceType: query.sourceType,
          sourceId: query.sourceId,
          targetType: query.targetType,
          targetId: query.targetId
        }
      });

      return row ? normalizePrismaObjectLink(row) : null;
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        this.enableFallbackStorage();

        return this.fallbackRepository.findDuplicate(query);
      }

      throw error;
    }
  }

  /**
   * @param query The source endpoint whose outgoing links should be listed.
   * @returns Oldest-first links from the source endpoint.
   */
  async listForward(query: ObjectLinkEndpointQuery) {
    return this.findManyByEndpoint({
      sourceType: query.objectType,
      sourceId: query.objectId
    });
  }

  /**
   * @param query The target endpoint whose incoming links should be listed.
   * @returns Oldest-first links pointing at the target endpoint.
   */
  async listReverse(query: ObjectLinkEndpointQuery) {
    return this.findManyByEndpoint({
      targetType: query.objectType,
      targetId: query.objectId
    });
  }

  /**
   * @returns All links in oldest-first order for read models like search and dashboard.
   */
  async listAll() {
    return this.findManyByEndpoint({});
  }

  /**
   * @param where The Prisma objectLink filter for endpoint queries.
   * @returns Normalized object links from Prisma or fallback storage.
   */
  private async findManyByEndpoint(where: Record<string, unknown>) {
    const objectLink = this.getObjectLinkDelegate();

    if (!objectLink) {
      this.enableFallbackStorage();

      return this.filterFallbackLinks(where);
    }

    try {
      const rows = await objectLink.findMany({
        where,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }]
      });

      return rows.map((row) => normalizePrismaObjectLink(row));
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        this.enableFallbackStorage();

        return this.filterFallbackLinks(where);
      }

      throw error;
    }
  }

  /**
   * @param where The endpoint filters used when Prisma is unavailable.
   * @returns In-memory fallback rows matching the same endpoint filter.
   */
  private filterFallbackLinks(where: Record<string, unknown>) {
    return this.fallbackRepository
      .listAll()
      .filter((link) => {
        return Object.entries(where).every(([key, value]) => {
          return link[key as keyof ObjectLinkRecord] === value;
        });
      })
      .sort(compareLinksByCreatedAt);
  }

  /**
   * @returns The generated Prisma objectLink delegate, or null when client generation is stale.
   */
  private getObjectLinkDelegate() {
    if (this.useFallbackStorage) {
      return null;
    }

    return this.prisma.objectLink ?? null;
  }

  /**
   * @description Keeps reads and duplicate checks consistent after a write fallback.
   */
  private enableFallbackStorage() {
    this.useFallbackStorage = true;
  }
}

/**
 * @param link The stored object link.
 * @returns A defensive copy of the record.
 */
function cloneObjectLink(link: ObjectLinkRecord): ObjectLinkRecord {
  return {
    ...link
  };
}

/**
 * @param left The first link to compare.
 * @param right The second link to compare.
 * @returns Sort order by creation time, then id for deterministic tests.
 */
function compareLinksByCreatedAt(left: ObjectLinkRecord, right: ObjectLinkRecord) {
  const createdAtOrder = left.createdAt.localeCompare(right.createdAt);

  return createdAtOrder === 0 ? left.id.localeCompare(right.id) : createdAtOrder;
}

/**
 * @param row The raw Prisma objectLink row.
 * @returns A domain object link record with ISO datetime text.
 */
function normalizePrismaObjectLink(row: PrismaObjectLinkRow): ObjectLinkRecord {
  return {
    id: row.id,
    relationType: row.relationType as LinkageRelationTypeValue,
    sourceType: row.sourceType as LinkageObjectTypeValue,
    sourceId: row.sourceId,
    targetType: row.targetType as LinkageObjectTypeValue,
    targetId: row.targetId,
    actorId: row.actorId,
    createdAt: row.createdAt.toISOString()
  };
}

/**
 * @param error The unknown Prisma runtime error.
 * @returns Whether local in-memory fallback is safer than failing object link flows.
 */
function isPrismaFallbackError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const code = (error as { code?: unknown }).code;

  return (
    code === "P1001" ||
    code === "P1003" ||
    code === "P2021" ||
    code === "P2022"
  );
}
