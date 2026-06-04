/**
 * @file Formal document creation page server actions for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
"use server";

import { revalidatePath } from "next/cache";

import { createFormalDocument } from "../../../../features/documents/api/documents-client";
import type { DocumentActionState } from "../../../../features/documents/lib/document-action-state";
import { buildCreateFormalDocumentInput } from "../../../../features/documents/lib/document-form.utils";

/**
 * Create a formal document through the API and refresh the creation shell.
 */
export async function createFormalDocumentAction(
  _state: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  try {
    const payload = buildCreateFormalDocumentInput(formData);
    const document = await createFormalDocument(payload);

    revalidatePath("/documents/new");
    revalidatePath(`/documents/${document.id}`);

    return {
      status: "success",
      message: `Formal document ${document.id} created successfully.`
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "DOCUMENT_CREATE_FAILED"
    };
  }
}
