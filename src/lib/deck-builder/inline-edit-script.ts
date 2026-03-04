// =============================================================================
// Inline WYSIWYG Text Editing Script (US-001 + US-002)
// Injected into slide preview iframes for contentEditable text editing
// with a floating bold/italic/underline toolbar.
// =============================================================================

/**
 * Returns a <script> block (IIFE) that enables inline text editing inside
 * slide preview iframes. Features:
 *
 * **US-001 — contentEditable:**
 * - Double-click on text elements to edit in-place
 * - Highlight with outline, one element editable at a time
 * - Blur/Escape commits and PostMessages the change to parent
 *
 * **US-002 — Floating toolbar:**
 * - Bold, Italic, Underline buttons using execCommand
 * - Positioned above the editable element (or below if near top)
 * - Active state tracking via queryCommandState on selectionchange
 */
export function getInlineEditScript(): string {
  return `<script>(function(){
/* ---- State ---- */
var enabled = false;
var activeEl = null;
var originalHTML = '';
var toolbar = null;

/* ---- Text element detection ---- */
var TEXT_TAGS = ['h1','h2','h3','h4','p','span','li','td','th','blockquote','label'];

function isTextElement(el) {
  if (!el || !el.tagName) return false;
  var tag = el.tagName.toLowerCase();
  /* Ignore media/canvas/svg */
  if (tag === 'img' || tag === 'video' || tag === 'svg' || tag === 'canvas') return false;
  /* Heading/paragraph/list-item tags are always text */
  if (TEXT_TAGS.indexOf(tag) !== -1) {
    /* But skip divs (not in TEXT_TAGS) that only have child elements */
    return true;
  }
  /* For other elements: check if they have direct text node children */
  var nodes = el.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === 3 && nodes[i].textContent.trim().length > 0) return true;
  }
  return false;
}

/* ---- CSS selector builder (best-effort) ---- */
function buildSelector(el) {
  if (!el || !el.tagName) return '';
  var tag = el.tagName.toLowerCase();
  if (el.id) return tag + '#' + el.id;
  var parts = [tag];
  if (el.className && typeof el.className === 'string') {
    var cls = el.className.trim().split(/\\s+/).slice(0, 3).join('.');
    if (cls) parts[0] = tag + '.' + cls;
  }
  /* nth-child fallback for uniqueness */
  var parent = el.parentElement;
  if (parent) {
    var siblings = parent.children;
    var idx = 0;
    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i] === el) { idx = i + 1; break; }
    }
    if (idx > 0) parts.push(':nth-child(' + idx + ')');
  }
  return parts.join('');
}

/* ---- Floating toolbar (US-002) ---- */
function createToolbar() {
  if (toolbar) return;
  toolbar = document.createElement('div');
  toolbar.id = '__ie_toolbar';
  toolbar.style.cssText = 'position:fixed;z-index:999999;display:flex;gap:2px;padding:4px;background:#121210;border:1px solid rgba(255,255,255,0.08);border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.5);pointer-events:auto;';

  var cmds = [
    { label: 'B', cmd: 'bold', style: 'font-weight:700' },
    { label: 'I', cmd: 'italic', style: 'font-style:italic' },
    { label: 'U', cmd: 'underline', style: 'text-decoration:underline' }
  ];

  cmds.forEach(function(c) {
    var btn = document.createElement('button');
    btn.textContent = c.label;
    btn.dataset.cmd = c.cmd;
    btn.style.cssText = 'font-family:monospace;font-size:13px;padding:4px 8px;color:#fff;background:transparent;border:1px solid transparent;border-radius:3px;cursor:pointer;line-height:1;' + c.style;
    /* Prevent blur on editable element */
    btn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      document.execCommand(c.cmd, false, null);
      updateToolbarState();
    });
    toolbar.appendChild(btn);
  });

  document.body.appendChild(toolbar);
}

function positionToolbar(el) {
  if (!toolbar || !el) return;
  var r = el.getBoundingClientRect();
  var tw = toolbar.offsetWidth || 100;
  var th = toolbar.offsetHeight || 32;
  var left = Math.max(4, r.left + (r.width - tw) / 2);
  /* Position above by default; below if near the top */
  var top;
  if (r.top > th + 8) {
    top = r.top - th - 6;
  } else {
    top = r.bottom + 6;
  }
  toolbar.style.left = left + 'px';
  toolbar.style.top = top + 'px';
}

function updateToolbarState() {
  if (!toolbar) return;
  var btns = toolbar.querySelectorAll('button');
  btns.forEach(function(btn) {
    var cmd = btn.dataset.cmd;
    var active = false;
    try { active = document.queryCommandState(cmd); } catch(e) {}
    if (active) {
      btn.style.background = '#92B090';
      btn.style.color = '#0a0908';
      btn.style.borderColor = '#92B090';
    } else {
      btn.style.background = 'transparent';
      btn.style.color = '#fff';
      btn.style.borderColor = 'transparent';
    }
  });
}

function removeToolbar() {
  if (toolbar) {
    toolbar.remove();
    toolbar = null;
  }
}

/* ---- Commit edit ---- */
function commitEdit() {
  if (!activeEl) return;
  var el = activeEl;
  var newHTML = el.innerHTML;
  var sel = buildSelector(el);
  el.contentEditable = 'false';
  el.style.outline = '';
  el.style.outlineOffset = '';
  el.style.borderRadius = '';

  removeToolbar();

  /* PostMessage to parent */
  window.parent.postMessage({
    type: 'inlineEdit',
    tag: el.tagName.toLowerCase(),
    innerHTML: newHTML,
    originalInnerHTML: originalHTML,
    selector: sel
  }, '*');

  activeEl = null;
  originalHTML = '';
}

/* ---- Activate editing ---- */
function activateEdit(el) {
  if (!enabled) return;
  if (activeEl) commitEdit();

  activeEl = el;
  originalHTML = el.innerHTML;
  el.contentEditable = 'true';
  el.style.outline = '2px solid #92B090';
  el.style.outlineOffset = '2px';
  el.style.borderRadius = '2px';
  el.focus();

  createToolbar();
  positionToolbar(el);
  updateToolbarState();
}

/* ---- Event listeners ---- */
document.addEventListener('dblclick', function(e) {
  if (!enabled) return;
  var el = e.target;
  /* Walk up to find the nearest text element */
  while (el && el !== document.body) {
    if (isTextElement(el)) {
      e.preventDefault();
      activateEdit(el);
      return;
    }
    el = el.parentElement;
  }
}, true);

document.addEventListener('keydown', function(e) {
  if (!activeEl) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    /* Revert on Escape */
    activeEl.innerHTML = originalHTML;
    commitEdit();
  }
}, true);

/* Blur commits the edit */
document.addEventListener('focusout', function(e) {
  if (!activeEl) return;
  /* Small delay to allow toolbar button clicks to process */
  setTimeout(function() {
    if (activeEl && document.activeElement !== activeEl) {
      commitEdit();
    }
  }, 100);
}, true);

/* Track selection changes for toolbar active state */
document.addEventListener('selectionchange', function() {
  if (activeEl) updateToolbarState();
});

/* ---- PostMessage listener (enable/disable) ---- */
window.addEventListener('message', function(e) {
  if (!e.data) return;
  if (e.data.type === 'enableInlineEdit') {
    enabled = true;
  }
  if (e.data.type === 'disableInlineEdit') {
    enabled = false;
    if (activeEl) commitEdit();
  }
});

})()<\/script>`;
}
