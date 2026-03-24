# Implementation Tasks: Catalog Semantic Enrichment + MCP Server

**Requirements:** `tasks/docs/catalog-enrichment-requirements.md`
**Design:** `tasks/docs/catalog-enrichment-design.md`
**Branch:** `staging` (PR to `main`)

---

## PR Strategy

| PR | Tasks | PRD Stories | Can Merge Independently |
|----|-------|-------------|------------------------|
| PR 1: Foundation — DB + Types + Shared Utils | 1.1 – 1.6 | US-000 to US-004 | Yes |
| PR 2: Enrichment — Field Mapping + Gemini Pipeline | 2.1 – 2.4, 3.1 – 3.5 | US-005 + US-006 | Yes (depends on PR 1) |
| PR 3: Embedding Pipeline + Backfill | 4.1 – 4.5 | US-007 + US-008 | Yes (depends on PR 1) |
| PR 4: MCP Server + All 3 Tools | 5.1 – 5.6 | US-009 to US-012 | Yes (depends on PR 3) |
| PR 5: Admin Search UI + Enrichment Management | 6.1 – 6.4, 7.1 – 7.6 | US-013 + US-014 + US-014b + US-014c | Yes (depends on PR 3) |
| PR 6: E2E Tests + UAT | 8.1 – 8.2 | US-015 + US-016 | Yes (depends on PRs 4 + 5) |

PRs 2 and 3 can be developed in parallel after PR 1 merges. PRs 4 and 5 can be developed in parallel after PR 3 merges. PR 6 is the final validation pass.

---

## Risk Register

| Risk | Mitigation | Task Reference |
|------|-----------|----------------|
| `pgvector` extension not enabled on hosted Supabase | Task 1.1 runs `CREATE EXTENSION IF NOT EXISTS vector` — if it fails, enable via Supabase Dashboard > Database > Extensions | 1.1 |
| `pgmq` not available on Supabase hosted plan | pgmq is an optional optimization only — polling is the primary approach and does not require pgmq. No action needed if pgmq is unavailable. | 4.1 |
| `pg_cron` not available on Supabase Free tier | Use Vercel cron (preferred) or GitHub Actions to invoke the Edge Function externally. pg_cron is an alternative, not a requirement. | 4.4 |
| Gemini File API requires Google Cloud project with billing for large video uploads | Test with a small file first in task 3.2; document file-size limits | 3.2 |
| OpenAI API key not provisioned yet | Can develop and test embedding code with mocked responses; key needed for integration test only | 4.2 |
| `@modelcontextprotocol/sdk` API surface may differ across versions | Pin exact version in package.json; verify `StreamableHTTPServerTransport` exists before writing handler | 5.1 |
| Rollback safety | All schema changes are additive (nullable columns, `IF NOT EXISTS`). Enrichment script is idempotent (`agent_context IS NULL` filter). Embedding column can be dropped without affecting existing data. | 1.1, 1.2 |

---

## Tasks

### 1. Foundation: Types, Schema, and Shared Utilities

- [ ] 1.1 Create the database migration file `supabase/migrations/008_catalog_enrichment.sql`
  - Enable `pgvector` extension: `CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;`
  - Add `agent_context jsonb` column to `dataset_samples` (nullable, `ADD COLUMN IF NOT EXISTS`)
  - Add `embedding extensions.vector(1536)` column (nullable, `ADD COLUMN IF NOT EXISTS`)
  - Create HNSW index on `embedding` with `vector_cosine_ops` (m=16, ef_construction=64)
  - Run against hosted Supabase via Dashboard SQL editor or `supabase db push`
  - Ref: Req 1, Req 4.1, Req 13.1, Req 13.2

- [ ] 1.2 Create the `match_samples` Postgres function in `supabase/migrations/009_match_samples_fn.sql`
  - `CREATE OR REPLACE FUNCTION match_samples(query_embedding, match_count, dataset_id)` as specified in design Section 5
  - Returns `sample_id, dataset_id, dataset_name, similarity, agent_context, s3_object_key, mime_type`
  - Joins `datasets` table to include `dataset_name` in the result set
  - Uses `1 - (embedding <=> query_embedding)` for cosine similarity
  - Excludes rows where `embedding IS NULL`
  - Optional `dataset_id` parameter defaults to NULL (no filter)
  - Ref: Req 5.1–5.5

- [ ] 1.3 Create `src/lib/enrichment/types.ts`
  - Define `AgentContext`, `AgentContextTechnical` interfaces
  - Export `AGENT_CONTEXT_DEFAULTS` constant with all zero-values (empty string, empty arrays, null technicals)
  - Ref: Req 1.1, Req 1.2

- [ ] 1.4 Extract `scrubS3Urls` into shared utility `src/lib/scrub-s3-urls.ts`
  - Move the `scrubS3Urls` function from `src/app/api/portal/s3-annotation/route.ts` into the new file
  - Update the portal route to import from `@/lib/scrub-s3-urls`
  - Verify the portal route still works (no behaviour change, pure refactor)
  - Ref: Req 11.1–11.4

- [ ] 1.5 Create `src/lib/embeddings/openai.ts` — shared OpenAI embedding wrapper
  - Export `async function generateEmbedding(text: string): Promise<number[]>`
  - Install `openai` SDK: `npm install openai`
  - Instantiate OpenAI client once (module-level singleton)
  - Use model `text-embedding-3-small`, return the `float[1536]` array
  - Throw descriptive error if `OPENAI_API_KEY` is not set
  - Ref: Req 4.3, Req 7.1, Req 12.1

- [ ] 1.6 Write unit tests for `scrubS3Urls`
  - Test strings containing `s3://` are replaced with `"[S3_REDACTED]"`
  - Test nested objects and arrays are recursed
  - Test non-S3 strings pass through unchanged
  - Test null/undefined/number values pass through
  - Ref: Req 11.1–11.4

### 2. Field-Mapping Layer

Library module: `src/lib/enrichment/field-mapper.ts`
CLI script: `scripts/map-enrichment-to-agent-context.ts`

- [ ] 2.1 Create `src/lib/enrichment/field-mapper.ts` with variant detection
  - Implement `detectVariant(enrichmentJson)` returning `"egocentric" | "food_lifestyle" | "generic"`
  - Detection logic: `domain`/`environment_label`/`task`/`hands` -> egocentric; `captions.detailed`/`quality_scores` -> food_lifestyle; else generic
  - Implement `fillDefaults(partial: Partial<AgentContext>): AgentContext` using spread over `AGENT_CONTEXT_DEFAULTS`
  - This module is imported by both `scripts/map-enrichment-to-agent-context.ts` (CLI) and the `run-enrichment` Edge Function (admin UI trigger)
  - Ref: Req 3.1, Req 3.5

- [ ] 2.2 Implement `mapEgocentricToAgentContext` in `field-mapper.ts`
  - Map `environment_label` -> `environments` (wrap in array)
  - Map `task` -> `activities` (wrap in array)
  - Map `hands.primary_hand` -> `objects`
  - Construct `scene_summary` = `task_description + " " + environment_description` (no domain/task in scene_summary)
  - Map `technical_specs.duration_s`, `fps_estimate`, `resolution_px` -> `technical`
  - Set `camera_perspective` to `"egocentric_first_person"` by default for this variant
  - Use fixture data from `src/lib/schemas/annotation-metadata.ts` (`EgocentricShortForm`, `EgocentricLongForm`) as reference
  - Ref: Req 3.2

- [ ] 2.3 Implement `mapFoodLifestyleToAgentContext` and `mapGenericToAgentContext` in `field-mapper.ts`
  - Food & Lifestyle: `captions.detailed` -> `scene_summary`; `captions.activities` -> `activities`; `captions.objects` -> `objects`; flatten `quality_scores` into `quality_notes`; map `environment` if present
  - Generic: try `scene_analysis`, `captions.detailed`, `description` for `scene_summary`; log unmapped fields; return `null` if no scene_summary extractable (triggers Gemini fallback)
  - Ref: Req 3.3, Req 3.4, Req 3.6

- [ ] 2.4 Write unit tests for field-mapper
  - Test `detectVariant` with representative `enrichment_json` for each variant
  - Test each mapper produces valid `AgentContext` from fixture data
  - Test `fillDefaults` fills all missing keys with zero-values
  - Test generic mapper returns null when no scene_summary is extractable
  - Test egocentric mapper correctly wraps string `environment_label` into array
  - Ref: Req 3.1–3.6

### 3. Gemini Enrichment CLI

- [ ] 3.1 Create `src/lib/enrichment/gemini-client.ts`
  - Install `@google/generative-ai` SDK (or use existing `@google/genai` from package.json)
  - Export `async function callGeminiEnrichment(mediaUrl: string, mimeType: string): Promise<AgentContext | null>`
  - Use model `gemini-2.0-flash` with the prompt template from design Section 3
  - Parse JSON response, validate against `AgentContext` shape, fill defaults
  - Return `null` on unparseable response (log raw output)
  - Implement exponential backoff on API errors: initial 1s delay, max 3 retries, 2x backoff factor
  - Fail fast with clear error if `GEMINI_API_KEY` is not set
  - Ref: Req 2.2, Req 2.5, Req 2.6, Req 12.1, Req 12.3

- [ ] 3.2 Create `scripts/enrich-samples-gemini.ts` — Gemini enrichment CLI script
  - Add `"enrich:gemini": "npx ts-node scripts/enrich-samples-gemini.ts"` to package.json scripts
  - Parse CLI flags: `--dataset-id <uuid>`, `--dry-run`, `--force`
  - Load env vars via `dotenv/config`
  - Implement `fetchCandidates()`: query `dataset_samples` where `agent_context IS NULL` (or all rows if `--force`), joining `datasets` for `s3_bucket` override
  - On `--dry-run`: log candidate list with dataset names and sample IDs, then exit
  - Ref: Req 2.1, Req 2.8, Req 2.9, Req 13.3, Req 13.4

- [ ] 3.3 Implement the `enrichSample` / `buildAgentContext` orchestration in `enrich-samples-gemini.ts`
  - For each candidate: check if `enrichment_json IS NOT NULL` -> run field-mapping layer
  - If mapping returns null (unmappable) or `enrichment_json` is null -> call Gemini via `callGeminiEnrichment`
  - Generate presigned URL via `getS3SignedUrl(s3_object_key, 3600, bucketOverride)` for Gemini input
  - Skip samples with no `s3_object_key` and no resolvable media URL (log warning)
  - Write `agent_context` to `dataset_samples` via Supabase admin client update
  - When `--force` is set, log a warning for each overwritten row
  - Ref: Req 2.1–2.7, Req 3.1, Req 3.6, Req 13.3

- [ ] 3.4 Add summary logging to enrichment CLI
  - After processing all candidates, log: total attempted, succeeded, skipped (no media), skipped (mapping insufficient -> went to Gemini), failed (API/parse error)
  - Ref: Req 2.7

- [ ] 3.5 Write unit tests for `gemini-client.ts`
  - Mock the Gemini SDK; test that valid JSON response is parsed into `AgentContext`
  - Test that non-JSON response returns `null` and logs
  - Test that missing `GEMINI_API_KEY` throws immediately
  - Test retry logic on simulated 5xx error
  - Ref: Req 2.2, Req 2.5, Req 2.6

### 4. Embedding Sync Pipeline (Supabase-native)

- [ ] 4.1 Create migration `supabase/migrations/010_embedding_trigger.sql` — polling is primary, pgmq is optional
  - Create a Postgres trigger that clears `embedding` to NULL when `agent_context` changes (marks row as needing re-embedding); the polling Edge Function picks up rows where `agent_context IS NOT NULL AND embedding IS NULL`
  - Optionally, check if `pgmq` is available on the hosted Supabase instance (project ref `usmgbihcevnvrkyvrlju`) for future event-driven optimization: `SELECT * FROM pg_extension WHERE extname IN ('pgmq', 'pg_cron', 'pg_net');`
  - pgmq-based queue is NOT required for initial implementation — polling is the primary approach
  - Ref: Req 4.2, Req 4.6

- [ ] 4.2 Create Supabase Edge Function `supabase/functions/embed-samples/index.ts`
  - Deno runtime; import `openai` from npm or use fetch-based approach
  - If pgmq path (optional optimization): dequeue up to 10 messages, extract `sample_id`, call `agentContextToEmbeddingText()` to build embedding input, call OpenAI `text-embedding-3-small`, write embedding back, ack message
  - Primary (polling): query `dataset_samples WHERE agent_context IS NOT NULL AND embedding IS NULL LIMIT 10`, call `agentContextToEmbeddingText()` on each row's `agent_context`, embed, update
  - Graceful failure per row: log error, don't crash, leave embedding as NULL
  - Ref: Req 4.2–4.5, Req 12.4

- [ ] 4.3 Deploy the Edge Function and set secrets
  - Run `supabase functions deploy embed-samples`
  - Run `supabase secrets set OPENAI_API_KEY=<value>`
  - Test with `supabase functions invoke embed-samples` against a sample with `agent_context` set
  - Ref: Req 4.3, Req 12.1

- [ ] 4.4 Set up pg_cron schedule (or external cron fallback)
  - If pg_cron available: schedule the Edge Function invocation every 1 minute via `cron.schedule` + `net.http_post` as specified in design Section 6c
  - If pg_cron NOT available: add a Vercel cron job in `vercel.json` that hits a new `/api/cron/embed-samples` route, which invokes the Edge Function via `supabase.functions.invoke('embed-samples')`
  - Ref: Req 4.6

- [ ] 4.5 Write integration test for `match_samples` RPC
  - Seed 5 rows in `dataset_samples` with known `agent_context` and `embedding` vectors (can use deterministic test vectors)
  - Call `supabase.rpc('match_samples', ...)` with a query vector known to be similar to one row
  - Assert the expected row is the top result; assert similarity score is between 0 and 1
  - Assert rows with NULL embedding are excluded
  - Assert `dataset_id` parameter correctly scopes results
  - Ref: Req 5.1–5.5

### 5. MCP Server

- [ ] 5.1 Install MCP SDK and scaffold `src/app/api/mcp/route.ts`
  - `npm install @modelcontextprotocol/sdk`
  - Create the route file with `POST` and optionally `GET` exports
  - Implement bearer token auth: extract `Authorization` header, compare against `process.env.ADMIN_MCP_TOKEN`, return 401 if invalid
  - Initialize `McpServer` with name `"claru-catalog"`, version `"1.0.0"`
  - Connect to `StreamableHTTPServerTransport` and delegate request handling
  - Verify the route responds to MCP `initialize` handshake with a valid bearer token
  - Ref: Req 6.1–6.5

- [ ] 5.2 Implement `search_catalog` MCP tool
  - Register tool with Zod schema: `query` (required string), `dataset_id` (optional UUID string), `limit` (optional number, default 10, max 50)
  - Handler: validate query non-empty, embed via `generateEmbedding()`, call `supabase.rpc('match_samples', ...)` (dataset_name is included in RPC result via JOIN)
  - For each result: call `getS3SignedUrl` for `signed_url` (null if fails), scrub `agent_context` via `scrubS3Urls`, extract `scene_summary`
  - Return results array; if empty, return `{ results: [], message: "No samples found matching query" }`; return MCP error if query is empty
  - Ref: Req 7.1–7.7, Req 11.1–11.4

- [ ] 5.3 Implement `get_dataset_overview` MCP tool
  - Register tool with schema: `dataset_id` (required UUID string)
  - Handler: query `datasets` table for the given ID; return MCP error `"Dataset not found"` if not found
  - Return: name, category, subcategory, description, total_samples, total_duration_hours, annotation_types
  - Query `dataset_samples` aggregates: count with `embedding IS NOT NULL` (samples_with_embeddings), count with `embedding IS NULL` (samples_without_embeddings)
  - Query up to 5 distinct `environments` and `activities` from `agent_context` using `jsonb_array_elements_text`
  - Query camera perspectives breakdown (frequency of each `camera_perspective` value across samples)
  - Select up to 3 representative samples and generate signed URLs
  - Return structured overview; no `enrichment_json`, no raw S3 keys
  - Ref: Req 8.1–8.4

- [ ] 5.4 Implement `build_lead_brief` MCP tool
  - Register tool with schema: `company_description` (required non-empty string), `use_case` (required non-empty string), `limit` (optional number, default 5)
  - Handler: internally call `search_catalog` with concatenated input as query and the provided `limit`
  - Group results by dataset; for each dataset build: `dataset_name`, `total_samples`, `annotation_types`, `matched_sample_count`, `representative_signed_urls` (up to 3), `aggregated_environments`, `aggregated_activities`
  - Return array sorted by `matched_sample_count` descending
  - Apply `scrubS3Urls` to all text fields; return raw factual data only (no narrative)
  - Ref: Req 9.1–9.5

- [ ] 5.5 Write tests for MCP auth and tool dispatch
  - Test POST to `/api/mcp` with no token returns 401
  - Test POST with wrong token returns 401
  - Test POST with valid token + MCP `initialize` returns valid MCP response
  - Test `search_catalog` with empty query returns MCP error
  - Test `search_catalog` with valid query returns results array (mock generateEmbedding + Supabase RPC)
  - Test `get_dataset_overview` with non-existent dataset_id returns MCP error
  - Test `build_lead_brief` with empty company_description returns MCP error
  - Ref: Req 6.2–6.4, Req 7.7, Req 8.3, Req 9.4

- [ ] 5.6 Add MCP config example to project README or `.mcp.json`
  - Document the Claude Code config snippet for `claru-catalog` MCP server
  - Include URL pattern for local dev (`http://localhost:3020/api/mcp`) and production
  - Ref: Req 6.5

### 6. Admin Search UI

- [ ] 6.1 Create `/api/admin/catalog/search/route.ts` — server-side search API
  - Auth: verify `admin-token` cookie via `verifyAdminToken()` (same pattern as existing admin routes)
  - Parse request body with Zod: `query` (required string), `dataset_id` (optional UUID), `limit` (optional, default 20, max 50)
  - Embed query via `generateEmbedding()`, call `supabase.rpc('match_samples', ...)`
  - Fetch dataset names for results, presign media URLs via `getS3SignedUrl` with per-dataset `s3_bucket` override
  - Return `{ results: [...] }` (empty array on no matches, 400 on empty query, 500 on internal error)
  - Ref: Req 10.2, Req 10.5–10.7

- [ ] 6.2 Create `src/app/admin/catalog/search/page.tsx` — server component
  - Fetch dataset list for filter dropdown using `createSupabaseAdminClient`
  - Render breadcrumb header: `claru / admin / catalog / search` with `[back to catalog]` and `[enrichment status]` links
  - Render `CatalogSearchClient` passing datasets as prop
  - Ref: Req 10.1

- [ ] 6.3 Create `src/app/admin/catalog/search/CatalogSearchClient.tsx` — client component
  - State: query input, dataset filter dropdown (populated from server component prop), limit selector (10 / 25 / 50), loading/error/results
  - On submit: POST to `/api/admin/catalog/search`, display results in a grid
  - Each result card: thumbnail/video preview (using `signed_url` and existing portal media display patterns), dataset name (muted), similarity score displayed as percentage (e.g. `87%`), `scene_summary` (truncated 2 lines)
  - Empty state: "No matching samples found"
  - Error state: dismissible error banner matching existing admin error styling
  - Ref: Req 10.1–10.8

- [ ] 6.4 Write Playwright test for admin search page
  - Navigate to `/admin/catalog/search` (requires admin login)
  - Verify page renders with search input, dataset dropdown, limit selector
  - Submit a query; assert results grid appears with expected elements (similarity score, dataset name, scene_summary)
  - Test empty query shows validation feedback
  - Test "No matching samples found" state
  - Ref: Req 10.1–10.8

### 7. Enrichment Management API + UI (US-014b, US-014c)

- [ ] 7.1 Create migration `supabase/migrations/<ts>_enrichment_jobs.sql` — `enrichment_jobs` table
  - Schema: `id uuid, status text, action text, dataset_id uuid?, processed int, total int, failed int, error_log jsonb, started_at timestamptz, completed_at timestamptz`
  - Status check constraint: `pending | running | completed | failed`
  - Action check constraint: `map_existing | gemini_enrich`
  - Ref: Req 14, Req 15

- [ ] 7.2 Create `POST /api/admin/catalog/enrichment/run` route
  - Auth: `verifyAdminToken()` — same pattern as other admin routes
  - Dry run returns synchronous response (no job row): `{ dry_run: true, would_process, samples[] }`
  - Non-dry-run: atomic insert into `enrichment_jobs` with single-job enforcement (`WHERE NOT EXISTS ... status IN ('pending', 'running')`)
  - Invokes Supabase Edge Function `run-enrichment` with `job_id`
  - Returns 409 if a job is already pending/running
  - Ref: Req 14, Req 15

- [ ] 7.3 Create `GET /api/admin/catalog/enrichment/status` route
  - Lightweight aggregation on `dataset_samples`: total, with_agent_context, with_embedding, pending each
  - Per-dataset breakdown joined with `datasets` table
  - Ref: Req 16

- [ ] 7.4 Create `GET /api/admin/catalog/enrichment/job/[id]` route
  - Reads single row from `enrichment_jobs`
  - Accepts `?log_offset=N` to return only log entries after offset N
  - Ref: Req 14

- [ ] 7.5 Create Supabase Edge Function `supabase/functions/run-enrichment/index.ts`
  - Reads job row, sets status to `running`, iterates candidate samples
  - For `map_existing`: uses field-mapping layer from `src/lib/enrichment/field-mapper.ts`
  - For `gemini_enrich`: calls Gemini API for unenriched samples
  - Updates `processed`, `failed`, `error_log` after each sample
  - Sets `completed` or `failed` on finish
  - Ref: Req 14, Req 17

- [ ] 7.6 Create `/admin/catalog/enrichment` page + `EnrichmentClient.tsx`
  - Status overview with progress bars and per-dataset breakdown table
  - Per-dataset dropdown with "Map Existing" and "Gemini Enrich" options
  - Global action buttons + dry run checkbox
  - Job progress panel: polls job/:id every 3s, shows terminal-style log
  - Cross-navigation: `[search catalog]` bracket-link to `/admin/catalog/search`
  - Ref: Req 14–17

### 8. E2E Tests + UAT (US-015, US-016)

- [ ] 8.1 Create `tests/e2e/catalog-search.spec.ts` — Playwright E2E test
  - Admin login, navigate to search page, submit query, assert results with similarity percentages and media elements
  - Test empty state and validation
  - Ref: US-015

- [ ] 8.2 Playwright MCP User Acceptance Testing
  - Verify agent_context and embedding populated for test samples
  - Test search UI with multiple queries
  - Test MCP endpoint directly via JSON-RPC
  - Verify no s3:// strings in any response
  - Ref: US-016

---

## Critical Path

```
1.1 DB migration
 |
 +---> 1.2 match_samples function
 |      |
 |      +---> 4.5 integration test for match_samples
 |      +---> 5.2-5.4 MCP tools (after 5.1)
 |      +---> 6.1 admin search API
 |
 +---> 1.3 types  ----+
 |                     |
 +---> 1.4 scrub util -+---> 2.1-2.3 field-mapper ---> 3.2-3.3 CLI script
 |                     |                           \
 +---> 1.5 generateEmbedding --+---> 4.2 Edge Function
 |                     |                            \
 |                     +---> 5.2 search_catalog tool +---> 7.1-7.6 enrichment mgmt
 |                     +---> 6.1 admin search API
 |
 +---> 7.1 enrichment_jobs migration (can start early, no deps beyond 1.1)
```

Parallelizable work after 1.x completes:
- Track A: Field mapping (2.x) + Gemini CLI (3.x)
- Track B: Embedding pipeline (4.x)
- Track C (after 4.x): MCP server (5.x) and Admin UI (6.x) can run in parallel
- Track D (after 2.x + 4.x): Enrichment management (7.x) — depends on field-mapper and embedding pipeline
- Track E (after 5.x + 7.x): E2E tests + UAT (8.x)

---

## Rollback Plan

All changes are additive and reversible:
- `agent_context` column: nullable, no existing code reads it. Safe to `ALTER TABLE dataset_samples DROP COLUMN agent_context;`
- `embedding` column: nullable, no existing code reads it. Safe to drop.
- `match_samples` function: `DROP FUNCTION IF EXISTS match_samples;`
- Enrichment script: idempotent, only writes to `agent_context IS NULL` rows. Re-running is safe.
- `enrichment_jobs` table: new table, no existing code reads it. Safe to `DROP TABLE IF EXISTS enrichment_jobs;`
- MCP route + admin search page + enrichment management page: new files only, no existing routes modified.
- `run-enrichment` Edge Function: new function, safe to remove via `supabase functions delete run-enrichment`.
- Only refactor: `scrubS3Urls` extraction (task 1.4) — revert by copying function back to portal route.
