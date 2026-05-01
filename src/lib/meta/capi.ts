import crypto from "crypto";

const GRAPH_API_VERSION = "v21.0";

function hash(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.toLowerCase().trim();
  if (!normalized) return null;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function normalizePhone(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits || null;
}

function normalizeDob(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return digits.slice(0, 8);
}

function normalizeCity(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.toLowerCase().replace(/\s+/g, "");
}

export interface MetaUserData {
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  subscriptionId?: string | null;
}

export interface MetaCapiEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  actionSource?:
    | "website"
    | "system_generated"
    | "physical_store"
    | "phone_call"
    | "chat"
    | "email"
    | "other";
  userData: MetaUserData;
  customData?: Record<string, unknown>;
}

function buildUserData(u: MetaUserData): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  const em = hash(u.email);
  if (em) data.em = [em];

  const ph = hash(normalizePhone(u.phone));
  if (ph) data.ph = [ph];

  const ge = hash(u.gender ? u.gender.charAt(0) : null);
  if (ge) data.ge = [ge];

  const db = hash(normalizeDob(u.dateOfBirth));
  if (db) data.db = [db];

  const fn = hash(u.firstName);
  if (fn) data.fn = [fn];

  const ln = hash(u.lastName);
  if (ln) data.ln = [ln];

  const ct = hash(normalizeCity(u.city));
  if (ct) data.ct = [ct];

  const st = hash(u.state);
  if (st) data.st = [st];

  const zp = hash(u.zip);
  if (zp) data.zp = [zp];

  const country = hash(u.country);
  if (country) data.country = [country];

  const externalId = hash(u.externalId);
  if (externalId) data.external_id = [externalId];

  if (u.clientIpAddress) data.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) data.client_user_agent = u.clientUserAgent;
  if (u.fbc) data.fbc = u.fbc;
  if (u.fbp) data.fbp = u.fbp;
  if (u.subscriptionId) data.subscription_id = u.subscriptionId;

  return data;
}

export async function sendCapiEvent(event: MetaCapiEvent): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[meta-capi] META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set; skipping send");
    }
    return;
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: event.actionSource ?? "website",
        user_data: buildUserData(event.userData),
        ...(event.customData ? { custom_data: event.customData } : {}),
      },
    ],
  };

  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn(`[meta-capi] Non-OK response ${res.status} for ${event.eventName}: ${body}`);
    }
  } catch (err) {
    console.warn(`[meta-capi] Send failed for ${event.eventName}:`, err);
  }
}
