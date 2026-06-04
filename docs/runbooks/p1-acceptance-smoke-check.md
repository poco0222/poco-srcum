# P1 Acceptance Smoke Check

> Author: PopoY
> Created: 2026-06-04
> Scope: Phase 1 Task 4 acceptance, document, notification, and minimal audit smoke verification.

## Objective

验证 P1 的 Story 验收、最小 `Form + Markdown + Preview` 文档、附件挂接、站内通知和最小操作日志可以形成闭环。

## Automated Checks

Run these commands from the repository root:

```bash
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain test -- acceptance
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-acceptance.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/story-done-guard.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/document-save.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/document-attachment-link.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/notification-triggers.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec tsx --tsconfig tsconfig.json --test test/minimal-audit-log.spec.ts
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- document-preview
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- attachment-preview
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test -- notifications
DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/poco_scrum COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma
COREPACK_HOME=/private/tmp/corepack corepack pnpm -r build
```

## Manual Path

1. Create a ready Story with `acceptanceCriteria`.
2. Reject the Story through `POST /acceptance/stories/:storyId/reject` and confirm `reason / actorId / operatedAt` are returned.
3. Reopen the Story through `POST /acceptance/stories/:storyId/reopen`.
4. Approve the Story through `POST /acceptance/stories/:storyId/approve`.
5. Complete the Story through `POST /work-items/:workItemId/complete` and confirm unapproved Stories are rejected.
6. Create a document through `POST /documents`, update it through `PATCH /documents/:documentId`, and confirm structured fields plus Markdown are returned.
7. Link the document to Story/Sprint targets and attach image/PDF metadata.
8. Confirm acceptance and document events create in-app notifications and minimal audit log records.

## P1 Boundary

- This smoke check does not cover document version history, comments, review workflow, email notifications, subscription center, or a full enterprise audit platform.
