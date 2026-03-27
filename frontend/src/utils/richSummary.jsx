import React from 'react';

/**
 * Renders inline text with **bold** converted to <strong>.
 * @param {string} text
 * @param {string} keyPrefix
 * @returns {React.ReactNode}
 */
export function renderInlineBold(text, keyPrefix = '') {
  if (!text || typeof text !== 'string') return null;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">{part}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

/**
 * Parses tour summary with optional Markdown-like formatting:
 * - **text** → bold
 * - Lines starting with "- " or "* " or "• " → bullet list
 * Returns an array of React nodes (paragraphs and ul/li).
 * @param {string} summary
 * @param {object} classNames - optional { paragraph, list, listItem }
 * @returns {React.ReactNode[]}
 */
export function parseSummaryToNodes(summary, classNames = {}) {
  if (!summary || typeof summary !== 'string') return [];
  const {
    paragraph = '',
    list = 'list-disc list-inside space-y-1 my-2',
    listItem = 'pl-1',
  } = classNames;

  const lines = summary.split(/\n/).map((l) => l.trimEnd());
  const nodes = [];
  let listItems = [];
  let keyIndex = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`summary-${keyIndex++}`} className={list}>
          {listItems.map((item, i) => (
            <li key={i} className={listItem}>
              {item}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^[\-\*•]\s+(.*)$/);
    if (bulletMatch) {
      listItems.push(renderInlineBold(bulletMatch[1].trim(), `li-${keyIndex}-${i}`));
    } else {
      flushList();

      if (line.trim().length > 0) {
        // Simple heuristic for heading matching
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

        // Exact textual matches for known sections
        const trimmed = line.trim();
        const isOverview = trimmed.toLowerCase() === "overview";
        const isAbout = trimmed.toLowerCase() === "about the experience" || trimmed.toLowerCase() === "about";
        const isHighlights = trimmed.toLowerCase() === "highlights";

        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = headingMatch[2].trim();
          const Tag = `h${level}`;
          nodes.push(
            <Tag key={`summary-${keyIndex++}`} className={`font-bold text-white mt-6 mb-2 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}>
              {content}
            </Tag>
          );
        } else if (isOverview || isAbout || isHighlights) {
          nodes.push(
            <h3 key={`summary-${keyIndex++}`} className="flex items-center gap-2 text-2xl font-bold text-white mt-8 mb-4">
              {isOverview && (
                <span className="p-1.5 rounded-lg bg-[#F5B400]/20 text-[#F5B400]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
              )}
              {isAbout && (
                <span className="p-1.5 rounded-lg bg-[#F5B400]/20 text-[#F5B400]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
              )}
              {isHighlights && (
                <span className="p-1.5 rounded-lg bg-[#F5B400]/20 text-[#F5B400]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </span>
              )}
              {line}
            </h3>
          );
        } else {
          nodes.push(
            <p key={`summary-${keyIndex++}`} className={paragraph}>
              {renderInlineBold(line)}
            </p>
          );
        }
      } else {
        // preserve empty lines as spacers
        nodes.push(<div key={`summary-${keyIndex++}`} className="h-4" aria-hidden="true" />);
      }
    }
  }

  flushList();
  return nodes;
}

/**
 * Strip ** and bullet markers for plain-text preview (e.g. cards).
 * @param {string} summary
 * @returns {string}
 */
export function stripSummaryFormatting(summary) {
  if (!summary || typeof summary !== 'string') return '';
  return summary
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^[\-\*•]\s+/gm, '• ')
    .trim();
}
