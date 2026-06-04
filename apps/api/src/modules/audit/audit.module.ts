/**
 * @file NestJS minimal audit module for Phase 1 traceability.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import {
  MinimalAuditService,
  sharedMinimalAuditService
} from "./minimal-audit.service";

@Module({
  providers: [
    {
      provide: MinimalAuditService,
      useValue: sharedMinimalAuditService
    }
  ],
  exports: [MinimalAuditService]
})
export class AuditModule {}
