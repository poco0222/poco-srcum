/**
 * @file Document API client for Phase 2 formal document creation.
 * @author PopoY
 * @created 2026-06-04
 */
import type {
  DocumentFieldRequirementValue,
  DocumentRecord,
  DocumentReviewRecord,
  DocumentVersionRecord,
  DocumentTypeValue
} from "@poco-scrum/domain";
import type { CreateFormalDocumentInput } from "@poco-scrum/shared";

export type DocumentTemplateOption = {
  id: string;
  documentType: DocumentTypeValue;
  name: string;
  description: string;
  structuredFields: Record<string, DocumentFieldRequirementValue>;
  requiredFieldKeys: string[];
  markdown: string;
  isDefault: boolean;
  createdById: string;
};

/**
 * Resolve the API origin used by document pages without coupling components to environment variables.
 */
export function getDocumentsApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.POCO_API_BASE_URL ??
    "http://127.0.0.1:3001"
  );
}

/**
 * Keep the formal document shell aligned with the existing demo session fixture.
 */
export function getDocumentDemoSessionUserId() {
  return process.env.POCO_DEMO_SESSION_USER ?? "user-1";
}

async function requestJson<TValue>(path: string, init?: RequestInit) {
  const response = await fetch(`${getDocumentsApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(payload?.message ?? "DOCUMENT_API_REQUEST_FAILED");
  }

  return (await response.json()) as TValue;
}

/**
 * @returns Default formal document templates exposed by the API.
 */
export function listDocumentTemplates() {
  return requestJson<DocumentTemplateOption[]>("/document-templates");
}

/**
 * @param payload The validated formal document creation payload.
 * @returns The created document record.
 */
export function createFormalDocument(payload: CreateFormalDocumentInput) {
  return requestJson<DocumentRecord>("/documents/formal", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param documentId The formal document identifier.
 * @returns The stored document record.
 */
export function getDocument(documentId: string) {
  return requestJson<DocumentRecord>(`/documents/${documentId}`);
}

/**
 * @param documentId The formal document identifier.
 * @returns The current review state for the document.
 */
export function getDocumentReview(documentId: string) {
  return requestJson<DocumentReviewRecord>(`/documents/${documentId}/review`);
}

/**
 * @param documentId The formal document identifier.
 * @returns Version snapshots for the document.
 */
export function listDocumentVersions(documentId: string) {
  return requestJson<DocumentVersionRecord[]>(
    `/documents/${documentId}/versions`
  );
}
