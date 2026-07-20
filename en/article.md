# Your Next AI Interface Is a Multiplayer Interface

## Interfaces used to be easy

For most of the history of software, interfaces followed a simple rhythm:

A person did something. The software responded.

The action might have been clicking a button, submitting a form, editing a spreadsheet cell, or moving an object on a canvas. The control itself did not matter. What mattered was that the person initiated the change and the application reacted to it.

[V1: One User, One Action — "A person initiates a change in an otherwise passive application."]

This model made interfaces easy to reason about.

When something changed, the cause was usually obvious: the user had just done something. The interface did not need to explain who was responsible, because there was only one plausible answer. Undo meant reversing the person's last action. A loading indicator meant the application was processing their request. While the user waited, the interface remained still.

Even software used by large teams often preserved this model locally. Hundreds of people might have access to the same project, but each individual screen still behaved as though one person was currently holding the controls.

There was a clear boundary between actor and tool.

The person acted. The software waited.

## Then the software started acting too

An agent is not simply another way to trigger a conventional request. It can continue working after the initiating click. It can inspect information, make decisions, create objects, connect ideas, and update the same interface the person is still using.

The user is no longer the only active participant.

[V2: A Second Actor Enters — "The user adds an idea while a research agent works in parallel. The layout makes room for the agent's proposal, and later research remains provisional until the user confirms it."]

This introduces a different class of interface problem.

When a new node appears, was it created by the person or by the agent? Is it a finished contribution or only a proposal? Can the person edit it while the agent is still working? Can they interrupt the operation? If they press undo, are they reversing their own action or the agent's?

These are not primarily questions about artificial intelligence. They are questions about shared agency.

Interfaces have supported automation for decades, but most automation remained behind the screen. A calculation ran, a workflow completed, or a server returned a result. The application might have been doing complex work, but from the user's perspective it was still responding to a request.

Agents increasingly perform their work inside the interface itself.

They do not only return answers. They manipulate the same objects as the user. They leave behind drafts, decisions, relationships, comments, and partially completed work. They may act while the user is reading, editing, or preparing to act on the same material.

That changes the interface from a control panel into a workspace.

The visual distinction matters. In V2, the user's contribution and the agent's proposal do not simply arrive as two anonymous updates. They have different identities, different states, and different levels of commitment. The user can see that the agent is thinking. The agent's proposal makes space for itself instead of silently replacing the user's work. Additional research appears as a provisional element before it becomes part of the shared canvas.

The interface is beginning to explain not only **what changed**, but also **who changed it** and **whether the change is final**.

This territory is not entirely new. Research into mixed-initiative interfaces has long examined systems in which people and software share control over a task. What is new is how ordinary the pattern is becoming. Research assistants, coding agents, design tools, support copilots, and workflow agents all sit somewhere between "a tool I operate" and "a participant working beside me."

One user and one agent is already harder than traditional request-response software.

It is also probably the simplest version of what comes next.

**Sources:** Eric Horvitz, [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/); Microsoft Research, [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/)

## One assistant becomes a room full of participants

It is tempting to treat the user-and-agent interface as a private relationship: one person accompanied by one intelligent assistant.

But most useful software already exists inside organizations.

Projects have owners and reviewers. Documents have authors and editors. Decisions involve researchers, designers, engineers, customers, and managers. Once agents enter these environments, they do not enter an empty room. They join work that is already shared.

And there is unlikely to be only one of them.

A research agent might gather evidence while a planning agent reorganizes it. A compliance agent might flag a risk while a human reviewer is still editing the relevant section. Another person might open the same workspace to check progress or correct an assumption.

The interface now has several independent participants, each with its own timing, responsibilities, and understanding of the task.

[V3: The Canvas Gets Crowded — "Two people and two specialized agents work on the same canvas."]

At first, this can look like a simple increase in activity. More cursors. More nodes. More changes arriving more quickly.

But the real difference is not the number of animations on the screen. It is that causality is no longer obvious.

A node can move without the current user touching it. An edge can appear while they are reading another part of the canvas. An agent can begin restructuring work that another participant still considers unfinished. Two participants can make individually reasonable decisions that cannot both become the final state.

The assumptions that made the original interface simple have disappeared:

- There is no longer one obvious owner of each action.
- Changes do not necessarily happen in response to the current user's input.
- The interface cannot assume that participants share the same context.
- Undo may affect someone else's work.
- A change can be technically valid and still arrive at the wrong moment.
- Two participants may try to modify the same object simultaneously.

This is the point where an agent interface becomes a multiplayer interface.

"Multiplayer" does not only mean showing several cursors. It means several independent actors share a world that must remain coherent while they change it.

That gives the system two separate responsibilities.

First, it must ensure that every participant eventually sees the correct state.

Second, it must help each participant understand what is happening inside that state: who is present, what they are doing, which changes are provisional, what they are allowed to modify, and what happens when their actions overlap.

Most realtime technology focuses on the first responsibility.

The harder interface problem begins with the second.

**Sources:** Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/)

## Realtime is not the same as understandable

Imagine that the canvas is technically perfect.

Every participant sees every change immediately. A node moves on one screen and appears in its new position everywhere else. An edge created by an agent arrives without delay. A label changed by another user is synchronized before anyone can refresh the page.

The state is correct.

The experience can still feel haunted.

Objects move without explanation. Connections appear from nowhere. Labels change while someone is reading them. The user cannot tell whether a change came from another person, an agent, or the system itself. They do not know whether an operation is complete, whether it is safe to intervene, or whether their own work is about to be overwritten.

[V4: From Haunted Canvas to Shared Workspace — "The same synchronized changes are shown first without context, then with cursors, identities, intent, attribution, and undo."]

Nothing about the underlying data needs to change between these two versions. What changes is the interface's explanation of that data.

The second version restores information that single-user software could previously leave implicit. It shows whose cursor is approaching an object, which participant has it selected, and what an agent intends to do before it acts. It distinguishes pending and provisional work from committed changes, attributes completed actions, and gives the user a way to reverse or interrupt them.

Realtime synchronization makes a shared workspace possible. It does not make that workspace understandable.

Five questions separate synchronized state from usable collaboration:

1. **State** — What does the shared document contain?
2. **Presence** — Who is here right now?
3. **Intent** — What is each participant doing or about to do?
4. **Authority** — Who may change which objects?
5. **Conflict** — What happens when two changes affect the same thing?

Getting information from one machine to another answers only the first question.

The other four are what turn a fast system into an interface people can trust.

**Sources:** Microsoft Research, [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## From interface problem to systems problem

Once several participants can act on the same workspace, the architecture has two jobs.

First, changes have to reach everyone.

Second, simultaneous changes have to settle into one coherent state.

Those are related, but they are not the same problem. A fast connection can deliver two conflicting edits perfectly. It cannot decide which one should win. A database can persist every action correctly. It cannot explain to a user why a node moved while they were reading it.

The technical options below solve different parts of this system. Some move information. Some synchronize state. Some help merge concurrent changes. None replaces the need for deliberate interface rules.

## Polling: "Anything new?"

The simplest way to keep an interface updated is to ask repeatedly.

A browser requests the latest state, waits for a fixed interval, then requests it again.

```js
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

Polling is easy to underestimate because its behavior is so simple. That simplicity is often exactly what a product needs. Background export status, long-running research jobs, notification counters, and other workflows that tolerate a few seconds of delay rarely need a persistent connection. In those cases, operational simplicity matters more than immediacy.

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

They fit token streaming, progress updates, agent logs, server notifications, and other long-running operations where the browser mostly listens.

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

Once a product relies on persistent connections, several new responsibilities appear. The client has to reconnect after interruptions and account for missed, repeated, or out-of-order messages. The server has to decide who may join a room and which participants may read or modify a document.

The application also needs a durable state model. It must distinguish temporary events from persistent data and reconstruct the current canvas for a newly connected client. If the local interface has already applied an optimistic update, it needs a rule for reconciling a conflicting server event. At scale, the team must also monitor, balance, and recover thousands of long-lived connections.

A WebSocket solves bidirectional delivery. It does not define the shared-state model that travels through it.

Custom WebSocket systems are still the correct choice when the protocol is highly specialized, the collaboration behavior is core to the product, and the team needs low-level control. That choice also means being prepared to own the coordination infrastructure.

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

This works well for inexpensive, continuous properties such as node position, zoom level, object size, and temporary layout adjustments.

If the result is wrong, moving the node again is cheap.

The action history can still record both attempts even though only one final coordinate survives.

### Lock while editing

The first participant to begin an operation receives temporary ownership.

Others can see that the object is in use but cannot modify it until the operation finishes.

This is useful when overlapping changes would be destructive or expensive: deleting a section, restructuring a document, changing a workflow state, or approving a consequential agent action.

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
- "agent is about to connect these nodes";
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

The tradeoff is that Supabase provides primitives rather than a complete synchronization model. The application still decides how optimistic updates work, how local and remote changes reconcile, and which conflict rules apply. It also owns reconnection, channel lifecycle, and the throttling of high-frequency activity.

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

For the canvas, nodes and edges could use transactions, active participants and selections could use presence, and temporary activity could travel through topics.

Optimistic local behavior is part of the client model. The user can move a node immediately without waiting for a round trip, while the underlying transaction is synchronized in the background.

That can substantially reduce the application-specific code needed for cache invalidation, subscription handling, optimistic updates, local reconciliation, and keeping several views consistent.

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

It provides presence, cursors, shared storage, comments, and collaborative React Flow integrations.

It fits teams that already have a backend and want to add a focused collaboration layer around canvases, documents, or discussions.

### Yjs: data structures designed to merge

Yjs provides CRDT-based shared data types.

Two disconnected participants can edit the same document independently and later merge their changes without replacing the entire document with one winner.

It fits cases where offline work matters, concurrent merge behavior is central, or rich-text and structured collaborative editing are core requirements.

Yjs sits at a lower level than Supabase or InstantDB. Teams still choose the networking, persistence, authentication, and operational layers around it.

### Firebase: established database-to-client synchronization

Firebase Realtime Database and Firestore listeners remain established models for client applications that subscribe directly to changing backend data.

They are useful reference points for products such as InstantDB because they demonstrate both the appeal and the long history of database-driven realtime interfaces.

### Custom sync engine: collaboration as core infrastructure

A custom sync engine makes sense when collaboration semantics are part of the product's intellectual property, no existing system fits the conflict model, scale justifies specialized infrastructure, or the team needs complete control over ordering, validation, and persistence.

Figma is the obvious example. It is also evidence of the amount of engineering this route requires.

**Sources:** Liveblocks, [React Flow integration](https://liveblocks.io/docs/api-reference/liveblocks-react-flow); Liveblocks, [documentation](https://liveblocks.io/docs); Yjs documentation, [https://docs.yjs.dev/](https://docs.yjs.dev/); Firebase, [Realtime Database documentation](https://firebase.google.com/docs/database); Firebase, [Cloud Firestore realtime listeners](https://firebase.google.com/docs/firestore/query-data/listen); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## Choose the layer the interface actually needs

There is no universal winner because these options answer different questions.

For simple delivery, use **polling** when updates are infrequent, delay is acceptable, and the interface mainly reports task status. Use **SSE** when information mostly flows from the server to the browser, especially for agent output or progress.

At the realtime infrastructure layer, **custom WebSockets** fit protocols specialized enough to justify owning connection management, ordering, rooms, persistence, and reconciliation. **Supabase Realtime** fits when Postgres should remain the source of truth and the application can assemble collaboration from Broadcast, Presence, and database events.

At a higher synchronization layer, **InstantDB** fits when synchronized client state is central and the project can adopt an integrated, sync-oriented backend model. **Liveblocks** adds collaboration to an existing product without replacing its main backend, while **Yjs** fits when concurrent merging and offline editing are defining requirements.

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

The same participants are still active: the user, another human reviewer, the research agent, and the structure agent.

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
