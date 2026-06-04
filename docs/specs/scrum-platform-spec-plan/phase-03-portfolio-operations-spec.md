# Phase 03 Portfolio Operations Spec

> Author: PopoY
> Created: 2026-06-04
> Status: Draft

## Objective

在单团队可稳定使用的前提下，扩展到多个 Scrum 团队并行管理场景，为管理层和 PMO 提供跨项目、跨 Sprint 的运营与风险视图。

## Business Value

P3 解决“多项目怎么一起看、怎么发现依赖和风险、怎么减少人工汇总”的问题。

## In Scope

- 多项目与项目组合视图
- 路线图与里程碑视图
- 依赖管理
- 进度、速度、完成率、缺陷趋势、阻塞时长等报表
- 风险台账、升级机制、周报导出

## Out Of Scope

- 财务成本核算
- 重型 BI 平台
- 人力资源系统级产能规划

## Inputs

- P1 与 P2 已稳定沉淀的结构化数据
- 连续多个 Sprint 的真实使用记录

## Outputs

- 一套跨项目运营视图规格
- 一组对应执行任务文档

## Included Tasks

- `task-01-portfolio-and-roadmap-view.md`
- `task-02-reporting-and-risk-tracking.md`
- `task-03-subscription-weekly-summary-and-exports.md`

## Acceptance Criteria

- 管理者无需人工汇总 Excel 即可查看项目组合状态
- 依赖、风险、延期信号可识别
- 报表口径连续两个 Sprint 稳定

## Risks

- 基础数据口径不稳定导致报表失真
- 组合视图过重影响一线团队录入体验

## Dependencies

- P1/P2 中编号、状态、完成定义已冻结
- P2 文档与评审数据已具备追溯链

## Exit Criteria

- 至少可支持多个团队并行查看与管理
- 管理视图形成可信、可解释的数据口径
