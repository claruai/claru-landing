"use client";

import { useCallback, useRef, useState } from "react";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  ChevronDown,
  X,
  AlertCircle,
  Loader2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BulkCsvUploaderProps {
  datasetId: string;
  onImportComplete: () => void;
}

type MappableField =
  | "s3_object_key"
  | "s3_annotation_key"
  | "s3_specs_key"
  | "metadata_json"
  | "__unmapped__";

interface ColumnMapping {
  csvColumn: string;
  mappedTo: MappableField;
}

interface ParsedRow {
  [key: string]: string;
}

// Auto-detect column mapping rules
const AUTO_MAP_RULES: Record<string, MappableField> = {
  s3_object_key: "s3_object_key",
  s3_uri: "s3_object_key",
  file_url: "s3_object_key",
  media_url: "s3_object_key",
  url: "s3_object_key",
  object_key: "s3_object_key",
  annotation_key: "s3_annotation_key",
  s3_annotation_key: "s3_annotation_key",
  annotation: "s3_annotation_key",
  specs_key: "s3_specs_key",
  s3_specs_key: "s3_specs_key",
  specs: "s3_specs_key",
  metadata: "metadata_json",
  metadata_json: "metadata_json",
  meta: "metadata_json",
};

const FIELD_LABELS: Record<MappableField, string> = {
  s3_object_key: "S3 Object Key",
  s3_annotation_key: "S3 Annotation Key",
  s3_specs_key: "S3 Specs Key",
  metadata_json: "Metadata JSON",
  __unmapped__: "→ Metadata (auto)",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BulkCsvUploader({
  datasetId,
  onImportComplete,
}: BulkCsvUploaderProps) {
  // Parsing state
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [stripS3Prefix, setStripS3Prefix] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Import execution state (US-009)
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importResult, setImportResult] = useState<{
    inserted: number;
    skipped: number;
    errors: { row: number; message: string }[];
  } | null>(null);

  // Dedup state (US-009)
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateKeys, setDuplicateKeys] = useState<string[]>([]);
  const [newRowCount, setNewRowCount] = useState<number | null>(null);
  const [showDuplicates, setShowDuplicates] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------------------------------------------
  // CSV Parsing
  // -----------------------------------------------------------------------

  const handleFile = useCallback((file: File) => {
    setParseError(null);
    setFileName(file.name);
    setImportResult(null);
    setDuplicateKeys([]);
    setNewRowCount(null);

    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError(
            `CSV parse error: ${results.errors[0].message} (row ${results.errors[0].row})`
          );
          return;
        }

        const cols = results.meta.fields ?? [];
        if (cols.length === 0) {
          setParseError("No columns detected in CSV");
          return;
        }

        setParsedRows(results.data);
        setColumns(cols);

        // Auto-detect column mappings
        const autoMappings: ColumnMapping[] = cols.map((col) => {
          const normalized = col.trim().toLowerCase().replace(/\s+/g, "_");
          const mapped = AUTO_MAP_RULES[normalized] ?? "__unmapped__";
          return { csvColumn: col, mappedTo: mapped };
        });
        setMappings(autoMappings);
      },
      error: (err) => {
        setParseError(`Failed to parse CSV: ${err.message}`);
      },
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        handleFile(file);
      } else {
        setParseError("Please drop a .csv file");
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // -----------------------------------------------------------------------
  // Column mapping update
  // -----------------------------------------------------------------------

  const updateMapping = useCallback((csvColumn: string, newMapping: MappableField) => {
    setMappings((prev) =>
      prev.map((m) => (m.csvColumn === csvColumn ? { ...m, mappedTo: newMapping } : m))
    );
  }, []);

  // -----------------------------------------------------------------------
  // Build sample rows from parsed CSV + mappings
  // -----------------------------------------------------------------------

  const buildSampleRows = useCallback(() => {
    const s3Col = mappings.find((m) => m.mappedTo === "s3_object_key")?.csvColumn;
    const annotCol = mappings.find((m) => m.mappedTo === "s3_annotation_key")?.csvColumn;
    const specsCol = mappings.find((m) => m.mappedTo === "s3_specs_key")?.csvColumn;
    const metaCol = mappings.find((m) => m.mappedTo === "metadata_json")?.csvColumn;
    const unmappedCols = mappings
      .filter((m) => m.mappedTo === "__unmapped__")
      .map((m) => m.csvColumn);

    return parsedRows.map((row) => {
      let s3Key = s3Col ? row[s3Col] ?? "" : "";
      if (stripS3Prefix) {
        s3Key = s3Key.replace(/^s3:\/\/[^/]+\//, "");
      }

      // Build metadata from explicit column + unmapped columns
      const metadata: Record<string, string> = {};
      if (metaCol && row[metaCol]) {
        try {
          Object.assign(metadata, JSON.parse(row[metaCol]));
        } catch {
          metadata._raw_metadata = row[metaCol];
        }
      }
      for (const col of unmappedCols) {
        if (row[col] != null && row[col] !== "") {
          metadata[col] = row[col];
        }
      }

      // Build media_url for the bulk API (required field)
      const mediaUrl = s3Key
        ? `https://s3-placeholder.local/${s3Key}`
        : "https://s3-placeholder.local/unknown";

      return {
        media_url: mediaUrl,
        s3_object_key: s3Key || null,
        s3_annotation_key: annotCol ? row[annotCol] || null : null,
        s3_specs_key: specsCol ? row[specsCol] || null : null,
        metadata_json: metadata,
      };
    });
  }, [parsedRows, mappings, stripS3Prefix]);

  // -----------------------------------------------------------------------
  // Duplicate detection (US-009)
  // -----------------------------------------------------------------------

  const checkDuplicates = useCallback(async () => {
    setCheckingDuplicates(true);
    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}/samples`);
      if (!res.ok) throw new Error("Failed to fetch existing samples");
      const data = await res.json();
      const existingKeys = new Set(
        (data.samples ?? [])
          .map((s: { s3_object_key?: string }) => s.s3_object_key)
          .filter(Boolean)
      );

      const rows = buildSampleRows();
      const dupes: string[] = [];
      let newCount = 0;
      for (const row of rows) {
        if (row.s3_object_key && existingKeys.has(row.s3_object_key)) {
          dupes.push(row.s3_object_key);
        } else {
          newCount++;
        }
      }
      setDuplicateKeys(dupes);
      setNewRowCount(newCount);
    } catch {
      setNewRowCount(parsedRows.length);
      setDuplicateKeys([]);
    } finally {
      setCheckingDuplicates(false);
    }
  }, [datasetId, buildSampleRows, parsedRows.length]);

  // -----------------------------------------------------------------------
  // Import execution (US-009)
  // -----------------------------------------------------------------------

  const executeImport = useCallback(async () => {
    setImporting(true);
    setImportResult(null);

    const rows = buildSampleRows();
    const CHUNK_SIZE = 100;
    const totalChunks = Math.ceil(rows.length / CHUNK_SIZE);
    setImportProgress({ current: 0, total: totalChunks });

    let totalInserted = 0;
    let totalSkipped = 0;
    const allErrors: { row: number; message: string }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = rows.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      try {
        const res = await fetch(`/api/admin/catalog/${datasetId}/samples/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            samples: chunk,
            skip_duplicates: true,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `Chunk ${i + 1} failed (${res.status})`);
        }

        const result = await res.json();
        totalInserted += result.inserted ?? 0;
        totalSkipped += result.skipped ?? 0;
        if (result.errors) {
          for (const err of result.errors) {
            allErrors.push({
              row: i * CHUNK_SIZE + (err.index ?? 0) + 1,
              message: err.error ?? "Unknown error",
            });
          }
        }
      } catch (err) {
        allErrors.push({
          row: i * CHUNK_SIZE + 1,
          message: err instanceof Error ? err.message : "Chunk failed",
        });
      }

      setImportProgress({ current: i + 1, total: totalChunks });
    }

    setImportResult({
      inserted: totalInserted,
      skipped: totalSkipped,
      errors: allErrors,
    });
    setImporting(false);

    if (totalInserted > 0) {
      onImportComplete();
    }
  }, [datasetId, buildSampleRows, onImportComplete]);

  // -----------------------------------------------------------------------
  // Reset
  // -----------------------------------------------------------------------

  const reset = useCallback(() => {
    setParsedRows([]);
    setColumns([]);
    setMappings([]);
    setParseError(null);
    setFileName(null);
    setImportResult(null);
    setDuplicateKeys([]);
    setNewRowCount(null);
    setShowDuplicates(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // -----------------------------------------------------------------------
  // Shared styles
  // -----------------------------------------------------------------------

  const inputBase =
    "w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors";

  // -----------------------------------------------------------------------
  // Render: No file uploaded yet
  // -----------------------------------------------------------------------

  if (parsedRows.length === 0 && !importResult) {
    return (
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-[var(--text-muted)]" />
          <p className="text-sm font-mono text-[var(--text-primary)]">
            Drop a .csv file here or click to browse
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Flat CSV — one row per sample
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />

        {parseError && (
          <p className="flex items-center gap-1 text-xs font-mono text-[var(--error)]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {parseError}
          </p>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: Import complete
  // -----------------------------------------------------------------------

  if (importResult) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">
              Import Complete
            </span>
          </div>
          <div className="space-y-1 text-sm font-mono text-[var(--text-secondary)]">
            <p>
              Imported{" "}
              <span className="text-[var(--accent-primary)]">{importResult.inserted}</span>{" "}
              samples.
            </p>
            {importResult.skipped > 0 && (
              <p>
                <span className="text-yellow-400">{importResult.skipped}</span> skipped
                (duplicates).
              </p>
            )}
            {importResult.errors.length > 0 && (
              <div>
                <p className="text-[var(--error)]">{importResult.errors.length} errors:</p>
                <ul className="mt-1 ml-4 list-disc text-xs text-[var(--error)]">
                  {importResult.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>
                      Row {err.row}: {err.message}
                    </li>
                  ))}
                  {importResult.errors.length > 10 && (
                    <li>...and {importResult.errors.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Import Another CSV
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render: File parsed — show mapping + preview
  // -----------------------------------------------------------------------

  const previewRows = parsedRows.slice(0, 10);

  return (
    <div className="space-y-5">
      {/* File info bar */}
      <div className="flex items-center justify-between rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-mono text-[var(--text-primary)]">{fileName}</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {parsedRows.length} rows detected
          </span>
        </div>
        <button
          onClick={reset}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* S3 prefix toggle */}
      <label className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] cursor-pointer">
        <input
          type="checkbox"
          checked={stripS3Prefix}
          onChange={(e) => setStripS3Prefix(e.target.checked)}
          className="rounded border-[var(--border-subtle)] bg-[var(--bg-secondary)] accent-[var(--accent-primary)]"
        />
        Strip s3://bucket-name/ prefix from keys
      </label>

      {/* Column mappings */}
      <div>
        <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Column Mapping
        </h4>
        <div className="space-y-2">
          {mappings.map((mapping) => (
            <div key={mapping.csvColumn} className="flex items-center gap-3">
              <span
                className="w-40 truncate text-sm font-mono text-[var(--text-primary)]"
                title={mapping.csvColumn}
              >
                {mapping.csvColumn}
              </span>
              <span className="text-xs text-[var(--text-muted)]">→</span>
              <div className="relative">
                <select
                  value={mapping.mappedTo}
                  onChange={(e) =>
                    updateMapping(mapping.csvColumn, e.target.value as MappableField)
                  }
                  className={`${inputBase} pr-8 appearance-none min-w-[200px]`}
                >
                  <option value="s3_object_key">{FIELD_LABELS.s3_object_key}</option>
                  <option value="s3_annotation_key">{FIELD_LABELS.s3_annotation_key}</option>
                  <option value="s3_specs_key">{FIELD_LABELS.s3_specs_key}</option>
                  <option value="metadata_json">{FIELD_LABELS.metadata_json}</option>
                  <option value="__unmapped__">{FIELD_LABELS.__unmapped__}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              </div>
              {mapping.mappedTo !== "__unmapped__" && (
                <span className="text-xs font-mono text-[var(--accent-primary)]">mapped</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview table */}
      <div>
        <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Preview (first {previewRows.length} rows)
        </h4>
        <div className="overflow-x-auto rounded-md border border-[var(--border-subtle)]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                {columns.map((col) => {
                  const mapping = mappings.find((m) => m.csvColumn === col);
                  const isMapped = mapping?.mappedTo !== "__unmapped__";
                  return (
                    <th
                      key={col}
                      className={`px-3 py-2 text-left whitespace-nowrap ${
                        isMapped
                          ? "text-[var(--accent-primary)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]"
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-1.5 text-[var(--text-secondary)] max-w-[200px] truncate"
                      title={row[col]}
                    >
                      {row[col] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Duplicate detection results */}
      {newRowCount !== null && (
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
          <p className="text-sm font-mono text-[var(--text-primary)]">
            <span className="text-[var(--accent-primary)]">{newRowCount}</span> new samples to
            import
            {duplicateKeys.length > 0 && (
              <>
                {" · "}
                <span className="text-yellow-400">{duplicateKeys.length}</span> duplicates will
                be skipped
                <button
                  onClick={() => setShowDuplicates(!showDuplicates)}
                  className="ml-2 text-xs underline text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showDuplicates ? "hide" : "show"}
                </button>
              </>
            )}
          </p>
          {showDuplicates && duplicateKeys.length > 0 && (
            <ul className="mt-2 ml-4 list-disc text-xs font-mono text-[var(--text-muted)] max-h-32 overflow-y-auto">
              {duplicateKeys.map((key, i) => (
                <li key={i} className="truncate">
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Import progress */}
      {importing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)]">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            Importing chunk {importProgress.current} of {importProgress.total}...
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
            <div
              className="bg-[var(--accent-primary)] h-2 rounded-full transition-all"
              style={{
                width: `${importProgress.total ? (importProgress.current / importProgress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!importing && !importResult && (
        <div className="flex items-center gap-3">
          {newRowCount === null ? (
            <button
              onClick={checkDuplicates}
              disabled={checkingDuplicates}
              className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {checkingDuplicates ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {checkingDuplicates ? "Checking..." : "Check for Duplicates"}
            </button>
          ) : (
            <button
              onClick={executeImport}
              disabled={newRowCount === 0}
              className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Import {newRowCount} Samples
            </button>
          )}

          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
