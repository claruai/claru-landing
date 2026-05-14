import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ShareMode = "all" | "showcase";

export interface MintTokenResult {
  token: string;
  share_url: string;
  expires_at: string;
  mode: ShareMode;
  reused: boolean;
  dataset_name: string;
}

export interface MintTokenOptions {
  expiresInDays?: number;
  mode?: ShareMode;
  forceRotate?: boolean;
}

const DEFAULT_EXPIRES_DAYS = 30;

export class ShareModeMismatchError extends Error {
  constructor(public readonly currentMode: ShareMode, public readonly requestedMode: ShareMode) {
    super(
      `Dataset's current share_mode is '${currentMode}' but caller requested '${requestedMode}'. ` +
        `Pass forceRotate:true to invalidate the existing token and mint a new one.`,
    );
    this.name = "ShareModeMismatchError";
  }
}

export class DatasetNotFoundError extends Error {
  constructor(public readonly datasetId: string) {
    super(`Dataset not found: ${datasetId}`);
    this.name = "DatasetNotFoundError";
  }
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";
}

export async function mintShareToken(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  datasetId: string,
  opts: MintTokenOptions = {},
): Promise<MintTokenResult> {
  const requestedMode: ShareMode = opts.mode ?? "all";
  const expiresInDays = opts.expiresInDays ?? DEFAULT_EXPIRES_DAYS;
  const forceRotate = opts.forceRotate ?? false;

  const { data: dataset, error: fetchErr } = await supabase
    .from("datasets")
    .select("id, name, share_token, share_expires_at, share_mode")
    .eq("id", datasetId)
    .single();

  if (fetchErr || !dataset) {
    throw new DatasetNotFoundError(datasetId);
  }

  const currentMode = (dataset.share_mode ?? "all") as ShareMode;

  if (dataset.share_token && !forceRotate) {
    if (currentMode !== requestedMode) {
      throw new ShareModeMismatchError(currentMode, requestedMode);
    }
    return {
      token: dataset.share_token,
      share_url: `${siteUrl()}/share/${dataset.share_token}`,
      expires_at: dataset.share_expires_at,
      mode: currentMode,
      reused: true,
      dataset_name: dataset.name,
    };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: updateErr } = await supabase
    .from("datasets")
    .update({
      share_token: token,
      share_expires_at: expiresAt,
      share_mode: requestedMode,
      share_view_count: 0,
      share_first_viewed_at: null,
    })
    .eq("id", datasetId);

  if (updateErr) {
    throw new Error(`Failed to update share token: ${updateErr.message}`);
  }

  return {
    token,
    share_url: `${siteUrl()}/share/${token}`,
    expires_at: expiresAt,
    mode: requestedMode,
    reused: false,
    dataset_name: dataset.name,
  };
}

export async function rotateShareToken(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", "public", any, any>,
  datasetId: string,
  opts: MintTokenOptions = {},
): Promise<MintTokenResult> {
  return mintShareToken(supabase, datasetId, { ...opts, forceRotate: true });
}
