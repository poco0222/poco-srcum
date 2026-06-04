/**
 * @file Formal document creation page for Phase 2 Task 1.
 * @author PopoY
 * @created 2026-06-04
 */
import { DocumentTargetType } from "@poco-scrum/domain";
import { DocumentForm } from "../../../../features/documents/components/document-form";
import {
  heroCardStyle,
  heroEyebrowStyle,
  heroHeadingStyle,
  mutedTextStyle,
  pageStyle,
  panelStyle,
  sectionHeadingStyle,
  shellStyle,
  stackStyle,
  twoColumnStyle
} from "../../../../features/documents/components/documents-layout.styles";
import {
  getDocumentDemoSessionUserId,
  listDocumentTemplates
} from "../../../../features/documents/api/documents-client";
import { createFormalDocumentAction } from "./actions";

/**
 * @returns The Phase 2 formal document creation entry.
 */
export default async function NewDocumentPage() {
  const templates = await listDocumentTemplates().catch(() => []);
  const authorId = getDocumentDemoSessionUserId();

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroCardStyle}>
          <p style={heroEyebrowStyle}>Phase 2</p>
          <h1 style={heroHeadingStyle}>Formal Document</h1>
        </section>
        <section style={twoColumnStyle}>
          <article style={panelStyle}>
            <h2 style={sectionHeadingStyle}>Workspace</h2>
            <div style={stackStyle}>
              <p style={mutedTextStyle}>Author: {authorId}</p>
              <p style={mutedTextStyle}>Default target: Story / story-1</p>
              <p style={mutedTextStyle}>
                Available templates: {templates.length}
              </p>
            </div>
          </article>
          <article style={panelStyle}>
            <h2 style={sectionHeadingStyle}>Create From Template</h2>
            <DocumentForm
              action={createFormalDocumentAction}
              defaultAuthorId={authorId}
              defaultTargetId="story-1"
              defaultTargetType={DocumentTargetType.STORY}
              templates={templates}
            />
          </article>
        </section>
      </div>
    </main>
  );
}
