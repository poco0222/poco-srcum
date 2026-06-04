# Task 03 Subscription Weekly Summary And Exports

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P3
> Parent Spec: `phase-03-portfolio-operations-spec.md`
> Parent Plan: `phase-03-portfolio-operations-spec-plan.md`

## Objective

建立订阅、周报汇总和导出能力，减少跨项目状态汇总的人工作业。

## Background

即使有了组合视图和运营口径，如果管理层和 PMO 仍然需要手工整理周报和导出材料，P3 的运营效率目标仍然无法成立，因此需要在现有口径之上补齐分发与导出能力。

## Scope

- 建立通知订阅机制
- 建立周报摘要汇总与导出能力
- 建立管理视图导出能力
- 消费上游组合视图和运营口径，不自行定义新的统计规则

## Out Of Scope

- 不负责多项目组合视图、路线图和里程碑展示，这部分由 `task-01-portfolio-and-roadmap-view.md` 主承接
- 不负责定义报表口径、风险规则、依赖追踪和延期信号，这部分由 `task-02-reporting-and-risk-tracking.md` 主承接
- 不扩展复杂消息编排、跨系统通知集成或企业级报表分发平台
- 不把导出能力扩展成重型 BI 报表体系

## Inputs

- P3 `spec` 与 `phase plan`
- `task-01-portfolio-and-roadmap-view.md` 提供的组合视图和路线图展示入口
- `task-02-reporting-and-risk-tracking.md` 提供的正式运营口径
- 管理层和 PMO 的常见周报、导出消费场景

## Dependencies

- `task-01-portfolio-and-roadmap-view.md`：提供可供订阅和导出的组合视图入口
- `task-02-reporting-and-risk-tracking.md`：提供统一运营口径和风险、依赖、延期信号定义
- 订阅、周报和导出都必须复用正式口径，不得另起字段体系

## Deliverables

- 通知订阅机制
- 周报摘要导出
- 管理视图导出能力
- 订阅与导出边界规则

## Acceptance Criteria

- 常见项目状态汇总可自动导出
- 订阅机制可覆盖核心运营场景
- 周报和导出必须复用组合视图与正式运营口径

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 管理者无需人工汇总 Excel 即可查看项目组合状态 | 本 task 通过周报和导出提供辅助支撑，但不主承接组合视图能力 |
| 报表口径连续两个 Sprint 稳定 | 本 task 只消费稳定口径，不主承接口径定义 |
| 至少可支持多个团队并行查看与管理 | 本 task 通过订阅、周报和导出提供辅助支撑 |
| 管理视图形成可信、可解释的数据口径 | 本 task 必须复用上游口径，不得自行定义冲突规则 |

## Risks

- 如果订阅和导出引入独立统计逻辑，会破坏 P3 的统一口径
- 周报内容如果过度扩展，容易越过 P3 的最小运营范围
- 导出粒度如果要求过细，会拖慢首版落地

## Open Questions

- 周报在 P3 是否只覆盖组合状态、风险、依赖和延期信号摘要
- 订阅是否只要求按组合、项目和角色做最小粒度分发
- 导出是否只要求常见格式，不要求复杂自定义模板

## Execution Assumptions

- `task-01` 已提供组合视图入口。
- `task-02` 已提供正式运营口径与风险/依赖/延期输出。
- 本 task 默认只消费上游结果，不自行定义统计公式。
- 推荐落点：
  - `apps/api/src/modules/subscriptions/*`
  - `apps/api/src/modules/weekly-summaries/*`
  - `apps/api/src/modules/exports/*`
  - `apps/web/src/app/(authenticated)/subscriptions/*`
  - `tests/e2e/portfolio/weekly-summary-export-flow.spec.ts`

## Steps

### Step 1: 冻结订阅粒度、周报范围与导出列清单

- Goal: 把订阅、周报和导出的边界先收敛成固定清单
- Why: 不先收敛范围，这个 task 很容易膨胀成报表平台
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-011-subscription-weekly-export-scope.md`
  - `<implementation-repo>/packages/domain/src/subscriptions/subscription.enums.ts`
  - `<implementation-repo>/packages/domain/src/exports/export-columns.ts`
- Preconditions:
  - P3 正式运营口径已冻结
- Actions:
  1. 冻结订阅粒度：按组合、项目、角色。
  2. 冻结周报内容：组合状态、风险、依赖、延期信号摘要。
  3. 冻结导出列清单，明确列来源只来自上游口径。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- subscriptions`
- Expected Output:
  - 订阅/周报/导出范围 ADR
  - 枚举与导出列定义
- Acceptance:
  - 每一列和每一类摘要都有来源说明
  - 本 task 不新增统计公式
- Evidence:
  - ADR 路径
  - 类型测试输出
- Notes:
  - 不在此步实现调度器

### Step 2: 实现订阅模型与权限测试

- Goal: 让用户可以保存最小订阅偏好，并受权限约束
- Why: 订阅是周报和导出的触发入口
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/subscriptions/*`
  - `<implementation-repo>/apps/api/test/subscription-permissions.spec.ts`
  - `<implementation-repo>/packages/shared/src/subscriptions/*.ts`
- Preconditions:
  - Step 1 已冻结订阅粒度
- Actions:
  1. 定义订阅实体，包含范围、接收角色、频率和启用状态。
  2. 编写权限测试，覆盖无权限用户不可订阅无关组合或项目。
  3. 实现订阅创建、更新、停用 API。
- Commands:
  - `pnpm --filter api test -- subscription-permissions`
  - `pnpm --filter api test -- subscriptions`
- Expected Output:
  - 订阅模块
  - 订阅权限测试
- Acceptance:
  - 订阅可按组合/项目/角色保存
  - 越权订阅会失败
- Evidence:
  - 测试输出
  - API 响应样例
- Notes:
  - 不引入复杂消息编排

### Step 3: 实现 Weekly Summary 生成服务与合同测试

- Goal: 从正式运营口径生成固定结构的周报摘要
- Why: 周报必须复用正式口径，不能让导出层再次计算
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/weekly-summaries/weekly-summary.service.ts`
  - `<implementation-repo>/apps/api/test/weekly-summary-contract.spec.ts`
  - `<implementation-repo>/apps/api/test/fixtures/weekly-summary/*`
- Preconditions:
  - Step 1 已冻结周报内容边界
  - `task-02` 已有正式消费 contract
- Actions:
  1. 实现周报摘要服务，消费组合状态、风险、依赖和延期信号。
  2. 编写 contract test，约束周报字段结构和来源。
  3. 准备 fixture，验证同一输入生成同一摘要结果。
- Commands:
  - `pnpm --filter api test -- weekly-summary-contract`
  - `pnpm --filter api test -- weekly-summary`
- Expected Output:
  - 周报摘要服务
  - 周报 contract test
- Acceptance:
  - 周报输出完全复用上游正式口径
  - 相同输入生成稳定摘要
- Evidence:
  - 测试输出
  - 摘要样例
- Notes:
  - 不在此步实现导出格式

### Step 4: 实现导出服务与格式化测试

- Goal: 把组合视图与周报摘要导出为固定格式
- Why: 管理层和 PMO 仍需要可分享的导出产物
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/exports/export.service.ts`
  - `<implementation-repo>/apps/api/test/export-formatter.spec.ts`
  - `<implementation-repo>/packages/shared/src/exports/*.ts`
- Preconditions:
  - Step 3 已有稳定周报输出
- Actions:
  1. 实现导出服务，至少支持一种表格型格式和一种摘要型格式。
  2. 编写格式化测试，约束列顺序、时间格式和缺失值表现。
  3. 确保导出列只来自 Step 1 冻结清单。
- Commands:
  - `pnpm --filter api test -- export-formatter`
  - `pnpm --filter api test -- export`
- Expected Output:
  - 导出服务
  - 导出格式测试
- Acceptance:
  - 常见项目状态汇总可自动导出
  - 导出格式稳定、列顺序明确
- Evidence:
  - 测试输出
  - 导出样例文件
- Notes:
  - 不实现自定义模板系统

### Step 5: 实现订阅页、周报预览与导出入口

- Goal: 给管理者和 PMO 提供可直接操作的订阅与导出界面
- Why: 如果只有后端服务，运营效率目标无法真正落地
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/subscriptions/page.tsx`
  - `<implementation-repo>/apps/web/src/features/subscriptions/components/*`
  - `<implementation-repo>/apps/web/src/features/exports/components/export-button.tsx`
- Preconditions:
  - Step 2 至 Step 4 已提供订阅、周报、导出 API
- Actions:
  1. 实现订阅管理页，支持启停与范围选择。
  2. 实现周报摘要预览组件。
  3. 在组合视图或周报页增加导出按钮和下载入口。
- Commands:
  - `pnpm --filter web test -- subscriptions`
  - `pnpm --filter web test -- export-button`
  - `pnpm --filter web build`
- Expected Output:
  - 订阅管理页
  - 周报预览与导出入口
- Acceptance:
  - 用户可配置最小订阅
  - 用户可预览并导出周报摘要
- Evidence:
  - 前端测试输出
  - 页面截图
- Notes:
  - 不在此步实现复杂审批或群发平台

### Step 6: 实现调度与幂等验证

- Goal: 让周报和导出可以按固定节奏生成且不会重复污染数据
- Why: 订阅一旦开始执行，就必须具备最小幂等性
- Target Files/Paths:
  - `<implementation-repo>/apps/worker/src/jobs/weekly-summary.job.ts`
  - `<implementation-repo>/apps/api/test/weekly-summary-idempotency.spec.ts`
  - `<implementation-repo>/apps/worker/test/weekly-summary.job.spec.ts`
- Preconditions:
  - Step 3 已有周报生成服务
- Actions:
  1. 在 worker 中增加每周摘要作业。
  2. 编写幂等测试，覆盖同一订阅在同一窗口重复执行时不会产生重复记录。
  3. 明确失败重试和日志记录边界。
- Commands:
  - `pnpm --filter worker test -- weekly-summary-job`
  - `pnpm --filter api test -- weekly-summary-idempotency`
- Expected Output:
  - 周报调度作业
  - 幂等测试
- Acceptance:
  - 相同窗口重复执行不会产生重复周报
  - 失败可重试且有日志
- Evidence:
  - 测试输出
  - 作业日志样例
- Notes:
  - 不扩展成复杂调度平台

### Step 7: 执行订阅、周报与导出主路径验证

- Goal: 用端到端流程证明 P3 的分发与导出能力成立
- Why: 这是“减少人工汇总”的直接证据
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/portfolio/weekly-summary-export-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p3-weekly-summary-export-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 编写 e2e：创建订阅 -> 生成周报 -> 预览摘要 -> 导出下载。
  2. 记录烟雾检查文档，标明周报和导出均复用正式运营口径。
  3. 运行根级测试与构建。
- Commands:
  - `pnpm --filter e2e test -- weekly-summary-export-flow`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 订阅与导出主路径 e2e
  - P3 分发与导出 runbook
- Acceptance:
  - 常见项目状态汇总无需人工整理即可输出
  - 根级测试和构建通过
- Evidence:
  - e2e 输出
  - runbook 路径
- Notes:
  - 复杂企业级报表分发平台不在 P3 范围
