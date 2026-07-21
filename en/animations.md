# Animation Playbook

## Purpose

This file defines the visual system and individual animation scenes for the essay outlined in [`story.md`](./story.md). Visual tokens (color, type, spacing, motion) follow [`DESIGN.md`](./DESIGN.md), the source of truth for all visual decisions in this project.

The animations are explanatory illustrations, not interactive product demos. They should be deterministic, minimal, smooth, and understandable without requiring the reader to click anything.

Every scene is hand-rolled: plain SVG for graph elements (nodes, edges) and positioned HTML overlays for cursors, labels, pulses, and logs, driven by a deterministic keyframe timeline in vanilla JavaScript. There is no React, no JSX, and no build step — state is a pure function of elapsed time, computed by plain functions and rendered with `element.setAttribute` / CSS transforms.

---

# Visual language

## Overall character

The animations should feel like editorial diagrams from a high-quality Linear, Figma, or Stripe engineering blog article, per DESIGN.md's editorial-minimalism direction:

- calm rather than flashy;
- generous empty space;
- restrained motion;
- one idea per scene;
- no unnecessary controls;
- no realistic application chrome;
- minimal text inside the canvas;
- loops that can be understood after one viewing;
- exactly one accent color (`--accent`, `#5e6ad2`) used as punctuation, never as a background, never doubled with a second accent.

## Core elements

All values below are DESIGN.md tokens (Section 5, "Animation canvas language"); implementers should read them from there, not hardcode duplicates.

### Canvas

- `--bg-alt` (`#fafafa`) background.
- 1px `--border`, 8px radius clipping container (DESIGN.md's radius ceiling — never exceed it).
- Faint dot grid at 24px pitch, dots in `--border` at low opacity, or no grid.
- Fixed camera in most scenes.

### Nodes

Use a small vocabulary, per DESIGN.md:

- **Standard node:** committed shared state. White fill, 1px `--border-strong`, 6px radius, 13px Inter 500 label.
- **Provisional (dashed) node:** agent proposal not yet committed. Dashed 1px `--accent` border, `--bg-alt` fill.
- **Ghost node:** pending, competing, rejected, or historical state. 40% opacity, no label emphasis.
- **Selected/target node:** current target or selection. 2px ring in the participant's identity color, 2px offset.

### Edges

- 1px `--border-strong` curves, drawn on with `stroke-dashoffset`.
- Simple curves only.
- Avoid animated particles unless the scene specifically explains message delivery (e.g. V4, V6, V8).

### Cursors as characters

Cursors carry the narrative. Identity is carried by **shape + label chip, never color alone**:

- Human: classic arrow cursor, `--text` (dark neutral); a second human uses `--text-muted`.
- Agent: rounded or diamond geometric pointer, `--accent` family.
- System action: pulse without a cursor.
- Each active participant gets a small label chip: 11px mono or Inter 500 text, `--surface` background, 1px `--border`, 4px radius (kbd-like styling).

### Intent before action

Agent actions should follow this rhythm:

1. cursor approaches target;
2. target highlights;
3. concise intent badge appears (same chip style as participant labels), 200ms before the action it announces;
4. change occurs;
5. attribution remains briefly (in the activity log: 11px mono, `--text-dim`, bottom strip of the canvas);
6. interface returns to rest.

### Motion

- Prefer ease-in-out interpolation.
- Cursor movement should have slight natural arcs.
- Use 180–350 ms for small UI transitions.
- Use 500–900 ms for deliberate cursor travel.
- Hold important states for 800–1,500 ms.
- Avoid spring overshoot unless extremely subtle.
- No rapid bouncing, shaking, or celebratory effects.

### Looping

- Typical duration: 6–12 seconds.
- Major narrative scenes: 12–18 seconds.
- Two-phase merged scenes (V2, V8) may run 18–20 seconds, with a distinct beat between phases.
- Add a short resting frame before restart.
- Reset with a gentle fade or reverse transition, not a hard jump.

### Accessibility

- Respect `prefers-reduced-motion`.
- Reduced-motion mode should show a representative final state or step through low-motion fades.
- Pause scenes outside the viewport.
- Consider pause on hover for readers inspecting labels.
- Ensure captions explain the concept without relying exclusively on animation.

---

# Shared implementation model

Each scene is driven by a deterministic timeline rather than real networking or random autonomous behavior.

```js
const scene = [
  { at: 0, action: 'show', target: 'canvas' },
  { at: 500, action: 'moveCursor', actor: 'user', target: 'runButton' },
  { at: 1300, action: 'click', actor: 'user', target: 'runButton' },
  { at: 1800, action: 'setStatus', value: 'Working' },
  { at: 3400, action: 'createNode', nodeId: 'result' },
];
```

Recommended internal architecture:

```js
const animations = {
  V1: {
    duration: 14000,
    initialState: {},
    events: [],
  },
};
```

A scene runner derives visual state from the timeline and current elapsed time (`state = reduce(initialState, events.filter(e => e.at <= t))`). This keeps every loop repeatable and makes article screenshots deterministic.

## Technology split

Use plain SVG for:

- nodes and edges;
- node positions and paths;
- selection rings and highlight states;
- graph continuity between phases within a scene.

Use positioned HTML overlays for:

- cursors;
- participant label chips;
- pulses;
- server/database icons;
- event packets;
- ghost positions;
- status callouts;
- small activity logs.

Use plain CSS transforms or the Web Animations API for interpolation. No animation library is required; scenes stay declarative and timeline-driven — a plain object describing events, and a small runner function that reads elapsed time and writes attributes/styles.

---

# Animation catalogue

## V1 — One User, One Action

Small inline scene. The deliberate setup for the entire opening sequence: a calm, almost uneventful interaction that establishes the old single-actor contract before later scenes make it more active by contrast.

### Referenced in

`article.md`, Section 1: **Interfaces used to be easy**.

### Purpose

Establish the old interaction model — a person acts, the software responds — and make its causality feel obvious and trivial.

### Scene

A simple decision canvas with three elements:

- A top prompt node: `Why are customers churning?`
- An empty or muted solution area below it.
- A compact action control labeled `Add idea`.

Only one human cursor, labeled `You`, is present. The canvas is completely still before the cursor moves.

### Timeline

1. **Rest** — The canvas sits unchanged for roughly one second. No loading shimmer, no ambient activity, no unexplained movement.
2. **The user approaches** — The cursor labeled `You` moves toward `Add idea`. Direct, unhurried movement.
3. **The user acts** — The cursor clicks. A short text value appears: `Onboarding emails`. The action control confirms the input with a restrained pressed state.
4. **The system responds** — A new node appears beneath the original question. It should not pop dramatically; it can fade and scale from approximately `0.98` to `1` while the connecting edge draws in.
5. **The state settles** — The cursor moves slightly away. The new node remains. Nothing else happens.
6. **Loop hold** — Hold the completed state long enough to register cause-and-effect. Then reset with a short crossfade.

### Core visual idea

There is only one plausible explanation for the new node: the user created it. No attribution UI, no activity log, no presence is necessary. The simplicity is the point.

### Optional minimal caption

> One action has one obvious owner.

Avoid narrating mechanics ("You click 'Add idea' and a node appears") — the animation already shows that.

### Visual notes

- Use deterministic keyframes; do not use a real input.
- The typed value can animate as two or three quick text groups rather than character-by-character.
- Keep node creation aligned with the visual language of V2.
- Preserve canvas dimensions and typography with V2 where possible.

### Duration

6–7 seconds (rest 1.0 s, cursor movement 0.8 s, click and input 0.7 s, node creation 0.8 s, settled hold 2.0 s, reset 0.7 s).

---

## V2 — From Stillness to a Second Actor

Two-phase scene. Phase 1 is the deliberate setup: a still, linear request-response contract on one canvas. Phase 2 breaks that stillness by bringing an agent into the same canvas — the contrast is the point, so both phases must share the same frame and node vocabulary.

### Referenced in

`story.md`, Section 2: **Software used to pretend it had one user**, and Section 3: **Then an agent enters the interface**.

### Purpose

Establish the traditional single-participant interaction contract, then show it broken by a second, independently acting participant in the same interface.

### Scene

One canvas holds one node, a `Run` control, and a `Research` control introduced in phase 2.

### Timeline

#### Phase 1: User acts, system responds (still)

1. Nothing moves for 700 ms.
2. Human cursor enters and approaches `Run`.
3. Button depresses.
4. A small progress indicator appears.
5. Cursor remains motionless while waiting.
6. A result node fades into the canvas.
7. Cursor moves to inspect it.
8. Along the bottom, highlight sequentially: `User acts` → `System responds` → `User acts again`.
9. Hold on the calm, static frame for a full beat — this stillness is deliberate, not a pause between clips.

#### Phase 2: The first agent enters (same canvas)

10. Human clicks `Research`.
11. An agent cursor appears with label chip `Research agent`.
12. Agent moves between the existing nodes; status label changes from `Reading` to `Adding evidence`.
13. Target area highlights.
14. Agent creates a dashed provisional node.
15. Human cursor approaches the node while the agent is still working.
16. Agent pauses — demonstrating interruptibility.
17. A small approval indicator appears.
18. Provisional node becomes solid.
19. Hold on the now-active canvas; the contrast with the phase 1 stillness should be legible without a caption.

### Visual notes

- Phase 1 must feel deliberately still and linear — later scenes become more active by contrast, and this scene is the baseline they are measured against.
- The agent in phase 2 should not feel like an invisible background process; its intention becomes visible before the canvas changes.
- The pause when the human approaches in phase 14–16 is the first demonstration of interruptibility in the article.

### Duration

18–20 seconds (phase 1 ≈ 7–8s, a short beat, phase 2 ≈ 10–12s).

---

## V3 — The Canvas Gets Crowded

**Anchor scene.** Preview the multiplayer problem before introducing terminology: several humans and several agents sharing the same state break the assumption of obvious causality.

### Referenced in

`article.md`, Section 3: **One assistant becomes a room full of participants**.

### Purpose

Expand the interaction model from one user and one agent to several humans and several agents, and show that the problem is not the number of animations on the screen but the loss of obvious causality.

### Scene

Start from a canvas that resembles V2 after both the user's idea (`Onboarding emails`) and the research agent's proposal (`Win-back offer`) have been accepted, plus the nested research finding (`Welcome series research`).

Suggested existing nodes:

- `Why are customers churning?`
- `Onboarding emails`
- `Win-back offer`
- `Welcome series research`

The visual should feel as though the article has zoomed out slightly and revealed that the same workspace has more participants.

### Participants

Four participants:

- `You` — human
- `Maya` — second human
- `Research agent` — adds evidence or context
- `Structure agent` — connects, groups, or reorganizes existing material

The two agents should have distinct, stable roles and visually distinct cursors.

### Timeline

1. **Familiar starting point** — Show the accepted result of V2. `You` remains near the `Onboarding emails` node. The `Research agent` is present but inactive for a moment.
2. **The workspace opens up** — A second human cursor, `Maya`, enters from the right. A second agent cursor, `Structure agent`, enters from the top or lower edge. Do not introduce everyone at the same instant — stagger arrivals.
3. **Independent work begins** — Each participant performs a different, understandable action:
   - `Research agent` creates a small evidence node beneath `Onboarding emails`.
   - `Structure agent` begins drawing a relation toward `Win-back offer`.
   - `Maya` selects the main churn question.
   - `You` begins dragging `Onboarding emails` slightly to the left.

   Actions can overlap but each should remain visually legible.
4. **The first moment of tension** — While `You` is still holding `Onboarding emails`, the `Structure agent` moves toward the same node because it wants to reposition or connect it. The target node gains two subtle intent indicators. Do not resolve the conflict yet.
5. **A second convergence** — `Maya` moves toward the top question while the `Research agent` targets it for an evidence connection. The canvas now contains several reasonable actions that are individually harmless but collectively ambiguous.
6. **Freeze on the question** — Hold for a short beat with two participants converging on the same object. The final frame should make the question obvious without text: *Who controls this object now?*
7. **Reset** — Fade participant cursors first, then restore the initial accepted V2 state.

### Core visual idea

The problem is not that four participants exist. The problem is that four participants can act independently on shared state, and the interface can no longer rely on obvious causality.

### Optional minimal caption

> More participants change more than the amount of activity.

Alternative:

> Shared state needs shared rules.

### What not to show yet

Do not solve the conflict in V3. Do not add a complete activity log. Do not show locks, undo, or conflict resolution. Those belong in later visualizations. V3 should create the problem.

### Visual notes

- Reuse node positions and visual components from V2.
- Keep cursor paths deliberate.
- Avoid four simultaneous text labels.
- Use target highlights to show intent before mutation.
- Limit newly created content to one small evidence node.
- Let one edge draw partially, then pause as the conflict emerges.
- The loop should end before any resolution, preserving the open question.

### Duration

9–11 seconds (familiar state 1.0 s, participant arrivals 1.5 s, independent actions 3.0 s, convergence 2.0 s, hold 1.5 s, reset 1.0 s).

---

## V4 — From Haunted Canvas to Shared Workspace

**Anchor scene.** Two-phase scene. Phase 1 runs the canvas in a "haunted" mode; phase 2 runs the same actions again with collaboration cues. Use one canvas in two consecutive phases rather than a split-screen comparison — this makes the transformation feel stronger.

### Referenced in

`article.md`, Section 4: **Realtime is not the same as understandable**.

### Purpose

Demonstrate the difference between synchronized state and understandable collaboration. The same underlying changes appear in both phases; only the explanatory interface layers differ.

### Scene

The same multi-participant canvas and similar actions as V3, presented in two consecutive phases on the same canvas. A subtle phase label can appear in a corner:

- Phase 1: `State only`
- Phase 2: `State + context`

### Timeline

#### Phase 1: Haunted canvas

No participant cursors, agent names, selected states, intent previews, or activity history are visible.

1. `Onboarding emails` moves slightly left.
2. A new evidence node appears beneath it.
3. An edge draws from the evidence node to `Win-back offer`.
4. The top question changes from a neutral state to `Reviewed`.

All changes are smooth and perfectly synchronized. But nothing explains them. The canvas should not glitch — it should work perfectly and still feel uncomfortable. This is not a broken realtime system; it is a technically correct but socially illegible one.

#### Transition

5. Fade the canvas back to its starting state.
6. Reveal the second phase label: `State + context`.

#### Phase 2: Shared workspace

Run the same actions again, with explanatory layers.

7. `You` appears; the cursor approaches `Onboarding emails`, the node shows a subtle human selection outline, and the cursor drags it left.
8. `Research agent` appears; a short label reads `Adding evidence`; a provisional outline shows where the new evidence node will land; the node becomes committed after it appears.
9. `Structure agent` approaches the source node; both source and target nodes highlight; a short label reads `Connecting evidence`; the edge draws.
10. `Maya` selects the top question; her name appears near the cursor; the state changes to `Reviewed`.
11. After each action, append a compact activity entry at the bottom (`You moved Onboarding emails`, `Research agent added evidence`, `Structure agent connected evidence`, `Maya marked question reviewed`). The newest entry can appear briefly, then settle into a compact list or ticker.
12. After the agent-created edge lands, show a small `Undo` action beside the newest activity entry. It does not need to be clicked — its presence communicates reversibility.

### Layer indicator

An optional compact stack animating between phases:

```text
State
+ Presence
+ Intent
+ Attribution
+ Control
```

### Core visual idea

The state is identical in both phases. The second phase becomes usable because the interface exposes presence, identity, intent, attribution, provisional state, and reversibility.

### Optional minimal caption

> Same state. Different understanding.

This is preferable to a caption that enumerates every visual layer.

### Visual notes

- Use exactly the same node positions and end states in both phases.
- Keep action timing nearly identical.
- The comparison should be about context, not speed.
- Activity entries should remain secondary to the canvas.
- Intent labels should appear before actions and disappear shortly after.
- Presence is temporary; attribution remains in the activity history.
- Use a small pending or provisional treatment only for the agent-created node.
- Avoid adding permission controls here. Authority is introduced in the prose but can be visualized later.

### Duration

14–16 seconds (haunted phase ≈ 5 s, transition ≈ 1.3 s, shared phase ≈ 8 s).

---

## V4 — Polling: Are We There Yet?

### Referenced in

`story.md`, Section 5: **The first implementation: "Anything new?"**.

### Purpose

Explain polling visually without turning the scene into a network diagram.

### Scene

Canvas on the left, compact server or database symbol on the right.

### Timeline

1. A small pulse travels from canvas to server.
2. A response returns: `No change`.
3. Repeat twice.
4. On the fourth request, response reads `Updated`.
5. A result node appears.
6. Optional second client enters with a slower polling rhythm and remains stale briefly.

### Visual notes

- The empty requests should feel repetitive, not catastrophic.
- The server icon should remain abstract and small.
- Use a ghosted missing node on the stale client.

### Duration

9–11 seconds.

---

## V5 — The Agent Can Speak, but Not Share a World

Small inline scene.

### Referenced in

`story.md`, Section 6: **Streaming is not multiplayer**.

### Purpose

Distinguish streamed output from synchronized application state.

### Scene

Subtly divide the frame:

- left: streaming text or progress;
- right: graph canvas.

### Timeline

1. Agent cursor appears near the stream.
2. Short text fragments arrive continuously.
3. The graph remains completely still.
4. Stream reaches completion.
5. One committed node appears in the graph.

### Visual notes

- The left side should have fluid, continuous motion.
- The right side should remain deliberately static until the final commit.
- Avoid reproducing a full chat interface.

### Duration

8–10 seconds.

---

## V6 — WebSockets Solve the Pipe

### Referenced in

`story.md`, Section 7: **WebSockets: the pipe is fast; now build the room**.

### Purpose

Show that immediate bidirectional delivery does not define collaboration behavior.

### Scene

Two small canvases connect to a central service.

### Timeline

1. Start with periodic polling pulses.
2. Replace them with one persistent connection.
3. Move a node on client A.
4. The node immediately moves on client B.
5. Hold briefly as a success state.
6. Introduce questions around the connection: `Reconnect?` `Order?` `Permissions?` `Persist?` `Conflict?`
7. The single elegant line gains additional subtle strands: events, presence, acknowledgements, retries, persistence.

### Visual notes

The escalation should remain composed. Do not create a tangled mess; show accumulating responsibilities.

### Duration

11–13 seconds.

---

## V7 — Overwrite, Lock, or Merge?

**Anchor scene.**

### Referenced in

`story.md`, Section 8: **What if two participants update the same node?**.

### Purpose

Make conflict semantics concrete and memorable.

### Scene

One node is centered. Two human cursors approach from opposite directions.

### Sequence 1: Last accepted value wins

1. Both cursors grab the node.
2. Two translucent ghost positions appear, left and right.
3. Left position is accepted first.
4. Right position arrives later.
5. Node smoothly settles to the right.
6. Activity strip records both moves.
7. Faint afterimage of the overwritten position fades.

### Sequence 2: Locking

1. Reset node.
2. First cursor begins dragging.
3. Node gains an ownership outline.
4. Second cursor approaches but cannot grab it.
5. Label appears: `Niklas is editing`.

### Sequence 3: Property-level merge

1. Reset node.
2. First participant changes the label.
3. Second participant changes a separate category marker.
4. Both changes remain.

### Section labels

```text
Overwrite → Lock → Merge
```

### Visual notes

- The policy should be understandable from motion before the label appears.
- Ghost states are especially useful here.

### Duration

16–18 seconds.

---

## V8 — Three Lanes: Document, Presence, Signal

Two-phase scene. Phase 1 establishes the document/presence/signal taxonomy in the abstract; phase 2 routes the same three kinds of information through Supabase's three concrete channels and reconstructs the scene on a second client. The taxonomy is the deliberate setup for the Supabase mapping — one scene, not two.

### Referenced in

`story.md`, Section 9: **Three kinds of realtime information**, and Section 10: **Supabase: keep Postgres and assemble the realtime pieces**.

### Purpose

Create the conceptual bridge from "what kind of information is this?" to "which managed primitive carries it?"

### Scene

The same canvas, shown first as three horizontal lanes, then as three lanes feeding a second client.

### Timeline

#### Phase 1: Document, Presence, Signal

1. **Lane 1 — Document:** a node is created; all participants leave; the node remains.
2. **Lane 2 — Presence:** a cursor and selection appear; the participant disconnects; cursor and selection disappear.
3. **Lane 3 — Signal:** a small ripple or `Agent is targeting this node` pulse appears and fades without modifying the document.
4. Labels persist under each lane: `Document`, `Presence`, `Signal`.
5. Hold on the three labeled lanes as a settled taxonomy.

#### Phase 2: Routed through Supabase, reconstructed on a second client

6. Lane labels relabel in place: `Document` → `Postgres Changes`, `Presence` → `Presence`, `Signal` → `Broadcast`.
7. A user drags a node.
8. The durable node position travels along the `Postgres Changes` lane.
9. Cursor movement travels along the `Broadcast` lane.
10. Participant status travels along the `Presence` lane.
11. A second client receives all three streams and reconstructs the full scene.
12. Brief disconnect: the ephemeral cursor disappears; persistent node changes continue elsewhere; reconnect restores document state; presence starts fresh.

### Visual notes

- The three lanes should appear coordinated but distinct throughout both phases.
- Do not represent every Postgres or Realtime internal — the point is that the application decides what belongs in which lane.
- The relabeling in step 6 should read as "the same three kinds of information, now given a concrete home," not as a scene change.

### Duration

18–20 seconds (phase 1 ≈ 8–9s, phase 2 ≈ 10–11s).

---

## V9 — InstantDB: Subscribe to the World

### Referenced in

`story.md`, Section 11: **InstantDB: subscribe to the shape of the world**.

### Purpose

Explain the difference between event-oriented plumbing and reactive shared state.

### Scene

A compact query card sits beside the canvas:

```text
nodes
edges
```

### Timeline

1. Canvas renders from the current query result.
2. A remote agent changes a node.
3. Query card briefly glows.
4. Local canvas updates.
5. Human drags another node.
6. Node moves immediately.
7. A small `pending` dot appears.
8. Synchronization completes.
9. Dot changes to `synced` and fades.

### Optional side-by-side ending

#### Event-oriented

```text
Receive event
→ inspect type
→ update cache
→ reconcile state
```

#### Query-oriented

```text
Data changed
→ subscribed result updates
```

### Visual notes

Do not imply that complexity disappears. The animation shows that more synchronization behavior is owned by the data layer.

### Duration

12–14 seconds.

---

## V10 — A Legible Multi-Agent Workspace

**Anchor scene and closer.** Absorbs the old standalone closing scene: it ends with the closing captions "Design for participants, not requests" laid over the calm final frame, rather than a separate compressed replay.

### Referenced in

`story.md`, Section 14: **Return to the canvas: users and agents sharing one world**, and the conclusion, **Design for participants, not requests**.

### Purpose

Demonstrate the article's complete design model, then close on its central distinction.

### Participants

- Human user.
- Research agent.
- Structure agent.

Roles should remain stable even if display names vary.

### Timeline

1. Human creates a `Customer problem` node.
2. Research agent enters and shows `Adding evidence` before creating a dashed node.
3. Evidence becomes committed.
4. Structure agent highlights two nodes and shows `Connecting related ideas`.
5. Edge is drawn.
6. Human moves another node while both agents remain active.
7. Structure agent attempts a conflicting position change.
8. The chosen policy is applied visibly.
9. Activity log attributes the result.
10. Human selects `Undo agent action`.
11. Canvas returns to a stable shared state; agents remain visible but idle.
12. Hold on the calm final frame. Fade in closing captions in sequence, each replacing the last, low and unobtrusive at the base of the frame:
    - `How does a change reach everyone?`
    - `How does everyone understand and safely act on that change?`
    - `Design for participants, not requests.`
13. Hold on the final caption over the still, idle canvas before reset.

### Required interface conventions

- visible cursors and identities;
- target highlight before agent mutation;
- provisional state;
- persistent attribution;
- clear conflict behavior;
- user pause or undo control.

### Visual notes

This is the most polished scene in the article. Despite three active participants, the final frame should feel orderly and calm — the closing captions must not disturb that stillness; they fade in place rather than sliding or bouncing in.

### Duration

20–24 seconds (workspace sequence ≈ 16–18s, closing captions ≈ 4–6s).

---

# Static diagrams

Two sections of the article compare tools rather than demonstrate a mechanism. These are **not** animations — they are static, styled diagrams and tables built with the same DESIGN.md tokens (flat, border-based, one accent, 8px radius ceiling), so they feel like part of the same visual system without requiring a timeline.

## Collaboration layers table (old A12)

### Referenced in

`story.md`, Section 12: **Alternatives solve different layers**.

### Format

A static comparison table or card row — Liveblocks, Yjs, Firebase, custom sync engine — each with a one-line positioning statement and a short "good fit" list. No motion, no cursors.

### Visual notes

- Use the same node/border/type tokens as the animated scenes so the article doesn't feel like it switches design systems mid-page.
- Liveblocks and Yjs may each get a small static illustrative icon (e.g. a layered-overlay glyph for Liveblocks, a two-document-merging glyph for Yjs) rendered as flat SVG, not a screenshot.
- No podium, no ranking order — present as parallel cards or table rows.

## Decision guide table (old A13)

### Referenced in

`story.md`, Section 13: **Decision guide: choose the layer you actually need**.

### Format

A static requirement-to-option table: one row per condition (`Occasional status`, `Server streams output`, `Custom bidirectional protocol`, `Postgres + managed realtime primitives`, `Integrated reactive sync model`, `Collaboration added to an existing app`, `Concurrent merge and offline data`), mapping to the corresponding technology.

### Visual notes

- Present requirements in the left column and technologies in the right column — never a hierarchy or a winner's podium.
- Use `--text-muted` for the requirement text and `--text` weight 600 for the technology name, consistent with DESIGN.md's restrained emphasis rule (weight, not color, not italics).

---

# Recommended placement and density

## Major full-width scenes (anchors)

Use these as visual anchors — four scenes, evenly spaced through the article:

1. **V1 — The Canvas Gets Crowded** (opening)
2. **V3 — From Haunted Canvas to Shared Workspace** (first third)
3. **V7 — Overwrite, Lock, or Merge?** (mid-article)
4. **V10 — A Legible Multi-Agent Workspace** (closing)

## Smaller inline animations

Six compact scenes sit beside or between paragraphs:

- V2 — From Stillness to a Second Actor
- V4 — Polling: Are We There Yet?
- V5 — The Agent Can Speak, but Not Share a World
- V6 — WebSockets Solve the Pipe
- V8 — Three Lanes: Document, Presence, Signal
- V9 — InstantDB: Subscribe to the World

The two static diagrams (Collaboration layers, Decision guide) are not animations and are placed as regular figures within Sections 12–13.

## Avoid visual overload

The article does not need every scene to be equally large. The important rhythm is:

1. narrative scene;
2. explanatory prose;
3. compact technical scene;
4. code, table, or decision framework;
5. return to narrative canvas.

With 10 animated scenes (4 anchors, 6 inline) and 2 static diagrams across roughly 15 sections, most sections get exactly one visual — consistent with the ~3,000-word target in `story.md`.

---

# Reusable scene components

Build a small internal animation kit — plain factory functions, not framework components — rather than implementing each scene independently.

## Suggested factories

```text
createCanvasFrame(container, options)
createCursor(kind, options)          // kind: 'human' | 'agent'
createParticipantLabel(text, options)
createGraphNode(id, options)
createGhostNode(id, options)
createIntentBadge(text, options)
createActivityLog(container)
createConnectionPulse(from, to, options)
createDataLane(label, options)
createLayerIndicator(labels)
createTimelineCaption(text, options)
```

Each factory returns a small object exposing update/teardown functions (`{ update(state), destroy() }`) so the scene runner can drive it from timeline state without any framework lifecycle.

## Useful actions

```text
moveCursor
click
selectNode
moveNode
createNode
removeNode
drawEdge
showGhost
commitGhost
showIntent
clearIntent
connectParticipant
disconnectParticipant
showPulse
appendActivity
undoAction
setLayer
```

## Scene-state example

```js
const initialState = {
  nodes: [],
  edges: [],
  participants: {},
  activity: [],
  overlays: {},
};
```

```js
function reduceScene(state, event) {
  switch (event.action) {
    case 'moveNode':
      return updateNodePosition(state, event.nodeId, event.position);
    case 'showIntent':
      return setParticipantIntent(state, event.actor, event.label);
    case 'appendActivity':
      return {
        ...state,
        activity: [...state.activity, event.entry],
      };
    default:
      return state;
  }
}
```

A scene's render step is a plain function `render(state)` that walks the current state and imperatively updates the SVG/DOM nodes created by the factories above — no virtual DOM, no diffing framework.

---

# Performance considerations

- Mount only animations close to the viewport.
- Stop `requestAnimationFrame` loops when hidden.
- Avoid unnecessary DOM writes for every pixel where CSS transforms or the Web Animations API can handle interpolation.
- Keep SVG node/edge counts per scene very small; reuse existing elements rather than recreating them each frame.
- Prefer transform-based motion to layout changes.
- Precompute paths and keyframes where possible.
- Avoid writing article animations as actual realtime applications.
- Use deterministic seeds if any visual variation is added.

---

# Editorial checks for every animation

Before accepting a scene, confirm:

1. Can a nontechnical reader explain what changed?
2. Does the scene demonstrate exactly one primary idea?
3. Is agency visible before consequential changes?
4. Can the scene be understood without reading code?
5. Does the loop reset smoothly?
6. Does it still communicate in reduced-motion mode?
7. Is any vendor represented more favorably through visual polish rather than substance?
8. Does the scene distinguish persistent state, temporary presence, and transient signals correctly?
9. Does a conflict scene show the chosen policy rather than implying conflicts vanish?
10. Does the final state remain visually calm?
