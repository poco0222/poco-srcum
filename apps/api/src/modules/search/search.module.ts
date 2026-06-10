/**
 * @file NestJS search module for Phase 2 delivery evidence lookup.
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
import { SprintsModule } from "../sprints/sprints.module";
import { SprintsService } from "../sprints/sprints.service";
import { WorkItemsModule } from "../work-items/work-items.module";
import { WorkItemsService } from "../work-items/work-items.service";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [
    DocumentsModule,
    LinkageModule,
    ReviewsModule,
    SprintsModule,
    WorkItemsModule
  ],
  controllers: [SearchController],
  providers: [
    {
      provide: SearchService,
      inject: [
        DocumentsService,
        LinkageService,
        ReviewsService,
        WorkItemsService,
        SprintsService
      ],
      /**
       * @param documentsService The formal document source for indexed content.
       * @param linkageService The object link source for relation summaries.
       * @param reviewsService The review source for document status filters.
       * @param workItemsService The work item source for Story search.
       * @param sprintsService The Sprint source for Sprint search.
       * @returns The basic search service.
       */
      useFactory(
        documentsService: DocumentsService,
        linkageService: LinkageService,
        reviewsService: ReviewsService,
        workItemsService: WorkItemsService,
        sprintsService: SprintsService
      ) {
        return new SearchService({
          documentsService,
          linkageService,
          reviewStatusResolver: async (documentId) =>
            (await reviewsService.getCurrentReview(documentId)).status,
          workItemsService,
          sprintsService
        });
      }
    }
  ],
  exports: [SearchService]
})
export class SearchModule {}
