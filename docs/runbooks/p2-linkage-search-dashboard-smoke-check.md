# P2 Linkage Search Dashboard Smoke Check

> Author: PopoY
> Created: 2026-06-10
> Status: Active

## Objective

验证 Phase 2 Task 3 的最小 `linkage`（关联链路）、`search`（搜索）和 `dashboard`（仪表盘）闭环。

## Scope

- 创建需求说明与技术方案文档
- 建立 `requirement-to-design`（需求到方案）对象链路
- 通过基础搜索命中文档 title（标题）、structured fields（结构化字段）和 Markdown body（正文）
- 在轻量仪表盘中查看 recent updates（最近更新）与 incomplete links（链路不完整对象）

## Smoke Path

1. 创建一份 `REQUIREMENT` 正式文档，填写 `businessGoal / requester / priority`。
2. 创建一份 `TECHNICAL_SOLUTION` 正式文档，填写 `architectureSummary / ownerTeam / riskLevel`。
3. 调用 `POST /linkage`，建立 `requirement-to-design` 关系。
4. 调用 `GET /search?keyword=<业务关键词>`，确认需求文档可通过 title、结构化字段或 Markdown 正文命中。
5. 确认搜索结果包含 `relationSummary`（关系摘要），指向技术方案文档。
6. 调用 `GET /dashboard/documents`。
7. 确认 `recentUpdates`（最近更新）包含需求文档与技术方案文档。
8. 确认技术方案文档因为缺少 `design-to-story` 关系进入 `incompleteLinks`（链路不完整对象）。

## Verification Commands

```powershell
corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test ../../tests/e2e/documents/document-linkage-search-flow.spec.ts
corepack pnpm --filter @poco-scrum/domain test -- linkage
corepack pnpm --filter @poco-scrum/api exec tsx --conditions=source --tsconfig tsconfig.json --test test/linkage-relations.spec.ts test/linkage-prisma.spec.ts test/search-contract.spec.ts test/search-scope.spec.ts test/document-dashboard.spec.ts
corepack pnpm --filter @poco-scrum/web test -- search
corepack pnpm --filter @poco-scrum/web test -- dashboard
```

## Hardening Checks

- `GET /search?reviewStatus=in-review` must return matching formal documents without requiring a keyword.
- `SearchService`（搜索服务）must only expose `WorkItemType.STORY`（故事类型工作项） as `STORY`（故事）, and must not relabel `TASK/BUG/EPIC`（任务/缺陷/史诗） as Story results.
- When `DATABASE_URL` is configured and the generated `@prisma/client`（Prisma 客户端） exposes `objectLink`（对象链路委托）, `LinkageModule`（链路模块）must use `PrismaObjectLinksRepository`（Prisma 对象链路仓储） for `ObjectLink`（对象链路） runtime persistence; without a reachable database or with a stale generated client（过期生成客户端）, the in-memory fallback（内存降级） remains available for local smoke checks.
- After any Prisma write fallback（Prisma 写入降级）, the same `PrismaObjectLinksRepository`（Prisma 对象链路仓储） instance must keep using sticky fallback（粘性降级） so read/duplicate/cardinality checks（读取/查重/基数校验） stay consistent for that process.
- If a stale generated client（过期生成客户端） lacks `objectLink`（对象链路委托）, the factory must call `$disconnect`（断开连接） before returning `null`.

## Expected Result

- `ObjectLink`（对象链路）只使用 Phase 2 冻结的 relation type（关系类型）。
- 基础搜索不索引 attachment full text（附件全文）。
- 搜索结果卡片包含稳定的 `objectType / objectId / title / snippet / relationSummary / reviewStatus / updatedAt` 字段。
- 仪表盘只展示 pending review（待评审）、recent updates（最近更新）和 incomplete links（链路不完整）三类固定卡片。
- 不引入高级全文检索、knowledge graph（知识图谱）或 P3 reporting（报表）能力。
