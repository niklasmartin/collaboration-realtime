// scenes/d3.js — D3, "Document, presence, and signal".
//
// Three horizontal lanes. Boxes visible from t=0 and stay. Content
// cycles: Document — node persists after cursors leave. Presence —
// human + agent cursors appear then disconnect. Signal — two
// ephemeral events at separate positions, fully sequential, no overlap.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD3() {
    var scene = SceneKit.createScene(11200, { fadeDuration: 500 });

    // -- Lanes — fully opaque from t=0 -----------------------------------
    scene.region('docLane',      { x: 40, y: 60,  w: 720, h: 100, label: 'Dokument: gespeicherter Zustand', opacity: 1 });
    scene.region('presenceLane', { x: 40, y: 180, w: 720, h: 100, label: 'Präsenz: wer gerade hier ist', opacity: 1 });
    scene.region('signalLane',   { x: 40, y: 300, w: 720, h: 100, label: 'Signal: kurzzeitiger Hinweis', opacity: 1 });

    // -- cursors — entry points spread apart to avoid label collision ----
    scene.cursor('alex',      { kind: 'human', x: 780, y: 50,  label: '', opacity: 0 });
    scene.cursor('jordan',    { kind: 'human', x: 780, y: 110, label: '', opacity: 0 });
    scene.cursor('maya',      { kind: 'human', x: 20,  y: 220, label: '', opacity: 0 });
    scene.cursor('ragent',    { kind: 'agent', x: 780, y: 195, label: '', opacity: 0 });

    // ======================================================================
    // Lane 1 — Document
    //
    // Node appears. Alex arrives from right, selects it. Jordan arrives
    // after Alex leaves. Node stays alone — document persists.
    // ======================================================================

    scene.createNode('docNode', 600, {
      x: 310, y: 84, w: 190, h: 52,
      label: 'Bericht zur Kundenabwanderung',
      duration: 400,
    });

    // Alex enters, selects
    scene.showCursor('alex', 1000, { fade: 200, label: 'Alex' });
    scene.moveCursor('alex', { x: 780, y: 50 }, { x: 405, y: 110 }, 1000, 700, { arc: 0 });
    scene.selectNode('docNode', 1700, true, { color: '#5e6ad2' });
    scene.pulse(405, 110, 1700, { radius: 22, duration: 500 });

    // Alex leaves to the right, Jordan enters after Alex is gone
    scene.selectNode('docNode', 2500, false);
    scene.moveCursor('alex', { x: 405, y: 110 }, { x: 780, y: 30 }, 2500, 500, { arc: 0 });
    scene.hideCursor('alex', 3000, { fade: 250 });

    scene.showCursor('jordan', 3200, { fade: 200, label: 'Jordan' });
    scene.moveCursor('jordan', { x: 780, y: 110 }, { x: 405, y: 98 }, 3200, 600, { arc: 0 });
    scene.pulse(405, 98, 3800, { radius: 22, duration: 500 });

    // Jordan leaves — node stays alone
    scene.moveCursor('jordan', { x: 405, y: 98 }, { x: 780, y: 50 }, 4300, 500, { arc: 0 });
    scene.hideCursor('jordan', 4800, { fade: 250 });

    // ======================================================================
    // Lane 2 — Presence
    //
    // Maya (human) enters from the left, moves right, then disconnects.
    // Research agent enters from the right, moves left, then disconnects.
    // Both are gone by the end — presence is temporary.
    // ======================================================================

    // Maya enters from the left
    scene.showCursor('maya', 5000, { fade: 200, label: 'Maya' });
    scene.moveCursor('maya', { x: 20, y: 220 }, { x: 200, y: 230 }, 5000, 700, { arc: 0 });
    scene.pulse(200, 230, 5700, { radius: 20, duration: 500 });

    // Maya leaves, then agent enters
    scene.hideCursor('maya', 6200, { fade: 280 });

    // Research agent enters from the right
    scene.showCursor('ragent', 6400, { fade: 200, label: 'Recherche-Agent' });
    scene.moveCursor('ragent', { x: 780, y: 195 }, { x: 540, y: 215 }, 6400, 700, { arc: 0 });
    scene.pulse(540, 215, 7100, { radius: 20, duration: 500, color: '#5e6ad2' });

    scene.hideCursor('ragent', 7500, { fade: 280 });

    // ======================================================================
    // Lane 3 — Signal
    //
    // Two ephemeral events, sequential, at opposite sides of the lane:
    //   1. "Agent targeting" (left side, near x=220)
    //   2. "User is typing"  (right side, near x=580)
    // No time overlap. Both vanish — signal is ephemeral.
    // ======================================================================

    // Signal 1 — left side
    scene.pulse(220, 348, 8000, { radius: 30, duration: 1800, color: '#5e6ad2' });
    scene.showIntent('sig1', 'Agent wählt Ziel', 8000, {
      anchor: { x: 220, y: 348 },
      duration: 1800,
      fade: 280,
    });

    // Signal 2 — right side (starts after first fully fades)
    scene.pulse(580, 348, 10000, { radius: 28, duration: 1600 });
    scene.showIntent('sig2', 'Nutzer tippt', 10000, {
      anchor: { x: 580, y: 348 },
      duration: 750,
      fade: 280,
    });

    // ======================================================================
    // t=11600–15300 — settled taxonomy.
    //
    // Lane 1: node visible. Lane 2: empty. Lane 3: empty.
    // The contrast IS the argument.
    // ======================================================================

    return scene.build();
  }

  var compiled = buildD3();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.D3 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
