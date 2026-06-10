/**
 * @file NestJS object linkage module for Phase 2 delivery traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { LinkageController } from "./linkage.controller";
import { createObjectLinksPrismaClient } from "./linkage.prisma";
import {
  InMemoryObjectLinksRepository,
  PrismaObjectLinksRepository
} from "./linkage.repository";
import { LinkageService } from "./linkage.service";

@Module({
  controllers: [LinkageController],
  providers: [
    {
      provide: LinkageService,
      /**
       * @returns The linkage service wired to the shared repository.
       */
      async useFactory() {
        const prisma = await createObjectLinksPrismaClient();

        return prisma
          ? new LinkageService(new PrismaObjectLinksRepository(prisma))
          : new LinkageService(new InMemoryObjectLinksRepository());
      }
    }
  ],
  exports: [LinkageService]
})
export class LinkageModule {}
