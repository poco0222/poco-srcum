/**
 * @file Portfolio page content regression tests for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { PortfolioPageContent } from "./portfolio-page-content";

describe("PortfolioPageContent", () => {
  it("renders an unauthorized state when no session user is available", () => {
    const html = renderToStaticMarkup(
      createElement(PortfolioPageContent, {
        currentUser: null,
        filters: {},
        loadError: null,
        overview: null
      })
    );

    assert.match(html, /Portfolio access requires a signed-in session/);
  });

  it("renders an API error state without hiding filters", () => {
    const html = renderToStaticMarkup(
      createElement(PortfolioPageContent, {
        currentUser: {
          id: "user-1",
          displayName: "PopoY Demo User",
          team: {
            id: "team-1",
            name: "POCO Core Team"
          },
          defaultProject: {
            id: "project-1",
            key: "POCO",
            name: "POCO Scrum Platform"
          }
        },
        filters: {
          projectId: "project-1"
        },
        loadError: "PORTFOLIO_API_REQUEST_FAILED",
        overview: null
      })
    );

    assert.match(html, /Unable to load Portfolio data/);
    assert.match(html, /name="projectId"/);
  });

  it("renders project metrics and empty roadmap state", () => {
    const html = renderToStaticMarkup(
      createElement(PortfolioPageContent, {
        currentUser: {
          id: "user-1",
          displayName: "PopoY Demo User",
          team: {
            id: "team-1",
            name: "POCO Core Team"
          },
          defaultProject: {
            id: "project-1",
            key: "POCO",
            name: "POCO Scrum Platform"
          }
        },
        filters: {},
        loadError: null,
        overview: {
          filters: {},
          generatedAt: "2026-06-11T14:30:00.000Z",
          milestones: [],
          projects: [
            {
              id: "project-1",
              key: "POCO",
              name: "POCO Scrum Platform",
              teamId: "team-1",
              status: "ACTIVE",
              portfolioId: null,
              portfolioName: null,
              activeSprintCount: 1,
              doneWorkItemCount: 2,
              totalWorkItemCount: 5,
              milestones: [],
              signals: {
                risk: {
                  severity: "NONE",
                  label: "No formal signal",
                  count: 0,
                  sourceIds: []
                },
                dependency: {
                  severity: "NONE",
                  label: "No formal signal",
                  count: 0,
                  sourceIds: []
                },
                delay: {
                  severity: "NONE",
                  label: "No formal signal",
                  count: 0,
                  sourceIds: []
                },
                source: "task-02-reporting-and-risk-tracking.md",
                updatedAt: null
              }
            }
          ]
        }
      })
    );

    assert.match(html, /POCO Scrum Platform/);
    assert.match(html, /5 work items/);
    assert.match(html, /No roadmap milestones match the current filters/);
  });
});
