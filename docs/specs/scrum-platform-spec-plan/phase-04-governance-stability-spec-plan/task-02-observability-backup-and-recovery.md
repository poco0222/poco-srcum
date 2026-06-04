# Task 02 Observability Backup And Recovery

> Author: PopoY
> Created: 2026-06-04
> Status: planned
> Phase: P4
> Parent Spec: `phase-04-governance-stability-spec.md`
> Parent Plan: `phase-04-governance-stability-spec-plan.md`

## Objective

建立监控、错误追踪、备份、归档、恢复能力，确保系统具备可观测、可恢复的运行基础。

## Background

如果系统没有可观测性和恢复能力，出了问题就无法定位、无法恢复，也无法支撑企业内部长期推广，因此 P4 必须把运行稳定性能力补齐。

## Scope

- 建立监控、告警和错误追踪边界
- 建立备份、归档和恢复策略
- 建立容量与稳定性基线
- 为发布回滚和企业推广提供运行层面的治理基础

## Out Of Scope

- 不负责审计、RBAC 和安全基线，这部分由 `task-01-audit-rbac-and-security-baseline.md` 主承接
- 不负责 SSO、API 规范化、发布治理和运维手册，这部分由 `task-03-enterprise-integration-and-release-hardening.md` 主承接
- 不扩展成复杂平台工程产品或大规模自动化运维系统
- 不在本 task 内定义业务层 KPI 或运营报表口径

## Inputs

- P4 `spec` 与 `phase plan`
- 现有系统的运行路径、关键组件和故障场景
- 企业内部对备份、归档、恢复和监控告警的约束
- P1-P3 已沉淀的真实运行数据和异常场景

## Dependencies

- 现有系统必须具备稳定运行路径，才能识别监控点和恢复边界
- `task-03-enterprise-integration-and-release-hardening.md` 依赖本 task 提供回滚、恢复和运维治理基础
- 归档、备份与恢复边界需要和企业合规要求对齐

## Deliverables

- 监控与告警方案
- 错误追踪边界
- 备份、归档与恢复方案
- 容量与稳定性基线

## Acceptance Criteria

- 关键故障可观测
- 数据可恢复
- 关键异常具备错误追踪和最小归因入口
- 归档、恢复与发布回滚边界可明确衔接

## Phase Acceptance Covered

| Phase Requirement | Task Mapping |
| --- | --- |
| 故障可观测、可恢复、可回滚 | 本 task 主承接监控、错误追踪、备份、归档和恢复边界，并为回滚提供运行基础 |
| 达到内部推广与运维要求 | 本 task 提供运行稳定性前置条件，但不主承接企业推广 readiness |
| 通过内部安全、审计、运维基线 | 本 task 提供运维与恢复基线输入，主承接在 `task-03-enterprise-integration-and-release-hardening.md` |
| 关键操作可追溯 | 本 task 不主承接关键操作审计，相关要求由 `task-01-audit-rbac-and-security-baseline.md` 主承接 |

## Risks

- 监控、错误追踪和恢复边界如果不收敛，P4 很容易范围膨胀
- 归档策略如果与恢复要求冲突，会导致治理设计失真
- 回滚如果没有和发布治理衔接好，phase 验收会出现 owner 漂移

## Open Questions

- `rollback`（回滚）在 P4 是否只要求发布级流程和最小数据恢复边界
- 归档在 P4 是否只要求策略、保留期和恢复关系，不要求复杂生命周期自动化
- 错误追踪是否只要求关键异常聚合与定位入口，不要求深度平台化治理

## Execution Assumptions

- 本 task 主承接：
  - 监控与告警边界
  - 错误追踪入口
  - 备份、归档、恢复与容量基线
- 推荐落点：
  - `apps/api/src/modules/observability/*`
  - `apps/worker/src/modules/observability/*`
  - `infra/monitoring/*`
  - `scripts/backup/*`
  - `docs/runbooks/operations/*`

## Steps

### Step 1: 盘点运行组件、数据存储与故障入口

- Goal: 先列出系统有哪些运行组件、数据存储和关键故障入口
- Why: 没有组件清单，监控点和恢复策略会凭感觉定义
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/operations/component-inventory.md`
  - `<implementation-repo>/docs/runbooks/operations/failure-entry-points.md`
- Preconditions:
  - P1-P3 已有真实运行路径
- Actions:
  1. 盘点 `web / api / worker / database / object storage / queue` 等组件。
  2. 记录每个组件的故障入口、日志入口和健康检查路径。
  3. 标记关键数据存储与其恢复优先级。
- Commands:
  - `find . -maxdepth 3 -type f | sort`
  - `rg -n "health|logger|monitor|backup|restore|queue|cron|schedule" .`
- Expected Output:
  - 组件清单
  - 故障入口清单
- Acceptance:
  - 关键组件与数据存储都被覆盖
  - 后续监控和恢复任务有明确对象
- Evidence:
  - 清单文档路径
  - 检索输出摘要
- Notes:
  - 本步只做盘点，不改运行逻辑

### Step 2: 冻结 Observability Matrix 与健康检查标准

- Goal: 把每个组件需要哪些监控、日志和告警标准写成矩阵
- Why: “关键故障可观测”必须落成具体信号，而不是抽象承诺
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/operations/observability-matrix.md`
  - `<implementation-repo>/apps/api/test/health-check.spec.ts`
  - `<implementation-repo>/apps/worker/test/worker-health.spec.ts`
- Preconditions:
  - Step 1 已完成组件盘点
- Actions:
  1. 为每个组件列出健康检查、关键日志、关键告警、负责人。
  2. 编写健康检查测试，覆盖 API 和 worker 的最小探活。
  3. 明确哪些错误必须进入错误追踪系统。
- Commands:
  - `pnpm --filter api test -- health-check`
  - `pnpm --filter worker test -- worker-health`
- Expected Output:
  - Observability Matrix
  - 健康检查测试
- Acceptance:
  - 关键组件均有探活与最小告警定义
  - 错误追踪入口范围明确
- Evidence:
  - 矩阵文档路径
  - 测试输出
- Notes:
  - 不在此步做告警平台集成细节

### Step 3: 实现错误追踪入口与关键异常采集验证

- Goal: 让关键异常具备统一采集和归因入口
- Why: 没有错误追踪，运维无法快速定位问题
- Target Files/Paths:
  - `<implementation-repo>/apps/api/src/modules/observability/error-tracking.service.ts`
  - `<implementation-repo>/apps/worker/src/modules/observability/error-tracking.service.ts`
  - `<implementation-repo>/apps/api/test/error-capture.spec.ts`
- Preconditions:
  - Step 2 已冻结错误追踪范围
- Actions:
  1. 为 API 与 worker 接入统一错误采集入口。
  2. 编写错误采集测试，覆盖业务异常和未处理异常。
  3. 记录异常分组、上下文字段和最小归因要求。
- Commands:
  - `pnpm --filter api test -- error-capture`
  - `pnpm --filter worker test -- error-capture`
- Expected Output:
  - 错误追踪服务
  - 关键异常采集测试
- Acceptance:
  - 关键异常可以被统一采集
  - 异常记录包含必要上下文
- Evidence:
  - 测试输出
  - 追踪样例
- Notes:
  - 不做深度平台化治理

### Step 4: 冻结备份、归档与恢复矩阵

- Goal: 用矩阵明确“备什么、保多久、怎么恢复”
- Why: 恢复能力最怕边界模糊，必须先文档化
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/operations/backup-recovery-matrix.md`
  - `<implementation-repo>/scripts/backup/*`
  - `<implementation-repo>/scripts/restore/*`
- Preconditions:
  - Step 1 已识别数据存储
- Actions:
  1. 为数据库、对象存储和关键导出产物定义备份频率与保留期。
  2. 定义归档策略与恢复关系。
  3. 写出最小恢复顺序和依赖条件。
- Commands:
  - `rg -n "postgres|mysql|redis|s3|oss|minio|prisma|queue" .`
- Expected Output:
  - 备份恢复矩阵
  - 备份/恢复脚本路径清单
- Acceptance:
  - 每个关键数据存储都有备份和恢复说明
  - 归档与恢复边界不冲突
- Evidence:
  - 矩阵文档路径
  - 脚本路径
- Notes:
  - 不做复杂生命周期自动化

### Step 5: 实现备份 Dry Run 与恢复演练测试

- Goal: 把恢复策略从文档变成可验证演练
- Why: 只有演练成功，才能证明“数据可恢复”
- Target Files/Paths:
  - `<implementation-repo>/scripts/backup/backup-dry-run.sh`
  - `<implementation-repo>/scripts/restore/restore-dry-run.sh`
  - `<implementation-repo>/apps/api/test/backup-restore-drill.spec.ts`
- Preconditions:
  - Step 4 已冻结备份恢复矩阵
- Actions:
  1. 编写备份 dry run 与恢复 dry run 脚本。
  2. 编写演练测试，覆盖备份成功、恢复顺序与关键数据可读。
  3. 记录演练日志样例。
- Commands:
  - `pnpm --filter api test -- backup-restore-drill`
- Expected Output:
  - 备份/恢复演练脚本
  - 演练测试
- Acceptance:
  - 关键数据可完成备份与恢复演练
  - 演练过程有明确日志
- Evidence:
  - 测试输出
  - 演练日志样例
- Notes:
  - 真正生产恢复需要额外审批，不在此 task 中展开

### Step 6: 冻结容量与稳定性基线

- Goal: 给关键接口和作业定义最小容量与稳定性阈值
- Why: 没有阈值，就无法判断系统是否达到推广标准
- Target Files/Paths:
  - `<implementation-repo>/docs/runbooks/operations/capacity-baseline.md`
  - `<implementation-repo>/apps/api/test/capacity-baseline.spec.ts`
- Preconditions:
  - Step 2 已有 Observability Matrix
- Actions:
  1. 为关键接口、导出作业、周报任务定义最小响应时间或处理时间基线。
  2. 编写采样验证测试或 smoke benchmark。
  3. 记录容量基线超阈值时的排查入口。
- Commands:
  - `pnpm --filter api test -- capacity-baseline`
- Expected Output:
  - 容量与稳定性基线文档
  - 采样测试
- Acceptance:
  - 关键路径有最小性能阈值
  - 超阈值时有明确排查入口
- Evidence:
  - 测试输出
  - 基线文档路径
- Notes:
  - 不追求平台级压测体系

### Step 7: 执行可观测、备份与恢复主路径验证

- Goal: 用证据证明系统达到“可观测、可恢复”的最低标准
- Why: 这是 P4 推广前的核心非功能验收之一
- Target Files/Paths:
  - `<implementation-repo>/tests/e2e/operations/observability-recovery-flow.spec.ts`
  - `<implementation-repo>/docs/runbooks/operations/p4-observability-recovery-smoke-check.md`
- Preconditions:
  - Step 1 至 Step 6 均已完成
- Actions:
  1. 执行健康检查、错误采集、备份恢复演练与容量采样验证。
  2. 记录日志样例、告警样例和恢复记录。
  3. 运行根级测试与构建。
- Commands:
  - `pnpm --filter e2e test -- observability-recovery-flow`
  - `pnpm -r test`
  - `pnpm -r build`
- Expected Output:
  - 可观测与恢复主路径 e2e
  - P4 运行稳定性证据
- Acceptance:
  - 关键故障可观测
  - 关键数据可恢复
- Evidence:
  - e2e 输出
  - 运行手册路径
- Notes:
  - 发布级回滚流程由下一 task 主承接
