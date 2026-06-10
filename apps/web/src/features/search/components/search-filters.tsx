/**
 * @file Search filters component for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import React from "react";

import {
  DocumentReviewStatus,
  LinkageObjectType,
  type DocumentReviewStatusValue,
  type LinkageObjectTypeValue
} from "@poco-scrum/domain";
import {
  filterGridStyle,
  inputStyle,
  labelStyle,
  panelStyle,
  primaryButtonStyle
} from "./search-layout.styles";

type SearchFiltersProps = {
  keyword: string;
  objectType?: LinkageObjectTypeValue;
  reviewStatus?: DocumentReviewStatusValue;
};

const objectTypeOptions = Object.values(LinkageObjectType);
const reviewStatusOptions = Object.values(DocumentReviewStatus);

/**
 * @param props The selected search filters.
 * @returns A GET form that keeps search URL-driven and shareable.
 */
export function SearchFilters({
  keyword,
  objectType,
  reviewStatus
}: SearchFiltersProps) {
  return (
    <form method="get" style={panelStyle}>
      <div style={filterGridStyle}>
        <label style={labelStyle}>
          Keyword
          <input
            defaultValue={keyword}
            name="keyword"
            placeholder="Search title, fields, or Markdown"
            style={inputStyle}
            type="search"
          />
        </label>
        <label style={labelStyle}>
          Object type
          <select defaultValue={objectType ?? ""} name="objectType" style={inputStyle}>
            <option value="">All objects</option>
            {objectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Review status
          <select
            defaultValue={reviewStatus ?? ""}
            name="reviewStatus"
            style={inputStyle}
          >
            <option value="">Any status</option>
            {reviewStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button style={primaryButtonStyle} type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
