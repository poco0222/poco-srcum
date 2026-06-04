/**
 * @file NestJS projects module shell for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { ProjectsService } from "./projects.service";

@Module({
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
