/**
 * @file Object linkage controller for Phase 2 delivery traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";

import type {
  LinkageObjectTypeValue,
  LinkageRelationTypeValue
} from "@poco-scrum/domain";
import { LinkageService } from "./linkage.service";

@Controller("/linkage")
export class LinkageController {
  constructor(
    @Inject(LinkageService)
    private readonly linkageService: LinkageService
  ) {}

  /**
   * @param body The directed object-link creation payload.
   * @returns The persisted object link.
   */
  @Post()
  createLink(@Body() body: Record<string, unknown>) {
    return this.linkageService.createLink({
      relationType: body.relationType as LinkageRelationTypeValue,
      sourceType: body.sourceType as LinkageObjectTypeValue,
      sourceId: body.sourceId as string,
      targetType: body.targetType as LinkageObjectTypeValue,
      targetId: body.targetId as string,
      actorId: body.actorId as string
    });
  }

  /**
   * @param sourceType The source object kind.
   * @param sourceId The source object identifier.
   * @returns Outgoing object links from the source.
   */
  @Get("/forward")
  listForwardLinks(
    @Query("sourceType") sourceType: LinkageObjectTypeValue,
    @Query("sourceId") sourceId: string
  ) {
    return this.linkageService.listForwardLinks({
      sourceType,
      sourceId
    });
  }

  /**
   * @param targetType The target object kind.
   * @param targetId The target object identifier.
   * @returns Incoming object links pointing at the target.
   */
  @Get("/reverse")
  listReverseLinks(
    @Query("targetType") targetType: LinkageObjectTypeValue,
    @Query("targetId") targetId: string
  ) {
    return this.linkageService.listReverseLinks({
      targetType,
      targetId
    });
  }
}
