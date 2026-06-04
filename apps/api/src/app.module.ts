/**
 * @file NestJS root application module for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Controller, Get, Module } from "@nestjs/common";

import { AcceptanceModule } from "./modules/acceptance/acceptance.module";
import { AttachmentsModule } from "./modules/attachments/attachments.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DocumentTemplatesModule } from "./modules/document-templates/document-templates.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { SprintsModule } from "./modules/sprints/sprints.module";
import { WorkItemsModule } from "./modules/work-items/work-items.module";

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
  imports: [
    AcceptanceModule,
    AttachmentsModule,
    AuditModule,
    AuthModule,
    DocumentTemplatesModule,
    DocumentsModule,
    NotificationsModule,
    ProjectsModule,
    SprintsModule,
    WorkItemsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
