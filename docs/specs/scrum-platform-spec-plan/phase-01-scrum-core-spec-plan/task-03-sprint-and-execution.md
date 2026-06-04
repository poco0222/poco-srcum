# Task 03 Sprint And Execution

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P1
> Parent Spec: `phase-01-scrum-core-spec.md`
> Parent Plan: `phase-01-scrum-core-spec-plan.md`

## Objective

建立 Sprint 计划、承诺、执行、阻塞记录、日常更新和复盘主流程，让团队能真实推进并结束一个 Sprint。

## Background

Scrum 系统是否成立，关键看 Sprint 是否被当作正式承诺对象，而不是一个简单日期区间标签；同时 Sprint 结束后的 `Retrospective`（复盘）也是闭环的一部分。

## Scope

- 建立 Sprint 创建、开始、执行、结束与关闭主流程
- 建立 Sprint Goal、承诺项、执行计划、阻塞记录和每日更新入口
- 建立活跃 Sprint 范围变更留痕规则
- 建立 Sprint 结束后的复盘流程入口与基础记录结构

## Out Of Scope

- 不扩展 P3 的复杂运营报表和跨项目管理视图
- 不扩展 P2 的评审协作和文档版本历史
- 不在本 task 内承担验收判定和驳回重开规则，这部分由 `task-04-acceptance-doc-preview-notification.md` 主承接
- 不在本 task 内引入复杂会议管理、自动总结或 AI 生成复盘内容

## Inputs

- Backlog 与工作项模型
- 已确认的 Sprint Goal、范围变更、状态流转规则
- P1 对完整 Sprint 主链路和复盘闭环的要求

## Dependencies

- `task-02-work-item-and-backlog.md`：提供进入 Sprint 的工作项结构、优先级和门禁基础
- `task-01-project-bootstrap-and-foundation.md`：提供基础成员、角色和项目边界
- 已冻结的状态命名和 Sprint 生命周期枚举

## Deliverables

- Sprint 创建、开始、结束、关闭模型
- Sprint Goal、承诺项、执行计划模型
- 看板与任务执行视图
- 阻塞记录、每日更新入口
- 活跃 Sprint 范围变更留痕规则
- Sprint 结束后的复盘入口、复盘记录结构与挂接规则

## Acceptance Criteria

- 团队可在系统中完成一次完整 Sprint 执行
- Sprint Goal、任务拆分、阻塞、状态推进可追溯
- 范围变更具备留痕
- Sprint 结束后可发起并记录一次基础 `Retrospective`（复盘）

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 一支真实团队能完整跑完一个 Sprint | 本 task 主承接 Sprint 计划、执行、结束和复盘主流程 |
| 活跃 Sprint 的范围变更具备留痕 | 本 task 直接覆盖范围变更留痕规则 |
| 可支持真实团队迁移到系统进行一次完整 Sprint 试运行 | 本 task 主承接 Sprint 生命周期闭环，依赖其他 task 提供基础工程、Backlog 与验收支撑 |
| 主流程无 P0 / P1 阻断问题 | 本 task 覆盖 Sprint 主流程自身的关键阻断点，但不替代验收与文档交付能力 |

## Risks

- 状态机过于复杂影响首期交付
- 执行层视图做得过重偏离主流程
- 复盘流程如果定义过重，会把 P1 拉向 P2 文档协作范围

## Open Questions

- P1 的复盘记录是否只保留结构化字段和最小 Markdown 内容
- 复盘流程是否要求和 Sprint 关闭强绑定，还是允许延后补录

## Execution Assumptions

- `task-02-work-item-and-backlog.md` 已提供：
  - Work Item 统一模型
  - Story Ready Gate
  - Backlog 列表与详情 API
- 本 task 默认使用以下落点：
  - `packages/domain/src/sprints/*`
  - `apps/api/src/modules/sprints/*`
  - `apps/api/src/modules/blockers/*`
  - `apps/web/src/app/(authenticated)/sprints/*`
  - `tests/e2e/sprints/*.spec.ts`

## Steps

### Step 1: 冻结 Sprint 生命周期与状态迁移测试

- Goal: 用统一枚举和失败测试固定 `draft -> planned -> active -> ended -> closed` 生命周期
- Why: 生命周期不先冻结，后续 Planning、Board、结束收尾都会各自发散
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/sprints/sprint.enums.ts`
  - `<implementation-repo>/packages/domain/src/sprints/sprint.machine.ts`
  - `<implementation-repo>/apps/api/test/sprint-state-machine.spec.ts`
- Preconditions:
  - P1 基础角色、项目边界和共享枚举已可用
- Actions:
  1. 定义 Sprint 状态枚举和允许迁移表。
  2. 先写 `sprint-state-machine` 测试，覆盖非法迁移，例如 `draft -> active`、`closed -> active`。
  3. 在 `packages/domain` 中补最小状态机实现。
- Commands:
  - `pnpm --filter domain test -- sprint`
  - `pnpm --filter api test -- sprint-state-machine`
- Expected Output:
  - 统一的 Sprint 状态枚举
  - 一组非法迁移负例测试
- Acceptance:
  - 非法状态切换必须失败
  - 后续所有 Sprint API 只能复用这套状态机
- Evidence:
  - 测试输出
  - 状态迁移表
- Notes:
  - 不在此步处理验收与文档收尾

### Step 2: 落库 Sprint 与 Planning Snapshot 模型

- Goal: 把 Sprint 自身和 Planning 结果保存为结构化数据
- Why: 没有落库模型，Goal、承诺项和执行快照都无法追溯
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/packages/shared/src/sprints/*.ts`
  - `<implementation-repo>/apps/api/prisma/migrations/*`
- Preconditions:
  - Step 1 已冻结状态机
  - `task-02` 已提供 Work Item 模型
- Actions:
  1. 在 Prisma 中增加 `Sprint`、`SprintCommitment`、`SprintDailyUpdate` 基础模型。
  2. 定义 `SprintGoal`、`commitmentWorkItemIds`、`planningNote`、`planningSnapshot` DTO。
  3. 运行 Prisma 校验，确保 Work Item 与 Sprint 外键关系稳定。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api typecheck`
- Expected Output:
  - Sprint 及 Planning 相关数据库模型
  - 可复用的输入输出 DTO
- Acceptance:
  - Sprint 可以挂靠项目和承诺项
  - `planningSnapshot` 可以独立保存 Planning 结果
- Evidence:
  - Prisma 校验输出
  - migration 路径
- Notes:
  - 不在此步实现 Board 页面

### Step 3: 实现 Sprint 创建、开始、结束、关闭 API

- Goal: 打通 Sprint 生命周期四个关键命令型接口
- Why: 生命周期规则必须先被 API 承接，前端才有可用入口
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/sprints/sprints.controller.ts`
  - `<implementation-repo>/apps/api/src/modules/sprints/sprints.service.ts`
  - `<implementation-repo>/apps/api/test/sprint-lifecycle.spec.ts`
- Preconditions:
  - Step 2 已有 Sprint 落库模型
- Actions:
  1. 先写 `sprint-lifecycle` 测试，覆盖创建、开始、结束、关闭和非法重复关闭。
  2. 实现 `create / start / end / close` API。
  3. 在服务层统一调用 Step 1 的状态机，禁止绕过迁移规则。
- Commands:
  - `pnpm --filter api test -- sprint-lifecycle`
- Expected Output:
  - Sprint 生命周期 API
  - 一组通过的生命周期测试
- Acceptance:
  - `start` 只能作用于 `planned`
  - `close` 不能跳过 `ended`
- Evidence:
  - 测试输出
  - 示例 API 请求与响应
- Notes:
  - 不在此步处理承诺项校验

### Step 4: 实现 Sprint Planning 承诺结构与 Ready Gate 接入

- Goal: 让 Planning 阶段能形成 Goal、承诺项和执行准备快照
- Why: Sprint 不是日期容器，必须有明确承诺结构才能进入执行阶段
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/sprints/planning.service.ts`
  - `<implementation-repo>/apps/api/src/modules/sprints/contracts/update-planning.dto.ts`
  - `<implementation-repo>/apps/api/test/sprint-planning.spec.ts`
- Preconditions:
  - Step 3 已有 Sprint 生命周期 API
  - `task-02` 的 Story Ready Gate 已可复用
- Actions:
  1. 先写 Planning 测试，覆盖 Goal 录入、承诺项绑定和“未 Ready 的 Story 不可承诺”。
  2. 实现 Planning 更新服务，保存 Goal、承诺项与快照。
  3. 让 `start sprint` 前自动校验承诺项是否全部通过 Ready Gate。
- Commands:
  - `pnpm --filter api test -- sprint-planning`
- Expected Output:
  - Planning 更新 API
  - Ready Gate 集成测试
- Acceptance:
  - Sprint 开始前必须存在 Goal 和承诺项
  - 不满足 Ready Gate 的 Story 不能加入承诺
- Evidence:
  - 测试输出
  - 失败响应错误码
- Notes:
  - P1 不做复杂容量算法

### Step 5: 实现看板、任务推进与每日更新闭环

- Goal: 让活跃 Sprint 至少能查看承诺项、推进状态并记录每日更新
- Why: 没有执行闭环，Sprint 只是 Planning 结果，不能支撑真实团队运转
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/sprints/[sprintId]/board/page.tsx`
  - `<implementation-repo>/apps/web/src/features/sprints/components/board/*`
  - `<implementation-repo>/apps/api/src/modules/sprints/daily-updates.service.ts`
  - `<implementation-repo>/apps/api/test/sprint-daily-update.spec.ts`
- Preconditions:
  - Step 4 已提供 Planning 结果
- Actions:
  1. 实现最小 Board 页面，至少区分 `todo / in-progress / done` 三列。
  2. 实现任务状态推进接口与每日更新接口。
  3. 编写每日更新测试，覆盖同一工作项多次更新的时间线展示。
- Commands:
  - `pnpm --filter api test -- sprint-daily-update`
  - `pnpm --filter web test -- board`
  - `pnpm --filter web build`
- Expected Output:
  - Sprint Board 页面
  - 每日更新 API 与时间线
- Acceptance:
  - 团队可查看承诺项并推进状态
  - 每日更新能绑定到具体 Sprint 或工作项
- Evidence:
  - 测试输出
  - 页面截图
- Notes:
  - 不在这里做复杂泳道与报表

### Step 6: 实现阻塞记录与范围变更留痕

- Goal: 让阻塞和 Scope Change 都形成最小可追溯事件
- Why: Phase 验收明确要求活跃 Sprint 的范围变更有留痕
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/blockers/*`
  - `<implementation-repo>/apps/api/src/modules/sprints/scope-change.service.ts`
  - `<implementation-repo>/apps/api/test/sprint-scope-change.spec.ts`
  - `<implementation-repo>/apps/web/src/features/sprints/components/blocker-modal.tsx`
- Preconditions:
  - Step 5 已有 Board 与状态推进入口
- Actions:
  1. 定义 `Blocker` 和 `ScopeChangeEvent` 最小字段：`actorId / sprintId / workItemId / action / reason / createdAt`。
  2. 先写测试，覆盖新增阻塞、解除阻塞、移入 Sprint、移出 Sprint。
  3. 实现 API 与前端录入入口。
- Commands:
  - `pnpm --filter api test -- sprint-scope-change`
  - `pnpm --filter web test -- blocker`
- Expected Output:
  - 阻塞记录模块
  - 范围变更事件日志
- Acceptance:
  - 活跃 Sprint 的工作项新增或移除都能留下事件
  - 阻塞记录可追溯到原因、操作人和时间
- Evidence:
  - 测试输出
  - 事件示例数据
- Notes:
  - 不引入审批流

### Step 7: 实现 Sprint 结束、关闭与 Retrospective 入口

- Goal: 把执行期收尾动作与复盘入口串起来
- Why: Sprint 结束不等于复盘完成，必须明确两个动作的边界
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/sprints/[sprintId]/summary/page.tsx`
  - `<implementation-repo>/apps/api/src/modules/sprints/closure.service.ts`
  - `<implementation-repo>/apps/api/src/modules/retrospectives/*`
  - `<implementation-repo>/apps/api/test/sprint-close-retrospective.spec.ts`
- Preconditions:
  - Step 6 已有阻塞和范围变更留痕
  - `task-04` 需提供最小文档承载能力
- Actions:
  1. 编写 `sprint-close-retrospective` 测试，覆盖“结束 Sprint 后可创建复盘记录，关闭后不可再开始”。
  2. 实现 Sprint Summary/Close 服务，区分 `ended` 与 `closed` 前置条件。
  3. 在 Sprint 收尾页面增加 “发起 Retrospective” 入口，挂接到最小文档对象。
- Commands:
  - `pnpm --filter api test -- sprint-close-retrospective`
  - `pnpm --filter web build`
- Expected Output:
  - Sprint 收尾服务
  - 复盘入口与基础记录对象
- Acceptance:
  - `ended` 和 `closed` 语义清晰区分
  - Sprint 结束后可创建一条基础复盘记录
- Evidence:
  - 测试输出
  - 页面截图或 API 响应
- Notes:
  - 复盘评论与版本历史属于 P2

### Step 8: 执行完整 Sprint 主链路端到端验证

- Goal: 证明团队真的能在系统中跑完一个 Sprint
- Why: 这是 P1 最关键的 phase 级退出标准
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/sprints/full-sprint-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p1-sprint-flow-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 7 均已完成
- Actions:
  1. 编写完整主路径 e2e：创建 Sprint -> Planning -> 更新任务 -> 记录阻塞 -> 结束 -> 关闭 -> 发起复盘。
  2. 编写至少一个负例：未通过 Ready Gate 的 Story 不能纳入承诺项。
  3. 记录手工验收 runbook，方便后续 Codex 或人工回归。
- Commands:
  - `pnpm --filter e2e test -- full-sprint-flow`
  - `pnpm -r build`
- Expected Output:
  - 一条完整 Sprint e2e
  - 一份 Sprint 主链路烟雾检查文档
- Acceptance:
  - 主路径与关键负例都稳定通过
  - 根级构建不被 Sprint 模块破坏
- Evidence:
  - e2e 输出
  - runbook 路径
- Notes:
  - 只有完成本步，P1 才能宣称“可跑一个完整 Sprint”
