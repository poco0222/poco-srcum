/**
 * @file Document version controller for Phase 2 review traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post
} from "@nestjs/common";

import { CreateDocumentVersionInputSchema } from "@poco-scrum/shared";
import { DocumentVersionsService } from "./document-versions.service";

@Controller("/documents/:documentId/versions")
export class DocumentVersionsController {
  constructor(
    @Inject(DocumentVersionsService)
    private readonly versionsService: DocumentVersionsService
  ) {}

  /**
   * @param documentId The document being snapshotted.
   * @param body The version summary payload.
   * @returns The created document version.
   */
  @Post()
  createVersion(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.versionsService.createVersionSnapshot(
        CreateDocumentVersionInputSchema.parse({
          ...body,
          documentId
        })
      );
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param documentId The document whose versions should be listed.
   * @returns Version snapshots for the document.
   */
  @Get()
  listVersions(@Param("documentId") documentId: string) {
    return this.versionsService.listVersionsForDocument(documentId);
  }

  /**
   * @param versionId The version snapshot identifier.
   * @returns The requested version snapshot.
   */
  @Get("/:versionId")
  getVersion(@Param("versionId") versionId: string) {
    return this.versionsService.getVersionById(versionId);
  }
}
