/**
 * @file Attachment preview regression tests for Phase 1 Task 4.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { getAttachmentPreviewKind } from "../components/attachment-preview";

describe("attachment preview whitelist", () => {
  it("allows image and PDF inline previews", () => {
    assert.equal(getAttachmentPreviewKind("image/png"), "image");
    assert.equal(getAttachmentPreviewKind("image/jpeg"), "image");
    assert.equal(getAttachmentPreviewKind("application/pdf"), "pdf");
  });

  it("falls back to download for unsupported file types", () => {
    assert.equal(getAttachmentPreviewKind("application/zip"), "download");
    assert.equal(getAttachmentPreviewKind("text/html"), "download");
  });
});
