# DESIGN.md — Editorial Minimalism (Linear-inspired)

Source of truth for all visual decisions in this article. Every agent and contributor
follows this file. When in doubt: calmer, flatter, fewer colors.

## 1. Visual theme & atmosphere

Editorial minimalism. Surgical. Understated. Every pixel earns its place.
Late-90s Swiss graphic design meeting modern SaaS. Mood: precise, fast, quietly confident.

This is a long-form technical essay, not a SaaS app — adapt density accordingly:
prose gets a comfortable reading measure; the *animations and diagrams* carry the
high-information-density ethos.

## 2. Color palette & roles

```css
--bg:              #ffffff;
--bg-alt:          #fafafa;
--surface:         #f4f4f5;
--text:            #0f0f14;
--text-muted:      #6b6b76;
--text-dim:        #a0a0ab;
--border:          #e4e4e7;
--border-strong:   #d4d4d8;
--accent:          #5e6ad2;   /* use sparingly — punctuation, not paragraph */
--accent-hover:    #4e5acb;
```

Rules:
- Accent only on: links, focus rings, agent cursors/intent badges in animations,
  and at most one highlight per scene. Never on backgrounds. Never a second accent color.
- No gradients anywhere. No shadows on cards/buttons; a single
  `0 2px 8px rgba(0,0,0,0.04)` is reserved for popover-like elements only.

## 3. Typography

- Headlines + body: `Inter`, fallback system-ui. Weights 400/500/600 only.
  Letter-spacing −0.5% at headline sizes (≥28px).
- Load Inter via `<link>` from Google Fonts or rsms.me/inter (no build step).
- Mono: `Berkeley Mono`, fallback `SF Mono`, `ui-monospace`, monospace.
- Scale (px): 11 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64.
- No serif. No italics for emphasis — use weight 600.
- Body text: 16px (up to 18px is acceptable for the reading column), line-height ~1.65.
- Captions and labels: 13px, weight 500, `--text-muted`.

## 4. Layout

- Reading column: ~680px max for prose.
- Animations and full-width diagrams may extend to ~960px, centered
  (a "breakout" wider than the prose column — this is the article's signature rhythm).
- 4px base unit; spacing scale 4/8/12/16/24/32/48/64.
- Radius: 6px small elements, 8px max for cards/canvases. Never beyond 8px.
- Depth: flat, border-based. 1px `--border`, hover/emphasis shifts to `--border-strong`.

## 5. Animation canvas language

Guiding principle: **abstract diagram, not UI mock.** The scenes must not read as
screenshots of a shadcn-style interface. Reference quality: technical line drawings —
hairline strokes, unfilled shapes, maximum restraint. Surfaces recede; the
*interaction* (motion, timing, cause-and-effect) is the only thing that draws the eye.

- Stroke discipline: hairlines everywhere — 0.75px SVG strokes
  (`vector-effect: non-scaling-stroke`), color `--border-strong` for structure,
  `--text-muted` for active/emphasized elements. Nothing on the canvas uses a
  filled dark surface.
- Canvas frame: `--bg-alt` background, 1px `--border`, 8px radius. Dot grid very
  faint or absent — prefer absent unless a scene needs spatial reference.
- Nodes: **outline only** — no fill (canvas shows through), 0.75px hairline
  `--border-strong`, 6px radius, compact. Labels 11px Inter 500 `--text-muted`,
  inside or below the outline.
  - Provisional (agent proposal): dashed hairline in `--accent`.
  - Ghost (pending/rejected/historical): hairline at 35% opacity.
  - Selected/target: a second hairline ring, 3px outside the node, in the
    participant's stroke color — not a thick 2px ring.
- Buttons/controls inside scenes: abstract triggers (a small hairline circle or
  rounded outline with an 11px label), never a filled UI button.
- Edges: 0.75px hairline curves; draw-on via stroke-dashoffset.
- Cursors: identity via **shape + label**, never color alone. Drawn as hairline
  outlines, not filled solids.
  - Humans: classic arrow outline, stroke `--text`; second human `--text-muted`.
  - Agents: small outlined diamond/rounded marker, stroke `--accent`.
- Labels/chips: plain 10–11px mono text in `--text-dim`, no background, no border —
  text floating near its owner. (The kbd-chip treatment belongs to the article body,
  not the canvas.)
- Intent badges: same floating-text treatment, `--text-muted`, appears 200ms before
  the action it announces.
- Activity log: 10px mono lines, `--text-dim`, bottom strip, no background.
- Progress/pulses: thin hairline arcs and expanding hairline circles; `--accent`
  reserved for agent activity only.
- Crispness: hairlines must render sharp, not faint-and-fuzzy. Prefer slightly
  darker strokes over thicker ones (structure may step up from `--border-strong`
  toward `--text-dim` if screenshots look washed out), keep text at whole pixel
  sizes, and avoid transforms that land elements on fractional pixels at rest.
  Restraint means few elements, not low contrast.

### Dark canvas variant (experimental — for comparison)

Canvas-scoped dark theme (the article page itself stays light):

```css
--canvas-bg-dark:        #0f0f14;
--canvas-surface-dark:   #1a1a20;
--canvas-stroke-dark:    #3a3a44;  /* structure hairlines */
--canvas-stroke-strong:  #8a8a96;  /* active/emphasized */
--canvas-text-dark:      #a0a0ab;  /* labels */
--accent:                #5e6ad2;  /* unchanged; reads well on dark */
```

Same rules as light: hairlines, no fills, purple only for agents. White/near-white
strokes on near-black should be used sparingly (the reference look: dark objects,
hairline light edges).

## 5b. Prose ↔ animation contract

The prose must NOT narrate the animations ("In the animation below, a cursor
appears…"). Scenes speak for themselves; the figcaption (one line) names what the
reader is seeing; the prose makes the argument using the running example, and works
standalone for reduced-motion readers. Beat-by-beat scene description lives only in
animations.md.

## 6. Motion rules

- Ease-in-out for everything; cursor travel gets slight natural arcs.
- 180–350ms small UI transitions; 500–900ms cursor travel; hold key states 800–1500ms.
- No spring overshoot, bouncing, shaking, or celebratory effects.
- Loops: 6–18s with a resting frame before a gentle fade/reset — never a hard jump.
- Respect `prefers-reduced-motion`: show a representative final state or stepped fades.
- Pause scenes outside the viewport.

## 7. Do / Don't

**Do:** purple as punctuation; 1px borders; dense, precise diagrams; kbd-styled chips;
generous whitespace between article sections.

**Don't:** shadowed cards; multi-color palettes; rounded pills; icon-heavy visuals;
hero illustrations; gradients; a second accent color; radius > 8px.
