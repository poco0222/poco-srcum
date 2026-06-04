-- @file Task 04 baseline migration for document attachment metadata and links.
-- @author PopoY
-- @created 2026-06-04

CREATE TABLE "DocumentAttachment" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "previewKind" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentLink" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "targetType" "DocumentTargetType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentLink_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DocumentAttachment_documentId_createdAt_idx"
ON "DocumentAttachment"("documentId", "createdAt");

CREATE INDEX "DocumentLink_targetType_targetId_idx"
ON "DocumentLink"("targetType", "targetId");

CREATE INDEX "DocumentLink_documentId_createdAt_idx"
ON "DocumentLink"("documentId", "createdAt");

ALTER TABLE "DocumentAttachment"
ADD CONSTRAINT "DocumentAttachment_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentAttachment"
ADD CONSTRAINT "DocumentAttachment_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentLink"
ADD CONSTRAINT "DocumentLink_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentLink"
ADD CONSTRAINT "DocumentLink_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
