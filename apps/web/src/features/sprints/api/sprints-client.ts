/**
 * @file Sprint API client for the Phase 1 board shell.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  SprintDailyUpdateRecord,
  SprintRecord,
  WorkItemRecord
} from "@poco-scrum/domain";
import { WorkItemStatus } from "@poco-scrum/domain";

export type SprintBoardColumn = "todo" | "in-progress" | "done";

export type SprintBoard = {
  todo: WorkItemRecord[];
  inProgress: WorkItemRecord[];
  done: WorkItemRecord[];
};

export type SprintOverview = {
  sprint: SprintRecord;
  board: SprintBoard;
  dailyUpdates: SprintDailyUpdateRecord[];
};

export type CreateSprintDailyUpdateInput = {
  sprintId: string;
  workItemId: string | null;
  authorId: string;
  summary: string;
};

export type MoveSprintBoardItemInput = {
  sprintId: string;
  workItemId: string;
  column: SprintBoardColumn;
};

export const defaultSprintProjectId =
  process.env.POCO_DEFAULT_PROJECT_ID ?? "project-1";

/**
 * Resolve the API origin without coupling page components to environment variables.
 */
export function getSprintsApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * Keep the minimal shell aligned with the existing demo session convention.
 */
export function getSprintDemoSessionUserId() {
  return process.env.POCO_DEMO_SESSION_USER ?? "user-1";
}

async function requestJson<TValue>(path: string, init?: RequestInit) {
  const response = await fetch(`${getSprintsApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "SPRINT_API_REQUEST_FAILED");
  }

  return (await response.json()) as TValue;
}

function isSprintRecord(value: unknown): value is SprintRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<SprintRecord>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.projectId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.status === "string"
  );
}

function isSprintBoardShape(value: unknown): value is SprintBoard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Record<keyof SprintBoard, unknown>>;
  return (
    Array.isArray(candidate.todo) &&
    Array.isArray(candidate.inProgress) &&
    Array.isArray(candidate.done)
  );
}

/**
 * Group sprint work items into the three board lanes required by the shell.
 */
export function buildSprintBoardFromItems(items: WorkItemRecord[]): SprintBoard {
  return {
    todo: items.filter((item) => item.status === WorkItemStatus.COMMITTED_TO_SPRINT),
    inProgress: items.filter((item) => item.status === WorkItemStatus.IN_PROGRESS),
    done: items.filter((item) => item.status === WorkItemStatus.DONE)
  };
}

/**
 * List sprints for the default project. The API currently may not expose this yet, so fall back to an empty shell.
 */
export async function listSprints(projectId: string) {
  try {
    const query = new URLSearchParams({
      projectId
    });
    const payload = await requestJson<unknown>(`/sprints?${query.toString()}`);

    return Array.isArray(payload)
      ? payload.filter((entry): entry is SprintRecord => isSprintRecord(entry))
      : [];
  } catch {
    return [];
  }
}

/**
 * Load a single sprint when a direct fetch endpoint exists.
 */
export async function getSprint(sprintId: string) {
  const payload = await requestJson<unknown>(`/sprints/${sprintId}`);

  if (!isSprintRecord(payload)) {
    throw new Error("SPRINT_DETAIL_RESPONSE_INVALID");
  }

  return payload;
}

/**
 * Load work items already assigned to the sprint. This works with the existing work item API.
 */
export function listSprintWorkItems(projectId: string, sprintId: string) {
  const query = new URLSearchParams({
    projectId,
    sprintId
  });

  return requestJson<WorkItemRecord[]>(`/work-items?${query.toString()}`);
}

/**
 * Load board data from a dedicated endpoint when present, otherwise derive it from sprint-scoped work items.
 */
export async function getSprintBoard(projectId: string, sprintId: string) {
  try {
    const payload = await requestJson<unknown>(`/sprints/${sprintId}/board`);

    if (!isSprintBoardShape(payload)) {
      throw new Error("SPRINT_BOARD_RESPONSE_INVALID");
    }

    return payload;
  } catch {
    const items = await listSprintWorkItems(projectId, sprintId).catch(() => []);
    return buildSprintBoardFromItems(items);
  }
}

/**
 * Load sprint daily updates when the API exposes them. Missing endpoints degrade to an empty timeline.
 */
export async function listSprintDailyUpdates(sprintId: string) {
  try {
    const payload = await requestJson<unknown>(`/sprints/${sprintId}/daily-updates`);

    return Array.isArray(payload)
      ? payload.filter((entry): entry is SprintDailyUpdateRecord => {
          if (typeof entry !== "object" || entry === null) {
            return false;
          }

          const candidate = entry as Partial<SprintDailyUpdateRecord>;

          return (
            typeof candidate.id === "string" &&
            typeof candidate.sprintId === "string" &&
            typeof candidate.authorId === "string" &&
            typeof candidate.summary === "string" &&
            typeof candidate.createdAt === "string"
          );
        })
      : [];
  } catch {
    return [];
  }
}

/**
 * Compose the board shell inputs needed by the sprint detail page.
 */
export async function getSprintOverview(projectId: string, sprintId: string) {
  const [sprint, board, dailyUpdates] = await Promise.all([
    getSprint(sprintId),
    getSprintBoard(projectId, sprintId),
    listSprintDailyUpdates(sprintId)
  ]);

  return {
    sprint,
    board,
    dailyUpdates
  } satisfies SprintOverview;
}

/**
 * Move one work item across the three board lanes when the execution endpoint exists.
 */
export function moveSprintBoardItem(payload: MoveSprintBoardItemInput) {
  return requestJson<WorkItemRecord>(`/sprints/${payload.sprintId}/board/move`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * Record one sprint daily update entry through the execution API when available.
 */
export function createSprintDailyUpdate(payload: CreateSprintDailyUpdateInput) {
  return requestJson<SprintDailyUpdateRecord>(
    `/sprints/${payload.sprintId}/daily-updates`,
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
}
