/**
 * @file Document version snapshot service for Phase 2 review traceability.
 * @author PopoY
 * @created 2026-06-10
 */
import { BadRequestException, NotFoundException } from "@nestjs/common";

import type {
  DocumentRecord,
  DocumentVersionRecord
} from "@poco-scrum/domain";
import {
  CreateDocumentVersionInputSchema,
  type CreateDocumentVersionInput
} from "@poco-scrum/shared";
import { DocumentsService } from "../documents/documents.service";

/**
 * Stores full document snapshots so review decisions can bind to immutable content.
 */
export class InMemoryDocumentVersionsRepository {
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

/**
 * Creates and reads immutable formal document snapshots for review traceability.
 */
export class DocumentVersionsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly repository: InMemoryDocumentVersionsRepository = new InMemoryDocumentVersionsRepository(),
    private nextSequence = 1
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
      id: `document-version-${this.nextSequence++}`,
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
