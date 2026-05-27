/**
 * Server-side TikTok Events API (CAPI) sender.
 *
 * Fires conversion events from our backend in parallel with the
 * browser pixel. Dedupes with client `ttq.track(...)` calls via a
 * shared `event_id` we generate in the form before submit.
 *
 * Required env:
 *   TIKTOK_ACCESS_TOKEN     — long-lived token from TikTok Events
 *                             Manager → Manage → Settings.
 *   TIKTOK_EVENT_SOURCE_ID  — the numeric pixel_id (NOT the
 *                             alphanumeric pixel_code shown in UI).
 *                             Use list_tiktok_pixels to look up.
 *
 * Optional env:
 *   TIKTOK_TEST_EVENT_CODE  — when set, the payload includes
 *                             `test_event_code` so events surface
 *                             under the "Test Events" tab in Events
 *                             Manager instead of counting against
 *                             live conversions. Unset in production.
 *
 * No-ops with a console.warn if either required var is missing —
 * never blocks the form submission.
 *
 * Docs: https://business-api.tiktok.com/portal/docs?id=1771101303285761
 */

import crypto from "crypto";

const ENDPOINT = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

type TikTokContent = {
  content_id: string;
  content_type?: "product" | "product_group";
  content_name?: string;
};

type TikTokServerEventInput = {
  event: string; // e.g. "CompleteRegistration", "SubmitForm", "Lead"
  event_id: string; // dedup key — must match the value passed to ttq.track on the client
  email?: string;
  phone?: string; // E.164 format, e.g. +5511999999999
  externalId?: string; // stable visitor id (same value passed as identify.external_id on the client)
  ip?: string;
  userAgent?: string;
  url?: string;
  referrer?: string;
  contents?: TikTokContent[];
  value?: number;
  currency?: string;
  utm?: Record<string, string | undefined>;
};

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

export async function sendTikTokServerEvent(
  input: TikTokServerEventInput,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const eventSourceId = process.env.TIKTOK_EVENT_SOURCE_ID;

  if (!accessToken || !eventSourceId) {
    console.warn("[tiktok-server] Missing TIKTOK_ACCESS_TOKEN or TIKTOK_EVENT_SOURCE_ID — skipping server event");
    return { ok: false, error: "missing_env" };
  }

  const user: Record<string, unknown> = {};
  if (input.email) user.email = sha256(input.email);
  if (input.phone) user.phone = sha256(input.phone);
  if (input.externalId) user.external_id = sha256(input.externalId);
  if (input.ip) user.ip = input.ip;
  if (input.userAgent) user.user_agent = input.userAgent;

  const properties: Record<string, unknown> = {};
  if (input.contents) properties.contents = input.contents;
  if (typeof input.value === "number") properties.value = input.value;
  if (input.currency) properties.currency = input.currency;
  if (input.utm) {
    for (const [k, v] of Object.entries(input.utm)) {
      if (v) properties[k] = v;
    }
  }

  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE;

  const body: Record<string, unknown> = {
    event_source: "web",
    event_source_id: eventSourceId,
    data: [
      {
        event: input.event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.event_id,
        user,
        properties,
        page: {
          url: input.url,
          referrer: input.referrer,
        },
      },
    ],
  };

  // Test mode — events route to the Test Events tab instead of live
  // conversions. Unset TIKTOK_TEST_EVENT_CODE to send real events.
  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[tiktok-server] Event API non-2xx", res.status, text.slice(0, 300));
      return { ok: false, status: res.status, error: text };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.warn("[tiktok-server] Event API threw", err);
    return { ok: false, error: String(err) };
  }
}
