# Data Catalog Portal — Requirements Document

## Introduction

The Data Catalog Portal is a gated feature on the Claru landing page that allows potential customers (AI lab researchers) to request access to sample datasets, get approved by Claru admins, and browse a curated catalog of AI training data. The portal extends the existing Next.js 16 App Router site with Supabase (Auth, Postgres, Storage) and maintains the dark terminal aesthetic established in the design system.

The feature has three user surfaces:
1. A public-facing catalog landing page showing category overview and stats with an access request form (no dataset browsing — authentication required for that)
2. An admin portal (extending the existing `/admin` routes) for lead management, dataset management, and settings configuration
3. An authenticated lead portal for browsing granted datasets

---

## Requirements

### REQ-001: Public Data Catalog Landing Page

**User Story:** As a potential customer, I want to see an overview of Claru's available dataset categories with volume and quality stats, so that I can understand what data is available before requesting access.

**Priority:** P0
**Dependencies:** None

#### Acceptance Criteria

1. WHEN a visitor navigates to `/data-catalog` THEN the system SHALL render a public page with the Claru Header and Footer components, matching the existing dark terminal design system (bg `--bg-primary`, accent `--accent-primary`, fonts Geist Sans / JetBrains Mono).
2. WHEN the page loads THEN the system SHALL display a hero section with a headline, subheadline, and a primary "Request Access" CTA button.
3. WHEN the page loads THEN the system SHALL display a grid of dataset category cards, each showing category name, dataset count, total hours/clips, and a representative thumbnail. **This is a category-level overview only — no individual dataset browsing is available on the public page. Actual dataset browsing requires authentication via the lead portal.**
4. WHEN a visitor clicks a category card THEN the system SHALL smooth-scroll to additional detail about that category (high-level stats, data types) within the same page. No dataset-level detail or sample previews are shown.
5. WHEN a visitor clicks the "Request Access" CTA THEN the system SHALL smooth-scroll to or open the access request form (REQ-002).
6. IF the page is accessed by a search engine crawler THEN the page SHALL be server-rendered with appropriate meta tags (title, description, OG image) for SEO/discoverability.
7. WHEN the page is viewed on a mobile viewport (< 768px) THEN the layout SHALL be fully responsive with a single-column card grid and appropriately sized typography.

---

### REQ-002: Access Request Form and Submission Flow

**User Story:** As a potential customer, I want to submit a request for catalog access with my details and intended use case, so that Claru can evaluate and grant me access.

**Priority:** P0
**Dependencies:** REQ-001, Supabase project setup

#### Acceptance Criteria

1. WHEN the access request form is displayed THEN it SHALL collect the following fields: full name (required), work email (required, validated), company name (required), role/title (required), dataset categories of interest (required, multi-select from available categories), intended use case (required, textarea, min 20 characters).
2. WHEN a user submits the form with valid data THEN the system SHALL insert a row into the `leads` table in Supabase with status `pending` and a `created_at` timestamp.
3. WHEN the form submission succeeds THEN the system SHALL display a success confirmation message with expected response timeline.
4. IF any required field is empty or invalid THEN the system SHALL display inline validation errors using the existing terminal-style form patterns (React Hook Form + Zod).
5. IF the Supabase insert fails THEN the system SHALL display a user-friendly error message and log the error server-side.
6. WHEN a duplicate email submits a new request THEN the system SHALL update the existing lead record rather than creating a duplicate, and set the status back to `pending` if it was previously `rejected`.
7. WHEN the form is submitted THEN the system SHALL use a Next.js Server Action (not a client-side API call) to write to Supabase, keeping the Supabase service role key server-side only.

---

### REQ-003: Admin Lead Management — List View

**User Story:** As a Claru admin, I want to view all access requests in a filterable table, so that I can efficiently triage incoming leads.

**Priority:** P0
**Dependencies:** REQ-002, existing admin auth system (`src/lib/admin-auth.ts`)

#### Acceptance Criteria

1. WHEN an authenticated admin navigates to `/admin/leads` THEN the system SHALL display a table of all leads with columns: name, email, company, status (pending/approved/rejected), submitted date, and an action link.
2. WHEN the table loads THEN the default sort SHALL be by `created_at` descending (newest first).
3. WHEN an admin selects a status filter (pending, approved, rejected, or all) THEN the table SHALL update to show only leads matching that status.
4. WHEN an admin types in the search input THEN the table SHALL filter leads by name, email, or company (case-insensitive, debounced 300ms).
5. IF there are more than 25 leads THEN the table SHALL paginate with 25 rows per page and previous/next controls.
6. WHEN an admin clicks a lead row THEN the system SHALL navigate to `/admin/leads/[id]` (REQ-004).
7. IF the user is not authenticated as admin THEN the system SHALL redirect to the admin login page.

---

### REQ-004: Admin Lead Management — Detail and Approval

**User Story:** As a Claru admin, I want to view a lead's full details and approve or reject their access request while selecting which datasets they can see, so that I can control data access granularly.

**Priority:** P0
**Dependencies:** REQ-003, REQ-006

#### Acceptance Criteria

1. WHEN an admin navigates to `/admin/leads/[id]` THEN the system SHALL display the lead's full submitted information (name, email, company, role, categories of interest, use case, submission date, current status).
2. WHEN an admin clicks "Approve" THEN the system SHALL update the lead status to `approved` in the `leads` table.
3. WHEN an admin approves a lead THEN the system SHALL display a dataset selector (searchable, filterable by category) allowing the admin to choose which specific datasets or entire categories to grant access to.
4. WHEN dataset access grants are saved THEN the system SHALL insert rows into the `lead_dataset_access` junction table linking the lead ID to each granted dataset ID.
5. WHEN an admin clicks "Reject" THEN the system SHALL update the lead status to `rejected` and optionally allow the admin to enter a rejection reason.
6. WHEN an admin modifies a previously approved lead's dataset grants THEN the system SHALL update the `lead_dataset_access` table accordingly (add/remove grants).
7. IF the lead ID does not exist THEN the system SHALL display a 404 page.

---

### REQ-005: Admin Dataset Catalog Management — CRUD

**User Story:** As a Claru admin, I want to create, edit, and delete datasets in the master catalog with file uploads and metadata, so that the catalog stays current and accurate.

**Priority:** P0
**Dependencies:** Supabase Storage bucket setup

#### Acceptance Criteria

1. WHEN an admin navigates to `/admin/catalog` THEN the system SHALL display a table of all datasets with columns: name, category, subcategory, type (Short Form / Long Form), created date, and action buttons (edit, delete).
2. WHEN an admin clicks "Add Dataset" THEN the system SHALL display a form with fields: name (required), category (required, select from predefined list), subcategory (required, dependent on category selection), type (required, Short Form or Long Form), annotation_id (auto-generated UUID, editable), metadata JSON (optional, code editor textarea), and file upload fields for thumbnail and video sample.
3. WHEN an admin uploads a thumbnail image THEN the system SHALL upload the file to the `catalog-thumbnails` Supabase Storage bucket and store the returned URL in the dataset record's `thumbnail_url` field.
4. WHEN an admin uploads a video sample THEN the system SHALL upload the file to the `catalog-samples` Supabase Storage bucket and store the returned URL in the dataset record's `video_sample_url` field.
5. WHEN an admin saves a new or edited dataset THEN the system SHALL upsert the record in the `datasets` table in Supabase.
6. WHEN an admin clicks "Delete" on a dataset THEN the system SHALL display a confirmation dialog, and upon confirmation, soft-delete the record (set `deleted_at` timestamp) rather than hard-deleting, and remove associated files from Storage.
7. WHEN an admin navigates to `/admin/catalog/[id]` THEN the system SHALL display the edit form pre-populated with existing dataset data including preview of current thumbnail and video.
8. WHEN the admin filters or searches the catalog table THEN the system SHALL support filtering by category and searching by dataset name.

---

### REQ-006: Admin Lead-Dataset Access Grants

**User Story:** As a Claru admin, I want to control exactly which datasets each approved lead can access, so that I can provide tailored data previews based on their needs.

**Priority:** P0
**Dependencies:** REQ-004, REQ-005

#### Acceptance Criteria

1. WHEN an admin is approving or editing a lead THEN the system SHALL display a checklist of all active (non-deleted) datasets, grouped by category.
2. WHEN an admin checks a category header THEN the system SHALL select/deselect all datasets within that category.
3. WHEN access grants are saved THEN the system SHALL write to the `lead_dataset_access` junction table with `lead_id`, `dataset_id`, and `granted_at` timestamp.
4. WHEN a dataset is soft-deleted (REQ-005) THEN the system SHALL automatically revoke any existing access grants for that dataset.
5. WHEN an admin views a lead detail page THEN the system SHALL display a count of currently granted datasets alongside the full grant list.

---

### REQ-007: Lead Authentication via Supabase Magic Link

**User Story:** As an approved lead, I want to log in securely using a magic link sent to my email, so that I don't need to manage a password.

**Priority:** P0
**Dependencies:** REQ-004 (lead must be approved), Supabase Auth configuration

#### Acceptance Criteria

1. WHEN an approved lead receives their approval notification email THEN the email SHALL contain a magic link that signs them into the portal.
2. WHEN a lead navigates to `/portal/login` THEN the system SHALL display an email input and "Send Magic Link" button.
3. WHEN a lead submits their email THEN the system SHALL call Supabase Auth `signInWithOtp` to send a magic link to that email address.
4. IF the email does not match any approved lead THEN the system SHALL still show a generic "check your email" message (no information leakage about which emails exist).
5. WHEN the lead clicks the magic link THEN the system SHALL authenticate them via Supabase Auth, set a session, and redirect to `/portal`.
6. IF the lead's status is not `approved` THEN the system SHALL display a message indicating their request is still under review or was not approved, and SHALL NOT grant portal access.
7. WHEN a lead's Supabase Auth session expires THEN the system SHALL redirect them to `/portal/login` on next navigation.

---

### REQ-008: Lead Portal Dashboard

**User Story:** As an approved lead, I want to see a dashboard after logging in that summarizes my available datasets and any updates, so that I can quickly navigate to what matters.

**Priority:** P1
**Dependencies:** REQ-007, REQ-006

#### Acceptance Criteria

1. WHEN an authenticated lead navigates to `/portal` THEN the system SHALL display a welcome message with their name and company.
2. WHEN the dashboard loads THEN the system SHALL display summary stats: total datasets available, categories available, and most recently added datasets.
3. WHEN the dashboard loads THEN the system SHALL display a "Browse Catalog" CTA linking to `/portal/catalog` and a "Can't find what you need?" CTA linking to `/portal/request`.
4. IF the lead has no datasets granted THEN the system SHALL display a message indicating their access is being configured and to check back soon.
5. WHEN an unauthenticated user navigates to any `/portal/*` route THEN the system SHALL redirect to `/portal/login`.

---

### REQ-009: Lead Dataset Browsing — Filterable Catalog

**User Story:** As an approved lead, I want to browse the datasets I've been granted access to with filtering and search, so that I can find relevant training data efficiently.

**Priority:** P0
**Dependencies:** REQ-006, REQ-008

#### Acceptance Criteria

1. WHEN an authenticated lead navigates to `/portal/catalog` THEN the system SHALL display only datasets the lead has been granted access to (via `lead_dataset_access` join).
2. WHEN the catalog loads THEN datasets SHALL be displayed as a grid of cards showing: thumbnail, name, category, subcategory, type badge, and a brief metadata summary.
3. WHEN a lead selects a category filter THEN the catalog SHALL update to show only datasets in that category.
4. WHEN a lead selects a type filter (Short Form / Long Form) THEN the catalog SHALL update accordingly.
5. WHEN a lead types in the search input THEN the catalog SHALL filter by dataset name or subcategory (debounced 300ms).
6. WHEN a lead clicks a dataset card THEN the system SHALL navigate to `/portal/catalog/[id]` (REQ-010).
7. IF the lead tries to access a dataset they haven't been granted THEN the system SHALL return a 403 and display an access denied message.

---

### REQ-010: Lead Dataset Detail View

**User Story:** As an approved lead, I want to view detailed information about a dataset including video samples, technical specs, and metadata, so that I can evaluate the data for my use case.

**Priority:** P0
**Dependencies:** REQ-009

#### Acceptance Criteria

1. WHEN an authenticated lead navigates to `/portal/catalog/[id]` for a granted dataset THEN the system SHALL display the dataset name, category breadcrumb, subcategory, type, and annotation ID.
2. WHEN the detail page loads THEN the system SHALL render an inline video player (HTML5 `<video>` with controls) for the `video_sample_url`, with poster set to `thumbnail_url`.
3. WHEN the detail page loads THEN the system SHALL display technical specs in a structured table: resolution, duration, frame rate, file format, file size (parsed from `metadata_json`).
4. WHEN the detail page loads AND `metadata_json` is present THEN the system SHALL render the raw metadata in a collapsible code block with syntax highlighting (JetBrains Mono font, terminal style).
5. WHEN a lead clicks "Download Sample" THEN the system SHALL generate a time-limited signed URL from Supabase Storage and initiate the download.
6. IF the dataset has no video sample uploaded THEN the system SHALL display a placeholder with a "Sample coming soon" message.
7. WHEN the lead navigates back THEN the system SHALL return to `/portal/catalog` with their previous filter state preserved (via URL search params).

---

### REQ-011: Lead Custom Request Flow

**User Story:** As an approved lead, I want to submit a custom data request if I can't find what I need and book a call with the Claru team, so that I can get tailored datasets for my project.

**Priority:** P1
**Dependencies:** REQ-008

**Note:** This is a simple CTA + form on the portal for leads who don't see the data they need — not a complex ticketing system.

#### Acceptance Criteria

1. WHEN an authenticated lead navigates to `/portal/request` THEN the system SHALL display a simple form with fields: description of data needed (required, textarea), preferred modality (select: Video, Image, Text, Robotics, Other), and any additional notes (optional).
2. WHEN the lead submits the form THEN the system SHALL insert a row into a `custom_requests` table in Supabase with the lead's ID and form data, and send a notification email to the admin.
3. WHEN the form submission succeeds THEN the system SHALL display a confirmation message ("We'll get back to you within 24 hours").
4. WHEN the page loads THEN the system SHALL display a "Book a Call" CTA that links to an external scheduling tool (URL configurable via the admin Settings page at `/admin/settings`).
5. WHEN the page loads THEN the system SHALL display links to relevant case studies (using existing `src/lib/case-studies.ts`).

---

### REQ-012: Email Notifications

**User Story:** As a Claru admin, I want to be notified when a new access request comes in, and as a lead, I want to be notified when my request is approved, so that neither party has to manually check for updates.

**Priority:** P1
**Dependencies:** REQ-002, REQ-004, Supabase or external email provider

#### Acceptance Criteria

1. WHEN a new lead submits an access request (REQ-002) THEN the system SHALL send an email notification to `team@claru.ai` (the admin notification address) containing the lead's name, company, email, and a link to `/admin/leads/[id]`.
2. WHEN an admin approves a lead (REQ-004) THEN the system SHALL send an email to the lead's email address containing: a confirmation of approval, a magic link to sign into the portal, and a summary of how many datasets they've been granted access to.
3. WHEN an admin rejects a lead THEN the system SHALL send an email to the lead with a generic message thanking them for their interest (no rejection reason exposed unless admin opts in).
4. IF email delivery fails THEN the system SHALL log the failure and not block the admin action — the status update SHALL still persist.
5. WHEN emails are sent THEN they SHALL use a consistent Claru-branded template with the **dark terminal aesthetic**: dark background (`#0a0908`), sage green accents (`#92B090`), JetBrains Mono font for code/monospace elements, matching the site's design system. Email templates are previewable via the admin Settings page (REQ-016).

---

### REQ-013: Security — RLS, Auth Guards, and Admin Routes

**User Story:** As a Claru engineer, I want all data access to be secured at the database level and route level, so that leads can only see their own granted data and admin routes are protected.

**Priority:** P0
**Dependencies:** All previous requirements

#### Acceptance Criteria

1. WHEN Supabase RLS is enabled on the `leads` table THEN only the service role SHALL be able to read/write all rows, and authenticated leads SHALL only be able to read their own row.
2. WHEN Supabase RLS is enabled on the `datasets` table THEN authenticated leads SHALL only be able to read datasets that have a corresponding row in `lead_dataset_access` for their user ID.
3. WHEN Supabase RLS is enabled on the `lead_dataset_access` table THEN authenticated leads SHALL only be able to read their own access grants.
4. WHEN Supabase RLS is enabled on the `custom_requests` table THEN authenticated leads SHALL only be able to read/write their own requests.
5. WHEN any `/admin/*` route is accessed THEN the system SHALL verify the admin JWT token via the existing `getAdminSession` utility from `src/lib/admin-auth.ts` and redirect unauthenticated users to the admin login page.
6. WHEN any `/portal/*` route is accessed (except `/portal/login`) THEN the system SHALL verify the Supabase Auth session and redirect unauthenticated users to `/portal/login`.
7. WHEN Supabase Storage buckets are configured THEN the `catalog-thumbnails` bucket SHALL be publicly readable (for the public landing page), and the `catalog-samples` bucket SHALL require authenticated access with signed URLs.
8. IF a lead's status is changed from `approved` to `rejected` THEN the system SHALL invalidate their portal access on next request by checking lead status during session validation.

---

### REQ-014: Database Schema Design

**User Story:** As a Claru engineer, I want a well-structured Postgres schema in Supabase that supports all catalog portal features with proper relations and indexes, so that the application is performant and maintainable.

**Priority:** P0
**Dependencies:** Supabase project setup

> **Canonical Schema:** The design document (`docs/data-catalog-design.md`, Section 4) is the authoritative source for the database schema. The tables and column definitions below are a summary — always refer to the design doc for the exact column names, types, and constraints.

#### Acceptance Criteria

1. WHEN the schema is created THEN there SHALL be a `dataset_categories` table, a `datasets` table, a `dataset_samples` table, a `leads` table, a `lead_dataset_access` junction table, and a `custom_requests` table — all matching the design doc Section 4.1 schema exactly.
2. WHEN the schema is created THEN the `leads` table SHALL use column names from the design doc: `name` (not `full_name`), `modalities_of_interest` (text[]), `category_ids_of_interest` (uuid[]), `supabase_user_id` (not `auth_user_id`), etc.
3. WHEN the schema is created THEN the `datasets` table SHALL use `category_id` (FK to `dataset_categories`), `modality`, `is_archived` (boolean soft-delete, not `deleted_at`), `is_public` — matching the design doc schema, not the flat `category`/`subcategory`/`type` pattern.
4. WHEN the schema is created THEN there SHALL be a `custom_requests` table with columns: `id` (UUID, PK), `lead_id` (UUID, FK to leads.id, not null), `description` (text, not null), `modality` (text, nullable), `notes` (text, nullable), `created_at` (timestamptz, default now()).
5. WHEN the schema is created THEN there SHALL be indexes as defined in the design doc Section 4.3.
6. WHEN any row in `leads` or `datasets` is updated THEN a database trigger SHALL automatically set `updated_at` to `now()`.

---

### REQ-015: Supabase Storage Bucket Design

**User Story:** As a Claru engineer, I want clearly defined storage buckets with appropriate access policies, so that dataset files are organized and secured correctly.

**Priority:** P0
**Dependencies:** Supabase project setup

#### Acceptance Criteria

1. WHEN Supabase Storage is configured THEN there SHALL be a `catalog-thumbnails` bucket with public read access and restricted write access (service role only). No max file size limit.
2. WHEN Supabase Storage is configured THEN there SHALL be a `catalog-samples` bucket with private access (signed URLs only for reads) and restricted write access (service role only). No max file size limit.
3. WHEN files are uploaded to either bucket THEN the file path SHALL follow the pattern `{category}/{dataset_id}/{filename}` for organizational clarity.
4. WHEN a signed URL is generated for a sample download (REQ-010) THEN the URL SHALL expire after 1 hour.
5. WHEN a dataset is soft-deleted (REQ-005) THEN the associated storage files SHALL be retained for 30 days before permanent cleanup (to support undo scenarios).

---

### REQ-016: Admin Settings Page

**User Story:** As a Claru admin, I want a Settings page where I can configure the call booking URL and preview email templates, so that I can manage portal settings without code changes.

**Priority:** P1
**Dependencies:** REQ-005, REQ-012

#### Acceptance Criteria

1. WHEN an authenticated admin navigates to `/admin/settings` THEN the system SHALL display a settings page with the following sections: Call Booking URL configuration, and Email Template Preview.
2. WHEN an admin enters or updates the call booking URL THEN the system SHALL persist the URL (e.g., in a `settings` table in Supabase or an env var) and it SHALL be used by the portal custom request page (REQ-011 AC-4) for the "Book a Call" CTA.
3. WHEN the settings page loads THEN it SHALL display a sidebar or tabbed navigation within the admin layout, accessible from the admin nav alongside Leads and Catalog.
4. IF the user is not authenticated as admin THEN the system SHALL redirect to the admin login page.

---

### REQ-017: Email Template Preview in Admin

**User Story:** As a Claru admin, I want to preview all email templates with their dark terminal styling and copy the raw HTML, so that I can verify email appearance before they are sent to leads.

**Priority:** P1
**Dependencies:** REQ-012, REQ-016

#### Acceptance Criteria

1. WHEN an admin navigates to the Email Template Preview section on `/admin/settings` THEN the system SHALL display a list of all email templates: Admin Notification (new request), Lead Approved, Lead Rejected, and New Datasets Granted.
2. WHEN an admin selects an email template THEN the system SHALL render a live preview of the email with sample data, using the dark terminal aesthetic: dark background (`#0a0908`), sage green accents (`#92B090`), JetBrains Mono font for monospace elements.
3. WHEN an admin clicks "Copy HTML" on a template preview THEN the system SHALL copy the full HTML source of the email template to the clipboard.
4. WHEN the preview is displayed THEN it SHALL accurately represent how the email will appear in email clients, including the dark background, accent colors, and monospace font stack.
