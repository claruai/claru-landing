"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Columns3,
  Database,
  Scissors,
  Loader2,
  Play,
  RotateCcw,
  XCircle,
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

/** Target fields that CSV columns can be mapped to */
type TargetField =
  | "video_s3_key"
  | "annotation_s3_key"
  | "specs_s3_key"
  | "type"
  | "category"
  | "subcategory"
  | "annotation_id"
  | "metadata_json";

/** Label and description for each target field */
const TARGET_FIELDS: { value: TargetField; label: string; hint: string }[] = [
  { value: "video_s3_key", label: "video_s3_key", hint: "S3 key for the video file" },
  { value: "annotation_s3_key", label: "annotation_s3_key", hint: "S3 key for annotations" },
  { value: "specs_s3_key", label: "specs_s3_key", hint: "S3 key for specs/metadata" },
  { value: "type", label: "type", hint: "Dataset type (short_form, long_form, etc.)" },
  { value: "category", label: "category", hint: "Dataset category" },
  { value: "subcategory", label: "subcategory", hint: "Dataset subcategory" },
  { value: "annotation_id", label: "annotation_id", hint: "Annotation identifier" },
  { value: "metadata_json", label: "metadata_json", hint: "Additional metadata (JSON)" },
];

/** Mapping configuration for a single section */
interface SectionMapping {
  /** Column index -> target field. -1 or absent means unmapped */
  columnMap: Record<number, TargetField | "">;
  /** Which dataset to import into, or "__new__" for creating a new one */
  datasetId: string;
  /** Whether to strip s3://bucket-name/ prefix from S3 URI columns */
  stripS3Prefix: boolean;
}

/** Lightweight dataset record from the API */
interface DatasetOption {
  id: string;
  name: string;
  slug: string;
}

/** A single sample row after column-mapping transformation */
interface ParsedSample {
  sectionName: string;
  datasetId: string;
  datasetName: string;
  rowNumber: number;
  video_s3_key: string | null;
  annotation_s3_key: string | null;
  specs_s3_key: string | null;
  type: string | null;
  category: string | null;
  subcategory: string | null;
  annotation_id: string | null;
  metadata_json_raw: string | null;
  filename: string;
  mime_type: string;
  errors: string[];
  warnings: string[];
}

/** Per-dataset import execution result */
interface DatasetImportResult {
  datasetId: string;
  datasetName: string;
  sampleCount: number;
  status: "pending" | "importing" | "done" | "error";
  inserted: number;
  failed: number;
  errorMessage?: string;
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

  const isBlankRow = (row: string[]): boolean =>
    row.every((cell) => cell.trim() === "");

  const isSectionTitleRow = (row: string[]): boolean => {
    const nonEmpty = row.filter((cell) => cell.trim() !== "");
    return nonEmpty.length === 1 && nonEmpty[0].trim().length > 0;
  };

  const isHeaderLikeRow = (row: string[]): boolean => {
    const nonEmpty = row.filter((cell) => cell.trim() !== "");
    if (nonEmpty.length < 2) return false;
    return nonEmpty.length >= row.length * 0.4;
  };

  let i = 0;

  while (i < data.length && isBlankRow(data[i])) i++;

  if (i >= data.length) return [];

  let sectionCount = 0;

  while (i < data.length) {
    while (i < data.length && isBlankRow(data[i])) i++;
    if (i >= data.length) break;

    sectionCount++;
    let sectionName = `Section ${sectionCount}`;
    let headerRowIndex = i;
    let columns: string[];

    if (isSectionTitleRow(data[i])) {
      sectionName =
        data[i].find((cell) => cell.trim() !== "")?.trim() ?? sectionName;
      headerRowIndex = i;
      i++;

      while (i < data.length && isBlankRow(data[i])) i++;

      if (i >= data.length) {
        sections.push({
          name: sectionName,
          headerRowIndex,
          columns: [],
          rows: [],
        });
        break;
      }

      columns = data[i].map((cell) => cell.trim());
      i++;
    } else if (isHeaderLikeRow(data[i])) {
      columns = data[i].map((cell) => cell.trim());
      i++;
    } else {
      columns = data[i].map((_, idx) => `Column ${idx + 1}`);
    }

    const rows: string[][] = [];
    while (i < data.length && !isBlankRow(data[i])) {
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
// Auto-suggest mapping logic
// ---------------------------------------------------------------------------

/**
 * Given a CSV column header string, try to auto-suggest a target field.
 * Returns the target field name or "" if no match.
 */
function autoSuggestField(columnHeader: string): TargetField | "" {
  const lower = columnHeader.toLowerCase().trim();

  // S3 URI / key patterns -- match video first, then annotation, then specs
  if (
    lower.includes("video") &&
    (lower.includes("s3") || lower.includes("uri") || lower.includes("key") || lower.includes("path"))
  ) {
    return "video_s3_key";
  }
  if (
    lower.includes("annotation") &&
    (lower.includes("s3") || lower.includes("uri") || lower.includes("key") || lower.includes("path"))
  ) {
    return "annotation_s3_key";
  }
  if (
    lower.includes("spec") &&
    (lower.includes("s3") || lower.includes("uri") || lower.includes("key") || lower.includes("path"))
  ) {
    return "specs_s3_key";
  }

  // Broader fallbacks for s3 columns without specific modality
  if (lower.includes("s3") && lower.includes("video")) return "video_s3_key";
  if (lower.includes("s3") && lower.includes("annot")) return "annotation_s3_key";
  if (lower.includes("s3") && lower.includes("spec")) return "specs_s3_key";

  // Direct field name matches
  if (lower === "video_s3_key" || lower === "video s3 key") return "video_s3_key";
  if (lower === "annotation_s3_key" || lower === "annotation s3 key") return "annotation_s3_key";
  if (lower === "specs_s3_key" || lower === "specs s3 key") return "specs_s3_key";

  // Type / category / subcategory
  if (lower === "type" || lower === "dataset_type" || lower === "dataset type") return "type";
  if (lower === "category" || lower === "category_id" || lower === "dataset_category") return "category";
  if (lower === "subcategory" || lower === "sub_category" || lower === "sub category") return "subcategory";

  // Annotation ID
  if (
    lower === "annotation_id" ||
    lower === "annotation id" ||
    lower === "annot_id" ||
    (lower.includes("annotation") && lower.includes("id"))
  ) {
    return "annotation_id";
  }

  // Metadata JSON
  if (
    lower === "metadata_json" ||
    lower === "metadata" ||
    lower === "meta" ||
    lower.includes("metadata")
  ) {
    return "metadata_json";
  }

  return "";
}

/**
 * Build initial column mappings for all sections using auto-suggest.
 */
function buildInitialMappings(sections: DetectedSection[]): SectionMapping[] {
  return sections.map((section) => {
    const columnMap: Record<number, TargetField | ""> = {};
    const usedFields = new Set<TargetField>();

    // First pass: auto-suggest and avoid duplicate target assignments
    section.columns.forEach((col, idx) => {
      const suggestion = autoSuggestField(col);
      if (suggestion && !usedFields.has(suggestion)) {
        columnMap[idx] = suggestion;
        usedFields.add(suggestion);
      } else {
        columnMap[idx] = "";
      }
    });

    return {
      columnMap,
      datasetId: "",
      stripS3Prefix: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Step 3 Helpers — Transform + Validate
// ---------------------------------------------------------------------------

function stripS3PrefixFn(val: string): string {
  return val.replace(/^s3:\/\/[^/]+\//, "");
}

function guessFileMimeType(key: string | null): string {
  if (!key) return "application/octet-stream";
  const ext = key.split("?")[0].split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    json: "application/json",
    gz: "application/gzip",
  };
  return (ext && mimeMap[ext]) || "application/octet-stream";
}

function buildParsedSamples(
  parseState: ParseState,
  sectionMappings: SectionMapping[],
  datasets: DatasetOption[]
): ParsedSample[] {
  const allSamples: ParsedSample[] = [];

  parseState.sections.forEach((section, sectionIdx) => {
    const mapping = sectionMappings[sectionIdx];
    if (!mapping) return;

    // Build reverse map: TargetField -> column index
    const fieldToCol: Partial<Record<TargetField, number>> = {};
    Object.entries(mapping.columnMap).forEach(([colIdxStr, field]) => {
      if (field) fieldToCol[field as TargetField] = Number(colIdxStr);
    });

    const getCell = (row: string[], field: TargetField): string | null => {
      const colIdx = fieldToCol[field];
      if (colIdx === undefined) return null;
      const v = row[colIdx]?.trim() ?? "";
      return v || null;
    };

    const maybeStrip = (val: string | null): string | null => {
      if (!val || !mapping.stripS3Prefix) return val;
      return stripS3PrefixFn(val);
    };

    const datasetName =
      datasets.find((d) => d.id === mapping.datasetId)?.name ??
      mapping.datasetId;

    const annotationIdsSeen = new Map<string, number>();

    section.rows.forEach((row, rowIdx) => {
      const video_s3_key = maybeStrip(getCell(row, "video_s3_key"));
      const annotation_s3_key = maybeStrip(getCell(row, "annotation_s3_key"));
      const specs_s3_key = maybeStrip(getCell(row, "specs_s3_key"));
      const type = getCell(row, "type");
      const category = getCell(row, "category");
      const subcategory = getCell(row, "subcategory");
      const annotation_id = getCell(row, "annotation_id");
      const metadata_json_raw = getCell(row, "metadata_json");

      const filename =
        video_s3_key?.split("/").pop()?.split("?")[0] ?? `row-${rowIdx + 1}`;
      const mime_type = guessFileMimeType(video_s3_key);

      const errors: string[] = [];
      const warnings: string[] = [];

      if (!video_s3_key) errors.push("video_s3_key is required");

      if (!mapping.datasetId || mapping.datasetId === "__new__") {
        warnings.push("No target dataset selected");
      }

      if (annotation_id) {
        if (annotationIdsSeen.has(annotation_id)) {
          errors.push(
            `Duplicate annotation_id '${annotation_id}' (first seen row ${annotationIdsSeen.get(annotation_id)})`
          );
        } else {
          annotationIdsSeen.set(annotation_id, rowIdx + 1);
        }
      }

      allSamples.push({
        sectionName: section.name,
        datasetId: mapping.datasetId,
        datasetName,
        rowNumber: rowIdx + 1,
        video_s3_key,
        annotation_s3_key,
        specs_s3_key,
        type,
        category,
        subcategory,
        annotation_id,
        metadata_json_raw,
        filename,
        mime_type,
        errors,
        warnings,
      });
    });
  });

  return allSamples;
}

function toBulkPayload(samples: ParsedSample[]): object[] {
  return samples.map((s) => {
    const metadata: Record<string, unknown> = {};
    if (s.type) metadata.type = s.type;
    if (s.category) metadata.category = s.category;
    if (s.subcategory) metadata.subcategory = s.subcategory;
    if (s.annotation_id) metadata.annotation_id = s.annotation_id;
    if (s.metadata_json_raw) {
      try {
        const parsed = JSON.parse(s.metadata_json_raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          Object.assign(metadata, parsed);
        }
      } catch {
        // ignore invalid JSON
      }
    }
    return {
      media_url: s.video_s3_key
        ? `https://s3-import.placeholder/${s.video_s3_key}`
        : "https://s3-import.placeholder/unknown",
      s3_object_key: s.video_s3_key ?? null,
      s3_annotation_key: s.annotation_s3_key ?? null,
      s3_specs_key: s.specs_s3_key ?? null,
      mime_type: s.mime_type,
      metadata_json: metadata,
    };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminCatalogImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state: 1 = upload/parse, 2 = column mapping, 3 = validate, 4 = import
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 state
  const [isDragOver, setIsDragOver] = useState(false);
  const [parseState, setParseState] = useState<ParseState | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // Step 2 state
  const [sectionMappings, setSectionMappings] = useState<SectionMapping[]>([]);
  const [datasets, setDatasets] = useState<DatasetOption[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);

  // Step 3 state
  const [parsedSamples, setParsedSamples] = useState<ParsedSample[]>([]);

  // Step 4 state
  const [importResults, setImportResults] = useState<DatasetImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch datasets for the selector
  // ---------------------------------------------------------------------------

  const fetchDatasets = useCallback(async () => {
    setDatasetsLoading(true);
    setDatasetsError(null);
    try {
      const res = await fetch("/api/admin/catalog");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? `HTTP ${res.status}`
        );
      }
      const body = (await res.json()) as { datasets: DatasetOption[] };
      setDatasets(body.datasets ?? []);
    } catch (err) {
      setDatasetsError(
        err instanceof Error ? err.message : "Failed to load datasets"
      );
    } finally {
      setDatasetsLoading(false);
    }
  }, []);

  // Fetch datasets when entering Step 2
  useEffect(() => {
    if (step === 2) {
      fetchDatasets();
    }
  }, [step, fetchDatasets]);

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

        const nonBlankRows = rawData.filter(
          (row) => !row.every((cell) => cell.trim() === "")
        );

        const sections = detectSections(rawData);

        if (sections.length === 0) {
          setParseError(
            "No sections detected -- file may be empty or contain only blank rows"
          );
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
    setStep(1);
    setSectionMappings([]);
    setParsedSamples([]);
    setImportResults([]);
    setIsImporting(false);
    setImportDone(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Step navigation
  // ---------------------------------------------------------------------------

  const handleNextToStep2 = useCallback(() => {
    if (!parseState) return;
    // Build initial mappings from auto-suggest
    setSectionMappings(buildInitialMappings(parseState.sections));
    setStep(2);
  }, [parseState]);

  const handleBackToStep1 = useCallback(() => {
    setStep(1);
    // Keep sectionMappings in state so the user doesn't lose work if they go back
  }, []);

  const handleNextToStep3 = useCallback(() => {
    if (!parseState) return;
    const samples = buildParsedSamples(parseState, sectionMappings, datasets);
    setParsedSamples(samples);
    setStep(3);
  }, [parseState, sectionMappings, datasets]);

  const handleBackToStep2 = useCallback(() => {
    setStep(2);
  }, []);

  const handleBackToStep3 = useCallback(() => {
    if (isImporting) return;
    setImportResults([]);
    setImportDone(false);
    setStep(3);
  }, [isImporting]);

  const handleStartImport = useCallback(async () => {
    if (isImporting) return;

    // Only import samples with no errors and a valid dataset
    const readySamples = parsedSamples.filter(
      (s) => s.errors.length === 0 && s.datasetId && s.datasetId !== "__new__"
    );
    if (readySamples.length === 0) return;

    // Group by datasetId
    const groupMap = new Map<string, ParsedSample[]>();
    readySamples.forEach((s) => {
      const existing = groupMap.get(s.datasetId) ?? [];
      groupMap.set(s.datasetId, [...existing, s]);
    });

    // Build initial results state
    const initialResults: DatasetImportResult[] = Array.from(
      groupMap.entries()
    ).map(([datasetId, samples]) => ({
      datasetId,
      datasetName: samples[0].datasetName,
      sampleCount: samples.length,
      status: "pending",
      inserted: 0,
      failed: 0,
    }));

    setImportResults(initialResults);
    setIsImporting(true);
    setImportDone(false);
    setStep(4);

    // Process datasets sequentially
    for (const [datasetId, samples] of groupMap.entries()) {
      setImportResults((prev) =>
        prev.map((r) =>
          r.datasetId === datasetId ? { ...r, status: "importing" } : r
        )
      );

      try {
        const payload = toBulkPayload(samples);
        const res = await fetch(
          `/api/admin/catalog/${datasetId}/samples/bulk`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ samples: payload }),
          }
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`
          );
        }

        const body = (await res.json()) as {
          inserted: number;
          errors: { index: number; error: string }[];
        };

        setImportResults((prev) =>
          prev.map((r) =>
            r.datasetId === datasetId
              ? {
                  ...r,
                  status: "done",
                  inserted: body.inserted,
                  failed: body.errors?.length ?? 0,
                }
              : r
          )
        );
      } catch (err) {
        setImportResults((prev) =>
          prev.map((r) =>
            r.datasetId === datasetId
              ? {
                  ...r,
                  status: "error",
                  errorMessage:
                    err instanceof Error ? err.message : "Unknown error",
                }
              : r
          )
        );
      }
    }

    setIsImporting(false);
    setImportDone(true);
  }, [isImporting, parsedSamples]);

  // ---------------------------------------------------------------------------
  // Mapping update helpers
  // ---------------------------------------------------------------------------

  const updateColumnMapping = useCallback(
    (sectionIdx: number, colIdx: number, value: TargetField | "") => {
      setSectionMappings((prev) => {
        const next = [...prev];
        const mapping = { ...next[sectionIdx] };
        mapping.columnMap = { ...mapping.columnMap, [colIdx]: value };
        next[sectionIdx] = mapping;
        return next;
      });
    },
    []
  );

  const updateDatasetId = useCallback(
    (sectionIdx: number, value: string) => {
      setSectionMappings((prev) => {
        const next = [...prev];
        next[sectionIdx] = { ...next[sectionIdx], datasetId: value };
        return next;
      });
    },
    []
  );

  const updateStripS3Prefix = useCallback(
    (sectionIdx: number, value: boolean) => {
      setSectionMappings((prev) => {
        const next = [...prev];
        next[sectionIdx] = { ...next[sectionIdx], stripS3Prefix: value };
        return next;
      });
    },
    []
  );

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

      {/* Step indicator */}
      <div className="border-b border-[var(--border-subtle)] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs font-mono">
          <span
            className={
              step === 1
                ? "text-[var(--accent-primary)] font-semibold"
                : "text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
            }
            onClick={step === 2 ? handleBackToStep1 : undefined}
            role={step === 2 ? "button" : undefined}
            tabIndex={step === 2 ? 0 : undefined}
            onKeyDown={
              step === 2
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") handleBackToStep1();
                  }
                : undefined
            }
          >
            1. Upload &amp; Parse
          </span>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span
            className={
              step === 2
                ? "text-[var(--accent-primary)] font-semibold"
                : "text-[var(--text-muted)]"
            }
          >
            2. Column Mapping
          </span>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span
            className={
              step === 3
                ? "text-[var(--accent-primary)] font-semibold"
                : step === 4
                ? "text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
                : "text-[var(--text-muted)]"
            }
            onClick={step === 4 ? handleBackToStep3 : undefined}
            role={step === 4 ? "button" : undefined}
            tabIndex={step === 4 ? 0 : undefined}
            onKeyDown={
              step === 4
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") handleBackToStep3();
                  }
                : undefined
            }
          >
            3. Validate
          </span>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span
            className={
              step === 4
                ? "text-[var(--accent-primary)] font-semibold"
                : "text-[var(--text-muted)]"
            }
          >
            4. Import
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* ============================================================== */}
        {/* STEP 1: Upload & Parse                                         */}
        {/* ============================================================== */}
        {step === 1 && (
          <>
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
                        {parseState.sections.length === 1
                          ? "section"
                          : "sections"}{" "}
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
                            {section.columns.length === 1
                              ? "column"
                              : "columns"}
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
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors duration-150"
                  >
                    [upload different file]
                  </button>
                  <button
                    onClick={handleNextToStep2}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:brightness-110 transition-all duration-150"
                  >
                    Next: Column Mapping
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* STEP 2: Column Mapping                                         */}
        {/* ============================================================== */}
        {step === 2 && parseState && (
          <>
            {/* Page title */}
            <div>
              <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
                Column Mapping
              </h2>
              <p className="text-sm font-mono text-[var(--text-muted)]">
                Map CSV columns to dataset fields for each section. Step 2 of 4.
              </p>
            </div>

            {/* File info reminder */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {parseState.fileName}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {parseState.sections.length}{" "}
                  {parseState.sections.length === 1 ? "section" : "sections"}
                </span>
              </div>
            </div>

            {/* Dataset fetch error */}
            {datasetsError && (
              <div className="flex items-start gap-3 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/5 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-[var(--error)] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-mono text-[var(--error)]">
                    Failed to load datasets: {datasetsError}
                  </p>
                  <button
                    onClick={fetchDatasets}
                    className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    [retry]
                  </button>
                </div>
              </div>
            )}

            {/* Section Mapping Cards */}
            {parseState.sections.map((section, sectionIdx) => (
              <SectionMappingCard
                key={sectionIdx}
                section={section}
                sectionIndex={sectionIdx}
                mapping={sectionMappings[sectionIdx]}
                datasets={datasets}
                datasetsLoading={datasetsLoading}
                onColumnMappingChange={updateColumnMapping}
                onDatasetChange={updateDatasetId}
                onStripS3PrefixChange={updateStripS3Prefix}
              />
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleBackToStep1}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors duration-150"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to Upload
              </button>
              <button
                onClick={handleNextToStep3}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)]/90 transition-colors duration-150"
              >
                Next: Validate
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* STEP 3: Preview & Validate                                      */}
        {/* ============================================================== */}
        {step === 3 && parseState && (
          <>
            <div>
              <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
                Preview &amp; Validate
              </h2>
              <p className="text-sm font-mono text-[var(--text-muted)]">
                Review parsed samples and validation results. Step 3 of 4.
              </p>
            </div>

            {/* Summary stats */}
            {(() => {
              const readyCount = parsedSamples.filter(
                (s) => s.errors.length === 0
              ).length;
              const warnCount = parsedSamples.filter(
                (s) => s.errors.length === 0 && s.warnings.length > 0
              ).length;
              const errorCount = parsedSamples.filter(
                (s) => s.errors.length > 0
              ).length;
              return (
                <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
                  <span className="text-xs font-mono">
                    <span className="text-[var(--accent-primary)] font-semibold">
                      {readyCount}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {" "}
                      samples ready
                    </span>
                  </span>
                  {warnCount > 0 && (
                    <span className="text-xs font-mono">
                      <span
                        className="font-semibold"
                        style={{ color: "var(--warning)" }}
                      >
                        {warnCount}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        {" "}
                        warnings
                      </span>
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-xs font-mono">
                      <span className="text-[var(--error)] font-semibold">
                        {errorCount}
                      </span>
                      <span className="text-[var(--text-muted)]"> errors</span>
                    </span>
                  )}
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {parsedSamples.length} total
                  </span>
                </div>
              );
            })()}

            {/* Sample table */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                      <th className="text-left px-3 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">
                        Section
                      </th>
                      <th className="text-left px-3 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium w-12">
                        Row
                      </th>
                      <th className="text-left px-3 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                        Filename
                      </th>
                      <th className="text-left px-3 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                        Dataset
                      </th>
                      <th className="text-left px-3 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedSamples.map((sample, idx) => {
                      const hasError = sample.errors.length > 0;
                      const hasWarning =
                        !hasError && sample.warnings.length > 0;
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-[var(--border-subtle)] last:border-b-0 ${
                            hasError
                              ? "bg-[var(--error)]/5"
                              : hasWarning
                              ? "bg-[var(--warning)]/5"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2 text-[var(--text-muted)] whitespace-nowrap">
                            {sample.sectionName}
                          </td>
                          <td className="px-3 py-2 text-[var(--text-muted)] tabular-nums">
                            {sample.rowNumber}
                          </td>
                          <td className="px-3 py-2 text-[var(--text-secondary)] max-w-[200px] truncate">
                            {sample.filename}
                          </td>
                          <td className="px-3 py-2 max-w-[150px] truncate">
                            {sample.datasetName ? (
                              <span className="text-[var(--text-secondary)]">
                                {sample.datasetName}
                              </span>
                            ) : (
                              <span className="text-[var(--error)] italic">
                                not set
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {hasError ? (
                              <div className="flex items-start gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-[var(--error)] mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  {sample.errors.map((e, ei) => (
                                    <p
                                      key={ei}
                                      className="text-[var(--error)] leading-tight"
                                    >
                                      {e}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ) : hasWarning ? (
                              <div className="flex items-start gap-1.5">
                                <AlertCircle
                                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                                  style={{ color: "var(--warning)" }}
                                />
                                <div className="space-y-0.5">
                                  {sample.warnings.map((w, wi) => (
                                    <p
                                      key={wi}
                                      className="leading-tight"
                                      style={{ color: "var(--warning)" }}
                                    >
                                      {w}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                                <span className="text-[var(--accent-primary)]">
                                  ready
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigation */}
            {(() => {
              const readyCount = parsedSamples.filter(
                (s) =>
                  s.errors.length === 0 &&
                  s.datasetId &&
                  s.datasetId !== "__new__"
              ).length;
              const errorCount = parsedSamples.filter(
                (s) => s.errors.length > 0
              ).length;
              return (
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleBackToStep2}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-md border border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors duration-150"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Mapping
                  </button>
                  <button
                    onClick={handleStartImport}
                    disabled={readyCount === 0}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-md transition-colors duration-150 ${
                      readyCount > 0
                        ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)]/90"
                        : "bg-[var(--accent-primary)]/40 text-[var(--bg-primary)] cursor-not-allowed"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Import {readyCount} sample{readyCount !== 1 ? "s" : ""}
                    {errorCount > 0 && ` (${errorCount} skipped)`}
                  </button>
                </div>
              );
            })()}
          </>
        )}

        {/* ============================================================== */}
        {/* STEP 4: Execute Import                                          */}
        {/* ============================================================== */}
        {step === 4 && (
          <>
            <div>
              <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)] mb-1">
                {importDone ? "Import Complete" : "Importing..."}
              </h2>
              <p className="text-sm font-mono text-[var(--text-muted)]">
                {importDone
                  ? "All imports have finished."
                  : "Importing samples into the database. Do not close this page."}
              </p>
            </div>

            {/* Per-dataset status */}
            <div className="space-y-3">
              {importResults.map((result, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.status === "pending" && (
                        <div className="w-4 h-4 rounded-full border border-[var(--border-medium)]" />
                      )}
                      {result.status === "importing" && (
                        <Loader2 className="w-4 h-4 text-[var(--accent-primary)] animate-spin" />
                      )}
                      {result.status === "done" && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                      )}
                      {result.status === "error" && (
                        <XCircle className="w-4 h-4 text-[var(--error)]" />
                      )}
                      <div>
                        <p className="text-sm font-mono font-medium text-[var(--text-primary)]">
                          {result.datasetName}
                        </p>
                        <p className="text-[10px] font-mono text-[var(--text-muted)]">
                          {result.sampleCount} sample
                          {result.sampleCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {result.status === "pending" && (
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          waiting
                        </span>
                      )}
                      {result.status === "importing" && (
                        <span className="text-xs font-mono text-[var(--accent-primary)]">
                          importing...
                        </span>
                      )}
                      {result.status === "done" && (
                        <div>
                          <span className="text-xs font-mono text-[var(--accent-primary)]">
                            {result.inserted} imported
                          </span>
                          {result.failed > 0 && (
                            <span className="ml-2 text-xs font-mono text-[var(--error)]">
                              {result.failed} failed
                            </span>
                          )}
                        </div>
                      )}
                      {result.status === "error" && (
                        <span className="text-xs font-mono text-[var(--error)]">
                          {result.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary and reset when done */}
            {importDone && (() => {
              const totalInserted = importResults.reduce(
                (sum, r) => sum + r.inserted,
                0
              );
              const totalFailed = importResults.reduce(
                (sum, r) => sum + r.failed,
                0
              );
              const totalError = importResults.filter(
                (r) => r.status === "error"
              ).length;
              return (
                <>
                  <div className="rounded-lg border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-4 py-3">
                    <p className="text-sm font-mono text-[var(--text-primary)]">
                      <span className="text-[var(--accent-primary)] font-semibold">
                        {totalInserted}
                      </span>{" "}
                      imported
                      {totalFailed > 0 && (
                        <span className="ml-3 text-[var(--error)]">
                          {totalFailed} failed
                        </span>
                      )}
                      {totalError > 0 && (
                        <span className="ml-3 text-[var(--error)]">
                          {totalError} dataset{totalError !== 1 ? "s" : ""}{" "}
                          errored
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-md border border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors duration-150"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Import Another File
                    </button>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Preview Sub-component (Step 1)
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

// ---------------------------------------------------------------------------
// Section Mapping Card Sub-component (Step 2)
// ---------------------------------------------------------------------------

interface SectionMappingCardProps {
  section: DetectedSection;
  sectionIndex: number;
  mapping: SectionMapping | undefined;
  datasets: DatasetOption[];
  datasetsLoading: boolean;
  onColumnMappingChange: (
    sectionIdx: number,
    colIdx: number,
    value: TargetField | ""
  ) => void;
  onDatasetChange: (sectionIdx: number, value: string) => void;
  onStripS3PrefixChange: (sectionIdx: number, value: boolean) => void;
}

function SectionMappingCard({
  section,
  sectionIndex,
  mapping,
  datasets,
  datasetsLoading,
  onColumnMappingChange,
  onDatasetChange,
  onStripS3PrefixChange,
}: SectionMappingCardProps) {
  const [expanded, setExpanded] = useState(true);

  if (!mapping) return null;

  // Count how many columns are mapped
  const mappedCount = Object.values(mapping.columnMap).filter(
    (v) => v !== ""
  ).length;

  // Find already-assigned target fields in this section to prevent duplicates
  const usedTargetFields = new Set<string>(
    Object.values(mapping.columnMap).filter((v) => v !== "")
  );

  // Sample value for each column (first non-empty value from the first data row)
  const sampleRow = section.rows[0] ?? [];

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Card header */}
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
          <Columns3 className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-mono font-medium text-[var(--text-primary)]">
            {section.name}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            ({section.rows.length.toLocaleString()}{" "}
            {section.rows.length === 1 ? "row" : "rows"})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {mappedCount}/{section.columns.length} mapped
          </span>
          <span className="text-xs font-mono text-[var(--accent-primary)]">
            Section {sectionIndex + 1}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)]">
          {/* Dataset selector + Strip S3 prefix toggle */}
          <div className="px-4 py-4 space-y-4 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
            {/* Dataset selector */}
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-[var(--text-muted)] mt-1 shrink-0" />
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-mono font-medium text-[var(--text-secondary)]">
                  Target Dataset
                </label>
                <select
                  value={mapping.datasetId}
                  onChange={(e) =>
                    onDatasetChange(sectionIndex, e.target.value)
                  }
                  disabled={datasetsLoading}
                  className="w-full max-w-md px-3 py-2 text-xs font-mono rounded-md border border-[var(--border-medium)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 disabled:opacity-50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">
                    {datasetsLoading
                      ? "loading datasets..."
                      : "-- select dataset --"}
                  </option>
                  <option value="__new__">+ Create new dataset</option>
                  {datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name} ({ds.slug})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] font-mono text-[var(--text-muted)]">
                  Choose an existing dataset or create a new one for this
                  section.
                </p>
              </div>
            </div>

            {/* Strip S3 prefix toggle */}
            <div className="flex items-start gap-3">
              <Scissors className="w-4 h-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={mapping.stripS3Prefix}
                    onChange={(e) =>
                      onStripS3PrefixChange(sectionIndex, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 rounded-full border border-[var(--border-medium)] bg-[var(--bg-primary)] peer-checked:bg-[var(--accent-primary)]/20 peer-checked:border-[var(--accent-primary)] transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-[var(--text-muted)] peer-checked:translate-x-4 peer-checked:bg-[var(--accent-primary)] transition-all" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    Strip S3 prefix
                  </span>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    Auto-strip &apos;s3://bucket-name/&apos; from S3 URI
                    columns to extract object keys
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Column mapping table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium w-10">
                    #
                  </th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                    CSV Column
                  </th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium max-w-[250px]">
                    Sample Value
                  </th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] uppercase tracking-wider font-medium">
                    Map To Field
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.columns.map((col, colIdx) => {
                  const currentValue = mapping.columnMap[colIdx] ?? "";
                  const sampleValue = sampleRow[colIdx]?.trim() ?? "";

                  return (
                    <tr
                      key={colIdx}
                      className={`border-b border-[var(--border-subtle)] last:border-b-0 ${
                        currentValue
                          ? "bg-[var(--accent-primary)]/3"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-[var(--text-muted)] tabular-nums">
                        {colIdx + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[var(--text-primary)] font-medium">
                          {col || (
                            <span className="italic text-[var(--text-muted)]">
                              (empty)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 max-w-[250px] truncate text-[var(--text-muted)]">
                        {sampleValue || (
                          <span className="italic">--</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={currentValue}
                          onChange={(e) =>
                            onColumnMappingChange(
                              sectionIndex,
                              colIdx,
                              e.target.value as TargetField | ""
                            )
                          }
                          className={`w-full max-w-[220px] px-2 py-1.5 text-xs font-mono rounded border bg-[var(--bg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-colors appearance-none cursor-pointer ${
                            currentValue
                              ? "border-[var(--accent-primary)]/50 text-[var(--accent-primary)]"
                              : "border-[var(--border-medium)] text-[var(--text-muted)]"
                          }`}
                        >
                          <option value="">-- skip --</option>
                          {TARGET_FIELDS.map((field) => {
                            const isUsedElsewhere =
                              usedTargetFields.has(field.value) &&
                              currentValue !== field.value;
                            return (
                              <option
                                key={field.value}
                                value={field.value}
                                disabled={isUsedElsewhere}
                              >
                                {field.label}
                                {isUsedElsewhere ? " (already mapped)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mapping summary footer */}
          <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              {mappedCount} of {section.columns.length} columns mapped
              {mapping.stripS3Prefix && (
                <span className="ml-2 text-[var(--accent-primary)]">
                  S3 prefix stripping enabled
                </span>
              )}
            </p>
            {mapping.datasetId === "__new__" && (
              <span className="text-[10px] font-mono text-[var(--warning)]">
                new dataset will be created
              </span>
            )}
            {mapping.datasetId &&
              mapping.datasetId !== "__new__" && (
                <span className="text-[10px] font-mono text-[var(--accent-primary)]">
                  importing to:{" "}
                  {datasets.find((d) => d.id === mapping.datasetId)?.name ??
                    mapping.datasetId}
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
