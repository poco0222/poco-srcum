/**
 * @file Attachment preview component for Phase 1 document delivery evidence.
 * @author PopoY
 * @created 2026-06-04
 */
import type { CSSProperties } from "react";

export type AttachmentPreviewKind = "image" | "pdf" | "download";

type AttachmentPreviewProps = {
  fileName: string;
  mimeType: string;
  url: string;
};

const frameStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: "8px",
  display: "grid",
  gap: "10px",
  padding: "12px"
};

/**
 * @param mimeType The attachment MIME type.
 * @returns The P1 preview kind allowed by the attachment whitelist.
 */
export function getAttachmentPreviewKind(mimeType: string): AttachmentPreviewKind {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "download";
}

/**
 * @param fileName The user-visible attachment name.
 * @param mimeType The attachment MIME type.
 * @param url The metadata URL for the attachment.
 * @returns A basic inline preview for image/PDF files or a download link fallback.
 */
export function AttachmentPreview({
  fileName,
  mimeType,
  url
}: AttachmentPreviewProps) {
  const previewKind = getAttachmentPreviewKind(mimeType);

  if (previewKind === "image") {
    return (
      <figure style={frameStyle}>
        <img alt={fileName} src={url} style={{ maxWidth: "100%" }} />
        <figcaption>{fileName}</figcaption>
      </figure>
    );
  }

  if (previewKind === "pdf") {
    return (
      <iframe
        src={url}
        style={{
          ...frameStyle,
          height: "420px",
          width: "100%"
        }}
        title={fileName}
      />
    );
  }

  return (
    <a href={url} rel="noreferrer" target="_blank">
      {fileName}
    </a>
  );
}
