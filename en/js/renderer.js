// renderer.js — retained-mode SVG + HTML-overlay renderer.
//
// Implements the visual vocabulary from DESIGN.md section 5. SVG elements
// are created once per entity (keyed by id) and only their attributes are
// updated per frame — no innerHTML churn, no element thrashing.

(function (root) {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Light canvas theme (default) - DESIGN.md section 2 tokens.
  const LIGHT_THEME = {
    bgAlt: '#fafafa',
    surface: '#f4f4f5',
    text: '#0f0f14',
    textMuted: '#6b6b76',
    textDim: '#a0a0ab',
    border: '#e4e4e7',
    // Crispness pass: structure hairlines stepped from --border-strong
    // (#d4d4d8, very low contrast on --bg-alt, reads as nearly invisible
    // in screenshots) to --text-dim (#a0a0ab), per DESIGN.md section 5's
    // crispness rule ("prefer darker over thicker").
    borderStrong: '#a0a0ab',
    accent: '#5e6ad2',
    accentHover: '#4e5acb',
  };

  // Dark canvas variant (experimental) - DESIGN.md section 5 "Dark canvas
  // variant". Only the canvas is dark; the article page around it stays light.
  const DARK_THEME = {
    bgAlt: '#0f0f14',
    surface: '#1a1a20',
    text: '#e4e4e9', // human cursor strokes go light on dark, per DESIGN.md
    textMuted: '#c2c2ca',
    textDim: '#a0a0ab',
    border: '#3a3a44',
    borderStrong: '#8a8a96', // active/emphasized, stepped brighter for crispness
    accent: '#5e6ad2', // unchanged - reads well on dark
    accentHover: '#7076d6',
  };

  // Hairline stroke discipline - DESIGN.md section 5: SVG strokes with
  // vector-effect: non-scaling-stroke, everywhere on the canvas.
  //
  // Crispness pass: 0.75px hairlines anti-alias across two device pixels at
  // almost any non-integer canvas scale (this SVG is responsive, so scale
  // is rarely 1:1), which reads as faint/fuzzy in screenshots. 1px
  // non-scaling strokes render sharp far more often while still reading as
  // "hairline" at this canvas scale - DESIGN.md section 5's crispness rule
  // explicitly allows stepping stroke weight for this reason.
  const HAIRLINE = 1;

  function hairlineAttrs(extra) {
    return Object.assign(
      { 'stroke-width': HAIRLINE, 'vector-effect': 'non-scaling-stroke', fill: 'none' },
      extra
    );
  }

  function el(tag) {
    return document.createElementNS(SVG_NS, tag);
  }

  function setAttrs(node, attrs) {
    for (const k in attrs) {
      if (attrs[k] == null) continue;
      node.setAttribute(k, attrs[k]);
    }
  }

  class Renderer {
    constructor(container, options) {
      options = options || {};
      this.container = container;
      this.width = 800;
      this.height = 450;
      // DESIGN.md §5: dot grid absent by default — a scene may opt in when
      // it needs spatial reference.
      this.showGrid = !!options.grid;

      // Theme: `new Renderer(el, { theme: 'dark' })` or a `data-theme="dark"`
      // attribute on the container both select the dark canvas variant
      // (DESIGN.md §5, "Dark canvas variant"). The article page itself
      // always stays light — this only ever recolors the canvas.
      const requestedTheme =
        options.theme || (container && container.dataset && container.dataset.theme) || 'light';
      this.themeName = requestedTheme === 'dark' ? 'dark' : 'light';
      this.theme = this.themeName === 'dark' ? DARK_THEME : LIGHT_THEME;

      // Cursor label style: 'plain' (default, DESIGN.md §5 floating mono
      // text, no background) or 'boxed' (a small bg+border tag — used by
      // the dark-canvas identity-clarity experiments, where the explicit
      // ask is a more substantial, unmistakable "You" / "Research agent"
      // label). Opt in via `new Renderer(el, { cursorTagStyle: 'boxed' })`
      // or a `data-cursor-tags="boxed"` attribute — default stays 'plain'
      // so existing scenes/pages are unaffected.
      const requestedCursorTags =
        options.cursorTagStyle ||
        (container && container.dataset && container.dataset.cursorTags) ||
        'plain';
      this.cursorTagStyle = requestedCursorTags === 'boxed' ? 'boxed' : 'plain';

      this.svg = null;
      this.overlay = null;

      // retained element pools, keyed by entity id
      this.nodeEls = new Map();
      this.edgeEls = new Map();
      this.cursorEls = new Map();
      this.buttonEls = new Map();
      this.badgeEls = new Map();
      this.progressEls = new Map();
      this.pulseEls = new Map();
      this.regionEls = new Map();
      this.stampEls = new Map();
      this.activityEl = null;
      this.activityLineEls = [];

      this.init();
    }

    init() {
      this.container.style.position = this.container.style.position || 'relative';

      this.svg = el('svg');
      setAttrs(this.svg, {
        viewBox: `0 0 ${this.width} ${this.height}`,
        preserveAspectRatio: 'xMidYMid meet',
      });
      this.svg.style.display = 'block';
      this.svg.style.width = '100%';
      this.svg.style.height = '100%';
      this.container.appendChild(this.svg);

      this._buildDefsAndGrid();

      this.regionLayer = el('g');
      this.edgeLayer = el('g');
      this.nodeLayer = el('g');
      this.cursorLayer = el('g');
      this.pulseLayer = el('g');
      this.svg.appendChild(this.regionLayer);
      this.svg.appendChild(this.edgeLayer);
      this.svg.appendChild(this.nodeLayer);
      this.svg.appendChild(this.pulseLayer);
      this.svg.appendChild(this.cursorLayer);

      this.overlay = document.createElement('div');
      this.overlay.className = 'animation-overlay';
      this.overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
      this.container.appendChild(this.overlay);

      this.activityEl = document.createElement('div');
      this.activityEl.className = 'animation-activity-log';
      this.activityEl.style.cssText = [
        'position:absolute',
        'left:12px',
        'right:12px',
        'bottom:8px',
        'font:10px "Berkeley Mono","SF Mono",ui-monospace,monospace',
        `color:${this.theme.textDim}`,
        'line-height:1.5',
        'white-space:nowrap',
        'overflow:hidden',
        'text-overflow:ellipsis',
      ].join(';');
      this.overlay.appendChild(this.activityEl);
    }

    _buildDefsAndGrid() {
      const bg = el('rect');
      setAttrs(bg, { x: 0, y: 0, width: this.width, height: this.height, fill: this.theme.bgAlt });
      this.svg.appendChild(bg);

      // Dot grid is absent by default (DESIGN.md §5) — only built when a
      // scene explicitly opts in via the `grid` renderer option.
      if (!this.showGrid) return;

      const defs = el('defs');
      const pattern = el('pattern');
      const pitch = 24;
      setAttrs(pattern, {
        id: 'scene-dot-grid',
        width: pitch,
        height: pitch,
        patternUnits: 'userSpaceOnUse',
      });
      const dot = el('circle');
      setAttrs(dot, { cx: 1, cy: 1, r: 1, fill: this.theme.border, 'fill-opacity': 0.5 });
      pattern.appendChild(dot);
      defs.appendChild(pattern);
      this.svg.appendChild(defs);

      const grid = el('rect');
      setAttrs(grid, { x: 0, y: 0, width: this.width, height: this.height, fill: 'url(#scene-dot-grid)' });
      this.svg.appendChild(grid);
    }

    render(state) {
      const opacity = state.globalOpacity != null ? state.globalOpacity : 1;
      this.svg.style.opacity = opacity;
      this.overlay.style.opacity = opacity;

      this._renderRegions(state.regions || []);
      this._renderNodes(state.nodes || []);
      this._renderEdges(state.edges || [], state.nodes || []);
      this._renderButtons(state.buttons || []);
      this._renderCursors(state.cursors || []);
      this._renderBadges(state.badges || []);
      this._renderStamps(state.stamps || []);
      this._renderProgress(state.progress || []);
      this._renderPulses(state.pulses || []);
      this._renderActivity(state.activity || []);
    }

    // Static/labeled background region (e.g. an "agent lane" swimlane) — a
    // faint hairline rect with a small label, purely spatial reference,
    // never interactive. Rendered beneath edges/nodes.
    _renderRegions(regions) {
      const seen = new Set();
      regions.forEach((r) => {
        seen.add(r.id);
        let rec = this.regionEls.get(r.id);
        if (!rec) {
          const g = el('g');
          const rect = el('rect');
          setAttrs(rect, hairlineAttrs({ stroke: this.theme.border, rx: 6 }));
          const text = el('text');
          setAttrs(text, {
            'font-family': '"Berkeley Mono","SF Mono",ui-monospace,monospace',
            'font-size': 10,
            fill: this.theme.textDim,
            'text-anchor': 'start',
          });
          g.appendChild(rect);
          g.appendChild(text);
          this.regionLayer.appendChild(g);
          rec = { g, rect, text };
          this.regionEls.set(r.id, rec);
        }
        rec.g.style.opacity = r.opacity;
        setAttrs(rec.rect, {
          x: r.x,
          y: r.y,
          width: r.w,
          height: r.h,
          'stroke-dasharray': r.dashed ? '3 4' : 'none',
        });
        rec.text.textContent = r.label || '';
        rec.text.setAttribute('x', r.x + 10);
        rec.text.setAttribute('y', r.y + 16);
      });
      this._pruneStale(this.regionEls, seen, (rec) => rec.g.remove());
    }

    // Persistent authorship stamp — a small boxed label attached near a
    // node, carrying "who did this" independent of the node's own outline.
    // Boxed (bg + hairline border) rather than the plain floating-text
    // treatment used for badges: DESIGN.md's clarity ask for this
    // experiment explicitly allows tags to be slightly more substantial.
    _renderStamps(stamps) {
      const seen = new Set();
      stamps.forEach((s) => {
        seen.add(s.id);
        let chip = this.stampEls.get(s.id);
        if (!chip) {
          chip = document.createElement('div');
          chip.style.cssText = [
            'position:absolute',
            'transform:translate(-50%,0)',
            'font:10px "Berkeley Mono","SF Mono",ui-monospace,monospace',
            'padding:3px 7px',
            'border-radius:4px',
            'white-space:nowrap',
            'line-height:1.4',
          ].join(';');
          this.overlay.appendChild(chip);
          this.stampEls.set(s.id, chip);
        }
        const isAgent = s.kind === 'agent';
        chip.style.background = this.theme.surface;
        chip.style.border = `1px solid ${isAgent ? this.theme.accent : this.theme.border}`;
        chip.style.color = isAgent ? this.theme.accent : this.theme.textDim;
        chip.textContent = s.text;
        chip.style.left = `${(s.x / this.width) * 100}%`;
        chip.style.top = `${(s.y / this.height) * 100}%`;
        chip.style.opacity = String(s.opacity);
        chip.style.display = s.opacity > 0.01 ? '' : 'none';
      });
      this.stampEls.forEach((chip, id) => {
        if (!seen.has(id)) chip.style.display = 'none';
      });
    }

    _renderNodes(nodes) {
      const seen = new Set();
      nodes.forEach((n) => {
        seen.add(n.id);
        let rec = this.nodeEls.get(n.id);
        if (!rec) {
          const g = el('g');
          // Selection ring: a second hairline ring 3px outside the node
          // (DESIGN.md §5), not a thick 2px ring.
          const ring = el('rect');
          setAttrs(ring, hairlineAttrs({ rx: 9, stroke: n.selectedColor || this.theme.accent }));
          const rect = el('rect');
          setAttrs(rect, hairlineAttrs({ rx: 6, stroke: this.theme.borderStrong }));
          const text = el('text');
          setAttrs(text, {
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': 11,
            'font-weight': 500,
            fill: this.theme.textMuted,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
          });
          // Optional second line of body text under the title (e.g. the
          // Solution node's "Trigger a 3-day welcome series") — smaller,
          // dimmer, hidden entirely when a node has no sublabel.
          const subtext = el('text');
          setAttrs(subtext, {
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': 9,
            'font-weight': 400,
            fill: this.theme.textDim,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
          });
          // V2D "Shared Canvas" — a nested research *sub-line* inside the
          // card: an indented mono finding (the agent's), dashed when
          // provisional and solid when committed. Rendered as a left-
          // anchored text with a thin underline that flips dashed→solid so
          // the same provenance language used on outline cards carries
          // through inside the card.
          const nestedText = el('text');
          setAttrs(nestedText, {
            'font-family': '"Berkeley Mono","SF Mono",ui-monospace,monospace',
            'font-size': 9,
            'text-anchor': 'start',
            'dominant-baseline': 'middle',
          });
          const nestedLine = el('line');
          setAttrs(nestedLine, hairlineAttrs({}));
          g.appendChild(ring);
          g.appendChild(rect);
          g.appendChild(text);
          g.appendChild(subtext);
          g.appendChild(nestedText);
          g.appendChild(nestedLine);
          this.nodeLayer.appendChild(g);
          rec = { g, ring, rect, text, subtext, nestedText, nestedLine };
          this.nodeEls.set(n.id, rec);
        }

        const cx = n.x + n.w / 2;
        const cy = n.y + n.h / 2;
        rec.g.setAttribute(
          'transform',
          `translate(${cx},${cy}) scale(${n.scale}) translate(${-n.w / 2},${-n.h / 2})`
        );
        rec.g.style.opacity = n.opacity;

        const ghost = n.kind === 'ghost';
        const provisional = n.kind === 'provisional';

        // Nodes are outline-only — no fill, the canvas shows through.
        setAttrs(rec.rect, {
          x: 0,
          y: 0,
          width: n.w,
          height: n.h,
          stroke: provisional ? this.theme.accent : this.theme.borderStrong,
          'stroke-dasharray': provisional ? '4 3' : 'none',
        });
        rec.rect.style.opacity = ghost ? 0.35 : 1;

        rec.ring.style.display = n.selected ? '' : 'none';
        if (n.selected) {
          setAttrs(rec.ring, {
            x: -3,
            y: -3,
            width: n.w + 6,
            height: n.h + 6,
            stroke: n.selectedColor || this.theme.accent,
          });
        }

        const hasSublabel = !!n.sublabel;
        // Title is vertically centered by default. When a nested finding is
        // actually visible inside the card, the title shifts to the top to
        // make room — the shift coincides with the nested content fade-in,
        // so it reads as deliberate rather than jarring.
        const hasVisibleNested = n.hasNested && n.nestedLabel && n.nestedOpacity > 0.01;
        const titleY = hasVisibleNested
          ? 20
          : hasSublabel
          ? n.h * 0.38
          : n.h / 2;
        rec.text.textContent = n.label || '';
        rec.text.setAttribute('x', n.w / 2);
        rec.text.setAttribute('y', titleY);
        rec.text.style.opacity = ghost ? 0.35 : 1;

        rec.subtext.textContent = n.sublabel || '';
        rec.subtext.setAttribute('x', n.w / 2);
        rec.subtext.setAttribute('y', n.h * 0.7);
        rec.subtext.style.display = hasSublabel ? '' : 'none';
        rec.subtext.style.opacity = ghost ? 0.35 : 1;

        // V2D nested research sub-line — only nodes that opted in (hasNested)
        // and have actually received a finding render it. Provisional uses
        // accent + dashed underline; committed uses muted + solid underline.
        const nestedVisible = !!n.hasNested && !!n.nestedLabel && n.nestedOpacity > 0.01;
        const nestedProvisional = n.nestedKind === 'provisional';
        rec.nestedText.style.display = nestedVisible ? '' : 'none';
        rec.nestedLine.style.display = nestedVisible ? '' : 'none';
        if (nestedVisible) {
          const ny = n.h - 13;
          const nx = 12;
          setAttrs(rec.nestedText, {
            x: nx,
            y: ny,
            fill: nestedProvisional ? this.theme.accent : this.theme.textMuted,
          });
          rec.nestedText.textContent = n.nestedLabel || '';
          rec.nestedText.style.opacity = n.nestedOpacity;
          setAttrs(rec.nestedLine, {
            x1: nx,
            y1: ny + 6,
            x2: n.w - 12,
            y2: ny + 6,
            stroke: nestedProvisional ? this.theme.accent : this.theme.borderStrong,
            'stroke-dasharray': nestedProvisional ? '4 3' : 'none',
          });
          rec.nestedLine.style.opacity = n.nestedOpacity;
        }
      });
      this._pruneStale(this.nodeEls, seen, (rec) => rec.g.remove());
    }

    _renderEdges(edges, nodes) {
      const nodeById = new Map(nodes.map((n) => [n.id, n]));
      const seen = new Set();
      edges.forEach((e) => {
        seen.add(e.id);
        let rec = this.edgeEls.get(e.id);
        if (!rec) {
          const path = el('path');
          setAttrs(path, hairlineAttrs({ stroke: this.theme.borderStrong, 'stroke-linecap': 'round' }));
          this.edgeLayer.appendChild(path);
          rec = { path };
          this.edgeEls.set(e.id, rec);
        }

        const from = this._anchor(e.from, nodeById, e.fromAnchor);
        const to = this._anchor(e.to, nodeById, e.toAnchor);

        const d = e.straight
          ? `M ${from.x} ${from.y} L ${to.x} ${to.y}`
          : (() => {
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - Math.abs(to.x - from.x) * 0.12 - 12;
              return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
            })();

        setAttrs(rec.path, {
          d,
          pathLength: 1,
          'stroke-dasharray': 1,
          'stroke-dashoffset': 1 - e.progress,
        });
        rec.path.style.opacity = e.opacity;
      });
      this._pruneStale(this.edgeEls, seen, (rec) => rec.path.remove());
    }

    _anchor(ref, nodeById, dir) {
      if (ref && typeof ref === 'object' && 'x' in ref) return ref;
      const n = nodeById.get(ref);
      if (!n) return { x: 0, y: 0 };
      switch (dir) {
        case 'top':    return { x: n.x + n.w / 2, y: n.y };
        case 'bottom': return { x: n.x + n.w / 2, y: n.y + n.h };
        case 'left':   return { x: n.x, y: n.y + n.h / 2 };
        case 'right':  return { x: n.x + n.w, y: n.y + n.h / 2 };
        default:       return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
      }
    }

    // Abstract trigger — a hairline capsule outline with a floating mono
    // label, never a filled UI button (DESIGN.md §5). "Click" feedback is a
    // brief stroke-color deepen, not a depress effect.
    _renderButtons(buttons) {
      const seen = new Set();
      buttons.forEach((b) => {
        seen.add(b.id);
        let rec = this.buttonEls.get(b.id);
        if (!rec) {
          const g = el('g');
          const rect = el('rect');
          setAttrs(rect, hairlineAttrs({ stroke: this.theme.borderStrong }));
          const text = el('text');
          setAttrs(text, {
            'font-family': '"Berkeley Mono","SF Mono",ui-monospace,monospace',
            'font-size': 11,
            fill: this.theme.textMuted,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
          });
          g.appendChild(rect);
          g.appendChild(text);
          this.nodeLayer.appendChild(g);
          rec = { g, rect, text };
          this.buttonEls.set(b.id, rec);
        }

        rec.g.setAttribute('transform', `translate(${b.x},${b.y})`);
        rec.g.style.opacity = b.opacity;
        setAttrs(rec.rect, {
          x: 0,
          y: 0,
          width: b.w,
          height: b.h,
          rx: b.h / 2,
          stroke: b.pressed ? this.theme.textMuted : this.theme.borderStrong,
        });
        rec.text.textContent = b.label || '';
        rec.text.setAttribute('x', b.w / 2);
        rec.text.setAttribute('y', b.h / 2);
        rec.text.setAttribute('fill', b.pressed ? this.theme.text : this.theme.textMuted);
      });
      this._pruneStale(this.buttonEls, seen, (rec) => rec.g.remove());
    }

    _renderCursors(cursors) {
      const seen = new Set();
      cursors.forEach((c) => {
        seen.add(c.id);
        let rec = this.cursorEls.get(c.id);
        if (!rec) {
          const g = el('g');
          const shape = el('path');
          if (c.kind === 'agent') {
            // small outlined diamond marker — hairline, fill occludes what's
            // behind it so edges don't visually cross through the marker.
            setAttrs(shape, hairlineAttrs({
              d: 'M6 0 L12 6 L6 12 L0 6 Z',
              fill: this.theme.bgAlt,
              'stroke-linejoin': 'round',
            }));
          } else {
            // classic arrow cursor — hairline outline, not a filled solid
            setAttrs(shape, hairlineAttrs({
              d: 'M0 0 L0 16 L4 12.3 L6.7 18.5 L9.2 17.4 L6.6 11.4 L11.6 11.4 Z',
              fill: this.theme.bgAlt,
              'stroke-linejoin': 'round',
            }));
          }
          g.appendChild(shape);
          this.cursorLayer.appendChild(g);
          rec = { g, shape, chip: null, chipText: null };
          this.cursorEls.set(c.id, rec);

          // Label floats near the cursor. Default: plain mono text, no chip
          // background/border (DESIGN.md §5). 'boxed' style (opt-in per
          // renderer/container) gives it a small bg+hairline-border tag —
          // the explicit ask for the identity-clarity experiments, where
          // "You" vs "Research agent" must be unmistakable at a glance.
          const chip = document.createElement('div');
          const boxed = this.cursorTagStyle === 'boxed';
          const isAgent = c.kind === 'agent';
          chip.style.cssText = boxed
            ? [
                'position:absolute',
                'transform:translate(-50%,-100%)',
                'font:11px "Berkeley Mono","SF Mono",ui-monospace,monospace',
                'white-space:nowrap',
                'padding:3px 8px',
                'margin-bottom:6px',
                'border-radius:4px',
                `background:${this.theme.surface}`,
                `border:1px solid ${isAgent ? this.theme.accent : this.theme.border}`,
                `color:${isAgent ? this.theme.accent : this.theme.text}`,
              ].join(';')
            : [
                'position:absolute',
                'transform:translate(-50%,-100%)',
                'font:10px "Berkeley Mono","SF Mono",ui-monospace,monospace',
                `color:${this.theme.textDim}`,
                'white-space:nowrap',
              ].join(';');
          this.overlay.appendChild(chip);
          rec.chip = chip;
        }

        const scale = c.kind === 'agent' ? 1 : 0.85;
        const press = c.clicking ? 0.9 : 1;
        rec.g.setAttribute('transform', `translate(${c.x},${c.y}) scale(${scale * press})`);
        rec.g.style.opacity = c.opacity;

        const stroke = c.kind === 'agent' ? this.theme.accent : c.id.includes('2') ? this.theme.textMuted : this.theme.text;
        rec.shape.setAttribute('stroke', stroke);

        if (c.label && c.opacity > 0.05) {
          rec.chip.textContent = c.label;
          rec.chip.style.left = `${(c.x / this.width) * 100}%`;
          rec.chip.style.top = `${((c.y - 8) / this.height) * 100}%`;
          rec.chip.style.opacity = String(c.opacity);
          rec.chip.style.display = '';
        } else {
          rec.chip.style.display = 'none';
        }
      });
      this._pruneStale(this.cursorEls, seen, (rec) => {
        rec.g.remove();
        rec.chip.remove();
      });
    }

    _renderBadges(badges) {
      const seen = new Set();
      badges.forEach((b) => {
        seen.add(b.id);
        let chip = this.badgeEls.get(b.id);
        if (!chip) {
          // Intent badges float as plain mono text — no background/border
          // (DESIGN.md §5), text-muted since they announce an upcoming action.
          chip = document.createElement('div');
          chip.style.cssText = [
            'position:absolute',
            'transform:translate(-50%,-100%)',
            'font:11px "Berkeley Mono","SF Mono",ui-monospace,monospace',
            `color:${this.theme.textMuted}`,
            'white-space:nowrap',
          ].join(';');
          this.overlay.appendChild(chip);
          this.badgeEls.set(b.id, chip);
        }
        chip.textContent = b.text;
        chip.style.left = `${(b.x / this.width) * 100}%`;
        chip.style.top = `${((b.y - 14) / this.height) * 100}%`;
        chip.style.opacity = String(b.opacity);
        chip.style.display = b.opacity > 0.01 ? '' : 'none';
      });
      this.badgeEls.forEach((chip, id) => {
        if (!seen.has(id)) chip.style.display = 'none';
      });
    }

    _renderProgress(items) {
      const seen = new Set();
      items.forEach((p) => {
        seen.add(p.id);
        let rec = this.progressEls.get(p.id);
        if (!rec) {
          // Thin hairline arc — accent is reserved for agent activity only,
          // so a generic progress indicator defaults to text-muted.
          const g = el('g');
          const circle = el('circle');
          setAttrs(circle, hairlineAttrs({
            r: 8,
            stroke: p.color || this.theme.textMuted,
            'stroke-linecap': 'round',
            'pathLength': 1,
            'stroke-dasharray': '0.28 1',
          }));
          g.appendChild(circle);
          this.nodeLayer.appendChild(g);
          rec = { g, circle };
          this.progressEls.set(p.id, rec);
        }
        const angle = (p.elapsed / 650) * 360;
        rec.g.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${angle})`);
        rec.g.style.opacity = p.opacity;
        rec.g.style.display = p.opacity > 0.01 ? '' : 'none';
      });
      this.progressEls.forEach((rec, id) => {
        if (!seen.has(id)) rec.g.style.display = 'none';
      });
    }

    _renderPulses(pulses) {
      const seen = new Set();
      pulses.forEach((p) => {
        seen.add(p.id);
        let rec = this.pulseEls.get(p.id);
        if (!rec) {
          // Expanding hairline circle — accent reserved for agent activity.
          const circle = el('circle');
          setAttrs(circle, hairlineAttrs({ stroke: p.color || this.theme.textMuted }));
          this.pulseLayer.appendChild(circle);
          rec = { circle };
          this.pulseEls.set(p.id, rec);
        }
        rec.circle.setAttribute('stroke', p.color || this.theme.textMuted);
        setAttrs(rec.circle, { cx: p.x, cy: p.y, r: p.radius });
        rec.circle.style.opacity = p.opacity;
        rec.circle.style.display = '';
      });
      this.pulseEls.forEach((rec, id) => {
        if (!seen.has(id)) rec.circle.style.display = 'none';
      });
    }

    _renderActivity(lines) {
      this.activityEl.textContent = lines.join('   ·   ');
    }

    _pruneStale(map, seen, removeFn) {
      map.forEach((rec, id) => {
        if (!seen.has(id)) {
          removeFn(rec);
          map.delete(id);
        }
      });
    }

    destroy() {
      if (this.svg) this.svg.remove();
      if (this.overlay) this.overlay.remove();
    }
  }

  if (root) root.Renderer = Renderer;
  if (typeof module !== 'undefined' && module.exports) module.exports = Renderer;
})(typeof window !== 'undefined' ? window : null);
