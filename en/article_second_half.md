## From interface problem to systems problem

Once several participants can act on the same workspace, the architecture has two jobs.

First, changes have to reach everyone.

Second, simultaneous changes have to settle into one coherent state.

Those are related, but they are not the same problem. A fast connection can deliver two conflicting edits perfectly. It cannot decide which one should win. A database can persist every action correctly. It cannot explain to a user why a node moved while they were reading it.

The technical options below solve different parts of this system. Some move information. Some synchronize state. Some help merge concurrent changes. None replaces the need for deliberate interface rules.

## Polling: “Anything new?”

The simplest way to keep an interface updated is to ask repeatedly.

A browser requests the latest state, waits for a fixed interval, then requests it again.

```js
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

Polling is easy to underestimate because its behavior is so simple. That simplicity is often exactly what a product needs.

It works well for:

- background export status;
- long-running research jobs;
- notification counters;
- workflows where a few seconds of delay are acceptable;
- applications where operational simplicity matters more than immediacy.

The backend can remain largely stateless. Requests use ordinary HTTP. Failures are familiar and easy to inspect.

The tradeoff is that the browser asks whether anything changed even when nothing did. The visible delay is tied directly to the polling interval: a three-second interval can leave the interface almost three seconds behind. Increase the frequency and the number of empty requests grows with every connected client.

Different clients may also disagree temporarily. One browser may already show a newly completed research node while another still shows the previous canvas.

Polling is therefore a good fit for asking:

> Has the task finished?

It is a poor fit for asking:

> What is another participant doing to this object right now?

## Streaming: the agent can speak, but not share a world

Streaming makes an agent feel immediate.

Its answer arrives word by word. Progress appears continuously. The user can see that something is happening before the task has finished.

That is useful, but it is not the same as synchronizing shared application state.

A research agent can narrate its work in a live side panel while the canvas remains unchanged. Only when the task completes does one final evidence node appear in the graph.

Server-Sent Events are commonly used for this kind of interaction. They keep a one-way connection open from the server to the browser and allow the server to push new messages whenever they are available.

They fit:

- token streaming;
- progress updates;
- agent logs;
- server notifications;
- long-running operations where the browser mostly listens.

Actions in the other direction—clicking, approving, dragging, cancelling—still travel through ordinary HTTP requests.

Streaming solves an important UX problem: it prevents a long-running agent from feeling silent.

It does not by itself solve:

- shared document state;
- participant presence;
- simultaneous editing;
- conflict resolution;
- synchronized optimistic updates.

A chat panel can be perfectly live while the workspace beside it remains single-player.

## WebSockets: the pipe is fast; now build the room

Polling asks for changes on a schedule. WebSockets allow either side to send a change as soon as it happens.

When one participant moves a node, the server can immediately forward that event to every other connected participant.

```js
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'node.moved') {
    applyRemoteNodePosition(message.nodeId, message.position);
  }
});
```

The visible handler is small. The system around it usually is not.

Once a product relies on persistent connections, several new responsibilities appear.

### Connection

What happens after a disconnect? How does the client reconnect? How are missed, repeated, or out-of-order messages handled?

### Access

Who may join a room? Which participants may read or modify a particular document?

### State

Which events are temporary, and which become durable application data? How does a newly connected client reconstruct the current canvas?

### Concurrency

What happens when the local interface has already applied an optimistic update and a conflicting server event arrives?

### Operations

How are thousands of long-lived connections monitored, balanced, and recovered?

A WebSocket solves bidirectional delivery. It does not define the shared-state model that travels through it.

Custom WebSocket systems are still the correct choice when:

- the protocol is highly specialized;
- the collaboration behavior is core to the product;
- very low-level control is required;
- the team is prepared to own the coordination infrastructure.

The important distinction is not that WebSockets are primitive. It is that they solve the transport layer, while the application still owns the room.

[D1: Three ways updates reach the browser — Compare polling, SSE, and WebSockets in one compact diagram. Polling shows repeated requests, SSE shows a continuous one-way stream, and WebSockets show a persistent two-way channel.]

**Sources:** MDN, [Window: setInterval() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval); MDN, [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events); MDN, [The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/); InstantDB, [A backend for AI-coded apps](https://www.instantdb.com/essays/architecture) (vendor-authored)

## Delivering both changes does not resolve the conflict

Imagine that a person and the structure agent both grab the same node.

The person moves it left to make room for a new idea. At almost the same moment, the agent moves it right to align the graph.

Both actions can arrive quickly and reliably. The system still has to decide what they mean.

There is no single universal form of conflict resolution. Different operations need different rules.

### Last accepted value wins

Both changes are accepted, but only one final value remains.

This works well for inexpensive, continuous properties such as:

- node position;
- zoom level;
- object size;
- temporary layout adjustments.

If the result is wrong, moving the node again is cheap.

The action history can still record both attempts even though only one final coordinate survives.

### Lock while editing

The first participant to begin an operation receives temporary ownership.

Others can see that the object is in use but cannot modify it until the operation finishes.

This is useful when overlapping changes would be destructive or expensive, such as:

- deleting a section;
- restructuring a document;
- changing a workflow state;
- approving a consequential agent action.

Locking prevents silent overwrite, but it introduces waiting.

### Merge independent properties

Two participants may edit the same object without actually editing the same value.

A user can change a node label while an agent assigns a category. Both changes can survive because they affect independent properties.

This is often the simplest and most useful form of merging. Many apparent conflicts disappear once the system models changes at a sufficiently precise level.

A real interface usually needs several policies at once:

- last-write-wins for position;
- property-level merging for independent fields;
- locks for destructive operations;
- preview and approval for consequential agent actions;
- CRDT-based merging where truly concurrent edits must combine.

The question is not:

> Which conflict strategy does this application use?

It is:

> Which strategy does this operation require?

[D2: One collision, three policies — Show the same node conflict in three compact panels: later value wins, temporary lock, and independent fields merge.]

**Sources:** Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Realtime editing of ordered sequences](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/); Yjs documentation, [https://docs.yjs.dev/](https://docs.yjs.dev/)

## Not everything belongs in the database

A collaborative canvas produces several kinds of information at once.

Some of it describes the document itself. Some of it only matters while a participant is present. Some of it matters for less than a second.

Treating all three as ordinary database rows creates unnecessary work and often makes the system harder to reason about.

### Document state

This is the durable shared object:

- nodes;
- edges;
- labels;
- accepted agent contributions;
- completed actions;
- permissions and workflow state.

It should survive disconnection and be available to participants who join later.

### Presence

Presence describes who is currently in the workspace and what they are doing at a coarse level:

- connected participants;
- current selection;
- active tool;
- editing status;
- slower-changing participant metadata.

Presence is temporary. When a participant leaves, it should normally disappear.

### Ephemeral signals

Some information exists only to coordinate immediate activity:

- cursor movement;
- drag previews;
- hover state;
- reactions;
- “agent is about to connect these nodes”;
- transient animation triggers.

These events are useful to connected participants, but usually should not become durable application data.

A cursor may move dozens of times per second. Persisting every movement would turn a visual hint into a database workload.

This distinction matters regardless of which product or infrastructure is selected. It is a property of the interaction model, not of a particular vendor.

[D3: Document, presence, and signal — Use one canvas with three callouts. A created node remains, a cursor disappears when its owner disconnects, and a temporary agent-intent pulse fades without changing the document.]

## Supabase: assemble the realtime lanes around Postgres

Supabase approaches realtime collaboration from a Postgres-centered architecture.

The database remains the durable system of record. Realtime functionality is added through separate primitives for persistent changes and temporary participant activity.

Supabase Realtime exposes three relevant mechanisms.

### Broadcast

Broadcast sends low-latency messages through a channel.

It fits temporary events such as:

- cursor movement;
- drag previews;
- transient agent activity;
- custom events that should reach connected clients immediately.

```js
const channel = supabase.channel(`canvas:${canvasId}`);

channel
  .on('broadcast', { event: 'cursor' }, ({ payload }) => {
    renderRemoteCursor(payload);
  })
  .subscribe();
```

### Presence

Presence synchronizes temporary participant state.

It can represent:

- who is connected;
- which node is selected;
- which tool a participant is using;
- whether an agent is idle, working, or waiting.

### Database changes

Persistent application changes can be distributed from Postgres.

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

Supabase also supports broadcasting database-triggered changes, and its documentation recommends Broadcast for many scaled database-change scenarios rather than relying exclusively on direct Postgres Changes subscriptions.

The architectural appeal is clear:

- Postgres remains the source of truth;
- existing SQL and relational models remain useful;
- row-level security can continue governing access;
- persistent and ephemeral information remain separate.

The tradeoff is that Supabase provides primitives rather than a complete synchronization model.

The application still decides:

- how optimistic updates work;
- how local and remote changes reconcile;
- which conflict rules apply;
- how reconnects restore state;
- how channels are created and cleaned up;
- how high-frequency activity is throttled.

Supabase is therefore a strong fit when a team wants to keep Postgres at the center and is comfortable assembling the collaboration behavior explicitly.

[Reuse D3 with implementation labels — Document maps to Postgres or database-triggered Broadcast, Presence maps to Supabase Presence, and temporary signals map to Broadcast.]

**Sources:** Supabase, [Realtime](https://supabase.com/docs/guides/realtime); Supabase, [Presence](https://supabase.com/docs/guides/realtime/presence); Supabase, [Realtime Architecture](https://supabase.com/docs/guides/realtime/architecture); Supabase, [Subscribing to Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes); Supabase, [Broadcast](https://supabase.com/docs/guides/realtime/broadcast); Supabase, [Realtime Limits](https://supabase.com/docs/guides/realtime/limits); AgileSoftLabs, [Supabase Realtime in Production](https://www.agilesoftlabs.com/blog/2026/05/supabase-realtime-in-production-what) (secondary practitioner perspective)

## InstantDB: subscribe to the state you need

Supabase gives an application several realtime building blocks to combine.

A sync-oriented database such as InstantDB starts at a different abstraction level.

Instead of writing a handler for every event that might change the canvas, the client declares which data it needs. The system keeps that result current as humans and agents modify it.

```js
const { data } = db.useQuery({
  nodes: {},
  edges: {},
});
```

A write is expressed as a transaction against the shared data model:

```js
db.transact(
  db.tx.nodes[node.id].update({
    x: nextPosition.x,
    y: nextPosition.y,
    updatedBy: participantId,
  }),
);
```

The conceptual difference is:

### Event-oriented

```text
Receive node.moved
→ inspect the message
→ update local state
→ reconcile with optimistic state
```

### Query-oriented

```text
Subscribe to nodes and edges
→ subscribed result stays current
```

The complexity does not disappear. More of it moves into the synchronization layer.

For the canvas, the model could be:

- nodes and edges: transactions;
- active participants and selections: presence;
- temporary activity: topics.

Optimistic local behavior is part of the client model. The user can move a node immediately without waiting for a round trip, while the underlying transaction is synchronized in the background.

That can substantially reduce application-specific code for:

- cache invalidation;
- subscription handling;
- optimistic updates;
- local reconciliation;
- keeping several views consistent.

The tradeoff is architectural commitment.

Adopting InstantDB means adopting more than a transport channel:

- its schema model;
- its query language;
- its transaction API;
- its permissions system;
- its synchronization behavior.

That is a larger decision than adding realtime delivery to an existing Postgres backend.

The fair comparison is therefore not:

> InstantDB is better than Supabase.

It is:

> InstantDB owns more synchronization work, while Supabase leaves more of that work in the application.

The right choice depends on whether reducing synchronization plumbing is worth adopting a more opinionated backend abstraction.

[D4: Event-oriented versus query-oriented synchronization — Compare a short event-handling chain with a subscribed-result model. Optionally add a small pending-to-synced state beside the InstantDB path.]

**Sources:** InstantDB, [Database in the Browser, a Spec](https://www.instantdb.com/essays/db_browser) (vendor-authored); InstantDB, [A backend for AI-coded apps](https://www.instantdb.com/essays/architecture) (vendor-authored); InstantDB, [InstaQL](https://www.instantdb.com/docs/instaql); InstantDB, [Presence and topics](https://www.instantdb.com/docs/presence-and-topics); InstantDB, [Permissions](https://www.instantdb.com/docs/permissions); InstantDB, [Self-hosting](https://www.instantdb.com/docs/self-hosting)

## Alternatives solve different layers

Supabase and InstantDB are not the only reasonable choices, and several relevant alternatives solve different parts of the architecture.

### Liveblocks: collaboration added to an existing product

Liveblocks is a specialist collaboration layer rather than a general application database replacement.

It provides features such as:

- presence;
- cursors;
- shared storage;
- comments;
- collaborative React Flow integrations.

It fits teams that already have a backend and want to add a focused collaboration layer around canvases, documents, or discussions.

### Yjs: data structures designed to merge

Yjs provides CRDT-based shared data types.

Two disconnected participants can edit the same document independently and later merge their changes without replacing the entire document with one winner.

It fits cases where:

- offline work matters;
- concurrent merge behavior is central;
- rich-text or structured collaborative editing is a core requirement.

Yjs sits at a lower level than Supabase or InstantDB. Teams still choose the networking, persistence, authentication, and operational layers around it.

### Firebase: established database-to-client synchronization

Firebase Realtime Database and Firestore listeners remain established models for client applications that subscribe directly to changing backend data.

They are useful reference points for products such as InstantDB because they demonstrate both the appeal and the long history of database-driven realtime interfaces.

### Custom sync engine: collaboration as core infrastructure

A custom sync engine makes sense when:

- collaboration semantics are part of the product’s intellectual property;
- no existing system fits the conflict model;
- scale justifies specialized infrastructure;
- the team needs complete control over ordering, validation, and persistence.

Figma is the obvious example. It is also evidence of the amount of engineering this route requires.

**Sources:** Liveblocks, [React Flow integration](https://liveblocks.io/docs/api-reference/liveblocks-react-flow); Liveblocks, [documentation](https://liveblocks.io/docs); Yjs documentation, [https://docs.yjs.dev/](https://docs.yjs.dev/); Firebase, [Realtime Database documentation](https://firebase.google.com/docs/database); Firebase, [Cloud Firestore realtime listeners](https://firebase.google.com/docs/firestore/query-data/listen); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## Choose the layer the interface actually needs

There is no universal winner because these options answer different questions.

### Simple delivery

**Polling**

Use when updates are infrequent, delay is acceptable, and the interface mainly reports task status.

**SSE**

Use when information mostly flows from the server to the browser, especially for agent output or progress.

### Realtime infrastructure

**Custom WebSockets**

Use when the protocol is specialized enough to justify owning connection management, ordering, rooms, persistence, and reconciliation.

**Supabase Realtime**

Use when Postgres should remain the source of truth and the application can assemble collaboration from Broadcast, Presence, and database events.

### Higher-level synchronization

**InstantDB**

Use when synchronized client state is central and the project can adopt an integrated, sync-oriented backend model.

**Liveblocks**

Use when collaboration should be added to an existing product without replacing its main backend.

**Yjs**

Use when concurrent merging and offline editing are defining requirements.

| Interface need | Practical starting point |
|---|---|
| Check whether a background task completed | Polling |
| Stream agent output or progress | SSE |
| Build a specialized realtime protocol | WebSockets |
| Add realtime capabilities around Postgres | Supabase |
| Adopt an integrated sync-oriented backend | InstantDB |
| Add collaboration to an existing application | Liveblocks |
| Merge concurrent or offline edits | Yjs |

These are starting points, not automatic answers. A production system may combine several of them.

## Return to the canvas

Return to the crowded canvas from the beginning.

The same participants are still active:

- the user;
- another human reviewer;
- the research agent;
- the structure agent.

The amount of activity has not decreased.

What changes is that the activity has become understandable.

[V5: A legible multi-agent workspace — The user creates an idea while the research agent announces that it is adding evidence. The structure agent highlights two targets before connecting them. A second human reviews the top-level question. When an agent action conflicts with a human edit, the interface applies a visible policy and records the result in the activity history.]

Nothing an agent does arrives without context.

Its target becomes visible before the action. Provisional work looks provisional. Completed work is attributed. Consequential changes can be interrupted or undone. When two actions overlap, the result follows a rule that the interface can explain.

The final canvas is no less active than the crowded version.

It feels calmer because actions arrive with identity, intent, and a clear way to intervene.

## Design for participants, not requests

The argument reduces to two questions:

> How does a change reach everyone?

and:

> How does everyone understand and safely act on that change?

Polling, SSE, WebSockets, managed realtime services, and sync engines answer the first question at different levels of abstraction.

Presence, intent, attribution, permissions, conflict policies, and undo answer the second.

A fast connection cannot replace a legible interaction model.

The next generation of AI products should not be designed around requests.

It should be designed around participants.
