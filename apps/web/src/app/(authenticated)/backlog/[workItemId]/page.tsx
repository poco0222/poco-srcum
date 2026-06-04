/**
 * @file Backlog detail page for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBacklogWorkItem } from "../../../../features/backlog/api/backlog-client";
import { BacklogDetailForm } from "../../../../features/backlog/components/backlog-detail-form";
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
  subtleCopyStyle
} from "../../../../features/backlog/components/backlog-layout.styles";
import {
  addStoryToSprintAction,
  saveBacklogDetailAction
} from "./actions";

type BacklogDetailPageProps = {
  params: Promise<{
    workItemId: string;
  }>;
};

/**
 * @param params The route params containing the target work item identifier.
 * @returns The editable work item detail page.
 */
export default async function BacklogDetailPage({
  params
}: BacklogDetailPageProps) {
  const { workItemId } = await params;
  const workItem = await getBacklogWorkItem(workItemId).catch(() => null);

  if (!workItem) {
    notFound();
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Backlog Detail</p>
          <h1 style={heroHeadingStyle}>{workItem.title}</h1>
          <p style={heroCopyStyle}>
            Refine the Story acceptance criteria, update planning metadata, and
            commit the Story into a Sprint only after the shared ready gate turns
            green.
          </p>
        </section>
        <article style={panelStyle}>
          <div style={stackStyle}>
            <Link href="/backlog" style={{ color: "#0f766e", fontWeight: 700 }}>
              Return to Backlog
            </Link>
            <h2 style={sectionHeadingStyle}>Work Item Detail</h2>
            <p style={sectionCopyStyle}>
              Work item ID: <strong>{workItem.id}</strong> · Current Sprint:{" "}
              <strong>{workItem.sprintId ?? "Not committed"}</strong>
            </p>
            <p style={subtleCopyStyle}>
              Use this page to keep Story planning details, acceptance criteria, and
              Sprint commitment aligned with the API ready gate.
            </p>
          </div>
          <BacklogDetailForm
            addToSprintAction={addStoryToSprintAction}
            updateAction={saveBacklogDetailAction}
            workItem={workItem}
          />
        </article>
      </div>
    </main>
  );
}
