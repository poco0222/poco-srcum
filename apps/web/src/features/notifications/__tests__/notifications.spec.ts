/**
 * @file Notification presentation regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { NotificationEventType } from "@poco-scrum/domain";
import { getNotificationLabel } from "../notification-labels";

describe("notification labels", () => {
  it("names the P1 acceptance and document events", () => {
    assert.equal(
      getNotificationLabel(NotificationEventType.ACCEPTANCE_APPROVED),
      "Acceptance approved"
    );
    assert.equal(
      getNotificationLabel(NotificationEventType.ACCEPTANCE_REJECTED),
      "Acceptance rejected"
    );
    assert.equal(
      getNotificationLabel(NotificationEventType.ACCEPTANCE_REOPENED),
      "Acceptance reopened"
    );
    assert.equal(
      getNotificationLabel(NotificationEventType.DOCUMENT_UPDATED),
      "Document updated"
    );
  });
});
