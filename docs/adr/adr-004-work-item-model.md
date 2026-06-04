# ADR 004 Work Item Model Freeze

> Author: PopoY
> Created: 2026-06-04
> Status: Accepted

## Context

`Task 02` 需要把 `Epic / Story / Task / Bug` 统一收口到单一 `work item`（工作项）模型。若字段矩阵、父子关系、模块路径在数据库、API、前端分别各写一套，后续 `Backlog`（待办列表）、`Sprint`（迭代）和验收门禁会持续漂移。

因此在开始 Prisma、DTO 和 UI 实现前，先冻结：

- 共享枚举
- 字段矩阵
- 父子关系规则
- 真实模块路径

## Decision

### Shared Module Paths

`Task 02` 统一使用以下路径承接实现：

- `packages/domain/src/work-items/*`
- `packages/shared/src/work-items/*`
- `apps/api/src/modules/work-items/*`
- `apps/api/src/modules/sprints/contracts/*`
- `apps/web/src/app/(authenticated)/backlog/*`
- `apps/web/src/features/backlog/*`
- `tests/e2e/backlog/*`

### Field Matrix

字段矩阵以 `packages/domain/src/work-items/work-item.types.ts` 为唯一共享来源。

| Field | Epic | Story | Task | Bug | Notes |
| --- | --- | --- | --- | --- | --- |
| `id` | required | required | required | required | 统一主键 |
| `type` | required | required | required | required | 统一工作项类型 |
| `title` | required | required | required | required | 标题不能为空 |
| `status` | required | required | required | required | 统一工作项状态 |
| `priority` | required | required | required | required | 统一优先级 |
| `storyPoints` | forbidden | required | optional | optional | `Story` 必须估点 |
| `acceptanceCriteria` | forbidden | required | forbidden | optional | `Story` 进入 Sprint 前必须具备 |
| `projectId` | required | required | required | required | 所属项目 |
| `sprintId` | forbidden | optional | optional | optional | `Epic` 不进入 Sprint |
| `parentId` | forbidden | optional | required | optional | 由父子规则细化 |
| `assigneeId` | optional | optional | optional | optional | P1 不强制 |
| `sortOrder` | required | required | required | required | Backlog 排序持久化字段 |

### Parent-Child Rules

- `Epic` 不能有父级。
- `Story` 可以独立存在，也可以挂到 `Epic` 下。
- `Task` 必须挂到 `Story` 下，不能直接挂到 `Epic`、`Task` 或 `Bug` 下。
- `Bug` 可以独立存在，也可以挂到 `Story` 下。
- `Epic` 不能直接进入 `Sprint`，`Task` 与 `Bug` 也不承接 `acceptance criteria` 结构化门禁。

### Shared Enums

冻结以下枚举：

- `WorkItemType`
  - `EPIC`
  - `STORY`
  - `TASK`
  - `BUG`
- `WorkItemStatus`
  - `BACKLOG`
  - `READY_FOR_SPRINT`
  - `COMMITTED_TO_SPRINT`
  - `IN_PROGRESS`
  - `IN_REVIEW`
  - `DONE`
  - `CANCELLED`
- `WorkItemPriority`
  - `CRITICAL`
  - `HIGH`
  - `MEDIUM`
  - `LOW`

## Consequences

- Prisma schema、共享 DTO、API 校验器和前端表单都必须直接复用 `packages/domain` 的字段矩阵与枚举。
- 后续 `ready gate`（就绪门禁）默认以 `Story.storyPoints` 和 `Story.acceptanceCriteria` 为主约束，不额外引入审批流。
- `Task 03` 可以扩展 `Sprint` 生命周期，但不得在不更新本 ADR 的前提下改写 `WorkItemType`、`WorkItemPriority` 和父子关系规则。
