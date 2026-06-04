/**
 * @file Sprint summary page for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../../../../lib/auth/get-current-user";
import {
  getSprint,
  getSprintDemoSessionUserId,
  getSprintsApiBaseUrl
} from "../../../../../features/sprints/api/sprints-client";
import {
  heroCardStyle,
  heroCopyStyle,
  heroEyebrowStyle,
  heroHeadingStyle,
  pageStyle,
  panelStyle,
  primaryButtonStyle,
  sectionCopyStyle,
  sectionHeadingStyle,
  shellStyle,
  stackStyle,
  textareaStyle
} from "../../../../../features/sprints/components/sprints-layout.styles";

type SprintSummaryPageProps = {
  params: Promise<{
    sprintId: string;
  }>;
};

/**
 * @param params The route params containing the target Sprint identifier.
 * @returns The Sprint summary shell used to launch the minimum retrospective entry.
 */
export default async function SprintSummaryPage({
  params
}: SprintSummaryPageProps) {
  const { sprintId } = await params;
  const sprint = await getSprint(sprintId).catch(() => null);

  if (!sprint) {
    notFound();
  }

  const currentUser = await getCurrentUser(
    getSprintsApiBaseUrl(),
    getSprintDemoSessionUserId()
  ).catch(() => null);

  async function createRetrospectiveAction(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "").trim();
    const markdown = String(formData.get("markdown") ?? "").trim();

    if (title.length === 0 || markdown.length === 0) {
      throw new Error("SPRINT_RETROSPECTIVE_INPUT_INVALID");
    }

    const response = await fetch(`${getSprintsApiBaseUrl()}/sprints/${sprintId}/retrospective`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        actorId: currentUser?.id ?? getSprintDemoSessionUserId(),
        title,
        markdown
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      throw new Error(payload?.message ?? "SPRINT_RETROSPECTIVE_CREATE_FAILED");
    }
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Sprint Summary</p>
          <h1 style={heroHeadingStyle}>{sprint.name}</h1>
          <p style={heroCopyStyle}>
            Status: {sprint.status} · Goal: {sprint.goal ?? "Not recorded yet"}
          </p>
        </section>
        <article style={panelStyle}>
          <div style={stackStyle}>
            <Link href={`/sprints/${sprint.id}`} style={{ color: "#0f766e", fontWeight: 700 }}>
              Return to Sprint Board
            </Link>
            <h2 style={sectionHeadingStyle}>Retrospective Entry</h2>
            <p style={sectionCopyStyle}>
              Record the minimum retrospective note after the Sprint has ended so the
              P1 flow can prove a full close-out loop.
            </p>
            <form action={createRetrospectiveAction} style={stackStyle}>
              <label style={{ display: "grid", gap: "8px", fontWeight: 600 }}>
                Title
                <input
                  defaultValue={`${sprint.name} Retrospective`}
                  name="title"
                  style={textareaStyle}
                />
              </label>
              <label style={{ display: "grid", gap: "8px", fontWeight: 600 }}>
                Retrospective Markdown
                <textarea
                  defaultValue={"## Wins\n- Sprint board stayed usable.\n\n## Improve\n- Capture blockers earlier."}
                  name="markdown"
                  style={textareaStyle}
                />
              </label>
              <button style={primaryButtonStyle} type="submit">
                Create Retrospective
              </button>
            </form>
          </div>
        </article>
      </div>
    </main>
  );
}
