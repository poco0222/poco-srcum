/**
 * @file Session controller for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { Controller, Get, Headers } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { SessionService } from "../services/session.service";

@Controller("/auth")
export class SessionController {
  private readonly sessionService: SessionService;

  constructor(@Inject(SessionService) sessionService: SessionService) {
    // Preserve the injected service on an explicit field so the runtime does not depend on parameter-property transforms.
    this.sessionService = sessionService;
  }

  /**
   * @param sessionUserId The session user identifier forwarded by the request boundary.
   * @returns The current authenticated user summary.
   */
  @Get("/me")
  getCurrentUser(@Headers("x-session-user") sessionUserId?: string) {
    return this.sessionService.getCurrentUser(sessionUserId);
  }
}
