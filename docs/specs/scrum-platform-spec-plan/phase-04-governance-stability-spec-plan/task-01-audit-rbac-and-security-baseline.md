# Task 01 Audit Rbac And Security Baseline

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P4
> Parent Spec: `phase-04-governance-stability-spec.md`
> Parent Plan: `phase-04-governance-stability-spec-plan.md`

## Objective

建立审计、细粒度权限和安全基线，形成企业内部推广前的治理底座。

## Background

如果关键操作不可追溯、权限边界无法审查，系统即使功能完整，也不适合企业内部长期推广，因此 P4 必须先补齐治理底座。

## Scope

- 建立关键操作审计日志边界
- 建立细粒度 RBAC 模型
- 建立基础安全基线与审查清单
- 为企业接入、发布治理和内部基线检查提供审计与权限前置条件

## Out Of Scope

- 不负责监控、错误追踪、备份、归档和恢复，这部分由 `task-02-observability-backup-and-recovery.md` 主承接
- 不负责 SSO 接入、API 规范化、发布回滚和运维手册，这部分由 `task-03-enterprise-integration-and-release-hardening.md` 主承接
- 不扩展成复杂安全运营平台或全公司统一 IAM 产品
- 不回头重塑 P1-P3 的业务角色和流程设计

## Inputs

- P4 `spec` 与 `phase plan`
- P1-P3 已冻结的核心对象、角色和关键操作列表
- 企业内部安全、审计和权限治理要求
- 现有系统中的关键操作路径

## Dependencies

- P1-P3 的核心对象、状态与角色边界必须稳定
- `task-03-enterprise-integration-and-release-hardening.md` 依赖本 task 提供可被企业推广使用的审计与权限基线
- 安全与审计要求需要先收敛成最小检查清单，避免 scope 失控

## Deliverables

- 审计日志模型
- 细粒度 RBAC
- 安全基线清单
- 权限与审计审查边界

## Acceptance Criteria

- 关键操作可追溯
- 权限边界可审查
- 安全基线具备最小检查清单和责任边界

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 关键操作可追溯 | 本 task 主承接审计日志范围、关键操作清单和最小追溯边界 |
| 权限边界清晰且可审查 | 本 task 主承接 RBAC 和权限审查规则 |
| 达到内部推广与运维要求 | 本 task 提供治理前置条件，但不主承接企业推广 readiness |
| 通过内部安全、审计、运维基线 | 本 task 提供安全与审计基线输入，主承接在 `task-03-enterprise-integration-and-release-hardening.md` |

## Risks

- 审计范围定义过宽会显著放大 P4 成本
- RBAC 粒度如果设计过细，会拖慢推广落地
- 安全基线如果没有最小清单，容易演化为无限范围的治理工程

## Open Questions

- 关键操作在 P4 首版是否只覆盖对象变更、权限变更、发布与恢复相关动作
- RBAC 在 P4 是否只要求最小可审查粒度，不要求复杂属性型权限
- 安全基线是否需要首版就形成正式检查项和通过证据模板

## Execution Assumptions

- P1-P3 已有稳定用户、项目、文档、Sprint、运营视图与导出链路。
- 本 task 默认主承接：
  - 审计事件 schema
  - `RBAC`（基于角色的访问控制）矩阵
  - 安全基线清单与证据模板
- 推荐落点：
  - `packages/domain/src/security/*`
  - `apps/api/src/modules/audit/*`
  - `apps/api/src/modules/rbac/*`
  - `apps/api/test/security/*.spec.ts`
  - `docs/runbooks/security/*`

## Steps

### Step 1: 冻结关键操作清单与 Audit Event Schema

- Goal: 把“哪些操作必须审计、审计记录哪些字段”一次性固定下来
- Why: 没有明确清单，审计范围会无限扩张或遗漏关键动作
- Target Files/Paths:
  - `<implementation-repo>/docs/adr/adr-012-audit-scope.md`
  - `<implementation-repo>/packages/domain/src/security/audit-event.types.ts`
  - `<implementation-repo>/packages/domain/src/security/audit-action.enums.ts`
- Preconditions:
  - P1-P3 核心对象已稳定
- Actions:
  1. 冻结首版关键操作：对象变更、权限变更、发布与恢复相关动作。
  2. 定义审计字段：`actorId / objectType / objectId / action / result / payload / ip / userAgent / createdAt`。
  3. 在 ADR 中明确失败操作也需要记录。
- Commands:
  - `pnpm --filter domain typecheck`
  - `pnpm --filter domain test -- audit`
- Expected Output:
  - 审计范围 ADR
  - 审计事件类型定义
- Acceptance:
  - 每类关键操作都有审计规则
  - 成功与失败路径都被覆盖
- Evidence:
  - ADR 路径
  - 类型测试输出
- Notes:
  - 不在此步实现查询界面

### Step 2: 冻结 RBAC 资源、动作与权限矩阵

- Goal: 用一张统一矩阵明确“哪个角色能对哪个资源做什么动作”
- Why: 没有矩阵，前后端权限校验会失去统一依据
- Target Files/Paths:
  - `<implementation-repo>/packages/domain/src/security/rbac.enums.ts`
  - `<implementation-repo>/packages/domain/src/security/rbac.matrix.ts`
  - `<implementation-repo>/docs/adr/adr-013-rbac-matrix.md`
- Preconditions:
  - Step 1 已冻结关键操作清单
- Actions:
  1. 列出资源、动作和角色集合。
  2. 定义默认拒绝策略与前后端校验边界。
  3. 为矩阵编写基础测试，覆盖典型允许与拒绝场景。
- Commands:
  - `pnpm --filter domain test -- rbac`
  - `pnpm --filter domain typecheck`
- Expected Output:
  - RBAC 矩阵
  - 默认拒绝策略说明
- Acceptance:
  - 任一权限判断都可追溯到矩阵
  - 未显式授权的动作默认拒绝
- Evidence:
  - ADR 路径
  - 矩阵测试输出
- Notes:
  - 不做 ABAC 或属性型权限

### Step 3: 实现 Audit 模型、拦截器与失败操作记录

- Goal: 把审计 schema 真正落到 API 层和数据库层
- Why: 文档约定如果不落成代码，就无法满足推广前追溯要求
- Target Files/Paths:
  - `<implementation-repo>/apps/api/prisma/schema.prisma`
  - `<implementation-repo>/apps/api/src/modules/audit/*`
  - `<implementation-repo>/apps/api/test/audit-integration.spec.ts`
- Preconditions:
  - Step 1 已冻结审计 schema
- Actions:
  1. 在数据库中增加审计事件模型。
  2. 实现 Audit 拦截器或服务，记录关键操作和失败结果。
  3. 编写集成测试，覆盖成功更新对象、权限拒绝和失败请求三种路径。
- Commands:
  - `pnpm --filter api prisma validate`
  - `pnpm --filter api test -- audit-integration`
- Expected Output:
  - 审计事件落库
  - 审计集成测试
- Acceptance:
  - 关键操作与失败操作都能留痕
  - 审计字段完整可查
- Evidence:
  - 测试输出
  - Prisma 校验输出
- Notes:
  - 不实现复杂审计分析平台

### Step 4: 实现 RBAC Guard 与越权负例测试

- Goal: 让权限矩阵真正控制 API 访问
- Why: P4 的“权限边界清晰且可审查”必须落在执行期校验上
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/rbac/*`
  - `<implementation-repo>/apps/api/test/rbac-guard.spec.ts`
  - `<implementation-repo>/apps/web/src/lib/rbac/*`
- Preconditions:
  - Step 2 已冻结 RBAC 矩阵
- Actions:
  1. 实现后端 Guard，按资源/动作读取矩阵。
  2. 编写越权负例测试，覆盖未授权访问、角色缺失、项目范围不匹配。
  3. 为前端补最小权限助手，只做按钮/入口隐藏，不替代服务端校验。
- Commands:
  - `pnpm --filter api test -- rbac-guard`
  - `pnpm --filter web test -- rbac`
- Expected Output:
  - RBAC Guard
  - 越权负例测试
- Acceptance:
  - 后端权限拒绝可追溯到矩阵
  - 前端只做辅助显示，不绕过服务端
- Evidence:
  - 测试输出
  - 权限矩阵引用片段
- Notes:
  - 不回头重塑业务角色

### Step 5: 建立安全基线清单与证据模板

- Goal: 把安全基线从口号变成一张可执行检查清单
- Why: 没有证据模板，最终推广验收会变成口头说明
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/security/security-baseline-checklist.md`
  - `<implementation-repo>/docs/runbooks/security/security-evidence-template.md`
  - `<implementation-repo>/apps/api/test/security-baseline.spec.ts`
- Preconditions:
  - Step 3 与 Step 4 已有审计和 RBAC 基础
- Actions:
  1. 列出最小安全检查项，例如审计开启、默认拒绝、敏感字段脱敏、秘密管理约束。
  2. 为每条检查项定义 `Owner / Verification Command / Evidence File / Pass Criteria`。
  3. 编写基线测试，至少覆盖敏感字段脱敏与默认拒绝策略。
- Commands:
  - `pnpm --filter api test -- security-baseline`
  - `pnpm -r lint`
- Expected Output:
  - 安全基线清单
  - 证据模板
- Acceptance:
  - 每条基线都有命令和证据要求
  - 至少一条自动化测试映射到基线项
- Evidence:
  - 清单路径
  - 测试输出
- Notes:
  - 不扩展成全公司安全平台

### Step 6: 执行审计、RBAC 与安全基线主路径验证

- Goal: 用验证结果证明 P4 首版治理底座可审查、可追溯
- Why: 这是 P4 的关键入口条件
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/security/audit-rbac-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/security/p4-audit-rbac-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 5 均已完成
- Actions:
  1. 编写 e2e：执行授权操作、执行越权操作、查看审计记录。
  2. 填写一版基线证据模板，作为推广前样例。
  3. 运行根级测试与构建。
- Commands:
  - `pnpm --filter e2e test -- audit-rbac-flow`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 审计/RBAC 主路径 e2e
  - 安全基线样例证据
- Acceptance:
  - 关键操作可追溯
  - 越权访问可被拒绝并留痕
- Evidence:
  - e2e 输出
  - 证据模板路径
- Notes:
  - 细粒度企业合规流程留待后续扩展
