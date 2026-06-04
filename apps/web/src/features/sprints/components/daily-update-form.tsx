/**
 * @file Daily update form for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import { useActionState } from "react";

import { idleSprintActionState } from "../lib/sprint-action-state";
import {
  actionStateStyle,
  formGridStyle,
  fullSpanStyle,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  stackStyle,
  textareaStyle
} from "./sprints-layout.styles";

type DailyUpdateFormProps = {
  action: (
    state: typeof idleSprintActionState,
    formData: FormData
  ) => Promise<typeof idleSprintActionState>;
  defaultWorkItemId?: string | null;
};

/**
 * @param action The server action that submits the daily update payload.
 * @param defaultWorkItemId Optional preselected work item identifier.
 * @returns The minimal daily update form used by the Sprint detail page.
 */
export function DailyUpdateForm({
  action,
  defaultWorkItemId = null
}: DailyUpdateFormProps) {
  const [state, formAction, isPending] = useActionState(action, idleSprintActionState);

  return (
    <form action={formAction} style={stackStyle}>
      <div style={formGridStyle}>
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Related Work Item ID
          <input
            defaultValue={defaultWorkItemId ?? ""}
            name="workItemId"
            placeholder="Optional: story-1"
            style={inputStyle}
          />
        </label>
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Daily Update Summary
          <textarea
            name="summary"
            placeholder="Describe progress, blockers, or the next focus for today."
            style={textareaStyle}
          />
        </label>
      </div>
      {state.status !== "idle" ? (
        <p
          style={{
            ...actionStateStyle,
            margin: 0,
            color: state.status === "error" ? "#b91c1c" : "#047857",
            backgroundColor:
              state.status === "error"
                ? "rgba(254, 226, 226, 0.72)"
                : "rgba(220, 252, 231, 0.72)"
          }}
        >
          {state.message}
        </p>
      ) : null}
      <button disabled={isPending} style={primaryButtonStyle} type="submit">
        {isPending ? "Saving Daily Update..." : "Save Daily Update"}
      </button>
    </form>
  );
}
