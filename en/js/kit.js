// kit.js — SceneKit: a declarative storyboard authoring API on top of
// timeline.js's Track primitives. Scene files (js/scenes/*.js) call
// `SceneKit.createScene(duration)` and chain storyboard helpers; `.build()`
// compiles everything down to a pure `sceneState(elapsed)` function that
// the renderer consumes.
//
// Nothing here is stateful across frames — every helper just writes
// keyframes into Tracks. The compiled scene is a pure function of time.

(function (root) {
  'use strict';

  const Timeline = root && root.Timeline ? root.Timeline : require('./timeline.js');
  const { Track } = Timeline;

  function createScene(duration, opts) {
    opts = opts || {};
    const fadeDuration = opts.fadeDuration != null ? opts.fadeDuration : 400;

    const nodes = new Map(); // id -> { cfg, x, y, opacity, scale, label, sublabel, kind, selected }
    const cursors = new Map(); // id -> { cfg, x, opacity, label, clicking }
    const edges = new Map(); // id -> { cfg, progress, opacity }
    const buttons = new Map(); // id -> { cfg, pressed, opacity, label }
    const badges = new Map(); // id -> intent badges { x, y, text, opacity }
    const progressIndicators = new Map(); // id -> { x, y, opacity }
    const activity = []; // [{ at, text }]
    const pulses = []; // [{ id, x, y, at, duration }]
    // Static/labeled background regions (e.g. an "agent lane" swimlane) —
    // DESIGN.md §5's hairline-only vocabulary extended with one more
    // structural primitive: a faint, non-interactive rect + label, present
    // for spatial reference rather than as a node or button.
    const regions = new Map(); // id -> { cfg, label, opacity, dashed }
    // Persistent authorship stamps — a small boxed label attached near a
    // node, carrying "who did this" (human/agent) independent of the node's
    // own outline. Used by the "Signed" variant where attribution, not
    // spatial position, carries the story.
    const stamps = new Map(); // id -> { x, y, text, kind, opacity }

    let autoId = 0;
    const nextId = (prefix) => `${prefix}${autoId++}`;

    // -- registration -----------------------------------------------------

function node(id, config) {
      config = config || {};
      const x = config.x || 0;
      const y = config.y || 0;
      const rec = {
        cfg: {
          w: config.w != null ? config.w : 140,
          h: config.h != null ? config.h : 48,
          // V2D "Shared Canvas": when true, the title is laid out at the top
          // of the card to make room for an optional nested research sub-line
          // at the bottom. Static for a node's lifetime — declared up front.
          hasNested: !!config.hasNested,
        },
        x: new Track('linear', x),
        y: new Track('linear', y),
        opacity: new Track('linear', config.opacity != null ? config.opacity : 1),
        scale: new Track('linear', config.scale != null ? config.scale : 1),
        label: new Track('step', config.label || ''),
        // Optional second line of body text under the title — DESIGN.md's node vocabulary
        // is single-label, but the V2 "Solution" node needs one small line
        // of body text ("Trigger a 3-day welcome series") under its title.
        // Backward compatible: empty string renders nothing extra.
        sublabel: new Track('step', config.sublabel || ''),
        kind: new Track('step', config.kind || 'standard'),
        selected: new Track('step', !!config.selected),
        // V2D — a nested research finding that lives *inside* this card: an
        // indented sub-line, provisionally dashed (agent's, awaiting approval)
        // and committed solid once the human confirms. Distinct from a child
        // node — this is part of the parent card itself, not a sibling.
        nestedLabel: new Track('step', config.nestedLabel || ''),
        nestedKind: new Track('step', config.nestedKind || 'none'), // 'none' | 'provisional' | 'standard'
        nestedOpacity: new Track('linear', config.nestedOpacity != null ? config.nestedOpacity : 0),
      };
      rec.x.addKeyframe(0, x);
      rec.y.addKeyframe(0, y);
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      rec.scale.addKeyframe(0, rec.scale.defaultValue);
      rec.label.addKeyframe(0, rec.label.defaultValue);
      rec.sublabel.addKeyframe(0, rec.sublabel.defaultValue);
      rec.kind.addKeyframe(0, rec.kind.defaultValue);
      rec.selected.addKeyframe(0, rec.selected.defaultValue);
      rec.nestedLabel.addKeyframe(0, rec.nestedLabel.defaultValue);
      rec.nestedKind.addKeyframe(0, rec.nestedKind.defaultValue);
      rec.nestedOpacity.addKeyframe(0, rec.nestedOpacity.defaultValue);
      nodes.set(id, rec);
      return api;
    }

    function cursor(id, config) {
      config = config || {};
      const pos = { x: config.x || 0, y: config.y || 0 };
      const rec = {
        cfg: { kind: config.kind || 'human' },
        pos: new Track('vector', pos),
        opacity: new Track('linear', config.opacity != null ? config.opacity : 0),
        label: new Track('step', config.label || ''),
        clicking: new Track('step', false),
      };
      rec.pos.addKeyframe(0, pos, { easing: 'linear' });
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      rec.label.addKeyframe(0, rec.label.defaultValue);
      rec.clicking.addKeyframe(0, false);
      cursors.set(id, rec);
      return api;
    }

    function button(id, config) {
      config = config || {};
      const rec = {
        cfg: {
          x: config.x || 0,
          y: config.y || 0,
          w: config.w != null ? config.w : 90,
          h: config.h != null ? config.h : 36,
        },
        label: new Track('step', config.label || ''),
        pressed: new Track('step', false),
        opacity: new Track('linear', config.opacity != null ? config.opacity : 1),
      };
      rec.label.addKeyframe(0, rec.label.defaultValue);
      rec.pressed.addKeyframe(0, false);
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      buttons.set(id, rec);
      return api;
    }

    function edge(id, config) {
      config = config || {};
      const rec = {
        cfg: {
          from: config.from,
          to: config.to,
          fromAnchor: config.fromAnchor || 'center',
          toAnchor: config.toAnchor || 'center',
          straight: !!config.straight,
        },
        progress: new Track('linear', config.progress != null ? config.progress : 0),
        opacity: new Track('linear', config.opacity != null ? config.opacity : 1),
      };
      rec.progress.addKeyframe(0, rec.progress.defaultValue);
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      edges.set(id, rec);
      return api;
    }

    // Fades an edge out in place — needed when the node it points to is
    // removed (removeNode only fades the node itself; a dangling edge would
    // otherwise keep rendering against the node's last position).
    function hideEdge(id, at, options) {
      options = options || {};
      const dur = options.duration != null ? options.duration : 250;
      const rec = edges.get(id);
      if (!rec) throw new Error(`SceneKit.hideEdge: unknown edge "${id}"`);
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + dur, 0, { easing: 'easeInOut' });
      return api;
    }

    function region(id, config) {
      config = config || {};
      const rec = {
        cfg: {
          x: config.x || 0,
          y: config.y || 0,
          w: config.w != null ? config.w : 160,
          h: config.h != null ? config.h : 120,
          dashed: !!config.dashed,
        },
        label: new Track('step', config.label || ''),
        opacity: new Track('linear', config.opacity != null ? config.opacity : 1),
      };
      rec.label.addKeyframe(0, rec.label.defaultValue);
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      regions.set(id, rec);
      return api;
    }

    function stamp(id, config) {
      config = config || {};
      const rec = {
        x: new Track('linear', config.x || 0),
        y: new Track('linear', config.y || 0),
        text: new Track('step', config.text || ''),
        kind: new Track('step', config.kind || 'human'), // 'human' | 'agent'
        opacity: new Track('linear', config.opacity != null ? config.opacity : 0),
      };
      rec.x.addKeyframe(0, rec.x.defaultValue);
      rec.y.addKeyframe(0, rec.y.defaultValue);
      rec.text.addKeyframe(0, rec.text.defaultValue);
      rec.kind.addKeyframe(0, rec.kind.defaultValue);
      rec.opacity.addKeyframe(0, rec.opacity.defaultValue);
      stamps.set(id, rec);
      return api;
    }

    // -- storyboard actions ------------------------------------------------

    function moveCursor(actor, from, to, start, dur, options) {
      dur = dur != null ? dur : 700;
      options = options || {};
      const rec = cursors.get(actor);
      if (!rec) throw new Error(`SceneKit.moveCursor: unknown cursor "${actor}"`);
      rec.pos.addKeyframe(start, from, { easing: 'linear' });
      rec.pos.addKeyframe(start + dur, to, {
        easing: options.easing || 'easeInOut',
        arc: options.arc != null ? options.arc : 24,
      });
      return api;
    }

    function showCursor(actor, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 150;
      const rec = cursors.get(actor);
      if (!rec) throw new Error(`SceneKit.showCursor: unknown cursor "${actor}"`);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      if (options.label != null) rec.label.addKeyframe(at, options.label);
      return api;
    }

    function hideCursor(actor, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 150;
      const rec = cursors.get(actor);
      if (!rec) throw new Error(`SceneKit.hideCursor: unknown cursor "${actor}"`);
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    function setCursorLabel(actor, text, at) {
      const rec = cursors.get(actor);
      if (!rec) throw new Error(`SceneKit.setCursorLabel: unknown cursor "${actor}"`);
      rec.label.addKeyframe(at, text);
      return api;
    }

    // A control introduced mid-scene (DESIGN.md §5b: "a Research control
    // introduced in phase 2") — same fade-in treatment as showCursor, for a
    // button registered up front with opacity: 0.
    function showButton(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 200;
      const rec = buttons.get(id);
      if (!rec) throw new Error(`SceneKit.showButton: unknown button "${id}"`);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      return api;
    }

    function hideButton(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 200;
      const rec = buttons.get(id);
      if (!rec) throw new Error(`SceneKit.hideButton: unknown button "${id}"`);
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    function showRegion(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 250;
      const rec = regions.get(id);
      if (!rec) throw new Error(`SceneKit.showRegion: unknown region "${id}"`);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, options.to != null ? options.to : 1, { easing: 'easeOutSubtle' });
      return api;
    }

    function hideRegion(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 250;
      const rec = regions.get(id);
      if (!rec) throw new Error(`SceneKit.hideRegion: unknown region "${id}"`);
      rec.opacity.addKeyframe(at, rec.opacity.defaultValue, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    // Persistent authorship stamp — fades in near a node and stays until
    // explicitly hidden or its text/kind flips (e.g. "proposed · Research
    // agent" -> "approved · you" on human approval).
    function showStamp(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 200;
      const rec = stamps.get(id);
      if (!rec) throw new Error(`SceneKit.showStamp: unknown stamp "${id}"`);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      if (options.text != null) rec.text.addKeyframe(at, options.text);
      if (options.kind != null) rec.kind.addKeyframe(at, options.kind);
      return api;
    }

    function hideStamp(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 200;
      const rec = stamps.get(id);
      if (!rec) throw new Error(`SceneKit.hideStamp: unknown stamp "${id}"`);
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    // Flip a stamp's text/kind in place (e.g. a "proposed" stamp becoming
    // "approved" the instant a provisional node commits) — no fade, the
    // change itself is the beat.
    function setStampText(id, text, at, options) {
      options = options || {};
      const rec = stamps.get(id);
      if (!rec) throw new Error(`SceneKit.setStampText: unknown stamp "${id}"`);
      rec.text.addKeyframe(at, text);
      if (options.kind != null) rec.kind.addKeyframe(at, options.kind);
      return api;
    }

    function click(actor, targetId, at, options) {
      options = options || {};
      const pressDuration = options.pressDuration != null ? options.pressDuration : 150;
      const cursorRec = cursors.get(actor);
      if (cursorRec) {
        cursorRec.clicking.addKeyframe(at, true);
        cursorRec.clicking.addKeyframe(at + pressDuration, false);
      }
      const btnRec = buttons.get(targetId);
      if (btnRec) {
        btnRec.pressed.addKeyframe(at, true);
        btnRec.pressed.addKeyframe(at + pressDuration, false);
      }
      return api;
    }

    function selectNode(id, at, selected, options) {
      selected = selected !== false;
      options = options || {};
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.selectNode: unknown node "${id}"`);
      rec.selected.addKeyframe(at, selected);
      if (options.color != null) {
        if (!rec.selectedColor) rec.selectedColor = new Track('step', options.color);
        rec.selectedColor.addKeyframe(at, options.color);
      }
      return api;
    }

    function setLabel(id, text, at) {
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.setLabel: unknown node "${id}"`);
      rec.label.addKeyframe(at, text);
      return api;
    }

    function createNode(id, at, config) {
      config = config || {};
      const dur = config.duration != null ? config.duration : 300;
      node(id, {
        x: config.x,
        y: config.y,
        w: config.w,
        h: config.h,
        label: config.label,
        sublabel: config.sublabel,
        kind: config.kind || 'standard',
        opacity: 0,
        scale: config.startScale != null ? config.startScale : 0.96,
        hasNested: config.hasNested,
      });
      const rec = nodes.get(id);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + dur, 1, { easing: 'easeOutSubtle' });
      rec.scale.addKeyframe(at, config.startScale != null ? config.startScale : 0.96, { easing: 'linear' });
      rec.scale.addKeyframe(at + dur, 1, { easing: 'easeOutSubtle' });
      return api;
    }

    function removeNode(id, at, options) {
      options = options || {};
      const dur = options.duration != null ? options.duration : 250;
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.removeNode: unknown node "${id}"`);
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + dur, 0, { easing: 'easeInOut' });
      return api;
    }

    function showGhost(id, at) {
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.showGhost: unknown node "${id}"`);
      rec.kind.addKeyframe(at, 'ghost');
      return api;
    }

    function commitGhost(id, at) {
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.commitGhost: unknown node "${id}"`);
      rec.kind.addKeyframe(at, 'standard');
      return api;
    }

    // A dashed provisional (agent-proposed) node becomes solid/committed —
    // same underlying transition as commitGhost (kind -> 'standard'), named
    // separately so scene files read intent-first (V2 phase 2: agent
    // proposal accepted after human approval).
    function commitProvisional(id, at) {
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.commitProvisional: unknown node "${id}"`);
      rec.kind.addKeyframe(at, 'standard');
      return api;
    }

    // V2D "Shared Canvas" — reveal a node's label one character at a time.
    // The "a human is typing this" cue: a human-added node types into the
    // canvas while the agent is concurrently thinking. A fan of step
    // keyframes on the label track — pure, scrub-friendly, no state.
    function typewriterLabel(id, text, at, options) {
      options = options || {};
      const step = options.step != null ? options.step : 75;
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.typewriterLabel: unknown node "${id}"`);
      rec.label.addKeyframe(at, '');
      for (let i = 1; i <= text.length; i++) {
        rec.label.addKeyframe(at + i * step, text.slice(0, i));
      }
      rec.label.addKeyframe(at + text.length * step + 1, text);
      return api;
    }

    // V2D — drop an agent-proposed research finding *into* an existing card
    // as an indented, dashed sub-line (provisional). The finding visibly
    // belongs to that solution, not as a sibling node on the canvas. Pair
    // with `commitNested` to flip it solid on approval.
    function addNestedFinding(id, text, at, options) {
      options = options || {};
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.addNestedFinding: unknown node "${id}"`);
      const fade = options.fade != null ? options.fade : 250;
      const typewriter = !!options.typewriter;
      const step = options.step != null ? options.step : 55;
      rec.nestedKind.addKeyframe(at, 'provisional');
      rec.nestedOpacity.addKeyframe(at, 0, { easing: 'linear' });
      if (typewriter) {
        rec.nestedLabel.addKeyframe(at, '');
        for (let i = 1; i <= text.length; i++) {
          rec.nestedLabel.addKeyframe(at + i * step, text.slice(0, i));
        }
        rec.nestedOpacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      } else {
        rec.nestedLabel.addKeyframe(at, text);
        rec.nestedOpacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      }
      return api;
    }

    // V2D — confirm a nested finding: dashed accent sub-line commits to
    // solid neutral, in place. Mirrors `commitProvisional` for the nested
    // line specifically.
    function commitNested(id, at) {
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.commitNested: unknown node "${id}"`);
      rec.nestedKind.addKeyframe(at, 'standard');
      return api;
    }

    function moveNode(id, from, to, start, dur, options) {
      options = options || {};
      dur = dur != null ? dur : 600;
      const rec = nodes.get(id);
      if (!rec) throw new Error(`SceneKit.moveNode: unknown node "${id}"`);
      rec.x.addKeyframe(start, from.x, { easing: 'linear' });
      rec.y.addKeyframe(start, from.y, { easing: 'linear' });
      rec.x.addKeyframe(start + dur, to.x, { easing: options.easing || 'easeInOut' });
      rec.y.addKeyframe(start + dur, to.y, { easing: options.easing || 'easeInOut' });
      return api;
    }

    function drawEdge(id, from, to, at, dur, options) {
      options = options || {};
      dur = dur != null ? dur : 500;
      edge(id, {
        from,
        to,
        fromAnchor: options.fromAnchor || 'center',
        toAnchor: options.toAnchor || 'center',
        progress: 0,
        straight: !!options.straight,
      });
      const rec = edges.get(id);
      rec.progress.addKeyframe(at, 0, { easing: 'linear' });
      rec.progress.addKeyframe(at + dur, 1, { easing: options.easing || 'easeInOut' });
      return api;
    }

    function showIntent(actor, text, at, options) {
      options = options || {};
      const dur = options.duration != null ? options.duration : 1200;
      const fade = options.fade != null ? options.fade : 180;
      const anchor = options.anchor || { x: 0, y: 0 };
      const id = options.id || nextId('badge');
      if (!badges.has(id)) {
        const rec = {
          x: new Track('linear', anchor.x),
          y: new Track('linear', anchor.y),
          opacity: new Track('linear', 0),
          text: new Track('step', ''),
        };
        rec.x.addKeyframe(0, anchor.x);
        rec.y.addKeyframe(0, anchor.y);
        rec.opacity.addKeyframe(0, 0);
        rec.text.addKeyframe(0, '');
        badges.set(id, rec);
      }
      const rec = badges.get(id);
      rec.x.addKeyframe(at, anchor.x, { easing: 'linear' });
      rec.y.addKeyframe(at, anchor.y, { easing: 'linear' });
      rec.text.addKeyframe(at, text);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      rec.opacity.addKeyframe(at + dur, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + dur + fade, 0, { easing: 'easeInOut' });
      return { ...api, badgeId: id };
    }

    function clearIntent(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 180;
      const rec = badges.get(id);
      if (!rec) return api;
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    // A small approval indicator (DESIGN.md §5, V2 phase 2 step 17) — a
    // human-side confirmation mark, so it uses the same neutral floating-text
    // treatment as an intent badge rather than accent (accent stays reserved
    // for agent activity). Built on showIntent's badge track: cheap to add
    // without a new renderer primitive, and keeps the declarative style.
    function showApproval(at, options) {
      options = options || {};
      const anchor = options.anchor || { x: 0, y: 0 };
      const dur = options.duration != null ? options.duration : 700;
      const fade = options.fade != null ? options.fade : 180;
      const text = options.text != null ? options.text : '✓ Approved';
      return showIntent('approval', text, at, { anchor, duration: dur, fade, id: options.id });
    }

    function showProgress(id, at, options) {
      options = options || {};
      const x = options.x || 0;
      const y = options.y || 0;
      const fade = options.fade != null ? options.fade : 150;
      const rec = {
        x: new Track('linear', x),
        y: new Track('linear', y),
        opacity: new Track('linear', 0),
        color: options.color || null,
      };
      rec.x.addKeyframe(0, x);
      rec.y.addKeyframe(0, y);
      rec.opacity.addKeyframe(0, 0);
      rec.opacity.addKeyframe(at, 0, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 1, { easing: 'easeOutSubtle' });
      progressIndicators.set(id, rec);
      return api;
    }

    function hideProgress(id, at, options) {
      options = options || {};
      const fade = options.fade != null ? options.fade : 150;
      const rec = progressIndicators.get(id);
      if (!rec) return api;
      rec.opacity.addKeyframe(at, 1, { easing: 'linear' });
      rec.opacity.addKeyframe(at + fade, 0, { easing: 'easeInOut' });
      return api;
    }

    function appendActivity(text, at) {
      activity.push({ at, text });
      return api;
    }

    function pulse(x, y, at, options) {
      options = options || {};
      const dur = options.duration != null ? options.duration : 900;
      pulses.push({
        id: options.id || nextId('pulse'),
        x,
        y,
        at,
        duration: dur,
        maxRadius: options.radius || 28,
        color: options.color || null,
      });
      return api;
    }

    // -- compile ------------------------------------------------------------

    function sceneState(elapsed) {
      const outNodes = [];
      nodes.forEach((rec, id) => {
        outNodes.push({
          id,
          x: rec.x.valueAt(elapsed),
          y: rec.y.valueAt(elapsed),
          w: rec.cfg.w,
          h: rec.cfg.h,
          hasNested: rec.cfg.hasNested,
          opacity: rec.opacity.valueAt(elapsed),
          scale: rec.scale.valueAt(elapsed),
          label: rec.label.valueAt(elapsed),
          sublabel: rec.sublabel.valueAt(elapsed),
          kind: rec.kind.valueAt(elapsed),
          selected: rec.selected.valueAt(elapsed),
          selectedColor: rec.selectedColor ? rec.selectedColor.valueAt(elapsed) : null,
          nestedLabel: rec.nestedLabel.valueAt(elapsed),
          nestedKind: rec.nestedKind.valueAt(elapsed),
          nestedOpacity: rec.nestedOpacity.valueAt(elapsed),
        });
      });

      const outCursors = [];
      cursors.forEach((rec, id) => {
        const pos = rec.pos.valueAt(elapsed);
        outCursors.push({
          id,
          kind: rec.cfg.kind,
          x: pos.x,
          y: pos.y,
          opacity: rec.opacity.valueAt(elapsed),
          label: rec.label.valueAt(elapsed),
          clicking: rec.clicking.valueAt(elapsed),
        });
      });

      const outEdges = [];
      edges.forEach((rec, id) => {
        outEdges.push({
          id,
          from: rec.cfg.from,
          to: rec.cfg.to,
          fromAnchor: rec.cfg.fromAnchor,
          toAnchor: rec.cfg.toAnchor,
          progress: rec.progress.valueAt(elapsed),
          opacity: rec.opacity.valueAt(elapsed),
          straight: rec.cfg.straight,
        });
      });

      const outButtons = [];
      buttons.forEach((rec, id) => {
        outButtons.push({
          id,
          x: rec.cfg.x,
          y: rec.cfg.y,
          w: rec.cfg.w,
          h: rec.cfg.h,
          label: rec.label.valueAt(elapsed),
          pressed: rec.pressed.valueAt(elapsed),
          opacity: rec.opacity.valueAt(elapsed),
        });
      });

      const outBadges = [];
      badges.forEach((rec, id) => {
        const opacity = rec.opacity.valueAt(elapsed);
        if (opacity > 0.001) {
          outBadges.push({
            id,
            x: rec.x.valueAt(elapsed),
            y: rec.y.valueAt(elapsed),
            text: rec.text.valueAt(elapsed),
            opacity,
          });
        }
      });

      const outProgress = [];
      progressIndicators.forEach((rec, id) => {
        const opacity = rec.opacity.valueAt(elapsed);
        if (opacity > 0.001) {
          outProgress.push({ id, x: rec.x.valueAt(elapsed), y: rec.y.valueAt(elapsed), opacity, elapsed, color: rec.color });
        }
      });

      const outRegions = [];
      regions.forEach((rec, id) => {
        const opacity = rec.opacity.valueAt(elapsed);
        if (opacity > 0.001) {
          outRegions.push({
            id,
            x: rec.cfg.x,
            y: rec.cfg.y,
            w: rec.cfg.w,
            h: rec.cfg.h,
            dashed: rec.cfg.dashed,
            label: rec.label.valueAt(elapsed),
            opacity,
          });
        }
      });

      const outStamps = [];
      stamps.forEach((rec, id) => {
        const opacity = rec.opacity.valueAt(elapsed);
        if (opacity > 0.001) {
          outStamps.push({
            id,
            x: rec.x.valueAt(elapsed),
            y: rec.y.valueAt(elapsed),
            text: rec.text.valueAt(elapsed),
            kind: rec.kind.valueAt(elapsed),
            opacity,
          });
        }
      });

      const outActivity = activity
        .filter((a) => a.at <= elapsed)
        .map((a) => a.text)
        .slice(-4);

      const outPulses = [];
      pulses.forEach((p) => {
        if (elapsed >= p.at && elapsed <= p.at + p.duration) {
          const t = (elapsed - p.at) / p.duration;
          outPulses.push({
            id: p.id,
            x: p.x,
            y: p.y,
            radius: Timeline.lerp(4, p.maxRadius, Timeline.Easing.easeOutSubtle(t)),
            opacity: 1 - t,
            color: p.color,
          });
        }
      });

      return {
        nodes: outNodes,
        cursors: outCursors,
        edges: outEdges,
        buttons: outButtons,
        badges: outBadges,
        progress: outProgress,
        activity: outActivity,
        pulses: outPulses,
        regions: outRegions,
        stamps: outStamps,
      };
    }

    const api = {
      node,
      cursor,
      button,
      edge,
      region,
      stamp,
      moveCursor,
      moveNode,
      showCursor,
      hideCursor,
      setCursorLabel,
      click,
      showButton,
      hideButton,
      showRegion,
      hideRegion,
      showStamp,
      hideStamp,
      setStampText,
      selectNode,
      setLabel,
      createNode,
      removeNode,
      showGhost,
      commitGhost,
      commitProvisional,
      typewriterLabel,
      addNestedFinding,
      commitNested,
      drawEdge,
      hideEdge,
      showIntent,
      clearIntent,
      showApproval,
      showProgress,
      hideProgress,
      appendActivity,
      pulse,
      build() {
        return { duration, fadeDuration, sceneState };
      },
    };

    return api;
  }

  const SceneKit = { createScene };

  if (root) root.SceneKit = SceneKit;
  if (typeof module !== 'undefined' && module.exports) module.exports = SceneKit;
})(typeof window !== 'undefined' ? window : null);
