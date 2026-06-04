/**
 * @file Document preview whitelist regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DocumentPreviewWhitelist,
  renderMarkdownPreviewHtml
} from "../lib/markdown-sanitize";

describe("document preview whitelist snapshot", () => {
  it("freezes the supported markdown syntax names", () => {
    assert.deepEqual(DocumentPreviewWhitelist, [
      "heading",
      "list",
      "blockquote",
      "table",
      "codeBlock",
      "taskList",
      "image",
      "internalLink"
    ]);
  });

  it("renders the Phase 2 preview fixture without unsafe HTML", () => {
    const markdown = readFileSync(
      join(
        process.cwd(),
        "src/features/documents/fixtures/preview-whitelist.md"
      ),
      "utf8"
    );
    const html = renderMarkdownPreviewHtml(markdown);

    assert.match(html, /<h1>Requirement Document<\/h1>/);
    assert.match(html, /<table><thead><tr><th>Field<\/th><th>Value<\/th><\/tr><\/thead><tbody><tr><td>Priority<\/td><td>HIGH<\/td><\/tr><\/tbody><\/table>/);
    assert.match(html, /<input type="checkbox" checked disabled \/> Completed checklist item/);
    assert.match(html, /<img src="\/attachments\/evidence.png" alt="Evidence" \/>/);
    assert.match(html, /<a href="\/backlog\/story-1" rel="noreferrer" target="_blank">Story Link<\/a>/);
    assert.doesNotMatch(html, /<iframe/);
    assert.match(html, /&lt;iframe src=&quot;https:\/\/example.test&quot;&gt;&lt;\/iframe&gt;/);
  });
});
