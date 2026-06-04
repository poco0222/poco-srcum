/**
 * @file NestJS root application module for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Controller, Get, Module } from "@nestjs/common";

import { AuthModule } from "./modules/auth/auth.module";
import { ProjectsModule } from "./modules/projects/projects.module";

/**
 * @description Exposes the minimum health endpoint required by the bootstrap smoke test.
 * @returns The API shell health payload.
 */
@Controller()
class HealthController {
  @Get("/health")
  getHealth() {
    return {
      service: "api",
      status: "ok"
    };
  }
}

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [HealthController]
})
export class AppModule {}
