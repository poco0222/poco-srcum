# ADR 002 Domain Naming Freeze

> Author: PopoY
> Created: 2026-06-04
> Status: Accepted

## Context

Phase 1 后续 `Task 02` 到 `Task 04` 都会复用角色、成员状态和项目状态。如果这些命名分散在不同模块中各写一套，后续状态机、权限判断和数据库字段会出现同义重复。

因此需要在 `packages/domain` 先冻结第一批共享枚举和命名规则，作为 P1 全局约束。

## Decision

当前冻结以下共享命名：

- `SystemRole`
  - `SYSTEM_ADMIN`
  - `TEAM_MEMBER`
- `ProjectRole`
  - `PROJECT_OWNER`
  - `SCRUM_MASTER`
  - `DEVELOPER`
  - `REVIEWER`
- `MemberStatus`
  - `INVITED`
  - `ACTIVE`
  - `SUSPENDED`
- `ProjectStatus`
  - `DRAFT`
  - `ACTIVE`
  - `ARCHIVED`

## Naming Rules

- 共享枚举统一使用 `UPPER_SNAKE_CASE`（全大写下划线）字符串值，避免数据库、日志和前后端枚举映射出现大小写漂移。
- 领域导出统一从 `packages/domain/src/index.ts` 汇总，禁止应用层绕过公共出口从深层路径随意拼接临时常量。
- 新增角色或状态前，必须先评估是否会影响 `Task 02` 的 `work item`（工作项）流转和 `Task 03` 的 `Sprint` 状态机。
- 禁止同时存在语义重复但命名不同的状态值，例如 `OPEN` 与 `ACTIVE`、`OWNER` 与 `PROJECT_OWNER`。

## Consequences

- `web`、`api`、`worker` 后续应统一 import 这些枚举，而不是重复声明角色或状态字符串。
- Prisma schema、DTO 和测试夹具在进入实现阶段前，都应先对齐这些共享命名。
