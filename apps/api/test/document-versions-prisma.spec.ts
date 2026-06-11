/**
 * @file Prisma-backed document version repository regression tests for Phase 2 persistence.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType,
  type DocumentRecord,
  type DocumentVersionRecord
} from "@poco-scrum/domain";
import {
  PrismaDocumentVersionsRepository,
  type PrismaDocumentVersionRow
} from "../src/modules/document-versions/document-versions.service";

describe("Prisma-backed document version repository", () => {
  it("creates immutable document snapshots through Prisma", async () => {
    let createData: Record<string, unknown> | null = null;
    const repository = new PrismaDocumentVersionsRepository({
      documentVersion: {
        async create({ data }: { data: Record<string, unknown> }) {
          createData = data;

          return createVersionRow(data);
        },
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async findMany() {
          throw new Error("findMany should not be called");
        }
      }
    });

    const created = await repository.create(createVersionRecord());

    assert.equal(createData?.versionNumber, 1);
    assert.equal(
      (createData?.snapshot as DocumentRecord).markdown,
      "## Background\n\nStored snapshot."
    );
    assert.ok(createData?.createdAt instanceof Date);
    assert.equal(created.id, "document-version-db-1");
    assert.equal(created.snapshot.documentType, DocumentType.REQUIREMENT);
  });

  it("loads version snapshots by id and document id in version order", async () => {
    const rows = [
      createVersionRow(
        createVersionRecord({
          id: "document-version-db-2",
          versionNumber: 2,
          createdAt: "2026-06-11T09:00:00.000Z"
        })
      ),
      createVersionRow(createVersionRecord())
    ];
    const repository = new PrismaDocumentVersionsRepository({
      documentVersion: {
        async create() {
          throw new Error("create should not be called");
        },
        async findFirst({ where }: { where: { id: string } }) {
          return rows.find((row) => row.id === where.id) ?? null;
        },
        async findMany({
          where
        }: {
          where: { documentId: string };
        }) {
          return rows.filter((row) => row.documentId === where.documentId);
        }
      }
    });

    const loaded = await repository.getById("document-version-db-1");
    const listed = await repository.listByDocumentId("document-db-1");

    assert.equal(loaded?.id, "document-version-db-1");
    assert.deepEqual(
      listed.map((version) => version.id),
      ["document-version-db-1", "document-version-db-2"]
    );
  });

  it("falls back to local storage when the version delegate is unavailable", async () => {
    const repository = new PrismaDocumentVersionsRepository({});
    const created = await repository.create(createVersionRecord());
    const loaded = await repository.getById(created.id);

    assert.equal(loaded?.id, created.id);
    assert.equal(loaded?.snapshot.markdown, "## Background\n\nStored snapshot.");
  });

  it("propagates Prisma runtime errors after the version delegate is selected", async () => {
    const repository = new PrismaDocumentVersionsRepository({
      documentVersion: {
        async create() {
          throw createPrismaConnectionError();
        },
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async findMany() {
          throw new Error("findMany should not be called");
        }
      }
    });

    await assert.rejects(() => repository.create(createVersionRecord()), {
      message: "database unavailable"
    });
  });
});

/**
 * @param overrides Optional document fields for a test case.
 * @returns A domain document record embedded in version snapshots.
 */
function createDocumentRecord(
  overrides: Partial<DocumentRecord> = {}
): DocumentRecord {
  return {
    id: "document-db-1",
    title: "Versioned DB Requirement",
    documentType: DocumentType.REQUIREMENT,
    templateId: "default-requirement",
    targetType: DocumentTargetType.STORY,
    targetId: "story-1",
    authorId: "author-1",
    updatedById: "author-1",
    structuredFields: {
      businessGoal: "Reduce release risk",
      requester: "PopoY",
      priority: "HIGH"
    },
    markdown: "## Background\n\nStored snapshot.",
    createdAt: "2026-06-11T08:00:00.000Z",
    updatedAt: "2026-06-11T08:00:00.000Z",
    ...overrides
  };
}

/**
 * @param overrides Optional version fields for a test case.
 * @returns A domain version record ready for repository persistence.
 */
function createVersionRecord(
  overrides: Partial<DocumentVersionRecord> = {}
): DocumentVersionRecord {
  return {
    id: "document-version-db-1",
    documentId: "document-db-1",
    versionNumber: 1,
    snapshot: createDocumentRecord(),
    changeSummary: "Initial formal draft",
    createdById: "author-1",
    createdAt: "2026-06-11T08:00:00.000Z",
    ...overrides
  };
}

/**
 * @param data The Prisma create payload or domain record used by tests.
 * @returns A Prisma-shaped document version row.
 */
function createVersionRow(
  data: Record<string, unknown>
): PrismaDocumentVersionRow {
  return {
    id: String(data.id),
    documentId: String(data.documentId),
    versionNumber: Number(data.versionNumber),
    snapshot: data.snapshot,
    changeSummary: String(data.changeSummary),
    createdById: String(data.createdById),
    createdAt:
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(String(data.createdAt))
  };
}

/**
 * @returns A Prisma-like connection error used to prove runtime errors are not swallowed.
 */
function createPrismaConnectionError() {
  const error = new Error("database unavailable") as Error & {
    code: string;
  };

  error.code = "P1001";

  return error;
}
