/**
 * @file Portfolio signal badge component for Phase 3 Task 1.
 * @author PopoY
 * @created 2026-06-11
 */
import type { CSSProperties } from "react";
import React from "react";

import type {
  PortfolioSignalIndicator,
  PortfolioSignalSeverityValue,
  PortfolioSignalSnapshot
} from "@poco-scrum/domain";
import { metricRowStyle } from "./portfolio-layout.styles";

type RiskBadgesProps = {
  signals: PortfolioSignalSnapshot;
};

const severityStyles: Record<PortfolioSignalSeverityValue, CSSProperties> = {
  NONE: {
    backgroundColor: "rgba(148, 163, 184, 0.16)",
    color: "#334155"
  },
  LOW: {
    backgroundColor: "rgba(20, 184, 166, 0.14)",
    color: "#0f766e"
  },
  MEDIUM: {
    backgroundColor: "rgba(245, 158, 11, 0.16)",
    color: "#92400e"
  },
  HIGH: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    color: "#c2410c"
  },
  CRITICAL: {
    backgroundColor: "rgba(239, 68, 68, 0.16)",
    color: "#b91c1c"
  }
};

const badgeBaseStyle: CSSProperties = {
  borderRadius: "999px",
  display: "inline-flex",
  fontSize: "12px",
  fontWeight: 700,
  padding: "5px 9px"
};

/**
 * @param props The Task2-sourced signal snapshot to render.
 * @returns Read-only risk, dependency, and delay badges.
 */
export function RiskBadges({ signals }: RiskBadgesProps) {
  return (
    <div aria-label={`Signals from ${signals.source}`} style={metricRowStyle}>
      <SignalBadge label="Risk" signal={signals.risk} />
      <SignalBadge label="Dependency" signal={signals.dependency} />
      <SignalBadge label="Delay" signal={signals.delay} />
      <span style={{ ...badgeBaseStyle, ...severityStyles.NONE }}>
        Source: {signals.source}
      </span>
    </div>
  );
}

/**
 * @param props The signal indicator and display label.
 * @returns A single read-only signal badge.
 */
function SignalBadge({
  label,
  signal
}: {
  label: string;
  signal: PortfolioSignalIndicator;
}) {
  return (
    <span style={{ ...badgeBaseStyle, ...severityStyles[signal.severity] }}>
      {label}: {signal.label} ({signal.count})
    </span>
  );
}
