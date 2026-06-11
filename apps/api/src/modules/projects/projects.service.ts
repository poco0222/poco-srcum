/**
 * @file Project membership service for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { ForbiddenException } from "@nestjs/common";

import type {
  MemberStatusValue,
  ProjectCatalogRecord,
  ProjectRoleValue
} from "@poco-scrum/domain";
import { ProjectStatus } from "@poco-scrum/domain";
import {
  AssertProjectMembershipInputSchema,
  type AssertProjectMembershipInput
} from "@poco-scrum/shared";

type ProjectMembershipRecord = {
  currentUserId: string;
  projectId: string;
  role: ProjectRoleValue;
  status: MemberStatusValue;
};

// Frozen seed catalog used until a persistent project catalog is introduced.
const defaultProjectCatalog: ProjectCatalogRecord[] = [
  {
    id: "project-1",
    key: "CORE",
    name: "Core Platform",
    teamId: "team-platform",
    status: ProjectStatus.ACTIVE,
    portfolioId: "portfolio-alpha",
    portfolioName: "Alpha Portfolio"
  },
  {
    id: "project-2",
    key: "OPS",
    name: "Operations",
    teamId: "team-ops",
    status: ProjectStatus.ARCHIVED,
    portfolioId: "portfolio-beta",
    portfolioName: "Beta Portfolio"
  }
];

export class ProjectsService {
  constructor(
    private readonly projectMemberships: ProjectMembershipRecord[] = [],
    private readonly projectCatalog: ProjectCatalogRecord[] = defaultProjectCatalog
  ) {}

  /**
   * @returns The frozen read-only project catalog used by management views.
   */
  async listProjectCatalog() {
    return this.projectCatalog.map((project) => cloneProjectCatalogRecord(project));
  }

  /**
   * @param input The current user and project pair that should be validated against the membership boundary.
   * @returns The matched active project membership record.
   */
  async assertProjectMemberAccess(input: AssertProjectMembershipInput) {
    const payload = AssertProjectMembershipInputSchema.parse(input);

    const membership = this.projectMemberships.find((candidate) => {
      // Match both the project and current user so the access boundary stays explicit.
      return (
        candidate.currentUserId === payload.currentUserId &&
        candidate.projectId === payload.projectId &&
        candidate.status === "ACTIVE"
      );
    });

    if (!membership) {
      throw new ForbiddenException("PROJECT_MEMBER_ACCESS_DENIED");
    }

    return membership;
  }
}

/**
 * @param project The catalog record to clone.
 * @returns A detached project catalog record.
 */
function cloneProjectCatalogRecord(project: ProjectCatalogRecord): ProjectCatalogRecord {
  return {
    ...project
  };
}
