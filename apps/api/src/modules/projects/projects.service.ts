/**
 * @file Project membership service for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { ForbiddenException } from "@nestjs/common";

import type {
  MemberStatusValue,
  ProjectRoleValue
} from "@poco-scrum/domain";
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

export class ProjectsService {
  constructor(
    private readonly projectMemberships: ProjectMembershipRecord[] = []
  ) {}

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
