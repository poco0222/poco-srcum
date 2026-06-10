/**
 * @file Document review state machine regression tests for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentReviewStatus,
  assertDocumentReviewStatusTransition,
  canApproveDocumentReviewVersion,
  canTransitionDocumentReviewStatus
} from "../index";

describe("document review state machine", () => {
  it("freezes the minimum Phase 2 document review statuses", () => {
    assert.deepEqual(DocumentReviewStatus, {
      DRAFT: "draft",
      IN_REVIEW: "in-review",
      APPROVED: "approved",
      REJECTED: "rejected"
    });
  });

  it("allows draft submission and formal review decisions", () => {
    assert.equal(
      canTransitionDocumentReviewStatus(
        DocumentReviewStatus.DRAFT,
        DocumentReviewStatus.IN_REVIEW
      ),
      true
    );
    assert.equal(
      canTransitionDocumentReviewStatus(
        DocumentReviewStatus.IN_REVIEW,
        DocumentReviewStatus.APPROVED
      ),
      true
    );
    assert.equal(
      canTransitionDocumentReviewStatus(
        DocumentReviewStatus.IN_REVIEW,
        DocumentReviewStatus.REJECTED
      ),
      true
    );
    assert.equal(
      canTransitionDocumentReviewStatus(
        DocumentReviewStatus.REJECTED,
        DocumentReviewStatus.DRAFT
      ),
      true
    );
  });

  it("rejects lifecycle skips and repeated approvals", () => {
    assert.throws(
      () =>
        assertDocumentReviewStatusTransition(
          DocumentReviewStatus.DRAFT,
          DocumentReviewStatus.APPROVED
        ),
      {
        message: "DOCUMENT_REVIEW_STATUS_TRANSITION_INVALID"
      }
    );
    assert.equal(
      canTransitionDocumentReviewStatus(
        DocumentReviewStatus.APPROVED,
        DocumentReviewStatus.APPROVED
      ),
      false
    );
  });

  it("allows approval only for the latest submitted version", () => {
    assert.equal(canApproveDocumentReviewVersion("version-2", "version-2"), true);
    assert.equal(canApproveDocumentReviewVersion("version-1", "version-2"), false);
  });
});
