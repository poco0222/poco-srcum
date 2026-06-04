# Phase 02 Document Collaboration Spec Plan

> Author: PopoY
> Created: 2026-06-04
> Status: Draft
> Parent Spec: `phase-02-document-collaboration-spec.md`

## Objective

将 P2 文档协作与评审能力拆解为独立任务，确保系统在不失去 Scrum 主轴的前提下，补齐交付文档闭环。

## Scope

- 文档模板与结构
- Markdown 正文增强与预览稳定性
- 评论、评审、版本历史
- 关联链路、附件与链接、基础搜索、轻量仪表盘

## Out Of Scope

- 不引入复杂知识库、自由工作流引擎或在线 Office 协同编辑
- 不扩展 P3 的项目组合视图、跨项目运营报表和周报导出
- 不提前引入 P4 的审计治理、SSO、备份恢复或发布治理能力
- 不把附件能力扩张为独立文档中心或大型资源库

## Dependencies

- P1 已提供稳定的工作项、Sprint、验收、最小文档挂接与基础附件挂接能力
- P1 中核心实体编号、引用规则和完成定义命名已冻结
- P1 试运行后的真实使用反馈需要进入文档类型、评审流和搜索范围设计
- `Form + Markdown + Preview`（表单加 Markdown 加预览）主格式延续 P1 基线，P2 只在此基础上增强

## Task Index

| Task | Goal | Status |
| --- | --- | --- |
| `task-01-document-template-and-structure.md` | 建立文档模板、正文结构、Markdown 增强与挂接规范 | planned |
| `task-02-review-comment-and-versioning.md` | 建立评论、评审、提及、版本历史能力 | planned |
| `task-03-linkage-search-and-dashboard.md` | 建立关联链路、基础搜索和轻量仪表盘 | planned |

## Milestone

完成本计划后，系统应能把需求、方案、执行、验收、复盘文档和评审记录沉淀在系统内，形成可检索、可追溯的交付证据链。

## Phase Mapping Rules

- 每条 `Acceptance Criteria`（验收标准）和 `Exit Criteria`（退出标准）必须有唯一 `Primary Task`（主承接任务）
- 允许存在 `Supporting Task`（辅助承接任务），但 phase 级完成判断优先以 `Primary Task` 为准

## Phase Acceptance Mapping

| Phase Acceptance Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 需求、方案、执行、验收可通过系统对象串联 | `task-03-linkage-search-and-dashboard.md` | `task-01`, `task-02` |
| 团队可基于模板稳定产出文档 | `task-01-document-template-and-structure.md` | `task-02` |
| 评论、版本历史、评审结论可追溯 | `task-02-review-comment-and-versioning.md` | `task-01` |
| 基础搜索可覆盖核心对象与文档内容 | `task-03-linkage-search-and-dashboard.md` | `task-01`, `task-02` |

## Phase Exit Mapping

| Phase Exit Criteria | Primary Task | Supporting Task |
| --- | --- | --- |
| 系统内可完整沉淀需求说明、技术方案、验收说明、复盘纪要 | `task-01-document-template-and-structure.md` | `task-02`, `task-03` |
| 文档协作不再依赖多个零散外部工具 | `task-02-review-comment-and-versioning.md` | `task-01`, `task-03` |

## Open Questions

- P2 是否需要先冻结正式文档类型清单，再展开评审流和搜索范围
- 文档内容搜索是否只覆盖标题、结构化字段和 Markdown 正文，不覆盖复杂附件全文
- 附件与链接在 P2 是否只要求挂接、引用和基础检索，不要求高级权限和版本管理

## Rules

- 任何任务不得把在线 Office 协同编辑或自由工作流引入 P2
- `Phase Acceptance Mapping` 与 `Phase Exit Mapping` 变更后，相关 task 的 `Phase Acceptance Covered` 必须同步更新
- 文档增强必须建立在 P1 的 `Form + Markdown + Preview` 基线上，不另起一套文档体系
- 搜索与轻量仪表盘只能消费既有结构化数据，不得反向定义新的业务口径
