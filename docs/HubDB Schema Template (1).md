# **Sample HubDB Schema Template**

SEO \+ AEO Programmatic Pages

Table name: `seo_aeo_pages`  
 Primary key: `slug`  
 Row \= one published page

### Core Page Identity

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `slug` | Text | Yes | URL slug (no leading slash). Used as unique identifier. |
| `page_title` | Text | Yes | Page title shown on page (H1 if you want simple mapping). |
| `meta_title` | Text | Yes | SEO title (50–60 chars). |
| `meta_description` | Text | Yes | SEO description (140–160 chars). |
| `canonical_url` | Text | No | Optional canonical if needed. |

SEO \+ AEO Structure

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `h1` | Text | Yes | Main H1 (can equal page\_title or differ). |
| `answer_block` | Rich text | Yes | **AEO-critical**. Short, direct answer near top of page. |
| `intro_text` | Rich text | No | Optional intro (keep short, non-generic). |
| `body_content` | Rich text | Yes | Main content body (H2/H3 structure). |
| `definitions` | Rich text | No | Clear definitions section (AEO extraction). |
| `faqs` | Rich text or JSON | Yes | FAQs aligned to real questions (AEO). |

**Tip:** If you want maximum control, use JSON for FAQs and loop them in the template.

### Internal Linking & Clusters

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `pillar_slug` | Text | Yes | Slug of the pillar page this belongs to. |
| `cluster_name` | Text | Yes | Human-readable cluster name (e.g. “Engineering Hiring”). |
| `internal_links` | Rich text | Yes | Pre-formatted internal links to related pages. |
| `related_pages` | Text (comma-separated) | No | Slugs of sibling pages (optional automation). |

### CTA & Conversion

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `primary_cta_text` | Text | Yes | CTA copy |
| `primary_cta_url` | Text | Yes | CTA destination. |
| `secondary_cta_text` | Text | No | Optional secondary CTA. |
| `secondary_cta_url` | Text | No | Optional secondary CTA URL. |

### 

### Visual & UX Hooks

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `visual_suggestions` | Text | No | Notes for diagrams, tables, or illustrations. |
| `table_data` | Rich text or JSON | No | Optional structured data for tables. |

### Governance & Quality Control

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `citations_needed` | Boolean | Yes | Flags pages with \[CITE\] markers. |
| `citation_notes` | Text | No | What sources are required. |
| `review_status` | Dropdown | Yes | Draft / Reviewed / Approved / Published. |
| `last_reviewed` | Date | No | Editorial hygiene. |

### Optional (Advanced / Nice to Have)

| Column Name | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| `role` | Text | No | Role (Engineering, Product, etc.). |
| `location` | Text | No | Location (used for Role × Location pages). |
| `schema_type` | Text | No | FAQPage, HowTo, Article, etc. |
| `noindex` | Boolean | No | Emergency control. |

## 

## How This Maps to a HubSpot Page Template

In your **HubSpot CMS template**, you’ll typically:

* Use `slug` as the dynamic page URL

* Bind:

  * `<title>` → `meta_title`  
  * `<meta description>` → `meta_description`

* Render:

  * H1 → `h1`  
  * Answer block → `answer_block` (near top)  
  * Main body → `body_content`  
  * Definitions → `definitions`  
  * FAQs → loop over `faqs`

* Inject:

  * Internal links → `internal_links`  
  * CTA modules → `primary_cta_*`

This lets you:

* Update hundreds of pages by editing rows  
* Refresh content without touching templates  
* Keep SEO and AEO structure consistent

## Why This Schema Works at Scale

* **AEO-ready by default** (answer block \+ FAQs \+ definitions)  
* **SEO-safe** (unique meta fields, internal linking)  
* **Programmatic-friendly** (role, location, cluster fields)  
* **Editorially controllable** (review status, citations)  
