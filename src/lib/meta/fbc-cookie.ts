"use client";

const FBC_COOKIE = "_fbc";
const FBP_COOKIE = "_fbp";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 2;

function getRootDomain(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  return host === "claru.ai" || host.endsWith(".claru.ai") ? ".claru.ai" : "";
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, domain: string): void {
  if (typeof document === "undefined") return;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    "Secure",
  ];
  if (domain) parts.push(`Domain=${domain}`);
  document.cookie = parts.join("; ");
}

export function syncMetaCookiesAcrossSubdomains(): void {
  if (typeof window === "undefined") return;
  const domain = getRootDomain();
  if (!domain) return;

  const fbclid = new URL(window.location.href).searchParams.get("fbclid");
  if (fbclid) {
    const existing = readCookie(FBC_COOKIE);
    if (!existing || !existing.endsWith(`.${fbclid}`)) {
      writeCookie(FBC_COOKIE, `fb.1.${Date.now()}.${fbclid}`, domain);
    }
  }

  const fbp = readCookie(FBP_COOKIE);
  if (fbp) writeCookie(FBP_COOKIE, fbp, domain);
}
