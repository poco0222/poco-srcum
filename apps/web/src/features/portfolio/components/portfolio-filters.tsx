/**
 * @file Portfolio filters component for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import React from "react";

import {
  ProjectStatus,
  type PortfolioFilter
} from "@poco-scrum/domain";
import {
  filterGridStyle,
  inputStyle,
  labelStyle,
  panelStyle,
  primaryButtonStyle
} from "./portfolio-layout.styles";

type PortfolioFiltersProps = {
  filters: PortfolioFilter;
};

const projectStatusOptions = Object.values(ProjectStatus);

/**
 * @param props The current Portfolio filter values.
 * @returns A GET form that keeps Portfolio views URL-driven and shareable.
 */
export function PortfolioFilters({ filters }: PortfolioFiltersProps) {
  return (
    <form method="get" style={panelStyle}>
      <div style={filterGridStyle}>
        <label style={labelStyle}>
          Portfolio
          <input
            defaultValue={filters.portfolioId ?? ""}
            name="portfolioId"
            placeholder="portfolio-alpha"
            style={inputStyle}
            type="search"
          />
        </label>
        <label style={labelStyle}>
          Project
          <input
            defaultValue={filters.projectId ?? ""}
            name="projectId"
            placeholder="project-1"
            style={inputStyle}
            type="search"
          />
        </label>
        <label style={labelStyle}>
          Project status
          <select
            defaultValue={filters.projectStatus ?? ""}
            name="projectStatus"
            style={inputStyle}
          >
            <option value="">Any status</option>
            {projectStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Milestone from
          <input
            defaultValue={filters.milestoneFrom ?? ""}
            name="milestoneFrom"
            style={inputStyle}
            type="date"
          />
        </label>
        <label style={labelStyle}>
          Milestone to
          <input
            defaultValue={filters.milestoneTo ?? ""}
            name="milestoneTo"
            style={inputStyle}
            type="date"
          />
        </label>
        <button style={primaryButtonStyle} type="submit">
          Apply filters
        </button>
      </div>
    </form>
  );
}
