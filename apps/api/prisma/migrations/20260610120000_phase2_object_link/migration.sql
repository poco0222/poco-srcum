-- @file Phase 2 migration for object linkage traceability.
-- @author PopoY
-- @created 2026-06-10

CREATE TABLE "ObjectLink" (
  "id" TEXT NOT NULL,
  "relationType" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ObjectLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ObjectLink_relationType_sourceType_sourceId_targetType_targetId_key"
ON "ObjectLink"("relationType", "sourceType", "sourceId", "targetType", "targetId");

CREATE INDEX "ObjectLink_sourceType_sourceId_createdAt_idx"
ON "ObjectLink"("sourceType", "sourceId", "createdAt");

CREATE INDEX "ObjectLink_targetType_targetId_createdAt_idx"
ON "ObjectLink"("targetType", "targetId", "createdAt");

CREATE INDEX "ObjectLink_actorId_createdAt_idx"
ON "ObjectLink"("actorId", "createdAt");

ALTER TABLE "ObjectLink"
ADD CONSTRAINT "ObjectLink_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
