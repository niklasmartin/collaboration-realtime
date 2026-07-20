# Your Next AI Interface Is a Multiplayer Interface

## Status

Working essay outline. This is not polished article copy.

The article is structured as a visual story. Every major idea is demonstrated by a small, deterministic canvas animation. Animation IDs (V1–V10) refer to [`animations.md`](./animations.md). Two sections (12–13) use static styled diagrams instead of animations — see below.

---

## Core thesis

Software interfaces were largely designed around one active user: the user acts, the system responds, and the user acts again.

Agents change that participation model. First, an agent works alongside one user. Soon, multiple users and multiple specialized agents may observe, decide, and modify the same shared workspace at the same time.

This creates two related but distinct challenges:

1. **Synchronization:** How does every participant receive the latest state?
2. **Comprehension and control:** How does every participant understand who changed what, what is happening now, and how to intervene?

The technical argument should remain neutral: polling, SSE, WebSockets, managed realtime infrastructure, sync engines, and CRDT-based systems solve different layers of the problem. InstantDB is one reasonable option, not the inevitable winner.

---

## Tone and storytelling principles

- Write as an informed product and engineering essay, not a vendor comparison page.
- Begin with an observable interface moment, not infrastructure terminology.
- Return to the same canvas throughout the article so that complexity accumulates visually.
- Introduce technical concepts only after the reader has seen the problem they solve.
- Treat simple solutions respectfully. Polling is often correct when the requirements are simple.
- Keep the first half accessible to product, design, and business readers.
- Use the final third to demonstrate the engineering depth of the agency.
- Prefer vivid, slightly playful section openings followed by precise explanations.

---

# Proposed article structure

## 1. Opening: The canvas is getting crowded

### Story

Open inside a small node canvas. A user moves a node. A research agent creates evidence. A structure agent draws a connection. A second human selects the original node. Two participants approach the same object.

Stop at the moment before a collision and ask:

> Who is in control now?

The point is not that the interface is busy. The point is that several independent participants can now change the same world.

### Animation

Use **V1 — The Canvas Gets Crowded** from `animations.md` (anchor scene, full-width).

### Argument introduced

Modern agent interfaces are becoming multiplayer interfaces. This is both a user-experience problem and a distributed-systems problem.

### Sources

- Figma, **How Figma’s multiplayer technology works** — property-level conflict handling and last-value behavior:  
  https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- Figma, **Making multiplayer more reliable** — the infrastructure around an authoritative multiplayer service:  
  https://www.figma.com/blog/making-multiplayer-more-reliable/

---

## 2. Software used to pretend it had one user

### Story

Describe the old interaction contract:

1. The interface waits.
2. The user clicks.
3. The server processes the request.
4. The interface displays the result.
5. The user acts again.

Even software with many accounts often behaves like a single-player application within one session. The user remains the only visible initiator.

### Animation

Use **V2 — From Request to Mixed Initiative**, phase 1 only (the still request-response contract). V2 is a single two-phase scene shared with Section 3 below; phase 2 (the agent entering) plays after this section's argument has landed.

The stillness of this phase is important, and deliberate: nothing moves until the cursor clicks, and it sets up the contrast phase 2 depends on.

### Main argument

Traditional interfaces rely on a clear chain of agency. The person initiates an action, and the software responds. This makes causality and responsibility easy to understand.

### Sources

- Eric Horvitz, **Principles of Mixed-Initiative User Interfaces** — foundational framing for combining direct manipulation and automated initiative:  
  https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/
- Microsoft Research, **Guidelines for Human-AI Interaction** — visibility of capabilities, correction, dismissal, and user control:  
  https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/

---

## 3. Then an agent enters the interface

### Story

The user starts a research task. Instead of returning one final answer, the agent remains active:

- it reads;
- it creates a provisional object;
- it changes a status;
- it asks for approval;
- the user can interrupt or redirect it.

The software is no longer merely responding. Another participant is operating inside the interface.

### Animation

Use **V2 — From Request to Mixed Initiative**, phase 2 (the agent enters the same canvas from Section 2). This is the same scene as Section 2, continued — not a new canvas.

The agent should visibly announce intent before changing the canvas. A provisional node uses a dashed border and only becomes solid when accepted.

### Questions to introduce

- Is the agent thinking, waiting, proposing, or acting?
- What is provisional and what is committed?
- Can the user safely intervene while the agent is working?
- Who is responsible for the resulting change?

### Sources

- Microsoft Research, **Guidelines for Human-AI Interaction**:  
  https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/
- Eric Horvitz, **Principles of Mixed-Initiative User Interfaces**:  
  https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/

---

## 4. Realtime is not the same as understandable

### Story

Show the same canvas updating instantly but without cursors, labels, intent, or history. Nodes move and edges appear as if the document were haunted.

Then add explanatory layers one by one:

1. participant cursors;
2. names;
3. selections;
4. intent labels;
5. attribution;
6. undo.

The state is technically identical in both versions, but only the second version feels trustworthy.

### Animation

Use **V3 — From Haunted Canvas to Shared Workspace** (anchor scene, full-width).

### Five collaboration questions

Use these as a framework for the rest of the article:

1. **State:** What does the shared document contain?
2. **Presence:** Who is currently here?
3. **Intent:** What is each participant doing or preparing to do?
4. **Authority:** Who may change which objects?
5. **Conflict:** What happens when changes overlap?

### Main argument

A technically synchronized interface can still be unusable. Shared state needs visible agency, attribution, permissions, and recovery mechanisms.

### Sources

- Microsoft Research, **Guidelines for Human-AI Interaction**:  
  https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/
- Figma, **How Figma’s multiplayer technology works**:  
  https://www.figma.com/blog/how-figmas-multiplayer-technology-works/

---

## 5. The first implementation: “Anything new?”

### Story

Introduce polling through the experience rather than the protocol. The browser repeatedly asks whether the agent has finished. Most responses say that nothing changed. Eventually, a new node appears.

Polling should not be mocked. It is familiar, easy to debug, and often sufficient.

### Animation

Use **V4 — Polling: Are We There Yet?** (inline).

Optionally show two clients polling at different moments so that one canvas temporarily shows stale state.

### Explain polling

A client periodically sends an HTTP request:

```js
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

### Good fit

- background export status;
- a slow research task;
- notification counts;
- workflows where several seconds of delay are acceptable;
- simple systems where operational clarity matters more than immediacy.

### Drawbacks

- latency is bounded by the interval;
- most requests may return unchanged data;
- traffic grows with both participant count and polling frequency;
- overlapping and out-of-order responses require care;
- polling does not naturally express presence or live intent.

### Sources

- MDN, **Window: setInterval() method**:  
  https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
- MDN, **The WebSocket API** — useful as a contrast to repeated polling:  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

---

## 6. Streaming is not multiplayer

### Story

The agent produces text or progress continuously. It feels live, but the shared graph remains unchanged until one final result is committed.

### Animation

Use **V5 — The Agent Can Speak, but Not Share a World** (small inline scene).

The left side streams text. The right-side canvas remains still until the final node appears.

### Explain SSE

Server-Sent Events provide a long-lived, server-to-browser stream over HTTP. They are a strong fit for:

- token streaming;
- progress updates;
- agent logs;
- server notifications.

Browser-to-server actions still use ordinary HTTP requests.

### Central sentence

> Streaming lets an agent speak continuously. It does not by itself synchronize a shared workspace.

### Sources

- MDN, **Using server-sent events**:  
  https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

---

## 7. WebSockets: the pipe is fast; now build the room

### Story

Replace the repeated polling pulses with one persistent connection. A node moves on one canvas and immediately moves on another. For a moment, the system appears solved.

Then introduce the unanswered questions:

- reconnect?
- authorization?
- rooms?
- ordering?
- persistence?
- conflicts?
- optimistic state?

### Animation

Use **V6 — WebSockets Solve the Pipe** (inline).

The elegant connection gradually gains additional strands for presence, events, retries, acknowledgements, and persistence.

### Explain WebSockets

WebSockets provide persistent, bidirectional communication. They solve the transport problem, but they do not define the application’s shared-state semantics.

A custom implementation still needs to decide:

- how clients authenticate and join rooms;
- how events are ordered and deduplicated;
- how state is restored after reconnecting;
- which updates are persisted;
- how optimistic changes are reconciled;
- how simultaneous edits are resolved;
- how permissions are checked;
- how the infrastructure is monitored and scaled.

### High-level snippet

```js
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'node.moved') {
    applyRemoteNodePosition(message.nodeId, message.position);
  }
});
```

The snippet looks simple because the hard questions live around it.

### Sources

- MDN, **The WebSocket API**:  
  https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- Figma, **How Figma’s multiplayer technology works**:  
  https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- Figma, **Making multiplayer more reliable**:  
  https://www.figma.com/blog/making-multiplayer-more-reliable/
- InstantDB, **A backend for AI-coded apps** — vendor-authored explanation of the architecture around synchronization; use explicitly as InstantDB’s perspective:  
  https://www.instantdb.com/essays/architecture

---

## 8. What if two participants update the same node?

### Story

This is the central conflict-resolution scene. Two cursors reach the same node and drag it in opposite directions.

Do not present “conflict resolution” as one feature. Show that different operations can use different policies.

### Animation

Use **V7 — Overwrite, Lock, or Merge?** (anchor scene, full-width).

The animation cycles through three approaches:

1. **Last accepted value wins:** the node settles at the final received position.
2. **Locking:** the first editor temporarily owns the object.
3. **Property-level merge:** one participant changes the label while another changes a separate property, and both survive.

### Main argument

The right policy depends on the meaning of the operation.

A canvas may reasonably use:

- property-level last-write-wins for positions;
- coexistence for independent nodes and edges;
- explicit locks for destructive operations;
- previews and approval for consequential agent actions;
- CRDTs for data that genuinely needs concurrent merging.

### Sources

- Figma, **How Figma’s multiplayer technology works** — same-property/same-object conflicts and last value received:  
  https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- Figma, **Realtime editing of ordered sequences** — challenges involving concurrent edits to ordered structures:  
  https://www.figma.com/blog/realtime-editing-of-ordered-sequences/
- Yjs documentation — CRDT-based shared data types:  
  https://docs.yjs.dev/

---

## 9. Three kinds of realtime information

### Story

Before introducing products, separate the data categories. The same canvas produces three different kinds of information:

1. a node is created and must persist;
2. a cursor is present only while a participant is connected;
3. a transient activity pulse appears and disappears.

### Animation

Use **V8 — Three Lanes: Document, Presence, Signal**, phase 1 only (the taxonomy, before any vendor is named). V8 is a single two-phase scene shared with Section 10 below; phase 2 routes these same three lanes through Supabase.

### Concepts

- **Persistent document state:** nodes, edges, labels, completed agent actions.
- **Presence:** online participants, current selection, active document, slow-changing status.
- **Ephemeral signals:** cursor movement, drag previews, reactions, temporary agent intent.

### Important nuance

High-frequency cursor movement should generally not be written as durable database state. Presence itself may also be unsuitable for very high-frequency updates depending on the platform; Supabase’s official guidance recommends Broadcast rather than Presence for rapidly changing cursor data.

### Sources

- Supabase, **Realtime** — Broadcast, Presence, and Postgres Changes:  
  https://supabase.com/docs/guides/realtime
- Supabase, **Presence** — Presence is intended for slower-changing state; Broadcast is recommended for high-frequency updates:  
  https://supabase.com/docs/guides/realtime/presence
- InstantDB, **Presence and topics**:  
  https://www.instantdb.com/docs/presence-and-topics

---

## 10. Supabase: keep Postgres and assemble the realtime pieces

### Story

Show the canvas sending different information through different lanes:

- durable node changes through the database;
- cursor movement through Broadcast;
- participant status through Presence.

A second client reconstructs the complete experience from those channels.

### Animation

Use **V8 — Three Lanes: Document, Presence, Signal**, phase 2 (the same three lanes, now routed through Supabase's Broadcast/Presence/Postgres Changes and reconstructed on a second client). This is the same scene as Section 9, continued — not a new canvas.

### Explain the model

Supabase Realtime provides several primitives:

- **Broadcast:** low-latency messages between clients and database-triggered broadcasts;
- **Presence:** synchronized participant state;
- **Postgres Changes:** subscriptions to database changes.

Supabase’s current documentation recommends Broadcast for many database-change use cases as applications scale, while Postgres Changes remains convenient for simpler subscriptions.

### Why it is attractive

- Postgres remains the system of record.
- Existing SQL, relational models, and row-level security remain relevant.
- Persistent and ephemeral information can be modeled separately.
- Teams can add realtime capabilities without replacing the complete backend.

### Tradeoffs

- it is a set of primitives rather than a complete synchronization model;
- the application still owns optimistic UI and reconciliation decisions;
- conflict policies remain application-specific;
- channel lifecycle, reconnection, filtering, and quotas need deliberate handling;
- high-frequency cursor traffic should be throttled and placed on the appropriate mechanism;
- row-level security and fan-out behavior can affect scale and performance.

### High-level snippets

```js
const channel = supabase.channel(`canvas:${canvasId}`);

channel
  .on('broadcast', { event: 'cursor' }, ({ payload }) => {
    renderRemoteCursor(payload);
  })
  .subscribe();
```

```js
supabase
  .channel(`nodes:${canvasId}`)
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nodes' },
    ({ new: node }) => updateNode(node),
  )
  .subscribe();
```

Mention that a production architecture may instead broadcast database changes as recommended by current Supabase guidance.

### Sources

- Supabase, **Realtime Architecture**:  
  https://supabase.com/docs/guides/realtime/architecture
- Supabase, **Realtime**:  
  https://supabase.com/docs/guides/realtime
- Supabase, **Subscribing to Database Changes** — recommendation to use Broadcast for most scaled use cases:  
  https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
- Supabase, **Broadcast**:  
  https://supabase.com/docs/guides/realtime/broadcast
- Supabase, **Presence**:  
  https://supabase.com/docs/guides/realtime/presence
- Supabase, **Realtime Limits**:  
  https://supabase.com/docs/guides/realtime/limits
- AgileSoftLabs, **Supabase Realtime in Production** — use only as a secondary practitioner perspective, and verify changing limits against Supabase’s official documentation:  
  https://www.agilesoftlabs.com/blog/2026/05/supabase-realtime-in-production-what

---

## 11. InstantDB: subscribe to the shape of the world

### Story

Shift from event-oriented thinking to state-oriented thinking. The client declares that it needs nodes and edges. When a human or agent changes that data, the subscribed result changes.

Then show an optimistic drag:

1. the user moves the node locally;
2. it moves immediately;
3. a small pending indicator appears;
4. synchronization completes;
5. the indicator disappears.

### Animation

Use **V9 — InstantDB: Subscribe to the World** (inline).

### Explain the abstraction

InstantDB combines a database abstraction with reactive client queries, transactions, optimistic state, presence, and ephemeral topics.

For the example canvas:

- nodes and edges are persistent transactions;
- active participants and selections are presence;
- short-lived visual activity can use topics.

### High-level snippets

```js
const { data } = db.useQuery({
  nodes: {},
  edges: {},
});
```

```js
db.transact(
  db.tx.nodes[node.id].update({
    x: nextPosition.x,
    y: nextPosition.y,
    updatedBy: participantId,
  }),
);
```

### Why it is attractive

- reactive queries reduce manual refetch and cache-invalidation plumbing;
- optimistic transactions are part of the data model;
- persistence and synchronization use one integrated abstraction;
- presence and transient topics are available alongside durable state;
- frontend users and backend agents can write to the same conceptual model.

### Tradeoffs

- it requires greater commitment to InstantDB’s schema, query language, transactions, and permission model;
- adopting it may be a larger architectural shift than adding realtime capabilities to an existing Postgres backend;
- lower-level synchronization behavior is less directly controlled by the application;
- teams should verify current product limits and operational characteristics for their workload;
- self-hosting transfers monitoring, backups, and reliability responsibilities to the team.

### Neutral framing

> InstantDB removes more application-level synchronization work, but it also owns more of the application’s data architecture.

### Sources

- InstantDB, **Database in the Browser, a Spec** — vendor-authored conceptual argument for reactive data and local consistency:  
  https://www.instantdb.com/essays/db_browser
- InstantDB, **A backend for AI-coded apps** — current architecture overview:  
  https://www.instantdb.com/essays/architecture
- InstantDB, **A Graph-Based Firebase** — design motivations, optimistic updates, multiplayer, and offline behavior:  
  https://www.instantdb.com/essays/next_firebase
- InstantDB, **InstaQL**:  
  https://www.instantdb.com/docs/instaql
- InstantDB, **Presence and topics**:  
  https://www.instantdb.com/docs/presence-and-topics
- InstantDB, **Permissions**:  
  https://www.instantdb.com/docs/permissions
- InstantDB, **Self-hosting**:  
  https://www.instantdb.com/docs/self-hosting

---

## 12. Alternatives solve different layers

Keep this concise. Its purpose is to prevent the essay from becoming a binary Supabase-versus-InstantDB comparison.

**Visual note:** this section's visual is a static styled diagram/table, not an animation — see "Static diagrams" in `animations.md` (Collaboration layers table). No canvas, no cursors, no timeline.

### Liveblocks

#### Positioning

A specialist collaboration layer added to an existing application.

#### Good fit

- collaborative canvases and documents;
- presence, comments, cursors, and shared storage;
- teams that want to preserve an existing backend;
- node-and-edge canvas products where purpose-built collaboration integrations are valuable.

#### Visual

Row in the static Collaboration layers table (see `animations.md`).

#### Sources

- Liveblocks documentation:  
  https://liveblocks.io/docs

### Yjs

#### Positioning

A lower-level CRDT-based collaborative data model.

#### Good fit

- concurrent edits that should merge rather than overwrite;
- rich-text or structured-document editing;
- offline-first behavior;
- teams prepared to choose or operate transport and persistence separately.

#### Visual

Row in the static Collaboration layers table (see `animations.md`).

#### Sources

- Yjs documentation:  
  https://docs.yjs.dev/

### Firebase

#### Positioning

The established database-to-client synchronization model and an important historical comparison for newer sync-oriented systems.

#### Sources

- Firebase Realtime Database documentation:  
  https://firebase.google.com/docs/database
- Cloud Firestore realtime listeners:  
  https://firebase.google.com/docs/firestore/query-data/listen

### Custom sync engine

#### Positioning

Appropriate when collaboration behavior is core intellectual property, conflict semantics are unusual, or the scale profile justifies owning the full stack.

#### Sources

- Figma, **How Figma’s multiplayer technology works**:  
  https://www.figma.com/blog/how-figmas-multiplayer-technology-works/
- Figma, **Making multiplayer more reliable**:  
  https://www.figma.com/blog/making-multiplayer-more-reliable/

---

## 13. Decision guide: choose the layer you actually need

This section should be a neutral decision framework rather than a ranking.

**Visual note:** this section's visual is a static styled diagram/table, not an animation — see "Static diagrams" in `animations.md` (Decision guide table). Requirements in one column, technologies in the other; no podium, no hierarchy.

### Use polling when

- changes are infrequent;
- delay is acceptable;
- the UI displays task status rather than shared activity;
- simplicity and stateless infrastructure are primary concerns.

### Use SSE when

- information mostly flows from server to browser;
- token or progress streaming is the central interaction;
- persistent shared state is handled separately.

### Use custom WebSockets when

- the protocol is highly specialized;
- the team needs low-level control;
- it can own connection infrastructure, synchronization semantics, and operational complexity.

### Use Supabase Realtime when

- Postgres should remain the source of truth;
- the team wants managed Broadcast, Presence, and database events;
- application-specific optimistic and conflict behavior is acceptable.

### Use InstantDB when

- synchronized state is central to the product;
- the project can adopt a sync-oriented backend abstraction;
- reducing frontend/backend state plumbing is more valuable than retaining a conventional Postgres-centered architecture.

### Use Liveblocks when

- collaboration is being layered onto an existing application;
- a canvas, document, comments, or presence are the main feature;
- purpose-built collaboration APIs are preferable to replacing the application database.

### Use Yjs when

- concurrent merging is a defining requirement;
- offline editing matters;
- the team is prepared to assemble transport, authorization, and persistence around CRDT data structures.

### Visual

The static Decision guide table (see `animations.md`), not an animated scene.

---

## 14. Return to the canvas: users and agents sharing one world

### Story

Return to the opening scene, but now the interface has clear conventions:

- the user creates a problem node;
- the research agent announces intent and adds evidence;
- the structure agent highlights two targets before connecting them;
- the user moves a node while both agents continue;
- one action collides with another;
- the selected conflict policy is applied;
- the activity log records the outcome;
- the user undoes one agent action.

The final canvas should feel calm, not crowded.

### Animation

Use **V10 — A Legible Multi-Agent Workspace** (anchor scene and closer, full-width). V10 continues into the article's closing captions — see Section 15.

### Main argument

A successful agent interface is not merely realtime. It is:

- legible;
- attributable;
- interruptible;
- permissioned;
- reversible;
- explicit about conflicts.

---

## 15. Conclusion: Design for participants, not requests

### Story

This section has no separate scene of its own. It is the closing beat of **V10** (Section 14): once the multi-agent workspace settles into its calm final frame, the closing captions fade in over that same still canvas — first the two framing questions below, then the final line. There is no standalone "evolution" replay; the reader has just watched that evolution happen across the whole article.

### Animation

Continued from **V10 — A Legible Multi-Agent Workspace**: the closing-caption beat over the calm final frame.

### Closing distinction

The article should end by separating two questions:

> How does a change reach everyone?

and:

> How does everyone understand and safely act on that change?

Polling, SSE, sockets, subscriptions, and sync engines address delivery and state synchronization at different levels. Presence, intent, attribution, permissions, conflict policies, and undo make that shared state usable.

### Proposed final line

> The next generation of AI products should not be designed around requests. It should be designed around participants.

---

# Suggested article balance

For an article of approximately 3,000 words:

- Opening and participation-model thesis: **20%**
- UX, agency, and conflict framing: **25%**
- Polling, SSE, and WebSockets: **20%**
- Supabase, InstantDB, and alternatives: **25%**
- Decision guide and conclusion: **10%**

InstantDB should occupy only part of the technical section. The article should make it plausible that a reader could choose polling, Supabase, Liveblocks, Yjs, or a custom socket architecture based on their own constraints.

---

# Editorial safeguards against vendor bias

- Label vendor essays as vendor-authored viewpoints.
- Prefer official documentation for current capabilities, architecture, quotas, and limits.
- Use practitioner blog posts only as secondary operational perspectives.
- Do not compare raw lines of sample code as if they represented total production complexity.
- Compare tools at the correct abstraction level.
- State what each option does **not** solve.
- Avoid universal claims such as “WebSockets do not scale” or “sync engines remove conflicts.”
- Explain the trade: higher-level tools remove application work by taking ownership of more architecture.
- Keep the final decision guide requirement-driven rather than declaring a winner.
