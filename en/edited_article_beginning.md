# Your Next AI Interface Is a Multiplayer Interface

## Interfaces used to be easy

For most of the history of software, interfaces followed a simple rhythm:

A person did something. The software responded.

The action might have been clicking a button, submitting a form, editing a spreadsheet cell, or moving an object on a canvas. The control itself did not matter. What mattered was that the person initiated the change and the application reacted to it.

[V1: One User, One Action — A person initiates a change in an otherwise passive application. See `animations_updated.md`.]

This model made interfaces easy to reason about.

When something changed, the cause was usually obvious: the user had just done something. The interface did not need to explain who was responsible, because there was only one plausible answer. Undo meant reversing the person's last action. A loading indicator meant the application was processing their request. While the user waited, the interface remained still.

Even software used by large teams often preserved this model locally. Hundreds of people might have access to the same project, but each individual screen still behaved as though one person was currently holding the controls.

There was a clear boundary between actor and tool.

The person acted. The software waited.

## Then the software started acting too

An agent is not simply another way to trigger a conventional request. It can continue working after the initiating click. It can inspect information, make decisions, create objects, connect ideas, and update the same interface the person is still using.

The user is no longer the only active participant.

[V2: A Second Actor Enters — The user adds an idea while a research agent works in parallel. The layout makes room for the agent's proposal, and later research remains provisional until the user confirms it.]

This introduces a different class of interface problem.

When a new node appears, was it created by the person or by the agent? Is it a finished contribution or only a proposal? Can the person edit it while the agent is still working? Can they interrupt the operation? If they press undo, are they reversing their own action or the agent's?

These are not primarily questions about artificial intelligence. They are questions about shared agency.

Interfaces have supported automation for decades, but most automation remained behind the screen. A calculation ran, a workflow completed, or a server returned a result. The application might have been doing complex work, but from the user's perspective it was still responding to a request.

Agents increasingly perform their work inside the interface itself.

They do not only return answers. They manipulate the same objects as the user. They leave behind drafts, decisions, relationships, comments, and partially completed work. They may act while the user is reading, editing, or preparing to act on the same material.

That changes the interface from a control panel into a workspace.

The visual distinction matters. In V2, the user's contribution and the agent's proposal do not simply arrive as two anonymous updates. They have different identities, different states, and different levels of commitment. The user can see that the agent is thinking. The agent's proposal makes space for itself instead of silently replacing the user's work. Additional research appears as a provisional element before it becomes part of the shared canvas.

The interface is beginning to explain not only **what changed**, but also **who changed it** and **whether the change is final**.

This territory is not entirely new. Research into mixed-initiative interfaces has long examined systems in which people and software share control over a task. What is new is how ordinary the pattern is becoming. Research assistants, coding agents, design tools, support copilots, and workflow agents all sit somewhere between “a tool I operate” and “a participant working beside me.”

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

[V3: The Canvas Gets Crowded — Two people and two specialized agents work on the same canvas. See `animations_updated.md`.]

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

“Multiplayer” does not only mean showing several cursors. It means several independent actors share a world that must remain coherent while they change it.

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

[V4: From Haunted Canvas to Shared Workspace — The same synchronized changes are shown first without context, then with cursors, identities, intent, attribution, and undo. See `animations_updated.md`.]

Nothing about the underlying data needs to change between these two versions. What changes is the interface's explanation of that data.

The second version restores the information that single-user software could previously leave implicit:

- whose cursor is approaching an object;
- which participant currently has it selected;
- what an agent intends to do before it does it;
- whether a change is pending, provisional, or committed;
- who performed each completed action;
- and how the user can reverse or interrupt it.

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
