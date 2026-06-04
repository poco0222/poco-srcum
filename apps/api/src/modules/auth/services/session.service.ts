/**
 * @file Session service for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { UnauthorizedException } from "@nestjs/common";

export type SessionUserSummary = {
  id: string;
  displayName: string;
  team: {
    id: string;
    name: string;
  };
  defaultProject: {
    id: string;
    key: string;
    name: string;
  };
};

export class SessionService {
  private readonly sessionUsers = new Map<string, SessionUserSummary>([
    [
      "user-1",
      {
        id: "user-1",
        displayName: "PopoY Demo User",
        team: {
          id: "team-1",
          name: "POCO Core Team"
        },
        defaultProject: {
          id: "project-1",
          key: "POCO",
          name: "POCO Scrum Platform"
        }
      }
    ]
  ]);

  /**
   * @param currentUserId The session user identifier forwarded by the request boundary.
   * @returns The current user summary required by the authenticated frontend shell.
   */
  getCurrentUser(currentUserId?: string) {
    if (!currentUserId) {
      throw new UnauthorizedException("SESSION_REQUIRED");
    }

    const sessionUser = this.sessionUsers.get(currentUserId);

    if (!sessionUser) {
      throw new UnauthorizedException("SESSION_REQUIRED");
    }

    return sessionUser;
  }
}
