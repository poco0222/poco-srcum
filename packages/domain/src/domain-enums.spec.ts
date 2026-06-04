/**
 * @file Shared domain enums regression test for the Phase 1 naming freeze step.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  MemberStatus,
  ProjectRole,
  ProjectStatus,
  SystemRole
} from "./index";

describe("shared domain enums", () => {
  it("exports the frozen system and project role names", () => {
    assert.deepEqual(SystemRole, {
      SYSTEM_ADMIN: "SYSTEM_ADMIN",
      TEAM_MEMBER: "TEAM_MEMBER"
    });

    assert.deepEqual(ProjectRole, {
      PROJECT_OWNER: "PROJECT_OWNER",
      SCRUM_MASTER: "SCRUM_MASTER",
      DEVELOPER: "DEVELOPER",
      REVIEWER: "REVIEWER"
    });
  });

  it("exports the frozen member and project statuses", () => {
    assert.deepEqual(MemberStatus, {
      INVITED: "INVITED",
      ACTIVE: "ACTIVE",
      SUSPENDED: "SUSPENDED"
    });

    assert.deepEqual(ProjectStatus, {
      DRAFT: "DRAFT",
      ACTIVE: "ACTIVE",
      ARCHIVED: "ARCHIVED"
    });
  });
});
