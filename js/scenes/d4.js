// scenes/d4.js — D4, "Event handlers versus subscribed results".
//
// Two side-by-side panels with visible borders and headings.
// Structural elements visible from t=0.  Only the data-changed
// sequence animates and loops.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD4() {
    var scene = SceneKit.createScene(8800, { fadeDuration: 500 });

    // -- Layout ------------------------------------------------------------
    var LP = { x: 20,  y: 80, w: 370, h: 310 };
    var RP = { x: 410, y: 80, w: 370, h: 310 };
    var LC = LP.x + LP.w / 2;  // 205
    var RC = RP.x + RP.w / 2;  // 595

    // -- Heading labels above each box (static) ---------------------------
    scene.node('leftHeading',  { x: LP.x, y: 42, w: LP.w, h: 26, label: 'Event handlers', opacity: 1 });
    scene.node('rightHeading', { x: RP.x, y: 42, w: RP.w, h: 26, label: 'Subscribed result',  opacity: 1 });

    // -- Regions — visible boxes from t=0, solid borders -------------------
    scene.region('leftPanel',  { x: LP.x, y: LP.y, w: LP.w, h: LP.h, opacity: 0.5,  label: '' });
    scene.region('rightPanel', { x: RP.x, y: RP.y, w: RP.w, h: RP.h, opacity: 0.5,  label: '' });

    // -- Left panel: event-handler chain (static, visible from t=0) -------
    var NW = 160, NH = 44;
    var ex = LC - NW / 2;  // 125
    var L1y = 98, L2y = 168, L3y = 238, L4y = 308;

    scene.node('ev-rx',   { x: ex, y: L1y, w: NW, h: NH, label: 'Event arrives',    sublabel: '"node.moved"', opacity: 1 });
    scene.node('ev-insp', { x: ex, y: L2y, w: NW, h: NH, label: 'Read payload',                         opacity: 1 });
    scene.node('ev-upd',  { x: ex, y: L3y, w: NW, h: NH, label: 'Patch cache',                          opacity: 1 });
    scene.node('ev-rec',  { x: ex, y: L4y, w: NW, h: NH, label: 'Fix conflicts',                        opacity: 1 });

    scene.edge('e-rx-insp',  { from: 'ev-rx',  to: 'ev-insp', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    scene.edge('e-insp-upd', { from: 'ev-insp', to: 'ev-upd',  fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });
    scene.edge('e-upd-rec',  { from: 'ev-upd',  to: 'ev-rec',  fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });

    // -- Right panel: subscribed-result model (static, visible from t=0) --
    var QNW = 170, QNH = 44;
    var SNW = 130, SNH = 38;
    var qx = RC - QNW / 2;  // 510
    var sx = RC - SNW / 2;  // 530

    scene.node('qu-sub', { x: qx, y: 110, w: QNW, h: QNH, label: 'Ask for data', sublabel: 'nodes, edges', opacity: 1 });
    scene.node('qu-db',  { x: sx, y: 190, w: SNW, h: SNH, label: 'Store',                          opacity: 1 });

    scene.edge('e-sub-db', { from: 'qu-sub', to: 'qu-db', fromAnchor: 'bottom', toAnchor: 'top', progress: 1, straight: true });

    // ====================================================================
    // Actions — animate and loop
    // ====================================================================

    // ---- Data changed (2000 ms) -----------------------------------------
    scene.appendActivity('A node changes', 1200);
    scene.pulse(400, 65, 1200, { radius: 28, duration: 800 });

    // ---- Left: sequential handler chain pulses (2000–4200 ms) -----------
    scene.pulse(LC, L1y + NH / 2, 1200, { radius: 24, duration: 650 });
    scene.pulse(LC, L2y + NH / 2, 1800, { radius: 24, duration: 650 });
    scene.pulse(LC, L3y + NH / 2, 2400, { radius: 24, duration: 650 });
    scene.pulse(LC, L4y + NH / 2, 3000, { radius: 24, duration: 650 });

    // ---- Right: subscription re-evaluates (2000–3000 ms) ----------------
    scene.pulse(RC, 110 + QNH / 2, 1200, { radius: 24, duration: 650 });
    scene.pulse(RC, 190 + SNH / 2, 1800, { radius: 24, duration: 650 });

    // ---- Live result card appears (3400 ms) ------------------------------
    scene.createNode('qu-res', 2500, {
      x: qx, y: 275, w: QNW, h: QNH,
      label: 'Updated result',
      duration: 350,
    });
    scene.drawEdge('e-db-res', 'qu-db', 'qu-res', 2500, 450, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });

    // ---- Pending → synced (4200–6500 ms) --------------------------------
    var syncAnchor = { x: RC, y: 372 };
    scene.showIntent(null, 'syncing...', 3300, {
      id: 'pending', anchor: syncAnchor, fade: 180, duration: 900,
    });
    scene.clearIntent('pending', 4200, { fade: 180 });
    scene.showIntent(null, 'current', 4400, {
      id: 'synced', anchor: syncAnchor, fade: 180, duration: 900,
    });
    scene.clearIntent('synced', 5500, { fade: 180 });

    // ---- Activity annotations (5000 ms) ----------------------------------
    scene.appendActivity('Event side: code handles every step', 5600);
    scene.appendActivity('Query side: subscribed data becomes current', 6200);

    // ====================================================================
    // Short hold — side-by-side comparison, then reset.
    // ====================================================================

    return scene.build();
  }

  var compiled = buildD4();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.D4 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
