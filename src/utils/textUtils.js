/**
 * Utility functions for text cleaning and HTML processing.
 */

/**
 * Strips HTML tags and decodes common and unicode HTML entities.
 * Safely handles &nbsp;, &#160;, \u00a0, &amp;, &quot;, &#39;, &lt;, &gt;, &hellip;, etc.
 *
 * @param {string} html - Raw HTML or text string
 * @returns {string} Plain text with decoded entities and collapsed whitespace
 */
export function stripHtml(html) {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);

  let text = '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      text = doc.body.textContent || '';
    } catch {
      text = html.replace(/<[^>]+>/g, ' ');
    }
  } else {
    text = html.replace(/<[^>]+>/g, ' ');
  }

  // Handle any remaining or double-encoded entities and normalize whitespace
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&hellip;/gi, '...')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text cleanly without cutting in the middle of words when possible.
 *
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated text with ellipsis if shortened
 */
export function truncateText(text, maxLength = 190) {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  let truncated = trimmed.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.75) {
    truncated = truncated.slice(0, lastSpace);
  }

  return truncated.replace(/[,.;:!?\- ]+$/, '') + '...';
}

/**
 * Extracts a clean plain-text excerpt from HTML content.
 *
 * @param {string} html - Raw HTML content
 * @param {number} maxLength - Maximum character length
 * @param {string} fallback - Fallback text if excerpt is empty
 * @returns {string}
 */
export function getExcerpt(html, maxLength = 190, fallback = '') {
  const plain = stripHtml(html);
  if (!plain) return fallback;
  return truncateText(plain, maxLength);
}

/**
 * Formats content for rich HTML display:
 * - If string already contains HTML tags, returns as is.
 * - If plain text with newlines, wraps paragraphs with <p> and <br />.
 *
 * @param {string} content
 * @returns {string}
 */
export function formatHtmlContent(content) {
  if (!content) return '';
  const trimmed = content.trim();
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n\s*\n/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}
