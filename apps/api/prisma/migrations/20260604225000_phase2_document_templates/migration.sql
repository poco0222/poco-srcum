-- @file Phase 2 migration for formal document templates.
-- @author PopoY
-- @created 2026-06-04

CREATE TYPE "DocumentType" AS ENUM (
  'REQUIREMENT',
  'TECHNICAL_SOLUTION',
  'ACCEPTANCE',
  'RETROSPECTIVE'
);

CREATE TABLE "DocumentTemplate" (
  "id" TEXT NOT NULL,
  "documentType" "DocumentType" NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "structuredFields" JSONB NOT NULL,
  "requiredFieldKeys" JSONB NOT NULL,
  "markdown" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocumentTemplate_documentType_isDefault_key"
ON "DocumentTemplate"("documentType", "isDefault");

CREATE INDEX "DocumentTemplate_documentType_idx"
ON "DocumentTemplate"("documentType");

CREATE INDEX "DocumentTemplate_createdById_createdAt_idx"
ON "DocumentTemplate"("createdById", "createdAt");

ALTER TABLE "DocumentTemplate"
ADD CONSTRAINT "DocumentTemplate_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
