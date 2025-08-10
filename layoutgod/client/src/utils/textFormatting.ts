/**
 * Utility functions for text formatting and basic markdown rendering
 */

interface TextSegment {
  text: string;
  isBold: boolean;
}

/**
 * Parse text with **bold** markdown and return segments
 */
export const parseMarkdownText = (text: string): TextSegment[] => {
  if (!text) return [];
  
  const segments: TextSegment[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text - remove the ** markers
      const boldText = part.slice(2, -2);
      segments.push({ text: boldText, isBold: true });
    } else if (part.length > 0) {
      // Regular text
      segments.push({ text: part, isBold: false });
    }
  }
  
  return segments;
};

/**
 * Convert markdown text to HTML string with bold formatting
 */
export const renderFormattedText = (text: string): string => {
  if (!text) return '';
  
  const segments = parseMarkdownText(text);
  
  return segments.map(segment => {
    if (segment.isBold) {
      return `<strong class="font-semibold">${escapeHtml(segment.text)}</strong>`;
    } else {
      return escapeHtml(segment.text);
    }
  }).join('');
};

/**
 * Escape HTML characters to prevent XSS
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Remove markdown formatting from text
 */
export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
};
