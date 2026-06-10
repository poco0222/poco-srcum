/**
 * @file NestJS comments module for Phase 2 document review collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { DocumentsModule } from "../documents/documents.module";
import { DocumentsService } from "../documents/documents.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { NotificationsService } from "../notifications/notifications.service";
import { CommentsController } from "./comments.controller";
import {
  CommentsService,
  InMemoryDocumentCommentsRepository
} from "./comments.service";

@Module({
  imports: [DocumentsModule, NotificationsModule],
  controllers: [CommentsController],
  providers: [
    {
      provide: InMemoryDocumentCommentsRepository,
      useValue: new InMemoryDocumentCommentsRepository()
    },
    {
      provide: CommentsService,
      inject: [
        DocumentsService,
        NotificationsService,
        InMemoryDocumentCommentsRepository
      ],
      /**
       * @param documentsService The existing formal document service dependency.
       * @param notificationsService The notification service used for mentions.
       * @param repository The in-memory comment repository shared by this module.
       * @returns The comments service wired to existing document and notification modules.
       */
      useFactory(
        documentsService: DocumentsService,
        notificationsService: NotificationsService,
        repository: InMemoryDocumentCommentsRepository
      ) {
        return new CommentsService(
          documentsService,
          notificationsService,
          repository
        );
      }
    }
  ],
  exports: [CommentsService, InMemoryDocumentCommentsRepository]
})
export class CommentsModule {}
