/**
 * @file NestJS document module for the Phase 1 Form plus Markdown API.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { AttachmentsModule } from "../attachments/attachments.module";
import { AuditModule } from "../audit/audit.module";
import { MinimalAuditService } from "../audit/minimal-audit.service";
import { DocumentTemplatesModule } from "../document-templates/document-templates.module";
import { DocumentTemplatesService } from "../document-templates/document-templates.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { NotificationsService } from "../notifications/notifications.service";
import { DocumentLinksService } from "./document-links.service";
import { DocumentRelationsService } from "./document-relations.service";
import { DocumentsController } from "./documents.controller";
import { createDocumentsPrismaClient } from "./documents.prisma";
import {
  InMemoryDocumentsRepository,
  PrismaDocumentsRepository
} from "./documents.repository";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [
    AttachmentsModule,
    AuditModule,
    DocumentTemplatesModule,
    NotificationsModule
  ],
  controllers: [DocumentsController],
  providers: [
    {
      provide: InMemoryDocumentsRepository,
      useValue: new InMemoryDocumentsRepository()
    },
    {
      provide: DocumentsService,
      inject: [
        InMemoryDocumentsRepository,
        NotificationsService,
        MinimalAuditService,
        DocumentTemplatesService
      ],
      async useFactory(
        repository: InMemoryDocumentsRepository,
        notificationsService: NotificationsService,
        auditService: MinimalAuditService,
        templatesService: DocumentTemplatesService
      ) {
        const prisma = await createDocumentsPrismaClient();
        const documentsRepository = prisma
          ? new PrismaDocumentsRepository(prisma)
          : repository;

        return new DocumentsService(
          documentsRepository,
          1,
          notificationsService,
          auditService,
          templatesService
        );
      }
    },
    {
      provide: DocumentLinksService,
      inject: [DocumentsService],
      useFactory(documentsService: DocumentsService) {
        return new DocumentLinksService(documentsService);
      }
    },
    {
      provide: DocumentRelationsService,
      inject: [DocumentsService],
      useFactory(documentsService: DocumentsService) {
        return new DocumentRelationsService(documentsService);
      }
    }
  ],
  exports: [
    DocumentLinksService,
    DocumentRelationsService,
    DocumentsService,
    InMemoryDocumentsRepository
  ]
})
export class DocumentsModule {}
