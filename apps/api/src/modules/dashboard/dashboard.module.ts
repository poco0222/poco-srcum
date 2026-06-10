/**
 * @file NestJS document collaboration dashboard module for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { DocumentsModule } from "../documents/documents.module";
import { DocumentsService } from "../documents/documents.service";
import { LinkageModule } from "../linkage/linkage.module";
import { LinkageService } from "../linkage/linkage.service";
import { ReviewsModule } from "../reviews/reviews.module";
import { ReviewsService } from "../reviews/reviews.service";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [DocumentsModule, LinkageModule, ReviewsModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: DashboardService,
      inject: [DocumentsService, LinkageService, ReviewsService],
      /**
       * @param documentsService The formal document source.
       * @param linkageService The object link source.
       * @param reviewsService The review source for dashboard status cards.
       * @returns The fixed-card dashboard service.
       */
      useFactory(
        documentsService: DocumentsService,
        linkageService: LinkageService,
        reviewsService: ReviewsService
      ) {
        return new DashboardService({
          documentsService,
          linkageService,
          reviewStatusResolver: async (documentId) =>
            (await reviewsService.getCurrentReview(documentId)).status
        });
      }
    }
  ],
  exports: [DashboardService]
})
export class DashboardModule {}
