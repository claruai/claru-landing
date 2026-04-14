---
type: company
state: prospect
side: demand
name: micro1
slug: micro1
domain: micro1.ai
attio_id: 06d4a8d5-702f-5e56-be8e-25a37437effc
relationship: supply-side-competitor
vertical: physical-ai-data
icp_score: 90
stage: researched
tags: [robotics, gig-model, video-collection, annotation, scale-ai-competitor, palo-alto, funded-2025, humanoid-training]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

micro1 is the largest gig-economy data collection platform for humanoid robotics training. Based in Palo Alto, founded 2022 by Ali Ansari (24 yrs old, UC Berkeley CS). The model: thousands of gig workers in 50+ countries mount iPhones on their heads and film themselves doing household chores (cooking, cleaning, laundry, gardening) for ~$15/hr. Videos are annotated by AI + hundreds of human annotators, then sold to robotics companies training humanoids. Claims ~4,000 "robotics generalists" submitting 160,000+ hours of video per month across 71 countries. MIT Technology Review (Apr 1, 2026) profiled the operation and surfaced the quality ceiling problem: workers in tiny apartments struggle for task variety, the data is overwhelmingly domestic chores, and no workers know how their data is used downstream.

Originally a technical talent vetting platform (hiring engineers for AI companies), micro1 pivoted hard into the "human data" business in 2024-2025 as demand from robotics labs exploded. Now positions itself as the "Scale AI of robotics data" -- a direct competitor to Scale AI's data labeling dominance, especially after Meta's $14B Scale AI investment caused AI labs to seek alternatives.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2022 |
| Funding | $1.3M seed (Aug 2023, Dream Ventures, Jason Calacanis, Joshua Browder), $6.6M across early rounds (2023-2024), **$35M Series A** (Sep 2025, 01 Advisors, $500M valuation) |
| Total raised | ~$41.6M |
| Valuation | $500M (Sep 2025) |
| ARR | $50M (Sep 2025, up from $7M at start of 2025) |
| Core team | ~100-326 employees (sources vary). Tracxn claims 3,799 but likely includes gig contractors |
| Gig workforce | ~4,000 "robotics generalists" in 71 countries |
| CEO | Ali Ansari (24, UC Berkeley CS, Stanford AI research) |
| Location | Palo Alto, CA |
| Clients | Undisclosed by policy. Robotics companies confirmed broadly. Tesla, Figure AI, Agility Robotics named in coverage as the buyer class. Microsoft confirmed for non-robotics data labeling. "Several Fortune 100 companies." |
| Market claim | ">$100M/yr spent by robotics companies on real-world data" (Ansari, MIT Tech Review) |
| Products | Human Data Engine (robotics video), VLM data engine, technical talent vetting (original product) |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Ali Ansari | Founder & CEO | ali@micro1.ai | Pattern-derived, not verified |
| Daniel Warner | CMO | — | LinkedIn confirmed |
| Sydney Levin | CBO (Chief Business Officer) | — | LinkedIn confirmed |
| Amy Sennett | General Counsel | — | RocketReach |
| Maria Maron | Director of Sales | — | RocketReach |
| Adam Bain | Board (ex-Twitter COO, 01 Advisors) | — | TechCrunch confirmed |
| Joshua Browder | Board (DoNotPay CEO) | — | TechCrunch confirmed |

## Hiring Signals

- **Active hiring for "Data Annotation Specialist"** across multiple job boards (jobs.micro1.ai, Weekday, LinkedIn). APAC and global roles. AI-interview screening process.
- **"Human Data Manager (Robotics)"** role posted on jobs.micro1.ai -- operational role managing the gig video collection pipeline.
- Hiring across India, Nigeria, Argentina, Philippines for gig contributors at ~$15/hr.
- "Off-campus drive" recruiting pushes in India (2025) targeting college students as annotators.
- Glassdoor: 137 reviews, 4.5/5 overall BUT 45% of interviewees report negative experience. Complaints: extremely low pay ($0.40/annotation), misleading job descriptions (interview as engineer, work as annotator), data privacy concerns with AI video interviews scraping likeness.

## What They've Actually Shipped

- **Robotics video collection at scale:** 160,000+ hrs/month from 4,000 workers in 71 countries. iPhone-mounted headcam. Domestic chore tasks only: cooking, cleaning, gardening, laundry, pet care.
- **Annotation pipeline:** AI + hundreds of human annotators. Multi-stream action labeling with natural-language descriptions in JSONL/CSV for VLA and policy training.
- **Quality controls:** Videos reviewed by AI + human reviewer, accepted or rejected. Workers must keep hands visible, move at natural speed, alternate between task types. Privacy redaction (faces, personal info) via AI + human review.
- **Worker onboarding:** Each person receives headgear for camera mounting, filming instructions, task list. Must submit 10+ hrs/week.
- **Data engine products:** Separate offerings for robotics (POV + 3rd person), VLM training data, and general RLHF/SFT data.
- **Talent vetting platform:** Original product -- AI-powered screening for engineers, still operational.

## Data Gap (why their clients would need Claru)

1. **Quality ceiling (MIT Tech Review, Apr 2026).** Workers in tiny apartments struggle for variety. One profiled worker (Zeus, Nigeria) can only iron clothes in his studio. The data is overwhelmingly domestic chores in residential settings. No industrial environments, no outdoor tasks at scale, no controlled protocols.
2. **No sensor richness.** iPhone-only capture. No stereo depth, no IMU data, no multi-camera rigs. Frontier labs (Tesla Optimus, Figure) need sensor-diverse data for factory/warehouse deployment -- not kitchen footage.
3. **No professional collection protocols.** Gig workers follow a checklist, not a protocol designed by robotics engineers. No scenario design, no environment control, no task decomposition aligned to manipulation primitives.
4. **Geographic breadth but not quality.** 71 countries sounds impressive but the environments are all domestic apartments. A single well-designed industrial capture in one city is worth more than 1,000 hours of laundry folding in Lagos.
5. **Privacy and ethics exposure.** Workers don't know what their data trains. MIT Tech Review and Glassdoor both surface this. Major risk for any robotics client concerned about data provenance and consent chain.
6. **Annotation quality untested at frontier.** Human annotators are gig workers too. No evidence of domain-expert annotation (robotics engineers, manipulation specialists) -- just general-purpose labeling.
7. **No relationship with deployment environments.** Factories, warehouses, construction sites, hospitals -- the places humanoids will actually work -- are absent from their collection model.

## Pitch Angle

"You have the clients and the scale. We make the data credible. Professional-grade field collection with protocol, not gig workers with phones."

Longer version: micro1 solved the cold-start problem -- thousands of hours, fast, cheap. But their clients (Tesla, Figure, Agility) are now hitting the quality ceiling that MIT Technology Review just wrote about. The next tranche of training data can't come from someone ironing clothes in a studio apartment. It needs to come from controlled, sensor-rich captures in the environments where humanoids will actually deploy -- factories, warehouses, retail floors, hospitals. That's Claru's lane. We're not trying to replace their volume. We're the quality layer they don't have.

Two angles:
1. **Subcontractor pitch (supply-side):** "When your robotics clients ask for industrial environments or multi-sensor capture, route it to us. We handle the hard environments. You keep the client relationship."
2. **Direct to their clients (demand-side):** "You're already buying gig data from micro1. Ask yourself: is the hundredth hour of kitchen footage moving your model forward? We do 50 hours that actually match your deployment environment."

## Competitive Position

- **micro1 = volume play.** Cheapest path to massive hours. Domestic, uncontrolled, iPhone-only. $15/hr to workers, selling at significant markup to labs.
- **Claru = quality play.** Trained collectors, protocol-designed scenarios, sensor-rich capture, human QA, 100+ cities. More expensive per hour but dramatically more useful per hour.
- **micro1's $500M valuation and $50M ARR** means they're entrenched. They won't be displaced on volume. The attack vector is quality -- proving to their clients that diminishing returns have already set in on undifferentiated domestic footage.
- **MIT Tech Review coverage is the wedge.** The Apr 2026 article is basically a public audit of their quality ceiling. Any pitch to a micro1 client can now reference independent journalism.
- **Scale AI exodus benefits both.** Meta's Scale AI acquisition pushed labs to diversify data suppliers. micro1 benefited. Claru can ride the same wave for the quality-sensitive segment.

## Email Thread

No outreach sent yet. In Attio (06d4a8d5-702f-5e56-be8e-25a37437effc). Email not verified.

## Related Companies

- [mecka-ai](mecka-ai.md) -- Similar gig-economy collection model, Canada-based, EgoVerse/Scale AI partnership
- Tesla / Figure AI / Agility Robotics -- micro1's confirmed buyer class, our demand-side targets
- Scale AI -- micro1's primary competitor, now Meta-owned, creating the supplier diversification wave both micro1 and Claru benefit from

## Sources

- [The gig workers who are training humanoid robots at home -- MIT Technology Review (Apr 1, 2026)](https://www.technologyreview.com/2026/04/01/1134863/humanoid-data-training-gig-economy-2026-breakthrough-technology/)
- [The Download: gig workers training humanoids -- MIT Technology Review](https://www.technologyreview.com/2026/04/01/1134993/the-download-gig-workers-training-humanoids-better-ai-benchmarks/)
- [Gig workers in 50+ countries filming chores to train humanoid robots -- Silicon Canals](https://siliconcanals.com/sc-a-gig-workers-in-50-countries-are-filming-themselves-doing-chores-to-train-humanoid-robots-for-15-an-hour/)
- [How filming your chores could train the android butlers of the future -- CNN Business (Apr 4, 2026)](https://edition.cnn.com/2026/04/04/tech/humanoid-robot-training-jobs-intl-hnk-dst/)
- [Your Daily Life Is Now a Data Product -- PYMNTS](https://www.pymnts.com/artificial-intelligence-2/2026/your-daily-life-is-now-a-data-product-companies-are-paying-for-it/)
- [Micro1, a competitor to Scale AI, raises funds at $500M valuation -- TechCrunch (Sep 2025)](https://techcrunch.com/2025/09/12/micro1-a-competitor-to-scale-ai-raises-funds-at-500m-valuation/)
- [Scale AI Rival Micro1 Hits $50M Revenue -- Forbes/Yahoo Finance](https://finance.yahoo.com/news/scale-ai-rival-micro1-hits-134611177.html)
- [micro1 founder Ali Ansari on AI and human intelligence -- Stanford Daily (Oct 2025)](https://stanforddaily.com/2025/10/16/micro1-founder-ali-ansari-on-ai-and-human-intelligence/)
- [micro1 $35M Series A announcement](https://www.micro1.ai/series-a)
- [micro1 Robotics Data Engine](https://www.micro1.ai/data-engine/robotics)
- [micro1 Human Data platform](https://www.micro1.ai/human-data)
- [Micro1 Glassdoor Reviews (137)](https://www.glassdoor.com/Reviews/Micro1-Reviews-E7558526.htm)
- [micro1 Crunchbase Profile](https://www.crunchbase.com/organization/micro1)
- [Ali Ansari -- Crunchbase Person Profile](https://www.crunchbase.com/person/ali-ansari-8c81)
