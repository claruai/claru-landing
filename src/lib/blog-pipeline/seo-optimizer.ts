import Anthropic from '@anthropic-ai/sdk';
import { loadSkill } from './skills';
import type { AnalystResult, SeoOutput } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SEO_ROLE = `You are a technical SEO and GEO (Generative Engine Optimization) specialist for Claru's blog. You optimize posts to rank in Google AND get cited by AI assistants (ChatGPT, Perplexity, Claude, Gemini).`;

async function runSeoPass(
  bodyMdx: string,
  excerpt: string,
  analystResult: AnalystResult,
  passNumber: number
): Promise<SeoOutput> {
  const systemPrompt = [
    SEO_ROLE,
    '---',
    loadSkill('geo-content'),
    '---',
    loadSkill('geo-citability'),
    '---',
    loadSkill('on-page'),
  ].join('\n\n');

  const serpFaqSection = (analystResult.serpFAQs ?? []).length > 0
    ? `\nReplace existing FAQ headings with these VERBATIM People Also Ask questions:\n${(analystResult.serpFAQs ?? []).map(q => `- ${q}`).join('\n')}`
    : '';

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `${passNumber > 1 ? `RETRY PASS ${passNumber}: GEO score was below 65. Be more aggressive with citability improvements.\n\n` : ''}

Optimize this blog post for SEO and GEO (AI citations):

Target keyword: "${analystResult.query}"
Post type: ${analystResult.postType}
${serpFaqSection}

Optimization checklist:
1. H1 must exactly match or closely paraphrase the target keyword
2. Rewrite any section with citability < 50 to open with a direct answer sentence (source named inline)
3. E-E-A-T check: every quantitative claim must name the source inline in the same sentence
4. Excerpt must start with a number or named entity (not a gerund like "Understanding..." or "Exploring...")
5. Replace FAQ ### headings with the verbatim PAA questions above (if provided)
6. Add at least 2 anchor links to /glossary or /training-data-for-robotics where naturally relevant

After optimization, score:
- geoScore 0-100: how likely AI assistants are to cite this post (100 = every key claim is standalone-citable)
- citabilityScore 0-100: how many claims have inline source attribution

Post to optimize:
EXCERPT: ${excerpt}

BODY:
${bodyMdx}

Return JSON only:
{
  "revisedBodyMdx": "...",
  "revisedExcerpt": "...",
  "seoNotes": ["Changed X to improve Y", "..."],
  "geoScore": 72,
  "citabilityScore": 68
}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('No JSON in SEO response');
    const parsed = JSON.parse(m[0]) as SeoOutput;
    return {
      revisedBodyMdx: parsed.revisedBodyMdx ?? bodyMdx,
      revisedExcerpt: parsed.revisedExcerpt ?? excerpt,
      seoNotes: parsed.seoNotes ?? [],
      geoScore: typeof parsed.geoScore === 'number' ? parsed.geoScore : 50,
      citabilityScore: typeof parsed.citabilityScore === 'number' ? parsed.citabilityScore : 50,
    };
  } catch {
    console.error('[seo-optimizer] Parse error on pass', passNumber);
    return { revisedBodyMdx: bodyMdx, revisedExcerpt: excerpt, seoNotes: ['SEO parse error — using original'], geoScore: 50, citabilityScore: 50 };
  }
}

export async function runSeoOptimizer(
  bodyMdx: string,
  excerpt: string,
  analystResult: AnalystResult
): Promise<SeoOutput> {
  try {
    const firstPass = await runSeoPass(bodyMdx, excerpt, analystResult, 1);

    if (firstPass.geoScore >= 65) {
      return firstPass;
    }

    console.log(`[seo-optimizer] geoScore ${firstPass.geoScore} < 65 — running retry pass`);
    const secondPass = await runSeoPass(firstPass.revisedBodyMdx, firstPass.revisedExcerpt, analystResult, 2);

    if (secondPass.geoScore < 65) {
      return {
        ...secondPass,
        seoNotes: [
          ...secondPass.seoNotes,
          `geoScore ${secondPass.geoScore} still below 65 after 2 passes — manual SEO review recommended`,
        ],
      };
    }

    return secondPass;
  } catch (err) {
    console.error('[seo-optimizer] Unexpected error:', err);
    return {
      revisedBodyMdx: bodyMdx,
      revisedExcerpt: excerpt,
      seoNotes: ['SEO optimizer failed — using original'],
      geoScore: 50,
      citabilityScore: 50,
    };
  }
}
