# Claru Pillar Pages: Architecture & Content Strategy Research

> Compiled research for creating SEO-optimized, LLM-discoverable subpages for the Four Pillars: **Acquire**, **Prepare**, **Enrich**, **Validate**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Recommended Architecture](#recommended-architecture)
3. [SEO Strategy](#seo-strategy)
4. [LLM Optimization](#llm-optimization)
5. [Pillar Page Content Guidelines](#pillar-page-content-guidelines)
   - [ACQUIRE - Data Acquisition](#acquire---data-acquisition)
   - [PREPARE - Data Preparation](#prepare---data-preparation)
   - [ENRICH - Data Annotation](#enrich---data-annotation)
   - [VALIDATE - Data Validation](#validate---data-validation)
6. [Technical Implementation](#technical-implementation)
7. [Schema Markup](#schema-markup)
8. [Conversion Optimization](#conversion-optimization)
9. [Keyword Strategy](#keyword-strategy)
10. [Industry Trends to Reference](#industry-trends-to-reference)

---

## Executive Summary

### The Opportunity

The AI training data market is at an inflection point:
- **AI-referred traffic surged 527%** between January and May 2025
- **Gartner projects traditional search will drop 25% by 2026** as users shift to AI assistants
- **77% of AI optimization comes from strong traditional SEO** - LLMs heavily cite content that already ranks

### Strategic Positioning

Claru's pillar pages should position as the **"Human Truth Anchor"** for AI data pipelines. The constraint on frontier AI is no longer bigger models—it's **better training data**. This creates demand for:

1. **Expert over generalist** annotation (PhD-level specialists vs. crowds)
2. **Temporal and physical intelligence** (video, robotics data)
3. **Synthetic data validation** (human QA layer)
4. **Iterative RLHF partnerships** (ongoing model improvement)

---

## Recommended Architecture

### URL Structure

```
claru.ai/
├── pillars/
│   ├── acquire/                 ← Pillar page (2,500+ words)
│   │   ├── egocentric-video/    ← Future cluster page
│   │   ├── synthetic-data/      ← Future cluster page
│   │   └── data-licensing/      ← Future cluster page
│   ├── prepare/
│   │   ├── deduplication/
│   │   ├── multimodal-alignment/
│   │   └── quality-scoring/
│   ├── enrich/
│   │   ├── rlhf/
│   │   ├── video-annotation/
│   │   └── expert-annotation/
│   └── validate/
│       ├── red-teaming/
│       ├── benchmark-curation/
│       └── bias-detection/
```

### Internal Linking Model

```
                    [Homepage]
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    [ACQUIRE]      [PREPARE]      [ENRICH]      [VALIDATE]
         │              │              │              │
    ┌────┼────┐    ┌────┼────┐   ┌────┼────┐   ┌────┼────┐
  [C1] [C2] [C3] [C1] [C2] [C3] [C1] [C2] [C3] [C1] [C2] [C3]
         └──────────────┼──────────────┘
              (Cross-pillar links where relevant)
```

**Linking Rules:**
- Each pillar links to ALL its cluster pages
- Every cluster links back to its parent pillar (mandatory)
- 1-3 horizontal links to sibling clusters within same pillar
- 1-2 cross-pillar links where contextually relevant
- All pages reachable within 3 clicks from homepage

### Page Hierarchy

| Page Type | Word Count | Target Keywords | Content Focus |
|-----------|------------|-----------------|---------------|
| **Pillar Page** | 2,500-3,500 | Head terms (competitive) | Broad overview, "what" and "why" |
| **Cluster Page** | 1,000-2,000 | Long-tail, specific intent | Deep dive, "how" for specific use cases |
| **Case Study** | 800-1,500 | Brand + problem keywords | Specific results, proof points |

---

## SEO Strategy

### On-Page Optimization

**Meta Title Formula:**
```
[Primary Keyword] for [Audience] | Claru
```
- Length: 50-60 characters (max 600 pixels)
- Primary keyword near beginning
- Include brand name

**Examples:**
- "AI Training Data Acquisition Services | Claru"
- "Expert Data Annotation for Frontier AI Labs | Claru"
- "ML Data Quality & Validation Services | Claru"

**Meta Description Formula:**
```
[Value proposition]. [Specific capability]. [CTA or differentiator].
```
- Length: 140-160 characters
- Include primary keyword naturally
- Use active voice

**Heading Hierarchy:**
```
H1: [Primary Keyword] - One per page
  H2: Major section headings
    H3: Subsections within H2
      H4: Detailed points (sparingly)
```

### Content Structure for Rankings

Pages with **H2 → H3 → bullet point structures** are 40% more likely to be cited by LLMs:

```html
<h2>Our Data Acquisition Capabilities</h2>

<h3>1. Human Data Collection</h3>
<ul>
  <li>Egocentric video capture at scale</li>
  <li>Expert annotators with domain credentials</li>
  <li>RLHF and preference ranking workflows</li>
</ul>

<h3>2. Web-Scale Data Harvesting</h3>
...
```

### E-E-A-T Signals (Critical for B2B)

**Experience & Expertise:**
- Team credentials (PhDs, domain specialists)
- Technical methodology transparency
- Conference publications or research contributions

**Authoritativeness:**
- Client logos (AI labs, Fortune 500)
- Case studies with measurable outcomes
- Industry partnership badges

**Trustworthiness:**
- Security certifications (SOC 2, ISO 27001)
- Clear data handling policies
- Contact information and company details

### Citation & Source Linking (CRITICAL)

**Every statistic, claim, or industry insight must include a clickable source link.**

This serves multiple purposes:
1. **Credibility**: Technical buyers verify claims
2. **SEO**: Outbound links to authoritative sources signal content quality
3. **LLM Training**: Citations help AI systems trace information provenance
4. **User Trust**: Readers can explore topics deeper

**Implementation Pattern:**
```tsx
<p>
  AI-referred traffic has surged{" "}
  <a href="https://example.com/source"
     target="_blank"
     rel="noopener noreferrer"
     className="text-[var(--accent-primary)] hover:underline">
    527% since January 2025
  </a>, making LLM optimization critical.
</p>
```

**Citation Style Guidelines:**
- Link the specific stat or claim, not generic "source" text
- Use `target="_blank"` for external links
- Include `rel="noopener noreferrer"` for security
- Style links with accent color for visibility
- For multiple sources on same claim, use superscript numbers: <sup>[1]</sup>
- Include a "Sources" section at page bottom for comprehensive reference list

---

## LLM Optimization

### Why This Matters

- AI search visitors convert at **4.4x the rate** of traditional organic search
- LLMs only cite **2-7 domains** per response—you must be in that window
- B2B companies with 80%+ AI visibility see **14% lift in inbound pipeline**

### The "Answer Capsule" Technique

This is the **strongest predictor** of LLM citation. Place a 20-25 word self-contained answer immediately after question-based H2 headings:

```html
<h2>What makes expert human data different from crowdsourced data?</h2>
<p><strong>Expert human data comes from domain specialists who provide
nuanced, context-aware feedback that crowdsourced annotators cannot match,
resulting in higher-quality AI training outcomes.</strong></p>

<!-- Then expand with supporting details -->
```

**Key findings:**
- Over 90% of cited answer capsules contain **no hyperlinks**
- Pages with original data tables receive **4.1x more citations**
- Content updated within **30 days** gets **3.2x more AI citations**

### Robots.txt Configuration

Allow AI crawlers to access your content:

```
# Allow AI Search and Citation Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Block sensitive directories
User-agent: *
Disallow: /api/
```

### FAQ Strategy

FAQ schema is **2x more common** in LLM-cited content than in traditional SERPs.

**Requirements:**
- 40-60 words per answer
- Grade 7-9 readability
- Direct answer in first sentence
- FAQPage schema markup required

**Recommended FAQs per pillar:**
- 3-5 questions addressing core buyer concerns
- Include questions about process, quality, security
- Weave throughout content (not just at end)

---

## Pillar Page Content Guidelines

### ACQUIRE - Data Acquisition

**URL:** `/pillars/acquire`

**Primary Keywords:**
- AI training data providers
- ML training datasets
- Custom dataset collection
- AI data sourcing

**Target Audience Pain Points:**
1. **Data Quality vs. Quantity Paradox** - Need high-quality data, not just volume
2. **Data Scarcity for Specialized Domains** - 44% can't adopt AI due to lacking relevant data
3. **Legal/Compliance Complexity** - GDPR, copyright, licensing concerns
4. **Speed to Production** - Time from data need to delivery is bottleneck

**Capabilities to Highlight:**

| Capability | Description | Differentiation |
|------------|-------------|-----------------|
| **Human Data Collection** | Egocentric video, physical world capture | Expert collectors, not crowdsourced |
| **Web-Scale Harvesting** | Adaptive scraping, API integration | Copyright-safe, licensed content |
| **Synthetic Generation** | Unreal Engine, AI model outputs | Human-validated synthetic data |
| **Data Licensing** | Negotiated content rights | Full provenance documentation |

**Terminology to Use:**
- Data curation, data sourcing, training data pipelines
- Human-in-the-loop (HITL), data quality assurance
- Multimodal data, domain-specialized data
- Frontier data, post-training data

**Page Structure:**
```
1. Hero: "Source the Impossible" - Value prop + key stat
2. Problem framing: The data acquisition challenge
3. Capabilities (4 cards matching above)
4. Process visualization: How we acquire data
5. Use cases: Video generation, robotics, multimodal
6. Quality assurance: Our vetting process
7. FAQ section (3-5 questions)
8. CTA: Start your data partnership
```

---

### PREPARE - Data Preparation

**URL:** `/pillars/prepare`

**Primary Keywords:**
- Data preprocessing services
- ML data preparation
- Dataset curation services
- Training data pipeline

**Target Audience Pain Points:**
1. **Deduplication at Scale** - "Biggest bottleneck of LLM training"
2. **Filtering Quality Tradeoffs** - Over-filtering vs. under-filtering
3. **Data-Model Alignment** - Matching data to downstream tasks
4. **80% Time Sink** - Data prep consumes most of ML project time

**Capabilities to Highlight:**

| Capability | Description | Scale Reference |
|------------|-------------|-----------------|
| **Deduplication** | Multi-level (document, paragraph, line) | Trillion-token processing |
| **Quality Filtering** | Configurable thresholds, semantic scoring | 10x-1000x data reduction |
| **Format Normalization** | Standardization, noise removal | Petabyte-scale ingestion |
| **Multimodal Alignment** | Video-text, image-audio pairing | Cross-modal synchronization |

**Terminology to Use:**
- MinHashLSH (deduplication algorithm)
- Data versioning, data lineage
- Golden set validation
- Inter-annotator agreement (IAA)
- Feature engineering, data transformation

**Technical Credibility Signals:**
- Reference specific algorithms (MinHashLSH, embedding models)
- Mention infrastructure (parallel file systems, GPU clusters)
- Include scale metrics (billions of tokens, terabytes processed)

**Page Structure:**
```
1. Hero: "Structure for Scale" - Time savings + quality promise
2. Problem: The data preparation bottleneck
3. Pipeline visualization: Ingest → Clean → Dedupe → Filter → Deliver
4. Scale proof points: Infrastructure and throughput
5. Quality framework: How we maintain accuracy at scale
6. Integration: MLOps compatibility
7. FAQ section
8. CTA: Transform your data pipeline
```

---

### ENRICH - Data Annotation

**URL:** `/pillars/enrich`

**Primary Keywords:**
- Data annotation services
- Expert data labeling
- RLHF data services
- AI training data labeling

**Target Audience Pain Points:**
1. **Quality vs. Speed Tradeoff** - 26% of AI failures trace to poor data quality
2. **Domain Expertise Gap** - Generic annotators miss nuance
3. **RLHF Complexity** - Preference data requires judgment
4. **Consistency at Scale** - Maintaining quality across large projects

**Capabilities to Highlight:**

| Service Type | Description | Differentiation |
|--------------|-------------|-----------------|
| **RLHF & Preference Data** | Human rankings, reward modeling | Expert judgment, not crowd voting |
| **Frame-Level Video** | Temporal segmentation, action recognition | Physics-aware annotation |
| **Expert Annotation** | STEM, medical, legal specialists | PhD-level domain knowledge |
| **Red Teaming** | Adversarial testing, jailbreak attempts | Safety-focused evaluation |

**Quality Metrics to Reference:**
- Inter-annotator agreement (IAA): >85% Cohen's Kappa target
- Accuracy vs. gold standard: 95-97%
- Krippendorff's Alpha: >0.80
- Rework rate: <5%

**Expert vs. Crowdsourced Positioning:**

| Factor | Expert Annotation | Crowdsourced |
|--------|------------------|--------------|
| Quality | 25% higher accuracy | Variable, heavy QA needed |
| Best For | Medical, legal, STEM, safety | Basic classification |
| Risk | Limited scalability | 26% of AI project failures |

**Page Structure:**
```
1. Hero: "Add Human Intelligence" - Expert positioning
2. The quality imperative: Why annotation quality compounds
3. Service categories (4 capability cards)
4. Modality coverage: Text, vision, video, audio, 3D
5. Quality framework: Multi-layer review process
6. Domain expertise: Specialist vertical showcase
7. FAQ section
8. CTA: Start a pilot project
```

---

### VALIDATE - Data Validation

**URL:** `/pillars/validate`

**Primary Keywords:**
- ML data quality assurance
- AI model validation
- Training data QA services
- Red teaming for AI

**Target Audience Pain Points:**
1. **Hidden Data Quality Issues** - Problems surface late in training
2. **Bias Detection** - Systematic errors hard to catch
3. **Safety Concerns** - Models need adversarial testing
4. **Benchmark Reliability** - Need trusted evaluation data

**Capabilities to Highlight:**

| Service | Description | Outcome |
|---------|-------------|---------|
| **Red Teaming** | Adversarial testing, jailbreak attempts | Safety vulnerability identification |
| **Benchmark Curation** | Golden datasets, evaluation sets | Trusted model assessment |
| **Bias Detection** | Systematic error analysis | Fairness and representation |
| **Post-Training Evaluation** | Performance testing | Production readiness |

**Terminology to Use:**
- Red teaming, adversarial testing
- Golden set, ground truth
- Annotation accuracy benchmarks
- Data drift monitoring
- Constitutional AI training
- Safety evaluation, alignment testing

**Trust Signals:**
- Methodology transparency
- Independent validation processes
- Documented bias assessment
- Audit trails

**Page Structure:**
```
1. Hero: "Ensure Quality & Safety" - Risk mitigation positioning
2. The validation imperative: Catching issues before training
3. Service categories (4 capability cards)
4. Red teaming deep dive: Our adversarial methodology
5. Quality metrics: How we measure and report
6. Compliance: Certifications and standards
7. FAQ section
8. CTA: Validate your data pipeline
```

---

## Technical Implementation

### Next.js File Structure

```
src/app/
├── pillars/
│   ├── layout.tsx              # Shared pillar layout
│   ├── [slug]/
│   │   └── page.tsx            # Dynamic pillar page
│   └── components/
│       ├── PillarHero.tsx
│       ├── CapabilityCard.tsx
│       ├── ProcessTimeline.tsx
│       └── PillarFAQ.tsx
├── lib/
│   └── pillars.ts              # Centralized pillar data
```

### Shared Pillar Data

```typescript
// src/app/lib/pillars.ts
export const pillars = {
  acquire: {
    id: "acquire",
    number: "01",
    title: "ACQUIRE",
    subtitle: "Source the Impossible",
    description: "Collect diverse, high-quality data at any scale.",
    capabilities: [...],
    faqs: [...],
    schema: {...}
  },
  // ... other pillars
};
```

### Metadata Pattern

```typescript
// src/app/pillars/[slug]/page.tsx
import { Metadata } from "next";
import { pillars } from "@/lib/pillars";

export async function generateStaticParams() {
  return Object.keys(pillars).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const pillar = pillars[params.slug];
  return {
    title: `${pillar.title} - ${pillar.subtitle}`,
    description: pillar.metaDescription,
    alternates: {
      canonical: `/pillars/${params.slug}`,
    },
  };
}
```

### Core Web Vitals

**LCP Optimization:**
- Use `priority` on hero images
- Server-side render critical content
- Preload fonts

**CLS Prevention:**
- Reserve space for dynamic content
- Use `aspect-ratio` for images
- Avoid layout shifts from animations

**INP Optimization:**
- Defer heavy effects with dynamic imports
- Use React transitions for non-urgent updates
- Minimize client-side JavaScript

---

## Schema Markup

### Organization Schema (Site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Claru",
  "url": "https://claru.ai",
  "logo": "https://claru.ai/logo.png",
  "description": "Expert Human Intelligence for AI Labs",
  "knowsAbout": [
    "AI Training Data",
    "RLHF",
    "Data Annotation",
    "Frontier AI Research"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "contact@claru.ai"
  }
}
```

### Service Schema (Per Pillar)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Data Acquisition Services",
  "serviceType": "AI Training Data Sourcing",
  "provider": {
    "@type": "Organization",
    "name": "Claru"
  },
  "description": "Expert human intelligence for sourcing diverse, high-quality AI training data",
  "areaServed": "Worldwide",
  "audience": {
    "@type": "Audience",
    "audienceType": "AI Research Labs, ML Teams"
  }
}
```

### FAQ Schema (Per Pillar)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What types of data can Claru acquire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Claru specializes in human data collection (egocentric video, physical world capture), web-scale data harvesting with proper licensing, and synthetic data generation using Unreal Engine and AI models."
      }
    }
  ]
}
```

### Breadcrumb Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@id": "https://claru.ai",
        "name": "Home"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@id": "https://claru.ai/pillars/acquire",
        "name": "Acquire"
      }
    }
  ]
}
```

---

## Conversion Optimization

### CTA Strategy

**Primary CTA per pillar:**
- ACQUIRE: "Start Your Data Partnership"
- PREPARE: "Transform Your Pipeline"
- ENRICH: "Start a Pilot Project"
- VALIDATE: "Validate Your Data"

**CTA Placement:**
1. Hero section (above fold)
2. After capabilities section (mid-page)
3. Final CTA section (bottom)
4. Sticky header CTA (optional)

**Copy Guidelines:**
| Avoid | Use Instead |
|-------|-------------|
| "Get Started" | "Schedule a Consultation" |
| "Contact Us" | "Talk to a Data Expert" |
| "Learn More" | "See Sample Projects" |

### Trust Elements

**Above the fold:**
- Client logos (4-6 recognizable brands)
- "Trusted by leading AI labs" tagline

**Near forms:**
- Security badges (SOC 2, ISO 27001)
- NDA availability mention
- Data handling assurance

**Mid-page:**
- Testimonial with name, title, company
- Specific metrics from case studies
- Team credentials

### Form Design

**Recommended fields:**
1. Name
2. Work Email
3. Company
4. Role
5. Project Type (dropdown)

**Best practices:**
- Use multi-step progressive form
- Include progress indicator
- Make qualifying questions optional
- Real-time validation
- Mobile-responsive design

---

## Keyword Strategy

### ACQUIRE Keywords

| Keyword | Intent | Priority |
|---------|--------|----------|
| AI training data providers | Commercial | High |
| Custom dataset collection | Transactional | High |
| ML training datasets | Commercial | Medium |
| Data licensing for AI | Informational | Medium |
| Egocentric video data | Commercial | Niche |

### PREPARE Keywords

| Keyword | Intent | Priority |
|---------|--------|----------|
| Data preprocessing services | Commercial | High |
| ML data preparation | Informational | High |
| Dataset curation services | Commercial | Medium |
| Data deduplication for LLMs | Informational | Niche |

### ENRICH Keywords

| Keyword | Intent | Priority |
|---------|--------|----------|
| Data annotation services | Transactional | High |
| RLHF data services | Commercial | High |
| Expert data labeling | Commercial | High |
| Video annotation services | Commercial | Medium |

### VALIDATE Keywords

| Keyword | Intent | Priority |
|---------|--------|----------|
| AI red teaming services | Commercial | High |
| ML data quality assurance | Commercial | Medium |
| Training data validation | Informational | Medium |
| Benchmark curation | Informational | Niche |

---

## Industry Trends to Reference

### Video Generation (2025-2026)

- Training requires **millions of video clips** (SkyReels used 10M+ clips)
- **Temporal consistency** is the biggest challenge
- **Physics understanding** requires specialized annotation
- Computing costs rose **89% from 2023-2025**

### Robotics & Embodied AI

- **China building 40+ robot data collection centers** with VR workers
- Open X-Embodiment Dataset: 1M+ real robot trajectories
- VCs invested **$7.2B in robotics in 2025** (up from $3.1B in 2023)
- Key data types: teleoperation demos, fine manipulation, sensor fusion

### Synthetic Data

- By 2028, **80% of AI training data will be synthetic**
- "Synthetic data scales human judgment; it does not replace it"
- Without human oversight, models learn to **imitate their own mistakes**
- Human verification remains **non-negotiable for high-stakes decisions**

### RLHF Evolution

- **RLTHF** achieves full alignment with only 6-7% of annotation effort
- xAI **pivoted from generalists to specialists** (10x increase in expert tutors)
- Meta invested **$15B for 49% stake in Scale AI** (June 2025)
- Expert annotators (radiologists, legal analysts) are **scarce** with rising wages

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Create `/pillars/` directory structure
- [ ] Extract pillar data to shared `lib/pillars.ts`
- [ ] Create base layout with consistent header/footer
- [ ] Implement metadata generation
- [ ] Add sitemap.ts and robots.ts

### Phase 2: Content (Week 2-4)
- [ ] Write ACQUIRE pillar page (2,500+ words)
- [ ] Write PREPARE pillar page
- [ ] Write ENRICH pillar page
- [ ] Write VALIDATE pillar page
- [ ] Add FAQ sections to each

### Phase 3: Optimization (Week 4-5)
- [ ] Implement JSON-LD schema for each page
- [ ] Add breadcrumb navigation
- [ ] Optimize images and Core Web Vitals
- [ ] Update internal linking from homepage
- [ ] Add pillar links to header/footer navigation

### Phase 4: Conversion (Week 5-6)
- [ ] Add client logos/trust signals
- [ ] Implement per-pillar CTAs
- [ ] Create pillar-specific contact forms (optional)
- [ ] Add testimonials/case study snippets
- [ ] A/B test CTA copy

---

## Implementation Lessons (From ACQUIRE Page Build)

> These lessons were learned during the initial ACQUIRE pillar page implementation. Apply them to all subsequent pillar pages.

### Page Structure & Flow (Direct Response Principles)

**Follow this conversion-optimized flow:**

1. **Hero** (Hook) - Punchy headline with specific outcome or transformation
2. **Problem Section** (Agitate) - Quantify pain, use short punchy sentences, create urgency
3. **Market Context** - Industry data, competitive landscape, why this matters now
4. **Proof/Case Studies** - Social proof BEFORE you pitch capabilities (critical placement)
5. **Capabilities** (Solution) - What you do, with specific details
6. **Process** - How it works (numbered steps)
7. **Use Cases** - Deep-dive into specific applications (expanded, not cards)
8. **FAQ** (Objection handling) - Substantive answers with inline citations
9. **CTA** - Clear call to action

**Key principle:** Case studies/proof must come BEFORE capabilities. You build trust first, then pitch. Don't bury proof at the bottom after the CTA.

### Content Depth Requirements

**Thin content kills credibility with technical buyers. Every section needs substance:**

#### Use Cases Section
- Don't use simple 3-column cards with one-liners
- Each use case needs:
  - Specific data types required
  - Scale examples from real datasets (with citations)
  - "The challenge" paragraph explaining the hard problem
  - Stats bar with 4 specific metrics (e.g., "16+ fps", "2-8 sec", "75+ words", "6 aspects")
  - Inline citations to research papers or industry datasets

**Example structure (Video Generation use case):**
```tsx
<div className="p-8 rounded-xl border">
  <div className="flex items-start gap-4 mb-4">
    <Icon />
    <div>
      <h3>Video Generation</h3>
      <p className="text-tertiary">Sora, Runway, Veo, HunyuanVideo</p>
    </div>
  </div>
  <p>Substantive paragraph with inline citation to Open-Sora 2.0...</p>
  <p><strong>The challenge:</strong> Web-scraped video is noisy...</p>
  <div className="grid grid-cols-4 gap-4">
    {/* Stats: 16+ fps, 2-8 sec, 75+ words, 6 aspects */}
  </div>
</div>
```

#### FAQ Section
- Answers should be multi-paragraph with bullet lists
- Include inline citations where relevant
- Break down categories (e.g., "Human-collected data:", "Web-scale harvesting:")
- Add a 5th FAQ about scale/timeline with specific numbers

**FAQ answer structure:**
```tsx
answer: (
  <>
    <p className="mb-3">Opening context with citation...</p>
    <ul className="list-none space-y-2 mb-3">
      <li><strong>Category:</strong> Detailed explanation...</li>
      <li><strong>Category:</strong> Detailed explanation...</li>
    </ul>
    <p>Closing statement...</p>
  </>
)
```

### Copy Principles (Direct Response)

**Hero Copy:**
- Lead with transformation, not features
- "Your Model Is Only as Good as Data That Doesn't Exist Yet." > "Data Acquisition Services"
- Bold the key value prop: **"We collect what you can't scrape."**

**Problem Section Copy:**
- Name it something punchy: "The Data Wall" not "The Data Acquisition Challenge"
- Use short sentences for impact: "Not architecture. Not training runs. **Data.**"
- Three bold "You can't..." statements create urgency
- End with competitive pressure and a kicker

**Rhythm:**
- Alternate short punchy sentences with longer explanatory ones
- Don't be afraid of sentence fragments for emphasis
- Bold key phrases strategically

### Technical Implementation

**Citation Component:**
```tsx
function Citation({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-0.5"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
}
```

**FAQ with JSX answers:**
- Change FAQItem to accept `React.ReactNode` for answer prop
- Type the faqs array: `const faqs: { question: string; answer: React.ReactNode }[] = [...]`

**Spacing around TextScramble:**
- Put `{" "}` outside the component, not leading space in `text` prop
- Linters strip internal leading spaces

### Research Requirements

Before writing each pillar page, research:
1. **Scale examples** - What do real datasets look like? (e.g., DROID: 76K trajectories, Open-Sora: 85M videos)
2. **Technical requirements** - Specific specs (fps, clip length, annotation density)
3. **Industry challenges** - What makes this hard? What are the bottlenecks?
4. **Competitive landscape** - What are others doing? (China data factories, research consortiums)
5. **Market size** - Dollar figures for the market segment

### What NOT to Do

- ❌ Don't use thin 3-card grids for use cases
- ❌ Don't put case studies/proof at the bottom after CTA
- ❌ Don't write generic FAQ answers without citations
- ❌ Don't use corporate marketing speak ("leverage", "comprehensive", "solutions")
- ❌ Don't skip the research phase - technical buyers verify claims
- ❌ Don't have separate "Sources & References" section if you inline-cite (redundant)

### Checklist for Each Pillar Page

Before shipping, verify:

- [ ] Hero has punchy transformation headline (not feature list)
- [ ] Problem section quantifies pain and creates urgency
- [ ] Proof/case studies section appears BEFORE capabilities
- [ ] Use cases are expanded with stats bars and inline citations
- [ ] FAQs have multi-paragraph JSX answers with bullet lists
- [ ] All claims have inline citation links
- [ ] Page flow follows conversion-optimized structure
- [ ] Copy sounds like a person, not a marketing team
- [ ] Technical buyers would find the content substantive

---

## Sources & References

### SEO & LLM Optimization
- Backlinko - B2B SEO Strategy 2026
- Search Engine Land - Topic Clusters Guide
- Superprompt - AI Traffic Optimization
- Quoleady - Schema for LLM Visibility

### Competitor Analysis
- Scale AI Data Engine
- Labelbox Frontier Models
- Appen Data Collection
- Surge AI Case Study (West Operators)

### Industry Research
- Rest of World - China Robot Training Centers
- Deloitte - Physical AI Report
- IBM - AI Tech Trends 2026
- World Economic Forum - AI Training Data

### Technical Implementation
- Next.js Documentation - Metadata API
- Google Developers - Structured Data
- Vercel - Core Web Vitals Optimization

---

*Last updated: January 2026*
*Research compiled for Claru landing page expansion*
