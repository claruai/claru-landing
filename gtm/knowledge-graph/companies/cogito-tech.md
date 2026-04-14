---
type: company
state: prospect
side: supply
name: Cogito Tech
slug: cogito-tech
domain: cogitotech.com
attio_id: 52b64c06-4c2b-51b5-9698-946b85e49f83
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 85
stage: researched
tags: [annotation, robotics, teleoperation, robostream, ego-exo, lidar, bpo-origin, ft-fastest-growing, iso-certified, new-york]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Cogito Tech is a Levittown, NY-based AI training data company founded in 2011 by Rohan Agrawal. Core business is traditional annotation/labeling (NLP, CV, content moderation) for enterprise clients. In early 2026 they launched **RoboStream** (robostream.ai), a dedicated robotics data vertical covering ego-exo capture, MoCap, sensor fusion, and teleoperation. Rohan also runs **Anolytics**, a sister brand focused on lower-cost annotation outsourcing -- same person, same Levittown address.

The company has real scale (1,000+ employees, FT Americas Fastest-Growing 3 consecutive years, 400% growth in 18 months) and real enterprise clients (OpenAI, Medtronic, Siemens, Amazon, Unilever). But the robotics vertical is brand new, and the gap between what their marketing claims and what they've demonstrably shipped is wide.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2011 |
| Funding | Unfunded (bootstrapped). No Crunchbase funding rounds listed. |
| Size | 1,001-5,000 employees (LinkedIn). 5 at HQ (Levittown). Bulk is offshore annotation workforce. |
| Revenue | ~$44.7M (Latka, 2024 estimate). Unverified. |
| CEO | Rohan Agrawal (also CEO of Anolytics) |
| SVP Corporate Dev | Matthew McMullen (matthew.m@cogitotech.com) |
| HQ | 16 Horseshoe Lane, Levittown, NY 11756 |
| Clients | OpenAI, Medtronic, Siemens Healthineers, Verizon, Merck, Unilever, Amazon, NBCUniversal, Stryker |
| Certifications | ISO 9001, ISO 27001, SOC 2 Type II, GDPR, HIPAA, CCPA |
| Key product | RoboStream (robostream.ai) -- robotics data vertical |
| Recognition | FT Americas Fastest-Growing Companies 2024, 2025, 2026 (3 consecutive years) |
| Sister brand | Anolytics (anolytics.ai) -- same CEO, same address, lower-cost annotation |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Rohan Agrawal | CEO / Founder | rohan@cogitotech.com | Pattern-derived, not verified |
| Matthew McMullen | SVP Corporate Development | matthew.m@cogitotech.com | Confirmed (press release) |

Background on Rohan: MS Biomedical Engineering from Johns Hopkins. Former Senior Associate Scientist at Pfizer (therapeutic proteins). Zero robotics background -- came from BPO/data labeling, pivoted to AI annotation, now pivoting again to robotics.

## Hiring Signals

- **No active robotics job postings** on cogitotech.com/careers as of 2026-04-05. Careers page only lists generic categories: "Computer Vision - Annotation & Labelling," "Operations," "Admin," "NLP"
- **No teleoperation operator roles** listed anywhere -- contradicts claims of expert teleop teams
- **Hackster.io project** (Feb 2026) lists RoboStream with only 3 team members and a hardware BOM (Jetson Orin NX, Oculus Gear VR, STM32, BLDC motors). Looks like a prototype, not production infrastructure
- **No LinkedIn headcount growth** specific to RoboStream. Anolytics staff (annotators in India) are the bulk of the 1,000+ count

## What They've Actually Shipped

**Verified:**
- 10+ years of traditional annotation (NLP, CV, content moderation) at scale
- 1,000+ enterprise clients across healthcare, finance, automotive, e-commerce
- ISO/SOC2/GDPR compliance stack
- DataSum certification framework (ethical data sourcing)
- FT recognition 3 years running -- real revenue growth is happening
- Hackster.io hardware prototype (Feb 2026): Jetson Orin NX + sensors + AWS IoT/EC2

**Claimed but unverified:**
- Ego-Exo4D capture pipelines with synchronized sensor fusion
- Ultra-low-latency teleoperation via dedicated leased lines
- Expert operators (robotics engineers, aerospace technicians) providing real-time corrections
- MoCap sequences with multichannel audio, eye gaze, IMU, 3D pose
- Purpose-built sensors, edge devices, and compute units
- VR-humanoid imitation learning systems
- Digital twin integration and sim-to-real

**Red flags:**
- RoboStream site shows 3 unnamed client logos, zero case studies, zero named robotics clients
- Teleoperation page describes surgery/bomb disposal use cases but no evidence of actual deployments
- Hardware BOM on Hackster.io is a single prototype rig, not fleet infrastructure
- No robotics-specific hires on LinkedIn or careers page
- robostream.ai domain registered recently; content reads like aspirational marketing

## Data Gap (why they'd need Claru)

1. **No collection network.** RoboStream claims data collection but shows one prototype rig and 3 team members. No evidence of deployed collectors in the field
2. **No ego-centric video at scale.** Marketing references Ego-Exo4D (Meta's academic dataset) but no evidence they contributed to it or have comparable in-house capture
3. **No geographic diversity.** Annotation workforce is offshore (India). Collection infrastructure appears to be a single hardware prototype in Levittown
4. **Annotation-first DNA.** They know how to label data someone else collects. They don't know how to operate a distributed collection network across 100+ cities
5. **Teleoperation is vaporware until proven.** Claiming "leased-line ultra-low-latency teleop for surgery and bomb disposal" with no named deployments, no operator hiring, and a 3-person Hackster project

## Pitch Angle (subcontractor)

"You've built the annotation muscle and enterprise trust over a decade -- OpenAI, Medtronic, Siemens. RoboStream is the right bet. But your robotics clients will need real-world collection at scale before you can annotate anything. We're the collection layer: 2,000+ trained collectors, 100+ cities, multi-sensor rigs already deployed. You keep the client relationship and annotation revenue. We supply the raw capture you need to make RoboStream real."

Key hook: They're selling ahead of infrastructure. Their enterprise clients will test them. We can be the reason they don't fail the first real robotics data order.

Alternative angle: If they land a robotics client through their existing enterprise relationships (Siemens, Medtronic, Stryker are all building physical AI), they'll need collection capacity overnight. Position as the speed-to-market partner.

## Related Companies

- [sama](sama.md) -- Larger annotation BPO, similar trajectory of pivoting to robotics
- [toloka](toloka.md) -- Crowdsource annotation platform, also eyeing robotics
- [cloudfactory](cloudfactory.md) -- Similar BPO annotation model, enterprise compliance focus
- [mecka-ai](mecka-ai.md) -- Opposite approach: collection-first, gig workers, iPhone-only
- [cortex-ai](cortex-ai.md) -- YC robotics data startup, nothing shipped yet
- [lxt](lxt.md) -- Annotation BPO competitor

## Sources

- [RoboStream.ai](https://robostream.ai/)
- [Cogito Tech - Robotics](https://www.cogitotech.com/industries/robotics/)
- [Cogito Tech - Teleoperation](https://www.cogitotech.com/industries/robotics/teleoperation/)
- [RoboStream on Hackster.io (Feb 2026)](https://www.hackster.io/robostream/robotics-data-collection-cd157e)
- [Cogito Tech FT Recognition (GlobeNewsWire, Mar 2025)](https://www.globenewswire.com/news-release/2025/03/06/3038581/0/en/Cogito-Tech-Named-Among-America-s-Fastest-Growing-Companies.html)
- [FT Recognition 3rd Year (OpenPR, 2026)](https://www.openpr.com/news/4452631/cogito-tech-recognized-by-financial-times-as-one-of-the-americas)
- [Top 7 Teleoperation Providers 2026 (Labellerr)](https://www.labellerr.com/blog/top-teleoperation-companies-humanoid-robotics/)
- [Rohan Agrawal - Crunchbase](https://www.crunchbase.com/person/rohan-agrawal)
- [Rohan Agrawal - LinkedIn](https://www.linkedin.com/in/ra-cogito/)
- [Cogito Tech - LinkedIn](https://www.linkedin.com/company/cogito-tech-ltd)
- [Anolytics - Tracxn](https://tracxn.com/d/companies/anolytics/__UKDGwgO4sMoRHtKxmfOtXYKL8rHbmnEJt9Z4RXNdsoY)
