# ADR 001 Repository Layout Mapping

> Author: PopoY
> Created: 2026-06-04
> Status: Accepted

## Context

`Task 01 Project Bootstrap And Foundation` 要求先把 `spec`（规格）中的 `<implementation-repo>` 映射到真实可执行的本地仓库根目录，再开始后续 `monorepo`（单仓多包）骨架搭建。

当前固定远端仓库地址为 `https://github.com/poco0222/poco-srcum.git`，但本地目录名为 `poco-scrum`，与远端仓库名存在拼写差异，因此需要记录一份显式路径对齐表，避免后续 `Task 02` 到 `Task 04` 误判代码根目录。

## Decision

本项目在 Codex 中的真实实现仓映射如下：

| Logical Name | Local Path | Notes |
| --- | --- | --- |
| Canonical implementation repository | `/Users/PopoY/workingFiles/Projects/POCO/poco-scrum` | 本地 clone 根目录，`origin` 必须固定为 `https://github.com/poco0222/poco-srcum.git` |
| Active Task 01 worktree | `/Users/PopoY/workingFiles/Projects/POCO/poco-scrum/.worktrees/p1-task1-foundation` | 本轮 `Task 01` 的隔离工作目录，所有开发与验证都在该路径执行 |
| Documentation root | `/Users/PopoY/workingFiles/Projects/POCO/poco-scrum/docs` | `spec`、`task plan` 和 `ADR`（架构决策记录）统一保存在该目录 |

## Consequences

- 后续 `Task 01` 到 `Task 04` 中出现的 `<implementation-repo>`，默认都指向仓库根目录 `/Users/PopoY/workingFiles/Projects/POCO/poco-scrum`。
- 当使用工作树执行任务时，命令实际运行目录可以是工作树路径，但提交、分支和远端校验必须仍以同一 Git 仓库为准。
- 若未来重新 clone 到与远端同名目录，可更新本 ADR，但不影响当前 Phase 1 的目录职责划分。

## Directory Responsibilities

| Path | Responsibility |
| --- | --- |
| `apps/web` | 承载 `Next.js` 前端壳、登录后工作台和后续 Phase 1 页面入口 |
| `apps/api` | 承载 `NestJS` API、`Prisma` schema、认证和项目成员模块 |
| `apps/worker` | 承载通知、导出和异步任务作业入口 |
| `packages/domain` | 承载共享领域枚举、状态机和命名约束 |
| `packages/shared` | 承载 DTO、校验 schema 和跨端常量 |
| `docs/adr` | 承载 Phase 1 到 Phase 4 的架构决策记录 |
