-- @file Task 04 baseline migration for Story acceptance records.
-- @author PopoY
-- @created 2026-06-04

CREATE TYPE "AcceptanceStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REOPENED'
);

CREATE TABLE "StoryAcceptanceRecord" (
  "id" TEXT NOT NULL,
  "storyId" TEXT NOT NULL,
  "status" "AcceptanceStatus" NOT NULL,
  "actorId" TEXT NOT NULL,
  "reason" TEXT,
  "operatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StoryAcceptanceRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StoryAcceptanceRecord_storyId_createdAt_idx"
ON "StoryAcceptanceRecord"("storyId", "createdAt");

CREATE INDEX "StoryAcceptanceRecord_actorId_createdAt_idx"
ON "StoryAcceptanceRecord"("actorId", "createdAt");

ALTER TABLE "StoryAcceptanceRecord"
ADD CONSTRAINT "StoryAcceptanceRecord_storyId_fkey"
FOREIGN KEY ("storyId") REFERENCES "WorkItem"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryAcceptanceRecord"
ADD CONSTRAINT "StoryAcceptanceRecord_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
