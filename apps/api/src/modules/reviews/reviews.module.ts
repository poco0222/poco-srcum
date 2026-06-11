/**
 * @file NestJS reviews module for Phase 2 document collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { DocumentVersionsModule } from "../document-versions/document-versions.module";
import { DocumentVersionsService } from "../document-versions/document-versions.service";
import { DocumentsModule } from "../documents/documents.module";
import { DocumentsService } from "../documents/documents.service";
import { createDocumentReviewsPrismaClient } from "./reviews.prisma";
import {
  InMemoryDocumentReviewsRepository,
  PrismaDocumentReviewsRepository,
  ReviewsService
} from "./reviews.service";
import { ReviewsController } from "./reviews.controller";

@Module({
  imports: [DocumentVersionsModule, DocumentsModule],
  controllers: [ReviewsController],
  providers: [
    {
      provide: InMemoryDocumentReviewsRepository,
      useValue: new InMemoryDocumentReviewsRepository()
    },
    {
      provide: ReviewsService,
      inject: [
        DocumentsService,
        InMemoryDocumentReviewsRepository,
        DocumentVersionsService
      ],
      /**
       * @param documentsService The existing formal document service dependency.
       * @param repository The in-memory review repository shared by this module.
       * @param versionsService The version service used to resolve latest approved snapshots.
       * @returns The reviews service wired to existing document reads.
       */
      async useFactory(
        documentsService: DocumentsService,
        repository: InMemoryDocumentReviewsRepository,
        versionsService: DocumentVersionsService
      ) {
        const prisma = await createDocumentReviewsPrismaClient();
        const reviewsRepository = prisma
          ? new PrismaDocumentReviewsRepository(prisma)
          : repository;

        return new ReviewsService(
          documentsService,
          reviewsRepository,
          (documentId) => versionsService.getLatestVersionId(documentId),
          (versionId) => versionsService.getVersionById(versionId)
        );
      }
    }
  ],
  exports: [ReviewsService, InMemoryDocumentReviewsRepository]
})
export class ReviewsModule {}
