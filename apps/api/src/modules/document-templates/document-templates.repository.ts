/**
 * @file Document template repository adapters for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { DocumentType } from "@poco-scrum/domain";
import type {
  DocumentFieldRequirementValue,
  DocumentTypeValue
} from "@poco-scrum/domain";
import {
  createDefaultDocumentTemplates,
  type DocumentTemplateSeedRecord
} from "../../../prisma/seeds/document-templates.seed";

export type DocumentTemplateRecord = DocumentTemplateSeedRecord;

type PrismaDocumentTemplateRow = {
  id: string;
  documentType: DocumentTypeValue;
  name: string;
  description: string;
  structuredFields: unknown;
  requiredFieldKeys: unknown;
  markdown: string;
  isDefault: boolean;
  createdById: string;
};

type PrismaDocumentTemplateDelegate = {
  findMany(args?: unknown): Promise<PrismaDocumentTemplateRow[]>;
  findFirst(args: unknown): Promise<PrismaDocumentTemplateRow | null>;
  upsert?(args: unknown): Promise<PrismaDocumentTemplateRow>;
};

type PrismaUserDelegate = {
  upsert(args: unknown): Promise<unknown>;
};

export type PrismaDocumentTemplatesClient = {
  documentTemplate: PrismaDocumentTemplateDelegate;
  user?: PrismaUserDelegate;
  $disconnect?: () => Promise<void>;
};

const defaultTemplateOrder = [
  DocumentType.REQUIREMENT,
  DocumentType.TECHNICAL_SOLUTION,
  DocumentType.ACCEPTANCE,
  DocumentType.RETROSPECTIVE
] as const;

const systemTemplateActorId = "system-seed";

/**
 * @description Provides the minimal template lookup contract consumed by document services.
 */
export interface DocumentTemplatesRepository {
  listDefaultTemplates(): Promise<DocumentTemplateRecord[]>;
  getTemplateById(templateId: string): Promise<DocumentTemplateRecord | null>;
}

export class SeedDocumentTemplatesRepository
  implements DocumentTemplatesRepository
{
  constructor(
    private readonly defaultTemplates = createDefaultDocumentTemplates(
      systemTemplateActorId
    )
  ) {}

  /**
   * @returns Seed-backed default formal document templates in matrix order.
   */
  async listDefaultTemplates() {
    return this.defaultTemplates.map((template) => cloneTemplate(template));
  }

  /**
   * @param templateId The template identifier selected by the editor.
   * @returns The matching seed template, or null when the id is unknown.
   */
  async getTemplateById(templateId: string) {
    const normalizedTemplateId = templateId.trim();
    const template = this.defaultTemplates.find(
      (candidate) => candidate.id === normalizedTemplateId
    );

    return template ? cloneTemplate(template) : null;
  }
}

export class PrismaDocumentTemplatesRepository
  implements DocumentTemplatesRepository
{
  private readonly fallbackRepository = new SeedDocumentTemplatesRepository();

  constructor(private readonly prisma: PrismaDocumentTemplatesClient) {}

  /**
   * @returns Prisma-backed default formal document templates in matrix order.
   */
  async listDefaultTemplates() {
    try {
      await this.ensureDefaultTemplates();

      const rows = await this.prisma.documentTemplate.findMany({
        where: {
          isDefault: true
        }
      });
      const templates = rows.map((row) => normalizePrismaTemplate(row));

      return sortTemplatesByDocumentType(templates);
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        return this.fallbackRepository.listDefaultTemplates();
      }

      throw error;
    }
  }

  /**
   * @param templateId The template identifier selected by the editor.
   * @returns The matching Prisma template, or null when the id is unknown.
   */
  async getTemplateById(templateId: string) {
    try {
      await this.ensureDefaultTemplates();

      const row = await this.prisma.documentTemplate.findFirst({
        where: {
          id: templateId.trim(),
          isDefault: true
        }
      });

      return row ? normalizePrismaTemplate(row) : null;
    } catch (error) {
      if (isPrismaFallbackError(error)) {
        return this.fallbackRepository.getTemplateById(templateId);
      }

      throw error;
    }
  }

  /**
   * @description Keeps runtime reads aligned with the default seed when the table is empty.
   */
  private async ensureDefaultTemplates() {
    if (!this.prisma.documentTemplate.upsert) {
      return;
    }

    if (this.prisma.user) {
      await this.prisma.user.upsert({
        where: {
          id: systemTemplateActorId
        },
        update: {
          displayName: "System Seed"
        },
        create: {
          id: systemTemplateActorId,
          email: "system-seed@poco.local",
          displayName: "System Seed"
        }
      });
    }

    for (const template of createDefaultDocumentTemplates(systemTemplateActorId)) {
      // Upsert by stable id so a later customizable template workflow can update rows safely.
      await this.prisma.documentTemplate.upsert({
        where: {
          id: template.id
        },
        update: {
          documentType: template.documentType,
          name: template.name,
          description: template.description,
          structuredFields: template.structuredFields,
          requiredFieldKeys: template.requiredFieldKeys,
          markdown: template.markdown,
          isDefault: template.isDefault,
          createdById: template.createdById
        },
        create: template
      });
    }
  }
}

/**
 * @param template The template record to clone.
 * @returns A detached template copy safe for callers to mutate locally.
 */
export function cloneTemplate(
  template: DocumentTemplateRecord
): DocumentTemplateRecord {
  return {
    ...template,
    structuredFields: {
      ...template.structuredFields
    },
    requiredFieldKeys: [...template.requiredFieldKeys]
  };
}

/**
 * @param row The raw Prisma row with JSON values.
 * @returns A normalized template record matching the domain matrix contract.
 */
function normalizePrismaTemplate(
  row: PrismaDocumentTemplateRow
): DocumentTemplateRecord {
  return {
    id: row.id,
    documentType: row.documentType,
    name: row.name,
    description: row.description,
    structuredFields: normalizeStructuredFields(row.structuredFields),
    requiredFieldKeys: normalizeRequiredFieldKeys(row.requiredFieldKeys),
    markdown: row.markdown,
    isDefault: row.isDefault,
    createdById: row.createdById
  };
}

/**
 * @param value The Prisma JSON value to convert.
 * @returns Structured field requirements keyed by field name.
 */
function normalizeStructuredFields(
  value: unknown
): Record<string, DocumentFieldRequirementValue> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([, requirement]) => typeof requirement === "string"
    )
  ) as Record<string, DocumentFieldRequirementValue>;
}

/**
 * @param value The Prisma JSON value to convert.
 * @returns Required field keys stored as a plain string array.
 */
function normalizeRequiredFieldKeys(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((fieldKey): fieldKey is string => typeof fieldKey === "string")
    : [];
}

/**
 * @param templates The templates returned by persistence.
 * @returns Templates sorted by the frozen document type matrix order.
 */
function sortTemplatesByDocumentType(templates: DocumentTemplateRecord[]) {
  return [...templates].sort((left, right) => {
    return (
      defaultTemplateOrder.indexOf(left.documentType) -
      defaultTemplateOrder.indexOf(right.documentType)
    );
  });
}

/**
 * @param error The unknown Prisma runtime error.
 * @returns Whether seed fallback is safer than failing local document flows.
 */
function isPrismaFallbackError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const code = (error as { code?: unknown }).code;

  return (
    code === "P1001" ||
    code === "P1003" ||
    code === "P2021" ||
    code === "P2022"
  );
}
