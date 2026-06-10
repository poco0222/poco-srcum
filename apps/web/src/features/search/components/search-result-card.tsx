/**
 * @file Search result card component for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import React from "react";

import { LinkageObjectType, type LinkageObjectTypeValue } from "@poco-scrum/domain";
import type { SearchResultCard as SearchResultCardModel } from "@poco-scrum/shared";
import {
  badgeStyle,
  copyStyle,
  linkButtonStyle,
  metadataRowStyle,
  panelStyle,
  resultHeaderStyle,
  resultTitleStyle
} from "./search-layout.styles";

type SearchResultCardProps = {
  result: SearchResultCardModel;
};

/**
 * @param input The result object type and identifier.
 * @returns The best available in-app detail href for the result.
 */
export function buildSearchResultHref(input: {
  objectType: LinkageObjectTypeValue;
  objectId: string;
}) {
  if (
    input.objectType === LinkageObjectType.REQUIREMENT_DOCUMENT ||
    input.objectType === LinkageObjectType.DESIGN_DOCUMENT ||
    input.objectType === LinkageObjectType.ACCEPTANCE_RECORD ||
    input.objectType === LinkageObjectType.RETROSPECTIVE_DOCUMENT
  ) {
    return `/documents/${input.objectId}/review`;
  }

  if (input.objectType === LinkageObjectType.STORY) {
    return `/backlog/${input.objectId}`;
  }

  if (input.objectType === LinkageObjectType.SPRINT) {
    return `/sprints/${input.objectId}`;
  }

  return `/search?keyword=${encodeURIComponent(input.objectId)}`;
}

/**
 * @param result The search result card payload from the API.
 * @returns A scannable search result card with relation and review metadata.
 */
export function SearchResultCard({ result }: SearchResultCardProps) {
  const href = buildSearchResultHref({
    objectType: result.objectType,
    objectId: result.objectId
  });

  return (
    <article style={panelStyle}>
      <div style={resultHeaderStyle}>
        <div>
          <h2 style={resultTitleStyle}>{result.title}</h2>
          <p style={copyStyle}>{result.snippet}</p>
        </div>
        <a href={href} style={linkButtonStyle}>
          Open
        </a>
      </div>
      <div style={metadataRowStyle}>
        <span style={badgeStyle}>{result.objectType}</span>
        <span style={badgeStyle}>{result.reviewStatus ?? "no-review"}</span>
        <span style={badgeStyle}>{new Date(result.updatedAt).toLocaleString()}</span>
      </div>
      {result.relationSummary.length > 0 ? (
        <div style={metadataRowStyle}>
          {result.relationSummary.map((summary) => (
            <span key={summary} style={badgeStyle}>
              {summary}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
