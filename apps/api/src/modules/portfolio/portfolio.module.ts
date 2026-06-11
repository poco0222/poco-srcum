/**
 * @file NestJS Portfolio module for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { Module } from "@nestjs/common";

import { ProjectsModule } from "../projects/projects.module";
import { ProjectsService } from "../projects/projects.service";
import { SprintsModule } from "../sprints/sprints.module";
import { SprintsService } from "../sprints/sprints.service";
import { WorkItemsModule } from "../work-items/work-items.module";
import { WorkItemsService } from "../work-items/work-items.service";
import { PortfolioController } from "./portfolio.controller";
import { PortfolioService } from "./portfolio.service";

@Module({
  imports: [ProjectsModule, SprintsModule, WorkItemsModule],
  controllers: [PortfolioController],
  providers: [
    {
      provide: PortfolioService,
      inject: [ProjectsService, SprintsService, WorkItemsService],
      /**
       * @param projectsService The frozen project catalog source.
       * @param sprintsService The Sprint source for roadmap milestones.
       * @param workItemsService The work item source for project summaries.
       * @returns The Portfolio read-model service.
       */
      useFactory(
        projectsService: ProjectsService,
        sprintsService: SprintsService,
        workItemsService: WorkItemsService
      ) {
        return new PortfolioService({
          projectCatalogReader: projectsService,
          sprintsService,
          workItemsService
        });
      }
    }
  ],
  exports: [PortfolioService]
})
export class PortfolioModule {}
