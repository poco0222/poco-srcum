/**
 * @file Object linkage direction and navigation rules for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import {
  LinkageCardinality,
  LinkageObjectType,
  LinkageRelationType,
  type LinkageCardinalityValue,
  type LinkageObjectTypeValue,
  type LinkageRelationTypeValue
} from "./linkage.enums";

export type LinkageRelationRule = {
  sourceType: LinkageObjectTypeValue;
  targetType: LinkageObjectTypeValue;
  cardinality: LinkageCardinalityValue;
  reverseLabel: string;
};

export type LinkageRelationRuleMap = Record<
  LinkageRelationTypeValue,
  LinkageRelationRule
>;

/**
 * Storage remains directed, while reverse labels keep navigation copy stable.
 */
export const LinkageRelationRules = {
  [LinkageRelationType.REQUIREMENT_TO_DESIGN]: {
    sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
    targetType: LinkageObjectType.DESIGN_DOCUMENT,
    cardinality: LinkageCardinality.ONE_TO_MANY,
    reverseLabel: "design-to-requirement"
  },
  [LinkageRelationType.DESIGN_TO_STORY]: {
    sourceType: LinkageObjectType.DESIGN_DOCUMENT,
    targetType: LinkageObjectType.STORY,
    cardinality: LinkageCardinality.ONE_TO_MANY,
    reverseLabel: "story-to-design"
  },
  [LinkageRelationType.STORY_TO_ACCEPTANCE]: {
    sourceType: LinkageObjectType.STORY,
    targetType: LinkageObjectType.ACCEPTANCE_RECORD,
    cardinality: LinkageCardinality.ONE_TO_ONE,
    reverseLabel: "acceptance-to-story"
  },
  [LinkageRelationType.SPRINT_TO_RETROSPECTIVE]: {
    sourceType: LinkageObjectType.SPRINT,
    targetType: LinkageObjectType.RETROSPECTIVE_DOCUMENT,
    cardinality: LinkageCardinality.ONE_TO_ONE,
    reverseLabel: "retrospective-to-sprint"
  }
} as const satisfies LinkageRelationRuleMap;

/**
 * @param input Relation and endpoint kinds to validate against the frozen rules.
 * @returns True when the source and target object kinds match the relation.
 */
export function isLinkageRelationAllowed(input: {
  relationType: LinkageRelationTypeValue;
  sourceType: LinkageObjectTypeValue;
  targetType: LinkageObjectTypeValue;
}) {
  const rule = LinkageRelationRules[input.relationType];

  return (
    rule.sourceType === input.sourceType && rule.targetType === input.targetType
  );
}

/**
 * @param relationType The stored forward relation type.
 * @returns Stable label used by reverse navigation surfaces.
 */
export function getReverseLinkageRelation(
  relationType: LinkageRelationTypeValue
) {
  return LinkageRelationRules[relationType].reverseLabel;
}
