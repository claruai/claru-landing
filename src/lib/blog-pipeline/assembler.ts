import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { AssemblyInput } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Insert video embed after first '---' or first '## ', before second '## '
// ---------------------------------------------------------------------------
function injectVideoEmbed(bodyMdx: string, videoUrl: string): string {
  const embedTag = `<video src="${videoUrl}" autoPlay loop muted playsInline />\n\n`;

  // Try inserting after first '---' separator
  const hrIndex = bodyMdx.indexOf('\n---\n');
  if (hrIndex !== -1) {
    return bodyMdx.slice(0, hrIndex + 5) + embedTag + bodyMdx.slice(hrIndex + 5);
  }

  // Fall back: insert before second '## '
  const firstH2 = bodyMdx.indexOf('\n## ');
  const secondH2 = firstH2 !== -1 ? bodyMdx.indexOf('\n## ', firstH2 + 1) : -1;
  if (secondH2 !== -1) {
    return bodyMdx.slice(0, secondH2 + 1) + embedTag + bodyMdx.slice(secondH2 + 1);
  }

  // Last resort: append at end
  return bodyMdx + '\n\n' + embedTag;
}

// ---------------------------------------------------------------------------
// Generate Twitter thread for timely posts
// ---------------------------------------------------------------------------
async function generateTwitterThread(bodyMdx: string, twitterHook?: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Generate a 5-7 tweet Twitter thread promoting this blog post. Rules:
- Tweet 1: ${twitterHook ? `Use this hook: "${twitterHook}"` : 'Hook — the surprising finding or number, NOT "we wrote a post"'}
- Tweets 2-5: Key insights, each tweet standalone (no "as mentioned in tweet 1")
- Final tweet: CTA — use [POST_URL] as placeholder for the URL
- Each tweet under 280 chars
- No hashtags, no emojis unless they add clarity
- No AI slop: no "game-changing", "comprehensive", "revolutionary"

Blog post:
${bodyMdx.slice(0, 3000)}

Return the thread as tweets separated by "\\n\\n---\\n\\n":`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.trim();
}

// ---------------------------------------------------------------------------
// Check if visualConcept references a number not in final body
// ---------------------------------------------------------------------------
function checkVisualStatAlignment(visualConcept: string, finalBodyMdx: string): boolean {
  const numberPattern = /\b\d+(?:[.,]\d+)?%?\b/g;
  const conceptNumbers = visualConcept.match(numberPattern) ?? [];
  if (conceptNumbers.length === 0) return false; // no numbers to check

  return conceptNumbers.some(num => {
    const bare = num.replace(/[%,]/g, '');
    return !finalBodyMdx.includes(bare);
  });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export async function runAssembler(input: AssemblyInput): Promise<{ postId: string } | null> {
  const { analystResult, draft, editorOutput, seoOutput, visualOutput, brief } = input;

  const supabase = getSupabase();

  // Build final body from SEO output, inject video if available
  let finalBodyMdx = seoOutput.revisedBodyMdx;
  if (visualOutput.videoUrl) {
    finalBodyMdx = injectVideoEmbed(finalBodyMdx, visualOutput.videoUrl);
  }

  // Build editorial notes
  const editorialNotes: string[] = [
    ...editorOutput.editorialNotes,
    ...seoOutput.seoNotes,
  ];

  // Check visual stat alignment
  if (checkVisualStatAlignment(visualOutput.visualConcept, finalBodyMdx)) {
    editorialNotes.push('visual may reference outdated stat — review before publishing');
  }

  // Generate Twitter thread for timely posts
  let twitterThread: string | null = null;
  if (analystResult.postType === 'timely') {
    try {
      twitterThread = await generateTwitterThread(finalBodyMdx, analystResult.twitterHook);
    } catch (err) {
      console.error('[assembler] Twitter thread generation failed:', err);
    }
  }

  // Skip if a post with this slug already exists (any status)
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id, status')
    .eq('slug', draft.slug)
    .limit(1)
    .single();

  if (existing) {
    console.log(`[assembler] Slug "${draft.slug}" already exists (status: ${existing.status}) — skipping insert`);
    return { postId: existing.id as string };
  }

  // Insert to blog_posts
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: draft.slug,
      title: draft.title,
      excerpt: seoOutput.revisedExcerpt,
      body_mdx: finalBodyMdx,
      tags: draft.tags,
      source_urls: draft.source_urls,
      mentions: draft.mentions ?? [],
      status: 'pending_review',
      post_type: analystResult.postType,
      slop_score: editorOutput.slopScore,
      seo_score: seoOutput.geoScore, // seo_score maps from geoScore
      geo_score: seoOutput.geoScore,
      citability_score: seoOutput.citabilityScore,
      editorial_notes: editorialNotes,
      research_sources: brief.citableSources.slice(0, 5),
      video_url: visualOutput.videoUrl ?? null,
      composition_id: visualOutput.compositionId ?? null,
      input_props: visualOutput.inputProps ?? null,
      composition_code: visualOutput.compositionCode ?? null,
      twitter_thread: twitterThread,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[assembler] Insert failed:', error?.message);
    return null;
  }

  return { postId: data.id as string };
}
