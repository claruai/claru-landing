# PRD: Data Catalog Portal

## Introduction

Build a gated Data Catalog Portal on the Claru landing site (Next.js 16, App Router, Tailwind CSS 4, Supabase) that allows prospective AI lab clients to discover available datasets, request access, get approved by Claru admins, and browse a curated catalog of AI training data with video sample viewers. The portal has three surfaces: a public-facing landing page with access request form, an admin dashboard for lead and dataset management, and an authenticated lead portal for browsing granted datasets.

**Reference Documents:**
- **Requirements:** `docs/data-catalog-requirements.md` -- 17 requirements (REQ-001 through REQ-017) covering public pages, admin CRUD, lead portal, auth, RLS, storage, email notifications, admin settings, and email template preview
- **Design:** `docs/data-catalog-design.md` -- Full technical design including DB schema (Section 4), API design (Section 5), page architecture (Section 6), auth flow (Section 7), Supabase Storage design (Section 8), email templates (Section 9), error handling (Section 10), and testing strategy (Section 11)

The feature extends the existing Next.js app with Supabase (Auth, Postgres, Storage) and Resend (transactional email) while maintaining the dark terminal aesthetic established in the design system.

---

## Goals

- Convert inbound interest into qualified leads with a structured intake form on `/data-catalog`
- Demonstrate data quality through interactive sample viewers (video player, metadata JSON viewer) in the lead portal
- Reduce manual work: admins approve/reject leads and manage dataset access from a dashboard instead of email threads
- Provide granular, per-lead dataset access control via a junction table with admin UI
- Secure all data access at the database level (RLS) and route level (middleware auth gates)
- Support magic-link authentication for leads (no passwords) alongside existing JWT-based admin auth
- Create a scalable catalog management system with Supabase Storage for thumbnails and video samples

---

## Architecture References

The design document (`docs/data-catalog-design.md`) contains the authoritative technical specifications for:

| Topic | Design Doc Section |
|-------|--------------------|
| **DB Schema** (7 tables: `dataset_categories`, `datasets`, `dataset_samples`, `leads`, `lead_dataset_access`, `custom_requests`, `settings`) | Section 4: Data Models |
| **RLS Policies** (per-table row-level security) | Section 4.2 |
| **Indexes** | Section 4.3 |
| **Supabase Client Setup** (server client + admin client) | Section 5.1 |
| **API Routes** (public, admin, portal) | Section 5.2 - 5.4 |
| **Page Architecture** (14 pages with rendering strategy, including `/admin/settings`) | Section 6 |
| **Auth Flow** (three auth contexts, middleware, magic link) | Section 7 |
| **Storage Design** (bucket structure, signed URLs, upload flow) | Section 8 |
| **Email Templates** (4 email types via Resend) | Section 9 |
| **Error Handling** (client-side, server-side, error boundaries) | Section 10 |
| **Component Interfaces** (`DatasetCard`, `VideoPlayer`, `MetadataViewer`, `AccessRequestForm`, etc.) | Section 3 |
| **File Structure** (all new files) | Appendix B |
| **New Dependencies** (`@supabase/supabase-js`, `@supabase/ssr`, `resend`) | Appendix A |
| **Environment Variables** | Section 12.3 |

Agents implementing stories MUST read the relevant design doc sections before starting work.

---

## Agent & Skill Assignments

Each user story specifies which agents and skills to invoke. Here is the full roster:

| Agent/Skill | Used For |
|---|---|
| `supabase-expert` agent | Supabase client setup, migrations, RLS policies, storage buckets, auth flows |
| `nextjs-expert` agent | Server Actions, middleware, API route handlers, server components |
| `frontend-expert` agent | UI components, responsive design, animations, forms, terminal aesthetic |
| `general-purpose` agent | TypeScript types, email integration, seed scripts, miscellaneous |
| `code-reviewer` agent | Post-implementation review after EVERY user story + build verification |
| `direct-response-copy` skill | Marketing copy for the public landing page |
| `webapp-testing` skill | Playwright E2E test creation |
| `commit` skill | Commit after each completed + reviewed user story |

### Post-Story Completion Protocol

After EVERY user story is implemented, the following MUST happen in order:

1. **Typecheck:** Run `npx tsc --noEmit` -- must pass
2. **Lint:** Run `npm run lint` -- must pass
3. **Build verification:** Run `npm run build` -- must pass with zero errors
4. **Code Review:** Launch `code-reviewer` agent to review all changed files
5. **Browser verification** (UI stories only): Verify in browser using `dev-browser` skill
6. **Commit:** Only after all checks pass, commit with descriptive message (with user confirmation)

---

## User Stories

### Phase 1: Foundation (Supabase + Schema)

---

#### US-001: Set Up Supabase Client and Environment Config

**Description:** As a developer, I need Supabase client utilities and environment configuration so that all subsequent stories can interact with Supabase services.

**Agent:** `supabase-expert` agent

**Reference:** Design doc Section 5.1 (Supabase Client Setup), Section 12.3 (Environment Variables)

**Acceptance Criteria:**
- [ ] `src/lib/supabase/server.ts` created with `createSupabaseServerClient()` function using `@supabase/ssr` and `cookies()` from `next/headers` -- exactly matching the code in design doc Section 5.1
- [ ] `src/lib/supabase/admin.ts` created with `createSupabaseAdminClient()` function using `@supabase/supabase-js` with `SUPABASE_SERVICE_ROLE_KEY` -- exactly matching design doc Section 5.1
- [ ] Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`
- [ ] `.env.local.example` updated with required Supabase env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `next.config.js` (or `next.config.ts`) updated: add Supabase Storage hostname to `images.remotePatterns` for `<Image>` component support
- [ ] Both client functions export correctly and can be imported without build errors
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-002: Create Database Tables and RLS Policies via Supabase Migration

**Description:** As a developer, I need the Postgres schema with all tables, indexes, triggers, and RLS policies so that the data layer is ready for application code.

**Agent:** `supabase-expert` agent

**Reference:** Design doc Section 4 (Data Models), Section 4.2 (RLS Policies), Section 4.3 (Indexes); Requirements REQ-014

**Acceptance Criteria:**
- [ ] SQL migration file created at `supabase/migrations/001_data_catalog_schema.sql` (or equivalent path)
- [ ] `dataset_categories` table created with columns: `id` (UUID PK), `name` (text, UNIQUE, NOT NULL), `slug` (text, UNIQUE, NOT NULL), `description` (text), `sort_order` (integer, default 0), `created_at` (timestamptz) -- per design doc Section 4.1
- [ ] `datasets` table created with columns: `id`, `name`, `slug` (UNIQUE), `description`, `category_id` (FK to `dataset_categories`), `modality` (CHECK in video/image/multimodal/robotics), `thumbnail_path`, `total_size`, `sample_count` (default 0), `metadata` (jsonb), `is_public` (boolean, default false), `is_archived` (boolean, default false), `created_at`, `updated_at` -- per design doc Section 4.1
- [ ] `dataset_samples` table created with columns: `id`, `dataset_id` (FK, ON DELETE CASCADE), `name`, `storage_path`, `file_type`, `file_size` (bigint), `metadata` (jsonb), `sort_order`, `created_at` -- per design doc Section 4.1
- [ ] `leads` table created with columns: `id`, `email` (UNIQUE), `name`, `company`, `role`, `use_case`, `modalities_of_interest` (text[]), `category_ids_of_interest` (uuid[]), `volume_notes`, `status` (CHECK in pending/approved/rejected, default 'pending'), `admin_notes`, `rejection_reason`, `supabase_user_id` (UNIQUE, nullable), `created_at`, `updated_at` -- per design doc Section 4.1
- [ ] `lead_dataset_access` junction table created with columns: `id`, `lead_id` (FK, ON DELETE CASCADE), `dataset_id` (FK, ON DELETE CASCADE), `granted_at`, `granted_by` (text), UNIQUE constraint on (`lead_id`, `dataset_id`) -- per design doc Section 4.1
- [ ] All RLS policies created exactly matching design doc Section 4.2: public read on categories, public read on public non-archived datasets, lead reads on granted datasets/samples/own record/own access grants, service_role full access on all tables
- [ ] All indexes created per design doc Section 4.3: `idx_datasets_category`, `idx_datasets_slug`, `idx_datasets_public`, `idx_dataset_samples_dataset`, `idx_leads_status`, `idx_leads_email`, `idx_leads_supabase_user`, `idx_lead_dataset_access_lead`, `idx_lead_dataset_access_dataset`
- [ ] `updated_at` trigger function created for `leads` and `datasets` tables (auto-set on UPDATE) -- per REQ-014 AC-6
- [ ] Migration is idempotent (uses `IF NOT EXISTS` or similar guards where appropriate)
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent -- pay special attention to RLS policy correctness

---

#### US-003: Set Up Supabase Storage Bucket with Access Policies

**Description:** As a developer, I need Supabase Storage buckets configured with correct access policies so that dataset thumbnails and video samples can be stored and served securely.

**Agent:** `supabase-expert` agent

**Reference:** Design doc Section 8 (Supabase Storage Design); Requirements REQ-015

**Acceptance Criteria:**
- [ ] SQL migration (or Supabase dashboard config documented) creates a `dataset-samples` private storage bucket
- [ ] Storage policy: only `service_role` can manage files (all reads via signed URLs) -- per design doc Section 8.4
- [ ] File path convention documented: `{dataset_id}/thumbnail.jpg` for thumbnails, `{dataset_id}/samples/{sample_id}/{filename}` for samples -- per design doc Section 8.1
- [ ] Signed URL generation utility created in `src/lib/supabase/storage.ts`:
  - `generateSignedUrl(storagePath: string, expiresIn?: number)` -- default 3600 seconds (1 hour) per REQ-015 AC-4
  - `generateSignedUploadUrl(storagePath: string)` -- for admin uploads per design doc Section 8.3
- [ ] No max file size limit enforced on uploads
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-004: Create TypeScript Types for All Database Entities

**Description:** As a developer, I need TypeScript interfaces for all database entities and API payloads so that the entire codebase has type safety.

**Agent:** `general-purpose` agent

**Reference:** Design doc Section 3 (Component Interfaces), Section 4 (Data Models), Section 5 (API Design)

**Acceptance Criteria:**
- [ ] `src/types/catalog.ts` created with interfaces for:
  - `DatasetCategory` (matching `dataset_categories` table)
  - `Dataset` (matching `datasets` table)
  - `DatasetSample` (matching `dataset_samples` table)
  - `Lead` (matching `leads` table)
  - `LeadDatasetAccess` (matching `lead_dataset_access` table)
  - `LeadStatus` type: `'pending' | 'approved' | 'rejected'`
  - `DatasetModality` type: `'video' | 'image' | 'multimodal' | 'robotics'`
- [ ] `src/lib/supabase/types.ts` created (or generated via `supabase gen types typescript`) with Supabase database types
- [ ] API request/response types created:
  - `AccessRequestPayload` (for `POST /api/leads`) -- per design doc Section 5.2
  - `LeadApprovePayload` (for `POST /api/admin/leads/:id/approve`) -- per design doc Section 5.3
  - `LeadRejectPayload` (for `POST /api/admin/leads/:id/reject`)
  - `DatasetCreatePayload` (for `POST /api/admin/catalog`)
  - `SampleUploadUrlPayload` / `SampleUploadUrlResponse`
- [ ] All types align with the design doc schema (Section 4.1) -- column names, types, and nullability match
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all types

---

### Phase 2: Public Flow

---

#### US-005: Data Catalog Landing Page `/data-catalog`

**Description:** As a potential customer, I want to see an overview of Claru's available dataset categories with volume and quality stats so that I can understand what data is available before requesting access. **This is a category-level overview + request access page only — no individual dataset browsing is available on the public page. Actual data browsing requires authentication via the lead portal.**

**Agent:** `frontend-expert` agent + `direct-response-copy` skill for copy

**Reference:** Design doc Section 6.1; Requirements REQ-001

**Acceptance Criteria:**
- [ ] Page at `src/app/data-catalog/page.tsx` -- Server Component that fetches dataset categories with aggregate stats using `createSupabaseAdminClient` (service_role) -- per design doc Section 6.1
- [ ] Uses shared `Header` (with `opaque` prop) and `Footer` components -- per REQ-001 AC-1
- [ ] Hero section with headline, subheadline, and primary "Request Access" CTA button -- per REQ-001 AC-2
- [ ] Grid of **category overview cards** (not individual dataset cards), each showing: category name, dataset count, total hours/clips, representative thumbnail -- per REQ-001 AC-3. No dataset-level detail, no sample previews, no dataset detail links.
- [ ] Clicking a category card smooth-scrolls to a section with high-level category stats and data types -- per REQ-001 AC-4
- [ ] Clicking "Request Access" CTA navigates to `/data-catalog/request` -- per REQ-001 AC-5
- [ ] Server-rendered with meta tags: title, description, OG image for SEO -- per REQ-001 AC-6
- [ ] Fully responsive: single-column card grid on mobile (<768px), appropriately sized typography -- per REQ-001 AC-7
- [ ] Design matches existing dark terminal aesthetic (bg `--bg-primary`, accent `--accent-primary`, fonts Geist Sans / JetBrains Mono)
- [ ] `DatasetCard` component created at `src/app/components/ui/DatasetCard.tsx` with `variant: "public" | "portal"` -- public variant shows category-level stats and "Request Access" CTA only
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- desktop and mobile viewports
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-006: Access Request Form with Multi-Step Qualification

**Description:** As a potential customer, I want to submit a request for catalog access with my details and intended use case so that Claru can evaluate and grant me access.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 3.1 (`AccessRequestForm` interface), Section 6.2; Requirements REQ-002

**Acceptance Criteria:**
- [ ] Page at `src/app/data-catalog/request/page.tsx` (Server Component wrapper) + `src/app/data-catalog/request/RequestFormClient.tsx` (Client Component) -- per design doc Section 6.2
- [ ] Server Component pre-fetches categories from Supabase and passes as props to the form
- [ ] Multi-step terminal-style form matching existing `ContactForm` pattern with progressive disclosure -- per design doc Section 3.1:
  - Step 1: Contact info (name, email, company, role) -- all required per REQ-002 AC-1
  - Step 2: Use case (free text + checkboxes for modalities of interest) -- textarea min 20 chars per REQ-002 AC-1
  - Step 3: Dataset interests (multi-select from categories) -- required per REQ-002 AC-1
  - Step 4: Volume/timeline expectations
  - Step 5: Confirmation/submit
- [ ] Validation via React Hook Form + Zod: email validation, required field checks, min length on use case -- per REQ-002 AC-4
- [ ] Inline validation errors using terminal-style form patterns -- per REQ-002 AC-4
- [ ] Success confirmation message displayed after submission with expected response timeline -- per REQ-002 AC-3
- [ ] Uses shared `Header` (with `opaque` prop) and `Footer` components
- [ ] Responsive layout on all viewports
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- complete full form flow
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-007: Form Submission Server Action + Supabase Insert

**Description:** As a developer, I need the form submission to securely write to Supabase via a Next.js Server Action, keeping credentials server-side.

**Agent:** `nextjs-expert` agent

**Reference:** Design doc Section 5.2 (`POST /api/leads`); Requirements REQ-002 AC-2, AC-5, AC-6, AC-7

**Acceptance Criteria:**
- [ ] Server Action (or API route at `src/app/api/leads/route.ts`) created for `POST /api/leads` -- per design doc Section 5.2
- [ ] Uses `createSupabaseAdminClient` (service_role) to insert into `leads` table -- per REQ-002 AC-7
- [ ] On success: inserts row with status `pending` and `created_at` timestamp -- per REQ-002 AC-2
- [ ] On duplicate email: updates existing lead record rather than creating a duplicate; resets status to `pending` if previously `rejected` -- per REQ-002 AC-6
- [ ] On Supabase insert failure: returns user-friendly error message and logs server-side -- per REQ-002 AC-5
- [ ] Zod validation on server side (same schema as client) -- input sanitization per design doc Section 13.4
- [ ] Also creates `GET /api/catalog/categories/route.ts` for public categories list -- per design doc Section 5.2
- [ ] Returns `201 { success: true, message: "Request submitted" }` on success
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-008: Email Notification to Admin on New Request (Resend)

**Description:** As a Claru admin, I want to be notified by email when a new access request comes in so I don't have to manually check the admin dashboard.

**Agent:** `general-purpose` agent

**Reference:** Design doc Section 9 (Email Notification Design); Requirements REQ-012 AC-1, AC-4, AC-5

**Acceptance Criteria:**
- [ ] `resend` dependency installed
- [ ] `src/lib/email.ts` created with `sendEmail()` utility — sender: `Claru AI <team@claru.ai>` (per design doc Section 9.1)
- [ ] Admin notification email sent on new lead submission: subject `[Claru] New data catalog request from {company}`, body contains lead name, company, email, use case summary, modalities of interest, and link to `/admin/leads/{id}` -- per design doc Section 9.3
- [ ] Email sent to `team@claru.ai` (admin notification address) -- per REQ-012 AC-1
- [ ] `.env.local.example` updated with `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL=team@claru.ai`
- [ ] If email delivery fails: error is logged but does not block the lead insert (status update persists) -- per REQ-012 AC-4
- [ ] **Email templates use the dark terminal aesthetic:** dark background (`#0a0908`), sage green accents (`#92B090`), JetBrains Mono font for monospace elements, matching the site's design system -- per REQ-012 AC-5 and design doc Section 9.2
- [ ] All four email templates (admin notification, lead approved, lead rejected, new datasets granted) should use this consistent dark terminal style
- [ ] The email send is called from the `POST /api/leads` route handler created in US-007
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

### Phase 3: Admin -- Lead Management

---

#### US-009: Admin Leads List Page `/admin/leads`

**Description:** As a Claru admin, I want to view all access requests in a filterable table so I can efficiently triage incoming leads.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.3; Requirements REQ-003

**Acceptance Criteria:**
- [ ] Page at `src/app/admin/leads/page.tsx` -- Server Component (data fetch) + Client Component (interactive table) -- per design doc Section 6.3
- [ ] Protected by existing JWT cookie middleware -- per REQ-003 AC-7; redirects unauthenticated users to admin login
- [ ] Table displays columns: name, email, company, status (with `LeadStatusBadge` component), submitted date, action link -- per REQ-003 AC-1
- [ ] `LeadStatusBadge` component created at `src/app/components/ui/LeadStatusBadge.tsx` with color mapping: pending=warning, approved=accent-primary, rejected=error -- per design doc Section 3.1
- [ ] Default sort: `created_at` descending (newest first) -- per REQ-003 AC-2
- [ ] Status filter tabs: All / Pending / Approved / Rejected -- per REQ-003 AC-3
- [ ] Search input filters by name, email, or company (case-insensitive, debounced 300ms) -- per REQ-003 AC-4
- [ ] Pagination: 25 rows per page with previous/next controls when >25 leads -- per REQ-003 AC-5
- [ ] Click row navigates to `/admin/leads/[id]` -- per REQ-003 AC-6
- [ ] Matches existing `AdminJobsTable` pattern from `src/app/admin/` -- per design doc Section 6.3
- [ ] Data fetched via `createSupabaseAdminClient` (service_role bypasses RLS)
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-010: Admin Lead Detail Page `/admin/leads/[id]` with Approve/Reject

**Description:** As a Claru admin, I want to view a lead's full details and approve or reject their access request so I can control who gets portal access.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.4; Requirements REQ-004

**Acceptance Criteria:**
- [ ] Page at `src/app/admin/leads/[id]/page.tsx` -- Server Component + Client sub-components -- per design doc Section 6.4
- [ ] Displays lead's full info: name, email, company, role, categories of interest, use case, submission date, current status with `LeadStatusBadge` -- per REQ-004 AC-1
- [ ] "Approve" button updates lead status to `approved` via API call -- per REQ-004 AC-2
- [ ] "Reject" button updates lead status to `rejected` with optional rejection reason textarea -- per REQ-004 AC-5
- [ ] Admin notes textarea for internal notes -- per design doc Section 6.4
- [ ] 404 page displayed for non-existent lead IDs -- per REQ-004 AC-7
- [ ] API routes created:
  - `POST /api/admin/leads/[id]/approve/route.ts` -- per design doc Section 5.3
  - `POST /api/admin/leads/[id]/reject/route.ts` -- per design doc Section 5.3
  - `GET /api/admin/leads/[id]/route.ts` -- per design doc Section 5.3
- [ ] Approve route: updates status, creates Supabase Auth user with `createUser({ email, email_confirm: true })`, stores `supabase_user_id` on lead record, generates magic link, sends approval email -- per design doc Section 5.3 and Section 7.3
- [ ] Reject route: updates status, sends rejection email via Resend -- per design doc Section 5.3
- [ ] Approval email contains: welcome message, magic link button "Access Your Portal", dataset count -- per design doc Section 9.2
- [ ] Rejection email: professional message, optional rejection reason, link to contact form -- per design doc Section 9.2
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-011: Admin Dataset Access Grant UI (Select Datasets for a Lead)

**Description:** As a Claru admin, I want to select which specific datasets or categories to grant a lead access to, so I can provide tailored data previews.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.4; Requirements REQ-004 AC-3, AC-4, AC-6; REQ-006

**Acceptance Criteria:**
- [ ] On the lead detail page (`/admin/leads/[id]`), when admin clicks "Approve", a dataset selector modal/panel appears -- per REQ-004 AC-3
- [ ] Dataset selector: searchable, filterable by category, displays all active (non-deleted) datasets grouped by category -- per REQ-006 AC-1
- [ ] Checking a category header selects/deselects all datasets in that category -- per REQ-006 AC-2
- [ ] Saving grants inserts rows into `lead_dataset_access` with `lead_id`, `dataset_id`, `granted_at`, `granted_by` -- per REQ-006 AC-3
- [ ] "Current Access" section on lead detail page: table showing granted datasets with revoke button -- per design doc Section 6.4
- [ ] "Grant Additional Access" button to add more datasets to an already-approved lead -- per REQ-004 AC-6
- [ ] Count of currently granted datasets displayed alongside the grant list -- per REQ-006 AC-5
- [ ] API routes created:
  - `POST /api/admin/leads/[id]/grant/route.ts` -- per design doc Section 5.3
  - `DELETE /api/admin/leads/[id]/grant/route.ts` (with `datasetId` in body or query) -- per design doc Section 5.3
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- test granting, revoking, and category-level selection
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-012: Lead Approval Email with Magic Link (Resend + Supabase Auth)

**Description:** As an approved lead, I want to receive an email with a magic link that signs me into the portal so that I don't need to manage a password.

**Agent:** `supabase-expert` agent

**Reference:** Design doc Section 7.3 (Magic Link Flow), Section 9.2 (Email Templates); Requirements REQ-007, REQ-012 AC-2, AC-3

**Acceptance Criteria:**
- [ ] When admin approves a lead, the approve API route creates a Supabase Auth user: `supabaseAdmin.auth.admin.createUser({ email, email_confirm: true })` -- per design doc Section 7.3 step 2
- [ ] `supabase_user_id` from the created auth user is stored on the lead record -- per design doc Section 7.3 step 2
- [ ] Magic link generated via `supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo: '${SITE_URL}/portal' } })` -- per design doc Section 7.3 step 3
- [ ] Magic link URL included in the approval email sent via Resend with "Access Your Portal" button -- per design doc Section 9.2
- [ ] Approval email includes: welcome message, dataset count, note that link expires -- per design doc Section 9.2
- [ ] Rejection email sent on reject action: professional message, optional rejection reason, link to contact form -- per design doc Section 9.2
- [ ] New datasets granted email: list of newly granted datasets + magic link -- per design doc Section 9.2
- [ ] If magic link user already exists (re-approval), generate a new magic link instead of creating a duplicate user
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

### Phase 4: Admin -- Catalog Management

---

#### US-013: Admin Catalog List Page `/admin/catalog`

**Description:** As a Claru admin, I want to view all datasets in a table with filtering so I can manage the catalog efficiently.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.5; Requirements REQ-005 AC-1, AC-8

**Acceptance Criteria:**
- [ ] Page at `src/app/admin/catalog/page.tsx` -- Server Component + Client table -- per design doc Section 6.5
- [ ] Table columns: Name, Category, Modality, Samples count, Public? (boolean), Actions (edit, delete) -- per REQ-005 AC-1
- [ ] "New Dataset" button in header linking to `/admin/catalog/new` -- per design doc Section 6.5
- [ ] Filter by category and modality -- per REQ-005 AC-8
- [ ] Search by dataset name -- per REQ-005 AC-8
- [ ] Click row navigates to `/admin/catalog/[id]` for editing -- per design doc Section 6.5
- [ ] Shows archived datasets with visual indicator (dimmed or strikethrough)
- [ ] Data fetched via `createSupabaseAdminClient` -- includes archived datasets per design doc Section 6.5
- [ ] API route `GET /api/admin/catalog/route.ts` created -- per design doc Section 5.3
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-014: Admin Create/Edit Dataset Page with Form

**Description:** As a Claru admin, I want to create and edit datasets with full metadata so the catalog content is accurate and current.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.6, 6.7; Requirements REQ-005 AC-2, AC-5, AC-6, AC-7

**Acceptance Criteria:**
- [ ] Create page at `src/app/admin/catalog/new/page.tsx` -- Client Component -- per design doc Section 6.6
- [ ] Edit page at `src/app/admin/catalog/[id]/page.tsx` -- Server Component (initial data) + Client sub-components -- per design doc Section 6.7
- [ ] Form fields: name (required), slug (auto-generated from name, editable), description (markdown textarea), category (select from `dataset_categories`), modality (select: video/image/multimodal/robotics), metadata (JSON editor textarea), isPublic toggle -- per REQ-005 AC-2 and design doc Section 6.6
- [ ] Edit form pre-populated with existing dataset data including current thumbnail and video previews -- per REQ-005 AC-7
- [ ] "Delete" button triggers confirmation dialog, then soft-deletes (sets `is_archived = true`) -- per REQ-005 AC-6
- [ ] API routes created:
  - `POST /api/admin/catalog/route.ts` -- create dataset -- per design doc Section 5.3
  - `PUT /api/admin/catalog/[id]/route.ts` -- update dataset
  - `DELETE /api/admin/catalog/[id]/route.ts` -- archive dataset (soft delete)
- [ ] Create redirects to edit page on success (for sample uploads) -- per design doc Section 6.6
- [ ] When a dataset is soft-deleted, existing access grants are automatically revoked -- per REQ-006 AC-4
- [ ] Zod validation on both client and server
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- test create, edit, and delete flows
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-015: Dataset Sample Upload to Supabase Storage

**Description:** As a Claru admin, I want to upload thumbnails and video samples to datasets via drag-and-drop so that leads can preview data quality.

**Agent:** `supabase-expert` agent

**Reference:** Design doc Section 3.1 (`DatasetUploader`), Section 6.7, Section 8 (Storage Design); Requirements REQ-005 AC-3, AC-4

**Acceptance Criteria:**
- [ ] `DatasetUploader` component created at `src/app/components/ui/DatasetUploader.tsx` -- per design doc Section 3.1
- [ ] Supports drag-and-drop and file picker for uploads
- [ ] Accepted file types: `.mp4`, `.mov`, `.webm`, `.jpg`, `.png`, `.json` -- per design doc Section 3.1
- [ ] Upload flow per design doc Section 8.3:
  1. Client requests signed upload URL from `POST /api/admin/catalog/[id]/samples/upload-url/route.ts`
  2. API generates signed upload URL via `createSignedUploadUrl()`
  3. Client uploads directly to Supabase Storage using signed URL (bypasses Next.js server)
  4. On completion, client calls `POST /api/admin/catalog/[id]/samples/route.ts` to create DB record
  5. API verifies file exists in storage before creating record
- [ ] Terminal-style progress bar during upload -- per design doc Section 3.1
- [ ] Thumbnail upload stores URL in `datasets.thumbnail_path` -- per REQ-005 AC-3
- [ ] Video sample upload stores URL in `dataset_samples` table -- per REQ-005 AC-4
- [ ] Samples grid on edit page shows uploaded samples with thumbnails, file info, delete button -- per design doc Section 6.7
- [ ] `DELETE /api/admin/catalog/[id]/samples/[sampleId]/route.ts` -- deletes from Storage + database -- per design doc Section 5.3
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- test file upload, progress, and deletion
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-016: Seed Initial Datasets from Notion Catalog Data

**Description:** As a developer, I need a seed script that populates the database with initial dataset categories and datasets from the existing Notion catalog, so the catalog has real content for testing and launch.

**Agent:** `general-purpose` agent

**Reference:** Design doc Section 12.1 (Migration Strategy)

**Notion Source Data:** The initial catalog is seeded from Notion databases with the following structure:
- **Egocentric Crowd** table: columns `Type`, `Category`, `Subcategory`, `S3 URL`
- **Egocentric Workplaces** table: columns `Category`, `Drive links`
- **Licensed Cinematic** table: columns `Category`, `S3 URL`
- **Car Footage** (additional category to be seeded)

**Acceptance Criteria:**
- [ ] Script at `scripts/seed-datasets.ts` (runnable with `npx tsx scripts/seed-datasets.ts`) -- per design doc Section 12.1
- [ ] Script creates dataset categories based on the Notion data: Egocentric Crowd, Egocentric Workplaces, Licensed Cinematic, Car Footage, and any additional categories as needed
- [ ] Script creates dataset records for each entry in the Notion tables, mapping Notion columns to the design doc schema (`datasets` table): `name`, `category_id` (FK), `modality`, `metadata` (jsonb — store Type/Subcategory/S3 URL/Drive links here), `is_public=true` for a representative subset
- [ ] Script uses `createSupabaseAdminClient` for all inserts (service_role, bypasses RLS)
- [ ] Script is idempotent: running it again does not create duplicates (uses upsert or checks for existence)
- [ ] Script logs progress to console (categories created, datasets created, errors)
- [ ] **Schema note:** All schema references use the design doc (`docs/data-catalog-design.md`, Section 4) as the canonical source
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent on script

---

### Phase 5: Lead Portal

---

#### US-017: Lead Authentication Middleware (Supabase Magic Link Session)

**Description:** As a developer, I need middleware that protects all `/portal/*` routes by checking for a valid Supabase session, and validates that the lead's status is still `approved`.

**Agent:** `nextjs-expert` agent

**Reference:** Design doc Section 7 (Auth Flow Design); Requirements REQ-007, REQ-013 AC-5, AC-6, AC-8

**Acceptance Criteria:**
- [ ] `src/middleware.ts` updated to handle `/portal/*` routes alongside existing `/admin/*` routes -- per design doc Section 7.2
- [ ] Portal route middleware creates a Supabase server client and calls `supabase.auth.getSession()` -- per design doc Section 7.2
- [ ] If no session: redirect to `/data-catalog?auth=required` -- per design doc Section 7.5
- [ ] If session exists but lead status is not `approved`: display message that request is under review or not approved, deny portal access -- per REQ-007 AC-6
- [ ] Portal login page at `src/app/portal/login/page.tsx` (if needed) with email input and "Send Magic Link" button -- per REQ-007 AC-2, AC-3
- [ ] Login form calls `supabase.auth.signInWithOtp({ email })` -- per REQ-007 AC-3
- [ ] No information leakage: always show generic "check your email" message regardless of email existence -- per REQ-007 AC-4
- [ ] Magic link callback sets session and redirects to `/portal` -- per REQ-007 AC-5
- [ ] Session expiry redirects to `/data-catalog?auth=expired` -- per design doc Section 7.4
- [ ] If lead status changed from `approved` to `rejected`, portal access invalidated on next request -- per REQ-013 AC-8
- [ ] Middleware matcher updated: `["/admin/:path+", "/api/admin/:path+", "/portal/:path+", "/api/portal/:path+"]` -- per design doc Section 7.2
- [ ] Typecheck passes
- [ ] `npm run build` succeeds
- [ ] **Code Review:** Run `code-reviewer` agent -- special focus on auth security

---

#### US-018: Portal Dashboard `/portal`

**Description:** As an approved lead, I want to see a dashboard after logging in that summarizes my available datasets and provides navigation.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.8; Requirements REQ-008

**Acceptance Criteria:**
- [ ] Page at `src/app/portal/page.tsx` -- Server Component -- per design doc Section 6.8
- [ ] Portal layout at `src/app/portal/layout.tsx` -- checks Supabase session, redirects to `/data-catalog` if unauthenticated -- per design doc Section 6.12
- [ ] Portal-specific header: Claru logo (links to `/portal`), "Catalog" nav link, "Request" nav link, user email display, "Sign Out" button -- per design doc Section 6.12
- [ ] Welcome message with lead's name and company -- per REQ-008 AC-1
- [ ] Summary stats: total datasets available, categories available, most recently added datasets -- per REQ-008 AC-2
- [ ] "Browse Catalog" CTA linking to `/portal/catalog` -- per REQ-008 AC-3
- [ ] "Can't find what you need?" CTA linking to `/portal/request` -- per REQ-008 AC-3
- [ ] If lead has no datasets granted: message indicating access is being configured -- per REQ-008 AC-4
- [ ] Loading state: skeleton screens with shimmer (`var(--bg-tertiary)`) -- per design doc Section 10.4
- [ ] Error boundary at `src/app/portal/error.tsx` with terminal-style error screen -- per design doc Section 10.3
- [ ] Dark terminal aesthetic matching site design system
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-019: Portal Catalog Browsing `/portal/catalog` with Filters

**Description:** As an approved lead, I want to browse only the datasets I've been granted access to with filtering and search.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.9; Requirements REQ-009

**Acceptance Criteria:**
- [ ] Page at `src/app/portal/catalog/page.tsx` -- Server Component -- per design doc Section 6.9
- [ ] Displays ONLY datasets the lead has been granted access to (via RLS using anon client, which enforces `lead_dataset_access` join) -- per REQ-009 AC-1
- [ ] Datasets displayed as grid of `DatasetCard` components (`variant="portal"`) showing: thumbnail, name, category, subcategory/modality, type badge, metadata summary -- per REQ-009 AC-2
- [ ] Category filter sidebar or tabs -- per design doc Section 6.9, REQ-009 AC-3
- [ ] Modality filter -- per REQ-009 AC-4
- [ ] Search input filters by dataset name (debounced 300ms) -- per REQ-009 AC-5
- [ ] Click card navigates to `/portal/catalog/[id]` -- per REQ-009 AC-6
- [ ] If lead tries to access a dataset not granted: 403 with access denied message -- per REQ-009 AC-7
- [ ] Filter state preserved in URL search params for back-navigation -- per REQ-010 AC-7
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-020: Portal Dataset Detail `/portal/catalog/[id]` with Video Player

**Description:** As an approved lead, I want to view detailed dataset information including video samples, technical specs, and downloadable metadata so I can evaluate the data for my use case.

**Agent:** `frontend-expert` agent + `webapp-testing` skill for verification

**Reference:** Design doc Section 3.1 (`VideoPlayer`, `MetadataViewer`), Section 6.10; Requirements REQ-010

**Acceptance Criteria:**
- [ ] Page at `src/app/portal/catalog/[id]/page.tsx` (Server Component) + `DatasetDetailClient.tsx` (Client Component) -- per design doc Section 6.10
- [ ] Server Component fetches dataset + samples with signed URLs (batch-generated for performance) -- per design doc Section 13.3
- [ ] Displays: dataset name, category breadcrumb, modality icon, description -- per REQ-010 AC-1
- [ ] `VideoPlayer` component created at `src/app/components/ui/VideoPlayer.tsx`:
  - HTML5 `<video>` with controls, `poster` set to thumbnail signed URL -- per REQ-010 AC-2
  - Terminal title bar (three colored dots + filename) reusing `SampleDataViewer` pattern -- per design doc Section 3.1
  - Metadata bar below video: resolution, fps, duration, codec -- per design doc Section 3.1
- [ ] `MetadataViewer` component created at `src/app/components/ui/MetadataViewer.tsx`:
  - Terminal-aesthetic JSON viewer matching `SampleDataViewer` pattern -- per design doc Section 3.1
  - Collapsible code block with syntax highlighting (JetBrains Mono) -- per REQ-010 AC-4
  - "Copy JSON" button -- per design doc Section 3.1
- [ ] Technical specs table: resolution, duration, frame rate, file format, file size (parsed from `metadata` jsonb) -- per REQ-010 AC-3
- [ ] "Download Sample" button generates time-limited signed URL (1 hour) and initiates download -- per REQ-010 AC-5
- [ ] Signed URL generation via `GET /api/portal/datasets/[id]/signed-url/[sampleId]/route.ts` -- per design doc Section 5.4
- [ ] If no video sample: placeholder with "Sample coming soon" -- per REQ-010 AC-6
- [ ] Back navigation returns to `/portal/catalog` with previous filter state (URL search params) -- per REQ-010 AC-7
- [ ] Extract reusable JSON viewer sub-components (`JsonLine`, `CopyButton`) to `src/app/components/ui/json-viewer/` -- per design doc Section 3.1
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- test video playback, metadata display, download
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-021: Portal Custom Request Page `/portal/request`

**Description:** As an approved lead, I want to submit a simple request if I can't find what I need, and optionally book a call with the Claru team. This is a simple CTA + form — not a complex ticketing system.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.11; Requirements REQ-011

**Acceptance Criteria:**
- [ ] Page at `src/app/portal/request/page.tsx` -- Client Component -- per design doc Section 6.11
- [ ] Headline: "Can't find what you need?"
- [ ] Simple form fields: description of data needed (required textarea), preferred modality (select), optional notes -- per REQ-011 AC-1
- [ ] Pre-fills lead info from Supabase session -- per design doc Section 6.11
- [ ] Submits via `POST /api/portal/request/route.ts` which inserts into `custom_requests` table and sends admin notification email -- per REQ-011 AC-2
- [ ] Custom requests table: `id`, `lead_id` (FK), `description`, `modality`, `notes`, `created_at` -- per requirements REQ-014 AC-4 (schema reference: design doc Section 4)
- [ ] RLS on `custom_requests`: leads can only read/write their own requests -- per REQ-013 AC-4
- [ ] Success confirmation message: "We'll get back to you within 24 hours" -- per REQ-011 AC-3
- [ ] "Book a Call" CTA button linking to the call booking URL configured in admin Settings (`/admin/settings`) -- per REQ-011 AC-4
- [ ] Links to relevant case studies (using existing `src/lib/case-studies.ts` if available) -- per REQ-011 AC-5
- [ ] API route sends email notification to `team@claru.ai` -- per design doc Section 5.4
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill**
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

### Phase 6: Polish & Testing

---

#### US-022: Add `/data-catalog` to Site Navigation + Update ProofOfWork Link

**Description:** As a site visitor, I want to see Data Catalog in the navigation so the section is discoverable from any page.

**Agent:** `frontend-expert` agent

**Acceptance Criteria:**
- [ ] "Data Catalog" added to `Header.tsx` `navLinks` array
- [ ] Appears in both desktop nav and mobile menu
- [ ] "Data Catalog" added to `Footer.tsx` in the appropriate link section
- [ ] Active state: nav link highlighted when on `/data-catalog` or `/data-catalog/*` routes
- [ ] If a "Proof of Work" or "Explore our full data catalog" link exists on the landing page, update it to point to `/data-catalog`
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- desktop + mobile
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

#### US-023: Playwright E2E -- Public Flow (Landing to Request Form to Submission)

**Description:** As QA, I need an E2E test verifying the full public flow: visiting the catalog landing page, browsing categories, completing the access request form, and seeing confirmation.

**Agent:** `general-purpose` agent + `webapp-testing` skill

**Reference:** Design doc Section 11.3; Requirements REQ-001, REQ-002

**Acceptance Criteria:**
- [ ] Test file at `tests/e2e/data-catalog-public.spec.ts`
- [ ] Test flow:
  1. Navigate to `/data-catalog`
  2. Verify page title, hero section, and "Request Access" CTA render
  3. Verify dataset category cards render with category names, counts, thumbnails
  4. Click "Request Access" CTA, verify navigation to `/data-catalog/request`
  5. Complete Step 1: fill name, email, company, role
  6. Complete Step 2: enter use case text (>20 chars), select modalities
  7. Complete Step 3: select dataset categories of interest
  8. Complete Step 4: enter volume/timeline info
  9. Submit form on Step 5
  10. Verify success confirmation message appears
- [ ] Validation test: attempt to submit with empty required fields, verify inline errors appear
- [ ] Responsive test: verify landing page renders correctly at 375px width
- [ ] Test runs: `npx playwright test tests/e2e/data-catalog-public.spec.ts`
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file

---

#### US-024: Playwright E2E -- Admin Flow (Leads to Approve to Grant Access)

**Description:** As QA, I need an E2E test verifying the admin lead management flow: viewing leads, approving a lead with dataset selection, and rejecting a lead.

**Agent:** `general-purpose` agent + `webapp-testing` skill

**Reference:** Design doc Section 11.3; Requirements REQ-003, REQ-004, REQ-006

**Acceptance Criteria:**
- [ ] Test file at `tests/e2e/data-catalog-admin.spec.ts`
- [ ] Test setup: seed a test lead in the database via API or direct Supabase insert
- [ ] Test flow -- lead management:
  1. Login to admin (existing admin auth flow)
  2. Navigate to `/admin/leads`
  3. Verify leads table renders with pending lead
  4. Verify status filter tabs work (click "Pending", verify filter)
  5. Click a lead row, verify navigation to `/admin/leads/[id]`
  6. Verify lead detail page shows full info: name, email, company, use case
  7. Click "Approve" button
  8. Verify dataset selector modal appears
  9. Select datasets (check a category header for batch select)
  10. Save grants, verify status changes to "Approved"
  11. Verify "Current Access" table shows granted datasets
- [ ] Test flow -- reject:
  12. Navigate to another pending lead
  13. Click "Reject" button
  14. Optionally enter rejection reason
  15. Verify status changes to "Rejected"
- [ ] Test flow -- catalog management:
  16. Navigate to `/admin/catalog`
  17. Verify datasets table renders
  18. Click "New Dataset", fill form, save
  19. Verify new dataset appears in table
- [ ] Test runs: `npx playwright test tests/e2e/data-catalog-admin.spec.ts`
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file

---

#### US-025: Playwright E2E -- Portal Flow (Login to Browse to View Dataset)

**Description:** As QA, I need an E2E test verifying the lead portal flow: authenticating, browsing the catalog, viewing a dataset detail with video player, and submitting a custom request.

**Agent:** `general-purpose` agent + `webapp-testing` skill

**Reference:** Design doc Section 11.3; Requirements REQ-007, REQ-008, REQ-009, REQ-010, REQ-011

**Acceptance Criteria:**
- [ ] Test file at `tests/e2e/data-catalog-portal.spec.ts`
- [ ] Test setup: seed an approved lead with Supabase Auth user and granted datasets; use Supabase test helpers for auth or mock the session
- [ ] Test flow -- auth boundary:
  1. Navigate to `/portal` without session, verify redirect to `/data-catalog?auth=required`
  2. Authenticate via test session setup
- [ ] Test flow -- dashboard:
  3. Navigate to `/portal`, verify welcome message with lead name
  4. Verify summary stats render (dataset count, categories)
  5. Verify "Browse Catalog" and custom request CTAs render
- [ ] Test flow -- catalog browsing:
  6. Click "Browse Catalog", verify navigation to `/portal/catalog`
  7. Verify dataset cards render (only granted datasets)
  8. Apply category filter, verify cards update
  9. Apply search filter, verify results narrow
  10. Click a dataset card, verify navigation to `/portal/catalog/[id]`
- [ ] Test flow -- dataset detail:
  11. Verify dataset name, category breadcrumb, description render
  12. Verify video player renders with poster thumbnail (if sample exists)
  13. Verify metadata viewer renders with JSON content
  14. Verify "Download Sample" button is present
  15. Navigate back, verify filter state preserved
- [ ] Test flow -- custom request:
  16. Navigate to `/portal/request`
  17. Fill description, select modality
  18. Submit, verify confirmation message
- [ ] Test flow -- sign out:
  19. Click "Sign Out", verify redirect away from portal
  20. Verify portal routes are no longer accessible
- [ ] Test runs: `npx playwright test tests/e2e/data-catalog-portal.spec.ts`
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file

---

#### US-026: Admin Settings Page `/admin/settings` with Call Booking URL and Email Template Preview

**Description:** As a Claru admin, I want a Settings page where I can configure the call booking URL and preview all email templates with their dark terminal styling, so that I can manage portal settings and verify email appearance without code changes.

**Agent:** `frontend-expert` agent

**Reference:** Design doc Section 6.13, 6.14; Requirements REQ-016, REQ-017

**Acceptance Criteria:**
- [ ] Page at `src/app/admin/settings/page.tsx` -- Server Component + Client sub-components -- per design doc Section 6.13
- [ ] Protected by existing JWT cookie middleware; redirects unauthenticated users to admin login -- per REQ-016 AC-4
- [ ] Accessible from the admin nav alongside "Leads" and "Catalog" -- per REQ-016 AC-3
- [ ] **Section 1: Call Booking URL**
  - [ ] Text input for the call booking URL (e.g., Calendly link)
  - [ ] Save button persists to a `settings` table in Supabase (key-value store) -- per design doc Section 6.14
  - [ ] This URL is used by `/portal/request` for the "Book a Call" CTA -- per REQ-016 AC-2
- [ ] **Section 2: Email Template Preview**
  - [ ] Displays all four email templates: Admin Notification, Lead Approved, Lead Rejected, New Datasets Granted -- per REQ-017 AC-1
  - [ ] Selecting a template renders a live preview with sample data using the dark terminal aesthetic: dark background (`#0a0908`), sage green accents (`#92B090`), JetBrains Mono font -- per REQ-017 AC-2
  - [ ] "Copy HTML" button copies the full HTML source of the email template to clipboard -- per REQ-017 AC-3
  - [ ] Preview accurately represents email appearance including dark background, accent colors, and monospace font -- per REQ-017 AC-4
- [ ] `EmailTemplatePreview` component created matching design doc Section 6.13 interface
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] `npm run build` succeeds
- [ ] **Verify in browser using dev-browser skill** -- test URL save, template preview, and HTML copy
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files

---

## Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| FR-01 | `/data-catalog` page renders a public landing with **category overview cards** (no dataset browsing), hero, and "Request Access" CTA. Actual data browsing requires authentication. | REQ-001 |
| FR-02 | Multi-step access request form collects name, email, company, role, categories, use case with Zod validation | REQ-002 |
| FR-03 | Form submission writes to Supabase `leads` table via Server Action (service_role key stays server-side) | REQ-002 |
| FR-04 | Duplicate email submissions update existing lead rather than creating duplicates | REQ-002 AC-6 |
| FR-05 | Admin lead list page at `/admin/leads` with status filters, search, pagination (25/page), and sort by newest | REQ-003 |
| FR-06 | Admin lead detail page at `/admin/leads/[id]` with approve/reject actions and dataset access grant selector | REQ-004, REQ-006 |
| FR-07 | Dataset access grants stored in `lead_dataset_access` junction table with category-level batch selection | REQ-006 |
| FR-08 | Admin catalog management at `/admin/catalog` with CRUD, thumbnail/video upload to Supabase Storage, and soft-delete | REQ-005 |
| FR-09 | Lead authentication via Supabase magic link with no-password flow | REQ-007 |
| FR-10 | Portal middleware protects `/portal/*` routes, validates session AND lead status | REQ-007, REQ-013 |
| FR-11 | Portal dashboard at `/portal` with welcome, stats, and navigation CTAs | REQ-008 |
| FR-12 | Portal catalog at `/portal/catalog` shows only granted datasets with category/modality/search filters | REQ-009 |
| FR-13 | Portal dataset detail at `/portal/catalog/[id]` with video player, metadata viewer, and sample download (signed URLs) | REQ-010 |
| FR-14 | Portal custom request: simple CTA + form at `/portal/request` with submission to Supabase and "Book a Call" link (URL from admin Settings) | REQ-011 |
| FR-15 | Email notifications with dark terminal aesthetic (`#0a0908` bg, `#92B090` accents, JetBrains Mono): admin notified on new request (to `team@claru.ai`), lead notified on approve/reject, lead notified on new grants | REQ-012 |
| FR-16 | RLS on all tables: leads see only their own data, public sees only public datasets, service_role has full access | REQ-013 |
| FR-17 | Storage: `dataset-samples` private bucket, all access via signed URLs (1-hour expiry), service_role write-only | REQ-015 |
| FR-18 | All pages use shared Header/Footer and match dark terminal aesthetic | Design doc Section 2.3, REQ-001 AC-1 |
| FR-19 | All pages fully responsive on mobile, tablet, and desktop viewports | REQ-001 AC-7 |
| FR-20 | Admin Settings page at `/admin/settings` with call booking URL config and email template preview with "Copy HTML" | REQ-016, REQ-017 |
| FR-21 | No max file size limit on uploads; no rate limiting in v1 | Decision |
| FR-22 | Initial catalog seeded from Notion data (Egocentric Crowd, Egocentric Workplaces, Licensed Cinematic, Car Footage) | US-016 |

---

## Non-Goals

- **No self-service sign-up:** Leads must be approved by an admin. There is no "create account" flow.
- **No payment/billing:** The catalog is free to browse for approved leads. No e-commerce or subscription features.
- **No dataset download (full datasets):** Leads can only download sample files. Full dataset delivery is handled offline.
- **No real-time notifications:** No WebSocket push. Leads and admins are notified via email only.
- **No admin auth migration:** Admin authentication stays on existing JWT cookie system. No migration to Supabase Auth for admins.
- **No automated dataset ingestion:** Dataset records are created manually by admins or via seed script. No Notion sync or API ingestion pipeline.
- **No analytics/tracking:** No event tracking beyond standard page views in v1. Usage analytics for the portal is a future phase.
- **No multi-tenant admin:** All admins share the same credential. No role-based admin access (editor vs. viewer).
- **No SSO/SAML:** Lead auth is magic-link only. No enterprise SSO integration.
- **No search engine indexing of portal pages:** Only `/data-catalog` (public) is indexable. All `/portal/*` pages have `noindex`.
- **No PDF/export:** No data sheet PDF generation or catalog export functionality.

---

## Technical Considerations

### Supabase Setup
- Create a Supabase project, run schema migration (US-002), create storage bucket (US-003), configure Auth (enable magic link, set site URL and redirect URLs)
- Two Supabase clients: `createSupabaseServerClient` (anon key, respects RLS, used in portal pages) and `createSupabaseAdminClient` (service_role key, bypasses RLS, used in admin routes and Server Actions)
- See design doc Section 5.1 for exact client code

### Auth Flow
- Three auth contexts coexist: public (no auth), admin (JWT cookie), portal (Supabase session) -- see design doc Section 7.1
- Middleware must handle both auth types with clear separation and early returns -- see design doc Section 7.2
- Magic link flow: admin creates Supabase Auth user on approval, generates magic link, sends via Resend -- see design doc Section 7.3
- Session management: 1h access token (auto-refreshed), 7d refresh token -- see design doc Section 7.4

### Storage Patterns
- Single private `dataset-samples` bucket with all access via signed URLs. No max file size limit.
- Admin uploads use signed upload URLs (direct client-to-Storage, bypasses Next.js server for large files) -- see design doc Section 8.3
- Signed download URLs generated server-side with 1-hour expiry
- Batch-generate signed URLs for all samples on a dataset detail page (single roundtrip) -- see design doc Section 13.3

### Performance
- Video thumbnails via `poster` attribute to avoid loading full video on page load
- Lazy-load videos below the fold
- Server-side pagination with cursor-based queries for large catalogs
- Image optimization via Next.js `<Image>` with Supabase Storage `remotePatterns`

### New Dependencies
- `@supabase/supabase-js` (~50KB) -- Supabase client
- `@supabase/ssr` (~5KB) -- Server-side cookie handling
- `resend` (~10KB) -- Transactional email

### Environment Variables (New)

> **Note:** `.env.local` already has Supabase and Resend credentials configured. Verify they are present before starting development.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
ADMIN_NOTIFICATION_EMAIL=team@claru.ai
NEXT_PUBLIC_SITE_URL
```

Note: `CALENDLY_URL` env var is no longer needed — the call booking URL is now configurable via the admin Settings page (`/admin/settings`).

---

## Quality Assurance Requirements

### Build & Type Safety
- Every story must pass `npx tsc --noEmit`, `npm run lint`, and `npm run build` before merge
- All Supabase interactions use typed clients (generated types or manual types from US-004)

### Code Review
- Every story reviewed by `code-reviewer` agent before commit
- RLS policies receive extra scrutiny -- verify no data leakage paths

### Browser Verification
- All UI stories verified in browser via `dev-browser` skill at desktop (1440px), tablet (768px), and mobile (375px) breakpoints

### E2E Tests (Playwright)
- **US-023:** Public flow -- landing page, request form, submission
- **US-024:** Admin flow -- leads list, approve/reject, dataset grant management
- **US-025:** Portal flow -- authentication, catalog browsing, dataset detail, custom request
- All tests run in CI via `npx playwright test`

### Security Testing
- Verify RLS prevents cross-lead data access (lead A cannot see lead B's datasets)
- Verify unauthenticated users are redirected from portal routes
- Verify portal users cannot access admin routes
- Verify service_role key is never exposed to client bundles
- Verify signed URLs expire correctly after 1 hour

### Manual QA Checklist (from design doc Section 11.4)
- [ ] Magic link email is received and works
- [ ] Signed URLs expire correctly after 1 hour
- [ ] Video playback works across Chrome, Safari, Firefox
- [ ] Large file upload completes with progress indicator (no max file size limit)
- [ ] RLS correctly prevents cross-lead data access
- [ ] Admin can approve, reject, grant, and revoke without errors
- [ ] Form works with keyboard-only navigation
- [ ] All text is readable at WCAG AA contrast ratio

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lead conversion rate | 10%+ of `/data-catalog` visitors submit access request | Analytics on form submission vs. page views |
| Admin response time | <24 hours from request to approval/rejection | Timestamp delta between `leads.created_at` and `leads.updated_at` |
| Portal engagement | Approved leads browse 3+ datasets on average | Count of distinct `dataset_id` views per `lead_id` |
| Form completion rate | 60%+ of users who start the form complete it | Step-by-step analytics (if added later) |
| Zero data leaks | No RLS bypass incidents | Playwright E2E auth boundary tests pass in CI |
| Build stability | Zero build failures from catalog code | CI green on all catalog-related PRs |
| Email deliverability | 95%+ email delivery rate | Resend dashboard metrics |
| Page load performance | <2s LCP on `/data-catalog` and `/portal/catalog` | Lighthouse or Vercel Analytics |

---

## Open Questions

1. **Supabase project:** Is there an existing Supabase project to use, or should a new one be provisioned? What region?
   > **Note:** `.env.local` already has Supabase + Resend credentials configured.
2. **Resend domain verification:** Is `claru.ai` already configured for Resend with SPF/DKIM/DMARC, or does this need to be set up?

### Resolved Questions

3. ~~**Initial catalog content:**~~ **RESOLVED:** Seed from Notion data — Egocentric Crowd (Type/Category/Subcategory/S3 URL), Egocentric Workplaces (Category/Drive links), Licensed Cinematic (Category/S3 URL), and Car Footage. See US-016.
4. ~~**Calendly URL:**~~ **RESOLVED:** Call booking URL is configurable via admin Settings page (`/admin/settings`). See US-026.
5. ~~**Video sample sizes:**~~ **RESOLVED:** No max file size limit for uploads.
6. ~~**Schema divergence:**~~ **RESOLVED:** The design doc (`docs/data-catalog-design.md`, Section 4) is the canonical schema. Requirements doc (REQ-014) has been updated to reference it. Use `name` (not `full_name`), `category_id` FK (not flat `category`/`subcategory`), `supabase_user_id` (not `auth_user_id`), `is_archived` (not `deleted_at`), etc.
7. ~~**`custom_requests` table:**~~ **RESOLVED:** Yes, `custom_requests` table is included — simplified to: `id`, `lead_id`, `description`, `modality`, `notes`, `created_at`. No `volume_requirements` or `timeline` columns (simple form).
8. ~~**Public dataset detail pages:**~~ **RESOLVED:** Public page is strictly a category-level overview with stats. No individual dataset browsing. Data browsing requires authentication via the lead portal.
9. ~~**Rate limiting:**~~ **RESOLVED:** No rate limiting for v1. Can be added later if needed.
10. ~~**Email template design:**~~ **RESOLVED:** Custom HTML with dark terminal aesthetic — dark background (`#0a0908`), sage green accents (`#92B090`), JetBrains Mono font. Templates previewable in admin Settings page. Admin notification email from `team@claru.ai`.
