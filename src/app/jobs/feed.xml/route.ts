/**
 * RSS 2.0 feed for active Claru job listings.
 *
 * Accessible at `/jobs/feed.xml`. Returns an XML document containing every
 * non-archived job sorted newest-first. The feed includes Atom self-link for
 * spec compliance and sets a one-hour public cache.
 *
 * Autodiscovery (`<link rel="alternate">`) will be added to the /jobs page
 * in a later story (US-009).
 */

import { getAllJobs } from '@/lib/jobs';

/** Escape special XML characters to prevent malformed output. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const jobs = getAllJobs(); // excludes archived by default, sorted newest-first

  const items = jobs
    .map((job) => {
      const link = `https://claru.ai/jobs/${encodeURIComponent(job.slug)}`;
      const truncatedDescription =
        job.description.length > 200
          ? `${job.description.substring(0, 200)}...`
          : job.description;

      return `
    <item>
      <title><![CDATA[${job.title}]]></title>
      <link>${escapeXml(link)}</link>
      <description><![CDATA[${truncatedDescription}]]></description>
      <pubDate>${new Date(job.datePosted).toUTCString()}</pubDate>
      <category>${escapeXml(job.category)}</category>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
    </item>`;
    })
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Claru AI Jobs</title>
    <link>https://claru.ai/jobs</link>
    <description>AI annotation and data labeling opportunities at Claru</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://claru.ai/jobs/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
