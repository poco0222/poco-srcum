# Phase 01 Scrum Core Spec Plan

> Author: PopoY
> Created: 2026-06-04
> Status: Draft
> Parent Spec: `phase-01-scrum-core-spec.md`

## Objective

把 `Phase 01 Scrum Core Spec` 拆成可执行任务，确保 P1 最终形成真实团队可用的 Scrum 主流程闭环，而不是零散功能集合。

## Scope

本计划仅覆盖 P1：

- 项目初始化与工程基础
- 工作项与 Backlog 核心模型
- Sprint 计划与执行主链路
- 验收、最小文档能力、基础交付附件挂接与通知

## Out Of Scope

- 不引入复杂报表、高级分析和多项目组合视图
- 不引入 P2 的文档版本协作、评论与评审流
- 不引入 SSO、复杂审计、灰度发布、备份恢复等 P4 治理能力
- 不引入产品内建 AI 能力

## Dependencies

- 核心领域命名、状态流转枚举和完成定义命名需要先冻结
- 登录方式、项目成员边界和基础角色模型需要在 P1 前段明确
- P1 不做功能清单需要持续受控，避免 task 执行期范围膨胀
- `Retrospective`（复盘）主流程由 `task-03-sprint-and-execution.md` 主承接，`task-04-acceptance-doc-preview-notification.md` 仅提供文档沉淀支撑

## Task Index

| Task | Goal | Status |
| --- | --- | --- |
| `task-01-project-bootstrap-and-foundation.md` | 建立项目骨架、基础权限、核心约束 | done (7/7) |
| `task-02-work-item-and-backlog.md` | 建立统一工作项模型和 Backlog 主流程 | planned |
| `task-03-sprint-and-execution.md` | 建立 Sprint 计划、执行、看板、阻塞主链路 | planned |
| `task-04-acceptance-doc-preview-notification.md` | 建立验收、最小文档、基础交付附件挂接与通知闭环 | planned |

## Milestone

完成以上四个任务后，系统应达到以下状态：

- 一支团队可跑完整 Sprint
- Story、Task、Bug、Sprint、验收、复盘形成主链路
- 最小文档和基础交付附件挂接能力可支撑真实交付场景

## Phase Mapping Rules

- 每条 `Acceptance Criteria`（验收标准）和 `Exit Criteria`（退出标准）必须有唯一 `Primary Task`（主承接任务）
- 允许存在 `Supporting Task`（辅助承接任务），但 phase 级完成判断优先以 `Primary Task` 为准

## Phase Acceptance Mapping

| Phase Acceptance Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 一支真实团队能完整跑完一个 Sprint | `task-03-sprint-and-execution.md` | `task-01`, `task-02`, `task-04` |
| Story 进入 Sprint 前必须具备 `acceptance criteria` | `task-02-work-item-and-backlog.md` | `task-03`, `task-04` |
| 活跃 Sprint 的范围变更具备留痕 | `task-03-sprint-and-execution.md` | `task-04` |
| `Retrospective`（复盘）主流程可用 | `task-03-sprint-and-execution.md` | `task-04` |
| 验收失败后支持重新打开并可追溯 | `task-04-acceptance-doc-preview-notification.md` | `task-03` |
| Markdown 编辑、预览、保存稳定 | `task-04-acceptance-doc-preview-notification.md` | - |
| 关键事件通知与基础操作日志可用 | `task-04-acceptance-doc-preview-notification.md` | `task-01`, `task-03` |

## Phase Exit Mapping

| Phase Exit Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 可支持真实团队迁移到系统进行一次完整 Sprint 试运行 | `task-03-sprint-and-execution.md` | `task-01`, `task-02`, `task-04` |
| 主流程无 P0 / P1 阻断问题 | `task-03-sprint-and-execution.md` | `task-01`, `task-02`, `task-04` |
| 所有核心对象具备最小审计留痕 | `task-04-acceptance-doc-preview-notification.md` | `task-01`, `task-02`, `task-03` |

## Open Questions

- “基础交付附件挂接能力”的最小边界是否仅限挂接和基础预览
- P1 结束前是否需要为 phase-level 验收补一轮跨 task 联合演练说明

## Rules

- 任何任务不得越过 P1 范围引入 P2 / P3 能力
- 任何状态机和完成定义变更必须同步更新规格文档
- 所有任务都必须可独立审阅与独立验收
