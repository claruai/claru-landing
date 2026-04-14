---
type: company
state: active
side: demand
name: Mirelo
slug: mirelo
domain: mirelo.ai
attio_id: 3f21685d
relationship: demand-side
vertical: video-gen
icp_score: 60
stage: replied
tags: [active-pipeline, call-booked-apr7, ai-audio, video-sfx, sound-generation, berlin, index-ventures, a16z, florian-wenzel, cj-simon-gabriel, call-prep-needed]
last_enriched: 2026-04-05
email_status: contacted
last_contact: 2026-04-07
last_updated: 2026-04-13
---

## Overview

Mirelo is a Berlin-based AI startup building the "audio layer for all visual content" — their AI interprets any video and generates perfectly synchronized sound effects within seconds. Founded by CJ Simon-Gabriel (CEO, classically trained pianist/composer) and Florian Wenzel (CTO, plays guitar in Berlin electro band), both ex-AWS Labs AI researchers. Raised $41M seed from Index Ventures and a16z (December 2025). A call is booked with Florian + CJ for Tuesday April 7 at 9:30am EDT. Florian sent detailed data requirements on April 1.

## Evidence Card

| Field | Value |
|-------|-------|
| Founded | 2023 |
| Funding | $41M seed (Dec 2025). Led by Index Ventures + Andreessen Horowitz. |
| Size | ~20 (est., Berlin-based) |
| CEO | CJ Simon-Gabriel (co-founder) |
| CTO | Florian Wenzel (co-founder) |
| Location | Berlin, Germany |
| Clients | Video creators, gaming, social media, film — undisclosed |
| Key product | Mirelo SFX — AI model that interprets video and generates synced sound effects |

## Key People

| Name | Title | Email | Confidence |
|------|-------|-------|------------|
| CJ Simon-Gabriel | Co-founder & CEO | cjsg@mirelo.ai | Confirmed (booked call) |
| Florian Wenzel | Co-founder & CTO | florian@mirelo.ai | Confirmed (booked call, sent data requirements Apr 1) |

## Hiring Signals

Small Berlin team. Likely hiring audio ML and data engineers given their data needs.

## What They've Actually Shipped

- **Mirelo SFX v1.5**: AI model that takes any video as input and outputs synchronized sound effects in seconds. Tested as superior quality to competitors in external evaluations.
- **Lightweight model**: 50x less compute than typical LLMs. Runs fast, runs cheap.
- Revenue model: B2B API/platform for video creators, gaming companies, social media tools, film post-production.

## Data Gap / Relationship

Florian sent very specific data requirements on April 1 — this is a real procurement conversation:
1. **Video-audio pairs** with separated music + SFX + voice stems (not mixed audio)
2. **Stem-separated SFX layers**: car sounds, forest sounds, footsteps, etc. (isolated, not blended)
3. **High-quality source only** — not YouTube (they specifically excluded it)
4. **Annotation question**: What annotations beyond 3rd-party models?

This is a niche data need. Mirelo needs audio-visual training data with pristine stem separation — professional production quality. This is different from Claru's typical egocentric collection. The fit depends on whether Claru has or can source video with isolated SFX stems. Key question: can Claru provide stem-separated audio-visual pairs, or is this a referral/network play?

## Pitch Angle

For the April 7 call: be honest about what Claru has vs. what they need. Claru's egocentric corpus has natural sound but not stem-separated audio. However, Claru could potentially source or produce stem-separated content through professional sound library partnerships or bespoke collection with proper audio recording setups. Explore whether Mirelo wants: (a) raw video for them to annotate SFX onto, (b) video + existing isolated audio stems, or (c) custom collection of specific SFX scenarios with isolated audio. Frame Claru as a partner who can help design and execute the collection — not just a catalog vendor.

## Related Companies

- [decart-ai](decart-ai.md) — Also builds on video, different angle (visual/world models vs. audio)
- [pika-labs](pika-labs.md) — Video gen, potential audio/video alignment need

## Sources

- [TechCrunch: Mirelo raises $41M (Dec 2025)](https://techcrunch.com/2025/12/15/mirelo-raises-41m-from-index-and-a16z-to-solve-ai-videos-silent-problem/)
- [Music Business Worldwide: Mirelo seed funding](https://www.musicbusinessworldwide.com/berlin-startup-mirelo-raises-41m-in-seed-funding-for-ai-generated-video-sound/)
- [Index Ventures blog: Musicians-Turned-AI Researchers](https://www.indexventures.com/perspectives/musicians-turned-ai-researchers-at-mirelo-raise-41m-to-unmute-videos-games-and-beyond/)
- [EU-Startups: Mirelo raises €35M](https://www.eu-startups.com/2025/12/berlin-based-mirelo-raises-e35-million-seed-round-co-led-by-index-ventures-and-andreessen-horowitz/)
- [Mirelo Crunchbase](https://www.crunchbase.com/organization/mirelo-ai)
- Internal: pipeline-status.md (call booked Apr 7, Florian data requirements Apr 1)
