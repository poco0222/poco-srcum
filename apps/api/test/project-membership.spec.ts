/**
 * @file Project membership access-control regression test for the Phase 1 foundation task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ProjectsService } from "../src/modules/projects/projects.service";

describe("ProjectsService.assertProjectMemberAccess", () => {
  it("throws when the current user is not an active project member", async () => {
    const service = new ProjectsService();

    await assert.rejects(
      () =>
        service.assertProjectMemberAccess({
          currentUserId: "user-1",
          projectId: "project-1"
        }),
      {
        message: "PROJECT_MEMBER_ACCESS_DENIED"
      }
    );
  });
});
