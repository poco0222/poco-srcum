/**
 * @file Portfolio read-model service for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  ProjectStatus,
  buildPortfolioProjectSummary,
  createEmptyPortfolioOverview,
  createRoadmapMilestoneFromSprint,
  filterPortfolioProjectSummaries,
  sortRoadmapMilestones,
  type PortfolioFilter,
  type PortfolioOverview,
  type PortfolioProjectSummary,
  type ProjectCatalogRecord,
  type PortfolioSourceProject,
  type RoadmapMilestone,
  type WorkItemRecord
} from "@poco-scrum/domain";
import { SprintsService } from "../sprints/sprints.service";
import { WorkItemsService } from "../work-items/work-items.service";

export type PortfolioProjectDrilldown = {
  project: PortfolioProjectSummary;
  workItems: WorkItemRecord[];
  milestones: RoadmapMilestone[];
};

export type ProjectCatalogReader = {
  listProjectCatalog: () =>
    | Promise<ProjectCatalogRecord[]>
    | ProjectCatalogRecord[];
};

export type PortfolioServiceDependencies = {
  projects?: PortfolioSourceProject[];
  projectCatalogReader?: ProjectCatalogReader;
  sprintsService?: SprintsService;
  workItemsService?: WorkItemsService;
  getNow?: () => string;
};

/**
 * Builds the read-only P3 Portfolio entry point without owning Task2 signals.
 */
export class PortfolioService {
  private readonly getNow: () => string;
  private readonly projects: ProjectCatalogRecord[];
  private readonly projectCatalogReader?: ProjectCatalogReader;
  private readonly sprintsService: SprintsService;
  private readonly workItemsService: WorkItemsService;

  constructor(dependencies: PortfolioServiceDependencies = {}) {
    this.projects = dependencies.projects ?? [];
    this.projectCatalogReader = dependencies.projectCatalogReader;
    this.sprintsService = dependencies.sprintsService ?? new SprintsService();
    this.workItemsService = dependencies.workItemsService ?? new WorkItemsService();
    this.getNow = dependencies.getNow ?? (() => new Date().toISOString());
  }

  /**
   * @param filters Optional Portfolio filters from API query parameters.
   * @returns Filtered Portfolio overview with project summaries and milestones.
   */
  async listPortfolioOverview(
    filters: PortfolioFilter = {}
  ): Promise<PortfolioOverview> {
    const summaries = await this.buildAllProjectSummaries();
    const filteredProjects = filterPortfolioProjectSummaries(summaries, filters);
    const normalizedFilters = createEmptyPortfolioOverview(filters).filters;

    return {
      filters: normalizedFilters,
      projects: filteredProjects,
      milestones: sortRoadmapMilestones(
        filteredProjects.flatMap((project) => project.milestones)
      ),
      generatedAt: this.getNow()
    };
  }

  /**
   * @param projectId The project identifier to drill into.
   * @returns Project summary plus source work items and milestones.
   */
  async getProjectDrilldown(projectId: string): Promise<PortfolioProjectDrilldown> {
    const normalizedProjectId = projectId.trim();

    if (normalizedProjectId.length === 0) {
      throw new BadRequestException("PORTFOLIO_PROJECT_ID_REQUIRED");
    }

    const summaries = await this.buildAllProjectSummaries();
    const project = summaries.find((candidate) => candidate.id === normalizedProjectId);

    if (!project) {
      throw new NotFoundException("PORTFOLIO_PROJECT_NOT_FOUND");
    }

    const workItems = (await this.workItemsService.listAllWorkItems()).filter(
      (workItem) => workItem.projectId === normalizedProjectId
    );

    return {
      project,
      workItems,
      milestones: project.milestones
    };
  }

  /**
   * @returns All project summaries inferred from explicit projects, work items, and Sprints.
   */
  private async buildAllProjectSummaries() {
    const workItems = await this.workItemsService.listAllWorkItems();
    const milestones = sortRoadmapMilestones(
      (await this.sprintsService.listAllSprints()).map((sprint) =>
        createRoadmapMilestoneFromSprint(sprint)
      )
    );
    const projects = this.resolvePortfolioProjects(
      await this.listProjectCatalog(),
      workItems,
      milestones
    );

    return projects
      .map((project) =>
        buildPortfolioProjectSummary({
          project,
          workItems,
          milestones
        })
      )
      .sort((left, right) => left.key.localeCompare(right.key));
  }

  /**
   * @param workItems Work items that can imply project presence.
   * @param milestones Milestones that can imply project presence.
   * @returns Explicit project catalog merged with inferred read-only projects.
   */
  private resolvePortfolioProjects(
    projectCatalog: ProjectCatalogRecord[],
    workItems: WorkItemRecord[],
    milestones: RoadmapMilestone[]
  ) {
    const projectsById = new Map<string, PortfolioSourceProject>();

    for (const project of projectCatalog) {
      projectsById.set(project.id, project);
    }

    for (const projectId of collectProjectIds(workItems, milestones)) {
      if (!projectsById.has(projectId)) {
        projectsById.set(projectId, createInferredProject(projectId));
      }
    }

    return [...projectsById.values()];
  }

  /**
   * @returns The explicit project catalog merged from constructor and project service sources.
   */
  private async listProjectCatalog() {
    const serviceProjects =
      (await this.projectCatalogReader?.listProjectCatalog()) ?? [];

    return [...this.projects, ...serviceProjects];
  }
}

/**
 * @param workItems Work items with project identifiers.
 * @param milestones Roadmap milestones with project identifiers.
 * @returns Unique project identifiers in first-seen order.
 */
function collectProjectIds(
  workItems: WorkItemRecord[],
  milestones: RoadmapMilestone[]
) {
  return [
    ...new Set([
      ...workItems.map((workItem) => workItem.projectId),
      ...milestones.map((milestone) => milestone.projectId)
    ])
  ];
}

/**
 * @param projectId A project id inferred from frozen P1/P2 objects.
 * @returns A minimal project record for read-only Portfolio aggregation.
 */
function createInferredProject(projectId: string): PortfolioSourceProject {
  return {
    id: projectId,
    key: projectId,
    name: `Project ${projectId}`,
    teamId: "unassigned",
    status: ProjectStatus.ACTIVE,
    portfolioId: null,
    portfolioName: null
  };
}
