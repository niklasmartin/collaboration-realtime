// scenes/v2.js — V2, "From Stillness to a Second Actor" (animations.md).
//
// Two-phase scene sharing one canvas, one node vocabulary, one frame:
//
//   Phase 1 (0 - ~7400ms): still, linear request-response. A human cursor
//   clicks "Run", the canvas holds through a spinner, a result node fades
//   in, the cursor inspects it, then the frame holds calm for a full beat.
//   This stillness is deliberate — later scenes are measured against it.
//
//   Short beat (~7400 - 7800ms): nothing new happens. Pure held stillness,
//   the hinge between the two phases.
//
//   Phase 2 (~7800 - 18000ms): the same canvas breaks its own stillness. A
//   "Research" control appears, a Research agent cursor enters and announces
//   itself, visits both existing nodes while its status shifts from
//   "Reading" to "Adding evidence", proposes a dashed provisional node, the
//   human cursor drifts toward it while the agent is still working, the
//   agent pauses (interruptibility, demonstrated rather than stated), a
//   small approval mark appears, and the dashed outline turns solid.
//
// Both phases run through the same SceneKit factories/actions — no phase
// switch in the engine, just more storyboard calls on the same scene.

(function (root) {
  'use strict';

  const SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV2() {
    const scene = SceneKit.createScene(18000, { fadeDuration: 400 });

    // -- static setup: nodes, controls, cursors — all present from t=0,
    // most invisible until their entrance (DESIGN.md §5: "One canvas holds
    // one node, a Run control, and a Research control introduced in
    // phase 2.") -------------------------------------------------------

    scene.node('problem', {
      x: 140,
      y: 160,
      w: 160,
      h: 48,
      label: 'Kundenproblem',
      kind: 'standard',
    });

    scene.button('run', { x: 420, y: 168, w: 88, h: 36, label: 'Starten' });
    // Research control: registered now, invisible, faded in at the top of
    // phase 2 via showButton — it must not read as available during phase 1.
    scene.button('research', { x: 540, y: 168, w: 96, h: 36, label: 'Recherche', opacity: 0 });

    // Human cursor starts off to the side, invisible.
    scene.cursor('user', { kind: 'human', x: 700, y: 380, label: '', opacity: 0 });
    // Research agent cursor starts off-canvas (top-right), invisible —
    // identity carried by shape (diamond) + label chip, never color alone.
    scene.cursor('agent', { kind: 'agent', x: 750, y: 40, label: '', opacity: 0 });

    // ======================================================================
    // Phase 1: User acts, system responds (still)
    // ======================================================================

    // 0–700ms: nothing moves.
    // t=700: cursor enters.
    scene.showCursor('user', 700, { fade: 150 });

    // t=700 → 1400: cursor arcs from its entry point to the Run button.
    scene.moveCursor('user', { x: 700, y: 380 }, { x: 464, y: 168 }, 700, 700, { arc: 30 });

    // t=1400: click — trigger's stroke deepens briefly and a hairline pulse
    // ripples out from it (no depress effect, per DESIGN.md §5).
    scene.click('user', 'run', 1400, { pressDuration: 150 });
    scene.pulse(464, 186, 1400, { radius: 26, duration: 700 });

    // t=1450 → 2600: thin hairline progress arc while the cursor holds still.
    scene.showProgress('spinner', 1450, { x: 464, y: 230, fade: 150 });
    scene.hideProgress('spinner', 2450, { fade: 150 });

    // t=2600: result node fades + scales in (0.96 → 1, per DESIGN.md §5).
    scene.createNode('result', 2600, {
      x: 400,
      y: 270,
      w: 160,
      h: 48,
      label: 'Ergebnis',
      duration: 300,
    });

    // t=2900 → 3600: cursor moves to inspect the new result node.
    scene.moveCursor('user', { x: 464, y: 168 }, { x: 480, y: 294 }, 2900, 700, { arc: -18 });

    // Bottom activity strip highlights the linear contract sequentially
    // (DESIGN.md §5, phase 1 step 8): User acts → System responds → User
    // acts again.
    scene.appendActivity('Nutzer handelt', 1400);
    scene.appendActivity('System reagiert', 2600);
    scene.appendActivity('Nutzer handelt erneut', 2900);

    // t=3600 → 7400: hold the calm, static frame for a full beat — this
    // stillness is deliberate, not a pause between clips (DESIGN.md §5).
    // No keyframes needed; every track simply holds its last value.

    // ======================================================================
    // Short beat between phases (~7400 → 7800ms): held stillness, no events.
    // ======================================================================

    // ======================================================================
    // Phase 2: The first agent enters (same canvas)
    // ======================================================================

    const PHASE2 = 7800;

    // t=7800: the Research control fades in — the canvas quietly grows a
    // second capability before anything else changes.
    scene.showButton('research', PHASE2, { fade: 200 });

    // t=8100 → 8800: human cursor moves from the result node to Research.
    scene.moveCursor('user', { x: 480, y: 294 }, { x: 588, y: 168 }, PHASE2 + 300, 700, { arc: 24 });

    // t=8800: human clicks Research.
    scene.click('user', 'research', PHASE2 + 1000, { pressDuration: 150 });
    scene.pulse(588, 186, PHASE2 + 1000, { radius: 24, duration: 600, color: null });
    scene.appendActivity('Recherche angefordert', PHASE2 + 1000);

    // t=9000: the agent cursor enters with its identity chip. Intention
    // becomes visible before the canvas changes (DESIGN.md §5b) — the agent
    // is seen before it does anything.
    scene.showCursor('agent', PHASE2 + 1200, { fade: 200, label: 'Recherche-Agent' });

    // t=9000 → 9800: agent visits the first existing node.
    scene.moveCursor('agent', { x: 750, y: 40 }, { x: 220, y: 130 }, PHASE2 + 1200, 800, { arc: 20 });
    scene.selectNode('problem', PHASE2 + 1200, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Liest', PHASE2 + 2000, {
      anchor: { x: 220, y: 154 },
      duration: 900,
    });

    // t=10900 → 11700: agent visits the second existing node; status shifts.
    scene.selectNode('problem', PHASE2 + 3100, false);
    scene.moveCursor('agent', { x: 220, y: 130 }, { x: 480, y: 230 }, PHASE2 + 3100, 800, { arc: -20 });
    scene.selectNode('result', PHASE2 + 3100, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Fügt Nachweise hinzu', PHASE2 + 3900, {
      anchor: { x: 480, y: 264 },
      duration: 1000,
    });
    scene.selectNode('result', PHASE2 + 5100, false);

    // t=12300 → 12800: agent approaches the spot where it will propose a
    // node — target area highlights just before the change (DESIGN.md §5b:
    // "Intent before action").
    scene.moveCursor('agent', { x: 480, y: 230 }, { x: 620, y: 290 }, PHASE2 + 4500, 500, { arc: 12 });
    scene.pulse(660, 334, PHASE2 + 5000, { radius: 30, duration: 500, color: '#5e6ad2' });

    // t=13100: agent creates a dashed provisional node — proposing, not
    // committing (DESIGN.md §5: dashed hairline in --accent).
    scene.createNode('evidence', PHASE2 + 5300, {
      x: 580,
      y: 310,
      w: 160,
      h: 48,
      label: 'Nachweis',
      kind: 'provisional',
      duration: 300,
    });
    scene.appendActivity('Nachweis vorgeschlagen', PHASE2 + 5300);

    // t=13400 → 14200: human cursor drifts toward the proposed node while
    // the agent is still "working" nearby — the first demonstration of
    // interruptibility in the article.
    scene.moveCursor('user', { x: 588, y: 168 }, { x: 660, y: 290 }, PHASE2 + 5600, 800, { arc: -16 });

    // t=14200: agent pauses — no further movement is scheduled for it here,
    // and a brief status word makes the pause itself legible rather than
    // implicit.
    scene.showIntent('agent', 'Pausiert', PHASE2 + 6400, {
      anchor: { x: 620, y: 278 },
      duration: 900,
    });

    // t=15300: a small approval indicator appears — the human's confirmation
    // that the proposal should commit.
    scene.showApproval(PHASE2 + 7500, {
      anchor: { x: 660, y: 388 },
      duration: 700,
    });

    // t=15700: the provisional node becomes solid — accepted, not overwritten.
    scene.commitProvisional('evidence', PHASE2 + 7900);
    scene.appendActivity('Nachweis übernommen', PHASE2 + 7900);

    // t=15700 → 18000: hold on the now-active canvas. The contrast with
    // phase 1's stillness should be legible without a caption.

    return scene.build();
  }

  const compiled = buildV2();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V2 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
