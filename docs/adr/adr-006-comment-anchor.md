# ADR-006 Comment Anchor Model

> Author: PopoY
> Created: 2026-06-10
> Status: Accepted

## Context

Phase 2 Task 2 needs document comments, replies, mentions, review conclusions, and version history to share a stable collaboration vocabulary. Free text-range comments would require rich editor selection persistence and complex merge handling, which is outside the P2 boundary.

## Decision

Use three stable comment anchor levels:

- `document`: comment applies to the whole formal document.
- `field`: comment applies to a structured field key from the document type matrix.
- `markdown-block`: comment applies to a canonical Markdown heading or block reference.

Mention tokens use the canonical `@user:<id>` syntax. The parser extracts unique user identifiers in first-seen order and ignores unsupported free-text formats such as `@name` or `@team:<id>`.

## Consequences

- API, web, notification, and review modules can reuse one anchor vocabulary.
- P2 does not support free text-range comments, collaborative cursors, or editor-level merge comments.
- Future editor enhancements can add precise selections behind a new anchor type without changing existing comment records.
