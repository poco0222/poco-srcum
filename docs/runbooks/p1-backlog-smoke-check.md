# P1 Backlog Smoke Check

> Author: PopoY
> Created: 2026-06-04
> Status: Active

## Objective

提供 `Task 02 Work Item And Backlog` 的最小人工验证顺序，确保 `Backlog`（待办列表）前后端链路、`Story ready gate`（Story 就绪门禁）和 Sprint 提交入口在本地环境中可重复检查。

## Preconditions

- 已在仓库根目录执行 `COREPACK_HOME=/private/tmp/corepack corepack pnpm install`
- 本地可用两个终端窗口或两个后台会话
- 端口 `3000`（web）与 `3001`（api）未被占用

## Startup Commands

1. 启动 API:

```bash
cd /Users/PopoY/workingFiles/Projects/POCO/poco-scrum
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api dev
```

2. 启动 Web:

```bash
cd /Users/PopoY/workingFiles/Projects/POCO/poco-scrum
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001 COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web dev
```

## Manual Verification Steps

1. 打开 `http://127.0.0.1:3000/backlog`。
预期：
页面显示 `Product Backlog` 标题、Summary 卡片、Backlog 列表区和 `Create Work Item` 表单。

2. 在创建表单中新增一个 `Story`，先不填写 `Acceptance Criteria`。
预期：
列表出现新建 Story，`Ready` 状态显示 `Blocked`，提示缺少验收标准或估点信息。

3. 进入该 Story 详情页 `/backlog/<work-item-id>`，填写至少一条 `Acceptance Criteria` 并保存。
预期：
保存成功提示出现，详情页 `Ready` 状态切为 `Ready for Sprint`，回到列表页后同样显示 Ready。

4. 在详情页点击 `Add Story to Sprint`，使用默认 `sprint-1` 或填入任意非空 Sprint ID。
预期：
成功提示出现，当前 Sprint 显示为已提交，后台状态变为 `COMMITTED_TO_SPRINT`。

5. 再创建一个缺少 `Acceptance Criteria` 的 Story，直接点击 `Add Story to Sprint`。
预期：
页面显示 `WORK_ITEM_NOT_READY_FOR_SPRINT` 错误，不允许进入 Sprint。

6. 在列表页使用 `Move Up` / `Move Down` 调整顺序。
预期：
列表刷新后顺序保持更新，重新打开页面后顺序仍然一致。

## Automated Verification Commands

```bash
cd /Users/PopoY/workingFiles/Projects/POCO/poco-scrum
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/domain test
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/shared test
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/api test
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web test
COREPACK_HOME=/private/tmp/corepack corepack pnpm --filter @poco-scrum/web build
```

## Notes

- `web typecheck` 使用 `next typegen && tsc --noEmit -p tsconfig.json`，避免在 `.next/types` 尚未生成时出现孤立报错。
- 当前 `Backlog` 排序使用按钮式重排，不包含拖拽交互，这符合 `Task 02` 的 P1 范围约束。
