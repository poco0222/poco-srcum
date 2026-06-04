/**
 * @file NestJS in-app notification module for Phase 1 key Scrum events.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import {
  NotificationsService,
  sharedNotificationsService
} from "./notifications.service";

@Module({
  providers: [
    {
      provide: NotificationsService,
      useValue: sharedNotificationsService
    }
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
