-- @file Phase 2 migration for document collaboration persistence.
-- @author PopoY
-- @created 2026-06-11

ALTER TABLE "Document"
ADD COLUMN "documentType" "DocumentType",
ADD COLUMN "templateId" TEXT;

CREATE INDEX "Document_documentType_idx"
ON "Document"("documentType");

CREATE INDEX "Document_templateId_idx"
ON "Document"("templateId");

ALTER TABLE "Document"
ADD CONSTRAINT "Document_templateId_fkey"
FOREIGN KEY ("templateId") REFERENCES "DocumentTemplate"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "DocumentComment" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "parentCommentId" TEXT,
  "authorId" TEXT NOT NULL,
  "anchorType" TEXT NOT NULL,
  "anchorRef" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "mentionedUserIds" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DocumentComment_documentId_createdAt_idx"
ON "DocumentComment"("documentId", "createdAt");

CREATE INDEX "DocumentComment_parentCommentId_idx"
ON "DocumentComment"("parentCommentId");

CREATE INDEX "DocumentComment_authorId_createdAt_idx"
ON "DocumentComment"("authorId", "createdAt");

ALTER TABLE "DocumentComment"
ADD CONSTRAINT "DocumentComment_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentComment"
ADD CONSTRAINT "DocumentComment_parentCommentId_fkey"
FOREIGN KEY ("parentCommentId") REFERENCES "DocumentComment"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DocumentComment"
ADD CONSTRAINT "DocumentComment_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DocumentReview" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "submittedVersionId" TEXT NOT NULL,
  "submittedById" TEXT,
  "submittedAt" TIMESTAMP(3),
  "decidedById" TEXT,
  "conclusion" TEXT,
  "decidedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocumentReview_documentId_key"
ON "DocumentReview"("documentId");

CREATE INDEX "DocumentReview_status_updatedAt_idx"
ON "DocumentReview"("status", "updatedAt");

CREATE INDEX "DocumentReview_submittedById_submittedAt_idx"
ON "DocumentReview"("submittedById", "submittedAt");

CREATE INDEX "DocumentReview_decidedById_decidedAt_idx"
ON "DocumentReview"("decidedById", "decidedAt");

ALTER TABLE "DocumentReview"
ADD CONSTRAINT "DocumentReview_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentReview"
ADD CONSTRAINT "DocumentReview_submittedById_fkey"
FOREIGN KEY ("submittedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DocumentReview"
ADD CONSTRAINT "DocumentReview_decidedById_fkey"
FOREIGN KEY ("decidedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "DocumentVersion" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "snapshot" JSONB NOT NULL,
  "changeSummary" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocumentVersion_documentId_versionNumber_key"
ON "DocumentVersion"("documentId", "versionNumber");

CREATE INDEX "DocumentVersion_documentId_createdAt_idx"
ON "DocumentVersion"("documentId", "createdAt");

CREATE INDEX "DocumentVersion_createdById_createdAt_idx"
ON "DocumentVersion"("createdById", "createdAt");

ALTER TABLE "DocumentVersion"
ADD CONSTRAINT "DocumentVersion_documentId_fkey"
FOREIGN KEY ("documentId") REFERENCES "Document"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentVersion"
ADD CONSTRAINT "DocumentVersion_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentReview"
ADD CONSTRAINT "DocumentReview_submittedVersionId_fkey"
FOREIGN KEY ("submittedVersionId") REFERENCES "DocumentVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
