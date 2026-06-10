# Task 03 Linkage Search And Dashboard

> Author: PopoY
> Created: 2026-06-04
> Status: done
> Phase: P2
> Parent Spec: `phase-02-document-collaboration-spec.md`
> Parent Plan: `phase-02-document-collaboration-spec-plan.md`

## Objective

建立文档、需求、任务、验收之间的关联链路，并提供覆盖核心对象与文档内容的基础搜索和轻量仪表盘。

## Background

如果文档、工作项、验收记录和评审状态各自孤立存在，即使 P2 完成了模板和版本能力，系统仍然会退化成“多个孤岛页面”，无法形成可追溯的交付证据链。

## Scope

- 建立需求、方案、执行、验收、复盘等对象之间的关联链路模型
- 建立覆盖核心对象、结构化字段和 Markdown 正文的基础搜索
- 消费文档中的附件与链接挂接结果，形成基础检索与跳转能力
- 建立面向文档协作状态的轻量仪表盘

## Out Of Scope

- 不负责定义正式文档类型、模板和 Markdown 增强边界，这部分由 `task-01-document-template-and-structure.md` 主承接
- 不负责定义评论、评审状态和版本历史规则，这部分由 `task-02-review-comment-and-versioning.md` 主承接
- 不扩展高级全文检索、知识图谱或跨项目运营报表
- 不把附件能力扩展成独立存储治理或复杂管理中心

## Inputs

- P2 `spec` 与 `phase plan`
- `task-01-document-template-and-structure.md` 提供的文档类型、结构字段以及附件、链接挂接规范
- `task-02-review-comment-and-versioning.md` 提供的评审状态、版本与评论元数据
- 已冻结的核心对象标识与引用规则

## Dependencies

- `task-01-document-template-and-structure.md`：提供可被串联与检索的文档对象、正文边界和挂接规范
- `task-02-review-comment-and-versioning.md`：提供可进入链路和仪表盘的评审、版本与协作状态元数据
- 基础搜索只能建立在稳定的对象标识和引用规则之上

## Deliverables

- 关联链路模型
- 覆盖核心对象与文档内容的基础搜索
- 附件与链接的基础检索和跳转规则
- 轻量仪表盘

## Acceptance Criteria

- 用户可从需求追到方案、任务、验收记录
- 基础搜索可覆盖核心对象、结构化字段和文档正文内容
- 轻量仪表盘可支撑日常查找、评审跟踪和交付链路巡检

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 需求、方案、执行、验收可通过系统对象串联 | 本 task 主承接对象关联链路和跳转能力 |
| 基础搜索可覆盖核心对象与文档内容 | 本 task 主承接基础搜索范围与检索入口 |
| 系统内可完整沉淀需求说明、技术方案、验收说明、复盘纪要 | 本 task 只消费已沉淀对象并提供串联与检索，不主承接沉淀能力本身 |
| 文档协作不再依赖多个零散外部工具 | 本 task 通过链路、搜索和轻量仪表盘提供辅助支撑，但不主承接协作流程 |

## Risks

- 搜索范围如果继续扩张，容易越过 P2 进入高级全文检索能力
- 轻量仪表盘如果做成运营报表，会与 P3 的组合视图和报表能力重叠
- 附件与链接如果没有沿用 `task-01-document-template-and-structure.md` 的边界，容易出现 owner 漂移

## Open Questions

- 文档内容搜索在 P2 是否只覆盖标题、结构化字段和 Markdown 正文，不覆盖附件全文
- 轻量仪表盘的最小指标是否只覆盖待评审、最近更新和交付链路完整度
- 附件与链接在 P2 是否只要求基础检索和跳转，不要求复杂关系分析

## Execution Assumptions

- `task-01` 已提供文档类型、结构字段、挂接关系。
- `task-02` 已提供评审状态、评论元数据与版本历史。
- 本 task 默认使用以下落点：
  - `packages/domain/src/linkage/*`
  - `apps/api/src/modules/search/*`
  - `apps/api/src/modules/linkage/*`
  - `apps/api/src/modules/dashboard/*`
  - `apps/web/src/app/(authenticated)/search/*`
  - `apps/web/src/app/(authenticated)/dashboard/*`

## Steps

## Step Status

| Step | Status | Progress |
| --- | --- | --- |
| Step 1 | done | 已冻结 linkage relation（关联关系）类型、cardinality（基数）、reverse navigation（反向导航）规则，并新增 `docs/adr/adr-007-linkage-model.md`；证据：`corepack pnpm --filter @poco-scrum/domain test -- linkage` 通过。 |
| Step 2 | done | 已实现 ObjectLink（对象链路）Prisma model（Prisma 模型）、migration（迁移）、Prisma-backed repository（Prisma 驱动仓储）、LinkageService（链路服务）、正反向查询与重复/基数拦截；证据：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/linkage-relations.spec.ts`、`test/linkage-prisma.spec.ts` 与 `corepack pnpm --filter @poco-scrum/api prisma:validate` 通过。 |
| Step 3 | done | 已冻结 search scope（搜索范围）为 title（标题）、number（编号）、tag（标签）、structured-field（结构化字段）、markdown-body（Markdown 正文），不包含 attachment full text（附件全文）；已新增 SearchResultCard（搜索结果卡片）契约；证据：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/search-contract.spec.ts` 与 `corepack pnpm --filter @poco-scrum/shared typecheck` 通过。 |
| Step 4 | done | 已实现基础 search API（搜索接口），覆盖 title（标题）、structured fields（结构化字段）、Markdown body（Markdown 正文）、relation summary（关系摘要）、review status（评审状态）筛选与稳定空数组响应；证据：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/search-scope.spec.ts` 与 `test/search-contract.spec.ts` 通过。 |
| Step 5 | done | 已实现 URL-driven search page（URL 驱动搜索页面）、SearchFilters（搜索筛选器）、SearchResultCard（搜索结果卡片）和跳转规则；文档类结果跳转 `/documents/:id/review`，Story/Sprint 跳转既有详情页；证据：`corepack pnpm --filter @poco-scrum/web test -- search` 通过。 |
| Step 6 | done | 已实现 lightweight dashboard（轻量仪表盘）API 与页面，固定三类卡片：pending review（待评审）、recent updates（最近更新）、incomplete links（链路不完整）；证据：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-dashboard.spec.ts` 与 `corepack pnpm --filter @poco-scrum/web test -- dashboard` 通过。 |
| Step 7 | done | 已新增 `tests/e2e/documents/document-linkage-search-flow.spec.ts` 与 `docs/runbooks/p2-linkage-search-dashboard-smoke-check.md`；主路径验证通过，并完成 workspace-level test/build（工作区级测试/构建）。证据：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-linkage-search-flow.spec.ts`、`corepack pnpm -r test`、`corepack pnpm -r build` 通过。 |

## Progress Updates

- 2026-06-10: Step 4/Step 6/Step 7 hardening（加固）已回写。`SearchModule`（搜索模块）和 `DashboardModule`（仪表盘模块）已接入 `ReviewsModule`（评审模块），`filter-only search`（仅筛选搜索）支持 `reviewStatus`（评审状态）无关键词查询，统一 `SearchService`（搜索服务）已覆盖 `Document`（文档）、`Story`（故事）和 `Sprint`（迭代）。验证命令：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/search-scope.spec.ts` 与 `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-linkage-search-flow.spec.ts` 均通过。
- 2026-06-10: Step 2 persistence hardening（持久化加固）已回写。`ObjectLink`（对象链路）运行时新增 `PrismaObjectLinksRepository`（Prisma 对象链路仓储）与 `createObjectLinksPrismaClient`（对象链路 Prisma 客户端工厂），`LinkageModule`（链路模块）在 `DATABASE_URL` 可用时使用 Prisma 持久化，否则保留 in-memory fallback（内存降级）。验证命令：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/linkage-prisma.spec.ts` 通过。
- 2026-06-10: Step 4 search boundary hardening（搜索边界加固）已回写。`SearchService`（搜索服务）只将 `WorkItemType.STORY`（故事类型工作项）索引为 `STORY`，避免 `TASK/BUG/EPIC`（任务/缺陷/史诗）被误标为 Story。验证命令：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/search-scope.spec.ts` 通过。
- 2026-06-10: Step 2 runtime fallback（运行时降级）已回写。若本地 `@prisma/client`（Prisma 客户端）尚未重新生成、缺少 `objectLink delegate`（对象链路委托），`createObjectLinksPrismaClient`（对象链路 Prisma 客户端工厂）不会返回该客户端，`PrismaObjectLinksRepository`（Prisma 对象链路仓储）也会走 in-memory fallback（内存降级），避免 `POST /linkage` 返回 500。验证命令：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/linkage-prisma.spec.ts` 与 `corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-linkage-search-flow.spec.ts` 均通过。
- 2026-06-10: Step 2 review hardening（审查加固）已回写。`PrismaObjectLinksRepository`（Prisma 对象链路仓储）在任何 Prisma write fallback（Prisma 写入降级）后进入 sticky fallback（粘性降级），保证同一进程内后续 read/duplicate/cardinality check（读取/查重/基数校验）使用同一数据源；`resolveObjectLinksPrismaClient`（对象链路 Prisma 客户端解析器）会在 stale generated client（过期生成客户端）缺少 `objectLink` 时执行 `$disconnect`（断开连接）后返回 `null`。验证命令：`corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/linkage-prisma.spec.ts` 通过。

### Step 1: 冻结关联关系类型与反向导航规则

- Goal: 先把需求、方案、执行、验收、复盘之间的 link relation（关联关系）类型写死
- Why: 如果关系类型不先收敛，搜索和仪表盘会消费一堆不一致的边
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/linkage/linkage.enums.ts`
  - `<implementation-repo>/packages/domain/src/linkage/linkage.rules.ts`
  - `<implementation-repo>/docs/adr/adr-007-linkage-model.md`
- Preconditions:
  - 文档与 Scrum 工件挂接规则已可用
- Actions:
  1. 冻结关系类型，例如 `requirement-to-design`、`design-to-story`、`story-to-acceptance`、`sprint-to-retrospective`。
  2. 定义反向导航规则，明确哪些关系允许一对多、哪些只允许一对一。
  3. 在 ADR 中写清 P2 不做复杂图谱推理。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- linkage`
- Expected Output:
  - 关系类型枚举
  - 反向导航规则 ADR
- Acceptance:
  - 每类关系都有明确方向和基数
  - 后续搜索结果可以直接复用这些类型
- Evidence:
  - ADR 路径
  - 枚举测试输出
- Notes:
  - 不在此步实现搜索接口

### Step 2: 实现 Linkage 数据模型与建链测试

- Goal: 把关系类型真正落到数据库和服务层
- Why: 只有落库后，文档、Story、验收记录之间才能形成可查询链路
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/apps/api/src/modules/linkage/*`
  - `<implementation-repo>/apps/api/test/linkage-relations.spec.ts`
- Preconditions:
  - Step 1 已冻结关系类型
- Actions:
  1. 在数据库中增加 `ObjectLink` 或等价关系模型。
  2. 编写测试，覆盖创建关系、查询正向关系、查询反向关系、禁止重复关系。
  3. 实现最小建链与取链服务。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- linkage-relations`
- Expected Output:
  - 关系模型
  - 建链/取链服务
- Acceptance:
  - 需求、方案、Story、验收、复盘之间可互相追溯
  - 重复关系会被拦截
- Evidence:
  - 测试输出
  - Prisma 校验输出
- Notes:
  - 不在此步做可视化图谱

### Step 3: 冻结基础搜索范围与结果卡片 Schema

- Goal: 把 P2 的搜索边界量化成字段清单和返回结构
- Why: 没有固定范围，搜索功能很容易膨胀到高级全文检索
- Target Files/Paths:
  - `<implementation-repo>/packages/shared/src/search/search-result.schema.ts`
  - `<implementation-repo>/docs/adr/adr-008-search-scope.md`
  - `<implementation-repo>/apps/api/test/search-contract.spec.ts`
- Preconditions:
  - Step 2 已可查询对象关系
- Actions:
  1. 冻结搜索范围：标题、编号、标签、结构化字段、Markdown 正文，不包含附件全文。
  2. 定义结果卡片字段：`objectType / objectId / title / snippet / relationSummary / reviewStatus / updatedAt`。
  3. 编写接口契约测试，约束搜索响应结构。
- Commands:
  - `pnpm --filter api test -- search-contract`
  - `pnpm --filter shared typecheck`
- Expected Output:
  - 搜索结果 schema
  - 搜索范围 ADR
- Acceptance:
  - 搜索范围不包含附件全文
  - 所有结果卡片字段都有明确来源
- Evidence:
  - 测试输出
  - ADR 路径
- Notes:
  - 不在此步实现检索算法

### Step 4: 实现基础搜索 API 与范围测试

- Goal: 打通核心对象和文档正文的统一搜索入口
- Why: P2 的证据链要可检索，不能只靠手动翻页
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/search/search.service.ts`
  - `<implementation-repo>/apps/api/src/modules/search/search.controller.ts`
  - `<implementation-repo>/apps/api/test/search-scope.spec.ts`
- Preconditions:
  - Step 3 已冻结搜索结果 schema
- Actions:
  1. 实现基础搜索服务，先覆盖标题、编号、结构化字段和 Markdown 正文。
  2. 编写范围测试，分别验证命中标题、结构化字段和正文内容。
  3. 明确排序规则与空结果响应结构。
- Commands:
  - `pnpm --filter api test -- search-scope`
  - `pnpm --filter api test -- search`
- Expected Output:
  - 基础搜索 API
  - 搜索范围测试
- Acceptance:
  - 用户可通过一个入口检索核心对象与文档内容
  - 搜索空态结构稳定
- Evidence:
  - 测试输出
  - 示例 API 响应
- Notes:
  - P2 不要求独立搜索引擎

### Step 5: 实现搜索页面与对象跳转卡片

- Goal: 让搜索结果真正成为“能跳转的证据链入口”
- Why: 只有后端 API 还不够，用户需要直接看到和跳转到对象
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/search/page.tsx`
  - `<implementation-repo>/apps/web/src/features/search/components/search-result-card.tsx`
  - `<implementation-repo>/apps/web/src/features/search/components/search-filters.tsx`
- Preconditions:
  - Step 4 已提供搜索 API
- Actions:
  1. 实现全局搜索页，支持关键词、对象类型、评审状态基础筛选。
  2. 在结果卡片展示摘要、关系摘要、更新时间和跳转按钮。
  3. 对空态、无权限态和无结果态分别提供明确提示。
- Commands:
  - `pnpm --filter web test -- search`
  - `pnpm --filter web build`
- Expected Output:
  - 搜索页面
  - 搜索结果卡片组件
- Acceptance:
  - 用户可从搜索结果跳转到 Story、文档、验收记录等对象
  - 空态和异常态有可观察提示
- Evidence:
  - 前端测试输出
  - 页面截图
- Notes:
  - 不在此步做高级排序面板

### Step 6: 实现轻量仪表盘与固定指标卡片

- Goal: 把文档协作状态压缩成几个固定、可解释的巡检卡片
- Why: P2 需要“轻量仪表盘”，但不能越界成 P3 运营报表
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/dashboard/*`
  - `<implementation-repo>/apps/api/test/document-dashboard.spec.ts`
  - `<implementation-repo>/apps/web/src/app/(authenticated)/dashboard/page.tsx`
  - `<implementation-repo>/apps/web/src/features/dashboard/components/*`
- Preconditions:
  - Step 2 的关系链路和 Step 4 的搜索服务已可用
- Actions:
  1. 固定三类卡片：`待评审文档`、`最近更新`、`链路不完整对象`。
  2. 编写指标测试，约束每张卡片的数据来源和过滤条件。
  3. 实现仪表盘页面与卡片组件。
- Commands:
  - `pnpm --filter api test -- document-dashboard`
  - `pnpm --filter web test -- dashboard`
- Expected Output:
  - 轻量仪表盘 API
  - 仪表盘页面
- Acceptance:
  - 仪表盘只展示固定协作状态，不引入 P3 报表口径
  - 每张卡片都能跳转到对应搜索或详情页
- Evidence:
  - 测试输出
  - 页面截图
- Notes:
  - 不做跨项目聚合

### Step 7: 执行链路、搜索与仪表盘主路径验证

- Goal: 用端到端流程证明 P2 的证据链真的可串、可搜、可巡检
- Why: 这是 P2 最核心的 phase 级价值
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/documents/document-linkage-search-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p2-linkage-search-dashboard-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 编写 e2e：创建需求文档 -> 关联方案 -> 关联 Story -> 搜索命中 -> 仪表盘显示待评审或链路状态。
  2. 编写手工巡检 runbook，记录常用搜索词和预期卡片。
  3. 执行根级测试与构建，确认未破坏前两项 task。
- Commands:
  - `pnpm --filter e2e test -- document-linkage-search-flow`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 链路搜索主路径 e2e
  - P2 巡检 runbook
- Acceptance:
  - 文档、需求、执行、验收对象可以通过系统串联与检索
  - 根级测试和构建通过
- Evidence:
  - e2e 输出
  - runbook 路径
- Notes:
  - 高级全文检索和知识图谱留到后续 phase 再讨论
