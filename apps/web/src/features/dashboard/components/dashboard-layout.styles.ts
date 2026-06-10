/**
 * @file Shared dashboard layout styles for Phase 2 document collaboration status.
 * @author PopoY
 * @created 2026-06-10
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f8fafc 0%, #ffffff 54%, #eef6f4 100%)",
  color: "#0f172a",
  fontFamily: "\"Segoe UI\", sans-serif",
  padding: "32px 24px 64px"
};

export const shellStyle: CSSProperties = {
  width: "min(1180px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "20px"
};

export const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.18
};

export const copyStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.6
};

export const metricsGridStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
};

export const contentGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)"
};

export const cardStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  padding: "18px"
};

export const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "18px",
  lineHeight: 1.25
};

export const metricValueStyle: CSSProperties = {
  margin: "10px 0 8px",
  fontSize: "30px",
  fontWeight: 800
};

export const linkStyle: CSSProperties = {
  color: "#0f766e",
  fontSize: "14px",
  fontWeight: 700,
  textDecoration: "none"
};

export const itemListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  listStyle: "none",
  margin: "14px 0 0",
  padding: 0
};

export const itemStyle: CSSProperties = {
  borderTop: "1px solid rgba(148, 163, 184, 0.2)",
  display: "grid",
  gap: "4px",
  paddingTop: "10px"
};

export const badgeStyle: CSSProperties = {
  borderRadius: "999px",
  backgroundColor: "rgba(15, 118, 110, 0.1)",
  color: "#0f766e",
  display: "inline-flex",
  fontSize: "12px",
  fontWeight: 700,
  padding: "5px 9px",
  width: "fit-content"
};
