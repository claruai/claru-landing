"use client";

import type { DataPanelProps } from "./DataPanelRegistry";

// =============================================================================
// AnnotationPanelWrapper -- Renders annotation data as syntax-highlighted JSON
//
// Adapts DataPanelProps for the annotation panel. Displays the annotation data
// in a formatted, syntax-highlighted JSON viewer matching the terminal aesthetic.
// =============================================================================

// ---------------------------------------------------------------------------
// JSON Syntax Highlighter -- green keys on dark background
// ---------------------------------------------------------------------------

function highlightJson(jsonStr: string): React.ReactNode[] {
  const lines = jsonStr.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    const remaining = line;
    let partIdx = 0;

    const keyRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = keyRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`${lineIdx}-pre-${partIdx}`} className="text-[var(--text-secondary)]">
            {remaining.slice(lastIndex, match.index)}
          </span>
        );
        partIdx++;
      }

      parts.push(
        <span key={`${lineIdx}-key-${partIdx}`} className="text-[var(--accent-primary)]">
          {match[1]}
        </span>
      );
      partIdx++;

      parts.push(
        <span key={`${lineIdx}-colon-${partIdx}`} className="text-[var(--text-muted)]">
          :
        </span>
      );
      partIdx++;

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
      const rest = remaining.slice(lastIndex);
      const valueParts = rest.split(/("(?:[^"\\]|\\.)*")/g);
      for (const vp of valueParts) {
        if (vp.startsWith('"') && vp.endsWith('"')) {
          parts.push(
            <span key={`${lineIdx}-val-${partIdx}`} className="text-[var(--text-secondary)]">
              {vp}
            </span>
          );
        } else {
          parts.push(
            <span key={`${lineIdx}-other-${partIdx}`} className="text-[var(--text-tertiary)]">
              {vp}
            </span>
          );
        }
        partIdx++;
      }
    }

    return (
      <span key={lineIdx}>
        {parts.length > 0 ? parts : <span className="text-[var(--text-secondary)]">{line}</span>}
        {lineIdx < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnnotationPanelWrapper({ data }: DataPanelProps) {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
      <code>{highlightJson(jsonString)}</code>
    </pre>
  );
}
