# ADR 008 Search Scope

> Author: PopoY
> Created: 2026-06-11
> Status: Accepted

## Context

Phase 2 Task 3 needs a stable minimal search scope for formal documents, linked Scrum objects, and review surfaces. The goal is delivery traceability without introducing attachment full-text indexing, advanced ranking, or broad cross-system retrieval in P2.

## Decision

P2 search covers only these fields:

- `title`
- `number`
- `tag`
- structured document fields
- Markdown body

P2 search result cards expose this stable contract:

- `objectType`
- `objectId`
- `title`
- `snippet`
- `relationSummary`
- `reviewStatus`
- `updatedAt`

P2 search explicitly excludes attachment full text.

## Consequences

- API contract（接口契约）and web UI（前端界面）can share one predictable search result shape.
- Search remains inside the P2 boundary and avoids accidental expansion into advanced full-text retrieval.
- Future phases can add attachment indexing, ranking, or broader search sources without changing the P2 baseline contract.
