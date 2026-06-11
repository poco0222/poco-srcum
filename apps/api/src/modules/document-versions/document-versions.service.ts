/**
 * @file Document version snapshot service for Phase 2 review traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { randomUUID } from "node:crypto";

import { BadRequestException, NotFoundException } from "@nestjs/common";

import type {
  DocumentRecord,
  DocumentStructuredFields,
  DocumentVersionRecord
} from "@poco-scrum/domain";
import {
  CreateDocumentVersionInputSchema,
  type CreateDocumentVersionInput
} from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";

export type PrismaDocumentVersionRow = {
  id: string;
  documentId: string;
  versionNumber: number;
  snapshot: unknown;
  changeSummary: string;
  createdById: string;
  createdAt: Date;
};

type PrismaDocumentVersionDelegate = {
  create(args: {
    data: Record<string, unknown>;
  }): Promise<PrismaDocumentVersionRow>;
  findFirst(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaDocumentVersionRow | null>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: unknown;
  }): Promise<PrismaDocumentVersionRow[]>;
};

export type PrismaDocumentVersionsClient = {
  documentVersion?: PrismaDocumentVersionDelegate;
  $disconnect?: () => Promise<void>;
};

/**
 * @description Storage contract shared by document version adapters.
 */
export interface DocumentVersionsRepository {
  create(version: DocumentVersionRecord): Promise<DocumentVersionRecord>;
  getById(versionId: string): Promise<DocumentVersionRecord | null>;
  listByDocumentId(documentId: string): Promise<DocumentVersionRecord[]>;
}

/**
 * Stores full document snapshots so review decisions can bind to immutable content.
 */
export class InMemoryDocumentVersionsRepository
  implements DocumentVersionsRepository
{
  private readonly versionsById = new Map<string, DocumentVersionRecord>();
  private readonly versionIdsByDocumentId = new Map<string, string[]>();

  /**
   * @param version The version snapshot to persist.
   * @returns The persisted version clone.
   */
  async create(version: DocumentVersionRecord) {
    this.versionsById.set(version.id, cloneVersion(version));
    this.versionIdsByDocumentId.set(version.documentId, [
      ...(this.versionIdsByDocumentId.get(version.documentId) ?? []),
      version.id
    ]);

    return this.getById(version.id) as Promise<DocumentVersionRecord>;
  }

  /**
   * @param versionId The version identifier to load.
   * @returns The matching snapshot, or null.
   */
  async getById(versionId: string) {
    const version = this.versionsById.get(versionId);

    return version ? cloneVersion(version) : null;
  }

  /**
   * @param documentId The document whose snapshots should be listed.
   * @returns Versions sorted by version number.
   */
  async listByDocumentId(documentId: string) {
    const versionIds = this.versionIdsByDocumentId.get(documentId) ?? [];

    return versionIds
      .map((versionId) => this.versionsById.get(versionId))
      .filter((version): version is DocumentVersionRecord => Boolean(version))
      .map((version) => cloneVersion(version))
      .sort((left, right) => left.versionNumber - right.versionNumber);
  }
}

export class PrismaDocumentVersionsRepository
  implements DocumentVersionsRepository
{
  private readonly fallbackRepository =
    new InMemoryDocumentVersionsRepository();
  private useFallbackStorage = false;

  constructor(private readonly prisma: PrismaDocumentVersionsClient) {}

  /**
   * @param version The version snapshot to persist.
   * @returns The persisted version from Prisma or fallback storage.
   */
  async create(version: DocumentVersionRecord) {
    const documentVersion = this.getDocumentVersionDelegate();

    if (!documentVersion) {
      this.enableFallbackStorage();

      return this.fallbackRepository.create(version);
    }

    const row = await documentVersion.create({
      data: toPrismaVersionData(version)
    });

    return normalizePrismaVersion(row);
  }

  /**
   * @param versionId The version identifier to load.
   * @returns The matching snapshot, or null.
   */
  async getById(versionId: string) {
    const documentVersion = this.getDocumentVersionDelegate();

    if (!documentVersion) {
      this.enableFallbackStorage();

      return this.fallbackRepository.getById(versionId);
    }

    const row = await documentVersion.findFirst({
      where: {
        id: versionId
      }
    });

    return row ? normalizePrismaVersion(row) : null;
  }

  /**
   * @param documentId The document whose snapshots should be listed.
   * @returns Version snapshots sorted by version number.
   */
  async listByDocumentId(documentId: string) {
    const documentVersion = this.getDocumentVersionDelegate();

    if (!documentVersion) {
      this.enableFallbackStorage();

      return this.fallbackRepository.listByDocumentId(documentId);
    }

    const rows = await documentVersion.findMany({
      where: {
        documentId
      },
      orderBy: [{ versionNumber: "asc" }, { createdAt: "asc" }]
    });

    return rows
      .map((row) => normalizePrismaVersion(row))
      .sort(compareVersionsByNumber);
  }

  /**
   * @returns The generated Prisma document version delegate, or null when unavailable.
   */
  private getDocumentVersionDelegate() {
    if (this.useFallbackStorage) {
      return null;
    }

    return this.prisma.documentVersion ?? null;
  }

  /**
   * @description Keeps reads consistent after a fallback write path is selected.
   */
  private enableFallbackStorage() {
    this.useFallbackStorage = true;
  }
}

/**
 * Creates and reads immutable formal document snapshots for review traceability.
 */
export class DocumentVersionsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly repository: DocumentVersionsRepository = new InMemoryDocumentVersionsRepository(),
    _nextSequence = 1
  ) {}

  /**
   * @param input The command that records a full snapshot of the current document.
   * @returns The created version snapshot.
   */
  async createVersionSnapshot(input: CreateDocumentVersionInput) {
    const payload = CreateDocumentVersionInputSchema.parse(input);
    const document = await this.documentsService.getDocumentById(
      payload.documentId
    );
    // Existing versions determine the next monotonic version number for the document.
    const existingVersions = await this.repository.listByDocumentId(document.id);
    const versionNumber = existingVersions.length + 1;
    const version: DocumentVersionRecord = {
      id: createDocumentVersionId(),
      documentId: document.id,
      versionNumber,
      snapshot: cloneDocument(document),
      changeSummary: payload.changeSummary,
      createdById: payload.actorId,
      createdAt: new Date().toISOString()
    };

    return this.repository.create(version);
  }

  /**
   * @param documentId The document whose snapshots should be listed.
   * @returns Versions sorted by version number.
   */
  async listVersionsForDocument(documentId: string) {
    const normalizedDocumentId = normalizeRequiredText(
      documentId,
      "DOCUMENT_VERSION_DOCUMENT_REQUIRED"
    );

    await this.documentsService.getDocumentById(normalizedDocumentId);
    return this.repository.listByDocumentId(normalizedDocumentId);
  }

  /**
   * @param versionId The version identifier to load.
   * @returns The requested version snapshot.
   */
  async getVersionById(versionId: string) {
    const normalizedVersionId = normalizeRequiredText(
      versionId,
      "DOCUMENT_VERSION_ID_REQUIRED"
    );
    const version = await this.repository.getById(normalizedVersionId);

    if (!version) {
      throw new NotFoundException("DOCUMENT_VERSION_NOT_FOUND");
    }

    return version;
  }

  /**
   * @param documentId The document whose latest snapshot id should be returned.
   * @returns The latest version identifier for review binding.
   */
  async getLatestVersionId(documentId: string) {
    const versions = await this.listVersionsForDocument(documentId);
    const latestVersion = versions.at(-1);

    if (!latestVersion) {
      throw new BadRequestException("DOCUMENT_VERSION_REQUIRED");
    }

    return latestVersion.id;
  }
}

/**
 * @param version The version record to clone before crossing repository boundaries.
 * @returns A defensive copy with an isolated document snapshot.
 */
function cloneVersion(version: DocumentVersionRecord): DocumentVersionRecord {
  return {
    ...version,
    snapshot: cloneDocument(version.snapshot)
  };
}

/**
 * @returns A restart-safe document version identifier.
 */
function createDocumentVersionId() {
  return `document-version-${randomUUID()}`;
}

/**
 * @param version The domain version snapshot record.
 * @returns A Prisma create data object with a JSON document snapshot.
 */
function toPrismaVersionData(version: DocumentVersionRecord) {
  return {
    id: version.id,
    documentId: version.documentId,
    versionNumber: version.versionNumber,
    snapshot: cloneDocument(version.snapshot),
    changeSummary: version.changeSummary,
    createdById: version.createdById,
    createdAt: new Date(version.createdAt)
  };
}

/**
 * @param row The raw Prisma document version row.
 * @returns A domain version record with a normalized document snapshot.
 */
function normalizePrismaVersion(
  row: PrismaDocumentVersionRow
): DocumentVersionRecord {
  return {
    id: row.id,
    documentId: row.documentId,
    versionNumber: row.versionNumber,
    snapshot: normalizeDocumentSnapshot(row.snapshot),
    changeSummary: row.changeSummary,
    createdById: row.createdById,
    createdAt: row.createdAt.toISOString()
  };
}

/**
 * @param document The current formal document to freeze inside a version snapshot.
 * @returns A defensive copy of the document and structured fields.
 */
function cloneDocument(document: DocumentRecord): DocumentRecord {
  return {
    ...document,
    structuredFields: {
      ...document.structuredFields
    }
  };
}

/**
 * @param value The Prisma JSON value stored as a document snapshot.
 * @returns A domain document snapshot with defensive defaults.
 */
function normalizeDocumentSnapshot(value: unknown): DocumentRecord {
  const snapshot =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    id: String(snapshot.id ?? ""),
    title: String(snapshot.title ?? ""),
    documentType: snapshot.documentType as DocumentRecord["documentType"],
    templateId: snapshot.templateId as DocumentRecord["templateId"],
    targetType: snapshot.targetType as DocumentRecord["targetType"],
    targetId: String(snapshot.targetId ?? ""),
    authorId: String(snapshot.authorId ?? ""),
    updatedById: String(snapshot.updatedById ?? ""),
    structuredFields: normalizeStructuredFields(snapshot.structuredFields),
    markdown: String(snapshot.markdown ?? ""),
    createdAt: String(snapshot.createdAt ?? ""),
    updatedAt: String(snapshot.updatedAt ?? "")
  };
}

/**
 * @param value The Prisma JSON value stored for structured fields.
 * @returns Domain-compatible structured fields.
 */
function normalizeStructuredFields(value: unknown): DocumentStructuredFields {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => {
      return (
        fieldValue === null ||
        typeof fieldValue === "string" ||
        typeof fieldValue === "number" ||
        typeof fieldValue === "boolean"
      );
    })
  ) as DocumentStructuredFields;
}

/**
 * @param left The first version to compare.
 * @param right The second version to compare.
 * @returns Stable version-number order.
 */
function compareVersionsByNumber(
  left: DocumentVersionRecord,
  right: DocumentVersionRecord
) {
  const versionOrder = left.versionNumber - right.versionNumber;

  return versionOrder === 0 ? left.id.localeCompare(right.id) : versionOrder;
}

/**
 * @param value The unknown text value to normalize.
 * @param errorMessage The validation error code to throw on failure.
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
