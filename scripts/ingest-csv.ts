/**
 * CSV Ingestion Script (US-012)
 *
 * Transforms "Data Catalog Samples.csv" into bulk-import JSON files,
 * one per dataset group. Outputs to scripts/output/.
 *
 * Run with:
 *   npx tsx scripts/ingest-csv.ts
 *   npx tsx scripts/ingest-csv.ts --dry-run
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const S3_PREFIX = "s3://moonvalley-annotation-platform/";

const SECTION_TITLES = [
  "Egocentric Crowd",
  "Egocentric Workplaces",
  "Video Game",
  "Cinematic Licensed Data",
] as const;

type SectionTitle = (typeof SECTION_TITLES)[number];

// ---------------------------------------------------------------------------
// Output record shape
// ---------------------------------------------------------------------------

interface OutputRecord {
  filename: string;
  s3_object_key: string;
  s3_annotation_key: string | null;
  mime_type: string;
  metadata_json: {
    section: string;
    type: string;
    category: string;
    subcategory: string;
    annotation_id: string | null;
    reka_vision_metadata?: Record<string, unknown>;
    reka_vision_chunking?: unknown[];
  };
}

// ---------------------------------------------------------------------------
// CSV Parsing Utilities
// ---------------------------------------------------------------------------

/**
 * Parse a single CSV line respecting quoted fields (including double-double
 * quote escaping used for inline JSON). Returns an array of field values.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote (double-double quote)
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      current += ch;
      i++;
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ",") {
        fields.push(current);
        current = "";
        i++;
        continue;
      }
      current += ch;
      i++;
    }
  }

  // Push final field
  fields.push(current);
  return fields;
}

/**
 * Read and parse the entire CSV file into an array of string arrays.
 */
function readCsv(filePath: string): string[][] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  return lines.map(parseCsvLine);
}

// ---------------------------------------------------------------------------
// MIME Type Detection
// ---------------------------------------------------------------------------

function guessMimeType(filePath: string): string {
  // Strip any trailing whitespace from path before extracting extension
  const cleanPath = filePath.trim();
  const lastDot = cleanPath.lastIndexOf(".");
  if (lastDot === -1) return "application/octet-stream";

  const ext = cleanPath.slice(lastDot + 1).toLowerCase();
  const mimeMap: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    json: "application/json",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
  };

  return mimeMap[ext] ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// S3 Key Extraction
// ---------------------------------------------------------------------------

/**
 * Strip the S3 bucket prefix to produce the object key.
 * Returns null for empty/missing URIs.
 */
function extractS3Key(uri: string | undefined): string | null {
  if (!uri) return null;
  const trimmed = uri.trim();
  if (!trimmed || !trimmed.startsWith(S3_PREFIX)) return null;
  return trimmed.slice(S3_PREFIX.length);
}

/**
 * Extract the filename from an S3 URI or object key.
 */
function extractFilename(s3ObjectKey: string): string {
  const parts = s3ObjectKey.split("/");
  return parts[parts.length - 1] || s3ObjectKey;
}

// ---------------------------------------------------------------------------
// Annotation ID normalization
// ---------------------------------------------------------------------------

function normalizeAnnotationId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === "na" || trimmed === "n/a" || trimmed === "") return null;
  return raw.trim();
}

// ---------------------------------------------------------------------------
// JSON parsing for inline metadata columns
// ---------------------------------------------------------------------------

/**
 * Attempt to parse inline JSON from a CSV field. The CSV uses double-double
 * quotes for escaping, which parseCsvLine already handles. Some fields may
 * contain partial JSON (e.g. metadata column ends with a comma and chunking
 * column starts with the continuation). This function handles both complete
 * and partial JSON objects.
 */
function parseInlineJson(
  raw: string | undefined
): Record<string, unknown> | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    // Try wrapping in braces if it looks like object content
    // Some fields may be partial JSON (missing opening/closing brace)
    const withBraces = trimmed.startsWith("{") ? trimmed : `{${trimmed}}`;
    try {
      const parsed = JSON.parse(
        withBraces.endsWith(",}")
          ? withBraces.slice(0, -2) + "}"
          : withBraces
      );
      return typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
}

/**
 * Parse the chunking column which may contain a JSON fragment starting with
 * `"chunking": [...]`. Returns the chunking array or null.
 */
function parseChunkingJson(raw: string | undefined): unknown[] | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Try parsing as-is first (complete JSON object)
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null && "chunking" in parsed) {
      return Array.isArray(parsed.chunking) ? parsed.chunking : null;
    }
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    // Wrap in braces to make it valid JSON
    const wrapped = `{${trimmed}}`;
    try {
      const cleaned = wrapped.endsWith(", }")
        ? wrapped.slice(0, -3) + "}"
        : wrapped;
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === "object" && parsed !== null && "chunking" in parsed) {
        return Array.isArray(parsed.chunking) ? parsed.chunking : null;
      }
      return null;
    } catch {
      return null;
    }
  }
}

/**
 * Merge the two Reka Vision CSV columns (Metadata & Labeling + Chunking)
 * into a single parsed JSON object. The CSV splits a single JSON object
 * across two columns: the first column contains the object body (often
 * ending with a trailing comma) and the second column contains the
 * "chunking" key/value continuation.
 *
 * Returns null if both columns are empty or unparseable.
 */
function mergeRekaVisionColumns(
  metadataRaw: string,
  chunkingRaw: string
): Record<string, unknown> | null {
  if (!metadataRaw && !chunkingRaw) return null;

  // If only metadata column has content, try parsing it standalone
  if (metadataRaw && !chunkingRaw) {
    return parseInlineJson(metadataRaw);
  }

  // If only chunking column has content, wrap and parse
  if (!metadataRaw && chunkingRaw) {
    const wrapped = `{${chunkingRaw}}`;
    try {
      const parsed = JSON.parse(wrapped);
      return typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  // Both columns have content -- merge them.
  // The CSV splits a single JSON object across two columns. The metadata
  // column may be missing closing braces (e.g. the "hands" sub-object is
  // not closed). We need to:
  // 1. Count brace imbalance in the metadata column
  // 2. Close any open sub-objects before appending the chunking column
  // 3. Combine into one valid JSON object

  let metaPart = metadataRaw;

  // Count brace imbalance in metadata column
  let openBraces = 0;
  for (const ch of metaPart) {
    if (ch === "{") openBraces++;
    if (ch === "}") openBraces--;
  }

  // Close any unclosed sub-objects (keep the root object open)
  // openBraces represents excess opening braces. We want to leave 1
  // unclosed (the root) so we can append the chunking key.
  const bracesToClose = Math.max(0, openBraces - 1);
  metaPart = metaPart.trimEnd();

  // Remove trailing comma
  if (metaPart.endsWith(",")) {
    metaPart = metaPart.slice(0, -1);
  }

  // Add closing braces for unclosed sub-objects
  metaPart += " }".repeat(bracesToClose);

  // Ensure there is a comma separator before the chunking key
  metaPart += ", ";

  // Build the combined JSON string
  let combined = metaPart + chunkingRaw;

  // Count final brace balance and fix if needed
  let finalBalance = 0;
  for (const ch of combined) {
    if (ch === "{") finalBalance++;
    if (ch === "}") finalBalance--;
  }
  if (finalBalance > 0) {
    combined += " }".repeat(finalBalance);
  }

  // Ensure opening brace
  if (!combined.trim().startsWith("{")) {
    combined = "{ " + combined;
  }

  try {
    const parsed = JSON.parse(combined);
    return typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    // Try a more aggressive cleanup: remove trailing commas before } and ]
    try {
      const cleaned = combined
        .replace(/,\s*\}/g, "}")
        .replace(/,\s*\]/g, "]");
      const parsed = JSON.parse(cleaned);
      return typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// Section Detection and Parsing
// ---------------------------------------------------------------------------

interface CsvSection {
  title: SectionTitle;
  headerRow: string[];
  dataRows: string[][];
}

/**
 * Detect section boundaries in the parsed CSV rows.
 * Each section starts with a row whose first non-empty cell matches a section title.
 */
function detectSections(rows: string[][]): CsvSection[] {
  const sections: CsvSection[] = [];
  let i = 0;

  while (i < rows.length) {
    // Look for a section title row
    const firstCell = rows[i][0]?.trim();
    const matchedTitle = SECTION_TITLES.find((t) => firstCell === t);

    if (matchedTitle) {
      // Next non-empty row is the header row (or the title row itself contains
      // headers in subsequent columns). Looking at the CSV, the header row is
      // always the row immediately after the title row. However, for
      // "Egocentric Crowd", the header IS the next row (line 2). For
      // "Egocentric Workplaces", the title row (line 40) has some extra info
      // but the data rows start on line 41. For "Video Game" and "Cinematic
      // Licensed Data", there is an explicit header row after the title.

      i++; // Move past title row

      // Skip any blank rows between title and header
      while (i < rows.length && isBlankRow(rows[i])) {
        i++;
      }

      if (i >= rows.length) break;

      // This row should be the header or the first data row.
      // For sections like "Egocentric Crowd", the header row contains
      // recognizable column names like "Type", "Category", "S3 URI".
      // For "Egocentric Workplaces", the first row after the title IS the
      // header but it also has metadata like "S3 Folder (contains only mp4)".
      // We detect headers by checking if the row contains column-name-like
      // values (non-UUID, non-S3-URI patterns).
      const potentialHeader = rows[i];
      const isHeader = isHeaderRow(potentialHeader);

      let headerRow: string[];
      if (isHeader) {
        headerRow = potentialHeader;
        i++; // Move past header
      } else {
        // No explicit header row; use a default based on section
        headerRow = getDefaultHeader(matchedTitle);
      }

      // Collect data rows until blank row or next section title
      const dataRows: string[][] = [];
      while (i < rows.length) {
        if (isBlankRow(rows[i])) {
          i++;
          break;
        }
        // Check if this row starts a new section
        const cell = rows[i][0]?.trim();
        if (SECTION_TITLES.some((t) => cell === t)) {
          break;
        }
        dataRows.push(rows[i]);
        i++;
      }

      sections.push({ title: matchedTitle, headerRow, dataRows });
    } else {
      i++;
    }
  }

  return sections;
}

function isBlankRow(row: string[]): boolean {
  return row.every((cell) => cell.trim() === "");
}

/**
 * Heuristic to detect header rows: individual cells (not URLs or long text)
 * contain column-name-like strings such as "Type", "Category", "S3 URI", etc.
 * Only considers cells shorter than 60 characters to avoid matching keywords
 * that appear inside S3 URIs or AWS console URLs.
 */
function isHeaderRow(row: string[]): boolean {
  const headerKeywords = [
    "type",
    "category",
    "subcategory",
    "annotation id",
    "s3 uri",
    "s3 folder",
    "genre",
    "game name",
    "metadata",
    "labeling",
    "chunking",
    "source",
    "specs",
  ];
  // Check individual short cells for keyword matches
  let matchCount = 0;
  for (const cell of row) {
    const trimmed = cell.trim().toLowerCase();
    // Skip long cells (URLs, JSON, etc.)
    if (trimmed.length > 60) continue;
    if (trimmed.length === 0) continue;
    if (headerKeywords.some((kw) => trimmed.includes(kw))) {
      matchCount++;
    }
  }
  // Require at least 2 keyword matches to be confident this is a header row
  return matchCount >= 2;
}

function getDefaultHeader(section: SectionTitle): string[] {
  // Fallback headers if no explicit header row is found
  switch (section) {
    case "Egocentric Crowd":
      return [
        "Type",
        "Category",
        "Subcategory",
        "Annotation ID",
        "S3 Folder",
        "S3 URI - Video",
        "S3 URI - JSON",
        "Metadata & Labeling",
        "Chunking",
      ];
    case "Egocentric Workplaces":
      return [
        "Type",
        "Category",
        "Subcategory",
        "Annotation ID",
        "S3 Folder",
        "S3 URI - Video",
      ];
    case "Video Game":
      return [
        "",
        "Genre",
        "Game Name",
        "Annotation ID",
        "S3 Folder",
        "S3 URI - Video",
        "S3 URI - JSON",
        "S3 URI - Specs",
        "Extra Metadata",
      ];
    case "Cinematic Licensed Data":
      return [
        "",
        "Category",
        "Subcategory",
        "",
        "S3 Folder",
        "S3 URI - Video",
      ];
  }
}

// ---------------------------------------------------------------------------
// Column index detection by header name
// ---------------------------------------------------------------------------

interface ColumnIndices {
  type: number;
  category: number;
  subcategory: number;
  annotationId: number;
  s3Video: number;
  s3Annotation: number;
  metadataLabeling: number;
  chunking: number;
  s3Specs: number;
  gameName: number;
  source: number;
}

function findColumnIndex(
  headerRow: string[],
  ...keywords: string[]
): number {
  for (let i = 0; i < headerRow.length; i++) {
    const cell = headerRow[i].trim().toLowerCase();
    if (keywords.some((kw) => cell.includes(kw.toLowerCase()))) {
      return i;
    }
  }
  return -1;
}

function detectColumns(headerRow: string[]): ColumnIndices {
  return {
    type: findColumnIndex(headerRow, "type"),
    category: findColumnIndex(headerRow, "category"),
    subcategory: findColumnIndex(headerRow, "subcategory"),
    annotationId: findColumnIndex(headerRow, "annotation id", "annotation_id"),
    s3Video: findColumnIndex(headerRow, "s3 uri - video"),
    s3Annotation: findColumnIndex(
      headerRow,
      "s3 uri - json",
      "s3 uri - annotation"
    ),
    metadataLabeling: findColumnIndex(
      headerRow,
      "metadata & labeling",
      "metadata"
    ),
    chunking: findColumnIndex(headerRow, "chunking"),
    s3Specs: findColumnIndex(headerRow, "specs", "game/pc"),
    gameName: findColumnIndex(headerRow, "game name"),
    source: findColumnIndex(headerRow, "source"),
  };
}

// ---------------------------------------------------------------------------
// Per-Section Row Processing
// ---------------------------------------------------------------------------

function getCell(row: string[], idx: number): string {
  if (idx < 0 || idx >= row.length) return "";
  return row[idx];
}

function processEgocentricCrowd(
  section: CsvSection
): Map<string, OutputRecord[]> {
  const cols = detectColumns(section.headerRow);
  const groups = new Map<string, OutputRecord[]>();

  for (const row of section.dataRows) {
    const s3VideoUri = getCell(row, cols.s3Video);
    const s3ObjectKey = extractS3Key(s3VideoUri);
    if (!s3ObjectKey) continue;

    const type = getCell(row, cols.type).trim();
    const category = getCell(row, cols.category).trim();
    const subcategory = getCell(row, cols.subcategory).trim();
    const annotationId = normalizeAnnotationId(
      getCell(row, cols.annotationId)
    );
    const s3AnnotationUri = getCell(row, cols.s3Annotation);
    const s3AnnotationKey = extractS3Key(s3AnnotationUri);

    // Parse inline JSON metadata columns.
    // The CSV splits a single JSON object across two columns: the Metadata
    // column contains the object body (potentially ending with a trailing
    // comma) and the Chunking column contains the "chunking" key/array.
    // We first try to merge them back into a single JSON object.
    const metadataRaw = getCell(row, cols.metadataLabeling).trim();
    const chunkingRaw = getCell(row, cols.chunking).trim();

    const metadataJson: OutputRecord["metadata_json"] = {
      section: "Egocentric Crowd",
      type,
      category,
      subcategory,
      annotation_id: annotationId,
    };

    const merged = mergeRekaVisionColumns(metadataRaw, chunkingRaw);
    if (merged) {
      // Extract chunking array from the merged object, put the rest in metadata
      const { chunking, ...rest } = merged;
      if (Object.keys(rest).length > 0) {
        metadataJson.reka_vision_metadata = rest;
      }
      if (Array.isArray(chunking) && chunking.length > 0) {
        metadataJson.reka_vision_chunking = chunking;
      }
    } else {
      // Fallback: try parsing each column independently
      const rekaMetadata = parseInlineJson(metadataRaw);
      const rekaChunking = parseChunkingJson(chunkingRaw);
      if (rekaMetadata) {
        metadataJson.reka_vision_metadata = rekaMetadata;
      }
      if (rekaChunking) {
        metadataJson.reka_vision_chunking = rekaChunking;
      }
    }

    const record: OutputRecord = {
      filename: extractFilename(s3ObjectKey),
      s3_object_key: s3ObjectKey,
      s3_annotation_key: s3AnnotationKey,
      mime_type: guessMimeType(s3ObjectKey),
      metadata_json: metadataJson,
    };

    const groupKey = `egocentric-crowd-${slugify(type)}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(record);
  }

  return groups;
}

function processEgocentricWorkplaces(
  section: CsvSection
): Map<string, OutputRecord[]> {
  const cols = detectColumns(section.headerRow);
  const groups = new Map<string, OutputRecord[]>();

  for (const row of section.dataRows) {
    const s3VideoUri = getCell(row, cols.s3Video);
    const s3ObjectKey = extractS3Key(s3VideoUri);
    if (!s3ObjectKey) continue;

    const type = getCell(row, cols.type).trim();
    const category = getCell(row, cols.category).trim();
    const subcategory = getCell(row, cols.subcategory).trim();
    const annotationId = normalizeAnnotationId(
      getCell(row, cols.annotationId)
    );

    const metadataJson: OutputRecord["metadata_json"] = {
      section: "Egocentric Workplaces",
      type,
      category,
      subcategory,
      annotation_id: annotationId,
    };

    const record: OutputRecord = {
      filename: extractFilename(s3ObjectKey),
      s3_object_key: s3ObjectKey,
      s3_annotation_key: null,
      mime_type: guessMimeType(s3ObjectKey),
      metadata_json: metadataJson,
    };

    const groupKey = `egocentric-workplaces-${slugify(type)}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(record);
  }

  return groups;
}

function processVideoGame(
  section: CsvSection
): Map<string, OutputRecord[]> {
  const cols = detectColumns(section.headerRow);
  const groups = new Map<string, OutputRecord[]>();

  for (const row of section.dataRows) {
    const s3VideoUri = getCell(row, cols.s3Video);
    const s3ObjectKey = extractS3Key(s3VideoUri);
    if (!s3ObjectKey) continue;

    // Video Game section has Genre in the category column, Game Name in a
    // separate column, and Annotation ID
    const genre = getCell(row, cols.category).trim() ||
      getCell(row, findColumnIndex(section.headerRow, "genre")).trim();
    const gameName = getCell(row, cols.gameName).trim();
    const annotationId = normalizeAnnotationId(
      getCell(row, cols.annotationId)
    );
    const s3AnnotationKey = extractS3Key(getCell(row, cols.s3Annotation));

    const metadataJson: OutputRecord["metadata_json"] = {
      section: "Video Game",
      type: "Game Capture",
      category: genre,
      subcategory: gameName,
      annotation_id: annotationId,
    };

    // Check for S3 specs key
    const s3SpecsUri = getCell(row, cols.s3Specs);
    const s3SpecsKey = extractS3Key(s3SpecsUri);
    if (s3SpecsKey) {
      (metadataJson as Record<string, unknown>).s3_specs_key = s3SpecsKey;
    }

    const record: OutputRecord = {
      filename: extractFilename(s3ObjectKey),
      s3_object_key: s3ObjectKey,
      s3_annotation_key: s3AnnotationKey,
      mime_type: guessMimeType(s3ObjectKey),
      metadata_json: metadataJson,
    };

    const groupKey = "video-game";
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(record);
  }

  return groups;
}

function processCinematicLicensedData(
  section: CsvSection
): Map<string, OutputRecord[]> {
  const cols = detectColumns(section.headerRow);
  const groups = new Map<string, OutputRecord[]>();

  for (const row of section.dataRows) {
    // For Cinematic Licensed Data, the S3 URI column is at a consistent index.
    // The header row has: ,Category,Subcategory,,S3 Folder (contains only mp4)
    // But the actual S3 URI is in the "S3 Folder" column or we need to find it.
    // Looking at the CSV: the actual S3 URIs are in column index 5 (0-based).
    let s3VideoUri = getCell(row, cols.s3Video);
    if (!s3VideoUri || !s3VideoUri.startsWith("s3://")) {
      // Try to find the S3 URI in any column
      for (let c = 0; c < row.length; c++) {
        if (row[c]?.trim().startsWith("s3://")) {
          s3VideoUri = row[c];
          break;
        }
      }
    }

    const s3ObjectKey = extractS3Key(s3VideoUri);
    if (!s3ObjectKey) continue;

    const category = getCell(row, cols.category).trim();
    const subcategory = getCell(row, cols.subcategory).trim();
    const annotationId = normalizeAnnotationId(
      getCell(row, cols.annotationId)
    );

    const metadataJson: OutputRecord["metadata_json"] = {
      section: "Cinematic Licensed Data",
      type: "Cinematic",
      category,
      subcategory,
      annotation_id: annotationId,
    };

    const record: OutputRecord = {
      filename: extractFilename(s3ObjectKey),
      s3_object_key: s3ObjectKey,
      s3_annotation_key: null,
      mime_type: guessMimeType(s3ObjectKey),
      metadata_json: metadataJson,
    };

    const groupKey = "cinematic-licensed-data";
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(record);
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Summary Table (dry-run mode)
// ---------------------------------------------------------------------------

function printSummaryTable(allGroups: Map<string, OutputRecord[]>): void {
  console.log("\n=== DRY RUN SUMMARY ===\n");

  const tableRows: { group: string; count: number; sections: string }[] = [];
  let totalRecords = 0;

  for (const [groupKey, records] of allGroups) {
    const sections = [
      ...new Set(records.map((r) => r.metadata_json.section)),
    ].join(", ");
    tableRows.push({ group: groupKey, count: records.length, sections });
    totalRecords += records.length;
  }

  // Print table header
  const maxGroup = Math.max(
    "Output File".length,
    ...tableRows.map((r) => `${r.group}.json`.length)
  );
  const maxCount = Math.max(
    "Records".length,
    ...tableRows.map((r) => String(r.count).length)
  );
  const maxSection = Math.max(
    "Section".length,
    ...tableRows.map((r) => r.sections.length)
  );

  const header = [
    "Output File".padEnd(maxGroup),
    "Records".padStart(maxCount),
    "Section".padEnd(maxSection),
  ].join("  |  ");
  const separator = "-".repeat(header.length);

  console.log(header);
  console.log(separator);

  for (const row of tableRows) {
    console.log(
      [
        `${row.group}.json`.padEnd(maxGroup),
        String(row.count).padStart(maxCount),
        row.sections.padEnd(maxSection),
      ].join("  |  ")
    );
  }

  console.log(separator);
  console.log(
    `Total: ${totalRecords} records across ${allGroups.size} output files\n`
  );

  // Print sample record from first group
  const firstGroup = allGroups.entries().next();
  if (!firstGroup.done) {
    const [groupKey, records] = firstGroup.value;
    console.log(`--- Sample record from ${groupKey}.json ---`);
    console.log(JSON.stringify(records[0], null, 2));
    console.log();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  // Resolve CSV path relative to project root
  const projectRoot = path.resolve(__dirname, "..");
  const csvPath = path.join(projectRoot, "Data Catalog Samples.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`Reading CSV: ${csvPath}`);
  const rows = readCsv(csvPath);
  console.log(`Parsed ${rows.length} rows\n`);

  // Detect section boundaries
  const sections = detectSections(rows);
  console.log(`Detected ${sections.length} sections:`);
  for (const section of sections) {
    console.log(
      `  - ${section.title}: ${section.dataRows.length} data rows`
    );
  }
  console.log();

  // Process each section
  const allGroups = new Map<string, OutputRecord[]>();

  for (const section of sections) {
    let sectionGroups: Map<string, OutputRecord[]>;

    switch (section.title) {
      case "Egocentric Crowd":
        sectionGroups = processEgocentricCrowd(section);
        break;
      case "Egocentric Workplaces":
        sectionGroups = processEgocentricWorkplaces(section);
        break;
      case "Video Game":
        sectionGroups = processVideoGame(section);
        break;
      case "Cinematic Licensed Data":
        sectionGroups = processCinematicLicensedData(section);
        break;
      default:
        console.warn(`Unknown section: ${section.title}`);
        continue;
    }

    for (const [key, records] of sectionGroups) {
      if (allGroups.has(key)) {
        allGroups.get(key)!.push(...records);
      } else {
        allGroups.set(key, records);
      }
    }
  }

  // Dry-run: print summary and exit
  if (dryRun) {
    printSummaryTable(allGroups);
    return;
  }

  // Write output files
  const outputDir = path.join(projectRoot, "scripts", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalWritten = 0;

  for (const [groupKey, records] of allGroups) {
    const outputPath = path.join(outputDir, `${groupKey}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), "utf-8");
    console.log(`Wrote ${records.length} records to ${outputPath}`);
    totalWritten += records.length;
  }

  console.log(
    `\nDone. Wrote ${totalWritten} records across ${allGroups.size} files to ${outputDir}`
  );
}

main();
