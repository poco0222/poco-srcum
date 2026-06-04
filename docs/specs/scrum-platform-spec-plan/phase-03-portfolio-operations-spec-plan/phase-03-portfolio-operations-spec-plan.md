# Phase 03 Portfolio Operations Spec Plan

> Author: PopoY
> Created: 2026-06-04
> Status: Draft
> Parent Spec: `phase-03-portfolio-operations-spec.md`

## Objective

将 P3 跨项目与运营视图能力拆成执行任务，确保数据口径稳定、管理视图可落地，而不是只堆报表页面。

## Scope

- 多项目组合与路线图
- 报表、风险、依赖、延期信号
- 订阅、周报、导出

## Out Of Scope

- 不引入财务成本核算、重型 BI 平台或人力资源系统级产能规划
- 不提前引入 P4 的审计、SSO、备份恢复和发布治理能力
- 不把 P3 的轻量管理视图扩展成复杂指挥大屏或高度定制化分析平台
- 不重做 P1/P2 的基础对象建模、评审流和文档沉淀逻辑

## Dependencies

- P1/P2 的核心对象编号、状态命名和完成定义已冻结
- P1/P2 已沉淀稳定的结构化数据，尤其是工作项、Sprint、验收、文档和评审状态
- 报表和运营视图必须建立在连续多个 Sprint 的真实历史记录之上
- `task-02-reporting-and-risk-tracking.md` 负责定义运营口径，其他 task 只能消费，不得另起统计口径

## Task Index

| Task | Goal | Status |
| --- | --- | --- |
| `task-01-portfolio-and-roadmap-view.md` | 建立项目组合与路线图主视图 | planned |
| `task-02-reporting-and-risk-tracking.md` | 建立报表口径、风险台账、依赖追踪与延期信号 | planned |
| `task-03-subscription-weekly-summary-and-exports.md` | 建立订阅、周报和导出能力 | planned |

## Milestone

完成本计划后，系统应能支撑管理层和 PMO 查看多个团队的节奏、风险与依赖。

## Phase Mapping Rules

- 每条 `Acceptance Criteria`（验收标准）和 `Exit Criteria`（退出标准）必须有唯一 `Primary Task`（主承接任务）
- 允许存在 `Supporting Task`（辅助承接任务），但 phase 级完成判断优先以 `Primary Task` 为准

## Phase Acceptance Mapping

| Phase Acceptance Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 管理者无需人工汇总 Excel 即可查看项目组合状态 | `task-01-portfolio-and-roadmap-view.md` | `task-02`, `task-03` |
| 依赖、风险、延期信号可识别 | `task-02-reporting-and-risk-tracking.md` | `task-01` |
| 报表口径连续两个 Sprint 稳定 | `task-02-reporting-and-risk-tracking.md` | `task-03` |

## Phase Exit Mapping

| Phase Exit Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 至少可支持多个团队并行查看与管理 | `task-01-portfolio-and-roadmap-view.md` | `task-02`, `task-03` |
| 管理视图形成可信、可解释的数据口径 | `task-02-reporting-and-risk-tracking.md` | `task-01`, `task-03` |

## Open Questions

- “并行查看与管理”的最小边界是否只要求聚合、筛选、钻取和状态查看，不包含复杂治理动作
- 周报与导出的默认口径是否必须完全复用运营报表口径
- 依赖、风险、延期信号在 P3 是否只要求识别与跟踪，不要求自动处置

## Rules

- `task-02-reporting-and-risk-tracking.md` 是 P3 运营口径唯一主承接任务，其他 task 不得自定义冲突口径
- 任何报表、导出和周报字段变更都必须同步更新 phase `spec` 与 task 文档
- P3 不得越界引入 P4 治理能力，也不得回头重塑 P1/P2 基础对象模型
- 组合视图、周报和导出只能消费现有结构化数据，不得以展示层逻辑替代正式口径定义
