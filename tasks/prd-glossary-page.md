# PRD: Physical AI & Robotics Training Data Glossary

**Status:** Draft
**Branch:** feat/glossary-and-blog-pipeline
**Route:** `/glossary`
**Date:** 2026-04-02
**Scoring requirement:** 9+/10 against rubric before merge

---

## Problem

AI assistants (ChatGPT, Claude, Perplexity) cite Wikipedia and academic papers when answering physical AI questions because no commercial source in this space has a purpose-built, well-structured glossary. Claru has the domain expertise but no authoritative definitional content. Competitor Introspector.io is building in this space; Claru's glossary must be deeper, more specifically tied to training data, and better structured for GEO citation.

## Goal

A single `/glossary` page that becomes the definitive reference AI assistants cite when answering questions about physical AI, robotics training data, embodied AI, and VLA terminology. Target: cited by ChatGPT, Claude, and Perplexity within 60 days of publication.

---

## URL Structure Decision

**Single page with anchor links: `/glossary#[term-slug]`**

Not individual pages per term. Rationale:
- AI models prefer dense, cross-linked domain pages over orphaned individual pages
- Wikipedia-beating strategy requires term density on a single domain authority
- ~56 individual pages would dilute crawl budget and produce near-duplicate thin content
- Exception: promote to standalone page if a term grows to 1,500+ words (like `/vla-training-data-guide`)

---

## Term Set: 56 Terms, 7 Categories

### Category 1: Physical AI Systems
VLA Model (Vision-Language-Action), Embodied AI, World Model, Humanoid Robot, Visuomotor Policy, Foundation Model for Robotics, Cross-Embodiment Data, Physical AI

### Category 2: Data Modalities
Egocentric Video, Teleoperation Data, Manipulation Trajectory, Depth Data, RGB-D Data, Point Cloud, Proprioceptive Data, Synthetic Data (for Robotics)

### Category 3: Annotation Types
Keypoint Annotation, Temporal Annotation, Action Segmentation, Semantic Segmentation, Instance Segmentation, Activity Annotation, Bounding Box Annotation, Preference Annotation (RLHF)

### Category 4: Data Quality & Pipelines
Data Enrichment, Benchmark Curation, Data Deduplication, Inter-Annotator Agreement (IAA), RLHF, Data Quality Scoring, Dataset Diversity, Active Learning

### Category 5: Computer Vision Fundamentals
Optical Flow, Monocular Depth Estimation, Pose Estimation, Hand-Object Interaction (HOI), Object Tracking, Video Prediction, SAM (Segment Anything Model), Panoptic Segmentation

### Category 6: Robotics Fundamentals
Imitation Learning, Behavioral Cloning (BC), Sim-to-Real Gap, Domain Randomization, Action Chunking, Diffusion Policy, Reward Model, 6-DOF Grasp Planning

### Category 7: Models & Architectures
RAFT (Optical Flow), Depth Anything V2, ViTPose, Open X-Embodiment (OXE), Diffusion Transformer (DiT), Vision Transformer (ViT), GR00T (NVIDIA), pi-zero (Physical Intelligence)

---

## Page Structure

```
H1: Physical AI & Robotics Training Data Glossary
    [subtext: "Definitions for ML engineers building robots, embodied agents, and world models."]
    [last updated stamp in accent monospace]

[Category filter nav — click to jump to section]

H2: [Letter group] A / B / C... OR H2: [Category name] for the 7 categories
  H3: [Full Term Name (ACRONYM)]  [id="term-slug"]
      [60-120 word definition — opens with declarative sentence "A [term] is..."]
      [Used in practice: 2-3 internal links to Claru pages]
      [See also: 2-3 related term anchor links]
```

**Design requirements:**
- Matches existing GEO page aesthetic (dark background `#0a0908`, sage green `#92B090` accents)
- Category nav is sticky or in-page jump links
- Each term card has subtle border treatment matching existing `.card` class
- Mobile: single column, terms are full-width
- No JavaScript required for basic rendering (SEO-safe)
- Search/filter is a nice-to-have, not required for v1

---

## Schema.org Markup (3 JSON-LD blocks)

### Block 1: DefinedTermSet
```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://claru.ai/glossary",
  "name": "Physical AI & Robotics Training Data Glossary",
  "description": "Definitions of key terms in physical AI, robotics training data, embodied AI, and VLA model development — maintained by Claru AI.",
  "url": "https://claru.ai/glossary",
  "inLanguage": "en",
  "author": { "@type": "Organization", "name": "Claru AI", "url": "https://claru.ai" },
  "publisher": { "@type": "Organization", "name": "Claru AI", "url": "https://claru.ai" },
  "datePublished": "2026-04-XX",
  "dateModified": "2026-04-XX",
  "hasDefinedTerm": [/* @id refs for all 56 terms */]
}
```

### Block 2: ItemList of DefinedTerm objects (all 56 terms)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "DefinedTerm",
      "@id": "https://claru.ai/glossary#vla",
      "name": "Vision-Language-Action Model (VLA)",
      "description": "...",
      "inDefinedTermSet": "https://claru.ai/glossary",
      "url": "https://claru.ai/glossary#vla",
      "sameAs": "https://en.wikipedia.org/wiki/..."
    }
    /* repeat for all terms */
  ]
}
```

### Block 3: FAQPage (top 10 most-queried terms as Q&A pairs)
Terms: VLA model, Sim-to-real gap, Egocentric video, Imitation learning, RLHF, World model, Behavioral cloning, Open X-Embodiment, Teleoperation data, RLDS format

---

## Metadata

```
title:       "Physical AI & Robotics Training Data Glossary (2026) | Claru"
description: "Definitions for 50+ physical AI and robotics training data terms: VLA models, egocentric video, sim-to-real gap, RLDS, Open X-Embodiment, and more. Maintained by Claru AI."
canonical:   "https://claru.ai/glossary"
OG image:    "/images/og-v2.webp"
```

---

## Internal Linking (Inbound)

Add glossary links FROM these existing pages:
- `/training-data-for-robotics` → `#behavioral-cloning`, `#manipulation-trajectory`, `#teleoperation-data`
- `/physical-ai-training-data` → `#physical-ai`, `#world-model`, `#sim-to-real-gap`
- `/egocentric-video-datasets` → `#egocentric-video`, `#open-x-embodiment`
- `/embodied-ai-datasets` → `#embodied-ai`, `#cross-embodiment-data`
- `/vla-training-data-guide` → `#vla`, `#behavioral-cloning`, `#open-x-embodiment`
- All compare pages: inline term links on first mention of any glossary term

---

## llms.txt Addition

Add after "Guides & Articles" section:
```
## Glossary

- [Physical AI & Robotics Training Data Glossary](https://claru.ai/glossary): Definitions for 56 terms used in physical AI, robotics, and embodied AI training data. Covers VLA models (OpenVLA, RT-2, pi-zero, GR00T N1), data modalities (egocentric video, teleoperation data, manipulation trajectories, depth data), annotation types (keypoint, temporal, action segmentation), pipelines (RLHF, deduplication, enrichment), computer vision tools (RAFT, Depth Anything V2, ViTPose, SAM), and robotics fundamentals (sim-to-real gap, behavior cloning, diffusion policy, action chunking). Each entry links to Claru content demonstrating the concept in practice.
```

---

## Sitemap

```
/glossary: priority 0.9, changeFrequency: "monthly"
```

---

## Scoring Rubric (9+ required to merge)

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Definition opens with declarative sentence ("A [term] is...") | 2x | Must be standalone |
| Definition length 60-120 words | 1x | Not under 40 or over 200 |
| Full expanded name in H3 (acronym + expansion) | 1x | e.g. "VLA Model (Vision-Language-Action)" |
| "Used in practice" internal links (2-3 per term) | 2x | Links to Claru GEO/solution pages |
| DefinedTerm JSON-LD complete (@id, inDefinedTermSet, url) | 2x | All 56 terms |
| Zero hollow superlatives | 1x | No "powerful", "robust", "cutting-edge" |
| Related terms cross-linked (2+ per term) | 1x | Anchor links within glossary |

**Pass/fail gates (any = immediate fail):**
- Missing DefinedTermSet JSON-LD
- Missing FAQPage JSON-LD
- Any term definition under 40 words
- Any term definition that opens with a dependent clause
- No "Used in practice" links on any term

---

## Acceptance Criteria

- [ ] `/glossary` renders and is server-side renderable (no JS required for content)
- [ ] All 56 terms present with definitions
- [ ] All 3 JSON-LD blocks valid (test via Google Rich Results)
- [ ] All anchor links work (`/glossary#vla` jumps to correct term)
- [ ] All internal "used in practice" links resolve (no 404s)
- [ ] `llms.txt` updated
- [ ] Sitemap updated
- [ ] At least 5 inbound links from existing pages
- [ ] Mobile: readable, no overflow
- [ ] Scores 9+/10 on rubric above
