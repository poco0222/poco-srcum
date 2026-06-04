/**
 * @file Shared action state helpers for Phase 2 formal document creation.
 * @author PopoY
 * @created 2026-06-04
 */
export type DocumentActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const idleDocumentActionState: DocumentActionState = {
  status: "idle",
  message: ""
};
