# PRD: Claru Pillar Pages (PREPARE, ENRICH, VALIDATE)

## Introduction

Build three remaining pillar pages following the proven ACQUIRE page pattern. Each page targets ML researchers and heads of data at frontier AI labs (Reka AI, Moonvalley, etc.) with direct-response copy, substantive research-backed content, inline citations, and conversion-optimized flow.

**Reference Implementation:** `/src/app/pillars/acquire/page.tsx` - This is the gold standard. All subsequent pages must match its depth, structure, and quality.

---

## Goals

- Create three SEO-optimized, LLM-discoverable pillar pages (PREPARE, ENRICH, VALIDATE)
- Each page should have 2,500+ words of substantive content
- All claims backed by inline citations with clickable source links
- Follow conversion-optimized flow: Hook → Problem → Market Context → Proof → Capabilities → Process → Use Cases → FAQ → CTA
- Copy sounds like a technical expert, not a marketing team
- Technical buyers can verify claims and find the content substantive

---

## User Stories

### US-001: Create PREPARE Pillar Page Structure
**Description:** As a developer, I need to create the file structure and layout for the PREPARE pillar page.

**Acceptance Criteria:**
- [ ] Create `/src/app/pillars/prepare/page.tsx` with client component
- [ ] Create `/src/app/pillars/prepare/layout.tsx` with metadata and JSON-LD schema
- [ ] Include Service, BreadcrumbList, and FAQPage schema types
- [ ] Metadata matches research doc SEO guidelines (title 50-60 chars, description 140-160 chars)
- [ ] Typecheck passes

---

### US-002: Research PREPARE Page Content
**Description:** As a content creator, I need to research data preparation topics to write substantive, citation-backed content.

**Research Requirements:**
- [ ] Find scale examples for deduplication (trillion-token processing references)
- [ ] Find specific algorithms used (MinHashLSH, embedding models)
- [ ] Research multimodal alignment challenges (video-text, cross-modal sync)
- [ ] Find industry stats on data prep bottlenecks (80% time sink citation)
- [ ] Research quality filtering tradeoffs and thresholds
- [ ] Find 5-8 credible sources for inline citations

**Acceptance Criteria:**
- [ ] Document 5+ specific datasets/projects with scale numbers
- [ ] Document 4+ technical metrics (throughput, accuracy, etc.)
- [ ] All stats have source URLs ready for Citation component

---

### US-003: Write PREPARE Hero and Problem Sections
**Description:** As a user, I want punchy hero copy and a compelling problem section that establishes the data preparation bottleneck.

**Hero Requirements:**
- Headline: Transformation-focused (e.g., "80% of ML Time Is Data Work. We Fix the Other 80%.")
- Subtitle should reference the core value prop (Structure for Scale)
- Two paragraphs: short punch + longer expand with bold kicker

**Problem Section ("The Preparation Bottleneck" or similar):**
- Lead with specific pain point and citation
- List "you can't just..." statements (deduplication at scale, quality filtering, etc.)
- Reference competitive pressure (industry investing in data infrastructure)
- End with kicker callout box

**Acceptance Criteria:**
- [ ] Hero headline is transformation-focused, not feature-focused
- [ ] Problem section has 3+ inline citations
- [ ] Copy alternates short punchy sentences with longer explanatory ones
- [ ] Section ends with a quotable callout box
- [ ] Typecheck passes

---

### US-004: Write PREPARE Capabilities Section
**Description:** As a user, I want to understand Claru's data preparation capabilities.

**Capabilities (4 cards):**
1. **Deduplication** - Multi-level (document, paragraph, line), trillion-token scale
2. **Quality Filtering** - Configurable thresholds, semantic scoring, 10x-1000x reduction
3. **Format Normalization** - Standardization, noise removal, petabyte-scale
4. **Multimodal Alignment** - Video-text, image-audio pairing, cross-modal sync

**Acceptance Criteria:**
- [ ] Uses CapabilityCard component pattern from ACQUIRE
- [ ] Each capability has 4 detail bullet points
- [ ] Technical terminology is accurate (MinHashLSH, embedding models, etc.)
- [ ] Typecheck passes

---

### US-005: Write PREPARE Use Cases Section (Expanded)
**Description:** As a user, I want to see detailed use cases for data preparation with specific examples and metrics.

**Use Cases (3 expanded cards, not thin grid):**

1. **LLM Pre-Training Data**
   - Scale: Trillion-token datasets, petabyte ingestion
   - Challenges: Deduplication at scale, quality vs. diversity tradeoff
   - Stats bar: Token count, dedup ratio, quality score, processing time
   - Citations: Reference real LLM training data papers

2. **Video-Language Model Training**
   - Scale: Millions of video-caption pairs
   - Challenges: Temporal alignment, caption quality, frame sampling
   - Stats bar: Clip count, alignment accuracy, caption density, modalities
   - Citations: Reference video datasets (Open-Sora, HowTo100M, etc.)

3. **Robotics Dataset Curation**
   - Scale: Hundreds of thousands of trajectories
   - Challenges: Sensor fusion, action normalization, cross-embodiment
   - Stats bar: Trajectory count, sensor types, action dimensions, scenes
   - Citations: Reference DROID, Open X-Embodiment, etc.

**Acceptance Criteria:**
- [ ] Each use case is expanded card format (not thin 3-column grid)
- [ ] Each has substantive paragraph + "The challenge" paragraph
- [ ] Each has stats bar with 4 specific metrics
- [ ] Each has 1-2 inline citations
- [ ] Typecheck passes

---

### US-006: Write PREPARE FAQ Section
**Description:** As a user, I want detailed answers to common questions about data preparation.

**FAQs (5 questions with JSX answers):**
1. "What deduplication methods do you use?" - Cover MinHashLSH, embedding-based, multi-level
2. "How do you handle quality vs. quantity tradeoffs?" - Configurable thresholds, domain-specific
3. "Can you process multimodal data?" - Video-text alignment, cross-modal sync, temporal
4. "What scale can you handle?" - Specific throughput numbers, infrastructure
5. "How do you ensure data lineage and versioning?" - Audit trails, provenance tracking

**Acceptance Criteria:**
- [ ] FAQItem accepts React.ReactNode for answer prop
- [ ] Each answer has 2-3 paragraphs with bullet list
- [ ] At least 3 answers have inline citations
- [ ] Answers match FAQ schema in layout.tsx
- [ ] Typecheck passes

---

### US-007: Create ENRICH Pillar Page Structure
**Description:** As a developer, I need to create the file structure for the ENRICH pillar page.

**Acceptance Criteria:**
- [ ] Create `/src/app/pillars/enrich/page.tsx` with client component
- [ ] Create `/src/app/pillars/enrich/layout.tsx` with metadata and JSON-LD schema
- [ ] Metadata optimized for "data annotation services" keywords
- [ ] Typecheck passes

---

### US-008: Research ENRICH Page Content
**Description:** As a content creator, I need to research data annotation topics.

**Research Requirements:**
- [ ] RLHF evolution stats (RLTHF 6-7% effort, specialist pivot)
- [ ] Quality metrics (IAA >85%, accuracy 95-97%, Krippendorff's Alpha)
- [ ] Expert vs. crowdsourced comparison data
- [ ] Video annotation challenges (temporal, frame-level, physics-aware)
- [ ] Domain specialist requirements (medical, legal, STEM)
- [ ] Find 5-8 credible sources

**Acceptance Criteria:**
- [ ] Document quality metrics with source citations
- [ ] Document expert annotation differentiators
- [ ] All stats have source URLs ready

---

### US-009: Write ENRICH Hero and Problem Sections
**Description:** As a user, I want compelling copy about why annotation quality matters.

**Hero Requirements:**
- Headline: Focus on human intelligence/expertise (e.g., "AI Is Only as Smart as Its Teachers")
- Reference the quality imperative

**Problem Section ("The Annotation Quality Crisis" or similar):**
- 26% of AI failures trace to poor data quality citation
- Generic annotators miss domain nuance
- RLHF complexity requires judgment
- Consistency at scale challenges

**Acceptance Criteria:**
- [ ] Hero is transformation-focused
- [ ] Problem section has 3+ inline citations
- [ ] Includes expert vs. crowdsourced comparison
- [ ] Typecheck passes

---

### US-010: Write ENRICH Capabilities Section
**Description:** As a user, I want to understand Claru's annotation capabilities.

**Capabilities (4 cards):**
1. **RLHF & Preference Data** - Human rankings, reward modeling, expert judgment
2. **Frame-Level Video Annotation** - Temporal segmentation, action recognition, physics-aware
3. **Expert Domain Annotation** - STEM, medical, legal specialists, PhD-level
4. **Red Teaming & Adversarial** - Safety testing, jailbreak attempts, vulnerability finding

**Acceptance Criteria:**
- [ ] Uses CapabilityCard component pattern
- [ ] Each has 4 detail bullet points with domain-specific terminology
- [ ] Typecheck passes

---

### US-011: Write ENRICH Use Cases Section (Expanded)
**Description:** As a user, I want to see detailed annotation use cases.

**Use Cases (3 expanded cards):**

1. **RLHF for Frontier LLMs**
   - Evolution from generalist to specialist annotators
   - RLTHF efficiency gains (6-7% effort)
   - Stats bar: Preference pairs, annotator expertise, IAA score, iterations

2. **Video Understanding Models**
   - Temporal annotation challenges
   - Frame-level vs. clip-level labeling
   - Stats bar: Frames/video, annotation density, temporal accuracy, action types

3. **Safety & Alignment**
   - Red teaming methodologies
   - Constitutional AI training data
   - Stats bar: Attack types tested, vulnerability categories, languages, domains

**Acceptance Criteria:**
- [ ] Expanded card format with stats bars
- [ ] Each has inline citations to research
- [ ] Typecheck passes

---

### US-012: Write ENRICH FAQ Section
**Description:** As a user, I want detailed answers about annotation services.

**FAQs (5 questions):**
1. "What's the difference between expert and crowdsourced annotation?"
2. "How do you maintain quality at scale?"
3. "What domains do your specialists cover?"
4. "How does your RLHF process work?"
5. "What quality metrics do you target?"

**Acceptance Criteria:**
- [ ] Multi-paragraph JSX answers with bullet lists
- [ ] Quality metrics cited (IAA, Krippendorff's Alpha, etc.)
- [ ] At least 3 answers have inline citations
- [ ] Typecheck passes

---

### US-013: Create VALIDATE Pillar Page Structure
**Description:** As a developer, I need to create the file structure for VALIDATE.

**Acceptance Criteria:**
- [ ] Create `/src/app/pillars/validate/page.tsx` with client component
- [ ] Create `/src/app/pillars/validate/layout.tsx` with metadata and JSON-LD schema
- [ ] Metadata optimized for "AI red teaming" and "data quality assurance" keywords
- [ ] Typecheck passes

---

### US-014: Research VALIDATE Page Content
**Description:** As a content creator, I need to research validation and red teaming topics.

**Research Requirements:**
- [ ] Red teaming methodologies and frameworks
- [ ] Bias detection approaches
- [ ] Benchmark curation best practices
- [ ] Safety evaluation standards
- [ ] Data quality metrics and monitoring
- [ ] Find 5-8 credible sources

**Acceptance Criteria:**
- [ ] Document red teaming frameworks with citations
- [ ] Document bias detection methodologies
- [ ] All stats have source URLs ready

---

### US-015: Write VALIDATE Hero and Problem Sections
**Description:** As a user, I want compelling copy about why validation matters.

**Hero Requirements:**
- Headline: Risk/safety focused (e.g., "Ship Broken Models, Break User Trust")
- Reference the validation imperative

**Problem Section ("The Hidden Quality Crisis" or similar):**
- Problems surface late in training
- Bias compounds through training
- Safety issues only visible through adversarial testing
- Benchmark contamination risks

**Acceptance Criteria:**
- [ ] Hero creates urgency around risk
- [ ] Problem section has 3+ inline citations
- [ ] Typecheck passes

---

### US-016: Write VALIDATE Capabilities Section
**Description:** As a user, I want to understand Claru's validation capabilities.

**Capabilities (4 cards):**
1. **Red Teaming** - Adversarial testing, jailbreak attempts, safety vulnerabilities
2. **Benchmark Curation** - Golden datasets, evaluation sets, contamination prevention
3. **Bias Detection** - Systematic error analysis, representation audits, fairness testing
4. **Post-Training Evaluation** - Performance testing, regression detection, production readiness

**Acceptance Criteria:**
- [ ] Uses CapabilityCard component pattern
- [ ] Each has 4 domain-specific detail points
- [ ] Typecheck passes

---

### US-017: Write VALIDATE Use Cases Section (Expanded)
**Description:** As a user, I want to see detailed validation use cases.

**Use Cases (3 expanded cards):**

1. **LLM Safety Evaluation**
   - Red teaming attack categories
   - Constitutional AI alignment testing
   - Stats bar: Attack types, languages, jailbreak categories, domains

2. **Benchmark Integrity**
   - Contamination detection
   - Golden set curation
   - Stats bar: Eval samples, overlap detection rate, annotation quality, domain coverage

3. **Bias & Fairness Audits**
   - Representation analysis
   - Systematic error detection
   - Stats bar: Demographic categories, languages, domains, metric types

**Acceptance Criteria:**
- [ ] Expanded card format with stats bars
- [ ] Each has inline citations
- [ ] Typecheck passes

---

### US-018: Write VALIDATE FAQ Section
**Description:** As a user, I want detailed answers about validation services.

**FAQs (5 questions):**
1. "What red teaming methodologies do you use?"
2. "How do you prevent benchmark contamination?"
3. "What types of bias do you test for?"
4. "How do you create golden evaluation sets?"
5. "What safety standards do you follow?"

**Acceptance Criteria:**
- [ ] Multi-paragraph JSX answers with bullet lists
- [ ] At least 3 answers have inline citations
- [ ] Typecheck passes

---

### US-019: Update Navigation and Internal Linking
**Description:** As a user, I want to navigate between all pillar pages.

**Acceptance Criteria:**
- [ ] Header nav includes links to all 4 pillars
- [ ] Each pillar page links to other pillars in footer or related section
- [ ] Homepage services section links to all pillar pages
- [ ] Breadcrumb navigation works on all pages
- [ ] Typecheck passes

---

### US-020: Final QA and Build Verification
**Description:** As a developer, I need to verify all pages build and meet quality standards.

**Acceptance Criteria:**
- [ ] `npm run build` passes with no errors
- [ ] All 4 pillar pages generate as static pages
- [ ] Each page has 2,500+ words of content
- [ ] All inline citations have working URLs
- [ ] JSON-LD schema validates (test with Google Rich Results)
- [ ] Copy reviewed for direct-response principles
- [ ] Mobile responsive on all pages

---

## Functional Requirements

- FR-1: Each pillar page must follow identical structure as ACQUIRE (Hero → Problem → Market → Proof → Capabilities → Process → Use Cases → FAQ → CTA)
- FR-2: All statistics and claims must have inline Citation components with external links
- FR-3: FAQ answers must be ReactNode (JSX) with multi-paragraph content and bullet lists
- FR-4: Use cases must be expanded card format with stats bars, not thin 3-column grids
- FR-5: Each page must have layout.tsx with metadata and complete JSON-LD schema (Service, BreadcrumbList, FAQPage)
- FR-6: Problem sections must use punchy naming ("The Data Wall" style, not "Data Challenges")
- FR-7: Hero copy must be transformation-focused, not feature-focused
- FR-8: All pages must include proof/case studies section BEFORE capabilities section

---

## Non-Goals

- No implementation of actual case study pages (placeholder cards are acceptable)
- No cluster pages (e.g., /pillars/prepare/deduplication) in this phase
- No backend form submission integration
- No A/B testing infrastructure
- No analytics implementation
- No client logo integration (requires assets)

---

## Technical Considerations

### Shared Components (from ACQUIRE)
- Citation component for inline source links
- CapabilityCard component for capabilities grid
- FAQItem component (must accept ReactNode for answer prop)

### File Structure
```
src/app/pillars/
├── acquire/
│   ├── page.tsx     (existing - reference implementation)
│   └── layout.tsx   (existing)
├── prepare/
│   ├── page.tsx     (new)
│   └── layout.tsx   (new)
├── enrich/
│   ├── page.tsx     (new)
│   └── layout.tsx   (new)
└── validate/
    ├── page.tsx     (new)
    └── layout.tsx   (new)
```

### Research Sources to Use
- Research doc: `/docs/pillar-pages-research.md`
- Web search for specific stats and dataset examples
- Academic papers for technical metrics
- Industry reports for market context

---

## Success Metrics

- All 4 pillar pages build successfully as static pages
- Each page has 2,500+ words of substantive content
- Each page has 5+ inline citations with working links
- Technical buyers (ML researchers) would find content credible
- Copy passes "read aloud" test for natural rhythm
- Page flow follows conversion-optimized structure

---

## Open Questions

- Should we add cross-pillar "Related Services" section at bottom of each page?
- Should proof/case studies section be populated with real examples or remain placeholders?
- Should we create a shared PillarPage component or keep each page as standalone?

---

## Implementation Order

1. **PREPARE** (US-001 through US-006) - Closest to ACQUIRE in complexity
2. **ENRICH** (US-007 through US-012) - Most differentiated (expert annotation focus)
3. **VALIDATE** (US-013 through US-018) - Most technical (red teaming, bias)
4. **Navigation** (US-019) - Connect all pages
5. **Final QA** (US-020) - Verify everything works

---

*PRD created: January 2026*
*Reference implementation: /src/app/pillars/acquire/page.tsx*
