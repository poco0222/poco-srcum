/**
 * @file NestJS work items module for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { sharedStoryAcceptanceRepository } from "../acceptance/acceptance.repository";
import { WorkItemsController } from "./work-items.controller";
import { StoryDoneGuard } from "./guards/story-done.guard";
import { InMemoryWorkItemsRepository } from "./work-items.repository";
import { WorkItemsService } from "./work-items.service";

@Module({
  controllers: [WorkItemsController],
  providers: [
    {
      provide: InMemoryWorkItemsRepository,
      useValue: new InMemoryWorkItemsRepository()
    },
    {
      provide: StoryDoneGuard,
      useValue: new StoryDoneGuard(sharedStoryAcceptanceRepository)
    },
    {
      provide: WorkItemsService,
      inject: [InMemoryWorkItemsRepository, StoryDoneGuard],
      useFactory(
        repository: InMemoryWorkItemsRepository,
        storyDoneGuard: StoryDoneGuard
      ) {
        return new WorkItemsService(repository, 1, storyDoneGuard);
      }
    }
  ],
  exports: [InMemoryWorkItemsRepository, StoryDoneGuard, WorkItemsService]
})
export class WorkItemsModule {}
