/**
 * @file Document template service for Phase 2 formal document defaults.
 * @author PopoY
 * @created 2026-06-04
 */
import { DocumentType } from "@poco-scrum/domain";
import type { DocumentTypeValue } from "@poco-scrum/domain";
import {
  cloneTemplate,
  PrismaDocumentTemplatesRepository,
  SeedDocumentTemplatesRepository,
  type DocumentTemplatesRepository,
  type PrismaDocumentTemplatesClient
} from "./document-templates.repository";

type DocumentTemplatesServiceSource =
  | DocumentTemplatesRepository
  | PrismaDocumentTemplatesClient;

export class DocumentTemplatesService {
  private readonly repository: DocumentTemplatesRepository;

  constructor(source?: DocumentTemplatesServiceSource) {
    this.repository = resolveRepository(source);
  }

  /**
   * @returns All default formal document templates in matrix order.
   */
  async listDefaultTemplates() {
    const templates = await this.repository.listDefaultTemplates();

    return templates.map((template) => cloneTemplate(template));
  }

  /**
   * @param documentType The formal document type that needs its default template.
   * @returns The matching default template, or null when the type is unsupported.
   */
  async getDefaultTemplate(documentType: DocumentTypeValue) {
    const knownTypes = new Set<DocumentTypeValue>(Object.values(DocumentType));

    if (!knownTypes.has(documentType)) {
      return null;
    }

    const templates = await this.repository.listDefaultTemplates();
    const template = templates.find(
      (candidate) => candidate.documentType === documentType
    );

    return template ? cloneTemplate(template) : null;
  }

  /**
   * @param templateId The template identifier selected by the editor.
   * @returns The matching template, or null when it does not exist.
   */
  async getTemplateById(templateId: string) {
    const template = await this.repository.getTemplateById(templateId);

    return template ? cloneTemplate(template) : null;
  }
}

/**
 * @param source Optional persistence source injected by tests or NestJS providers.
 * @returns A repository that reads templates from Prisma when available, otherwise seed data.
 */
function resolveRepository(
  source?: DocumentTemplatesServiceSource
): DocumentTemplatesRepository {
  if (!source) {
    return new SeedDocumentTemplatesRepository();
  }

  if ("documentTemplate" in source) {
    return new PrismaDocumentTemplatesRepository(source);
  }

  return source;
}
