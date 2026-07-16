// scenes/d1.js — D1, "Three ways updates reach the browser" (animations.md).
//
// Three side-by-side panels comparing polling, SSE, and WebSockets.
// The structural elements (regions, nodes, edges, labels) are static —
// they appear immediately and stay.  Only the data-flow actions
// (pulses, intents, events) animate and loop.

(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildD1() {
    var scene = SceneKit.createScene(8600, { fadeDuration: 500 });

    // -- Panel layout -----------------------------------------------------
    // Panel 1 (Polling)   : x=20..260   c=140
    // Panel 2 (SSE)       : x=280..520  c=400
    // Panel 3 (WebSockets): x=540..780  c=660

    var B1 = { x: 38,  y: 140, w: 62, h: 30 };
    var S1 = { x: 190, y: 140, w: 50, h: 30 };
    var B2 = { x: 298, y: 140, w: 62, h: 30 };
    var S2 = { x: 450, y: 140, w: 50, h: 30 };
    var B3 = { x: 558, y: 140, w: 62, h: 30 };
    var S3 = { x: 710, y: 140, w: 50, h: 30 };

    // -- Regions — visible from t=0, stay through the loop ----------------
    scene.region('r_pol', { x: 20,  y: 60, w: 240, h: 320, label: 'Polling',    opacity: 1 });
    scene.region('r_sse', { x: 280, y: 60, w: 240, h: 320, label: 'SSE',        opacity: 1 });
    scene.region('r_ws',  { x: 540, y: 60, w: 240, h: 320, label: 'WebSockets', opacity: 1 });

    // -- Browser & Server nodes — static, visible from t=0 -----------------
    scene.node('pol_browser', { x: B1.x, y: B1.y, w: B1.w, h: B1.h, label: 'Browser', opacity: 1 });
    scene.node('pol_server',  { x: S1.x, y: S1.y, w: S1.w, h: S1.h, label: 'Server',  opacity: 1 });
    scene.node('sse_browser', { x: B2.x, y: B2.y, w: B2.w, h: B2.h, label: 'Browser', opacity: 1 });
    scene.node('sse_server',  { x: S2.x, y: S2.y, w: S2.w, h: S2.h, label: 'Server',  opacity: 1 });
    scene.node('ws_browser',  { x: B3.x, y: B3.y, w: B3.w, h: B3.h, label: 'Browser', opacity: 1 });
    scene.node('ws_server',   { x: S3.x, y: S3.y, w: S3.w, h: S3.h, label: 'Server',  opacity: 1 });

    // -- Edges — straight lines, fully drawn from t=0 ---------------------
    scene.edge('e_pol', { from: 'pol_browser', to: 'pol_server', fromAnchor: 'right', toAnchor: 'left',  progress: 1, straight: true });
    scene.edge('e_sse', { from: 'sse_server',  to: 'sse_browser', fromAnchor: 'left',  toAnchor: 'right', progress: 1, straight: true });
    scene.edge('e_ws',  { from: 'ws_browser',  to: 'ws_server',  fromAnchor: 'right', toAnchor: 'left',  progress: 1, straight: true });

    // -- Static direction labels. Keep all explanatory text out of the
    // moving path so the animation stays legible.
    scene.node('pol_req',      { x: 88,  y: 100, w: 104, h: 24, label: 'request ->', opacity: 1 });
    scene.node('pol_resp',     { x: 88,  y: 195, w: 104, h: 24, label: '<- response', opacity: 1 });
    scene.node('pol_interval', { x: 82,  y: 315, w: 116, h: 24, label: 'repeat later', opacity: 1 });

    scene.node('sse_flow',     { x: 342, y: 115, w: 116, h: 24, label: '<- events', opacity: 1 });
    scene.node('sse_label',    { x: 335, y: 315, w: 130, h: 24, label: 'one-way stream', opacity: 1 });

    scene.node('ws_send',      { x: 608, y: 100, w: 104, h: 24, label: 'send ->', opacity: 1 });
    scene.node('ws_recv',      { x: 608, y: 195, w: 104, h: 24, label: '<- push', opacity: 1 });
    scene.node('ws_label',     { x: 595, y: 315, w: 130, h: 24, label: 'two-way channel', opacity: 1 });

    // ====================================================================
    // Actions — these animate and loop
    // ====================================================================

    // ---- Polling: 3 request/response cycles ----
    //
    // "GET /api" above the edge at y=115.
    // Responses below at y=198.

    // Cycle 1: browser asks, server answers.
    scene.pulse(100, 155, 900, { radius: 22, duration: 600 });
    scene.pulse(190, 155, 1500, { radius: 18, duration: 500 });
    scene.showIntent(null, 'same', 1650, { anchor: { x: 140, y: 248 }, duration: 900, fade: 140 });

    // Cycle 2
    scene.pulse(100, 155, 3000, { radius: 22, duration: 600 });
    scene.pulse(190, 155, 3600, { radius: 18, duration: 500 });
    scene.showIntent(null, 'same', 3750, { anchor: { x: 140, y: 248 }, duration: 900, fade: 140 });

    // Cycle 3 — updated
    scene.pulse(100, 155, 5200, { radius: 22, duration: 600 });
    scene.pulse(190, 155, 5800, { radius: 18, duration: 500 });
    scene.showIntent(null, 'new data', 5950, { anchor: { x: 140, y: 248 }, duration: 1000, fade: 140 });

    // ---- SSE: streaming fragments ----
    //
    // Text chunks below the edge, stacking downward.

    scene.pulse(S2.x, 155, 1300, { radius: 20, duration: 650 });
    scene.pulse(S2.x, 155, 2600, { radius: 20, duration: 650 });
    scene.pulse(S2.x, 155, 3900, { radius: 20, duration: 650 });
    scene.pulse(S2.x, 155, 5200, { radius: 20, duration: 650 });
    scene.showIntent(null, 'open stream', 6500, { anchor: { x: 400, y: 248 }, duration: 900, fade: 140 });

    // ---- WebSockets: bidirectional events ----
    //
    // send() above the edge at y=115, recv() below at y=198.

    // Round 1
    scene.pulse(B3.x + B3.w, 155, 1800, { radius: 24, duration: 650 });

    scene.pulse(S3.x, 155, 3000, { radius: 24, duration: 650 });
    scene.showIntent(null, 'live', 3200, { anchor: { x: 660, y: 248 }, duration: 900, fade: 140 });

    // Round 2
    scene.pulse(B3.x + B3.w, 155, 5000, { radius: 24, duration: 650 });

    scene.pulse(S3.x, 155, 6200, { radius: 24, duration: 650 });
    scene.showIntent(null, 'live', 6400, { anchor: { x: 660, y: 248 }, duration: 900, fade: 140 });

    // ====================================================================
    // Short hold only — enough to read the comparison before reset.
    // ====================================================================
    scene.appendActivity('Polling repeats requests; SSE streams down; WebSockets send both ways', 7300);

    return scene.build();
  }

  var compiled = buildD1();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.D1 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
