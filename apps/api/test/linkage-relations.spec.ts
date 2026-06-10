/**
 * @file Object linkage service regression tests for Phase 2 Task 3.
 * @author PopoY
 * @created 2026-06-10
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  LinkageObjectType,
  LinkageRelationType
} from "@poco-scrum/domain";
import { LinkageService } from "../src/modules/linkage/linkage.service";

describe("LinkageService", () => {
  it("creates one directed link and exposes forward and reverse navigation", async () => {
    const service = new LinkageService();

    const link = await service.createLink({
      relationType: LinkageRelationType.REQUIREMENT_TO_DESIGN,
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "document-requirement-1",
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "document-design-1",
      actorId: "user-1"
    });

    const forwardLinks = await service.listForwardLinks({
      sourceType: LinkageObjectType.REQUIREMENT_DOCUMENT,
      sourceId: "document-requirement-1"
    });
    const reverseLinks = await service.listReverseLinks({
      targetType: LinkageObjectType.DESIGN_DOCUMENT,
      targetId: "document-design-1"
    });

    assert.equal(link.relationType, LinkageRelationType.REQUIREMENT_TO_DESIGN);
    assert.equal(link.sourceId, "document-requirement-1");
    assert.equal(link.targetId, "document-design-1");
    assert.equal(forwardLinks.length, 1);
    assert.equal(forwardLinks[0]?.id, link.id);
    assert.equal(reverseLinks.length, 1);
    assert.equal(reverseLinks[0]?.id, link.id);
  });

  it("rejects duplicate links with the same relation and endpoints", async () => {
    const service = new LinkageService();
    const input = {
      relationType: LinkageRelationType.DESIGN_TO_STORY,
      sourceType: LinkageObjectType.DESIGN_DOCUMENT,
      sourceId: "document-design-1",
      targetType: LinkageObjectType.STORY,
      targetId: "story-1",
      actorId: "user-1"
    };

    await service.createLink(input);

    await assert.rejects(() => service.createLink(input), {
      message: "OBJECT_LINK_DUPLICATE"
    });
  });

  it("rejects relation endpoints that do not match the frozen rule table", async () => {
    const service = new LinkageService();

    await assert.rejects(
      () =>
        service.createLink({
          relationType: LinkageRelationType.STORY_TO_ACCEPTANCE,
          sourceType: LinkageObjectType.DESIGN_DOCUMENT,
          sourceId: "document-design-1",
          targetType: LinkageObjectType.ACCEPTANCE_RECORD,
          targetId: "acceptance-1",
          actorId: "user-1"
        }),
      {
        message: "OBJECT_LINK_RELATION_MISMATCH"
      }
    );
  });

  it("enforces one-to-one cardinality for Story acceptance links", async () => {
    const service = new LinkageService();

    await service.createLink({
      relationType: LinkageRelationType.STORY_TO_ACCEPTANCE,
      sourceType: LinkageObjectType.STORY,
      sourceId: "story-1",
      targetType: LinkageObjectType.ACCEPTANCE_RECORD,
      targetId: "acceptance-1",
      actorId: "user-1"
    });

    await assert.rejects(
      () =>
        service.createLink({
          relationType: LinkageRelationType.STORY_TO_ACCEPTANCE,
          sourceType: LinkageObjectType.STORY,
          sourceId: "story-1",
          targetType: LinkageObjectType.ACCEPTANCE_RECORD,
          targetId: "acceptance-2",
          actorId: "user-1"
        }),
      {
        message: "OBJECT_LINK_CARDINALITY_VIOLATION"
      }
    );
  });
});
