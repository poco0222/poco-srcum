/**
 * @file Shared Sprint layout styles for the Phase 1 board shell.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 34%), linear-gradient(180deg, #f7fbff 0%, #ffffff 48%, #f8fafc 100%)",
  color: "#0f172a",
  fontFamily: "\"Segoe UI\", sans-serif",
  padding: "32px 24px 64px"
};

export const shellStyle: CSSProperties = {
  width: "min(1240px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "24px"
};

export const heroCardStyle: CSSProperties = {
  borderRadius: "28px",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(14, 116, 144, 0.94))",
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
  maxWidth: "780px",
  color: "rgba(226, 232, 240, 0.92)"
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
  backgroundColor: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 14px 36px rgba(15, 23, 42, 0.06)"
};

export const summaryLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.08em"
};

export const summaryValueStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "26px",
  fontWeight: 700
};

export const twoColumnStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  gridTemplateColumns: "minmax(0, 1.7fr) minmax(300px, 0.9fr)",
  alignItems: "start"
};

export const panelStyle: CSSProperties = {
  borderRadius: "24px",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
  padding: "24px"
};

export const stackStyle: CSSProperties = {
  display: "grid",
  gap: "16px"
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

export const subtleCopyStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.6
};

export const boardGridStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  alignItems: "start"
};

export const boardColumnStyle: CSSProperties = {
  borderRadius: "22px",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  padding: "18px",
  display: "grid",
  gap: "14px",
  minHeight: "320px"
};

export const boardColumnHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px"
};

export const boardColumnBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "34px",
  height: "34px",
  padding: "0 10px",
  borderRadius: "999px",
  backgroundColor: "#e2e8f0",
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: 700
};

export const boardCardStyle: CSSProperties = {
  borderRadius: "18px",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(148, 163, 184, 0.20)",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  padding: "16px",
  display: "grid",
  gap: "12px"
};

export const pillRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px"
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
  background: "linear-gradient(135deg, #0284c7, #0f766e)",
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

export const emptyStateStyle: CSSProperties = {
  borderRadius: "16px",
  border: "1px dashed rgba(148, 163, 184, 0.48)",
  padding: "18px",
  color: "#64748b",
  backgroundColor: "rgba(248, 250, 252, 0.72)"
};

export const timelineStyle: CSSProperties = {
  display: "grid",
  gap: "12px"
};

export const timelineCardStyle: CSSProperties = {
  borderRadius: "18px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  padding: "16px",
  backgroundColor: "#fff"
};

export const actionStateStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: 1.5
};
