# POCO Scrum Platform

> Author: PopoY
> Created: 2026-06-04
> Status: Active

## 项目概览

`POCO Scrum Platform` 是一个 `Scrum-first`（以 Scrum 为第一优先）的企业内部项目管理系统，目标是围绕 `Product Backlog`（产品待办）、`Sprint`（迭代）、`Review / Acceptance`（评审 / 验收）、`Retrospective`（复盘）和结构化文档协作，建立从规划到交付的完整闭环。

本仓库提供该项目的路线图、`spec`（规格）和 `task plan`（任务计划）入口，同时定义后续实现阶段需要遵循的仓库约定、阅读顺序和开发前检查项。

技术栈基线如下：

- Frontend: `Next.js + TypeScript + Ant Design`
- Backend: `NestJS + Prisma`
- Data: `PostgreSQL`
- File Storage: `MinIO`
- Queue: `RabbitMQ`
- Architecture: `modular monolith`（模块化单体）

## 阅读入口

- `Master roadmap`（总路线图）：
  [`docs/specs/scrum-platform-spec-plan/scrum-platform-spec-plan.md`](docs/specs/scrum-platform-spec-plan/scrum-platform-spec-plan.md)
- `Task template`（任务模板）：
  [`docs/specs/scrum-platform-spec-plan/task-template.md`](docs/specs/scrum-platform-spec-plan/task-template.md)

## 路线图总览

| Phase | Goal | Spec | Task Plan |
| --- | --- | --- | --- |
| `P1` | Scrum 核心闭环可上线 | [`phase-01-scrum-core-spec.md`](docs/specs/scrum-platform-spec-plan/phase-01-scrum-core-spec.md) | [`phase-01-scrum-core-spec-plan/`](docs/specs/scrum-platform-spec-plan/phase-01-scrum-core-spec-plan/) |
| `P2` | 文档协作与评审闭环 | [`phase-02-document-collaboration-spec.md`](docs/specs/scrum-platform-spec-plan/phase-02-document-collaboration-spec.md) | [`phase-02-document-collaboration-spec-plan/`](docs/specs/scrum-platform-spec-plan/phase-02-document-collaboration-spec-plan/) |
| `P3` | 跨项目管理与运营视图 | [`phase-03-portfolio-operations-spec.md`](docs/specs/scrum-platform-spec-plan/phase-03-portfolio-operations-spec.md) | [`phase-03-portfolio-operations-spec-plan/`](docs/specs/scrum-platform-spec-plan/phase-03-portfolio-operations-spec-plan/) |
| `P4` | 治理、审计与稳定性强化 | [`phase-04-governance-stability-spec.md`](docs/specs/scrum-platform-spec-plan/phase-04-governance-stability-spec.md) | [`phase-04-governance-stability-spec-plan/`](docs/specs/scrum-platform-spec-plan/phase-04-governance-stability-spec-plan/) |

## 仓库结构

| Path | Purpose |
| --- | --- |
| `docs/` | 项目文档主目录 |
| `docs/specs/` | 当前权威 `spec`（规格）与 `task plan`（任务计划）入口 |
| `docs/specs/scrum-platform-spec-plan/` | 总路线图、phase `spec` 和 phase `task plan` 的集中目录 |
| `specs/` | 顶层 `spec` 文档预留目录 |
| `specs-plan/` | 顶层 `spec plan` / `task plan` 文档预留目录 |

## 实现约定

- 真实实现仓 `remote`（远端）固定为 `https://github.com/poco0222/poco-srcum.git`。
- 本仓库文档中出现的 `<implementation-repo>`，统一指向真实实现仓在本地的 clone 根目录。
- 开始任何实现前，先执行 `git remote get-url origin`，确认当前 `origin` 与固定仓库地址完全一致。
- 后续实现默认遵循 `Monorepo`（单仓）布局，推荐目录包括 `apps/web`、`apps/api`、`apps/worker`、`packages/domain`、`packages/shared`、`tests/e2e`、`docs/adr` 和 `docs/runbooks`。

## 推荐阅读顺序

1. 先阅读 [`scrum-platform-spec-plan.md`](docs/specs/scrum-platform-spec-plan/scrum-platform-spec-plan.md)，理解项目目标、阶段边界和总路线图。
2. 再阅读目标 `phase`（阶段）对应的 `spec`（规格）文档，确认本阶段的范围、验收标准和风险。
3. 最后阅读对应 `phase` 的 `task plan`（任务计划）目录，按任务拆分进入具体执行步骤。

## 开发前检查

- [ ] 执行 `git remote get-url origin`，确认输出为 `https://github.com/poco0222/poco-srcum.git`
- [ ] 执行 `git branch --show-current`，确认当前工作分支符合你的交付目标
- [ ] 检查目标工作树是否包含 `apps/web`、`apps/api`、`apps/worker`
- [ ] 确认本次工作目标是更新文档，还是进入真实实现仓执行开发
