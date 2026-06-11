/**
 * @file Document comment service for Phase 2 review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { randomUUID } from "node:crypto";

import { BadRequestException, ForbiddenException } from "@nestjs/common";

import {
  NotificationEventType,
  parseCommentMentionTokens,
  type DocumentCommentRecord,
  type DocumentRecord
} from "@poco-scrum/domain";
import {
  CreateDocumentCommentInputSchema,
  type CreateDocumentCommentInput
} from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";
import { NotificationsService } from "../notifications/notifications.service";

type DocumentCommentAccessInput = {
  document: DocumentRecord;
  authorId: string;
};

export type DocumentCommentAccessPolicy = (
  input: DocumentCommentAccessInput
) => boolean | Promise<boolean>;

export type PrismaDocumentCommentRow = {
  id: string;
  documentId: string;
  parentCommentId: string | null;
  authorId: string;
  anchorType: string;
  anchorRef: string;
  body: string;
  mentionedUserIds: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaDocumentCommentDelegate = {
  create(args: {
    data: Record<string, unknown>;
  }): Promise<PrismaDocumentCommentRow>;
  findFirst(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaDocumentCommentRow | null>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: unknown;
  }): Promise<PrismaDocumentCommentRow[]>;
};

export type PrismaDocumentCommentsClient = {
  documentComment?: PrismaDocumentCommentDelegate;
  $disconnect?: () => Promise<void>;
};

/**
 * @description Storage contract shared by document comment adapters.
 */
export interface DocumentCommentsRepository {
  create(comment: DocumentCommentRecord): Promise<DocumentCommentRecord>;
  getById(commentId: string): Promise<DocumentCommentRecord | null>;
  listByDocumentId(documentId: string): Promise<DocumentCommentRecord[]>;
}

/**
 * Keep comment persistence in-memory while the task freezes collaboration semantics.
 */
export class InMemoryDocumentCommentsRepository
  implements DocumentCommentsRepository
{
  private readonly comments = new Map<string, DocumentCommentRecord>();

  /**
   * @param comment The comment record to persist.
   * @returns The persisted comment clone.
   */
  async create(comment: DocumentCommentRecord) {
    this.comments.set(comment.id, cloneComment(comment));
    return this.getById(comment.id) as Promise<DocumentCommentRecord>;
  }

  /**
   * @param commentId The comment identifier to load.
   * @returns The matching comment or null.
   */
  async getById(commentId: string) {
    const comment = this.comments.get(commentId);

    return comment ? cloneComment(comment) : null;
  }

  /**
   * @param documentId The document whose comment timeline should be listed.
   * @returns Oldest-first comments for deterministic review.
   */
  async listByDocumentId(documentId: string) {
    return [...this.comments.values()]
      .filter((comment) => comment.documentId === documentId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .map((comment) => cloneComment(comment));
  }
}

export class PrismaDocumentCommentsRepository
  implements DocumentCommentsRepository
{
  private readonly fallbackRepository =
    new InMemoryDocumentCommentsRepository();
  private useFallbackStorage = false;

  constructor(private readonly prisma: PrismaDocumentCommentsClient) {}

  /**
   * @param comment The comment record to persist.
   * @returns The persisted comment from Prisma or fallback storage.
   */
  async create(comment: DocumentCommentRecord) {
    const documentComment = this.getDocumentCommentDelegate();

    if (!documentComment) {
      this.enableFallbackStorage();

      return this.fallbackRepository.create(comment);
    }

    const row = await documentComment.create({
      data: toPrismaCommentData(comment)
    });

    return normalizePrismaComment(row);
  }

  /**
   * @param commentId The comment identifier to load.
   * @returns The matching comment or null.
   */
  async getById(commentId: string) {
    const documentComment = this.getDocumentCommentDelegate();

    if (!documentComment) {
      this.enableFallbackStorage();

      return this.fallbackRepository.getById(commentId);
    }

    const row = await documentComment.findFirst({
      where: {
        id: commentId
      }
    });

    return row ? normalizePrismaComment(row) : null;
  }

  /**
   * @param documentId The document whose comments should be listed.
   * @returns Oldest-first comments from Prisma or fallback storage.
   */
  async listByDocumentId(documentId: string) {
    const documentComment = this.getDocumentCommentDelegate();

    if (!documentComment) {
      this.enableFallbackStorage();

      return this.fallbackRepository.listByDocumentId(documentId);
    }

    const rows = await documentComment.findMany({
      where: {
        documentId
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }]
    });

    return rows
      .map((row) => normalizePrismaComment(row))
      .sort(compareCommentsByCreatedAt);
  }

  /**
   * @returns The generated Prisma comment delegate, or null when unavailable.
   */
  private getDocumentCommentDelegate() {
    if (this.useFallbackStorage) {
      return null;
    }

    return this.prisma.documentComment ?? null;
  }

  /**
   * @description Keeps reads consistent after a fallback write path is selected.
   */
  private enableFallbackStorage() {
    this.useFallbackStorage = true;
  }
}

/**
 * Coordinates comment creation, reply validation, and mention notifications.
 */
export class CommentsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly notificationsService?: NotificationsService,
    private readonly repository: DocumentCommentsRepository = new InMemoryDocumentCommentsRepository(),
    private readonly canComment: DocumentCommentAccessPolicy = () => true,
    _nextSequence = 1
  ) {}

  /**
   * @param input The comment creation command from API or tests.
   * @returns The persisted comment with parsed mentions.
   */
  async createComment(input: CreateDocumentCommentInput) {
    const payload = CreateDocumentCommentInputSchema.parse(input);
    const document = await this.documentsService.getDocumentById(
      payload.documentId
    );
    const hasAccess = await this.canComment({
      document,
      authorId: payload.authorId
    });

    if (!hasAccess) {
      throw new ForbiddenException("DOCUMENT_COMMENT_ACCESS_DENIED");
    }

    if (payload.parentCommentId) {
      await this.assertParentCommentBelongsToDocument(
        payload.parentCommentId,
        payload.documentId
      );
    }

    const now = new Date().toISOString();
    // Mention ids drive the notification fan-out after the comment is persisted.
    const mentionedUserIds = parseCommentMentionTokens(payload.body);
    const comment: DocumentCommentRecord = {
      id: createCommentId(),
      documentId: payload.documentId,
      parentCommentId: payload.parentCommentId ?? null,
      authorId: payload.authorId,
      anchorType: payload.anchorType,
      anchorRef: payload.anchorRef,
      body: payload.body,
      mentionedUserIds,
      createdAt: now,
      updatedAt: now
    };
    const created = await this.repository.create(comment);

    await this.notifyMentionedUsers(created);

    return created;
  }

  /**
   * @param documentId The document identifier whose comments should be returned.
   * @returns Oldest-first document comments.
   */
  async listCommentsForDocument(documentId: string) {
    const normalizedDocumentId = normalizeRequiredText(
      documentId,
      "DOCUMENT_COMMENT_DOCUMENT_REQUIRED"
    );

    await this.documentsService.getDocumentById(normalizedDocumentId);
    return this.repository.listByDocumentId(normalizedDocumentId);
  }

  /**
   * @param parentCommentId The reply target identifier.
   * @param documentId The document expected to own the reply target.
   */
  private async assertParentCommentBelongsToDocument(
    parentCommentId: string,
    documentId: string
  ) {
    const parentComment = await this.repository.getById(parentCommentId);

    if (!parentComment || parentComment.documentId !== documentId) {
      throw new BadRequestException("DOCUMENT_COMMENT_PARENT_INVALID");
    }
  }

  /**
   * @param comment The created comment whose mentions should fan out.
   */
  private async notifyMentionedUsers(comment: DocumentCommentRecord) {
    if (!this.notificationsService) {
      return;
    }

    for (const mentionedUserId of comment.mentionedUserIds) {
      // Authors should not receive a notification for mentioning themselves.
      if (mentionedUserId === comment.authorId) {
        continue;
      }

      await this.notificationsService.createNotification({
        recipientId: mentionedUserId,
        actorId: comment.authorId,
        eventType: NotificationEventType.DOCUMENT_COMMENT_MENTIONED,
        objectType: "document-comment",
        objectId: comment.id,
        reason: "Document comment mentioned user"
      });
    }
  }
}

/**
 * @param comment The comment record to clone before crossing repository boundaries.
 * @returns A defensive copy of the comment and mention list.
 */
function cloneComment(comment: DocumentCommentRecord): DocumentCommentRecord {
  return {
    ...comment,
    mentionedUserIds: [...comment.mentionedUserIds]
  };
}

/**
 * @returns A restart-safe document comment identifier.
 */
function createCommentId() {
  return `comment-${randomUUID()}`;
}

/**
 * @param comment The domain comment record.
 * @returns A Prisma create data object with Date values.
 */
function toPrismaCommentData(comment: DocumentCommentRecord) {
  return {
    id: comment.id,
    documentId: comment.documentId,
    parentCommentId: comment.parentCommentId,
    authorId: comment.authorId,
    anchorType: comment.anchorType,
    anchorRef: comment.anchorRef,
    body: comment.body,
    mentionedUserIds: comment.mentionedUserIds,
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.updatedAt)
  };
}

/**
 * @param row The raw Prisma document comment row.
 * @returns A domain comment record with normalized JSON and ISO datetime text.
 */
function normalizePrismaComment(
  row: PrismaDocumentCommentRow
): DocumentCommentRecord {
  return {
    id: row.id,
    documentId: row.documentId,
    parentCommentId: row.parentCommentId,
    authorId: row.authorId,
    anchorType: row.anchorType as DocumentCommentRecord["anchorType"],
    anchorRef: row.anchorRef,
    body: row.body,
    mentionedUserIds: normalizeMentionedUserIds(row.mentionedUserIds),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

/**
 * @param value The Prisma JSON value for mentioned user ids.
 * @returns Plain string ids safe for notification fan-out.
 */
function normalizeMentionedUserIds(value: unknown) {
  return Array.isArray(value)
    ? value.filter((userId): userId is string => typeof userId === "string")
    : [];
}

/**
 * @param left The first comment to compare.
 * @param right The second comment to compare.
 * @returns Stable oldest-first order.
 */
function compareCommentsByCreatedAt(
  left: DocumentCommentRecord,
  right: DocumentCommentRecord
) {
  const createdAtOrder = left.createdAt.localeCompare(right.createdAt);

  return createdAtOrder === 0 ? left.id.localeCompare(right.id) : createdAtOrder;
}

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The validation error code to throw on failure.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string) {
  if (typeof value !== "string") {
    throw new BadRequestException(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new BadRequestException(errorMessage);
  }

  return normalized;
}
