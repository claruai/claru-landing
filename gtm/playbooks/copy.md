# Copy Playbook
**Last updated:** 2026-04-03 | Update after every wave with what actually converted.

The canonical reference for email copy at Claru. Read [strategy/messaging.md](../strategy/messaging.md) for voice rules. This playbook is about what specifically works and what to do with what you learn from replies.

---

## The Fundamental Shift (Wave 4)

Before Wave 4: "We have data. Want to see it?" (push)
Wave 4+: "We can curate exactly what you need — what would that be?" (pull)

The curation offer changes the dynamic. Instead of asking for a meeting, we ask them to tell us what they'd want to evaluate. This:
- Gets them to reveal their requirements (which trains us for the actual pitch)
- Positions us as curators, not vendors
- Makes the CTA low-effort (one sentence reply, not a calendar decision)
- Turns the first touch into discovery, not a sale

---

## Structure of an Effective Email

### The Opener (most important part)

**Must be non-swappable.** If you can send the same opener to a different company by just changing the name, rewrite it.

**Good opener patterns** (from what converted or scored well):

1. **Funding implication opener:**
"Series A this fast usually means you're past prototype and dealing with [specific production challenge]. That changes the data problem — diversity is harder to solve than volume at that stage."

2. **Product/launch observation opener:**
"The Skill Capture Glove is a genuinely novel way to bootstrap household training data. The volume question comes next — annotating in-home activity at quality is where most robotics labs hit a wall."

3. **Technical architecture implication opener:**
"Game-engine-based world models have a different training data ceiling than simulation — the cap is the quality and diversity of the video, not the compute."

4. **Research signal opener:**
"Your paper on [specific finding] mentions data collection limitations in [specific area]. That constraint is where most embodied AI labs stall out."

**Bad opener patterns:**
- Any compliment ("impressive", "exciting work", "congratulations")
- Any generic observation ("you're building in X space")
- Any self-introduction as first sentence ("I'm John, founder of...")

### The Bridge

Connects THEIR specific situation to what we have or can curate.

**Rules:**
- Reference their specific modality or use case
- Be concrete about what we have ("egocentric manipulation, not warehouse footage" not "video data")
- Include the curation angle ("easy to pull a few clips specific to what you're training on")
- Don't list everything we have — pick the one thing most relevant to them

### The CTA

One question. Ask them to self-select.

See [strategy/messaging.md](../strategy/messaging.md) for the full list of CTAs that worked vs didn't.

**Format test:** If their ideal reply to your CTA is 1-3 sentences naming what they want, it's a good CTA. If the ideal reply is "sure, here's my calendar link", rewrite it.

---

## Copy by Vertical (patterns from what worked)

### Humanoid / Physical AI Labs
- Opener angle: imitation learning data diversity challenge at their stage
- Bridge: egocentric manipulation corpus + annotation depth
- CTA: "What task types are you most focused on — manipulation, navigation, or whole-body coordination?"
- Watch for: they often care about annotation quality as much as volume

### Game World Model Companies
- Opener angle: game video corpus gap (YouTube/scraping has quality issues, licensed is hard to get)
- Bridge: licensed game video + cinematic footage corpus, already cleared
- CTA: "What environments or game genres are most underrepresented in your current training set?"
- Watch for: they often want specific game types, not generic gameplay

### Cobot / Manipulation / Service Robots
- Opener angle: task demonstration diversity for specific manipulation domain
- Bridge: egocentric manipulation clips with dense annotations (temporal captions, action sequences, object detection)
- CTA: "What manipulation tasks are you training on — tool use, pick-and-place, assembly?"
- Watch for: they often care about annotation format more than raw video

### Exoskeletons / Motion Data
- Opener angle: human gait + motion data variety challenge
- Bridge: human activity corpus with motion-rich clips
- CTA: "What motion types are most constrained in your current training set?"

### AV World Models
- Opener angle: road/cinematic diversity beyond standard AV datasets
- Bridge: cinematic corpus with licensed footage, varied environments
- CTA: "What environments are you most underrepresented on — urban, suburban, highway, weather conditions?"

---

## Adversarial Scoring (mandatory before every send)

Score each lead's copy 0-10 on 6 dimensions. Average >= 8, no dimension < 7.

### Scoring Guide

**Specificity (0-10)**
- 10: Opener is completely non-swappable. Could only make sense for this exact company.
- 7: Most elements are specific but one sentence could apply to a competitor.
- 5: One specific detail but surrounded by generic statements.
- <5: Could be sent to anyone in the industry.

**Their Problem Framing (0-10)**
- 10: Subject line and bridge both name a challenge the prospect is actively facing.
- 7: Bridge is problem-framed but subject is product-centric.
- 5: Mixed framing — some problem orientation, some product orientation.
- <5: Reads like a product pitch ("We have X").

**Curation CTA (0-10)**
- 10: CTA asks them to reveal what they want to see. Answerable in 1 sentence.
- 7: CTA is soft but still asks for input. Not a calendar ask.
- 5: CTA is ambiguous — could be asking for a meeting or asking a question.
- <5: Meeting ask. "Worth a chat?" "Interested?"

**Human Voice (0-10)**
- 10: Reads like a text message from a founder. Could be WhatsApp.
- 7: Mostly casual but has one stiff sentence.
- 5: Mix of casual and formal. Some corporate language.
- <5: Clearly AI-drafted. Multiple formal constructions.

**Anti-Slop (0-10)**
- 10: Zero AI tells. No em-dashes. No "impressive work". No "I'd love to". No "comprehensive".
- 7: One minor AI pattern (a "however" or an em-dash that snuck in).
- 5: Multiple AI patterns but still readable.
- <5: Classic AI email. Automatic delete.

**Structure Variety (0-10)**
- 10: Completely different structure from all other emails in this batch.
- 7: Same opener type as one other email but rest is different.
- 5: Similar to 2+ emails in batch.
- <5: Template feel — would be obvious if compared side-by-side.

---

## What's Off-Limits

These are not stylistic preferences. They're rules based on what causes immediate disengagement:

1. **Em-dashes (—):** AI signature. Find every one and replace with comma or period.
2. **"I'd love to...":** Sounds desperate. Delete the sentence, rewrite the thought.
3. **Multiple questions in one email:** Pick one.
4. **"Just following up":** Classic SDR tell.
5. **Crediting their company with vague praise:** "Your work is impressive" = instant skip.
6. **Opening with "I" or "We":** Starts with you, not them. Reorder.
7. **Moonvalley credential opener:** Played out. Don't use.
8. **Hyperlinks in emails:** Makes it look like a marketing email.
9. **Percentages in first touch:** "80% open rate" sounds like a vendor pitch.

---

## Source Files

Full scored email batches for reference:
- `tasks/archive/campaign-drafts-scored.md` — 16 emails, all scored 9.9/5 avg, includes the patterns that worked
- `tasks/campaign-drafts-wave4.md` — Wave 4 copy with adversarial scoring methodology
- `tasks/archive/campaign-drafts-v2.md` — Wave 2/3 reference
- `tasks/supply-side-subcontractor-drafts.md` — Supply-side subcontractor Wave 1 (6 companies × 3 touches, all 9.5+ scored)

---

## Copy by Vertical — Supply-Side Subcontractor

**What this is:** Cold outbound to annotation/data collection companies pitching Claru as a full-stack physical AI data partner — existing corpus + field collection + annotation workforce. These companies market physical AI services but lack field ops infrastructure AND don't have the raw corpus.

**Send from:** john@claru.ai (NOT moonvalley.com)

### The full value proposition (must be in every T1 bridge)

Claru is not just a field collection service. We already have:
- **400K+ egocentric clips** — built for our own models, available now
- **2M licensed cinematic clips** — cleared rights, immediately accessible
- **10K+ hours of gaming data with keystroke data** — unique, hard to source anywhere else
- **2,000+ trained field collectors in 100+ cities** — for new captures
- **Annotation workforce** — for labeling and enrichment

The pitch to annotation companies is: your clients need this data. You don't have it. We do. Let's work together.

**Bridge structure:** Start with the existing corpus ("We already have..."), then mention field collection capability, then credibility line. Don't lead with collection — lead with inventory.

### Opener patterns that work
- Past experience angle: "You came from [company], so you've seen how [problem] works."
- Acquisition/launch signal: "The [acquisition/launch] positions you for [client type]. Field video is what follows."
- Funding implication: "The $[amount] raise for '[their words]' puts [company] in front of physical AI clients."
- Customer behavior observation: "Labs evaluating [product] tend to ask [specific question]."

### Opener patterns that fail
- Praise/compliments: "That's a strong positioning move" — sounds like AI, creates disengagement
- Declaring their gap: "Your crowd model can't deliver this" — arrogant before trust
- Generic market observation: "Physical AI is growing" — could be sent to anyone

### Credibility line (required in Touch 1)
Place in the capability paragraph, not the opener:
> "Built Claru.ai for this, spun out of Moonvalley (GC, Khosla, YC)."

This is the supply-side equivalent of the Wave 1-3 demand-side opener — but appropriate here because these contacts are new and haven't heard it.

### CTA rule: open soft, let them decide if it's relevant

Supply-side is a partnership pitch, not a sales qualification. After showing what you have, the CTA should be a warm, low-friction relevance check — not a specific probe of their client pipeline.

**The standard CTA for supply-side:** "Curious if there's a fit here worth exploring."

This is peer-to-peer, non-committal, and founder-voiced. "Are your clients asking about X?" is too clinical — it sounds like a sales rep probing their pipeline, not a founder checking if something they built is useful.

| Too clinical (avoid) | Open and warm (use) |
|---------------------|---------------------|
| "Are your enterprise clients asking for field capture?" | "Curious if there's a fit here worth exploring." |
| "Is field video coming up in client conversations?" | "Is there overlap worth a quick note?" |
| "Are any labs asking about NA/EU footage?" | "Figured I'd check if any of this is relevant to what you're working on." |

**Why the difference from demand-side:** Demand-side targets are buyers you're qualifying — specific behavior CTAs work there. Supply-side targets are potential partners — the relationship is peer-to-peer, so the CTA should feel like a founder checking for fit, not probing their pipeline.

### Subject line rule
**2-5 words, lowercase, their problem not our capability.**

| Fail | Pass |
|------|------|
| `field collection requests from robotics clients` (7w) | `robotics field collection` (3w) |
| `annotation format labs are asking for` (6w) | `annotation for egocentric footage` (4w) |
| `ego-exo field collection for RoboStream clients` (7w) | `RoboStream field collection` (3w) |

### Touch 2 rule
Always cite a **different signal** from Touch 1. If T1 cited funding → T2 cites named clients or hiring signal. If T1 cited product launch → T2 cites enterprise client relationships. Never repeat the same angle.

### Touch 3 rule (Day 8, not Day 14)
One sentence only: "Last one from me — if [specific gap] comes up in client conversations, claru.ai is there."

**Why Day 8:** Data shows 70-80% of replies from cold outreach come from follow-ups, and most come within the first 8 days. Day 14 signals you don't care. Day 8 signals this is still live and relevant.

### Voice notes
- Never say "partnership" — say "handle that piece", "fill that requirement", "subcontract"
- Never say "you can't do X" — let the gap be implied by context
- Shorter than demand-side emails — field collection is a simpler pitch than data licensing
- The Moonvalley credibility is fresh for supply-side contacts (they're new leads)
