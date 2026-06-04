/**
 * @file Acceptance record types for the Phase 1 formal Story approval gate.
 * @author PopoY
 * @created 2026-06-04
 */
import type { AcceptanceStatusValue } from "./acceptance.enums";

export type StoryAcceptanceRecord = {
  id: string;
  storyId: string;
  status: AcceptanceStatusValue;
  actorId: string;
  reason: string | null;
  operatedAt: string;
  createdAt: string;
};
