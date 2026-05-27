/**
 * Country detection from incoming request + South America + Mexico
 * membership check.
 *
 * Production: Vercel auto-injects `x-vercel-ip-country` on serverless
 * function requests (Pro/Enterprise plans). Fallback to `cf-ipcountry`
 * if proxied through Cloudflare.
 *
 * Local dev: those headers are absent. We accept a `?dev_geo=BR` query
 * param escape hatch when NODE_ENV !== "production" so we can test both
 * SA and non-SA branches against localhost.
 */

import type { NextRequest } from "next/server";

const SA_PLUS_MX = new Set<string>([
  // South America
  "AR", // Argentina
  "BO", // Bolivia
  "BR", // Brazil
  "CL", // Chile
  "CO", // Colombia
  "EC", // Ecuador
  "GY", // Guyana
  "PY", // Paraguay
  "PE", // Peru
  "SR", // Suriname
  "UY", // Uruguay
  "VE", // Venezuela
  // Mexico — included per product decision (LATAM-job alignment)
  "MX",
]);

export type GeoInfo = {
  country: string | null;
  isLatamConversion: boolean;
  source: "vercel" | "cloudflare" | "dev_geo" | "none";
};

export function detectGeo(req: NextRequest): GeoInfo {
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    const c = vercelCountry.toUpperCase();
    return { country: c, isLatamConversion: SA_PLUS_MX.has(c), source: "vercel" };
  }

  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry) {
    const c = cfCountry.toUpperCase();
    return { country: c, isLatamConversion: SA_PLUS_MX.has(c), source: "cloudflare" };
  }

  // Dev-only escape hatch — never honored in production.
  if (process.env.NODE_ENV !== "production") {
    const dev = req.nextUrl.searchParams.get("dev_geo");
    if (dev) {
      const c = dev.toUpperCase();
      return { country: c, isLatamConversion: SA_PLUS_MX.has(c), source: "dev_geo" };
    }
  }

  return { country: null, isLatamConversion: false, source: "none" };
}

export function isLatamConversionCountry(country: string | null | undefined): boolean {
  if (!country) return false;
  return SA_PLUS_MX.has(country.toUpperCase());
}
