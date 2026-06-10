/**
 * @file NestJS document versions module for Phase 2 review traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { Module } from "@nestjs/common";

import { DocumentsModule } from "../documents/documents.module";
import { DocumentsService } from "../documents/documents.service";
import { DocumentVersionsController } from "./document-versions.controller";
import {
  DocumentVersionsService,
  InMemoryDocumentVersionsRepository
} from "./document-versions.service";

@Module({
  imports: [DocumentsModule],
  controllers: [DocumentVersionsController],
  providers: [
    {
      provide: InMemoryDocumentVersionsRepository,
      useValue: new InMemoryDocumentVersionsRepository()
    },
    {
      provide: DocumentVersionsService,
      inject: [DocumentsService, InMemoryDocumentVersionsRepository],
      /**
       * @param documentsService The existing formal document service dependency.
       * @param repository The in-memory version repository shared by this module.
       * @returns The document versions service wired to existing document reads.
       */
      useFactory(
        documentsService: DocumentsService,
        repository: InMemoryDocumentVersionsRepository
      ) {
        return new DocumentVersionsService(documentsService, repository);
      }
    }
  ],
  exports: [DocumentVersionsService, InMemoryDocumentVersionsRepository]
})
export class DocumentVersionsModule {}
