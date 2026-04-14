# MCP Servers
**Last updated:** 2026-04-03

All MCP servers available in Claude sessions. Check which are active at session start — not all are always loaded.

---

## CRM

### Attio (`mcp__attio__*`)
**35 tools** — sole source of truth for all pipeline data.

Key tools:
| Tool | Does |
|------|------|
| `mcp__attio__search_records` | Find contacts/companies by name/email |
| `mcp__attio__get_record_details` | Full contact record (all attributes, notes) |
| `mcp__attio__create_note` | Add running context note to any record |
| `mcp__attio__batch_records` | Bulk create/update records — USE THIS instead of create_record |
| `mcp__attio__search_records_by_content` | Search across note content |

**Known gotcha:** `mcp__attio__create_record` fails with "Invalid location value" because Attio auto-triggers address enrichment. Use `mcp__attio__batch_records` with `operation_type: "create"` instead. Pass `first_name`/`last_name` as flat fields in the records array.

Key Attio IDs (frequently referenced):
| Contact | Company | Attio ID |
|---------|---------|---------|
| HackerRank | — | `cebc221b-acd2-40da-a20b-50992f6531d3` (company) |
| Metar Megiora | Decart | `7e67e3e6-01e3-498b-9055-2df14990b959` |
| Sourish Jasti | Physical Intelligence | `2bed5799-22de-45b6-8e9a-b6e09b48d13b` |
| Frank Britt | Aescape | `2c1feab7-ce3a-44f6-b8ab-fd1883aaf2e6` |
| Kirsty Lloyd-Jukes | Stateful Robotics | `0225421f-d2b6-470c-ac9a-d0b4c48fad81` |
| Eric Litman | Aescape (departed) | `5cbcae81-6d01-4aff-adfd-092c6703ad71` |
| Raj Patel | Human Archive | `5b7416ff-...` (note added Apr 3) |
| Adi / Aditya Jain | Google | `eff0d59c-...` (note added Apr 3) |

---

## Email / Calendar

### Google Workspace (`mcp__google-workspace__*`)
Covers **john@claru.ai only**. Contacts, calendar, Drive, Docs, Sheets, Slides.

Key tools:
| Tool | Does |
|------|------|
| `mcp__google-workspace__query_gmail_emails` | Search inbox OR sent. Always query both: `to:john@claru.ai` (inbound) AND `from:john@claru.ai` (sent). Never assess thread state from inbox alone — John may have already replied. |
| `mcp__google-workspace__gmail_get_message_details` | Get full email body (use `email_id`) |
| `mcp__google-workspace__gmail_reply_to_email` | Send a reply in an existing thread |
| `mcp__google-workspace__gmail_send_email` | Send new email |
| `mcp__google-workspace__create_gmail_draft` | Create draft without sending |
| `mcp__google-workspace__calendar_get_events` | Check john@claru.ai calendar |

**Does NOT cover:** john@moonvalley.com — that's Composio.

### Composio (`mcp__composio__*`)
Covers **john@moonvalley.com** (supply-side inbox, Notion Calendar bookings). Not always available — check at session start. If missing, moonvalley.com is a blind spot — flag it.

---

## Outbound / Campaigns

### Smartlead (`mcp__smartlead__*`)
**~116 tools** — campaign management, lead loading, analytics, webhook config.

Key tools:
| Tool | Does |
|------|------|
| `campaigns create` | Create a new campaign |
| `campaigns save-sequence` | Set email sequence (all touches at once) |
| `leads add` | Add leads with custom fields to a campaign |
| `campaigns set-status` | Start/pause/stop a campaign |
| `campaigns export` | Export campaign stats + replies |
| `leads list` | List leads in a campaign with status |

**Rate limit:** 60 requests per 60 seconds. Batch operations where possible.

**Gotchas:**
1. **Sequences are immutable on live campaigns.** Never use `save-sequence` on a campaign that has already sent emails — it overwrites everything. Build the ENTIRE sequence BEFORE adding leads and activating.
2. **Build sequence → add leads → activate.** Always in this order.
3. **`leads delete` returns raw string, not JSON.** Ignore parse errors.
4. **Every lead must have `attio_record_id` in custom fields.** See claru-outbound SKILL.md "Attio Record ID Dedup Check" section. Loading without it is a violation.
5. **Schedule timezone matters.** Use prospect's timezone for optimal delivery.

**Env:** `SMARTLEAD_API_KEY` — must be set in shell environment or `.env.local`.

---

## Contact Research

### Apollo (`mcp__apollo__*`)
Contact lookup, email verification, company data. Use for enriching prospects before outreach.

---

## Database

### Supabase (`mcp__supabase-db__*`)
Prod project: `usmgbihcevnvrkyvrlju`
Staging project: `kpjcbemvwxffibiohmvi`

Key operations:
- Corpus search: `match_clips` RPC with 768-dim embeddings
- Clip metadata: `clips` table (unified — replaces old `dataset_samples` + `video_index`)
- Dataset membership: `dataset_clips` join table

---

## Browser Automation

### Playwright (`mcp__playwright__*`)
Full browser automation. Use for UAT, testing portal flows, verifying deployments.

### gstack browse
Faster headless browser for QA. Check `~/.claude/skills/gstack/` — needs one-time build.
`$B goto url`, `$B snapshot -i`, `$B screenshot /tmp/out.png`

---

## Content / Creative

### Glif (`mcp__glif__*`)
Creative/image generation tools. Saved glif tools available via `mcp__glif__list_saved_glif_tools`.

### Notion (`mcp__notion__*`)
**Deprecated for CRM/pipeline use.** Attio is sole source of truth. Notion may still be used for Notion Calendar bookings (via moonvalley.com) — but the Target Customers DB is dead.

### Remotion Documentation (`mcp__remotion-documentation__*`)
Docs for Remotion (video rendering library used in social campaign compositions).

---

## Domain / SEO

### Google Search Console (`mcp__gsc__*`)
Search analytics, sitemap management, URL inspection for claru.ai.

### Namecheap (`mcp__namecheap__*`)
Domain management — list domains, set custom DNS.

### Domain Finder (`mcp__domain-finder__*`)
Check domain availability.

---

## Session Start Checklist

At the start of any session, verify these are loaded:
- [ ] `mcp__attio__*` — if missing, can't update CRM
- [ ] `mcp__google-workspace__*` — if missing, can't read claru.ai inbox
- [ ] `mcp__composio__*` — if missing, moonvalley.com is blind spot (flag it)
- [ ] `mcp__smartlead__*` — if missing, can't manage campaigns or load leads
- [ ] `mcp__supabase-db__*` — if missing, can't query corpus
