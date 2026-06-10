# ADR 007 Linkage Model

> Author: PopoY
> Created: 2026-06-10
> Status: Accepted

## Context

P2 Task3 needs a traceable delivery chain across requirement documents, design documents, Story execution, acceptance records, Sprint records, and retrospective documents. Task1 already provides document-to-artifact attachment rules, but Task3 needs a general `ObjectLink`（对象链路）model that can be reused by search（搜索）and dashboard（仪表盘）surfaces.

## Decision

The Phase 2 linkage vocabulary is frozen to four directed relation types:

| Relation | Source Object | Target Object | Cardinality | Reverse Navigation Label |
| --- | --- | --- | --- | --- |
| `requirement-to-design` | `REQUIREMENT_DOCUMENT` | `DESIGN_DOCUMENT` | `one-to-many` | `design-to-requirement` |
| `design-to-story` | `DESIGN_DOCUMENT` | `STORY` | `one-to-many` | `story-to-design` |
| `story-to-acceptance` | `STORY` | `ACCEPTANCE_RECORD` | `one-to-one` | `acceptance-to-story` |
| `sprint-to-retrospective` | `SPRINT` | `RETROSPECTIVE_DOCUMENT` | `one-to-one` | `retrospective-to-sprint` |

Storage remains directed. Reverse navigation is derived from the relation rule instead of writing a second inverse row.

## Boundaries

- P2 does not introduce graph inference, relationship scoring, or knowledge graph traversal.
- P2 does not replace Task1 `DocumentRelation`（文档关系）or `DocumentLink`（文档链接）services; those remain document attachment primitives.
- P2 only enforces duplicate prevention and one-to-one cardinality where the rule requires it.

## Consequences

- Search result cards can render `relationSummary`（关系摘要）from the frozen relation labels without guessing object semantics.
- Dashboard incomplete-link checks can depend on a small rule table rather than ad hoc per-page logic.
- Future phases may add graph traversal as a separate capability without changing the P2 storage direction.
