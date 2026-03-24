# Requirements: Catalog Semantic Enrichment + MCP Server

## Introduction

This feature standardises the inconsistent `enrichment_json` data currently spread across ~150 dataset samples into a single canonical `agent_context` field per sample, generates pgvector embeddings from those fields, and exposes the enriched catalog through an MCP (Model Context Protocol) server. The MCP server enables Claude Code and other Anthropic-compatible agents to search and reason over Claru's full dataset catalog programmatically. An admin UI page at `/admin/catalog/search` provides manual semantic search testing for internal use.

The system has three interlocking parts:
1. A Gemini-powered enrichment pipeline that produces `agent_context` for every sample (new samples via Gemini Vision/Video API; existing enriched samples via a field-mapping layer)
2. A Supabase-managed embedding pipeline that keeps an `extensions.vector(1536)` column in sync with `agent_context` using `text-embedding-3-small` — embedding input is built via `agentContextToEmbeddingText()` which concatenates `scene_summary`, `environments`, `activities`, `objects`, and `camera_perspective`
3. Three MCP tools served via Next.js API routes that expose semantic search, dataset overviews, and lead briefs to Claude agents

---

## Requirements

### Requirement 1: Canonical `agent_context` Schema

**User Story:** As a data engineer, I want every dataset sample to have a consistently structured `agent_context` jsonb field, so that downstream tools and agents can parse and compare samples reliably regardless of source dataset.

#### Acceptance Criteria

1. WHEN the system writes `agent_context` for any sample THEN it SHALL conform to this exact structure:
   ```
   {
     scene_summary: string,         // 1–3 sentence natural language description
     environments: string[],        // e.g. ["kitchen", "outdoor park"]
     activities: string[],          // e.g. ["food preparation", "walking"]
     objects: string[],             // e.g. ["knife", "cutting board"]
     camera_perspective: string,    // e.g. "egocentric", "static overhead"
     people_count: string,          // e.g. "1", "2–4", "crowd"
     technical: {
       fps: string | null,
       duration: string | null,
       resolution: string | null
     },
     quality_notes: string          // e.g. "slight motion blur, good lighting"
   }
   ```
2. WHEN any core field cannot be determined THEN the system SHALL use an empty array `[]` for array fields, `null` inside the `technical` object, and an empty string `""` for string fields rather than omitting the key entirely.
3. WHEN Gemini or the field-mapping layer returns additional fields beyond the core schema THEN the system SHALL preserve those unknown/extra fields as-is in the `agent_context` jsonb object. The core fields have default values; extra fields from Gemini are kept without modification.
4. WHEN `agent_context` is written to `dataset_samples` THEN the existing `enrichment_json` column SHALL remain untouched (non-destructive migration).

---

### Requirement 2: Gemini Enrichment Pipeline — New / Unenriched Samples

**User Story:** As an admin, I want unenriched samples to be automatically described by Gemini so that the catalog is fully searchable without manual effort.

#### Acceptance Criteria

1. WHEN a batch enrichment job runs THEN it SHALL identify all `dataset_samples` rows where `agent_context` IS NULL.
2. WHEN enriching an unenriched sample THEN the system SHALL call the Gemini Vision or Video API with an open-ended prompt — no fixed taxonomy imposed on Gemini's output — and extract structured JSON matching the `agent_context` schema from the model's response.
3. WHEN the sample has an `s3_object_key` THEN the system SHALL generate a presigned S3 URL (using the existing `getS3SignedUrl` utility, respecting `s3_bucket` overrides on the parent dataset) and pass it to Gemini as the media input.
4. WHEN the sample has neither `s3_object_key` nor a resolvable media URL THEN the system SHALL skip that sample and log a warning rather than failing the entire batch.
5. WHEN Gemini returns a response THEN the pipeline SHALL parse and validate the output and write the resulting `agent_context` object to `dataset_samples.agent_context`.
6. WHEN Gemini returns an unparseable or structurally invalid response THEN the system SHALL log the raw response and the sample ID, skip that sample, and continue processing remaining samples.
7. WHEN the enrichment job completes THEN it SHALL log a summary: total attempted, succeeded, skipped (no media), failed (API or parse error).
8. The enrichment pipeline SHALL be runnable as a script (e.g. `npm run enrich`) that can be invoked locally or from a Vercel cron / manual trigger.
9. The pipeline SHALL support a `--dataset-id` flag to restrict enrichment to a single dataset, and a `--dry-run` flag that logs what would be enriched without making API calls or DB writes.

---

### Requirement 3: Field-Mapping Layer — Existing Enriched Samples

**User Story:** As a data engineer, I want existing `enrichment_json` data to be mapped into `agent_context` without re-calling Gemini, so that we don't incur unnecessary API cost and don't duplicate work that's already been done.

#### Acceptance Criteria

1. WHEN the enrichment pipeline encounters a sample where `enrichment_json` IS NOT NULL AND `agent_context` IS NULL THEN it SHALL apply the field-mapping layer instead of calling Gemini.
2. WHEN mapping Egocentric Activity enrichment data THEN the system SHALL produce `agent_context` by mapping:
   - `environment_label` → `environments` (wrap in array if string)
   - `task` → `activities` (wrap in array if string)
   - `hands` → include in `objects` if present
   - `camera_perspective` = `"egocentric_first_person"`
   - remaining fields → derive `scene_summary` from available data
3. WHEN mapping Food & Lifestyle enrichment data THEN the system SHALL produce `agent_context` by mapping:
   - `captions.detailed` → `scene_summary`
   - `captions.activities` → `activities`
   - `captions.objects` → `objects`
   - `quality_scores` → flatten into `quality_notes`
4. WHEN mapping any other dataset's `enrichment_json` THEN the system SHALL apply a generic best-effort mapper that tries, in order: `scene_analysis`, `captions.detailed`, `description` for `scene_summary`, and maps any result into `agent_context`, logging unmapped fields.
5. WHEN the mapping layer produces an `agent_context` object THEN it SHALL validate the result against the canonical schema and fill missing fields with their zero values before writing.
6. IF the mapping layer cannot produce a valid `agent_context` from `enrichment_json` (e.g. unrecognised schema with no mappable fields) THEN the system SHALL fall through to Gemini enrichment and log that mapping was skipped.

---

### Requirement 4: pgvector Embedding Column + Automatic Sync Pipeline

**User Story:** As a developer, I want `dataset_samples` to have an `extensions.vector(1536)` embedding column that stays in sync with `agent_context` automatically, so that semantic similarity search works without manual embedding triggers.

#### Acceptance Criteria

1. WHEN the schema migration runs THEN it SHALL add an `embedding extensions.vector(1536)` column to `dataset_samples`, nullable to allow rows that haven't been embedded yet.
2. WHEN a row's `agent_context` is inserted or updated THEN the automatic embedding pipeline SHALL build embedding input text via `agentContextToEmbeddingText()` — which concatenates `scene_summary`, `environments`, `activities`, `objects`, and `camera_perspective` — to produce richer, more discriminative vectors than embedding `scene_summary` alone.
3. The embedding pipeline SHALL use OpenAI `text-embedding-3-small` (1536 dimensions) to generate the embedding from the concatenated text.
4. WHEN the embedding is generated THEN the pipeline SHALL write it to `dataset_samples.embedding` for that row.
5. WHEN `agent_context` is NULL or `agentContextToEmbeddingText()` returns null (no usable text in any field) THEN the pipeline SHALL set `embedding` to NULL and not call the OpenAI API.
6. The primary sync mechanism SHALL be a **polling Edge Function** that queries for rows where `agent_context IS NOT NULL AND embedding IS NULL` on a schedule (every 60 seconds via Vercel cron or pg_cron). A Postgres trigger SHALL clear `embedding` to NULL when `agent_context` changes, ensuring stale embeddings are re-generated. pgmq-based event-driven processing is an optional optimization for higher throughput and is NOT required for the initial implementation.
7. The embedding pipeline SHALL be idempotent — re-running it on a row with an existing embedding SHALL overwrite with the latest value without error.

---

### Requirement 5: `match_samples` Postgres Function

**User Story:** As a developer, I want a `match_samples(query_embedding, match_count, dataset_id?)` function in Postgres so that I can do cosine similarity search from any query embedding with an optional dataset filter, returning results that include the parent dataset name.

#### Acceptance Criteria

1. WHEN `match_samples` is called with a query embedding and match count THEN it SHALL return the top N rows from `dataset_samples` ordered by cosine similarity descending, joining the `datasets` table to include `dataset_name`.
2. WHEN `match_samples` is called with an optional `dataset_id` filter THEN it SHALL restrict results to samples from that dataset only.
3. WHEN `match_samples` is called THEN the returned rows SHALL include: `sample_id` (uuid), `dataset_id` (uuid), `dataset_name` (text, from a JOIN on the `datasets` table), `similarity` (float, cosine similarity score), `agent_context` (jsonb), `s3_object_key` (text), `mime_type` (text).
4. WHEN a row has a NULL `embedding` THEN `match_samples` SHALL exclude that row from results.
5. The function SHALL be defined using `pgvector`'s `<=>` cosine distance operator and exposed via Supabase RPC so it can be called from the Next.js server using `supabase.rpc('match_samples', {...})`.

---

### Requirement 6: MCP Server — Transport and Authentication

**User Story:** As a developer, I want the MCP server to be accessible via standard HTTP from Claude Code, so that I can add it to my MCP config without running a separate process.

#### Acceptance Criteria

1. The MCP server SHALL be implemented as Next.js API routes under `/api/mcp/` using the MCP SDK's HTTP server transport (Streamable HTTP or SSE as appropriate for the SDK version in use).
2. WHEN a request arrives at any `/api/mcp/*` route THEN the server SHALL require an `Authorization: Bearer <token>` header where the token is the same `ADMIN_MCP_TOKEN` environment variable (a static secret distinct from the JWT admin cookie).
3. WHEN the bearer token is missing or incorrect THEN the server SHALL return HTTP 401 with `{ "error": "Unauthorized" }`.
4. WHEN the MCP server route handles a valid request THEN it SHALL parse and dispatch MCP tool calls using the MCP SDK and return a valid MCP response.
5. The MCP server SHALL be configurable in Claude Code's `~/.config/claude/mcp.json` as a remote HTTP server (no `stdio` transport required).

---

### Requirement 7: MCP Tool — `search_catalog`

**User Story:** As a Claude agent, I want to search the dataset catalog by natural language query, so that I can find samples relevant to a prospect's use case without knowing exact dataset names.

#### Acceptance Criteria

1. WHEN `search_catalog` is called with a `query` string THEN the server SHALL embed the query using `text-embedding-3-small`, call `match_samples` via Supabase RPC, and return the top matching samples.
2. WHEN `search_catalog` is called with an optional `limit` parameter THEN the server SHALL use it as the `match_count` argument; if omitted, the default SHALL be 10.
3. WHEN `search_catalog` is called with an optional `dataset_id` parameter THEN the server SHALL pass it to `match_samples` to restrict results to that dataset.
4. WHEN building the response THEN the server SHALL include for each result: `sample_id`, `dataset_id`, `dataset_name`, `similarity` score, `scene_summary` (from `agent_context`), `environments` (from `agent_context`), `activities` (from `agent_context`), `objects` (from `agent_context`), `camera_perspective` (from `agent_context`), `signed_url` (presigned S3 URL with 1-hour expiry using the existing `getS3SignedUrl` utility), `mime_type`.
5. WHEN constructing `signed_url` THEN the server SHALL apply the same S3 URL scrubbing logic used by the portal (strip raw S3 URIs from any text fields, never expose raw `s3://` paths or unsigned URLs in the response).
6. WHEN no samples match (empty result set) THEN the server SHALL return `{ results: [], message: "No samples found matching query" }`.
7. WHEN `query` is an empty string or missing THEN the server SHALL return an MCP error with a descriptive message.

---

### Requirement 8: MCP Tool — `get_dataset_overview`

**User Story:** As a Claude agent, I want to retrieve a structured overview of a specific dataset, so that I can understand its scope and characteristics before recommending it to a prospect.

#### Acceptance Criteria

1. WHEN `get_dataset_overview` is called with a `dataset_id` THEN the server SHALL query the `datasets` table and return: `name`, `category`, `subcategory`, `description`, `total_samples`, `total_duration_hours`, `annotation_types`.
2. WHEN building the overview THEN the server SHALL also include: the top 5 most frequent `environments` values extracted from `agent_context`, the top 5 most frequent `activities` values extracted from `agent_context`, a camera perspectives breakdown (frequency of each `camera_perspective` value across samples), count of samples with embeddings, count of samples without embeddings, and up to 3 representative sample signed URLs.
3. WHEN `dataset_id` does not match any row in `datasets` THEN the server SHALL return an MCP error: `"Dataset not found"`.
4. The response SHALL NOT include any raw S3 keys, unsigned media URLs, or `enrichment_json` content.

---

### Requirement 9: MCP Tool — `build_lead_brief`

**User Story:** As a Claude agent, I want to generate a lead brief for a prospect given their company description and use case, so that I can surface the most relevant datasets and sample evidence to support a sales conversation.

#### Acceptance Criteria

1. WHEN `build_lead_brief` is called with `company_description` (string), `use_case` (string), and an optional `limit` (number, default 5) THEN the server SHALL:
   a. Embed the concatenated input (`company_description + " " + use_case`) using `text-embedding-3-small`
   b. Internally call `search_catalog` with the concatenated input as `query` and the provided `limit`
   c. Group results by dataset to identify the most relevant datasets
2. WHEN building the brief THEN the server SHALL return only raw factual data grouped by dataset — no generated narrative or sales copy — as an array of objects per dataset, each containing:
   - `dataset_name`: string (name of the dataset)
   - `total_samples`: number (total samples in the dataset)
   - `annotation_types`: string[] (from the datasets table)
   - `matched_sample_count`: number (how many samples from this dataset appeared in search results)
   - `representative_signed_urls`: (string | null)[] (up to 3 signed URLs per dataset)
   - `aggregated_environments`: string[] (environments from matched samples' agent_context)
   - `aggregated_activities`: string[] (activities from matched samples' agent_context)
3. WHEN constructing signed URLs THEN the same S3 URL scrubbing rules from Requirement 7 SHALL apply.
4. WHEN `company_description` or `use_case` is empty THEN the server SHALL return an MCP error with a descriptive message.
5. The brief SHALL NOT include any Gemini-generated prose, sales recommendations, or fields beyond what is described above — interpretation is left to the calling agent.

---

### Requirement 10: Admin Search UI — `/admin/catalog/search`

**User Story:** As an admin, I want a search page in the admin portal where I can type a natural language query and see semantically matching samples with their similarity scores and media previews, so that I can verify the enrichment and embedding pipeline is working correctly.

#### Acceptance Criteria

1. WHEN an admin navigates to `/admin/catalog/search` THEN the page SHALL render within the existing admin layout (same `PortalThemeProvider`, same `admin-token` cookie auth check via middleware).
2. WHEN the admin enters a query and submits THEN the page SHALL POST to a new `/api/admin/catalog/search` route with `{ query: string, dataset_id?: string, limit?: number }` (default limit: 20), which embeds the query server-side and calls `match_samples`, then returns results with fields: `sample_id`, `dataset_id`, `dataset_name`, `similarity` (raw float 0.0–1.0), `agent_context`, `signed_url`, `mime_type`.
3. WHEN results are returned THEN the page SHALL display them in a grid/list with: thumbnail or video preview (using `signed_url`), dataset name, similarity score displayed as a **percentage** in the UI (raw float multiplied by 100 and rounded), and `scene_summary` from `agent_context`.
4. WHEN the admin selects a dataset from an optional filter dropdown THEN the search SHALL be scoped to that dataset only (passes `dataset_id` to `match_samples`).
5. WHEN a sample has no embedding THEN it SHALL be excluded from results (handled by `match_samples`; no special UI treatment needed).
6. WHEN no results are returned THEN the page SHALL display "No matching samples found" rather than an empty grid.
7. WHEN the search API returns an error THEN the page SHALL display a dismissible error message in the same style as other admin error states.
8. The page SHALL support a result limit selector (10 / 25 / 50) defaulting to 10.

---

### Requirement 11: S3 URL Scrubbing in MCP Responses

**User Story:** As a security-conscious developer, I want all MCP responses to scrub raw S3 paths before returning data to agents, so that private bucket names and object keys are never leaked outside the server.

#### Acceptance Criteria

1. WHEN any MCP tool response includes sample data THEN the server SHALL replace `s3_object_key` values and any `s3://` URIs embedded in text fields with signed URLs or omit them entirely.
2. WHEN generating a `signed_url` for an MCP response THEN the server SHALL use the same `getS3SignedUrl` utility already used by the admin and portal routes, respecting per-dataset `s3_bucket` overrides.
3. WHEN `getS3SignedUrl` returns null (e.g. missing env var, AWS error) THEN the server SHALL set `signed_url` to `null` in the response rather than exposing a raw key.
4. WHEN `agent_context` is included in an MCP response THEN the server SHALL ensure no field within it contains a raw `s3://` URI — if such a value is found, it SHALL be replaced with `[S3_REDACTED]`.

---

### Requirement 12: Environment Variables and Configuration

**User Story:** As a developer setting up the feature, I want all required secrets to be clearly defined as environment variables, so that local development and Vercel deployment are straightforward.

#### Acceptance Criteria

1. WHEN the feature is deployed THEN the following new environment variables SHALL be required and the app SHALL fail fast with a clear error message if any are missing:
   - `GEMINI_API_KEY` — Google Gemini API credentials
   - `OPENAI_API_KEY` — OpenAI embeddings API credentials
   - `ADMIN_MCP_TOKEN` — Static bearer token for MCP endpoint authentication
2. The existing variables `JWT_SECRET`, `AWS_REGION`, `S3_BUCKET_NAME`, `CLOUDFRONT_DOMAIN`, `CLOUDFRONT_KEY_PAIR_ID`, `CLOUDFRONT_PRIVATE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` SHALL be reused as-is with no changes.
3. IF `GEMINI_API_KEY` is not set THEN the enrichment pipeline script SHALL exit with a non-zero status code and a descriptive error before making any API calls.
4. IF `OPENAI_API_KEY` is not set on the Supabase Edge Function THEN the embedding sync pipeline SHALL fail gracefully per individual row (log the error, leave `embedding` as NULL) rather than crashing the entire function.

---

### Requirement 13: Non-Destructive Data Migration

**User Story:** As a developer, I want the migration to leave existing data intact, so that a rollback doesn't corrupt any samples or require restoring from backup.

#### Acceptance Criteria

1. WHEN the schema migration adds the `embedding` column THEN it SHALL be nullable with no default, so existing rows are unaffected.
2. WHEN `agent_context` is written to a sample THEN `enrichment_json` and `metadata_json` SHALL remain unchanged.
3. WHEN the enrichment pipeline runs THEN it SHALL only write to rows where `agent_context IS NULL`, never overwriting an already-enriched sample unless an explicit `--force` flag is passed.
4. WHEN `--force` is passed THEN the pipeline SHALL log a warning for each row it overwrites before doing so.
5. The `match_samples` Postgres function SHALL be created with `CREATE OR REPLACE FUNCTION` so it can be updated without dropping dependent objects.

---

### Requirement 14: Enrichment Job Tracking

**User Story:** As an admin, I want enrichment job state to be persisted in the database so that job progress survives Vercel serverless cold starts and I can monitor long-running enrichment runs.

#### Acceptance Criteria

1. WHEN the enrichment management migration runs THEN it SHALL create an `enrichment_jobs` table with columns: `id` (uuid PK), `status` (text with check constraint: pending/running/completed/failed), `action` (text), `dataset_id` (uuid, nullable), `processed` (int), `total` (int), `failed` (int), `error_log` (jsonb), `started_at` (timestamptz), `completed_at` (timestamptz).
2. WHEN a non-dry-run enrichment job is triggered THEN the system SHALL create a row in `enrichment_jobs` and delegate work to a Supabase Edge Function that updates the row as it progresses.
3. WHEN `GET /api/admin/catalog/enrichment/job/:id` is called THEN it SHALL return the job row including a `log` array with entries structured as `{ timestamp, sample_id, filename, result, error? }`, supporting `?log_offset=N` for incremental polling.

---

### Requirement 15: Concurrent Job Rejection

**User Story:** As an admin, I want the system to prevent concurrent enrichment jobs so that two simultaneous runs do not corrupt data or exhaust API rate limits.

#### Acceptance Criteria

1. WHEN a `POST /api/admin/catalog/enrichment/run` request arrives THEN the system SHALL use an atomic database check (`INSERT ... WHERE NOT EXISTS (SELECT 1 FROM enrichment_jobs WHERE status IN ('pending', 'running'))`) to enforce single-job execution.
2. WHEN a job is already pending or running THEN the endpoint SHALL return HTTP 409 with a descriptive error message.

---

### Requirement 16: Enrichment Status Aggregation

**User Story:** As an admin, I want a lightweight status endpoint that shows per-dataset enrichment progress so I can identify which datasets still need enrichment.

#### Acceptance Criteria

1. WHEN `GET /api/admin/catalog/enrichment/status` is called THEN it SHALL return aggregated counts from `dataset_samples`: total_samples, with_agent_context, with_embedding, pending_enrichment, pending_embedding.
2. WHEN the status endpoint returns THEN it SHALL include a `by_dataset` array with per-dataset breakdown: dataset_id, dataset_name, total, enriched, pending.

---

### Requirement 17: Admin-Triggered Enrichment Without CLI

**User Story:** As an admin, I want to trigger field-mapping and Gemini enrichment from the web UI so that I don't need SSH or CLI access to enrich datasets.

#### Acceptance Criteria

1. WHEN an admin triggers enrichment from `/admin/catalog/enrichment` THEN the system SHALL invoke the same enrichment logic as the CLI scripts (`map-enrichment-to-agent-context.ts` for mapping, `enrich-samples-gemini.ts` for Gemini) via a Supabase Edge Function `run-enrichment`.
2. WHEN the admin selects a dataset from the per-dataset dropdown THEN the enrichment SHALL be scoped to that dataset only.
3. WHEN dry_run mode is selected THEN the system SHALL return a synchronous preview of what would be processed without creating a job or making any writes: `{ dry_run: true, would_process: number, samples: Array<{ id, filename, dataset_name }> }`.
