"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

// =============================================================================
// MetadataJsonViewer -- Terminal-styled JSON code block with copy button
// =============================================================================

interface MetadataJsonViewerProps {
  data: Record<string, unknown>;
}

export function MetadataJsonViewer({ data }: MetadataJsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          metadata.json
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition-colors duration-200"
          aria-label="Copy JSON to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* JSON content */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}
