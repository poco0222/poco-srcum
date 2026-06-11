# P3 Portfolio Smoke Check

> Author: PopoY
> Created: 2026-06-11
> Status: Draft

## Objective

Verify that the Phase 3 Task 1 Portfolio view can replace a manual spreadsheet summary for the minimum cross-project roadmap flow.

## Common Preconditions

- API and web services can start with the current monorepo dependencies.
- Use Node `v24.16.0` from `D:\Dev Tools\nodejs-24.16.0` when the shell default is older than Node 20.
- Risk, dependency, and delay signals are read-only placeholders until `task-02-reporting-and-risk-tracking.md` provides formal signal output.

## API Main Path

1. Create a Sprint with `POST /sprints`.
2. Create a Story with `POST /work-items`.
3. Commit the Story to the Sprint with `POST /work-items/:workItemId/add-to-sprint`.
4. Open the Portfolio overview with `GET /portfolio?projectId=<projectId>&milestoneFrom=<date>&milestoneTo=<date>`.
5. Confirm the response includes:
   - One project summary.
   - One roadmap milestone sourced from the Sprint.
   - `signals.source = task-02-reporting-and-risk-tracking.md`.
6. Open project drilldown with `GET /portfolio/projects/<projectId>`.
7. Confirm drilldown includes the same Story and Sprint-backed milestone.

## Web Main Path

1. Open `/portfolio`.
2. Use the Portfolio, Project, Project status, Milestone from, and Milestone to filters.
3. Confirm the URL keeps filter values in query parameters.
4. Confirm project cards show work item counts, active Sprint count, and read-only signal badges.
5. Confirm the roadmap timeline shows Sprint-backed milestones without drag scheduling controls.

## Verification Commands

```powershell
$env:PATH = 'D:\Dev Tools\nodejs-24.16.0;' + $env:PATH
corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/portfolio/portfolio-roadmap-flow.spec.ts
corepack pnpm --filter @poco-scrum/api test
corepack pnpm --filter @poco-scrum/web test
corepack pnpm -r --if-present build
```

## Boundaries

- This smoke check does not validate Task 2 reporting formulas.
- This smoke check does not validate weekly summaries, subscriptions, or exports.
- This smoke check does not require a new Prisma model for Portfolio state.
