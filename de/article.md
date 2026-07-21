# KI-Agenten im Frontend: Warum Interfaces zu Multiplayer-Systemen werden

Sobald Agenten selbstständig Anwendungszustände verändern, reicht technische Synchronisierung nicht mehr aus. Gute Interfaces machen Urheberschaft, Absicht und Konflikte sichtbar.

## Solange die Software nur reagierte

Software-Interfaces folgten lange einem verlässlichen Prinzip: Ein Mensch löste eine Aktion aus, die Anwendung reagierte darauf. Ob es um einen Button, ein Formular, eine Tabellenzelle oder ein Objekt auf einem Canvas ging, war für dieses Interaktionsmodell unerheblich.

_Eine Aktion hat einen eindeutigen Urheber._

Damit waren Ursache und Wirkung eindeutig. Das Interface musste keine Urheberschaft ausweisen, „Rückgängig“ bezog sich auf die letzte Aktion des Nutzers und eine Ladeanzeige signalisierte die Verarbeitung seiner Anfrage. Selbst Anwendungen für große Teams behielten dieses Modell lokal bei: Viele Menschen konnten auf dasselbe Projekt zugreifen, auf dem einzelnen Bildschirm gab es jedoch genau einen aktiven Akteur.

Die Grenze war klar: Der Mensch handelte, die Software wartete.

## Vom Werkzeug zum Akteur

KI-Agenten brechen mit dieser Rollenverteilung. Sie beantworten nicht nur einen Request, sondern arbeiten nach dem auslösenden Klick selbstständig weiter: Sie prüfen Informationen, treffen Entscheidungen, erzeugen Objekte und verändern dabei dasselbe Interface, in dem der Nutzer weiterhin arbeitet. Damit ist der Mensch nicht mehr der einzige aktive Teilnehmer.

_Sie geben „Onboarding-E-Mails“ ein, während der Agent nachdenkt. Dann gleitet Ihre Karte nach links, um Platz für seinen Vorschlag zu schaffen. Später wird die Recherche in Ihre Karte eingeordnet und bleibt gestrichelt dargestellt, bis Sie sie bestätigen._

Aus dieser Verschiebung entstehen Fragen, die klassische Request-Response-Systeme nicht beantworten mussten: Wer hat einen neuen Knoten erstellt? Handelt es sich um einen fertigen Beitrag oder um einen Vorschlag? Darf der Nutzer ihn bearbeiten, während der Agent noch arbeitet? Und auf wessen Aktion bezieht sich „Rückgängig“? Im Kern geht es nicht um KI, sondern um geteilte Kontrolle.

Automatisierung ist zwar nicht neu, blieb bisher aber meist hinter dem Interface verborgen. Eine Berechnung lief, ein Workflow endete oder ein Server lieferte ein Ergebnis. Agenten arbeiten dagegen zunehmend im sichtbaren Anwendungszustand. Sie bearbeiten dieselben Objekte wie der Nutzer und hinterlassen Entwürfe, Beziehungen, Kommentare oder nur teilweise abgeschlossene Arbeit. Aus einem Bedienfeld wird so ein gemeinsamer Workspace.

Das Interface muss diese Rollen kenntlich machen. In V2 besitzen der Nutzerbeitrag und der Agentenvorschlag deshalb unterschiedliche Urheber, Zustände und Verbindlichkeitsgrade. Der Vorschlag ersetzt bestehende Arbeit nicht stillschweigend; zusätzliche Recherche bleibt als vorläufig markiert, bis der Nutzer sie bestätigt. Sichtbar werden muss nicht nur, **was sich geändert hat**, sondern auch, **wer dafür verantwortlich ist** und **ob die Änderung bereits verbindlich ist**.

Die Forschung zu Mixed-Initiative Interfaces beschäftigt sich seit Langem mit Systemen, in denen Menschen und Software gemeinsam eine Aufgabe steuern. Neu ist die Verbreitung des Musters: Rechercheassistenten, Coding-Agenten, Designwerkzeuge und Workflow-Agenten bewegen sich heute zwischen bedientem Werkzeug und eigenständigem Teammitglied. Dabei ist ein einzelner Nutzer mit einem einzelnen Agenten noch der einfachste Fall.

**Quellen:** Eric Horvitz, [Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/); Microsoft Research, [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/)

## Wenn Agenten auf Teams treffen

In produktiver Software bleibt es selten bei dieser Zweierbeziehung. Projekte haben Verantwortliche und Reviewer, Dokumente haben Autoren und Redakteure, an Entscheidungen arbeiten Fachleute aus mehreren Disziplinen. Agenten betreten daher keinen leeren Raum, sondern einen bereits geteilten Arbeitskontext. Meist kommt zudem mehr als ein Agent hinzu.

So kann ein Rechercheagent Belege sammeln, während ein Planungsagent sie neu ordnet. Gleichzeitig markiert ein Compliance-Agent ein Risiko, ein menschlicher Reviewer bearbeitet den betreffenden Abschnitt und eine weitere Person prüft den Projektfortschritt. Alle handeln unabhängig voneinander, mit eigenen Zuständigkeiten, unterschiedlichem Timing und jeweils nur einem Teil des Gesamtkontexts.

_Zwei Menschen und zwei Agenten können unabhängig arbeiten, bis sich ihre Absichten auf dasselbe Objekt richten. Hier greifen Sie und der Strukturagent nach derselben Karte und ziehen sie in unvereinbare Richtungen._

Die Herausforderung besteht nicht bloß in mehr Cursorn, Knoten oder Updates, sondern in der verlorenen Eindeutigkeit von Ursache und Wirkung. Ein Knoten bewegt sich, ohne dass der aktuelle Nutzer ihn berührt. Eine Kante erscheint, während er einen anderen Teil des Canvas betrachtet. Zwei Akteure treffen jeweils nachvollziehbare Entscheidungen, die sich im finalen Zustand dennoch gegenseitig ausschließen.

Die Annahmen, die die ursprüngliche Oberfläche einfach machten, gelten nicht mehr:

-   Es gibt nicht mehr für jede Aktion einen eindeutigen Urheber.
-   Änderungen erfolgen nicht zwangsläufig als Reaktion auf die Eingabe des aktuellen Nutzers.
-   Die Oberfläche kann nicht voraussetzen, dass alle Teilnehmer denselben Kontext haben.
-   Rückgängig kann die Arbeit eines anderen betreffen.
-   Eine Änderung kann technisch korrekt sein und trotzdem im falschen Moment eintreffen.
-   Zwei Teilnehmer können versuchen, dasselbe Objekt gleichzeitig zu ändern.

Damit wird das Agenten-Interface zum Multiplayer-System. Gemeint sind nicht mehrere sichtbare Cursor, sondern mehrere unabhängige Akteure, die denselben Zustand verändern. Das System muss dabei zwei Aufgaben erfüllen: Es muss allen Beteiligten einen konsistenten Zustand liefern und zugleich erklären, wie dieser Zustand entsteht. Dazu gehören Anwesenheit, aktuelle Absicht, vorläufige Änderungen, Berechtigungen und der Umgang mit überschneidenden Aktionen. Realtime-Technologien konzentrieren sich vor allem auf die erste Aufgabe; das anspruchsvollere Interfaceproblem beginnt bei der zweiten.

**Quellen:** Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/)

## Synchronisiert heißt noch nicht verständlich

Auch ein technisch einwandfrei synchronisierter Canvas kann unberechenbar wirken. Knoten wechseln ohne sichtbaren Auslöser ihre Position, Verbindungen erscheinen und Beschriftungen ändern sich während des Lesens. Der Zustand ist auf allen Clients korrekt, doch der Nutzer erkennt weder den Urheber einer Änderung noch ihren Bearbeitungsstand. Damit bleibt unklar, ob er eingreifen kann oder ob seine eigene Arbeit gleich überschrieben wird.

_Das Dokument ändert sich auf beiden Seiten identisch. Signale auf der rechten Seite liefern die fehlende Erklärung: Wer handelt, was ist vorläufig, worauf richtet sich die Aufmerksamkeit und was ist gerade geschehen?_

Die zugrunde liegenden Daten können in beiden Varianten identisch sein. Den Unterschied macht die Erklärung im Interface: sichtbare Cursor und Auswahlzustände, angekündigte Agentenaktionen, klar markierte Entwürfe sowie eine nachvollziehbare Zuordnung abgeschlossener Änderungen. Realtime-Synchronisierung schafft damit zwar die technische Grundlage für einen gemeinsamen Workspace, nicht aber dessen Verständlichkeit.

Fünf Fragen trennen synchronisierten State von brauchbarer Zusammenarbeit:

1.  **Zustand** - Was enthält das gemeinsame Dokument?
2.  **Präsenz** - Wer ist gerade hier?
3.  **Absicht** - Was tut jeder Teilnehmer gerade oder als Nächstes?
4.  **Berechtigung** - Wer darf welche Objekte ändern?
5.  **Konflikt** - Was geschieht, wenn zwei Änderungen dieselbe Sache betreffen?

Der Transport von Daten zwischen zwei Rechnern beantwortet nur die erste Frage. Erst die übrigen vier machen aus einem schnellen System ein Interface, dem Menschen vertrauen können.

**Quellen:** Microsoft Research, [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## Aus dem Interfaceproblem wird ein Problem verteilter Systeme

Sobald mehrere Akteure denselben Workspace verändern, muss die Architektur Updates nicht nur verteilen, sondern gleichzeitige Änderungen auch zu einem konsistenten Zustand zusammenführen. Beides hängt zusammen, ist aber nicht dasselbe: Eine schnelle Verbindung stellt zwei widersprüchliche Bearbeitungen zuverlässig zu, entscheidet jedoch nicht, welche sich durchsetzt. Umgekehrt kann eine Datenbank jede Aktion korrekt speichern, ohne dem Nutzer zu erklären, warum sich ein Knoten vor seinen Augen verschiebt.

Die technischen Optionen setzen deshalb auf unterschiedlichen Ebenen an. Manche transportieren Events, manche synchronisieren State und manche führen konkurrierende Änderungen zusammen. Keine davon ersetzt klar definierte Interaktions- und Konfliktregeln.

## Polling: „Gibt es etwas Neues?“

Die einfachste Form der Aktualisierung ist Polling: Der Browser fordert den aktuellen Zustand an, wartet ein festes Intervall und fragt erneut.

```
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

Gerade diese Einfachheit macht Polling für viele Aufgaben zur richtigen Wahl. Hintergrundexporte, länger laufende Recherchejobs oder Benachrichtigungszähler vertragen einige Sekunden Verzögerung und benötigen keine dauerhafte Verbindung. Das Backend kann weitgehend zustandslos bleiben, nutzt gewöhnliches HTTP und produziert vertraute Fehlerbilder.

Der Preis dafür sind leere Anfragen und eine Verzögerung, die direkt vom Intervall abhängt. Bei drei Sekunden Polling kann ein Client fast drei Sekunden hinter dem aktuellen Zustand liegen; eine höhere Frequenz steigert dagegen die Last mit jedem verbundenen Client. Zwischenzeitlich können zwei Browser deshalb unterschiedliche Versionen desselben Canvas anzeigen.

Polling beantwortet damit zuverlässig die Frage:

Ist die Aufgabe abgeschlossen?

Für unmittelbare Koordination reicht es dagegen nicht:

Was tut ein anderer Teilnehmer gerade mit diesem Objekt?

## Streaming zeigt Fortschritt, synchronisiert aber keinen Workspace

Streaming macht laufende Arbeit unmittelbar sichtbar: Antworten treffen Token für Token ein, Fortschrittsmeldungen erscheinen fortlaufend und ein lang laufender Agent wirkt nicht länger stumm. Einen gemeinsamen Anwendungszustand synchronisiert der Stream deshalb noch nicht. Ein Rechercheagent kann seine Arbeit in einer Seitenleiste protokollieren, während der Canvas unverändert bleibt und erst am Ende einen fertigen Belegknoten erhält.

Für solche unidirektionalen Datenflüsse eignen sich Server-Sent Events (SSE). Der Server hält eine Verbindung zum Browser offen und sendet darüber Token, Statusmeldungen, Agentenprotokolle oder Benachrichtigungen. Aktionen in Gegenrichtung, etwa Genehmigen, Ziehen oder Abbrechen, laufen weiterhin über reguläre HTTP-Requests.

Für sich genommen löst Streaming jedoch weder:

-   einen gemeinsamen Dokumentzustand;
-   die Präsenz der Teilnehmer;
-   gleichzeitige Bearbeitung;
-   Konfliktlösung;
-   synchronisierte optimistische Updates.

Ein Chatfenster kann vollständig live sein, während der Arbeitsbereich daneben weiterhin nur für einen Nutzer ausgelegt ist.

## WebSockets lösen den Transport, nicht die Zusammenarbeit

WebSockets ersetzen die regelmäßige Abfrage durch einen dauerhaften bidirektionalen Kanal. Verschiebt ein Teilnehmer einen Knoten, kann der Server das Event unmittelbar an alle anderen verbundenen Clients weiterleiten.

```
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'node.moved') {
    applyRemoteNodePosition(message.nodeId, message.position);
  }
});
```

Der sichtbare Handler bleibt klein, das umgebende System jedoch nicht. Clients müssen Verbindungen wiederaufbauen und mit verpassten, doppelten oder vertauschten Nachrichten umgehen. Der Server regelt den Zugang zu Räumen und Dokumenten. Hinzu kommen ein persistentes Zustandsmodell, die Trennung flüchtiger Events von dauerhaften Daten und der Abgleich optimistischer Updates mit widersprüchlichen Server-Events. Bei großer Skalierung muss das Team außerdem Tausende langlebiger Verbindungen überwachen und nach Ausfällen wiederherstellen.

WebSockets lösen somit die bidirektionale Zustellung, definieren aber weder das Shared-State-Modell noch dessen Konfliktregeln. Ein eigenes WebSocket-System passt zu hoch spezialisierten Protokollen und Produkten, bei denen Kollaboration zur Kernfunktion gehört. Das Team übernimmt damit allerdings auch die gesamte Koordinationsinfrastruktur.

_Polling entdeckt Änderungen bei der nächsten Anfrage. SSE überträgt Serverereignisse über einen offenen Stream. WebSockets transportieren Nachrichten in beide Richtungen, sobald eine Seite sie sendet._

**Quellen:** MDN, [Window: setInterval() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval); MDN, [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events); MDN, [The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/); InstantDB, [A backend for AI-coded apps](https://www.instantdb.com/essays/architecture) (vom Anbieter verfasst)

## Zustellung ist noch keine Konfliktlösung

Wenn ein Nutzer und ein Strukturagent denselben Knoten nahezu gleichzeitig in unterschiedliche Richtungen verschieben, können beide Events schnell und zuverlässig eintreffen. Gelöst ist der Konflikt damit nicht. Welche Änderung bestehen bleibt, hängt von der Semantik des jeweiligen Vorgangs ab; eine universelle Strategie gibt es nicht.

### Der zuletzt akzeptierte Wert gewinnt

Bei leicht korrigierbaren Eigenschaften wie Knotenposition, Zoomstufe oder Objektgröße kann der zuletzt akzeptierte Wert gewinnen. Beide Aktionen bleiben im Verlauf nachvollziehbar, im aktuellen Zustand existiert jedoch nur eine Koordinate. Ein falsches Ergebnis lässt sich mit geringem Aufwand erneut ändern.

### Während der Bearbeitung sperren

Bei destruktiven oder teuren Vorgängen ist eine temporäre Sperre sinnvoll. Wer zuerst mit dem Löschen eines Abschnitts, der Umstrukturierung eines Dokuments oder einer folgenreichen Freigabe beginnt, erhält vorübergehend die Kontrolle. Andere sehen die Sperre, müssen bis zu ihrer Freigabe allerdings warten.

### Getrennte Felder zusammenführen

Nicht jede gleichzeitige Bearbeitung ist ein echter Konflikt. Ändert ein Nutzer den Titel eines Knotens, während ein Agent dessen Status setzt, können beide Updates bestehen bleiben. Viele vermeintliche Konflikte verschwinden, sobald das Datenmodell Änderungen auf Feldebene statt auf Objektebene erfasst.

Ein belastbares Interface benötigt in der Regel mehrere Regeln zugleich:

-   „Letzter Schreibvorgang gewinnt“ für Positionen;
-   Zusammenführung auf Eigenschaftsebene für unabhängige Felder;
-   Sperren für destruktive Vorgänge;
-   Vorschau und Genehmigung für folgenreiche Agentenaktionen;
-   CRDT-basierte Zusammenführung, wenn wirklich gleichzeitige Bearbeitungen kombiniert werden müssen.

Entscheidend ist daher nicht eine Konfliktstrategie für die gesamte Anwendung, sondern die passende Regel für jeden Vorgang.

_Dieselbe Überschneidung erfordert unterschiedliche Regeln: Eine spätere Position kann eine frühere ersetzen; eine vorübergehende Sperre blockiert den zweiten Bearbeiter nur bis zur Übergabe der Kontrolle; Änderungen an Titel und Status können beide bestehen bleiben, weil sie unterschiedliche Felder betreffen._

**Quellen:** Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/); Figma, [Realtime editing of ordered sequences](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/); Yjs-Dokumentation, [https://docs.yjs.dev/](https://docs.yjs.dev/)

## Nicht alles gehört in die Datenbank

Ein kollaborativer Canvas erzeugt dauerhafte Dokumentdaten, temporäre Präsenzinformationen und kurzlebige Koordinationssignale. Wer alle drei Kategorien wie gewöhnliche Datenbankzeilen behandelt, erzeugt unnötige Last und erschwert zugleich das Zustandsmodell.

### Dokumentzustand

Zum dauerhaften gemeinsamen Zustand gehören:

-   Knoten;
-   Kanten;
-   Beschriftungen;
-   akzeptierte Agentenbeiträge;
-   abgeschlossene Aktionen;
-   Berechtigungen und Workflow-Zustand.

Diese Daten überdauern Verbindungsabbrüche und stehen auch Teilnehmern zur Verfügung, die später hinzukommen.

### Präsenz

Präsenz beschreibt dagegen, wer sich gerade im Workspace befindet und woran die Beteiligten arbeiten:

-   verbundene Teilnehmer;
-   aktuelle Auswahl;
-   aktives Werkzeug;
-   Bearbeitungsstatus;
-   seltener wechselnde Teilnehmermetadaten.

Verlässt ein Teilnehmer den Workspace, verschwindet auch seine Präsenz.

### Flüchtige Signale

Noch kurzlebiger sind Signale, die ausschließlich unmittelbare Aktivitäten koordinieren:

-   Cursorbewegungen;
-   Ziehvorschauen;
-   Hover-Zustände;
-   Reaktionen;
-   „Der Agent wird diese Knoten gleich verbinden“;
-   vorübergehende Animationsauslöser.

Solche Events sind für verbundene Clients nützlich, gehören aber nicht in den dauerhaften Anwendungszustand. Ein Cursor bewegt sich mitunter dutzende Male pro Sekunde; jede Position zu speichern, würde aus einem visuellen Hinweis eine erhebliche Datenbanklast machen. Die Trennung von Dokument, Präsenz und Signal folgt damit aus dem Interaktionsmodell und gilt unabhängig vom gewählten Anbieter.

_Dokument, Präsenz und Signal sind drei verschiedene Arten von State. Ein erstellter Knoten bleibt bestehen; ein Cursor verschwindet nach dem Verbindungsabbruch; ein flüchtiges Absichtssignal des Agenten klingt ab, ohne das Dokument zu ändern._

## Supabase: Realtime-Bausteine rund um Postgres

Supabase setzt bei der Realtime-Zusammenarbeit auf eine Postgres-zentrierte Architektur. Die Datenbank bleibt die persistente Source of Truth; drei getrennte Mechanismen verteilen dauerhafte Änderungen und flüchtige Teilnehmeraktivitäten.

### Broadcast

Broadcast verteilt Nachrichten mit geringer Latenz über einen Channel und eignet sich für flüchtige Events wie:

-   Cursorbewegungen;
-   Ziehvorschauen;
-   vorübergehende Agentenaktivität;
-   benutzerdefinierte Ereignisse, die verbundene Clients sofort erreichen sollen.

```
const channel = supabase.channel(`canvas:${canvasId}`);

channel
  .on('broadcast', { event: 'cursor' }, ({ payload }) => {
    renderRemoteCursor(payload);
  })
  .subscribe();
```

### Presence

Presence synchronisiert den temporären Zustand der Teilnehmer und bildet ab:

-   wer verbunden ist;
-   welcher Knoten ausgewählt ist;
-   welches Werkzeug ein Teilnehmer verwendet;
-   ob ein Agent inaktiv ist, arbeitet oder wartet.

### Datenbankänderungen

Persistente Anwendungsänderungen können von Postgres verteilt werden.

```
supabase
  .channel(`nodes:${canvasId}`)
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nodes' },
    ({ new: node }) => updateNode(node),
  )
  .subscribe();
```

Supabase kann zudem von der Datenbank ausgelöste Änderungen per Broadcast verteilen. Für viele skalierte Szenarien empfiehlt die Dokumentation diesen Weg anstelle ausschließlich direkter Postgres-Changes-Subscriptions. Der architektonische Reiz liegt in der klaren Aufgabenteilung:

-   Postgres bleibt die Source of Truth;
-   bestehende SQL- und relationale Modelle bleiben nutzbar;
-   Row-Level Security kann den Zugriff weiterhin steuern;
-   persistente und flüchtige Informationen bleiben getrennt.

Supabase liefert damit Bausteine, aber kein vollständiges Synchronisierungsmodell. Optimistische Updates, der Abgleich lokaler und entfernter Änderungen, Konfliktregeln, Wiederverbindungen und die Drosselung hochfrequenter Events bleiben Aufgabe der Anwendung. Das Modell passt daher zu Teams, die Postgres im Zentrum halten und die Kollaborationssemantik selbst gestalten wollen.

| Information auf dem Canvas | Supabase-Baustein |
|---|---|
| Gespeicherte Knoten, Kanten, Beschriftungen und Workflow-Zustand | Postgres-Zeilen |
| Dauerhafte Änderungen, über die Clients informiert werden sollen | Datenbankausgelöster Broadcast oder Postgres Changes |
| Verbundene Nutzer, Auswahl und Bearbeitungsstatus | Presence |
| Cursorbewegungen, Ziehvorschauen und Agentenaktivität | Broadcast |

_Supabase ordnet verschiedene Kollaborationszustände unterschiedlichen Bausteinen zu, statt jede Aktualisierung wie dieselbe Art von Datenbankzeile zu behandeln._

**Quellen:** Supabase, [Realtime](https://supabase.com/docs/guides/realtime); Supabase, [Presence](https://supabase.com/docs/guides/realtime/presence); Supabase, [Realtime Architecture](https://supabase.com/docs/guides/realtime/architecture); Supabase, [Subscribing to Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes); Supabase, [Broadcast](https://supabase.com/docs/guides/realtime/broadcast); Supabase, [Realtime Limits](https://supabase.com/docs/guides/realtime/limits); AgileSoftLabs, [Supabase Realtime in Production](https://www.agilesoftlabs.com/blog/2026/05/supabase-realtime-in-production-what) (sekundäre Praxiseinschätzung)

## InstantDB: Live Queries statt eigener Event-Verarbeitung

Eine synchronisierungsorientierte Datenbank wie InstantDB setzt eine Ebene höher an als die einzelnen Realtime-Bausteine von Supabase. Statt für jedes Event einen Handler zu schreiben, deklariert der Client die benötigten Daten; das System hält dieses Abfrageergebnis aktuell, während Menschen und Agenten den Canvas verändern.

```
const { data } = db.useQuery({
  nodes: {},
  edges: {},
});
```

Ein Schreibvorgang wird als Transaktion gegen das gemeinsame Datenmodell ausgedrückt:

```
db.transact(
  db.tx.nodes[node.id].update({
    x: nextPosition.x,
    y: nextPosition.y,
    updatedBy: participantId,
  }),
);
```

Der konzeptionelle Unterschied zeigt sich im Datenfluss:

### Ereignis-Handler

```
node.moved empfangen
→ Nachricht prüfen
→ lokalen Zustand aktualisieren
→ mit optimistischem Zustand abgleichen
```

### Abonniertes Ergebnis

```
Knoten und Kanten abonnieren
→ abonniertes Ergebnis bleibt aktuell
```

Die Komplexität verschwindet dabei nicht, sondern wandert in die Synchronisierungsschicht. Knoten und Kanten nutzen Transaktionen, aktive Teilnehmer und Auswahlzustände Presence, kurzlebige Aktivitäten Topics. Optimistische Updates gehören zum Clientmodell: Der Nutzer verschiebt einen Knoten ohne Warten auf den Server-Roundtrip, während die Transaktion im Hintergrund synchronisiert wird. Dadurch sinkt der anwendungsspezifische Aufwand für Cache-Invalidierung, Subscription-Management und lokalen Abgleich.

Im Gegenzug entsteht eine engere architektonische Bindung. Mit InstantDB übernimmt das Team nicht nur einen Transportkanal, sondern auch:

-   sein Schemamodell;
-   seine Abfragesprache;
-   seine Transaktions-API;
-   sein Berechtigungssystem;
-   sein Synchronisierungsverhalten.

Das ist weitreichender, als einem bestehenden Postgres-Backend Realtime-Zustellung hinzuzufügen. Der relevante Unterschied lautet daher nicht „InstantDB oder Supabase“, sondern: InstantDB übernimmt mehr Synchronisierungsarbeit, Supabase überlässt mehr davon der Anwendung. Ob sich die engere Backend-Abstraktion lohnt, hängt vom eingesparten Synchronisierungscode ab.

_Dieselbe entfernte Änderung erzeugt zwei verschiedene Aufgaben: Bei der Ereigniszustellung muss die Anwendung ihren Cache aktualisieren und abgleichen; bei einer Live-Abfrage ist die Synchronisierungsschicht dafür verantwortlich, das abonnierte Ergebnis aktuell zu halten._

**Quellen:** InstantDB, [Database in the Browser, a Spec](https://www.instantdb.com/essays/db_browser) (vom Anbieter verfasst); InstantDB, [A backend for AI-coded apps](https://www.instantdb.com/essays/architecture) (vom Anbieter verfasst); InstantDB, [InstaQL](https://www.instantdb.com/docs/instaql); InstantDB, [Presence and topics](https://www.instantdb.com/docs/presence-and-topics); InstantDB, [Permissions](https://www.instantdb.com/docs/permissions); InstantDB, [Self-hosting](https://www.instantdb.com/docs/self-hosting)

## Die Alternativen setzen auf anderen Ebenen an

Supabase und InstantDB markieren zwei mögliche Abstraktionsebenen. Andere Werkzeuge decken gezielt einzelne Teile der Kollaborationsarchitektur ab.

### Liveblocks: Zusammenarbeit für ein bestehendes Produkt

Liveblocks ist eine spezialisierte Kollaborationsschicht, kein Ersatz für die Anwendungsdatenbank. Presence, Cursor, Shared Storage, Kommentare und React-Flow-Integrationen richten sich an Teams, die ein bestehendes Backend um kollaborative Canvas-, Dokument- oder Diskussionsfunktionen erweitern wollen.

### Yjs: Datenstrukturen für die Zusammenführung

Yjs stellt CRDT-basierte gemeinsame Datentypen bereit. Damit können zwei zeitweise getrennte Clients dasselbe Dokument unabhängig bearbeiten und ihre Änderungen später zusammenführen, ohne eine komplette Version zu verwerfen. Das eignet sich besonders für Offline-Fähigkeit, Rich Text und andere Fälle, in denen konkurrierende Änderungen erhalten bleiben müssen. Netzwerk, Persistenz, Authentifizierung und Betrieb organisiert das Team weiterhin selbst.

### Firebase: etablierte Synchronisierung zwischen Datenbank und Client

Firebase Realtime Database und Firestore Listener stehen für das etablierte Modell, Backend-Daten direkt im Client zu abonnieren. Sie zeigen, dass datenbankgetriebene Realtime-Interfaces keine neue Idee sind, und dienen als wichtiger Bezugspunkt für neuere Angebote wie InstantDB.

### Eigene Sync-Engine: Zusammenarbeit als Kerninfrastruktur

Eine eigene Sync-Engine lohnt sich, wenn die Kollaborationssemantik das Produkt wesentlich differenziert, kein bestehendes System zum Konfliktmodell passt oder die Skalierung spezialisierte Infrastruktur rechtfertigt. Figma ist dafür das naheliegende Beispiel und zeigt zugleich den erheblichen Entwicklungs- und Betriebsaufwand dieses Wegs.

**Quellen:** Liveblocks, [React Flow integration](https://liveblocks.io/docs/api-reference/liveblocks-react-flow); Liveblocks, [documentation](https://liveblocks.io/docs); Yjs-Dokumentation, [https://docs.yjs.dev/](https://docs.yjs.dev/); Firebase, [Realtime Database documentation](https://firebase.google.com/docs/database); Firebase, [Cloud Firestore realtime listeners](https://firebase.google.com/docs/firestore/query-data/listen); Figma, [How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## Die Architektur folgt dem Interaktionsmodell

Keine dieser Optionen gewinnt jeden Vergleich, denn sie beantworten unterschiedliche Fragen. **Polling** passt zu seltenen Updates und tolerierbaren Verzögerungen, **SSE** zu Agentenausgaben und Fortschritt, die überwiegend vom Server zum Browser fließen.

**Eigene WebSockets** lohnen sich für spezialisierte Protokolle, die den Aufwand für Verbindungsverwaltung, Reihenfolge, Räume und Abgleich rechtfertigen. **Supabase Realtime** hält Postgres als Source of Truth im Zentrum und überlässt der Anwendung die Komposition aus Broadcast, Presence und Datenbank-Events.

**InstantDB** passt, wenn synchronisierter Client-State im Mittelpunkt steht und das Projekt ein integriertes Backend-Modell übernehmen kann. **Liveblocks** ergänzt ein vorhandenes Backend um Kollaboration; **Yjs** adressiert vor allem konkurrierende und zeitweise offline vorgenommene Bearbeitungen.

| Anforderung des Interfaces | Praktischer Ausgangspunkt |
|---|---|
| Status einer Hintergrundaufgabe prüfen | Polling |
| Agentenausgabe oder Fortschritt streamen | SSE |
| Ein spezialisiertes Realtime-Protokoll entwickeln | WebSockets |
| Postgres um Realtime-Funktionen ergänzen | Supabase |
| Ein integriertes, synchronisierungsorientiertes Backend einführen | InstantDB |
| Eine bestehende Anwendung um Kollaboration ergänzen | Liveblocks |
| Gleichzeitige oder Offline-Bearbeitungen zusammenführen | Yjs |

_Dies sind Ausgangspunkte, keine automatischen Antworten. Ein Produktivsystem kann mehrere davon kombinieren._

## Zurück zum gemeinsamen Workspace

Auf dem anfangs unübersichtlichen Canvas arbeiten weiterhin ein Nutzer, ein menschlicher Reviewer, ein Rechercheagent und ein Strukturagent. Die Zahl der Aktionen hat nicht abgenommen; geändert hat sich ihre Darstellung.

_Ein verständlicher Arbeitsbereich für mehrere Agenten: Der Nutzer erstellt eine Idee, während der Rechercheagent ankündigt, Belege hinzuzufügen. Der Strukturagent hebt zwei Ziele hervor, bevor er sie verbindet. Ein zweiter Mensch prüft die übergeordnete Frage. Wenn eine Agentenaktion mit einer menschlichen Bearbeitung kollidiert, wendet die Oberfläche eine sichtbare Regel an und zeichnet das Ergebnis im Aktivitätsverlauf auf._

Agentenaktionen erscheinen nun mit Kontext: Das Interface zeigt ihr Ziel vorab, markiert vorläufige Arbeit, ordnet abgeschlossene Änderungen einem Urheber zu und bietet bei folgenreichen Eingriffen eine Möglichkeit zum Abbruch oder Undo. Überschneiden sich zwei Aktionen, greift eine sichtbare Konfliktregel. Der Canvas ist dadurch nicht weniger aktiv, aber deutlich leichter zu verstehen.

## Für Akteure entwickeln, nicht für Requests

Die Architektur kollaborativer KI-Interfaces muss zwei Fragen beantworten: Wie erreicht eine Änderung alle Beteiligten, und wie können sie diese Änderung verstehen und sicher darauf reagieren? Polling, SSE, WebSockets, Realtime-Dienste und Sync-Engines adressieren die Zustellung auf unterschiedlichen Abstraktionsebenen. Präsenz, Absicht, Urheberschaft, Berechtigungen, Konfliktregeln und Undo schaffen die notwendige Verständlichkeit.

Eine schnelle Verbindung ersetzt kein nachvollziehbares Interaktionsmodell. KI-Produkte, in denen Agenten selbst handeln, dürfen deshalb nicht länger um einzelne Requests herum gedacht werden. Sie müssen für mehrere gleichzeitig handelnde Akteure gebaut sein.
