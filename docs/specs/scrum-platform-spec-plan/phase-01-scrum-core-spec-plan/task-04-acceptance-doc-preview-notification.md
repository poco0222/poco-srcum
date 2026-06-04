# Task 04 Acceptance Doc Preview Notification

> Author: PopoY
> Created: 2026-06-04
> Status: done
> Phase: P1
> Parent Spec: `phase-01-scrum-core-spec.md`
> Parent Plan: `phase-01-scrum-core-spec-plan.md`

## Objective

建立验收闭环、最小文档能力和关键通知能力，使 P1 在不越过阶段边界的前提下覆盖真实交付过程。

## Background

如果只有任务执行没有正式验收、交付说明和关键通知，系统就无法承接真实研发交付，也无法支撑 `Definition of Done`（完成定义）门禁。

## Scope

- 建立 Story 级正式验收判定、驳回与重新打开闭环
- 建立最小可用的 `Form + Markdown + Preview`（表单加 Markdown 加预览）文档能力
- 建立文档与 Scrum 工件的挂接关系
- 建立关键事件通知与最小操作日志
- 为 `Retrospective`（复盘）文档沉淀提供挂接和最小文档支撑，但不主承接复盘流程本身

## Out Of Scope

- 不扩展 P2 的文档版本协作、评论、评审流
- 不扩展复杂附件管理中心或独立文档中心
- 不引入复杂通知编排、订阅中心或跨项目消息聚合
- 不在本 task 内补齐完整复盘业务流程，该能力由 `task-03-sprint-and-execution.md` 主承接

## Inputs

- Sprint 与执行主链路
- 文档主格式已明确为 `Form + Markdown + Preview`
- P1 `spec` 中关于验收、重新打开、Markdown 预览、通知与操作日志的要求

## Dependencies

- `task-02-work-item-and-backlog.md`：提供 Story、Task、Bug 与验收标准的基础建模
- `task-03-sprint-and-execution.md`：提供 Sprint 执行主链路、状态推进和范围管理语义
- 已冻结的核心状态命名、完成定义和基础通知边界

## Deliverables

- 验收清单、验收结果、驳回与重新打开规则
- 最小 Markdown 文档与预览能力
- 文档与必要交付附件的挂接与基础预览能力
- 关键事件通知与最小操作日志

## Acceptance Criteria

- Story 完成前必须经过正式验收判定
- 验收失败后支持重新打开，并可追溯驳回原因、操作人和时间
- `Form + Markdown + Preview` 文档可稳定编辑、预览和保存
- 文档与必要交付附件可挂接到 Scrum 工件，并可完成基础预览
- 关键事件有通知与记录，且最小操作日志可追溯

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| Story 进入 Sprint 前必须具备 `acceptance criteria` | 本 task 负责承接进入完成态前的正式验收判定，但前置 `acceptance criteria` 录入依赖 `task-02-work-item-and-backlog.md` |
| 验收失败后支持重新打开并可追溯 | 本 task 直接覆盖驳回、重新打开、原因留痕和操作日志 |
| Markdown 编辑、预览、保存稳定 | 本 task 直接覆盖最小 `Form + Markdown + Preview` 文档能力 |
| 关键事件通知与基础操作日志可用 | 本 task 直接覆盖关键通知与最小操作日志 |
| 所有核心对象具备最小审计留痕 | 本 task 仅覆盖验收相关对象和关键事件留痕，完整审计能力不在 P1 本 task 范围内 |

## Risks

- 基础预览链路不稳定会直接影响文档采纳率
- 验收门禁写得不严导致完成定义失真
- 文档能力如果继续扩张到版本协作和评审流，会越过 P1 边界
- 复盘文档支撑边界如果定义不清，容易与 `task-03-sprint-and-execution.md` 的复盘主流程职责重叠

## Open Questions

- “必要交付附件”的最小边界是什么，是否仅限挂接和预览，不含复杂管理
- 关键事件通知的最小范围是否只覆盖验收通过、驳回、重新打开和文档更新

## Execution Assumptions

- `task-02` 已提供 `acceptance criteria` 数据入口。
- `task-03` 已提供 Sprint 执行、范围变更与复盘入口。
- 本 task 默认使用以下落点：
  - `packages/domain/src/acceptance/*`
  - `apps/api/src/modules/acceptance/*`
  - `apps/api/src/modules/documents/*`
  - `apps/api/src/modules/notifications/*`
  - `apps/web/src/app/(authenticated)/stories/[storyId]/acceptance/*`
  - `apps/web/src/features/documents/*`

## Execution Progress

| Step | Status | Progress | Notes |
| --- | --- | --- | --- |
| Step 1 | done | 1/8 | 已冻结 `AcceptanceStatus`、允许迁移表、Story 完成态验收门禁，并完成 domain/API 定向回归测试 |
| Step 2 | done | 2/8 | 已落 `StoryAcceptanceRecord`、`AcceptanceStatus` Prisma enum、migration 和 shared `approve / reject / reopen` DTO，并通过 Prisma / typecheck 验证 |
| Step 3 | done | 3/8 | 已交付独立 `AcceptanceModule`、`approve / reject / reopen / history` API，以及 `WorkItemsService.completeStory` 的 Story 完成态验收门禁 |
| Step 4 | done | 4/8 | 已交付独立 `DocumentsModule`、`Document` / `DocumentTargetType` 模型、shared document DTO，以及创建、更新、读取、按目标查询接口 |
| Step 5 | done | 5/8 | 已交付 `DocumentEditor`、`DocumentPreview` 和无新增依赖的 P1 Markdown 白名单渲染 / sanitization |
| Step 6 | done | 6/8 | 已交付 `DocumentLinksService`、`AttachmentsService`、附件元数据模型、文档链接模型和图片/PDF 预览白名单 |
| Step 7 | done | 7/8 | 已冻结验收和文档关键通知事件，并交付 in-app notification service、Prisma `Notification` 模型和前端最小通知列表 |
| Step 8 | done | 8/8 | 已交付 `MinimalAuditService`、Prisma `OperationAuditLog`、P1 acceptance smoke-check runbook，并完成 Task4 定向验证与根级 build |

### Latest Evidence

- `git remote get-url origin` confirmed `https://github.com/poco0222/poco-srcum.git`
- `git status --short --branch` showed current branch `main` with existing uncommitted Task2/Task3 changes, so Task4 proceeds with narrow scoped edits in the current workspace instead of creating a branch that would mix prior work
- `packages/domain/src/acceptance/acceptance.domain.spec.ts` was created first and failed with `SyntaxError: The requested module '../index' does not provide an export named 'AcceptanceStatus'`, proving the acceptance state machine export did not exist before Step 1 implementation
- `apps/api/test/story-acceptance-state-machine.spec.ts` was created first and failed with `Cannot find module '../src/modules/work-items/guards/story-done.guard'`, proving the Story completion acceptance guard did not exist before Step 1 implementation
- `packages/domain/src/acceptance/acceptance.enums.ts` and `packages/domain/src/acceptance/acceptance.machine.ts` created with the frozen `PENDING -> APPROVED / REJECTED -> REOPENED -> APPROVED / REJECTED` contract
- `apps/api/src/modules/work-items/guards/story-done.guard.ts` created with `STORY_ACCEPTANCE_NOT_APPROVED` enforcement for Story completion
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain test -- acceptance` passed with 10 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-acceptance-state-machine.spec.ts` passed with 2 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain typecheck` passed after adding acceptance exports
- `apps/api/test/story-acceptance-audit-fields.spec.ts` was created first and failed with `TypeError: Cannot read properties of undefined (reading 'parse')`, proving the shared acceptance DTO schemas did not exist before Step 2 implementation
- `packages/domain/src/acceptance/acceptance.types.ts` created with `StoryAcceptanceRecord` so approval, rejection, and reopen audit fields are represented at the domain boundary
- `packages/shared/src/acceptance/acceptance.schemas.ts` created with `ApproveStoryAcceptanceInputSchema`, `RejectStoryAcceptanceInputSchema`, and `ReopenStoryAcceptanceInputSchema`
- `apps/api/prisma/schema.prisma` updated with `AcceptanceStatus`, `StoryAcceptanceRecord`, and relations to `WorkItem` and `User`
- `apps/api/prisma/migrations/20260604183000_task04_acceptance_records/migration.sql` created for the Story acceptance record baseline table and indexes
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-acceptance-audit-fields.spec.ts` passed with 3 tests, 0 failures
- `DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with `The schema at prisma/schema.prisma is valid`
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/shared typecheck` passed after adding acceptance DTO exports
- `apps/api/test/story-acceptance.spec.ts` was created first and failed with `404 !== 200`, proving `/acceptance/stories/:storyId/*` routes did not exist before Step 3 implementation
- `apps/api/test/story-done-guard.spec.ts` was created first and failed with `TypeError: service.completeStory is not a function`, proving the explicit Story completion command did not exist before Step 3 implementation
- `apps/api/src/modules/acceptance/acceptance.repository.ts`, `acceptance.service.ts`, `acceptance.controller.ts`, and `acceptance.module.ts` created with the minimum in-memory formal acceptance command API
- `apps/api/src/app.module.ts` now registers `AcceptanceModule` alongside the existing auth, project, sprint, and work item modules
- `apps/api/src/modules/work-items/work-items.service.ts` now exposes `completeStory` and calls `StoryDoneGuard` before setting Story status to `DONE`
- `apps/api/src/modules/work-items/work-items.controller.ts` now exposes `POST /work-items/:workItemId/complete`
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-acceptance.spec.ts` passed with 3 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-done-guard.spec.ts` passed with 2 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api typecheck` passed after registering the acceptance module and completion command
- `apps/api/test/document-save.spec.ts` was created first and failed with `Cannot find module '../src/modules/documents/documents.service'`, proving the document service did not exist before Step 4 implementation
- `packages/domain/src/documents/document.enums.ts` and `packages/domain/src/documents/document.types.ts` created with `DocumentTargetType`, `DocumentStructuredFields`, and `DocumentRecord`
- `packages/shared/src/documents/document.schemas.ts` created with `CreateDocumentInputSchema` and `UpdateDocumentInputSchema`
- `apps/api/src/modules/documents/documents.repository.ts`, `documents.service.ts`, `documents.controller.ts`, and `documents.module.ts` created with the minimum Form plus Markdown document API
- `apps/api/src/app.module.ts` now registers `DocumentsModule`
- `apps/api/prisma/schema.prisma` updated with `DocumentTargetType` and `Document`, plus author/updater relations to `User`
- `apps/api/prisma/migrations/20260604184500_task04_documents/migration.sql` created for the minimum Form plus Markdown document model
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/document-save.spec.ts` passed with 3 tests, 0 failures
- `DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with `The schema at prisma/schema.prisma is valid`
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain typecheck`, `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/shared typecheck`, and `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api typecheck` passed after adding document contracts and module registration
- `apps/web/src/features/documents/__tests__/document-preview.spec.ts` was created first and failed with `Cannot find module '../lib/markdown-sanitize'`, proving the Markdown preview renderer did not exist before Step 5 implementation
- `apps/web/src/features/documents/lib/markdown-sanitize.ts` created with P1 Markdown whitelist rendering for headings, lists, blockquotes, code blocks, and safe links
- `apps/web/src/features/documents/components/document-preview.tsx` and `document-editor.tsx` created with sanitized preview wrapping the textarea editor
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- document-preview` first failed because the test expected a code block without the source semicolon; the expectation was corrected to preserve code content
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- document-preview` passed with 10 tests, 0 failures after the assertion correction
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web typecheck` passed after adding the document preview components
- `apps/api/test/document-attachment-link.spec.ts` was created first and failed with `Cannot find module '../src/modules/attachments/attachments.service'`, proving the attachment metadata service did not exist before Step 6 implementation
- `apps/web/src/features/documents/__tests__/attachment-preview.spec.ts` was created first and failed with `Cannot find module '../components/attachment-preview'`, proving the attachment preview whitelist did not exist before Step 6 implementation
- `packages/domain/src/documents/attachment.types.ts` created with `DocumentAttachmentRecord`, `DocumentLinkRecord`, and `AttachmentPreviewKind`
- `apps/api/src/modules/attachments/attachments.service.ts` and `attachments.module.ts` created with metadata-only document attachment persistence and preview classification
- `apps/api/src/modules/documents/document-links.service.ts` created with direct document target links and explicit cross-target links
- `apps/web/src/features/documents/components/attachment-preview.tsx` created with image/PDF inline preview and download fallback
- `apps/api/prisma/schema.prisma` updated with `DocumentAttachment` and `DocumentLink`
- `apps/api/prisma/migrations/20260604190000_task04_document_attachments/migration.sql` created for document attachment metadata and links
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/document-attachment-link.spec.ts` passed with 2 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- attachment-preview` passed with 12 tests, 0 failures
- `DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with `The schema at prisma/schema.prisma is valid`
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api typecheck`, `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web typecheck`, and `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain typecheck` passed after adding document links and attachment preview support
- `apps/api/test/notification-triggers.spec.ts` was created first and failed with `Cannot find module '../src/modules/notifications/notifications.service'`, proving the notification service did not exist before Step 7 implementation
- `apps/web/src/features/notifications/__tests__/notifications.spec.ts` was created first and failed with `Cannot find module '../notification-labels'`, proving the notification presentation helper did not exist before Step 7 implementation
- `packages/domain/src/notifications/notification.enums.ts` and `notification.types.ts` created with the P1 event set: `ACCEPTANCE_APPROVED`, `ACCEPTANCE_REJECTED`, `ACCEPTANCE_REOPENED`, and `DOCUMENT_UPDATED`
- `apps/api/src/modules/notifications/notifications.service.ts` and `notifications.module.ts` created with in-app only notification persistence
- `apps/api/src/modules/acceptance/acceptance.service.ts` now triggers notifications for approval, rejection, and reopen events
- `apps/api/src/modules/documents/documents.service.ts` now triggers notification for document updates
- `apps/web/src/features/notifications/notification-labels.ts` and `notifications-list.tsx` created for the minimum notification feed presentation
- `apps/api/prisma/schema.prisma` updated with `Notification`
- `apps/api/prisma/migrations/20260604191500_task04_notifications/migration.sql` created for the in-app notification table
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/notification-triggers.spec.ts` passed with 2 tests, 0 failures
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- notifications` passed with 13 tests, 0 failures
- `DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with `The schema at prisma/schema.prisma is valid`
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api typecheck`, `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web typecheck`, and `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain typecheck` passed after adding notification events and module registration
- `apps/api/test/minimal-audit-log.spec.ts` was created first and failed with `Cannot find module '../src/modules/audit/minimal-audit.service'`, proving the minimal audit service did not exist before Step 8 implementation
- `packages/domain/src/audit/audit-log.types.ts` created with `MinimalAuditLogRecord`
- `apps/api/src/modules/audit/minimal-audit.service.ts` and `audit.module.ts` created with the P1 minimum action trail
- `apps/api/src/modules/acceptance/acceptance.service.ts` now records audit entries for acceptance approval, rejection, and reopen events
- `apps/api/src/modules/documents/documents.service.ts` now records audit entries for document updates
- `apps/api/prisma/schema.prisma` updated with `OperationAuditLog`
- `apps/api/prisma/migrations/20260604193000_task04_minimal_audit/migration.sql` created for minimal operation audit logs
- `docs/runbooks/p1-acceptance-smoke-check.md` created with automated checks and manual acceptance/document/notification/audit smoke path
- `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/minimal-audit-log.spec.ts` passed with 1 test, 0 failures
- Task4 final API verification passed: `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-acceptance-state-machine.spec.ts test/story-acceptance-audit-fields.spec.ts test/story-acceptance.spec.ts test/story-done-guard.spec.ts test/document-save.spec.ts test/document-attachment-link.spec.ts test/notification-triggers.spec.ts test/minimal-audit-log.spec.ts` passed with 18 tests, 0 failures
- Task4 final web verification passed: `COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- document-preview attachment-preview notifications` passed with 13 tests, 0 failures
- Task4 final Prisma verification passed: `DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with `The schema at prisma/schema.prisma is valid`
- Task4 final root build passed: `COREPACK_HOME=/private/tmp/corepack corepack pnpm -r build`

## Steps

### Step 1: 冻结验收状态机并先写失败测试

- Goal: 用统一状态机固定 `pending / approved / rejected / reopened` 验收闭环
- Why: Story 完成态必须受正式验收门禁约束，不能只靠人工约定
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/acceptance/acceptance.enums.ts`
  - `<implementation-repo>/packages/domain/src/acceptance/acceptance.machine.ts`
  - `<implementation-repo>/apps/api/test/story-acceptance-state-machine.spec.ts`
- Preconditions:
  - `task-02` 已提供 Story 与 `acceptance criteria`
- Actions:
  1. 定义验收状态枚举和允许迁移表。
  2. 先写失败测试，覆盖“未验收通过不可完成 Story”“已通过后不可重复驳回”等场景。
  3. 在 `packages/domain` 实现最小状态机。
- Commands:
  - `pnpm --filter domain test -- acceptance`
  - `pnpm --filter api test -- story-acceptance-state-machine`
- Expected Output:
  - 验收状态机
  - 一组 Story 完成态门禁测试
- Acceptance:
  - 未通过正式验收的 Story 不能进入完成态
  - 非法验收状态切换必须失败
- Evidence:
  - 测试输出
  - 状态迁移表
- Notes:
  - 不引入多级审批流

### Step 2: 落库验收记录、驳回原因与重开字段

- Goal: 让验收结果、驳回原因和重开记录可以被结构化追溯
- Why: 如果只改 Story 状态而不存验收记录，Phase 要求的追溯无法成立
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/packages/shared/src/acceptance/*.ts`
  - `<implementation-repo>/apps/api/prisma/migrations/*`
  - `<implementation-repo>/apps/api/test/story-acceptance-audit-fields.spec.ts`
- Preconditions:
  - Step 1 已冻结验收状态机
- Actions:
  1. 在 Prisma 中增加 `StoryAcceptanceRecord` 与必要的驳回、重开字段。
  2. 定义 `approve / reject / reopen` DTO。
  3. 编写测试，覆盖 `reason / actorId / operatedAt` 三类追溯字段都能落库。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- story-acceptance-audit-fields`
- Expected Output:
  - 验收记录模型
  - 可复用的验收 DTO
- Acceptance:
  - 通过、驳回、重开三类结果都能追溯到原因、操作人和时间
- Evidence:
  - Prisma 校验输出
  - 测试输出
- Notes:
  - 这里只建最小记录，不做完整审计平台

### Step 3: 实现 Story 完成态 Guard 与验收 API

- Goal: 在服务层真正拦住不满足完成定义的 Story
- Why: 只有把验收门禁挂进 Story 状态推进，P1 的 `Definition of Done` 才可靠
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/acceptance/acceptance.service.ts`
  - `<implementation-repo>/apps/api/src/modules/acceptance/acceptance.controller.ts`
  - `<implementation-repo>/apps/api/src/modules/work-items/guards/story-done.guard.ts`
  - `<implementation-repo>/apps/api/test/story-done-guard.spec.ts`
- Preconditions:
  - Step 2 已有验收记录模型
- Actions:
  1. 实现验收通过、驳回、重开的 API。
  2. 在 Story 进入 `done` 前调用 `story-done.guard` 校验验收状态。
  3. 补测试，覆盖成功完成、未验收失败、被驳回后重开三条路径。
- Commands:
  - `pnpm --filter api test -- story-done-guard`
  - `pnpm --filter api test -- acceptance`
- Expected Output:
  - 验收服务与控制器
  - Story 完成态 Guard
- Acceptance:
  - 只有验收通过的 Story 可以完成
  - 驳回后的 Story 必须重开并重新进入执行
- Evidence:
  - 测试输出
  - 示例 API 响应
- Notes:
  - 这里不处理复杂审批通知编排

### Step 4: 建立最小 Form + Markdown + Preview 文档实体与保存接口

- Goal: 给验收说明、交付备注、复盘正文提供统一的最小文档承载体
- Why: 没有文档实体，P1 的验收说明和复盘挂接只能停留在文本占位
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/documents/document.entity.ts`
  - `<implementation-repo>/apps/api/src/modules/documents/documents.controller.ts`
  - `<implementation-repo>/packages/shared/src/documents/*.ts`
  - `<implementation-repo>/apps/api/test/document-save.spec.ts`
- Preconditions:
  - Step 3 已打通验收 API
- Actions:
  1. 定义最小文档实体：结构化表单字段、Markdown 正文、关联对象 ID。
  2. 先写 `document-save` 测试，覆盖创建、更新和重新读取。
  3. 实现保存与查询接口，供 Story 验收说明与 Retrospective 复用。
- Commands:
  - `pnpm --filter api test -- document-save`
  - `pnpm --filter api typecheck`
- Expected Output:
  - 文档存储 API
  - 最小文档实体
- Acceptance:
  - 文档可稳定保存并重新查询
  - 结构化字段与 Markdown 正文可同时返回
- Evidence:
  - 测试输出
  - API 响应样例
- Notes:
  - 版本历史和评论属于 P2

### Step 5: 实现 Markdown 预览组件与安全白名单

- Goal: 让 P1 文档具备稳定预览，而不是仅保存原始 Markdown
- Why: 预览不稳定会直接影响验收和复盘使用体验
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/features/documents/components/document-editor.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/components/document-preview.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/lib/markdown-sanitize.ts`
  - `<implementation-repo>/apps/web/src/features/documents/__tests__/document-preview.spec.tsx`
- Preconditions:
  - Step 4 已有文档保存接口
- Actions:
  1. 选定最小实现策略：`textarea + markdown renderer + sanitization`。
  2. 编写预览测试，覆盖标题、列表、代码块、引用和链接。
  3. 实现渲染与安全清洗，明确不支持复杂富文本扩展。
- Commands:
  - `pnpm --filter web test -- document-preview`
  - `pnpm --filter web build`
- Expected Output:
  - 文档编辑器与预览组件
  - Markdown 语法白名单测试
- Acceptance:
  - 常见 Markdown 语法可稳定预览
  - 恶意脚本内容不会原样注入页面
- Evidence:
  - 前端测试输出
  - 预览页面截图
- Notes:
  - P1 不引入富文本编辑器或版本协作

### Step 6: 建立文档与必要交付附件挂接能力

- Goal: 让 Story、Sprint、Retrospective 可以挂接文档和必要附件
- Why: 真实交付需要最小附件承载，但不能扩散成附件中心
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/documents/document-links.service.ts`
  - `<implementation-repo>/apps/api/src/modules/attachments/*`
  - `<implementation-repo>/apps/api/test/document-attachment-link.spec.ts`
  - `<implementation-repo>/apps/web/src/features/documents/components/attachment-preview.tsx`
- Preconditions:
  - Step 4 与 Step 5 已有文档对象和预览组件
- Actions:
  1. 定义附件最小范围：只支持元数据挂接与图片/PDF 预览白名单。
  2. 编写测试，覆盖文档挂接 Story、Sprint 和附件元数据查询。
  3. 实现挂接关系与基础预览组件。
- Commands:
  - `pnpm --filter api test -- document-attachment-link`
  - `pnpm --filter web test -- attachment-preview`
- Expected Output:
  - 文档与附件挂接关系
  - 基础附件预览组件
- Acceptance:
  - 文档可挂接到 Story 或 Sprint
  - 非白名单附件类型不会进入内嵌预览
- Evidence:
  - 测试输出
  - 预览样例
- Notes:
  - 不做版本化和复杂权限

### Step 7: 冻结关键通知事件并实现站内通知

- Goal: 为验收与文档关键事件建立最小站内通知机制
- Why: P1 只做最小通知，但必须明确谁会收到以及为什么收到
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/notifications/notification.enums.ts`
  - `<implementation-repo>/apps/api/src/modules/notifications/notifications.service.ts`
  - `<implementation-repo>/apps/web/src/features/notifications/*`
  - `<implementation-repo>/apps/api/test/notification-triggers.spec.ts`
- Preconditions:
  - Step 3 与 Step 6 已有验收和文档事件源
- Actions:
  1. 冻结 P1 关键事件：验收通过、驳回、重开、文档更新。
  2. 编写触发测试，明确接收者、事件类型和触发时机。
  3. 实现站内通知存储与最小列表展示。
- Commands:
  - `pnpm --filter api test -- notification-triggers`
  - `pnpm --filter web test -- notifications`
- Expected Output:
  - 通知事件枚举
  - 站内通知服务与前端入口
- Acceptance:
  - 每个关键事件都能回答“谁收到、为什么收到、何时触发”
  - P1 不依赖邮件或外部消息系统
- Evidence:
  - 测试输出
  - 通知样例数据
- Notes:
  - 订阅中心属于 P3

### Step 8: 建立通知日志与最小操作日志闭环

- Goal: 把通知记录和最小操作日志一起沉淀下来，满足 P1 追溯要求
- Why: 只有通知而没有日志，事后无法解释是谁触发了什么动作
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/audit/minimal-audit.service.ts`
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/apps/api/test/minimal-audit-log.spec.ts`
  - `<implementation-repo>/docs/runbooks/p1-acceptance-smoke-check.md`
- Preconditions:
  - Step 7 已有通知事件
- Actions:
  1. 定义最小日志字段：`actorId / objectType / objectId / action / payload / createdAt`。
  2. 编写测试，覆盖验收通过、驳回、重开和文档更新都能产生日志。
  3. 在 runbook 中记录 Story 验收、文档保存和通知出现的手工验证路径。
- Commands:
  - `pnpm --filter api test -- minimal-audit-log`
  - `pnpm -r build`
- Expected Output:
  - 最小操作日志模块
  - P1 验收与文档烟雾检查文档
- Acceptance:
  - 任一关键事件都同时具备通知记录与操作日志
  - 根级构建命令仍通过
- Evidence:
  - 测试输出
  - runbook 路径
- Notes:
  - 完整审计平台由 P4 主承接
