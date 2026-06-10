/**
 * @file Prisma-backed object linkage regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  LinkageObjectType,
  LinkageRelationType
} from "@poco-scrum/domain";
import {
  PrismaObjectLinksRepository,
  type PrismaObjectLinkRow
} from "../src/modules/linkage/linkage.repository";
import { resolveObjectLinksPrismaClient } from "../src/modules/linkage/linkage.prisma";

describe("Prisma-backed object linkage repository", () => {
  it("creates object links through the Prisma objectLink delegate", async () => {
    let createCalls = 0;
    const repository = new PrismaObjectLinksRepository({
      objectLink: {
        async create({ data }: { data: Record<string, unknown> }) {
          createCalls += 1;
          assert.equal(data.id, "object-link-1");
          assert.equal(data.relationType, LinkageRelationType.REQUIREMENT_TO_DESIGN);
          assert.equal(data.sourceType, LinkageObjectType.REQUIREMENT_DOCUMENT);
          assert.equal(data.sourceId, "requirement-1");
          assert.equal(data.targetType, LinkageObjectType.DESIGN_DOCUMENT);
          assert.equal(data.targetId, "design-1");
          assert.equal(data.actorId, "user-1");

          return createObjectLinkRow(data);
        },
        async findFirst() {
          throw new Error("findFirst should not be called while creating");
        },
        async findMany() {
          throw new Error("findMany should not be called while creating");
        }
      }
    });

    const link = await repository.create({
      id: "object-link-1",
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "requirement-1",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "design-1",
      actorId: "user-1",
      createdAt: "2026-06-10T12:00:00.000Z"
    });

    assert.equal(createCalls, 1);
    assert.equal(link.id, "object-link-1");
    assert.equal(link.createdAt, "2026-06-10T12:00:00.000Z");
  });

  it("queries duplicate, forward, and reverse links through Prisma filters", async () => {
    const findManyWhereClauses: unknown[] = [];
    const repository = new PrismaObjectLinksRepository({
      objectLink: {
        async create() {
          throw new Error("create should not be called while querying");
        },
        async findFirst({ where }: { where: Record<string, unknown> }) {
          assert.deepEqual(where, {
            relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
            sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
            sourceId: "requirement-1",
            targetType: LinkageObjectType.DESIGN_DOCUMENT,
            targetId: "design-1"
          });

          return createObjectLinkRow({
            id: "object-link-1",
            relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
            sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
            sourceId: "requirement-1",
            targetType: LinkageObjectType.DESIGN_DOCUMENT,
            targetId: "design-1",
            actorId: "user-1"
          });
        },
        async findMany({ where }: { where: Record<string, unknown> }) {
          findManyWhereClauses.push(where);

          return [
            createObjectLinkRow({
              id: "object-link-1",
              relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
              sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
              sourceId: "requirement-1",
              targetType: LinkageObjectType.DESIGN_DOCUMENT,
              targetId: "design-1",
              actorId: "user-1"
            })
          ];
        }
      }
    });

    const duplicate = await repository.findDuplicate({
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "requirement-1",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "design-1"
    });
    const forwardLinks = await repository.listForward({
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      objectId: "requirement-1"
    });
    const reverseLinks = await repository.listReverse({
      objectType: LinkageObjectType.DESIGN_DOCUMENT,
      objectId: "design-1"
    });

    assert.equal(duplicate?.id, "object-link-1");
    assert.deepEqual(findManyWhereClauses, [
      {
        sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        sourceId: "requirement-1"
      },
      {
        targetType: LinkageObjectType.DESIGN_DOCUMENT,
        targetId: "design-1"
      }
    ]);
    assert.equal(forwardLinks[0]?.id, "object-link-1");
    assert.equal(reverseLinks[0]?.id, "object-link-1");
  });

  it("falls back to in-memory links when the generated Prisma client lacks objectLink", async () => {
    const repository = new PrismaObjectLinksRepository({} as never);

    const link = await repository.create({
      id: "object-link-fallback-1",
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "requirement-fallback-1",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "design-fallback-1",
      actorId: "user-1",
      createdAt: "2026-06-10T12:00:00.000Z"
    });
    const forwardLinks = await repository.listForward({
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      objectId: "requirement-fallback-1"
    });

    assert.equal(link.id, "object-link-fallback-1");
    assert.equal(forwardLinks[0]?.id, "object-link-fallback-1");
  });

  it("keeps fallback reads consistent after a Prisma create fallback", async () => {
    let findManyCalls = 0;
    const repository = new PrismaObjectLinksRepository({
      objectLink: {
        async create() {
          const error = new Error("Database is unavailable.") as Error & {
            code: string;
          };

          error.code = "P1001";
          throw error;
        },
        async findFirst() {
          throw new Error("findFirst should not be called after fallback mode");
        },
        async findMany() {
          findManyCalls += 1;
          return [];
        }
      }
    });

    const link = await repository.create({
      id: "object-link-fallback-2",
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "requirement-fallback-2",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "design-fallback-2",
      actorId: "user-1",
      createdAt: "2026-06-10T12:00:00.000Z"
    });
    const forwardLinks = await repository.listForward({
      objectType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      objectId: "requirement-fallback-2"
    });
    const duplicate = await repository.findDuplicate({
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "requirement-fallback-2",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "design-fallback-2"
    });

    assert.equal(link.id, "object-link-fallback-2");
    assert.equal(findManyCalls, 0);
    assert.equal(forwardLinks[0]?.id, "object-link-fallback-2");
    assert.equal(duplicate?.id, "object-link-fallback-2");
  });

  it("disconnects stale Prisma clients that do not expose objectLink", async () => {
    let connectCalls = 0;
    let disconnectCalls = 0;
    const staleClient = {
      async $connect() {
        connectCalls += 1;
      },
      async $disconnect() {
        disconnectCalls += 1;
      }
    };

    const resolvedClient = await resolveObjectLinksPrismaClient(staleClient);

    assert.equal(resolvedClient, null);
    assert.equal(connectCalls, 0);
    assert.equal(disconnectCalls, 1);
  });
});

/**
 * @param data The minimal fake Prisma row fields used by linkage tests.
 * @returns A Prisma-shaped object link row.
 */
function createObjectLinkRow(data: Record<string, unknown>): PrismaObjectLinkRow {
  return {
    id: data.id as string,
    relationType: data.relationType as string,
    sourceType: data.sourceType as string,
    sourceId: data.sourceId as string,
    targetType: data.targetType as string,
    targetId: data.targetId as string,
    actorId: data.actorId as string,
    createdAt: new Date(
      (data.createdAt as string | undefined) ?? "2026-06-10T12:00:00.000Z"
    )
  };
}
