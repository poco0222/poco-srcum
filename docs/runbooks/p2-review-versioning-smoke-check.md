# P2 Review Versioning Smoke Check

> Author: PopoY
> Created: 2026-06-10
> Status: Active

## Objective

验证 Phase 2 Task 2 的最小 `review`（评审）、`comment`（评论）、`mention`（提及）和 `version history`（版本历史）闭环。

## Scope

- 创建正式文档
- 生成版本快照
- 创建评论并触发站内提及通知
- 提交评审、驳回、回到草稿、重新提交并通过
- 读取版本历史

## Smoke Path

1. 创建一份 `REQUIREMENT` 正式文档，绑定默认需求模板。
2. 调用版本服务创建 `version-1`，填写变更摘要。
3. 在 `Background` Markdown 区块创建评论，正文包含 `@user:reviewer-1`。
4. 确认 `reviewer-1` 收到 `DOCUMENT_COMMENT_MENTIONED` 站内通知。
5. 将 `version-1` 提交评审。
6. 以 `reviewer-1` 驳回评审，填写结论。
7. 将文档退回草稿，更新 Markdown 正文。
8. 创建 `version-2`，填写新的变更摘要。
9. 重新提交 `version-2` 并通过评审。
10. 读取版本历史，确认两个版本按版本号排序且各自保留完整快照。

## Verification Commands

```powershell
corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-review-flow.spec.ts
corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/document-comments.spec.ts test/document-mentions.spec.ts test/document-review-flow.spec.ts test/document-versioning.spec.ts
corepack pnpm --filter @poco-scrum/web test -- document-review
corepack pnpm --filter @poco-scrum/web test -- document-versions
```

## Expected Result

- 评论和回复保留文档锚点。
- 提及通知只使用 `@user:<id>` 语义。
- 评审状态只在 `draft / in-review / approved / rejected` 内流转。
- 审批只能绑定最新版本。
- 版本历史保留完整文档快照和变更摘要。
