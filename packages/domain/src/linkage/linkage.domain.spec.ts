/**
 * @file Object linkage model regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  LinkageCardinality,
  LinkageObjectType,
  LinkageRelationRules,
  LinkageRelationType,
  getReverseLinkageRelation,
  isLinkageRelationAllowed
} from "../index";

describe("object linkage relation model", () => {
  it("freezes the Phase 2 linkage relation vocabulary", () => {
    assert.deepEqual(LinkageRelationType, {
      REQUIREMENT_TO_DESIGN: "requirement-to-design",
      DESIGN_TO_STORY: "design-to-story",
      STORY_TO_ACCEPTANCE: "story-to-acceptance",
      SPRINT_TO_RETROSPECTIVE: "sprint-to-retrospective"
    });
  });

  it("defines directed source and target object kinds for every relation", () => {
    assert.deepEqual(LinkageRelationRules[LinkageRelationType.REQUIREMENT_TO_DESIGN], {
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      cardinality: LinkageCardinality.ONE_TO_MANY,
      reverseLabel: "design-to-requirement"
    });
    assert.deepEqual(LinkageRelationRules[LinkageRelationType.DESIGN_TO_STORY], {
      sourceType: LinkageObjectType.DESIGN_DOCUMENT,
      targetType: LinkageObjectType.STORY,
      cardinality: LinkageCardinality.ONE_TO_MANY,
      reverseLabel: "story-to-design"
    });
    assert.deepEqual(LinkageRelationRules[LinkageRelationType.STORY_TO_ACCEPTANCE], {
      sourceType: LinkageObjectType.STORY,
      targetType: LinkageObjectType.ACCEPTANCE_RECORD,
      cardinality: LinkageCardinality.ONE_TO_ONE,
      reverseLabel: "acceptance-to-story"
    });
    assert.deepEqual(LinkageRelationRules[LinkageRelationType.SPRINT_TO_RETROSPECTIVE], {
      sourceType: LinkageObjectType.SPRINT,
      targetType: LinkageObjectType.RETROSPECTIVE_DOCUMENT,
      cardinality: LinkageCardinality.ONE_TO_ONE,
      reverseLabel: "retrospective-to-sprint"
    });
  });

  it("allows only source and target pairs that match the frozen relation rules", () => {
    assert.equal(
      isLinkageRelationAllowed({
        relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
        sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
        targetType: LinkageObjectType.DESIGN_DOCUMENT
      }),
      true
    );
    assert.equal(
      isLinkageRelationAllowed({
        relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
        sourceType: LinkageObjectType.STORY,
        targetType: LinkageObjectType.DESIGN_DOCUMENT
      }),
      false
    );
  });

  it("returns stable reverse navigation labels without changing storage direction", () => {
    assert.equal(
      getReverseLinkageRelation(LinkageRelationType.STORY_TO_ACCEPTANCE),
      "acceptance-to-story"
    );
  });
});
