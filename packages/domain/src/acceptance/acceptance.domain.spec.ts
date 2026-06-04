/**
 * @file Acceptance state machine regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  AcceptanceStatus,
  assertAcceptanceStatusTransition,
  canCompleteStoryWithAcceptance,
  canTransitionAcceptanceStatus
} from "../index";

describe("acceptance state machine", () => {
  it("allows the minimum pending, approved, rejected, and reopened loop", () => {
    assert.equal(
      canTransitionAcceptanceStatus(
        AcceptanceStatus.PENDING,
        AcceptanceStatus.APPROVED
      ),
      true
    );
    assert.equal(
      canTransitionAcceptanceStatus(
        AcceptanceStatus.PENDING,
        AcceptanceStatus.REJECTED
      ),
      true
    );
    assert.equal(
      canTransitionAcceptanceStatus(
        AcceptanceStatus.REJECTED,
        AcceptanceStatus.REOPENED
      ),
      true
    );
    assert.equal(
      canTransitionAcceptanceStatus(
        AcceptanceStatus.REOPENED,
        AcceptanceStatus.APPROVED
      ),
      true
    );
  });

  it("rejects repeated approval and rejection after approval", () => {
    assert.throws(
      () =>
        assertAcceptanceStatusTransition(
          AcceptanceStatus.APPROVED,
          AcceptanceStatus.REJECTED
        ),
      {
        message: "ACCEPTANCE_STATUS_TRANSITION_INVALID"
      }
    );
    assert.equal(
      canTransitionAcceptanceStatus(
        AcceptanceStatus.APPROVED,
        AcceptanceStatus.APPROVED
      ),
      false
    );
  });

  it("allows story completion only after formal approval", () => {
    assert.equal(canCompleteStoryWithAcceptance(AcceptanceStatus.APPROVED), true);
    assert.equal(canCompleteStoryWithAcceptance(AcceptanceStatus.PENDING), false);
    assert.equal(canCompleteStoryWithAcceptance(AcceptanceStatus.REJECTED), false);
    assert.equal(canCompleteStoryWithAcceptance(AcceptanceStatus.REOPENED), false);
  });
});
