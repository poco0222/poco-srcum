/**
 * @file Formal document type enums for Phase 2 document collaboration.
 * @author PopoY
 * @created 2026-06-04
 */

/**
 * Frozen formal document types supported by Phase 2 Task 1.
 */
export const DocumentType = {
  REQUIREMENT: "REQUIREMENT",
  TECHNICAL_SOLUTION: "TECHNICAL_SOLUTION",
  ACCEPTANCE: "ACCEPTANCE",
  RETROSPECTIVE: "RETROSPECTIVE"
} as const;

export type DocumentTypeValue =
  (typeof DocumentType)[keyof typeof DocumentType];

/**
 * Field requirement levels reused by templates, DTO validation, and UI forms.
 */
export const DocumentFieldRequirement = {
  REQUIRED: "REQUIRED",
  OPTIONAL: "OPTIONAL",
  FORBIDDEN: "FORBIDDEN"
} as const;

export type DocumentFieldRequirementValue =
  (typeof DocumentFieldRequirement)[keyof typeof DocumentFieldRequirement];
