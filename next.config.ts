import type { NextConfig } from "next";

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

export default nextConfig;
