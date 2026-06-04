# Phase 01 Scrum Core Spec

> Author: PopoY
> Created: 2026-06-04
> Status: Draft

## Objective

交付一个可上线的 `Scrum Core`（Scrum 核心闭环）版本，让一支真实团队可以在系统里完成从 `Product Backlog`（产品待办）到 `Sprint`（迭代）到执行、验收、复盘的完整主链路。

## Business Value

P1 的价值不是“功能多”，而是让系统第一次具备真实替换零散工具的能力。只要一支团队能稳定跑完完整 Sprint，后续文档协作、跨项目管理和治理能力才有意义。

## In Scope

- 团队、成员、角色、项目基础模型
- `Epic / Story / Task / Bug` 统一 `work item`（工作项）体系
- `Product Backlog` 排序、预估、验收标准录入
- `Sprint Planning`、`Sprint Goal`、`Sprint Execution`
- 看板、任务拆分、阻塞记录、每日更新入口
- 验收结果、驳回原因、重新打开、`Definition of Done`（完成定义）门禁
- 最小可用的 `Form + Markdown + Preview`
- 最小通知集与基础操作日志

## Out Of Scope

- 复杂报表与高级分析
- 多项目组合视图
- 文档版本协作与评审流
- SSO、复杂审计、灰度发布、备份恢复
- 产品内建 AI 生成能力

## Inputs

- 已确认的产品定位与技术栈路线
- 已确认的标准 Scrum 规则与关键约束
- 已确认的架构原则：`modular monolith`、`REST + OpenAPI`

## Outputs

- 一套可运行的 P1 产品规格
- 一组按功能拆分的执行任务文档
- 明确的上线门槛与验收标准

## Included Tasks

- `task-01-project-bootstrap-and-foundation.md`
- `task-02-work-item-and-backlog.md`
- `task-03-sprint-and-execution.md`
- `task-04-acceptance-doc-preview-notification.md`

## Acceptance Criteria

- 一支真实团队能完整跑完一个 Sprint
- Story 进入 Sprint 前必须具备 `acceptance criteria`
- 活跃 Sprint 的范围变更具备留痕
- 验收失败后支持重新打开并可追溯
- Markdown 编辑、预览、保存稳定
- 关键事件通知与基础操作日志可用

## Risks

- P1 包含过多 P2/P3 能力，导致节奏失控
- `work item` 统一模型设计不稳，后续扩展困难
- 完成定义和状态机写得过松，导致 Scrum 约束失真

## Dependencies

- 需要先确定核心领域命名与状态流转枚举
- 需要先确定登录方式与项目成员边界
- 需要先冻结 P1 中不做的功能清单

## Exit Criteria

- 可支持真实团队迁移到系统进行一次完整 Sprint 试运行
- 主流程无 P0 / P1 阻断问题
- 所有核心对象具备最小审计留痕
