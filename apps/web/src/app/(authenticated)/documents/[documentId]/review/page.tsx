/**
 * @file Formal document review page for Phase 2 Task 2.
 * @author PopoY
 * @created 2026-06-10
 */
import { DocumentCommentPanel } from "../../../../../features/documents/review/comments/comment-panel";
import { DocumentReviewPanel } from "../../../../../features/documents/review/review-panel";
import { VersionHistoryList } from "../../../../../features/documents/versions/version-history";
import {
  getDocument,
  getDocumentReview,
  listDocumentVersions
} from "../../../../../features/documents/api/documents-client";
import {
  heroCardStyle,
  heroEyebrowStyle,
  heroHeadingStyle,
  pageStyle,
  shellStyle,
  stackStyle
} from "../../../../../features/documents/components/documents-layout.styles";

type DocumentReviewPageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

/**
 * @param props The Next.js route props containing the document id.
 * @returns The formal document review shell.
 */
export default async function DocumentReviewPage(props: DocumentReviewPageProps) {
  const { documentId } = await props.params;
  const [document, review, versions] = await Promise.all([
    getDocument(documentId).catch(() => null),
    getDocumentReview(documentId).catch(() => null),
    listDocumentVersions(documentId).catch(() => [])
  ]);
  const latestVersionId = versions.at(-1)?.id ?? null;

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Phase 2 Review</p>
          <h1 style={heroHeadingStyle}>
            {document?.title ?? `Document ${documentId}`}
          </h1>
        </section>
        <div style={stackStyle}>
          {review ? (
            <DocumentReviewPanel
              latestVersionId={latestVersionId}
              review={review}
            />
          ) : null}
          <DocumentCommentPanel comments={[]} />
          <VersionHistoryList versions={versions} />
        </div>
      </div>
    </main>
  );
}
