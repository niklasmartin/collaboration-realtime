// D4 — application-owned event reconciliation versus a maintained query.
(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD4() {
    var scene = SceneKit.createScene(10400, { fadeDuration: 500 });
    var left = { x: 20, y: 76, w: 370, h: 330 };
    var right = { x: 410, y: 76, w: 370, h: 330 };

    scene.node('source', { x: 310, y: 22, w: 180, h: 36, label: 'Entfernter Knoten ändert sich', opacity: 1 });
    scene.region('manual', { x: left.x, y: left.y, w: left.w, h: left.h, label: 'IHRE ANWENDUNG', opacity: 1 });
    scene.region('subscribed', { x: right.x, y: right.y, w: right.w, h: right.h, label: 'SYNC-SCHICHT', opacity: 1 });
    scene.node('manual-title', { x: 46, y: 102, w: 318, h: 34, label: 'Jedes eingehende Ereignis verarbeiten', opacity: 1 });
    scene.node('sync-title', { x: 436, y: 102, w: 318, h: 34, label: 'Knoten + Kanten einmal abonnieren', opacity: 1 });

    var steps = [
      { id: 'receive', y: 150, label: '1  Ereignis empfangen' },
      { id: 'inspect', y: 202, label: '2  Nutzdaten lesen' },
      { id: 'patch', y: 254, label: '3  Lokalen Cache aktualisieren' },
      { id: 'reconcile', y: 306, label: '4  Optimistischen Zustand abgleichen' },
    ];
    steps.forEach(function (s) {
      scene.node(s.id, { x: 88, y: s.y, w: 234, h: 38, label: s.label, opacity: 1 });
    });
    scene.edge('m1', { from: 'receive', to: 'inspect', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    scene.edge('m2', { from: 'inspect', to: 'patch', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    scene.edge('m3', { from: 'patch', to: 'reconcile', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    scene.node('manual-result', { x: 88, y: 358, w: 234, h: 38, label: 'UI ist schließlich aktuell', opacity: 1 });

    scene.node('query', { x: 468, y: 174, w: 254, h: 54, label: 'Live-Abfrage', sublabel: 'nodes {}, edges {}', opacity: 1 });
    scene.node('view', { x: 468, y: 300, w: 254, h: 54, label: 'UI liest aktuelles Ergebnis', opacity: 1 });
    scene.edge('query-view', { from: 'query', to: 'view', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });

    // The same change enters both models.
    scene.createNode('left-event', 1000, { x: 182, y: 36, w: 78, h: 28, label: 'Änderung', kind: 'provisional', duration: 160 });
    scene.moveNode('left-event', { x: 182, y: 36 }, { x: 166, y: 154 }, 1160, 850, { easing: 'easeInOut' });
    scene.removeNode('left-event', 2050, { duration: 140 });

    scene.createNode('right-event', 1000, { x: 540, y: 36, w: 78, h: 28, label: 'Änderung', kind: 'provisional', duration: 160 });
    scene.moveNode('right-event', { x: 540, y: 36 }, { x: 556, y: 184 }, 1160, 850, { easing: 'easeInOut' });
    scene.removeNode('right-event', 2050, { duration: 140 });

    // Manual path walks through four application-owned steps.
    [
      { y: 150, at: 1800 }, { y: 202, at: 2900 },
      { y: 254, at: 4000 }, { y: 306, at: 5100 },
    ].forEach(function (p, index) {
      scene.pulse(205, p.y + 19, p.at, { radius: 23, duration: 700 });
    });
    scene.pulse(205, 377, 6200, { radius: 26, duration: 700 });
    scene.showIntent(null, 'aktuell, nachdem Anwendungscode lief', 6500, { anchor: { x: 205, y: 430 }, duration: 1800 });

    // The sync layer maintains the result as one continuous contract.
    scene.pulse(595, 201, 1900, { radius: 30, duration: 750, color: '#5e6ad2' });
    scene.createNode('fresh-result', 2800, { x: 554, y: 248, w: 82, h: 30, label: 'neues Ergebnis', kind: 'provisional', duration: 180 });
    scene.moveNode('fresh-result', { x: 554, y: 248 }, { x: 554, y: 307 }, 2980, 650, { easing: 'easeInOut' });
    scene.removeNode('fresh-result', 3900, { duration: 160 });
    scene.pulse(595, 327, 3700, { radius: 30, duration: 750, color: '#5e6ad2' });
    scene.showIntent(null, 'automatisch aktuell', 4100, { anchor: { x: 595, y: 390 }, duration: 2300 });

    scene.appendActivity('Gleiche entfernte Änderung · links: Anwendung gleicht ab · rechts: Abonnement bleibt aktuell', 7200);
    return scene.build();
  }

  var compiled = buildD4();
  if (root) { root.scenes = root.scenes || {}; root.scenes.D4 = compiled; }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
