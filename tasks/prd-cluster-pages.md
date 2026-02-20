# PRD: Pillar Cluster Pages

## Introduction

Build 12 cluster pages (3 per pillar) that provide deep-dive content on specific services. These pages target long-tail keywords, answer specific buyer questions, and link back to parent pillar pages to strengthen the topic cluster SEO architecture.

**Reference:** See `/docs/pillar-pages-research.md` for full SEO strategy, LLM optimization guidelines, and content requirements.

---

## Goals

- Create 12 cluster pages (1,000-2,000 words each) targeting specific service offerings
- Capture long-tail search traffic with high purchase intent
- Strengthen internal linking to boost pillar page authority
- Provide substantive "how" content for technical buyers
- Maintain LLM-discoverability with FAQ schema and answer capsules

---

## Architecture

```
/pillars/acquire/
├── egocentric-video/    ← US-001, US-002
├── synthetic-data/      ← US-003, US-004
└── data-licensing/      ← US-005, US-006

/pillars/prepare/
├── deduplication/       ← US-007, US-008
├── multimodal-alignment/← US-009, US-010
└── quality-scoring/     ← US-011, US-012

/pillars/enrich/
├── rlhf/                ← US-013, US-014
├── video-annotation/    ← US-015, US-016
└── expert-annotation/   ← US-017, US-018

/pillars/validate/
├── red-teaming/         ← US-019, US-020
├── benchmark-curation/  ← US-021, US-022
└── bias-detection/      ← US-023, US-024
```

---

## Content Guidelines (All Cluster Pages)

### Page Structure
1. **Hero** - Service-specific headline, parent pillar breadcrumb
2. **Problem/Context** - Why this specific service matters
3. **How It Works** - Detailed methodology (the "how")
4. **Technical Specs** - Specific capabilities, scale, metrics
5. **Use Cases** - 2-3 specific applications with examples
6. **FAQ** - 3-4 questions with substantive answers
7. **CTA** - Link to consultation + back to parent pillar

### Requirements
- 1,000-2,000 words of substantive content
- 3-5 inline citations with external links
- FAQ schema in layout.tsx (3-4 questions)
- Breadcrumb: Home > [Pillar] > [Cluster]
- Link back to parent pillar in hero and footer
- 1-2 cross-links to sibling cluster pages
- Answer capsule after first H2 (20-25 words, no links)

### Copy Style
- Technical but accessible
- Specific over generic (name algorithms, datasets, metrics)
- Direct response principles from pillar pages
- No corporate speak ("leverage", "solutions", "comprehensive")

---

## User Stories

### ACQUIRE Cluster Pages

#### US-001: Create egocentric-video layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for egocentric video data collection page.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/egocentric-video/layout.tsx`
- Title: "Egocentric Video Data Collection for AI | Claru" (under 60 chars)
- Description about first-person video capture, wearable cameras, embodied AI training
- Keywords: egocentric video, first-person video data, embodied AI training, POV data collection
- Canonical: `/pillars/acquire/egocentric-video`
- JSON-LD: Service schema + BreadcrumbList (Home > Acquire > Egocentric Video) + FAQPage (3 questions)
- Typecheck passes

---

#### US-002: Create egocentric-video page.tsx
**Description:** Create full cluster page for egocentric video data collection services.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/egocentric-video/page.tsx`
- Hero: Breadcrumb to /pillars/acquire, headline about first-person video capture
- Problem: Why egocentric video is critical for robotics/embodied AI (can't scrape POV data)
- How It Works: Wearable cameras, expert collectors, environment coverage, annotation pipeline
- Technical Specs: Resolution, frame rates, sensor fusion, metadata capture
- Use Cases: Robotics manipulation, autonomous navigation, AR/VR training
- Research to cite: Ego4D dataset, EPIC-KITCHENS, Open X-Embodiment
- FAQ: 3 questions about collection methodology, scale, privacy
- CTA: Back to Acquire pillar + consultation
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-003: Create synthetic-data layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for synthetic data generation page.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/synthetic-data/layout.tsx`
- Title: "Synthetic Data Generation for AI Training | Claru" (under 60 chars)
- Description about Unreal Engine, procedural generation, domain randomization
- Keywords: synthetic data generation, AI training data, Unreal Engine data, procedural data
- Canonical: `/pillars/acquire/synthetic-data`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-004: Create synthetic-data page.tsx
**Description:** Create full cluster page for synthetic data generation services.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/synthetic-data/page.tsx`
- Hero: Breadcrumb, headline about generating training data that doesn't exist
- Problem: Real data is scarce, expensive, biased - synthetic fills gaps
- How It Works: Unreal Engine pipelines, domain randomization, human validation layer
- Technical Specs: Photorealism levels, variation parameters, ground truth labels
- Use Cases: Autonomous vehicles, robotics sim-to-real, rare event training
- Research to cite: Gartner 80% synthetic by 2028, NVIDIA Omniverse, domain randomization papers
- FAQ: 3 questions about realism, validation, sim-to-real gap
- Cross-link to data-licensing (real data to augment synthetic)
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-005: Create data-licensing layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for data licensing page.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/data-licensing/layout.tsx`
- Title: "AI Training Data Licensing Services | Claru" (under 60 chars)
- Description about licensed content, copyright compliance, provenance documentation
- Keywords: AI data licensing, training data rights, licensed datasets, copyright compliant AI data
- Canonical: `/pillars/acquire/data-licensing`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-006: Create data-licensing page.tsx
**Description:** Create full cluster page for data licensing and rights management services.

**Acceptance Criteria:**
- Create `/src/app/pillars/acquire/data-licensing/page.tsx`
- Hero: Breadcrumb, headline about legal, licensed training data
- Problem: Copyright lawsuits, NYT v OpenAI, provenance requirements, EU AI Act
- How It Works: Content partnerships, rights negotiation, provenance tracking, audit trails
- Technical Specs: License types, attribution requirements, geographic rights
- Use Cases: Media companies, enterprise AI, regulated industries
- Research to cite: NYT lawsuit, Getty v Stability, EU AI Act transparency requirements
- FAQ: 3 questions about copyright, licensing costs, compliance
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

### PREPARE Cluster Pages

#### US-007: Create deduplication layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for deduplication services page.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/deduplication/layout.tsx`
- Title: "AI Training Data Deduplication Services | Claru" (under 60 chars)
- Description about MinHashLSH, trillion-token scale, duplicate removal
- Keywords: data deduplication, LLM training data, MinHashLSH, duplicate detection
- Canonical: `/pillars/prepare/deduplication`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-008: Create deduplication page.tsx
**Description:** Create full cluster page for data deduplication services.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/deduplication/page.tsx`
- Hero: Breadcrumb to /pillars/prepare, headline about removing duplicates at scale
- Problem: Duplicates cause memorization, wasted compute, benchmark contamination
- How It Works: Multi-level dedup (document, paragraph, n-gram), MinHashLSH, embedding similarity
- Technical Specs: Trillion-token processing, configurable thresholds, near-duplicate detection
- Use Cases: LLM pre-training, benchmark curation, web corpus cleaning
- Research to cite: SlimPajama, RefinedWeb dedup methodology, ACL dedup papers
- FAQ: 3 questions about near-duplicates, threshold tuning, processing speed
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-009: Create multimodal-alignment layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for multimodal alignment page.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/multimodal-alignment/layout.tsx`
- Title: "Multimodal Data Alignment for AI Training | Claru" (under 60 chars)
- Description about video-text pairing, cross-modal synchronization, temporal alignment
- Keywords: multimodal alignment, video-text pairing, cross-modal data, temporal synchronization
- Canonical: `/pillars/prepare/multimodal-alignment`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-010: Create multimodal-alignment page.tsx
**Description:** Create full cluster page for multimodal data alignment services.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/multimodal-alignment/page.tsx`
- Hero: Breadcrumb, headline about synchronizing data across modalities
- Problem: Video-text misalignment, audio drift, frame-caption mismatch breaks training
- How It Works: Temporal alignment, cross-modal embedding, automated QA, human verification
- Technical Specs: Frame-level precision, audio sync tolerance, caption density
- Use Cases: Video-language models, text-to-video, vision-language pre-training
- Research to cite: CLIP alignment, InternVideo, TALC time-aligned captions
- FAQ: 3 questions about alignment accuracy, handling drift, quality metrics
- Cross-link to quality-scoring
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-011: Create quality-scoring layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for quality scoring page.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/quality-scoring/layout.tsx`
- Title: "ML Data Quality Scoring & Filtering | Claru" (under 60 chars)
- Description about quality classifiers, perplexity filtering, semantic scoring
- Keywords: data quality scoring, ML data filtering, training data quality, perplexity filtering
- Canonical: `/pillars/prepare/quality-scoring`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-012: Create quality-scoring page.tsx
**Description:** Create full cluster page for data quality scoring and filtering services.

**Acceptance Criteria:**
- Create `/src/app/pillars/prepare/quality-scoring/page.tsx`
- Hero: Breadcrumb, headline about separating signal from noise
- Problem: 10-1000x data reduction needed, but aggressive filtering loses diversity
- How It Works: Multi-signal scoring (perplexity, classifier, embedding), configurable thresholds
- Technical Specs: Scoring dimensions, threshold calibration, diversity preservation
- Use Cases: Web corpus filtering, instruction tuning data, domain-specific corpora
- Research to cite: RefinedWeb filtering, FineWeb, quality classifier papers
- FAQ: 3 questions about threshold selection, diversity vs quality, domain adaptation
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

### ENRICH Cluster Pages

#### US-013: Create rlhf layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for RLHF services page.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/rlhf/layout.tsx`
- Title: "RLHF Data Services for LLM Alignment | Claru" (under 60 chars)
- Description about preference ranking, reward modeling, human feedback at scale
- Keywords: RLHF services, preference data, human feedback AI, reward model training
- Canonical: `/pillars/enrich/rlhf`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-014: Create rlhf page.tsx
**Description:** Create full cluster page for RLHF and preference data services.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/rlhf/page.tsx`
- Hero: Breadcrumb to /pillars/enrich, headline about human judgment for AI alignment
- Problem: RLHF quality determines model behavior ceiling, crowdsourced feedback is noisy
- How It Works: Expert rankers, preference collection, reward model training support, iterative refinement
- Technical Specs: Comparison formats (pairwise, ranked lists), IAA targets, throughput
- Use Cases: LLM fine-tuning, constitutional AI, chat model alignment
- Research to cite: InstructGPT, Anthropic RLHF, RLTHF efficiency paper
- FAQ: 3 questions about expert vs crowd, scale, iteration cycles
- Cross-link to expert-annotation
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-015: Create video-annotation layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for video annotation page.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/video-annotation/layout.tsx`
- Title: "Frame-Level Video Annotation Services | Claru" (under 60 chars)
- Description about temporal segmentation, action recognition, object tracking
- Keywords: video annotation, frame-level labeling, temporal annotation, video AI training
- Canonical: `/pillars/enrich/video-annotation`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-016: Create video-annotation page.tsx
**Description:** Create full cluster page for video annotation services.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/video-annotation/page.tsx`
- Hero: Breadcrumb, headline about frame-by-frame precision
- Problem: 10 minutes of video = 18,000 frames, temporal consistency is hard, physics awareness needed
- How It Works: Keyframe annotation, interpolation, temporal consistency QA, action segmentation
- Technical Specs: Frame density, annotation types (bbox, segmentation, skeleton), temporal linking
- Use Cases: Video generation models, autonomous vehicles, sports analytics, surveillance
- Research to cite: Video annotation bottleneck stats, SAM2, temporal annotation research
- FAQ: 3 questions about annotation density, temporal consistency, turnaround time
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-017: Create expert-annotation layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for expert annotation page.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/expert-annotation/layout.tsx`
- Title: "Expert Domain Annotation for AI Training | Claru" (under 60 chars)
- Description about PhD-level annotators, STEM specialists, domain expertise
- Keywords: expert annotation, domain specialist labeling, PhD annotators, specialized AI training
- Canonical: `/pillars/enrich/expert-annotation`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-018: Create expert-annotation page.tsx
**Description:** Create full cluster page for expert domain annotation services.

**Acceptance Criteria:**
- Create `/src/app/pillars/enrich/expert-annotation/page.tsx`
- Hero: Breadcrumb, headline about domain experts, not crowds
- Problem: Generic annotators miss nuance, STEM/medical/legal requires credentials
- How It Works: Expert recruitment, credential verification, domain matching, specialized tooling
- Technical Specs: Annotator qualification levels, domain coverage, quality metrics
- Use Cases: Medical AI, legal document analysis, scientific research, code review
- Research to cite: Expert vs crowdsourced accuracy studies, xAI specialist pivot
- FAQ: 3 questions about finding experts, quality assurance, domain coverage
- Cross-link to rlhf (experts for preference ranking)
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

### VALIDATE Cluster Pages

#### US-019: Create red-teaming layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for red teaming page.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/red-teaming/layout.tsx`
- Title: "AI Red Teaming & Adversarial Testing | Claru" (under 60 chars)
- Description about jailbreak testing, safety evaluation, vulnerability discovery
- Keywords: AI red teaming, adversarial testing, LLM jailbreak testing, AI safety evaluation
- Canonical: `/pillars/validate/red-teaming`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-020: Create red-teaming page.tsx
**Description:** Create full cluster page for AI red teaming services.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/red-teaming/page.tsx`
- Hero: Breadcrumb to /pillars/validate, headline about finding vulnerabilities before users do
- Problem: Jailbreaks evolve constantly, automated testing misses creative attacks, safety is table stakes
- How It Works: Threat modeling, attack taxonomy, human red teamers, severity scoring, remediation
- Technical Specs: Attack categories, testing coverage, reporting format
- Use Cases: Pre-deployment safety, compliance (EU AI Act), ongoing monitoring
- Research to cite: CSET red teaming guide, Anthropic safety research, NIST AI RMF
- FAQ: 3 questions about methodology, coverage, remediation support
- Cross-link to benchmark-curation (clean eval sets)
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-021: Create benchmark-curation layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for benchmark curation page.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/benchmark-curation/layout.tsx`
- Title: "AI Benchmark & Golden Dataset Curation | Claru" (under 60 chars)
- Description about evaluation set creation, contamination-free benchmarks, ground truth
- Keywords: AI benchmark curation, golden datasets, evaluation sets, benchmark contamination
- Canonical: `/pillars/validate/benchmark-curation`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-022: Create benchmark-curation page.tsx
**Description:** Create full cluster page for benchmark and golden dataset curation services.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/benchmark-curation/page.tsx`
- Hero: Breadcrumb, headline about trusted evaluation data
- Problem: Benchmark contamination, data leakage, gaming metrics without real improvement
- How It Works: Fresh data collection, contamination testing, expert validation, versioning
- Technical Specs: Contamination detection methods, update frequency, coverage metrics
- Use Cases: Model evaluation, capability testing, progress tracking, regulatory compliance
- Research to cite: Benchmark contamination papers, HELM, eval best practices
- FAQ: 3 questions about contamination, refresh cycles, custom benchmarks
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

#### US-023: Create bias-detection layout.tsx
**Description:** Create layout with metadata and JSON-LD schema for bias detection page.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/bias-detection/layout.tsx`
- Title: "AI Bias Detection & Fairness Evaluation | Claru" (under 60 chars)
- Description about systematic bias analysis, fairness testing, representation audits
- Keywords: AI bias detection, fairness evaluation, ML bias testing, representation analysis
- Canonical: `/pillars/validate/bias-detection`
- JSON-LD: Service + BreadcrumbList + FAQPage (3 questions)
- Typecheck passes

---

#### US-024: Create bias-detection page.tsx
**Description:** Create full cluster page for bias detection and fairness evaluation services.

**Acceptance Criteria:**
- Create `/src/app/pillars/validate/bias-detection/page.tsx`
- Hero: Breadcrumb, headline about finding systematic errors before they compound
- Problem: Bias in training data compounds in model outputs, regulatory scrutiny increasing
- How It Works: Representation analysis, systematic error detection, subgroup testing, remediation
- Technical Specs: Bias dimensions, testing frameworks, metrics (demographic parity, etc.)
- Use Cases: Hiring AI, lending models, content moderation, healthcare AI
- Research to cite: AI fairness research, EU AI Act high-risk requirements, bias audit frameworks
- FAQ: 3 questions about bias types, remediation, ongoing monitoring
- Cross-link to red-teaming (adversarial bias testing)
- 1,000-2,000 words, 3-5 citations
- Typecheck passes

---

## US-025: Update pillar pages with cluster links

**Description:** Add internal links from each pillar page to its cluster pages.

**Acceptance Criteria:**
- Each pillar page links to all 3 of its cluster pages
- Links appear in capabilities section or dedicated "Deep Dive" section
- Breadcrumb navigation works correctly
- All internal links use Next.js Link component
- Typecheck passes

---

## US-026: Final build verification

**Description:** Verify all 12 cluster pages build correctly.

**Acceptance Criteria:**
- `npm run build` passes with no errors
- All 12 cluster pages appear in build output as static pages
- No TypeScript errors or warnings
- All Citation hrefs are valid URLs
- Cross-links between pages work correctly

---

## Technical Notes

### File Pattern
Each cluster page follows the same pattern as pillar pages:
- `layout.tsx` - Metadata + JSON-LD schema
- `page.tsx` - Full page content

### Shared Components
Reuse from pillar pages:
- `Citation` component for inline links
- `FAQItem` component for FAQ sections
- `CapabilityCard` for technical specs
- Button, motion animations

### Research Phase
Before writing each cluster page, research:
1. Specific methodologies and algorithms
2. Scale examples from real implementations
3. Industry benchmarks and metrics
4. Competitor positioning
5. Recent papers and developments

---

## Implementation Priority

**Phase 1 - ACQUIRE clusters (US-001 to US-006)**
Most differentiated, high commercial intent keywords

**Phase 2 - ENRICH clusters (US-013 to US-018)**
RLHF and expert annotation are hot topics

**Phase 3 - VALIDATE clusters (US-019 to US-024)**
Red teaming increasingly important for compliance

**Phase 4 - PREPARE clusters (US-007 to US-012)**
More technical, supports other pillars

**Phase 5 - Integration (US-025, US-026)**
Link everything together, final QA
