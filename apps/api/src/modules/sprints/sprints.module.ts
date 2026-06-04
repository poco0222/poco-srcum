/**
 * @file NestJS Sprint module for the Phase 1 sprint lifecycle API.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { WorkItemsModule } from "../work-items/work-items.module";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";
import { BlockersService } from "../blockers/blockers.service";
import { ClosureService } from "./closure.service";
import { DailyUpdatesService } from "./daily-updates.service";
import { SprintsController } from "./sprints.controller";
import { PlanningService } from "./planning.service";
import { ScopeChangeService } from "./scope-change.service";
import { InMemorySprintsRepository } from "./sprints.repository";
import { SprintsService } from "./sprints.service";

@Module({
  imports: [WorkItemsModule],
  controllers: [SprintsController],
  providers: [
    {
      provide: InMemorySprintsRepository,
      useValue: new InMemorySprintsRepository()
    },
    {
      provide: PlanningService,
      inject: [InMemorySprintsRepository, InMemoryWorkItemsRepository],
      useFactory(
        sprintsRepository: InMemorySprintsRepository,
        workItemsRepository: InMemoryWorkItemsRepository
      ) {
        return new PlanningService(sprintsRepository, workItemsRepository);
      }
    },
    {
      provide: DailyUpdatesService,
      inject: [InMemorySprintsRepository, InMemoryWorkItemsRepository],
      useFactory(
        sprintsRepository: InMemorySprintsRepository,
        workItemsRepository: InMemoryWorkItemsRepository
      ) {
        return new DailyUpdatesService(sprintsRepository, workItemsRepository);
      }
    },
    {
      provide: BlockersService,
      useValue: new BlockersService()
    },
    {
      provide: ClosureService,
      inject: [InMemorySprintsRepository],
      useFactory(repository: InMemorySprintsRepository) {
        return new ClosureService(repository);
      }
    },
    {
      provide: ScopeChangeService,
      inject: [InMemorySprintsRepository, InMemoryWorkItemsRepository],
      useFactory(
        sprintsRepository: InMemorySprintsRepository,
        workItemsRepository: InMemoryWorkItemsRepository
      ) {
        return new ScopeChangeService(sprintsRepository, workItemsRepository);
      }
    },
    {
      provide: SprintsService,
      inject: [InMemorySprintsRepository, PlanningService],
      useFactory(
        repository: InMemorySprintsRepository,
        planningService: PlanningService
      ) {
        return new SprintsService(repository, 1, planningService);
      }
    }
  ],
  exports: [
    BlockersService,
    ClosureService,
    DailyUpdatesService,
    InMemorySprintsRepository,
    PlanningService,
    ScopeChangeService,
    SprintsService
  ]
})
export class SprintsModule {}
