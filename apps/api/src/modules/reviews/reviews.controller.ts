/**
 * @file Document review controller for Phase 2 formal review workflows.
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

import {
  DecideDocumentReviewInputSchema,
  ReturnDocumentReviewToDraftInputSchema,
  SubmitDocumentReviewInputSchema
} from "@poco-scrum/shared";
import { ReviewsService } from "./reviews.service";

@Controller("/documents/:documentId/review")
export class ReviewsController {
  constructor(
    @Inject(ReviewsService)
    private readonly reviewsService: ReviewsService
  ) {}

  /**
   * @param documentId The document submitted for review.
   * @param body The submission payload.
   * @returns The current review record.
   */
  @Post("/submit")
  submitReview(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.reviewsService.submitReview(
        SubmitDocumentReviewInputSchema.parse({
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
   * @param documentId The reviewed document.
   * @param body The approval payload.
   * @returns The current review record.
   */
  @Post("/approve")
  approveReview(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.reviewsService.approveReview(
        DecideDocumentReviewInputSchema.parse({
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
   * @param documentId The reviewed document.
   * @param body The rejection payload.
   * @returns The current review record.
   */
  @Post("/reject")
  rejectReview(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.reviewsService.rejectReview(
        DecideDocumentReviewInputSchema.parse({
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
   * @param documentId The reviewed document.
   * @param body The return-to-draft payload.
   * @returns The current review record.
   */
  @Post("/return-to-draft")
  returnToDraft(
    @Param("documentId") documentId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.reviewsService.returnToDraft(
        ReturnDocumentReviewToDraftInputSchema.parse({
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
   * @param documentId The document whose current review should be returned.
   * @returns The current document review state.
   */
  @Get()
  getCurrentReview(@Param("documentId") documentId: string) {
    return this.reviewsService.getCurrentReview(documentId);
  }
}
