// D1 — three transport patterns shown as moving messages.
(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function packet(scene, id, label, from, to, at, duration, options) {
    options = options || {};
    scene.createNode(id, at, {
      x: from.x, y: from.y, w: options.w || 72, h: 28,
      label: label, kind: options.kind || 'provisional', duration: 160,
    });
    scene.moveNode(id, from, to, at + 160, duration, { easing: 'easeInOut' });
    scene.removeNode(id, at + duration + 360, { duration: 160 });
  }

  function buildD1() {
    var scene = SceneKit.createScene(11200, { fadeDuration: 500 });

    var panels = [
      { id: 'poll', x: 18, label: 'POLLING', note: 'Browser asks on a timer' },
      { id: 'sse', x: 278, label: 'SSE', note: 'Server pushes down one stream' },
      { id: 'ws', x: 538, label: 'WEBSOCKETS', note: 'Either side can send now' },
    ];

    panels.forEach(function (p) {
      scene.region('r-' + p.id, { x: p.x, y: 40, w: 244, h: 360, label: p.label, opacity: 1 });
      scene.node('note-' + p.id, { x: p.x + 14, y: 68, w: 216, h: 30, label: p.note, opacity: 1 });
      scene.node('browser-' + p.id, { x: p.x + 18, y: 184, w: 76, h: 42, label: 'Browser', opacity: 1 });
      scene.node('server-' + p.id, { x: p.x + 150, y: 184, w: 76, h: 42, label: 'Server', opacity: 1 });
    });

    scene.edge('rail-poll', { from: 'browser-poll', to: 'server-poll', fromAnchor: 'right', toAnchor: 'left', progress: 1, straight: true });
    scene.edge('rail-sse', { from: 'server-sse', to: 'browser-sse', fromAnchor: 'left', toAnchor: 'right', progress: 1, straight: true });
    scene.edge('rail-ws', { from: 'browser-ws', to: 'server-ws', fromAnchor: 'right', toAnchor: 'left', progress: 1, straight: true });

    scene.node('poll-clock', { x: 82, y: 305, w: 116, h: 32, label: 'every 3 seconds', opacity: 1 });
    scene.node('sse-open', { x: 320, y: 305, w: 160, h: 32, label: 'connection stays open', opacity: 1 });
    scene.node('ws-open', { x: 580, y: 305, w: 160, h: 32, label: 'connection stays open', opacity: 1 });

    // Polling: two empty round trips before the update is discovered.
    packet(scene, 'poll-get-1', 'GET', { x: 102, y: 138 }, { x: 164, y: 138 }, 900, 650);
    packet(scene, 'poll-empty-1', 'no change', { x: 164, y: 238 }, { x: 92, y: 238 }, 1900, 650, { w: 84, kind: 'standard' });
    packet(scene, 'poll-get-2', 'GET', { x: 102, y: 138 }, { x: 164, y: 138 }, 4100, 650);
    packet(scene, 'poll-empty-2', 'no change', { x: 164, y: 238 }, { x: 92, y: 238 }, 5100, 650, { w: 84, kind: 'standard' });
    packet(scene, 'poll-get-3', 'GET', { x: 102, y: 138 }, { x: 164, y: 138 }, 7300, 650);
    packet(scene, 'poll-data', 'update', { x: 164, y: 238 }, { x: 92, y: 238 }, 8300, 650, { kind: 'provisional' });
    scene.showIntent(null, 'found on next poll', 9100, { anchor: { x: 140, y: 286 }, duration: 1300 });

    // SSE: updates only travel from server to browser.
    packet(scene, 'sse-data-1', 'event 1', { x: 424, y: 150 }, { x: 352, y: 150 }, 1500, 800, { kind: 'provisional' });
    packet(scene, 'sse-data-2', 'event 2', { x: 424, y: 238 }, { x: 352, y: 238 }, 4100, 800, { kind: 'provisional' });
    packet(scene, 'sse-data-3', 'event 3', { x: 424, y: 150 }, { x: 352, y: 150 }, 6900, 800, { kind: 'provisional' });
    scene.showIntent(null, 'server -> browser', 8200, { anchor: { x: 400, y: 286 }, duration: 1700 });

    // WebSockets: distinct messages travel in both directions.
    packet(scene, 'ws-up-1', 'edit', { x: 622, y: 145 }, { x: 684, y: 145 }, 1200, 800, { kind: 'standard' });
    packet(scene, 'ws-down-1', 'update', { x: 684, y: 238 }, { x: 612, y: 238 }, 3000, 800, { kind: 'provisional' });
    packet(scene, 'ws-up-2', 'approve', { x: 612, y: 145 }, { x: 674, y: 145 }, 5400, 800, { w: 82, kind: 'standard' });
    packet(scene, 'ws-down-2', 'presence', { x: 674, y: 238 }, { x: 602, y: 238 }, 7300, 800, { w: 86, kind: 'provisional' });
    scene.showIntent(null, 'browser <-> server', 8600, { anchor: { x: 660, y: 286 }, duration: 1700 });

    scene.appendActivity('Polling waits to ask · SSE pushes server events · WebSockets carry messages both ways', 9000);
    return scene.build();
  }

  var compiled = buildD1();
  if (root) { root.scenes = root.scenes || {}; root.scenes.D1 = compiled; }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
