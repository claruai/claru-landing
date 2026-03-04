// =============================================================================
// Slide Layout HTML Templates — Polished presentation design
// =============================================================================

import type { SlideData } from '@/types/deck-builder';
import type { SlideTheme } from './slide-themes';

// ---------------------------------------------------------------------------
// Markdown to HTML
// ---------------------------------------------------------------------------

function markdownToHTML(md: string): string {
  if (!md) return '';
  let html = md;

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, (_m, code: string) =>
    `<pre><code>${escapeHTML(code.trim())}</code></pre>`
  );
  // Inline code
  html = html.replace(/`([^`]+)`/g, (_m, c: string) => `<code>${escapeHTML(c)}</code>`);
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists
  const lines = html.split('\n');
  const processed: string[] = [];
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      if (!inList) { processed.push('<ul>'); inList = true; }
      processed.push(`<li>${trimmed.slice(2)}</li>`);
    } else {
      if (inList) { processed.push('</ul>'); inList = false; }
      processed.push(line);
    }
  }
  if (inList) processed.push('</ul>');
  html = processed.join('\n');

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map((b) => {
    const t = b.trim();
    if (!t) return '';
    if (t.startsWith('<pre>') || t.startsWith('<ul>') || t.startsWith('<ol>')) return t;
    return `<p>${t.replace(/\n/g, '<br>')}</p>`;
  }).filter(Boolean).join('\n');

  return html;
}

function escapeHTML(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Background CSS
// ---------------------------------------------------------------------------

export function getBackgroundCSS(bg: SlideData['background']): string {
  switch (bg.type) {
    case 'solid': return `background-color: ${bg.value};`;
    case 'gradient': return `background: ${bg.value};`;
    case 'image': return `background-image: url('${bg.value}'); background-size: cover; background-position: center;`;
  }
}

// ---------------------------------------------------------------------------
// Shared style helpers
// ---------------------------------------------------------------------------

function headingStyle(theme: SlideTheme, size: string = '52px'): string {
  return `
    font-family: ${theme.fonts.heading};
    font-size: ${size};
    font-weight: 700;
    color: ${theme.colors.text};
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0;
  `;
}

function bodyStyle(theme: SlideTheme): string {
  return `
    font-family: ${theme.fonts.body};
    font-size: 20px;
    color: ${theme.colors.secondaryText};
    line-height: 1.7;
  `;
}

function accentBar(theme: SlideTheme): string {
  return `<div style="width: 48px; height: 3px; background: ${theme.colors.accent}; border-radius: 2px; margin-bottom: 24px;"></div>`;
}

function tagLabel(theme: SlideTheme, text: string): string {
  return `<div style="
    display: inline-block;
    font-family: ${theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${theme.colors.accent};
    background: ${theme.colors.accent}15;
    border: 1px solid ${theme.colors.accent}30;
    border-radius: 4px;
    padding: 4px 12px;
    margin-bottom: 20px;
  ">${escapeHTML(text)}</div>`;
}

// ---------------------------------------------------------------------------
// Layout Renderers
// ---------------------------------------------------------------------------

function renderTitleLayout(slide: SlideData, theme: SlideTheme): string {
  const hasBody = slide.body.trim().length > 0;
  const bodyHTML = markdownToHTML(slide.body);

  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 100%;
      padding: 60px;
    ">
      <div style="
        width: 48px; height: 3px;
        background: ${theme.colors.accent};
        border-radius: 2px;
        margin-bottom: 32px;
      "></div>
      <h1 style="
        ${headingStyle(theme, '72px')}
        max-width: 900px;
        text-align: center;
        text-shadow: 0 2px 40px ${theme.colors.background}80;
      ">${escapeHTML(slide.title)}</h1>
      ${hasBody ? `
        <div class="slide-body" style="
          ${bodyStyle(theme)}
          max-width: 600px;
          text-align: center;
          margin-top: 28px;
          font-size: 22px;
        ">${bodyHTML}</div>
      ` : ''}
    </div>
  `;
}

function renderTitleBodyLayout(slide: SlideData, theme: SlideTheme): string {
  const bodyHTML = markdownToHTML(slide.body);

  return `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      max-width: 1000px;
      gap: 0;
    ">
      ${accentBar(theme)}
      <h1 style="
        ${headingStyle(theme)}
        margin-bottom: 28px;
      ">${escapeHTML(slide.title)}</h1>
      <div class="slide-body" style="
        ${bodyStyle(theme)}
        padding-left: 2px;
      ">${bodyHTML}</div>
    </div>
  `;
}

function renderTwoColumnLayout(slide: SlideData, theme: SlideTheme): string {
  const parts = slide.body.split('---');
  const leftHTML = markdownToHTML(parts[0]?.trim() ?? '');
  const rightHTML = markdownToHTML(parts[1]?.trim() ?? parts[0]?.trim() ?? '');

  return `
    <div style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      gap: 28px;
    ">
      ${slide.title ? `
        <div>
          ${accentBar(theme)}
          <h1 style="${headingStyle(theme, '44px')}">${escapeHTML(slide.title)}</h1>
        </div>
      ` : ''}
      <div style="
        display: flex;
        flex: 1;
        gap: 0;
        align-items: stretch;
      ">
        <div class="slide-body" style="
          flex: 1;
          ${bodyStyle(theme)}
          padding: 28px 32px 28px 0;
        ">${leftHTML}</div>
        <div style="
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, ${theme.colors.accent}40 20%, ${theme.colors.accent}40 80%, transparent 100%);
          flex-shrink: 0;
        "></div>
        <div class="slide-body" style="
          flex: 1;
          ${bodyStyle(theme)}
          padding: 28px 0 28px 32px;
        ">${rightHTML}</div>
      </div>
    </div>
  `;
}

function renderImageLeftLayout(slide: SlideData, theme: SlideTheme): string {
  const bodyHTML = markdownToHTML(slide.body);
  const imgHTML = slide.image_url
    ? `<img src="${escapeHTML(slide.image_url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />`
    : placeholderImage(theme);

  return `
    <div style="display:flex;width:100%;height:100%;gap:48px;align-items:center;">
      <div style="width:42%;height:75%;flex-shrink:0;overflow:hidden;border-radius:12px;border:1px solid ${theme.colors.border};box-shadow:0 8px 32px ${theme.colors.background}80;">
        ${imgHTML}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:0;">
        ${accentBar(theme)}
        ${slide.title ? `<h1 style="${headingStyle(theme, '38px')}margin-bottom:20px;">${escapeHTML(slide.title)}</h1>` : ''}
        <div class="slide-body" style="${bodyStyle(theme)}">${bodyHTML}</div>
      </div>
    </div>
  `;
}

function renderImageRightLayout(slide: SlideData, theme: SlideTheme): string {
  const bodyHTML = markdownToHTML(slide.body);
  const imgHTML = slide.image_url
    ? `<img src="${escapeHTML(slide.image_url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />`
    : placeholderImage(theme);

  return `
    <div style="display:flex;width:100%;height:100%;gap:48px;align-items:center;">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:0;">
        ${accentBar(theme)}
        ${slide.title ? `<h1 style="${headingStyle(theme, '38px')}margin-bottom:20px;">${escapeHTML(slide.title)}</h1>` : ''}
        <div class="slide-body" style="${bodyStyle(theme)}">${bodyHTML}</div>
      </div>
      <div style="width:42%;height:75%;flex-shrink:0;overflow:hidden;border-radius:12px;border:1px solid ${theme.colors.border};box-shadow:0 8px 32px ${theme.colors.background}80;">
        ${imgHTML}
      </div>
    </div>
  `;
}

function renderQuoteLayout(slide: SlideData, theme: SlideTheme): string {
  const bodyHTML = markdownToHTML(slide.body);

  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 100%;
      padding: 60px;
    ">
      <div style="
        font-size: 120px;
        color: ${theme.colors.accent};
        line-height: 0.6;
        opacity: 0.25;
        user-select: none;
        font-family: Georgia, serif;
        margin-bottom: 8px;
      ">&ldquo;</div>
      <div class="slide-body" style="
        font-family: ${theme.fonts.body};
        font-size: 32px;
        font-style: italic;
        color: ${theme.colors.text};
        line-height: 1.6;
        max-width: 800px;
        opacity: 0.9;
      ">${bodyHTML}</div>
      ${slide.title ? `
        <div style="
          margin-top: 36px;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          <div style="width:32px;height:1px;background:${theme.colors.accent};"></div>
          <span style="
            font-family: ${theme.fonts.mono};
            font-size: 13px;
            color: ${theme.colors.accent};
            letter-spacing: 0.08em;
            text-transform: uppercase;
          ">${escapeHTML(slide.title)}</span>
          <div style="width:32px;height:1px;background:${theme.colors.accent};"></div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderBlankLayout(slide: SlideData, theme: SlideTheme): string {
  const bodyHTML = markdownToHTML(slide.body);

  return `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      max-width: 1000px;
    ">
      <div class="slide-body" style="
        ${bodyStyle(theme)}
        font-size: 22px;
        color: ${theme.colors.text};
      ">${bodyHTML}</div>
    </div>
  `;
}

function placeholderImage(theme: SlideTheme): string {
  return `<div style="
    width:100%;height:100%;display:flex;align-items:center;justify-content:center;
    background:${theme.colors.secondaryBg};
    border:1px dashed ${theme.colors.border};
    border-radius:12px;
    color:${theme.colors.secondaryText};
    font-family:${theme.fonts.mono};font-size:13px;
  ">No image</div>`;
}

// ---------------------------------------------------------------------------
// Main Renderer
// ---------------------------------------------------------------------------

export function renderSlideLayout(slide: SlideData, theme: SlideTheme): string {
  switch (slide.layout) {
    case 'title':       return renderTitleLayout(slide, theme);
    case 'title-body':  return renderTitleBodyLayout(slide, theme);
    case 'two-column':  return renderTwoColumnLayout(slide, theme);
    case 'image-left':  return renderImageLeftLayout(slide, theme);
    case 'image-right': return renderImageRightLayout(slide, theme);
    case 'quote':       return renderQuoteLayout(slide, theme);
    case 'blank':       return renderBlankLayout(slide, theme);
    default:            return renderTitleBodyLayout(slide, theme);
  }
}
