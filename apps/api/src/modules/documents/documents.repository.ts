/**
 * @file In-memory document repository for the Phase 1 Form plus Markdown API.
 * @author PopoY
 * @created 2026-06-04
 */
import type { DocumentRecord } from "@poco-scrum/domain";

export type SaveDocumentInput = DocumentRecord;

/**
 * Keep document persistence narrow so later Prisma integration can reuse the service contract.
 */
export class InMemoryDocumentsRepository {
  private readonly documents = new Map<string, DocumentRecord>();

  async create(document: SaveDocumentInput) {
    this.documents.set(document.id, cloneDocument(document));
    return this.getById(document.id);
  }

  async update(id: string, document: DocumentRecord) {
    this.documents.set(id, cloneDocument(document));
    return this.getById(id);
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
}

function cloneDocument(document: DocumentRecord): DocumentRecord {
  return {
    ...document,
    structuredFields: {
      ...document.structuredFields
    }
  };
}
