"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, ChevronRight, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JsonTreeProps {
  data: Record<string, unknown>;
  title?: string;
}

/** Internal representation of a node in the JSON tree. */
interface TreeNode {
  key: string;
  value: unknown;
  path: string;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  childCount?: number;
  children?: TreeNode[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function classify(
  value: unknown
): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

/** Recursively build a tree of nodes from an arbitrary value. */
function buildTree(key: string, value: unknown, parentPath: string): TreeNode {
  const path = parentPath ? `${parentPath}.${key}` : key;
  const type = classify(value);

  if (type === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    return {
      key,
      value,
      path,
      type: "object",
      childCount: entries.length,
      children: entries.map(([k, v]) => buildTree(k, v, path)),
    };
  }

  if (type === "array") {
    const arr = value as unknown[];
    return {
      key,
      value,
      path,
      type: "array",
      childCount: arr.length,
      children: arr.map((item, i) => buildTree(String(i), item, path)),
    };
  }

  return { key, value, path, type };
}

/**
 * Collect all ancestor paths that must be expanded so that every node whose
 * key or primitive value matches `query` is visible.
 */
function collectMatchPaths(
  node: TreeNode,
  query: string
): { matchedPaths: Set<string>; expandPaths: Set<string> } {
  const matchedPaths = new Set<string>();
  const expandPaths = new Set<string>();

  function walk(n: TreeNode, ancestors: string[]): boolean {
    const keyMatch = n.key.toLowerCase().includes(query);
    let valueMatch = false;

    if (
      n.type === "string" ||
      n.type === "number" ||
      n.type === "boolean" ||
      n.type === "null"
    ) {
      const strVal = String(n.value ?? "null").toLowerCase();
      valueMatch = strVal.includes(query);
    }

    let childMatched = false;
    if (n.children) {
      for (const child of n.children) {
        if (walk(child, [...ancestors, n.path])) {
          childMatched = true;
        }
      }
    }

    const isMatch = keyMatch || valueMatch || childMatched;

    if (isMatch) {
      if (keyMatch || valueMatch) {
        matchedPaths.add(n.path);
      }
      // Expand all ancestors so the match is visible
      for (const a of ancestors) {
        expandPaths.add(a);
      }
      if (childMatched) {
        expandPaths.add(n.path);
      }
    }

    return isMatch;
  }

  walk(node, []);
  return { matchedPaths, expandPaths };
}

/** Highlight portions of `text` that match `query` using accent color spans. */
function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;

  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lower.indexOf(query, cursor);
    if (idx === -1) {
      parts.push(
        <span key={cursor}>{text.slice(cursor)}</span>
      );
      break;
    }
    if (idx > cursor) {
      parts.push(
        <span key={cursor}>{text.slice(cursor, idx)}</span>
      );
    }
    parts.push(
      <span
        key={`hl-${idx}`}
        className="text-[var(--accent-primary)] bg-[var(--accent-glow)] rounded-sm px-0.5"
      >
        {text.slice(idx, idx + query.length)}
      </span>
    );
    cursor = idx + query.length;
  }

  return <>{parts}</>;
}

// ---------------------------------------------------------------------------
// Tree Node Renderer
// ---------------------------------------------------------------------------

interface TreeNodeRendererProps {
  node: TreeNode;
  depth: number;
  defaultExpanded: boolean;
  searchQuery: string;
  matchedPaths: Set<string>;
  expandPaths: Set<string>;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
}

function TreeNodeRenderer({
  node,
  depth,
  defaultExpanded,
  searchQuery,
  matchedPaths,
  expandPaths,
  expanded,
  onToggle,
}: TreeNodeRendererProps) {
  const isCollapsible = node.type === "object" || node.type === "array";

  // Determine expanded state: explicit toggle > search-forced expand > default
  const isExpanded = (() => {
    if (expanded[node.path] !== undefined) return expanded[node.path];
    if (searchQuery && expandPaths.has(node.path)) return true;
    return defaultExpanded;
  })();

  // During search, hide nodes that don't match and don't have matching descendants
  if (
    searchQuery &&
    !matchedPaths.has(node.path) &&
    !expandPaths.has(node.path) &&
    // leaf nodes that are not matched get hidden
    !isCollapsible
  ) {
    return null;
  }

  // For collapsible nodes during search: hide if they have no matched children at all
  if (
    searchQuery &&
    isCollapsible &&
    !matchedPaths.has(node.path) &&
    !expandPaths.has(node.path)
  ) {
    return null;
  }

  const handleToggle = () => {
    if (isCollapsible) {
      onToggle(node.path);
    }
  };

  return (
    <div
      className="relative"
      style={{ paddingLeft: depth > 0 ? "1.25rem" : 0 }}
    >
      {/* Nesting depth indicator line */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 left-[0.5rem] w-px bg-[var(--border-subtle)]"
          aria-hidden="true"
        />
      )}

      {/* Node row */}
      <div className="flex items-start gap-1.5 py-[3px] group/row">
        {/* Toggle chevron for collapsible nodes */}
        {isCollapsible ? (
          <button
            type="button"
            onClick={handleToggle}
            className="flex-shrink-0 mt-[3px] w-4 h-4 flex items-center justify-center rounded-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="flex-shrink-0 w-4" aria-hidden="true" />
        )}

        {/* Key label */}
        <span className="flex-shrink-0 text-[var(--text-secondary)] select-text">
          <HighlightMatch text={node.key} query={searchQuery} />
        </span>

        {/* Separator */}
        <span className="flex-shrink-0 text-[var(--text-muted)]">:</span>

        {/* Value rendering */}
        {isCollapsible ? (
          <button
            type="button"
            onClick={handleToggle}
            className="text-[var(--text-muted)] hover:text-[var(--text-tertiary)] transition-colors duration-150 cursor-pointer select-none"
          >
            {node.type === "object"
              ? `{${node.childCount}}`
              : `[${node.childCount} item${node.childCount !== 1 ? "s" : ""}]`}
          </button>
        ) : (
          <ValueRenderer
            value={node.value}
            type={node.type}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Children (collapsible) */}
      {isCollapsible && isExpanded && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNodeRenderer
              key={child.path}
              node={child}
              depth={depth + 1}
              defaultExpanded={false}
              searchQuery={searchQuery}
              matchedPaths={matchedPaths}
              expandPaths={expandPaths}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Value Renderer (leaf primitives)
// ---------------------------------------------------------------------------

interface ValueRendererProps {
  value: unknown;
  type: "string" | "number" | "boolean" | "null" | "object" | "array";
  searchQuery: string;
}

function ValueRenderer({ value, type, searchQuery }: ValueRendererProps) {
  switch (type) {
    case "string": {
      const str = value as string;
      return (
        <span className="text-[var(--text-muted)] break-all select-text">
          &quot;
          <HighlightMatch text={str} query={searchQuery} />
          &quot;
        </span>
      );
    }

    case "number":
      return (
        <span className="tabular-nums text-[var(--accent-secondary)] select-text">
          <HighlightMatch text={String(value)} query={searchQuery} />
        </span>
      );

    case "boolean": {
      const bool = value as boolean;
      return (
        <span
          className={`inline-flex items-center rounded-full px-1.5 py-0 text-[11px] font-medium leading-tight ${
            bool
              ? "bg-[var(--success)]/15 text-[var(--success)]"
              : "bg-[var(--error)]/15 text-[var(--error)]"
          }`}
        >
          {String(bool)}
        </span>
      );
    }

    case "null":
      return (
        <span className="text-[var(--text-muted)] italic">null</span>
      );

    default:
      return (
        <span className="text-[var(--text-muted)]">{String(value)}</span>
      );
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function JsonTree({ data, title }: JsonTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Build a virtual root node wrapping all top-level entries
  const rootNodes = useMemo(() => {
    if (!data || typeof data !== "object") return [];
    return Object.entries(data).map(([key, value]) =>
      buildTree(key, value, "")
    );
  }, [data]);

  // Compute match / expand paths for search
  const { allMatchedPaths, allExpandPaths } = useMemo(() => {
    if (!normalizedQuery) {
      return { allMatchedPaths: new Set<string>(), allExpandPaths: new Set<string>() };
    }
    const mp = new Set<string>();
    const ep = new Set<string>();
    for (const node of rootNodes) {
      const result = collectMatchPaths(node, normalizedQuery);
      result.matchedPaths.forEach((p) => mp.add(p));
      result.expandPaths.forEach((p) => ep.add(p));
    }
    return { allMatchedPaths: mp, allExpandPaths: ep };
  }, [rootNodes, normalizedQuery]);

  const handleToggle = useCallback((path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setExpanded({});
  }, []);

  // Empty state
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="font-mono text-xs text-[var(--text-muted)] py-6 text-center">
        No data
      </div>
    );
  }

  // Check if search yields zero visible results
  const hasSearchResults =
    !normalizedQuery ||
    allMatchedPaths.size > 0 ||
    allExpandPaths.size > 0;

  return (
    <div className="font-mono text-xs leading-relaxed">
      {/* Header with optional title and search */}
      <div className="flex items-center gap-3 mb-3">
        {title && (
          <h4 className="text-sm font-semibold text-[var(--text-primary)] flex-shrink-0">
            {title}
          </h4>
        )}

        {/* Search input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Reset explicit toggles when search changes so auto-expand takes over
              setExpanded({});
            }}
            placeholder="Search keys or values..."
            className="w-full pl-8 pr-8 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/20 transition-colors duration-150"
            aria-label="Search JSON tree"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors duration-150"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree content */}
      <div
        className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 overflow-x-auto"
        role="tree"
        aria-label={title ?? "JSON tree"}
      >
        {hasSearchResults ? (
          rootNodes.map((node) => (
            <TreeNodeRenderer
              key={node.path}
              node={node}
              depth={0}
              defaultExpanded={true}
              searchQuery={normalizedQuery}
              matchedPaths={allMatchedPaths}
              expandPaths={allExpandPaths}
              expanded={expanded}
              onToggle={handleToggle}
            />
          ))
        ) : (
          <div className="text-[var(--text-muted)] py-3 text-center italic">
            No matches for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
