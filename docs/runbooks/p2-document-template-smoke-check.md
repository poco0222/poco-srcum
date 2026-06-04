<!--
@file Phase 2 document template smoke-check runbook.
@author PopoY
@created 2026-06-04
-->

# P2 Document Template Smoke Check

## Objective

验证 Phase 2 Task 1 的正式文档模板主路径：选择模板、填写结构化字段、编辑 Markdown（标记语言）、保存并重新打开。

## Common Preconditions

## Web Main Path

1. Open `/documents/new`.
2. Confirm the template selector renders four default templates from `GET /document-templates`.
3. Switch between Requirement, Technical Solution, Acceptance, and Retrospective templates.
4. Confirm structured fields and the Markdown editor content change with the selected template.
5. Fill title, target, author, required structured fields, and Markdown.
6. Submit `Create Formal Document`.
7. Copy the returned document id from the success message.
8. Reopen through `GET /documents/:documentId` and confirm `templateId`, `documentType`, `targetType`, `targetId`, `structuredFields`, and `markdown`.

Passing standard: the manual Web UI（网页界面） path uses `/documents/new` only; reopen（重新打开） is verified by API（应用程序接口） readback in this task.

- API（应用程序接口）服务已启动，且 `GET /document-templates` 返回四类默认模板。
- Web（网页端）可访问 `/documents/new`。
- 使用默认 demo 用户 `user-1` 和默认 Story（故事）目标 `story-1` 做手工烟雾检查。
- 保存后必须通过页面重新打开，或通过 `GET /documents/:documentId` 回读。

## Requirement Document

- Template（模板）：`default-requirement`
- Document Type（文档类型）：`REQUIREMENT`
- Required Fields（必填字段）：`businessGoal`、`requester`、`priority`
- Optional Field（可选字段）：`targetRelease`
- Markdown（标记语言）检查：
  - 包含 `## Background`
  - 包含 `## User Story`
  - 包含 `## Acceptance Criteria`
  - 包含 `## Out Of Scope`
- Smoke Steps（烟雾步骤）：
  1. 打开 `/documents/new`。
  2. 选择 `需求说明` 模板。
  3. 填写必填字段并输入 Markdown 正文。
  4. 保存文档。
  5. 重新打开文档，确认模板 ID、结构化字段和 Markdown 正文均未丢失。

## Technical Solution Document

- Template（模板）：`default-technical-solution`
- Document Type（文档类型）：`TECHNICAL_SOLUTION`
- Required Fields（必填字段）：`architectureSummary`、`ownerTeam`、`riskLevel`
- Optional Field（可选字段）：`rolloutWindow`
- Markdown（标记语言）检查：
  - 包含 `## Context`
  - 包含 `## Architecture`
  - 包含 `## Data Model`
  - 包含 `## Rollout Plan`
- Smoke Steps（烟雾步骤）：
  1. 打开 `/documents/new`。
  2. 选择 `技术方案` 模板。
  3. 填写必填字段并输入 Markdown 正文。
  4. 保存文档。
  5. 重新打开文档，确认模板 ID、结构化字段和 Markdown 正文均未丢失。

## Acceptance Document

- Template（模板）：`default-acceptance`
- Document Type（文档类型）：`ACCEPTANCE`
- Required Fields（必填字段）：`acceptanceResult`、`reviewerId`、`acceptedAt`
- Optional Field（可选字段）：`followUpOwner`
- Markdown（标记语言）检查：
  - 包含 `## Scope`
  - 包含 `## Evidence`
  - 包含 `## Decision`
  - 包含 `## Follow Ups`
- Smoke Steps（烟雾步骤）：
  1. 打开 `/documents/new`。
  2. 选择 `验收说明` 模板。
  3. 填写必填字段并输入 Markdown 正文。
  4. 保存文档。
  5. 重新打开文档，确认模板 ID、结构化字段和 Markdown 正文均未丢失。

## Retrospective Document

- Template（模板）：`default-retrospective`
- Document Type（文档类型）：`RETROSPECTIVE`
- Required Fields（必填字段）：`sprintId`、`facilitatorId`、`actionOwnerId`
- Optional Field（可选字段）：`reviewDate`
- Markdown（标记语言）检查：
  - 包含 `## What Went Well`
  - 包含 `## What To Improve`
  - 包含 `## Actions`
  - 包含 `## Owner Review`
- Smoke Steps（烟雾步骤）：
  1. 打开 `/documents/new`。
  2. 选择 `复盘纪要` 模板。
  3. 填写必填字段并输入 Markdown 正文。
  4. 保存文档。
  5. 重新打开文档，确认模板 ID、结构化字段和 Markdown 正文均未丢失。

## API Spot Check

```powershell
$env:PATH='D:\Dev Tools\nodejs-24.16.0;D:\Dev Tools\pnpm;D:\Dev Tools\corepack;' + $env:PATH
corepack pnpm --filter @poco-scrum/api test -- document-template-flow
```

通过标准：`document-template-flow` 中模板列表、正式文档保存、重新打开和模板类型不匹配保护均通过。
