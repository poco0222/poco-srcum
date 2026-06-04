/**
 * @file Document target enum for the Phase 1 Form plus Markdown document model.
 * @author PopoY
 * @created 2026-06-04
 */

export const DocumentTargetType = {
  STORY: "STORY",
  SPRINT: "SPRINT",
  RETROSPECTIVE: "RETROSPECTIVE"
} as const;

export type DocumentTargetTypeValue =
  (typeof DocumentTargetType)[keyof typeof DocumentTargetType];
