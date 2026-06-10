/**
 * @file NestJS reviews module for Phase 2 document collaboration.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { DocumentsModule } from "../documents/documents.module";
import { DocumentsService } from "../documents/documents.service";
import {
  InMemoryDocumentReviewsRepository,
  ReviewsService
} from "./reviews.service";
import { ReviewsController } from "./reviews.controller";

@Module({
  imports: [DocumentsModule],
  controllers: [ReviewsController],
  providers: [
    {
      provide: InMemoryDocumentReviewsRepository,
      useValue: new InMemoryDocumentReviewsRepository()
    },
    {
      provide: ReviewsService,
      inject: [DocumentsService, InMemoryDocumentReviewsRepository],
      /**
       * @param documentsService The existing formal document service dependency.
       * @param repository The in-memory review repository shared by this module.
       * @returns The reviews service wired to existing document reads.
       */
      useFactory(
        documentsService: DocumentsService,
        repository: InMemoryDocumentReviewsRepository
      ) {
        return new ReviewsService(documentsService, repository);
      }
    }
  ],
  exports: [ReviewsService, InMemoryDocumentReviewsRepository]
})
export class ReviewsModule {}
