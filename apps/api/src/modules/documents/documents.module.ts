/**
 * @file NestJS document module for the Phase 1 Form plus Markdown API.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { AttachmentsModule } from "../attachments/attachments.module";
import { AuditModule } from "../audit/audit.module";
import { MinimalAuditService } from "../audit/minimal-audit.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { NotificationsService } from "../notifications/notifications.service";
import { DocumentLinksService } from "./document-links.service";
import { DocumentsController } from "./documents.controller";
import { InMemoryDocumentsRepository } from "./documents.repository";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [AttachmentsModule, AuditModule, NotificationsModule],
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
        MinimalAuditService
      ],
      useFactory(
        repository: InMemoryDocumentsRepository,
        notificationsService: NotificationsService,
        auditService: MinimalAuditService
      ) {
        return new DocumentsService(
          repository,
          1,
          notificationsService,
          auditService
        );
      }
    },
    {
      provide: DocumentLinksService,
      inject: [DocumentsService],
      useFactory(documentsService: DocumentsService) {
        return new DocumentLinksService(documentsService);
      }
    }
  ],
  exports: [
    DocumentLinksService,
    DocumentsService,
    InMemoryDocumentsRepository
  ]
})
export class DocumentsModule {}
