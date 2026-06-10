# Task 02 Review Comment And Versioning

> Author: PopoY
> Created: 2026-06-04
> Status: done
> Phase: P2
> Parent Spec: `phase-02-document-collaboration-spec.md`
> Parent Plan: `phase-02-document-collaboration-spec-plan.md`

## Objective

建立评论、提及、评审结论、版本历史能力，让文档协作过程可追溯。

## Step Status

| Step | Status | Progress | Summary |
| --- | --- | --- | --- |
| Step 1 | done | 1/7 | 已冻结 `document / field / markdown-block` 评论锚点、`@user:<id>` 提及语义与 ADR |
| Step 2 | done | 2/7 | 已编写评论、回复、无权限评论和提及通知失败测试 |
| Step 3 | done | 3/7 | 已实现评论模块、回复关系、站内提及通知和只读评论面板 |
| Step 4 | done | 4/7 | 已冻结 `draft / in-review / approved / rejected` 状态机并实现评审 API |
| Step 5 | done | 5/7 | 已实现完整版本快照、变更摘要 schema 与评审最新版本绑定 |
| Step 6 | done | 6/7 | 已实现评审页、版本历史页和非最新版本审批前端守卫 |
| Step 7 | done | 7/7 | 已完成评审与版本历史主路径 e2e、runbook、根级测试与构建回归 |

## Background

如果只有模板而没有评论、评审和版本回看，团队仍然会把评审意见分散在外部聊天工具、邮件或独立文档里，P2 就无法真正替代零散协作方式。

## Scope

- 建立评论、回复、提及的最小协作模型
- 建立评审状态与评审结论边界
- 建立版本历史与变更摘要能力
- 建立正式文档协作过程的最小追溯规则

## Out Of Scope

- 不负责定义正式文档类型、模板和 Markdown 正文边界，这部分由 `task-01-document-template-and-structure.md` 主承接
- 不负责定义跨对象关联链路、搜索和轻量仪表盘，这部分由 `task-03-linkage-search-and-dashboard.md` 主承接
- 不引入自由工作流引擎、复杂分支合并或实时协同编辑
- 不提前承担 P4 的完整审计与合规治理职责

## Inputs

- P2 `spec` 与 `phase plan`
- `task-01-document-template-and-structure.md` 提供的文档类型、模板和结构边界
- 已冻结的对象标识、成员身份和通知边界
- P1 试运行中暴露出的评审与版本回看痛点

## Dependencies

- `task-01-document-template-and-structure.md`：提供稳定的正式文档类型和结构字段
- P1 的基础通知与最小操作记录边界，为评论和评审事件提供承接基础
- 正式文档类型清单需要先冻结，才能明确哪些文档必须进入评审流程

## Deliverables

- 评论与提及模型
- 评审状态与评审结论
- 版本历史与变更摘要
- 文档协作追溯规则

## Acceptance Criteria

- 文档评审过程有记录、有结论、有版本可回看
- 评论与提及可支撑团队协作
- 正式文档可形成最小 `review`（评审）闭环，而不依赖多个外部工具

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 评论、版本历史、评审结论可追溯 | 本 task 主承接评论、评审结论和版本历史能力 |
| 文档协作不再依赖多个零散外部工具 | 本 task 主承接协作过程、评审状态和版本回看闭环 |
| 团队可基于模板稳定产出文档 | 本 task 只消费模板和文档类型，不主承接产出模板能力 |
| 基础搜索可覆盖核心对象与文档内容 | 本 task 只提供可被检索的评审状态和版本元数据，主承接在 `task-03-linkage-search-and-dashboard.md` |

## Risks

- 评审状态如果设计过重，容易把 P2 拖向复杂流程引擎
- 版本历史粒度如果过细，会放大实现和使用成本
- 文档类型与评审适用范围如果不清晰，容易与 `task-01-document-template-and-structure.md` 产生边界冲突

## Open Questions

- 是否需要区分 `draft / in review / approved / rejected`（草稿、评审中、已通过、已驳回）这类最小状态集
- 版本历史在 P2 是否只要求完整快照与变更摘要，不要求复杂差异比对
- 提及通知的最小范围是否只覆盖评论、评审结论和版本更新

## Execution Assumptions

- `task-01-document-template-and-structure.md` 已提供：
  - 正式文档类型与模板
  - 正式文档编辑 payload
  - 文档关系类型与挂接服务
- 本 task 默认使用以下落点：
  - `packages/domain/src/reviews/*`
  - `apps/api/src/modules/comments/*`
  - `apps/api/src/modules/reviews/*`
  - `apps/api/src/modules/document-versions/*`
  - `apps/web/src/features/documents/review/*`

## Steps

### Step 1: 冻结评论锚点模型与提及语义

- Goal: 先确定评论挂在哪一层，避免后续版本和通知实现漂移
- Why: 评论如果既可以挂全文又可以挂区块，但没有统一锚点模型，会导致 UI 和 API 无法兼容
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/reviews/comment-anchor.types.ts`
  - `<implementation-repo>/packages/domain/src/reviews/comment.enums.ts`
  - `<implementation-repo>/docs/adr/adr-006-comment-anchor.md`
- Preconditions:
  - 正式文档结构已冻结
- Actions:
  1. 冻结评论锚点类型：文档级、字段级、Markdown 区块级。
  2. 定义提及 token 语义和解析规则。
  3. 在 ADR 中明确 P2 不支持自由文本级精准选区评论。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- comment-anchor`
- Expected Output:
  - 评论锚点类型定义
  - 提及语义 ADR
- Acceptance:
  - 任一评论都能明确指向一个稳定锚点
  - 提及语义可被通知模块复用
- Evidence:
  - `docs/adr/adr-006-comment-anchor.md`
  - `packages/domain/src/reviews/comment.enums.ts`
  - `packages/domain/src/reviews/comment-anchor.types.ts`
  - `packages/domain/src/reviews/comment-anchor.domain.spec.ts`
  - `corepack pnpm --filter @poco-scrum/domain test -- comment-anchor`：21 tests, 21 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
- Notes:
  - 不在此步实现评论 API

### Step 2: 先写评论、回复、提及的失败测试

- Goal: 用测试固定评论结构、权限和提及通知触发点
- Why: 评论模型是后续评审流和版本历史的基础
- Target Files/Paths:
  - `<implementation-repo>/apps/api/test/document-comments.spec.ts`
  - `<implementation-repo>/apps/api/test/document-mentions.spec.ts`
- Preconditions:
  - Step 1 已冻结锚点与提及语义
- Actions:
  1. 编写评论测试，覆盖文档级评论、回复评论、无权限用户评论失败。
  2. 编写提及测试，覆盖 `@user` 解析与通知触发。
  3. 约定评论最小字段：`authorId / documentId / anchorType / anchorRef / body / mentionedUserIds`。
- Commands:
  - `pnpm --filter api test -- document-comments`
  - `pnpm --filter api test -- document-mentions`
- Expected Output:
  - 两组先失败的评论与提及测试
- Acceptance:
  - 至少存在一条未授权负例
  - 提及必须有明确的通知触发断言
- Evidence:
  - `apps/api/test/document-comments.spec.ts`
  - `apps/api/test/document-mentions.spec.ts`
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-comments.spec.ts`：fails with `Cannot find module '../src/modules/comments/comments.service'`
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-mentions.spec.ts`：fails with `Cannot find module '../src/modules/comments/comments.service'`
  - 字段清单
- Notes:
  - 不先实现评审状态机

### Step 3: 实现评论模块与站内提及通知

- Goal: 打通评论、回复、提及的基础协作链路
- Why: P2 需要先把讨论沉淀进系统，后续评审结论才有上下文
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/comments/*`
  - `<implementation-repo>/apps/web/src/features/documents/review/comments/*`
  - `<implementation-repo>/apps/api/test/document-comments.spec.ts`
- Preconditions:
  - Step 2 的失败测试已存在
- Actions:
  1. 实现评论存储、回复关系和提及通知。
  2. 在文档详情页增加评论面板，展示锚点、正文、回复链。
  3. 让 Step 2 的测试转为通过，并补一个前端展示测试。
- Commands:
  - `pnpm --filter api test -- document-comments`
  - `pnpm --filter web test -- comments`
- Expected Output:
  - 评论模块
  - 前端评论面板
- Acceptance:
  - 评论与回复可追溯
  - 提及用户能收到站内通知
- Evidence:
  - `packages/domain/src/reviews/comment.types.ts`
  - `packages/shared/src/reviews/comment.schemas.ts`
  - `apps/api/src/modules/comments/comments.service.ts`
  - `apps/api/src/modules/comments/comments.controller.ts`
  - `apps/api/src/modules/comments/comments.module.ts`
  - `apps/web/src/features/documents/review/comments/comment-panel.tsx`
  - `apps/web/src/features/documents/review/comments/comment-panel.spec.ts`
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-comments.spec.ts`：3 tests, 3 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-mentions.spec.ts`：1 test, 1 pass
  - `corepack pnpm --filter @poco-scrum/web test -- comment-panel`：18 tests, 18 pass
  - `corepack pnpm --filter @poco-scrum/web test -- notifications`：18 tests, 18 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/shared typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
- Notes:
  - 不支持实时协作

### Step 4: 冻结最小 Review State Machine 并实现评审 API

- Goal: 把文档评审状态收敛为最小闭环
- Why: 没有正式 `review state`（评审状态），评论只能停留在讨论层
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/reviews/review.enums.ts`
  - `<implementation-repo>/apps/api/src/modules/reviews/*`
  - `<implementation-repo>/apps/api/test/document-review-flow.spec.ts`
- Preconditions:
  - Step 3 已有评论能力
- Actions:
  1. 冻结最小状态：`draft / in-review / approved / rejected`。
  2. 编写测试，覆盖提交评审、给出结论、回退到草稿、非最新版本不可审批。
  3. 实现评审状态 API 和结论记录。
- Commands:
  - `pnpm --filter api test -- document-review-flow`
  - `pnpm --filter domain test -- review`
- Expected Output:
  - 评审状态机
  - 评审 API
- Acceptance:
  - 文档可进入评审并形成明确结论
  - 非法状态迁移必须失败
- Evidence:
  - `packages/domain/src/reviews/review.enums.ts`
  - `packages/domain/src/reviews/review.machine.ts`
  - `packages/domain/src/reviews/review.types.ts`
  - `packages/domain/src/reviews/review.domain.spec.ts`
  - `packages/shared/src/reviews/review.schemas.ts`
  - `apps/api/src/modules/reviews/reviews.service.ts`
  - `apps/api/src/modules/reviews/reviews.controller.ts`
  - `apps/api/src/modules/reviews/reviews.module.ts`
  - `corepack pnpm --filter @poco-scrum/domain test -- review`：25 tests, 25 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-review-flow.spec.ts`：2 tests, 2 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/shared typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- Notes:
  - 不实现自由工作流引擎

### Step 5: 实现版本快照策略与变更摘要

- Goal: 让正式文档的保存和评审都能回看版本历史
- Why: 没有版本快照，评审结论无法绑定到具体内容版本
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/document-versions/*`
  - `<implementation-repo>/apps/api/test/document-versioning.spec.ts`
  - `<implementation-repo>/packages/shared/src/documents/version-summary.schema.ts`
- Preconditions:
  - Step 4 已有评审状态
- Actions:
  1. 冻结策略：每次正式保存生成完整快照，并允许填写简短变更摘要。
  2. 编写版本测试，覆盖连续保存生成多个版本、读取历史版本、评审绑定最新版本。
  3. 实现版本存储与变更摘要字段。
- Commands:
  - `pnpm --filter api test -- document-versioning`
- Expected Output:
  - 文档版本快照模块
  - 变更摘要 schema
- Acceptance:
  - 每次保存都能生成可回看的版本记录
  - 评审结论能关联到具体版本
- Evidence:
  - `packages/domain/src/documents/document-version.types.ts`
  - `packages/shared/src/documents/version-summary.schema.ts`
  - `apps/api/src/modules/document-versions/document-versions.service.ts`
  - `apps/api/src/modules/document-versions/document-versions.controller.ts`
  - `apps/api/src/modules/document-versions/document-versions.module.ts`
  - `apps/api/test/document-versioning.spec.ts`
  - `apps/api/src/modules/document-templates/document-templates.repository.ts`：补充本地 Prisma 表缺失时的 seed fallback，避免模板 API 回归为 500
  - `apps/api/test/document-template-prisma.spec.ts`：补充 Prisma 表缺失 fallback 回归测试
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-versioning.spec.ts`：2 tests, 2 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-save.spec.ts`：3 tests, 3 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-editor-payload.spec.ts`：3 tests, 3 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-review-flow.spec.ts`：2 tests, 2 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-template-prisma.spec.ts`：3 tests, 3 pass
  - `corepack pnpm --filter @poco-scrum/shared test -- document-editor`：9 tests, 9 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/shared typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- Notes:
  - P2 不要求复杂 diff viewer

### Step 6: 实现评审页与版本历史页

- Goal: 让评论、评审和版本历史在前端形成完整协作入口
- Why: 后端能力不暴露到 UI，团队仍会退回外部工具
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/documents/[documentId]/review/page.tsx`
  - `<implementation-repo>/apps/web/src/app/(authenticated)/documents/[documentId]/versions/page.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/review/*`
- Preconditions:
  - Step 3、4、5 已提供评论、评审、版本 API
- Actions:
  1. 实现评审页，展示评论、状态、结论和提交评审入口。
  2. 实现版本历史页，展示版本号、摘要、时间和操作人。
  3. 在前端阻止对非最新版本执行评审批准动作。
- Commands:
  - `pnpm --filter web test -- document-review`
  - `pnpm --filter web test -- document-versions`
  - `pnpm --filter web build`
- Expected Output:
  - 评审页
  - 版本历史页
- Acceptance:
  - 用户能在系统内完成最小评审闭环
  - 历史版本可查看且不可误判为最新版本
- Evidence:
  - `apps/web/src/features/documents/review/review-panel.tsx`
  - `apps/web/src/features/documents/review/review-panel.spec.ts`
  - `apps/web/src/features/documents/versions/version-history.tsx`
  - `apps/web/src/features/documents/versions/version-history.spec.ts`
  - `apps/web/src/app/(authenticated)/documents/[documentId]/review/page.tsx`
  - `apps/web/src/app/(authenticated)/documents/[documentId]/versions/page.tsx`
  - `apps/web/src/features/documents/api/documents-client.ts`
  - `corepack pnpm --filter @poco-scrum/web test -- document-review`：20 tests, 20 pass
  - `corepack pnpm --filter @poco-scrum/web test -- document-versions`：20 tests, 20 pass
  - `corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/web build`：exit 0，`/documents/[documentId]/review` 与 `/documents/[documentId]/versions` 构建成功
- Notes:
  - 不实现实时协同编辑

### Step 7: 执行评审与版本历史主路径验证

- Goal: 用端到端流程证明 P2 的协作闭环成立
- Why: 只有把模板、评论、评审、版本串起来，P2 才算真正替代外部零散工具
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/documents/document-review-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p2-review-versioning-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 编写 e2e：创建文档 -> 发评论 -> 提及 -> 提交评审 -> 驳回/通过 -> 查看历史版本。
  2. 记录一份烟雾检查文档，说明最小评审流程。
  3. 回归检查根级构建与测试命令。
- Commands:
  - `pnpm --filter e2e test -- document-review-flow`
  - `pnpm -r test`
- Expected Output:
  - 文档评审主路径 e2e
  - 评审烟雾检查 runbook
- Acceptance:
  - 评论、评审、版本历史能在一个流程中稳定协作
  - 根级测试通过
- Evidence:
  - `tests/e2e/documents/document-review-flow.spec.ts`
  - `docs/runbooks/p2-review-versioning-smoke-check.md`
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-review-flow.spec.ts`：1 test, 1 pass
  - `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-comments.spec.ts test/document-mentions.spec.ts test/document-review-flow.spec.ts test/document-versioning.spec.ts ../../tests/e2e/documents/document-review-flow.spec.ts`：9 tests, 9 pass
  - `corepack pnpm --filter @poco-scrum/domain test -- comment-anchor review`：25 tests, 25 pass
  - `corepack pnpm --filter @poco-scrum/web test -- comment-panel document-review document-versions notifications`：20 tests, 20 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck && corepack pnpm --filter @poco-scrum/shared typecheck && corepack pnpm --filter @poco-scrum/api typecheck && corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
  - `corepack pnpm -r --if-present test`：131 tests, 131 pass
  - `corepack pnpm -r --if-present build`：exit 0，包含 `/documents/[documentId]/review` 与 `/documents/[documentId]/versions`
  - `corepack pnpm --filter @poco-scrum/api prisma:validate`：exit 0
  - `git diff --check`：仅 CRLF 提示，无 whitespace error
- Notes:
  - 搜索与仪表盘在下一 task 承接
