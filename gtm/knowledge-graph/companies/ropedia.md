---
type: company
state: active
side: supply
name: Ropedia
slug: ropedia
domain: ropedia.com
attio_id: null
relationship: supply-side-competitor
vertical: physical-ai-data
icp_score: 90
stage: researched
tags: [egocentric, robotics, collection, funded-2025, hardware-capture, singapore, open-dataset, physical-ai, world-models]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Ropedia is building data infrastructure for spatial and physical intelligence. They design proprietary wearable capture hardware (HOMIE), collect massive-scale egocentric multimodal human experience data, and reconstruct it into structured 4D datasets for robotics/world model training. Founded late 2025 in Singapore. Seed round of "tens of millions" announced March 2026. Released Xperience-10M (10M trajectories, 10K hours, ~1 PB) as an open research dataset at NVIDIA GTC on March 16, 2026 -- the largest egocentric 4D dataset in existence.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | Late 2025 |
| Entity | ROPEDIA PTE. LTD. (Singapore) |
| Funding | "Tens of millions" USD seed (Mar 2026). Google/NVIDIA/Amazon angel investors + unnamed Asia-based USD VC funds. DeepDive Capital (ShenDu Capital) as exclusive financial advisor. |
| Size | ~15-30 estimated (hiring hardware engineers, ops managers, HR lead) |
| CEO | Dr. Zhaoxi Chen (Tsinghua BS, NTU PhD; built Meta's optical mocap system) |
| CTO | Dr. Fangzhou Hong (Tsinghua grad, NTU PhD; Meta first-person multimodal intelligence) |
| Chief Scientist | Prof. Ziwei Liu (NTU associate professor, computer vision) |
| Scientific Committee Chair | Prof. Jianqing Lu (NTU President's Chair Professor, CVPR 2026 Program Chair) |
| Location | Singapore (Orchard area per job listings) |
| Clients | "Over a dozen embodied AI and spatial intelligence companies in North America" (unnamed, per Pandaily) |
| Key product | Xperience-10M dataset + HOMIE capture platform |
| Partners | None named publicly |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Dr. Zhaoxi Chen | CEO & Co-Founder | partnerships@ropedia.com (generic) | Domain known, personal email not found |
| Dr. Fangzhou Hong | CTO & Co-Founder | -- | -- |
| Prof. Ziwei Liu | Chief Scientist | -- | NTU faculty, likely advisory |
| Prof. Jianqing Lu | Scientific Committee Chair | -- | NTU faculty, advisory |

## Hiring Signals

- **Hardware System Engineer** (Singapore, 2-5 yrs): Integrating multi-camera, IMU, audio into capture hardware. Customizing embedded Linux. Compensation "competitive with top-tier tech giants" + early equity.
- **Operation Manager** (Singapore, Orchard): Multi-site coordination, reports to management. Implies distributed collection operations.
- **Head of People / HR Lead** (Singapore, Jobstreet): Scaling the team.
- All postings emphasize "early-stage" and "significant early-team equity" -- still in build mode.

## What They've Actually Shipped

### HOMIE Capture Platform (2025)
- Head-mounted wearable device for frictionless egocentric data capture
- 6 video streams: 4 fisheye cameras + 2 rectified stereo cameras
- Additional sensors: stereo depth, audio, IMU (accelerometer + gyroscope), camera pose/SLAM
- Proprietary 4D reconstruction algorithms for hand mocap, full-body mocap, depth recovery
- Claimed "mass production with batch delivery underway" as of March 2026
- Marketed as reducing collection cost by 50x vs. traditional lab capture

### Xperience-10M Dataset (March 16, 2026)
- 10M experiences/trajectories, 10,000 hours of synchronized first-person recording
- 2.88B RGB frames, 720M depth frames, 576M pose+mocap frames, 7.2B IMU frames
- 16M caption sentences, 200M caption words, 350K+ unique objects tracked
- ~1 PB total storage, 39,000 km total trajectory length
- 6,000-word vocabulary with hierarchical language annotations (task > subtask > action > interaction > objects)
- **License: Research/non-commercial only.** Gated access via DocuSign. No commercial license available.
- Available on Hugging Face (ropedia-ai/xperience-10m)

### GitHub / Open Source
- HOMIE-toolkit: sample code for loading/visualizing dataset
- xperience-10m-sample: coffee-making demo episode

## Data Gap (why they'd need Claru -- or why they're a threat)

### Where Ropedia is STRONGER than Claru
1. **Sensor stack is best-in-class.** 6 video streams + stereo depth + hand/body mocap + IMU + audio in a single wearable. Nobody else has this.
2. **Scale is unprecedented.** 10K hours, 10M trajectories, 1 PB. Dwarfs every other egocentric dataset.
3. **Academic credibility.** NTU faculty on leadership team, GTC keynote launch, CVPR 2026 program chair as advisor.
4. **Hardware-first approach.** They own the capture device, not relying on iPhones or third-party rigs.
5. **Reconstruction pipeline.** Proprietary 4D algorithms extract mocap/depth/pose from raw sensor data automatically.

### Where Ropedia is WEAKER
1. **Singapore-only collection ops.** All job postings are Singapore. No evidence of collectors outside SG. Their "North America clients" claim doesn't mean NA collection.
2. **Zero named commercial clients.** "Over a dozen" is claimed but none named. Dataset is research-licensed only. No evidence of paid commercial data delivery.
3. **No human annotation layer.** Their pipeline is hardware capture + algorithmic reconstruction + automated captions. No human QA or manual annotation mentioned anywhere.
4. **Open-source-first strategy locks out enterprise.** Research license on HuggingFace means frontier labs can use it for free. Hard to monetize the dataset itself.
5. **Hardware dependency.** HOMIE must be physically deployed. Can't scale collection by just adding contributors with smartphones -- need to manufacture and ship devices.
6. **No diversity of environments.** 36kr article implies mostly domestic/daily-life scenarios in Singapore. No industrial, factory, outdoor, or multi-geography coverage visible.

## Competitive Position

Ropedia is the most technically impressive company in the egocentric robotics data space. Their sensor stack and reconstruction pipeline are a generation ahead of Mecka (iPhone-only) and most competitors. However, their business model is unclear:

- **Open dataset** gives them research credibility but no revenue moat
- **Hardware-first** gives them quality control but limits scaling velocity
- **Singapore-only** ops mean they can't serve geographically diverse collection requests
- **No human annotation** means their data is algorithmically labeled -- fine for pretraining, insufficient for fine-tuning or evaluation

**Threat level to Claru: MEDIUM-HIGH.** If a frontier lab just needs massive-scale egocentric pretraining data, Xperience-10M is free and better-instrumented than anything Claru offers. But for custom collection in specific environments/geographies, human-verified annotations, or commercial-licensed deliverables, Ropedia can't deliver today.

**Partnership potential: HIGH.** Ropedia has the best sensor stack but limited geography and no annotation layer. Claru has 2,000+ collectors in 100+ cities with dense human annotation. A partnership where Claru deploys HOMIE devices through its collector network would be formidable. Alternatively, Ropedia's North American clients who need custom collection beyond what the open dataset covers are prime Claru prospects.

## Pitch Angle (if approaching as partner)

"Your Xperience-10M dataset is remarkable -- best sensor stack in the industry. But your clients will need custom collection in environments and geographies beyond Singapore. We have 2,000+ trained collectors in 100+ cities who could deploy HOMIE devices at scale, plus a human annotation pipeline for the quality layer your automated captions can't cover. Let's talk about co-delivery."

## Pitch Angle (if approaching their clients)

"Xperience-10M is great for pretraining, but it's research-licensed, Singapore-collected, and algorithmically annotated. When you need commercial-licensed data from specific environments -- kitchens in Texas, warehouses in Germany, factories in Japan -- with human-verified annotations, that's what we do."

## Email Thread

No outreach sent yet. Not in Attio. No personal emails found -- only partnerships@ropedia.com (generic).

## Related Companies

- [mecka-ai](mecka-ai.md) -- Similar egocentric data play but iPhone-based, lower sensor quality, Canada ops
- [cortex-ai](cortex-ai.md) -- YC upstart, nothing shipped
- [avala-ai](avala-ai.md) -- Competitor doing what Claru does (collection + annotation)

## Open Questions

1. Who are the "dozen+ North American embodied AI clients"? Are they paying customers or research collaborators using the free dataset?
2. Is HOMIE actually in mass production or is that aspirational? Job postings suggest they're still hiring hardware engineers.
3. What is the actual funding amount? "Tens of millions" from Pandaily could mean $20M or $80M.
4. Are Google/NVIDIA/Amazon angels acting in personal capacity or is there strategic investment from those companies?
5. Will they eventually offer a commercial license for Xperience-10M or keep it research-only?

## Sources

- [Xperience-10M on Hugging Face](https://huggingface.co/datasets/ropedia-ai/xperience-10m)
- [Xperience-10M blog post](https://ropedia.com/blog/20260316_xperience_10m)
- [Ropedia GTC announcement on X](https://x.com/ropedia_ai/status/2033715092467159293)
- [AK on X re: Xperience-10M](https://x.com/_akhaliq/status/2033943499721130171)
- [36kr: OpenClaw Can't Fry Rice -- Ropedia Releases Human Experiences](https://eu.36kr.com/en/p/3726690637249159)
- [Pandaily: Ropedia Raises Tens of Millions in Seed Funding](https://pandaily.com/ropedia-raises-tens-of-millions-in-seed-funding-to-build-robotics-data-infrastructure/)
- [Infor Capital: Ropedia Raises Seed Funding](https://inforcapital.com/news/ropedia-raises-tens-of-millions-in-seed-funding-to-build-robotics-data-infrastructure/)
- [Longbridge: Ropedia completes seed round](https://longbridge.com/en/news/279189173)
- [Zhaoxi Chen on Crunchbase](https://www.crunchbase.com/person/zhaoxi-chen-357b)
- [Ropedia introducing blog post](https://ropedia.com/blog/20251216_introducing_ropedia)
- [Hardware System Engineer job listing](https://www.foundit.sg/job/hardware-system-engineer-ropedia-pte-ltd-singapore-42373097)
- [Operation Manager job listing](https://grabjobs.co/singapore/job/full-time/customer-service-guest-services/operation-manager-152402516)
- [Head of People job listing](https://sg.jobstreet.com/job/89687727)
- [Ropedia on GitHub](https://github.com/Ropedia)
- [Ropedia homepage](https://ropedia.com/)
