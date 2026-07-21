// V4 — the same changes shown simultaneously without and with context.
(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV4() {
    var scene = SceneKit.createScene(13200, { fadeDuration: 600 });

    scene.region('state-only', { x: 18, y: 34, w: 352, h: 372, label: 'OHNE SIGNALE', opacity: 1 });
    scene.region('with-context', { x: 430, y: 34, w: 352, h: 372, label: 'MIT SIGNALEN', opacity: 1 });
    scene.node('left-heading', { x: 42, y: 66, w: 304, h: 34, label: 'Zustand ändert sich, Ursache verborgen', opacity: 1 });
    scene.node('right-heading', { x: 454, y: 66, w: 304, h: 34, label: 'Zustand ändert sich, Ursache sichtbar', opacity: 1 });
    scene.node('versus', { x: 380, y: 202, w: 40, h: 40, label: 'VS', opacity: 1 });

    var layouts = {
      left: {
        problem: { x: 94, y: 116, w: 200, h: 48 },
        user: { x: 40, y: 205, w: 142, h: 48 },
        agent: { x: 206, y: 205, w: 155, h: 48 },
        evidence: { x: 206, y: 292, w: 142, h: 44 },
      },
      right: {
        problem: { x: 506, y: 116, w: 200, h: 48 },
        user: { x: 452, y: 205, w: 142, h: 48 },
        agent: { x: 612, y: 205, w: 155, h: 48 },
        evidence: { x: 618, y: 292, w: 142, h: 44 },
      },
    };

    ['left', 'right'].forEach(function (side) {
      var p = layouts[side];
      scene.node(side + '-problem', { x: p.problem.x, y: p.problem.y, w: p.problem.w, h: p.problem.h, label: 'Warum wandern Kunden ab?', opacity: 1 });
      scene.node(side + '-user', { x: p.user.x, y: p.user.y, w: p.user.w, h: p.user.h, label: 'Onboarding-E-Mails', opacity: 1 });
      scene.node(side + '-agent', { x: p.agent.x, y: p.agent.y, w: p.agent.w, h: p.agent.h, label: 'Rückgewinnungsangebot', opacity: 1 });
      scene.edge(side + '-edge-user', { from: side + '-problem', to: side + '-user', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
      scene.edge(side + '-edge-agent', { from: side + '-problem', to: side + '-agent', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    });

    // Context exists only on the right and stays deliberately compact.
    scene.cursor('you', { kind: 'human', x: 472, y: 232, label: '', opacity: 0 });
    scene.cursor('research', { kind: 'agent', x: 746, y: 350, label: '', opacity: 0 });
    scene.cursor('structure', { kind: 'agent', x: 746, y: 274, label: '', opacity: 0 });
    scene.cursor('maya', { kind: 'human', x: 770, y: 132, label: '', opacity: 0 });

    // 1. The same card moves on both sides. Only the right explains it.
    scene.showCursor('you', 1200, { label: 'Sie', fade: 180 });
    scene.moveCursor('you', { x: 472, y: 232 }, { x: 523, y: 232 }, 1200, 500, { arc: 0 });
    scene.selectNode('right-user', 1800, true, { color: '#a0a0ab' });
    scene.moveNode('left-user', { x: 40, y: 205 }, { x: 40, y: 270 }, 2200, 700, { easing: 'easeInOut' });
    scene.moveNode('right-user', { x: 452, y: 205 }, { x: 452, y: 270 }, 2200, 700, { easing: 'easeInOut' });
    scene.moveCursor('you', { x: 523, y: 232 }, { x: 523, y: 297 }, 2200, 700, { arc: 0 });
    scene.selectNode('right-user', 3500, false);
    scene.hideCursor('you', 3600, { fade: 180 });

    // 2. The same evidence appears. The right shows actor and provisionality.
    scene.showCursor('research', 4100, { label: 'Recherche-Agent', fade: 180 });
    scene.moveCursor('research', { x: 746, y: 350 }, { x: 688, y: 314 }, 4100, 600, { arc: 0 });
    scene.createNode('left-evidence', 4900, { x: 206, y: 292, w: 142, h: 44, label: 'Nachweis: 2 Studien', duration: 350 });
    scene.createNode('right-evidence', 4900, { x: 618, y: 292, w: 142, h: 44, label: 'Nachweis: 2 Studien', kind: 'provisional', duration: 350 });
    scene.hideCursor('research', 6000, { fade: 180 });

    // 3. The same connection appears. Selection and actor explain it right.
    scene.showCursor('structure', 6500, { label: 'Struktur-Agent', fade: 180 });
    scene.moveCursor('structure', { x: 746, y: 274 }, { x: 683, y: 280 }, 6500, 550, { arc: 0 });
    scene.selectNode('right-evidence', 7100, true, { color: '#5e6ad2' });
    scene.selectNode('right-agent', 7100, true, { color: '#5e6ad2' });
    scene.drawEdge('left-evidence-link', 'left-evidence', 'left-agent', 7600, 650, { fromAnchor: 'top', toAnchor: 'bottom', straight: true });
    scene.drawEdge('right-evidence-link', 'right-evidence', 'right-agent', 7600, 650, { fromAnchor: 'top', toAnchor: 'bottom', straight: true });
    scene.selectNode('right-evidence', 8800, false);
    scene.selectNode('right-agent', 8800, false);
    scene.hideCursor('structure', 9000, { fade: 180 });

    // 4. Presence explains attention without changing document state.
    scene.showCursor('maya', 9400, { label: 'Maya', fade: 180 });
    scene.moveCursor('maya', { x: 770, y: 132 }, { x: 606, y: 140 }, 9400, 650, { arc: 0 });
    scene.selectNode('right-problem', 10100, true, { color: '#a0a0ab' });

    scene.appendActivity('Links: stille Änderungen · Rechts: Akteur, Absicht und vorläufiger Zustand', 11200);
    return scene.build();
  }

  var compiled = buildV4();
  if (root) { root.scenes = root.scenes || {}; root.scenes.V4 = compiled; }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
