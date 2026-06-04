/**
 * @file Shared Sprint domain contract regression test for the Phase 1 sprint lifecycle freeze step.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  SprintAllowedTransitions,
  SprintStatus,
  assertSprintStatusTransition,
  canTransitionSprintStatus
} from "../index";

describe("shared sprint domain contract", () => {
  it("exports the frozen Sprint lifecycle enum", () => {
    assert.deepEqual(SprintStatus, {
      DRAFT: "DRAFT",
      PLANNED: "PLANNED",
      ACTIVE: "ACTIVE",
      ENDED: "ENDED",
      CLOSED: "CLOSED"
    });
  });

  it("freezes the allowed one-step Sprint transitions", () => {
    assert.deepEqual(SprintAllowedTransitions, {
      DRAFT: [SprintStatus.PLANNED],
      PLANNED: [SprintStatus.ACTIVE],
      ACTIVE: [SprintStatus.ENDED],
      ENDED: [SprintStatus.CLOSED],
      CLOSED: []
    });
  });

  it("rejects lifecycle skips and reopening attempts through the shared guard", () => {
    assert.equal(
      canTransitionSprintStatus(SprintStatus.DRAFT, SprintStatus.ACTIVE),
      false
    );
    assert.equal(
      canTransitionSprintStatus(SprintStatus.CLOSED, SprintStatus.ACTIVE),
      false
    );

    assert.throws(
      () => assertSprintStatusTransition(SprintStatus.DRAFT, SprintStatus.ACTIVE),
      {
        message: "SPRINT_STATUS_TRANSITION_INVALID"
      }
    );
    assert.throws(
      () => assertSprintStatusTransition(SprintStatus.CLOSED, SprintStatus.ACTIVE),
      {
        message: "SPRINT_STATUS_TRANSITION_INVALID"
      }
    );
  });
});
