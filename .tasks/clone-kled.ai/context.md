# Kled.ai Dataset Catalog - Visual Reference

**URL:** https://www.kled.ai/datasets
**Captured at:** 1920x1080 desktop viewport
**Built with:** Framer

---

## Screenshots Captured

### Full Page
- `full-page-desktop.png` (1920x1080) - Complete page scroll

### Sections
- `section-01-header-hero.png` - Nav + announcement bar + page header + first cards visible
- `section-02-page-header.png` - "Dataset Catalog / Explore Kled's Full Data Library" heading, brand ticker, first cards
- `section-03-dataset-cards.png` - Full 2-column card grid (8 cards, page 1)
- `section-03-dataset-cards-loaded.png` - Same grid after 2s wait
- `section-04-pagination-cta.png` - Bottom of cards, pagination dots + "Contact Sales" CTA + footer top
- `section-05-footer.png` - Full footer with pagination, Contact Sales, footer links, bottom bar
- `section-pagination-page2.png` - Page 2 of dataset pagination (8 more datasets visible)

### Components
- `component-nav-default.png` - Full nav bar: logo left, nav links center, Support/Contact/Download App right
- `component-nav-hover.png` - "Datasets" link hover state (subtle bold/underline treatment)
- `component-card-hover-state.png` - **KEY**: Card hover reveals metadata row "Exclusive Rights to 18,000 Episodes of Video"; image area collapses, text area expands
- `component-nav-top.png` - Additional nav capture

---

## Layout & Design Analysis

### Overall Page Structure
- Light gray/off-white background (`#f5f5f5` approximate)
- Narrow centered content column (~850px wide), generous left whitespace
- Page structured as: announcement bar → nav → page header → brand ticker → 2-col card grid → pagination → Contact Sales → footer

### Navigation Bar
- Logo: "~ KLED" wordmark (tilde wave prefix, all-caps) — top left
- Center links: Products | Datasets | Stories | Blog | Careers
- Right side: Support (text link) | Contact (text link) | "Download App" (outlined button, rounded, dark navy text)
- Announcement bar above nav: thin light strip with bullet "Kled's $5.5M Seed Round" + "Learn More" underline link
- Nav background: white/transparent, no border

### Page Header Section
- Small eyebrow label: "Dataset Catalog" (small, muted blue-gray, with short horizontal rule above)
- H1: "Explore Kled's Full Data Library" (large, dark navy, ~32-36px)
- Subtitle: 2-line description paragraph (muted gray, ~14-15px)
- Below heading: animated horizontal ticker strip of brand logos (Popeye, Garfield, Tom & Jerry, Bugs Bunny, Pink Panther, Robin Hood, mpt, etc.) — ghosted/gray, slowly scrolling

### Dataset Card Grid
- 2 columns, equal width, ~400px each
- Cards have: light gray background, rounded corners (~12px), subtle shadow/border
- Card default state:
  - Top-left: small gear/settings icon (muted)
  - Top-right: badge pill — "RAW" or "LABELED" (light gray pill, small caps text)
  - Upper half: image/visual area (mostly empty/ghost in screenshots — likely Framer lazy-load or intentional minimal design)
  - Lower section: dataset title (dark navy, ~16px medium weight) + 2-line description (muted gray, ~13px)
- Card hover state (IMPORTANT):
  - Image area collapses entirely
  - Metadata row appears at bottom: "Exclusive Rights  to  [quantity in accent]  of  [data type]"
  - Quantity is formatted with distinct weight (e.g., "18,000 Episodes" or "50M Records" bold)
  - Data type shown as final word (Video / Text / Videos)
  - Card gets slight border highlight or shadow on hover

### Pagination
- Centered below cards
- Left arrow (disabled on page 1) | numbered dots (current page larger with dot indicator) | right arrow
- Page numbers: 1 through 11 total pages (88 datasets total at 8 per page)
- Current page dot is filled; others are small empty dots

### Contact Sales CTA
- Right-aligned text link: "Contact Sales" with arrow-in-box icon
- Positioned below pagination, right-justified
- Minimal, text-only treatment — no button border

### App Download Banner
- Fixed floating widget bottom-right: "Download the Kled App / Get paid for your data." with arrow icon
- Dark background pill/card, white text

### Footer
- Dark section separator: footer sits on light bg with faint noise texture / dot-grid pattern in background
- Left: "~ KLED" logo + "The Leading Data Marketplace." tagline
- Right columns: Company | Useful Links | Socials | Support
- Bottom bar: "A Nitrility Inc. Company" + social icons row + "Kled AI © 2026"

---

## Dataset Inventory (Page 1 — 8 datasets)

| Name | Type | Scale |
|------|------|-------|
| Classic Animation Archive | RAW | Exclusive Rights to 18,000 Episodes of Video |
| Global Wildlife Footage Corpus | RAW | Exclusive Rights to 2,500 Hours of Videos |
| De-Identified U.S. Medical Records Corpus | RAW | Exclusive Rights to 50M Records of Text |
| Feature Film Master Reels | RAW | Exclusive Rights to 40,000 Hours of Videos |
| Hospital Radiology Report Dataset | LABELED | Exclusive Rights to 12M Reports of Text |
| National Claims & Billing Records Dataset | RAW | Exclusive Rights to 200M Entries of Text |
| Studio Documentary Knowledge Set | RAW | Exclusive Rights to 1,800 Hours of Videos |
| Academic Research Paper Corpus | RAW | Exclusive Rights to 8M Documents of Text |

## Dataset Inventory (Page 2 — 8 datasets)

| Name | Type | Scale |
|------|------|-------|
| Medical Device Instruction Dataset | — | 200K Documents of Text |
| Hospital Discharge Summary Corpus | — | 25M Summaries of Text |
| Culinary Instruction Footage | — | 800 Hours of Video |
| Global Legal Contracts & Agreements Collection | — | 4M Documents of Text |
| Government Policy & Regulatory Dataset | RAW | 3M Documents |
| Vintage Television Archive | RAW | 9,000 Episodes of Video |
| Cultural Dance Performance Footage | RAW | 300 Hours |
| National Public Court Transcript Corpus | RAW | 6M Transcripts |

---

## Animations Observed

- **Brand ticker**: Continuous horizontal marquee/scroll of IP brand logos (ghosted gray). Appears to loop infinitely left.
- **Card hover**: On mouse-enter, card expands vertically, image region fades/collapses, metadata row slides in at bottom. Clean ease transition (~200-300ms).
- **Nav link hover**: Subtle text weight change or opacity shift on hover — no underline decoration visible.
- **Page transitions**: None observed (Framer site, all content on single URL).

---

## Color Palette

| Role | Value (approximate) |
|------|---------------------|
| Page background | `#f2f2f0` (warm off-white) |
| Card background | `#ebebea` (slightly darker off-white) |
| Text primary | `#1a1f3a` (dark navy) |
| Text secondary | `#8a8fa8` (muted blue-gray) |
| Badge/pill | `#e0e0df` bg, `#8a8fa8` text |
| Nav button | `#1a1f3a` border, `#1a1f3a` text |
| Footer bg | `#f0f0ee` with dot-grid texture |

## Typography

- Font: clean sans-serif (likely Inter or similar system font via Framer)
- H1 page title: ~32px, weight 600, dark navy
- Card title: ~16px, weight 500, dark navy
- Card description: ~13px, weight 400, muted gray
- Badge text: ~11px, weight 500, uppercase
- Nav links: ~14px, weight 400, dark navy
