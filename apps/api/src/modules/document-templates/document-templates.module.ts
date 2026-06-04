/**
 * @file NestJS document template module for Phase 2 formal document defaults.
 * @author PopoY
 * @created 2026-06-04
 */
import { Module } from "@nestjs/common";

import { DocumentTemplatesController } from "./document-templates.controller";
import { createDocumentTemplatesPrismaClient } from "./document-templates.prisma";
import { DocumentTemplatesService } from "./document-templates.service";

@Module({
  controllers: [DocumentTemplatesController],
  providers: [
    {
      provide: DocumentTemplatesService,
      async useFactory() {
        const prisma = await createDocumentTemplatesPrismaClient();

        return prisma
          ? new DocumentTemplatesService(prisma)
          : new DocumentTemplatesService();
      }
    }
  ],
  exports: [DocumentTemplatesService]
})
export class DocumentTemplatesModule {}
