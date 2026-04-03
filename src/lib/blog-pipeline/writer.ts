import Anthropic from '@anthropic-ai/sdk';
import { VOICE_SYSTEM_PROMPT } from './generate';
import type { AnalystResult, ResearchBrief, BlogDraft } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runWriter(
  analystResult: AnalystResult,
  brief: ResearchBrief
): Promise<BlogDraft | null> {
  const sourcesList = brief.citableSources.length > 0
    ? brief.citableSources.map(s => `- ${s}`).join('\n')
    : '(no specific sources — draw on your knowledge of the field)';

  const faqSection = brief.faqQuestions.length > 0
    ? `\nPeople Also Ask (use these VERBATIM as FAQ ### headings):\n${brief.faqQuestions.map(q => `- ${q}`).join('\n')}`
    : '';

  const keyNumbers = brief.keyNumbers.length > 0
    ? `\nKey numbers to include:\n${brief.keyNumbers.map(n => `- ${n}`).join('\n')}`
    : '';

  const internalLinks = brief.internalLinks.length > 0
    ? `\nInternal links available (link to these naturally):\n${brief.internalLinks.join(', ')}`
    : '';

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: VOICE_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Write a blog post for:

Target query: "${analystResult.query}"
Angle: ${analystResult.angle}
Post type: ${analystResult.postType}

Research sources (cite these inline with source name):
${sourcesList}
${keyNumbers}
${faqSection}
${internalLinks}

Top insights from the research team:
${brief.topInsights.map(i => `- ${i}`).join('\n') || '(use your knowledge of the field)'}

Recommended angle: ${brief.recommendedAngle.join(' ')}

Return the complete post as JSON per the system prompt format.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in writer response');
    return JSON.parse(jsonMatch[0]) as BlogDraft;
  } catch {
    console.error('[writer] Parse error — query:', analystResult.query);
    console.error('[writer] Response snippet:', text.slice(0, 300));
    return null;
  }
}
