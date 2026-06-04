/**
 * @file Sprint lifecycle regression test for the Phase 1 sprint execution task.
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
} from "@poco-scrum/domain";

describe("Sprint lifecycle state machine", () => {
  it("freezes the allowed one-way Sprint lifecycle transitions", () => {
    assert.deepEqual(SprintAllowedTransitions, {
      DRAFT: [SprintStatus.PLANNED],
      PLANNED: [SprintStatus.ACTIVE],
      ACTIVE: [SprintStatus.ENDED],
      ENDED: [SprintStatus.CLOSED],
      CLOSED: []
    });
  });

  it("accepts the sequential lifecycle transitions only", () => {
    assert.equal(
      canTransitionSprintStatus(SprintStatus.DRAFT, SprintStatus.PLANNED),
      true
    );
    assert.equal(
      canTransitionSprintStatus(SprintStatus.PLANNED, SprintStatus.ACTIVE),
      true
    );
    assert.equal(
      canTransitionSprintStatus(SprintStatus.ACTIVE, SprintStatus.ENDED),
      true
    );
    assert.equal(
      canTransitionSprintStatus(SprintStatus.ENDED, SprintStatus.CLOSED),
      true
    );
  });

  it("rejects skipping from draft directly to active", () => {
    assert.equal(
      canTransitionSprintStatus(SprintStatus.DRAFT, SprintStatus.ACTIVE),
      false
    );
    assert.throws(
      () => assertSprintStatusTransition(SprintStatus.DRAFT, SprintStatus.ACTIVE),
      {
        message: "SPRINT_STATUS_TRANSITION_INVALID"
      }
    );
  });

  it("rejects reopening a closed sprint", () => {
    assert.equal(
      canTransitionSprintStatus(SprintStatus.CLOSED, SprintStatus.ACTIVE),
      false
    );
    assert.throws(
      () => assertSprintStatusTransition(SprintStatus.CLOSED, SprintStatus.ACTIVE),
      {
        message: "SPRINT_STATUS_TRANSITION_INVALID"
      }
    );
  });
});
