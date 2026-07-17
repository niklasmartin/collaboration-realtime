// scenes/v3.js — V3, "The Canvas Gets Crowded" (animations.md).
//
// Anchor scene. Builds up progressively: the problem node appears first
// with the Research agent already reading the canvas, then You creates
// Onboarding emails, the Research agent adds Win-back offer and findings,
// two more participants arrive, and each acts sequentially. Only at the
// very end do two participants converge on the same node — the first moment
// where the interface can no longer assume obvious causality.
// The scene holds the unresolved collision — the rest of the article
// explains how to fix it.
//
// Visual vocabulary matches V2D: dark canvas, boxed cursor tags, same node
// dimensions and layout conventions.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV3() {
    var scene = SceneKit.createScene(11200, { fadeDuration: 700 });

    // -- layout -----------------------------------------------------------
    //
    // Problem at top-center, user solution left, agent solution right.
    // Research finding and evidence extend the user column downward.
    var PROBLEM    = { x: 290, y: 30,  w: 240, h: 52 };   // c = 410
    var USER_SOL   = { x: 60,  y: 145, w: 260, h: 60 };   // c = 190
    var AGENT_SOL  = { x: 490, y: 145, w: 260, h: 60 };   // c = 620
    var RESEARCH_F = { x: 110, y: 225, w: 170, h: 40 };   // under user sol
    var EVIDENCE   = { x: 90,  y: 290, w: 210, h: 46 };   // created mid-scene

    // -- cursors: all registered up front ---------------------------------

    // Research agent visible from frame 0, already reading at the top.
    scene.cursor('researchAgent',   { kind: 'agent', x: 410, y: 56,  label: 'Research agent', opacity: 1 });
    scene.cursor('you',             { kind: 'human', x: 160, y: 250, label: '', opacity: 0 });
    scene.cursor('maya',            { kind: 'human', x: 750, y: 110, label: '', opacity: 0 });
    scene.cursor('structureAgent',  { kind: 'agent', x: 550, y: 430, label: '', opacity: 0 });

    // ======================================================================
    // Beat 1 — Problem node appears beneath the Research agent's cursor.
    // ======================================================================

    scene.createNode('problem', 200, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Why are customers churning?',
      duration: 350,
    });

    // ======================================================================
    // Beat 2 — You enters and creates Onboarding emails. The cursor arrives
    // at the node center just before the node fades in — clear ownership.
    // ======================================================================

    scene.showCursor('you', 700, { fade: 160, label: 'You' });
    scene.moveCursor('you', { x: 160, y: 200 }, { x: 190, y: 175 }, 700, 500, { arc: 8 });

    scene.createNode('userSolution', 1300, {
      x: USER_SOL.x, y: USER_SOL.y, w: USER_SOL.w, h: USER_SOL.h,
      label: 'Onboarding emails',
      duration: 350,
    });
    scene.drawEdge('e-problem-user', 'problem', 'userSolution', 1650, 500, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });

    // ======================================================================
    // Beat 3 — Research agent moves right and creates Win-back offer.
    // ======================================================================

    scene.moveCursor('researchAgent', { x: 410, y: 56 }, { x: 620, y: 175 }, 1800, 600, { arc: -10 });
    scene.pulse(620, 175, 2400, { radius: 24, duration: 600, color: '#5e6ad2' });

    scene.createNode('agentSolution', 2600, {
      x: AGENT_SOL.x, y: AGENT_SOL.y, w: AGENT_SOL.w, h: AGENT_SOL.h,
      label: 'Win-back offer',
      duration: 350,
    });
    scene.drawEdge('e-problem-agent', 'problem', 'agentSolution', 2950, 500, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });

    // Research agent adds a small finding beneath the user's solution.
    scene.moveCursor('researchAgent', { x: 620, y: 175 }, { x: 195, y: 245 }, 3400, 550, { arc: 10 });
    scene.createNode('researchFinding', 4000, {
      x: RESEARCH_F.x, y: RESEARCH_F.y, w: RESEARCH_F.w, h: RESEARCH_F.h,
      label: 'Welcome series',
      kind: 'standard',
      duration: 350,
    });

    // ======================================================================
    // Beat 4 — Two more participants arrive (4300–4900ms).
    // ======================================================================

    scene.showCursor('maya', 4400, { fade: 160, label: 'Maya' });
    scene.moveCursor('maya', { x: 750, y: 110 }, { x: 410, y: 56 }, 4400, 700, { arc: -18 });

    scene.showCursor('structureAgent', 4800, { fade: 160, label: 'Structure agent' });
    scene.moveCursor('structureAgent', { x: 550, y: 430 }, { x: 620, y: 175 }, 4800, 650, { arc: -16 });

    // ======================================================================
    // Beat 5 — Sequential actions, one at a time (5100–6900ms).
    // ======================================================================

    // Research agent moves down to create an evidence node. Cursor reaches
    // the node center, pulses, then the node appears — clear ownership.
    scene.moveCursor('researchAgent', { x: 195, y: 245 }, { x: 195, y: 313 }, 5200, 450, { arc: 4 });
    scene.pulse(195, 313, 5650, { radius: 24, duration: 600, color: '#5e6ad2' });
    scene.createNode('evidence', 5850, {
      x: EVIDENCE.x, y: EVIDENCE.y, w: EVIDENCE.w, h: EVIDENCE.h,
      label: 'Evidence: 2 studies',
      kind: 'standard',
      duration: 350,
    });
    scene.appendActivity('Research agent adds evidence', 5850);

    // Structure agent connects the two solution nodes side-by-side.
    scene.moveCursor('structureAgent', { x: 620, y: 175 }, { x: 620, y: 205 }, 6200, 350, { arc: 4 });
    scene.selectNode('agentSolution', 6500, true, { color: '#5e6ad2' });
    scene.drawEdge('e-agent-user', 'agentSolution', 'userSolution', 6700, 550, {
      fromAnchor: 'left', toAnchor: 'right', straight: true,
    });
    scene.selectNode('agentSolution', 7100, false);

    // Maya selects the problem node.
    scene.selectNode('problem', 7300, true, { color: '#a0a0ab' });

    // ======================================================================
    // Beat 6 — both actors grab the same card and pull toward incompatible
    // destinations. The canvas cannot infer a final position.
    // ======================================================================

    scene.createNode('yourTarget', 7500, {
      x: 20, y: 355, w: 190, h: 42, label: 'Your destination: left', kind: 'ghost', duration: 300,
    });
    scene.createNode('agentTarget', 7500, {
      x: 590, y: 355, w: 190, h: 42, label: 'Agent destination: right', kind: 'ghost', duration: 300,
    });
    scene.moveCursor('you', { x: 190, y: 175 }, { x: 72, y: 175 }, 7600, 600, { arc: 0 });
    scene.moveCursor('structureAgent', { x: 620, y: 175 }, { x: 306, y: 175 }, 7600, 650, { arc: 0 });
    scene.selectNode('userSolution', 8300, true, { color: '#5e6ad2' });
    scene.pulse(72, 175, 8300, { radius: 30, duration: 850 });
    scene.pulse(306, 175, 8300, { radius: 30, duration: 850, color: '#5e6ad2' });
    scene.moveNode('userSolution', { x: USER_SOL.x, y: USER_SOL.y }, { x: 35, y: USER_SOL.y }, 8600, 280, { easing: 'easeInOut' });
    scene.moveNode('userSolution', { x: 35, y: USER_SOL.y }, { x: 85, y: USER_SOL.y }, 8880, 280, { easing: 'easeInOut' });
    scene.moveNode('userSolution', { x: 85, y: USER_SOL.y }, { x: USER_SOL.x, y: USER_SOL.y }, 9160, 280, { easing: 'easeInOut' });
    scene.showIntent(null, 'COLLISION: same card, two destinations', 9300, {
      anchor: { x: 400, y: 430 }, duration: 1500, fade: 180,
    });
    scene.appendActivity('Collision unresolved: You and Structure agent grabbed Onboarding emails', 9300);

    // ======================================================================
    // Beat 7 — Hold the unresolved collision long enough to read it.
    // ======================================================================

    scene.hideCursor('you', 10800, { fade: 150 });
    scene.hideCursor('maya', 10800, { fade: 150 });
    scene.hideCursor('researchAgent', 10800, { fade: 150 });
    scene.hideCursor('structureAgent', 10800, { fade: 150 });
    scene.selectNode('userSolution', 10800, false);
    scene.selectNode('problem', 10800, false);

    return scene.build();
  }

  var compiled = buildV3();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V3 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
