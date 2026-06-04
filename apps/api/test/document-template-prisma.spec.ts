/**
 * @file Prisma-backed document template regression tests for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { DocumentType } from "@poco-scrum/domain";
import { DocumentTemplatesService } from "../src/modules/document-templates/document-templates.service";

describe("Prisma-backed document template service", () => {
  it("lists default templates from the Prisma documentTemplate delegate", async () => {
    let findManyCalls = 0;
    const service = new DocumentTemplatesService({
      documentTemplate: {
        async findMany() {
          findManyCalls += 1;
          return [
            {
              id: "db-requirement",
              documentType: DocumentType.REQUIREMENT,
              name: "Requirement DB Template",
              description: "Loaded from Prisma.",
              structuredFields: {
                businessGoal: "REQUIRED",
                requester: "REQUIRED",
                priority: "REQUIRED"
              },
              requiredFieldKeys: ["businessGoal", "requester", "priority"],
              markdown: "## Background\n\nLoaded from Prisma.",
              isDefault: true,
              createdById: "system-seed",
              createdAt: new Date("2026-06-04T00:00:00.000Z"),
              updatedAt: new Date("2026-06-04T00:00:00.000Z")
            }
          ];
        }
      }
    });

    const templates = await service.listDefaultTemplates();

    assert.equal(findManyCalls, 1);
    assert.equal(templates[0]?.id, "db-requirement");
    assert.equal(templates[0]?.documentType, DocumentType.REQUIREMENT);
    assert.deepEqual(templates[0]?.requiredFieldKeys, [
      "businessGoal",
      "requester",
      "priority"
    ]);
  });

  it("loads a selected default template by id from Prisma", async () => {
    let findFirstCalls = 0;
    const service = new DocumentTemplatesService({
      documentTemplate: {
        async findFirst({ where }: { where: { id: string } }) {
          findFirstCalls += 1;
          assert.equal(where.id, "db-technical-solution");

          return {
            id: "db-technical-solution",
            documentType: DocumentType.TECHNICAL_SOLUTION,
            name: "Technical Solution DB Template",
            description: "Loaded from Prisma by id.",
            structuredFields: {
              approach: "REQUIRED",
              affectedServices: "REQUIRED",
              risks: "REQUIRED"
            },
            requiredFieldKeys: ["approach", "affectedServices", "risks"],
            markdown: "## Architecture\n\nLoaded from Prisma.",
            isDefault: true,
            createdById: "system-seed",
            createdAt: new Date("2026-06-04T00:00:00.000Z"),
            updatedAt: new Date("2026-06-04T00:00:00.000Z")
          };
        }
      }
    });

    const template = await service.getTemplateById(" db-technical-solution ");

    assert.equal(findFirstCalls, 1);
    assert.equal(template?.id, "db-technical-solution");
    assert.equal(template?.documentType, DocumentType.TECHNICAL_SOLUTION);
  });
});
