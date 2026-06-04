/**
 * @file Shared action state helpers for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
export type BacklogActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const idleBacklogActionState: BacklogActionState = {
  status: "idle",
  message: ""
};
