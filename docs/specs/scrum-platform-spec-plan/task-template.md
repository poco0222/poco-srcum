# Task Template For Scrum Platform Spec Plan

> Author: PopoY
> Created: 2026-06-04
> Status: Template
> Purpose: 统一 `task`（任务）文档结构，补齐边界、依赖、阶段验收映射，并把 `step`（步骤）细化到可直接驱动 Codex 开发的粒度

## Usage Notes

- 本模板用于各 phase 的独立 `task-xx-*.md` 文档。
- 先写清楚 task 的目标、边界、依赖、交付物和验收，再决定是否细化 `Steps`。
- `Steps` 默认按 Codex 可执行标准编写，不再保留“后续再补”的占位说明。

## Codex Execution Baseline

- 以下 `Steps` 默认面向真实实现仓，而不是当前 `docs/specs/...` 文档仓直接编码。
- 真实实现仓固定为 `https://github.com/poco0222/poco-srcum.git`，下文的 `<implementation-repo>` 统一指该仓库在本地的 clone 根目录。
- 开始任何实现前，先在 `<implementation-repo>` 根目录执行 `git remote get-url origin`，确认远端地址与固定仓库地址一致。
- 推荐 `Monorepo`（单仓）布局：
  - `apps/web`：`Next.js + TypeScript + Ant Design`
  - `apps/api`：`NestJS + Prisma`
  - `apps/worker`：异步任务、通知和导出作业
  - `packages/domain`：领域模型、枚举、状态机
  - `packages/shared`：DTO、校验、跨端工具
  - `packages/ui`：复用组件
  - `tests/e2e`：跨应用端到端验证
  - `docs/adr` / `docs/runbooks`：架构决策与运行手册
- 根级脚本至少提供：
  - `pnpm -r lint`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r build`
- 若真实代码仓路径、包名或脚本命名与本模板不同，必须在每个 task 的 `Step 1` 先补一张对齐表，再继续后续步骤。

---

# Task XX Task Name

> Author: PopoY
> Created: YYYY-MM-DD
> Status: planned
> Phase: P1 / P2 / P3 / P4
> Parent Spec: `phase-xx-*.md`
> Parent Plan: `phase-xx-*-spec-plan.md`

## Objective

用 1-2 句话写清楚本 task 的核心目标，并说明它为当前 phase 解决的关键问题。

## Background

- 说明为什么这个 task 要在当前 phase 做。
- 说明它承接了哪些上层 `spec`（规格）要求。
- 说明如果不做，会阻塞哪些后续 task 或阶段目标。

## Scope

- 列出本 task 明确负责的能力点。
- 优先写“必须做什么”，避免写成宽泛愿景。

## Out Of Scope

- 列出本 task 明确不做的内容。
- 如果某些能力属于后续 phase，应明确写出，避免 `scope creep`（范围蔓延）。

## Inputs

- 当前 phase 的 `spec`（规格）文档
- 当前 phase 的 `spec plan`（阶段计划）文档
- 已确认的业务规则、状态机、命名约束
- 已完成或必须先完成的上游 task

## Dependencies

- `task-xx-*.md`：写清它提供什么前置条件
- 外部约束：如账号体系、部署约束、文档格式约束、集成接口约束

## Deliverables

- 列出本 task 交付的核心模型、流程、页面、规则、文档或运行能力。
- 每一条尽量是可检查的产出，而不是笼统表述。

## Acceptance Criteria

- 每条都要可验证，避免只写“支持”“具备”“完善”这类模糊词。
- 尽量写成“在什么条件下，系统必须表现出什么结果”。
- 如果交付物里有 4 个能力点，验收标准至少要覆盖它们中的核心项。

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| `spec` 中的某条 `Acceptance Criteria` 或 `Exit Criteria` | 说明本 task 如何覆盖，若只覆盖部分也要写清 |
| `spec` 中的另一条阶段要求 | 说明对应的交付物或验收标准 |

## Risks

- 列出本 task 最容易失控的范围点、设计风险或依赖风险。
- 如果某项能力虽然在范围内，但当前只做最小版本，也应写清楚风险和裁剪边界。

## Open Questions

- 记录当前仍待确认的问题。
- 每条问题尽量写明“影响什么决策”。

## Execution Assumptions

- 写明本 task 假设的目标代码仓位置、推荐模块路径和测试入口。
- 写明本 task 假设的固定远端仓库地址，并说明 `<implementation-repo>` 与本地 clone 根目录的映射关系。
- 如果当前本地还没有真实实现仓，必须明确“先 clone 固定仓库地址 `https://github.com/poco0222/poco-srcum.git`，再在本地 clone 根目录中补齐目录骨架”。
- 对跨 task 共享的路径、脚本名和包名，必须在这里写清楚，避免后续执行时重复猜测。

## Steps

> 必填。每个 step 都必须是 2-5 分钟内可完成的单一动作，并包含路径、命令、输出和验证方式。

### Step 1: Step Name

- Goal: 这一小步唯一要完成什么结果
- Why: 为什么先做这一步，它为后续哪个 step 提供前置条件
- Target Files/Paths:
  - `apps/web/...`
  - `apps/api/...`
  - `packages/domain/...`
  - `tests/...`
- Preconditions:
  - 已完成的上一步
  - 必须已存在的枚举、字段、脚本或外部约束
- Actions:
  1. 在 `<implementation-repo>` 根目录执行 `pwd`、`git remote get-url origin`，确认本地路径与固定远端地址。
  2. 在 `<具体文件路径>` 新增或修改 `<具体对象>`
  3. 在 `<具体文件路径>` 补 `<具体测试 / 文档 / 配置>`
  4. 运行 `<具体命令>` 验证当前改动
- Commands:
  - `git remote get-url origin`
  - `pnpm --filter web test`
  - `pnpm --filter api test`
  - `pnpm -r typecheck`
- Expected Output:
  - 新增的接口、页面、表、枚举、事件或文档
- Acceptance:
  - 至少 1 条成功路径
  - 至少 1 条失败路径或负例约束
- Evidence:
  - 需要记录的远端地址输出、测试名称、API 响应或页面截图
- Notes:
  - 明确这一步不覆盖什么，防止越界

### Step 2: Step Name

- Goal: 这一小步唯一要完成什么结果
- Why: 为什么先做这一步，它为后续哪个 step 提供前置条件
- Target Files/Paths:
  - `apps/web/...`
  - `apps/api/...`
  - `packages/domain/...`
  - `tests/...`
- Preconditions:
  - 已完成的上一步
  - 必须已存在的枚举、字段、脚本或外部约束
- Actions:
  1. 在 `<具体文件路径>` 新增或修改 `<具体对象>`
  2. 在 `<具体文件路径>` 补 `<具体测试 / 文档 / 配置>`
  3. 运行 `<具体命令>` 验证当前改动
- Commands:
  - `pnpm --filter web test`
  - `pnpm --filter api test`
  - `pnpm -r typecheck`
- Expected Output:
  - 新增的接口、页面、表、枚举、事件或文档
- Acceptance:
  - 至少 1 条成功路径
  - 至少 1 条失败路径或负例约束
- Evidence:
  - 需要记录的命令输出、测试名称、API 响应或页面截图
- Notes:
  - 明确这一步不覆盖什么，防止越界

### Step 3: Step Name

- Goal: 这一小步唯一要完成什么结果
- Why: 为什么先做这一步，它为后续哪个 step 提供前置条件
- Target Files/Paths:
  - `apps/web/...`
  - `apps/api/...`
  - `packages/domain/...`
  - `tests/...`
- Preconditions:
  - 已完成的上一步
  - 必须已存在的枚举、字段、脚本或外部约束
- Actions:
  1. 在 `<具体文件路径>` 新增或修改 `<具体对象>`
  2. 在 `<具体文件路径>` 补 `<具体测试 / 文档 / 配置>`
  3. 运行 `<具体命令>` 验证当前改动
- Commands:
  - `pnpm --filter web test`
  - `pnpm --filter api test`
  - `pnpm -r typecheck`
- Expected Output:
  - 新增的接口、页面、表、枚举、事件或文档
- Acceptance:
  - 至少 1 条成功路径
  - 至少 1 条失败路径或负例约束
- Evidence:
  - 需要记录的命令输出、测试名称、API 响应或页面截图
- Notes:
  - 明确这一步不覆盖什么，防止越界

## Writing Checklist

- 本 task 是否明确写了做什么和不做什么
- 本 task 是否明确引用了上层 `spec` 和 `phase plan`
- 本 task 是否说明了依赖哪些上游任务或外部约束
- 本 task 的 `Acceptance Criteria` 是否足以证明 `Deliverables` 完成
- 本 task 是否明确映射了至少一条 phase 级要求
- 每个 step 是否都写了目标代码路径、动作、命令、输出、验收和证据
- 每个 step 是否都包含至少一个测试或验证命令
- 每个 step 是否控制在 2-5 分钟内的单一动作，不混合多个未收敛子问题
