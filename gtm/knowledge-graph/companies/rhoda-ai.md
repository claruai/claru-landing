---
type: company
state: active
side: demand
name: Rhoda AI
slug: rhoda-ai
domain: rhoda.ai
attio_id: 052629b9
relationship: demand-side
vertical: physical-ai
icp_score: 88
stage: meeting_booked
tags: [active-pipeline, call-stalled, robotics, manufacturing, logistics, DVA-model, video-predictive-control, alex-bergman, jagdeep-singh, series-a]
last_enriched: 2026-04-05
email_status: contacted
last_contact: 2026-04-07
last_updated: 2026-04-13
---

## Overview

Rhoda AI is a well-funded robotics AI startup ($450M Series A, $1.7B valuation, March 2026) building "Direct Video Action" (DVA) models — a proprietary architecture that pre-trains on internet-scale video (hundreds of millions of videos) to learn motion, physics, and physical interaction priors, then fine-tunes on robot data for specific embodiments. They exited stealth in March 2026 targeting manufacturing and logistics automation. Alex Bergman is a co-founder. Claru has been in contact with Alex but call scheduling has stalled.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2024 |
| Funding | $450M Series A (March 2026, $1.7B valuation). Led by Premji Invest. |
| Size | Undisclosed (stealth until Mar 2026) |
| CEO | Jagdeep Singh (co-founder) |
| CTO | Florian... wait — Florian Wenzel is at Mirelo. Rhoda's CTO is Eric Chan. |
| Key co-founders | Jagdeep Singh, Eric Chan, Gordon Wetzstein, Andrew Wooten, Changan Chen, Steve Tirado, Alex Bergman, Vincent Clerc |
| Location | Undisclosed (likely US, given investor profile) |
| Clients | Undisclosed industrial manufacturing and logistics partners (completed component-processing workflow test, under 2 min/cycle) |
| Key product | FutureVision platform — Direct Video Action (DVA) model for industrial robotics |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Jagdeep Singh | CEO / Co-founder | — | Low |
| Alex Bergman | Co-founder | abergman@rhoda.ai | Confirmed (in active outreach) |
| Eric Chan | Co-founder | — | Low |
| Gordon Wetzstein | Co-founder | — | Low (Stanford professor) |

## Hiring Signals

Freshly out of stealth with $450M — almost certainly hiring aggressively across engineering, data, and ops roles.

## What They've Actually Shipped

- **FutureVision**: DVA model that pre-trains on 100M+ internet videos for physics/motion priors, then robot-specific fine-tuning. Bridges perception and control.
- **Industrial deployment test**: Completed a component-processing workflow in under 2 minutes per cycle without human intervention, exceeding customer KPIs.
- **FutureVision approach**: Unlike behavior cloning or RL-only, DVA uses video prediction as the control signal — predicting what the scene should look like next and using that to drive robot motion.

## Data Gap / Relationship

Rhoda's DVA model is explicitly built on massive video pre-training (100M+ videos from the internet). They need: (1) internet-scale video corpora for pre-training, and (2) high-quality robot/manipulation demonstration data for fine-tuning. Claru's egocentric video corpus directly addresses the fine-tuning side — realistic human action video with egocentric POV is exactly what DVA needs to learn hand-object manipulation. There's also a case for Claru providing curated video for pre-training (naturalistic, diverse, physically-grounded). The stalled call with Alex Bergman needs a fresh angle.

## Pitch Angle

Don't re-ask about the calendar. Reach out with something concrete: a curated sample pack specifically assembled for DVA-style pre-training (naturalistic human-object interaction, diverse environments, egocentric POV), accompanied by a brief explanation of why Claru's collection methodology produces better pre-training signal than scraped internet video (controlled, licensed, diverse, no copyright risk). Let the samples do the talking. DVA needs both scale (internet-video-style) and quality (curated, licensed) — Claru sits at that intersection.

## Related Companies

- [physical-intelligence](physical-intelligence.md) — Competitor to Rhoda in physical AI foundation models
- [perceptron-ai](perceptron-ai.md) — Another physical world foundation model startup
- [skild-ai](skild-ai.md) — Foundation model for robotics ($1.83B)

## Sources

- [Bloomberg: Rhoda valued at $1.7B (March 2026)](https://www.bloomberg.com/news/articles/2026-03-10/ai-robotics-startup-rhoda-valued-at-1-7-billion-in-new-funding)
- [BusinessWire: Rhoda exits stealth with $450M Series A](https://www.businesswire.com/news/home/20260310715139/en/Rhoda-AI-Exits-Stealth-with-$450-Million-Series-A-to-Bring-Robots-Out-of-the-Lab-and-Into-the-Real-World)
- [RoboticsTomorrow: Rhoda coverage](https://www.roboticstomorrow.com/news/2026/03/10/rhoda-ai-exits-stealth-with-450-million-series-a-to-bring-robots-out-of-the-lab-and-into-the-real-world/26240/)
- [Menlo Times: How Rhoda brings robots into real-world environments](https://www.menlotimes.com/post/how-rhoda-ai-plans-to-bring-robots-from-controlled-laboratory-demonstrations-into-real-world-environ)
- [Rhoda AI homepage](https://www.rhoda.ai/)
- [Rhoda AI team page](https://www.rhoda.ai/team)
- Internal: pipeline-status.md (Alex Bergman, call stalled)
