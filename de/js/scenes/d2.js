// D2 — one overlapping edit, three visibly different policies.
(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD2() {
    var scene = SceneKit.createScene(18400, { fadeDuration: 500 });

    scene.region('r1', { x: 15, y: 28, w: 238, h: 374, label: '1  SPÄTERER WERT GEWINNT', opacity: 1 });
    scene.region('r2', { x: 281, y: 28, w: 238, h: 374, label: '2  TEMPORÄRE SPERRE', opacity: 1 });
    scene.region('r3', { x: 547, y: 28, w: 238, h: 374, label: '3  GETRENNTE FELDER ZUSAMMENFÜHREN', opacity: 1 });

    // Panel 1: two destinations, with the later move replacing the first.
    scene.node('lww-item', { x: 78, y: 184, w: 112, h: 52, label: 'Element', opacity: 1 });
    scene.node('lww-left', { x: 35, y: 304, w: 82, h: 32, label: 'Position A', kind: 'ghost', opacity: 1 });
    scene.node('lww-right', { x: 151, y: 304, w: 82, h: 32, label: 'Position B', kind: 'ghost', opacity: 1 });
    scene.cursor('lww-a', { kind: 'human', x: 30, y: 215, label: '', opacity: 0 });
    scene.cursor('lww-b', { kind: 'human', x: 238, y: 215, label: '', opacity: 0 });

    scene.showCursor('lww-a', 900, { label: 'Nutzer A', fade: 160 });
    scene.moveCursor('lww-a', { x: 30, y: 215 }, { x: 118, y: 205 }, 900, 600, { arc: 0 });
    scene.selectNode('lww-item', 1500, true, { color: '#a0a0ab' });
    scene.moveNode('lww-item', { x: 78, y: 184 }, { x: 35, y: 184 }, 1750, 700, { easing: 'easeInOut' });
    scene.moveCursor('lww-a', { x: 118, y: 205 }, { x: 72, y: 205 }, 1750, 700, { arc: 0 });
    scene.showIntent(null, 'A gespeichert', 2500, { anchor: { x: 76, y: 372 }, duration: 1100 });

    scene.showCursor('lww-b', 3000, { label: 'Nutzer B', fade: 160 });
    scene.moveCursor('lww-b', { x: 238, y: 215 }, { x: 72, y: 205 }, 3000, 650, { arc: 0 });
    scene.moveNode('lww-item', { x: 35, y: 184 }, { x: 110, y: 184 }, 3800, 700, { easing: 'easeInOut' });
    scene.moveCursor('lww-b', { x: 72, y: 205 }, { x: 150, y: 205 }, 3800, 700, { arc: 0 });
    scene.showIntent(null, 'B später gespeichert -> final', 4700, { anchor: { x: 134, y: 372 }, duration: 1500 });
    scene.selectNode('lww-item', 5000, false);
    scene.hideCursor('lww-a', 5200, { fade: 180 });
    scene.hideCursor('lww-b', 5200, { fade: 180 });
    scene.appendActivity('Späterer Wert gewinnt: B ersetzt die Position von A', 4700);

    // Panel 2: a visible lease counts down, releases, then transfers.
    scene.node('lock-item', { x: 344, y: 184, w: 112, h: 52, label: 'Workflow', opacity: 1 });
    scene.stamp('lock-state', { x: 400, y: 286, text: 'ENTSPERRT', kind: 'human', opacity: 1 });
    scene.cursor('lock-a', { kind: 'human', x: 300, y: 215, label: '', opacity: 0 });
    scene.cursor('lock-b', { kind: 'human', x: 500, y: 215, label: '', opacity: 0 });

    scene.showCursor('lock-a', 6100, { label: 'Niklas', fade: 160 });
    scene.moveCursor('lock-a', { x: 300, y: 215 }, { x: 374, y: 205 }, 6100, 550, { arc: 0 });
    scene.selectNode('lock-item', 6750, true, { color: '#5e6ad2' });
    scene.setStampText('lock-state', 'GESPERRT von Niklas · 3 s', 6800, { kind: 'agent' });

    scene.showCursor('lock-b', 7200, { label: 'Sie', fade: 160 });
    scene.moveCursor('lock-b', { x: 500, y: 215 }, { x: 432, y: 205 }, 7200, 550, { arc: 0 });
    scene.showIntent(null, 'gesperrt — bitte warten', 7850, { anchor: { x: 448, y: 170 }, duration: 2100 });
    scene.setStampText('lock-state', 'GESPERRT von Niklas · 2 s', 8000, { kind: 'agent' });
    scene.setStampText('lock-state', 'GESPERRT von Niklas · 1 s', 9000, { kind: 'agent' });
    scene.setStampText('lock-state', 'ENTSPERRT', 10000, { kind: 'human' });
    scene.selectNode('lock-item', 10000, false);
    scene.hideCursor('lock-a', 10000, { fade: 180 });
    scene.showIntent(null, 'Sperre aufgehoben', 10050, { anchor: { x: 400, y: 330 }, duration: 900 });

    scene.moveCursor('lock-b', { x: 432, y: 205 }, { x: 392, y: 205 }, 10900, 450, { arc: 0 });
    scene.selectNode('lock-item', 11400, true, { color: '#a0a0ab' });
    scene.setStampText('lock-state', 'VON IHNEN GESPERRT · 3 s', 11400, { kind: 'human' });
    scene.showIntent(null, 'Ihre Bearbeitung kann beginnen', 11600, { anchor: { x: 400, y: 350 }, duration: 1500 });
    scene.appendActivity('Temporäre Sperre: Niklas gibt sie frei, dann übernehmen Sie', 11400);

    // Panel 3: the object exposes two distinct properties and each actor
    // lands directly on the property they change.
    scene.node('field-title', { x: 580, y: 158, w: 172, h: 56, label: 'Titel: Onboarding-E-Mails', opacity: 1 });
    scene.node('field-status', { x: 580, y: 246, w: 172, h: 56, label: 'Status: Entwurf', opacity: 1 });
    scene.cursor('field-a', { kind: 'human', x: 560, y: 112, label: '', opacity: 0 });
    scene.cursor('field-b', { kind: 'human', x: 774, y: 350, label: '', opacity: 0 });

    scene.showCursor('field-a', 12600, { label: 'Nutzer A', fade: 160 });
    scene.moveCursor('field-a', { x: 560, y: 112 }, { x: 666, y: 186 }, 12600, 650, { arc: 0 });
    scene.selectNode('field-title', 13300, true, { color: '#a0a0ab' });
    scene.setLabel('field-title', 'Titel: Willkommensserie', 13700);
    scene.showIntent(null, 'Titel gespeichert', 13900, { anchor: { x: 666, y: 236 }, duration: 1000 });
    scene.selectNode('field-title', 14200, false);

    scene.showCursor('field-b', 14200, { label: 'Nutzer B', fade: 160 });
    scene.moveCursor('field-b', { x: 774, y: 350 }, { x: 666, y: 274 }, 14200, 650, { arc: 0 });
    scene.selectNode('field-status', 14900, true, { color: '#a0a0ab' });
    scene.setLabel('field-status', 'Status: Geprüft', 15300);
    scene.showIntent(null, 'Status gespeichert', 15500, { anchor: { x: 666, y: 330 }, duration: 900 });
    scene.selectNode('field-status', 15800, false);
    scene.showIntent(null, 'BEIDE FELDER BEIBEHALTEN', 16400, { anchor: { x: 666, y: 378 }, duration: 1500 });
    scene.appendActivity('Getrennte Felder: Titel von A und Status von B bleiben erhalten', 16400);

    return scene.build();
  }

  var compiled = buildD2();
  if (root) { root.scenes = root.scenes || {}; root.scenes.D2 = compiled; }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
