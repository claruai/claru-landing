import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShareSettings {
  enabled: boolean;
  slug: string | null;
  expiry: string | null;
  gate_type: "none" | "email" | "password";
  gate_value: string | null;
  cta_enabled: boolean;
  cta_text: string | null;
  cta_url: string | null;
  show_branding: boolean;
}

const DEFAULT_SHARE_SETTINGS: ShareSettings = {
  enabled: false,
  slug: null,
  expiry: null,
  gate_type: "none",
  gate_value: null,
  cta_enabled: false,
  cta_text: null,
  cta_url: null,
  show_branding: true,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a string to a URL-safe kebab-case slug. */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Check if a slug is URL-safe: lowercase letters, digits, and hyphens only. */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/** Check if a string is a valid ISO 8601 date. */
function isValidISODate(str: string): boolean {
  const d = new Date(str);
  return !isNaN(d.getTime()) && d.toISOString() === str;
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");
  if (!token?.value || !(await verifyAdminToken(token.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ---------------------------------------------------------------------------
// GET /api/admin/deck-builder/[id]/share
// Returns share_settings for a template (or defaults).
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: template, error } = await supabase
    .from("slide_templates")
    .select("share_settings")
    .eq("id", id)
    .single();

  if (error || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 },
    );
  }

  const settings: ShareSettings = template.share_settings
    ? { ...DEFAULT_SHARE_SETTINGS, ...(template.share_settings as Partial<ShareSettings>) }
    : { ...DEFAULT_SHARE_SETTINGS };

  // Also fetch existing share tokens for this template
  const { data: tokens } = await supabase
    .from("deck_share_tokens")
    .select("id, email, token, lead_id, parent_lead_id, created_at, expires_at")
    .eq("template_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ share_settings: settings, tokens: tokens ?? [] });
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/deck-builder/[id]/share
// Updates share_settings JSONB on the template row.
// Auto-generates slug on first enable if not provided.
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Fetch current template (need name for slug generation and current settings)
  const { data: template, error: fetchErr } = await supabase
    .from("slide_templates")
    .select("name, share_settings")
    .eq("id", id)
    .single();

  if (fetchErr || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 },
    );
  }

  // Merge current settings with provided updates
  const current: ShareSettings = template.share_settings
    ? { ...DEFAULT_SHARE_SETTINGS, ...(template.share_settings as Partial<ShareSettings>) }
    : { ...DEFAULT_SHARE_SETTINGS };

  const updated = { ...current };

  // --- enabled ---
  if (typeof body.enabled === "boolean") {
    updated.enabled = body.enabled;
  }

  // --- slug ---
  if (typeof body.slug === "string") {
    const slug = body.slug.trim();
    if (!slug) {
      return NextResponse.json(
        { error: "Slug must be a non-empty string" },
        { status: 400 },
      );
    }
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: "Slug must be URL-safe (lowercase letters, digits, and hyphens)" },
        { status: 400 },
      );
    }
    updated.slug = slug;
  }

  // --- Auto-generate slug on first enable if no slug set ---
  if (updated.enabled && !updated.slug) {
    let slug = toSlug(template.name as string);
    if (!slug) slug = "deck";

    // Check uniqueness -- if conflict, append random suffix
    const { data: existing } = await supabase
      .from("slide_templates")
      .select("id")
      .neq("id", id)
      .filter("share_settings->>slug", "eq", slug)
      .limit(1);

    if (existing && existing.length > 0) {
      const suffix = crypto.randomBytes(2).toString("hex"); // 4 hex chars
      slug = `${slug}-${suffix}`;
    }

    updated.slug = slug;
  }

  // --- Validate slug uniqueness if it changed ---
  if (updated.slug && updated.slug !== current.slug) {
    const { data: conflicting } = await supabase
      .from("slide_templates")
      .select("id")
      .neq("id", id)
      .filter("share_settings->>slug", "eq", updated.slug)
      .limit(1);

    if (conflicting && conflicting.length > 0) {
      return NextResponse.json(
        { error: "Slug is already in use by another template" },
        { status: 409 },
      );
    }
  }

  // --- expiry ---
  if (body.expiry !== undefined) {
    if (body.expiry === null) {
      updated.expiry = null;
    } else if (typeof body.expiry === "string") {
      if (!isValidISODate(body.expiry)) {
        return NextResponse.json(
          { error: "Expiry must be a valid ISO 8601 date string or null" },
          { status: 400 },
        );
      }
      updated.expiry = body.expiry;
    } else {
      return NextResponse.json(
        { error: "Expiry must be a string (ISO date) or null" },
        { status: 400 },
      );
    }
  }

  // --- gate_type ---
  if (body.gate_type !== undefined) {
    if (!["none", "email", "password"].includes(body.gate_type as string)) {
      return NextResponse.json(
        { error: "gate_type must be 'none', 'email', or 'password'" },
        { status: 400 },
      );
    }
    updated.gate_type = body.gate_type as ShareSettings["gate_type"];
  }

  // --- gate_value ---
  if (body.gate_value !== undefined) {
    updated.gate_value = body.gate_value === null ? null : String(body.gate_value);
  }

  // --- cta_enabled ---
  if (typeof body.cta_enabled === "boolean") {
    updated.cta_enabled = body.cta_enabled;
  }

  // --- cta_text ---
  if (body.cta_text !== undefined) {
    updated.cta_text = body.cta_text === null ? null : String(body.cta_text);
  }

  // --- cta_url ---
  if (body.cta_url !== undefined) {
    updated.cta_url = body.cta_url === null ? null : String(body.cta_url);
  }

  // --- show_branding ---
  if (typeof body.show_branding === "boolean") {
    updated.show_branding = body.show_branding;
  }

  // Persist
  const { data: result, error: updateErr } = await supabase
    .from("slide_templates")
    .update({ share_settings: updated })
    .eq("id", id)
    .select("share_settings")
    .single();

  if (updateErr) {
    console.error("[PATCH /api/admin/deck-builder/[id]/share]", updateErr);
    return NextResponse.json(
      { error: "Failed to update share settings" },
      { status: 500 },
    );
  }

  return NextResponse.json({ share_settings: result?.share_settings ?? updated });
}
