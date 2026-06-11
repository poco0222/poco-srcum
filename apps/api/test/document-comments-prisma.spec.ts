/**
 * @file Prisma-backed document comment repository regression tests for Phase 2 persistence.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CommentAnchorType,
  type DocumentCommentRecord
} from "@poco-scrum/domain";
import {
  PrismaDocumentCommentsRepository,
  type PrismaDocumentCommentRow
} from "../src/modules/comments/comments.service";

describe("Prisma-backed document comment repository", () => {
  it("creates anchored comments with parsed mentions through Prisma", async () => {
    let createData: Record<string, unknown> | null = null;
    const repository = new PrismaDocumentCommentsRepository({
      documentComment: {
        async create({ data }: { data: Record<string, unknown> }) {
          createData = data;

          return createCommentRow(data);
        },
        async findFirst() {
          throw new Error("findFirst should not be called");
        },
        async findMany() {
          throw new Error("findMany should not be called");
        }
      }
    });

    const created = await repository.create(createCommentRecord());

    assert.equal(createData?.anchorType, CommentAnchorType.MARKDOWN_BLOCK);
    assert.deepEqual(createData?.mentionedUserIds, ["reviewer-1"]);
    assert.ok(createData?.createdAt instanceof Date);
    assert.equal(created.id, "comment-db-1");
    assert.deepEqual(created.mentionedUserIds, ["reviewer-1"]);
  });

  it("reads comments by id and document id in oldest-first order", async () => {
    const rows = [
      createCommentRow(
        createCommentRecord({
          id: "comment-db-2",
          createdAt: "2026-06-11T09:00:00.000Z"
        })
      ),
      createCommentRow(createCommentRecord())
    ];
    const repository = new PrismaDocumentCommentsRepository({
      documentComment: {
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

    const loaded = await repository.getById("comment-db-1");
    const listed = await repository.listByDocumentId("document-db-1");

    assert.equal(loaded?.id, "comment-db-1");
    assert.deepEqual(
      listed.map((comment) => comment.id),
      ["comment-db-1", "comment-db-2"]
    );
  });

  it("falls back to local storage when the comment delegate is unavailable", async () => {
    const repository = new PrismaDocumentCommentsRepository({});
    const created = await repository.create(createCommentRecord());
    const listed = await repository.listByDocumentId(created.documentId);

    assert.equal(listed[0]?.id, created.id);
    assert.deepEqual(listed[0]?.mentionedUserIds, ["reviewer-1"]);
  });

  it("propagates Prisma runtime errors after the comment delegate is selected", async () => {
    const repository = new PrismaDocumentCommentsRepository({
      documentComment: {
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

    await assert.rejects(() => repository.create(createCommentRecord()), {
      message: "database unavailable"
    });
  });
});

/**
 * @param overrides Optional comment fields for a test case.
 * @returns A domain comment record ready for repository persistence.
 */
function createCommentRecord(
  overrides: Partial<DocumentCommentRecord> = {}
): DocumentCommentRecord {
  return {
    id: "comment-db-1",
    documentId: "document-db-1",
    parentCommentId: null,
    authorId: "author-1",
    anchorType: CommentAnchorType.MARKDOWN_BLOCK,
    anchorRef: "Background",
    body: "请 @user:reviewer-1 评审背景说明。",
    mentionedUserIds: ["reviewer-1"],
    createdAt: "2026-06-11T08:00:00.000Z",
    updatedAt: "2026-06-11T08:00:00.000Z",
    ...overrides
  };
}

/**
 * @param data The Prisma create payload or domain record used by tests.
 * @returns A Prisma-shaped document comment row.
 */
function createCommentRow(
  data: Record<string, unknown>
): PrismaDocumentCommentRow {
  return {
    id: String(data.id),
    documentId: String(data.documentId),
    parentCommentId: (data.parentCommentId ?? null) as string | null,
    authorId: String(data.authorId),
    anchorType: String(data.anchorType),
    anchorRef: String(data.anchorRef),
    body: String(data.body),
    mentionedUserIds: data.mentionedUserIds,
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
