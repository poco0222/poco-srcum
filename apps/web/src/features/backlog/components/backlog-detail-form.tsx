/**
 * @file Backlog detail form for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
"use client";

import { useActionState } from "react";

import type { WorkItemRecord } from "@poco-scrum/domain";
import { idleBacklogActionState } from "../lib/backlog-action-state";
import { getWorkItemReadyPresentation } from "../lib/backlog-ready";
import { BacklogBadge } from "./backlog-badge";
import {
  formGridStyle,
  fullSpanStyle,
  inputStyle,
  labelStyle,
  pillRowStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  stackStyle,
  subtleCopyStyle,
  textareaStyle
} from "./backlog-layout.styles";

type BacklogDetailFormProps = {
  workItem: WorkItemRecord;
  updateAction: (
    state: typeof idleBacklogActionState,
    formData: FormData
  ) => Promise<typeof idleBacklogActionState>;
  addToSprintAction: (
    state: typeof idleBacklogActionState,
    formData: FormData
  ) => Promise<typeof idleBacklogActionState>;
};

/**
 * @param workItem The detail payload currently being edited.
 * @param updateAction The server action that persists detail changes.
 * @param addToSprintAction The server action that commits the story into a sprint.
 * @returns The editable backlog detail form plus Sprint commitment controls.
 */
export function BacklogDetailForm({
  workItem,
  updateAction,
  addToSprintAction
}: BacklogDetailFormProps) {
  const readyPresentation = getWorkItemReadyPresentation(workItem);
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAction,
    idleBacklogActionState
  );
  const [commitState, commitFormAction, commitPending] = useActionState(
    addToSprintAction,
    idleBacklogActionState
  );

  return (
    <section style={stackStyle}>
      <div style={pillRowStyle}>
        <BacklogBadge label={workItem.type} tone="neutral" />
        <BacklogBadge label={workItem.priority} tone="priority" />
        <BacklogBadge label={readyPresentation.label} tone={readyPresentation.tone} />
      </div>
      <p style={subtleCopyStyle}>
        Ready hints: {readyPresentation.reasons.join(" ")}
      </p>
      <form action={updateFormAction} style={stackStyle}>
        <input name="workItemId" type="hidden" value={workItem.id} />
        <div style={formGridStyle}>
          <label style={{ ...labelStyle, ...fullSpanStyle }}>
            Title
            <input defaultValue={workItem.title} name="title" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Priority
            <select defaultValue={workItem.priority} name="priority" style={inputStyle}>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </label>
          <label style={labelStyle}>
            Story Points
            <input
              defaultValue={workItem.storyPoints ?? ""}
              name="storyPoints"
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Parent Work Item ID
            <input defaultValue={workItem.parentId ?? ""} name="parentId" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Assignee ID
            <input
              defaultValue={workItem.assigneeId ?? ""}
              name="assigneeId"
              style={inputStyle}
            />
          </label>
          <label style={{ ...labelStyle, ...fullSpanStyle }}>
            Acceptance Criteria
            <textarea
              defaultValue={workItem.acceptanceCriteria.join("\n")}
              name="acceptanceCriteria"
              style={textareaStyle}
            />
          </label>
          <label style={{ ...labelStyle, ...fullSpanStyle }}>
            Description
            <textarea
              defaultValue={workItem.description ?? ""}
              name="description"
              style={textareaStyle}
            />
          </label>
        </div>
        {updateState.status !== "idle" ? (
          <p
            style={{
              margin: 0,
              color: updateState.status === "error" ? "#b91c1c" : "#047857"
            }}
          >
            {updateState.message}
          </p>
        ) : null}
        <button disabled={updatePending} style={primaryButtonStyle} type="submit">
          {updatePending ? "Saving Changes..." : "Save Work Item"}
        </button>
      </form>
      <form action={commitFormAction} style={stackStyle}>
        <input name="workItemId" type="hidden" value={workItem.id} />
        <label style={labelStyle}>
          Sprint ID
          <input
            defaultValue={workItem.sprintId ?? "sprint-1"}
            name="sprintId"
            style={inputStyle}
          />
        </label>
        {commitState.status !== "idle" ? (
          <p
            style={{
              margin: 0,
              color: commitState.status === "error" ? "#b91c1c" : "#047857"
            }}
          >
            {commitState.message}
          </p>
        ) : null}
        <button disabled={commitPending} style={secondaryButtonStyle} type="submit">
          {commitPending ? "Committing to Sprint..." : "Add Story to Sprint"}
        </button>
      </form>
    </section>
  );
}
