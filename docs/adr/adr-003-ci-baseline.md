# ADR 003 CI Baseline

> Author: PopoY
> Created: 2026-06-04
> Status: Accepted

## Context

Phase 1 进入多人和 AI 并行修改阶段后，如果没有统一质量门禁，最基础的类型、测试和构建问题会不断回流到后续任务。

P1 当前目标是先稳住质量基线，而不是进入完整发布链路，因此需要一条只负责质量检查的最小 CI。

## Decision

当前 CI 基线固定为以下顺序：

1. `pnpm -r lint`
2. `pnpm -r typecheck`
3. `pnpm -r test`
4. `pnpm -r build`

配套约束如下：

- 使用 `corepack pnpm` 执行工作区命令，保持本地和 CI 的包管理器入口一致。
- 当前只做质量门禁，不在 Phase 1 引入 deploy、release 或 rollback 逻辑。
- `.editorconfig` 和 `eslint.config.mjs` 作为本阶段最小工程规范，后续可迭代增强，但不得绕过四条根级命令。

## Consequences

- 新增包和模块必须至少实现 `lint`、`typecheck`、`test`、`build` 中相关脚本，确保能被根级命令统一扫描。
- 后续 Phase 1 任务如果引入更多测试类型，应优先扩展现有四步质量门禁，而不是新增旁路脚本。
- 发布、回滚和环境矩阵能力属于 Phase 4，不在本 ADR 范围内。
