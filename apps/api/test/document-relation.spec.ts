/**
 * @file Document relation regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DocumentRelationTargetType,
  DocumentRelationType,
  DocumentTargetType,
  DocumentType
} from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";
import { DocumentRelationsService } from "../src/modules/documents/document-relations.service";
import { DocumentsService } from "../src/modules/documents/documents.service";

async function createFormalDocument() {
  const service = new DocumentsService(
    undefined,
    1,
    undefined,
    undefined,
    new DocumentTemplatesService()
  );
  const document = await service.createFormalDocument({
    title: "Requirement Draft",
    documentType: DocumentType.REQUIREMENT,
    templateId: "default-requirement",
    targetType: DocumentTargetType.STORY,
    targetId: "story-1",
    authorId: "author-1",
    structuredFields: {
      businessGoal: "Reduce release risk",
      requester: "PopoY",
      priority: "HIGH"
    },
    markdown: "## Background\n\nFormal document relation payload."
  });

  return {
    document,
    documentsService: service
  };
}

describe("document relation types", () => {
  it("freezes the Phase 2 formal document relation vocabulary", () => {
    assert.deepEqual(DocumentRelationType, {
      REFERENCES_STORY: "references-story",
      SUPPORTS_SPRINT: "supports-sprint",
      RECORDS_ACCEPTANCE: "records-acceptance",
      RECORDS_RETROSPECTIVE: "records-retrospective"
    });
  });
});

describe("DocumentRelationsService", () => {
  it("links one formal document to core Scrum artifacts with explicit relation types", async () => {
    const { document, documentsService } = await createFormalDocument();
    const relationsService = new DocumentRelationsService(documentsService);

    const relations = await Promise.all([
      relationsService.linkDocumentToArtifact({
        documentId: document.id,
        relationType: DocumentRelationType.REFERENCES_STORY,
        targetType: DocumentRelationTargetType.STORY,
        targetId: "story-1",
        actorId: "author-1"
      }),
      relationsService.linkDocumentToArtifact({
        documentId: document.id,
        relationType: DocumentRelationType.SUPPORTS_SPRINT,
        targetType: DocumentRelationTargetType.SPRINT,
        targetId: "sprint-1",
        actorId: "author-1"
      }),
      relationsService.linkDocumentToArtifact({
        documentId: document.id,
        relationType: DocumentRelationType.RECORDS_ACCEPTANCE,
        targetType: DocumentRelationTargetType.ACCEPTANCE,
        targetId: "acceptance-1",
        actorId: "author-1"
      }),
      relationsService.linkDocumentToArtifact({
        documentId: document.id,
        relationType: DocumentRelationType.RECORDS_RETROSPECTIVE,
        targetType: DocumentRelationTargetType.RETROSPECTIVE,
        targetId: "retrospective-1",
        actorId: "author-1"
      })
    ]);

    assert.deepEqual(
      relations.map((relation) => relation.relationType),
      [
        DocumentRelationType.REFERENCES_STORY,
        DocumentRelationType.SUPPORTS_SPRINT,
        DocumentRelationType.RECORDS_ACCEPTANCE,
        DocumentRelationType.RECORDS_RETROSPECTIVE
      ]
    );

    const acceptanceRelations = await relationsService.listRelationsForArtifact({
      targetType: DocumentRelationTargetType.ACCEPTANCE,
      targetId: "acceptance-1"
    });

    assert.equal(acceptanceRelations.length, 1);
    assert.equal(acceptanceRelations[0]?.documentId, document.id);
  });

  it("rejects a relation type when it is attached to the wrong artifact kind", async () => {
    const { document, documentsService } = await createFormalDocument();
    const relationsService = new DocumentRelationsService(documentsService);

    await assert.rejects(
      () =>
        relationsService.linkDocumentToArtifact({
          documentId: document.id,
          relationType: DocumentRelationType.RECORDS_ACCEPTANCE,
          targetType: DocumentRelationTargetType.STORY,
          targetId: "story-1",
          actorId: "author-1"
        }),
      {
        message: "DOCUMENT_RELATION_TARGET_MISMATCH"
      }
    );
  });
});
