# Task 01 Project Bootstrap And Foundation

> Author: PopoY
> Created: 2026-06-04
> Status: done
> Phase: P1
> Parent Spec: `phase-01-scrum-core-spec.md`
> Parent Plan: `phase-01-scrum-core-spec-plan.md`

## Objective

建立项目骨架、核心工程规范、登录与基础权限边界，为后续 Scrum 主流程开发提供稳定底座。

## Background

P1 的第一任务不是直接做业务页面，而是先把工程骨架和边界打稳，否则后续 AI 大规模参与开发时容易失控。

## Scope

- 建立可承接 P1 后续开发的项目骨架与基础模块边界
- 建立 `web / api / worker` 的最小应用入口和工程组织方式
- 建立基础登录、身份、团队、成员、角色、项目模型
- 建立最小工程规范、命名约束和 CI 基线草案

## Out Of Scope

- 不在本 task 内展开具体 Backlog、Sprint、验收或复盘业务流程
- 不引入 SSO、复杂审计、备份恢复和灰度发布能力
- 不在本 task 内扩展复杂组织架构、多租户或跨项目运营能力
- 不引入 P2/P3/P4 的文档协作、报表治理或企业集成能力

## Inputs

- P1 规格文档
- 已确认的技术栈与模块化单体路线
- 已确认的产品定位、登录方式方向和角色边界约束

## Dependencies

- 总入口 `scrum-platform-spec-plan.md` 中定义的技术栈与架构基线
- P1 `spec` 中的核心领域命名、状态流转枚举冻结要求
- 后续 `task-02`、`task-03`、`task-04` 都依赖本 task 提供的基础工程与身份边界

## Deliverables

- Monorepo 项目骨架
- `web / api / worker` 应用入口
- 基础登录与身份模型
- 团队、角色、项目基础模型
- 工程规范与 CI 基线草案

## Acceptance Criteria

- 代码仓库结构可承接后续各模块开发
- 登录、基础用户、项目成员、角色模型可用
- 已冻结核心命名与模块边界规则
- 基础工程约束可支持后续 Backlog、Sprint、验收等主链路 task 接入

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 一支真实团队能完整跑完一个 Sprint | 本 task 提供基础工程、成员边界和项目底座，但不主承接 Sprint 业务闭环 |
| 可支持真实团队迁移到系统进行一次完整 Sprint 试运行 | 本 task 为后续 task 提供运行底座和身份边界，是 P1 试运行的必要前置条件 |
| 主流程无 P0 / P1 阻断问题 | 本 task 负责减少基础工程、登录和模块边界层面的阻断风险 |

## Risks

- 基础工程规范不清晰会导致后续返工
- 权限模型过于草率会影响 P4 治理设计
- 模块边界如果先天不清，会直接拖慢 P1 后续三个 task 的落地

## Open Questions

- 登录方式在 P1 是否只保留最小账号体系，还是需要预留企业账号扩展点
- `worker` 应用入口在 P1 只保留骨架，还是需要最小可运行任务通路
- CI 基线草案是否只覆盖基础检查，不覆盖完整发布流程

## Execution Assumptions

- 真实实现仓固定为 `https://github.com/poco0222/poco-srcum.git`，并默认采用 `pnpm workspace`（pnpm 工作区）管理。
- 下文统一使用 `<implementation-repo>` 指代该仓库在本地的 clone 根目录；开始任何实现前，必须先校验 `git remote get-url origin` 输出与固定仓库地址一致。
- 推荐目录布局：
  - `apps/web`：`Next.js` 前端壳与登录后工作台
  - `apps/api`：`NestJS` API、`Prisma` schema、认证与项目成员模块
  - `apps/worker`：通知、导出与异步任务骨架
  - `packages/domain`：枚举、状态机、字段矩阵
  - `packages/shared`：DTO、校验 schema、跨端常量
  - `infra/ci`：CI 配置与检查脚本
  - `docs/adr`：架构决策记录
- 根级脚本至少包含：
  - `pnpm -r lint`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r build`

## Execution Progress

| Step | Status | Progress | Notes |
| --- | --- | --- | --- |
| Step 1 | done | 1/7 | 已确认固定远端、任务工作树路径、根级统一脚本与 `ADR-001` 路径映射 |
| Step 2 | done | 2/7 | 已创建 `apps/web`、`apps/api`、`apps/worker`、`packages/domain`、`packages/shared` 最小工作区骨架 |
| Step 3 | done | 3/7 | 已交付 `web` 首页壳、`api` `/health` 探活接口与 `worker` 启动测试 |
| Step 4 | done | 4/7 | 已冻结共享角色与状态枚举，并记录 `ADR-002` 领域命名约束 |
| Step 5 | done | 5/7 | 已交付基础 Prisma 身份/团队/项目模型、共享访问 DTO 与成员访问负例约束 |
| Step 6 | done | 6/7 | 已交付 `GET /auth/me`、会话服务与前端 `getCurrentUser` client |
| Step 7 | done | 7/7 | 已交付 `.editorconfig`、ESLint/CI 基线与四条根级质量门禁验证 |

### Latest Evidence

- Step 1 repository root confirmed at `/Users/PopoY/workingFiles/Projects/POCO/poco-scrum/.worktrees/p1-task1-foundation`
- `git remote get-url origin` confirmed `https://github.com/poco0222/poco-srcum.git`
- Root scripts created in `package.json`
- Path mapping recorded in `docs/adr/adr-001-repo-layout.md`
- `corepack pnpm -r lint` verified command resolution with absolute `COREPACK_HOME`
- `corepack pnpm -r typecheck` scanned `apps/*` and `packages/*` workspace packages successfully
- `pnpm --filter @poco-scrum/api test` passed with `GET /health` returning `200`
- `pnpm --filter @poco-scrum/worker test` passed with the worker bootstrap banner smoke test
- `pnpm --filter @poco-scrum/web build` passed and generated the root `/` page
- `pnpm --filter @poco-scrum/domain test` passed for shared role and status enum snapshots
- `pnpm --filter @poco-scrum/domain typecheck` passed for the shared `packages/domain` public exports
- `pnpm --filter @poco-scrum/shared typecheck` passed for shared project membership DTO validation
- `pnpm --filter @poco-scrum/api typecheck` passed for the foundational auth and project modules
- `node --import tsx --test apps/api/test/project-membership.spec.ts` passed for the non-member denial case
- `pnpm --filter @poco-scrum/api exec prisma validate --schema prisma/schema.prisma` passed with a placeholder `DATABASE_URL`
- `tsx --tsconfig apps/api/tsconfig.json --test apps/api/test/session-me.spec.ts` passed for `401` and `200` session flows
- `pnpm --filter @poco-scrum/api test` passed for health check, project membership, and session endpoints
- `pnpm --filter @poco-scrum/web typecheck` passed after adding the `getCurrentUser` frontend client
- `pnpm -r lint` passed across all current workspace packages
- `pnpm -r typecheck` passed across `apps/*` and `packages/*`
- `pnpm -r test` passed across API, worker, and domain scopes
- `pnpm -r build` passed across API, worker, and web scopes

## Steps

### Step 1: 确认固定实现仓与工作区脚本

- Goal: 把文档中的推荐路径映射到固定实现仓 `https://github.com/poco0222/poco-srcum.git`，避免 Codex 在错误目录开始搭建
- Why: 当前仓库主要存放 `spec`（规格）文档，不是最终编码仓；必须先锁定真实代码根目录，并确认远端地址已固定到目标仓库
- Target Files/Paths:
  - `<implementation-repo>/package.json`
  - `<implementation-repo>/pnpm-workspace.yaml`
  - `<implementation-repo>/apps`
  - `<implementation-repo>/packages`
- Preconditions:
  - 当前 task 文档已冻结技术栈与推荐目录布局
- Actions:
  1. 在真实实现仓执行 `pwd`、`git remote get-url origin`、`find . -maxdepth 2 \( -name package.json -o -name pnpm-workspace.yaml \)`，确认工作区根目录和远端地址。
  2. 如果 `git remote get-url origin` 输出不是 `https://github.com/poco0222/poco-srcum.git`，先修正 `origin` 或重新 clone 固定仓库，再继续后续步骤。
  3. 如果目录名与本 task 不一致，在 `docs/adr/adr-001-repo-layout.md` 记录最终路径映射表。
  4. 在根级 `package.json` 写入或校正 `lint / typecheck / test / build` 四个统一脚本。
- Commands:
  - `pwd`
  - `git remote get-url origin`
  - `find . -maxdepth 2 \( -name package.json -o -name pnpm-workspace.yaml \)`
  - `pnpm -r lint`
- Expected Output:
  - 已确认的真实实现仓根目录
  - 已确认的固定远端仓库地址
  - 根级脚本名称与调用方式
  - 一份路径映射说明
- Acceptance:
  - Codex 可以只凭本 step 找到真正的实现仓
  - `git remote get-url origin` 输出必须严格等于 `https://github.com/poco0222/poco-srcum.git`
  - `pnpm -r lint` 至少能被 shell 识别，不再出现“脚本不存在”歧义
- Evidence:
  - 终端输出中的仓库绝对路径
  - `git remote get-url origin` 输出
  - `package.json` 中的脚本片段
- Notes:
  - 这一步只做路径与脚本对齐，不创建业务模块

### Step 2: 搭建 Monorepo 基础骨架

- Goal: 创建可承接 `web / api / worker` 的最小工作区目录和共享包骨架
- Why: 没有统一骨架，后续 P1 其余 task 无法在稳定路径下并行推进
- Target Files/Paths:
  - `<implementation-repo>/apps/web/package.json`
  - `<implementation-repo>/apps/api/package.json`
  - `<implementation-repo>/apps/worker/package.json`
  - `<implementation-repo>/packages/domain/package.json`
  - `<implementation-repo>/packages/shared/package.json`
- Preconditions:
  - Step 1 已确认工作区根目录与脚本命名
- Actions:
  1. 创建 `apps/web`、`apps/api`、`apps/worker`、`packages/domain`、`packages/shared` 目录与最小 `package.json`。
  2. 在每个应用包中写入 `dev / test / build` 占位脚本，确保后续命令可单包运行。
  3. 在 `README` 或 `docs/adr/adr-001-repo-layout.md` 补一张“目录职责表”。
- Commands:
  - `find . -maxdepth 2 -type d | sort`
  - `pnpm -r typecheck`
- Expected Output:
  - 统一的工作区目录骨架
  - 每个应用与共享包都有独立脚本入口
- Acceptance:
  - `apps/web`、`apps/api`、`apps/worker`、`packages/domain`、`packages/shared` 均存在
  - `pnpm -r typecheck` 可以扫描全部 workspace 包
- Evidence:
  - 目录树输出
  - 根级命令执行结果
- Notes:
  - 本 step 不引入任何 P1 业务实体

### Step 3: 创建应用级健康入口与启动烟雾测试

- Goal: 让三个应用都具备最小可启动入口，而不是只有空目录
- Why: 后续实现登录、Backlog 和 Sprint 时，需要有可运行的宿主应用
- Target Files/Paths:
  - `<implementation-repo>/apps/web/src/app/page.tsx`
  - `<implementation-repo>/apps/api/src/main.ts`
  - `<implementation-repo>/apps/api/src/app.module.ts`
  - `<implementation-repo>/apps/worker/src/main.ts`
  - `<implementation-repo>/tests/e2e/health-check.e2e-spec.ts`
- Preconditions:
  - Step 2 已完成工作区骨架创建
- Actions:
  1. 在 `apps/web` 创建最小工作台首页，占位展示 “POCO Scrum Platform”。
  2. 在 `apps/api` 添加 `/health` 探活接口与最小 `AppModule`。
  3. 在 `apps/worker` 添加启动日志与空作业注册入口。
  4. 编写一个 `health-check` 级别的 smoke test，验证 API 探活成功。
- Commands:
  - `pnpm --filter api test`
  - `pnpm --filter web build`
  - `pnpm --filter worker test`
- Expected Output:
  - 三个可启动应用入口
  - 一条通过的健康检查测试
- Acceptance:
  - `GET /health` 返回 `200`
  - 前端首页能成功构建，不依赖后续业务模块
- Evidence:
  - 健康检查测试名称与通过输出
  - 前端构建日志
- Notes:
  - 这一步只建立壳，不实现登录态守卫

### Step 4: 冻结领域命名与共享枚举

- Goal: 把后续所有 P1 task 会复用的角色、成员状态和项目基础枚举放进共享域包
- Why: 命名如果在不同模块里各写一套，后续状态机和权限边界会漂移
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/auth/roles.ts`
  - `<implementation-repo>/packages/domain/src/projects/project.enums.ts`
  - `<implementation-repo>/packages/domain/src/index.ts`
  - `<implementation-repo>/docs/adr/adr-002-domain-naming.md`
- Preconditions:
  - Step 2 已建立 `packages/domain`
- Actions:
  1. 在 `packages/domain` 定义 `SystemRole`、`ProjectRole`、`MemberStatus`、`ProjectStatus` 等基础枚举。
  2. 在 `adr-002-domain-naming.md` 记录命名规则、大小写风格和禁止同义重复的约束。
  3. 为共享枚举编写基础单元测试，防止导出名和字符串值被误改。
- Commands:
  - `pnpm --filter domain test`
  - `pnpm --filter domain typecheck`
- Expected Output:
  - 可被 `web / api / worker` 共享导入的领域枚举
  - 一份领域命名 ADR
- Acceptance:
  - 后续 task 可直接 import 这些枚举，而不再自定义角色字符串
  - 枚举测试覆盖导出与关键值
- Evidence:
  - 枚举测试输出
  - ADR 文档路径
- Notes:
  - 不在这里定义 Sprint、Work Item 等业务状态

### Step 5: 建立身份、团队与项目基础数据模型

- Goal: 在数据库层冻结用户、团队、项目、成员与角色关系
- Why: Backlog、Sprint、验收都需要稳定挂靠到项目与成员边界
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/apps/api/src/modules/auth/auth.module.ts`
  - `<implementation-repo>/apps/api/src/modules/projects/projects.module.ts`
  - `<implementation-repo>/apps/api/test/project-membership.spec.ts`
- Preconditions:
  - Step 4 已冻结共享枚举
- Actions:
  1. 在 `schema.prisma` 增加 `User`、`Team`、`Project`、`ProjectMember` 四个核心模型。
  2. 在 `packages/shared` 中补齐对应 DTO 与输入校验 schema。
  3. 先写 `project-membership` 失败测试，覆盖“非项目成员不可访问项目”的基础约束，再补实现。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- project-membership`
- Expected Output:
  - 基础身份与项目边界模型
  - 一条最小成员访问控制测试
- Acceptance:
  - 用户、项目、成员关系可以在数据库层表达
  - 至少存在一个未授权负例测试
- Evidence:
  - Prisma 校验输出
  - 测试名称和断言结果
- Notes:
  - 这里只做最小 RBAC 前置，不展开 P4 细粒度权限

### Step 6: 打通最小登录态与当前用户接口

- Goal: 为后续页面和 API 提供统一的当前用户上下文
- Why: 没有 `current user`（当前用户）入口，后续所有成员与权限判断都只能写假数据
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/auth/controllers/session.controller.ts`
  - `<implementation-repo>/apps/api/src/modules/auth/services/session.service.ts`
  - `<implementation-repo>/apps/web/src/lib/auth/get-current-user.ts`
  - `<implementation-repo>/apps/api/test/session-me.spec.ts`
- Preconditions:
  - Step 5 已建立用户与项目成员模型
- Actions:
  1. 先写 `GET /auth/me` 的 failing test，覆盖登录成功与未登录两种情况。
  2. 在 API 侧补 `session` 模块，实现返回当前用户、团队与默认项目摘要。
  3. 在前端补 `get-current-user` client，供后续工作台与 Backlog 页面复用。
- Commands:
  - `pnpm --filter api test -- session-me`
  - `pnpm --filter web typecheck`
- Expected Output:
  - 一个稳定的 `GET /auth/me` 接口
  - 前端可复用的当前用户获取函数
- Acceptance:
  - 登录态请求返回用户摘要
  - 未登录请求返回 `401`
- Evidence:
  - `session-me` 测试输出
  - `GET /auth/me` 示例响应
- Notes:
  - P1 只做最小账号体系，不扩展 SSO

### Step 7: 建立工程规范与 CI 基线

- Goal: 把后续开发的最小检查链路收口为统一 CI
- Why: 文档已经准备好后，如果没有自动检查，Codex 并行改动很容易把基础工程破坏
- Target Files/Paths:
  - `<implementation-repo>/infra/ci/pipeline.yml`
  - `<implementation-repo>/.editorconfig`
  - `<implementation-repo>/.eslintrc.*`
  - `<implementation-repo>/docs/adr/adr-003-ci-baseline.md`
- Preconditions:
  - Step 2 和 Step 3 已提供可执行脚本
- Actions:
  1. 建立 `lint -> typecheck -> test -> build` 的最小 CI 顺序。
  2. 配置统一格式、Lint 和 TypeScript 校验规则。
  3. 在 `adr-003-ci-baseline.md` 写清 “P1 不做 deploy，只做质量门禁”。
- Commands:
  - `pnpm -r lint`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 一条统一 CI 基线
  - 一份工程规范 ADR
- Acceptance:
  - 四条根级命令都能执行
  - CI 只做质量检查，不引入发布流程
- Evidence:
  - 四条命令输出
  - CI 配置文件路径
- Notes:
  - 发布与回滚属于 P4，不在此 task 展开
