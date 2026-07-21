// V5 - a legible multi-agent workspace.
(function (root) {
  'use strict';

  var SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV5() {
    var scene = SceneKit.createScene(20400, { fadeDuration: 700 });

    var QUESTION = { x: 280, y: 34, w: 240, h: 48 };
    var IDEA = { x: 105, y: 160, w: 250, h: 56 };
    var IDEA_EDITED = { x: 45, y: 160 };
    var RELATED = { x: 515, y: 160, w: 210, h: 56 };
    var EVIDENCE = { x: 120, y: 292, w: 220, h: 46 };

    scene.node('question', {
      x: QUESTION.x, y: QUESTION.y, w: QUESTION.w, h: QUESTION.h,
      label: 'Warum wandern Kunden ab?', opacity: 1,
    });
    scene.node('related', {
      x: RELATED.x, y: RELATED.y, w: RELATED.w, h: RELATED.h,
      label: 'Rückgewinnungsangebot', opacity: 1,
    });

    scene.cursor('you', { kind: 'human', x: 30, y: 250, label: 'Sie', opacity: 0 });
    scene.cursor('research', { kind: 'agent', x: 760, y: 350, label: 'Recherche-Agent', opacity: 0 });
    scene.cursor('structure', { kind: 'agent', x: 750, y: 260, label: 'Struktur-Agent', opacity: 0 });
    scene.cursor('maya', { kind: 'human', x: 760, y: 50, label: 'Maya', opacity: 0 });

    scene.stamp('review-state', {
      x: 520, y: 96, text: 'Von Maya geprüft', kind: 'human', opacity: 0,
    });
    scene.button('undo', { x: 610, y: 372, w: 172, h: 34, label: 'Agentenaktion rückgängig', opacity: 0 });

    // You create an idea while the research agent makes its next action clear.
    scene.showCursor('you', 500, { fade: 180 });
    scene.moveCursor('you', { x: 30, y: 250 }, { x: 230, y: 188 }, 500, 650, { arc: -8 });
    scene.createNode('idea', 1150, {
      x: IDEA.x, y: IDEA.y, w: IDEA.w, h: IDEA.h, label: '', duration: 220,
    });
    scene.typewriterLabel('idea', 'Onboarding-E-Mails', 1280, { step: 58 });
    scene.drawEdge('question-idea', 'question', 'idea', 2250, 500, {
      fromAnchor: 'bottom', toAnchor: 'top',
    });
    scene.showCursor('research', 800, { fade: 180 });
    scene.moveCursor('research', { x: 760, y: 350 }, { x: 230, y: 315 }, 850, 950, { arc: 16 });
    scene.setCursorLabel('research', 'Recherche-Agent 🔗', 1550);
    scene.showProgress('research-progress', 1800, { x: 230, y: 315, color: '#5e6ad2' });
    scene.createNode('evidence', 3350, {
      x: EVIDENCE.x, y: EVIDENCE.y, w: EVIDENCE.w, h: EVIDENCE.h,
      label: 'Nachweis: 2 Studien', kind: 'provisional', duration: 300,
    });
    scene.setCursorLabel('research', 'Recherche-Agent', 3450);
    scene.hideProgress('research-progress', 3500, { fade: 180 });
    scene.commitProvisional('evidence', 4700);
    scene.hideCursor('research', 5100, { fade: 220 });

    // The structure agent announces and highlights both endpoints first.
    scene.showCursor('structure', 5000, { fade: 180 });
    // The marker lands on the line it is about to create, rather than beside
    // either card, so the relation-building action has an unambiguous target.
    // Agent cursors are 12px diamonds whose origin is top-left, so x:224
    // centers the marker on the x:230 relationship line.
    scene.moveCursor('structure', { x: 750, y: 260 }, { x: 224, y: 250 }, 5000, 650, { arc: -8 });
    scene.setCursorLabel('structure', 'Struktur-Agent 🔗', 5450);
    scene.selectNode('evidence', 5750, true, { color: '#5e6ad2' });
    scene.selectNode('idea', 5750, true, { color: '#5e6ad2' });
    scene.click('structure', 'idea', 6200, { pressDuration: 180 });
    scene.drawEdge('evidence-idea', 'evidence', 'idea', 6450, 650, {
      fromAnchor: 'top', toAnchor: 'bottom', straight: true,
    });
    scene.selectNode('evidence', 7350, false);
    scene.selectNode('idea', 7350, false);
    scene.setCursorLabel('structure', 'Struktur-Agent', 7550);
    scene.hideCursor('structure', 7450, { fade: 220 });

    // A second human reviews the top-level question without mutating it.
    scene.showCursor('maya', 7600, { fade: 180 });
    scene.moveCursor('maya', { x: 760, y: 50 }, { x: 520, y: 58 }, 7600, 600, { arc: 6 });
    scene.setCursorLabel('maya', 'Maya 👀', 8000);
    scene.selectNode('question', 8250, true, { color: '#a0a0ab' });
    scene.showStamp('review-state', 8800, { fade: 200 });
    scene.selectNode('question', 9450, false);
    scene.setCursorLabel('maya', 'Maya', 9300);
    scene.hideCursor('maya', 9500, { fade: 220 });
    scene.hideStamp('review-state', 9700, { fade: 220 });

    // You edit the idea just as Structure targets it for a layout change.
    scene.moveCursor('you', { x: 230, y: 188 }, { x: 165, y: 188 }, 9700, 450, { arc: 4 });
    scene.selectNode('idea', 10150, true, { color: '#f1f1f3' });
    scene.setLabel('idea', 'Onboarding-E-Mail-Sequenz', 10500);
    scene.moveNode('idea', { x: IDEA.x, y: IDEA.y }, IDEA_EDITED, 10500, 650, { easing: 'easeInOut' });

    scene.showCursor('structure', 10000, { fade: 180 });
    // The structure agent points at the very card being edited. Its intended
    // destination is separately represented by the dashed layout target.
    scene.moveCursor('structure', { x: 224, y: 250 }, { x: 245, y: 188 }, 10100, 550, { arc: 10 });
    scene.createNode('agent-target', 10900, {
      x: 500, y: 250, w: 210, h: 42, label: 'Layout-Ziel des Agenten', kind: 'ghost', duration: 220,
    });
    scene.selectNode('idea', 11100, true, { color: '#5e6ad2' });
    scene.click('structure', 'idea', 11100, { pressDuration: 260 });
    scene.setCursorLabel('structure', 'Struktur-Agent 📐', 11100);
    scene.drawEdge('proposed-layout-move', 'idea', 'agent-target', 11350, 450, {
      fromAnchor: 'right', toAnchor: 'left', straight: true,
    });

    // Conflict policy is shown before the rejected agent mutation disappears.
    scene.pulse(310, 230, 12700, { radius: 34, duration: 800, color: '#5e6ad2' });
    scene.hideEdge('proposed-layout-move', 12700, { duration: 220 });
    scene.removeNode('agent-target', 13500, { duration: 260 });
    scene.selectNode('idea', 13600, false);
    scene.appendActivity('✅ Regel: menschliche Bearbeitung bleibt; Agentenverschiebung verworfen', 13600);
    scene.setCursorLabel('structure', 'Struktur-Agent', 13600);
    scene.hideCursor('structure', 14300, { fade: 220 });
    scene.showButton('undo', 15800, { fade: 220 });

    // Settle on the current human, the resolved state, history, and undo.
    scene.moveCursor('you', { x: 165, y: 188 }, { x: 80, y: 250 }, 15100, 550, { arc: 5 });

    return scene.build();
  }

  var compiled = buildV5();
  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V5 = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
