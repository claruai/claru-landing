---
type: company
state: prospect
side: demand
name: Unitree Robotics
slug: unitree
domain: unitree.com
attio_id: null
relationship: demand-side
vertical: physical-ai
icp_score: 80
stage: researched
tags: [active-pipeline, humanoid, china, G1, H1, VLA, reinforcement-learning, IPO, affordable-humanoid, research-platform, UnifoLM]
last_enriched: 2026-04-05
email_status: contacted
last_contact:
last_updated: 2026-04-13
---

## Overview

Unitree Robotics is a Hangzhou-based Chinese robotics company (founded 2016, Wang Xingxing) making affordable humanoid robots at scale. The G1 ($16K, 127cm) and H1 ($90K, 180cm) are the most widely deployed research humanoids globally. Filed for $610M Shanghai IPO on 335% revenue growth. Targeting 20,000 humanoid shipments in 2026 (up from 5,500 in 2025). In March 2026, they open-sourced UnifoLM-VLA-0, a vision-language-action model allowing G1 to perform household tasks from natural language. They are the de facto global research platform (30+ academic papers using G1 in 2025 alone).

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2016 |
| Funding | Private; filed for $610M Shanghai IPO (2025/2026) |
| Revenue | 335% growth year-over-year (pre-IPO) |
| Size | ~500-1,000 (est.) |
| CEO | Wang Xingxing (founder) |
| Location | Hangzhou, China |
| Clients | Universities, research labs, enterprise robotics teams worldwide; 30+ academic papers in 2025 |
| Key products | G1 humanoid ($16K, 127cm), H1 humanoid ($90K, 180cm), Go2 quadruped, UnifoLM VLA model |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Wang Xingxing | CEO / Founder | — | Low |

## Hiring Signals

IPO preparation + rapid shipment scale (20K target in 2026). Active hiring in hardware and AI.

## What They've Actually Shipped

- **G1 humanoid**: $16K, 127cm research-grade humanoid. Most deployed research platform globally. Can do backflips, breakdancing, manipulation tasks. Ships commercially now.
- **H1 humanoid**: $90K, 180cm — full adult-height humanoid for more advanced applications.
- **UnifoLM-VLA-0 (March 2026)**: Open-sourced vision-language-action model for G1. Enables natural language → household task execution. Uses reinforcement learning + imitation learning.
- **Go2 quadruped**: Widely deployed robot dog (precursor to humanoid line).
- **IPO trajectory**: 5,500 units shipped in 2025 → 20,000 target in 2026. Pre-IPO revenue surge.

## Data Gap / Relationship

Unitree's UnifoLM uses imitation learning — which requires human demonstration video (egocentric, hand-object interactions, household task sequences). At 20,000 units in 2026 and a research platform position, they need massive data diversity to train VLA models that work across the wide range of research use cases. Claru's core value: providing licensed, diverse, curated human demonstration video that academia and commercial Unitree customers can't easily collect themselves. Note: Unitree is a Chinese company — geopolitical and export considerations may affect partnership feasibility. US-side customers of G1 may be a better route to Unitree's data supply chain.

## Pitch Angle

Unitree is likely data-hungry for VLA training but has access to Chinese data sources. The angle is: (1) Western training data — Claru provides North American and European environment footage that Chinese data suppliers don't cover, (2) imitation learning dataset — specifically human hand-object demonstration data in diverse home environments, (3) research labs using G1 may buy data from Claru independently. Consider approaching Unitree's NA/EU research partnerships team rather than their China HQ directly.

## Related Companies

- [k-scale-labs](k-scale-labs.md) — Open-source humanoid competitor (affordable segment)
- [physical-intelligence](physical-intelligence.md) — Foundation model labs who train on Unitree hardware
- [1x-technologies](1x-technologies.md) — Home humanoid competitor

## Sources

- [Unitree G1 product page](https://www.unitree.com/g1/)
- [Robot Report: Unitree unveils G1 for $16K](https://www.therobotreport.com/unitree-robotics-unveils-g1-humanoid-for-16k/)
- [Drones Plus Robotics: Unitree at CES 2026](https://www.dronesplusrobotics.com/post/unitree-robotics-sets-a-new-benchmark-at-ces-2025)
- [Robozaps: Unitree G1 Price & Review 2026](https://blog.robozaps.com/b/unitree-g1-review)
- [OriginOfBots: Unitree G1 specs](https://www.originofbots.com/robot/unitree-g1-by-unitree-robotics-details-specifications-rating)
- Internal: pipeline-status.md
