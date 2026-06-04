/**
 * @file Markdown preview renderer and sanitizer for Phase 1 documents.
 * @author PopoY
 * @created 2026-06-04
 */

/**
 * @param markdown The P1 document markdown body to preview.
 * @returns Sanitized HTML rendered from the P1 markdown whitelist.
 */
export function renderMarkdownPreviewHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const htmlParts: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    htmlParts.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  };

  const flushCode = () => {
    if (codeLines.length === 0) {
      return;
    }

    htmlParts.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }

      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(renderInlineMarkdown(trimmed.slice(2)));
      continue;
    }

    flushList();

    if (trimmed.startsWith("# ")) {
      htmlParts.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      htmlParts.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      htmlParts.push(`<blockquote>${renderInlineMarkdown(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    htmlParts.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  }

  flushList();

  if (inCodeBlock) {
    flushCode();
  }

  return htmlParts.join("");
}

/**
 * @param value The raw inline markdown text.
 * @returns Sanitized HTML for links and plain text.
 */
function renderInlineMarkdown(value: string) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let rendered = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(value)) !== null) {
    const [raw, label, url] = match;

    rendered += escapeHtml(value.slice(cursor, match.index));
    rendered += renderSafeLink(label ?? "", url ?? "");
    cursor = match.index + raw.length;
  }

  rendered += escapeHtml(value.slice(cursor));
  return rendered;
}

/**
 * @param label The user-visible link label.
 * @param url The raw markdown link target.
 * @returns An anchor for safe HTTP links, or text-only span for unsafe schemes.
 */
function renderSafeLink(label: string, url: string) {
  const normalizedUrl = url.trim();

  if (
    normalizedUrl.startsWith("https://") ||
    normalizedUrl.startsWith("http://") ||
    normalizedUrl.startsWith("/")
  ) {
    return `<a href="${escapeHtml(normalizedUrl)}" rel="noreferrer" target="_blank">${escapeHtml(label)}</a>`;
  }

  return `<span>${escapeHtml(label)}</span>`;
}

/**
 * @param value The raw value that may include HTML-sensitive characters.
 * @returns The escaped text safe to inject into the preview container.
 */
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
