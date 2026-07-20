// scenes/v2-signed.js — V2 variant B, "Signed".
//
// Same V2 story, same single-column spine as v2-assembly.js, but the hero
// here is ATTRIBUTION: every node on the spine carries a small persistent
// authorship stamp — "you" (neutral) or "Research agent" (purple-tinted) —
// so the reader watches a signed trail accumulate rather than reading
// cursor shapes alone. The agent's Evidence node appears dashed, stamped
// "proposed · Research agent"; on approval the stamp flips in place to
// "approved · you" and the node commits solid. Cursors are present but
// secondary — the stamps carry the story.

(function (root) {
  'use strict';

  const SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV2Signed() {
    const scene = SceneKit.createScene(15500, { fadeDuration: 500 });

    // -- layout: single spine, no lanes ------------------------------------
    const PROBLEM = { x: 280, y: 20, w: 240, h: 48 };
    const TRIG1 = { x: 325, y: 92, w: 150, h: 32 };
    const SOLUTION = { x: 260, y: 148, w: 280, h: 64 };
    const TRIG2 = { x: 325, y: 236, w: 150, h: 32 };
    const EVIDENCE = { x: 270, y: 292, w: 260, h: 56 };

    scene.button('proposeSolution', { x: TRIG1.x, y: TRIG1.y, w: TRIG1.w, h: TRIG1.h, label: 'Propose solution' });
    scene.button('addResearch', { x: TRIG2.x, y: TRIG2.y, w: TRIG2.w, h: TRIG2.h, label: 'Add research', opacity: 0 });

    scene.cursor('user', { kind: 'human', x: 700, y: 400, label: '', opacity: 0 });
    scene.cursor('agent', { kind: 'agent', x: 750, y: 40, label: '', opacity: 0 });

    // Stamps registered up front, invisible until their node exists.
    scene.stamp('problemStamp', { x: 400, y: 72, text: 'you', kind: 'human' });
    scene.stamp('solutionStamp', { x: 400, y: 216, text: 'you', kind: 'human' });
    scene.stamp('evidenceStamp', { x: 400, y: 352, text: 'proposed · Research agent', kind: 'agent' });

    // ======================================================================
    // Spine builds top-to-bottom; each node's stamp lands with it.
    // ======================================================================

    scene.createNode('problem', 300, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Why are users churning?',
      duration: 300,
    });
    scene.showStamp('problemStamp', 500);

    scene.showCursor('user', 1000, { fade: 150, label: 'You' });
    scene.moveCursor('user', { x: 700, y: 400 }, { x: 400, y: 108 }, 1000, 700, { arc: 26 });
    scene.click('user', 'proposeSolution', 1700, { pressDuration: 150 });
    scene.pulse(400, 108, 1700, { radius: 24, duration: 600 });
    scene.appendActivity('Propose solution', 1700);

    scene.createNode('solution', 2000, {
      x: SOLUTION.x, y: SOLUTION.y, w: SOLUTION.w, h: SOLUTION.h,
      label: 'Onboarding emails',
      sublabel: 'Trigger a 3-day welcome series',
      duration: 300,
    });
    scene.showStamp('solutionStamp', 2200);

    scene.moveCursor('user', { x: 400, y: 108 }, { x: 420, y: 180 }, 2300, 700, { arc: -14 });

    // t=3000 -> 4600: hold — two signed nodes, quiet.

    scene.showButton('addResearch', 4600, { fade: 200 });
    scene.moveCursor('user', { x: 420, y: 180 }, { x: 400, y: 252 }, 4900, 700, { arc: 18 });
    scene.click('user', 'addResearch', 5600, { pressDuration: 150 });
    scene.pulse(400, 252, 5600, { radius: 24, duration: 600 });
    scene.appendActivity('Add research', 5600);

    // ======================================================================
    // Agent enters
    // ======================================================================

    scene.showCursor('agent', 5900, { fade: 200, label: 'Research agent' });
    scene.moveCursor('agent', { x: 750, y: 40 }, { x: 340, y: 44 }, 5900, 800, { arc: 20 });
    scene.selectNode('problem', 5900, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Reading', 6700, { anchor: { x: 340, y: 70 }, duration: 900 });

    scene.selectNode('problem', 7600, false);
    scene.moveCursor('agent', { x: 340, y: 44 }, { x: 340, y: 180 }, 7600, 800, { arc: -20 });
    scene.selectNode('solution', 7600, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Adding evidence', 8400, { anchor: { x: 340, y: 214 }, duration: 1000 });
    scene.selectNode('solution', 9400, false);

    scene.moveCursor('agent', { x: 340, y: 180 }, { x: 430, y: 300 }, 9400, 500, { arc: 12 });
    scene.pulse(400, 320, 9800, { radius: 28, duration: 500, color: '#5e6ad2' });

    // Evidence appears in its final spine position, dashed — the stamp,
    // not the position, is what marks it as still-provisional.
    scene.createNode('evidence', 10100, {
      x: EVIDENCE.x, y: EVIDENCE.y, w: EVIDENCE.w, h: EVIDENCE.h,
      label: 'Welcome series ↑ retention 22%',
      kind: 'provisional',
      duration: 300,
    });
    scene.showStamp('evidenceStamp', 10100, { text: 'proposed · Research agent', kind: 'agent' });
    scene.appendActivity('Evidence proposed', 10100);

    scene.moveCursor('user', { x: 400, y: 252 }, { x: 430, y: 320 }, 10400, 800, { arc: -16 });
    scene.showIntent('agent', 'Paused', 11600, { anchor: { x: 430, y: 288 }, duration: 900 });

    scene.showApproval(12700, { anchor: { x: 430, y: 400 }, duration: 700 });

    // Approval: the stamp flips in place — "proposed · Research agent"
    // becomes "approved · you" — and the node commits solid at the same
    // instant. The flip itself is the beat.
    scene.commitProvisional('evidence', 13100);
    scene.setStampText('evidenceStamp', 'approved · you', 13100, { kind: 'human' });
    scene.appendActivity('Evidence approved', 13100);

    // t=13100 -> 15500: hold — three signed nodes, all attributed.

    return scene.build();
  }

  const compiled = buildV2Signed();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V2B = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
