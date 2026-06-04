/**
 * @file Shared DTO and validation schema for project membership access checks.
 * @author PopoY
 * @created 2026-06-04
 */
export type AssertProjectMembershipInput = {
  currentUserId: string;
  projectId: string;
};

type Schema<TValue> = {
  parse: (input: unknown) => TValue;
};

/**
 * @description Validates the minimum project membership access payload shared across the API layer.
 */
export const AssertProjectMembershipInputSchema: Schema<AssertProjectMembershipInput> =
  {
    parse(input) {
      if (typeof input !== "object" || input === null) {
        throw new TypeError("PROJECT_MEMBERSHIP_INPUT_INVALID");
      }

      const candidate = input as Partial<AssertProjectMembershipInput>;

      if (
        typeof candidate.currentUserId !== "string" ||
        candidate.currentUserId.length === 0 ||
        typeof candidate.projectId !== "string" ||
        candidate.projectId.length === 0
      ) {
        throw new TypeError("PROJECT_MEMBERSHIP_INPUT_INVALID");
      }

      return {
        currentUserId: candidate.currentUserId,
        projectId: candidate.projectId
      };
    }
  };
