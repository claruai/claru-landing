import type { SupabaseClient } from "@supabase/supabase-js";

export type ShareMode = "all" | "showcase";

export interface ShareDatasetLookup {
  id: string;
  s3_bucket: string | null;
  share_expires_at: string | null;
  share_first_viewed_at: string | null;
  share_view_count: number | null;
  share_mode: ShareMode;
  name: string | null;
  description: string | null;
}

const TOKEN_RE = /^[a-f0-9]{64}$/;

export function isValidShareTokenFormat(token: string): boolean {
  return TOKEN_RE.test(token);
}

/**
 * Looks up a dataset by share_token, validates expiry, and returns the row
 * normalised so callers can react to share_mode.
 *
 * Returns null if the token format is invalid, the dataset is missing, or
 * the share link has expired.
 */
export async function lookupDatasetByShareToken(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  token: string,
  fields = "id, s3_bucket, share_expires_at, share_first_viewed_at, share_view_count, share_mode, name, description",
): Promise<ShareDatasetLookup | null> {
  if (!TOKEN_RE.test(token)) return null;

  const { data, error } = await supabase
    .from("datasets")
    .select(fields)
    .eq("share_token", token)
    .single();

  if (error || !data) return null;

  const row = data as unknown as ShareDatasetLookup;

  if (row.share_expires_at && new Date(row.share_expires_at) < new Date()) {
    return null;
  }

  // Normalise share_mode for downstream callers
  row.share_mode = (row.share_mode ?? "all") as ShareMode;
  return row;
}

/**
 * Returns the list of clip_ids accessible via a share link, honoring share_mode.
 *
 *  - share_mode='all'      → every clip in the dataset (lead-bound included) —
 *                            the historical behavior, preserved for backwards
 *                            compatibility with existing per-lead Custom Curations.
 *  - share_mode='showcase' → only clips with is_showcase=true AND lead_id IS NULL.
 *                            A showcase preview is a generic public view; we
 *                            never leak a clip that was curated for a different
 *                            specific lead.
 */
export async function listShareableClipIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  datasetId: string,
  shareMode: ShareMode,
): Promise<string[]> {
  let q = supabase
    .from("dataset_clips")
    .select("clip_id")
    .eq("dataset_id", datasetId);

  if (shareMode === "showcase") {
    q = q.eq("is_showcase", true).is("lead_id", null);
  }

  const { data, error } = await q;
  if (error) return [];

  const seen = new Set<string>();
  const ids: string[] = [];
  for (const row of data ?? []) {
    if (row.clip_id && !seen.has(row.clip_id)) {
      seen.add(row.clip_id);
      ids.push(row.clip_id);
    }
  }
  return ids;
}

/**
 * Authorize that the supplied clipId is reachable via the given share token's
 * dataset + share_mode. Use before serving any per-clip asset (annotation, s3-proxy).
 */
export async function isClipShareable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  datasetId: string,
  clipId: string,
  shareMode: ShareMode,
): Promise<boolean> {
  let q = supabase
    .from("dataset_clips")
    .select("clip_id", { count: "exact", head: true })
    .eq("dataset_id", datasetId)
    .eq("clip_id", clipId);

  if (shareMode === "showcase") {
    q = q.eq("is_showcase", true).is("lead_id", null);
  }

  const { count, error } = await q;
  return !error && (count ?? 0) > 0;
}
