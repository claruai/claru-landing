import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  mintShareToken,
  rotateShareToken,
  ShareModeMismatchError,
  DatasetNotFoundError,
  type ShareMode,
} from "@/lib/share/mint-token";

/**
 * POST /api/admin/catalog/[id]/share
 *
 * Mints (or returns existing) share token for a dataset. Configures share_mode.
 *
 * Body: { mode?: 'all' | 'showcase' (default 'all'), expires_in_days?: number,
 *         force_rotate?: boolean }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { mode?: ShareMode; expires_in_days?: number; force_rotate?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine — use defaults
  }

  try {
    const supabase = createSupabaseAdminClient();
    const result = body.force_rotate
      ? await rotateShareToken(supabase, id, {
          mode: body.mode,
          expiresInDays: body.expires_in_days,
        })
      : await mintShareToken(supabase, id, {
          mode: body.mode,
          expiresInDays: body.expires_in_days,
        });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof DatasetNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ShareModeMismatchError) {
      return NextResponse.json(
        { error: err.message, current_mode: err.currentMode, requested_mode: err.requestedMode },
        { status: 409 },
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/admin/catalog/[id]/share]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/catalog/[id]/share — invalidate the current share token.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("datasets")
    .update({
      share_token: null,
      share_expires_at: null,
      share_first_viewed_at: null,
      share_view_count: 0,
    })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
