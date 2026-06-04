-- @file Task 04 baseline migration for minimal operation audit logs.
-- @author PopoY
-- @created 2026-06-04

CREATE TABLE "OperationAuditLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "objectType" TEXT NOT NULL,
  "objectId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OperationAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OperationAuditLog_objectType_objectId_createdAt_idx"
ON "OperationAuditLog"("objectType", "objectId", "createdAt");

CREATE INDEX "OperationAuditLog_actorId_createdAt_idx"
ON "OperationAuditLog"("actorId", "createdAt");

ALTER TABLE "OperationAuditLog"
ADD CONSTRAINT "OperationAuditLog_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
