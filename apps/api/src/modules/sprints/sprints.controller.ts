/**
 * @file Sprint lifecycle controller for the Phase 1 sprint execution task.
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
  Post,
  Query
} from "@nestjs/common";

import { CreateSprintDtoSchema } from "./contracts/create-sprint.dto";
import { MoveBoardWorkItemDtoSchema } from "./contracts/board-column.dto";
import { RecordDailyUpdateDtoSchema } from "./contracts/daily-update.dto";
import { BlockersService } from "../blockers/blockers.service";
import { ClosureService } from "./closure.service";
import { DailyUpdatesService } from "./daily-updates.service";
import { UpdateSprintPlanningDtoSchema } from "./contracts/update-planning.dto";
import { PlanningService } from "./planning.service";
import { ScopeChangeService } from "./scope-change.service";
import { SprintsService } from "./sprints.service";

@Controller("/sprints")
export class SprintsController {
  private readonly blockersService: BlockersService;
  private readonly closureService: ClosureService;
  private readonly dailyUpdatesService: DailyUpdatesService;
  private readonly planningService: PlanningService;
  private readonly scopeChangeService: ScopeChangeService;
  private readonly sprintsService: SprintsService;

  constructor(
    @Inject(BlockersService) blockersService: BlockersService,
    @Inject(ClosureService) closureService: ClosureService,
    @Inject(DailyUpdatesService) dailyUpdatesService: DailyUpdatesService,
    @Inject(PlanningService) planningService: PlanningService,
    @Inject(ScopeChangeService) scopeChangeService: ScopeChangeService,
    @Inject(SprintsService) sprintsService: SprintsService
  ) {
    this.blockersService = blockersService;
    this.closureService = closureService;
    this.dailyUpdatesService = dailyUpdatesService;
    this.planningService = planningService;
    this.scopeChangeService = scopeChangeService;
    this.sprintsService = sprintsService;
  }

  /**
   * @param body The incoming Sprint creation payload.
   * @returns The created Sprint record.
   */
  @Post()
  createSprint(@Body() body: unknown) {
    try {
      return this.sprintsService.createSprint(CreateSprintDtoSchema.parse(body));
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param projectId The project whose Sprint records should be listed.
   * @returns The project Sprint overview list.
   */
  @Get()
  listSprints(@Query("projectId") projectId = "") {
    return this.sprintsService.listSprints(projectId);
  }

  /**
   * @param sprintId The requested Sprint identifier.
   * @returns The Sprint detail payload.
   */
  @Get("/:sprintId")
  getSprint(@Param("sprintId") sprintId: string) {
    return this.sprintsService.getSprintById(sprintId);
  }

  /**
   * @param sprintId The Sprint identifier whose planning baseline should be updated.
   * @param body The planning payload containing goal, commitments, and snapshot data.
   * @returns The updated Sprint record after the planning baseline is saved.
   */
  @Post("/:sprintId/planning")
  @HttpCode(200)
  updatePlanning(
    @Param("sprintId") sprintId: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return this.planningService.updatePlanning(
        UpdateSprintPlanningDtoSchema.parse({
          ...body,
          sprintId
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
   * @param sprintId The Sprint identifier whose board should be returned.
   * @returns The grouped board payload for the active Sprint.
   */
  @Get("/:sprintId/board")
  getBoard(@Param("sprintId") sprintId: string) {
    return this.dailyUpdatesService.getBoard(sprintId);
  }

  /**
   * @param sprintId The Sprint identifier whose daily timeline should be returned.
   * @returns The newest-first daily update timeline.
   */
  @Get("/:sprintId/daily-updates")
  listDailyUpdates(@Param("sprintId") sprintId: string) {
    return this.dailyUpdatesService.listDailyUpdates(sprintId);
  }

  /**
   * @param sprintId The Sprint identifier whose work item should move between board columns.
   * @param body The move payload containing the work item id and target column.
   * @returns The updated work item after the board transition.
   */
  @Post("/:sprintId/board/move")
  @HttpCode(200)
  moveBoardWorkItem(
    @Param("sprintId") sprintId: string,
    @Body() body: unknown
  ) {
    try {
      const payload = MoveBoardWorkItemDtoSchema.parse(body);

      return this.dailyUpdatesService.moveWorkItemToBoardColumn({
        sprintId,
        workItemId: payload.workItemId,
        column: payload.column
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param sprintId The Sprint identifier whose daily timeline should append a new entry.
   * @param body The daily update payload.
   * @returns The persisted daily update record.
   */
  @Post("/:sprintId/daily-updates")
  @HttpCode(200)
  recordDailyUpdate(
    @Param("sprintId") sprintId: string,
    @Body() body: unknown
  ) {
    try {
      const payload = RecordDailyUpdateDtoSchema.parse(body);

      return this.dailyUpdatesService.recordDailyUpdate({
        sprintId,
        workItemId: payload.workItemId ?? null,
        authorId: payload.authorId,
        summary: payload.summary
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * @param sprintId The Sprint identifier whose blocker timeline should record a new blocker.
   * @param body The blocker payload with actor, work item, and reason.
   * @returns The persisted blocker creation event.
   */
  @Post("/:sprintId/blockers")
  @HttpCode(200)
  createBlocker(
    @Param("sprintId") sprintId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.blockersService.createBlocker({
      actorId: String(body.actorId ?? "").trim(),
      sprintId,
      workItemId: String(body.workItemId ?? "").trim(),
      reason: String(body.reason ?? "").trim()
    });
  }

  /**
   * @param sprintId The Sprint identifier whose blocker should be resolved.
   * @param blockerId The blocker event identifier.
   * @param body The resolution payload.
   * @returns The persisted blocker resolution event.
   */
  @Post("/:sprintId/blockers/:blockerId/resolve")
  @HttpCode(200)
  resolveBlocker(
    @Param("blockerId") blockerId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.blockersService.resolveBlocker({
      blockerId,
      actorId: String(body.actorId ?? "").trim(),
      reason: String(body.reason ?? "").trim()
    });
  }

  /**
   * @param sprintId The active Sprint identifier.
   * @param body The scope-in payload.
   * @returns The persisted scope-in event.
   */
  @Post("/:sprintId/scope/in")
  @HttpCode(200)
  addScopeItem(
    @Param("sprintId") sprintId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.scopeChangeService.addWorkItemToActiveSprint({
      actorId: String(body.actorId ?? "").trim(),
      sprintId,
      workItemId: String(body.workItemId ?? "").trim(),
      reason: String(body.reason ?? "").trim()
    });
  }

  /**
   * @param sprintId The active Sprint identifier.
   * @param body The scope-out payload.
   * @returns The persisted scope-out event.
   */
  @Post("/:sprintId/scope/out")
  @HttpCode(200)
  removeScopeItem(
    @Param("sprintId") sprintId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.scopeChangeService.removeWorkItemFromActiveSprint({
      actorId: String(body.actorId ?? "").trim(),
      sprintId,
      workItemId: String(body.workItemId ?? "").trim(),
      reason: String(body.reason ?? "").trim()
    });
  }

  /**
   * @param sprintId The Sprint identifier whose scope change timeline should be returned.
   * @returns The newest-first scope change events.
   */
  @Get("/:sprintId/scope-events")
  listScopeEvents(@Param("sprintId") sprintId: string) {
    return this.scopeChangeService.listScopeChangeEvents(sprintId);
  }

  /**
   * @param sprintId The ended Sprint identifier.
   * @param body The retrospective creation payload.
   * @returns The created retrospective record.
   */
  @Post("/:sprintId/retrospective")
  @HttpCode(200)
  createRetrospective(
    @Param("sprintId") sprintId: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.closureService.createRetrospectiveRecord({
      sprintId,
      actorId: String(body.actorId ?? "").trim(),
      title: String(body.title ?? "").trim(),
      markdown: String(body.markdown ?? "").trim()
    });
  }

  /**
   * @param sprintId The Sprint identifier that should start execution.
   * @returns The updated Sprint record.
   */
  @Post("/:sprintId/start")
  @HttpCode(200)
  startSprint(@Param("sprintId") sprintId: string) {
    return this.sprintsService.startSprint(sprintId);
  }

  /**
   * @param sprintId The Sprint identifier that should end execution.
   * @returns The updated Sprint record.
   */
  @Post("/:sprintId/end")
  @HttpCode(200)
  endSprint(@Param("sprintId") sprintId: string) {
    return this.sprintsService.endSprint(sprintId);
  }

  /**
   * @param sprintId The Sprint identifier that should close.
   * @returns The updated Sprint record.
   */
  @Post("/:sprintId/close")
  @HttpCode(200)
  closeSprint(@Param("sprintId") sprintId: string) {
    return this.sprintsService.closeSprint(sprintId);
  }
}
