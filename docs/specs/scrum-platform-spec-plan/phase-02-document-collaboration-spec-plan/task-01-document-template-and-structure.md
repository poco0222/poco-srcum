# Task 01 Document Template And Structure

> Author: PopoY
> Created: 2026-06-04
> Status: done
> Phase: P2
> Parent Spec: `phase-02-document-collaboration-spec.md`
> Parent Plan: `phase-02-document-collaboration-spec-plan.md`

## Objective

建立文档类型、模板、结构字段、Markdown 增强与挂接规则，让方案、验收、复盘等文档形成统一产出方式。

## Step Status

| Step | Status | Progress | Summary |
| --- | --- | --- | --- |
| Step 1 | done | 1/7 | 已冻结四类正式文档类型、字段矩阵与 ADR |
| Step 2 | done | 2/7 | 已定义 `DocumentTemplate` Schema、默认模板 Seed 与模板模块骨架 |
| Step 3 | done | 3/7 | 已实现正式文档编辑 payload、模板绑定创建和字段级校验 |
| Step 4 | done | 4/7 | 已实现 Preview 白名单、Markdown fixture 与渲染回归测试 |
| Step 5 | done | 5/7 | 已实现正式文档创建页、模板选择入口、前端校验和模板 API |
| Step 6 | done | 6/7 | 已冻结正式文档关系类型并实现 Scrum 工件挂接服务 |
| Step 7 | done | 7/7 | 已补齐 Prisma 模板运行时接入、Web 主路径 smoke evidence 与 API 回读闭环 |

## Background

P1 只提供了最小文档挂接与预览能力。P2 需要把“可附带记录”推进为“可稳定产出正式交付文档”，否则后续评审、版本和搜索都没有稳定载体。

## Scope

- 建立正式文档类型模型和模板体系
- 定义表单字段、Markdown 正文和预览表现的边界
- 明确文档与 Scrum 工件、附件、链接的挂接规范
- 补齐 Markdown 正文增强与预览稳定性要求

## Out Of Scope

- 不承接评论、评审结论、提及和版本历史能力，这部分由 `task-02-review-comment-and-versioning.md` 主承接
- 不承接跨对象搜索、关联链路和轻量仪表盘能力，这部分由 `task-03-linkage-search-and-dashboard.md` 主承接
- 不引入在线 Office 协同编辑、复杂富文本引擎或重型排版系统
- 不把附件能力扩展成独立资源库或复杂管理中心

## Inputs

- P2 `spec` 与 `phase plan`
- P1 的最小文档与预览能力
- P1 试运行后的真实使用反馈
- 已冻结的核心对象标识和引用规则

## Dependencies

- `phase-01-scrum-core-spec-plan/task-04-acceptance-doc-preview-notification.md`：提供 P1 的 `Form + Markdown + Preview` 基线和基础挂接能力
- 已冻结的核心实体编号、引用规则和完成定义命名
- `task-02-review-comment-and-versioning.md` 与 `task-03-linkage-search-and-dashboard.md` 都依赖本 task 提供稳定的文档类型与结构边界

## Deliverables

- 文档类型模型
- 模板体系
- 文档正文与结构化字段边界
- Markdown 增强与预览稳定性约束
- 文档与 Scrum 工件、附件、链接的挂接规则

## Acceptance Criteria

- 团队可按模板稳定创建需求、方案、验收、复盘文档
- Markdown 正文在核心文档类型上可稳定编辑、预览和保存
- 文档类型、结构字段以及附件、链接挂接关系清晰一致

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 团队可基于模板稳定产出文档 | 本 task 主承接文档类型、模板、结构字段和 Markdown 基线 |
| 系统内可完整沉淀需求说明、技术方案、验收说明、复盘纪要 | 本 task 主承接正式文档类型、模板和挂接规范 |
| 需求、方案、执行、验收可通过系统对象串联 | 本 task 只提供被串联的文档对象和挂接规范，主承接在 `task-03-linkage-search-and-dashboard.md` |
| 基础搜索可覆盖核心对象与文档内容 | 本 task 只提供可被检索的文档结构与正文边界，主承接在 `task-03-linkage-search-and-dashboard.md` |

## Risks

- 正式文档类型清单过多会导致 P2 范围膨胀
- Markdown 增强如果做得过重，容易偏离 P2 的最小交付目标
- 附件与链接边界如果不清晰，容易与 `task-03-linkage-search-and-dashboard.md` 的链路和搜索职责重叠

## Open Questions

- 正式文档类型是否先固定为需求说明、技术方案、验收说明、复盘纪要四类
- `preview stability`（预览稳定性）的最小边界是否只覆盖常见 Markdown 语法和结构化字段区块
- 附件与链接在 P2 是否只要求挂接和引用，不要求高级权限和版本管理

## Execution Assumptions

- `task-04-acceptance-doc-preview-notification.md` 已提供最小 `Form + Markdown + Preview` 基线。
- 本 task 默认把文档能力拆到：
  - `packages/domain/src/documents/*`
  - `packages/shared/src/documents/*`
  - `apps/api/src/modules/document-templates/*`
  - `apps/api/src/modules/documents/*`
  - `apps/web/src/app/(authenticated)/documents/*`
  - `apps/web/src/features/documents/*`

## Steps

### Step 1: 冻结正式文档类型与字段矩阵

- Goal: 先把 P2 支持的正式文档类型和各自结构化字段一次性定死
- Why: 没有字段矩阵，模板、编辑器和搜索都会反复返工
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/documents/document-type.enums.ts`
  - `<implementation-repo>/packages/domain/src/documents/document-type.matrix.ts`
  - `<implementation-repo>/docs/adr/adr-005-document-types.md`
- Preconditions:
  - P1 最小文档实体已可用
- Actions:
  1. 冻结首批类型：需求说明、技术方案、验收说明、复盘纪要。
  2. 为每种类型列出结构化字段、Markdown 区块和必填规则。
  3. 在 `packages/domain` 导出 `DocumentType` 与字段矩阵。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- documents`
- Expected Output:
  - 文档类型枚举
  - 各类型字段矩阵 ADR
- Acceptance:
  - 每种文档类型都有明确字段清单
  - 后续模板与 UI 都可复用同一矩阵
- Evidence:
  - `docs/adr/adr-005-document-types.md`
  - `packages/domain/src/documents/document-type.enums.ts`
  - `packages/domain/src/documents/document-type.matrix.ts`
  - `corepack pnpm --filter @poco-scrum/domain test -- document-type`：15 tests, 15 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
- Notes:
  - 不在此步实现评论或版本历史
  - 本地验证临时使用 `D:\Dev Tools\nodejs-24.16.0` 满足项目 `Node.js >=20` 要求

### Step 2: 定义模板 Schema 与默认模板 Seed

- Goal: 让每种正式文档在创建时都有稳定模板，而不是空白正文
- Why: P2 的核心价值之一就是“基于模板稳定产出”
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/apps/api/src/modules/document-templates/*`
  - `<implementation-repo>/apps/api/prisma/seeds/document-templates.seed.ts`
  - `<implementation-repo>/apps/api/test/document-template-seed.spec.ts`
- Preconditions:
  - Step 1 已冻结文档类型与字段矩阵
- Actions:
  1. 在数据库中增加 `DocumentTemplate` 模型。
  2. 为四类文档写默认模板 seed，包含标题结构、默认章节和字段占位。
  3. 编写模板 seed 测试，确保每种文档类型都能生成默认模板。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- document-template-seed`
- Expected Output:
  - 文档模板模型
  - 默认模板 seed
- Acceptance:
  - 四类文档都能生成默认模板
  - 模板数据结构与字段矩阵一致
- Evidence:
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/20260604225000_phase2_document_templates/migration.sql`
  - `apps/api/prisma/seeds/document-templates.seed.ts`
  - `apps/api/src/modules/document-templates/document-templates.module.ts`
  - `apps/api/src/modules/document-templates/document-templates.repository.ts`
  - `apps/api/src/modules/document-templates/document-templates.service.ts`
  - `apps/api/test/document-template-prisma.spec.ts`
  - `corepack pnpm --filter @poco-scrum/api test -- document-template-seed`：55 tests, 55 pass
  - `DATABASE_URL=postgresql://poco:poco@localhost:5432/poco_scrum?schema=public corepack pnpm --filter @poco-scrum/api prisma:validate`：schema valid
- Notes:
  - 不在这里实现模板审批
  - `prisma validate` 本地需要临时 `DATABASE_URL`，本步只做 schema 校验，不连接数据库

### Step 3: 实现 Form + Markdown 编辑模型与保存接口升级

- Goal: 让结构化字段和 Markdown 正文共同成为正式文档的编辑入口
- Why: P1 的最小文档实体需要升级为 P2 的正式文档承载体
- Target Files/Paths:
  - `<implementation-repo>/packages/shared/src/documents/document-editor.schema.ts`
  - `<implementation-repo>/apps/api/src/modules/documents/documents.service.ts`
  - `<implementation-repo>/apps/api/test/document-editor-payload.spec.ts`
- Preconditions:
  - Step 2 已有模板数据
- Actions:
  1. 定义正式文档编辑 payload，包含结构化字段、Markdown 正文、模板 ID。
  2. 编写测试，覆盖根据模板创建文档、编辑字段、更新正文。
  3. 升级文档保存接口，支持模板类型和字段级校验。
- Commands:
  - `pnpm --filter api test -- document-editor-payload`
  - `pnpm --filter api typecheck`
- Expected Output:
  - 正式文档编辑 DTO
  - 升级后的保存接口
- Acceptance:
  - 文档创建时可以绑定模板
  - 缺少必填结构化字段时保存失败
- Evidence:
  - `packages/shared/src/documents/document-editor.schema.ts`
  - `packages/shared/src/documents/document-editor.schema.spec.ts`
  - `apps/api/test/document-editor-payload.spec.ts`
  - `apps/api/src/modules/documents/documents.service.ts`
  - `corepack pnpm --filter @poco-scrum/shared test -- document-editor`：9 tests, 9 pass
  - `corepack pnpm --filter @poco-scrum/api test -- document-editor-payload`：57 tests, 57 pass
  - `corepack pnpm --filter @poco-scrum/shared typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- Notes:
  - 评论、评审状态仍属于下一 task
  - 正式文档保存先复用 P1 in-memory repository（内存仓储），Prisma 持久化接入不在本 Step 扩张

### Step 4: 实现 Preview 白名单与渲染回归测试

- Goal: 量化 `preview stability`，让渲染能力有明确边界
- Why: “预览稳定”必须落成可验证语法清单和快照测试
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/features/documents/lib/preview-whitelist.ts`
  - `<implementation-repo>/apps/web/src/features/documents/__tests__/document-preview-snapshot.spec.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/fixtures/*.md`
- Preconditions:
  - Step 3 已有正式文档编辑 payload
- Actions:
  1. 冻结支持语法：标题、列表、引用、表格、代码块、任务列表、图片、内部链接。
  2. 为每种语法准备 fixture，编写 preview snapshot 测试。
  3. 在渲染器中对白名单外内容做降级或清洗。
- Commands:
  - `pnpm --filter web test -- document-preview-snapshot`
  - `pnpm --filter web build`
- Expected Output:
  - 预览白名单配置
  - Markdown fixture 与 snapshot 测试
- Acceptance:
  - 白名单内语法渲染稳定
  - 白名单外内容不会破坏页面结构
- Evidence:
  - `apps/web/src/features/documents/lib/markdown-sanitize.ts`
  - `apps/web/src/features/documents/fixtures/preview-whitelist.md`
  - `apps/web/src/features/documents/__tests__/document-preview-snapshot.spec.ts`
  - `corepack pnpm --filter @poco-scrum/web test -- document-preview`：15 tests, 15 pass
  - `corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
- Notes:
  - 不引入复杂富文本插件
  - 白名单外 HTML 继续转义显示，避免破坏页面结构

### Step 5: 实现正式文档创建页与模板选择入口

- Goal: 让用户能在前端基于模板创建正式文档
- Why: 只有 API 和 seed 还不够，P2 需要真实可用的产出入口
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/documents/new/page.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/components/template-selector.tsx`
  - `<implementation-repo>/apps/web/src/features/documents/components/document-form.tsx`
- Preconditions:
  - Step 2 与 Step 3 已完成模板和保存接口
- Actions:
  1. 实现文档新建页面，支持选择文档类型和模板。
  2. 根据模板渲染结构化表单与 Markdown 编辑区。
  3. 在前端校验必填字段，并与服务端错误语义对齐。
- Commands:
  - `pnpm --filter web test -- template-selector`
  - `pnpm --filter web build`
- Expected Output:
  - 正式文档创建页
  - 模板选择组件
- Acceptance:
  - 用户可选择模板并创建四类正式文档
  - 表单字段与模板定义一致
- Evidence:
  - `apps/api/src/modules/document-templates/document-templates.controller.ts`
  - `apps/api/test/document-template-api.spec.ts`
  - `apps/web/src/app/(authenticated)/documents/new/page.tsx`
  - `apps/web/src/app/(authenticated)/documents/new/actions.ts`
  - `apps/web/src/features/documents/api/documents-client.ts`
  - `apps/web/src/features/documents/components/document-form.tsx`
  - `apps/web/src/features/documents/components/template-selector.tsx`
  - `apps/web/src/features/documents/lib/document-form.utils.ts`
  - `corepack pnpm --filter @poco-scrum/web test -- document-form`：16 tests, 16 pass
  - `corepack pnpm --filter @poco-scrum/web test -- template-selector`：17 tests, 17 pass
  - `corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/web build`：exit 0，`/documents/new` 动态路由构建成功
  - `corepack pnpm --filter @poco-scrum/api test -- document-template-api`：59 tests, 59 pass
  - `corepack pnpm --filter @poco-scrum/api test -- document-editor-payload`：59 tests, 59 pass
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- Notes:
  - 不在此步实现文档搜索
  - 正式文档创建页先使用默认 demo 用户和 `story-1` 目标，保持与现有 P1 shell 的环境约定一致

### Step 6: 建立文档与 Scrum 工件、附件、链接挂接规范

- Goal: 让正式文档具备稳定挂接语义，供后续评审和搜索消费
- Why: 如果挂接关系不先收敛，后续 `task-02` 和 `task-03` 都会漂
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/documents/document-relations.service.ts`
  - `<implementation-repo>/packages/domain/src/documents/document-relation.enums.ts`
  - `<implementation-repo>/apps/api/test/document-relation.spec.ts`
- Preconditions:
  - Step 5 已提供正式文档创建入口
- Actions:
  1. 冻结关系类型，如 `references-story`、`supports-sprint`、`records-acceptance`、`records-retrospective`。
  2. 编写测试，覆盖文档挂接到 Story、Sprint、Acceptance、Retrospective。
  3. 明确附件与链接只作为被引用对象，不在本 task 承担版本治理。
- Commands:
  - `pnpm --filter api test -- document-relation`
- Expected Output:
  - 文档关系类型枚举
  - 文档挂接服务
- Acceptance:
  - 正式文档能稳定挂接到核心 Scrum 工件
  - 关系类型可被下游搜索和仪表盘复用
- Evidence:
  - `packages/domain/src/documents/document-relation.enums.ts`
  - `packages/domain/src/documents/document-relation.types.ts`
  - `apps/api/src/modules/documents/document-relations.service.ts`
  - `apps/api/test/document-relation.spec.ts`
  - `corepack pnpm --filter @poco-scrum/api test -- document-relation`：62 tests, 62 pass
  - `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
  - `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- Notes:
  - 不在这里实现关系搜索
  - 附件与普通链接保持 P1 `DocumentLinksService` 语义；本 Step 只新增正式文档关系类型和显式挂接服务

### Step 7: 执行文档模板主路径验证

- Goal: 用一条端到端流程证明“基于模板产出文档”真的可用
- Why: P2 的 phase 验收需要真实文档沉淀，不只是模块存在
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/documents/document-template-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p2-document-template-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 编写 e2e：选择模板 -> 填结构化字段 -> 编辑 Markdown -> 保存 -> 重新打开。
  2. 记录一份烟雾检查文档，说明四类正式文档的手工创建路径。
  3. 确认根级构建和测试命令不被文档模块破坏。
- Commands:
  - `pnpm --filter e2e test -- document-template-flow`
  - `pnpm -r build`
- Expected Output:
  - 文档模板主路径 e2e
  - 模板烟雾检查 runbook
- Acceptance:
  - 文档可成功创建、保存并回读
  - 根级构建仍通过
- Evidence:
  - `tests/e2e/documents/document-template-flow.spec.ts`
  - `docs/runbooks/p2-document-template-smoke-check.md`
  - `apps/api/package.json`：已把 `../../tests/e2e/documents/*.spec.ts` 纳入 API test glob
  - `corepack pnpm --filter @poco-scrum/api test -- document-template-flow`：64 tests, 64 pass
- Notes:
  - 评审、评论和版本历史在下一 task 承接
  - Step 7 使用 API-level e2e（接口级端到端测试）验证模板列表、正式文档创建、回读和模板类型不匹配保护；未扩展到 review/comment/version/search/dashboard

## Review Gap Verification

- `apps/api/src/modules/document-templates/document-templates.repository.ts`：新增 Prisma-backed repository（数据库支持仓储）与 seed fallback（种子回退）。
- `apps/api/test/document-template-prisma.spec.ts`：验证 `DocumentTemplatesService` 通过 Prisma `documentTemplate` delegate（委托）读取默认模板。
- `docs/runbooks/p2-document-template-smoke-check.md`：补充 Web Main Path（网页主路径），覆盖 `/documents/new` 模板切换、结构化字段、Markdown 保存与 `GET /documents/:documentId` API readback（接口回读）。
- `corepack pnpm --filter @poco-scrum/api test -- document-template-prisma`：66 tests, 66 pass。
- Step 7 保持只验证 Task1 的创建与回读闭环；未新增 review/comment/version/search/dashboard（评审/评论/版本/搜索/仪表盘）能力。

## Final Verification

- `git remote get-url origin`：`https://github.com/poco0222/poco-srcum.git`
- `corepack pnpm --filter @poco-scrum/domain test -- document-type`：15 tests, 15 pass
- `corepack pnpm --filter @poco-scrum/shared test -- document-editor`：9 tests, 9 pass
- `corepack pnpm --filter @poco-scrum/api test -- document-template-seed`：64 tests, 64 pass
- `corepack pnpm --filter @poco-scrum/api test -- document-editor-payload`：64 tests, 64 pass
- `corepack pnpm --filter @poco-scrum/api test -- document-template-api`：64 tests, 64 pass
- `corepack pnpm --filter @poco-scrum/api test -- document-relation`：64 tests, 64 pass
- `corepack pnpm --filter @poco-scrum/api test -- document-template-flow`：64 tests, 64 pass
- `corepack pnpm --filter @poco-scrum/web test -- document-form`：17 tests, 17 pass
- `corepack pnpm --filter @poco-scrum/web test -- template-selector`：17 tests, 17 pass
- `corepack pnpm --filter @poco-scrum/domain typecheck`：exit 0
- `corepack pnpm --filter @poco-scrum/shared typecheck`：exit 0
- `corepack pnpm --filter @poco-scrum/api typecheck`：exit 0
- `corepack pnpm --filter @poco-scrum/web typecheck`：exit 0
- `DATABASE_URL=postgresql://poco:poco@localhost:5432/poco_scrum?schema=public corepack pnpm --filter @poco-scrum/api prisma:validate`：schema valid
- `corepack pnpm --filter @poco-scrum/domain build`：exit 0
- `corepack pnpm --filter @poco-scrum/shared build`：exit 0
- `corepack pnpm --filter @poco-scrum/api build`：exit 0
- `corepack pnpm --filter @poco-scrum/web build`：exit 0，`/documents/new` 构建成功
