/**
 * @file Markdown preview renderer and sanitizer for Phase 1 documents.
 * @author PopoY
 * @created 2026-06-04
 */

export const DocumentPreviewWhitelist = [
  "heading",
  "list",
  "blockquote",
  "table",
  "codeBlock",
  "taskList",
  "image",
  "internalLink"
] as const;

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
  let tableRows: string[][] = [];

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

  const flushTable = () => {
    if (tableRows.length < 2) {
      tableRows = [];
      return;
    }

    const [header, separator, ...bodyRows] = tableRows;
    const isSeparator = separator?.every((cell) => /^-+$/.test(cell));

    if (!header || !isSeparator || bodyRows.length === 0) {
      tableRows = [];
      return;
    }

    const headHtml = header
      .map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`)
      .join("");
    const bodyHtml = bodyRows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join("")}</tr>`
      )
      .join("");

    htmlParts.push(
      `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`
    );
    tableRows = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushList();
        flushTable();
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
      flushTable();
      continue;
    }

    if (isTableRow(trimmed)) {
      flushList();
      tableRows.push(parseTableRow(trimmed));
      continue;
    }

    if (trimmed.startsWith("- [x] ") || trimmed.startsWith("- [ ] ")) {
      flushTable();
      listItems.push(renderTaskListItem(trimmed));
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushTable();
      listItems.push(renderInlineMarkdown(trimmed.slice(2)));
      continue;
    }

    flushList();
    flushTable();

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
  flushTable();

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
  const tokenPattern = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)/g;
  let rendered = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(value)) !== null) {
    const [raw, imageAlt, imageUrl, linkLabel, linkUrl] = match;

    rendered += escapeHtml(value.slice(cursor, match.index));
    rendered += imageUrl
      ? renderSafeImage(imageAlt ?? "", imageUrl)
      : renderSafeLink(linkLabel ?? "", linkUrl ?? "");
    cursor = match.index + raw.length;
  }

  rendered += escapeHtml(value.slice(cursor));
  return rendered;
}

/**
 * @param line The candidate table row line.
 * @returns Whether the line uses the simple pipe table syntax.
 */
function isTableRow(line: string) {
  return line.startsWith("|") && line.endsWith("|");
}

/**
 * @param line The raw pipe table row.
 * @returns Trimmed cells without outer table pipes.
 */
function parseTableRow(line: string) {
  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

/**
 * @param line The task list markdown line.
 * @returns Rendered checkbox list item content.
 */
function renderTaskListItem(line: string) {
  const checked = line.startsWith("- [x] ");
  const label = line.slice(6);

  return `<input type="checkbox"${checked ? " checked" : ""} disabled /> ${renderInlineMarkdown(label)}`;
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
 * @param alt The user-visible image alternative text.
 * @param url The raw markdown image target.
 * @returns An image for safe internal paths, or escaped alt text for unsafe URLs.
 */
function renderSafeImage(alt: string, url: string) {
  const normalizedUrl = url.trim();

  if (normalizedUrl.startsWith("/")) {
    return `<img src="${escapeHtml(normalizedUrl)}" alt="${escapeHtml(alt)}" />`;
  }

  return escapeHtml(alt);
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
