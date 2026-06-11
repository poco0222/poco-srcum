/**
 * @file Prisma-backed document review repository regression tests for Phase 2 persistence.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentReviewStatus,
  type DocumentReviewRecord
} from "@poco-scrum/domain";
import {
  PrismaDocumentReviewsRepository,
  type PrismaDocumentReviewRow
} from "../src/modules/reviews/reviews.service";

describe("Prisma-backed document review repository", () => {
  it("upserts the current review state by document id", async () => {
    let upsertArgs: Record<string, unknown> | null = null;
    const repository = new PrismaDocumentReviewsRepository({
      documentReview: {
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async upsert(args: Record<string, unknown>) {
          upsertArgs = args;

          return createReviewRow(createReviewRecord());
        }
      }
    });

    const saved = await repository.save(createReviewRecord());

    assert.deepEqual(upsertArgs?.where, {
      documentId: "document-db-1"
    });
    assert.equal(saved.status, DocumentReviewStatus.IN_REVIEW);
    assert.equal(saved.submittedVersionId, "document-version-db-1");
  });

  it("loads the current review by document id", async () => {
    const repository = new PrismaDocumentReviewsRepository({
      documentReview: {
        async findFirst({ where }: { where: { documentId: string } }) {
          assert.equal(where.documentId, "document-db-1");

          return createReviewRow(createReviewRecord());
        },
        async upsert() {
          throw new Error("upsert should not be called");
        }
      }
    });

    const loaded = await repository.getByDocumentId("document-db-1");

    assert.equal(loaded?.id, "review-db-1");
    assert.equal(loaded?.status, DocumentReviewStatus.IN_REVIEW);
    assert.equal(loaded?.submittedAt, "2026-06-11T08:00:00.000Z");
  });

  it("falls back to local current review storage when the review delegate is unavailable", async () => {
    const repository = new PrismaDocumentReviewsRepository({});
    const saved = await repository.save(createReviewRecord());
    const loaded = await repository.getByDocumentId(saved.documentId);

    assert.equal(loaded?.id, saved.id);
    assert.equal(loaded?.status, DocumentReviewStatus.IN_REVIEW);
  });

  it("propagates Prisma runtime errors after the review delegate is selected", async () => {
    const repository = new PrismaDocumentReviewsRepository({
      documentReview: {
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async upsert() {
          throw createPrismaConnectionError();
        }
      }
    });

    await assert.rejects(() => repository.save(createReviewRecord()), {
      message: "database unavailable"
    });
  });
});

/**
 * @param overrides Optional review fields for a test case.
 * @returns A domain review record ready for repository persistence.
 */
function createReviewRecord(
  overrides: Partial<DocumentReviewRecord> = {}
): DocumentReviewRecord {
  return {
    id: "review-db-1",
    documentId: "document-db-1",
    status: DocumentReviewStatus.IN_REVIEW,
    submittedVersionId: "document-version-db-1",
    submittedById: "author-1",
    submittedAt: "2026-06-11T08:00:00.000Z",
    decidedById: null,
    conclusion: null,
    decidedAt: null,
    updatedAt: "2026-06-11T08:00:00.000Z",
    ...overrides
  };
}

/**
 * @param data The Prisma upsert payload or domain record used by tests.
 * @returns A Prisma-shaped document review row.
 */
function createReviewRow(data: Record<string, unknown>): PrismaDocumentReviewRow {
  return {
    id: String(data.id),
    documentId: String(data.documentId),
    status: String(data.status),
    submittedVersionId: String(data.submittedVersionId),
    submittedById: (data.submittedById ?? null) as string | null,
    submittedAt:
      data.submittedAt === null
        ? null
        : data.submittedAt instanceof Date
          ? data.submittedAt
          : new Date(String(data.submittedAt)),
    decidedById: (data.decidedById ?? null) as string | null,
    conclusion: (data.conclusion ?? null) as string | null,
    decidedAt:
      data.decidedAt === null
        ? null
        : data.decidedAt instanceof Date
          ? data.decidedAt
          : new Date(String(data.decidedAt)),
    updatedAt:
      data.updatedAt instanceof Date
        ? data.updatedAt
        : new Date(String(data.updatedAt))
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
