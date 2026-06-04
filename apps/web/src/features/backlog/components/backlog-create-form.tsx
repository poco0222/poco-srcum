/**
 * @file Backlog create form for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import { useActionState } from "react";

import { idleBacklogActionState } from "../lib/backlog-action-state";
import {
  formGridStyle,
  fullSpanStyle,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  stackStyle,
  textareaStyle
} from "./backlog-layout.styles";

type BacklogCreateFormProps = {
  action: (
    state: typeof idleBacklogActionState,
    formData: FormData
  ) => Promise<typeof idleBacklogActionState>;
};

/**
 * @param action The server action that persists a new backlog item.
 * @returns The lightweight create form used on the backlog landing page.
 */
export function BacklogCreateForm({ action }: BacklogCreateFormProps) {
  const [state, formAction, isPending] = useActionState(action, idleBacklogActionState);

  return (
    <form action={formAction} style={stackStyle}>
      <div style={formGridStyle}>
        <label style={labelStyle}>
          Type
          <select name="type" defaultValue="STORY" style={inputStyle}>
            <option value="STORY">Story</option>
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
            <option value="EPIC">Epic</option>
          </select>
        </label>
        <label style={labelStyle}>
          Priority
          <select name="priority" defaultValue="HIGH" style={inputStyle}>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </label>
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Title
          <input
            name="title"
            placeholder="Example: Prepare the Sprint-ready backlog review"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Story Points
          <input
            name="storyPoints"
            inputMode="numeric"
            placeholder="Optional for Bug / Epic"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Parent Work Item ID
          <input
            name="parentId"
            placeholder="Story parent for Task, optional otherwise"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Assignee ID
          <input
            name="assigneeId"
            placeholder="Example: user-1"
            style={inputStyle}
          />
        </label>
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Acceptance Criteria
          <textarea
            name="acceptanceCriteria"
            placeholder={"One criterion per line\nExample: Backlog order is visible to the product owner."}
            style={textareaStyle}
          />
        </label>
        <label style={{ ...labelStyle, ...fullSpanStyle }}>
          Description
          <textarea
            name="description"
            placeholder="Describe the delivery intent or context for the backlog item."
            style={textareaStyle}
          />
        </label>
      </div>
      {state.status !== "idle" ? (
        <p
          style={{
            margin: 0,
            color: state.status === "error" ? "#b91c1c" : "#047857"
          }}
        >
          {state.message}
        </p>
      ) : null}
      <button disabled={isPending} style={primaryButtonStyle} type="submit">
        {isPending ? "Saving Backlog Item..." : "Create Backlog Item"}
      </button>
    </form>
  );
}
