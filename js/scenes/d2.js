// scenes/d2.js — "One collision, three policies"
//
// Three panels showing conflict resolution, played SEQUENTIALLY so each
// story is clear: panel-1 completes, then panel-2, then panel-3.  No
// overlapping action — the reader can follow one panel at a time.
//
//   Panel 1  Last-write-wins         t=  0 –  5800
//   Panel 2  Lock while editing      t=5600 – 11200
//   Panel 3  Merge separate fields   t=10800 – 16000
//   Hold                            t=16000 – 17000
//
// Canvas 800×450, 22 s, fadeDuration 700.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD2() {
    var scene = SceneKit.createScene(17000, { fadeDuration: 500 });

    // -- regions (panel backgrounds) --------------------------------------
    scene.region('r1', { x: 15, y: 25, w: 223, h: 380, label: 'Last-write-wins',   opacity: 0 });
    scene.region('r2', { x: 285, y: 25, w: 223, h: 380, label: 'Locked editing',   opacity: 0 });
    scene.region('r3', { x: 555, y: 25, w: 223, h: 380, label: 'Merge separate fields', opacity: 0 });

    scene.showRegion('r1', 0,    { fade: 600 });
    scene.showRegion('r2', 400,  { fade: 600 });
    scene.showRegion('r3', 800,  { fade: 600 });

    // ====================================================================
    //  PANEL 1 — Last-write-wins  (t=800–7000)
    //
    //  Two users approach one node from opposite sides. User A moves it
    //  left first. User B arrives later and moves the same item right.
    // ====================================================================

    var P1 = { nx: 78, ny: 186, nw: 110, nh: 48 };   // centre=133

    scene.createNode('n1', 800, { x: P1.nx, y: P1.ny, w: P1.nw, h: P1.nh, label: 'Item' });

    // Cursors start far apart (panel left edge 15, right edge 238)
    scene.cursor('u1a', { kind: 'human', x: 20,  y: 220, label: '', opacity: 0 });
    scene.cursor('u1b', { kind: 'human', x: 235, y: 220, label: '', opacity: 0 });

    // User A moves in from the left, grabs the item, and moves it left.
    scene.showCursor('u1a', 1200, { fade: 200, label: 'User A' });
    scene.moveCursor('u1a', { x: 20, y: 220 }, { x: 105, y: 200 }, 1200, 600, { arc: 0 });
    scene.pulse(133, 210, 2000, { radius: 22, duration: 600 });
    scene.selectNode('n1', 2100, true, { color: '#5e6ad2' });
    scene.showIntent('u1aMove', 'A moves left', 2200, {
      anchor: { x: 82, y: 150 }, duration: 1200, fade: 180,
    });
    scene.moveNode('n1', { x: P1.nx, y: P1.ny }, { x: 42, y: P1.ny }, 2400, 650, { easing: 'easeInOut' });
    scene.moveCursor('u1a', { x: 105, y: 200 }, { x: 70, y: 200 }, 2400, 650, { arc: 0 });
    scene.selectNode('n1', 3300, false);
    scene.appendActivity('User A moved item left', 3000);

    // User B arrives from the right and moves the same item right.
    scene.showCursor('u1b', 3700, { fade: 200, label: 'User B' });
    scene.moveCursor('u1b', { x: 235, y: 220 }, { x: 120, y: 200 }, 3700, 700, { arc: 0 });
    scene.pulse(97, 210, 4500, { radius: 22, duration: 600 });
    scene.selectNode('n1', 4550, true, { color: '#5e6ad2' });
    scene.showIntent('u1bMove', 'B moves right', 4650, {
      anchor: { x: 158, y: 150 }, duration: 1200, fade: 180,
    });
    scene.moveNode('n1', { x: 42, y: P1.ny }, { x: 112, y: P1.ny }, 4850, 650, { easing: 'easeInOut' });
    scene.moveCursor('u1b', { x: 120, y: 200 }, { x: 170, y: 200 }, 4850, 650, { arc: 0 });
    scene.selectNode('n1', 5600, false);
    scene.appendActivity('User B moved item right — last write wins', 5400);

    // ====================================================================
    //  PANEL 2 — Lock while editing  (t=6500–13000)
    //
    //  Niklas grabs the node first → selection ring + lock badge.
    //  You arrive and can't grab it. Niklas releases, then you grab it.
    //  Badges kept in separate visual zones to avoid overlap.
    // ====================================================================

    var P2 = { nx: 345, ny: 186, nw: 110, nh: 48 };

    scene.createNode('n2', 1000, { x: P2.nx, y: P2.ny, w: P2.nw, h: P2.nh, label: 'Item' });

    scene.cursor('u2a', { kind: 'human', x: 305, y: 220, label: '', opacity: 0 });
    scene.cursor('u2b', { kind: 'human', x: 505, y: 220, label: '', opacity: 0 });

    // Niklas grabs the node — selection ring + badge above node
    scene.showCursor('u2a', 5600, { fade: 200, label: 'Niklas' });
    scene.moveCursor('u2a', { x: 305, y: 220 }, { x: 375, y: 200 }, 5600, 550, { arc: 0 });
    scene.pulse(400, 210, 6300, { radius: 22, duration: 550 });
    scene.selectNode('n2', 6400, true, { color: '#5e6ad2' });
    scene.showIntent('lock', 'editing: locked', 6550, {
      anchor: { x: 400, y: 148 }, duration: 2700, fade: 180, id: 'lockBadge',
    });
    scene.appendActivity('Niklas locked the item', 6400);

    // You arrive — blocked.  Badge near the cursor, not near Niklas's badge.
    scene.showCursor('u2b', 7600, { fade: 200, label: 'You' });
    scene.moveCursor('u2b', { x: 505, y: 220 }, { x: 430, y: 200 }, 7600, 550, { arc: 0 });
    scene.showIntent('blocked', 'wait', 8200, {
      anchor: { x: 438, y: 178 }, duration: 1300, fade: 180, id: 'blockedBadge',
    });

    // Niklas releases
    scene.clearIntent('blockedBadge', 9400, { fade: 180 });
    scene.clearIntent('lockBadge', 9600, { fade: 180 });
    scene.selectNode('n2', 9600, false);
    scene.appendActivity('Niklas released the lock', 9600);

    // Now you grab it
    scene.pulse(400, 210, 9900, { radius: 22, duration: 550 });
    scene.selectNode('n2', 10000, true, { color: '#5e6ad2' });
    scene.showIntent('nowYou', 'your turn', 10200, {
      anchor: { x: 400, y: 148 }, duration: 1600, fade: 180, id: 'youBadge',
    });
    scene.appendActivity('You took the lock', 10000);

    // ====================================================================
    //  PANEL 3 — Merge separate fields  (t=10800–16000)
    //
    //  User A changes the title field. User B changes the status field.
    //  Both survive — different fields, no conflict.  Wide spacing
    //  keeps cursors and labels from overlapping.
    // ====================================================================

    var P3 = { nx: 612, ny: 186, nw: 110, nh: 48 };   // centre=667

    scene.createNode('n3', 1000, { x: P3.nx, y: P3.ny, w: P3.nw, h: P3.nh, label: 'Item' });

    // Stamp sits below the node, centred — separate from cursor area
    scene.stamp('s3', { x: 667, y: 250, text: 'status: draft', kind: 'human', opacity: 0 });
    scene.showStamp('s3', 1500, { fade: 200, text: 'status: draft' });

    // Cursors start far apart to keep labels separate
    scene.cursor('u3a', { kind: 'human', x: 565, y: 220, label: '', opacity: 0 });
    scene.cursor('u3b', { kind: 'human', x: 775, y: 220, label: '', opacity: 0 });

    // userA changes the title field — approaches from the left
    scene.showCursor('u3a', 10800, { fade: 200, label: 'User A' });
    scene.moveCursor('u3a', { x: 565, y: 220 }, { x: 635, y: 200 }, 10800, 550, { arc: 0 });
    scene.pulse(667, 210, 11500, { radius: 22, duration: 550 });
    scene.selectNode('n3', 11600, true, { color: '#5e6ad2' });
    scene.typewriterLabel('n3', 'Title changed', 11800, { step: 55 });
    scene.selectNode('n3', 12700, false);
    scene.appendActivity('User A changed title', 11800);

    // userB changes the status field — approaches from the right, angled down toward stamp
    scene.showCursor('u3b', 12900, { fade: 200, label: 'User B' });
    scene.moveCursor('u3b', { x: 775, y: 220 }, { x: 700, y: 240 }, 12900, 550, { arc: 0 });
    scene.pulse(667, 250, 13600, { radius: 22, duration: 550 });
    scene.setStampText('s3', 'status: reviewed', 13800, { kind: 'human' });
    scene.pulse(667, 250, 13800, { radius: 16, duration: 450 });

    // Both changes preserved — below the stamp
    scene.showIntent('merge', 'title + status both kept', 14300, {
      anchor: { x: 667, y: 328 }, duration: 1800, fade: 180,
    });
    scene.appendActivity('Both fields preserved', 14300);

    return scene.build();
  }

  var compiled = buildD2();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.D2 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
