/**
 * @file Story acceptance controller for the Phase 1 formal acceptance API.
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
  Post
} from "@nestjs/common";

import {
  ApproveStoryAcceptanceInputSchema,
  RejectStoryAcceptanceInputSchema,
  ReopenStoryAcceptanceInputSchema
} from "@poco-scrum/shared";
import { AcceptanceService } from "./acceptance.service";

@Controller("/acceptance")
export class AcceptanceController {
  constructor(
    @Inject(AcceptanceService)
    private readonly acceptanceService: AcceptanceService
  ) {}

  /**
   * @param storyId The Story being formally approved.
   * @param body The actor and operated time payload.
   * @returns The persisted approval record.
   */
  @Post("/stories/:storyId/approve")
  @HttpCode(200)
  approveStory(
    @Param("storyId") storyId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.acceptanceService.approveStory(
        ApproveStoryAcceptanceInputSchema.parse({
          ...body,
          storyId
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
   * @param storyId The Story being formally rejected.
   * @param body The actor, reason, and operated time payload.
   * @returns The persisted rejection record.
   */
  @Post("/stories/:storyId/reject")
  @HttpCode(200)
  rejectStory(
    @Param("storyId") storyId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.acceptanceService.rejectStory(
        RejectStoryAcceptanceInputSchema.parse({
          ...body,
          storyId
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
   * @param storyId The rejected Story being reopened for another implementation pass.
   * @param body The actor, reason, and operated time payload.
   * @returns The persisted reopen record.
   */
  @Post("/stories/:storyId/reopen")
  @HttpCode(200)
  reopenStory(
    @Param("storyId") storyId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.acceptanceService.reopenStory(
        ReopenStoryAcceptanceInputSchema.parse({
          ...body,
          storyId
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
   * @param storyId The Story whose formal acceptance history should be listed.
   * @returns Oldest-first approval, rejection, and reopen records.
   */
  @Get("/stories/:storyId")
  listStoryAcceptanceHistory(@Param("storyId") storyId: string) {
    return this.acceptanceService.listStoryAcceptanceHistory(storyId);
  }
}
