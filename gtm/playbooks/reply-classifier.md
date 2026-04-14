# Reply Classification Prompt & Test Suite

**Purpose:** Canonical classification prompt for inbound email replies. Used by the `handle-smartlead-reply` Supabase Edge Function and by agents during manual sweep classification.

**Rule:** The classifier must NEVER generate response content. Classify and route only.

---

## Classification Prompt

```
Classify this email reply into exactly ONE category:

- interested: wants to proceed, asks for next step, shares requirements, requests samples
- question: asks about corpus, pricing, methodology, capabilities, or logistics
- objection: price too high, timing wrong, competitor preferred, not relevant to their work
- ooo: automated out-of-office reply (vacation, leave, travel)
- unsubscribe: asks to be removed, "stop emailing me", "not interested" with finality
- referral: forwards to another person, CCs a colleague, suggests contacting someone else
- not_interested: polite decline without finality ("not right now", "maybe later", "not a priority")

Also extract:
- return_date: if OOO, parse the return date as YYYY-MM-DD. If no date found, set to null.
- referred_contact: if referral, extract { "name": string, "email": string, "title": string } or null for any unknown field.
- confidence: 0.0-1.0 — how certain you are about the classification.

RULES:
- Output JSON only. No preamble, no explanation.
- If the reply is ambiguous or could fit multiple categories, pick the MOST ACTIONABLE one and lower your confidence score.
- NEVER generate a suggested response. Classification only.
- OOO return date parsing: look for "back on [date]", "returning [date]", "out until [date]". If no date found, set return_date to null.
- A reply that shares requirements AND asks a question is "interested" (sharing requirements is the stronger signal).
- "Let me loop in [name]" is a referral, not interested — the original contact is deferring.

Reply body:
{REPLY_BODY}

Output format:
{
  "category": "interested|question|objection|ooo|unsubscribe|referral|not_interested",
  "return_date": "YYYY-MM-DD or null",
  "referred_contact": { "name": "string", "email": "string", "title": "string" } | null,
  "confidence": 0.0-1.0
}
```

---

## Confidence Threshold

| Confidence | Action |
|------------|--------|
| >= 0.75 | Auto-route per category rules below |
| < 0.75 | Route to human review — do NOT auto-action |

When confidence is below threshold, the system writes to `reply_events` with `classification` set but `attio_synced = false`, and sends a Slack notification to `#gtm-alerts` with the reply body and suggested category for human decision.

---

## Category Routing Rules

| Category | Auto-action (no human needed) | Human required |
|----------|-------------------------------|----------------|
| interested | Pause Smartlead sequence, create Attio note | ALWAYS — Slack notify, human drafts reply |
| question | Create Attio note, draft answer suggestion | ALWAYS — human reviews before send |
| objection | Create Attio note, classify subtype | ALWAYS — human decides response |
| ooo | Pause sequence, parse return_date, set Attio reminder | Only if return_date is null |
| unsubscribe | Suppress all campaigns, set Attio "do not contact" | No |
| referral | Create Attio note, extract new contact | ALWAYS — human decides whether to pursue |
| not_interested | Create Attio note, remove from active sequence | No |

---

## Integration with handle-smartlead-reply Edge Function

The Edge Function (Tier 2, Task 2.2) calls this classification prompt as Step 3 of its pipeline:

```
Smartlead webhook (EMAIL_REPLIED)
  -> Edge Function: handle-smartlead-reply
     1. Parse payload (lead_email, reply_body, campaign_id, timestamp)
     2. Write to reply_events table (durable — idempotent upsert on smartlead_message_id)
     3. Call Claude Haiku with this classification prompt  <-- THIS DOCUMENT
     4. Update reply_events row with classification + confidence
     5. If confidence >= 0.75: execute auto-actions per routing table
     6. If confidence < 0.75: skip auto-actions, flag for human
     7. Update Attio via REST API (create note, update deal stage if warranted)
     8. Slack webhook: notify #gtm-alerts for interested, question, referral, or low-confidence
```

The Edge Function passes the reply body into `{REPLY_BODY}` and parses the JSON output. If JSON parsing fails, the event is preserved in `reply_events` with `classification = null` for manual triage.

**Model choice:** Claude Haiku for speed and cost. Classification is a constrained task — Haiku handles it well. Do NOT use Opus/Sonnet for classification.

---

## Test Suite

All examples below are realistic replies based on actual Claru pipeline interactions. Expected output follows each reply.

### Test 1: Interested — shares requirements (based on Metar/Decart thread)

**Reply:**
```
Yes, sounds interesting. Can you share pricing and what amounts you have available?
We're mainly looking at game footage and cinematic video for our gen model.
```

**Expected:**
```json
{
  "category": "interested",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.95
}
```

---

### Test 2: Question — asks about methodology (based on Mirelo thread)

**Reply:**
```
Thanks for reaching out. A few questions — how is the audio-visual data captured?
Is it studio-recorded or field-captured? And what frame rates do you typically deliver at?
```

**Expected:**
```json
{
  "category": "question",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.90
}
```

---

### Test 3: Objection — not relevant (based on typical robotics mismatch)

**Reply:**
```
Appreciate the note, but we're fully synthetic for our training pipeline.
Don't use real-world video data at all. Good luck with the project though.
```

**Expected:**
```json
{
  "category": "objection",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.90
}
```

---

### Test 4: OOO — with parseable return date (based on Kirsty/Stateful Robotics)

**Reply:**
```
Hi, thanks for your email. I'm currently out of the office and will be back on April 7th.
I'll have limited access to email during this time. For urgent matters,
please contact operations@statefulrobotics.com.
```

**Expected:**
```json
{
  "category": "ooo",
  "return_date": "2026-04-07",
  "referred_contact": null,
  "confidence": 0.99
}
```

---

### Test 5: Unsubscribe — clear opt-out

**Reply:**
```
Please remove me from your mailing list. Do not contact me again.
```

**Expected:**
```json
{
  "category": "unsubscribe",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.99
}
```

---

### Test 6: Referral — forwards to colleague (based on Dean/Decart forwarding to Metar)

**Reply:**
```
Hey John, looping in Metar who handles our data pipeline.
Metar, this is John from Claru — they have video datasets that might be relevant.

Metar Megiora <metar@decart.ai>
```

**Expected:**
```json
{
  "category": "referral",
  "return_date": null,
  "referred_contact": {
    "name": "Metar Megiora",
    "email": "metar@decart.ai",
    "title": null
  },
  "confidence": 0.95
}
```

---

### Test 7: Not interested — polite decline (based on typical cold outreach reply)

**Reply:**
```
Thanks for thinking of us. Not something we're looking at right now,
but I'll keep you in mind if our data needs change.
```

**Expected:**
```json
{
  "category": "not_interested",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.85
}
```

---

### Test 8: Ambiguous — interested or question? (based on Akshat/Perceptron thread)

**Reply:**
```
This could be interesting. What does a typical sample pack look like?
Do you have anything with dense action sequences — sports, cooking, that kind of thing?
```

**Expected:**
```json
{
  "category": "interested",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.70
}
```

**Why ambiguous:** Asks questions (could be "question") but expresses interest and describes what they want (leans "interested"). Confidence should be below 0.75, routing to human review.

---

### Test 9: Ambiguous — not_interested or objection? (timing-based decline)

**Reply:**
```
Hey John, appreciate the outreach. We just locked in our data vendor for Q2
so the timing doesn't work. Might revisit in Q3.
```

**Expected:**
```json
{
  "category": "not_interested",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.65
}
```

**Why ambiguous:** Could be "objection" (timing wrong) or "not_interested" (polite decline). The "might revisit" signals it's not final, but they have an existing vendor. Low confidence routes to human.

---

### Test 10: Ambiguous — OOO without a date (based on Eric/Aescape departure)

**Reply:**
```
Hi there, I'm no longer with Aescape as of last month.
You may want to reach out to Frank Britt who took over my role.
```

**Expected:**
```json
{
  "category": "referral",
  "return_date": null,
  "referred_contact": {
    "name": "Frank Britt",
    "email": null,
    "title": null
  },
  "confidence": 0.70
}
```

**Why ambiguous:** Could be "not_interested" (they left the company) or "referral" (they suggest a successor). Referral is more actionable. Low confidence because no email provided for the referral.

---

### Test 11: Interested — internal forward with CC (based on PI/Karol forwarding to Sourish)

**Reply:**
```
+Sourish — can you take a look at this? Might be relevant for the manipulation data pipeline.

Sourish Jasti <sourish.jasti@physicalintelligence.company>
```

**Expected:**
```json
{
  "category": "referral",
  "return_date": null,
  "referred_contact": {
    "name": "Sourish Jasti",
    "email": "sourish.jasti@physicalintelligence.company",
    "title": null
  },
  "confidence": 0.90
}
```

---

### Test 12: OOO — no parseable date

**Reply:**
```
I am currently on parental leave and will not be checking email regularly.
For immediate assistance, please contact our general inbox at info@example.com.
```

**Expected:**
```json
{
  "category": "ooo",
  "return_date": null,
  "referred_contact": null,
  "confidence": 0.95
}
```

**Note:** No return date found. System should flag for human to set a reminder manually.

---

## Scoring Criteria

When evaluating classifier accuracy on this test suite:

- **Category match** is the primary metric. Must be >= 90% (11/12 correct).
- **Confidence calibration:** ambiguous cases (Tests 8, 9, 10) should have confidence < 0.75. Non-ambiguous cases should have confidence >= 0.80.
- **Field extraction:** return_date must parse correctly for Test 4. referred_contact must extract name + email for Tests 6, 11.
- **No response generation:** if the classifier outputs anything beyond the JSON schema (suggested reply, explanation, commentary), it fails regardless of accuracy.

---

## Edge Cases to Watch

1. **Auto-reply spam filters** — "This email was sent to an unmonitored inbox" is not a human reply. Treat as OOO with null return_date.
2. **Multi-part replies** — if the reply quotes the original email, the classifier must only classify the NEW content, not the quoted thread.
3. **Non-English replies** — route to human review with low confidence. Do not attempt classification in languages the prompt wasn't tested on.
4. **Empty or single-word replies** — "Thanks" or "OK" are ambiguous. Route to human (confidence < 0.75).
5. **Bounce notifications** — delivery failure notices are not replies. The Edge Function should filter these before classification.
