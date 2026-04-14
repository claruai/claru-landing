---
type: company
state: prospect
side: supply
name: Cortex AI
slug: cortex-ai
domain: cortexrobot.ai
attio_id: 14d22918-5e39-4958-bea8-655c6d7b05ac
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 95
stage: researched
tags: [egocentric, robotics, workplace-data, funded-2025, yc-f25, marketplace-model, singapore, san-francisco]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Cortex AI is building a marketplace for real-world robotics data, connecting factories and workshops that host data-collection sessions with frontier robotics labs that need egocentric video, robot trajectories, and human-in-the-loop evaluation data. Founded 2025 by Lucas Ngoo (Carousell co-founder/CTO). Exited stealth Oct 2025, raised $6M seed Dec 2025, YC F25 batch. As of April 2026, no publicly available dataset, no named clients, no disclosed data volume -- the website is a landing page with a contact form.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2025 |
| Funding | $6M seed (Dec 2025). Investors: Y Combinator, Matrix Partners, 500 Global, Golden Gate Ventures, Liquid 2 Ventures, Pioneer Fund. Angels: Gokul Rajaram (Marathon Mgmt), Kaz Nejatian (Opendoor CEO), Taro Fukuyama. |
| Size | 3 employees (YC profile). 4 open roles as of Apr 2026. |
| CEO | Lucas Ngoo (Co-founder/CTO of Carousell, scaled to $1.1B valuation. Marketplace background, zero robotics.) |
| Location | San Francisco (HQ per YC). Singapore (3 of 4 job postings). |
| Clients | None named publicly. Claims "frontier labs" on website. |
| Key product | Cortex Marketplace -- workplaces get paid to host egocentric-capture and robot-teleop sessions. Three claimed data types: egocentric video (hand/body pose, depth, subtask labels), robot trajectories (manipulators/humanoids), human-in-the-loop rollouts. |
| YC batch | F25 (Demo Day ~Mar 24, 2026) |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Lucas Ngoo | Founder & CEO | lucas@cortexrobot.ai | Pattern-derived (RocketReach shows l******@cortexrobot.ai). Not verified. |
| (Unknown) | -- | hello@cortexrobot.ai | Listed on /ego/ page contact form |

Only Lucas Ngoo is publicly identified as a founder. The Oct 2025 Tech in Asia headline says "ex-Carousell leaders" (plural) but no other names surfaced. Marcus Tan and Quek Siu Rui (other Carousell co-founders) are not confirmed as Cortex team. LinkedIn company page shows no other named employees.

## Hiring Signals

4 open positions as of Apr 2026 (cortexrobot.ai/careers):

1. **Robotics Hardware Engineer** -- Full-time, Singapore
2. **Software Engineer / Intern** -- Full-time or Internship, Singapore
3. **Robot Operator and Technician** -- Full-time, Singapore + San Francisco
4. **Robot Operator cum Procurement Officer** -- Full-time, Singapore

Notable: NO data annotator, data collector, or operations roles posted. All roles are robotics/engineering focused. This suggests they are building robot hardware and teleop tooling, not a collection workforce. Singapore-heavy hiring implies ops center is there, not SF.

## What They've Actually Shipped

**Nothing publicly verifiable as of Apr 2026.**

- Website (cortexrobot.ai) is a landing page with no sample data, no dataset catalog, no metrics, no case studies, no testimonials.
- Egocentric data page (/ego/) has a "Request Data" form and a "Contribute Your Workplace" CTA. No data specifications (hours, clips, environments, formats).
- No published dataset on any open-source platform (HuggingFace, GitHub, etc.).
- No blog posts, technical reports, or whitepapers.
- YC Demo Day was ~Mar 24, 2026 -- the company is still in pitch mode.
- The "Cortex Marketplace" is described in future tense ("is launching") across multiple sources.

## Data Gap (why they'd need Claru)

1. **No collection workforce.** Zero data collector/annotator roles posted. They have 3 employees and are hiring robot operators, not collectors. To deliver workplace egocentric data at scale, they need bodies in facilities with cameras -- they don't have them.
2. **No annotation pipeline.** No evidence of any labeling infrastructure. Their claimed annotations (hand/body pose, depth, subtask labels) require significant human QA that 3 people cannot produce.
3. **Singapore-centric ops.** 3 of 4 roles are Singapore-based. Any North American or European client expecting local data collection will exceed their footprint immediately.
4. **No multi-sensor capture.** Claims depth and pose but no evidence of hardware beyond standard cameras. No stereo rigs, no IMU, no LiDAR mentioned anywhere.
5. **Marketplace cold-start problem.** Their model requires both workplace hosts AND robotics lab buyers. With no named clients on either side, the marketplace has zero liquidity.
6. **Zero shipped data.** Selling to frontier labs requires sample packs, benchmarks, and format documentation. They have none of this publicly.

## Pitch Angle (subcontractor)

"You raised $6M to build a data marketplace for robotics, but your team is 3 people building robot teleop tooling in Singapore. When your first frontier lab client asks for 500 hours of North American workplace egocentric video with dense annotations next quarter, you need a collection partner who can actually deliver. We have 2,000+ trained collectors across 100+ cities, a proven annotation pipeline with 3M+ completed annotations, and we've already shipped egocentric datasets to labs. We can white-label the collection side so you focus on the marketplace and robot tooling. Your marketplace sells the data, we produce it."

## Competitive Position

- Cortex is a **marketplace play** (connect supply and demand), Claru is an **operations play** (we ARE the supply). These are complementary, not competing.
- Lucas Ngoo's marketplace DNA (Carousell) means he'll try to build a two-sided platform, not an ops army. This is exactly where subcontracting fits.
- Compared to Mecka AI (the other egocentric competitor): Mecka has 15 employees, gig workers, and a co-launched dataset with Scale AI. Cortex has 3 employees and nothing shipped. Cortex is further behind.
- The $6M and YC brand give Cortex credibility with buyers, but they'll burn through that cash fast once they try to stand up actual data collection ops. Partnership before they build in-house is the window.

## Email Thread

No outreach sent yet. Attio deal exists: `14d22918-5e39-4958-bea8-655c6d7b05ac` (Cortex AI -- Supply Partnership).

## Related Companies

- [mecka-ai](mecka-ai.md) -- Direct competitor, also egocentric data for robotics, further along operationally
- 1x-technologies -- Demand-side target, potential Cortex customer
- build-ai -- Another early-stage robotics data upstart

## Sources

- [YC Company Profile](https://www.ycombinator.com/companies/cortex-ai)
- [Cortex AI Website](https://cortexrobot.ai/)
- [Cortex AI Egocentric Data Page](https://cortexrobot.ai/ego/)
- [Cortex AI Careers](https://cortexrobot.ai/careers/)
- [Tremendous Blog -- Investment Post (Dec 2025)](https://tremendous.blog/2025/12/24/meet-my-latest-investment-cortex-ai/)
- [Tech in Asia -- Exits Stealth (Oct 2025)](https://www.linkedin.com/posts/tech-in-asia_ex-carousell-leaders-robotics-firm-activity-7382271716653371392-1DEZ)
- [Tech in Asia -- $6M Seed](https://www.linkedin.com/posts/tech-in-asia_cortex-ai-nets-6m-to-collect-real-world-activity-7420034587223007232-3-kQ)
- [500 Global -- $6M Seed](https://www.linkedin.com/posts/500global_cortex-ai-nets-6m-to-collect-real-world-activity-7404551724520103936-a2ZY)
- [YC LinkedIn Launch Post](https://www.linkedin.com/posts/y-combinator_cortex-ai-yc-f25-is-building-the-worlds-activity-7393739236732096512-Pclw)
- [VulcanPost -- Lucas Ngoo AI Focus](https://vulcanpost.com/889206/carousell-co-founder-lucas-ngoo-reveals-new-biz-focus-ai/)
- [Nestia -- $6M Funding Details](https://news.nestia.com/detail_share/13909240?media_type=1)
- [Taro Fukuyama Investment Tweet](https://x.com/taro_f/status/1990464956035408099)
- [Lucas Ngoo LinkedIn](https://www.linkedin.com/in/lucasngoo/)
- [Crunchbase](https://www.crunchbase.com/organization/cortex-ai)
- [RocketReach -- Email Pattern](https://rocketreach.co/lucas-ngoo-email_346030)
- [Facebook/Tech in Asia -- Investor List](https://www.facebook.com/techinasia/posts/cortex-ai-founded-by-lucas-ngoo-has-raised-us6m-in-seed-funding-from-investors-i/1318173953678941/)
