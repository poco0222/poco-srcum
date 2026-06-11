# Scrum Platform Spec Plan

> Author: PopoY
> Created: 2026-06-04
> Status: Draft

## Objective

为 `POCO Scrum Platform` 制定从立项、开发到完整上线的总分期路线，明确每一期的目标、边界、验收标准，以及每一期对应的 `spec`（规格文档）和 `task`（任务文档）入口。

## Implementation Repository

- 本路线图对应的真实实现仓固定为 `https://github.com/poco0222/poco-srcum.git`。
- 本文及所有 phase `spec` / `task plan` 中出现的 `<implementation-repo>`，统一指向该仓库在本地的 clone 根目录。
- 开始任何 Codex 实现前，必须先在真实实现仓执行 `git remote get-url origin`，确认输出与固定仓库地址完全一致。

## Product Positioning

本项目是一个 `Scrum-first`（以 Scrum 为第一优先）的企业内部项目管理系统，服务于以 AI 辅助开发为主的小型研发团队，重点支撑以下业务闭环：

- `Product Backlog`（产品待办）管理
- `Sprint`（迭代）计划与执行
- `Review / Acceptance`（评审 / 验收）
- `Retrospective`（复盘）
- `Form + Markdown + Preview`（结构化表单 + Markdown 文档 + 在线预览）
- `Notification / Audit`（通知 / 审计）

## Architecture Baseline

- Frontend: `Next.js + TypeScript + Ant Design`
- Backend: `NestJS + Prisma`
- Data: `PostgreSQL`
- File Storage: `MinIO`
- Queue: `RabbitMQ`
- Architecture Style: `modular monolith`（模块化单体）

## Phase Breakdown

| Phase | Name | Recommended Duration | Core Goal | Exit Criteria |
| --- | --- | --- | --- | --- |
| P1 | Scrum 核心闭环可上线 | 8-10 周 | 跑通一支团队的完整 Sprint 主链路 | 一个真实团队能完整跑完 1 个 Sprint |
| P2 | 文档协作与评审闭环 | 6-8 周 | 补齐需求、方案、评审、验收文档闭环 | 文档、评审、验收可在系统内完整追溯 |
| P3 | 跨项目管理与运营视图 | 6-8 周 | 支撑多个 Scrum 团队并行管理 | 管理层可稳定查看项目组合、依赖、风险 |
| P4 | 治理、审计与稳定性强化 | 4-6 周 | 满足企业内部长期运行要求 | 审计、权限、监控、恢复达到推广标准 |

## Phase Sequence

### P1: Scrum 核心闭环可上线

重点交付 Scrum 主流程，不引入复杂报表和重型协作文档能力，确保系统首期不是“半套工具”，而是真能跑完整 Sprint。

对应 `spec`：

- `phase-01-scrum-core-spec.md`

对应 `task plan`：

- `phase-01-scrum-core-spec-plan/`

### P2: 文档协作与评审闭环

在 P1 的基础上强化方案编写、评审、版本历史、追溯链路，让系统从“任务管理”升级为“交付管理”。

对应 `spec`：

- `phase-02-document-collaboration-spec.md`

对应 `task plan`：

- `phase-02-document-collaboration-spec-plan/`

### P3: 跨项目管理与运营视图

支撑多个 Scrum 团队并行推进时的项目组合管理、风险管理和管理层视图。

对应 `spec`：

- `phase-03-portfolio-operations-spec.md`

对应 `task plan`：

- `phase-03-portfolio-operations-spec-plan/`

### P4: 治理、审计与稳定性强化

面向企业内部长期推广，补齐审计、细粒度权限、备份恢复、监控告警和企业接入能力。

对应 `spec`：

- `phase-04-governance-stability-spec.md`

对应 `task plan`：

- `phase-04-governance-stability-spec-plan/`

## Milestones

### M1: 首支 Scrum 团队可迁移到系统

要求：

- Backlog、Sprint、Task、验收、复盘主流程可用
- 基础权限和通知可用
- 核心页面性能可接受

### M2: 文档与评审不依赖外部零散工具

要求：

- 需求说明、技术方案、验收说明、复盘纪要可沉淀在系统内
- 评审、评论、版本历史可追溯

### M3: 多项目视角可稳定运行

要求：

- 管理层可查看项目组合、里程碑、依赖、风险
- 报表口径连续两个 Sprint 稳定

### M4: 达到企业内部推广标准

要求：

- 审计、恢复、监控、权限治理可通过内部检查
- 具备推广到更多团队的运维条件

## Delivery Rules

- 首期坚持 `Scrum-first`，不做多方法论混搭。
- 不在 P1 引入产品内建 AI 能力，只为外部 AI 协作预留结构化上下文。
- `Form + Markdown + Preview` 是长期主文档路线，不在首期引入在线 Office 协同。
- 所有 phase 必须先有 `spec`，再执行 `task`，不得跳过规格文档直接做实现。

## Spec Index

- `phase-01-scrum-core-spec.md`
- `phase-02-document-collaboration-spec.md`
- `phase-03-portfolio-operations-spec.md`
- `phase-04-governance-stability-spec.md`

## Risks And Dependencies

### Risks

- P1 范围膨胀，导致首期无法形成真实 Sprint 闭环
- Markdown 编辑与预览体验不稳定，影响系统采纳率
- P3 报表口径建立过早，基础数据不稳定导致指标失真
- P4 治理能力补得过晚，早期设计无法承接审计与权限要求

### Dependencies

- 需要明确内部使用团队、角色边界与 Scrum 运行方式
- 需要尽早确定登录方式、企业账号接入策略、部署约束
- 需要在 P1 就冻结核心领域模型与状态机命名

## Status Summary

| Item | Status |
| --- | --- |
| Master roadmap | done |
| P1 spec | planned |
| P2 spec | done |
| P3 spec | planned |
| P4 spec | planned |
| Phase task plans | done |
