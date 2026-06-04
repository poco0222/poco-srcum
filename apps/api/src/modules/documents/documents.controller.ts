/**
 * @file Document controller for the Phase 1 Form plus Markdown API.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";

import {
  CreateFormalDocumentInputSchema,
  CreateDocumentInputSchema,
  UpdateDocumentInputSchema
} from "@poco-scrum/shared";
import { DocumentsService } from "./documents.service";

@Controller("/documents")
export class DocumentsController {
  constructor(
    @Inject(DocumentsService)
    private readonly documentsService: DocumentsService
  ) {}

  /**
   * @param body The document creation payload.
   * @returns The created Form plus Markdown document.
   */
  @Post()
  createDocument(@Body() body: unknown) {
    try {
      return this.documentsService.createDocument(
        CreateDocumentInputSchema.parse(body)
      );
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param body The formal document creation payload with template metadata.
   * @returns The created formal document.
   */
  @Post("/formal")
  createFormalDocument(@Body() body: unknown) {
    try {
      return this.documentsService.createFormalDocument(
        CreateFormalDocumentInputSchema.parse(body)
      );
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param documentId The document identifier to load.
   * @returns The stored document.
   */
  @Get("/:documentId")
  getDocument(@Param("documentId") documentId: string) {
    return this.documentsService.getDocumentById(documentId);
  }

  /**
   * @param targetType The Scrum object type linked to documents.
   * @param targetId The Scrum object identifier linked to documents.
   * @returns Documents linked to the requested target.
   */
  @Get()
  listDocuments(
    @Query("targetType") targetType = "",
    @Query("targetId") targetId = ""
  ) {
    return this.documentsService.listDocumentsByTarget(targetType, targetId);
  }

  /**
   * @param documentId The document identifier to update.
   * @param body The partial document update payload.
   * @returns The updated document.
   */
  @Patch("/:documentId")
  @HttpCode(200)
  updateDocument(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.documentsService.updateDocument(
        UpdateDocumentInputSchema.parse({
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
}
