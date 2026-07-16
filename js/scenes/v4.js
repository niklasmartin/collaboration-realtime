// scenes/v4.js — V4, "From Haunted Canvas to Shared Workspace" (animations.md).
//
// Anchor scene. Two-phase sequence on one canvas. Phase 1 runs the same
// four actions without any collaboration cues — no cursors, no names, no
// intents, no attribution. Technically correct, socially illegible.
// Phase 2 repeats the same resulting state with full context: cursors, labels,
// intent badges, selection rings, provisional state, activity log, and an
// undo indicator. Same state, different understanding.
//
// Visual vocabulary matches V2D/V3: dark canvas, boxed cursor tags, same
// node dimensions and layout conventions.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV4() {
    var scene = SceneKit.createScene(17800, { fadeDuration: 600 });

    // -- layout -----------------------------------------------------------
    //
    // Problem at top-center, user solution left, agent solution right.
    // Each column has a supporting node beneath it, so every edge is a
    // short vertical drop within its own column instead of a cross-canvas
    // diagonal: research finding sits under the user's solution, and
    // evidence (created mid-scene) sits under the agent's solution — it's
    // what the agent is using to justify Win-back offer.
    var PROBLEM    = { x: 290, y: 30,  w: 240, h: 52 };   // c = 410
    var USER_SOL   = { x: 60,  y: 145, w: 260, h: 60 };   // c = 190
    var AGENT_SOL  = { x: 490, y: 145, w: 260, h: 60 };   // c = 620
    var RESEARCH_F = { x: 110, y: 225, w: 170, h: 40 };   // under user sol
    var EVIDENCE   = { x: 515, y: 225, w: 210, h: 46 };   // under agent sol, created mid-scene

    // -- all participants registered up front, invisible until their phase

    scene.cursor('you',             { kind: 'human', x: 160, y: 230, label: '', opacity: 0 });
    scene.cursor('researchAgent',   { kind: 'agent', x: 550, y: 8,   label: '', opacity: 0 });
    scene.cursor('structureAgent',  { kind: 'agent', x: 550, y: 430, label: '', opacity: 0 });
    scene.cursor('maya',            { kind: 'human', x: 750, y: 110, label: '', opacity: 0 });

    // ======================================================================
    // Phase 1 — Haunted canvas (0–4800ms).
    //
    // Same resulting state as Phase 2, but with no cursors, no names, no
    // intents, no selection rings, and no activity log. The canvas is
    // technically correct — perfectly synchronized — and still feels wrong.
    // ======================================================================

    // Starter nodes: all visible from the beginning.
    scene.createNode('problem', 0, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Why are customers churning?',
      duration: 300,
    });
    scene.createNode('userSolution', 0, {
      x: USER_SOL.x, y: USER_SOL.y, w: USER_SOL.w, h: USER_SOL.h,
      label: 'Onboarding emails',
      duration: 300,
    });
    scene.createNode('agentSolution', 0, {
      x: AGENT_SOL.x, y: AGENT_SOL.y, w: AGENT_SOL.w, h: AGENT_SOL.h,
      label: 'Win-back offer',
      duration: 300,
    });
    scene.createNode('researchFinding', 0, {
      x: RESEARCH_F.x, y: RESEARCH_F.y, w: RESEARCH_F.w, h: RESEARCH_F.h,
      label: 'Welcome series',
      kind: 'standard',
      duration: 300,
    });
    scene.drawEdge('e-problem-user', 'problem', 'userSolution', 300, 400, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });
    scene.drawEdge('e-problem-agent', 'problem', 'agentSolution', 300, 400, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });
    // Research finding was floating, unconnected to anything it supports —
    // tie it to the user's solution so its presence reads as "why", not noise.
    scene.drawEdge('e-user-research', 'userSolution', 'researchFinding', 300, 400, {
      fromAnchor: 'bottom', toAnchor: 'top', straight: true,
    });

    // Phase indicator — clear pass heading.
    scene.showIntent('phase-label', 'Pass 1: state only', 600, {
      anchor: { x: 400, y: 18 },
      duration: 4700, fade: 220,
      id: 'phaseBadge',
    });

    // t=1000: userSolution slides left — silently, no cursor, no owner.
    scene.moveNode('userSolution',
      { x: USER_SOL.x, y: USER_SOL.y },
      { x: 20, y: USER_SOL.y },
      1200, 650, { easing: 'easeInOut' }
    );

    // t=2000: evidence node appears — no cursor, no attribution, no reason.
    scene.createNode('evidence', 2600, {
      x: EVIDENCE.x, y: EVIDENCE.y, w: EVIDENCE.w, h: EVIDENCE.h,
      label: 'Evidence: 2 studies',
      kind: 'standard',
      duration: 450,
    });

    // t=2800: edge draws from evidence to agentSolution — unexplained.
    scene.drawEdge('e-evidence-agent', 'evidence', 'agentSolution', 3900, 650, {
      fromAnchor: 'top', toAnchor: 'bottom', straight: true,
    });

    // t=4600–5800: hold the haunted state. All changes visible. No
    // explanation for any of them.

    // ======================================================================
    // Transition — Reset to starting state (5800–7200ms).
    // ======================================================================

    scene.clearIntent('phaseBadge', 5800, { fade: 200 });

    scene.removeNode('evidence', 5900, { duration: 300 });
    scene.hideEdge('e-evidence-agent', 5900, { duration: 300 });
    scene.moveNode('userSolution',
      { x: 20, y: USER_SOL.y },
      { x: USER_SOL.x, y: USER_SOL.y },
      6100, 550, { easing: 'easeInOut' }
    );

    // t=6800: new phase label — the canvas is about to become legible.
    scene.showIntent('phase-label-p2', 'Pass 2: state + context', 6800, {
      anchor: { x: 400, y: 18 },
      duration: 10100, fade: 220,
      id: 'phaseBadge2',
    });

    // ======================================================================
    // Phase 2 — Shared workspace (7200–16600ms).
    //
    // Same four actions, same final state, but with full collaboration UI.
    // Every change has an actor, an intent, and a trace.
    // ======================================================================

    // -- Action 1: You moves Onboarding emails left. -----------------------

    scene.showCursor('you', 7300, { fade: 200, label: 'You' });
    scene.moveCursor('you', { x: 160, y: 230 }, { x: 190, y: 175 }, 7300, 650, { arc: 8 });
    scene.selectNode('userSolution', 8150, true, { color: '#a0a0ab' });
    scene.showIntent('you-acting', 'You: move card left', 8300, {
      anchor: { x: 150, y: 122 },
      duration: 1400,
      fade: 200,
    });
    scene.moveNode('userSolution',
      { x: USER_SOL.x, y: USER_SOL.y },
      { x: 20, y: USER_SOL.y },
      8700, 650, { easing: 'easeInOut' }
    );
    scene.appendActivity('You moved Onboarding emails', 9300);
    scene.selectNode('userSolution', 9600, false);

    // -- Action 2: Research agent creates evidence node. -------------------

    scene.showCursor('researchAgent', 9900, { fade: 200, label: 'Research agent' });
    scene.moveCursor('researchAgent', { x: 550, y: 8 }, { x: 620, y: 248 }, 9900, 850, { arc: -12 });
    scene.showIntent('ra-intent', 'Research agent: add evidence', 10800, {
      anchor: { x: 620, y: 315 },
      duration: 1600,
      fade: 200,
    });
    scene.pulse(620, 248, 11300, { radius: 24, duration: 700, color: '#5e6ad2' });
    scene.createNode('evidence-p2', 11600, {
      x: EVIDENCE.x, y: EVIDENCE.y, w: EVIDENCE.w, h: EVIDENCE.h,
      label: 'Evidence: 2 studies',
      kind: 'provisional',
      duration: 450,
    });
    scene.commitProvisional('evidence-p2', 12100);
    scene.appendActivity('Research agent added evidence', 12200);

    // -- Action 3: Structure agent connects evidence to Win-back offer. ----

    scene.showCursor('structureAgent', 12700, { fade: 200, label: 'Structure agent' });
    scene.moveCursor('structureAgent', { x: 550, y: 430 }, { x: 620, y: 248 }, 12700, 850, { arc: 16 });
    scene.selectNode('evidence-p2', 13600, true, { color: '#5e6ad2' });
    scene.selectNode('agentSolution', 13800, true, { color: '#5e6ad2' });
    scene.showIntent('sa-intent', 'Structure agent: draw link', 13900, {
      anchor: { x: 620, y: 315 },
      duration: 1700,
      fade: 200,
    });
    scene.drawEdge('e-evidence-agent-p2', 'evidence-p2', 'agentSolution', 14500, 650, {
      fromAnchor: 'top', toAnchor: 'bottom', straight: true,
    });
    scene.selectNode('evidence-p2', 15300, false);
    scene.selectNode('agentSolution', 15300, false);
    scene.appendActivity('Structure agent connected evidence', 15400);

    // -- Action 4: Maya arrives as visible presence, without changing text. -

    scene.showCursor('maya', 15600, { fade: 200, label: 'Maya' });
    scene.moveCursor('maya', { x: 750, y: 110 }, { x: 410, y: 56 }, 15600, 850, { arc: -18 });
    scene.selectNode('problem', 16600, true, { color: '#a0a0ab' });
    scene.showIntent('maya-intent', 'Maya: reading question', 16700, {
      anchor: { x: 410, y: 95 },
      duration: 800,
      fade: 180,
    });
    scene.appendActivity('Maya is reading the question', 16800);

    // Undo indicator — reversibility communicated by presence alone.
    scene.showIntent('undo-hint', 'Undo available', 16900, {
      anchor: { x: 60, y: 420 },
      duration: 600, fade: 180,
    });

    // ======================================================================
    // Phase 2 hold + reset (16900–17800ms).
    // Full context visible: cursors, labels, rings, intents, activity log.
    // Then fadeDuration handles the gentle loop reset.
    // ======================================================================

    scene.hideCursor('you', 17400, { fade: 200 });
    scene.hideCursor('researchAgent', 17400, { fade: 200 });
    scene.hideCursor('structureAgent', 17400, { fade: 200 });
    scene.hideCursor('maya', 17400, { fade: 200 });
    scene.selectNode('problem', 17400, false);
    scene.clearIntent('phaseBadge2', 17400, { fade: 200 });

    scene.moveNode('userSolution',
      { x: 20, y: USER_SOL.y },
      { x: USER_SOL.x, y: USER_SOL.y },
      17400, 400, { easing: 'easeInOut' }
    );

    return scene.build();
  }

  var compiled = buildV4();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V4 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
