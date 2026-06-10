/**
 * @file Shared search layout styles for Phase 2 evidence-chain lookup.
 * @author PopoY
 * @created 2026-06-10
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f8fafc 0%, #ffffff 52%, #eef6f4 100%)",
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

export const headerStyle: CSSProperties = {
  display: "grid",
  gap: "8px"
};

export const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.18
};

export const copyStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.6,
  maxWidth: "760px"
};

export const panelStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  padding: "18px"
};

export const filterGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  gridTemplateColumns: "minmax(240px, 1.4fr) repeat(2, minmax(180px, 0.7fr)) auto",
  alignItems: "end"
};

export const labelStyle: CSSProperties = {
  display: "grid",
  gap: "7px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700
};

export const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid rgba(148, 163, 184, 0.5)",
  borderRadius: "10px",
  color: "#0f172a",
  backgroundColor: "#ffffff",
  fontSize: "15px",
  padding: "10px 12px"
};

export const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#0f766e",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 700,
  padding: "11px 18px"
};

export const resultsGridStyle: CSSProperties = {
  display: "grid",
  gap: "12px"
};

export const resultHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "start"
};

export const resultTitleStyle: CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: "20px",
  lineHeight: 1.25
};

export const metadataRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px"
};

export const badgeStyle: CSSProperties = {
  borderRadius: "999px",
  backgroundColor: "rgba(15, 118, 110, 0.1)",
  color: "#0f766e",
  fontSize: "12px",
  fontWeight: 700,
  padding: "5px 9px"
};

export const linkButtonStyle: CSSProperties = {
  border: "1px solid rgba(15, 23, 42, 0.14)",
  borderRadius: "999px",
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: 700,
  padding: "8px 12px",
  textDecoration: "none",
  whiteSpace: "nowrap"
};
