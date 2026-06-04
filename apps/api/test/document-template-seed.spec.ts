/**
 * @file Document template seed regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentFieldRequirement,
  DocumentType,
  DocumentTypeMatrix
} from "@poco-scrum/domain";
import { createDefaultDocumentTemplates } from "../prisma/seeds/document-templates.seed";

describe("document template seed", () => {
  it("creates one default template for every formal document type", () => {
    const templates = createDefaultDocumentTemplates("system-seed");

    assert.deepEqual(
      templates.map((template) => template.documentType),
      [
        DocumentType.REQUIREMENT,
        DocumentType.TECHNICAL_SOLUTION,
        DocumentType.ACCEPTANCE,
        DocumentType.RETROSPECTIVE
      ]
    );
    assert.equal(templates.every((template) => template.isDefault), true);
    assert.equal(
      templates.every((template) => template.createdById === "system-seed"),
      true
    );
  });

  it("keeps template structured fields aligned with the field matrix", () => {
    const templates = createDefaultDocumentTemplates("system-seed");

    for (const template of templates) {
      const matrix = DocumentTypeMatrix[template.documentType];
      const requiredFields = Object.entries(matrix.structuredFields)
        .filter(([, requirement]) => requirement === DocumentFieldRequirement.REQUIRED)
        .map(([fieldName]) => fieldName);

      assert.deepEqual(
        template.requiredFieldKeys,
        requiredFields,
        `${template.documentType} required fields should match the matrix`
      );
    }
  });

  it("renders default markdown with every configured section", () => {
    const templates = createDefaultDocumentTemplates("system-seed");

    for (const template of templates) {
      const matrix = DocumentTypeMatrix[template.documentType];

      for (const section of matrix.markdownSections) {
        assert.match(
          template.markdown,
          new RegExp(`## ${section}`),
          `${template.documentType} markdown should include ${section}`
        );
      }
    }
  });
});
