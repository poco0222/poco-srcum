# ADR 005 Document Types

> Author: PopoY
> Created: 2026-06-04
> Status: Accepted

## Context

P2 需要把 P1 的最小 `Form + Markdown + Preview`（表单加 Markdown 加预览）能力升级为稳定的正式交付文档载体。模板、编辑器、保存校验、后续搜索和评审都需要共享同一份文档类型与字段矩阵。

## Decision

首批正式文档类型固定为四类：

| Type | 中文名 | Required Structured Fields | Markdown Sections |
| --- | --- | --- | --- |
| `REQUIREMENT` | 需求说明 | `businessGoal`, `requester`, `priority` | `Background`, `User Story`, `Acceptance Criteria`, `Out Of Scope` |
| `TECHNICAL_SOLUTION` | 技术方案 | `architectureSummary`, `ownerTeam`, `riskLevel` | `Context`, `Architecture`, `Data Model`, `Rollout Plan` |
| `ACCEPTANCE` | 验收说明 | `acceptanceResult`, `reviewerId`, `acceptedAt` | `Scope`, `Evidence`, `Decision`, `Follow Ups` |
| `RETROSPECTIVE` | 复盘纪要 | `sprintId`, `facilitatorId`, `actionOwnerId` | `What Went Well`, `What To Improve`, `Actions`, `Owner Review` |

字段要求等级统一使用 `DocumentFieldRequirement`（文档字段要求）：

- `REQUIRED`：模板、API 校验、前端表单都必须要求填写
- `OPTIONAL`：可展示和保存，但不阻断保存
- `FORBIDDEN`：保留给后续类型差异化约束，本 task 不使用

## Consequences

- `packages/domain/src/documents/document-type.matrix.ts` 成为模板生成、编辑 payload（载荷）校验和 UI 表单渲染的唯一字段来源。
- P2 Task1 只冻结文档结构，不承接评论、评审状态、版本历史、搜索或仪表盘。
- 附件和链接在本 task 只作为可挂接引用对象，不承担高级权限和版本治理。
