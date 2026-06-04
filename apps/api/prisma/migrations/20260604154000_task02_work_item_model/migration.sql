-- @file Task 02 baseline migration for the unified work item model.
-- @author PopoY
-- @created 2026-06-04

CREATE TYPE "WorkItemType" AS ENUM (
  'EPIC',
  'STORY',
  'TASK',
  'BUG'
);

CREATE TYPE "WorkItemStatus" AS ENUM (
  'BACKLOG',
  'READY_FOR_SPRINT',
  'COMMITTED_TO_SPRINT',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
  'CANCELLED'
);

CREATE TYPE "WorkItemPriority" AS ENUM (
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW'
);

CREATE TABLE "WorkItem" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "sprintId" TEXT,
  "parentId" TEXT,
  "assigneeId" TEXT,
  "type" "WorkItemType" NOT NULL,
  "status" "WorkItemStatus" NOT NULL,
  "priority" "WorkItemPriority" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "storyPoints" INTEGER,
  "acceptanceCriteria" JSONB NOT NULL,
  "sortOrder" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkItem_projectId_type_sortOrder_idx"
ON "WorkItem"("projectId", "type", "sortOrder");

CREATE INDEX "WorkItem_projectId_sprintId_idx"
ON "WorkItem"("projectId", "sprintId");

CREATE INDEX "WorkItem_parentId_idx"
ON "WorkItem"("parentId");

ALTER TABLE "WorkItem"
ADD CONSTRAINT "WorkItem_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkItem"
ADD CONSTRAINT "WorkItem_parentId_fkey"
FOREIGN KEY ("parentId") REFERENCES "WorkItem"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
