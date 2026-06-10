/**
 * @file Formal document version history page for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { VersionHistoryList } from "../../../../../features/documents/versions/version-history";
import {
  getDocument,
  listDocumentVersions
} from "../../../../../features/documents/api/documents-client";
import {
  heroCardStyle,
  heroEyebrowStyle,
  heroHeadingStyle,
  pageStyle,
  shellStyle
} from "../../../../../features/documents/components/documents-layout.styles";

type DocumentVersionsPageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

/**
 * @param props The Next.js route props containing the document id.
 * @returns The formal document version history shell.
 */
export default async function DocumentVersionsPage(
  props: DocumentVersionsPageProps
) {
  const { documentId } = await props.params;
  const [document, versions] = await Promise.all([
    getDocument(documentId).catch(() => null),
    listDocumentVersions(documentId).catch(() => [])
  ]);

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Phase 2 Versions</p>
          <h1 style={heroHeadingStyle}>
            {document?.title ?? `Document ${documentId}`}
          </h1>
        </section>
        <VersionHistoryList versions={versions} />
      </div>
    </main>
  );
}
