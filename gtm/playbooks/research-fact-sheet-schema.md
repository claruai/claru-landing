# Research Fact Sheet Schema
**Purpose:** Structured output format for research sub-agents. Copywriter agents receive ONLY this JSON. Nothing else.

---

## JSON Schema

```json
{
  "company": "string — exact legal name",
  "contact": "string — full name",
  "title": "string — exact title from LinkedIn/website",
  "email": "string — verified email",
  "email_confidence": "high | medium | risky",
  "channel": "demand | supply",
  "icp_score": "number 0-100",
  "signal": {
    "type": "funding | hire | paper | launch | quote | job_posting",
    "detail": "string — specific, verifiable description",
    "source_url": "string — URL where this was verified (REQUIRED — no URL = set signal to null)",
    "date": "YYYY-MM-DD"
  },
  "data_need": "string — what data type they likely need, inferred from evidence",
  "verified_facts": [
    "string — each fact must be traceable to a public source"
  ],
  "disqualifiers": [
    "string — any red flags (wrong modality, pure synthetic, competitor, etc.)"
  ],
  "existing_relationship": {
    "in_attio": "boolean",
    "in_smartlead": "boolean",
    "in_gmail": "boolean",
    "contacts_master_match": "boolean"
  }
}
```

---

## Field Rules

### `signal` (CRITICAL)
- `signal.source_url` is **REQUIRED**. If you cannot provide a URL you personally visited and verified, set the entire `signal` object to `null`.
- Never fabricate a URL. Never guess at a URL format. If you searched and found nothing, `signal: null` is the correct output.
- Signal types: `funding` (announced round), `hire` (new executive/key hire), `paper` (published research), `launch` (product/feature launch), `quote` (public statement by contact), `job_posting` (active role listing).

### `existing_relationship` (MUST CHECK BEFORE RESEARCH)
All four fields must be checked before research proceeds:
1. **in_attio** — Search Attio for company name and contact email
2. **in_smartlead** — Check all active Smartlead campaigns for the email
3. **in_gmail** — Search Gmail for threads with the contact email (check both john@claru.ai and john@moonvalley.com)
4. **contacts_master_match** — Grep `gtm/contacts-master.md` for the email or company name

If ANY field is `true`, the lead goes to **human review**, not a cold sequence. Do not proceed to copywriting.

### `email_confidence`
- `high` — verified via Hunter.io with >90% confidence, or confirmed in public source
- `medium` — pattern-matched (e.g., firstname@domain) with >50% confidence
- `risky` — guessed pattern, no verification source

### `disqualifiers`
Common disqualifiers to check:
- Company is a direct competitor (e.g., Avala AI, Scale AI, Appen)
- Company works only with synthetic data (no need for real-world captures)
- Company is in a non-target vertical (pure SaaS, no physical/video/robotics AI)
- Contact has "do not contact" status in Attio
- Company size under 10 employees (unless ICP score is very high)

---

## Research Sub-Agent Prompt Template

```
You are researching ONE company for outbound. Output a structured JSON fact sheet.

HARD RULES:
- Every signal must have a source_url you personally visited. No invented URLs.
- Check Attio, Smartlead campaigns, Gmail, and contacts-master.md for existing relationships.
- If you cannot find a verifiable signal, set signal to null. Do NOT fabricate one.
- verified_facts must each be traceable to a specific public source (website, press release, LinkedIn, job posting).
- Do not include any information you cannot verify. Omission is better than fabrication.

Company: {COMPANY_NAME}
Domain: {COMPANY_DOMAIN}
Channel: {demand|supply}

Output the JSON fact sheet and nothing else.
```

---

## What Copywriter Agents Receive

Copywriter agents receive **this JSON and NOTHING ELSE**. They do not get:
- Raw web search results
- Full company profiles from the knowledge graph
- The research agent's reasoning or notes
- Any context beyond what is in the fact sheet fields

This constraint is deliberate. If a fact is not in `verified_facts` or `signal.detail`, the copywriter cannot reference it. This prevents hallucinated hooks at the architectural level.

---

## Example 1: Demand-Side Company With Real Signal

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
  "data_need": "High-quality egocentric video of real-world physical interactions for DVA model pre-training. Their architecture pre-trains on video to learn motion/physics priors before fine-tuning on robot data.",
  "verified_facts": [
    "Founded 2024, exited stealth March 2026",
    "$450M Series A at $1.7B valuation, led by Premji Invest",
    "Building Direct Video Action (DVA) models for manufacturing and logistics automation",
    "DVA pre-trains on internet-scale video to learn motion/physics priors, then fine-tunes on robot data",
    "Alex Bergman is co-founder, Jagdeep Singh is also a co-founder"
  ],
  "disqualifiers": [],
  "existing_relationship": {
    "in_attio": true,
    "in_smartlead": false,
    "in_gmail": true,
    "contacts_master_match": true
  }
}
```

**Note:** `existing_relationship.in_attio` is `true` here. This lead would route to human review, not cold sequence. In this case Rhoda AI is already in active pipeline (Attio ID `052629b9`), so cold outreach would be inappropriate.

---

## Example 2: Company With No Verifiable Signal

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
  "data_need": "Likely needs real-world manipulation and navigation video for robot learning, based on their product focus on warehouse automation.",
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

**Note:** `signal` is `null` because no verifiable signal with a source URL was found. This is correct behavior. The orchestrator may choose to skip this lead or hold it for a future wave when a signal appears.
