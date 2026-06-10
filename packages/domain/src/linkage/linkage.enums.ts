/**
 * @file Object linkage enums for Phase 2 delivery traceability.
 * @author PopoY
 * @created 2026-06-10
 */

/**
 * Frozen object kinds that can participate in Phase 2 linkage rules.
 */
export const LinkageObjectType = {
  REQUIREMENT_DOCUMENT: "REQUIREMENT_DOCUMENT",
  DESIGN_DOCUMENT: "DESIGN_DOCUMENT",
  STORY: "STORY",
  ACCEPTANCE_RECORD: "ACCEPTANCE_RECORD",
  SPRINT: "SPRINT",
  RETROSPECTIVE_DOCUMENT: "RETROSPECTIVE_DOCUMENT"
} as const;

export type LinkageObjectTypeValue =
  (typeof LinkageObjectType)[keyof typeof LinkageObjectType];

/**
 * Directed relation vocabulary for the Phase 2 evidence chain.
 */
export const LinkageRelationType = {
  REQUIREMENT_TO_DESIGN: "requirement-to-design",
  DESIGN_TO_STORY: "design-to-story",
  STORY_TO_ACCEPTANCE: "story-to-acceptance",
  SPRINT_TO_RETROSPECTIVE: "sprint-to-retrospective"
} as const;

export type LinkageRelationTypeValue =
  (typeof LinkageRelationType)[keyof typeof LinkageRelationType];

/**
 * Cardinality controls duplicate and one-to-one safeguards in service code.
 */
export const LinkageCardinality = {
  ONE_TO_ONE: "one-to-one",
  ONE_TO_MANY: "one-to-many"
} as const;

export type LinkageCardinalityValue =
  (typeof LinkageCardinality)[keyof typeof LinkageCardinality];
