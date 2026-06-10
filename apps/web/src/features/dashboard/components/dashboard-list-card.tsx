/**
 * @file Dashboard list card component for Phase 2 collaboration status.
 * @author PopoY
 * @created 2026-06-10
 */
import React from "react";

import type { IncompleteLinkCard } from "../api/dashboard-client";
import {
  badgeStyle,
  cardStyle,
  cardTitleStyle,
  copyStyle,
  itemListStyle,
  itemStyle,
  linkStyle
} from "./dashboard-layout.styles";
import { buildSearchResultHref } from "../../search/components/search-result-card";

type DashboardListCardProps = {
  title: string;
  emptyText: string;
  items: IncompleteLinkCard[];
};

/**
 * @param props The incomplete-link list card content.
 * @returns A list card that links each object back to its detail surface.
 */
export function DashboardListCard({
  title,
  emptyText,
  items
}: DashboardListCardProps) {
  return (
    <article style={cardStyle}>
      <h2 style={cardTitleStyle}>{title}</h2>
      {items.length === 0 ? (
        <p style={copyStyle}>{emptyText}</p>
      ) : (
        <ul style={itemListStyle}>
          {items.map((item) => (
            <li key={`${item.objectType}:${item.objectId}`} style={itemStyle}>
              <a
                href={buildSearchResultHref(item)}
                style={linkStyle}
              >
                {item.title}
              </a>
              <span style={badgeStyle}>{item.missingRelation}</span>
              <p style={copyStyle}>{new Date(item.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
