// scenes/v2-shared-canvas.js — V2 variant D, "Shared canvas".
//
// Miro-style simplified graph canvas where both human and agent author
// nodes onto one shared surface. The signature beat is parallel authorship:
// you type your own solution while the agent is concurrently thinking up
// its own; your node then slides left to make room for the agent's dashed
// sibling. Research nests *inside* your solution card as an indented
// dashed sub-line (committed solid on approval) — it belongs to that
// solution, not as a sibling on the canvas.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV2SharedCanvas() {
    var scene = SceneKit.createScene(24000, { fadeDuration: 600 });

    // -- layout -----------------------------------------------------------
    //
    // Everything is centered on x = 410 (problem center). Buttons sit
    // directly underneath their parent node, center-aligned. Edges run
    // from the bottom-center of the parent to the top-center of the child.
    var PROBLEM = { x: 290, y: 30, w: 240, h: 52 };           // c = 410

    // Two equal-width action buttons under the problem, center-aligned.
    // Total span = 150 + 16 + 150 = 316 → start = 410 - 158 = 252.
    var TRIG1 = { x: 252, y: 98, w: 150, h: 28 };             // Propose solutions
    var TRIG2 = { x: 418, y: 98, w: 150, h: 28 };             // Add solution

    // Solution cards (hasNested reserves bottom slot for research sub-line).
    var SOL_USER_CENTER = { x: 280, y: 155, w: 260, h: 72 };  // c = 410, single
    var SOL_USER_LEFT   = { x: 60,  y: 155, w: 260, h: 72 };  // c = 190, after reflow
    var SOL_AGENT       = { x: 490, y: 155, w: 260, h: 72 };  // c = 620, after reflow

    // [Add research] under user's solution (centered at 190 after reflow).
    var TRIG_RESEARCH = { x: 130, y: 242, w: 120, h: 28 };

    // ======================================================================
    // Beat 1 — problem fades in at the top, alone.
    // ======================================================================

    scene.createNode('problem', 300, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Warum wandern Kunden ab?',
      duration: 400,
    });

    // -- cursors & buttons (all hidden until their moment) -----------------

    scene.cursor('user',  { kind: 'human', x: 700, y: 400, label: '', opacity: 0 });
    scene.cursor('agent', { kind: 'agent', x: 480, y: 5,   label: '', opacity: 0 });

    scene.button('proposeSolutions', {
      x: TRIG1.x, y: TRIG1.y, w: TRIG1.w, h: TRIG1.h,
      label: 'Lösungen vorschlagen', opacity: 0,
    });
    scene.button('addSolution', {
      x: TRIG2.x, y: TRIG2.y, w: TRIG2.w, h: TRIG2.h,
      label: 'Lösung hinzufügen', opacity: 0,
    });
    scene.button('addResearch', {
      x: TRIG_RESEARCH.x, y: TRIG_RESEARCH.y,
      w: TRIG_RESEARCH.w, h: TRIG_RESEARCH.h,
      label: 'Recherche hinzufügen', opacity: 0,
    });

    // ======================================================================
    // Beat 2 — user moves to the problem node and clicks ON it. That click
    // selects the node (ring) and reveals the two action buttons directly
    // beneath it, center-aligned.
    // ======================================================================

    scene.showCursor('user', 1000, { fade: 160, label: 'Sie' });
    scene.moveCursor('user', { x: 700, y: 400 }, { x: 410, y: 56 }, 1000, 750, { arc: 24 });
    scene.pulse(410, 56, 1750, { radius: 24, duration: 700 });
    scene.selectNode('problem', 1800, true, { color: '#5e6ad2' });
    scene.showButton('proposeSolutions', 1900, { fade: 200 });
    scene.showButton('addSolution', 1900, { fade: 200 });

    // ======================================================================
    // Beat 3 — user clicks [Propose solutions] (first action). Agent
    // enters, offset to the right of the problem node (not on top of it),
    // then reads… then thinks.
    // ======================================================================

    scene.moveCursor('user', { x: 410, y: 56 }, { x: 327, y: 112 }, 2200, 550, { arc: -10 });
    scene.click('user', 'proposeSolutions', 2750, { pressDuration: 140 });
    scene.pulse(327, 112, 2750, { radius: 22, duration: 600 });
    scene.appendActivity('Lösungsvorschläge angefordert', 2750);

    // Agent appears offset right of the problem (not on it).
    scene.showCursor('agent', 3100, { fade: 220, label: 'Recherche-Agent' });
    scene.moveCursor('agent', { x: 480, y: 5 }, { x: 456, y: 36 }, 3100, 650, { arc: 12 });
    scene.selectNode('problem', 3900, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Liest', 4000, { anchor: { x: 456, y: 60 }, duration: 1400 });
    scene.showIntent('agent', 'Denkt nach', 5500, { anchor: { x: 456, y: 60 }, duration: 2800 });

    // ======================================================================
    // Beat 4 (the parallel frame) — user clicks [Add solution] while the
    // agent is still thinking. Both buttons immediately disappear. A new
    // card drops in centered under the problem. The user cursor moves next
    // to the card (at the title line, reading "typing here"). Typewriter
    // runs. An edge draws from problem bottom to card top.
    // ======================================================================

    scene.moveCursor('user', { x: 327, y: 112 }, { x: 493, y: 112 }, 5800, 500, { arc: 8 });
    scene.click('user', 'addSolution', 6300, { pressDuration: 140 });
    scene.pulse(493, 112, 6300, { radius: 22, duration: 500 });

    // Buttons gone the instant addSolution is clicked — then the node appears.
    scene.hideButton('proposeSolutions', 6400, { fade: 160 });
    scene.hideButton('addSolution', 6400, { fade: 160 });
    scene.selectNode('problem', 6400, false);

    scene.createNode('userSolution', 6600, {
      x: SOL_USER_CENTER.x, y: SOL_USER_CENTER.y,
      w: SOL_USER_CENTER.w, h: SOL_USER_CENTER.h,
      label: '', hasNested: true, duration: 320,
    });
    scene.drawEdge('e-problem-user', 'problem', 'userSolution', 6920, 500, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });

    // Cursor arrives at the empty card first, *then* typing starts —
    // like a user orienting before they begin.
    scene.moveCursor('user', { x: 493, y: 112 }, { x: 415, y: 175 }, 7000, 500, { arc: -6 });
    scene.typewriterLabel('userSolution', 'Onboarding-E-Mails', 7700, { step: 63 });
    var typeDoneAt = 7700 + 16 * 70; // ~8820

    // ======================================================================
    // Beat 5 — agent finishes thinking. Your node slides left to make room;
    // the agent's dashed sibling appears to its right. Two edges from the
    // problem's bottom. Unhurried reflow.
    // ======================================================================

    scene.selectNode('problem', 9300, false);
    scene.moveCursor('agent', { x: 456, y: 36 }, { x: 620, y: 178 }, 9300, 750, { arc: -12 });
    scene.pulse(620, 200, 10100, { radius: 26, duration: 600, color: '#5e6ad2' });

    scene.moveNode(
      'userSolution',
      { x: SOL_USER_CENTER.x, y: SOL_USER_CENTER.y },
      { x: SOL_USER_LEFT.x,   y: SOL_USER_LEFT.y },
      10200, 900, { easing: 'easeInOut' }
    );
    scene.createNode('agentSolution', 10300, {
      x: SOL_AGENT.x, y: SOL_AGENT.y,
      w: SOL_AGENT.w, h: SOL_AGENT.h,
      label: 'Rückgewinnungsangebot', kind: 'provisional', duration: 360,
    });
    scene.drawEdge('e-problem-agent', 'problem', 'agentSolution', 10660, 500, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });
    scene.appendActivity('Lösung vorgeschlagen', 10300);

    // ======================================================================
    // Beat 6 — you approve the agent's node. Dashed → solid.
    // ======================================================================

    scene.moveCursor('user', { x: 415, y: 175 }, { x: 620, y: 190 }, 12200, 800, { arc: 14 });
    scene.selectNode('agentSolution', 13100, true, { color: '#5e6ad2' });
    scene.showApproval(13400, { anchor: { x: 620, y: 242 }, duration: 800 });
    scene.commitProvisional('agentSolution', 13800);
    scene.selectNode('agentSolution', 13900, false);
    scene.appendActivity('Lösung freigegeben', 13800);

    // ======================================================================
    // Beat 7 — you select your own solution. [Add research] button fades in
    // directly beneath it.
    // ======================================================================

    scene.moveCursor('user', { x: 620, y: 190 }, { x: 190, y: 190 }, 14100, 850, { arc: 10 });
    scene.selectNode('userSolution', 15100, true, { color: '#5e6ad2' });
    scene.showButton('addResearch', 15200, { fade: 200 });

    // ======================================================================
    // Beat 8 — you click [Add research]. Agent travels back up to the
    // problem, re-reads, then produces a nested finding that drops *inside*
    // your card as a dashed sub-line (provisional).
    // ======================================================================

    scene.moveCursor('user', { x: 190, y: 190 }, { x: 190, y: 256 }, 15600, 600, { arc: 6 });
    scene.click('user', 'addResearch', 16200, { pressDuration: 140 });
    scene.pulse(190, 256, 16200, { radius: 22, duration: 500 });
    scene.appendActivity('Recherche angefordert', 16200);
    scene.hideButton('addResearch', 16300, { fade: 180 });
    scene.selectNode('userSolution', 16300, false);

    scene.moveCursor('agent', { x: 620, y: 178 }, { x: 456, y: 36 }, 16500, 800, { arc: 14 });
    scene.selectNode('problem', 17400, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Liest', 17500, { anchor: { x: 456, y: 60 }, duration: 1600 });

    scene.selectNode('problem', 19200, false);
    scene.moveCursor('agent', { x: 456, y: 36 }, { x: 190, y: 186 }, 19200, 700, { arc: -10 });

    // Beat 9 — finding appears inside the card, typed by the agent.
    scene.addNestedFinding(
      'userSolution',
      'Willkommensserie ↑ Bindung 22 %',
      19900,
      { typewriter: true, step: 50, fade: 280 }
    );
    scene.appendActivity('Recherche vorgeschlagen', 19900);

    // ======================================================================
    // Beat 10 — you confirm the nested finding. Dashed sub-line → solid.
    // ======================================================================

    scene.moveCursor('user', { x: 190, y: 256 }, { x: 190, y: 218 }, 21500, 600, { arc: 8 });
    scene.showApproval(22000, { anchor: { x: 190, y: 244 }, duration: 700 });
    scene.commitNested('userSolution', 22400);
    scene.appendActivity('Recherche bestätigt', 22400);

    // ======================================================================
    // Beat 11 — rest & loop.
    // ======================================================================

    return scene.build();
  }

  var compiled = buildV2SharedCanvas();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V2D = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
