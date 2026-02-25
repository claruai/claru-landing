"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DetectedSection {
  /** Display name of the section (from the header row or "Section N") */
  name: string;
  /** 0-based row index where the section header was found in the raw CSV */
  headerRowIndex: number;
  /** Column headers for this section */
  columns: string[];
  /** All data rows belonging to this section */
  rows: string[][];
}

interface ParseState {
  fileName: string;
  totalRows: number;
  sections: DetectedSection[];
}

// ---------------------------------------------------------------------------
// Section Detection Logic
// ---------------------------------------------------------------------------

/**
 * Detect section boundaries in parsed CSV data.
 *
 * Heuristic: A section boundary is identified when:
 * 1. A blank row (all cells empty/whitespace) is followed by a non-blank row
 *    that looks like a header (contains text but few numeric-only values).
 * 2. Or the very first non-blank row is a header.
 *
 * A "section header row" is a row where:
 * - Only 1 cell has content (a section title), OR
 * - Most cells contain short text labels (likely column headers).
 *
 * If a single-cell title row is found, the NEXT non-blank row is treated as
 * the column header row for that section.
 */
function detectSections(data: string[][]): DetectedSection[] {
  if (data.length === 0) return [];

  const sections: DetectedSection[] = [];

  // Helper: check if a row is blank (all cells empty or whitespace)
  const isBlankRow = (row: string[]): boolean =>
    row.every((cell) => cell.trim() === "");

  // Helper: check if a row looks like a single-cell section title
  const isSectionTitleRow = (row: string[]): boolean => {
    const nonEmpty = row.filter((cell) => cell.trim() !== "");
    return nonEmpty.length === 1 && nonEmpty[0].trim().length > 0;
  };

  // Helper: check if a row looks like column headers (most cells are non-empty text)
  const isHeaderLikeRow = (row: string[]): boolean => {
    const nonEmpty = row.filter((cell) => cell.trim() !== "");
    if (nonEmpty.length < 2) return false;
    // At least half of cells should be non-empty
    return nonEmpty.length >= row.length * 0.4;
  };

  let i = 0;

  // Skip leading blank rows
  while (i < data.length && isBlankRow(data[i])) i++;

  if (i >= data.length) return [];

  // Process first section (may or may not have a title row)
  let sectionCount = 0;

  while (i < data.length) {
    // Skip blank rows
    while (i < data.length && isBlankRow(data[i])) i++;
    if (i >= data.length) break;

    sectionCount++;
    let sectionName = `Section ${sectionCount}`;
    let headerRowIndex = i;
    let columns: string[];

    // Check if this row is a single-cell title
    if (isSectionTitleRow(data[i])) {
      sectionName = data[i].find((cell) => cell.trim() !== "")?.trim() ?? sectionName;
      headerRowIndex = i;
      i++;

      // Skip blank rows after title
      while (i < data.length && isBlankRow(data[i])) i++;

      if (i >= data.length) {
        // Section title with no data
        sections.push({
          name: sectionName,
          headerRowIndex,
          columns: [],
          rows: [],
        });
        break;
      }

      // Next non-blank row is the column header
      columns = data[i].map((cell) => cell.trim());
      i++;
    } else if (isHeaderLikeRow(data[i])) {
      // This row is the column header row
      columns = data[i].map((cell) => cell.trim());
      i++;
    } else {
      // Treat as data with generic column headers
      columns = data[i].map((_, idx) => `Column ${idx + 1}`);
    }

    // Collect data rows until we hit a blank row
    const rows: string[][] = [];
    while (i < data.length && !isBlankRow(data[i])) {
      // Check if this looks like a new section title mid-stream
      // (single cell with text, and the previous rows had multiple columns filled)
      if (
        isSectionTitleRow(data[i]) &&
        rows.length > 0 &&
        columns.length > 2
      ) {
        break;
      }
      rows.push(data[i]);
      i++;
    }

    sections.push({
      name: sectionName,
      headerRowIndex,
      columns,
      rows,
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminCatalogImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [parseState, setParseState] = useState<ParseState | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // ---------------------------------------------------------------------------
  // File Processing
  // ---------------------------------------------------------------------------

  const processFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setParseError("Only .csv files are accepted");
      setParseState(null);
      return;
    }

    setIsParsing(true);
    setParseError(null);
    setParseState(null);

    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: false,
      complete: (results) => {
        const rawData = results.data;

        if (!rawData || rawData.length === 0) {
          setParseError("CSV file is empty");
          setIsParsing(false);
          return;
        }

        // Count non-blank rows for the total
        const nonBlankRows = rawData.filter(
          (row) => !row.every((cell) => cell.trim() === "")
        );

        const sections = detectSections(rawData);

        if (sections.length === 0) {
          setParseError("No sections detected -- file may be empty or contain only blank rows");
          setIsParsing(false);
          return;
        }

        setParseState({
          fileName: file.name,
          totalRows: nonBlankRows.length,
          sections,
        });
        setIsParsing(false);
      },
      error: (error) => {
        setParseError(`Failed to parse CSV: ${error.message}`);
        setIsParsing(false);
      },
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Drag & Drop handlers
  // ---------------------------------------------------------------------------

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [processFile]
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const handleReset = useCallback(() => {
    setParseState(null);
    setParseError(null);
    setIsParsing(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-mono font-semibold tracking-tight">
          <Link
            href="/admin/dashboard"
            className="hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            claru
            <span className="text-[var(--accent-primary)]">/</span>
            admin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link
            href="/admin/catalog"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
          >
            catalog
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-secondary)]">import</span>
        </h1>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/catalog"
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            [back to catalog]
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
          >
            [logout]
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* Page title */}
        <div>
          <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
            CSV Import
          </h2>
          <p className="text-sm font-mono text-[var(--text-muted)]">
            Upload a CSV file to parse and detect sections. Step 1 of 4.
          </p>
        </div>

        {/* Dropzone */}
        {!parseState && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            aria-label="Upload CSV file"
            className={`
              relative flex flex-col items-center justify-center gap-4
              rounded-lg border-2 border-dashed
              px-8 py-16 cursor-pointer
              transition-all duration-200
              ${
                isDragOver
                  ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                  : "border-[var(--border-medium)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/60 hover:bg-[var(--bg-tertiary)]"
              }
              ${isParsing ? "pointer-events-none opacity-60" : ""}
            `}
          >
            {isParsing ? (
              <>
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-mono text-[var(--text-secondary)]">
                  parsing csv...
                </p>
              </>
            ) : (
              <>
                <div
                  className={`
                    w-14 h-14 rounded-lg border
                    flex items-center justify-center
                    transition-colors duration-200
                    ${
                      isDragOver
                        ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                        : "border-[var(--border-medium)] bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    }
                  `}
                >
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-mono text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    .csv files only
                  </p>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="CSV file input"
            />
          </div>
        )}

        {/* Parse error */}
        {parseError && (
          <div className="flex items-start gap-3 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/5 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-[var(--error)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-mono text-[var(--error)]">
                {parseError}
              </p>
              <button
                onClick={handleReset}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                [try again]
              </button>
            </div>
          </div>
        )}

        {/* Parsed Results */}
        {parseState && (
          <div className="space-y-6">
            {/* File info bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div className="font-mono">
                  <p className="text-sm text-[var(--text-primary)] font-medium">
                    {parseState.fileName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {parseState.totalRows.toLocaleString()} rows &middot;{" "}
                    {parseState.sections.length}{" "}
                    {parseState.sections.length === 1 ? "section" : "sections"}{" "}
                    detected
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-150"
              >
                [remove file]
              </button>
            </div>

            {/* Summary panel */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
                  Detected Sections
                </h3>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {parseState.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                      <span className="text-sm font-mono text-[var(--text-primary)]">
                        {section.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
                      <span>
                        {section.columns.length}{" "}
                        {section.columns.length === 1 ? "column" : "columns"}
                      </span>
                      <span>
                        {section.rows.length.toLocaleString()}{" "}
                        {section.rows.length === 1 ? "row" : "rows"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Previews */}
            {parseState.sections.map((section, idx) => (
              <SectionPreview key={idx} section={section} index={idx} />
            ))}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors duration-150"
              >
                [upload different file]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Preview Sub-component
// ---------------------------------------------------------------------------

function SectionPreview({
  section,
  index,
}: {
  section: DetectedSection;
  index: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const previewRows = section.rows.slice(0, 5);
  const hasMore = section.rows.length > 5;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
          <span className="text-sm font-mono font-medium text-[var(--text-primary)]">
            {section.name}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            ({section.rows.length.toLocaleString()}{" "}
            {section.rows.length === 1 ? "row" : "rows"})
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--accent-primary)]">
          Section {index + 1}
        </span>
      </button>

      {/* Preview table */}
      {expanded && (
        <div className="border-t border-[var(--border-subtle)]">
          {section.columns.length > 0 && previewRows.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                      <th className="text-left px-3 py-2 text-[var(--text-muted)] uppercase tracking-wider font-medium w-10">
                        #
                      </th>
                      {section.columns.map((col, colIdx) => (
                        <th
                          key={colIdx}
                          className="text-left px-3 py-2 text-[var(--text-muted)] uppercase tracking-wider font-medium"
                        >
                          {col || (
                            <span className="italic opacity-50">empty</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-[var(--border-subtle)] last:border-b-0"
                      >
                        <td className="px-3 py-2 text-[var(--text-muted)] tabular-nums">
                          {rowIdx + 1}
                        </td>
                        {section.columns.map((_, colIdx) => (
                          <td
                            key={colIdx}
                            className="px-3 py-2 text-[var(--text-secondary)] max-w-[300px] truncate"
                          >
                            {row[colIdx]?.trim() || (
                              <span className="text-[var(--text-muted)] italic">
                                --
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className="px-4 py-2 border-t border-[var(--border-subtle)]">
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    showing first 5 of{" "}
                    {section.rows.length.toLocaleString()} rows
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {section.columns.length === 0
                  ? "no columns detected"
                  : "no data rows in this section"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
