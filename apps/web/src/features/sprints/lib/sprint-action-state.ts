/**
 * @file Shared action state helpers for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
export type SprintActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const idleSprintActionState: SprintActionState = {
  status: "idle",
  message: ""
};
