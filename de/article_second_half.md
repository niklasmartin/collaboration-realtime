## Vom Schnittstellenproblem zum Systemproblem

Sobald mehrere Teilnehmer auf demselben Arbeitsbereich agieren können, hat die Architektur zwei Aufgaben.

Erstens müssen Veränderungen alle erreichen.

Zweitens müssen gleichzeitige Änderungen zu einem kohärenten Zustand führen.

Diese hängen zusammen, sind aber nicht das gleiche Problem. Eine schnelle Verbindung kann zwei widersprüchliche Bearbeitungen perfekt liefern. Es kann nicht entscheiden, wer gewinnen soll. Eine Datenbank kann jede Aktion korrekt persistieren. Es kann einem Benutzer nicht erklären, warum sich ein Knoten beim Lesen verschoben hat.

Die folgenden technischen Optionen lösen verschiedene Teile dieses Systems. Einige Umzugsinformationen. Einige synchronisieren den Status. Einige helfen dabei, gleichzeitige Änderungen zusammenzuführen. Keine ersetzt die Notwendigkeit bewusster Schnittstellenregeln.

## Polling: „Gibt es etwas Neues?“

Der einfachste Weg, eine Benutzeroberfläche auf dem neuesten Stand zu halten, besteht darin, wiederholt nachzufragen.

Ein Browser fragt den neuesten Status ab, wartet ein festgelegtes Intervall und fordert ihn dann erneut an.

```js
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

Umfragen werden leicht unterschätzt, weil ihr Verhalten so einfach ist. Diese Einfachheit ist oft genau das, was ein Produkt braucht.

Es funktioniert gut für:

- Hintergrundexportstatus;
- langjährige Forschungsjobs;
- Benachrichtigungszähler;
- Arbeitsabläufe, bei denen eine Verzögerung von einigen Sekunden akzeptabel ist;
- Anwendungen, bei denen die einfache Bedienung wichtiger ist als die Unmittelbarkeit.

Das Backend kann weitgehend zustandslos bleiben. Anfragen verwenden gewöhnlichesHTTP. Fehler sind bekannt und leicht zu überprüfen.

Der Nachteil besteht darin, dass der Browser fragt, ob sich etwas geändert hat, selbst wenn sich nichts geändert hat. Die sichtbare Verzögerung hängt direkt mit dem Abfrageintervall zusammen: Bei einem Intervall von drei Sekunden kann die Schnittstelle fast drei Sekunden zurückbleiben. Erhöhen Sie die Häufigkeit und die Anzahl der leeren Anfragen wächst mit jedem verbundenen Client.

Verschiedene Kunden können auch vorübergehend anderer Meinung sein. Ein Browser zeigt möglicherweise bereits einen neu abgeschlossenen Forschungsknoten an, während ein anderer immer noch die vorherige Leinwand anzeigt.

Umfragen eignen sich daher gut für die Frage:

> Ist die Aufgabe abgeschlossen?

Es ist schlecht, die Frage zu stellen:

> Was macht ein anderer Teilnehmer gerade mit diesem Objekt?

## Streaming: Der Agent kann sprechen, aber keine Welt teilen

Durch Streaming fühlt sich ein Agent unmittelbar.

Die Antwort kommt Wort für Wort. Der Fortschritt zeigt sich kontinuierlich. Der Benutzer kann sehen, dass etwas passiert, bevor die Aufgabe abgeschlossen ist.

Das ist nützlich, aber es ist nicht dasselbe wie das Synchronisieren des Status gemeinsam genutzter Anwendungen.

Ein Forschungsagent kann seine Arbeit in einem Live-Seitenbereich erzählen, während die Leinwand unverändert bleibt. Erst wenn die Aufgabe abgeschlossen ist, erscheint ein letzter Beweisknoten im Diagramm.

Server-Sent Eventswerden üblicherweise für diese Art der Interaktion verwendet. Sie halten eine unidirektionale Verbindung vom Server zum Browser offen und ermöglichen es dem Server, neue Nachrichten zu pushen, wann immer sie verfügbar sind.

Sie passen:

- Token-Streaming;
- Fortschrittsaktualisierungen;
- Agentenprotokolle;
- Serverbenachrichtigungen;
- lang andauernde Vorgänge, bei denen der Browser hauptsächlich lauscht.

Aktionen in die andere Richtung – Klicken, Genehmigen, Ziehen, Abbrechen – werden weiterhin über normaleHTTP-Anfragen übertragen.

Streaming löst ein wichtiges UX-Problem: Es verhindert, dass sich ein Agent mit langer Laufzeit still anfühlt.

Es allein löst nicht:

- Status des freigegebenen Dokuments;
- Anwesenheit der Teilnehmer;
- gleichzeitige Bearbeitung;
- Konfliktlösung;
- Synchronisierte optimistische Updates.

Ein Chat-Panel kann perfekt live sein, während der Arbeitsbereich daneben Einzelspieler bleibt.

## WebSockets: Die Verbindung ist schnell; jetzt baue den Raum

Bei der Umfrage werden Änderungen an einem Zeitplan abgefragt.WebSocketsermöglicht es beiden Seiten, eine Änderung zu senden, sobald sie erfolgt.

Wenn ein Teilnehmer einen Knoten verschiebt, kann der Server dieses Ereignis sofort an alle anderen verbundenen Teilnehmer weiterleiten.

```js
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

if (message.type === 'node.moved') {
    applyRemoteNodePosition(message.nodeId, message.position);
  }
});
```

Der sichtbare Handler ist klein. Das System um ihn herum ist es normalerweise nicht.

Sobald ein Produkt auf dauerhaften Verbindungen basiert, entstehen mehrere neue Verantwortlichkeiten.

### Verbindung

Was passiert nach einer Verbindungsunterbrechung? Wie stellt der Client die Verbindung wieder her? Wie werden verpasste, wiederholte oder nicht in der Reihenfolge befindliche Nachrichten behandelt?

### Zugang

Wer darf einem Raum beitreten? Welche Teilnehmer dürfen ein bestimmtes Dokument lesen oder ändern?

### Zustand

Welche Ereignisse sind vorübergehend und welche werden zu dauerhaften Anwendungsdaten? Wie rekonstruiert ein neu verbundener Client die aktuelle Leinwand?

### Parallelität

Was passiert, wenn die lokale Schnittstelle bereits ein optimistisches Update angewendet hat und ein widersprüchliches Serverereignis eintrifft?

### Operationen

Wie werden Tausende langlebiger Verbindungen überwacht, ausgeglichen und wiederhergestellt?

EinWebSocketlöst die bidirektionale Zustellung. Es definiert nicht das Shared-State-Modell, das es durchläuft.

BenutzerdefinierteWebSocket-Systeme sind immer noch die richtige Wahl, wenn:

- das Protokoll ist hochspezialisiert;
- Das Kollaborationsverhalten ist von zentraler Bedeutung für das Produkt.
- Es ist eine Steuerung auf sehr niedrigem Niveau erforderlich.
- Das Team ist bereit, Eigentümer der Koordinierungsinfrastruktur zu sein.

Der wichtige Unterschied besteht nicht darin, dassWebSocketsprimitiv sind. Sie lösen die Transportschicht, während die Anwendung weiterhin den Raum besitzt.

[D1: Drei Möglichkeiten, wie Updates den Browser erreichen – Vergleichen Sie Polling,SSEundWebSocketsin einem kompakten Diagramm. Die Abfrage zeigt wiederholte Anfragen,SSEzeigt einen kontinuierlichen unidirektionalen Stream undWebSocketszeigt einen dauerhaften bidirektionalen Kanal.]

**Quellen:**MDN,[Window: setInterval() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval);MDN,[Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events);MDN,[The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API);Figma,[How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/);Figma,[Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/);InstantDB,[A backend for AI-coded apps](https://www.instantdb.com/essays/architecture)(vom Anbieter verfasst)

## Durch die Bereitstellung beider Änderungen wird der Konflikt nicht gelöst

Stellen Sie sich vor, dass eine Person und der Strukturagent beide denselben Knoten greifen.

Die Person verschiebt es nach links, um Platz für eine neue Idee zu schaffen. Fast im selben Moment bewegt der Agent es nach rechts, um das Diagramm auszurichten.

Beide Aktionen können schnell und zuverlässig erfolgen. Das System muss noch entscheiden, was sie bedeuten.

Es gibt keine universelle Form der Konfliktlösung. Unterschiedliche Operationen erfordern unterschiedliche Regeln.

### Letzter akzeptierter Wert gewinnt

Beide Änderungen werden übernommen, es bleibt jedoch nur ein Endwert übrig.

Dies funktioniert gut für kostengünstige, kontinuierliche Immobilien wie:

- Knotenposition;
- Zoomstufe;
- Objektgröße;
- vorübergehende Layoutanpassungen.

Wenn das Ergebnis falsch ist, ist es günstig, den Knoten erneut zu verschieben.

Der Aktionsverlauf kann dennoch beide Versuche aufzeichnen, auch wenn nur eine Endkoordinate überlebt.

### Beim Bearbeiten sperren

Der erste Teilnehmer, der eine Operation beginnt, erhält vorübergehendes Eigentum.

Andere können sehen, dass das Objekt verwendet wird, können es jedoch nicht ändern, bis der Vorgang abgeschlossen ist.

Dies ist nützlich, wenn sich überschneidende Änderungen destruktiv oder teuer wären, wie zum Beispiel:

- Löschen eines Abschnitts;
- Umstrukturierung eines Dokuments;
- Ändern eines Workflow-Status;
- Genehmigung einer Folgemaßnahme eines Agenten.

Das Sperren verhindert ein stilles Überschreiben, führt jedoch zu Wartezeiten.

### Unabhängige Eigenschaften zusammenführen

Zwei Teilnehmer können dasselbe Objekt bearbeiten, ohne tatsächlich denselben Wert zu bearbeiten.

Ein Benutzer kann eine Knotenbezeichnung ändern, während ein Agent eine Kategorie zuweist. Beide Änderungen können überleben, da sie unabhängige Eigenschaften betreffen.

Dies ist oft die einfachste und sinnvollste Form der Zusammenführung. Viele scheinbare Konflikte verschwinden, sobald sich die Systemmodelle auf einer ausreichend präzisen Ebene ändern.

Eine echte Schnittstelle benötigt normalerweise mehrere Richtlinien gleichzeitig:

- Last-Write-Siege für Position;
- Zusammenführung auf Eigenschaftsebene für unabhängige Felder;
- Sperren für destruktive Operationen;
- Vorschau und Genehmigung für Folgemaßnahmen des Agenten;
-CRDT-basiertes Zusammenführen, bei dem wirklich gleichzeitige Bearbeitungen kombiniert werden müssen.

Die Frage ist nicht:

> Welche Konfliktstrategie verwendet diese Anwendung?

Es ist:

> Welche Strategie erfordert diese Operation?

[D2: Eine Kollision, drei Richtlinien – Zeigt denselben Knotenkonflikt in drei kompakten Panels: spätere Werte gewinnen, temporäre Sperre und unabhängige Felder werden zusammengeführt.]

**Quellen:**Figma,[How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/);Figma,[Realtime editing of ordered sequences](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/);Yjs-Dokumentation,[https://docs.yjs.dev/](https://docs.yjs.dev/)

## Nicht alles gehört in die Datenbank

Eine kollaborative Leinwand produziert mehrere Arten von Informationen gleichzeitig.

Einiges davon beschreibt das Dokument selbst. Manches davon ist nur wichtig, solange ein Teilnehmer anwesend ist. Manches davon ist für weniger als eine Sekunde wichtig.

Alle drei als gewöhnliche Datenbankzeilen zu behandeln, verursacht unnötige Arbeit und macht es oft schwieriger, über das System nachzudenken.

### Dokumentstatus

Dies ist das dauerhafte gemeinsame Objekt:

- Knoten;
- Kanten;
- Etiketten;
- akzeptierte Agentenbeiträge;
- abgeschlossene Aktionen;
- Berechtigungen und Workflow-Status.

Es sollte die Trennung überstehen und für Teilnehmer verfügbar sein, die später beitreten.

### Präsenz

Die Präsenz beschreibt auf einer groben Ebene, wer sich gerade im Arbeitsbereich befindet und was sie tun:

- verbundene Teilnehmer;
- aktuelle Auswahl;
- aktives Werkzeug;
- Bearbeitungsstatus;
- sich langsamer ändernde Teilnehmermetadaten.

Präsenz ist vorübergehend. Wenn ein Teilnehmer geht, sollte er normalerweise verschwinden.

### Vergängliche Signale

Einige Informationen dienen lediglich der Koordinierung unmittelbarer Aktivitäten:

- Cursorbewegung;
- Vorschau ziehen;
- Schwebezustand;
- Reaktionen;
- „Agent ist dabei, diese Knoten zu verbinden“;
- Vorübergehende Animationsauslöser.

Diese Ereignisse sind für verbundene Teilnehmer nützlich, sollten jedoch normalerweise nicht zu dauerhaften Anwendungsdaten werden.

Ein Cursor kann sich Dutzende Male pro Sekunde bewegen. Das Beibehalten jeder Bewegung würde einen visuellen Hinweis in eine Datenbankarbeitsbelastung verwandeln.

Diese Unterscheidung ist unabhängig davon, welches Produkt oder welche Infrastruktur ausgewählt wird. Es ist eine Eigenschaft des Interaktionsmodells, nicht eines bestimmten Anbieters.

[D3: Dokument, Präsenz und Signal – Verwenden Sie eine Leinwand mit drei Beschriftungen. Ein erstellter Knoten bleibt erhalten, ein Cursor verschwindet, wenn sein Besitzer die Verbindung trennt, und ein vorübergehender Agentenabsichtsimpuls wird ausgeblendet, ohne dass das Dokument geändert wird.]

## Supabase: Die Realtime-Spuren rund um Postgres zusammensetzen

Supabasenähert sich der Zusammenarbeit in Echtzeit über einePostgres-zentrierte Architektur.

Die Datenbank bleibt das dauerhafte Aufzeichnungssystem.  DieRealtime-Funktionalität wird durch separate Grundelemente für dauerhafte Änderungen und temporäre Teilnehmeraktivität hinzugefügt.

SupabaseRealtimelegt drei relevante Mechanismen offen.

### Übertragen

Broadcast sendet Nachrichten mit geringer Latenz über einen Kanal.

Es passt zu vorübergehenden Veranstaltungen wie:

- Cursorbewegung;
- Vorschau ziehen;
- vorübergehende Agentenaktivität;
- Benutzerdefinierte Ereignisse, die verbundene Clients sofort erreichen sollen.

```js
const channel = supabase.channel(`canvas:${canvasId}`);

channel
  .on('broadcast', { event: 'cursor' }, ({ payload }) => {
    renderRemoteCursor(payload);
  })
  .subscribe();
```

### Präsenz

Präsenz synchronisiert den temporären Teilnehmerstatus.

Es kann Folgendes darstellen:

- wer ist verbunden?
- welcher Knoten ausgewählt ist;
- welches Tool ein Teilnehmer nutzt;
– ob ein Agent inaktiv ist, arbeitet oder wartet.

### Datenbankänderungen

Persistente Anwendungsänderungen können überPostgresverteilt werden.

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

Supabaseunterstützt auch die Übertragung von durch die Datenbank ausgelösten Änderungen und die Dokumentation empfiehlt die Übertragung für viele skalierte Datenbankänderungsszenarien, anstatt sich ausschließlich auf direktePostgres-Änderungsabonnements zu verlassen.

Der architektonische Reiz ist klar:

-Postgresbleibt die Quelle der Wahrheit;
- bestehende SQL- und relationale Modelle bleiben nützlich;
- Die Sicherheit auf Zeilenebene kann weiterhin den Zugriff regeln.
- Persistente und flüchtige Informationen bleiben getrennt.

Der Nachteil besteht darin, dassSupabaseGrundelemente anstelle eines vollständigen Synchronisationsmodells bereitstellt.

Der Antrag entscheidet weiterhin:

- wie optimistische Updates funktionieren;
- wie lokale und entfernte Änderungen in Einklang gebracht werden;
- welche Konfliktregeln gelten;
- Wie wird der Wiederherstellungsstatus wiederhergestellt?
- wie Kanäle erstellt und bereinigt werden;
- wie hochfrequente Aktivität gedrosselt wird.

Supabaseeignet sich daher gut, wenn ein TeamPostgresim Mittelpunkt behalten möchte und das Kollaborationsverhalten explizit zusammenstellen kann.

[D3mit Implementierungsbezeichnungen wiederverwenden – Dokument wirdPostgresoder datenbankgetriggertem Broadcast zugeordnet, Präsenz wirdSupabase-Präsenz zugeordnet und temporäre Signale werden Broadcast zugeordnet.]

**Quellen:**Supabase,[Realtime](https://supabase.com/docs/guides/realtime);Supabase,[Presence](https://supabase.com/docs/guides/realtime/presence);Supabase,[Realtime Architecture](https://supabase.com/docs/guides/realtime/architecture);Supabase,[Subscribing to Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes);Supabase,[Broadcast](https://supabase.com/docs/guides/realtime/broadcast);Supabase,[Realtime Limits](https://supabase.com/docs/guides/realtime/limits); AgileSoftLabs,[Supabase Realtime in Production](https://www.agilesoftlabs.com/blog/2026/05/supabase-realtime-in-production-what)(Secondary Practitioner-Perspektive)

## InstantDB: Den benötigten Zustand abonnieren

Supabasegibt einer Anwendung mehrere Echtzeitbausteine ​​zum Kombinieren.

Eine synchronisierungsorientierte Datenbank wieInstantDBbeginnt auf einer anderen Abstraktionsebene.

Anstatt für jedes Ereignis, das den Canvas verändern könnte, einen Handler zu schreiben, deklariert der Client, welche Daten er benötigt. Das System hält dieses Ergebnis aktuell, während Menschen und Agenten es ändern.

```js
const { data } = db.useQuery({
  nodes: {},
  edges: {},
});
```

Ein Schreibvorgang wird als Transaktion gegen das gemeinsam genutzte Datenmodell ausgedrückt:

```js
db.transact(
  db.tx.nodes[node.id].update({
    x: nextPosition.x,
    y: nextPosition.y,
    updatedBy: participantId,
  }),
);
```

Der konzeptionelle Unterschied ist:

### Eventorientiert

```text
node.moved empfangen
→ Nachricht prüfen
→ lokalen Zustand aktualisieren
→ mit optimistischem Zustand abgleichen
```

### Abfrageorientiert

```text
Knoten und Kanten abonnieren
→ abonniertes Ergebnis bleibt aktuell
```

Die Komplexität verschwindet nicht. Mehr davon wandert in die Synchronisationsschicht.

Für die Leinwand könnte das Modell sein:

- Knoten und Kanten: Transaktionen;
- Aktive Teilnehmer und Auswahl: Anwesenheit;
- temporäre Aktivität: Themen.

Optimistisches lokales Verhalten ist Teil des Kundenmodells. Der Benutzer kann einen Knoten sofort verschieben, ohne auf einen Roundtrip warten zu müssen, während die zugrunde liegende Transaktion im Hintergrund synchronisiert wird.

Dadurch kann der anwendungsspezifische Code erheblich reduziert werden für:

- Cache-Ungültigmachung;
- Abonnementverwaltung;
- optimistische Updates;
- lokale Versöhnung;
- Mehrere Ansichten konsistent halten.

Der Kompromiss ist architektonisches Engagement.

Die Einführung vonInstantDBbedeutet die Einführung von mehr als nur einem Transportkanal:

- sein Schemamodell;
- seine Abfragesprache;
- seine Transaktions-API;
- sein Berechtigungssystem;
- sein Synchronisationsverhalten.

Das ist eine größere Entscheidung als das Hinzufügen einer Echtzeitzustellung zu einem bestehendenPostgres-Backend.

Der faire Vergleich ist daher nicht:

>InstantDBist besser alsSupabase.

Es ist:

>InstantDBübernimmt mehr Synchronisierungsarbeit, währendSupabaseeinen größeren Teil dieser Arbeit in der Anwendung belässt.

Die richtige Wahl hängt davon ab, ob es sich lohnt, die Synchronisationsprobleme zu reduzieren und eine eigenwilligere Backend-Abstraktion einzuführen.

[D4: Ereignisorientierte versus abfrageorientierte Synchronisierung – Vergleichen Sie eine kurze Ereignisverarbeitungskette mit einem abonnierten Ergebnismodell. Fügen Sie optional neben demInstantDB-Pfad einen kleinen Status „Ausstehende Synchronisierung“ hinzu.]

**Quellen:**InstantDB,[Database in the Browser, a Spec](https://www.instantdb.com/essays/db_browser)(vom Anbieter verfasst);InstantDB,[A backend for AI-coded apps](https://www.instantdb.com/essays/architecture)(vom Anbieter erstellt);InstantDB,[InstaQL](https://www.instantdb.com/docs/instaql);InstantDB,[Presence and topics](https://www.instantdb.com/docs/presence-and-topics);InstantDB,[Permissions](https://www.instantdb.com/docs/permissions);InstantDB,[Self-hosting](https://www.instantdb.com/docs/self-hosting)

## Alternativen lösen verschiedene Ebenen

SupabaseundInstantDBsind nicht die einzigen sinnvollen Optionen, und mehrere relevante Alternativen lösen verschiedene Teile der Architektur.

### Liveblocks: Zusammenarbeit zu einem bestehenden Produkt hinzufügen

Liveblocksist eine spezielle Kollaborationsschicht und kein allgemeiner Ersatz für Anwendungsdatenbanken.

Es bietet Funktionen wie:

- Anwesenheit;
- Cursor;
- gemeinsamer Speicher;
- Kommentare;
- kollaborativeReact Flow-Integrationen.

Es eignet sich für Teams, die bereits über ein Backend verfügen und eine fokussierte Ebene für die Zusammenarbeit rund um Leinwände, Dokumente oder Diskussionen hinzufügen möchten.

### Yjs: Datenstrukturen, die zum Zusammenführen entwickelt wurden

YjsstelltCRDT-basierte gemeinsam genutzte Datentypen bereit.

Zwei getrennte Teilnehmer können dasselbe Dokument unabhängig voneinander bearbeiten und ihre Änderungen später zusammenführen, ohne das gesamte Dokument durch einen Gewinner zu ersetzen.

Es eignet sich für Fälle, in denen:

- Offline-Arbeit ist wichtig;
- Das gleichzeitige Zusammenführungsverhalten ist von zentraler Bedeutung.
- Rich-Text oder strukturierte gemeinsame Bearbeitung sind eine Grundvoraussetzung.

Yjsbefindet sich auf einer niedrigeren Ebene alsSupabaseoderInstantDB. Teams entscheiden sich immer noch für die Netzwerk-, Persistenz-, Authentifizierungs- und Betriebsebenen.

### Firebase: Etablierte Synchronisierung zwischen Datenbank und Client

FirebaseRealtimeDatenbank- und Firestore-Listener bleiben etablierte Modelle für Clientanwendungen, die sich ändernde Backend-Daten direkt abonnieren.

Sie sind nützliche Referenzpunkte für Produkte wieInstantDB, da sie sowohl die Attraktivität als auch die lange Geschichte datenbankgesteuerter Echtzeitschnittstellen demonstrieren.

### Benutzerdefinierte Synchronisierungs-Engine: Zusammenarbeit als Kerninfrastruktur

Eine benutzerdefinierte Synchronisierungs-Engine ist sinnvoll, wenn:

- Kollaborationssemantik ist Teil des geistigen Eigentums des Produkts;
- kein bestehendes System passt zum Konfliktmodell;
- Größe rechtfertigt spezialisierte Infrastruktur;
– Das Team benötigt vollständige Kontrolle über Bestellung, Validierung und Persistenz.

Figmaist das offensichtliche Beispiel. Es ist auch ein Beweis für den technischen Aufwand, den diese Route erfordert.

**Quellen:**Liveblocks,[React Flow integration](https://liveblocks.io/docs/api-reference/liveblocks-react-flow);Liveblocks,[documentation](https://liveblocks.io/docs);Yjs-Dokumentation,[https://docs.yjs.dev/](https://docs.yjs.dev/);Firebase,[Realtime Database documentation](https://firebase.google.com/docs/database);Firebase,[Cloud Firestore realtime listeners](https://firebase.google.com/docs/firestore/query-data/listen);Figma,[How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)

## Wählen Sie die Ebene aus, die die Schnittstelle tatsächlich benötigt

Es gibt keinen universellen Gewinner, da diese Optionen unterschiedliche Fragen beantworten.

### Einfache Lieferung

**Umfrage**

Verwenden Sie diese Option, wenn Aktualisierungen selten erfolgen, Verzögerungen akzeptabel sind und die Schnittstelle hauptsächlich den Aufgabenstatus meldet.

**SSE**

Wird verwendet, wenn Informationen hauptsächlich vom Server zum Browser fließen, insbesondere für die Ausgabe oder den Fortschritt des Agenten.

### Realtime-Infrastruktur

**BenutzerdefiniertWebSockets**

Verwenden Sie es, wenn das Protokoll so spezialisiert ist, dass es die Verwaltung, Reihenfolge, Räume, Persistenz und Abstimmung von Verbindungen rechtfertigt.

**SupabaseRealtime**

Verwenden Sie diese Option, wennPostgresdie Quelle der Wahrheit bleiben soll und die Anwendung die Zusammenarbeit aus Broadcast-, Präsenz- und Datenbankereignissen zusammenstellen kann.

### Synchronisierung auf höherer Ebene

**InstantDB**

Wird verwendet, wenn der synchronisierte Clientstatus im Mittelpunkt steht und das Projekt ein integriertes, synchronisierungsorientiertes Backend-Modell übernehmen kann.

**Liveblocks**

Verwenden Sie diese Option, wenn die Zusammenarbeit zu einem vorhandenen Produkt hinzugefügt werden soll, ohne das Haupt-Backend zu ersetzen.

**Yjs**

Verwenden Sie diese Option, wenn gleichzeitiges Zusammenführen und Offline-Bearbeiten Anforderungen definieren.

| Schnittstellenbedarf | Praktischer Ausgangspunkt |
|---|---|
| Überprüfen Sie, ob eine Hintergrundaufgabe abgeschlossen wurde | Umfrage |
| Ausgabe oder Fortschritt des Stream-Agenten |SSE|
| Erstellen Sie ein spezielles Echtzeitprotokoll |WebSockets|
| Fügen Sie Echtzeitfunktionen rund umPostgres| hinzuSupabase|
| Einführung eines integrierten, synchronisierungsorientierten Backends |InstantDB|
| Zusammenarbeit zu einer vorhandenen Anwendung hinzufügen |Liveblocks|
| Gleichzeitige oder Offline-Bearbeitungen zusammenführen |Yjs|

Dies sind Ausgangspunkte, keine automatischen Antworten. Ein Produktionssystem kann mehrere davon kombinieren.

## Kehren Sie zur Leinwand zurück

Kehren Sie von Anfang an auf die überfüllte Leinwand zurück.

Die gleichen Teilnehmer sind weiterhin aktiv:

- der Benutzer;
- ein anderer menschlicher Gutachter;
- der Forschungsagent;
- der Strukturagent.

Die Aktivität hat nicht abgenommen.

Was sich ändert, ist, dass die Aktivität verständlich geworden ist.

[V5: Ein lesbarer Arbeitsbereich für mehrere Agenten – Der Benutzer erstellt eine Idee, während der Forschungsagent ankündigt, dass er Beweise hinzufügt. Der Strukturagent markiert zwei Ziele, bevor er sie verbindet. Ein zweiter Mensch überprüft die Frage der obersten Ebene. Wenn eine Agentenaktion mit einer menschlichen Bearbeitung in Konflikt steht, wendet die Schnittstelle eine sichtbare Richtlinie an und zeichnet das Ergebnis im Aktivitätsverlauf auf.]

Nichts, was ein Agent tut, kommt ohne Kontext an.

Sein Ziel wird vor der Aktion sichtbar. Provisorische Arbeit sieht provisorisch aus. Abgeschlossene Arbeiten werden angerechnet. Folgeänderungen können unterbrochen oder rückgängig gemacht werden. Wenn sich zwei Aktionen überschneiden, folgt das Ergebnis einer Regel, die die Schnittstelle erklären kann.

Die endgültige Leinwand ist nicht weniger aktiv als die überfüllte Version.

Es fühlt sich ruhiger an, weil die Handlungen mit Identität, Absicht und einer klaren Möglichkeit zum Eingreifen erfolgen.

## Design für Teilnehmer, nicht für Anfragen

Das Argument reduziert sich auf zwei Fragen:

> Wie erreicht eine Veränderung alle?

Und:

> Wie kann jeder diese Änderung verstehen und sicher darauf reagieren?

Polling,SSE,WebSockets, verwaltete Echtzeitdienste und Synchronisierungs-Engines beantworten die erste Frage auf verschiedenen Abstraktionsebenen.

Präsenz, Absicht, Namensnennung, Berechtigungen, Konfliktrichtlinien und Rückgängigmachen sind die zweite Antwort.

Eine schnelle Verbindung kann ein lesbares Interaktionsmodell nicht ersetzen.

Die nächste Generation von KI-Produkten sollte nicht auf Anfragen ausgerichtet sein.

Es sollte auf die Teilnehmer ausgerichtet sein.
