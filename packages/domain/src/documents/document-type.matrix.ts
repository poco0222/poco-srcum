/**
 * @file Formal document field matrix for Phase 2 templates and editors.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  DocumentFieldRequirement,
  DocumentType
} from "./document-type.enums";
import type {
  DocumentFieldRequirementValue,
  DocumentTypeValue
} from "./document-type.enums";

export type DocumentStructuredFieldMatrix = Record<
  string,
  DocumentFieldRequirementValue
>;

export type DocumentTypeMatrixEntry = {
  label: string;
  description: string;
  structuredFields: DocumentStructuredFieldMatrix;
  markdownSections: readonly string[];
};

export type DocumentTypeMatrixMap = Record<
  DocumentTypeValue,
  DocumentTypeMatrixEntry
>;

/**
 * The canonical field matrix used to generate templates and validate forms.
 */
export const DocumentTypeMatrix = {
  [DocumentType.REQUIREMENT]: {
    label: "需求说明",
    description: "沉淀业务目标、用户故事、验收标准和明确的不做范围。",
    structuredFields: {
      businessGoal: DocumentFieldRequirement.REQUIRED,
      requester: DocumentFieldRequirement.REQUIRED,
      priority: DocumentFieldRequirement.REQUIRED,
      targetRelease: DocumentFieldRequirement.OPTIONAL
    },
    markdownSections: [
      "Background",
      "User Story",
      "Acceptance Criteria",
      "Out Of Scope"
    ]
  },
  [DocumentType.TECHNICAL_SOLUTION]: {
    label: "技术方案",
    description: "沉淀技术上下文、架构、数据模型和发布计划。",
    structuredFields: {
      architectureSummary: DocumentFieldRequirement.REQUIRED,
      ownerTeam: DocumentFieldRequirement.REQUIRED,
      riskLevel: DocumentFieldRequirement.REQUIRED,
      rolloutWindow: DocumentFieldRequirement.OPTIONAL
    },
    markdownSections: [
      "Context",
      "Architecture",
      "Data Model",
      "Rollout Plan"
    ]
  },
  [DocumentType.ACCEPTANCE]: {
    label: "验收说明",
    description: "沉淀验收范围、证据、结论和后续事项。",
    structuredFields: {
      acceptanceResult: DocumentFieldRequirement.REQUIRED,
      reviewerId: DocumentFieldRequirement.REQUIRED,
      acceptedAt: DocumentFieldRequirement.REQUIRED,
      followUpOwner: DocumentFieldRequirement.OPTIONAL
    },
    markdownSections: [
      "Scope",
      "Evidence",
      "Decision",
      "Follow Ups"
    ]
  },
  [DocumentType.RETROSPECTIVE]: {
    label: "复盘纪要",
    description: "沉淀 Sprint 复盘结论、改进项、行动项和责任人确认。",
    structuredFields: {
      sprintId: DocumentFieldRequirement.REQUIRED,
      facilitatorId: DocumentFieldRequirement.REQUIRED,
      actionOwnerId: DocumentFieldRequirement.REQUIRED,
      reviewDate: DocumentFieldRequirement.OPTIONAL
    },
    markdownSections: [
      "What Went Well",
      "What To Improve",
      "Actions",
      "Owner Review"
    ]
  }
} as const satisfies DocumentTypeMatrixMap;
