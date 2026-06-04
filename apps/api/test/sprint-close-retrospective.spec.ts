/**
 * @file Sprint closure and retrospective regression test for the Phase 1 sprint execution task.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { SprintStatus } from "@poco-scrum/domain";
import { ClosureService } from "../src/modules/sprints/closure.service";
import { InMemorySprintsRepository } from "../src/modules/sprints/sprints.repository";
import { SprintsService } from "../src/modules/sprints/sprints.service";

describe("Sprint closure and retrospective", () => {
  it("creates a retrospective record only after the sprint has ended", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-1",
        projectId: "project-1",
        name: "Sprint 27",
        status: SprintStatus.ENDED,
        goal: "Close the sprint and open retrospective",
        planningNote: null,
        planningSnapshot: {
          goal: "Close the sprint and open retrospective",
          commitmentWorkItemIds: ["story-1"],
          planningNote: null,
          capturedAt: "2026-06-04T09:00:00.000Z"
        },
        startsAt: null,
        endsAt: null,
        activatedAt: "2026-06-10T09:00:00.000Z",
        endedAt: "2026-06-20T18:00:00.000Z",
        closedAt: null,
        retrospectiveId: null
      }
    ]);
    const closureService = new ClosureService(sprintsRepository);

    const retrospective = await closureService.createRetrospectiveRecord({
      sprintId: "sprint-1",
      actorId: "user-1",
      title: "Sprint 27 Retrospective",
      markdown: "## Wins\n- Board shell is stable.\n\n## Improve\n- Scope changes need follow-up."
    });
    const updatedSprint = await sprintsRepository.getById("sprint-1");

    assert.equal(retrospective.sprintId, "sprint-1");
    assert.equal(retrospective.actorId, "user-1");
    assert.equal(updatedSprint?.retrospectiveId, retrospective.id);
  });

  it("rejects reopening a sprint after it has been closed", async () => {
    const sprintsRepository = new InMemorySprintsRepository([
      {
        id: "sprint-2",
        projectId: "project-1",
        name: "Sprint 28",
        status: SprintStatus.CLOSED,
        goal: "Keep closed sprint immutable",
        planningNote: null,
        planningSnapshot: {
          goal: "Keep closed sprint immutable",
          commitmentWorkItemIds: ["story-2"],
          planningNote: null,
          capturedAt: "2026-06-04T09:00:00.000Z"
        },
        startsAt: null,
        endsAt: null,
        activatedAt: "2026-06-10T09:00:00.000Z",
        endedAt: "2026-06-20T18:00:00.000Z",
        closedAt: "2026-06-21T09:00:00.000Z",
        retrospectiveId: "retro-1"
      }
    ]);
    const sprintsService = new SprintsService(sprintsRepository);

    await assert.rejects(() => sprintsService.startSprint("sprint-2"), {
      message: "SPRINT_STATUS_TRANSITION_INVALID"
    });
  });
});
