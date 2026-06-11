# ADR 009 Portfolio View Contract

> Author: PopoY
> Created: 2026-06-11
> Status: Accepted

## Context

Phase 3 Task 1 needs a stable Portfolio view entry before reporting, risk tracking, weekly summary, or export work starts. The view must aggregate multiple Scrum teams into one management surface without becoming the owner of reporting formulas, dependency rules, risk status, or delay detection.

## Decision

The Portfolio view consumes these field groups only:

| Field Group | Fields | Upstream Source |
| --- | --- | --- |
| Project summary | `id`, `key`, `name`, `teamId`, `status`, `portfolioId`, `portfolioName`, `activeSprintCount`, `doneWorkItemCount`, `totalWorkItemCount` | P1/P2 frozen project and work item records |
| Roadmap milestone | `id`, `projectId`, `title`, `kind`, `status`, `startsAt`, `endsAt`, `sourceType`, `sourceId` | P1 frozen sprint records mapped into read-only milestones |
| Signal snapshot | `risk`, `dependency`, `delay`, `source`, `updatedAt` | `task-02-reporting-and-risk-tracking.md` formal reporting output |

The first implementation may expose empty or neutral signal snapshots while Task 2 is still pending. Portfolio code must treat risk, dependency, and delay fields as read-only upstream inputs.

## Boundaries

- Portfolio aggregation may count work items and active Sprints for view structure.
- Portfolio aggregation must not define risk, dependency, delay, velocity, completion-rate, defect, or blocker-duration formulas.
- Portfolio pages may filter and drill into projects and milestones.
- Portfolio pages must not introduce cross-project batch governance actions.
- The API contract is read-only and does not require a new Prisma model in Task 1.

## Consequences

- The Portfolio page can ship before Task 2 without inventing conflicting reporting logic.
- Task 2 can later replace neutral signal snapshots with formal signals without changing the Portfolio field shape.
- Future weekly summary and export work can consume one stable Portfolio entry point instead of querying many screens directly.
