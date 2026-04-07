import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all crawlers, block private routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },

      // Explicitly allow AI search/citation crawlers
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/experiment/", "/api/", "/v1/"],
      },

      // Block AI training crawlers
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "meta-externalagent",
        disallow: "/",
      },
    ],
    sitemap: "https://claru.ai/sitemap.xml",
  };
}
