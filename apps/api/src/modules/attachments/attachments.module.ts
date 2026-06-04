/**
 * @file NestJS attachment metadata module for Phase 1 document evidence.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { AttachmentsService } from "./attachments.service";

@Module({
  providers: [
    {
      provide: AttachmentsService,
      useValue: new AttachmentsService()
    }
  ],
  exports: [AttachmentsService]
})
export class AttachmentsModule {}
