/**
 * @file Shared document layout styles for Phase 2 formal document creation.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f8fafc 0%, #ffffff 48%, #eef6f4 100%)",
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
  borderRadius: "24px",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  background:
    "linear-gradient(135deg, rgba(12, 74, 110, 0.98), rgba(15, 118, 110, 0.94))",
  color: "#f8fafc",
  padding: "28px",
  boxShadow: "0 24px 72px rgba(15, 23, 42, 0.14)"
};

export const heroEyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "12px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(226, 232, 240, 0.86)"
};

export const heroHeadingStyle: CSSProperties = {
  margin: "14px 0 10px",
  fontSize: "40px",
  lineHeight: 1.1
};

export const heroCopyStyle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.7,
  maxWidth: "780px",
  color: "rgba(226, 232, 240, 0.94)"
};

export const twoColumnStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  gridTemplateColumns: "minmax(280px, 0.84fr) minmax(0, 1.56fr)",
  alignItems: "start"
};

export const panelStyle: CSSProperties = {
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  backgroundColor: "rgba(255, 255, 255, 0.96)",
  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
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
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.45)",
  padding: "12px 14px",
  fontSize: "15px",
  color: "#0f172a",
  backgroundColor: "#fff"
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: "240px",
  resize: "vertical"
};

export const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #0369a1, #0f766e)",
  color: "#fff",
  padding: "12px 18px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer"
};

export const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  backgroundColor: "rgba(14, 116, 144, 0.10)",
  color: "#0e7490",
  fontSize: "12px",
  fontWeight: 700,
  padding: "6px 10px"
};

export const mutedTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.6
};

export const actionStateStyle: CSSProperties = {
  borderRadius: "14px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: 1.5
};
