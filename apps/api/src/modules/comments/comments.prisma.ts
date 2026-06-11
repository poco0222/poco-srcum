/**
 * @file Prisma client factory for Phase 2 document comment persistence.
 * @author PopoY
 * @created 2026-06-11
 */
import type { PrismaDocumentCommentsClient } from "./comments.service";

type PrismaClientConstructor = new () => PrismaDocumentCommentsClient & {
  $connect?: () => Promise<void>;
};

type PrismaClientModule = {
  PrismaClient: PrismaClientConstructor;
  Prisma?: {
    dmmf?: {
      datamodel?: {
        models?: Array<{
          name: string;
          fields?: Array<{ name: string }>;
        }>;
      };
    };
  };
};

/**
 * @returns A connected Prisma client when DATABASE_URL is configured, otherwise null.
 */
export async function createDocumentCommentsPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const prismaModule = (await import(
      "@prisma/client"
    )) as unknown as PrismaClientModule;

    if (
      !hasPrismaModelFields(prismaModule, "DocumentComment", [
        "documentId",
        "mentionedUserIds"
      ])
    ) {
      return null;
    }

    const prisma = new prismaModule.PrismaClient();

    if (prisma.$connect) {
      await prisma.$connect();
    }

    return prisma;
  } catch {
    // Fall back to in-memory comments when the local database is unavailable.
    return null;
  }
}

/**
 * @param prismaModule The generated Prisma client module.
 * @param modelName The model required by this repository.
 * @param fieldNames The fields that prove the generated client matches the schema.
 * @returns Whether the generated client can support the repository at bootstrap.
 */
function hasPrismaModelFields(
  prismaModule: PrismaClientModule,
  modelName: string,
  fieldNames: string[]
) {
  const model = prismaModule.Prisma?.dmmf?.datamodel?.models?.find(
    (candidate) => candidate.name === modelName
  );
  const availableFields = new Set(model?.fields?.map((field) => field.name));

  return fieldNames.every((fieldName) => availableFields.has(fieldName));
}
