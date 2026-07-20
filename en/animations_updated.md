# Animation Playbook: Updated Opening

This document defines the visual story for V1, V3, and V4. V2 is already implemented and acts as the bridge between the single-user world and the multiplayer world.

## Shared visual language

All opening animations should feel like parts of the same product and the same story.

- Dark, restrained canvas.
- Thin neutral borders.
- Smooth movement without bounce or exaggerated easing.
- One primary action at a time.
- Cursors act as characters.
- Agent identity appears through a labeled cursor and a subtle accent.
- Human identity appears through a standard cursor and a compact name tag.
- Changes settle before the next action begins.
- Every animation should loop cleanly.
- No user interaction is required.
- The camera stays fixed.
- The animation should remain understandable without reading a caption.

The scenes should feel editorial, closer to a Figma engineering essay than to a product onboarding animation.

---

# V1 — One User, One Action

## Role in the article

V1 introduces the old interaction model:

> A person acts. The software responds.

Its job is not to show an impressive interface. Its job is to establish calm, obvious causality. The scene should feel almost uneventful compared with everything that follows.

## Connection to V2

V1 should use the same canvas language as V2, but with no agent and much less activity.

V2 then feels like the same product after a second actor has entered it.

## Canvas setup

Use a simple decision canvas with three elements:

- A top prompt node: `Why are customers churning?`
- An empty or muted solution area below it.
- A compact action field or button labeled `Add idea`.

Only one human cursor is present.

The canvas is completely still before the cursor moves.

## Story sequence

### 1. Rest

The canvas sits unchanged for roughly one second.

No loading shimmer. No ambient agent activity. No unexplained movement.

### 2. The user approaches

The cursor labeled `You` moves toward `Add idea`.

The movement should be direct and unhurried.

### 3. The user acts

The cursor clicks.

A short text value appears:

`Onboarding emails`

The action control confirms the input with a restrained pressed state.

### 4. The system responds

A new node appears beneath the original question.

It should not pop dramatically. It can fade and scale from approximately 0.98 to 1 while the connecting edge draws in.

### 5. The state settles

The cursor moves slightly away.

The new node remains.

Nothing else happens.

### 6. Loop hold

Hold the completed state long enough for the reader to register the cause-and-effect relationship.

Then reset with a short crossfade.

## Core visual idea

There is only one plausible explanation for the new node:

The user created it.

No attribution UI is necessary. No activity log is necessary. No presence is necessary. The simplicity is the point.

## Optional minimal caption

> One action has one obvious owner.

Avoid captions that narrate the mechanics, such as:

> You click “Add idea” and a node appears.

The animation already shows that.

## Timing

Suggested total duration: 6–7 seconds.

- Rest: 1.0 s
- Cursor movement: 0.8 s
- Click and input: 0.7 s
- Node creation: 0.8 s
- Settled hold: 2.0 s
- Reset: 0.7 s

## Implementation notes

- Use deterministic keyframes.
- Do not use a real input.
- The typed value can be animated as two or three quick text groups rather than character-by-character.
- Keep the node creation aligned with the visual language of V2.
- Preserve the same canvas dimensions and typography as V2 where possible.

---

# V2 — Existing bridge animation

## Current final concept

V2 contains one user and one research agent.

The user types `Onboarding emails` while the agent works.

The user's card moves left to make room for the agent's proposal. The research result later nests inside the user's card as provisional, dashed content until it is confirmed.

## Story function

V2 introduces four ideas without needing to spell them out in prose:

- The software is now an actor.
- Human and agent actions can overlap.
- Agent work can be provisional.
- The interface must create space for a second participant.

V3 should build directly from this scene rather than resetting to an unrelated product.

---

# V3 — The Canvas Gets Crowded

## Role in the article

V3 expands the interaction model:

> One user and one agent become several humans and several agents.

The scene should not immediately become chaotic. It should begin as a natural continuation of V2 and become difficult only when participants converge.

## Connection to V2

Start from a canvas that resembles V2 after both the user's idea and the research agent's proposal have been accepted.

Suggested existing nodes:

- `Why are customers churning?`
- `Onboarding emails`
- `Win-back offer`
- `Welcome series research`

The visual should feel as though the article has zoomed out slightly and revealed that the same workspace has more participants.

## Participants

Use four participants:

- `You` — human
- `Maya` — second human
- `Research agent`
- `Structure agent`

The two agents should have distinct, stable roles.

### Research agent

Adds evidence or context.

### Structure agent

Connects, groups, or reorganizes existing material.

## Story sequence

### 1. Familiar starting point

Show the accepted result of V2.

`You` remains near the `Onboarding emails` node.

The `Research agent` is present but inactive for a moment.

### 2. The workspace opens up

A second human cursor, `Maya`, enters from the right.

A second agent cursor, `Structure agent`, enters from the top or lower edge.

Do not introduce everyone at the same instant. Stagger arrivals.

### 3. Independent work begins

Each participant performs a different, understandable action:

- `Research agent` creates a small evidence node beneath `Onboarding emails`.
- `Structure agent` begins drawing a relation toward `Win-back offer`.
- `Maya` selects the main churn question.
- `You` begins dragging `Onboarding emails` slightly to the left.

The actions can overlap, but each should remain visually legible.

### 4. The first moment of tension

While `You` is still holding `Onboarding emails`, the `Structure agent` moves toward the same node because it wants to reposition or connect it.

The target node gains two subtle intent indicators.

Do not resolve the conflict yet.

### 5. A second convergence

`Maya` moves toward the top question while the `Research agent` targets it for an evidence connection.

The canvas now contains several reasonable actions that are individually harmless but collectively ambiguous.

### 6. Freeze on the question

Hold for a short beat with two participants converging on the same object.

The final frame should make the question obvious without text:

Who controls this object now?

### 7. Reset

Fade participant cursors first, then restore the initial accepted V2 state.

## Core visual idea

The problem is not that four participants exist.

The problem is that four participants can act independently on shared state, and the interface can no longer rely on obvious causality.

## Optional minimal caption

> More participants change more than the amount of activity.

Alternative:

> Shared state needs shared rules.

## What not to show yet

Do not solve the conflict in V3.

Do not add a complete activity log.

Do not show locks, undo, or conflict resolution.

Those belong in later visualizations. V3 should create the problem.

## Timing

Suggested total duration: 9–11 seconds.

- Familiar state: 1.0 s
- Participant arrivals: 1.5 s
- Independent actions: 3.0 s
- Convergence: 2.0 s
- Hold: 1.5 s
- Reset: 1.0 s

## Implementation notes

- Reuse node positions and visual components from V2.
- Keep cursor paths deliberate.
- Avoid four simultaneous text labels.
- Use target highlights to show intent before mutation.
- Limit newly created content to one small evidence node.
- Let one edge draw partially, then pause as the conflict emerges.
- The loop should end before any resolution, preserving the open question.

---

# V4 — From Haunted Canvas to Shared Workspace

## Role in the article

V4 demonstrates the difference between:

- synchronized state;
- understandable collaboration.

Both halves of the animation should show the same underlying changes. Only the explanatory interface layers should differ.

## Connection to V3

Use the same multi-participant canvas and similar actions.

V3 ended with ambiguity.

V4 shows that faster synchronization alone does not remove that ambiguity.

## Presentation format

Use one canvas in two consecutive phases rather than a split-screen comparison.

This makes the transformation feel stronger:

1. The canvas runs in a “haunted” mode.
2. It resets.
3. The exact same sequence runs again with collaboration cues.

A subtle phase label can appear in a corner:

- `State only`
- `State + context`

## Phase 1 — Haunted canvas

### Setup

No participant cursors are visible.

No agent names appear.

No selected states or intent previews appear.

No activity history is shown.

### Sequence

- `Onboarding emails` moves slightly left.
- A new evidence node appears beneath it.
- An edge draws from the evidence node to `Win-back offer`.
- The top question changes from a neutral state to `Reviewed`.

All changes are smooth and perfectly synchronized.

But nothing explains them.

### Tone

The canvas should not glitch.

It should work perfectly and still feel uncomfortable.

That distinction matters: this is not a broken realtime system. It is a technically correct but socially illegible one.

## Transition

Fade the canvas back to its starting state.

Reveal the second phase label:

`State + context`

## Phase 2 — Shared workspace

Run the same actions again, with explanatory layers.

### Before the node moves

- `You` appears.
- The cursor approaches `Onboarding emails`.
- The node shows a subtle human selection outline.
- The cursor drags it left.

### Before evidence appears

- `Research agent` appears.
- A short label reads `Adding evidence`.
- A provisional outline shows where the new evidence node will land.
- The node becomes committed after it appears.

### Before the edge draws

- `Structure agent` approaches the source node.
- Both source and target nodes highlight.
- A short label reads `Connecting evidence`.
- The edge draws.

### Before the review state changes

- `Maya` selects the top question.
- Her name appears near the cursor.
- The state changes to `Reviewed`.

### After each action

Add a compact activity entry at the bottom:

- `You moved Onboarding emails`
- `Research agent added evidence`
- `Structure agent connected evidence`
- `Maya marked question reviewed`

The newest entry can appear briefly, then settle into a compact list or ticker.

### Control layer

After the agent-created edge lands, show a small `Undo` action beside the newest activity entry.

It does not need to be clicked.

Its presence communicates reversibility.

## Core visual idea

The state is identical in both phases.

The second phase becomes usable because the interface exposes:

- presence;
- identity;
- intent;
- attribution;
- provisional state;
- reversibility.

## Optional minimal caption

> Same state. Different understanding.

This is preferable to a caption that enumerates every visual layer.

## Timing

Suggested total duration: 14–16 seconds.

### Haunted phase

- Starting hold: 0.8 s
- Four unexplained changes: 3.5 s
- Hold: 1.0 s

### Transition

- Reset: 0.8 s
- Phase label: 0.5 s

### Shared phase

- Four explained changes: 5.5 s
- Final hold: 1.5 s
- Reset: 0.8 s

## Implementation notes

- Use exactly the same node positions and end states in both phases.
- Keep action timing nearly identical.
- The comparison should be about context, not speed.
- Activity entries should remain secondary to the canvas.
- Intent labels should appear before actions and disappear shortly after.
- Presence is temporary; attribution remains in the activity history.
- Use a small pending or provisional treatment only for the agent-created node.
- Avoid adding permission controls here. Authority is introduced in the prose but can be visualized later.

---

# Opening sequence as a whole

The first four visualizations now form one continuous escalation:

## V1

One user controls a passive application.

## V2

One agent begins working alongside the user.

## V3

Several humans and agents share the same state.

## V4

Synchronization alone is not enough; the interface must explain the activity.

The visual thesis becomes:

> Single-user interfaces could leave causality implicit. Multiplayer agent interfaces have to make it visible.
