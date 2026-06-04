/**
 * @file Backlog landing page for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import { BacklogCreateForm } from "../../../features/backlog/components/backlog-create-form";
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
} from "../../../features/backlog/components/backlog-layout.styles";
import { BacklogList } from "../../../features/backlog/components/backlog-list";
import { BacklogSummary } from "../../../features/backlog/components/backlog-summary";
import {
  defaultProjectId,
  listBacklogItems
} from "../../../features/backlog/api/backlog-client";
import {
  createBacklogWorkItemAction,
  reorderBacklogWorkItemsAction
} from "./actions";

/**
 * @returns The Backlog overview page used by the P1 team to manage work item order and readiness.
 */
export default async function BacklogPage() {
  const backlogItems = await listBacklogItems(defaultProjectId).catch(() => []);

  async function moveUpAction(formData: FormData) {
    "use server";

    formData.set("projectId", defaultProjectId);
    return reorderBacklogWorkItemsAction(formData);
  }

  async function moveDownAction(formData: FormData) {
    "use server";

    formData.set("projectId", defaultProjectId);
    return reorderBacklogWorkItemsAction(formData);
  }

  async function createAction(state: Awaited<ReturnType<typeof createBacklogWorkItemAction>>, formData: FormData) {
    "use server";

    formData.set("projectId", defaultProjectId);
    return createBacklogWorkItemAction(state, formData);
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Phase 1 Backlog Control</p>
          <h1 style={heroHeadingStyle}>Product Backlog</h1>
          <p style={heroCopyStyle}>
            Keep Story, Task, Bug, and Epic work items in one ordered backlog, track
            Story readiness before Sprint planning, and move directly into the detail
            view when criteria still need refinement.
          </p>
        </section>
        <BacklogSummary items={backlogItems} />
        <section style={twoColumnStyle}>
          <div style={stackStyle}>
            <article style={panelStyle}>
              <h2 style={sectionHeadingStyle}>Ordered Backlog</h2>
              <p style={sectionCopyStyle}>
                Use the lightweight move controls to keep the Product Backlog ordered
                without introducing drag-and-drop complexity in Phase 1.
              </p>
            </article>
            <BacklogList
              items={backlogItems}
              moveDownAction={moveDownAction}
              moveUpAction={moveUpAction}
            />
          </div>
          <article style={panelStyle}>
            <h2 style={sectionHeadingStyle}>Create Work Item</h2>
            <p style={sectionCopyStyle}>
              Record title, priority, story points, and acceptance criteria in one
              place so the Story ready gate can be evaluated consistently.
            </p>
            <BacklogCreateForm action={createAction} />
          </article>
        </section>
      </div>
    </main>
  );
}
