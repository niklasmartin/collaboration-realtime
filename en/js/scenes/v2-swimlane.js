// scenes/v2-swimlane.js — V2 variant A, "Swimlanes".
//
// Same V2 story as v2.js (request-response, then an agent enters) but
// reworked for two things the author flagged: (1) a simpler, linear
// top-to-bottom spine instead of a scattered layout, and (2) unmistakable
// human-vs-agent identity, which this variant solves with SPACE before
// labels — the agent's proposed Evidence node is born in a separate lane,
// physically apart from the human's spine, so provenance reads before you
// even see a tag.
//
// Spine (top-to-bottom): Problem -> [Propose solution] -> Solution ->
// [Add research] -> Evidence. The agent lane is a narrow column offset to
// the right; the agent's proposal appears there first, dashed, then slides
// onto the spine and commits solid only once the human approves it.

(function (root) {
  'use strict';

  const SceneKit = root && root.SceneKit ? root.SceneKit : require('../kit.js');

  function buildV2Swimlane() {
    const scene = SceneKit.createScene(15500, { fadeDuration: 500 });

    // -- layout -----------------------------------------------------------
    const PROBLEM = { x: 280, y: 20, w: 240, h: 48 };
    const TRIG1 = { x: 325, y: 92, w: 150, h: 32 };
    const SOLUTION = { x: 260, y: 148, w: 280, h: 64 };
    const TRIG2 = { x: 325, y: 236, w: 150, h: 32 };
    const EVIDENCE_SPINE = { x: 290, y: 292, w: 220, h: 56 };

    const LANE = { x: 560, y: 110, w: 220, h: 230 };
    const EVIDENCE_LANE = { x: 570, y: 170, w: 200, h: 56 };
    const SPINE_GUIDE = { x: 240, y: 8, w: 320, h: 360 };

    // -- static setup -------------------------------------------------------

    // Two faint regions, present from the first frame — provenance is
    // encoded by position before any label is read.
    scene.region('spineGuide', { x: SPINE_GUIDE.x, y: SPINE_GUIDE.y, w: SPINE_GUIDE.w, h: SPINE_GUIDE.h, label: '' });
    scene.region('agentLane', { x: LANE.x, y: LANE.y, w: LANE.w, h: LANE.h, label: 'agent lane' });

    scene.button('proposeSolution', { x: TRIG1.x, y: TRIG1.y, w: TRIG1.w, h: TRIG1.h, label: 'Propose solution' });
    scene.button('addResearch', { x: TRIG2.x, y: TRIG2.y, w: TRIG2.w, h: TRIG2.h, label: 'Add research', opacity: 0 });

    scene.cursor('user', { kind: 'human', x: 700, y: 400, label: '', opacity: 0 });
    scene.cursor('agent', { kind: 'agent', x: 750, y: 40, label: '', opacity: 0 });

    // ======================================================================
    // Spine builds top-to-bottom
    // ======================================================================

    scene.createNode('problem', 300, {
      x: PROBLEM.x, y: PROBLEM.y, w: PROBLEM.w, h: PROBLEM.h,
      label: 'Why are users churning?',
      duration: 300,
    });

    scene.showCursor('user', 1000, { fade: 150, label: 'You' });
    scene.moveCursor('user', { x: 700, y: 400 }, { x: 400, y: 108 }, 1000, 700, { arc: 26 });
    scene.click('user', 'proposeSolution', 1700, { pressDuration: 150 });
    scene.pulse(400, 108, 1700, { radius: 24, duration: 600 });
    scene.appendActivity('Propose solution', 1700);

    scene.createNode('solution', 2000, {
      x: SOLUTION.x, y: SOLUTION.y, w: SOLUTION.w, h: SOLUTION.h,
      label: 'Onboarding emails',
      sublabel: 'Trigger a 3-day welcome series',
      duration: 300,
    });

    scene.moveCursor('user', { x: 400, y: 108 }, { x: 420, y: 180 }, 2300, 700, { arc: -14 });

    // t=3000 -> 4600: hold, the calm before the second trigger appears.

    scene.showButton('addResearch', 4600, { fade: 200 });
    scene.moveCursor('user', { x: 420, y: 180 }, { x: 400, y: 252 }, 4900, 700, { arc: 18 });
    scene.click('user', 'addResearch', 5600, { pressDuration: 150 });
    scene.pulse(400, 252, 5600, { radius: 24, duration: 600 });
    scene.appendActivity('Add research', 5600);

    // ======================================================================
    // Agent enters — proposal is born in the lane, not on the spine
    // ======================================================================

    scene.showCursor('agent', 5900, { fade: 200, label: 'Research agent' });
    scene.moveCursor('agent', { x: 750, y: 40 }, { x: 340, y: 44 }, 5900, 800, { arc: 20 });
    scene.selectNode('problem', 5900, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Reading', 6700, { anchor: { x: 340, y: 70 }, duration: 900 });

    scene.selectNode('problem', 7600, false);
    scene.moveCursor('agent', { x: 340, y: 44 }, { x: 340, y: 180 }, 7600, 800, { arc: -20 });
    scene.selectNode('solution', 7600, true, { color: '#5e6ad2' });
    scene.showIntent('agent', 'Adding evidence', 8400, { anchor: { x: 340, y: 214 }, duration: 1000 });
    scene.selectNode('solution', 9400, false);

    // Agent crosses into the lane before proposing — the move itself
    // announces "this is going to be mine, not yours."
    scene.moveCursor('agent', { x: 340, y: 180 }, { x: 630, y: 180 }, 9400, 500, { arc: 12 });
    scene.pulse(670, 198, 9800, { radius: 28, duration: 500, color: '#5e6ad2' });

    scene.createNode('evidence', 10100, {
      x: EVIDENCE_LANE.x, y: EVIDENCE_LANE.y, w: EVIDENCE_LANE.w, h: EVIDENCE_LANE.h,
      label: 'Welcome series ↑ retention 22%',
      kind: 'provisional',
      duration: 300,
    });
    scene.appendActivity('Evidence proposed (lane)', 10100);

    // Human drifts toward the lane while the agent is still nearby —
    // interruptibility, demonstrated rather than stated.
    scene.moveCursor('user', { x: 400, y: 252 }, { x: 700, y: 230 }, 10400, 800, { arc: -16 });
    scene.showIntent('agent', 'Paused', 11600, { anchor: { x: 630, y: 168 }, duration: 900 });

    scene.showApproval(12700, { anchor: { x: 700, y: 320 }, duration: 700 });

    // Approval: the dashed lane card physically slides onto the spine and
    // commits solid — the moment provenance transfers from "theirs" to
    // "ours," made literal as motion.
    scene.moveNode(
      'evidence',
      { x: EVIDENCE_LANE.x, y: EVIDENCE_LANE.y },
      { x: EVIDENCE_SPINE.x, y: EVIDENCE_SPINE.y },
      13100,
      700,
      { easing: 'easeInOut' }
    );
    scene.commitProvisional('evidence', 13800);
    scene.appendActivity('Evidence committed to spine', 13800);

    // t=13800 -> 15500: hold the final, calm state.

    return scene.build();
  }

  const compiled = buildV2Swimlane();

  if (root) {
    root.scenes = root.scenes || {};
    root.scenes.V2A = compiled;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = compiled;
})(typeof window !== 'undefined' ? window : null);
