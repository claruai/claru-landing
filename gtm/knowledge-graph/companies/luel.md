---
type: company
state: active
side: supply
name: Luel
slug: luel
domain: luel.ai
attio_id: null
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 95
stage: researched
tags: [egocentric, robotics, collection, marketplace, yc-w26, funded-2026, gig-model, ego4d, multimodal, berkeley]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Luel is a YC W26 two-sided marketplace connecting AI enterprises with a claimed 3M+ contributor network for rights-cleared multimodal training data (video, audio, images). Founded 2025 by two Berkeley dropouts -- William Namgyal (CEO) and Inigo Lenderking (COO). San Francisco based. Their pitch: enterprises submit a dataset spec, Luel mobilizes contributors who film structured daily-life activities (ironing, cooking, patient-doctor conversations), and delivers licensed, audit-ready data within days. They claim curated Ego4D/Ego-Exo4D subsets for egocentric video and use Vertex AI for automated quality checks. Approaching ~$2M ARR within six weeks of launch per YC Demo Day reporting.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2025 |
| Funding | $500K seed (Orange Collective, Y Combinator). Backed by angels from xAI, Meta, DoorDash, Apple. |
| Size | 2 employees (founders only) |
| CEO | William Namgyal (Berkeley MET dropout, 2x founding engineer, claims 200K+ hrs collected for top 100 AI labs) |
| COO | Inigo Lenderking (Berkeley CS dropout, ML researcher) |
| Location | San Francisco, CA |
| Clients | Not publicly named. Claims robotics and voice AI labs as buyers. |
| Key product | Rights-cleared data marketplace + custom collection engine. Off-the-shelf egocentric video datasets (Ego4D subsets). |
| Contributor network | Claims 3M+ vetted contributors with 24-48hr Venmo/Stripe payouts |
| Traction | ~$2M ARR within 6 weeks (YC Demo Day claim, Mar 2026). "Thousands of signups every single day." |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| William Namgyal | CEO | william@luel.ai | Website-confirmed |
| Inigo Lenderking | COO | inigo@luel.ai | Pattern-derived, not verified |
| — | — | founders@luel.ai | Website-confirmed (general) |

## Hiring Signals

- No job postings found as of 2026-04-05 -- they are 2 people with no public hiring page
- Contributor recruitment is via the marketplace platform itself (gig model), not traditional job postings
- Post-YC seed raise likely imminent -- expect hiring to spike in Q2 2026
- With $2M ARR and only 2 people, they are either wildly efficient or wildly under-resourced for the promises they're making

## What They've Actually Shipped

- **Marketplace platform**: functional two-sided marketplace at luel.ai with contributor portal and enterprise buyer side
- **Off-the-shelf datasets**: curated Ego4D and Ego-Exo4D subsets for egocentric video, marketed as "same-day delivery"
- **Custom collection campaigns**: enterprises submit spec (modality, scenario, instructions, devices), contributors execute
- **Quality pipeline**: automated Vertex AI quality checks and content categorization
- **Rights clearance**: consent logs, licensing, enterprise compliance/security
- **Blog/SEO machine**: aggressive content marketing -- "Luel vs Scale vs Appen" comparison posts, robotics dataset guides, etc.
- **No annotation layer visible**: they appear to collect and license raw data, not annotate it

## Data Gap (why they'd need Claru)

1. **No annotation capability.** Luel is a collection marketplace, not an annotation platform. They deliver raw licensed video/audio. Their customers still need dense annotations (bounding boxes, segmentation, action labels, spatial relationships) for robotics training.
2. **Phone-only capture.** Contributors use personal phones. No stereo depth, no IMU data, no controlled sensor rigs. Frontier robotics labs need multi-sensor capture that matches their robot's sensor config.
3. **Quality ceiling with 3M gig contributors.** Automated Vertex AI checks catch format issues, not semantic accuracy. No evidence of human QA or annotation review layer.
4. **Ego4D repackaging is thin moat.** Ego4D is open-source. Adding rights clearance and JSON manifests is a wrapper, not a dataset. Labs that need novel scenarios (industrial manipulation, warehouse ops, surgical tasks) need new collection, not repackaged academic data.
5. **2-person team, $2M ARR claims.** They are making promises to customers they may not be able to fulfill at scale. Subcontracting specialized collection and annotation is how they survive the next 6 months.

## Pitch Angle (subcontractor)

"You're selling datasets to robotics labs. At some point a customer asks for annotated egocentric video of industrial tasks -- warehouse picking, assembly line manipulation, surgical instrument handling. Your contributor network films daily life on phones, not controlled protocols in specialized environments. We handle the hard capture: 2,000+ trained collectors, 100+ cities, multi-sensor rigs, plus the annotation pipeline your marketplace doesn't have. You keep the customer relationship, we supply the data you can't collect yourself."

**Alternative angle (co-delivery):** "Your marketplace model is built for volume. Ours is built for precision. When your enterprise customer needs both -- large-scale daily-life video AND protocol-grade robotics data with dense annotations -- we can co-deliver. You handle the commodity collection, we handle the specialized capture and annotation layer."

## Competitive Position

- **Luel vs Claru**: Luel is a marketplace/aggregator (volume, speed, rights clearance). Claru is a protocol-grade collection + annotation operation (precision, sensor richness, human QA). Complementary, not competitive.
- **Luel vs Mecka AI**: Both target egocentric/robotics data with gig models. Mecka has hardware rigs and Scale AI partnership. Luel has marketplace infrastructure and Ego4D curation. Luel is more marketplace, Mecka is more collection ops.
- **Luel vs Scale AI**: Luel explicitly positions against Scale ("Scale AI alternatives" blog posts). Scale is annotation-first; Luel is collection-first. Different layers of the stack.
- **Key risk**: If Luel raises a proper seed round ($5-15M), they will try to build annotation in-house. The window for subcontract partnership is NOW while they are 2 people with more demand than capacity.

## Email Thread

No outreach sent yet. Not in Attio. william@luel.ai confirmed via website.

## Related Companies

- [mecka-ai](mecka-ai.md) -- Closest competitor, also gig-model egocentric collection for robotics
- [cortex-ai](cortex-ai.md) -- YC startup, similar space, nothing shipped
- [build-ai](build-ai.md) -- Raw MP4 collection without annotation
- [sama](sama.md) -- Enterprise annotation incumbent Luel is trying to disrupt
- [centific](centific.md) -- Large-scale data services, potential Luel enterprise competitor

## Sources

- [Luel - YC Company Page](https://www.ycombinator.com/companies/luel)
- [Launch YC: Luel - The Marketplace for Multimodal Data](https://www.ycombinator.com/launches/PKl-luel-the-marketplace-for-multimodal-data)
- [YC W26 Demo Day: 8 Investor-Chased Startups - Foundevo](https://www.foundevo.com/yc-winter-2026-demo-day-top-startups/)
- [William Namgyal - LinkedIn](https://www.linkedin.com/in/william-namgyal/)
- [Inigo Lenderking - LinkedIn](https://www.linkedin.com/in/inigolenderking/)
- [Luel Funding: $500K - Extruct AI](https://www.extruct.ai/hub/luel-ai/)
- [Luel - Crunchbase](https://www.crunchbase.com/organization/luel)
- [Luel - YC Tier List](https://yctierlist.com/w26/luel/)
- [Luel - luel.ai](https://www.luel.ai/)
- [Same-day egocentric video datasets - Luel blog](https://www.luel.ai/blog/same-day-off-the-shelf-egocentric-video-datasets-luel-delivers)
- [Top Egocentric Data Providers for Robotics 2026 - Labellerr](https://www.labellerr.com/blog/top-egocentric-data-providers-robotics/)
- [Luel LinkedIn Launch Post](https://www.linkedin.com/posts/william-namgyal_luel-yc-w26-is-live-from-ideating-in-my-activity-7424925721338204161-kVG7)
