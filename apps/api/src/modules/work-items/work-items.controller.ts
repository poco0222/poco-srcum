/**
 * @file Work items controller for the Phase 1 backlog task.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";

import { AddToSprintInputSchema } from "../sprints/contracts/add-to-sprint.dto";
import { WorkItemsService } from "./work-items.service";

@Controller("/work-items")
export class WorkItemsController {
  private readonly workItemsService: WorkItemsService;

  constructor(@Inject(WorkItemsService) workItemsService: WorkItemsService) {
    this.workItemsService = workItemsService;
  }

  /**
   * @param body The incoming work item creation payload.
   * @returns The created backlog item.
   */
  @Post()
  createWorkItem(@Body() body: unknown) {
    return this.workItemsService.createWorkItem(body as never);
  }

  /**
   * @param projectId The project whose backlog should be listed.
   * @param sprintId Optional Sprint filter for execution views.
   * @returns The backlog items ordered by sort order.
   */
  @Get()
  listWorkItems(
    @Query("projectId") projectId = "",
    @Query("sprintId") sprintId?: string
  ) {
    return this.workItemsService.listBacklogItems(projectId, sprintId);
  }

  /**
   * @param workItemId The requested work item identifier.
   * @returns The work item detail.
   */
  @Get("/:workItemId")
  getWorkItem(@Param("workItemId") workItemId: string) {
    return this.workItemsService.getWorkItemById(workItemId);
  }

  /**
   * @param workItemId The work item that should be updated.
   * @param body The partial update payload.
   * @returns The updated work item detail.
   */
  @Patch("/:workItemId")
  updateWorkItem(
    @Param("workItemId") workItemId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.workItemsService.updateWorkItem({
      ...body,
      id: workItemId
    });
  }

  /**
   * @param body The project-scoped backlog reorder payload.
   * @returns The refreshed backlog order.
   */
  @Post("/reorder")
  reorderWorkItems(@Body() body: unknown) {
    return this.workItemsService.reorderBacklogItems(body as never);
  }

  /**
   * @param workItemId The story that should be committed into a sprint.
   * @param body The sprint identifier payload.
   * @returns The updated story after sprint commitment.
   */
  @Post("/:workItemId/add-to-sprint")
  @HttpCode(200)
  addStoryToSprint(
    @Param("workItemId") workItemId: string,
    @Body() body: unknown
  ) {
    try {
      const payload = AddToSprintInputSchema.parse(body);

      return this.workItemsService.addStoryToSprint({
        workItemId,
        sprintId: payload.sprintId
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param workItemId The Story that should enter Done after formal acceptance.
   * @param body The completion payload containing the acting user.
   * @returns The completed Story when the acceptance guard passes.
   */
  @Post("/:workItemId/complete")
  @HttpCode(200)
  completeStory(
    @Param("workItemId") workItemId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.workItemsService.completeStory({
      workItemId,
      actorId: String(body.actorId ?? "").trim()
    });
  }
}
