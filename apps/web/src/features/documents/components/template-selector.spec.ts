/**
 * @file Template selector regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentFieldRequirement,
  DocumentType
} from "@poco-scrum/domain";
import { buildTemplateSelectorOptions } from "./template-selector";

describe("template selector helpers", () => {
  it("builds stable selector options from default document templates", () => {
    const options = buildTemplateSelectorOptions([
      {
        id: "default-requirement",
        documentType: DocumentType.REQUIREMENT,
        name: "需求说明默认模板",
        description: "Requirement template",
        structuredFields: {
          businessGoal: DocumentFieldRequirement.REQUIRED
        },
        requiredFieldKeys: ["businessGoal"],
        markdown: "## Background",
        isDefault: true,
        createdById: "system-seed"
      }
    ]);

    assert.deepEqual(options, [
      {
        documentType: DocumentType.REQUIREMENT,
        documentTypeLabel: "需求说明",
        templateId: "default-requirement",
        templateName: "需求说明默认模板",
        requiredFieldKeys: ["businessGoal"]
      }
    ]);
  });
});
