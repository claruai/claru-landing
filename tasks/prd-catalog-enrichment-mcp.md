# PRD: Catalog Semantic Enrichment & MCP Server

## Introduction

Enable AI agents (Claude Code / Claude agents) to semantically search the Claru dataset catalog and surface relevant samples for outbound sales messaging. Today the catalog has rich media but no semantic layer — an agent can't answer "find me samples in home kitchen environments with active hand manipulation." This feature adds:

1. A **Gemini enrichment pipeline** that generates free-form `agent_context` JSON per sample (no fixed taxonomy — Gemini describes what it sees)
2. A **pgvector embedding column** on `dataset_samples` kept in sync automatically via a polling Edge Function (Vercel cron every 60s) + a Postgres trigger that clears stale embeddings
3. A **`match_samples` Postgres function** for cosine similarity search
4. An **MCP server** at `/api/mcp` with three tools: `search_catalog`, `get_dataset_overview`, `build_lead_brief`
5. An **Admin Search UI** at `/admin/catalog/search` for manual testing

## Supporting Documentation

The following docs were generated before this PRD. **The implementing agent MUST read the referenced sections before starting each story.**

| Document | Contents |
|---|---|
| `tasks/docs/catalog-enrichment-requirements.md` | 13 detailed requirements, field-mapping rules per enrichment variant, error scenarios, env var specs |
| `tasks/docs/catalog-enrichment-design.md` | Architecture diagram, TypeScript interfaces, DB schema, SQL functions, Edge Function code, MCP tool schemas, component hierarchy |
| `tasks/docs/catalog-enrichment-plan.md` | 24+ tasks across 7 groups, 6 PRs, parallelization map, risk mitigations (pgmq/pg_cron availability, pgvector extension) |

---

## Goals

- An AI agent can call `search_catalog("home kitchen manipulation")` and receive ranked sample results with signed media URLs within 500ms
- 100% of existing enrichment data is mapped to `agent_context` without re-running Gemini (no duplication, no cost)
- All ~160 unenriched samples receive Gemini-generated `agent_context` via idempotent batch script
- Embeddings stay in sync automatically when `agent_context` is updated
- No internal S3 paths (`s3://...`) ever reach MCP clients
- Admin can verify semantic search quality via `/admin/catalog/search` before shipping

---

## User Stories

### US-000: Create .env.example with all required environment variables
**Description:** As a developer, I need a `.env.example` file committed to the repo that documents every environment variable required by the enrichment and MCP features, so new contributors can set up their environment without guessing.

**Acceptance Criteria:**
- [ ] `.env.example` created at project root with all required variables and placeholder comments:
  ```
  # Required for embedding generation (OpenAI text-embedding-3-small)
  # Used by: Edge Function (embed-samples), backfill script, MCP search, admin search API
  OPENAI_API_KEY=sk-...

  # Required for Gemini Vision enrichment of unenriched samples
  # Used by: enrich-samples-gemini script, enrich-video-index-gemini script
  GEMINI_API_KEY=AI...

  # Bearer token for MCP server authentication (generate a random 64-char hex string)
  # Used by: /api/mcp route — Claude agent connections
  ADMIN_MCP_TOKEN=

  # Supabase project credentials (already required by portal)
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=

  # AWS S3 credentials (already required by portal)
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_REGION=us-east-1
  ```
- [ ] Comments note which deployment targets need each variable (Vercel, Supabase Edge Functions, local scripts)
- [ ] `.env.example` is NOT gitignored (it must be committed)
- [ ] `.env.local` remains gitignored (no change)
- [ ] `npx tsc --noEmit` passes (no code changes, just env template)
- [ ] **Code Review:** Run `code-reviewer` agent to verify no real secrets are in the example file

**Recommended agents/skills:** `code-reviewer`

---

### US-001: Enable pgvector and add DB columns
**Description:** As a developer, I need the vector extension enabled and new columns added to `dataset_samples` so embeddings and agent context can be stored.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Database Schema, Migration SQL)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-4 pgvector, Req-13 non-destructive migration)
- Plan: `tasks/docs/catalog-enrichment-plan.md` (sections: Task 1.1, Risk: pgvector extension)

**Acceptance Criteria:**
- [ ] `create extension if not exists vector with schema extensions` runs successfully on the Supabase project
- [ ] `alter table dataset_samples add column agent_context jsonb` — only added if not exists
- [ ] `alter table dataset_samples add column embedding extensions.vector(1536)` — only added if not exists
- [ ] HNSW index created: `create index on dataset_samples using hnsw (embedding extensions.vector_cosine_ops)`
- [ ] Migration is idempotent — running twice does not error
- [ ] TypeScript types updated in `src/types/data-catalog.ts` to include `agent_context` and `embedding` fields
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test that migration SQL is valid and columns are nullable with correct types
- [ ] **Code Review:** Run `code-reviewer` agent to verify migration safety and index choice

**Recommended agents/skills:** `supabase-expert`, `code-reviewer`

---

### US-002: Extract scrubS3Urls into shared lib
**Description:** As a developer, I need `scrubS3Urls()` available as a shared utility so MCP routes and the enrichment pipeline can both use it without duplication.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: S3 Scrubbing, Shared Utilities)

**Acceptance Criteria:**
- [ ] `src/lib/scrub-s3-urls.ts` created and exports `scrubS3Urls(value: unknown): unknown`
- [ ] Handles all S3 reference variants:
  - `s3://bucket-name/path/to/object` (standard S3 URI)
  - `s3%3A%2F%2Fbucket-name%2Fpath` (URL-encoded variant)
  - `arn:aws:s3:::bucket-name/path` (ARN-style references)
  - Presigned AWS URLs containing `X-Amz-Signature` or `AWSAccessKeyId` query params in text fields
- [ ] Replacement is surgical: only the matching S3 portion of a string is replaced (e.g. `"See s3://bucket/key for details"` becomes `"See [S3_REDACTED] for details"`, NOT the entire string replaced)
- [ ] `/api/portal/s3-annotation/route.ts` updated to import from shared lib (no behaviour change)
- [ ] `/api/portal/catalog/[id]/page.tsx` updated to import from shared lib (no behaviour change)
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test strings with `s3://`, URL-encoded `s3%3A%2F%2F`, ARN-style `arn:aws:s3:::`, presigned URLs, nested objects, arrays, null, numbers — all handled correctly. Test partial replacement preserves surrounding text.
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-003: OpenAI embeddings wrapper
**Description:** As a developer, I need a typed utility to generate embeddings via OpenAI text-embedding-3-small so all embedding generation uses a single consistent interface.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Embedding Generation, OpenAI Client)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-4, Req-12 env vars)

**Acceptance Criteria:**
- [ ] `src/lib/embeddings/openai.ts` exports `generateEmbedding(text: string): Promise<number[]>`
- [ ] Uses `text-embedding-3-small` model, returns 1536-dimension vector
- [ ] Throws typed error if `OPENAI_API_KEY` is not set
- [ ] Also exports `agentContextToEmbeddingText(agentContext: AgentContext): string` utility that concatenates `scene_summary + environments.join(", ") + activities.join(", ") + objects.join(", ") + camera_perspective` with newline separators, handling missing/empty fields gracefully
- [ ] All call sites that generate embeddings from `agent_context` MUST use `agentContextToEmbeddingText()` instead of `agent_context.scene_summary` alone — this produces richer embeddings that capture the full semantic content
- [ ] `.env.local` has `OPENAI_API_KEY=` placeholder added (value not committed)
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Mock OpenAI client; test happy path returns array of 1536 numbers; test missing API key throws; test empty string input; test `agentContextToEmbeddingText` with full context, partial context, and missing fields
- [ ] **Code Review:** Run `code-reviewer` agent — verify no key leakage in logs

**Recommended agents/skills:** `code-reviewer`
> **Rule check:** Before implementing, check context7/Supabase docs MCP and OpenAI SDK docs if needed. Use `mcp__supabase-db__search_docs` for pgvector patterns.

---

### US-004: match_samples Postgres RPC function
**Description:** As a developer, I need a Postgres function that performs cosine similarity search over sample embeddings so MCP tools and the admin API can find semantically relevant samples.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: match_samples SQL, Similarity Metric)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-5)

**Acceptance Criteria:**
- [ ] SQL migration creates `match_samples(query_embedding extensions.vector(1536), match_count int, dataset_id uuid default null)` function
- [ ] Returns `table(sample_id uuid, dataset_id uuid, dataset_name text, similarity float, agent_context jsonb, s3_object_key text, mime_type text)`
- [ ] Optional `dataset_id` filter narrows results to one dataset
- [ ] Results ordered by cosine similarity descending, limited to `match_count`
- [ ] Function handles NULL embeddings (samples not yet embedded are excluded)
- [ ] Callable via `supabase.rpc('match_samples', {...})`
- [ ] **Unit Tests:** Test with mock embedding data; verify ordering; verify dataset filter; verify NULL embedding exclusion
- [ ] **Code Review:** Run `code-reviewer` agent — verify SQL injection safety

**Recommended agents/skills:** `supabase-expert`, `code-reviewer`

---

### US-005: Field-mapping layer (existing enrichment → agent_context)
**Description:** As a developer, I need a script that maps existing `enrichment_json` data into the canonical `agent_context` schema WITHOUT calling Gemini, so we don't duplicate work or incur API costs for ~150 already-enriched samples.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Field Mapping Strategy, AgentContext TypeScript Interface, Schema Variants)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-3 mapping layer, Req-13)
- Plan: `tasks/docs/catalog-enrichment-plan.md` (sections: Group 2 tasks 2.1–2.4)

**Acceptance Criteria:**
- [ ] `scripts/map-enrichment-to-agent-context.ts` created
- [ ] Detects enrichment variant: Egocentric (has `environment_label`), Food/Lifestyle (has `captions.detailed`), Generic (fallback)
- [ ] **Egocentric mapping:** `scene_summary` = `task_description + " " + environment_description`; `environments` from `environment_label`; `activities` from `task`; `camera_perspective` = `"egocentric_first_person"`; `technical` from `technical_specs`
- [ ] **Food/Lifestyle mapping:** `scene_summary` from `captions.detailed`; `activities` from `captions.activities`; `objects` from `captions.objects`
- [ ] **Generic mapping:** attempts `scene_analysis`, `captions.detailed`, `description` fields in order
- [ ] Script is idempotent — skips samples where `agent_context IS NOT NULL`
- [ ] `--dry-run` flag logs what would be written without writing
- [ ] `--dataset-id` flag limits to one dataset
- [ ] Summary log: "Mapped X / skipped Y (already set) / failed Z"
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test each variant mapper with fixture data; test idempotency check; test dry-run mode
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-006: Gemini enrichment pipeline (unenriched samples)
**Description:** As a developer, I need a batch script that calls Gemini Vision on each sample with no `agent_context` and writes the result, so all ~160 unenriched samples get semantic descriptions.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Gemini Client, Prompt Template, AgentContext Interface)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-2 Gemini pipeline, Req-12 GEMINI_API_KEY)
- Plan: `tasks/docs/catalog-enrichment-plan.md` (sections: Group 3, Risk: signed URL access)

**Acceptance Criteria:**
- [ ] `scripts/enrich-samples-gemini.ts` created
- [ ] Uses `gemini-2.0-flash` model with Gemini Vision API
- [ ] For each unenriched sample: generates signed URL via `getS3SignedUrl()`, sends to Gemini with open-ended prompt (NO fixed taxonomy — prompt asks Gemini to freely describe environment, activities, objects, camera perspective, people)
- [ ] Gemini response parsed into `AgentContext` interface — unknown/extra fields are preserved (not stripped)
- [ ] S3 URLs scrubbed from Gemini response before writing to DB using `scrubS3Urls()`
- [ ] Only processes samples where `agent_context IS NULL` (idempotent)
- [ ] Concurrency controlled via `p-limit` — max 5 concurrent Gemini requests to avoid rate limiting
- [ ] Exponential backoff on HTTP 429 responses: initial delay 1s, max 3 retries per sample, backoff factor 2x
- [ ] `--dry-run`, `--dataset-id`, `--limit` flags supported
- [ ] Per-sample error handling — one failure does not stop the batch; failures logged with sample ID
- [ ] `.env.local` has `GEMINI_API_KEY=` placeholder added
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Mock Gemini client; test prompt construction; test response parsing; test S3 scrubbing on output; test skip-if-set logic; test 429 backoff triggers retry; test max retry exhaustion logs and continues
- [ ] **Code Review:** Run `code-reviewer` agent — check for API key leakage, rate limiting handling

**Recommended agents/skills:** `code-reviewer`
> **Rule check:** Use `mcp__supabase-db__search_docs` or web search if Gemini Vision API patterns need clarification. Check `@google/generative-ai` SDK docs via context7 MCP if needed.

---

### US-007: Automatic embedding sync pipeline (polling-based)
**Description:** As a developer, I need embeddings to be automatically generated and kept in sync whenever `agent_context` is updated, so the vector search stays current without manual intervention. The primary approach is a polling Edge Function invoked on a schedule.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Automatic Embedding Pipeline, Edge Function)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-4)
- Plan: `tasks/docs/catalog-enrichment-plan.md` (sections: Group 4, Risk: pgmq/pg_cron availability)

**Architecture:**
The primary sync mechanism is a **polling Edge Function** that queries for samples needing embeddings. No pgmq queue is required. The Edge Function runs a simple query:
```sql
SELECT id, agent_context FROM dataset_samples
WHERE agent_context IS NOT NULL AND embedding IS NULL
LIMIT 10
```
This is invoked by either:
1. **Vercel cron** at `/api/cron/embed-samples` (preferred — runs every 60s via `vercel.json` cron config), OR
2. **pg_cron** if available on the Supabase plan (`SELECT cron.schedule('embed-samples', '* * * * *', ...)` — minimum resolution is 60 seconds)

pgmq is an **optional optimization** for event-driven processing if higher throughput is needed later. It is NOT required for the initial implementation.

**Acceptance Criteria:**
- [ ] Supabase Edge Function `embed-samples` deployed: polls `dataset_samples WHERE agent_context IS NOT NULL AND embedding IS NULL LIMIT 10` → calls `agentContextToEmbeddingText()` on each → generates embedding via OpenAI text-embedding-3-small → writes `embedding` column
- [ ] Edge Function authenticates with **service role key** (not anon key) — anon key lacks write access to `embedding` column
- [ ] Vercel cron route created at `src/app/api/cron/embed-samples/route.ts` — invokes the Edge Function via HTTP, validates `CRON_SECRET` header to prevent unauthorized invocation
- [ ] `vercel.json` updated with cron entry: `{ "path": "/api/cron/embed-samples", "schedule": "* * * * *" }` (every 60 seconds)
- [ ] Postgres trigger on `dataset_samples` clears `embedding` column to NULL when `agent_context` changes (ensures stale embeddings don't persist and the polling query picks them up)
- [ ] Batch size: 10 samples per invocation
- [ ] Per-sample error handling — one failure does not stop the batch; failed samples remain with `embedding IS NULL` and will be retried on next poll
- [ ] Edge Function deployed via `supabase functions deploy embed-samples`
- [ ] `npx tsc --noEmit` passes
- [ ] **Integration Tests:** Insert a sample with `agent_context`, wait 90s (one cron cycle + processing), verify `embedding` is populated with 1536-dim vector
- [ ] **Code Review:** Run `code-reviewer` agent — verify no OpenAI key exposure in logs, verify service role key is used (not anon key)

**Optional pgmq optimization (deferred):**
If higher-throughput event-driven embedding is needed in the future, a Postgres trigger can enqueue jobs to a pgmq queue `embedding_jobs` on `agent_context` insert/update, and the Edge Function can drain the queue instead of polling. This is additive and does not change the polling implementation.

**Recommended agents/skills:** `supabase-expert`, `code-reviewer`
> **Rule check:** Use `mcp__supabase-db__search_docs` to verify pg_cron availability for this project. Reference `https://supabase.com/docs/guides/ai/automatic-embeddings` for the exact pipeline architecture.

---

### US-008: Backfill embeddings for existing agent_context
**Description:** As a developer, I need a one-time script to generate embeddings for all samples that already have `agent_context` but no `embedding`, so the vector index is populated immediately after the pipeline is set up.

**Reference docs:**
- Plan: `tasks/docs/catalog-enrichment-plan.md` (sections: Task 4.5 backfill)

**Acceptance Criteria:**
- [ ] `scripts/backfill-embeddings.ts` created
- [ ] Queries all samples where `agent_context IS NOT NULL AND embedding IS NULL`
- [ ] Calls `generateEmbedding(agentContextToEmbeddingText(sample.agent_context))` for each — uses the concatenated embedding text, not `scene_summary` alone
- [ ] Writes embedding to DB in batches of 20
- [ ] Idempotent — safe to run multiple times
- [ ] Summary log: "Embedded X / skipped Y / failed Z"
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test batch logic; test skip-if-set; test error isolation per sample
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-009: MCP server — scaffold and auth (MCP SDK transport)
**Description:** As a developer, I need the MCP server endpoint scaffolded using the official MCP SDK with `StreamableHTTPServerTransport` and bearer token authentication, so Claude agents can connect using standard MCP protocol.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: MCP Server Architecture, Auth)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-6 MCP transport, Req-12 ADMIN_MCP_TOKEN)

**Architecture:**
The MCP server MUST use the official `@modelcontextprotocol/sdk` package with `StreamableHTTPServerTransport`, NOT a custom `tool_name` dispatch pattern. Tools are registered via `mcpServer.tool()` calls on a `McpServer` instance. The transport handles JSON-RPC framing, tool discovery, and response formatting automatically.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({ name: "claru-catalog", version: "1.0.0" });

// Tools registered via server.tool() — NOT custom dispatch
server.tool("search_catalog", searchCatalogSchema, searchCatalogHandler);
server.tool("get_dataset_overview", overviewSchema, overviewHandler);
server.tool("build_lead_brief", briefSchema, briefHandler);
```

**Acceptance Criteria:**
- [ ] `src/app/api/mcp/route.ts` created with POST handler using `StreamableHTTPServerTransport`
- [ ] `src/lib/mcp/server.ts` created — instantiates `McpServer` and exports it; tools registered via `server.tool()` calls
- [ ] Auth: reads `Authorization: Bearer <token>` header; rejects with 401 if token doesn't match `ADMIN_MCP_TOKEN` env var
- [ ] Token comparison uses `crypto.timingSafeEqual` to prevent timing attacks (both buffers must be equal length — pad/hash if needed)
- [ ] Rate limiting: 100 requests/minute and 1000 requests/hour per IP, returning 429 with `Retry-After` header when exceeded (use in-memory store; Redis is not required for Phase 1)
- [ ] GET handler returns server capabilities / tool list per MCP spec (handled by transport)
- [ ] DELETE handler for session cleanup per MCP spec (handled by transport)
- [ ] `ADMIN_MCP_TOKEN` added to `.env.local` placeholder
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test auth rejection with wrong/missing token; test timing-safe comparison; test rate limit enforcement (101st request in 60s returns 429); test that registered tools appear in capabilities
- [ ] **Code Review:** Run `code-reviewer` agent — verify no token leakage, verify timing-safe comparison

**Spike task (pre-implementation):**
Before building the full route, run a minimal spike to verify `StreamableHTTPServerTransport` works correctly in a Vercel serverless function:
- Verify connection lifecycle: does the transport correctly handle request/response in a stateless serverless context (no persistent WebSocket)?
- Verify session management: does `StreamableHTTPServerTransport` support stateless mode or require session affinity?
- Document findings in a code comment at the top of `route.ts`
- If `StreamableHTTPServerTransport` is incompatible with serverless, fall back to `SSEServerTransport` or a manual JSON-RPC handler that still uses `McpServer` for tool registration

**Recommended agents/skills:** `code-reviewer`
> **Rule check:** Use context7 MCP (`mcp__context7__resolve-library-id` + `mcp__context7__query-docs`) to read the latest `@modelcontextprotocol/sdk` docs before implementing. Verify the transport class names and constructor signatures.

---

### US-010: MCP tool — search_catalog
**Description:** As a Claude agent, I want to call `search_catalog` with a natural language query and receive ranked matching samples with media URLs so I can identify relevant datasets for a lead.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: search_catalog tool schema, match_samples RPC)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-7)

**Acceptance Criteria:**
- [ ] Tool input schema: `{ query: string, limit?: number (default 10, max 50), dataset_id?: string }`
- [ ] Handler: embeds `query` via `generateEmbedding(query)` → calls `match_samples` RPC → fetches signed URL for each result via `getS3SignedUrl()` (note: query text is embedded directly, NOT via `agentContextToEmbeddingText` — that utility is only for converting stored agent_context to embedding input)
- [ ] Tool output per result: `{ sample_id, dataset_id, dataset_name, similarity, scene_summary, environments, activities, objects, camera_perspective, signed_url, mime_type }`
- [ ] S3 URLs scrubbed from `agent_context` before returning (via `scrubS3Urls()`)
- [ ] Signed URLs generated with 1-hour expiry
- [ ] Empty results returns `{ results: [], message: "No samples found matching query" }`
- [ ] Response time < 2s for limit=10
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Mock match_samples RPC; test output shape; test S3 scrubbing applied; test empty results
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-011: MCP tool — get_dataset_overview
**Description:** As a Claude agent, I want to call `get_dataset_overview` with a dataset ID and receive a complete summary of the dataset including sample breakdown so I can describe it accurately to a lead.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: get_dataset_overview tool schema)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-8)

**Acceptance Criteria:**
- [ ] Tool input schema: `{ dataset_id: string }`
- [ ] Queries `datasets` table for name, description, category, subcategory, total_samples, total_duration_hours, annotation_types
- [ ] Queries `dataset_samples` for all samples with `agent_context`, aggregates: top 5 environments, top 5 activities, camera perspectives breakdown, count with embeddings, count without
- [ ] Returns up to 3 representative sample signed URLs (highest-quality based on `agent_context.quality_notes` or first 3)
- [ ] Returns 404-style error if dataset not found
- [ ] S3 URLs scrubbed from any agent_context fields
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test aggregation logic; test missing dataset error; test empty samples case
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-012: MCP tool — build_lead_brief
**Description:** As a Claude agent, I want to call `build_lead_brief` with a company description and use case and receive raw structured data about the most relevant datasets and samples so I can compose outbound messaging.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: build_lead_brief tool schema)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-9 — raw data only, no pre-written copy)

**Acceptance Criteria:**
- [ ] Tool input schema: `{ company_description: string, use_case: string, limit?: number (default 5) }`
- [ ] Internally calls `search_catalog` with `company_description + " " + use_case` as query
- [ ] Groups results by dataset — returns top datasets with: dataset name, total_samples, annotation_types, sample count returned, representative signed URLs (up to 3 per dataset), aggregated environments and activities from matched samples
- [ ] Output is raw structured data — NO pre-written email copy, NO marketing language
- [ ] Calling agent is responsible for composing messaging from the data
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test grouping logic; test output contains no copy/marketing text; test with zero results
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-013: Admin catalog search API route
**Description:** As an admin, I need a backend API endpoint that accepts a text query and returns semantically matching samples so the admin search UI can display results.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Admin Search API Route)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-10 Admin UI)

**Acceptance Criteria:**
- [ ] `POST /api/admin/catalog/search` route created
- [ ] Request body: `{ query: string, dataset_id?: string, limit?: number (default 20) }`
- [ ] Auth: `verifyAdminToken()` — rejects with 401 if not authenticated
- [ ] Handler: embeds query → calls `match_samples` RPC → fetches signed URLs → returns results
- [ ] Response: `{ results: [{ sample_id, dataset_id, dataset_name, similarity, agent_context, signed_url, mime_type }] }`
- [ ] Returns `{ results: [] }` for no matches (not 404)
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test auth rejection; test response shape; test empty results; test limit enforcement
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`

---

### US-014: Admin catalog search UI
**Description:** As an admin, I want a search page at `/admin/catalog/search` where I can type a natural language query and see matching samples with thumbnails, similarity scores, and context so I can verify the semantic search quality before using the MCP.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Admin Search UI, Component Hierarchy)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-10)

**Acceptance Criteria:**
- [ ] Page exists at `/admin/catalog/search` within the existing admin layout
- [ ] Link to "Catalog Search" added in admin nav or `/admin/catalog` header
- [ ] **Cross-navigation:** `[enrichment status]` bracket-link on the search page linking to `/admin/catalog/enrichment`, using the existing `AdminCatalogHeader` bracket-link pattern
- [ ] Server component fetches dataset list for optional filter dropdown
- [ ] Client component: text input, optional dataset filter dropdown, "Search" button
- [ ] On search: POST to `/api/admin/catalog/search`, shows loading state, displays results
- [ ] Each result card shows: thumbnail (video/image via signed URL), dataset name, similarity score displayed as **percentage** in UI (e.g. "87% match" — multiply raw float by 100 and round), `scene_summary` text, environment/activity tags
- [ ] API response returns similarity as raw float (0.0–1.0); UI converts to percentage for display
- [ ] Video elements use `preload="none"` to avoid unnecessary bandwidth on page load
- [ ] Gracefully handles samples where `agent_context` is null — shows "Not yet enriched" placeholder instead of crashing
- [ ] **Idle state** (before any search): show example queries users can click (e.g. "home kitchen manipulation", "outdoor urban egocentric", "first person hand activities") — clicking an example populates the search input and executes the query
- [ ] Empty state (after search with no results): "No samples found. Try a broader query."
- [ ] Error state: shows error message if API fails
- [ ] Matches existing admin dark-mode terminal aesthetic (font-mono, var(--bg-secondary), var(--accent-primary))
- [ ] `npx tsc --noEmit` passes
- [ ] Verify in browser using Playwright MCP or webapp-testing skill
- [ ] **Unit Tests:** Test result card renders with all fields; test empty state; test loading state; test idle state with example queries; test null agent_context fallback; test similarity percentage conversion
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `frontend-expert`, `Shadcn UI Designer`, `code-reviewer`

---

### US-014b: Admin enrichment management API
**Description:** As a developer, I need API endpoints that allow the admin UI to trigger enrichment jobs (field mapping + Gemini) and monitor their progress, so admins don't need CLI access. Job state is persisted in a Supabase `enrichment_jobs` table (not in-memory) so it survives Vercel serverless cold starts.

**Reference docs:**
- Design: `tasks/docs/catalog-enrichment-design.md` (sections: Enrichment Management API/UI, Field Mapping Strategy, Gemini Client)
- Requirements: `tasks/docs/catalog-enrichment-requirements.md` (sections: Req-2, Req-3, Req-14 through Req-17)

**Database:**
- [ ] Create `enrichment_jobs` table via migration:
  ```sql
  CREATE TABLE IF NOT EXISTS enrichment_jobs (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    action        text NOT NULL
                  CHECK (action IN ('map_existing', 'gemini_enrich')),
    dataset_id    uuid REFERENCES datasets(id) ON DELETE SET NULL,
    processed     int NOT NULL DEFAULT 0,
    total         int NOT NULL DEFAULT 0,
    failed        int NOT NULL DEFAULT 0,
    error_log     jsonb NOT NULL DEFAULT '[]',
    started_at    timestamptz,
    completed_at  timestamptz
  );
  ```

**Acceptance Criteria:**
- [ ] `POST /api/admin/catalog/enrichment/run` — triggers enrichment for a given scope:
  - Body: `{ action: "map_existing" | "gemini_enrich", dataset_id?: string, limit?: number, dry_run?: boolean }`
  - `map_existing`: runs the same field-mapping logic as `scripts/map-enrichment-to-agent-context.ts` (maps existing enrichment_json → agent_context)
  - `gemini_enrich`: runs Gemini enrichment for samples where `agent_context IS NULL` (same logic as `scripts/enrich-samples-gemini.ts`)
  - **Dry run** returns a synchronous response (no job row created): `{ dry_run: true, would_process: number, samples: Array<{ id, filename, dataset_name }> }`
  - **Non-dry-run** creates a row in `enrichment_jobs` with `status: 'pending'`, then invokes the Supabase Edge Function `run-enrichment` which performs the actual work and updates the row as it progresses. Returns `{ job_id: string, status: "pending", scope: { action, dataset_id, limit } }`
  - Single-job enforcement via atomic DB check: `INSERT INTO enrichment_jobs (...) SELECT ... WHERE NOT EXISTS (SELECT 1 FROM enrichment_jobs WHERE status IN ('pending', 'running'))` — if insert returns 0 rows, return HTTP 409
- [ ] `GET /api/admin/catalog/enrichment/status` — lightweight aggregation query on `dataset_samples` counts:
  - Response: `{ total_samples: number, with_agent_context: number, with_embedding: number, pending_enrichment: number, pending_embedding: number, by_dataset: [{ dataset_id, dataset_name, total, enriched, pending }] }`
- [ ] `GET /api/admin/catalog/enrichment/job/:id` — reads a single row from `enrichment_jobs`:
  - Response includes `log` array: `Array<{ timestamp, sample_id, filename, result: "success" | "failed", error?: string }>`
  - Accepts `?log_offset=N` query parameter — returns only log entries after offset N (avoids refetching entire log on each poll)
- [ ] All endpoints require `verifyAdminToken()` auth
- [ ] `npx tsc --noEmit` passes
- [ ] **Unit Tests:** Test auth; test concurrent job rejection (409 via atomic DB check); test status aggregation query; test dry_run returns preview without writing; test log_offset pagination; test job row created on non-dry-run
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `code-reviewer`, `supabase-expert`

---

### US-014c: Admin enrichment management UI
**Description:** As an admin, I want an enrichment dashboard at `/admin/catalog/enrichment` where I can see which datasets need enrichment, trigger enrichment runs, and monitor progress — without needing CLI access.

**Acceptance Criteria:**
- [ ] Page exists at `/admin/catalog/enrichment` within admin layout
- [ ] Link added in admin catalog header or admin dashboard
- [ ] **Cross-navigation:** `[search catalog]` bracket-link on the enrichment page linking to `/admin/catalog/search`, using the existing `AdminCatalogHeader` bracket-link pattern
- [ ] **Status overview section:** Shows enrichment stats from `GET /api/admin/catalog/enrichment/status`:
  - Total samples, samples with `agent_context`, samples with `embedding`, samples pending each
  - Progress bar: `X% enriched` (samples with agent_context / total)
  - Per-dataset breakdown table: dataset name, total samples, enriched count, pending count, per-dataset dropdown with "Map Existing" and "Gemini Enrich" options
- [ ] **Action buttons:**
  - "Map Existing Enrichment" button — calls `POST /api/admin/catalog/enrichment/run { action: "map_existing" }`
  - "Run Gemini Enrichment" button — calls `POST /api/admin/catalog/enrichment/run { action: "gemini_enrich" }`
  - Per-dataset dropdown with "Map Existing" and "Gemini Enrich" options — calls with `dataset_id` filter and the selected action
  - Optional limit input (default: all)
  - "Dry Run" checkbox — triggers dry_run mode, shows preview of what would be processed
- [ ] **Job progress section:** When a job is running, polls `GET /api/admin/catalog/enrichment/job/:id` every 3 seconds and shows:
  - Progress bar with processed/total count
  - Real-time log of processed samples (scrollable, terminal-style)
  - Failed sample count with expandable error details
  - "Job completed" / "Job failed" terminal state
- [ ] Only one job can run at a time — buttons disabled while a job is in progress
- [ ] Matches admin terminal aesthetic (font-mono, dark mode, accent colors)
- [ ] `npx tsc --noEmit` passes
- [ ] Verify in browser using Playwright MCP
- [ ] **Unit Tests:** Test status display; test button disable during active job; test dry run preview; test polling interval
- [ ] **Code Review:** Run `code-reviewer` agent

**Recommended agents/skills:** `frontend-expert`, `Shadcn UI Designer`, `code-reviewer`

---

### US-015: Playwright E2E Test — Enrichment + Search Flow
**Description:** As QA, I need an end-to-end test verifying the complete flow from admin search to MCP tool invocation.

**Acceptance Criteria:**
- [ ] Create `tests/e2e/catalog-search.spec.ts`
- [ ] Test flow:
  1. Log in to admin portal (`team@claru.ai`)
  2. Navigate to `/admin/catalog/search`
  3. Type `"home kitchen hand manipulation"` in search input
  4. Click Search
  5. Assert at least 1 result card appears with similarity score > 0
  6. Assert result card shows dataset name, scene_summary text, and a media element (img or video)
  7. Assert similarity score is displayed as a percentage
- [ ] Test uses Page Object Model pattern
- [ ] Test runs against `http://localhost:3020`
- [ ] `npx tsc --noEmit` passes

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`)

---

### US-016: Playwright MCP User Acceptance Testing
**Description:** As QA, I need to perform full user acceptance testing via Playwright MCP against the running dev server to verify the complete feature works end-to-end as a real user.

**Acceptance Criteria:**
- [ ] Verify dev server is running on port 3020 with latest staging changes
- [ ] Verify `agent_context` is populated for at least 5 samples across 2+ different datasets (run mapping + Gemini scripts if needed)
- [ ] Verify `embedding` column is populated for those samples
- [ ] Use Playwright MCP to navigate to `/admin/catalog/search` as admin user
- [ ] Perform query: `"egocentric first person home activities"` — verify results appear with correct dataset names
- [ ] Perform query: `"industrial outdoor surveillance"` — verify results or appropriate empty state
- [ ] Take screenshot of results page for visual verification
- [ ] Test MCP endpoint directly via MCP client or JSON-RPC: `POST /api/mcp` with `{ "jsonrpc": "2.0", "method": "tools/call", "params": { "name": "search_catalog", "arguments": { "query": "robotics manipulation" } }, "id": 1 }` — verify structured JSON-RPC response
- [ ] Verify no `s3://` strings appear anywhere in MCP responses
- [ ] Document any issues found; fix critical blockers before marking complete

> **Rule 2 (UAT):** During this story, use ONLY the abilities a regular admin user has — use the admin portal UI, not direct DB access. Any bugs found must be reproducible through the UI.

**Recommended agents/skills:** Playwright MCP (`mcp__playwright`), `webapp-testing` skill

---

## Functional Requirements

- **FR-1:** `dataset_samples` must have `agent_context jsonb` and `embedding extensions.vector(1536)` columns
- **FR-2:** `agent_context` schema: `{ scene_summary: string, environments: string[], activities: string[], objects: string[], camera_perspective: string, people_count: string, technical: { fps?, duration?, resolution? }, quality_notes: string }`
- **FR-3:** Field-mapping script processes all samples with existing `enrichment_json` without calling Gemini — Egocentric, Food/Lifestyle, and generic variants handled separately
- **FR-4:** Gemini enrichment script processes only `agent_context IS NULL` samples — open-ended prompt, no fixed taxonomy
- **FR-5:** Supabase trigger clears `embedding` to NULL whenever `agent_context` is set or updated; polling Edge Function picks up samples needing embeddings
- **FR-6:** Edge Function generates 1536-dim embedding from `agentContextToEmbeddingText(agent_context)` (concatenated fields, not `scene_summary` alone) via OpenAI text-embedding-3-small
- **FR-7:** `match_samples(query_embedding, match_count, dataset_id?)` RPC returns results ordered by cosine similarity
- **FR-8:** MCP server at `/api/mcp` uses `@modelcontextprotocol/sdk` with `StreamableHTTPServerTransport` and bearer token auth (timing-safe comparison); rate-limited to 100 req/min, 1000 req/hr
- **FR-9:** All three MCP tools (`search_catalog`, `get_dataset_overview`, `build_lead_brief`) implemented and tested
- **FR-10:** All `agent_context` data returned via MCP has `s3://` strings scrubbed via `scrubS3Urls()`
- **FR-11:** Admin search page at `/admin/catalog/search` accessible to authenticated admins
- **FR-12:** Search response time < 2s for limit=10 queries
- **FR-13:** Admin enrichment status API shows per-dataset enrichment progress (total, enriched, pending)
- **FR-14:** Admin can trigger field-mapping and Gemini enrichment from `/admin/catalog/enrichment` without CLI access
- **FR-15:** Only one enrichment job runs at a time (409 if concurrent)
- **FR-16:** Enrichment progress is visible in real-time via polling (3s interval)

---

## Non-Goals

- No public/unauthenticated MCP access
- No real-time Gemini re-enrichment on portal sample views (batch only via admin UI or CLI)
- No pre-written email copy from `build_lead_brief` — raw data only
- No embeddings for `metadata_json` (only `agent_context`)
- No support for non-Claude agent frameworks in this phase

---

## Technical Considerations

- **pgvector:** Must enable `vector` extension on Supabase project before migration — check via `select * from pg_extension where extname = 'vector'`
- **pg_cron resolution:** pg_cron minimum resolution is 60 seconds (not 10 seconds). The primary embedding sync approach is polling via Vercel cron (every 60s); pg_cron is an alternative if available. pgmq is an optional optimization, not required.
- **OpenAI SDK:** Use `openai` npm package (already common in Next.js projects) — check context7 MCP or web search for any API surface changes if debugging
- **Gemini SDK:** Use `@google/generative-ai` — use context7 MCP to read latest docs before implementing
- **Signed URLs for Gemini:** Gemini Vision can accept public URLs — pass CloudFront signed URL for `moonvalley-annotation-platform` samples; direct S3 presigned URL for other buckets (already working pattern)
- **Embedding sync lag:** There will be up to ~60s lag between `agent_context` write and `embedding` availability due to polling interval — acceptable for batch enrichment use case
- **Embedding input text:** Embeddings are generated from `agentContextToEmbeddingText()` which concatenates `scene_summary + environments + activities + objects + camera_perspective`, not `scene_summary` alone. This produces richer, more discriminative vectors.
- **Vercel cold starts:** MCP route may experience cold start latency — not an issue for agent use (agents are tolerant of latency)

---

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** — Test core logic, validation, field mapping, edge cases
2. **Code Review** — Run `code-reviewer` agent after EACH story completion
3. **Type Safety** — All code must pass `npx tsc --noEmit` strict mode

### Execution Rules (Reference the 3 Project Rules)
1. **Before each story:** Check which agents, skills, and MCPs are available and relevant (Playwright MCP for browser testing, `mcp__supabase-db__search_docs` for Supabase patterns, context7 for package docs)
2. **UAT testing (US-016):** Test only with abilities a real admin user has — portal UI only, no direct DB access
3. **Package debugging:** Use `mcp__supabase-db__search_docs`, context7 MCP, or web search before guessing at API behaviour

### PR Structure (from implementation plan)
- **PR 1:** US-000 to US-004 (Foundation — env template + DB + types + shared utils + match_samples)
- **PR 2:** US-005 + US-006 (Enrichment — field mapping + Gemini pipeline) — can parallelise with PR 3
- **PR 3:** US-007 + US-008 (Embedding pipeline + backfill) — can parallelise with PR 2
- **PR 4:** US-009 to US-012 (MCP server + all 3 tools)
- **PR 5:** US-013 + US-014 + US-014b + US-014c (Admin search UI + enrichment management UI)
- **PR 6:** US-015 + US-016 (E2E tests + UAT)

---

## Success Metrics

- An AI agent calling `search_catalog("home kitchen manipulation")` returns ≥ 3 relevant results in < 2s
- 100% of samples with existing `enrichment_json` have `agent_context` populated without Gemini API calls
- 100% of unenriched samples have `agent_context` after Gemini batch script
- Zero `s3://` strings in any MCP API response
- Admin can locate a specific sample type (e.g. "outdoor urban egocentric") via the search UI in < 30 seconds

---

## Open Questions

- Is `ADMIN_MCP_TOKEN` a single static token or should it rotate? (Static is fine for now — add rotation in Phase 2)
- Should `build_lead_brief` also pull dataset-level metadata (description, annotation_types) from the `datasets` table in addition to sample data? (Recommended yes — minimal extra query)
- ~~pgmq/pg_cron availability on the current Supabase plan~~ **RESOLVED:** Polling via Vercel cron is the primary approach; pgmq is optional optimization only

---

## Phase 2

Phase 2 (Full Corpus Search) is defined in a separate PRD: **`tasks/prd-full-corpus-search.md`**

Phase 2 extends semantic search to the full S3 video corpus (size TBD — likely significantly larger than 300k). It is additive and does not modify Phase 1 infrastructure. **Phase 1 must be completed and tested before starting Phase 2.**

---

## Review Findings Incorporated

The following changes were made to this PRD based on a review conducted on 2026-03-20. Each change is categorized by severity.

### CRITICAL

| # | Story | Change | Rationale |
|---|-------|--------|-----------|
| 1 | US-007 | Rewrote to make **polling the primary embedding sync approach**. Edge Function polls `WHERE agent_context IS NOT NULL AND embedding IS NULL`. Invoked by Vercel cron at `/api/cron/embed-samples` (every 60s). pgmq demoted to optional optimization. | pgmq may not be available on all Supabase plans; polling is simpler, universally available, and sufficient for the batch enrichment throughput. |
| 2 | US-009 | Rewrote to use **MCP SDK transport pattern** (`StreamableHTTPServerTransport` + `mcpServer.tool()` registration) instead of custom `tool_name` dispatch. Added spike task to verify serverless connection lifecycle. | Custom dispatch bypasses the MCP protocol; the SDK handles JSON-RPC framing, tool discovery, and response formatting correctly. Serverless compatibility must be verified before committing. |
| 3 | US-007 | Changed pg_cron timing from "every 10 seconds" to **"every 60 seconds"**. | pg_cron minimum resolution is 60 seconds (1 minute). 10-second scheduling is not possible. |
| 4 | New US-000 | Added **US-000: Create `.env.example`** as the very first story with all required variables documented. | Prevents environment setup confusion for new contributors; ensures all three keys (OPENAI, GEMINI, ADMIN_MCP_TOKEN) are discoverable. |

### HIGH

| # | Story | Change | Rationale |
|---|-------|--------|-----------|
| 5 | US-002 | Added acceptance criteria for **URL-encoded variants** (`s3%3A%2F%2F`), **ARN-style refs** (`arn:aws:s3:::`), and **presigned AWS URLs** with signature params. Added requirement that replacement is surgical (only matching portion replaced, not entire string). | Real-world data contains encoded URLs and ARN references; naive regex on `s3://` alone would miss them. Replacing entire strings destroys surrounding context. |
| 6 | US-009 | Added **`crypto.timingSafeEqual`** requirement for bearer token comparison. | Prevents timing side-channel attacks on the authentication token. |
| 7 | US-006 | Added **`p-limit` concurrency** (max 5 concurrent) and **exponential backoff on 429** (1s initial, 2x factor, 3 retries). | Without concurrency control, batch Gemini calls will trigger rate limits; without backoff, 429 errors cause permanent failures. |
| 8 | US-007 | Added requirement that Edge Function uses **service role key** (not anon key) for authentication. | Anon key lacks write access to the `embedding` column; service role is required for the Edge Function to update rows. |

### MODERATE

| # | Story | Change | Rationale |
|---|-------|--------|-----------|
| 9 | US-003, US-008, US-010 | Updated embedding input to use **`agentContextToEmbeddingText()`** — concatenates `scene_summary + environments + activities + objects + camera_perspective`. Defined as exported utility in `src/lib/embeddings/openai.ts`. Updated all call sites (US-008 backfill, US-007 Edge Function, Phase 2 US-205). | Embedding only `scene_summary` loses significant semantic signal from structured fields; concatenation produces richer, more discriminative vectors. |
| 10 | US-014 | Fixed similarity score format: **percentage in UI** (87%), **raw float in API**. Added **idle state** with clickable example queries. Added `preload="none"` for video elements. Added `agent_context: null` fallback handling. | Raw floats are not user-friendly; idle state improves discoverability; preload="none" saves bandwidth; null fallback prevents crashes on unenriched samples. |
| 11 | US-209 | Added **auto-re-execute on mode toggle** (re-runs current query when switching modes). **Persist mode in URL params** (`?mode=...`). **Disable Full Corpus/Both** options if `video_index` is empty. | Without auto-re-execute, users must manually re-click Search after toggling — poor UX. URL persistence enables bookmarking. Disabled state prevents confusing empty results. |
| 12 | US-009 | Added **rate limiting**: 100 req/min, 1000 req/hr per IP with 429 + `Retry-After` header. | Prevents abuse of the MCP endpoint; in-memory store is sufficient for Phase 1. |

### Also Updated

- **FR-5:** Updated to reflect polling architecture (trigger clears embedding; polling picks up changes)
- **FR-6:** Updated to use `agentContextToEmbeddingText()` instead of `scene_summary` alone
- **FR-8:** Updated to reference MCP SDK pattern and rate limits
- **Technical Considerations:** Updated pg_cron timing note; added embedding input text note; resolved pgmq open question
- **Open Questions:** Marked pgmq/pg_cron question as resolved
- **PR Structure:** PR 1 updated to include US-000
