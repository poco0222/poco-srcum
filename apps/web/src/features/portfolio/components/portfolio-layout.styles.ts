/**
 * @file Portfolio layout styles for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  color: "#0f172a",
  fontFamily: "\"Segoe UI\", sans-serif",
  padding: "32px 24px 64px"
};

export const shellStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  margin: "0 auto",
  width: "min(1180px, 100%)"
};

export const headerStyle: CSSProperties = {
  display: "grid",
  gap: "6px"
};

export const headingStyle: CSSProperties = {
  fontSize: "32px",
  lineHeight: 1.2,
  margin: 0,
  textWrap: "balance"
};

export const copyStyle: CSSProperties = {
  color: "#475569",
  lineHeight: 1.6,
  margin: 0
};

export const panelStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  padding: "16px"
};

export const filterGridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  alignItems: "end"
};

export const labelStyle: CSSProperties = {
  color: "#334155",
  display: "grid",
  fontSize: "13px",
  fontWeight: 700,
  gap: "6px"
};

export const inputStyle: CSSProperties = {
  border: "1px solid rgba(100, 116, 139, 0.36)",
  borderRadius: "8px",
  color: "#0f172a",
  font: "inherit",
  minHeight: "40px",
  padding: "8px 10px"
};

export const primaryButtonStyle: CSSProperties = {
  backgroundColor: "#0f766e",
  border: "1px solid #0f766e",
  borderRadius: "8px",
  color: "#ffffff",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 700,
  minHeight: "40px",
  padding: "8px 12px"
};

export const overviewGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
};

export const cardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  display: "grid",
  gap: "10px",
  padding: "16px"
};

export const cardTitleStyle: CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.3,
  margin: 0
};

export const metricRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px"
};

export const metricPillStyle: CSSProperties = {
  backgroundColor: "rgba(15, 118, 110, 0.1)",
  borderRadius: "999px",
  color: "#0f766e",
  fontSize: "12px",
  fontWeight: 700,
  padding: "5px 9px"
};

export const timelineStyle: CSSProperties = {
  display: "grid",
  gap: "10px"
};

export const timelineItemStyle: CSSProperties = {
  ...cardStyle,
  gridTemplateColumns: "minmax(0, 1fr)"
};

export const stateStyle: CSSProperties = {
  ...panelStyle,
  color: "#334155",
  lineHeight: 1.6
};
