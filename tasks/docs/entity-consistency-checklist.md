# Entity Consistency Checklist

> Canonical source of truth: `src/lib/entity-profile.ts`

## Canonical Company Description

Use the following description verbatim on every platform:

> **Purpose-built human annotation data for frontier AI labs, specializing in text, vision, video, and robotics modalities.**

Short variant (for character-limited fields):

> Expert human intelligence for AI labs — text, vision, video, and robotics annotation data.

## Tagline

> Expert Human Intelligence for AI Labs

## Identity

| Field       | Value                  |
|-------------|------------------------|
| Brand name  | Claru                  |
| Legal name  | Reka AI Inc.           |
| Website     | https://claru.ai       |
| Email       | team@claru.ai          |

---

## Platform Checklist

| Platform    | Expected URL                                           | Status           | Description to Use          | sameAs in Schema |
|-------------|--------------------------------------------------------|------------------|-----------------------------|------------------|
| **LinkedIn** | https://www.linkedin.com/company/claruai              | Exists           | Canonical (full)            | Yes              |
| **GitHub**   | https://github.com/claruai                            | Exists           | Canonical (full)            | Yes              |
| **Crunchbase** | https://www.crunchbase.com/organization/claru-ai    | Needs creation   | Canonical (full)            | Yes (once live)  |
| **G2**       | https://www.g2.com/products/claru/reviews             | Needs creation   | Canonical (full)            | Yes (once live)  |
| **Capterra** | https://www.capterra.com/p/claru/                     | Needs creation   | Short variant               | Yes (once live)  |

### Current sameAs array in Organization JSON-LD (`src/app/layout.tsx`)

```json
"sameAs": [
  "https://github.com/claruai",
  "https://www.linkedin.com/company/claruai"
]
```

As new profiles are created, add their URLs to the `sameAs` array in the Organization schema and update this checklist.

---

## Keeping Descriptions in Sync

1. **Single source of truth** — Always start from `src/lib/entity-profile.ts`. If the description changes, update that file first, then propagate.

2. **On every profile update**, cross-check:
   - `src/lib/entity-profile.ts` — the TypeScript constant
   - `src/app/layout.tsx` — Organization JSON-LD `description` field
   - `public/llms.txt` — opening description paragraph
   - Each external platform listed above

3. **Quarterly review** — Every quarter, open each platform URL and confirm:
   - Company name matches (`Claru`)
   - Description matches the canonical text
   - Logo is current
   - Website link points to `https://claru.ai`

4. **When adding a new platform**:
   - Copy the canonical description from `src/lib/entity-profile.ts`
   - Add the profile URL to the sameAs array in `src/app/layout.tsx`
   - Add a row to the table above
   - Commit the updated checklist

5. **Validation** — After any change, confirm the Organization schema at https://validator.schema.org still passes and the sameAs URLs resolve.
