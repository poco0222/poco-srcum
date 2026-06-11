/**
 * @file Shared project catalog contracts for Portfolio read models.
 * @author PopoY
 * @created 2026-06-11
 */
import type { ProjectStatusValue } from "./project.enums";

export type ProjectCatalogRecord = {
  id: string;
  key: string;
  name: string;
  teamId: string;
  status: ProjectStatusValue;
  portfolioId: string | null;
  portfolioName: string | null;
};
