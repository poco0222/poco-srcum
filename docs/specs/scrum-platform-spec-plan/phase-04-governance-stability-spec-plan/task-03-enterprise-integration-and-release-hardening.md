# Task 03 Enterprise Integration And Release Hardening

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P4
> Parent Spec: `phase-04-governance-stability-spec.md`
> Parent Plan: `phase-04-governance-stability-spec-plan.md`

## Objective

建立企业接入、发布治理与运维手册能力，使系统达到企业内部推广的落地要求。

## Background

P4 最终不是为了堆治理能力清单，而是为了让系统真正具备企业内部推广条件。因此必须有一个 task 明确主承接企业接入、发布治理和运维 readiness。

## Scope

- 建立 SSO / 企业账号体系接入边界
- 建立 API 规范化边界
- 建立发布、回滚和运维手册
- 主承接企业推广 readiness、内部基线通过与推广条件定义

## Out Of Scope

- 不负责审计、RBAC 和安全基线本身，这部分由 `task-01-audit-rbac-and-security-baseline.md` 主承接
- 不负责监控、错误追踪、备份、归档和恢复本身，这部分由 `task-02-observability-backup-and-recovery.md` 主承接
- 不扩展成大范围企业集成平台或复杂中台工程
- 不回头重写 P1-P3 的业务能力边界

## Inputs

- P4 `spec` 与 `phase plan`
- `task-01-audit-rbac-and-security-baseline.md` 提供的安全与审计基线
- `task-02-observability-backup-and-recovery.md` 提供的可观测、恢复和回滚运行基础
- 企业内部账号、发布、运维与推广约束

## Dependencies

- `task-01-audit-rbac-and-security-baseline.md`：提供可用于企业推广的安全、权限和审计前置条件
- `task-02-observability-backup-and-recovery.md`：提供发布、回滚和运维治理所需的运行基础
- 企业内部账号体系、API 规范和发布流程约束需要先明确最小边界

## Deliverables

- SSO / 企业账号对接方案
- API 规范化方案
- 发布、回滚、运维手册
- 推广 readiness 清单与基线通过边界

## Acceptance Criteria

- 系统具备企业接入与长期运维的基本条件
- 发布、回滚和运维边界清晰可执行
- 推广 readiness 条件和内部基线通过边界可被说明和检查

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 达到内部推广与运维要求 | 本 task 主承接企业接入、发布治理和运维 readiness |
| 通过内部安全、审计、运维基线 | 本 task 主承接基线通过边界与整体验证路径，依赖前两个 task 提供证据 |
| 具备推广到更多团队的条件 | 本 task 主承接推广条件、运行手册和接入边界 |
| 故障可观测、可恢复、可回滚 | 本 task 只承接发布与回滚流程边界，运行基础由 `task-02-observability-backup-and-recovery.md` 主承接 |

## Risks

- 企业接入范围如果不收敛，容易把 P4 扩展成大型平台接入工程
- 发布和回滚手册如果脱离真实运行路径，会失去实际价值
- readiness 定义如果没有依赖前两个 task 的正式输出，验收会变成空泛口号

## Open Questions

- SSO 在 P4 是否只要求最小接入骨架和边界说明，不要求覆盖全部企业账号特性
- API 规范化是否只覆盖核心接口命名、鉴权和错误语义，不要求全面重构
- readiness 清单是否需要首版就形成正式推广检查项与证据模板

## Execution Assumptions

- `task-01` 已提供审计、RBAC 和安全基线。
- `task-02` 已提供监控、错误追踪、备份恢复与容量基线。
- 本 task 主承接：
  - 企业账号接入骨架
  - API 规范化
  - 发布、回滚、运维手册
  - readiness（就绪性）清单与整体验证
- 推荐落点：
  - `apps/api/src/modules/auth-enterprise/*`
  - `apps/api/src/modules/api-governance/*`
  - `infra/release/*`
  - `docs/runbooks/release/*`
  - `docs/runbooks/readiness/*`

## Steps

### Step 1: 冻结企业接入协议、Claim 清单与认证边界

- Goal: 先把企业接入的最小协议和身份字段写死
- Why: 如果协议边界不明确，后续 SSO 会无限扩张
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-014-enterprise-auth-boundary.md`
  - `<implementation-repo>/packages/domain/src/security/enterprise-auth.types.ts`
  - `<implementation-repo>/apps/api/test/enterprise-auth-contract.spec.ts`
- Preconditions:
  - P4 安全基线已明确
- Actions:
  1. 冻结首版协议选择，例如最小 `OIDC` 接入骨架。
  2. 定义必要 claim：`sub / email / displayName / roles / groups`。
  3. 编写认证 contract test，覆盖 claim 缺失、角色映射失败、会话创建失败。
- Commands:
  - `pnpm --filter api test -- enterprise-auth-contract`
  - `pnpm --filter domain typecheck`
- Expected Output:
  - 企业认证边界 ADR
  - 最小 claim 类型定义
- Acceptance:
  - 企业接入协议不再模糊
  - 失败路径有明确契约
- Evidence:
  - ADR 路径
  - 测试输出
- Notes:
  - 不覆盖所有企业账号特性

### Step 2: 实现企业账号接入骨架与 Auth Flow 测试

- Goal: 给系统补上最小企业账号接入入口
- Why: 推广到更多团队前，企业接入边界必须可运行
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/auth-enterprise/*`
  - `<implementation-repo>/apps/web/src/app/(public)/enterprise-login/*`
  - `<implementation-repo>/apps/api/test/enterprise-auth-flow.spec.ts`
- Preconditions:
  - Step 1 已冻结协议与 claim
- Actions:
  1. 实现最小企业登录回调与本地用户映射逻辑。
  2. 编写 Auth Flow 测试，覆盖登录成功、未授权拒绝、会话过期、角色映射失败。
  3. 在前端提供企业登录入口与错误提示页。
- Commands:
  - `pnpm --filter api test -- enterprise-auth-flow`
  - `pnpm --filter web test -- enterprise-login`
- Expected Output:
  - 企业账号接入骨架
  - 登录流程测试
- Acceptance:
  - 企业登录主路径可运行
  - 常见失败路径有明确处理
- Evidence:
  - 测试输出
  - 页面截图
- Notes:
  - 不替代原有最小本地登录方案

### Step 3: 冻结 API Convention 并实现一致性测试

- Goal: 用统一规则收敛接口命名、鉴权、错误结构、分页和时间格式
- Why: 企业推广前必须避免 API 风格碎片化
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-015-api-conventions.md`
  - `<implementation-repo>/packages/shared/src/api/api-error.schema.ts`
  - `<implementation-repo>/apps/api/test/api-conventions.spec.ts`
- Preconditions:
  - Step 2 已有企业登录入口
- Actions:
  1. 冻结 API 规范，包括路径命名、错误码、分页字段、时间格式。
  2. 编写一致性测试，覆盖鉴权失败响应、分页结构和错误体。
  3. 梳理核心接口并补齐不符合约定的部分。
- Commands:
  - `pnpm --filter api test -- api-conventions`
  - `pnpm --filter api typecheck`
- Expected Output:
  - API 规范 ADR
  - API 一致性测试
- Acceptance:
  - 核心接口错误结构统一
  - 分页和时间字段遵循同一规范
- Evidence:
  - 测试输出
  - ADR 路径
- Notes:
  - 不做全面重构，只收敛核心接口

### Step 4: 冻结发布路径、回滚入口与 Release Script

- Goal: 把发布和回滚从“口头流程”变成有脚本、有顺序的正式路径
- Why: 推广阶段最怕发布路径不清导致恢复失败
- Target Files/Paths:
  - `<implementation-repo>/infra/release/release.sh`
  - `<implementation-repo>/infra/release/rollback.sh`
  - `<implementation-repo>/docs/runbooks/release/release-path.md`
  - `<implementation-repo>/apps/api/test/release-smoke-contract.spec.ts`
- Preconditions:
  - Step 3 已冻结 API 规范
  - `task-02` 已提供恢复基础
- Actions:
  1. 明确正式发布路径与依赖顺序。
  2. 编写最小 release/rollback 脚本骨架。
  3. 编写发布契约测试，约束关键前置检查和回滚入口。
- Commands:
  - `pnpm --filter api test -- release-smoke-contract`
- Expected Output:
  - 发布脚本
  - 回滚脚本
  - 发布路径手册
- Acceptance:
  - 发布与回滚入口清晰可执行
  - 前置检查要求明确
- Evidence:
  - 脚本路径
  - 测试输出
- Notes:
  - 真实生产发布仍需人工审批

### Step 5: 编写运维手册与推广 Readiness Checklist

- Goal: 把运维与推广要求压缩成可逐项勾选的检查单
- Why: 没有 readiness 清单，P4 最终验收会失焦
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/release/operations-handbook.md`
  - `<implementation-repo>/docs/runbooks/readiness/readiness-checklist.md`
  - `<implementation-repo>/docs/runbooks/readiness/readiness-evidence-template.md`
- Preconditions:
  - Step 4 已有发布与回滚路径
- Actions:
  1. 编写运维手册，覆盖发布、回滚、故障定位、恢复入口。
  2. 编写 readiness checklist，每条含 `Owner / Verification Command / Evidence File / Pass Criteria`。
  3. 将 `task-01`、`task-02` 的基线证据要求汇总到 checklist。
- Commands:
  - `pnpm -r lint`
  - `pnpm -r test`
- Expected Output:
  - 运维手册
  - 推广 readiness 清单与证据模板
- Acceptance:
  - 每条 readiness 项都有可验证命令和证据要求
  - 安全、可观测、恢复证据都能被引用
- Evidence:
  - 文档路径
  - 命令输出摘要
- Notes:
  - 不扩展为全公司统一运维平台

### Step 6: 执行发布、回滚与 Readiness 主路径验证

- Goal: 用一轮整体验证证明系统具备企业内部推广条件
- Why: 这是 P4 的最终出口
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/release/release-readiness-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/readiness/p4-release-readiness-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 5 均已完成
- Actions:
  1. 编写 e2e：企业登录 -> 核心 API 调用 -> 发布前检查 -> 发布后冒烟 -> 回滚验证。
  2. 填写一版完整 readiness checklist 样例。
  3. 运行根级测试与构建，确认整体验证通过。
- Commands:
  - `pnpm --filter e2e test -- release-readiness-flow`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 发布与就绪性主路径 e2e
  - 完整 readiness 样例证据
- Acceptance:
  - 发布、回滚和运维边界清晰可执行
  - 系统具备推广到更多团队的条件
- Evidence:
  - e2e 输出
  - readiness 文档路径
- Notes:
  - 只有完成本步，P4 才能宣称达到推广 readiness
