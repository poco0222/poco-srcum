/**
 * @file Portfolio page content component for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type {
  PortfolioFilter,
  PortfolioOverview,
  PortfolioProjectSummary
} from "@poco-scrum/domain";
import React from "react";
import type { CurrentUserSummary } from "../../../lib/auth/get-current-user";
import { PortfolioFilters } from "./portfolio-filters";
import {
  cardStyle,
  cardTitleStyle,
  copyStyle,
  headerStyle,
  headingStyle,
  metricPillStyle,
  metricRowStyle,
  overviewGridStyle,
  pageStyle,
  shellStyle,
  stateStyle
} from "./portfolio-layout.styles";
import { RiskBadges } from "./risk-badges";
import { RoadmapTimeline } from "./roadmap-timeline";

type PortfolioPageContentProps = {
  currentUser: CurrentUserSummary | null;
  filters: PortfolioFilter;
  loadError: string | null;
  overview: PortfolioOverview | null;
};

/**
 * @param props Portfolio data and state resolved by the route.
 * @returns The Portfolio management view.
 */
export function PortfolioPageContent({
  currentUser,
  filters,
  loadError,
  overview
}: PortfolioPageContentProps) {
  if (!currentUser) {
    return (
      <main style={pageStyle}>
        <div style={shellStyle}>
          <section style={stateStyle}>
            Portfolio access requires a signed-in session.
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={headerStyle}>
          <h1 style={headingStyle}>Portfolio Roadmap</h1>
          <p style={copyStyle}>
            View project summaries, roadmap milestones, and operating signals for{" "}
            {currentUser.team.name}.
          </p>
        </header>
        <PortfolioFilters filters={filters} />
        {loadError ? (
          <section aria-label="Portfolio error" style={stateStyle}>
            Unable to load Portfolio data. {loadError}
          </section>
        ) : null}
        {overview ? (
          <>
            <section aria-label="Portfolio project summaries" style={overviewGridStyle}>
              {overview.projects.length > 0 ? (
                overview.projects.map((project) => (
                  <PortfolioProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div style={stateStyle}>
                  No portfolio projects match the current filters.
                </div>
              )}
            </section>
            <section aria-label="Portfolio roadmap">
              <RoadmapTimeline milestones={overview.milestones} />
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

/**
 * @param props The project summary to render.
 * @returns A compact management summary card.
 */
function PortfolioProjectCard({ project }: { project: PortfolioProjectSummary }) {
  return (
    <article style={cardStyle}>
      <div style={metricRowStyle}>
        <span style={metricPillStyle}>{project.status}</span>
        <span style={metricPillStyle}>{project.portfolioName ?? "No portfolio"}</span>
      </div>
      <h2 style={cardTitleStyle}>{project.name}</h2>
      <p style={copyStyle}>
        {project.key} / {project.teamId}
      </p>
      <div style={metricRowStyle}>
        <span style={metricPillStyle}>{project.totalWorkItemCount} work items</span>
        <span style={metricPillStyle}>{project.doneWorkItemCount} done</span>
        <span style={metricPillStyle}>{project.activeSprintCount} active Sprints</span>
      </div>
      <RiskBadges signals={project.signals} />
    </article>
  );
}
