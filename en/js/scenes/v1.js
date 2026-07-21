// scenes/v1.js — V1, "One User, One Action" (animations.md).
//
// Small inline scene. The deliberate setup for the entire opening sequence:
// a calm, almost uneventful interaction that establishes the old single-actor
// contract before later scenes make it more active by contrast.
//
// One canvas holds one prompt node, one "Add idea" control, and one human
// cursor. The cursor clicks the node to reveal a button, clicks the button,
// a result card appears, and the user types a label into it character by
// character. That's it — the simplicity is the argument.
//
// Visual vocabulary matches V2D (v2-shared-canvas.js): dark canvas theme,
// boxed cursor tags, h:28 buttons, same node dimensions, layout conventions,
// and the same click-on-node-to-reveal-button + typewriter interaction pattern.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV1() {
    var scene = SceneKit.createScene(6500, { fadeDuration: 700 });

    // -- layout (matching V2D node/button dimensions, shifted down) -------
    //
    // Problem node centered at x = 410, shifted roughly 60px down from
    // V2D's PROBLEM position to give the sparse content breathing room in
    // the standard canvas height.
    var PROBLEM = { x: 290, y: 110, w: 240, h: 52 };           // c = 410
    var TRIG   = { x: 330, y: 178, w: 160, h: 28 };           // Add idea, c = 410

    // ======================================================================
    // Beat 1 — problem fades in at the top, alone (like V2D).
    // ======================================================================

    scene.createNode('problem', 300, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Why are customers churning?',
      duration: 400,
    });

    // -- cursors & buttons (all hidden until their moment) -----------------

    scene.cursor('user', { kind: 'human', x: 700, y: 420, label: '', opacity: 0 });

    scene.button('addIdea', {
      x: TRIG.x, y: TRIG.y, w: TRIG.w, h: TRIG.h,
      label: 'Add idea', opacity: 0,
    });

    // ======================================================================
    // Beat 2 — user moves to the problem node and clicks ON it. That click
    // selects the node (ring) and reveals the Add idea button directly
    // beneath it, center-aligned (exact V2D pattern).
    // ======================================================================

    scene.showCursor('user', 1000, { fade: 160, label: 'You' });
    scene.moveCursor('user', { x: 700, y: 420 }, { x: 410, y: 136 }, 1000, 750, { arc: 24 });
    scene.pulse(410, 136, 1750, { radius: 24, duration: 700 });
    scene.selectNode('problem', 1800, true, { color: '#5e6ad2' });
    scene.showButton('addIdea', 1900, { fade: 200 });

    // ======================================================================
    // Beat 3 — user clicks [Add idea]. The button disappears, the node
    // deselects, and an empty result card fades in beneath the prompt.
    // ======================================================================

    scene.moveCursor('user', { x: 410, y: 136 }, { x: 410, y: 192 }, 2200, 550, { arc: -10 });
    scene.click('user', 'addIdea', 2750, { pressDuration: 140 });
    scene.pulse(410, 192, 2750, { radius: 22, duration: 600 });
    scene.appendActivity('You add an idea', 2750);

    scene.hideButton('addIdea', 2900, { fade: 160 });
    scene.selectNode('problem', 2900, false);

    scene.createNode('result', 3100, {
      x: PROBLEM.x, y: 235, w: PROBLEM.w, h: PROBLEM.h,
      label: '',
      duration: 400,
    });
    scene.drawEdge('e-problem-result', 'problem', 'result', 3100, 600, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });

    // ======================================================================
    // Beat 4 — cursor drifts to the empty result card, then the label types
    // in character by character (same pattern as V2D's typewriterLabel on
    // userSolution). One cause, one effect — nothing else happens.
    // ======================================================================

    scene.moveCursor('user', { x: 410, y: 192 }, { x: 410, y: 261 }, 3500, 500, { arc: -14 });
    scene.typewriterLabel('result', 'Onboarding emails', 4000, { step: 70 });
    var typeDoneAt = 4000 + 17 * 70; // ~5190

    // t=5190–6500: hold the completed state. The SceneRunner's fadeDuration
    // handles the gentle reset.

    return scene.build();
  }

  var compiled = buildV1();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V1 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
