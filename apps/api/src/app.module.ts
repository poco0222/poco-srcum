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
import { CommentsModule } from "./modules/comments/comments.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DocumentVersionsModule } from "./modules/document-versions/document-versions.module";
import { DocumentTemplatesModule } from "./modules/document-templates/document-templates.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { LinkageModule } from "./modules/linkage/linkage.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PortfolioModule } from "./modules/portfolio/portfolio.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { SearchModule } from "./modules/search/search.module";
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
    CommentsModule,
    DashboardModule,
    DocumentVersionsModule,
    DocumentTemplatesModule,
    DocumentsModule,
    LinkageModule,
    NotificationsModule,
    PortfolioModule,
    ProjectsModule,
    ReviewsModule,
    SearchModule,
    SprintsModule,
    WorkItemsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
