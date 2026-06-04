# P1 Sprint Flow Smoke Check

> Author: PopoY
> Created: 2026-06-04
> Scope: Phase 1 Task 03 Sprint And Execution

## Objective

验证 `Task 03 Sprint And Execution` 的最小主链路已经可运行：Sprint 创建、Planning、开始、Board 推进、Daily Update、Scope Change、结束、关闭、Retrospective。

## Automated Checks

按以下顺序执行：

1. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-state-machine.spec.ts`
2. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-lifecycle.spec.ts`
3. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-planning.spec.ts`
4. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-daily-update.spec.ts`
5. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-scope-change.spec.ts`
6. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/sprint-close-retrospective.spec.ts`
7. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- sprint`
8. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web typecheck`
9. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web build`
10. `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test ../../tests/e2e/sprints/full-sprint-flow.spec.ts`

## Manual Checks

1. 打开 `/sprints`，确认 Sprint Overview 页面能渲染。
2. 打开 `/sprints/[sprintId]`，确认 Board 三列可见且 Daily Update 表单可见。
3. 打开 `/sprints/[sprintId]/summary`，确认 Retrospective 创建表单可见。
4. 在 API 日志里确认 `GET /sprints/:id/board`、`POST /sprints/:id/board/move`、`POST /sprints/:id/daily-updates`、`POST /sprints/:id/retrospective` 已被注册。

## Expected Outcome

- Sprint 必须先完成 Planning 才能 `start`
- Board 至少支持 `todo / in-progress / done`
- Daily Update 必须按时间倒序可见
- Active Sprint 的 `scope in / scope out` 必须留下事件
- `Retrospective` 只能在 `ended` 后创建
- `close` 后不可再重新 `start`
