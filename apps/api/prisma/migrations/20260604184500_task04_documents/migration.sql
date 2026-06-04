-- @file Task 04 baseline migration for Form plus Markdown documents.
-- @author PopoY
-- @created 2026-06-04

CREATE TYPE "DocumentTargetType" AS ENUM (
  'STORY',
  'SPRINT',
  'RETROSPECTIVE'
);

CREATE TABLE "Document" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "targetType" "DocumentTargetType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "updatedById" TEXT NOT NULL,
  "structuredFields" JSONB NOT NULL,
  "markdown" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Document_targetType_targetId_idx"
ON "Document"("targetType", "targetId");

CREATE INDEX "Document_authorId_createdAt_idx"
ON "Document"("authorId", "createdAt");

ALTER TABLE "Document"
ADD CONSTRAINT "Document_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document"
ADD CONSTRAINT "Document_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
