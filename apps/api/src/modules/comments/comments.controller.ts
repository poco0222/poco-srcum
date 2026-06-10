/**
 * @file Document comments controller for Phase 2 review collaboration.
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

import { CreateDocumentCommentInputSchema } from "@poco-scrum/shared";
import { CommentsService } from "./comments.service";

@Controller("/documents/:documentId/comments")
export class CommentsController {
  constructor(
    @Inject(CommentsService)
    private readonly commentsService: CommentsService
  ) {}

  /**
   * @param documentId The formal document receiving the comment.
   * @param body The comment creation payload.
   * @returns The created document comment.
   */
  @Post()
  createComment(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.commentsService.createComment(
        CreateDocumentCommentInputSchema.parse({
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
   * @param documentId The formal document whose comments should be listed.
   * @returns Oldest-first comments for the document.
   */
  @Get()
  listComments(@Param("documentId") documentId: string) {
    return this.commentsService.listCommentsForDocument(documentId);
  }
}
