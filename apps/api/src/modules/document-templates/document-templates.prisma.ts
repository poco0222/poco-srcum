/**
 * @file Prisma client factory for Phase 2 document templates.
 * @author PopoY
 * @created 2026-06-04
 */
import type { PrismaDocumentTemplatesClient } from "./document-templates.repository";

type PrismaClientConstructor = new () => PrismaDocumentTemplatesClient & {
  $connect?: () => Promise<void>;
};

/**
 * @returns A connected Prisma client when DATABASE_URL is configured, otherwise null.
 */
export async function createDocumentTemplatesPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const { PrismaClient } = (await import(
      "@prisma/client"
    )) as unknown as {
      PrismaClient: PrismaClientConstructor;
    };
    const prisma = new PrismaClient();

    if (prisma.$connect) {
      await prisma.$connect();
    }

    return prisma;
  } catch {
    // Fall back to seed-backed templates when the local database is unavailable.
    return null;
  }
}
