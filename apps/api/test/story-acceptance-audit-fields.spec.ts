/**
 * @file Story acceptance audit field regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AcceptanceStatus, type StoryAcceptanceRecord } from "@poco-scrum/domain";
import {
  ApproveStoryAcceptanceInputSchema,
  RejectStoryAcceptanceInputSchema,
  ReopenStoryAcceptanceInputSchema
} from "@poco-scrum/shared";

describe("Story acceptance audit fields", () => {
  it("normalizes approval input with actor and operated time", () => {
    const payload = ApproveStoryAcceptanceInputSchema.parse({
      storyId: " story-1 ",
      actorId: " user-1 ",
      operatedAt: "2026-06-04T10:00:00.000Z"
    });

    assert.deepEqual(payload, {
      storyId: "story-1",
      actorId: "user-1",
      operatedAt: "2026-06-04T10:00:00.000Z"
    });
  });

  it("requires rejection and reopen reasons for traceability", () => {
    const rejected = RejectStoryAcceptanceInputSchema.parse({
      storyId: "story-2",
      actorId: "user-2",
      reason: "Acceptance criteria were not demonstrably met.",
      operatedAt: "2026-06-04T11:00:00.000Z"
    });
    const reopened = ReopenStoryAcceptanceInputSchema.parse({
      storyId: "story-2",
      actorId: "user-3",
      reason: "The team accepted the fix plan and reopened implementation.",
      operatedAt: "2026-06-04T12:00:00.000Z"
    });

    assert.equal(rejected.reason, "Acceptance criteria were not demonstrably met.");
    assert.equal(
      reopened.reason,
      "The team accepted the fix plan and reopened implementation."
    );
    assert.throws(
      () =>
        RejectStoryAcceptanceInputSchema.parse({
          storyId: "story-2",
          actorId: "user-2",
          reason: " ",
          operatedAt: "2026-06-04T11:00:00.000Z"
        }),
      {
        message: "STORY_ACCEPTANCE_REJECT_INPUT_INVALID"
      }
    );
  });

  it("represents persisted approval, rejection, and reopen audit fields", () => {
    const records: StoryAcceptanceRecord[] = [
      {
        id: "acceptance-1",
        storyId: "story-3",
        status: AcceptanceStatus.APPROVED,
        actorId: "user-1",
        reason: null,
        operatedAt: "2026-06-04T10:00:00.000Z",
        createdAt: "2026-06-04T10:00:00.000Z"
      },
      {
        id: "acceptance-2",
        storyId: "story-3",
        status: AcceptanceStatus.REJECTED,
        actorId: "user-2",
        reason: "The delivered behavior missed one acceptance criterion.",
        operatedAt: "2026-06-04T11:00:00.000Z",
        createdAt: "2026-06-04T11:00:00.000Z"
      },
      {
        id: "acceptance-3",
        storyId: "story-3",
        status: AcceptanceStatus.REOPENED,
        actorId: "user-3",
        reason: "The team agreed to reopen and address the rejection.",
        operatedAt: "2026-06-04T12:00:00.000Z",
        createdAt: "2026-06-04T12:00:00.000Z"
      }
    ];

    assert.deepEqual(
      records.map((record) => ({
        status: record.status,
        actorId: record.actorId,
        reason: record.reason,
        operatedAt: record.operatedAt
      })),
      [
        {
          status: AcceptanceStatus.APPROVED,
          actorId: "user-1",
          reason: null,
          operatedAt: "2026-06-04T10:00:00.000Z"
        },
        {
          status: AcceptanceStatus.REJECTED,
          actorId: "user-2",
          reason: "The delivered behavior missed one acceptance criterion.",
          operatedAt: "2026-06-04T11:00:00.000Z"
        },
        {
          status: AcceptanceStatus.REOPENED,
          actorId: "user-3",
          reason: "The team agreed to reopen and address the rejection.",
          operatedAt: "2026-06-04T12:00:00.000Z"
        }
      ]
    );
  });
});
