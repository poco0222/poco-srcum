/**
 * @file Portfolio read-model controller for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query
} from "@nestjs/common";

import {
  ProjectStatus,
  type PortfolioFilter,
  type ProjectStatusValue
} from "@poco-scrum/domain";
import { PortfolioService } from "./portfolio.service";

const projectStatusValues = new Set<ProjectStatusValue>(Object.values(ProjectStatus));

@Controller("/portfolio")
export class PortfolioController {
  constructor(
    @Inject(PortfolioService)
    private readonly portfolioService: PortfolioService
  ) {}

  /**
   * @param portfolioId Optional project portfolio identifier.
   * @param projectId Optional project identifier.
   * @param projectStatus Optional frozen project lifecycle status.
   * @param milestoneFrom Optional inclusive roadmap start date filter.
   * @param milestoneTo Optional inclusive roadmap end date filter.
   * @returns Filtered Portfolio overview.
   */
  @Get()
  listPortfolio(
    @Query("portfolioId") portfolioId?: string,
    @Query("projectId") projectId?: string,
    @Query("projectStatus") projectStatus?: string,
    @Query("milestoneFrom") milestoneFrom?: string,
    @Query("milestoneTo") milestoneTo?: string
  ) {
    return this.portfolioService.listPortfolioOverview(
      parsePortfolioFilter({
        portfolioId,
        projectId,
        projectStatus,
        milestoneFrom,
        milestoneTo
      })
    );
  }

  /**
   * @param projectId The project identifier to drill into.
   * @returns Project summary, source work items, and roadmap milestones.
   */
  @Get("/projects/:projectId")
  getProjectDrilldown(@Param("projectId") projectId: string) {
    return this.portfolioService.getProjectDrilldown(projectId);
  }
}

/**
 * @param rawFilter Raw query values from NestJS.
 * @returns A typed Portfolio filter for the service layer.
 */
function parsePortfolioFilter(rawFilter: {
  portfolioId?: string;
  projectId?: string;
  projectStatus?: string;
  milestoneFrom?: string;
  milestoneTo?: string;
}): PortfolioFilter {
  const filter: PortfolioFilter = {};

  assignTrimmedQuery(filter, "portfolioId", rawFilter.portfolioId);
  assignTrimmedQuery(filter, "projectId", rawFilter.projectId);
  assignTrimmedQuery(filter, "milestoneFrom", rawFilter.milestoneFrom);
  assignTrimmedQuery(filter, "milestoneTo", rawFilter.milestoneTo);

  if (rawFilter.projectStatus && rawFilter.projectStatus.trim().length > 0) {
    const projectStatus = rawFilter.projectStatus.trim();

    if (!projectStatusValues.has(projectStatus as ProjectStatusValue)) {
      throw new BadRequestException("PORTFOLIO_PROJECT_STATUS_INVALID");
    }

    filter.projectStatus = projectStatus as ProjectStatusValue;
  }

  return filter;
}

/**
 * @param filter The mutable filter being built.
 * @param key The filter key to assign.
 * @param value The raw query value.
 */
function assignTrimmedQuery<TKey extends "portfolioId" | "projectId" | "milestoneFrom" | "milestoneTo">(
  filter: PortfolioFilter,
  key: TKey,
  value?: string
) {
  if (typeof value !== "string") {
    return;
  }

  const normalized = value.trim();

  if (normalized.length > 0) {
    filter[key] = normalized;
  }
}
