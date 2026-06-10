/**
 * @file Document collaboration dashboard controller for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { Controller, Get, Inject } from "@nestjs/common";

import { DashboardService } from "./dashboard.service";

@Controller("/dashboard")
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService
  ) {}

  /**
   * @returns Fixed document collaboration dashboard cards.
   */
  @Get("/documents")
  getDocumentDashboard() {
    return this.dashboardService.getDocumentCollaborationDashboard();
  }
}
