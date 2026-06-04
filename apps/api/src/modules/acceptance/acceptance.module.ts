/**
 * @file NestJS Story acceptance module for the Phase 1 formal acceptance API.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { MinimalAuditService } from "../audit/minimal-audit.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { NotificationsService } from "../notifications/notifications.service";
import { WorkItemsModule } from "../work-items/work-items.module";
import { InMemoryWorkItemsRepository } from "../work-items/work-items.repository";
import { AcceptanceController } from "./acceptance.controller";
import {
  InMemoryStoryAcceptanceRepository,
  sharedStoryAcceptanceRepository
} from "./acceptance.repository";
import { AcceptanceService } from "./acceptance.service";

@Module({
  imports: [AuditModule, NotificationsModule, WorkItemsModule],
  controllers: [AcceptanceController],
  providers: [
    {
      provide: InMemoryStoryAcceptanceRepository,
      useValue: sharedStoryAcceptanceRepository
    },
    {
      provide: AcceptanceService,
      inject: [
        InMemoryStoryAcceptanceRepository,
        InMemoryWorkItemsRepository,
        NotificationsService,
        MinimalAuditService
      ],
      useFactory(
        acceptanceRepository: InMemoryStoryAcceptanceRepository,
        workItemsRepository: InMemoryWorkItemsRepository,
        notificationsService: NotificationsService,
        auditService: MinimalAuditService
      ) {
        return new AcceptanceService(
          acceptanceRepository,
          workItemsRepository,
          notificationsService,
          auditService
        );
      }
    }
  ],
  exports: [AcceptanceService, InMemoryStoryAcceptanceRepository]
})
export class AcceptanceModule {}
