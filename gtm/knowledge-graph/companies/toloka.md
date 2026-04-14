---
type: company
state: prospect
side: demand
name: Toloka
slug: toloka
domain: toloka.ai
attio_id: 07e54857-baff-58bb-ab2d-38c13d6c64a9
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 92
stage: researched
tags: [crowd-model, annotation, robotics-marketing, egocentric-video, RLHF, frontier-ai, bezos-backed, amsterdam, global, tendem, nebius-spinoff]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Toloka is an Amsterdam-based AI data company founded in 2014 by Olga Megorskaya as a crowdsourcing platform inside Yandex, spun out as part of the Nebius Group restructuring after Yandex's Russian assets were sold in July 2024. In May 2025, Toloka raised $72M led by Bezos Expeditions, gaining operational independence from Nebius (which retains ~28% economic interest). Mikhail Parakhin (Shopify CTO) became Executive Chairman.

Toloka operates a global network of 200,000+ annotators and experts across 100+ countries, 40+ languages, and 50+ verified knowledge domains. Named clients include Anthropic, Amazon, Microsoft, Shopify, Poolside, and Recraft. FY2024 revenue was $26.4M (+138% YoY), with 2025 guidance of $50-70M. The core team is ~200 professionals; the wider Nebius Group (parent) has ~1,371 employees.

Toloka has a dedicated robotics page (toloka.ai/robotics) and actively recruits crowd contributors for egocentric home-recording tasks -- room tidying, dishes, laundry, home mapping -- paying ~$5/hr for smartphone-captured POV video. They also launched Tendem (Nov 2025), a hybrid AI+human agent platform, and announced MCP integration with Nebius for agentic workflows in 2026. Their strategic direction is moving from pure data labeling toward AI agent evaluation and hybrid human-AI systems.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2014 (inside Yandex, independent 2020, Bezos round 2025) |
| Funding | $72M (May 2025, led by Bezos Expeditions). Shopify CTO Mikhail Parakhin also invested. |
| Revenue | $26.4M FY2024 (+138% YoY). 2025 guidance: $50-70M. Valuation est. ~$75M (conservative). |
| Size | ~200 core employees; 200K+ crowd annotators/experts |
| CEO | Olga Megorskaya (Founder & CEO since 2014/2020) |
| Chairman | Mikhail Parakhin (Shopify CTO, appointed post-Bezos round) |
| HQ | Amsterdam, Netherlands |
| Parent | Nebius Group N.V. (NASDAQ: NBIS) -- ~28% economic interest, no majority voting control |
| Clients | Anthropic, Amazon, Microsoft, Shopify, Poolside, Recraft |
| Key products | Data annotation, RLHF, RL-Gyms, model evaluation, Tendem (hybrid AI+human agent), SpatialCrowd (field collection) |
| Crowd | 200K+ annotators, 100+ countries, 40+ languages, 50+ knowledge domains |
| Robotics | Dedicated page (toloka.ai/robotics), egocentric video collection via crowd, SpatialCrowd for field tasks |

## Key People

| Name | Title | Background | Relevance |
|------|-------|------------|-----------|
| Olga Megorskaya | Founder & CEO | St. Petersburg State (math modeling), 10+ years at Yandex as Head of Crowdsourcing & Platforms. Built crowdsourced data-labeling for Yandex search, voice, self-driving, content moderation. | Decision-maker. Background is crowd platforms and NLP/search, not robotics or physical AI capture. |
| Mikhail Parakhin | Executive Chairman | CTO at Shopify, former Microsoft (Bing, Cortana). | Board-level. Investor-operator. Tech background is search/LLM, not robotics. |
| Dmitriy Kachin | Leadership team | Details limited -- CBInsights lists as key exec. | Unknown specific role. |
| Ranvish Vir | Leadership team | Details limited -- CBInsights lists as key exec. | Unknown specific role. |

## Hiring Signals

- **Egocentric video annotators (active):** "AI Training Specialist (Global Egocentric Video)" on Workable -- remote, project-based freelance. Tasks: record POV household activities (tidy-up, dishes, laundry, home mapping). Device mounted at forehead/eye-level. Use designated "D&A" app. Minimum 15-second clips, well-lit, stable. Pay: ~$5/hr.
- **Vision Data Intelligence Specialist (active):** Listed on Rework Times -- worldwide remote.
- **No FTE robotics engineering roles found.** All robotics-adjacent hiring is crowd contributor recruitment, not in-house robotics engineers or field operations staff.
- **No field operations manager or logistics roles found.** Their "onsite" capability appears to be marketing language -- no evidence of dedicated field teams, hardware provisioning, or multi-sensor rig deployment.
- **Crowd contributor model confirmed:** Indeed, Workable, Built In Chicago all show Toloka Annotators recruiting freelance contributors at gig-economy rates ($5/hr), not salaried data collection professionals.

## What They've Actually Shipped

1. **Crowd annotation at scale (core business):** 200K+ annotators doing text, image, audio, video labeling for frontier AI labs. Anthropic, Amazon, Microsoft are real clients. This is proven, revenue-generating work.
2. **RLHF and model evaluation:** RL-Gyms for simulated agent training, human-in-the-loop evaluation. Growing revenue segment tied to LLM fine-tuning demand.
3. **Tendem (Nov 2025):** Hybrid AI+human agent platform. Delegates professional tasks (research, writing, analysis) to AI+human expert teams. Claims 1.8x quality vs AI-only, 2.1x speed vs human-only. MCP integration with Nebius announced 2026.
4. **Robotics page (toloka.ai/robotics):** Marketing copy describing video demonstration collection, sensor stream capture, human behavior recording in real environments. Claims to combine "diverse crowdsourced data with controlled onsite capture." **No published case studies. No named robotics clients. No evidence of delivered robotics datasets.**
5. **SpatialCrowd / field data collection (toloka.ai/usecases/spatialcrowd/):** Mobile app-based field tasks where contributors near locations collect data via smartphone. Originally designed for map verification, POI data, storefront photos -- not multi-sensor robotics capture.
6. **Egocentric home-recording pipeline (active):** Recruiting contributors to record household tasks from forehead-mounted smartphone. Standardized app ("D&A") for capture and upload. This is their closest robotics deliverable -- consumer-grade smartphone video of home activities at $5/hr contributor rates.

## Data Gap (why they'd need Claru)

1. **$5/hr crowd contributors cannot produce protocol-grade capture.** Frontier robotics labs (the clients Toloka wants to serve) need consistent lighting protocols, specific camera rigs, calibrated multi-sensor setups, and trained operators. A gig worker recording dishes cleanup with a forehead-mounted phone at $5/hr produces diverse but inconsistent, low-quality data.

2. **No multi-sensor capability.** Their entire collection infrastructure is smartphone-based (the "D&A" app). Robotics labs training manipulation policies need synchronized stereo depth, IMU streams, force-torque data, and specific camera intrinsics. A crowd app cannot provision or calibrate this hardware.

3. **No field operations infrastructure.** "Onsite" in Toloka's vocabulary means "a gig worker who lives near a location visits it with their phone." It does not mean "a trained field team deploys to a client-specified environment with standardized equipment." They have no evidence of logistics teams, hardware inventory, or environment-specific deployment capability.

4. **Robotics page is marketing vapor.** Zero case studies, zero named clients, zero published datasets. Compare this to their real RLHF business where they name Anthropic, Amazon, and Microsoft. The robotics offering is aspirational positioning, not proven delivery.

5. **CEO background is crowd platforms, not physical AI.** Olga Megorskaya built Yandex's crowdsourcing for search, voice, and content moderation -- all online tasks. The Chairman (Parakhin) is a search/LLM executive. There is no robotics or physical-world data collection expertise in the leadership team.

6. **Quality control gaps at scale.** Even their smartphone egocentric pipeline relies on contributor self-monitoring with basic app guardrails. At $5/hr, contributor churn is high, quality variance is extreme, and there is no on-the-ground QA presence to catch issues in real time. Claru's model of trained, paid collectors ($15-25/hr equivalent) with field supervisors produces categorically different data.

7. **Their growth strategy creates the need.** Toloka's revenue is growing 100%+ YoY, they have Bezos money, and they are actively marketing robotics data. When enterprise clients (their real strength) ask for physical-world video collection as part of a larger data deal, Toloka currently either declines or delivers smartphone-grade output. Claru fills that exact gap.

## Pitch Angle

"Your crowd contributors can label data at scale. When a client needs protocol-grade field capture in specific environments -- kitchens, factories, warehouses -- that's a different operation. We handle the capture piece, you handle the annotation."

**Why this works:** Toloka is flush with Bezos money, growing fast, and actively marketing robotics data they cannot credibly deliver. Their real business is annotation and RLHF for frontier labs -- and those same labs are increasingly asking for physical-world video collection. When Anthropic or Amazon (both Toloka clients) needs egocentric manipulation data from real kitchens, Toloka's $5/hr phone-recording pipeline is not going to cut it. Claru provides the capture layer that makes Toloka's robotics positioning real.

**Why partnership, not competition:** Toloka's revenue comes from annotation and evaluation. Claru's revenue comes from capture. These are complementary, not competitive. Toloka keeps 100% of the annotation revenue; Claru supplies the raw footage they cannot produce in-house. This is the same model as a film production company using a specialized location crew.

**Entry point:** Olga Megorskaya directly. She built Toloka from inside Yandex and makes product/partnership decisions. Frame as: "We saw your robotics page. When your enterprise clients need physical-world capture that goes beyond what crowd contributors can do from home, we're the field operations layer. 2,000+ trained collectors, 100+ cities, multi-sensor rigs, protocol-grade QA."

**Timing advantage:** Post-Bezos funding, Toloka is under pressure to deliver on their robotics and physical AI positioning. They have the money and the clients but not the field operations. This is the best possible moment to approach -- they need to show Bezos Expeditions that the robotics bet is real.

## Related Companies

- [lxt](lxt.md) -- Similar supply-side target, crowd annotation model, also marketing robotics data without delivery evidence
- [mecka-ai](mecka-ai.md) -- Supply-side target, gig-worker collection model (iPhone), Canada-based
- [scale-ai](scale-ai.md) -- Largest annotation platform, Toloka competitor on annotation side
- [avala-ai](avala-ai.md) -- Direct competitor to Claru (field capture + annotation)
- [imerit](imerit.md) -- Managed annotation workforce, potential co-delivery partner
- [surge-ai](surge-ai.md) -- Premium annotation competitor, skilled contractor model

## Sources

- [Toloka Homepage](https://toloka.ai/)
- [Toloka About Page](https://toloka.ai/about)
- [Toloka Robotics Page](https://toloka.ai/robotics)
- [Toloka SpatialCrowd / Field Data Collection](https://toloka.ai/usecases/spatialcrowd/)
- [Toloka Blog: Robotics Training Data Collection & Annotation](https://toloka.ai/blog/robotics-training-data-collection-annotation/)
- [Toloka Blog: Strategic Investment Led by Bezos Expeditions](https://toloka.ai/blog/toloka-strategic-investment-led-by-bezos-expeditions/)
- [Toloka Blog: Introducing Tendem](https://toloka.ai/blog/introducing-tendem/)
- [Toloka Blog: From Human Intelligence to Hybrid AI](https://toloka.ai/blog/from-human-intelligence-to-hybrid-ai-the-next-chapter-for-toloka/)
- [Tendem Whitepaper (PDF)](https://toloka.ai/files/tendem_whitepaper.pdf)
- [Nebius: Bezos Expeditions Investment in Toloka](https://nebius.com/newsroom/nebius-welcomes-bezos-expeditions-as-lead-investor-in-ai-data-business-toloka)
- [Nebius + Toloka MCP Integration Announcement](https://nebius.com/blog/posts/nebius-and-toloka-to-introduce-integration-to-bring-human-experts-on-demand-to-ai-agents)
- [SiliconANGLE: Toloka Raises $72M](https://siliconangle.com/2025/05/07/ai-data-provider-toloka-raises-72m-funding/)
- [PYMNTS: Bezos Leads $72M Investment](https://www.pymnts.com/news/investment-tracker/2025/bezos-expedition-leads-72-million-investment-in-ai-data-firm-toloka/)
- [Silicon Canals: Toloka Raises EUR64M](https://siliconcanals.com/amsterdam-toloka-raises-64m/)
- [Yahoo Finance: Amazon's Bezos Leads Investment in Toloka](https://finance.yahoo.com/news/amazons-bezos-leads-investment-ai-110341396.html)
- [Toloka Wikipedia](https://en.wikipedia.org/wiki/Toloka)
- [Olga Megorskaya Interview -- Unite.AI](https://www.unite.ai/olga-megorskaya-founder-and-ceo-of-toloka-interview-series/)
- [Olga Megorskaya -- WeAreTechWomen](https://wearetechwomen.com/inspirational-woman-olga-megorskaya-ceo-co-founder-toloka/)
- [Olga Megorskaya -- Entrepreneur](https://www.entrepreneur.com/author/olga-megorskaya)
- [Olga Megorskaya -- LinkedIn](https://www.linkedin.com/in/omegorskaya/)
- [Olga Megorskaya -- Crunchbase](https://www.crunchbase.com/person/olga-megorskaya)
- [Toloka -- CBInsights](https://www.cbinsights.com/company/toloka)
- [Toloka -- Crunchbase](https://www.crunchbase.com/organization/toloka-5e39)
- [Toloka -- Tracxn](https://tracxn.com/d/companies/tolokaai/__F4Lv4eZVvfaV8pZJyIeY5eHFKAKDybqvKlI4IpicMHk)
- [Toloka -- Growjo Revenue Estimate](https://growjo.com/company/Toloka)
- [Toloka -- LeadIQ](https://leadiq.com/c/toloka/5fd22591a856d346f8aea406)
- [Toloka Careers](https://toloka.ai/careers)
- [Toloka Annotator Application](https://toloka.ai/annotator_apply)
- [AI Training Specialist (Global Egocentric Video) -- Workable](https://apply.workable.com/toloka-annotators/j/07B1E17778/)
- [AI Training Specialist (Egocentric Video) -- Built In Chicago](https://www.builtinchicago.org/job/ai-training-specialist-egocentric-video/8819778)
- [Vision Data Intelligence Specialist -- Rework Times](https://www.reworktimes.com/jobs/vision-data-intelligence-specialist-worldwide-at-toloka-annotators)
- [Toloka Annotators -- LinkedIn](https://www.linkedin.com/company/toloka-annotators)
- [Toloka AI Review & Alternatives -- AIMultiple](https://research.aimultiple.com/toloka-ai/)
- [Top 10 Human Data Providers 2026 -- HeroHunt](https://www.herohunt.ai/blog/top-10-human-data-providers-full-in-depth-review/)
- [Nebius Group Wikipedia](https://en.wikipedia.org/wiki/Nebius_Group)
- [The Moscow Times: Arkady Volozh's Second Act](https://www.themoscowtimes.com/2025/12/10/arkady-volozhs-second-act-a91269)
