/**
 * @file Sprint detail page for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../../../lib/auth/get-current-user";
import {
  defaultSprintProjectId,
  getSprint,
  getSprintBoard,
  getSprintDemoSessionUserId,
  getSprintsApiBaseUrl,
  listSprintDailyUpdates
} from "../../../../features/sprints/api/sprints-client";
import { DailyUpdateForm } from "../../../../features/sprints/components/daily-update-form";
import { DailyUpdateTimeline } from "../../../../features/sprints/components/daily-update-timeline";
import { SprintBoard } from "../../../../features/sprints/components/sprint-board";
import {
  heroCardStyle,
  heroCopyStyle,
  heroEyebrowStyle,
  heroHeadingStyle,
  pageStyle,
  panelStyle,
  sectionCopyStyle,
  sectionHeadingStyle,
  shellStyle,
  stackStyle,
  twoColumnStyle
} from "../../../../features/sprints/components/sprints-layout.styles";
import {
  createSprintDailyUpdateAction,
  moveSprintBoardItemAction
} from "../actions";

type SprintDetailPageProps = {
  params: Promise<{
    sprintId: string;
  }>;
};

/**
 * @param params The route params containing the target Sprint identifier.
 * @returns The Sprint board and daily update shell for one Sprint.
 */
export default async function SprintDetailPage({
  params
}: SprintDetailPageProps) {
  const { sprintId } = await params;
  const sprint = await getSprint(sprintId).catch(() => null);

  if (!sprint) {
    notFound();
  }

  const [board, dailyUpdates, currentUser] = await Promise.all([
    getSprintBoard(defaultSprintProjectId, sprintId).catch(() => ({
      todo: [],
      inProgress: [],
      done: []
    })),
    listSprintDailyUpdates(sprintId).catch(() => []),
    getCurrentUser(getSprintsApiBaseUrl(), getSprintDemoSessionUserId()).catch(
      () => null
    )
  ]);

  async function moveBoardAction(formData: FormData) {
    "use server";

    return moveSprintBoardItemAction(sprintId, formData);
  }

  async function saveDailyUpdateAction(
    state: Awaited<ReturnType<typeof createSprintDailyUpdateAction>>,
    formData: FormData
  ) {
    "use server";

    return createSprintDailyUpdateAction(
      sprintId,
      currentUser?.id ?? getSprintDemoSessionUserId(),
      state,
      formData
    );
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Sprint Execution</p>
          <h1 style={heroHeadingStyle}>{sprint.name}</h1>
          <p style={heroCopyStyle}>
            Goal: {sprint.goal ?? "No sprint goal has been recorded yet."}
          </p>
          <p style={{ ...heroCopyStyle, fontSize: "15px", maxWidth: "100%" }}>
            Planning note: {sprint.planningNote ?? "No planning note is available yet."}
          </p>
        </section>
        <section style={twoColumnStyle}>
          <div style={stackStyle}>
            <article style={panelStyle}>
              <div style={stackStyle}>
                <Link href="/sprints" style={{ color: "#0f766e", fontWeight: 700 }}>
                  Return to Sprint Overview
                </Link>
                <h2 style={sectionHeadingStyle}>Sprint Board</h2>
                <p style={sectionCopyStyle}>
                  Move committed work through the minimum `todo / in-progress / done`
                  lanes while keeping execution updates scoped to the current Sprint.
                </p>
                <SprintBoard board={board} moveBoardItemAction={moveBoardAction} />
              </div>
            </article>
          </div>
          <div style={stackStyle}>
            <article style={panelStyle}>
              <div style={stackStyle}>
                <h2 style={sectionHeadingStyle}>Daily Update</h2>
                <p style={sectionCopyStyle}>
                  Capture the latest execution note for a specific work item or the
                  Sprint in general.
                </p>
                <DailyUpdateForm action={saveDailyUpdateAction} />
              </div>
            </article>
            <article style={panelStyle}>
              <div style={stackStyle}>
                <h2 style={sectionHeadingStyle}>Timeline</h2>
                <p style={sectionCopyStyle}>
                  The newest Sprint daily updates appear first so the team can quickly
                  inspect the current execution context.
                </p>
                <DailyUpdateTimeline updates={dailyUpdates} />
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
