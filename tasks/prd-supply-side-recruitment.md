# PRD: Supply-Side Recruitment System

## Introduction

Add a supply-side recruitment section to the Claru landing site (Next.js) that attracts data annotators and domain experts to apply via app.claru.ai, while simultaneously boosting SEO domain authority through a programmatic job board with hundreds of optimized pages. The system has four components: a `/work-with-us` hub page, a `/jobs` programmatic job board with RSS feed, an automated scraping agent that populates listings weekly, and an `/admin` portal for managing job listings.

## Goals

- Attract qualified data annotators, domain experts, and quality reviewers to apply at app.claru.ai/signup
- Generate 50+ SEO-optimized job pages at launch with JobPosting schema for Google Jobs visibility
- Create a backlink flywheel: job boards (Indeed DA~92, LinkedIn DA~99) link back to claru.ai domain
- Establish hub-and-spoke internal linking between supply pages (/work-with-us, /jobs) and demand pages (/data, /labeling, /pillars)
- Target high-value keywords: "AI annotation jobs", "RLHF annotator jobs", "data labeling jobs remote"
- Match existing ASCII/terminal visual aesthetic with GSAP + Framer Motion animations

## Agent & Skill Assignments

Each user story specifies which agents and skills to invoke. Here is the full roster:

| Agent/Skill | Used For |
|---|---|
| `nextjs-expert` agent | Next.js pages, API routes, middleware, static generation, RSS |
| `frontend-expert` agent | UI components, responsive design, animations, GSAP integration |
| `code-reviewer` agent | Post-implementation review after EVERY user story + build verification |
| `Shadcn UI Designer` agent | Admin portal UI components (tables, forms, dialogs) |
| `web-research-specialist` agent | SEO keyword validation, competitor page analysis |
| `python-backend-expert` agent | Scraping agent script with Playwright + Claude SDK |
| `direct-response-copy` skill | Persuasive copy for /work-with-us hero, Why Claru, CTAs |
| `transformational-landing-pages` skill | /work-with-us page structure and section flow |
| `seo-content` skill | AEO-optimized FAQ content, answer blocks, meta descriptions |
| `on-page` skill | On-page SEO audit of completed pages |
| `favicon-meta` skill | Open Graph, Twitter cards, structured data meta tags |
| `frontend-testing` skill | Vitest unit tests for components |
| `webapp-testing` skill | Playwright E2E test creation |
| `brand-voice` skill | Consistent voice across supply-side copy |
| `agent-browser` skill | Browser automation for scraping agent development |
| `commit` skill | Commit after each completed + reviewed user story |

### Post-Story Completion Protocol

After EVERY user story is implemented, the following MUST happen in order:

1. **Build verification:** Run `npm run build` — must pass with zero errors
2. **Typecheck:** Run `npx tsc --noEmit` — must pass
3. **Lint:** Run `npm run lint` — must pass
4. **Code Review:** Launch `code-reviewer` agent to review all changed files
5. **Browser verification** (UI stories only): Verify in browser using Playwright or dev tools
6. **Commit:** Only after all checks pass, commit with descriptive message (with user confirmation)

## User Stories

### US-001: Create /work-with-us hub page layout and hero
**Description:** As a potential annotator visiting the site, I want to immediately understand what Claru offers and how to apply so that I can decide if this opportunity is right for me.

**Agents/Skills:** `transformational-landing-pages` skill (page structure), `direct-response-copy` skill (hero copy), `nextjs-expert` agent (page setup), `frontend-expert` agent (animations)

**Acceptance Criteria:**
- [ ] Page lives at `/work-with-us` with proper metadata (title: "Work With Claru | AI Annotation Jobs & Expert Data Labeling", description targeting "AI annotation jobs remote")
- [ ] Hero section with headline, subheadline, and primary CTA linking to `https://app.claru.ai/signup`
- [ ] Uses shared Header and Footer components
- [ ] ASCII/terminal aesthetic matches existing site (dark theme, green accents, monospace)
- [ ] TextScramble effect on main heading
- [ ] FadeIn scroll animations on sections
- [ ] Responsive: renders correctly on mobile, tablet, and desktop
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test metadata generation, CTA link targets, responsive breakpoints
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-002: Work categories and domain expert segmentation sections
**Description:** As a potential annotator, I want to see what types of work are available and which expert domains Claru needs so that I can assess if my skills are a match.

**Agents/Skills:** `frontend-expert` agent (card components, animations), `brand-voice` skill (consistent descriptions)

**Acceptance Criteria:**
- [ ] Work categories section with 4 cards: Data Labeling, Quality Review, Video Capture, Gaming (matching app.claru.ai categories)
- [ ] Each card has icon, title, short description, and "Apply" link to app.claru.ai/signup
- [ ] Domain expert segmentation section showing specialized areas: RLHF & Preference Ranking, Video Annotation, Red Teaming & Safety, Robotics & Manipulation, Vision-Language Evaluation, Coding & STEM Review
- [ ] Cards use existing card patterns (hover lift, border glow)
- [ ] Section links to relevant /jobs listings via "Browse [category] roles →" links
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test card rendering, link generation per category, hover state classes
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-003: How it Works and Why Claru sections
**Description:** As a potential annotator, I want to understand the application process and why Claru is different from marketplace competitors so that I feel confident applying.

**Agents/Skills:** `direct-response-copy` skill (persuasive "Why Claru" copy, disqualification pattern), `frontend-expert` agent (step animations)

**Acceptance Criteria:**
- [ ] "How it Works" section with 3-4 numbered steps: Apply → Profile Review → Get Matched → Start Earning
- [ ] Steps use monospace numbering (01, 02, 03, 04) matching existing design patterns
- [ ] "Why Claru" section contrasting marketplace model vs embedded team model (not a task queue — a team)
- [ ] Bottom CTA: "Apply Now" linking to app.claru.ai/signup
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test step rendering, CTA link targets
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-004: FAQ section with AEO optimization and schema markup
**Description:** As a search engine or AI system, I need structured FAQ content so that Claru pages can appear in featured snippets and People Also Ask boxes.

**Agents/Skills:** `seo-content` skill (AEO-optimized FAQ content), `nextjs-expert` agent (JSON-LD schema injection), `on-page` skill (SEO audit after implementation)

**Acceptance Criteria:**
- [ ] FAQ section with 6-8 questions targeting real search queries: "Is data annotation work legitimate?", "How much do AI annotators make?", "Do I need experience?", "What is RLHF?", "How does Claru pay annotators?", "Can I work remotely?"
- [ ] Uses existing FAQItem component (collapsible accordion)
- [ ] FAQPage JSON-LD schema markup injected in page head
- [ ] Answer-first content: each answer starts with a direct statement before elaboration
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test FAQ schema generation, accordion toggle state, answer content rendering
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-005: Internal linking architecture between supply and demand pages
**Description:** As an SEO system, I need proper hub-and-spoke internal linking so that authority flows between supply pages (/work-with-us, /jobs) and demand pages (/data, /labeling, /pillars).

**Agents/Skills:** `on-page` skill (internal link audit), `seo-content` skill (anchor text optimization)

**Acceptance Criteria:**
- [ ] /work-with-us links to /jobs listing page
- [ ] /work-with-us links to relevant /pillars pages (e.g., "Our annotators power expert annotation for frontier labs" → /pillars/enrich/expert-annotation)
- [ ] /work-with-us links to /data and /labeling pages with context (e.g., "See how our data is used")
- [ ] Footer updated with "Work With Us" link
- [ ] Breadcrumb-style navigation on supply-side pages
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test link generation, breadcrumb rendering
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-006: Add "Work With Us" to site-wide navigation
**Description:** As a site visitor, I want to see a "Work With Us" link in the main navigation so that annotator recruitment is discoverable from any page.

**Agents/Skills:** `frontend-expert` agent (header update, mobile menu)

**Acceptance Criteria:**
- [ ] "Work With Us" added to Header.tsx navLinks array: `{ href: "/work-with-us", label: "Work With Us" }`
- [ ] Appears in both desktop nav and mobile menu
- [ ] Nav order: Training Data, Expert Labeling, Work With Us, [Book a Call CTA]
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser (check both desktop and mobile)
- [ ] **Unit Tests:** Test nav link rendering, mobile menu inclusion
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-007: Job data schema and seed data generation
**Description:** As a developer, I need a structured job data format and utility functions so that the job board can load and display listings.

**Agents/Skills:** `nextjs-expert` agent (TypeScript interfaces, data utilities)

**Acceptance Criteria:**
- [ ] Job data TypeScript interface defined in `src/types/job.ts`:
  ```typescript
  interface Job {
    slug: string;
    title: string;
    category: 'data-labeling' | 'quality-review' | 'video-capture' | 'gaming' | 'rlhf' | 'red-teaming' | 'coding-review' | 'vision-annotation';
    description: string;
    skills: string[];
    compensationMin: number;
    compensationMax: number;
    employmentType: 'CONTRACTOR';
    locationType: 'TELECOMMUTE';
    locationRequirements?: string;
    datePosted: string;
    validThrough: string;
    featured: boolean;
    archived: boolean;
    faqs: { question: string; answer: string }[];
  }
  ```
- [ ] Compensation normalized to Claru ranges: Entry ($20-35/hr), Standard ($35-55/hr), Expert ($55-100/hr)
- [ ] Job data stored in `src/data/jobs/` directory as individual JSON files
- [ ] Utility functions in `src/lib/jobs.ts`: `getAllJobs(opts?: { includeArchived?: boolean })`, `getJobBySlug(slug)`, `getJobsByCategory(category)`
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test data loading functions, slug uniqueness, date validation, compensation range validation, archive filtering
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-008: Seed job content generation script
**Description:** As a developer, I need a script that generates 50 varied job listings from templates so that the job board launches with realistic content.

**Agents/Skills:** `nextjs-expert` agent (script authoring), `direct-response-copy` skill (job description templates — anti-AI-ness), `brand-voice` skill (consistent tone)

**Acceptance Criteria:**
- [ ] Script at `scripts/generate-seed-jobs.ts` (runnable with `npx tsx scripts/generate-seed-jobs.ts`)
- [ ] Uses templates per category with randomized variations in:
  - Title (e.g., "Senior RLHF Annotator - LLM Alignment", "RLHF Preference Evaluator - Conversational AI")
  - Description (3-4 paragraphs, answer-first format, no generic AI-ish intros)
  - Skills (drawn from relevant skill pools per category)
  - Compensation (within tier ranges)
  - datePosted (randomized across last 30 days)
- [ ] Each generated job has unique slug derived from title
- [ ] Output: 50 JSON files in `src/data/jobs/`
- [ ] No two jobs have identical titles or descriptions
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test template variation logic, slug generation, date randomization bounds
- [ ] **Code Review:** Run `code-reviewer` agent to verify content quality and anti-AI-ness
- [ ] **Commit** after review passes

### US-009: /jobs listing page with search and filtering
**Description:** As a potential annotator, I want to browse and search available positions so that I can find roles matching my skills.

**Agents/Skills:** `nextjs-expert` agent (page route, static generation), `frontend-expert` agent (search UI, grid layout, animations), `seo-content` skill (page metadata)

**Acceptance Criteria:**
- [ ] Page at `/jobs` with metadata (title: "AI Annotation Jobs | Remote Data Labeling Opportunities at Claru")
- [ ] Search input that filters jobs by keyword (title, skills, description)
- [ ] Category filter pills/tabs for: All, Data Labeling, Quality Review, Video Capture, Gaming, RLHF, Red Teaming, Coding Review, Vision Annotation
- [ ] Job count display: "Showing X of Y positions"
- [ ] Job cards in a grid layout displaying: title, category tag, up to 3 skills, compensation range, "Remote" badge, date posted, "Apply" button
- [ ] "Apply" button on each card links to `https://app.claru.ai/signup`
- [ ] Cards link to individual job page at `/jobs/[slug]`
- [ ] Pagination or "Load more" if >18 jobs displayed
- [ ] Uses shared Header/Footer, matches ASCII aesthetic
- [ ] TextScramble on page heading
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test search filtering logic, category filter state, job count calculation, pagination logic
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-010: Individual job detail page with SEO schema and About Claru sidebar
**Description:** As a potential annotator, I want to view full job details on a dedicated page so that I can understand the role before applying. As a search engine, I need JobPosting structured data to surface this in Google Jobs.

**Agents/Skills:** `nextjs-expert` agent (dynamic route, generateStaticParams, JSON-LD), `frontend-expert` agent (layout, sidebar, animations), `favicon-meta` skill (OG tags, Twitter cards), `seo-content` skill (answer block, meta), `on-page` skill (SEO audit)

**Acceptance Criteria:**
- [ ] Dynamic route at `/jobs/[slug]` using generateStaticParams for static generation
- [ ] Page displays: full title, category, description (rendered markdown), skills list, compensation range, location type, date posted
- [ ] Prominent "Apply Now" CTA button linking to `https://app.claru.ai/signup`
- [ ] **"About Claru" sidebar section** on desktop (collapses below content on mobile):
  - Claru logo (small)
  - 2-3 sentence company description: who we are, what we do, why we're different
  - Key stats if available (e.g., "Working with frontier AI labs")
  - Links: "Learn more" → /, "All positions" → /jobs, "Our services" → /data
- [ ] **"Share this job" button** with options for: Copy link, LinkedIn, Twitter/X, Email
  - Copy link: copies `/jobs/[slug]` URL to clipboard with toast "Link copied"
  - LinkedIn: opens LinkedIn share dialog with job title + URL
  - Twitter/X: opens tweet composer with "Check out this role at Claru: [title] [url]"
  - Email: opens mailto with subject "[title] at Claru" and body with job URL
- [ ] JobPosting JSON-LD schema in page head with all required fields:
  - title, description, datePosted, validThrough, employmentType
  - hiringOrganization (Claru, sameAs: https://claru.ai)
  - jobLocationType: TELECOMMUTE
  - baseSalary with min/max hourly rate
- [ ] FAQ section specific to job category (reusable across same-category jobs)
- [ ] "Related positions" section showing 3-4 jobs from same category
- [ ] Internal link to relevant demand-side page (e.g., RLHF job links to /pillars/enrich/rlhf)
- [ ] Answer block near top: 2-3 sentence summary of the role (AEO-ready)
- [ ] Open Graph and Twitter meta tags for social sharing (title, description, image)
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test schema generation, generateStaticParams, related jobs logic, share button actions (clipboard, URL generation), meta tags, About Claru rendering
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-011: RSS feed for job listings
**Description:** As a job board aggregator or RSS reader, I need an RSS feed of Claru's job listings so that new positions are automatically syndicated to job boards and increase backlink generation.

**Agents/Skills:** `nextjs-expert` agent (RSS route handler), `seo-content` skill (feed metadata)

**Acceptance Criteria:**
- [ ] RSS 2.0 feed available at `/jobs/feed.xml` (Next.js route handler)
- [ ] Feed includes: channel title ("Claru AI Jobs"), link, description, language
- [ ] Each job is an `<item>` with: title, link (`/jobs/[slug]`), description (first 200 chars), pubDate (datePosted), category, guid (slug)
- [ ] Feed auto-discovers via `<link rel="alternate" type="application/rss+xml">` in /jobs page head
- [ ] Feed only includes active (non-archived) jobs
- [ ] Feed sorted by datePosted descending (newest first)
- [ ] Feed validates against W3C Feed Validator
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test feed XML generation, item count matches active jobs, date sorting, archived job exclusion
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-012: Job scraping agent - Claude Agent SDK with tool use
**Description:** As a system operator, I need an autonomous agent built with the Claude Agent SDK that scrapes micro1.ai/jobs, adapts listings to Claru positions, and saves them — so the job board stays fresh with minimal human intervention.

**Agents/Skills:** `nextjs-expert` agent (script authoring), `agent-browser` skill (Playwright tool development), `brand-voice` skill (system prompt for consistent rewritten descriptions)

**Acceptance Criteria:**
- [ ] Agent entry point at `scripts/job-agent.ts` using `@anthropic-ai/claude-agent-sdk`
- [ ] Agent is initialized with a system prompt defining its role: "You are Claru's job board curator. Your job is to find AI annotation job postings, adapt them into Claru positions, and save them."
- [ ] Agent has the following tools defined:
  - `scrape_job_board` — Uses Playwright to navigate micro1.ai/jobs, scroll to load listings (infinite scroll), and extract raw job data (title, skills, compensation, job type). Returns array of raw job objects.
  - `check_duplicate` — Takes a job title + category, compares against existing jobs in `src/data/jobs/` using title similarity (Levenshtein or fuzzy match) + category match. Returns boolean.
  - `save_job` — Takes a complete Job object (matching the Job interface), validates schema, writes JSON file to `src/data/jobs/[slug].json`. Returns success/failure.
  - `list_existing_jobs` — Reads all current job slugs and titles from `src/data/jobs/` for dedup context. Returns array of {slug, title, category}.
  - `get_claru_categories` — Returns the valid Claru category list and compensation tier ranges for the agent to reference.
- [ ] Agent autonomously orchestrates: list existing → scrape board → for each scraped job: check duplicate → if new: rewrite as Claru position → save
- [ ] Agent rewrites each job with these constraints (in system prompt):
  - Title must be a Claru annotation position (not a copy of the source)
  - Description must be answer-first, AEO-ready, follow anti-AI-ness rules (no generic intros, specific outcomes, real constraints)
  - Skills mapped to Claru's domain areas
  - Category assigned from valid Claru categories
  - Compensation normalized to Claru tiers: Entry ($20-35/hr), Standard ($35-55/hr), Expert ($55-100/hr)
  - datePosted set to current date, validThrough to 3 months out
  - Generate 2-3 category-relevant FAQs per job
- [ ] Agent logs a structured summary after completion: jobs scraped, duplicates skipped, new jobs saved, any errors
- [ ] Runnable locally: `npx tsx scripts/job-agent.ts`
- [ ] Agent gracefully handles errors (site down, rate limits, malformed data) without crashing
- [ ] Max budget: configurable token limit per run to prevent runaway costs (default: 100k tokens)
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] **Unit Tests:** Test each tool function independently: scrape extraction, dedup logic, save validation, category mapping, compensation normalization
- [ ] **Code Review:** Run `code-reviewer` agent — verify tool definitions, error handling, token budget enforcement, rate limiting
- [ ] **Commit** after review passes

### US-013: GitHub Action for weekly job scraping
**Description:** As a system operator, I need the scraping agent to run automatically on a weekly schedule so that the job board stays fresh without manual intervention.

**Agents/Skills:** `nextjs-expert` agent (GitHub Actions YAML)

**Acceptance Criteria:**
- [ ] GitHub Action workflow at `.github/workflows/scrape-jobs.yml`
- [ ] Runs on weekly cron schedule (every Monday at 6am UTC)
- [ ] Also triggerable manually via workflow_dispatch
- [ ] Steps: checkout → install deps → install Playwright browsers → run job agent (`npx tsx scripts/job-agent.ts`) → commit new job files → push to branch → create PR
- [ ] Requires ANTHROPIC_API_KEY secret in GitHub repo settings
- [ ] PR title: "chore: add new job listings [automated]"
- [ ] PR includes summary of new jobs added
- [ ] Does NOT auto-merge — requires human review
- [ ] Typecheck/lint passes
- [ ] **Code Review:** Run `code-reviewer` agent to verify workflow security (secrets handling, branch protection)
- [ ] **Commit** after review passes

### US-014: Admin authentication with protected route
**Description:** As a Claru team member, I need a login page at `/admin` so that only authorized users can access the job management portal.

**Agents/Skills:** `nextjs-expert` agent (API route, middleware, JWT auth), `Shadcn UI Designer` agent (login form UI)

**Acceptance Criteria:**
- [ ] `/admin` route renders a login form with email and password fields
- [ ] Login form styled in ASCII/terminal aesthetic (monospace, dark theme, green accent input borders)
- [ ] Credentials validated against environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD` (set via `.env.local`)
- [ ] Authentication handled via Next.js API route (`/api/admin/login`) that sets an httpOnly cookie/JWT
- [ ] On successful login, redirect to `/admin/jobs`
- [ ] On failed login, show inline error: "Invalid credentials"
- [ ] All `/admin/*` routes protected by middleware — redirect to `/admin` login if no valid session
- [ ] Session persists across page refreshes (cookie-based, 24hr expiry)
- [ ] Logout button clears session and redirects to `/admin`
- [ ] `/admin` pages excluded from sitemap and have `noindex` meta tag
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test auth API route (valid creds, invalid creds, missing fields), middleware redirect logic, session expiry
- [ ] **Code Review:** Run `code-reviewer` agent — verify credentials are NEVER hardcoded, only read from env vars
- [ ] **Commit** after review passes

### US-015: Admin job listing dashboard
**Description:** As a Claru team member, I want to see all job listings in a sortable table so that I can manage the job board content.

**Agents/Skills:** `Shadcn UI Designer` agent (data table, badges, search), `nextjs-expert` agent (data loading, protected route)

**Acceptance Criteria:**
- [ ] Dashboard page at `/admin/jobs` (protected route)
- [ ] Table displays all jobs with columns: Title, Category, Compensation, Date Posted, Status (Active/Archived), Actions
- [ ] Table sortable by any column header click
- [ ] Search/filter input to find jobs by title or category
- [ ] Status badge: green "Active" or gray "Archived"
- [ ] Job count summary at top: "X active, Y archived, Z total"
- [ ] Uses terminal aesthetic (monospace table, dark theme, subtle borders)
- [ ] Responsive: table scrolls horizontally on mobile
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test table sorting logic, search filtering, status badge rendering, job count calculation
- [ ] **Code Review:** Run `code-reviewer` agent on all changed files
- [ ] **Commit** after review passes

### US-016: Archive and unarchive jobs from admin
**Description:** As a Claru team member, I want to archive jobs so they stop appearing on the public job board, and unarchive them to bring them back.

**Agents/Skills:** `nextjs-expert` agent (API route, file I/O), `Shadcn UI Designer` agent (confirmation dialog, toast)

**Acceptance Criteria:**
- [ ] Each job row has an "Archive" button (for active jobs) or "Unarchive" button (for archived jobs)
- [ ] Clicking "Archive" sets job status to archived — job no longer appears on public `/jobs` page or individual `/jobs/[slug]` page
- [ ] Clicking "Unarchive" sets job status back to active — job reappears on public pages
- [ ] Archive/unarchive action calls Next.js API route (`/api/admin/jobs/[slug]/archive`) that updates the job's JSON file
- [ ] `getAllJobs()` utility filters by archived status — public pages pass `includeArchived: false`, admin passes `true`
- [ ] Confirmation prompt before archiving: "Archive [job title]? It will be hidden from the public job board."
- [ ] Toast/notification on success: "Job archived" / "Job restored"
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test archive API route, JSON file update, getAllJobs filtering, confirmation dialog state
- [ ] **Code Review:** Run `code-reviewer` agent — verify file write operations are safe and atomic
- [ ] **Commit** after review passes

### US-017: Edit job details from admin
**Description:** As a Claru team member, I want to edit a job's title, description, skills, and compensation so that I can correct or improve listings without regenerating them.

**Agents/Skills:** `Shadcn UI Designer` agent (edit form, tag input, markdown preview), `nextjs-expert` agent (API route, file write), `frontend-expert` agent (markdown preview panel)

**Acceptance Criteria:**
- [ ] "Edit" button on each job row opens edit page at `/admin/jobs/[slug]/edit`
- [ ] Edit form pre-populated with current job data: title, category (dropdown), description (textarea with markdown preview), skills (tag input), compensationMin, compensationMax, locationRequirements
- [ ] Form validation: title required, compensationMin < compensationMax, at least 1 skill
- [ ] Save calls Next.js API route (`/api/admin/jobs/[slug]`) that writes updated data to the job's JSON file
- [ ] After save, redirect back to `/admin/jobs` with success toast: "Job updated"
- [ ] Cancel button returns to dashboard without saving
- [ ] Description textarea supports markdown with live preview panel (side-by-side on desktop, tabbed on mobile)
- [ ] Skills input: type to add, click X to remove, max 5 skills
- [ ] Slug is NOT editable (prevents URL breakage)
- [ ] `datePosted` is NOT editable, but `validThrough` is
- [ ] Terminal aesthetic on form: monospace inputs, green focus borders, dark background
- [ ] Typecheck/lint passes
- [ ] `npm run build` succeeds
- [ ] Verify in browser
- [ ] **Unit Tests:** Test form validation, API route file write, markdown preview rendering
- [ ] **Code Review:** Run `code-reviewer` agent — verify file I/O safety, input sanitization, no XSS in markdown
- [ ] **Commit** after review passes

### US-018: Playwright E2E Test - Job Board Browse and Apply Flow
**Description:** As QA, I need an end-to-end test verifying that a user can browse jobs, search, filter, view details, and reach the apply page.

**Agents/Skills:** `webapp-testing` skill (Playwright test creation)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/job-board.spec.ts`
- [ ] Test flow:
  1. Navigate to /jobs
  2. Verify job cards render with title, category, skills, compensation
  3. Type a search term, verify results filter
  4. Click a category filter, verify jobs filtered by category
  5. Click a job card, verify navigation to /jobs/[slug]
  6. On job detail page, verify title, description, skills, compensation display
  7. Verify "About Claru" sidebar renders with company info and links
  8. Verify "Share this job" button is present with Copy/LinkedIn/Twitter/Email options
  9. Verify JobPosting JSON-LD exists in page source
  10. Click "Apply Now" button, verify it links to app.claru.ai/signup
  11. Navigate to /work-with-us, verify hub page renders
  12. Verify internal links to /jobs exist and work
- [ ] Test includes assertions for all critical state transitions
- [ ] Test uses Page Object Model pattern for maintainability
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file
- [ ] **Commit** after review passes

### US-019: Playwright E2E Test - SEO Schema and RSS Validation
**Description:** As QA, I need an end-to-end test verifying that all job pages have valid structured data and the RSS feed is well-formed.

**Agents/Skills:** `webapp-testing` skill (Playwright test creation)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/job-seo.spec.ts`
- [ ] Test flow:
  1. Load /jobs, collect all job card links
  2. For a sample of 5 job pages, navigate and extract JSON-LD script tags
  3. Parse each JobPosting schema
  4. Assert required fields present: title, description, datePosted, validThrough, hiringOrganization, jobLocationType, baseSalary
  5. Assert hiringOrganization.name === "Claru"
  6. Assert jobLocationType === "TELECOMMUTE"
  7. Assert baseSalary values are within expected ranges
  8. Verify FAQPage schema exists on /work-with-us
  9. Fetch /jobs/feed.xml, verify valid RSS 2.0 XML
  10. Verify RSS feed item count matches active job count
  11. Verify RSS feed items have title, link, pubDate, guid
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file
- [ ] **Commit** after review passes

### US-020: Playwright E2E Test - Admin Portal Flow
**Description:** As QA, I need an end-to-end test verifying the admin login, dashboard, archive, and edit workflows.

**Agents/Skills:** `webapp-testing` skill (Playwright test creation)

**Acceptance Criteria:**
- [ ] Create Playwright test file `tests/e2e/admin-portal.spec.ts`
- [ ] Test flow:
  1. Navigate to /admin, verify login form renders
  2. Submit invalid credentials, verify error message
  3. Submit valid credentials (from env vars), verify redirect to /admin/jobs
  4. Verify job listing table renders with correct columns
  5. Search for a job by title, verify filter works
  6. Click "Archive" on a job, confirm dialog, verify status changes to "Archived"
  7. Click "Unarchive" on same job, verify status returns to "Active"
  8. Click "Edit" on a job, verify edit form pre-populated
  9. Change the job title, click Save, verify redirect to dashboard with updated title
  10. Click Logout, verify redirect to /admin login
  11. Try accessing /admin/jobs directly, verify redirect to login (session cleared)
- [ ] Test includes assertions for all critical state transitions
- [ ] Test uses Page Object Model pattern for maintainability
- [ ] Test runs successfully in CI environment
- [ ] Typecheck passes
- [ ] **Code Review:** Run `code-reviewer` agent on test file
- [ ] **Commit** after review passes

## Quality Assurance Requirements

Each user story must include:
1. **Build verification** — `npm run build` must pass with zero errors
2. **Type Safety** — `npx tsc --noEmit` must pass
3. **Lint** — `npm run lint` must pass
4. **Unit Tests (Vitest)** — Test core logic, validation, and edge cases
5. **Code Review** — Run `code-reviewer` agent after implementation to verify correctness
6. **Browser verification** (UI stories) — Visual check via Playwright or dev tools
7. **Commit** — Only after all above pass, with user confirmation

End-to-end tests (Playwright) are defined in US-018, US-019, and US-020 to verify complete user flows, SEO/RSS compliance, and admin portal functionality.

## Functional Requirements

- FR-1: `/work-with-us` page renders with hero, work categories, domain segmentation, how it works, why Claru, FAQ sections
- FR-2: All "Apply" CTAs across supply pages link to `https://app.claru.ai/signup` (no forms on this site)
- FR-3: `/jobs` page renders a searchable, filterable grid of job cards
- FR-4: `/jobs/[slug]` pages are statically generated with full job details and JobPosting JSON-LD schema
- FR-5: JobPosting schema includes all Google-required fields (title, description, datePosted, validThrough, hiringOrganization, jobLocationType, baseSalary)
- FR-6: FAQPage JSON-LD schema on /work-with-us page
- FR-7: Job data stored as JSON files in `src/data/jobs/`, loaded via utility functions
- FR-8: 50 seed job listings generated at launch covering all 8 categories with randomized posted dates
- FR-9: Compensation normalized to 3 tiers: Entry ($20-35/hr), Standard ($35-55/hr), Expert ($55-100/hr)
- FR-10: Claude Agent SDK agent autonomously crawls micro1.ai/jobs via tool use, adapts listings, deduplicates, and saves JSON files
- FR-11: GitHub Action runs scraping agent weekly, creates PR for human review
- FR-12: "Work With Us" link added to site-wide Header navigation
- FR-13: Hub-and-spoke internal linking: /work-with-us ↔ /jobs ↔ /pillars, /data, /labeling
- FR-14: All supply pages use shared Header/Footer and match ASCII/terminal visual aesthetic
- FR-15: Search on /jobs filters by keyword across title, skills, and description fields
- FR-16: Category filter on /jobs filters by job category with pill/tab UI
- FR-17: `/admin` login page authenticates against env vars (ADMIN_EMAIL, ADMIN_PASSWORD) via API route
- FR-18: All `/admin/*` routes protected by middleware — unauthenticated requests redirect to `/admin` login
- FR-19: `/admin/jobs` dashboard displays all jobs (active and archived) in a sortable, searchable table
- FR-20: Admin can archive a job (hides from public `/jobs` pages) and unarchive it (restores to public)
- FR-21: Admin can edit any job's title, description, skills, compensation, and validThrough date
- FR-22: Admin edits persist by writing updated JSON back to `src/data/jobs/[slug].json` via API route
- FR-23: Admin pages have `noindex` meta tag and are excluded from sitemap
- FR-24: RSS 2.0 feed at `/jobs/feed.xml` listing all active jobs, sorted by datePosted descending
- FR-25: RSS feed auto-discoverable via `<link rel="alternate">` tag on /jobs page
- FR-26: "Share this job" button on each job detail page with Copy link, LinkedIn, Twitter/X, Email options
- FR-27: "About Claru" sidebar section on job detail pages with company description, stats, and links

## Non-Goals

- No application form on the landing site — all apply flows redirect to app.claru.ai/signup
- No public-facing user accounts or logged-in states (admin portal is internal-only)
- No real-time job board connected to a database — static JSON files only
- No payment processing or compensation management
- No blog/content hub at launch (future phase)
- No scraping of sites other than micro1.ai at launch (extensible later)
- No Inngest integration at launch (future migration from GitHub Actions)
- No HubSpot or external CMS — everything built in Next.js

## Design Considerations

- **Visual aesthetic:** Must match existing site — dark bg (#050505), green accent (#00ff88), monospace fonts (JetBrains Mono), ASCII art elements
- **Existing components to reuse:** Header, Footer, Button, FadeIn, TextScramble, FAQItem, CapabilityCard patterns
- **New components needed:** JobCard, JobFilter, CategoryPills, CompensationBadge, RemoteBadge, ShareButton, AboutClaruSidebar, AdminTable, AdminJobForm, TagInput, MarkdownPreview
- **Animations:** GSAP ScrollTrigger for scroll-linked reveals, Framer Motion for component transitions, TextScramble on headings
- **Mobile-first:** Job cards stack to single column on mobile, filters collapse to dropdown, About Claru sidebar collapses below content

## Technical Considerations

- **Static generation:** Job pages use `generateStaticParams` reading from `src/data/jobs/*.json`
- **Build performance:** 50+ static pages at launch, growing to hundreds. Monitor build times.
- **Scraping agent dependencies:** `@anthropic-ai/claude-agent-sdk` (agent framework with tool use), Playwright (browser automation tool for the agent), `@anthropic-ai/sdk` (underlying API client)
- **Deduplication:** Agent compares new scrapes against existing job slugs and title similarity to avoid duplicates
- **Schema validation:** Use Google's Rich Results Test to validate JobPosting schema before launch
- **Incremental Static Regeneration:** Not needed initially (static rebuild on deploy), but consider if job volume exceeds 500+
- **Environment variables needed:** ANTHROPIC_API_KEY (for scraping agent), ADMIN_EMAIL and ADMIN_PASSWORD (for admin auth), JWT_SECRET (for session tokens)
- **Admin auth:** Simple cookie-based session with JWT. No database needed — single credential pair from env vars. 24hr session expiry.
- **Admin file writes:** API routes write JSON files to `src/data/jobs/`. In production (Vercel), file writes won't persist across deploys — consider a Vercel KV or simple SQLite fallback for production. For now, admin edits trigger a git commit + redeploy pattern via API.
- **RSS feed:** Generated as a Next.js route handler returning XML with proper Content-Type header

## Success Metrics

- 50+ job pages indexed by Google within 30 days of launch
- /work-with-us page ranks in top 50 for "AI annotation jobs" within 60 days
- Job pages appear in Google Jobs search results
- At least 10 applications per month routed to app.claru.ai/signup from landing site
- Job board backlink flywheel generates 5+ referring domains within 90 days (Indeed, LinkedIn, Glassdoor, etc.)
- RSS feed picked up by at least 2 job aggregators within 60 days
- No build failures from job data schema violations

## Open Questions

- What's the threshold for moving from GitHub Actions to Inngest for the scraping agent?
- Should we add additional scraping sources beyond micro1.ai (e.g., Outlier, DataAnnotation.tech)?
- For production admin edits, should we use Vercel KV or a git-commit-and-redeploy pattern?
