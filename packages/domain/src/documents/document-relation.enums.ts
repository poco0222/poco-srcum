/**
 * @file Formal document relation enums for Phase 2 Scrum artifact linkage.
 * @author PopoY
 * @created 2026-06-04
 */

/**
 * Frozen relation vocabulary for connecting formal documents to Scrum artifacts.
 */
export const DocumentRelationType = {
  REFERENCES_STORY: "references-story",
  SUPPORTS_SPRINT: "supports-sprint",
  RECORDS_ACCEPTANCE: "records-acceptance",
  RECORDS_RETROSPECTIVE: "records-retrospective"
} as const;

export type DocumentRelationTypeValue =
  (typeof DocumentRelationType)[keyof typeof DocumentRelationType];

/**
 * Artifact kinds that can be linked by a formal document relation in Phase 2 Task 1.
 */
export const DocumentRelationTargetType = {
  STORY: "STORY",
  SPRINT: "SPRINT",
  ACCEPTANCE: "ACCEPTANCE",
  RETROSPECTIVE: "RETROSPECTIVE"
} as const;

export type DocumentRelationTargetTypeValue =
  (typeof DocumentRelationTargetType)[keyof typeof DocumentRelationTargetType];
