# PRD: Admin Lead Management — Manual CRUD with Invite Controls

## Introduction

The admin leads portal (`/admin/leads`) currently only displays leads and allows status changes (approve/reject). Leads are created indirectly — someone submits the public contact form, an email goes to `contact@claru.ai`, and then an admin manually inserts a row into Supabase. There is no admin UI for creating, editing, or deleting leads, and magic link invites are generated on approval but never actually emailed to the lead.

This feature adds full CRUD capabilities to the admin leads portal and gives admins explicit control over when (and whether) invite emails are sent.

## Goals

- Allow admins to create new leads directly from the admin portal without touching the database
- Allow admins to edit all lead fields (name, email, company, role, data_needs, use_case) from the detail page
- Allow admins to delete leads with full cleanup (lead record, dataset grants, Supabase Auth user)
- Give admins explicit invite control: "Approve & Send Invite" vs "Approve Only" on approval, plus a "Re-send Invite" action for already-approved leads
- Send branded invite emails via Resend with the magic link for portal access
- Maintain backward compatibility with the existing approval flow and portal auth callback

## User Stories

### US-001: Create lead API endpoint
**Description:** As an admin, I need a backend endpoint to create new leads so the portal can add leads without direct database access.

**Acceptance Criteria:**
- [ ] Create `POST /api/admin/leads` route at `src/app/api/admin/leads/route.ts`
- [ ] Accept request body: `{ name, email, company, role, data_needs, use_case, admin_notes }` — `name` and `email` required, rest optional
- [ ] Validate email format server-side
- [ ] Insert into Supabase `leads` table with status `pending`
- [ ] Return 409 with clear message if email already exists (UNIQUE constraint)
- [ ] Return 201 with the created lead object on success
- [ ] Admin token verification required (same pattern as other admin routes)
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test required field validation, email format validation, duplicate email handling, successful creation response shape
- [ ] **Code Review:** Run code-reviewer agent to verify API contract, error handling, and auth verification

### US-002: Delete lead API endpoint with full cleanup
**Description:** As an admin, I need a backend endpoint to delete leads that also cleans up related data (dataset grants and Supabase Auth user) so there are no orphaned records.

**Acceptance Criteria:**
- [ ] Add `DELETE` handler to `src/app/api/admin/leads/[id]/route.ts`
- [ ] Delete all rows from `lead_dataset_access` where `lead_id` matches
- [ ] If lead has `supabase_user_id`, delete the Supabase Auth user via `supabase.auth.admin.deleteUser()`
- [ ] Delete the lead row from `leads` table
- [ ] Return 200 with `{ message: "Lead deleted" }` on success
- [ ] Return 404 if lead not found
- [ ] If Auth user deletion fails (user already gone), log warning but continue with lead deletion — don't block on orphaned auth state
- [ ] Admin token verification required
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test deletion order (grants → auth user → lead), 404 handling, graceful auth deletion failure, response shape
- [ ] **Code Review:** Run code-reviewer agent to verify cascade logic and error recovery

### US-003: Update PATCH endpoint to accept all lead fields
**Description:** As an admin, I need the existing PATCH endpoint to accept all editable lead fields so the edit form can save changes.

**Acceptance Criteria:**
- [ ] Update `PATCH /api/admin/leads/[id]` to accept: `name`, `email`, `company`, `role`, `data_needs`, `use_case`, `admin_notes`, `status`
- [ ] Validate that `name` is non-empty string if provided
- [ ] Validate email format if provided
- [ ] Handle email uniqueness conflict — return 409 if new email already belongs to another lead
- [ ] Only include provided fields in the Supabase update (don't null out omitted fields)
- [ ] Return updated lead object
- [ ] Admin token verification required
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test partial updates (single field), email uniqueness conflict, empty name rejection, field omission behavior
- [ ] **Code Review:** Run code-reviewer agent to verify update logic and validation

### US-004: Branded invite email template and send function
**Description:** As an admin, I need a reusable email function that sends a branded magic link invite to a lead via Resend so leads receive professional portal access emails.

**Acceptance Criteria:**
- [ ] Create `src/lib/email/invite.ts` with `sendInviteEmail({ to, name, magicLink })` function
- [ ] Use Resend SDK (`resend.emails.send()`) with `RESEND_API_KEY` env var
- [ ] From address: use `RESEND_FROM_EMAIL` env var with fallback to `noreply@claru.ai`
- [ ] Subject line: `"Your Claru Data Portal Access"`
- [ ] HTML template with Claru branding: dark background (#050505), accent green (#00ff88), font-mono styling, terminal aesthetic
- [ ] Email body includes: personalized greeting with lead's name, brief welcome message explaining they've been granted access, prominent "Access Portal" button with the magic link, note that the link expires in 24 hours, contact info for support
- [ ] Plain text fallback version included
- [ ] Function returns `{ success: boolean, error?: string }` — never throws
- [ ] If Resend API key is not configured, return `{ success: false, error: "Email not configured" }` without throwing
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test template rendering with various name/link inputs, missing API key handling, Resend error handling, return shape on success and failure
- [ ] **Code Review:** Run code-reviewer agent to verify email template accessibility, Resend integration patterns, and error handling

### US-005: Approve with invite option
**Description:** As an admin, I want to choose between "Approve & Send Invite" and "Approve Only" when approving a lead, so I control exactly when the lead receives their portal access email.

**Acceptance Criteria:**
- [ ] Update `POST /api/admin/leads/[id]/approve` to accept optional `{ send_invite: boolean }` in request body (default: `false` for backward compatibility)
- [ ] When `send_invite` is true: after creating auth user and generating magic link, call `sendInviteEmail()` with the lead's email, name, and magic link URL
- [ ] Return invite status in response: `{ lead, invite_sent: boolean, invite_error?: string }`
- [ ] If email sending fails, the approval itself still succeeds — lead is approved, invite just wasn't sent
- [ ] Existing approval flow (without `send_invite`) continues to work unchanged
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test approval with send_invite=true (email called), send_invite=false (email not called), send_invite omitted (backward compat), email failure doesn't block approval
- [ ] **Code Review:** Run code-reviewer agent to verify backward compatibility and error isolation

### US-006: Re-send invite API endpoint
**Description:** As an admin, I need to re-send the magic link invite to an already-approved lead in case they lost the original email or it expired.

**Acceptance Criteria:**
- [ ] Create `POST /api/admin/leads/[id]/invite` route at `src/app/api/admin/leads/[id]/invite/route.ts`
- [ ] Only works for leads with status `approved` — return 400 if lead is not approved
- [ ] Generate a fresh magic link via `supabase.auth.admin.generateLink()` (links expire, so re-generation is necessary)
- [ ] Call `sendInviteEmail()` with the fresh magic link
- [ ] Return `{ success: boolean, error?: string }`
- [ ] If lead doesn't have a `supabase_user_id` yet (edge case: approved but auth user creation failed previously), create the auth user first, then generate the link
- [ ] Admin token verification required
- [ ] Typecheck passes
- [ ] **Unit Tests:** Test re-send for approved lead, rejection for non-approved lead, fresh link generation, auth user recovery for edge case
- [ ] **Code Review:** Run code-reviewer agent to verify magic link generation and edge case handling

### US-007: Create lead slide-over panel on leads list page
**Description:** As an admin, I want a slide-over panel on the leads list page where I can quickly create a new lead without leaving the list.

**Acceptance Criteria:**
- [ ] Add `[+ new lead]` button to the top-right area of `AdminLeadsTable` (next to the search input)
- [ ] Button styled with terminal aesthetic: `text-xs font-mono`, accent green on hover, bracket notation `[+ new lead]`
- [ ] Clicking opens a slide-over panel from the right (same pattern as `SampleEditPanel` in the catalog)
- [ ] Panel contains form fields: Name (required), Email (required), Company, Role, Data Needs (textarea), Use Case (textarea), Admin Notes (textarea)
- [ ] Form validates required fields client-side before submission
- [ ] Email field validates format client-side
- [ ] Submit button: `[create lead]`, disabled while submitting, shows loading state
- [ ] On success: close panel, show success toast, refresh the leads list (router.refresh())
- [ ] On 409 conflict: show error toast "A lead with this email already exists"
- [ ] On other errors: show error toast with message
- [ ] Panel has close button and Escape key to dismiss
- [ ] Convert `src/app/admin/leads/page.tsx` from server component to client component that fetches leads (or add a client wrapper) to support the interactive panel
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test form validation (required fields, email format), submit handler, error state rendering, panel open/close state
- [ ] **Code Review:** Run code-reviewer agent to verify form patterns, accessibility, and design system compliance

### US-008: Edit mode on lead detail page
**Description:** As an admin, I want an edit mode toggle on the lead detail page so I can update any lead field (name, email, company, role, data needs, use case) and save changes.

**Acceptance Criteria:**
- [ ] Add `[edit]` button to the lead info card header in `LeadDetailClient.tsx`
- [ ] Clicking `[edit]` switches the entire info card from read-only display to editable form inputs
- [ ] Editable fields: name, email, company, role, data_needs (textarea), use_case (textarea)
- [ ] Non-editable fields remain displayed: id, created_at, updated_at, supabase_user_id, status (status has its own controls)
- [ ] Form inputs use existing design system: `bg-[var(--bg-secondary)]`, `border-[var(--border-subtle)]`, `font-mono`, `text-sm`
- [ ] Two buttons in edit mode: `[save]` (accent green) and `[cancel]` (muted)
- [ ] Cancel reverts all fields to original values and exits edit mode
- [ ] Save calls `PATCH /api/admin/leads/[id]` with only changed fields (diff detection)
- [ ] On success: exit edit mode, update displayed data, show success toast
- [ ] On 409 (email conflict): show error toast "Email already in use by another lead", stay in edit mode
- [ ] On validation error: show inline error messages on the relevant fields
- [ ] Admin notes section remains separately editable (it already has its own save button)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test edit mode toggle, diff detection (only changed fields sent), cancel revert behavior, error handling per field
- [ ] **Code Review:** Run code-reviewer agent to verify form state management and design system compliance

### US-009: Delete lead with confirmation on detail page
**Description:** As an admin, I want a delete button on the lead detail page that removes the lead and all associated data after confirmation.

**Acceptance Criteria:**
- [ ] Add `[delete lead]` button to the lead detail page, styled with red/error color: `text-[var(--error)]` on hover
- [ ] Position in the action buttons area, visually separated from approve/reject (e.g., at the bottom of the page or in a "Danger Zone" section)
- [ ] Clicking shows a confirmation dialog: "Delete {lead.name}? This will permanently remove this lead, their portal access, and all dataset grants. This cannot be undone."
- [ ] Confirmation requires typing the lead's email to proceed (prevents accidental deletion)
- [ ] On confirm: call `DELETE /api/admin/leads/[id]`
- [ ] On success: show success toast, redirect to `/admin/leads` list
- [ ] On error: show error toast with message, stay on page
- [ ] If lead is approved (has auth user), confirmation text mentions "This will also revoke their portal login"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test confirmation dialog display, email match validation, API call on confirm, redirect on success, error handling
- [ ] **Code Review:** Run code-reviewer agent to verify UX safety patterns and cleanup completeness

### US-010: Invite controls on lead detail page
**Description:** As an admin, I want invite-related controls on the lead detail page so I can approve with invite, or re-send invites to already-approved leads.

**Acceptance Criteria:**
- [ ] Modify the existing "Approve" button to show a dropdown/split action with two options: `[approve & send invite]` and `[approve only]`
- [ ] `[approve & send invite]` calls POST approve with `{ send_invite: true }`
- [ ] `[approve only]` calls POST approve with `{ send_invite: false }` (current behavior)
- [ ] After approval succeeds, if invite was sent: toast shows "Lead approved and invite sent to {email}"
- [ ] After approval succeeds, if invite was not sent: toast shows "Lead approved (no invite sent)"
- [ ] After approval succeeds, if invite sending failed: toast shows "Lead approved but invite failed: {error}" in warning style
- [ ] For already-approved leads: show `[re-send invite]` button
- [ ] `[re-send invite]` calls POST `/api/admin/leads/[id]/invite`
- [ ] On invite success: toast shows "Invite sent to {email}"
- [ ] On invite failure: toast shows error message
- [ ] `[re-send invite]` button shows loading spinner while sending
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill
- [ ] **Unit Tests:** Test split button rendering for pending vs approved leads, API calls with correct send_invite values, toast messages for all outcomes
- [ ] **Code Review:** Run code-reviewer agent to verify UX flow and error messaging

### US-011: Playwright E2E — Create, Edit, Delete Lead Flow
**Description:** As QA, I need an end-to-end test verifying the complete lead CRUD lifecycle.

**Acceptance Criteria:**
- [ ] Navigate to `/admin/leads` (authenticate first if needed — pause for manual auth)
- [ ] Test create flow:
  1. Click `[+ new lead]` button
  2. Verify slide-over panel opens with empty form
  3. Try submitting empty form — verify validation errors appear
  4. Fill in: name "Test User", email "test-e2e@example.com", company "Test Corp"
  5. Submit form
  6. Verify success toast appears
  7. Verify new lead appears in the leads table
- [ ] Test edit flow:
  1. Click `[view]` on the newly created lead
  2. Click `[edit]` on the detail page
  3. Verify fields become editable
  4. Change company to "Updated Corp"
  5. Click `[save]`
  6. Verify success toast and updated value displayed
- [ ] Test delete flow:
  1. Click `[delete lead]` button
  2. Verify confirmation dialog appears with lead name
  3. Type the lead's email in confirmation input
  4. Confirm deletion
  5. Verify redirect to `/admin/leads`
  6. Verify lead no longer appears in the table
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent to verify test coverage and assertions

### US-012: Playwright E2E — Approve with Invite and Re-send Flow
**Description:** As QA, I need an end-to-end test verifying the invite sending workflow.

**Acceptance Criteria:**
- [ ] Create a test lead (via API or UI)
- [ ] Navigate to the lead's detail page
- [ ] Test approve with invite:
  1. Click approve dropdown
  2. Select `[approve & send invite]`
  3. Verify lead status changes to "Approved"
  4. Verify toast mentions invite was sent (or failed if no Resend key in test env)
- [ ] Test re-send invite:
  1. Verify `[re-send invite]` button appears for the approved lead
  2. Click `[re-send invite]`
  3. Verify loading state on button
  4. Verify toast with result
- [ ] Clean up: delete the test lead
- [ ] Typecheck passes
- [ ] **Code Review:** Run code-reviewer agent to verify test assertions and cleanup

## Quality Assurance Requirements

Each user story must include:
1. **Unit Tests (Vitest)** - Test core logic, validation, and edge cases
2. **Code Review** - Run code-reviewer agent after implementation to verify correctness
3. **Type Safety** - All code must pass TypeScript strict mode

End-to-end tests (Playwright) are defined in US-011 and US-012 to verify complete user flows.

## Functional Requirements

- FR-1: `POST /api/admin/leads` creates a new lead with status `pending`. Requires `name` and `email`. Returns 409 on duplicate email.
- FR-2: `DELETE /api/admin/leads/[id]` removes the lead, all `lead_dataset_access` rows, and the Supabase Auth user (if exists). Returns 404 if lead not found.
- FR-3: `PATCH /api/admin/leads/[id]` accepts all editable fields: `name`, `email`, `company`, `role`, `data_needs`, `use_case`, `admin_notes`, `status`. Only updates provided fields. Returns 409 on email conflict.
- FR-4: `POST /api/admin/leads/[id]/approve` accepts optional `send_invite` boolean. When true, sends branded invite email after approval. Email failure does not block approval.
- FR-5: `POST /api/admin/leads/[id]/invite` generates a fresh magic link and sends invite email. Only works for approved leads (400 otherwise).
- FR-6: Invite emails use Resend API with branded HTML template (dark theme, terminal aesthetic, "Access Portal" CTA button). Include plain text fallback.
- FR-7: `[+ new lead]` button on leads list opens a slide-over creation form.
- FR-8: `[edit]` button on lead detail page toggles all info fields into editable mode with save/cancel.
- FR-9: `[delete lead]` button on lead detail page shows confirmation dialog requiring email input to confirm. Redirects to list on success.
- FR-10: Approve action presents two options: "Approve & Send Invite" and "Approve Only".
- FR-11: `[re-send invite]` button appears on detail page for approved leads.

## Non-Goals (Out of Scope)

- No bulk import/create of leads (CSV upload, etc.)
- No bulk delete or bulk status change
- No email delivery tracking (open rates, click tracking)
- No automated lead creation from the public contact form (remains email-only notification)
- No lead assignment to specific admin users
- No audit log of all actions taken on a lead
- No custom email template editor — template is hardcoded
- No scheduling of invite sends (send later)

## Design Considerations

- **Slide-over panel:** Follow the existing `SampleEditPanel` pattern from the catalog module — right-side slide-over with dark bg, border-left accent, close button
- **Edit mode toggle:** Similar to how `SampleEditPanel` switches between display and edit for metadata — single `[edit]` button flips the card, `[save]`/`[cancel]` to commit or revert
- **Delete confirmation:** Use a modal with text input confirmation (type email to confirm) — pattern used by GitHub/Vercel for destructive actions
- **Split approve button:** Can be a dropdown menu or two side-by-side buttons. Dropdown is cleaner but two buttons is more discoverable. Recommend dropdown with chevron indicator.
- **Terminal aesthetic:** All new UI follows existing patterns — `font-mono`, bracket notation for actions `[action]`, CSS variable colors, dark backgrounds
- **Toast notifications:** Use the existing toast system in `LeadDetailClient` for all feedback

## Technical Considerations

- **Resend SDK:** Already in the project for contact form. Reuse the same API key and pattern. Import from `resend` package.
- **Magic link generation:** `supabase.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo } })` — already working in the approve endpoint. Links expire after 24 hours (Supabase default).
- **Auth user deletion:** `supabase.auth.admin.deleteUser(userId)` — requires the service role client. Must handle the case where auth user was already deleted or never existed.
- **Page conversion:** `src/app/admin/leads/page.tsx` is currently a server component that fetches leads. To support the interactive slide-over panel, either convert to a client component with `useEffect` data fetching, or create a client wrapper component that receives server-fetched data as props (preferred — keeps the fast server fetch).
- **Email fallback:** If `RESEND_API_KEY` is not set (development environments), `sendInviteEmail()` should return failure gracefully, not crash.
- **UNIQUE constraint handling:** Supabase returns error code `23505` for unique violations. Map this to a 409 response with a user-friendly message.

## Success Metrics

- Admin can create a new lead in under 30 seconds (open panel, fill required fields, submit)
- Admin can edit lead fields without leaving the detail page
- Admin can delete a lead with full cleanup in 2 clicks + confirmation
- Invite emails are delivered within 60 seconds of admin action
- Zero broken portal auth flows (existing approved leads continue to work)

## Open Questions

- Should we add an "Invited" or "invite_sent_at" field to the leads table to track whether an invite was sent? This would let admins see at a glance who has been invited vs just approved.
- Should the re-send invite button have a cooldown/rate limit to prevent accidental spam?
- Should deleting a lead with an active portal session also invalidate their session immediately?
