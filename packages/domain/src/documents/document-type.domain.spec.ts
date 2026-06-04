/**
 * @file Formal document type matrix regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentFieldRequirement,
  DocumentType,
  DocumentTypeMatrix
} from "../index";

describe("formal document type matrix", () => {
  it("freezes the first four Phase 2 formal document types", () => {
    assert.deepEqual(DocumentType, {
      REQUIREMENT: "REQUIREMENT",
      TECHNICAL_SOLUTION: "TECHNICAL_SOLUTION",
      ACCEPTANCE: "ACCEPTANCE",
      RETROSPECTIVE: "RETROSPECTIVE"
    });
  });

  it("defines required structured fields for every formal document type", () => {
    assert.equal(
      DocumentTypeMatrix.REQUIREMENT.structuredFields.businessGoal,
      DocumentFieldRequirement.REQUIRED
    );
    assert.equal(
      DocumentTypeMatrix.TECHNICAL_SOLUTION.structuredFields.architectureSummary,
      DocumentFieldRequirement.REQUIRED
    );
    assert.equal(
      DocumentTypeMatrix.ACCEPTANCE.structuredFields.acceptanceResult,
      DocumentFieldRequirement.REQUIRED
    );
    assert.equal(
      DocumentTypeMatrix.RETROSPECTIVE.structuredFields.sprintId,
      DocumentFieldRequirement.REQUIRED
    );
  });

  it("defines reusable markdown sections for template generation", () => {
    assert.deepEqual(DocumentTypeMatrix.REQUIREMENT.markdownSections, [
      "Background",
      "User Story",
      "Acceptance Criteria",
      "Out Of Scope"
    ]);
    assert.deepEqual(DocumentTypeMatrix.TECHNICAL_SOLUTION.markdownSections, [
      "Context",
      "Architecture",
      "Data Model",
      "Rollout Plan"
    ]);
    assert.deepEqual(DocumentTypeMatrix.ACCEPTANCE.markdownSections, [
      "Scope",
      "Evidence",
      "Decision",
      "Follow Ups"
    ]);
    assert.deepEqual(DocumentTypeMatrix.RETROSPECTIVE.markdownSections, [
      "What Went Well",
      "What To Improve",
      "Actions",
      "Owner Review"
    ]);
  });
});
