/**
 * @file Prisma-backed document repository regression tests for Phase 2 persistence.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentTargetType,
  DocumentType,
  type DocumentRecord
} from "@poco-scrum/domain";
import {
  PrismaDocumentsRepository,
  type PrismaDocumentRow
} from "../src/modules/documents/documents.repository";

describe("Prisma-backed document repository", () => {
  it("creates formal documents through the Prisma document delegate", async () => {
    let createData: Record<string, unknown> | null = null;
    const repository = new PrismaDocumentsRepository({
      document: {
        async create({ data }: { data: Record<string, unknown> }) {
          createData = data;

          return createDocumentRow(data);
        },
        async update() {
          throw new Error("update should not be called");
        },
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async findMany() {
          throw new Error("findMany should not be called");
        }
      }
    });

    const created = await repository.create(createDocumentRecord());

    assert.equal(createData?.documentType, DocumentType.REQUIREMENT);
    assert.equal(createData?.templateId, "default-requirement");
    assert.equal(createData?.targetType, DocumentTargetType.STORY);
    assert.ok(createData?.createdAt instanceof Date);
    assert.ok(createData?.updatedAt instanceof Date);
    assert.equal(created.documentType, DocumentType.REQUIREMENT);
    assert.equal(created.templateId, "default-requirement");
    assert.equal(created.createdAt, "2026-06-11T08:00:00.000Z");
  });

  it("updates and lists documents through Prisma filters", async () => {
    const rows = new Map<string, PrismaDocumentRow>();
    rows.set("document-db-1", createDocumentRow(createDocumentRecord()));
    const repository = new PrismaDocumentsRepository({
      document: {
        async create() {
          throw new Error("create should not be called");
        },
        async update({
          where,
          data
        }: {
          where: { id: string };
          data: Record<string, unknown>;
        }) {
          const current = rows.get(where.id);

          assert.ok(current);

          const updated = createDocumentRow({
            ...current,
            ...data,
            id: where.id
          });
          rows.set(where.id, updated);

          return updated;
        },
        async findFirst({ where }: { where: { id: string } }) {
          return rows.get(where.id) ?? null;
        },
        async findMany({
          where
        }: {
          where?: { targetType?: string; targetId?: string };
        }) {
          return [...rows.values()].filter((row) => {
            return (
              (!where?.targetType || row.targetType === where.targetType) &&
              (!where?.targetId || row.targetId === where.targetId)
            );
          });
        }
      }
    });

    const updated = await repository.update("document-db-1", {
      ...createDocumentRecord(),
      title: "Updated DB Requirement",
      updatedById: "editor-1",
      updatedAt: "2026-06-11T09:00:00.000Z"
    });
    const listed = await repository.listByTarget(
      DocumentTargetType.STORY,
      "story-1"
    );

    assert.equal(updated.title, "Updated DB Requirement");
    assert.equal(updated.updatedById, "editor-1");
    assert.deepEqual(
      listed.map((document) => document.id),
      ["document-db-1"]
    );
  });

  it("falls back to local storage when the document delegate is unavailable", async () => {
    const repository = new PrismaDocumentsRepository({});
    const created = await repository.create(createDocumentRecord());
    const loaded = await repository.getById(created.id);

    assert.equal(loaded?.id, created.id);
    assert.equal(loaded?.documentType, DocumentType.REQUIREMENT);
  });

  it("propagates Prisma runtime errors after the document delegate is selected", async () => {
    const repository = new PrismaDocumentsRepository({
      document: {
        async create() {
          const error = new Error("Unknown argument `documentType`.") as Error & {
            name: string;
          };

          error.name = "PrismaClientValidationError";
          throw error;
        },
        async update() {
          throw new Error("update should not be called");
        },
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async findMany() {
          throw new Error("findMany should not be called");
        }
      }
    });

    await assert.rejects(() => repository.create(createDocumentRecord()), {
      message: "Unknown argument `documentType`."
    });
  });
});

/**
 * @param overrides Optional document fields to override for a test case.
 * @returns A domain document record ready for repository persistence.
 */
function createDocumentRecord(
  overrides: Partial<DocumentRecord> = {}
): DocumentRecord {
  return {
    id: "document-db-1",
    title: "DB Requirement",
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
    markdown: "## Background\n\nStored by Prisma.",
    createdAt: "2026-06-11T08:00:00.000Z",
    updatedAt: "2026-06-11T08:00:00.000Z",
    ...overrides
  };
}

/**
 * @param data The Prisma create or update payload emitted by the repository.
 * @returns A Prisma-shaped document row.
 */
function createDocumentRow(data: Record<string, unknown>): PrismaDocumentRow {
  return {
    id: String(data.id),
    title: String(data.title),
    documentType: (data.documentType ?? null) as PrismaDocumentRow["documentType"],
    templateId: (data.templateId ?? null) as string | null,
    targetType: data.targetType as PrismaDocumentRow["targetType"],
    targetId: String(data.targetId),
    authorId: String(data.authorId),
    updatedById: String(data.updatedById),
    structuredFields: data.structuredFields,
    markdown: String(data.markdown),
    createdAt:
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(String(data.createdAt)),
    updatedAt:
      data.updatedAt instanceof Date
        ? data.updatedAt
        : new Date(String(data.updatedAt))
  };
}
