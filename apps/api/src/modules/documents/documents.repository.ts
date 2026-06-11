/**
 * @file Document repository adapters for Form plus Markdown persistence.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  DocumentRecord,
  DocumentStructuredFields,
  DocumentTargetTypeValue,
  DocumentTypeValue
} from "@poco-scrum/domain";

export type SaveDocumentInput = DocumentRecord;

export type PrismaDocumentRow = {
  id: string;
  title: string;
  documentType: DocumentTypeValue | null;
  templateId: string | null;
  targetType: DocumentTargetTypeValue;
  targetId: string;
  authorId: string;
  updatedById: string;
  structuredFields: unknown;
  markdown: string;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaDocumentDelegate = {
  create(args: { data: Record<string, unknown> }): Promise<PrismaDocumentRow>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
  }): Promise<PrismaDocumentRow>;
  findFirst(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaDocumentRow | null>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: unknown;
  }): Promise<PrismaDocumentRow[]>;
};

export type PrismaDocumentsClient = {
  document?: PrismaDocumentDelegate;
  $disconnect?: () => Promise<void>;
};

/**
 * @description Storage contract shared by document service adapters.
 */
export interface DocumentsRepository {
  create(document: SaveDocumentInput): Promise<DocumentRecord>;
  update(id: string, document: DocumentRecord): Promise<DocumentRecord>;
  getById(id: string): Promise<DocumentRecord | null>;
  listByTarget(
    targetType: string,
    targetId: string
  ): Promise<DocumentRecord[]>;
  listAll(): Promise<DocumentRecord[]>;
}

/**
 * Keep document persistence narrow so later Prisma integration can reuse the service contract.
 */
export class InMemoryDocumentsRepository implements DocumentsRepository {
  private readonly documents = new Map<string, DocumentRecord>();

  async create(document: SaveDocumentInput) {
    this.documents.set(document.id, cloneDocument(document));
    const created = await this.getById(document.id);

    if (!created) {
      throw new Error("DOCUMENT_REPOSITORY_WRITE_FAILED");
    }

    return created;
  }

  async update(id: string, document: DocumentRecord) {
    this.documents.set(id, cloneDocument(document));
    const updated = await this.getById(id);

    if (!updated) {
      throw new Error("DOCUMENT_REPOSITORY_WRITE_FAILED");
    }

    return updated;
  }

  async getById(id: string) {
    const document = this.documents.get(id);
    return document ? cloneDocument(document) : null;
  }

  async listByTarget(targetType: string, targetId: string) {
    return [...this.documents.values()]
      .filter(
        (document) =>
          document.targetType === targetType && document.targetId === targetId
      )
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .map((document) => cloneDocument(document));
  }

  /**
   * @returns All documents in oldest-first order for read models like search.
   */
  async listAll() {
    return [...this.documents.values()]
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .map((document) => cloneDocument(document));
  }
}

export class PrismaDocumentsRepository implements DocumentsRepository {
  private readonly fallbackRepository = new InMemoryDocumentsRepository();
  private useFallbackStorage = false;

  constructor(private readonly prisma: PrismaDocumentsClient) {}

  /**
   * @param document The document record to persist.
   * @returns The persisted document from Prisma or local fallback storage.
   */
  async create(document: SaveDocumentInput) {
    const documentDelegate = this.getDocumentDelegate();

    if (!documentDelegate) {
      this.enableFallbackStorage();

      return this.fallbackRepository.create(document);
    }

    const row = await documentDelegate.create({
      data: toPrismaDocumentData(document)
    });

    return normalizePrismaDocument(row);
  }

  /**
   * @param id The document identifier to update.
   * @param document The complete document state to persist.
   * @returns The updated document from Prisma or fallback storage.
   */
  async update(id: string, document: DocumentRecord) {
    const documentDelegate = this.getDocumentDelegate();

    if (!documentDelegate) {
      this.enableFallbackStorage();

      return this.fallbackRepository.update(id, document);
    }

    const row = await documentDelegate.update({
      where: {
        id
      },
      data: toPrismaDocumentData(document)
    });

    return normalizePrismaDocument(row);
  }

  /**
   * @param id The document identifier.
   * @returns The matching document or null.
   */
  async getById(id: string) {
    const documentDelegate = this.getDocumentDelegate();

    if (!documentDelegate) {
      this.enableFallbackStorage();

      return this.fallbackRepository.getById(id);
    }

    const row = await documentDelegate.findFirst({
      where: {
        id
      }
    });

    return row ? normalizePrismaDocument(row) : null;
  }

  /**
   * @param targetType The linked Scrum object type.
   * @param targetId The linked Scrum object id.
   * @returns Oldest-first documents from Prisma or fallback storage.
   */
  async listByTarget(targetType: string, targetId: string) {
    return this.findManyDocuments({
      targetType,
      targetId
    });
  }

  /**
   * @returns All documents in oldest-first order.
   */
  async listAll() {
    return this.findManyDocuments({});
  }

  /**
   * @param where The Prisma filter used by document read models.
   * @returns Normalized documents from Prisma or fallback storage.
   */
  private async findManyDocuments(where: Record<string, unknown>) {
    const documentDelegate = this.getDocumentDelegate();

    if (!documentDelegate) {
      this.enableFallbackStorage();

      return this.filterFallbackDocuments(where);
    }

    const rows = await documentDelegate.findMany({
      where,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }]
    });

    return rows.map((row) => normalizePrismaDocument(row));
  }

  /**
   * @param where The fallback filter mirroring Prisma equality checks.
   * @returns Matching in-memory documents.
   */
  private async filterFallbackDocuments(where: Record<string, unknown>) {
    const documents = await this.fallbackRepository.listAll();

    return documents.filter((document) => {
      return Object.entries(where).every(([key, value]) => {
        return document[key as keyof DocumentRecord] === value;
      });
    });
  }

  /**
   * @returns The generated Prisma document delegate, or null when unavailable.
   */
  private getDocumentDelegate() {
    if (this.useFallbackStorage) {
      return null;
    }

    return this.prisma.document ?? null;
  }

  /**
   * @description Keeps reads consistent after a fallback write path is selected.
   */
  private enableFallbackStorage() {
    this.useFallbackStorage = true;
  }
}

function cloneDocument(document: DocumentRecord): DocumentRecord {
  return {
    ...document,
    structuredFields: {
      ...document.structuredFields
    }
  };
}

/**
 * @param document The domain document record.
 * @returns A Prisma create/update data object with Date values and nullable formal fields.
 */
function toPrismaDocumentData(document: DocumentRecord) {
  return {
    id: document.id,
    title: document.title,
    documentType: document.documentType ?? null,
    templateId: document.templateId ?? null,
    targetType: document.targetType,
    targetId: document.targetId,
    authorId: document.authorId,
    updatedById: document.updatedById,
    structuredFields: document.structuredFields,
    markdown: document.markdown,
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt)
  };
}

/**
 * @param row The raw Prisma document row.
 * @returns A domain document record with ISO datetime text and normalized JSON fields.
 */
function normalizePrismaDocument(row: PrismaDocumentRow): DocumentRecord {
  return {
    id: row.id,
    title: row.title,
    documentType: row.documentType ?? undefined,
    templateId: row.templateId ?? undefined,
    targetType: row.targetType,
    targetId: row.targetId,
    authorId: row.authorId,
    updatedById: row.updatedById,
    structuredFields: normalizeStructuredFields(row.structuredFields),
    markdown: row.markdown,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
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
