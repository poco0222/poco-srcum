/**
 * @file Sprint overview page for the Phase 1 sprint frontend shell.
 * @author PopoY
 * @created 2026-06-04
 */
import {
  defaultSprintProjectId,
  listSprints
} from "../../../features/sprints/api/sprints-client";
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
  stackStyle
} from "../../../features/sprints/components/sprints-layout.styles";
import { SprintsOverviewList } from "../../../features/sprints/components/sprints-overview-list";
import { SprintsSummary } from "../../../features/sprints/components/sprints-summary";

/**
 * @returns The Sprint overview page used by the P1 team to inspect planning and execution shells.
 */
export default async function SprintsPage() {
  const sprints = await listSprints(defaultSprintProjectId).catch(() => []);

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Phase 1 Sprint Control</p>
          <h1 style={heroHeadingStyle}>Sprint Overview</h1>
          <p style={heroCopyStyle}>
            Review the current Sprint shells, inspect planning goals, and drill into
            the active board without mixing Sprint execution screens into the Product
            Backlog routes.
          </p>
        </section>
        <SprintsSummary sprints={sprints} />
        <article style={panelStyle}>
          <div style={stackStyle}>
            <h2 style={sectionHeadingStyle}>Visible Sprints</h2>
            <p style={sectionCopyStyle}>
              The list reflects the lightweight in-app Sprint lifecycle implemented in
              Phase 1. Use it to move from planning into the execution board.
            </p>
            <SprintsOverviewList sprints={sprints} />
          </div>
        </article>
      </div>
    </main>
  );
}
