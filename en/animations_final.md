# Animation Playbook — Final

## Purpose

This file defines the visual system and final set of animated and static illustrations for the article.

The goal is not to animate every technical section. The visual story should remain selective:

1. one user;
2. one user and one agent;
3. several humans and agents;
4. synchronized but confusing collaboration;
5. a final legible multiplayer workspace.

The technical half uses compact diagrams and tables instead of additional full narrative animations.

All visual tokens follow [`DESIGN.md`](./DESIGN.md). The article text should reference this file where visual placeholders appear.

The animations are deterministic editorial illustrations, not interactive product demos. They should be minimal, smooth, and understandable without requiring the reader to click anything.

Implementation is plain JavaScript:

- SVG for nodes, edges, highlights, and graph structure;
- positioned HTML overlays for cursors, labels, pulses, and activity history;
- deterministic keyframe timelines;
- direct DOM and SVG updates;
- no React, JSX, animation framework, or build step.

---

# Final visual inventory

## Narrative animations

- **V1 — One User, One Action**
- **V2 — A Second Actor Enters**
- **V3 — The Canvas Gets Crowded**
- **V4 — From Haunted Canvas to Shared Workspace**
- **V5 — A Legible Multi-Agent Workspace**

## Technical diagrams

- **D1 — Polling, SSE, and WebSockets**
- **D2 — One Collision, Three Policies**
- **D3 — Document, Presence, and Signal**
- **D4 — Event-Oriented and Query-Oriented Synchronization**
- **D5 — Decision Guide**

## Static comparison

- **S1 — Alternatives Solve Different Layers**

This gives the article five true animations. Everything else should be static or only lightly animated.

---

# Visual language

## Overall character

The visuals should resemble explanatory figures from a Figma, Linear, or Stripe engineering article:

- calm rather than theatrical;
- generous empty space;
- restrained motion;
- one clear idea per figure;
- no unnecessary controls;
- no realistic product chrome;
- minimal text inside the canvas;
- fixed camera unless movement itself is the concept;
- exactly one accent color, `--accent`, used as punctuation rather than decoration.

## Canvas

- Background: `--bg-alt`
- Border: 1px `--border`
- Radius: maximum 8px
- Optional subtle dot grid at 24px pitch
- Fixed dimensions across V1–V5 where practical

## Nodes

- **Committed node:** white fill, 1px `--border-strong`, 6px radius
- **Provisional node:** dashed 1px `--accent` border, `--bg-alt` fill
- **Ghost node:** 40% opacity
- **Selected node:** 2px participant ring with 2px offset

## Edges

- 1px `--border-strong`
- Smooth, simple curves
- Draw with `stroke-dashoffset`
- Avoid decorative particles

## Cursors as characters

Identity is communicated through shape and label, not color alone.

- Human: conventional pointer
- Agent: rounded or geometric pointer
- System action: pulse without a cursor
- Participant label: compact chip using 11px mono or Inter 500

## Intent before action

Agent actions should follow this rhythm:

1. cursor approaches;
2. target highlights;
3. concise intent badge appears;
4. action occurs;
5. attribution remains briefly;
6. interface returns to rest.

## Motion

- Small UI transitions: 180–350ms
- Cursor travel: 500–900ms
- Important holds: 800–1,500ms
- Prefer ease-in-out
- Avoid bounce, shake, overshoot, and celebratory motion

## Looping

- Small scenes: 6–10 seconds
- Major scenes: 10–16 seconds
- Closing scene: up to 20 seconds
- Rest briefly before restarting
- Reset with a fade or reverse transition

## Accessibility

- Respect `prefers-reduced-motion`
- Pause scenes outside the viewport
- Reduced-motion mode should show a representative final state
- Consider pause on hover
- Captions must communicate the concept without depending on motion alone

---

# Shared implementation model

Each scene is a deterministic function of elapsed time.

```js
const scene = [
  { at: 0, action: 'show', target: 'canvas' },
  { at: 500, action: 'moveCursor', actor: 'user', target: 'addIdea' },
  { at: 1300, action: 'click', actor: 'user', target: 'addIdea' },
  { at: 1800, action: 'createNode', nodeId: 'onboarding-emails' },
];
```

Recommended internal shape:

```js
const animations = {
  V1: {
    duration: 7000,
    initialState: {},
    events: [],
  },
};
```

At runtime:

```js
const state = reduce(
  initialState,
  events.filter((event) => event.at <= elapsed),
);
```

This keeps loops repeatable and makes screenshots deterministic.

## Technology split

Use SVG for:

- nodes;
- edges;
- graph positions;
- selection rings;
- target highlights;
- ghost states.

Use positioned HTML for:

- cursors;
- participant labels;
- intent badges;
- pulses;
- phase labels;
- activity history;
- undo controls.

---

# Narrative animations

## V1 — One User, One Action

### Referenced in

`article.md`, section **Interfaces used to be easy**.

### Purpose

Establish the old interaction contract:

> A person acts. The application responds.

The scene should feel calm and almost uneventful.

### Scene

The canvas contains:

- `Why are customers churning?`
- an empty solution area;
- a compact `Add idea` control;
- one human cursor labeled `You`.

### Timeline

1. The canvas rests.
2. `You` moves toward `Add idea`.
3. The cursor clicks.
4. `Onboarding emails` appears as the entered value.
5. A new node fades in beneath the question.
6. The connecting edge draws.
7. The cursor moves away.
8. Nothing else happens.
9. Hold, then reset gently.

### Core idea

There is only one plausible explanation for the change: the user caused it.

No attribution, presence, activity log, or conflict rules are necessary.

### Caption

> One action has one obvious owner.

### Duration

6–7 seconds.

---

## V2 — A Second Actor Enters

### Status

Already implemented.

### Referenced in

`article.md`, section **Then the software started acting too**.

### Purpose

Introduce one user and one agent working in the same interface.

### Final scenario

The user adds `Onboarding emails`.

While the user is still present, the research agent begins working. The layout makes space for the agent's proposal instead of replacing the user's contribution.

The research result later appears as provisional, dashed content nested within the user's card. It becomes committed only after confirmation.

### Required ideas

The scene should make these concepts visible:

- the software is now an actor;
- human and agent actions can overlap;
- agent work can be provisional;
- the interface distinguishes ownership;
- a second participant needs visible space.

### Caption

> The user is no longer the only active participant.

### Implementation note

V3 should begin from a canvas that looks like the accepted final state of V2.

---

## V3 — The Canvas Gets Crowded

### Referenced in

`article.md`, section **One assistant becomes a room full of participants**.

### Purpose

Expand the model from one user and one agent to several humans and several agents.

The scene should create the coordination problem without resolving it.

### Starting state

Reuse the accepted result of V2.

Suggested nodes:

- `Why are customers churning?`
- `Onboarding emails`
- `Win-back offer`
- `Welcome series research`

### Participants

- `You`
- `Maya`
- `Research agent`
- `Structure agent`

### Timeline

1. Begin with the accepted V2 canvas.
2. `Maya` enters from the right.
3. `Structure agent` enters from another edge.
4. Independent work begins:
   - `Research agent` creates a small evidence node.
   - `Structure agent` starts drawing a relation.
   - `Maya` selects the main question.
   - `You` begins moving `Onboarding emails`.
5. While `You` is still holding the node, `Structure agent` targets the same object.
6. Two subtle intent indicators appear on that node.
7. Elsewhere, `Maya` and `Research agent` converge on the top question.
8. Hold on the unresolved ambiguity.
9. Reset to the accepted V2 state.

### Core idea

The problem is not simply more activity.

The problem is that independent participants can act on the same state, and causality is no longer obvious.

### Caption

> Shared state needs shared rules.

### Do not show

- conflict resolution;
- locks;
- undo;
- a complete activity log;
- a successful final state.

V3 creates the problem.

### Duration

9–11 seconds.

---

## V4 — From Haunted Canvas to Shared Workspace

### Referenced in

`article.md`, section **Realtime is not the same as understandable**.

### Purpose

Show that perfectly synchronized state can still be socially illegible.

Run the same sequence twice:

1. state only;
2. state plus context.

### Presentation

Use one canvas in two phases rather than a split-screen.

Phase labels:

- `State only`
- `State + context`

### Phase 1 — State only

No cursors, names, selections, intent, attribution, or history.

Sequence:

1. `Onboarding emails` moves left.
2. An evidence node appears.
3. An edge connects it to `Win-back offer`.
4. The main question becomes `Reviewed`.

Everything works smoothly.

Nothing explains why.

### Transition

Reset to the starting state.

Show `State + context`.

### Phase 2 — State plus context

Repeat the same changes with explanation:

1. `You` approaches and moves `Onboarding emails`.
2. `Research agent` appears with `Adding evidence`.
3. A provisional node appears before commitment.
4. `Structure agent` highlights source and target before drawing the edge.
5. `Maya` selects the main question before marking it `Reviewed`.
6. A compact activity history attributes each action.
7. A small `Undo` control appears for the agent-created connection.

### Core idea

The underlying state is identical.

The second version becomes usable because it exposes:

- presence;
- identity;
- intent;
- provisional state;
- attribution;
- reversibility.

### Caption

> Same state. Different understanding.

### Duration

14–16 seconds.

---

## V5 — A Legible Multi-Agent Workspace

### Referenced in

`article.md`, section **Return to the canvas**, and the conclusion.

### Purpose

Close the visual story by returning to the crowded canvas after the reader has seen the technical options underneath it.

The amount of activity should remain high, but the interface should feel calm.

### Participants

- `You`
- `Maya`
- `Research agent`
- `Structure agent`

### Timeline

1. `You` creates an idea.
2. `Research agent` announces `Adding evidence`.
3. A dashed proposal appears, then becomes committed.
4. `Structure agent` highlights two targets and announces `Connecting ideas`.
5. The edge draws.
6. `Maya` reviews the main question.
7. `You` moves a node while an agent targets the same object.
8. The interface applies a visible conflict policy.
9. The activity history records the result.
10. A relevant undo or approval action appears.
11. All participants remain visible but settle into an idle state.
12. Hold on a calm final frame.

### Closing captions

Fade these in sequentially near the bottom of the frame:

1. `How does a change reach everyone?`
2. `How does everyone understand and safely act on that change?`
3. `Design for participants, not requests.`

### Required interface conventions

- visible identities;
- intent before mutation;
- provisional state;
- persistent attribution;
- explicit conflict behavior;
- user control through pause, approval, or undo.

### Core idea

The final canvas is not calmer because less is happening.

It is calmer because every action is legible.

### Duration

18–22 seconds.

---

# Technical diagrams

These are not narrative animations. They should be static or use only subtle pulses and transitions.

## D1 — Polling, SSE, and WebSockets

### Referenced in

The sections:

- **Polling: “Anything new?”**
- **Streaming: the agent can speak, but not share a world**
- **WebSockets: the pipe is fast; now build the room**

### Purpose

Compare three delivery models in one compact figure.

### Layout

Three horizontal rows with the same browser and server symbols.

#### Polling

```text
Browser ── request ──> Server
Browser <─ response ── Server
          repeated
```

Label:

> Scheduled checks

#### SSE

```text
Browser <════════════ Server
        continuous one-way stream
```

Label:

> Server-to-browser stream

#### WebSocket

```text
Browser ════════════ Server
        persistent two-way channel
```

Label:

> Bidirectional delivery

### Motion

Optional:

- repeated small pulse for polling;
- slow continuous pulse for SSE;
- one pulse in each direction for WebSockets.

Do not turn this into three full scenarios.

### Core idea

These technologies differ in how information travels, not in how conflicts are resolved.

---

## D2 — One Collision, Three Policies

### Referenced in

`article.md`, section **Delivering both changes does not resolve the conflict**.

### Purpose

Compare conflict semantics without another long animation.

### Layout

Three parallel panels showing the same node conflict.

#### Later value wins

Two ghost positions appear. One final position remains.

Label:

> Later value wins

#### Lock

One participant owns the node. The second is blocked.

Label:

> Lock while editing

#### Merge

One participant changes the label. Another changes the category. Both remain.

Label:

> Merge independent fields

### Motion

Optional one-time micro-animation in each panel.

The figure should remain understandable when static.

### Core idea

Conflict resolution is chosen per operation, not once for the entire application.

---

## D3 — Document, Presence, and Signal

### Referenced in

The sections:

- **Not everything belongs in the database**
- **Supabase: assemble the realtime lanes around Postgres**

### Purpose

Establish a vendor-neutral taxonomy, then reuse it for the Supabase mapping.

### Layout

One small canvas with three callouts.

#### Document

Example:

- created node;
- accepted edge;
- durable label.

Behavior:

> Remains after participants disconnect.

#### Presence

Example:

- participant cursor;
- selection;
- working status.

Behavior:

> Exists while the participant is connected.

#### Signal

Example:

- cursor movement;
- drag preview;
- `Agent is targeting this node`.

Behavior:

> Appears briefly and leaves no durable change.

### Supabase reuse

In the Supabase section, annotate the same figure:

- Document → Postgres or database-triggered Broadcast
- Presence → Presence
- Signal → Broadcast

Do not create a separate Supabase animation.

### Core idea

The application should decide what kind of information it is handling before choosing the transport.

---

## D4 — Event-Oriented and Query-Oriented Synchronization

### Referenced in

`article.md`, section **InstantDB: subscribe to the state you need**.

### Purpose

Compare two programming models without implying that complexity disappears.

### Layout

Two parallel paths.

#### Event-oriented

```text
Receive event
→ inspect type
→ update local state
→ reconcile optimistic state
```

#### Query-oriented

```text
Subscribe to nodes and edges
→ subscribed result stays current
```

### Optional micro-animation

Beside the query-oriented path:

1. user moves a node;
2. node updates immediately;
3. `pending` appears;
4. `synced` replaces it and fades.

### Core idea

A sync engine moves more synchronization behavior into the data layer.

It does not remove the underlying complexity.

---

## D5 — Decision Guide

### Referenced in

`article.md`, section **Choose the layer the interface actually needs**.

### Format

Use a static table.

| Interface need | Practical starting point |
|---|---|
| Check whether a background task completed | Polling |
| Stream agent output or progress | SSE |
| Build a specialized realtime protocol | WebSockets |
| Add realtime capabilities around Postgres | Supabase |
| Adopt an integrated sync-oriented backend | InstantDB |
| Add collaboration to an existing application | Liveblocks |
| Merge concurrent or offline edits | Yjs |

### Visual notes

- No ranking or winner
- Requirements in muted text
- Technology names in stronger weight
- Avoid vendor logos unless all options receive equal treatment

---

# Static comparison

## S1 — Alternatives Solve Different Layers

### Referenced in

`article.md`, section **Alternatives solve different layers**.

### Format

Use a static table or parallel cards.

### Entries

#### Liveblocks

Position:

> Collaboration added to an existing product

Good fit:

- presence;
- cursors;
- shared storage;
- comments;
- collaborative canvases.

#### Yjs

Position:

> Mergeable shared data structures

Good fit:

- offline editing;
- rich text;
- concurrent merge behavior.

#### Firebase

Position:

> Established database-to-client synchronization

Good fit:

- realtime application state;
- client subscriptions;
- existing Firebase ecosystems.

#### Custom sync engine

Position:

> Full ownership of collaboration semantics

Good fit:

- specialized protocols;
- unusual conflict rules;
- collaboration as core infrastructure.

### Visual notes

- Present options as parallel, not ranked
- Use the same typography and border system as the animation canvases
- Small flat SVG icons are acceptable
- No screenshots

---

# Recommended placement

## Narrative first half

### Interfaces used to be easy

**V1 — One User, One Action**

### Then the software started acting too

**V2 — A Second Actor Enters**

### One assistant becomes a room full of participants

**V3 — The Canvas Gets Crowded**

### Realtime is not the same as understandable

**V4 — From Haunted Canvas to Shared Workspace**

## Technical half

### Polling, SSE, and WebSockets

**D1 — Polling, SSE, and WebSockets**

### Conflict resolution

**D2 — One Collision, Three Policies**

### Document state, presence, and signals

**D3 — Document, Presence, and Signal**

Reuse D3 with Supabase labels in the Supabase section.

### InstantDB

**D4 — Event-Oriented and Query-Oriented Synchronization**

### Alternatives

**S1 — Alternatives Solve Different Layers**

### Decision guide

**D5 — Decision Guide**

## Conclusion

### Return to the canvas

**V5 — A Legible Multi-Agent Workspace**

---

# Visual rhythm

The article should not place a full animation in every section.

Recommended rhythm:

1. narrative animation;
2. prose;
3. another narrative animation;
4. technical diagrams and code;
5. final narrative animation.

The technical half should feel faster and more analytical than the opening.

## Size hierarchy

### Full-width narrative anchors

- V2
- V3
- V4
- V5

### Smaller opening scene

- V1

### Compact technical figures

- D1
- D2
- D3
- D4
- D5
- S1

---

# Reusable scene components

Build a small plain-JavaScript animation kit.

```text
createCanvasFrame(container, options)
createCursor(kind, options)
createParticipantLabel(text, options)
createGraphNode(id, options)
createGhostNode(id, options)
createIntentBadge(text, options)
createActivityLog(container)
createConnectionPulse(from, to, options)
createPhaseLabel(text, options)
createTimelineCaption(text, options)
```

Each factory should expose:

```js
{
  update(state) {},
  destroy() {},
}
```

## Useful timeline actions

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
setPhase
showCaption
```

## Scene state

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

---

# Performance

- Mount scenes only near the viewport
- Stop `requestAnimationFrame` when hidden
- Prefer transforms over layout changes
- Reuse SVG and DOM elements
- Keep node and edge counts small
- Precompute paths and keyframes
- Do not implement real networking
- Use deterministic timing
- Use deterministic seeds if any visual variation is introduced

---

# Editorial checklist

Before accepting any visual, confirm:

1. Does it communicate one primary idea?
2. Can a nontechnical reader explain what changed?
3. Does the prose interpret the visual instead of narrating it?
4. Is agency visible before consequential agent actions?
5. Is the loop understandable after one viewing?
6. Does reduced-motion mode preserve the point?
7. Is any vendor receiving more visual polish than the alternatives?
8. Are persistent state, presence, and signals represented accurately?
9. Does the conflict figure show an explicit policy rather than implying conflicts vanish?
10. Does the final frame remain calm?
11. Is this visual necessary, or would a static diagram communicate the point more efficiently?
