"use client";

import { useCallback, useRef, useState } from "react";
import {
  Upload,
  FileJson,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BulkImporterProps {
  datasetId: string;
  onImportComplete: () => void;
}

interface BulkSampleInput {
  media_url: string;
  metadata_json?: Record<string, unknown>;
}

interface BulkError {
  index: number;
  error: string;
}

interface ImportResult {
  inserted: number;
  errors: BulkError[];
}

type TabId = "json" | "csv";

// ---------------------------------------------------------------------------
// CSV Parser
// ---------------------------------------------------------------------------

/**
 * Simple CSV parser that handles quoted values containing commas and newlines.
 * Returns an array of string arrays (rows of cells).
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        row.push(current.trim());
        current = "";
        if (row.some((cell) => cell.length > 0)) {
          rows.push(row);
        }
        row = [];
        if (char === "\r") i++; // skip \n after \r
      } else {
        current += char;
      }
    }
  }

  // Push final cell/row
  row.push(current.trim());
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BulkImporter({
  datasetId,
  onImportComplete,
}: BulkImporterProps) {
  const [activeTab, setActiveTab] = useState<TabId>("json");
  const [expanded, setExpanded] = useState(false);

  // JSON tab state
  const [jsonText, setJsonText] = useState("");
  const [jsonValidation, setJsonValidation] = useState<{
    valid: boolean;
    count: number;
    error?: string;
  } | null>(null);

  // CSV tab state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvParsed, setCsvParsed] = useState<BulkSampleInput[] | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Shared import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // -------------------------------------------------------------------------
  // JSON validation
  // -------------------------------------------------------------------------

  const validateJson = useCallback((text: string) => {
    if (!text.trim()) {
      setJsonValidation(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        setJsonValidation({
          valid: false,
          count: 0,
          error: "Input must be a JSON array",
        });
        return;
      }

      if (parsed.length === 0) {
        setJsonValidation({
          valid: false,
          count: 0,
          error: "Array is empty",
        });
        return;
      }

      // Validate each item
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          setJsonValidation({
            valid: false,
            count: 0,
            error: `Item at index ${i}: must be an object`,
          });
          return;
        }

        if (typeof item.media_url !== "string" || !item.media_url) {
          setJsonValidation({
            valid: false,
            count: 0,
            error: `Item at index ${i}: missing or invalid media_url`,
          });
          return;
        }

        if (
          !item.media_url.startsWith("http://") &&
          !item.media_url.startsWith("https://")
        ) {
          setJsonValidation({
            valid: false,
            count: 0,
            error: `Item at index ${i}: media_url must start with http:// or https://`,
          });
          return;
        }

        // Check metadata/metadata_json -- accept either key name
        const meta = item.metadata ?? item.metadata_json;
        if (meta !== undefined && meta !== null) {
          if (typeof meta !== "object" || Array.isArray(meta)) {
            setJsonValidation({
              valid: false,
              count: 0,
              error: `Item at index ${i}: metadata must be an object`,
            });
            return;
          }
        }
      }

      setJsonValidation({ valid: true, count: parsed.length });
    } catch {
      setJsonValidation({
        valid: false,
        count: 0,
        error: "Invalid JSON syntax",
      });
    }
  }, []);

  const handleJsonChange = useCallback(
    (text: string) => {
      setJsonText(text);
      setImportResult(null);
      validateJson(text);
    },
    [validateJson]
  );

  // -------------------------------------------------------------------------
  // CSV parsing
  // -------------------------------------------------------------------------

  const handleCsvFile = useCallback((file: File) => {
    setCsvFile(file);
    setCsvError(null);
    setCsvParsed(null);
    setCsvPreviewRows([]);
    setCsvHeaders([]);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setCsvError("Failed to read file");
        return;
      }

      const rows = parseCSV(text);
      if (rows.length < 2) {
        setCsvError("CSV must have a header row and at least one data row");
        return;
      }

      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const mediaUrlIndex = headers.indexOf("media_url");
      if (mediaUrlIndex === -1) {
        setCsvError('CSV must have a "media_url" column header');
        return;
      }

      const metadataIndex = headers.indexOf("metadata_json");

      const dataRows = rows.slice(1);
      const samples: BulkSampleInput[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const mediaUrl = row[mediaUrlIndex]?.trim();

        if (!mediaUrl) {
          setCsvError(`Row ${i + 2}: media_url is empty`);
          return;
        }

        if (!mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
          setCsvError(
            `Row ${i + 2}: media_url must start with http:// or https://`
          );
          return;
        }

        let metadata: Record<string, unknown> = {};
        if (metadataIndex !== -1 && row[metadataIndex]?.trim()) {
          try {
            const parsed = JSON.parse(row[metadataIndex]);
            if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
              setCsvError(`Row ${i + 2}: metadata_json must be a JSON object`);
              return;
            }
            metadata = parsed;
          } catch {
            setCsvError(
              `Row ${i + 2}: metadata_json contains invalid JSON`
            );
            return;
          }
        }

        samples.push({ media_url: mediaUrl, metadata_json: metadata });
      }

      setCsvHeaders(rows[0]);
      setCsvPreviewRows(dataRows.slice(0, 5));
      setCsvParsed(samples);
    };

    reader.onerror = () => {
      setCsvError("Failed to read file");
    };

    reader.readAsText(file);
  }, []);

  const handleCsvInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleCsvFile(file);
      }
      e.target.value = "";
    },
    [handleCsvFile]
  );

  // -------------------------------------------------------------------------
  // Import
  // -------------------------------------------------------------------------

  const buildSamplesPayload = useCallback((): BulkSampleInput[] | null => {
    if (activeTab === "json") {
      if (!jsonValidation?.valid) return null;

      try {
        const parsed = JSON.parse(jsonText) as Array<Record<string, unknown>>;
        return parsed.map((item) => ({
          media_url: item.media_url as string,
          metadata_json:
            ((item.metadata ?? item.metadata_json) as Record<string, unknown>) ??
            {},
        }));
      } catch {
        return null;
      }
    }

    if (activeTab === "csv") {
      return csvParsed;
    }

    return null;
  }, [activeTab, jsonText, jsonValidation, csvParsed]);

  const handleImport = useCallback(async () => {
    const samples = buildSamplesPayload();
    if (!samples || samples.length === 0) return;

    setImporting(true);
    setImportResult(null);

    try {
      const res = await fetch(
        `/api/admin/catalog/${datasetId}/samples/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ samples }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Import failed (${res.status})`);
      }

      const result: ImportResult = await res.json();
      setImportResult(result);

      // If any were inserted, notify parent to refresh
      if (result.inserted > 0) {
        onImportComplete();
      }
    } catch (err) {
      setImportResult({
        inserted: 0,
        errors: [
          {
            index: -1,
            error: err instanceof Error ? err.message : "Import failed",
          },
        ],
      });
    } finally {
      setImporting(false);
    }
  }, [buildSamplesPayload, datasetId, onImportComplete]);

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  const handleReset = useCallback(() => {
    setJsonText("");
    setJsonValidation(null);
    setCsvFile(null);
    setCsvParsed(null);
    setCsvPreviewRows([]);
    setCsvHeaders([]);
    setCsvError(null);
    setImportResult(null);
  }, []);

  // -------------------------------------------------------------------------
  // Computed
  // -------------------------------------------------------------------------

  const canImport =
    !importing &&
    ((activeTab === "json" && jsonValidation?.valid) ||
      (activeTab === "csv" && csvParsed && csvParsed.length > 0 && !csvError));

  const sampleCount =
    activeTab === "json"
      ? jsonValidation?.count ?? 0
      : csvParsed?.length ?? 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded-md border border-dashed border-[var(--border-medium)] bg-[var(--bg-secondary)] px-4 py-3 text-sm font-mono text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150 w-full justify-center"
      >
        <Upload className="w-4 h-4" />
        Bulk Import Samples
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
          Bulk Import
        </h3>
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            handleReset();
          }}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close bulk import"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)]">
        <TabButton
          active={activeTab === "json"}
          onClick={() => {
            setActiveTab("json");
            setImportResult(null);
          }}
          icon={<FileJson className="w-3.5 h-3.5" />}
          label="JSON Paste"
        />
        <TabButton
          active={activeTab === "csv"}
          onClick={() => {
            setActiveTab("csv");
            setImportResult(null);
          }}
          icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
          label="CSV Upload"
        />
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {/* ---- JSON Tab ---- */}
        {activeTab === "json" && (
          <>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Paste JSON Array
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={10}
                placeholder={`[\n  { "media_url": "https://...", "metadata": { "key": "value" } },\n  ...\n]`}
                className={`w-full rounded-md bg-[var(--bg-primary)] border px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors resize-y ${
                  jsonValidation && !jsonValidation.valid
                    ? "border-[var(--error)] focus:border-[var(--error)]"
                    : "border-[var(--border-subtle)] focus:border-[var(--accent-primary)]"
                }`}
                spellCheck={false}
              />
            </div>

            {/* Validation feedback */}
            {jsonValidation && (
              <div
                className={`flex items-start gap-2 text-xs font-mono ${
                  jsonValidation.valid
                    ? "text-[var(--accent-primary)]"
                    : "text-[var(--error)]"
                }`}
              >
                {jsonValidation.valid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                <span>
                  {jsonValidation.valid
                    ? `${jsonValidation.count} sample${jsonValidation.count === 1 ? "" : "s"} to import`
                    : jsonValidation.error}
                </span>
              </div>
            )}

            <p className="text-xs font-mono text-[var(--text-muted)]">
              Format:{" "}
              <code className="text-[var(--text-tertiary)]">
                {"[{ \"media_url\": \"https://...\", \"metadata\": { ... } }, ...]"}
              </code>
            </p>
          </>
        )}

        {/* ---- CSV Tab ---- */}
        {activeTab === "csv" && (
          <>
            {/* File input */}
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Upload CSV File
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => csvInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-md border border-[var(--border-medium)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-mono text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose .csv file
                </button>
                {csvFile && (
                  <span className="text-xs font-mono text-[var(--text-muted)] truncate">
                    {csvFile.name}
                  </span>
                )}
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvInputChange}
                  className="hidden"
                  aria-label="Upload CSV file"
                />
              </div>
            </div>

            <p className="text-xs font-mono text-[var(--text-muted)]">
              Required columns:{" "}
              <code className="text-[var(--text-tertiary)]">media_url</code>.
              Optional:{" "}
              <code className="text-[var(--text-tertiary)]">metadata_json</code>{" "}
              (JSON string).
            </p>

            {/* CSV error */}
            {csvError && (
              <div className="flex items-start gap-2 text-xs font-mono text-[var(--error)]">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {/* CSV preview table */}
            {csvParsed && !csvError && csvPreviewRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {csvParsed.length} sample{csvParsed.length === 1 ? "" : "s"}{" "}
                    to import
                  </span>
                </div>

                <div className="overflow-x-auto rounded-md border border-[var(--border-subtle)]">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                        <th className="text-left px-3 py-2 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                          #
                        </th>
                        {csvHeaders.map((header, i) => (
                          <th
                            key={i}
                            className="text-left px-3 py-2 text-[var(--text-muted)] uppercase tracking-wider font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreviewRows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className="border-b border-[var(--border-subtle)] last:border-b-0"
                        >
                          <td className="px-3 py-2 text-[var(--text-muted)]">
                            {rowIdx + 1}
                          </td>
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="px-3 py-2 text-[var(--text-secondary)] max-w-[300px] truncate"
                            >
                              {cell || (
                                <span className="text-[var(--text-muted)] italic">
                                  empty
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {csvParsed.length > 5 && (
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Showing first 5 of {csvParsed.length} rows
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* ---- Import Result ---- */}
        {importResult && (
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-mono">
              {importResult.inserted > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0" />
              )}
              <span
                className={
                  importResult.inserted > 0
                    ? "text-[var(--accent-primary)]"
                    : "text-[var(--error)]"
                }
              >
                Imported {importResult.inserted} sample
                {importResult.inserted === 1 ? "" : "s"}
                {importResult.errors.length > 0 &&
                  `, ${importResult.errors.length} error${importResult.errors.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {/* Error details */}
            {importResult.errors.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {importResult.errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs font-mono text-[var(--error)]"
                  >
                    <span className="shrink-0 text-[var(--text-muted)]">
                      {err.index >= 0 ? `[${err.index}]` : "[err]"}
                    </span>
                    <span>{err.error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- Import Button ---- */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleImport}
            disabled={!canImport}
            className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {importing
              ? "Importing..."
              : `Import All${sampleCount > 0 ? ` (${sampleCount})` : ""}`}
          </button>

          {(jsonText || csvFile) && !importing && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              [clear]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab button helper
// ---------------------------------------------------------------------------

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-colors duration-150 border-b-2 ${
        active
          ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-glow)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
