# Requirements Document: Physical AI Dataset Portal

## Introduction

Claru is building a searchable public directory of open-source physical AI datasets at `/datasets`. The goal is threefold: (A) generate SDR intent signals by tracking which datasets visitors explore, filter, and compare, (B) earn organic SEO traffic and AEO citations as the canonical reference for physical AI datasets, and (C) capture emails from researchers and engineers who want full dataset metadata. An agentic backend pipeline (already built -- 421 datasets crawled, 200 extracted at 100% success via Claude Haiku) discovers, classifies, and enriches datasets from HuggingFace, arXiv, GitHub, Reddit, and Hacker News daily. The frontend is a clean filter/search UX (not a chatbot). OSS datasets are the primary view; Claru's own datasets appear only as contextual CTAs.

The portal must coexist with the 40 existing Claru dataset pSEO pages (static TypeScript data files rendered via `Wave3PageTemplate`) already live at `/datasets/[slug]`. New OSS dataset pages occupy the same route namespace but are dynamically sourced from Supabase.

### Success Metrics (Priority Order)

1. A -- SDR intent signal: PostHog events for every filter, view, compare, and email capture action, with dataset IDs and filter values attached
2. D -- AEO citability: each dataset page is SSR-rendered with JSON-LD Dataset schema so AI models can cite Claru as the source
3. C -- Email capture: conversion rate from free preview to email-gated full access
4. B -- SEO traffic: organic search impressions and clicks on OSS dataset pages

---

## Requirements

### Requirement 1: Supabase `oss_datasets` Table Schema

**User Story:** As a pipeline operator, I want a well-structured Supabase table for OSS dataset metadata, so that the daily crawler can upsert enriched records and the frontend can query them efficiently.

#### Acceptance Criteria

1. WHEN the migration is applied THEN the system SHALL create an `oss_datasets` table with the following columns:
   - `id` uuid PRIMARY KEY DEFAULT gen_random_uuid()
   - `dataset_id` text UNIQUE NOT NULL -- HuggingFace repo ID (e.g., "lerobot/aloha_static_battery")
   - `slug` text UNIQUE NOT NULL -- URL-safe slug derived from dataset_id (e.g., "lerobot-aloha-static-battery")
   - `name` text NOT NULL -- human-readable name from extraction
   - `description` text -- 1-2 sentence summary
   - `parent_project` text -- overarching project/collection (e.g., "RoboCasa", "Open X-Embodiment")
   - `author` text -- HuggingFace author/org
   - `modalities` text[] -- data types: rgb, depth, force_torque, proprioception, language, imu, lidar, audio, tactile, point_cloud
   - `robot_embodiments` text[] -- robot platforms: "Franka Panda", "UR5", "humanoid", "quadruped", etc.
   - `action_space` text -- joint_positions, end_effector_delta, joint_velocities, language, etc.
   - `environment_type` text[] -- lab, home, kitchen, warehouse, outdoor, simulation
   - `task_types` text[] -- manipulation, grasping, navigation, locomotion, pick_and_place, pouring, etc.
   - `num_episodes` text -- raw string from extraction (e.g., "50,000", "~10K")
   - `total_hours` text -- raw string from extraction
   - `license` text -- dataset license (MIT, CC-BY-4.0, Apache-2.0, etc.)
   - `annotation_types` text[] -- language_instructions, reward_labels, action_labels, segmentation, bounding_boxes
   - `data_format` text -- RLDS, HDF5, LeRobot, zarr, WebDataset, etc.
   - `year_released` smallint -- year first released
   - `paper_url` text -- link to associated paper
   - `paper_title` text -- title of the associated paper
   - `physical_ai_relevance` text -- 1-sentence explanation of why this dataset matters
   - `hf_downloads` integer DEFAULT 0 -- HuggingFace download count
   - `hf_likes` integer DEFAULT 0 -- HuggingFace like count
   - `hf_last_modified` timestamptz -- last modified on HuggingFace
   - `hf_tags` text[] -- HuggingFace tags
   - `citation_count` integer -- Semantic Scholar citation count
   - `reddit_posts` jsonb DEFAULT '[]' -- array of {title, subreddit, score, num_comments, url, created_utc}
   - `hn_posts` jsonb DEFAULT '[]' -- array of {title, points, num_comments, url, hn_url, created_at}
   - `is_active` boolean DEFAULT true -- false if dataset removed from HuggingFace
   - `is_gated` boolean DEFAULT false -- true if dataset requires HuggingFace access request
   - `is_private` boolean DEFAULT false -- true if dataset is private
   - `extraction_completeness` real -- 0.0 to 1.0 extraction quality score
   - `card_text_source` text -- "readme" or "fallback"
   - `last_crawled_at` timestamptz DEFAULT now()
   - `last_verified_at` timestamptz -- last time we confirmed dataset still exists on HuggingFace
   - `created_at` timestamptz DEFAULT now()
   - `updated_at` timestamptz DEFAULT now()

2. WHEN the migration is applied THEN the system SHALL create the following indexes:
   - GIN index on `modalities` for array containment queries (`@>` operator)
   - GIN index on `robot_embodiments` for array containment queries
   - GIN index on `environment_type` for array containment queries
   - GIN index on `task_types` for array containment queries
   - GIN index on `annotation_types` for array containment queries
   - B-tree index on `hf_downloads` DESC for sort-by-popularity
   - B-tree index on `year_released` DESC for sort-by-recency
   - B-tree index on `citation_count` DESC NULLS LAST for sort-by-citations
   - GIN index on `to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))` for full-text search
   - B-tree index on `parent_project` for family grouping queries
   - B-tree index on `is_active` for filtering out removed datasets

3. WHEN the migration is applied THEN the system SHALL create an RLS policy allowing anon `SELECT` on rows WHERE `is_active = true AND is_private = false`.

4. WHEN the migration is applied THEN the system SHALL create an `updated_at` trigger that auto-updates the column on any row modification.

5. WHEN the pipeline upserts a record THEN the system SHALL use `dataset_id` as the conflict target for ON CONFLICT upserts, preserving `created_at` and updating `updated_at`.

6. IF a dataset has `is_gated = true` THEN the system SHALL still store and display the dataset with a visible "gated" badge, but the HuggingFace download link SHALL note that access must be requested from the dataset author.

7. IF a dataset has `is_private = true` THEN the system SHALL NOT display it in public queries (enforced by RLS).

---

### Requirement 2: Full-Text Search and Multi-Facet Filtering

**User Story:** As a researcher, I want to search and filter the dataset directory by modality, embodiment, environment, task type, license, and data format, so that I can find datasets relevant to my specific project.

#### Acceptance Criteria

1. WHEN a user types in the search box THEN the system SHALL perform full-text search across dataset `name` and `description` fields using PostgreSQL `ts_query` with prefix matching, returning results ranked by `ts_rank`.

2. WHEN a user selects one or more modality filters THEN the system SHALL filter to datasets whose `modalities` array contains ALL selected values (AND logic within a facet).

3. WHEN a user selects filters across different facets (e.g., modality=rgb AND environment=kitchen) THEN the system SHALL apply AND logic across facets.

4. WHEN filters are applied THEN the system SHALL display the count of matching datasets and update the result grid in real-time without a full page reload.

5. WHEN the user selects a sort option THEN the system SHALL support sorting by:
   - Downloads (highest first) -- default
   - Recently released (year_released DESC, then hf_last_modified DESC)
   - Most cited (citation_count DESC NULLS LAST)
   - Alphabetical (name ASC)

6. WHEN filters or search are active THEN the URL query parameters SHALL be updated to reflect the current state (e.g., `?modality=rgb,depth&env=kitchen&q=manipulation&sort=downloads`) so that filtered views are shareable and bookmarkable.

7. WHEN a user arrives via a shared filter URL THEN the system SHALL parse query parameters and pre-apply all filters and search terms on page load.

8. WHEN no datasets match the current filters THEN the system SHALL display an empty state with a message like "No datasets match your filters" and a "Clear all filters" button.

9. IF the search query is fewer than 2 characters THEN the system SHALL ignore the search term and show all datasets matching the active filters.

10. WHEN filter facets are rendered THEN each facet option SHALL display the count of datasets matching that value (given all other active filters), and options with zero matches SHALL be shown but visually dimmed and non-interactive.

---

### Requirement 3: Dataset Hub Page (`/datasets`)

**User Story:** As a visitor, I want a central hub page listing all OSS physical AI datasets with search and filters, so that I can discover and explore the landscape of available data.

#### Acceptance Criteria

1. WHEN a visitor navigates to `/datasets` THEN the system SHALL render a server-side rendered page with:
   - A hero section with title "Physical AI Datasets", subtitle describing the directory, and total dataset count
   - A search bar (debounced, 300ms)
   - Filter panel with multi-select facets for: modality, robot embodiment, environment type, task type, license, data format
   - Sort dropdown (Downloads, Recent, Citations, A-Z)
   - A responsive grid of dataset cards (1 col mobile, 2 col tablet, 3 col desktop)

2. WHEN the page initially loads THEN the system SHALL fetch the first 24 datasets sorted by downloads from Supabase at the server level (SSR) for SEO, then hydrate client-side filtering.

3. WHEN the user scrolls to the bottom of the visible dataset grid THEN the system SHALL lazy-load the next batch of 24 datasets using client-side pagination via an IntersectionObserver sentinel element.

4. WHEN datasets are displayed THEN each dataset card SHALL show:
   - Dataset name (linked to detail page)
   - 1-line description (truncated with line-clamp-1)
   - Modality tags (up to 4, then "+N more")
   - Download count (formatted: 386K, 1.1M)
   - Year released (if available)
   - License badge
   - "Gated" badge if `is_gated = true`

5. WHEN the page loads THEN the system SHALL include a section below the OSS grid titled "Need Custom Physical AI Data?" linking to Claru's own dataset offerings and contact form. This serves as the contextual CTA for Claru's services.

6. WHEN the existing 40 Claru pSEO dataset pages are accessed at their current slugs THEN the system SHALL continue to render them from the static TypeScript data files via `Wave3PageTemplate` -- no change to existing pages.

7. IF a slug collision occurs between a Claru pSEO page and an OSS dataset THEN the Claru pSEO page SHALL take priority (checked first in the `[slug]` route handler).

8. WHEN the hub page is rendered THEN it SHALL include JSON-LD `DataCatalog` schema markup with name, description, URL, and dataset count.

---

### Requirement 4: Dataset Detail Pages (`/datasets/[slug]`)

**User Story:** As a researcher, I want a detailed page for each OSS dataset showing all structured metadata, similar datasets, social sentiment, and paper citations, so that I can evaluate whether this dataset fits my needs.

#### Acceptance Criteria

1. WHEN a visitor navigates to `/datasets/[slug]` for an OSS dataset THEN the system SHALL render a server-side rendered page pulling data from the `oss_datasets` Supabase table.

2. WHEN the page renders THEN the system SHALL display the following sections:
   - Header: dataset name, description, author, year released, license badge, gated badge (if applicable)
   - "Why This Matters" section: the `physical_ai_relevance` text
   - Technical Profile: modalities, robot embodiments, action space, environment types, task types, num episodes, total hours, data format, annotation types -- each as labeled key-value pairs
   - Social Signals: citation count (linked to Semantic Scholar if available), Reddit posts (top 3 by score with links), HN posts (top 3 by points with links)
   - Similar Datasets: up to 5 datasets from the same `parent_project`, or failing that, datasets sharing >= 2 modalities and >= 1 task type, sorted by downloads
   - Download/Access: link to HuggingFace dataset page, link to paper (if available)
   - Claru CTA: contextual banner "Need more data like this? Claru builds custom [modality] datasets for [environment]" with link to contact form

3. IF the dataset has `is_gated = true` THEN the download section SHALL display a notice: "This dataset requires access approval from the author on HuggingFace" with a direct link to the HuggingFace access request page.

4. WHEN the page renders THEN it SHALL include JSON-LD `Dataset` schema markup with: name, description, url, license, creator, datePublished, distribution (with contentUrl pointing to HuggingFace), keywords (derived from modalities + task_types).

5. WHEN the page renders THEN it SHALL include Open Graph and Twitter Card meta tags with the dataset name, description, and a dynamically generated OG image.

6. WHEN a visitor navigates to a slug that matches neither a Claru pSEO page nor an active OSS dataset THEN the system SHALL return a 404 page.

7. WHEN a dataset's `is_active` flag is `false` (removed from HuggingFace) THEN the detail page SHALL display a notice: "This dataset is no longer available on HuggingFace. The metadata below was last verified on [last_verified_at]." The page SHALL still render (not 404) to preserve any backlinks and search index value.

---

### Requirement 5: Email-Gated Full Access

**User Story:** As a product owner, I want to gate full dataset metadata behind an email capture, so that we can identify high-intent researchers and route them to the SDR team.

#### Acceptance Criteria

1. WHEN a visitor has NOT provided their email THEN the system SHALL show a limited preview on each dataset detail page:
   - Visible freely: name, description, modalities (tags), task types (tags), year released, license, "Why This Matters" text, similar datasets (names only)
   - Hidden behind gate: full technical profile (embodiments, action space, environment types, episodes, hours, format, annotations), social signals, download/HuggingFace links, paper link, comparison tool access

2. WHEN a visitor has NOT provided their email THEN the hidden sections SHALL show a blurred/dimmed preview with an overlay: "Enter your email to unlock full dataset details" with an inline email input and submit button.

3. WHEN a visitor submits a valid email THEN the system SHALL:
   - Store the email in a `dataset_portal_leads` Supabase table with columns: `id`, `email`, `created_at`, `source_dataset_slug` (the dataset they were viewing when they submitted), `utm_source`, `utm_medium`, `utm_campaign` (from URL params)
   - Set a `dp_email` cookie (httpOnly, 30-day expiry) so the gate is not re-shown on subsequent visits
   - Immediately reveal all gated content on the current page and all future pages
   - Fire a PostHog `dataset_portal_email_captured` event with `email`, `source_dataset_slug`, and UTM params

4. IF the submitted email already exists in `dataset_portal_leads` THEN the system SHALL NOT create a duplicate row, SHALL still set the cookie, and SHALL unlock the content.

5. IF the submitted email fails Zod email validation THEN the system SHALL display an inline error message and NOT submit.

6. WHEN a visitor has the `dp_email` cookie set THEN the system SHALL show all metadata without any gate on all pages, including the hub page (which should show download counts and additional metadata on cards).

7. WHEN the email gate overlay is rendered THEN it SHALL NOT block the page from being crawled by search engines -- the full content SHALL be present in the SSR HTML (hidden via CSS/JS, not omitted from the DOM).

---

### Requirement 6: Comparison Tool

**User Story:** As a researcher evaluating multiple datasets, I want to select 2-3 datasets and see them side-by-side with all metadata fields in columns, so that I can make an informed decision about which to use.

#### Acceptance Criteria

1. WHEN a visitor is on the hub page or a detail page THEN the system SHALL provide an "Add to Compare" button/toggle on each dataset card.

2. WHEN a visitor selects datasets for comparison THEN the system SHALL persist the selection in client-side state (React context + localStorage) so it survives page navigation.

3. WHEN 2 or more datasets are selected THEN the system SHALL show a sticky comparison bar at the bottom of the viewport displaying: selected dataset names (removable), a "Compare" button, and a "Clear" button.

4. WHEN the visitor clicks "Compare" THEN the system SHALL navigate to `/datasets/compare?ids=slug1,slug2,slug3` and render a side-by-side comparison view.

5. WHEN the comparison page renders THEN the system SHALL display a table/grid with:
   - Rows: name, description, modalities, robot embodiments, action space, environment types, task types, num episodes, total hours, license, annotation types, data format, year released, downloads, citations, paper link
   - Columns: one per selected dataset (2-3 max)
   - Cells where values differ across datasets SHALL be highlighted with a subtle accent background

6. IF more than 3 datasets are selected for comparison THEN the system SHALL display a message: "Select up to 3 datasets to compare" and disable the "Add to Compare" button on additional datasets.

7. WHEN a visitor clicks "Export as CSV" on the comparison page THEN the system SHALL:
   - IF the visitor has provided their email: generate and download a CSV file with all comparison data
   - IF the visitor has NOT provided their email: show the email gate overlay, and upon submission, trigger the CSV download

8. WHEN a visitor clicks "Export as PDF" on the comparison page THEN the system SHALL follow the same email gate logic as CSV and generate a styled PDF of the comparison table.

9. WHEN the comparison page is accessed via URL with `ids` parameter THEN the system SHALL fetch the specified datasets and render the comparison, making comparison views shareable.

---

### Requirement 7: PostHog Analytics and SDR Intent Tracking

**User Story:** As an SDR team member, I want every meaningful user interaction on the dataset portal tracked in PostHog with rich metadata, so that I can identify high-intent researchers and prioritize outreach.

#### Acceptance Criteria

1. WHEN a visitor views the hub page THEN the system SHALL fire a PostHog `dataset_hub_viewed` event.

2. WHEN a visitor applies a filter THEN the system SHALL fire a PostHog `dataset_filter_applied` event with properties: `filter_type` (modality, embodiment, environment, task, license, format), `filter_values` (array of selected values), `active_filters` (full current filter state), `result_count`.

3. WHEN a visitor performs a search THEN the system SHALL fire a PostHog `dataset_search` event (debounced, fires after 1 second of inactivity) with properties: `query`, `result_count`.

4. WHEN a visitor views a dataset detail page THEN the system SHALL fire a PostHog `oss_dataset_viewed` event with properties: `dataset_slug`, `dataset_name`, `modalities`, `task_types`, `hf_downloads`, `source` (hub_click, direct_url, comparison, similar_dataset).

5. WHEN a visitor adds a dataset to comparison THEN the system SHALL fire a PostHog `dataset_added_to_compare` event with properties: `dataset_slug`, `dataset_name`, `compare_count` (how many now selected).

6. WHEN a visitor views the comparison page THEN the system SHALL fire a PostHog `dataset_comparison_viewed` event with properties: `dataset_slugs` (array), `dataset_count`.

7. WHEN a visitor exports a comparison THEN the system SHALL fire a PostHog `dataset_comparison_exported` event with properties: `dataset_slugs`, `format` (csv, pdf).

8. WHEN a visitor submits their email THEN the system SHALL fire a PostHog `dataset_portal_email_captured` event with properties: `email`, `source_dataset_slug`, `utm_source`, `utm_medium`, `utm_campaign`.

9. WHEN a visitor clicks a HuggingFace download link THEN the system SHALL fire a PostHog `dataset_hf_link_clicked` event with properties: `dataset_slug`, `dataset_name`, `link_type` (dataset, paper).

10. WHEN a visitor clicks the Claru CTA on a dataset page THEN the system SHALL fire a PostHog `dataset_claru_cta_clicked` event with properties: `dataset_slug`, `cta_location` (detail_page, hub_page, comparison_page).

11. WHEN PostHog events are fired THEN the system SHALL use the existing PostHog provider pattern from `src/app/components/providers/PostHogProvider.tsx` and follow the event naming convention established by `DatasetViewTracker` and `ProspectTracking`.

---

### Requirement 8: Pipeline Integration and GitHub Actions Cron

**User Story:** As a pipeline operator, I want the dataset discovery and enrichment pipeline to run daily via GitHub Actions and push results to Supabase, so that the frontend always has fresh data.

#### Acceptance Criteria

1. WHEN the GitHub Actions cron triggers (daily at 06:00 UTC) THEN the system SHALL execute the pipeline in this order:
   1. `crawl_hf.py` -- crawl HuggingFace for robotics datasets (two-pass: downloads + recent)
   2. `extract_metadata.py` -- LLM extraction of structured metadata via Claude Haiku (incremental, reuses existing extractions)
   3. `social_signals.py` -- fetch Reddit, HN, and Semantic Scholar signals for datasets with > 100 downloads
   4. `qa_score.py` -- compute extraction quality scores and ground truth validation
   5. `upsert_supabase.py` (new) -- transform enriched JSON into Supabase `oss_datasets` rows and upsert

2. WHEN `upsert_supabase.py` runs THEN it SHALL:
   - Generate a URL-safe `slug` from `dataset_id` by replacing "/" with "-" and stripping special characters
   - Map all extraction fields to their corresponding `oss_datasets` columns
   - Compute `extraction_completeness` as the fraction of non-null extraction fields
   - Upsert using `dataset_id` as the conflict key
   - Set `is_gated`, `is_private` based on crawl error patterns (already detected in `crawl_hf.py`)
   - Log the count of inserted, updated, and unchanged rows

3. WHEN a dataset that was previously in Supabase is NOT found in the latest crawl THEN the system SHALL NOT delete the row but SHALL set `is_active = false` and update `last_verified_at`.

4. WHEN a dataset that was previously marked `is_active = false` reappears in a crawl THEN the system SHALL set `is_active = true` and update all fields.

5. WHEN the pipeline completes THEN the GitHub Action SHALL:
   - Report summary statistics (datasets crawled, extracted, upserted, deactivated) as a job summary
   - Fail the workflow if extraction success rate drops below 80%
   - Fail the workflow if upsert encounters a database connection error

6. WHEN the pipeline runs THEN it SHALL use Supabase service role key (stored as a GitHub Actions secret, not the anon key) for upsert operations.

7. IF a dataset's README is too short for extraction (< 50 chars) THEN the system SHALL still store the raw crawl metadata (dataset_id, author, downloads, likes, tags) with `extraction_completeness = 0` and populate the `name` from the dataset_id.

---

### Requirement 9: SEO and AEO Optimization

**User Story:** As a marketer, I want each OSS dataset page to be fully crawlable with rich structured data, so that search engines index them and AI models cite Claru as the definitive physical AI dataset reference.

#### Acceptance Criteria

1. WHEN an OSS dataset detail page is rendered THEN it SHALL be server-side rendered (not client-side only) so that the full content is in the initial HTML response.

2. WHEN an OSS dataset detail page is rendered THEN it SHALL include JSON-LD `Dataset` schema with fields: `@type: Dataset`, `name`, `description`, `url` (canonical), `license`, `creator` (author), `datePublished` (year_released), `distribution` [{`@type: DataDownload`, `contentUrl` (HuggingFace URL), `encodingFormat` (data_format)}], `keywords` (derived from modalities + task_types + environment_type).

3. WHEN the hub page is rendered THEN it SHALL include JSON-LD `DataCatalog` schema with: `name: "Physical AI Datasets | Claru"`, `description`, `url`, `dataset` (array of dataset references with name and url, limited to top 50 by downloads).

4. WHEN an OSS dataset page is rendered THEN it SHALL have a unique `<title>` tag in format: "[Dataset Name] - Physical AI Dataset | Claru" and a unique `<meta name="description">` summarizing the dataset.

5. WHEN an OSS dataset page is rendered THEN it SHALL have a canonical URL at `https://claru.ai/datasets/[slug]`.

6. WHEN an OSS dataset page is rendered THEN it SHALL include Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type: article`) and Twitter Card tags (`twitter:card: summary_large_image`).

7. WHEN the OG image is generated THEN it SHALL use the existing `ogImageUrl()` utility with the dataset name and a "dataset" category marker.

8. WHEN the email gate is active THEN the gated content SHALL still be present in the SSR HTML (rendered in the DOM but visually hidden/blurred via CSS), ensuring crawlers index the full content regardless of gate state.

---

### Requirement 10: Coexistence with Existing Claru Dataset Pages

**User Story:** As a developer, I want the new OSS dataset portal to coexist with the existing 40 Claru pSEO dataset pages without breaking them, so that both systems serve their purpose.

#### Acceptance Criteria

1. WHEN a request arrives at `/datasets/[slug]` THEN the route handler SHALL first check `getDatasetPage(slug)` from the static registry. IF a match is found, render the Claru pSEO page. IF NOT, query `oss_datasets` in Supabase for the slug.

2. WHEN the hub page at `/datasets` renders THEN it SHALL show two distinct sections:
   - "Open-Source Physical AI Datasets" (OSS section, primary, with search/filter) sourced from Supabase
   - "Claru Proprietary Datasets" (secondary, below OSS section) sourced from static data files via `getAllDatasetPages()`, linking to their existing detail pages

3. WHEN `generateStaticParams()` is called for `/datasets/[slug]` THEN it SHALL return both the static Claru slugs (from `getAllDatasetSlugs()`) AND the OSS dataset slugs (from a Supabase query), enabling ISR for both types.

4. IF a new OSS dataset is crawled with a slug that collides with an existing Claru pSEO slug THEN the Claru page SHALL take priority, and the OSS dataset detail page SHALL be accessible at `/datasets/oss/[slug]` as a fallback (or the slug SHALL be prefixed with the HuggingFace author, e.g., "lerobot-aloha-static-battery").

5. WHEN a Claru pSEO dataset page renders THEN it SHALL include a "See also" link pointing to the OSS portal hub: "Browse 400+ open-source physical AI datasets".

---

### Requirement 11: Error Handling and Resilience

**User Story:** As a system operator, I want the portal to handle upstream failures gracefully, so that users always see useful content even when data sources are unavailable.

#### Acceptance Criteria

1. WHEN the Supabase query fails on the hub page THEN the system SHALL display a cached version of the page (via ISR stale-while-revalidate) and log the error. IF no cached version exists, display a friendly error message with a retry button.

2. WHEN the Supabase query fails on a dataset detail page THEN the system SHALL return a 500 error page with a "Try again" button and a link back to the hub page.

3. WHEN the daily pipeline's `crawl_hf.py` step fails (HuggingFace API down) THEN the pipeline SHALL:
   - Skip the crawl step and proceed with existing data for extraction
   - Log a warning but NOT mark any datasets as inactive
   - Report the failure in the GitHub Actions job summary

4. WHEN `extract_metadata.py` fails for an individual dataset (Claude API error, JSON parse error) THEN the pipeline SHALL:
   - Log the error for that dataset
   - Continue processing remaining datasets
   - Store the failed record with `extraction_completeness = 0`
   - NOT overwrite a previously successful extraction with a failed one

5. WHEN `social_signals.py` encounters an API failure (Reddit rate limit, Semantic Scholar timeout) THEN the pipeline SHALL:
   - Retry once after a 5-second delay
   - If retry fails, store empty signals for that dataset and continue
   - NOT overwrite previously gathered social signals with empty results

6. WHEN a dataset is removed from HuggingFace (detected by 404 during crawl) THEN the pipeline SHALL set `is_active = false` and `last_verified_at = now()` but SHALL NOT delete the row from Supabase.

7. WHEN a dataset's README changes significantly (> 30% edit distance) between crawls THEN the pipeline SHALL re-extract metadata (bypass the incremental reuse logic) and log the re-extraction.

---

### Requirement 12: Edge Cases -- Duplicates, Families, and Incomplete Data

**User Story:** As a researcher, I want the portal to handle dataset families, duplicates, and incomplete records intelligently, so that I see a clean, deduplicated view of the landscape.

#### Acceptance Criteria

1. WHEN multiple datasets share the same `parent_project` (e.g., 12 RoboCasa variants) THEN the hub page SHALL:
   - Show a collapsed "family" card for project families with > 3 variants, displaying the family name, variant count, aggregate download total, and an "Expand" button
   - When expanded, show all variants as individual cards indented under the family header
   - Allow filtering within a family

2. WHEN the dataset detail page renders for a dataset in a family THEN it SHALL include a "Part of the [parent_project] family" badge linking to a filtered hub view showing all family members.

3. IF two datasets are exact duplicates (same data, different uploaders) THEN the system SHALL:
   - NOT automatically merge or hide duplicates (too risky for automated detection)
   - Display both with their actual HuggingFace metadata
   - The pipeline MAY flag potential duplicates in a future iteration using name similarity + modality overlap heuristics

4. IF a dataset has no README and extraction used fallback text (tags/metadata only) THEN the detail page SHALL:
   - Display whatever metadata was extracted with a notice: "Limited metadata available. This dataset had no README on HuggingFace."
   - Show the HuggingFace tags as-is
   - Still render the page (not skip it)

5. IF a dataset has `extraction_completeness < 0.25` (fewer than 4 of 16 fields populated) THEN the detail page SHALL show a notice: "Partial metadata -- some fields could not be extracted from the dataset description."

6. IF a dataset's `num_episodes` or `total_hours` field contains unparseable text THEN the system SHALL display the raw string as-is rather than attempting to format it.

7. WHEN the hub page displays modality/task/embodiment filter facets THEN the facet values SHALL be derived from the actual data in the database (dynamic), not from a hardcoded list. This ensures new modalities or task types added by the pipeline automatically appear as filter options.

---

### Requirement 13: Frontend Design System Compliance

**User Story:** As a designer, I want the dataset portal to follow the existing Claru design system, so that it feels like a native part of the site.

#### Acceptance Criteria

1. WHEN any portal page renders THEN it SHALL use the existing design tokens: `--bg-primary: #0a0908`, `--accent-primary: #92B090`, `--text-primary: #FFFFFF`, and the established dark theme card/border patterns.

2. WHEN dataset cards render THEN they SHALL use the existing card pattern: `bg-white/[0.03]`, `border border-white/10`, `rounded-lg`, hover state `hover:border-white/20 hover:bg-white/[0.05]`.

3. WHEN monospace text is rendered (tags, metadata values, filter pills, counts) THEN it SHALL use `var(--font-jetbrains, 'JetBrains Mono', monospace)`.

4. WHEN filter pills render THEN they SHALL follow the existing pattern: selected state with `bg-[#92B090]/10 border-[#92B090]/40 text-[#92B090]`, unselected with `border-white/10 text-white/60`.

5. WHEN the page shell renders THEN it SHALL use the existing `GeoPageShell` component for consistent header, footer, and page chrome.

6. WHEN animations are applied THEN they SHALL use Framer Motion with stagger delays matching existing sections (0.03-0.05s per element) and `FadeIn` for scroll-triggered entrance.

7. WHEN the page is viewed on mobile (375px) THEN all filter pills SHALL be horizontally scrollable in a single row, cards SHALL be full-width single column, and all touch targets SHALL be >= 44px.

---

### Requirement 14: Performance and Caching

**User Story:** As a visitor, I want the dataset portal to load fast and feel responsive, so that I can browse efficiently without waiting.

#### Acceptance Criteria

1. WHEN the hub page is requested THEN the system SHALL use Next.js ISR with `revalidate: 3600` (1 hour) so that the page is statically generated and revalidated hourly.

2. WHEN dataset detail pages are requested THEN the system SHALL use ISR with `revalidate: 3600` for OSS dataset pages.

3. WHEN client-side filtering/searching occurs THEN the system SHALL operate on the already-fetched dataset list -- no additional API calls for filter/search (all 400+ datasets are small enough to load in a single payload, ~200KB gzipped).

4. WHEN the full dataset payload is fetched client-side THEN it SHALL be cached in React state and optionally in `localStorage` with a 1-hour TTL to avoid refetching on navigation.

5. WHEN the comparison page loads THEN it SHALL fetch only the 2-3 selected datasets by slug (not the full list) for fast rendering.

6. IF the dataset list grows beyond 1,000 records THEN the system SHOULD transition to server-side pagination with cursor-based pagination via Supabase `.range()` queries. This is a future consideration, not required for v1.

---

### Requirement 15: ISR and Data Freshness Strategy

**User Story:** As a developer, I want a clear strategy for when data is fresh vs. stale, so that visitors see up-to-date information without compromising performance.

#### Acceptance Criteria

1. WHEN the daily pipeline completes THEN the system SHALL call Next.js on-demand revalidation (via a webhook/API route with a shared secret) to bust the ISR cache for the hub page and any dataset pages whose data changed.

2. WHEN a new dataset is discovered by the pipeline THEN the system SHALL trigger ISR revalidation for `/datasets` (hub page) so the new dataset appears within minutes, not hours.

3. WHEN the pipeline updates social signals for a dataset THEN the system SHALL trigger ISR revalidation for that dataset's detail page.

4. IF the on-demand revalidation webhook fails THEN the system SHALL fall back to the standard ISR timer (1 hour) -- pages will still refresh, just not immediately.

5. WHEN revalidation is triggered THEN the system SHALL revalidate only affected pages (not all 400+ dataset pages) to minimize build time.

---

### Requirement 16: Accessibility

**User Story:** As a user with assistive technology, I want the dataset portal to be fully accessible, so that I can navigate, filter, search, and compare datasets using keyboard and screen reader.

#### Acceptance Criteria

1. WHEN the filter panel renders THEN each filter group SHALL have an `aria-label` describing the facet and each option SHALL be a keyboard-focusable checkbox or toggle with proper `aria-checked` state.

2. WHEN the search bar is focused THEN it SHALL have an `aria-label="Search datasets"` and announce result count changes via an `aria-live="polite"` region.

3. WHEN dataset cards are rendered THEN each card SHALL be a focusable element with a descriptive `aria-label` including the dataset name and key metadata.

4. WHEN the comparison bar appears THEN it SHALL be announced via `aria-live="assertive"` and all buttons (Compare, Clear, Remove) SHALL be keyboard-accessible.

5. WHEN the email gate overlay appears THEN focus SHALL be trapped within the overlay until it is dismissed or submitted, following dialog accessibility patterns.

6. WHEN color is used to convey information (comparison highlights, filter counts, gated badges) THEN it SHALL also be conveyed through text, icons, or other non-color indicators.