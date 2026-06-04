# Task 02 Work Item And Backlog

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P1
> Parent Spec: `phase-01-scrum-core-spec.md`
> Parent Plan: `phase-01-scrum-core-spec-plan.md`

## Objective

建立统一 `work item` 模型和 `Product Backlog` 主流程，支撑 Story、Task、Bug 的结构化管理。

## Background

Backlog 是 Scrum 的起点。如果工作项建模不统一，后续 Sprint、验收、报表都会失真。

## Scope

- 建立统一 `work item` 模型和 `Epic / Story / Task / Bug` 关系规则
- 建立 `Product Backlog` 的排序、优先级、预估和验收标准录入能力
- 建立进入 Sprint 前的最小 `ready` 校验规则
- 建立可支撑后续 Sprint 选择与验收闭环的核心字段边界

## Out Of Scope

- 不在本 task 内展开 Sprint 执行、看板、阻塞记录与复盘流程
- 不在本 task 内承接正式验收判定、驳回和重开规则
- 不扩展复杂报表、跨项目组合视图和高级分析能力
- 不引入 P2 的文档评审流和版本协作能力

## Inputs

- 基础工程与项目模型
- 已确认的 Story / Task / Bug 关系规则
- P1 对 `acceptance criteria`、Sprint 选择门禁和统一工作项模型的要求

## Dependencies

- `task-01-project-bootstrap-and-foundation.md`：提供基础工程、项目、成员和角色边界
- 后续 `task-03-sprint-and-execution.md` 依赖本 task 提供 Sprint 选择前的数据结构与门禁
- 后续 `task-04-acceptance-doc-preview-notification.md` 依赖本 task 提供 Story 与验收标准基础建模

## Deliverables

- `work item` 统一模型
- Epic / Story / Task / Bug 关系规则
- Backlog 列表、排序、优先级、预估、验收标准模型
- 进入 Sprint 前的 `ready` 校验规则

## Acceptance Criteria

- Story、Task、Bug 关系清晰可追溯
- Backlog 能支撑真实梳理与 Sprint 选择
- Story 进入 Sprint 前具备必要门禁校验
- `acceptance criteria` 作为 Story 进入 Sprint 的前置条件被结构化约束

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| Story 进入 Sprint 前必须具备 `acceptance criteria` | 本 task 主承接验收标准模型和进入 Sprint 前的 `ready` 门禁 |
| 一支真实团队能完整跑完一个 Sprint | 本 task 为 Sprint 选择、任务拆分和后续验收提供统一工作项基础，但不主承接执行闭环 |
| 可支持真实团队迁移到系统进行一次完整 Sprint 试运行 | 本 task 负责让 Backlog 具备真实梳理、优先级和进入 Sprint 的条件 |

## Risks

- 字段过多导致首期建模过重
- 关系模型不稳会影响后续扩展
- 如果 `acceptance criteria` 建模过弱，后续验收与完成定义门禁会失真

## Open Questions

- Epic 是否在 P1 只保留最小归类能力，还是需要更强层级约束
- Bug 是否复用统一工作项状态机，还是保留最小差异化字段
- `ready` 校验规则是否在 P1 只覆盖必要字段，不绑定复杂流程审批

## Execution Assumptions

- `task-01-project-bootstrap-and-foundation.md` 已在真实实现仓中提供：
  - `apps/api/prisma/schema.prisma`
  - `packages/domain`
  - `packages/shared`
  - `apps/web` 基础壳与 `GET /auth/me`
- 本 task 默认把 `Backlog`（待办列表）实现拆到：
  - `packages/domain/src/work-items/*`
  - `apps/api/src/modules/work-items/*`
  - `apps/web/src/app/(authenticated)/backlog/*`
  - `tests/e2e/backlog/*.spec.ts`

## Steps

### Step 1: 冻结 Work Item 字段矩阵与真实模块路径

- Goal: 把 `Epic / Story / Task / Bug` 的字段、关系和落点路径一次性定死
- Why: 如果字段矩阵不先冻结，数据库、API 和 UI 会各写一套模型
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/work-items/work-item.enums.ts`
  - `<implementation-repo>/packages/domain/src/work-items/work-item.types.ts`
  - `<implementation-repo>/docs/adr/adr-004-work-item-model.md`
- Preconditions:
  - P1 基础工程与共享枚举已可用
- Actions:
  1. 在 ADR 中列出 `id / type / title / status / priority / storyPoints / acceptanceCriteria / projectId / sprintId / parentId / assigneeId / sortOrder` 等字段矩阵。
  2. 标注哪些字段对 `Story`、`Task`、`Bug`、`Epic` 是必填、选填或禁止。
  3. 在 `packages/domain` 中导出 `WorkItemType`、`WorkItemStatus`、`WorkItemPriority`。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test`
- Expected Output:
  - 一份不可歧义的字段矩阵
  - 统一的工作项类型与状态枚举
- Acceptance:
  - 后续 schema、DTO、UI 都能直接引用同一套字段定义
  - ADR 中明确 Story 与 Bug 的差异字段
- Evidence:
  - ADR 路径
  - 枚举测试输出
- Notes:
  - 不在此步定义 Sprint 生命周期

### Step 2: 先写关系约束与 Ready 门禁的失败测试

- Goal: 用失败测试固定核心业务规则，再进入落库实现
- Why: `ready gate`（就绪门禁）和父子关系是后续最容易漂移的规则
- Target Files/Paths:
  - `<implementation-repo>/apps/api/test/work-item-relations.spec.ts`
  - `<implementation-repo>/apps/api/test/work-item-ready-gate.spec.ts`
- Preconditions:
  - Step 1 已冻结字段与枚举
- Actions:
  1. 编写关系测试，覆盖 `Epic -> Story`、`Story -> Task`、`Bug` 独立创建或挂靠规则。
  2. 编写 `ready gate` 失败测试，覆盖“缺少 `acceptance criteria` 的 Story 不可进入 Sprint”。
  3. 明确错误码与错误文案，例如 `WORK_ITEM_NOT_READY_FOR_SPRINT`。
- Commands:
  - `pnpm --filter api test -- work-item-relations`
  - `pnpm --filter api test -- work-item-ready-gate`
- Expected Output:
  - 两组先失败的业务规则测试
- Acceptance:
  - 至少存在一个关系负例
  - 至少存在一个 `ready gate` 负例
- Evidence:
  - 测试失败输出
  - 约定的错误码列表
- Notes:
  - 这一阶段不要先补 UI

### Step 3: 落数据库模型与输入校验 Schema

- Goal: 让字段矩阵和关系规则真正落到数据库与 DTO 层
- Why: 服务层和 UI 依赖稳定 schema，不能只停留在 ADR
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/packages/shared/src/work-items/*.ts`
  - `<implementation-repo>/apps/api/prisma/migrations/*`
- Preconditions:
  - Step 2 的失败测试已存在
- Actions:
  1. 在 Prisma 中增加统一 `WorkItem` 模型及必要自引用关系。
  2. 在 `packages/shared` 中补 `create / update / reorder` DTO 和校验 schema。
  3. 运行 migration 与 Prisma 校验，确保关系字段、索引和约束可落地。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- work-item-relations`
- Expected Output:
  - `WorkItem` 落库模型
  - 可复用的 DTO 与输入校验
- Acceptance:
  - 关系测试开始从“找不到模型”转为真实业务断言
  - Prisma schema 无校验错误
- Evidence:
  - Prisma 校验输出
  - migration 文件路径
- Notes:
  - 不在这里实现 Backlog 列表接口

### Step 4: 实现 Backlog 服务层与排序能力

- Goal: 让 `Product Backlog` 具备创建、更新、排序和列表查询能力
- Why: Sprint 选择之前必须先能真实维护待办顺序和优先级
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/work-items/work-items.service.ts`
  - `<implementation-repo>/apps/api/src/modules/work-items/work-items.repository.ts`
  - `<implementation-repo>/apps/api/src/modules/work-items/work-items.controller.ts`
  - `<implementation-repo>/apps/api/test/backlog-reorder.spec.ts`
- Preconditions:
  - Step 3 已落库 `WorkItem`
- Actions:
  1. 先写 `backlog-reorder` 失败测试，覆盖排序变更后的 `sortOrder` 持久化。
  2. 实现列表查询、详情查询、创建更新和重排接口。
  3. 在服务层统一处理优先级、预估值与父子关系校验。
- Commands:
  - `pnpm --filter api test -- backlog-reorder`
  - `pnpm --filter api test -- work-items`
- Expected Output:
  - Backlog 核心 API
  - 排序持久化测试
- Acceptance:
  - 调整顺序后重新查询列表，顺序保持一致
  - 非法父子关系不能保存
- Evidence:
  - 测试输出
  - 示例 API 请求与响应
- Notes:
  - 不在此步实现拖拽 UI

### Step 5: 实现 Story 进入 Sprint 前的 Ready Gate

- Goal: 在服务层与接口层同时拦住不满足条件的 Story
- Why: 只在 UI 做校验会被 API 绕过，不能满足 P1 验收
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/work-items/validators/story-ready.validator.ts`
  - `<implementation-repo>/apps/api/src/modules/sprints/contracts/add-to-sprint.dto.ts`
  - `<implementation-repo>/apps/api/test/work-item-ready-gate.spec.ts`
- Preconditions:
  - Step 4 已完成 Backlog API
- Actions:
  1. 补齐 `Story Ready` 校验器，检查 `acceptanceCriteria`、标题、估点等必要字段。
  2. 将校验挂到“加入 Sprint”或“创建 Sprint 承诺项”入口。
  3. 让 Step 2 的失败测试转为通过，并补一个成功样例。
- Commands:
  - `pnpm --filter api test -- work-item-ready-gate`
- Expected Output:
  - 可复用的 Story Ready 校验器
  - 成功/失败双路径测试
- Acceptance:
  - 缺少 `acceptance criteria` 的 Story 不能进入 Sprint
  - 满足条件的 Story 可以通过校验
- Evidence:
  - 测试输出
  - 失败响应中的错误码
- Notes:
  - 复杂审批流不属于 P1

### Step 6: 实现 Backlog 前端列表与详情页

- Goal: 让团队能在前端真实维护工作项，而不是只停留在 API
- Why: P1 需要真实团队能用，不是只完成服务端建模
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/backlog/page.tsx`
  - `<implementation-repo>/apps/web/src/app/(authenticated)/backlog/[workItemId]/page.tsx`
  - `<implementation-repo>/apps/web/src/features/backlog/components/*`
  - `<implementation-repo>/apps/web/src/features/backlog/api/*`
- Preconditions:
  - Step 4 和 Step 5 已提供 API 与 Ready Gate
- Actions:
  1. 实现 Backlog 列表页，展示编号、标题、类型、优先级、估点、Ready 状态。
  2. 实现详情页，支持录入 `acceptance criteria`、父子关系和说明字段。
  3. 在列表中显示“不可进入 Sprint”的原因提示，复用服务端错误语义。
- Commands:
  - `pnpm --filter web test -- backlog`
  - `pnpm --filter web build`
- Expected Output:
  - Backlog 列表与详情页面
  - 前端 API client
- Acceptance:
  - 用户可编辑 Story 的 `acceptance criteria`
  - Ready 状态与服务端校验结果一致
- Evidence:
  - 前端测试输出
  - 页面截图或录屏
- Notes:
  - P1 不要求复杂拖拽交互，可先用按钮排序或简易重排

### Step 7: 执行 Backlog 端到端验证

- Goal: 用最小端到端链路证明 Backlog 能支撑真实 Sprint 选择
- Why: 单元测试通过不代表团队能真实从列表走到 Sprint 准备阶段
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/backlog/backlog-ready-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p1-backlog-smoke-check.md`
- Preconditions:
  - Step 6 已交付列表页与详情页
- Actions:
  1. 编写 e2e，覆盖“创建 Story -> 录入验收标准 -> 校验 Ready 状态”的主路径。
  2. 编写负例 e2e，覆盖“缺验收标准 -> 加入 Sprint 失败”。
  3. 在 runbook 中记录手工验证顺序和预期页面表现。
- Commands:
  - `pnpm --filter e2e test -- backlog-ready-flow`
  - `pnpm -r build`
- Expected Output:
  - 一条通过的主路径 e2e
  - 一条失败路径 e2e
  - 一份 Backlog 烟雾检查说明
- Acceptance:
  - 主路径与失败路径都可稳定复现
  - 根级构建命令仍然通过
- Evidence:
  - e2e 测试输出
  - runbook 路径
- Notes:
  - 这一步完成后才算具备进入 Sprint 开发的基础
