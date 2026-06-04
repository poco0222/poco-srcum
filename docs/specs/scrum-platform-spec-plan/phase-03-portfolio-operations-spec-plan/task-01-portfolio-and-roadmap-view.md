# Task 01 Portfolio And Roadmap View

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P3
> Parent Spec: `phase-03-portfolio-operations-spec.md`
> Parent Plan: `phase-03-portfolio-operations-spec-plan.md`

## Objective

建立项目组合、路线图和里程碑主视图，让管理层可在统一视角查看多个项目。

## Background

P1/P2 解决的是单团队执行与文档协作；P3 的第一步必须先把多个项目与团队放进同一视图，否则后续报表、风险和周报都失去统一入口。

## Scope

- 建立多项目组合视图
- 建立路线图与里程碑视图
- 定义跨项目聚合、筛选和钻取的最小查看边界
- 消费依赖、风险和延期信号进行展示，但不负责定义这些信号本身

## Out Of Scope

- 不负责定义报表口径、风险状态、依赖追踪规则和延期信号，这部分由 `task-02-reporting-and-risk-tracking.md` 主承接
- 不负责周报摘要、订阅和导出分发，这部分由 `task-03-subscription-weekly-summary-and-exports.md` 主承接
- 不扩展财务、成本或复杂资源规划视图
- 不把组合视图扩展成复杂治理或指挥大屏

## Inputs

- P3 `spec` 与 `phase plan`
- P1/P2 已冻结的项目、Sprint、工作项、文档、验收基础数据
- `task-02-reporting-and-risk-tracking.md` 输出的风险、依赖和延期信号定义
- 跨团队查看场景中的真实管理需求

## Dependencies

- `task-02-reporting-and-risk-tracking.md`：提供依赖、风险和延期信号的定义与数据口径
- 已冻结的核心对象标识、项目层级和里程碑基础概念
- `task-03-subscription-weekly-summary-and-exports.md` 依赖本 task 提供稳定的组合视图消费入口

## Deliverables

- 多项目组合模型
- 路线图视图
- 里程碑视图
- 跨项目聚合与钻取边界

## Acceptance Criteria

- 管理者可稳定查看多个项目、路线图和里程碑状态
- 组合视图可支撑按项目组合、项目和里程碑进行聚合、筛选和钻取
- 视图可消费并展示上游定义好的风险、依赖和延期信号

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 管理者无需人工汇总 Excel 即可查看项目组合状态 | 本 task 主承接项目组合、路线图和里程碑统一视图 |
| 至少可支持多个团队并行查看与管理 | 本 task 主承接跨团队查看、聚合、筛选和钻取能力 |
| 依赖、风险、延期信号可识别 | 本 task 只负责展示和消费这些信号，主承接在 `task-02-reporting-and-risk-tracking.md` |
| 管理视图形成可信、可解释的数据口径 | 本 task 只消费正式口径，不主承接口径定义 |

## Risks

- 组合视图如果承担过多统计逻辑，会与 `task-02-reporting-and-risk-tracking.md` 的口径职责冲突
- 里程碑和路线图如果建模过细，会把 P3 拉向复杂项目管理产品
- “并行管理”的语义如果不收敛，容易引入范围膨胀

## Open Questions

- “管理”在 P3 是否只代表查看、筛选、聚合和钻取，不包含跨项目批量操作
- 路线图视图是否只要求按里程碑和时间维度展示，不要求复杂拖拽排程
- 组合视图是否需要在首版就支持多层级 portfolio 聚合

## Execution Assumptions

- `task-02-reporting-and-risk-tracking.md` 会主承接正式运营口径与风险/依赖/延期信号。
- 本 task 默认先消费稳定口径，不自行定义新统计字段。
- 推荐落点：
  - `apps/api/src/modules/portfolio/*`
  - `apps/web/src/app/(authenticated)/portfolio/*`
  - `apps/web/src/features/portfolio/*`
  - `tests/e2e/portfolio/*.spec.ts`

## Steps

### Step 1: 确认 Portfolio 视图消费字段与真实模块路径

- Goal: 把组合视图依赖的项目、里程碑、风险、延期信号字段清单写死
- Why: 组合视图只能消费统一口径，不能自己临时拼字段
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-009-portfolio-view-contract.md`
  - `<implementation-repo>/apps/web/src/features/portfolio/api/contracts.ts`
- Preconditions:
  - P1/P2 核心对象模型已冻结
- Actions:
  1. 列出项目卡片、路线图、里程碑、风险角标所需字段。
  2. 在 ADR 中标明哪些字段来自 `task-02` 的正式口径，哪些来自基础项目模型。
  3. 在前端 API contract 中定义消费接口草案。
- Commands:
  - `rg --hidden --glob '!node_modules/**' 'portfolio|roadmap|milestone|risk'`
  - `pnpm --filter web typecheck`
- Expected Output:
  - 组合视图字段契约
  - 模块路径对齐表
- Acceptance:
  - 前端消费字段不再模糊
  - 每个字段都能追溯到上游来源
- Evidence:
  - ADR 路径
  - contract 文件片段
- Notes:
  - 不在此步实现页面

### Step 2: 定义 Portfolio 聚合模型与里程碑结构

- Goal: 把多项目组合、路线图、里程碑的最小数据结构固定下来
- Why: 没有统一聚合模型，页面会直接耦合多个后端对象
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/portfolio/portfolio.types.ts`
  - `<implementation-repo>/packages/domain/src/portfolio/milestone.enums.ts`
  - `<implementation-repo>/apps/api/test/portfolio-aggregate.spec.ts`
- Preconditions:
  - Step 1 已冻结消费字段
- Actions:
  1. 定义 `PortfolioProjectSummary`、`RoadmapMilestone`、`PortfolioFilter` 等类型。
  2. 编写测试，约束项目聚合、里程碑排序和空态结果。
  3. 明确 P3 首版不支持跨项目批量编辑。
- Commands:
  - `pnpm --filter domain test -- portfolio`
  - `pnpm --filter api test -- portfolio-aggregate`
- Expected Output:
  - Portfolio 领域类型
  - 聚合测试
- Acceptance:
  - 组合视图有稳定数据结构
  - 空项目组合返回结构已定义
- Evidence:
  - 测试输出
  - 类型定义片段
- Notes:
  - 不实现统计公式

### Step 3: 实现 Portfolio API 与筛选/钻取契约测试

- Goal: 提供组合视图所需的聚合查询、筛选和钻取接口
- Why: 前端页面必须基于稳定查询接口构建
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/portfolio/portfolio.controller.ts`
  - `<implementation-repo>/apps/api/src/modules/portfolio/portfolio.service.ts`
  - `<implementation-repo>/apps/api/test/portfolio-drilldown.spec.ts`
- Preconditions:
  - Step 2 已有聚合模型
- Actions:
  1. 先写筛选和钻取测试，覆盖按项目组合、项目状态、里程碑时间窗筛选。
  2. 实现列表聚合接口和项目钻取接口。
  3. 为风险、依赖、延期信号预留只读展示字段。
- Commands:
  - `pnpm --filter api test -- portfolio-drilldown`
  - `pnpm --filter api test -- portfolio`
- Expected Output:
  - Portfolio 查询 API
  - 筛选与钻取测试
- Acceptance:
  - 管理者可按项目组合和里程碑筛选
  - 钻取结果有稳定结构
- Evidence:
  - 测试输出
  - 示例响应
- Notes:
  - 不在此步定义风险口径

### Step 4: 实现 Portfolio 页面、路线图视图与空态规范

- Goal: 让管理者可直接在前端查看组合、路线图和里程碑
- Why: P3 的入口必须是统一视图，而不是若干分散接口
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/(authenticated)/portfolio/page.tsx`
  - `<implementation-repo>/apps/web/src/features/portfolio/components/portfolio-filters.tsx`
  - `<implementation-repo>/apps/web/src/features/portfolio/components/roadmap-timeline.tsx`
  - `<implementation-repo>/apps/web/src/features/portfolio/__tests__/portfolio-page.spec.tsx`
- Preconditions:
  - Step 3 已提供 Portfolio API
- Actions:
  1. 实现 Portfolio 页面和基础筛选组件。
  2. 实现路线图/里程碑时间线视图，不引入拖拽排程。
  3. 编写空态、异常态和无权限态前端测试。
- Commands:
  - `pnpm --filter web test -- portfolio-page`
  - `pnpm --filter web build`
- Expected Output:
  - Portfolio 页面
  - 路线图时间线组件
- Acceptance:
  - 可查看多项目组合与里程碑状态
  - 空态和异常态有明确表现
- Evidence:
  - 测试输出
  - 页面截图
- Notes:
  - 不做复杂大屏

### Step 5: 接入风险、依赖与延期信号展示

- Goal: 把 `task-02` 的正式信号结果挂到组合视图中
- Why: Phase 验收要求管理者能看到风险和延期信号，但本 task 只负责展示
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/features/portfolio/components/risk-badges.tsx`
  - `<implementation-repo>/apps/api/test/portfolio-signal-contract.spec.ts`
- Preconditions:
  - `task-02` 已提供正式风险、依赖、延期信号 API
- Actions:
  1. 编写 contract test，约束 Portfolio 只消费 `task-02` 输出字段。
  2. 在项目卡片与路线图项上展示风险角标和延期提示。
  3. 避免在前端自行重新计算风险状态。
- Commands:
  - `pnpm --filter api test -- portfolio-signal-contract`
  - `pnpm --filter web test -- risk-badges`
- Expected Output:
  - 风险/延期信号展示组件
  - 消费契约测试
- Acceptance:
  - Portfolio 页面可以展示上游正式信号
  - 本 task 不新增独立统计逻辑
- Evidence:
  - 测试输出
  - 页面截图
- Notes:
  - 信号定义仍由 `task-02` 主承接

### Step 6: 执行 Portfolio 主路径验证

- Goal: 用端到端流程证明组合视图可替代人工汇总 Excel
- Why: 这是 P3 的关键对外价值
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/portfolio/portfolio-roadmap-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p3-portfolio-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 5 已完成
- Actions:
  1. 编写 e2e：打开组合页 -> 筛选项目组合 -> 查看路线图 -> 钻取项目详情。
  2. 记录烟雾检查文档，注明哪些字段来自正式运营口径。
  3. 验证根级构建和测试命令。
- Commands:
  - `pnpm --filter e2e test -- portfolio-roadmap-flow`
  - `pnpm -r build`
- Expected Output:
  - Portfolio 主路径 e2e
  - P3 组合视图 runbook
- Acceptance:
  - 管理者可无需 Excel 查看组合状态
  - 根级构建仍通过
- Evidence:
  - e2e 输出
  - runbook 路径
- Notes:
  - 复杂治理动作不在 P3 首版
