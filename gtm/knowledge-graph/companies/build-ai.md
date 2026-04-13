---
type: company
state: prospect
side: supply
name: Build AI
slug: build-ai
domain: buildai.world
attio_id: null
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 95
stage: researched
tags: [egocentric, robotics, collection, funded-2025, open-source, se-asia-factories, raw-video-only]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Build AI is building the world's largest egocentric video dataset for robotics. They deploy modified smart glasses on factory workers in Southeast Asia and open-source the raw MP4 footage. Founded 2025 by Eddy Xu (18-year-old Columbia dropout). Shenzhen-based operations, originally SF.

**Critical distinction:** buildai.world is Eddy Xu's company. build.ai is Cerb (completely different company). Attio currently has the WRONG "Build AI" record pointing to build.ai -- do not confuse them.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2025 (Xu dropped out of Columbia April 2025) |
| Funding | $22M total per eddy.build. Sources report $5M seed (Abstract, Pear, HF0) expanding to $15M. Angels: Balaji Srinivasan (ex-Coinbase CTO), Guillermo Rauch (Vercel CEO), Thomas Wolf (HuggingFace co-founder). ZFellows, Alex Botez also participated. |
| Size | ~5-10 (started as 5-person team in SF Tenderloin, moved to Shenzhen for hardware manufacturing) |
| CEO | Eddy Xu (18-19, Long Island native, Columbia Engineering dropout) |
| CTO | Jonathan Jia (co-founder) |
| Location | Shenzhen (operations/hardware), originally San Francisco |
| Clients | **Zero confirmed customers.** No commercial partnerships disclosed anywhere. |
| Key product | Egocentric-100K dataset (open-source, Apache 2.0) |
| Email | eddy@build.ai |
| Twitter | @eddybuild |
| HuggingFace | builddotai |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Eddy Xu | CEO / Co-founder | eddy@build.ai | Confirmed (eddy.build site) |
| Jonathan Jia | CTO / Co-founder | — | Named in Mike Kalil article |
| Caden (last name unknown) | Team member | — | Built "chess glasses" with Eddy per X posts |

## Eddy Xu Background

- Won VEX Robotics National Signature Championship
- Won DECA Business World Championship
- Founded edtech startup with 178K users in 90 days (sold)
- Founded Omega Robotics in middle school, raised ~$120K
- Turned down $25M+ in equity offers to launch Build AI

## Hiring Signals

- eddy.build says "actively recruiting"
- Team members reportedly left academia, top research labs, and their own companies to join
- Research focus areas listed: active learning, egocentric-native neural compression, body pose transfer (exo-to-ego), 3D head position via VIO

## What They've Actually Shipped

### Egocentric-10K (first release)
- 10,000 hours first-person factory video
- 2,153 workers across 85 factories
- 1.08B frames, 16.4 TB
- 1080p @ 30fps, 128-degree FOV fisheye
- Apache 2.0 license
- Hit #1 on HuggingFace trending
- Clement Delangue (HuggingFace CEO) publicly endorsed it

### Egocentric-100K (10x expansion)
- 100,405 hours of egocentric factory video
- 14,228 workers, 7 hrs average per worker
- 10.8B frames, 2M+ clips (avg 180s each)
- 24.79 TB total, 256p @ 30fps H.265
- Hands visible in 76% of frames
- Active manipulation in 92% of frames
- Calibrated camera intrinsics (OpenCV fisheye model, 4 distortion coefficients)
- 18,000 downloads, ~2M pageviews within weeks of release

### Hardware
- Custom modified smart glasses / head-mounted cameras
- Moved manufacturing to Shenzhen
- Captures: hand movements, object interactions, task order, error recovery

### What is NOT shipped
- **Zero annotation.** Raw MP4 only. No action labels, no temporal segmentation, no object detection, no manipulation phase labeling, no depth, no IMU data.
- **Zero custom tasking.** Workers wear glasses and do their normal jobs. No task protocols, no controlled conditions.
- **Zero QA layer.** No quality metrics, no rejection pipeline, no human review.
- **Zero commercial product.** No API, no platform, no data-as-a-service offering. Everything is open-source.

## Data Gap (why they'd need Claru)

1. **Raw video only.** 100K hours of MP4 is a pile of bytes without annotation. Labs need action labels, object segmentation, temporal boundaries, manipulation phase tagging. Build AI ships none of this.
2. **No annotation team or tooling.** They have zero annotation infrastructure. Building one from scratch takes 6-12 months and millions of dollars. Third parties are already forced to annotate Build AI data themselves (see Kriya below).
3. **No custom collection protocols.** Factory workers do whatever they normally do. No ability to request specific tasks, environments, or scenarios. A lab that needs "pick-and-place with deformable objects in a warehouse" can't get that from Build AI.
4. **No sensor richness.** Monocular fisheye only. No stereo depth, no IMU, no force/torque. Frontier labs (Physical Intelligence, Figure, etc.) increasingly need multi-modal sensor data.
5. **No QA or data quality pipeline.** 14,228 workers with no rejection criteria means significant noise in the dataset. Blurry frames, occluded hands, irrelevant footage all ship uncurated.
6. **Open-source cannibalization.** Apache 2.0 means anyone can use the data for free. Build AI has no moat on the data itself -- only on collection speed and scale.

## Third-Party Annotation (Kriya proves the gap)

Ankit Khandelwal (Mind and Motion Labs) built **Kriya** specifically to add annotations to Build AI's Egocentric-100K data:
- Added Action100M-compatible hierarchical action annotations
- LLM-generated natural language captions
- Structured summaries, action labels, actor information
- Only annotated **5 videos** as a proof-of-concept
- Published on DEV Community: [Kriya-Egocentric-100K](https://dev.to/ankk98/kriya-egocentric-100k-action100m-style-annotations-for-real-world-labor-videos-42jd)

**This is the smoking gun.** An independent developer had to build their own annotation pipeline because Build AI ships zero. If one indie dev needs to do this, every lab consuming this data does too.

## Pitch Angle (partnership / subcontractor)

"Your 100K hours is raw video. Labs need annotation. We add the structured layer that makes your volume contract-ready without you building an annotation team."

Specifics:
- **Offer:** Claru annotates a subset of Egocentric-100K with dense action labels, object segmentation, manipulation phase boundaries. Build AI can sell the annotated version as a premium product while keeping the raw data open-source.
- **Why now:** Build AI has zero revenue and zero commercial product. They need to monetize. Annotated data is the monetization path. We are the fastest way to get there.
- **Why us:** 2,000+ trained annotators, 3M+ completed annotations, video/robotics specialization. We don't compete on collection -- we complement it.
- **Risk:** Eddy is 19, VC-backed, and may try to build annotation in-house. The window is before he hires an annotation team. Once he does, we're competing not complementing.

## Competitive Position

- Build AI = collection at massive scale (SE Asia gig workers, raw MP4, open-source)
- Claru = annotation at quality (trained collectors, controlled environments, dense labels)
- **No overlap.** Build AI does not annotate. Claru does not operate at 100K-hour collection scale in SE Asia. Perfect complement.
- Compared to Mecka AI: Mecka has 30K hrs + academic partnerships (EgoVerse/Scale AI) but also lacks dense annotation. Build AI has 3x the volume but even less structure.
- Compared to Cortex AI (YC): Cortex has shipped nothing. Build AI has shipped the dataset but not the annotation.

## Competitive Landscape (where Build AI sits)

Per Labellerr's "Top 7 Egocentric Data Providers 2026":
1. Labellerr (full-stack capture + annotation)
2. Luel (rights-cleared egocentric video)
3. **Build AI** (largest industrial volume, raw only)
4. Awign (gig workforce scale)
5. Lightwheel / EgoSuite (industrial-scale)
6. Objectways (collection + annotation)
7. Appen (enterprise AI data)

Build AI is positioned as #1 in raw volume but notably has no annotation capability listed.

## Email Thread

No outreach sent yet. Not properly in Attio (wrong company record exists). Email not verified beyond pattern.

## Related Companies

- [mecka-ai](mecka-ai.md) -- Similar upstart, raw collection without annotation, Canada-based
- [cortex-ai](cortex-ai.md) -- YC-backed, nothing shipped
- [sama](sama.md) -- Enterprise annotation, could also target Build AI's data
- [toloka](toloka.md) -- Crowdsourced annotation at scale

## Sources

- [Teen Who Built Largest Manual-Labor Video Dataset (Mike Kalil)](https://mikekalil.com/blog/build-ai-ecocentric-100k-dataset/)
- [Build AI Scales to 100,000 Hours (Humanoids Daily)](https://www.humanoidsdaily.com/news/build-ai-scales-to-100-000-hours-as-data-scaling-becomes-robotics-new-frontier)
- [Build AI Open-Sources 10,000 Hours (Humanoids Daily)](https://www.humanoidsdaily.com/news/build-ai-open-sources-10-000-hours-of-factory-worker-video-to-scale-robot-learning)
- [How Eddy Xu Open-Sourced the Future of Robotics (Open Source Press)](https://www.theopensourcepress.com/how-eddy-xu-open-sourced-the-future-of-robotics/)
- [Build AI's $5M Bet on Human-View Robotics (StartupHub)](https://www.startuphub.ai/ai-news/funding-round/2025/build-ais-5m-bet-on-human-view-robotics/)
- [Egocentric-100K on HuggingFace](https://huggingface.co/datasets/builddotai/Egocentric-100K)
- [Egocentric-10K on HuggingFace](https://huggingface.co/datasets/builddotai/Egocentric-10K)
- [Kriya-Egocentric-100K Annotations (DEV Community)](https://dev.to/ankk98/kriya-egocentric-100k-action100m-style-annotations-for-real-world-labor-videos-42jd)
- [Top 7 Egocentric Data Providers 2026 (Labellerr)](https://www.labellerr.com/blog/top-egocentric-data-providers-robotics/)
- [Eddy Xu personal site](https://www.eddy.build/)
- [@eddybuild on X](https://x.com/eddybuild)
