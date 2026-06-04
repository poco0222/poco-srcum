-- @file Task 03 baseline migration for Sprint lifecycle and planning persistence.
-- @author PopoY
-- @created 2026-06-04

CREATE TYPE "SprintStatus" AS ENUM (
  'DRAFT',
  'PLANNED',
  'ACTIVE',
  'ENDED',
  'CLOSED'
);

CREATE TABLE "Sprint" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "SprintStatus" NOT NULL,
  "goal" TEXT,
  "planningNote" TEXT,
  "planningSnapshot" JSONB,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "activatedAt" TIMESTAMP(3),
  "endedAt" TIMESTAMP(3),
  "closedAt" TIMESTAMP(3),
  "retrospectiveId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SprintCommitment" (
  "id" TEXT NOT NULL,
  "sprintId" TEXT NOT NULL,
  "workItemId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SprintCommitment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SprintDailyUpdate" (
  "id" TEXT NOT NULL,
  "sprintId" TEXT NOT NULL,
  "workItemId" TEXT,
  "authorId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SprintDailyUpdate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Sprint_projectId_status_idx"
ON "Sprint"("projectId", "status");

CREATE INDEX "Sprint_projectId_startsAt_endsAt_idx"
ON "Sprint"("projectId", "startsAt", "endsAt");

CREATE UNIQUE INDEX "SprintCommitment_sprintId_workItemId_key"
ON "SprintCommitment"("sprintId", "workItemId");

CREATE INDEX "SprintCommitment_workItemId_idx"
ON "SprintCommitment"("workItemId");

CREATE INDEX "SprintDailyUpdate_sprintId_createdAt_idx"
ON "SprintDailyUpdate"("sprintId", "createdAt");

CREATE INDEX "SprintDailyUpdate_workItemId_createdAt_idx"
ON "SprintDailyUpdate"("workItemId", "createdAt");

CREATE INDEX "SprintDailyUpdate_authorId_createdAt_idx"
ON "SprintDailyUpdate"("authorId", "createdAt");

ALTER TABLE "Sprint"
ADD CONSTRAINT "Sprint_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkItem"
ADD CONSTRAINT "WorkItem_sprintId_fkey"
FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SprintCommitment"
ADD CONSTRAINT "SprintCommitment_sprintId_fkey"
FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SprintCommitment"
ADD CONSTRAINT "SprintCommitment_workItemId_fkey"
FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SprintDailyUpdate"
ADD CONSTRAINT "SprintDailyUpdate_sprintId_fkey"
FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SprintDailyUpdate"
ADD CONSTRAINT "SprintDailyUpdate_workItemId_fkey"
FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SprintDailyUpdate"
ADD CONSTRAINT "SprintDailyUpdate_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
