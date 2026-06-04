/**
 * @file Next.js dashboard placeholder page for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(135deg, rgba(14, 116, 144, 0.10), rgba(249, 115, 22, 0.08))",
  color: "#0f172a",
  fontFamily: "\"Segoe UI\", sans-serif",
  padding: "32px"
};

const cardStyle: CSSProperties = {
  width: "min(100%, 720px)",
  borderRadius: "24px",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.10)",
  padding: "40px"
};

const eyebrowStyle: CSSProperties = {
  fontSize: "14px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#0f766e",
  margin: 0
};

const headingStyle: CSSProperties = {
  fontSize: "40px",
  lineHeight: 1.1,
  margin: "16px 0"
};

const copyStyle: CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.7,
  margin: 0,
  color: "#334155"
};

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Phase 1 Bootstrap</p>
        <h1 style={headingStyle}>POCO Scrum Platform</h1>
        <p style={copyStyle}>
          The Scrum workspace shell is ready for backlog, sprint, and acceptance
          flows.
        </p>
      </section>
    </main>
  );
}
