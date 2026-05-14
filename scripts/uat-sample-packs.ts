/**
 * End-to-end UAT for the Sample Pack workflow.
 *
 * Runs against the local dev server (http://localhost:3010). Mints a real
 * admin JWT, drives the new endpoints (sample-pack orchestrator, showcase
 * toggle, share-mode mint/rotate, lead sample-packs history) and the public
 * share view. Cleans up its own artifacts.
 *
 * Usage: tsx scripts/uat-sample-packs.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { SignJWT } from "jose";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.UAT_BASE_URL ?? "http://localhost:3010";
const RUN_ID = `uat-${Date.now()}`;
const TEST_EMAIL = `qa+${RUN_ID}@claru.ai`;
const TEST_COMPANY = `Claru UAT ${RUN_ID}`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

let pass = 0;
let fail = 0;
const failures: string[] = [];

function assertEq(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    failures.push(`${label}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
    console.log(`  ✗ ${label}`);
    console.log(`      expected: ${JSON.stringify(expected)}`);
    console.log(`      actual:   ${JSON.stringify(actual)}`);
  }
}

function assertTrue(label: string, cond: boolean, hint?: string) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    failures.push(label + (hint ? `\n      ${hint}` : ""));
    console.log(`  ✗ ${label}${hint ? ` — ${hint}` : ""}`);
  }
}

async function mintAdminCookie() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
  return `admin-token=${token}`;
}

async function api(path: string, init: RequestInit = {}, cookie?: string): Promise<{ status: number; body: any }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(init.headers ?? {}),
    },
    redirect: "manual",
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = await res.text();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { status: res.status, body: body as any };
}

async function main() {
  console.log(`\n=== UAT @ ${BASE} — ${RUN_ID} ===\n`);

  const cookie = await mintAdminCookie();

  // ---------- 1. Anonymous probe: existing share link still works ----------
  console.log("[1] Backwards-compatibility regression");
  const { data: existingShare } = await supabase
    .from("datasets")
    .select("id, share_token, share_mode, name")
    .not("share_token", "is", null)
    .limit(1)
    .single();

  if (existingShare?.share_token) {
    const res = await fetch(`${BASE}/share/${existingShare.share_token}`, { redirect: "manual" });
    assertTrue(
      `existing share link returns 200 (was: ${res.status})`,
      res.status === 200,
      `dataset=${existingShare.name} share_mode=${existingShare.share_mode}`,
    );
    assertEq("existing share_mode preserved as 'all'", existingShare.share_mode, "all");
  } else {
    console.log("  (no pre-existing share token to test backwards-compat)");
  }

  // ---------- 2. Showcase share link for salon dataset ----------
  console.log("\n[2] Showcase share link — mint via REST + verify filter");
  const { data: salon } = await supabase
    .from("datasets")
    .select("id, share_token, share_mode")
    .eq("slug", "egocentric-long-form-salon-healthcare")
    .single();
  assertTrue("salon dataset exists", !!salon);

  // Mint showcase share link
  const mintRes = await api(
    `/api/admin/catalog/${salon!.id}/share`,
    { method: "POST", body: JSON.stringify({ mode: "showcase", expires_in_days: 30, force_rotate: true }) },
    cookie,
  );
  assertEq("mint share status", mintRes.status, 200);
  assertEq("mint share mode='showcase'", mintRes.body?.mode, "showcase");
  const showcaseUrl = mintRes.body?.share_url as string;
  const showcaseToken = mintRes.body?.token as string;
  assertTrue("share_url looks valid", /\/share\/[a-f0-9]{64}$/.test(showcaseUrl ?? ""));

  // Open the share page anonymously
  const viewRes = await fetch(showcaseUrl, { redirect: "manual" });
  assertEq("anonymous /share/<token> returns 200", viewRes.status, 200);

  // Verify it returns only 4 showcase clips via the urls API
  const urlsRes = await fetch(`${BASE}/api/share/${showcaseToken}/urls`, {
    method: "POST",
  });
  assertEq("urls api returns 200", urlsRes.status, 200);
  const urlsBody = await urlsRes.json();
  assertEq("showcase mode returns 4 clips", urlsBody.clips?.length, 4);

  // Repeat: now flip to 'all' mode and verify all 20 clips returned
  const rotateRes = await api(
    `/api/admin/catalog/${salon!.id}/share`,
    { method: "POST", body: JSON.stringify({ mode: "all", expires_in_days: 30, force_rotate: true }) },
    cookie,
  );
  assertEq("rotate to all status", rotateRes.status, 200);
  const allUrlsRes = await fetch(`${BASE}/api/share/${rotateRes.body.token}/urls`, { method: "POST" });
  const allUrlsBody = await allUrlsRes.json();
  assertEq("all mode returns 20 clips", allUrlsBody.clips?.length, 20);

  // Clean up: delete the share token (admin DELETE)
  const delRes = await api(`/api/admin/catalog/${salon!.id}/share`, { method: "DELETE" }, cookie);
  assertEq("share delete status", delRes.status, 200);

  // ---------- 3. Mode-mismatch rejection (without force_rotate) ----------
  console.log("\n[3] Mode-mismatch rejection");
  // Mint as 'all'
  await api(
    `/api/admin/catalog/${salon!.id}/share`,
    { method: "POST", body: JSON.stringify({ mode: "all" }) },
    cookie,
  );
  // Try to mint as 'showcase' without force_rotate
  const mismatchRes = await api(
    `/api/admin/catalog/${salon!.id}/share`,
    { method: "POST", body: JSON.stringify({ mode: "showcase" }) },
    cookie,
  );
  assertEq("mismatch returns 409", mismatchRes.status, 409);
  // cleanup
  await api(`/api/admin/catalog/${salon!.id}/share`, { method: "DELETE" }, cookie);

  // ---------- 4. send_sample_pack orchestrator end-to-end ----------
  console.log("\n[4] Sample-pack orchestrator");
  const packRes = await api(
    `/api/admin/sample-packs`,
    {
      method: "POST",
      body: JSON.stringify({
        source_dataset_slugs: [
          "egocentric-long-form-salon-healthcare",
          "egocentric-long-form-outdoor-urban-nature",
        ],
        recipient: { name: "QA Person", email: TEST_EMAIL, company: TEST_COMPANY },
        expires_in_days: 7,
        note: `UAT ${RUN_ID}`,
        test_isolation: true,
      }),
    },
    cookie,
  );
  assertEq("orchestrator status", packRes.status, 201);
  assertEq("clip_count = 8", packRes.body?.clip_count, 8);
  assertTrue("share_url returned", typeof packRes.body?.share_url === "string");
  assertTrue("lead created", packRes.body?.lead?.created === true);

  // Verify the share URL renders 8 clips
  const packUrlsRes = await fetch(`${BASE}/api/share/${packRes.body.share_token}/urls`, {
    method: "POST",
  });
  const packUrlsBody = await packUrlsRes.json();
  assertEq("orchestrator share returns 8 clips", packUrlsBody.clips?.length, 8);

  // ---------- 5. List sample packs for the lead ----------
  console.log("\n[5] Sample-pack history per lead");
  const histRes = await api(
    `/api/admin/leads/${packRes.body.lead.id}/sample-packs`,
    { method: "GET" },
    cookie,
  );
  assertEq("history status", histRes.status, 200);
  assertEq("history has 1 pack", histRes.body?.packs?.length, 1);
  assertEq("history pack matches", histRes.body?.packs?.[0]?.dataset_id, packRes.body.dataset_id);

  // ---------- 6. Showcase toggle via PATCH ----------
  console.log("\n[6] Showcase toggle on a base clip");
  // Pick a non-showcase clip in salon to toggle ON
  const { data: nonShowcase } = await supabase
    .from("dataset_clips")
    .select("clip_id")
    .eq("dataset_id", salon!.id)
    .is("lead_id", null)
    .eq("is_showcase", false)
    .limit(1);
  const clipId = nonShowcase?.[0]?.clip_id as string;
  assertTrue("found a non-showcase clip to toggle", !!clipId);

  const onRes = await api(
    `/api/admin/catalog/${salon!.id}/samples/${clipId}`,
    { method: "PATCH", body: JSON.stringify({ is_showcase: true }) },
    cookie,
  );
  assertEq("toggle ON status", onRes.status, 200);
  assertEq("showcase count increased", onRes.body?.current_showcase_count, 5);

  // Revert
  const offRes = await api(
    `/api/admin/catalog/${salon!.id}/samples/${clipId}`,
    { method: "PATCH", body: JSON.stringify({ is_showcase: false }) },
    cookie,
  );
  assertEq("toggle OFF status", offRes.status, 200);
  assertEq("showcase count back to 4", offRes.body?.current_showcase_count, 4);

  // ---------- 6b. PATCH mixed-payload rejection ----------
  console.log("\n[6b] PATCH rejects mixed is_showcase + clip-field payloads");
  const mixedRes = await api(
    `/api/admin/catalog/${salon!.id}/samples/${clipId}`,
    { method: "PATCH", body: JSON.stringify({ is_showcase: true, ai_caption: "should not stick" }) },
    cookie,
  );
  assertEq("mixed payload returns 400", mixedRes.status, 400);
  assertTrue(
    "rejection lists offending fields",
    Array.isArray(mixedRes.body?.rejected_fields) &&
      mixedRes.body.rejected_fields.includes("ai_caption"),
  );

  // ---------- 7. Auth gate on each new endpoint ----------
  console.log("\n[7] Auth-gate regression — no cookie ⇒ 307 redirect");
  for (const [method, path] of [
    ["POST", "/api/admin/sample-packs"],
    ["POST", `/api/admin/catalog/${salon!.id}/share`],
    ["PATCH", `/api/admin/catalog/${salon!.id}/samples/${clipId}`],
    ["GET", `/api/admin/leads/${packRes.body.lead.id}/sample-packs`],
  ] as const) {
    const r = await fetch(`${BASE}${path}`, { method, headers: { "Content-Type": "application/json" }, body: method === "GET" ? undefined : "{}", redirect: "manual" });
    assertTrue(`${method} ${path} blocks anon (got ${r.status})`, r.status === 307 || r.status === 401);
  }

  // ---------- Cleanup ----------
  console.log("\n[cleanup]");
  const cleanupErrors: string[] = [];
  const runStep = async (label: string, fn: () => Promise<{ error: unknown } | void>) => {
    try {
      const res = await fn();
      const err = (res as { error?: unknown })?.error;
      if (err) cleanupErrors.push(`${label}: ${(err as { message?: string })?.message ?? String(err)}`);
    } catch (err) {
      cleanupErrors.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  await runStep("dataset_clips delete", () =>
    supabase.from("dataset_clips").delete().eq("dataset_id", packRes.body.dataset_id),
  );
  await runStep("lead_dataset_access delete", () =>
    supabase.from("lead_dataset_access").delete().eq("dataset_id", packRes.body.dataset_id),
  );
  await runStep("datasets delete", () =>
    supabase.from("datasets").delete().eq("id", packRes.body.dataset_id),
  );
  await runStep("leads delete", () =>
    supabase.from("leads").delete().eq("id", packRes.body.lead.id),
  );

  if (cleanupErrors.length === 0) {
    console.log("  cleaned up sample pack + lead");
  } else {
    console.log("  cleanup partial — errors:");
    cleanupErrors.forEach((e) => console.log(`    • ${e}`));
  }

  // Post-cleanup leftover assertions — UAT must leave the catalog clean.
  console.log("\n[leftover scan]");
  const { count: leftoverPacks } = await supabase
    .from("datasets")
    .select("id", { count: "exact", head: true })
    .eq("created_for_lead_id", packRes.body.lead.id);
  assertEq("no leftover sample-pack datasets for test lead", leftoverPacks ?? 0, 0);

  const { count: leftoverDatasets } = await supabase
    .from("datasets")
    .select("id", { count: "exact", head: true })
    .like("slug", "test-sample-%");
  assertEq("no orphan test-sample-* datasets", leftoverDatasets ?? 0, 0);

  const { count: leftoverLeads } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .like("email", `qa+${RUN_ID}%`);
  assertEq("no leftover qa+ leads for this run", leftoverLeads ?? 0, 0);

  // ---------- Final ----------
  console.log("\n--- UAT summary ---");
  console.log(`  ${pass} passed, ${fail} failed`);
  if (fail > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log(`  • ${f}`));
    process.exit(1);
  }
}

main().catch(async (err) => {
  console.error("\nUAT crashed:", err);
  // Best-effort leftover scan even when main crashes — surfaces orphans
  // from a partial run so they can be cleaned up manually.
  try {
    const { count } = await supabase
      .from("datasets")
      .select("id", { count: "exact", head: true })
      .like("slug", "test-sample-%");
    if ((count ?? 0) > 0) {
      console.error(`  ⚠ ${count} orphan test-sample-* dataset(s) left behind. Inspect & clean.`);
    }
  } catch {
    /* ignore secondary failures */
  }
  process.exit(1);
});
