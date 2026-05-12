import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Detect dev mode robustly. Next 16 + Node 25 sometimes leaves NODE_ENV as
// "production" inside `next dev`, so we check argv and the absence of Vercel
// production markers as well.
const isDev =
  process.env.NODE_ENV !== "production" ||
  process.argv.includes("dev") ||
  process.argv.some((a) => a.includes("next-dev") || a.includes("next/dist/bin/next")) ||
  (!process.env.VERCEL_ENV && !process.env.CI);

const nextConfig: NextConfig = {
  // Exclude large media files from serverless function bundles.
  // Videos and remotion samples are served as static assets — never needed server-side.
  outputFileTracingExcludes: {
    "*": [
      "./public/videos/**",
      "./public/remotion-assets/samples/**",
      "./public/remotion-assets/enrichments/**",
      "./public/qa-frames/**",
    ],
  },
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/work-with-us",
        destination: "/for-annotators",
        permanent: true,
      },
      {
        source: "/v2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v2/review",
        destination: "/",
        permanent: false,
      },
      // GSC indexing error fixes — legacy pillar pages → current pages
      // /solutions is kept as-is (it's a working SSR listing page)
      {
        source: "/data",
        destination: "/data-catalog",
        permanent: true,
      },
      {
        source: "/labeling",
        destination: "/#services",
        permanent: true,
      },
      {
        source: "/catalog",
        destination: "/data-catalog",
        permanent: true,
      },
      // Also redirect nested data-catalog paths
      {
        source: "/data-catalog/request",
        destination: "/data-catalog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://us.i.posthog.com https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://bzrcdn.openai.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://us.i.posthog.com https://*.ingest.us.sentry.io https://vercel.live https://*.amazonaws.com https://*.cloudfront.net https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.facebook.com https://connect.facebook.net https://bzrcdn.openai.com wss://vercel.live; frame-src 'self' https://calendly.com https://vercel.live https://td.doubleclick.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://calendly.com;`,
          },
        ],
      },
      {
        source: "/share/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
