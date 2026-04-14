---
type: company
state: prospect
side: demand
name: World Labs
slug: world-labs
domain: worldlabs.ai
attio_id: null
relationship: demand-side
vertical: physical-ai
icp_score: 82
stage: researched
tags: [active-pipeline, opened-emails, spatial-intelligence, 3d-world-model, fei-fei-li, justin-johnson, a16z, nvidia, autodesk, series-a, world-model]
last_enriched: 2026-04-05
email_status: contacted
last_contact:
last_updated: 2026-04-13
---

## Overview

World Labs is a spatial intelligence AI company co-founded by Dr. Fei-Fei Li (CEO, also Stanford AI Lab), Justin Johnson, Christoph Lassner, and Ben Mildenhall. They build foundation world models that can perceive, generate, reason, and interact with 3D spatial environments. Their first product "Marble" generates persistent, navigable 3D worlds. They raised $1.23B total (incl. $1B Series B round in Feb 2026 + $200M from Autodesk) at a $5B valuation. Justin Johnson opened Claru's Wave 4 email.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2024 |
| Funding | $1.23B total: $230M Series A (launched Oct 2024, a16z, NVIDIA/NVentures), $1B Series B (Feb 2026), $200M from Autodesk (strategic) |
| Valuation | $5B (as of Feb 2026) |
| Size | ~100-200 (est.) |
| CEO | Dr. Fei-Fei Li (co-founder; also Stanford AI Lab) |
| Key co-founders | Justin Johnson, Christoph Lassner, Ben Mildenhall |
| Location | Palo Alto, CA |
| Clients | Autodesk (strategic partner), gaming/entertainment, 3D design industries |
| Key product | Marble — 3D world generation platform; spatial intelligence foundation models |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Fei-Fei Li | CEO / Co-founder | — | Low (Claru reached Justin) |
| Justin Johnson | Co-founder | — | High (opened Wave 4 email) |
| Christoph Lassner | Co-founder | — | Low |
| Ben Mildenhall | Co-founder | — | Low |

## Hiring Signals

Active hiring at scale given $1B raise. Likely hiring CV engineers, 3D scene researchers, and data teams.

## What They've Actually Shipped

- **Marble**: First product — generates spatially consistent, high-fidelity, persistent 3D worlds that users can navigate, edit, and inhabit. Built on their spatial intelligence foundation model.
- **Spatial intelligence research**: Core capability = understanding 3D structure from visual input, generating coherent 3D environments, enabling navigation and interaction in generated spaces.
- **Autodesk partnership**: Autodesk's $200M strategic investment suggests integration into design/AEC workflows (architecture, engineering, construction).

## Data Gap / Relationship

World Labs builds models that understand the 3D physical world from video. They need: (1) diverse real-world video from many environments, viewpoints, and lighting conditions to train 3D spatial understanding, (2) egocentric video is particularly valuable — first-person perspective provides natural data for learning depth, scale, and spatial relationships. Claru's 386K+ egocentric clips across 100+ cities are directly relevant. Spatial intelligence models need the kind of grounded, diverse, real-environment video that Claru systematically collects. Justin opened the email — the signal is there, the follow-up needs substance.

## Pitch Angle

Follow up on Justin's email open with a concrete data angle: "We've collected 400K+ egocentric clips across 100+ cities — diverse environments, lighting, activity types. Spatial intelligence models trained on curated real-world video generalize better than internet-scraped datasets. We'd like to share a sample focused on scene diversity and egocentric POV." Reference Fei-Fei Li's own ImageNet philosophy: curated, labeled, diverse data is what produces capable models. Claru is doing for physical world video what ImageNet did for image classification.

## Related Companies

- [physical-intelligence](physical-intelligence.md) — Physical AI foundation models
- [decart-ai](decart-ai.md) — Real-time world model (different angle but similar spatial reasoning need)
- [skild-ai](skild-ai.md) — Foundation model for robotics

## Sources

- [PYMNTS: World Labs raises $230M to build spatially intelligent AI](https://www.pymnts.com/news/investment-tracker/2024/world-labs-raises-230-million-to-build-spatially-intelligent-ai/)
- [FoundersX: World Labs raises $1B](https://www.foundersx.com/blog/world-labs-raises-1-billion-to-advance-spatial-intelligence---pioneering-ai-that-understands-the-physical-world)
- [Autodesk: $200M investment in World Labs](https://adsknews.autodesk.com/en/news/autodesk-invests-in-world-labs/)
- [Crunchbase: World Labs](https://www.crunchbase.com/organization/world-labs)
- [World Labs homepage](https://www.worldlabs.ai/)
- [World Labs About page](https://www.worldlabs.ai/about)
- [Radical Ventures: Introducing World Labs](https://radical.vc/introducing-world-labs/)
- Internal: pipeline-status.md (Justin Johnson opened Wave 4 email)
