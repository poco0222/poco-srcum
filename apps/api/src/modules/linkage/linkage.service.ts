/**
 * @file Object linkage service for Phase 2 delivery traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { BadRequestException } from "@nestjs/common";

import {
  LinkageCardinality,
  LinkageObjectType,
  LinkageRelationRules,
  LinkageRelationType,
  isLinkageRelationAllowed,
  type LinkageObjectTypeValue,
  type LinkageRelationTypeValue,
  type ObjectLinkRecord
} from "@poco-scrum/domain";
import {
  InMemoryObjectLinksRepository,
  type ObjectLinksRepository
} from "./linkage.repository";

export type CreateObjectLinkInput = {
  relationType: LinkageRelationTypeValue;
  sourceType: LinkageObjectTypeValue;
  sourceId: string;
  targetType: LinkageObjectTypeValue;
  targetId: string;
  actorId: string;
};

export type ListForwardObjectLinksInput = {
  sourceType: LinkageObjectTypeValue;
  sourceId: string;
};

export type ListReverseObjectLinksInput = {
  targetType: LinkageObjectTypeValue;
  targetId: string;
};

const linkageRelationTypeValues = new Set<LinkageRelationTypeValue>(
  Object.values(LinkageRelationType)
);
const linkageObjectTypeValues = new Set<LinkageObjectTypeValue>(
  Object.values(LinkageObjectType)
);

/**
 * Coordinates object link creation, duplicate prevention, and reverse lookup.
 */
export class LinkageService {
  constructor(
    private readonly repository: ObjectLinksRepository = new InMemoryObjectLinksRepository(),
    private nextSequence = 1
  ) {}

  /**
   * @param input The directed object link creation command.
   * @returns The persisted object link record.
   */
  async createLink(input: CreateObjectLinkInput) {
    const payload = normalizeCreateLinkInput(input);

    if (!isLinkageRelationAllowed(payload)) {
      throw new BadRequestException("OBJECT_LINK_RELATION_MISMATCH");
    }

    await this.assertNoDuplicate(payload);
    await this.assertCardinality(payload);

    const link: ObjectLinkRecord = {
      id: `object-link-${this.nextSequence++}`,
      ...payload,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(link);
  }

  /**
   * @param input The source endpoint whose outgoing links should be listed.
   * @returns Object links from the requested source endpoint.
   */
  async listForwardLinks(input: ListForwardObjectLinksInput) {
    const payload = normalizeForwardQuery(input);

    return this.repository.listForward({
      objectType: payload.sourceType,
      objectId: payload.sourceId
    });
  }

  /**
   * @param input The target endpoint whose incoming links should be listed.
   * @returns Object links pointing at the requested target endpoint.
   */
  async listReverseLinks(input: ListReverseObjectLinksInput) {
    const payload = normalizeReverseQuery(input);

    return this.repository.listReverse({
      objectType: payload.targetType,
      objectId: payload.targetId
    });
  }

  /**
   * @returns Every persisted link for read-model aggregation.
   */
  listAllLinks() {
    return this.repository.listAll();
  }

  /**
   * @param payload The normalized link command.
   */
  private async assertNoDuplicate(payload: CreateObjectLinkInput) {
    const existing = await this.repository.findDuplicate(payload);

    if (existing) {
      throw new BadRequestException("OBJECT_LINK_DUPLICATE");
    }
  }

  /**
   * @param payload The normalized link command.
   */
  private async assertCardinality(payload: CreateObjectLinkInput) {
    const rule = LinkageRelationRules[payload.relationType];

    if (rule.cardinality !== LinkageCardinality.ONE_TO_ONE) {
      return;
    }

    // One-to-one rules reserve both source and target endpoint participation.
    const existingFromSource = (
      await this.repository.listForward({
        objectType: payload.sourceType,
        objectId: payload.sourceId
      })
    ).find((link) => link.relationType === payload.relationType);
    const existingToTarget = (
      await this.repository.listReverse({
        objectType: payload.targetType,
        objectId: payload.targetId
      })
    ).find((link) => link.relationType === payload.relationType);

    if (existingFromSource || existingToTarget) {
      throw new BadRequestException("OBJECT_LINK_CARDINALITY_VIOLATION");
    }
  }
}

/**
 * @param input The raw create-link payload.
 * @returns A normalized create-link command.
 */
function normalizeCreateLinkInput(input: CreateObjectLinkInput): CreateObjectLinkInput {
  return {
    relationType: normalizeRelationType(input.relationType),
    sourceType: normalizeObjectType(input.sourceType),
    sourceId: normalizeRequiredText(input.sourceId, "OBJECT_LINK_INPUT_INVALID"),
    targetType: normalizeObjectType(input.targetType),
    targetId: normalizeRequiredText(input.targetId, "OBJECT_LINK_INPUT_INVALID"),
    actorId: normalizeRequiredText(input.actorId, "OBJECT_LINK_INPUT_INVALID")
  };
}

/**
 * @param input The raw outgoing-link query.
 * @returns A normalized outgoing-link query.
 */
function normalizeForwardQuery(
  input: ListForwardObjectLinksInput
): ListForwardObjectLinksInput {
  return {
    sourceType: normalizeObjectType(input.sourceType),
    sourceId: normalizeRequiredText(input.sourceId, "OBJECT_LINK_INPUT_INVALID")
  };
}

/**
 * @param input The raw incoming-link query.
 * @returns A normalized incoming-link query.
 */
function normalizeReverseQuery(
  input: ListReverseObjectLinksInput
): ListReverseObjectLinksInput {
  return {
    targetType: normalizeObjectType(input.targetType),
    targetId: normalizeRequiredText(input.targetId, "OBJECT_LINK_INPUT_INVALID")
  };
}

/**
 * @param value The candidate relation type.
 * @returns A frozen linkage relation type.
 */
function normalizeRelationType(value: unknown): LinkageRelationTypeValue {
  if (
    typeof value !== "string" ||
    !linkageRelationTypeValues.has(value as LinkageRelationTypeValue)
  ) {
    throw new BadRequestException("OBJECT_LINK_RELATION_INVALID");
  }

  return value as LinkageRelationTypeValue;
}

/**
 * @param value The candidate object type.
 * @returns A frozen linkage object type.
 */
function normalizeObjectType(value: unknown): LinkageObjectTypeValue {
  if (
    typeof value !== "string" ||
    !linkageObjectTypeValues.has(value as LinkageObjectTypeValue)
  ) {
    throw new BadRequestException("OBJECT_LINK_OBJECT_INVALID");
  }

  return value as LinkageObjectTypeValue;
}

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The error code used when normalization fails.
 * @returns Trimmed non-empty text.
 */
function normalizeRequiredText(value: unknown, errorMessage: string) {
  if (typeof value !== "string") {
    throw new BadRequestException(errorMessage);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new BadRequestException(errorMessage);
  }

  return normalized;
}
