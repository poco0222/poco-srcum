/**
 * @file Document service for the Phase 1 Form plus Markdown API.
 * @author PopoY
 * @created 2026-06-04
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import { NotificationEventType, type DocumentRecord } from "@poco-scrum/domain";
import {
  CreateDocumentInputSchema,
  UpdateDocumentInputSchema,
  type CreateDocumentInput,
  type UpdateDocumentInput
} from "@poco-scrum/shared";
import { MinimalAuditService } from "../audit/minimal-audit.service";
import { NotificationsService } from "../notifications/notifications.service";
import { InMemoryDocumentsRepository } from "./documents.repository";

export class DocumentsService {
  constructor(
    private readonly repository: InMemoryDocumentsRepository = new InMemoryDocumentsRepository(),
    private nextSequence = 1,
    private readonly notificationsService?: NotificationsService,
    private readonly auditService?: MinimalAuditService
  ) {}

  /**
   * @param input The validated Form plus Markdown document creation payload.
   * @returns The created document record.
   */
  async createDocument(input: CreateDocumentInput) {
    const payload = CreateDocumentInputSchema.parse(input);
    const now = new Date().toISOString();
    const document: DocumentRecord = {
      id: `document-${this.nextSequence++}`,
      title: payload.title,
      targetType: payload.targetType,
      targetId: payload.targetId,
      authorId: payload.authorId,
      updatedById: payload.authorId,
      structuredFields: payload.structuredFields,
      markdown: payload.markdown,
      createdAt: now,
      updatedAt: now
    };

    return this.repository.create(document);
  }

  /**
   * @param input The partial document update payload.
   * @returns The updated document record.
   */
  async updateDocument(input: UpdateDocumentInput) {
    const payload = UpdateDocumentInputSchema.parse(input);
    const current = await this.repository.getById(payload.documentId);

    if (!current) {
      throw new NotFoundException("DOCUMENT_NOT_FOUND");
    }

    const updated = await this.repository.update(current.id, {
      ...current,
      title: payload.title ?? current.title,
      structuredFields: payload.structuredFields ?? current.structuredFields,
      markdown: payload.markdown ?? current.markdown,
      updatedById: payload.editorId,
      updatedAt: new Date().toISOString()
    });

    if (this.notificationsService) {
      await this.notificationsService.createNotification({
        recipientId: current.authorId,
        actorId: payload.editorId,
        eventType: NotificationEventType.DOCUMENT_UPDATED,
        objectType: "document",
        objectId: current.id,
        reason: "Document updated"
      });
    }

    if (this.auditService) {
      await this.auditService.record({
        actorId: payload.editorId,
        objectType: "document",
        objectId: current.id,
        action: "DOCUMENT_UPDATED",
        payload: {
          targetType: current.targetType,
          targetId: current.targetId
        }
      });
    }

    return updated;
  }

  /**
   * @param documentId The document identifier to load.
   * @returns The stored document record.
   */
  async getDocumentById(documentId: string) {
    if (typeof documentId !== "string" || documentId.trim().length === 0) {
      throw new BadRequestException("DOCUMENT_ID_REQUIRED");
    }

    const document = await this.repository.getById(documentId.trim());

    if (!document) {
      throw new NotFoundException("DOCUMENT_NOT_FOUND");
    }

    return document;
  }

  /**
   * @param targetType The Scrum object type linked to the document.
   * @param targetId The Scrum object identifier linked to the document.
   * @returns Documents linked to the requested Scrum object.
   */
  async listDocumentsByTarget(targetType: string, targetId: string) {
    if (targetType.trim().length === 0 || targetId.trim().length === 0) {
      throw new BadRequestException("DOCUMENT_TARGET_REQUIRED");
    }

    return this.repository.listByTarget(targetType.trim(), targetId.trim());
  }
}
