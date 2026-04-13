import Anthropic from '@anthropic-ai/sdk';
import { loadSkill } from './skills';
import type { EditorOutput } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EDITOR_ROLE = `You are an adversarial editor for Claru's technical blog. Your job is to detect and eliminate AI writing patterns that signal machine-generated text to a discerning reader.

Claru's readers are ML researchers and engineers at frontier labs. They can spot AI-written text instantly and will distrust the whole post if they find it.`;

async function runEditorPass(bodyMdx: string, passNumber: number): Promise<EditorOutput> {
  const systemPrompt = [
    EDITOR_ROLE,
    '---',
    loadSkill('stop-slop'),
    '---',
    loadSkill('humanizer'),
  ].join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `${passNumber > 1 ? `RETRY PASS ${passNumber}: The previous pass did not sufficiently humanize this content. Be more aggressive.\n\n` : ''}

Perform three editing passes on this blog post:

**Pass 1 — Stop-Slop checklist**: Flag every instance of forbidden words and AI patterns per the stop-slop skill. List them.

**Pass 2 — Humanizer rewrite**: Rewrite each flagged passage using the humanizer skill rules. Replace AI patterns with specific, grounded, opinionated prose.

**Pass 3 — Adversarial question**: Answer "What 3 things about this text most clearly signal it was AI-generated?" then rewrite those specific passages.

After all passes, provide:
- The fully revised body_mdx (complete, not a diff)
- Editorial notes listing what changed and why
- A slop score 1-10 (10 = reads like a senior ML engineer wrote it, 1 = obvious AI slop)

Original blog post:
${bodyMdx}

Return JSON only:
{
  "revisedBodyMdx": "...",
  "editorialNotes": ["Changed X because Y", "..."],
  "slopScore": 8
}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('No JSON in editor response');
    const parsed = JSON.parse(m[0]) as EditorOutput;
    return {
      revisedBodyMdx: parsed.revisedBodyMdx ?? bodyMdx,
      editorialNotes: parsed.editorialNotes ?? [],
      slopScore: typeof parsed.slopScore === 'number' ? parsed.slopScore : 5,
    };
  } catch {
    console.error('[editor] Parse error on pass', passNumber);
    return { revisedBodyMdx: bodyMdx, editorialNotes: ['Editor parse error — using original'], slopScore: 5 };
  }
}

export async function runEditor(bodyMdx: string): Promise<EditorOutput> {
  try {
    const firstPass = await runEditorPass(bodyMdx, 1);

    if (firstPass.slopScore >= 7) {
      return firstPass;
    }

    // Retry pass if score < 7
    console.log(`[editor] slopScore ${firstPass.slopScore} < 7 — running retry pass`);
    const secondPass = await runEditorPass(firstPass.revisedBodyMdx, 2);

    if (secondPass.slopScore < 7) {
      return {
        ...secondPass,
        editorialNotes: [
          ...secondPass.editorialNotes,
          'slopScore below threshold after 2 passes — manual review recommended',
        ],
      };
    }

    return secondPass;
  } catch (err) {
    console.error('[editor] Unexpected error:', err);
    return {
      revisedBodyMdx: bodyMdx,
      editorialNotes: ['Editor failed — using original body'],
      slopScore: 5,
    };
  }
}
