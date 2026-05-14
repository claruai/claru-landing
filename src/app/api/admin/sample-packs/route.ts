import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildSamplePack } from "@/lib/sample-packs/build";

/**
 * POST /api/admin/sample-packs
 *
 * Orchestrates: resolve source datasets → collect their showcase clips →
 * find-or-create lead → create a fresh Custom Curation → attach clips →
 * grant lead access → mint share token. Returns the share URL.
 *
 * Body: {
 *   source_dataset_slugs: string[],
 *   recipient: { name: string; email: string; company: string },
 *   note?: string,
 *   expires_in_days?: number,
 *   test_isolation?: boolean,
 * }
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    source_dataset_slugs?: string[];
    recipient?: { name?: string; email?: string; company?: string };
    note?: string;
    expires_in_days?: number;
    test_isolation?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.source_dataset_slugs) || body.source_dataset_slugs.length === 0) {
    return NextResponse.json({ error: "source_dataset_slugs[] is required" }, { status: 400 });
  }
  if (!body.recipient?.email || !body.recipient.company) {
    return NextResponse.json(
      { error: "recipient.email and recipient.company are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const result = await buildSamplePack(supabase, {
      sourceDatasetSlugs: body.source_dataset_slugs,
      recipient: {
        name: body.recipient.name ?? "",
        email: body.recipient.email,
        company: body.recipient.company,
      },
      note: body.note,
      expiresInDays: body.expires_in_days,
      testIsolation: body.test_isolation,
    });
    // Reshape lead to mirror the MCP tool's response (nested {created} flag)
    return NextResponse.json(
      {
        dataset_id: result.dataset_id,
        dataset_name: result.dataset_name,
        dataset_slug: result.dataset_slug,
        share_url: result.share_url,
        share_token: result.share_token,
        expires_at: result.expires_at,
        lead: {
          id: result.lead.id,
          email: result.lead.email,
          name: result.lead.name,
          company: result.lead.company,
          created: result.lead_created,
        },
        clip_count: result.clip_count,
        per_source_breakdown: result.per_source_breakdown,
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/admin/sample-packs]", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
