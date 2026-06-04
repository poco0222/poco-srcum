/**
 * @file Client helper for retrieving the current session user summary.
 * @author PopoY
 * @created 2026-06-04
 */

export type CurrentUserSummary = {
  id: string;
  displayName: string;
  team: {
    id: string;
    name: string;
  };
  defaultProject: {
    id: string;
    key: string;
    name: string;
  };
};

/**
 * @param apiBaseUrl The API origin used by the current frontend shell.
 * @param sessionUserId The optional session user identifier forwarded to the API shell.
 * @returns The current user summary, or `null` when the request is unauthenticated.
 */
export async function getCurrentUser(
  apiBaseUrl: string,
  sessionUserId?: string
): Promise<CurrentUserSummary | null> {
  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    headers:
      sessionUserId === undefined
        ? {}
        : {
            "x-session-user": sessionUserId
          },
    cache: "no-store"
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("CURRENT_USER_FETCH_FAILED");
  }

  return (await response.json()) as CurrentUserSummary;
}
