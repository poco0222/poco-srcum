# Task 02 Reporting And Risk Tracking

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P3
> Parent Spec: `phase-03-portfolio-operations-spec.md`
> Parent Plan: `phase-03-portfolio-operations-spec-plan.md`

## Objective

建立报表、风险台账、依赖追踪与延期信号能力，形成项目运营的基础事实视图和统一数据口径。

## Background

P3 的难点不在于堆页面，而在于形成可信、可解释的运营口径。如果数据口径不稳定，组合视图、周报和导出都会失真，整个 phase 会失去可信度。

## Scope

- 定义速度、完成率、缺陷、阻塞时长等报表口径
- 建立风险台账与依赖追踪模型
- 建立延期信号的最小识别规则
- 为组合视图、周报和导出提供统一运营数据口径

## Out Of Scope

- 不负责多项目组合视图和路线图展示，这部分由 `task-01-portfolio-and-roadmap-view.md` 主承接
- 不负责订阅、周报分发和导出能力，这部分由 `task-03-subscription-weekly-summary-and-exports.md` 主承接
- 不扩展重型 BI、复杂预测模型或财务分析体系
- 不引入 P4 的审计、容量治理和运维手册能力

## Inputs

- P3 `spec` 与 `phase plan`
- P1/P2 已冻结的对象模型、状态命名、完成定义和评审状态
- 连续多个 Sprint 的真实历史数据
- `task-01-portfolio-and-roadmap-view.md` 对视图消费口径的需求

## Dependencies

- P1/P2 的核心对象、状态和编号规则必须稳定
- 连续多个 Sprint 的历史记录必须可用，才能验证口径稳定性
- `task-01-portfolio-and-roadmap-view.md` 与 `task-03-subscription-weekly-summary-and-exports.md` 都依赖本 task 输出统一运营口径

## Deliverables

- 速度、完成率、缺陷、阻塞报表
- 风险台账
- 依赖追踪模型
- 延期信号规则
- 统一运营数据口径说明

## Acceptance Criteria

- 报表口径在连续两个 Sprint 内保持稳定
- 风险、依赖和延期信号可被管理层识别和追踪
- 组合视图、周报和导出消费同一套运营口径

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 依赖、风险、延期信号可识别 | 本 task 主承接风险台账、依赖追踪和延期信号定义 |
| 报表口径连续两个 Sprint 稳定 | 本 task 主承接口径定义和稳定性验证 |
| 管理视图形成可信、可解释的数据口径 | 本 task 主承接运营口径、计算规则和解释边界 |
| 管理者无需人工汇总 Excel 即可查看项目组合状态 | 本 task 只提供正式口径，不主承接组合视图本身 |

## Risks

- 历史数据质量不足会直接影响口径可信度
- 延期信号如果定义过于复杂，会拖慢 P3 落地
- 如果导出和周报绕过本 task 自定义字段，会破坏统一口径

## Open Questions

- 延期信号在 P3 是否只要求规则识别，不要求自动预测
- 报表稳定性的最小验证周期是否固定为连续两个 Sprint
- 风险与依赖在 P3 是否只要求记录、状态和升级信号，不要求复杂审批流程

## Execution Assumptions

- 本 task 是 P3 运营口径唯一主承接任务。
- 默认输出会被 `task-01` 和 `task-03` 直接消费，因此必须先冻结字段、公式和 fixture。
- 推荐落点：
  - `packages/domain/src/reporting/*`
  - `apps/api/src/modules/reporting/*`
  - `apps/api/src/modules/risk-register/*`
  - `apps/api/src/modules/dependencies/*`
  - `apps/api/test/reporting/*.spec.ts`
  - `apps/api/test/fixtures/reporting/*`

## Steps

### Step 1: 冻结指标口径、时间窗口与异常数据处理规则

- Goal: 把速度、完成率、缺陷、阻塞时长等指标公式写成不可歧义的口径说明
- Why: 不先冻结口径，Portfolio 和导出都会消费到不同版本的统计
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-010-reporting-metrics.md`
  - `<implementation-repo>/packages/domain/src/reporting/report-metric.enums.ts`
  - `<implementation-repo>/packages/domain/src/reporting/report-formulas.ts`
- Preconditions:
  - P1/P2 核心对象、完成定义和状态命名已冻结
- Actions:
  1. 为每项指标写明公式、时间窗口、空值和异常值处理方式。
  2. 明确“连续两个 Sprint 稳定”采用 fixture replay 验证。
  3. 在 `packages/domain` 导出统一指标枚举和公式入口。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- reporting`
- Expected Output:
  - 正式运营口径 ADR
  - 指标枚举与公式入口
- Acceptance:
  - 每项指标都有明确计算规则
  - 数据漂移验证方式被写死
- Evidence:
  - ADR 路径
  - 公式测试输出
- Notes:
  - 不在此步实现报表 API

### Step 2: 构建连续 Sprint Fixture 与基准快照

- Goal: 为报表稳定性和风险规则提供可重复回放的数据样本
- Why: 没有固定 fixture，就无法证明口径在两个 Sprint 间稳定
- Target Files/Paths:
  - `<implementation-repo>/apps/api/test/fixtures/reporting/sprint-history-a.json`
  - `<implementation-repo>/apps/api/test/fixtures/reporting/sprint-history-b.json`
  - `<implementation-repo>/apps/api/test/reporting/reporting-stability.spec.ts`
- Preconditions:
  - Step 1 已冻结公式和时间窗口
- Actions:
  1. 准备两个连续 Sprint 的 fixture 数据，覆盖完成项、缺陷、阻塞和延期样本。
  2. 编写稳定性测试，回放 fixture 并输出基准快照。
  3. 记录基准文件变更准入规则，避免随意修改统计结果。
- Commands:
  - `pnpm --filter api test -- reporting-stability`
- Expected Output:
  - 连续 Sprint fixture
  - 稳定性基准测试
- Acceptance:
  - 相同 fixture 多次回放结果一致
  - 快照变更有明确原因
- Evidence:
  - 测试输出
  - fixture 文件路径
- Notes:
  - 这一步先不实现页面

### Step 3: 实现报表计算服务与指标接口

- Goal: 提供统一的报表数据计算与查询能力
- Why: 口径说明必须通过服务层固定下来，不能只停留在文档
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/reporting/reporting.service.ts`
  - `<implementation-repo>/apps/api/src/modules/reporting/reporting.controller.ts`
  - `<implementation-repo>/apps/api/test/reporting/reporting-metrics.spec.ts`
- Preconditions:
  - Step 2 已有 fixture 和稳定性测试
- Actions:
  1. 实现报表计算服务，统一复用 Step 1 的公式定义。
  2. 编写指标接口测试，覆盖速度、完成率、缺陷、阻塞时长。
  3. 保证结果结构能被 Portfolio 与导出模块直接消费。
- Commands:
  - `pnpm --filter api test -- reporting-metrics`
  - `pnpm --filter api test -- reporting`
- Expected Output:
  - 报表 API
  - 指标测试
- Acceptance:
  - 所有报表结果都来自统一公式
  - 结果结构稳定可消费
- Evidence:
  - 测试输出
  - 示例响应
- Notes:
  - 不在此步定义 UI 展示

### Step 4: 实现风险台账与依赖追踪模型

- Goal: 让风险和依赖从“描述性字段”升级为结构化台账
- Why: 没有结构化台账，延期信号无法追踪也无法解释
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/risk-register/*`
  - `<implementation-repo>/apps/api/src/modules/dependencies/*`
  - `<implementation-repo>/apps/api/test/risk-register.spec.ts`
  - `<implementation-repo>/apps/api/test/dependency-tracking.spec.ts`
- Preconditions:
  - Step 1 已冻结口径边界
- Actions:
  1. 定义风险最小字段：`title / level / owner / status / targetDate / relatedProjectId`。
  2. 定义依赖最小字段：`fromProjectId / toProjectId / dependencyType / status / dueDate`。
  3. 编写风险与依赖测试，覆盖创建、更新、关闭和逾期状态。
- Commands:
  - `pnpm --filter api test -- risk-register`
  - `pnpm --filter api test -- dependency-tracking`
- Expected Output:
  - 风险台账模块
  - 依赖追踪模块
- Acceptance:
  - 风险和依赖都能结构化记录并更新状态
  - 逾期和阻塞状态可被后续规则消费
- Evidence:
  - 测试输出
  - 数据模型片段
- Notes:
  - 不实现复杂审批流程

### Step 5: 实现延期信号规则与规则测试

- Goal: 把“延期风险”落成可重复计算的规则，而不是人工主观判断
- Why: 这是 P3 最容易漂移的口径之一
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/reporting/delay-signal.rules.ts`
  - `<implementation-repo>/apps/api/src/modules/reporting/delay-signal.service.ts`
  - `<implementation-repo>/apps/api/test/delay-signal.spec.ts`
- Preconditions:
  - Step 3 已有报表服务
  - Step 4 已有风险与依赖台账
- Actions:
  1. 冻结最小延期信号规则，例如里程碑逾期、阻塞时长超阈值、依赖未解除。
  2. 编写规则测试，覆盖命中与未命中两类样本。
  3. 将信号输出归一化为可被 Portfolio 与周报消费的结构。
- Commands:
  - `pnpm --filter api test -- delay-signal`
  - `pnpm --filter domain test -- delay-signal`
- Expected Output:
  - 延期信号规则模块
  - 命中/未命中测试
- Acceptance:
  - 延期信号规则可重复计算
  - 输出字段对下游保持稳定
- Evidence:
  - 测试输出
  - 规则表
- Notes:
  - 不做自动预测模型

### Step 6: 输出消费契约并做跨模块回归验证

- Goal: 确保 Portfolio 和导出模块只消费本 task 输出的正式口径
- Why: 如果消费方自己补字段，P3 统一口径会立刻失效
- Target Files/Paths:
  - `<implementation-repo>/packages/shared/src/reporting/consumer-contracts.ts`
  - `<implementation-repo>/apps/api/test/reporting-consumer-contract.spec.ts`
- Preconditions:
  - Step 3 至 Step 5 已提供报表、风险、依赖、延期输出
- Actions:
  1. 定义给 Portfolio 与周报导出的统一消费 contract。
  2. 编写 contract test，防止字段漂移或重命名。
  3. 记录哪些字段禁止由消费方自行重算。
- Commands:
  - `pnpm --filter api test -- reporting-consumer-contract`
- Expected Output:
  - 消费契约定义
  - 跨模块 contract test
- Acceptance:
  - Portfolio 和导出模块能基于一套 contract 对接
  - 字段漂移会立即被测试捕获
- Evidence:
  - 测试输出
  - contract 文件片段
- Notes:
  - 不在此步实现消费端页面

### Step 7: 执行口径稳定性与风险追踪主路径验证

- Goal: 用回放和主路径测试证明 P3 口径可信、可解释
- Why: P3 的价值不在页面，而在“可相信”的数据
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/portfolio/reporting-risk-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/p3-reporting-risk-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 执行 fixture replay 与主路径测试，验证连续两个 Sprint 输出稳定。
  2. 记录风险台账、依赖状态、延期信号的人工巡检步骤。
  3. 运行根级测试与构建。
- Commands:
  - `pnpm --filter api test -- reporting-stability`
  - `pnpm --filter e2e test -- reporting-risk-flow`
  - `pnpm -r build`
- Expected Output:
  - 稳定性验证结果
  - P3 风险与报表 runbook
- Acceptance:
  - 连续两个 Sprint 口径稳定
  - 管理视图可解释风险与延期信号来源
- Evidence:
  - 测试输出
  - runbook 路径
- Notes:
  - 只有完成此步，P3 才具备可信口径基础
