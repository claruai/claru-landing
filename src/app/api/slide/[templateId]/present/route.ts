import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTheme } from "@/lib/deck-builder/slide-themes";
import { renderSlideLayout, getBackgroundCSS } from "@/lib/deck-builder/slide-layouts";
import { rewriteS3ToProxy } from "@/lib/deck-builder/rewrite-s3-urls";
import type { SlideData, SlideThemeCustom } from "@/types/deck-builder";
import type { SlideTheme } from "@/lib/deck-builder/slide-themes";

/**
 * GET /api/slide/[templateId]/present
 *
 * Serves the full presentation with all slides, keyboard/touch navigation,
 * overview mode, progress bar, and PostMessage API. All CSS and JS are inline
 * — the page is completely self-contained.
 *
 * S3 media references are rewritten to /api/media/s3?key=... proxy URLs.
 * The proxy handles signing at request time, so URLs never expire.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await params;

  const supabase = createSupabaseAdminClient();

  const { data: template } = await supabase
    .from("slide_templates")
    .select("name, slides_json, theme, custom_theme")
    .eq("id", templateId)
    .single();

  if (!template) {
    return new Response("Template not found", { status: 404 });
  }

  const slides = (template.slides_json as SlideData[]) ?? [];

  if (slides.length === 0) {
    return new Response("No slides in template", { status: 404 });
  }

  const theme = getTheme(
    template.theme ?? "terminal-green",
    template.custom_theme as SlideThemeCustom | undefined,
  );

  // Sort slides by order
  const sorted = [...slides].sort((a, b) => a.order - b.order);

  // Build HTML for each slide, rewriting S3 URLs to proxy format
  const slidesHTML = sorted
    .map((slide, i) => {
      let html = slide.html ?? layoutToHtml(slide, theme);
      html = rewriteS3ToProxy(html);
      return `    <div class="slide" data-index="${i}">${html}</div>`;
    })
    .join("\n");

  const origin = request.nextUrl.origin;
  const title = (template.name as string) || "Presentation";
  const html = buildPresentationPage(slidesHTML, theme, origin, title);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache",
    },
  });
}

/**
 * Convert a layout-based slide into full HTML (background + grid + glow + content).
 * Mirrors layoutToHtml from html-renderer.ts.
 */
function layoutToHtml(slide: SlideData, theme: SlideTheme): string {
  const bgCSS = getBackgroundCSS(slide.background);
  const content = renderSlideLayout(slide, theme);

  return `<div style="position:absolute;inset:0;${bgCSS}"></div>
<div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(${theme.colors.accent}15 1px,transparent 1px),linear-gradient(90deg,${theme.colors.accent}15 1px,transparent 1px);background-size:60px 60px;"></div>
<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 15% 50%,${theme.colors.accent}18 0%,transparent 55%),radial-gradient(ellipse at 85% 50%,${theme.colors.accent}0c 0%,transparent 55%);"></div>
<div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:60px 80px;">${content}</div>`;
}

/**
 * Build the full self-contained presentation HTML page.
 * Ports CSS and JS from renderSlidesToHTML in html-renderer.ts.
 */
function buildPresentationPage(
  slidesHTML: string,
  theme: SlideTheme,
  origin: string,
  title: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${origin}/">
  <title>${escapeHtml(title)}</title>
  <style>
    /* ===== Reset & Base ===== */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: ${theme.fonts.body};
      color: ${theme.colors.text};
      background: ${theme.colors.background};
    }

    /*
     * ===== Slide Stage =====
     * Fixed 1920x1080 canvas, centered and scaled to fit the viewport.
     */
    .slide-stage {
      position: fixed;
      inset: 0;
      overflow: hidden;
      background: inherit;
    }
    .slide-scaler {
      width: 1920px;
      height: 1080px;
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
    }

    /* ===== Slide ===== */
    @property --slide-w { syntax: "<length>"; initial-value: 1920px; inherits: true; }
    @property --slide-h { syntax: "<length>"; initial-value: 1080px; inherits: true; }

    .slide {
      width: 1920px;
      height: 1080px;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      contain: layout style;
    }
    .slide.active {
      opacity: 1;
      transform: translateY(0);
      z-index: 1;
      pointer-events: auto;
    }

    /* ===== Typography ===== */
    h1, h2, h3 {
      font-family: ${theme.fonts.heading};
      color: ${theme.colors.text};
    }
    code {
      font-family: ${theme.fonts.mono};
      background: ${theme.colors.secondaryBg};
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
      border: 1px solid ${theme.colors.border};
    }
    pre {
      background: ${theme.colors.secondaryBg};
      border: 1px solid ${theme.colors.border};
      border-radius: 6px;
      padding: 16px 20px;
      overflow-x: auto;
      margin: 12px 0;
    }
    pre code {
      background: none;
      padding: 0;
      border: none;
      font-size: 0.85em;
      line-height: 1.6;
    }
    a {
      color: ${theme.colors.accent};
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    a:hover { border-bottom-color: ${theme.colors.accent}; }
    video { display: block; }

    /* ===== Body Content ===== */
    .slide-body p { margin-bottom: 14px; }
    .slide-body p:last-child { margin-bottom: 0; }
    .slide-body strong { color: ${theme.colors.text}; font-weight: 600; }
    .slide-body em { color: ${theme.colors.accent}; font-style: italic; }
    .slide-body ul { list-style: none; padding-left: 0; margin: 14px 0; }
    .slide-body ul li {
      padding-left: 24px;
      position: relative;
      margin-bottom: 10px;
      line-height: 1.6;
    }
    .slide-body ul li::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 10px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${theme.colors.accent};
      box-shadow: 0 0 6px ${theme.colors.accent}40;
    }

    /* ===== Progress Bar ===== */
    .progress-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 3px;
      background: ${theme.colors.accent};
      transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;
    }
    .slide-counter {
      position: fixed;
      bottom: 12px;
      right: 20px;
      font-family: ${theme.fonts.mono};
      font-size: 13px;
      color: ${theme.colors.secondaryText};
      z-index: 100;
      user-select: none;
    }

    /* ===== Slide Overview ===== */
    body.overview-mode { overflow: auto; }
    body.overview-mode .slide-stage { position: static; }
    body.overview-mode .slide-scaler { width: auto; height: auto; transform: none !important; }
    body.overview-mode .slide {
      position: relative;
      display: inline-flex;
      width: 300px;
      height: 169px;
      margin: 12px;
      opacity: 1;
      transform: none;
      pointer-events: auto;
      border: 2px solid ${theme.colors.border};
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.2s;
      font-size: 6px;
      padding: 12px 16px;
      overflow: hidden;
    }
    body.overview-mode .slide:hover {
      border-color: ${theme.colors.accent};
    }
    body.overview-mode .slide.active {
      border-color: ${theme.colors.accent};
      box-shadow: 0 0 0 1px ${theme.colors.accent};
    }
    body.overview-mode .overview-wrapper {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }
    body.overview-mode .progress-bar,
    body.overview-mode .slide-counter { display: none; }

    /* ===== Print Styles ===== */
    @media print {
      html, body { overflow: visible; height: auto; }
      .slide-stage { position: static; }
      .slide-scaler { transform: none !important; }
      .slide {
        position: relative;
        opacity: 1 !important;
        transform: none !important;
        pointer-events: auto;
        page-break-after: always;
        break-after: page;
        display: flex;
      }
      .progress-bar, .slide-counter { display: none !important; }
      @page { size: landscape; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="slide-stage">
    <div class="slide-scaler" id="slide-scaler">
      <div class="overview-wrapper">
${slidesHTML}
      </div>
    </div>
  </div>
  <div class="progress-bar"></div>
  <div class="slide-counter"></div>

  <script>
    (function() {
      // --------------- State ---------------
      var current = 0;
      var slides = document.querySelectorAll('.slide');
      var total = slides.length;
      var overviewActive = false;

      // --------------- Navigation ---------------
      function goToSlide(n) {
        if (n < 0 || n >= total) return;
        slides[current].classList.remove('active');
        current = n;
        slides[current].classList.add('active');
        updateProgress();
      }

      function updateProgress() {
        var bar = document.querySelector('.progress-bar');
        var counter = document.querySelector('.slide-counter');
        if (bar) bar.style.width = ((current + 1) / total * 100) + '%';
        if (counter) counter.textContent = (current + 1) + ' / ' + total;
      }

      function nextSlide() { goToSlide(current + 1); }
      function prevSlide() { goToSlide(current - 1); }

      // --------------- Overview Mode ---------------
      function toggleOverview() {
        overviewActive = !overviewActive;
        if (overviewActive) {
          document.body.classList.add('overview-mode');
          slides[current].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          document.body.classList.remove('overview-mode');
        }
      }

      // --------------- Keyboard ---------------
      document.addEventListener('keydown', function(e) {
        if (overviewActive && e.key === 'Escape') {
          e.preventDefault();
          toggleOverview();
          return;
        }
        if (overviewActive) return;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
          case ' ':
            e.preventDefault();
            nextSlide();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            break;
          case 'Escape':
            e.preventDefault();
            toggleOverview();
            break;
          case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
          case 'End':
            e.preventDefault();
            goToSlide(total - 1);
            break;
        }
      });

      // --------------- Click in Overview ---------------
      for (var i = 0; i < slides.length; i++) {
        (function(index) {
          slides[index].addEventListener('click', function() {
            if (overviewActive) {
              goToSlide(index);
              toggleOverview();
            }
          });
        })(i);
      }

      // --------------- Touch / Swipe ---------------
      var touchStartX = 0;
      var touchStartY = 0;
      document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      document.addEventListener('touchend', function(e) {
        if (overviewActive) return;
        var dx = touchStartX - e.changedTouches[0].clientX;
        var dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) nextSlide();
          else prevSlide();
        }
      }, { passive: true });

      // --------------- PostMessage API ---------------
      var selectorActive = false;
      var selectorHighlight = null;

      function enableSelector() {
        selectorActive = true;
        document.body.style.cursor = 'crosshair';
        selectorHighlight = document.createElement('div');
        selectorHighlight.id = 'selector-highlight';
        selectorHighlight.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;border:2px solid #92B090;background:rgba(146,176,144,0.12);border-radius:3px;transition:all 0.1s ease;display:none;';
        document.body.appendChild(selectorHighlight);
        var label = document.createElement('div');
        label.id = 'selector-label';
        label.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;font-family:monospace;font-size:11px;background:#0a0908;color:#92B090;border:1px solid #92B090;padding:2px 6px;border-radius:3px;display:none;white-space:nowrap;';
        document.body.appendChild(label);
      }

      function disableSelector() {
        selectorActive = false;
        document.body.style.cursor = '';
        var hl = document.getElementById('selector-highlight');
        var lb = document.getElementById('selector-label');
        if (hl) hl.remove();
        if (lb) lb.remove();
      }

      document.addEventListener('mousemove', function(e) {
        if (!selectorActive) return;
        var el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.id === 'selector-highlight' || el.id === 'selector-label') return;
        var rect = el.getBoundingClientRect();
        var hl = document.getElementById('selector-highlight');
        var lb = document.getElementById('selector-label');
        if (hl) {
          hl.style.display = 'block';
          hl.style.left = rect.left + 'px';
          hl.style.top = rect.top + 'px';
          hl.style.width = rect.width + 'px';
          hl.style.height = rect.height + 'px';
        }
        if (lb) {
          var tag = el.tagName.toLowerCase();
          var cls = el.className ? '.' + String(el.className).split(' ').slice(0,2).join('.') : '';
          var text = (el.textContent || '').trim().slice(0, 30);
          lb.textContent = '<' + tag + cls + '>' + (text ? ' "' + text + (text.length >= 30 ? '...' : '') + '"' : '');
          lb.style.display = 'block';
          lb.style.left = rect.left + 'px';
          lb.style.top = Math.max(0, rect.top - 24) + 'px';
        }
      });

      document.addEventListener('click', function(e) {
        if (!selectorActive) return;
        e.preventDefault();
        e.stopPropagation();
        var el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el.id === 'selector-highlight' || el.id === 'selector-label') return;
        var outer = el.outerHTML;
        if (outer.length > 500) outer = outer.slice(0, 497) + '...';
        var tag = el.tagName.toLowerCase();
        var text = (el.textContent || '').trim().slice(0, 100);
        var styles = el.getAttribute('style') || '';
        window.parent.postMessage({
          type: 'elementSelected',
          tag: tag,
          text: text,
          html: outer,
          styles: styles,
          rect: { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) },
        }, '*');
        disableSelector();
      }, true);

      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'goToSlide' && typeof e.data.index === 'number') {
          goToSlide(e.data.index);
        }
        if (e.data && e.data.type === 'enableSelector') {
          enableSelector();
        }
        if (e.data && e.data.type === 'disableSelector') {
          disableSelector();
        }
      });

      // --------------- Stage Scaling ---------------
      var scaler = document.getElementById('slide-scaler');
      var isIframe = window !== window.parent;
      function fitStage() {
        if (!scaler) return;
        if (isIframe) {
          scaler.style.transform = 'none';
          scaler.style.top = '0';
          scaler.style.left = '0';
          return;
        }
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var s = Math.min(vw / 1920, vh / 1080);
        var scaledW = 1920 * s;
        var scaledH = 1080 * s;
        scaler.style.transform = 'scale(' + s + ')';
        scaler.style.left = Math.max(0, (vw - scaledW) / 2) + 'px';
        scaler.style.top = Math.max(0, (vh - scaledH) / 2) + 'px';
      }
      fitStage();
      window.addEventListener('resize', fitStage);

      // --------------- Initialize ---------------
      if (total > 0) {
        slides[0].classList.add('active');
        updateProgress();
      }
    })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
