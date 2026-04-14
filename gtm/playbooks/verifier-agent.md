# Verifier Agent
**Purpose:** Cross-checks every email draft against its source fact sheet before adversarial scoring. Catches hallucinated hooks, copy rule violations, and pipeline errors at the architectural level.

**Position in pipeline:** Copywriter Agent → **Verifier Agent** → QA Supervisor (adversarial scoring)

---

## The 6 Checks (in order)

### 1. Hallucination Check
Does every claim in the email trace to a `verified_facts` entry or `signal.detail` in the fact sheet?

- Extract all factual claims from the email (company name, product description, funding amount, hire, launch, quote, dataset name, feature name)
- For each claim, find the matching entry in `verified_facts[]` or `signal.detail`
- If ANY claim has no matching fact sheet entry → **FAIL**
- Partial matches count as failures — "raised $500M" when fact sheet says "$450M" is a hallucination

### 2. Signal URL Check
Is `signal.source_url` present and was the signal actually referenced in the opener?

- If `signal` is not null, `signal.source_url` must exist (non-empty string)
- The opener (first sentence after greeting) must reference the signal described in `signal.detail`
- If the opener references a DIFFERENT signal not in the fact sheet → **FAIL**
- If `signal` is null, the opener must NOT reference any specific signal (use a different opener strategy)

### 3. Channel Check (Rule #7)
If `channel=supply`, does the email violate supply-side rules?

- If `channel=supply` and email body contains "claru.ai" or "Claru" (case-insensitive) → **HARD REJECT**
- Supply-side emails must read as if sent from moonvalley.com
- If `channel=demand`, this check passes automatically

### 4. Copy Rules Check
Static pattern violations that should have been caught by the banned pattern gate but may have been introduced during revision.

- Em-dash (—) anywhere in subject or body → **FAIL**
- First word of body (after greeting line) is "I" or "We" → **FAIL**
- Body over 80 words (excluding greeting and sign-off) → **FAIL**
- Subject over 5 words → **FAIL**
- CTA asks for a meeting ("worth a chat?", "book a call", "grab time") → **FAIL**
- Contains: "I'd love to", "I'd be happy to", "I hope this finds you well", "impressive work", "exciting work", "I came across", "In today's" → **FAIL**
- Contains banned words: delve, leverage, comprehensive, pivotal, synergy, transformative, revolutionize, seamless → **FAIL**

### 5. Posture Check (Rule #11)
Does this read like a founder checking if something is useful, or a consultant who researched the company?

- Apply the posture test from `strategy/messaging.md`: "Does this read like a founder checking if something is useful — or a consultant who researched the company and is now teaching them something?"
- Consultant signals: predicting their clients' behavior, telling them what they need, lecturing about their market, using industry jargon to sound authoritative
- Founder signals: "built up", "figured I'd ask", "sitting on", showing what you have and asking if it's relevant
- If consultant tone detected → **FAIL** with specific excerpt

### 6. Dedup Check
Is `existing_relationship` all false?

- Check `existing_relationship.in_attio`, `in_smartlead`, `in_gmail`, `contacts_master_match`
- If ANY field is `true` → **HARD REJECT** — this lead should not be in a cold sequence
- This is a pipeline error, not a copy error. The lead should have been routed to human review after research.

---

## Verifier Prompt Template

```
You are a verifier agent. You receive TWO inputs:
1. A research fact sheet (JSON)
2. An email draft (subject + body + touch number)

Run these 6 checks IN ORDER. Stop and report on the first failure. If all pass, return pass=true.

CHECK 1 — HALLUCINATION:
Extract every factual claim from the email. For each claim, find the matching entry in the fact sheet's verified_facts[] or signal.detail. If ANY claim has no match, fail.

CHECK 2 — SIGNAL URL:
If signal is not null, verify signal.source_url exists and the opener references signal.detail. If signal is null, verify the opener does NOT reference a specific signal.

CHECK 3 — CHANNEL:
If channel=supply, check that "claru.ai" and "Claru" do not appear anywhere in the email. Supply emails come from moonvalley.com identity.

CHECK 4 — COPY RULES:
Check for: em-dash (—), opens with "I"/"We", body >80 words, subject >5 words, meeting CTA, banned phrases ("I'd love to", "I'd be happy to", "impressive work", "exciting work", "I came across", "I hope this finds you well", "In today's"), banned words (delve, leverage, comprehensive, pivotal, synergy, transformative, revolutionize, seamless).

CHECK 5 — POSTURE:
Does this read like a founder checking if something is useful, or a consultant teaching them about their market? Consultant tone = fail.

CHECK 6 — DEDUP:
Is existing_relationship all false? If any field is true, hard reject — this lead should not be in cold sequence.

INPUTS:

Fact sheet:
{FACT_SHEET_JSON}

Email draft:
Subject: {SUBJECT}
Body: {BODY}
Touch: {T1|T2|T3}
Channel: {demand|supply}

OUTPUT (JSON only):
{
  "pass": boolean,
  "failures": [
    {
      "check": "hallucination|signal_url|channel|copy_rules|posture|dedup",
      "detail": "specific description of what failed and why"
    }
  ],
  "revision_note": "concise instruction for the copywriter on what to fix (null if pass=true)"
}
```

---

## Revision Loop

When `pass=false`:
1. The draft routes back to the copywriter agent with the `revision_note`
2. Copywriter rewrites, addressing each failure specifically
3. Revised draft goes through the verifier again
4. **Max 2 revision attempts.** After 2 failures, escalate to human review with the full failure log.

The revision note must be actionable. Bad: "Fix the hallucination." Good: "Remove the claim about a $60M Series B — fact sheet only shows a $40M Series A. Use the verified funding amount or drop the funding reference entirely."

---

## Example 1: Email That Passes All Checks

**Fact sheet input:**
```json
{
  "company": "Rhoda AI",
  "contact": "Alex Bergman",
  "title": "Co-founder & CDO",
  "email": "abergman@rhoda.ai",
  "email_confidence": "high",
  "channel": "demand",
  "icp_score": 88,
  "signal": {
    "type": "funding",
    "detail": "Rhoda AI raised $450M Series A at $1.7B valuation in March 2026, led by Premji Invest, to build Direct Video Action models for robotics pre-training on internet-scale video.",
    "source_url": "https://techcrunch.com/2026/03/15/rhoda-ai-raises-450m-series-a/",
    "date": "2026-03-15"
  },
  "data_need": "High-quality egocentric video of real-world physical interactions for DVA model pre-training.",
  "verified_facts": [
    "Founded 2024, exited stealth March 2026",
    "$450M Series A at $1.7B valuation, led by Premji Invest",
    "Building Direct Video Action (DVA) models for manufacturing and logistics automation",
    "DVA pre-trains on internet-scale video to learn motion/physics priors, then fine-tunes on robot data"
  ],
  "disqualifiers": [],
  "existing_relationship": {
    "in_attio": false,
    "in_smartlead": false,
    "in_gmail": false,
    "contacts_master_match": false
  }
}
```

**Email draft:**
```
Subject: video for DVA pre-training
Body:
Hey Alex,

The $450M round to build Direct Video Action models caught my eye — pre-training on real-world video before fine-tuning on robot data is exactly the pipeline we built our corpus for.

We've got 386K egocentric clips of real-world physical interactions, 2M licensed cinematic clips, and 10K+ hours of gaming footage, all built at Moonvalley (GC, Khosla, YC). Claru (claru.ai) is the data spinout.

Happy to pull a few clips specific to manufacturing and logistics environments if any of this maps to what you're training on.

John
```

**Verifier output:**
```json
{
  "pass": true,
  "failures": [],
  "revision_note": null
}
```

**Why it passes:**
- Check 1: "$450M round" matches verified fact. "Direct Video Action models" matches signal.detail. "pre-training on real-world video before fine-tuning on robot data" matches verified fact about DVA architecture. "manufacturing and logistics" matches verified fact.
- Check 2: signal.source_url exists. Opener references the funding (signal.detail).
- Check 3: channel=demand, skip.
- Check 4: No em-dashes, doesn't open with I/We (opens with "The"), under 80 words, subject is 4 words, CTA is curation offer not meeting ask.
- Check 5: Founder voice — "caught my eye", "we built our corpus for", "happy to pull a few clips". Not lecturing.
- Check 6: All existing_relationship fields false.

---

## Example 2: Email That Fails on Hallucination

**Fact sheet input:**
```json
{
  "company": "Bedrock Robotics",
  "contact": "Sarah Chen",
  "title": "VP of AI",
  "email": "sarah@bedrockrobotics.com",
  "email_confidence": "medium",
  "channel": "demand",
  "icp_score": 72,
  "signal": null,
  "data_need": "Likely needs real-world manipulation and navigation video for robot learning.",
  "verified_facts": [
    "Bedrock Robotics builds autonomous warehouse robots",
    "Sarah Chen joined as VP of AI in 2025 per LinkedIn",
    "Company has ~50 employees per LinkedIn"
  ],
  "disqualifiers": [
    "No recent public activity found — may be in stealth or slow growth phase"
  ],
  "existing_relationship": {
    "in_attio": false,
    "in_smartlead": false,
    "in_gmail": false,
    "contacts_master_match": false
  }
}
```

**Email draft:**
```
Subject: warehouse robot data
Body:
Hey Sarah,

Saw your Series B announcement last month — scaling autonomous warehouse robots to 200 fulfillment centers is a big move.

We've got 386K egocentric clips and a 2,000-person field collection workforce. Built at Moonvalley (GC, Khosla, YC). Claru (claru.ai) is the data spinout.

Want me to pull a few clips of warehouse navigation if this is relevant?

John
```

**Verifier output:**
```json
{
  "pass": false,
  "failures": [
    {
      "check": "hallucination",
      "detail": "Email references 'Series B announcement last month' and 'scaling to 200 fulfillment centers' — neither claim exists in verified_facts or signal.detail. The fact sheet only confirms they build autonomous warehouse robots."
    },
    {
      "check": "signal_url",
      "detail": "signal is null in the fact sheet, but the opener references a specific funding event. When signal is null, the opener must not reference a specific signal."
    }
  ],
  "revision_note": "Remove the fabricated Series B and fulfillment center claims. Signal is null — use a non-signal opener instead (e.g., reference their warehouse robotics work generally, which IS in verified_facts). Do not invent specific events."
}
```

**Why it fails:**
- Check 1 fails: "Series B announcement" and "200 fulfillment centers" appear nowhere in the fact sheet. The copywriter hallucinated a funding event.
- Check 2 fails: signal is null but the opener cites a specific funding signal. These are both caught — the verifier reports all failures found.

---

## Integration With Pipeline

The verifier sits at position 4 in the full pipeline:

```
1. Research Agent → fact sheet JSON
2. Copywriter Agent → email draft (using fact sheet as sole input)
3. Banned Pattern Gate → static regex checks (scripts/banned-pattern-gate.py)
4. Verifier Agent → fact sheet cross-check (this playbook)
5. QA Supervisor → adversarial scoring (6 dimensions, avg >= 9.5)
6. Human Review Gate → final approval
7. Loader Agent → Smartlead load
```

The verifier catches what the banned pattern gate cannot: semantic errors (hallucination, wrong posture, signal misuse) that require comparing the draft against the fact sheet. The banned pattern gate catches syntactic errors (em-dashes, word count) that don't need the fact sheet.
