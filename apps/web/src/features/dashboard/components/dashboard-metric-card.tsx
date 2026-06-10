/**
 * @file Dashboard metric card component for Phase 2 collaboration status.
 * @author PopoY
 * @created 2026-06-10
 */
import React from "react";

import {
  cardStyle,
  cardTitleStyle,
  copyStyle,
  linkStyle,
  metricValueStyle
} from "./dashboard-layout.styles";

type DashboardMetricCardProps = {
  title: string;
  value: number;
  description: string;
  href: string;
};

/**
 * @param props The fixed metric card content and target link.
 * @returns A compact dashboard metric card.
 */
export function DashboardMetricCard({
  title,
  value,
  description,
  href
}: DashboardMetricCardProps) {
  return (
    <article style={cardStyle}>
      <h2 style={cardTitleStyle}>{title}</h2>
      <p style={metricValueStyle}>{value}</p>
      <p style={copyStyle}>{description}</p>
      <a href={href} style={linkStyle}>
        Inspect
      </a>
    </article>
  );
}
