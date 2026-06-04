/**
 * @file Document preview regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { renderMarkdownPreviewHtml } from "../lib/markdown-sanitize";

describe("document markdown preview", () => {
  it("renders the P1 markdown whitelist", () => {
    const html = renderMarkdownPreviewHtml(`# Acceptance Notes

- Criteria satisfied
- Evidence linked

> Reviewer confirmed the result.

\`\`\`ts
const status = "approved";
\`\`\`

[Open Story](https://example.test/story-1)`);

    assert.match(html, /<h1>Acceptance Notes<\/h1>/);
    assert.match(html, /<ul><li>Criteria satisfied<\/li><li>Evidence linked<\/li><\/ul>/);
    assert.match(html, /<blockquote>Reviewer confirmed the result.<\/blockquote>/);
    assert.match(html, /<pre><code>const status = &quot;approved&quot;;<\/code><\/pre>/);
    assert.match(
      html,
      /<a href="https:\/\/example.test\/story-1" rel="noreferrer" target="_blank">Open Story<\/a>/
    );
  });

  it("escapes scripts and blocks unsafe links", () => {
    const html = renderMarkdownPreviewHtml(`# Safe

<script>alert("xss")</script>

[Bad Link](javascript:alert(1))`);

    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;alert\(&quot;xss&quot;\)&lt;\/script&gt;/);
    assert.match(html, /<span>Bad Link<\/span>/);
    assert.doesNotMatch(html, /javascript:/);
  });
});
