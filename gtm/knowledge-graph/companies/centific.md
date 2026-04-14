---
type: company
state: prospect
side: supply
name: Centific
slug: centific
domain: centific.com
attio_id: e29a11ce-701a-5006-a88d-7e59bf22771a
relationship: supply-side-target
vertical: physical-ai-data
icp_score: 78
stage: researched
tags: [data-foundry, annotation, physical-ai, robotics, embodied-ai, enterprise, frontier-labs, marketplace, video-collection, india-workforce]
last_enriched: 2026-04-05
email_status: not-sent
last_contact:
last_updated: 2026-04-13
---

## Overview

Centific (formerly Pactera EDGE, rebranded January 2023) is a Redmond, Washington-based AI data foundry founded in 2020 when it spun off from Pactera Technology International. Co-founded and led by CEO Venkat Rangapuram, the company provides end-to-end data collection, curation, annotation, and AI infrastructure services. They claim ~3,000 employees (majority in India) and a network of 1.8M domain experts across 230+ languages. Revenue estimated at ~$750M (CBInsights, Aug 2025). Named clients include OpenAI, Anthropic, xAI, Mistral AI, Microsoft, Google, Nvidia, Dell, Lenovo, and AWS -- a who's-who of frontier AI labs and hyperscalers. Centific closed a $60M Series A in June 2025 led by Granite Asia (Jenny Lee), earmarked to scale "robotics data factories" and expand into Southeast Asia. On March 16, 2026 they launched Data Canvas, marketed as "the first annotation product purpose-built for Physical AI." They also operate a Data Marketplace with 200+ pre-validated datasets.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2020 (spun off from Pactera; rebranded from Pactera EDGE Jan 2023) |
| Funding | $60M Series A (Jun 2025) led by Granite Asia (Jenny Lee). First institutional round. |
| Revenue | ~$750M (CBInsights estimate, Aug 2025) |
| Size | ~3,000 employees; 1.8M domain expert network; offices on 6 continents |
| CEO | Venkat Rangapuram (Co-founder) |
| HQ | Redmond, Washington |
| Offices | US, India (majority workforce), China, Southeast Asia, Europe |
| Named clients | OpenAI, Anthropic, xAI, Mistral AI, Microsoft, Google, Nvidia, Dell, Lenovo, AWS |
| Key products | AI Data Foundry (platform), Data Canvas (annotation for physical AI), Data Marketplace (200+ datasets), Embodied AI vertical |
| Verticals | Physical AI / Robotics, Vision AI, Frontier AI model training, Enterprise AI |
| Key partnership | Nvidia (named partner in funding PR) |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| Venkat Rangapuram | Co-founder & CEO | v***@centific.com (ZoomInfo partial) | High -- ZoomInfo, The Org, LinkedIn, Fortune profile |
| Jagadish Garimella | VP, Vision AI | jagadish.garimella@centific.com | High -- PDL verified (prior research Apr 4), Equilar, RocketReach |
| Jenny Lee | Board / Lead Investor (Granite Asia) | -- | Confirmed via Fortune, PR Newswire |

**Note:** Full leadership page at centific.com/company/leadership likely includes CTO, CRO, and additional cofounders. Web search did not surface names beyond Venkat and Jagadish. Jagadish is the best entry point -- he owns the Vision AI vertical directly relevant to Claru's offering.

## Hiring Signals

- **12 open positions** as of Mar 2026 (Uplers). Not a hiring surge -- suggests stable operations, not scaling fast on headcount.
- **Data Annotator (English)** -- 1-year renewable contract, posted on Workday. Entry-level: "draw boxes on images, tag according to client specs, transcribe text." This is office/remote annotation, not field collection.
- **Glassdoor: 496 reviews, 3.6/5 stars.** 70% would recommend. Annotator roles rated as easiest to interview for. Compensation rated 3.4/5. Some reviews cite low pay and slow developer response.
- **No robotics-specific or field-collection roles found.** All annotation positions are remote/office-based. No job postings for "field collector," "video capture technician," "egocentric," or "sensor operator."
- **India-heavy workforce.** Majority of employees are in India doing annotation work. This is consistent with a managed-services annotation model, not a distributed field-collection network.

## What They've Actually Shipped

1. **Data Canvas (Mar 16, 2026):** Annotation platform marketed as "purpose-built for Physical AI." Supports multi-modal annotation, layered labels, preprocessing-to-QA pipeline. Claims AI-assisted labeling and semi-automated workflows. Cloud, hybrid, and on-prem deployment. **This is an annotation tool, not a data collection system.** It transforms raw data into model-ready assets -- it does not generate the raw data.

2. **Data Marketplace (200+ datasets):** Launched with pre-validated datasets across text, speech, image, video, and synthetic modalities. Claims "10X faster" AI development cycles and 10-30% higher model accuracy. Marketplace at data.centific.com. **No evidence of robotics or egocentric video datasets listed in the marketplace.**

3. **Physical AI / Embodied AI vertical pages:** Website claims 360-degree video capture, egocentric video with synchronized IMU and depth data, manipulation task demonstrations, sim-to-real transfer benchmarks. Claims "global network of robotics data factories, distributed data collectors, and operating businesses." References teleoperation systems (FastUMI, Mobile ALOHA, JoyLo) and Surgie project (HTC Vive trackers). **This is the strongest marketing copy in the space -- but no published case studies, no named robotics clients, no sample datasets, no published delivery metrics.**

4. **Humanoid training blog post:** Detailed technical blog at centific.com/blog/humanoid-robot-training-data discussing sub-5ms sensor synchronization, teleoperation workflows, and edge-case coverage. Well-written thought leadership but reads more like an aspiration statement than a delivery report.

5. **Core business remains text/NLP/RLHF for frontier labs.** The named clients (OpenAI, Anthropic, xAI, Mistral) are almost certainly using Centific for text RLHF, code evaluation, and language annotation at scale -- this is the $750M revenue base. Physical AI is the growth bet, not the current cash cow.

6. **Hackathon 2026:** Running "Centific Premier Hackathon 2.0" -- internal innovation event, not a customer deliverable.

## Data Gap (why they'd need Claru)

1. **Annotation platform != collection infrastructure.** Data Canvas is a labeling tool. It turns existing video into annotated datasets. But someone has to shoot that video in real kitchens, warehouses, and construction sites first. Centific's 1.8M domain experts are remote knowledge workers, not field-deployed collectors with camera rigs.

2. **No evidence of robotics data delivery despite extensive marketing.** The /physical-ai, /embodied-ai, and /vertical/vision-ai pages are comprehensive marketing copy. Zero published case studies. Zero named robotics clients. Zero sample datasets in their marketplace. Compare this to their text/RLHF work where they can name OpenAI, Anthropic, xAI, and Mistral.

3. **Revenue concentration in text/RLHF.** At $750M revenue with OpenAI/Anthropic/xAI as named clients, the vast majority of revenue comes from text annotation and RLHF for LLMs. Physical AI is a strategic expansion, not proven delivery capability.

4. **India-centric workforce cannot do North American field capture.** Their 3,000 employees (majority India) and 1.8M network are structured for remote annotation tasks. Egocentric video in a San Francisco kitchen or a Detroit warehouse requires someone physically present with calibrated equipment. That's a fundamentally different labor model.

5. **The frontier lab clients will ask for robotics data.** OpenAI (robotics rumors), Anthropic (tool use), xAI (Tesla/Optimus adjacency), Nvidia (Isaac, Omniverse) -- these clients are all expanding into physical AI. When they ask Centific to deliver egocentric video alongside annotation, Centific needs a field-collection partner or they lose the contract.

6. **$60M earmarked for "robotics data factories" -- but building from scratch is slow.** The Series A funds expansion into physical AI, but standing up a network of trained field collectors across 100+ cities takes years. Subcontracting to an existing network (Claru) is the fast path.

## Pitch Angle

"You're building robotics data factories for frontier labs. When those contracts include egocentric video capture in real environments, that needs field-deployed collectors, not office annotators. We handle that specific piece -- 2,000+ trained collectors, 100+ cities, multi-sensor rigs, protocol-grade QA. You keep the annotation revenue through Data Canvas, we supply the raw capture you can't produce with your current workforce."

**Why this works:**
- Centific has the client relationships (OpenAI, Anthropic, xAI, Nvidia) but not the field infrastructure.
- Data Canvas is a labeling tool. It needs raw video to label. Claru produces raw video.
- The $60M is earmarked for physical AI expansion. They're actively looking for ways to deliver on this promise.
- Subcontracting field capture preserves Centific's margin on the annotation/platform side while letting them say "yes" to robotics RFPs they'd otherwise have to decline or underdeliver on.
- Centific's size (3,000 employees, $750M revenue) means they are not a competitor -- they're a channel partner. They don't want to build a field collection operation; they want to sell one.

**Why ICP score is 78 not higher:**
- Size above ideal (>1,500 employees) -- procurement bureaucracy, long sales cycles.
- They may attempt to build field collection in-house using the $60M (competitive risk).
- Revenue from physical AI is unproven -- the team may not have budget authority for subcontracting yet.

**Entry point:** Jagadish Garimella, VP Vision AI (jagadish.garimella@centific.com). He owns the vertical where field capture gaps surface first. Frame as partnership/subcontract, not competition. Reference their humanoid training blog post and Data Canvas launch -- "We saw your physical AI platform. We do the field capture piece that's hardest for managed-services models."

## Related Companies

- [lxt](lxt.md) -- Similar supply-side target; crowd model (7M workers) with same gap: no field collection capability despite robotics marketing
- [cortex-ai](cortex-ai.md) -- YC startup doing real-world data collection for embodied AI; closer to what Centific claims to do than what Centific actually does
- [mecka-ai](mecka-ai.md) -- Gig-worker collection model (iPhone), Canada-based; potential Centific subcontractor competitor
- Scale AI -- Largest annotation platform; Centific competitor on text/RLHF side, not on field collection
- iMerit -- Managed annotation workforce; similar to Centific's model but smaller
- Avala AI -- Direct competitor doing field capture + annotation (what Centific claims but hasn't proven)

## Sources

- [Centific Homepage](https://www.centific.com/)
- [Centific About Page](https://www.centific.com/company/about)
- [Centific Leadership](https://www.centific.com/company/leadership)
- [Centific Physical AI Vertical](https://www.centific.com/vertical/physical-ai)
- [Centific Vision AI Vertical](https://www.centific.com/vertical/vision-ai)
- [Centific Embodied AI Page](https://centific.com/embodied-ai)
- [Centific Data Canvas Product](https://www.centific.com/products/data-canvas)
- [Centific AI Data Foundry](https://www.centific.com/products/ai-data-foundry)
- [Centific Data Marketplace](https://data.centific.com/)
- [Centific Data Marketplace Announcement](https://www.centific.com/blog/centific-disrupts-ai-data-market-with-industry-s-first-unified-marketplace-delivering-production-ready-datasets-at-10x-speed)
- [Centific Humanoid Robot Training Data Blog](https://www.centific.com/blog/humanoid-robot-training-data)
- [Centific Careers](https://www.centific.com/company/careers)
- [Centific $60M Series A -- Fortune Asia](https://fortune.com/asia/2025/06/25/centific-series-a-funding-venkat-rangapuram-granite-asia-jenny-lee/)
- [Centific $60M Series A -- SiliconANGLE](https://siliconangle.com/2025/06/25/ai-data-foundry-provider-centific-lands-60m-grow-enterprise-footprint/)
- [Centific $60M Series A -- GeekWire](https://www.geekwire.com/2025/centific-a-seattle-area-ai-services-startup-and-nvidia-partner-lands-60m/)
- [Centific $60M Series A -- PR Newswire](https://www.prnewswire.com/news-releases/centific-the-market-leading-enabler-of-advanced-ai-closes-transformative-60m-series-a-round-302490506.html)
- [Centific $60M Series A -- Built In Seattle](https://www.builtinseattle.com/articles/centific-raises-60m-series-a-20250625)
- [Pactera EDGE Rebrand as Centific -- PR Newswire](https://www.prnewswire.com/news-releases/pactera-edge-announces-strategic-rebrand-as-centific-301727758.html)
- [Centific -- CBInsights](https://www.cbinsights.com/company/centific)
- [Centific -- Crunchbase](https://www.crunchbase.com/organization/centific)
- [Centific -- ZoomInfo](https://www.zoominfo.com/c/centific-global-solutions-inc/566141096)
- [Centific -- Owler](https://www.owler.com/company/centific)
- [Venkat Rangapuram -- The Org](https://theorg.com/org/centific/org-chart/venkat-rangapuram)
- [Venkat Rangapuram -- LinkedIn](https://www.linkedin.com/in/venkat-rangapuram-7a858a34/)
- [Jagadish Garimella -- Equilar](https://people.equilar.com/bio/person/jagadish-garimella-centific/60669547)
- [Jagadish Garimella -- RocketReach](https://rocketreach.co/jagadish-garimella-email_18439451)
- [Centific Glassdoor Reviews](https://www.glassdoor.com/Reviews/Centific-Reviews-E4642195.htm)
- [Centific AI Data Annotator Glassdoor Reviews](https://www.glassdoor.com/Reviews/Centific-AI-Data-Annotator-Reviews-EI_IE4642195.0,8_KO9,26.htm)
- [Centific Jobs -- ZipRecruiter](https://www.ziprecruiter.com/Jobs/Centific)
- [Centific Hackathon 2026](https://www.centific.com/hackathon-2026)
- [Centific LinkedIn Jobs](https://www.linkedin.com/company/centificglobal/jobs)
- [7 Top Egocentric Data Providers for Robotics 2026 -- Labellerr](https://www.labellerr.com/blog/top-egocentric-data-providers-robotics/)
