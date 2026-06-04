/**
 * @file Sprint board shell with todo, in-progress, and done columns.
 * @author PopoY
 * @created 2026-06-04
 */
import type { WorkItemRecord } from "@poco-scrum/domain";

import type { SprintBoardColumn } from "../api/sprints-client";
import { SprintBadge } from "./sprint-badge";
import {
  boardCardStyle,
  boardColumnBadgeStyle,
  boardColumnHeaderStyle,
  boardColumnStyle,
  boardGridStyle,
  emptyStateStyle,
  pillRowStyle,
  secondaryButtonStyle,
  stackStyle,
  subtleCopyStyle
} from "./sprints-layout.styles";

type MoveBoardItemAction = (formData: FormData) => Promise<void>;

type SprintBoardProps = {
  board: {
    todo: WorkItemRecord[];
    inProgress: WorkItemRecord[];
    done: WorkItemRecord[];
  };
  moveBoardItemAction: MoveBoardItemAction;
};

type SprintBoardCardProps = {
  item: WorkItemRecord;
  targetColumn: SprintBoardColumn;
  targetLabel: string;
  moveBoardItemAction: MoveBoardItemAction;
};

function SprintBoardCard({
  item,
  targetColumn,
  targetLabel,
  moveBoardItemAction
}: SprintBoardCardProps) {
  return (
    <article style={boardCardStyle}>
      <div style={pillRowStyle}>
        <SprintBadge label={item.type} tone="neutral" />
        <SprintBadge label={item.priority} tone="priority" />
      </div>
      <div style={stackStyle}>
        <h3 style={{ margin: 0, fontSize: "18px", lineHeight: 1.35 }}>{item.title}</h3>
        <p style={subtleCopyStyle}>
          Status: <strong>{item.status}</strong>
        </p>
        <p style={subtleCopyStyle}>
          Assignee: <strong>{item.assigneeId ?? "Unassigned"}</strong>
        </p>
        <p style={subtleCopyStyle}>
          Story points: <strong>{item.storyPoints ?? "Not estimated"}</strong>
        </p>
      </div>
      <form action={moveBoardItemAction}>
        <input name="workItemId" type="hidden" value={item.id} />
        <input name="column" type="hidden" value={targetColumn} />
        <button style={secondaryButtonStyle} type="submit">
          Move to {targetLabel}
        </button>
      </form>
    </article>
  );
}

/**
 * @param board The grouped Sprint board data.
 * @param moveBoardItemAction The route-local server action used for lane changes.
 * @returns The minimum three-column Sprint board shell.
 */
export function SprintBoard({ board, moveBoardItemAction }: SprintBoardProps) {
  const columns: Array<{
    key: SprintBoardColumn;
    label: string;
    items: WorkItemRecord[];
    targetColumn: SprintBoardColumn;
    targetLabel: string;
  }> = [
    {
      key: "todo",
      label: "Todo",
      items: board.todo,
      targetColumn: "in-progress",
      targetLabel: "In Progress"
    },
    {
      key: "in-progress",
      label: "In Progress",
      items: board.inProgress,
      targetColumn: "done",
      targetLabel: "Done"
    },
    {
      key: "done",
      label: "Done",
      items: board.done,
      targetColumn: "todo",
      targetLabel: "Todo"
    }
  ];

  return (
    <section style={boardGridStyle}>
      {columns.map((column) => (
        <article key={column.key} style={boardColumnStyle}>
          <div style={boardColumnHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2 }}>{column.label}</h2>
            <span style={boardColumnBadgeStyle}>{column.items.length}</span>
          </div>
          {column.items.length === 0 ? (
            <div style={emptyStateStyle}>No work items currently appear in this column.</div>
          ) : (
            <div style={stackStyle}>
              {column.items.map((item) => (
                <SprintBoardCard
                  item={item}
                  key={item.id}
                  moveBoardItemAction={moveBoardItemAction}
                  targetColumn={column.targetColumn}
                  targetLabel={column.targetLabel}
                />
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
