/**
 * @file Prisma client factory for Phase 2 object linkage persistence.
 * @author PopoY
 * @created 2026-06-10
 */
import type { PrismaObjectLinksClient } from "./linkage.repository";

type PrismaClientConstructor = new () => PrismaObjectLinksClient & {
  $connect?: () => Promise<void>;
};

type ResolvableObjectLinksPrismaClient = PrismaObjectLinksClient & {
  $connect?: () => Promise<void>;
};

/**
 * @returns A connected Prisma client when DATABASE_URL is configured, otherwise null.
 */
export async function createObjectLinksPrismaClient() {
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

    return resolveObjectLinksPrismaClient(prisma);
  } catch {
    // Fall back to in-memory links when the local database is unavailable.
    return null;
  }
}

/**
 * @param prisma The candidate Prisma client produced by the generated package.
 * @returns A connected ObjectLink-capable client, or null after disconnecting stale clients.
 */
export async function resolveObjectLinksPrismaClient(
  prisma: ResolvableObjectLinksPrismaClient
) {
  if (!prisma.objectLink) {
    if (prisma.$disconnect) {
      await prisma.$disconnect();
    }

    return null;
  }

  if (prisma.$connect) {
    await prisma.$connect();
  }

  return prisma;
}
