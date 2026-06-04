/**
 * @file Shared backlog layout styles for the Phase 1 backlog frontend task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(249, 115, 22, 0.14), transparent 36%), linear-gradient(180deg, #fffaf5 0%, #fff 52%, #f8fafc 100%)",
  color: "#0f172a",
  fontFamily: "\"Segoe UI\", sans-serif",
  padding: "32px 24px 64px"
};

export const shellStyle: CSSProperties = {
  width: "min(1180px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "24px"
};

export const heroCardStyle: CSSProperties = {
  borderRadius: "28px",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 118, 110, 0.94))",
  color: "#f8fafc",
  padding: "28px",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.16)"
};

export const heroEyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "12px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(226, 232, 240, 0.84)"
};

export const heroHeadingStyle: CSSProperties = {
  margin: "16px 0 12px",
  fontSize: "42px",
  lineHeight: 1.08
};

export const heroCopyStyle: CSSProperties = {
  margin: 0,
  fontSize: "17px",
  lineHeight: 1.7,
  maxWidth: "760px",
  color: "rgba(226, 232, 240, 0.92)"
};

export const twoColumnStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  gridTemplateColumns: "minmax(0, 1.6fr) minmax(300px, 0.9fr)",
  alignItems: "start"
};

export const panelStyle: CSSProperties = {
  borderRadius: "24px",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
  padding: "24px"
};

export const sectionHeadingStyle: CSSProperties = {
  margin: 0,
  fontSize: "24px",
  lineHeight: 1.2
};

export const sectionCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#475569",
  lineHeight: 1.6
};

export const stackStyle: CSSProperties = {
  display: "grid",
  gap: "16px"
};

export const formGridStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
};

export const fullSpanStyle: CSSProperties = {
  gridColumn: "1 / -1"
};

export const labelStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  fontSize: "14px",
  color: "#334155",
  fontWeight: 600
};

export const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.45)",
  padding: "12px 14px",
  fontSize: "15px",
  color: "#0f172a",
  backgroundColor: "#fff"
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: "132px",
  resize: "vertical"
};

export const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #ea580c, #0f766e)",
  color: "#fff",
  padding: "12px 18px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer"
};

export const secondaryButtonStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(15, 23, 42, 0.14)",
  backgroundColor: "#fff",
  color: "#0f172a",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer"
};

export const itemCardStyle: CSSProperties = {
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.20)",
  padding: "20px",
  backgroundColor: "#fff",
  display: "grid",
  gap: "12px"
};

export const pillRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px"
};

export const itemLinkStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: 1.3,
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700
};

export const subtleCopyStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.6
};

export const badgeBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.02em"
};

export const summaryGridStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
};

export const summaryCardStyle: CSSProperties = {
  borderRadius: "18px",
  padding: "18px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "rgba(248, 250, 252, 0.86)"
};

export const summaryValueStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "26px",
  fontWeight: 700
};

export const summaryLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.08em"
};

export const actionStateStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: 1.5
};
