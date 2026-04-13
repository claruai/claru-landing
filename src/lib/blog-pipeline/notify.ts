import type { BlogDraft } from './types';

const POST_TYPE_LABELS: Record<string, string> = {
  keyword:    '🔍 Keyword/SEO post',
  timely:     '⚡ Timely/trending post',
  case_study: '📋 Case study post',
};

interface NotifyScores {
  slopScore?: number;
  geoScore?: number;
  citabilityScore?: number;
  videoUrl?: string | null;
  editorialNotes?: string[];
  researchSources?: string[];
}

export async function notifySlack(
  draft: BlogDraft,
  postId: string,
  postType: 'keyword' | 'timely' | 'case_study' = 'keyword',
  twitterThread?: string,
  scores?: NotifyScores
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[notify] SLACK_WEBHOOK_URL not set, skipping');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claru.ai';
  const typeLabel = POST_TYPE_LABELS[postType] ?? '📝 Blog draft';

  const blocks: unknown[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${typeLabel} ready for review`, emoji: true },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${draft.title}*\n${draft.excerpt}`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Tags:* ${draft.tags.join(', ')}` },
        { type: 'mrkdwn', text: `*Slug:* \`${draft.slug}\`` },
        { type: 'mrkdwn', text: `*Post ID:* \`${postId}\`` },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '🔍 Review in Admin', emoji: true },
          url: `${baseUrl}/admin/blog-queue`,
          style: 'primary',
        },
      ],
    },
  ];

  // Quality scores section
  if (scores) {
    const scoreFields: Array<{ type: string; text: string }> = [];
    if (scores.slopScore !== undefined) scoreFields.push({ type: 'mrkdwn', text: `*Slop:* ${scores.slopScore}/10` });
    if (scores.geoScore !== undefined) scoreFields.push({ type: 'mrkdwn', text: `*GEO:* ${scores.geoScore}/100` });
    if (scores.citabilityScore !== undefined) scoreFields.push({ type: 'mrkdwn', text: `*Citability:* ${scores.citabilityScore}/100` });

    if (scoreFields.length > 0) {
      blocks.push({ type: 'section', fields: scoreFields });
    }

    // Video button or warning
    if (scores.videoUrl) {
      blocks.push({
        type: 'actions',
        elements: [{
          type: 'button',
          text: { type: 'plain_text', text: '🎬 Preview Video', emoji: true },
          url: scores.videoUrl,
        }],
      });
    } else {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: '⚠️ No video rendered' }],
      });
    }

    // Editorial notes (first 3)
    if (scores.editorialNotes && scores.editorialNotes.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Editorial notes:*\n${scores.editorialNotes.slice(0, 3).map(n => `• ${n}`).join('\n')}`,
        },
      });
    }
  }

  // For timely posts, append the Twitter thread draft so it can be copied immediately
  if (postType === 'timely' && twitterThread) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Twitter thread draft:*\n\`\`\`\n${twitterThread.slice(0, 2900)}\n\`\`\``,
      },
    });
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    console.error('[notify] Slack webhook failed:', res.status, await res.text());
  }
}
