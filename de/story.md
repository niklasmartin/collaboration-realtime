# Ihr nächstes KI-Interface ist ein Multiplayer-Interface

## Status

Gliederung des Arbeitsaufsatzes. Dies ist keine polierte Artikelkopie.

Der Artikel ist als visuelle Geschichte aufgebaut. Jede wichtige Idee wird durch eine kleine, deterministische Leinwandanimation demonstriert. Animations-IDs (V1–V10) beziehen sich auf[`animations.md`](./animations.md). In zwei Abschnitten (12–13) werden statische Diagramme anstelle von Animationen verwendet – siehe unten.

---

## Kernthese

Softwareschnittstellen wurden größtenteils um einen aktiven Benutzer herum entwickelt: Der Benutzer agiert, das System reagiert und der Benutzer agiert erneut.

Agenten ändern dieses Beteiligungsmodell. Zunächst arbeitet ein Agent mit einem Benutzer zusammen. Bald können mehrere Benutzer und mehrere spezialisierte Agenten denselben gemeinsamen Arbeitsbereich gleichzeitig beobachten, entscheiden und ändern.

Dadurch entstehen zwei verwandte, aber unterschiedliche Herausforderungen:

1. **Synchronisierung:** Wie erhält jeder Teilnehmer den neuesten Stand?
2. **Verständnis und Kontrolle:** Wie versteht jeder Teilnehmer, wer was geändert hat, was jetzt passiert und wie er eingreifen kann?

Das technische Argument sollte neutral bleiben: Polling,SSE,WebSockets, verwaltete Echtzeitinfrastruktur, Synchronisierungs-Engines undCRDT-basierte Systeme lösen verschiedene Ebenen des Problems.InstantDBist eine vernünftige Option, nicht der unvermeidliche Gewinner.

---

## Ton- und Storytelling-Prinzipien

- Schreiben Sie einen fundierten Produkt- und Technikaufsatz, nicht eine Anbietervergleichsseite.
- Beginnen Sie mit einem beobachtbaren Schnittstellenmoment, nicht mit der Infrastrukturterminologie.
- Kehren Sie im gesamten Artikel zur gleichen Leinwand zurück, damit die Komplexität visuell zunimmt.
- Stellen Sie technische Konzepte erst vor, nachdem der Leser das Problem gesehen hat, das sie lösen.
- Behandeln Sie einfache Lösungen respektvoll. Umfragen sind oft richtig, wenn die Anforderungen einfach sind.
- Halten Sie die erste Hälfte für Produkt-, Design- und Geschäftsleser zugänglich.
- Nutzen Sie das letzte Drittel, um die technische Tiefe der Agentur zu demonstrieren.
- Bevorzugen Sie lebendige, leicht verspielte Abschnittseinleitungen, gefolgt von präzisen Erklärungen.

---

# Vorgeschlagene Artikelstruktur

## 1. Eröffnung: Auf der Leinwand wird es eng

### Geschichte

Öffnen Sie eine kleine Knotenleinwand. Ein Benutzer verschiebt einen Knoten. Ein Rechercheagent erstellt Beweise. Ein Strukturagent stellt eine Verbindung her. Ein zweiter Mensch wählt den ursprünglichen Knoten aus. Zwei Teilnehmer nähern sich demselben Objekt.

Halten Sie im Moment vor einer Kollision an und fragen Sie:

> Wer hat jetzt die Kontrolle?

Der Punkt ist nicht, dass die Schnittstelle beschäftigt ist. Der Punkt ist, dass nun mehrere unabhängige Teilnehmer dieselbe Welt verändern können.

### Animation

Verwenden Sie **V1– The Canvas Gets Crowded** von`animations.md`(Ankerszene, volle Breite).

### Argument eingeführt

Moderne Agentenschnittstellen werden zu Multiplayer-Schnittstellen. Dies ist sowohl ein Benutzererfahrungsproblem als auch ein Problem verteilter Systeme.

### Quellen

-Figma, **So funktioniert die Multiplayer-Technologie vonFigma** – Konfliktbehandlung auf Eigenschaftsebene und Verhalten beim letzten Wert:https://www.figma.com/blog/how-figmas-multiplayer-technology-works/-Figma, **Multiplayer zuverlässiger machen** – die Infrastruktur rund um einen maßgeblichen Multiplayer-Dienst:https://www.figma.com/blog/making-multiplayer-more-reliable/

---

## 2. Software, die vorgab, einen einzigen Benutzer zu haben

### Geschichte

Beschreiben Sie den alten Interaktionsvertrag:

1. Die Schnittstelle wartet.
2. Der Benutzer klickt.
3. Der Server verarbeitet die Anfrage.
4. Die Schnittstelle zeigt das Ergebnis an.
5. Der Benutzer handelt erneut.

Auch Software mit vielen Accounts verhält sich innerhalb einer Sitzung oft wie eine Einzelspieler-Anwendung. Der Benutzer bleibt der einzige sichtbare Initiator.

### Animation

Verwenden Sie **V2– Von der Anfrage zur gemischten Initiative**, nur Phase 1 (der immer noch Anfrage-Antwort-Vertrag).V2ist eine einzelne zweiphasige Szene, die mit Abschnitt 3 unten geteilt wird; Phase 2 (der Agent tritt ein) wird abgespielt, nachdem das Argument dieses Abschnitts gelandet ist.

Die Stille dieser Phase ist wichtig und gewollt: Nichts bewegt sich, bis der Cursor klickt, und der Kontrast wird aufgebaut, von dem Phase 2 abhängt.

### Hauptargument

Herkömmliche Schnittstellen basieren auf einer klaren Handlungskette. Die Person initiiert eine Aktion und die Software reagiert. Dadurch werden Kausalität und Verantwortung leicht verständlich.

### Quellen

- Eric Horvitz, **Prinzipien gemischter Benutzeroberflächen** – grundlegender Rahmen für die Kombination von direkter Manipulation und automatisierter Initiative:https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/– Microsoft Research, **Richtlinien für die Interaktion zwischen Mensch und KI** – Sichtbarkeit von Fähigkeiten, Korrektur, Entlassung und Benutzerkontrolle:https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/

---

## 3. Dann betritt ein Agent die Schnittstelle

### Geschichte

Der Benutzer startet eine Rechercheaufgabe. Anstatt eine letzte Antwort zurückzugeben, bleibt der Agent aktiv:

- es lautet;
- es erstellt ein provisorisches Objekt;
- es ändert einen Status;
- es bittet um Zustimmung;
- Der Benutzer kann es unterbrechen oder umleiten.

Die Software reagiert nicht mehr nur. Ein anderer Teilnehmer agiert innerhalb der Schnittstelle.

### Animation

Verwenden Sie **V2– Von der Anfrage zur gemischten Initiative**, Phase 2 (der Agent betritt denselben Canvas aus Abschnitt 2). Dies ist die gleiche Szene wie in Abschnitt 2, Fortsetzung – keine neue Leinwand.

Der Agent sollte seine Absicht sichtbar ankündigen, bevor er die Leinwand ändert. Ein vorläufiger Knoten verwendet einen gestrichelten Rand und wird erst dann durchgezogen, wenn er akzeptiert wird.

### Fragen zur Einführung

- Denkt, wartet, schlägt oder handelt der Agent?
- Was ist vorläufig und was ist verpflichtet?
- Kann der Benutzer sicher eingreifen, während der Agent arbeitet?
- Wer ist für die daraus resultierende Änderung verantwortlich?

### Quellen

– Microsoft Research, **Richtlinien für die Mensch-KI-Interaktion**:https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/- Eric Horvitz, **Prinzipien gemischt-initiativer Benutzeroberflächen**:https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/

---

## 4.Realtimeist nicht dasselbe wie verständlich

### Geschichte

Zeigen Sie die gleiche Leinwand mit sofortiger Aktualisierung an, jedoch ohne Cursor, Beschriftungen, Absichten oder Verlauf. Knoten verschieben sich und Kanten wirken, als ob das Dokument verfolgt würde.

Fügen Sie dann nacheinander erklärende Ebenen hinzu:

1. Teilnehmercursor;
2. Namen;
3. Auswahl;
4. Absichtsetiketten;
5. Namensnennung;
6. Rückgängig machen.

Der Zustand ist in beiden Versionen technisch identisch, allerdings fühlt sich nur die zweite Version vertrauenswürdig an.

### Animation

Verwenden Sie **V3 – Von der unheimlichen Arbeitsfläche zum gemeinsamen Arbeitsbereich** (Ankerszene, volle Breite).

### Fünf Fragen zur Zusammenarbeit

Verwenden Sie diese als Rahmen für den Rest des Artikels:

1. **Status:** Was enthält das freigegebene Dokument?
2. **Anwesenheit:** Wer ist gerade hier?
3. **Absicht:** Was macht jeder Teilnehmer oder bereitet sich darauf vor?
4. **Autorität:** Wer darf welche Objekte ändern?
5. **Konflikt:** Was passiert, wenn sich Änderungen überschneiden?

### Hauptargument

Eine technisch synchronisierte Schnittstelle kann trotzdem unbrauchbar sein. Der gemeinsame Zustand erfordert sichtbare Handlungsspielräume, Zuordnung, Berechtigungen und Wiederherstellungsmechanismen.

### Quellen

– Microsoft Research, **Richtlinien für die Mensch-KI-Interaktion**:https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/-Figma, **So funktioniert die Multiplayer-Technologie vonFigma**:https://www.figma.com/blog/how-figmas-multiplayer-technology-works/

---

## 5. Die erste Umsetzung: „Gibt es etwas Neues?“

### Geschichte

Führen Sie Umfragen durch die Erfahrung und nicht durch das Protokoll ein. Der Browser fragt immer wieder, ob der Agent fertig ist. In den meisten Antworten heißt es, dass sich nichts geändert habe. Schließlich erscheint ein neuer Knoten.

Umfragen sollten nicht verspottet werden. Es ist vertraut, leicht zu debuggen und oft ausreichend.

### Animation

Verwenden Sie **V4– Umfrage: Sind wir schon da? ** (inline).

Zeigen Sie optional zwei Clients an, die zu unterschiedlichen Zeitpunkten Abfragen durchführen, sodass eine Leinwand vorübergehend den veralteten Status anzeigt.

### Erklären Sie die Umfrage

Ein Client sendet regelmäßig eineHTTP-Anfrage:

```js
const timer = setInterval(async () => {
  const state = await fetch('/api/jobs/42').then((res) => res.json());
  render(state);
}, 3000);
```

### Gute Passform

- Hintergrundexportstatus;
- eine langsame Forschungsaufgabe;
- Benachrichtigung zählt;
- Arbeitsabläufe, bei denen mehrere Sekunden Verzögerung akzeptabel sind;
- einfache Systeme, bei denen betriebliche Klarheit wichtiger ist als Unmittelbarkeit.

### Nachteile

- Die Latenz ist durch das Intervall begrenzt.
- Die meisten Anfragen können unveränderte Daten zurückgeben.
- Der Verkehr wächst sowohl mit der Teilnehmerzahl als auch mit der Häufigkeit der Umfragen.
- Überlappende und nicht in der Reihenfolge liegende Antworten erfordern Vorsicht.
- Umfragen drücken natürlicherweise keine Präsenz oder Lebensabsicht aus.

### Quellen

-MDN, **Fenster: setInterval()-Methode**:https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval-MDN, **DieWebSocket-API** – nützlich als Kontrast zu wiederholten Abfragen:https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

---

## 6. Streaming ist kein Multiplayer

### Geschichte

Der Agent produziert kontinuierlich Text oder Fortschritt. Es fühlt sich lebendig an, aber das freigegebene Diagramm bleibt unverändert, bis ein endgültiges Ergebnis festgeschrieben wird.

### Animation

Verwenden Sie **V5– Der Agent kann sprechen, aber keine Welt teilen** (kleine Inline-Szene).

Auf der linken Seite wird Text gestreamt. Die Leinwand auf der rechten Seite bleibt still, bis der letzte Knoten erscheint.

### Erklären SieSSE

Server-Sent Eventsstellt einen langlebigen Server-zu-Browser-Stream überHTTPbereit. Sie eignen sich hervorragend für:

- Token-Streaming;
- Fortschrittsaktualisierungen;
- Agentenprotokolle;
- Serverbenachrichtigungen.

Browser-zu-Server-Aktionen verwenden weiterhin normaleHTTP-Anfragen.

### Zentraler Satz

> Durch Streaming kann ein Agent kontinuierlich sprechen. Es synchronisiert nicht automatisch einen freigegebenen Arbeitsbereich.

### Quellen

-MDN, **Vom Server gesendete Ereignisse verwenden**:https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

---

## 7.WebSockets: Die Pipe ist schnell; Jetzt baue den Raum

### Geschichte

Ersetzen Sie die wiederholten Abfrageimpulse durch eine dauerhafte Verbindung. Ein Knoten bewegt sich auf einer Leinwand und bewegt sich sofort auf einer anderen. Für einen Moment scheint das System gelöst zu sein.

Stellen Sie dann die unbeantworteten Fragen vor:

- erneut verbinden?
- Autorisierung?
- Zimmer?
- Bestellen?
- Beharrlichkeit?
- Konflikte?
- optimistischer Zustand?

### Animation

Verwenden Sie **V6—WebSocketsLösen Sie die Pipe** (inline).

Die elegante Verbindung erhält nach und nach zusätzliche Stränge für Präsenz, Ereignisse, Wiederholungsversuche, Bestätigungen und Beständigkeit.

### Erklären SieWebSockets

WebSocketsbietet dauerhafte, bidirektionale Kommunikation. Sie lösen das Transportproblem, definieren jedoch nicht die Shared-State-Semantik der Anwendung.

Eine benutzerdefinierte Implementierung muss noch entscheiden:

- wie sich Clients authentifizieren und Räumen beitreten;
– wie Ereignisse geordnet und dedupliziert werden;
- wie der Status nach dem erneuten Verbinden wiederhergestellt wird;
- welche Updates bestehen bleiben;
- wie optimistische Veränderungen in Einklang gebracht werden;
- wie gleichzeitige Bearbeitungen gelöst werden;
- wie Berechtigungen überprüft werden;
- wie die Infrastruktur überwacht und skaliert wird.

### High-Level-Snippet

```js
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

if (message.type === 'node.moved') {
    applyRemoteNodePosition(message.nodeId, message.position);
  }
});
```

Der Ausschnitt sieht einfach aus, weil die schwierigen Fragen um ihn herum lauern.

### Quellen

-MDN, **DieWebSocket-API**:https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API-Figma, **So funktioniert die Multiplayer-Technologie vonFigma**:https://www.figma.com/blog/how-figmas-multiplayer-technology-works/-Figma, **Multiplayer zuverlässiger machen**:https://www.figma.com/blog/making-multiplayer-more-reliable/–InstantDB, **Ein Backend für KI-codierte Apps** – vom Anbieter verfasste Erklärung der Architektur rund um die Synchronisierung; explizit als Perspektive vonInstantDBverwenden:https://www.instantdb.com/essays/architecture

---

## 8. Was passiert, wenn zwei Teilnehmer denselben Knoten aktualisieren?

### Geschichte

Dies ist die zentrale Konfliktlösungsszene. Zwei Cursor erreichen denselben Knoten und ziehen ihn in entgegengesetzte Richtungen.

Präsentieren Sie „Konfliktlösung“ nicht als eine Funktion. Zeigen Sie, dass verschiedene Vorgänge unterschiedliche Richtlinien verwenden können.

### Animation

Verwenden Sie **V7– Überschreiben, Sperren oder Zusammenführen?** (Ankerszene, volle Breite).

Die Animation durchläuft drei Ansätze:

1. **Der letzte akzeptierte Wert gewinnt:** Der Knoten setzt sich an der endgültigen empfangenen Position ein.
2. **Sperren:** Der erste Bearbeiter ist vorübergehend Eigentümer des Objekts.
3. **Zusammenführung auf Eigenschaftsebene:** Ein Teilnehmer ändert die Bezeichnung, während ein anderer eine separate Eigenschaft ändert, und beide überleben.

### Hauptargument

Die richtige Richtlinie hängt von der Bedeutung der Operation ab.

Eine Leinwand kann sinnvollerweise Folgendes verwenden:

- Last-Write-Wins auf Eigenschaftsebene für Positionen;
- Koexistenz für unabhängige Knoten und Kanten;
- explizite Sperren für destruktive Operationen;
- Vorschau und Genehmigung für Folgemaßnahmen des Agenten;
- CRDTs für Daten, die tatsächlich eine gleichzeitige Zusammenführung erfordern.

### Quellen

-Figma, **So funktioniert die Multiplayer-Technologie vonFigma** – Konflikte zwischen gleichen Eigenschaften und gleichen Objekten und letzter empfangener Wert:https://www.figma.com/blog/how-figmas-multiplayer-technology-works/-Figma, **RealtimeBearbeitung geordneter Sequenzen** – Herausforderungen bei gleichzeitigen Bearbeitungen geordneter Strukturen:https://www.figma.com/blog/realtime-editing-of-ordered-sequences/-Yjs-Dokumentation –CRDT-basierte gemeinsam genutzte Datentypen:https://docs.yjs.dev/

---

## 9. Drei Arten von Echtzeitinformationen

### Geschichte

Trennen Sie vor der Einführung von Produkten die Datenkategorien. Die gleiche Leinwand erzeugt drei verschiedene Arten von Informationen:

1. Ein Knoten wird erstellt und muss bestehen bleiben.
2. Ein Cursor ist nur vorhanden, während ein Teilnehmer verbunden ist.
3. Ein vorübergehender Aktivitätsimpuls erscheint und verschwindet.

### Animation

Verwenden Sie **V8– Drei Spuren: Dokument, Präsenz, Signal**, nur Phase 1 (die Taxonomie, bevor ein Anbieter benannt wird).V8ist eine einzelne zweiphasige Szene, die mit Abschnitt 10 unten geteilt wird; Phase 2 leitet dieselben drei Spuren durchSupabase.

### Konzepte

- **Persistenter Dokumentstatus:** Knoten, Kanten, Beschriftungen, abgeschlossene Agentenaktionen.
- **Anwesenheit:** Online-Teilnehmer, aktuelle Auswahl, aktives Dokument, sich langsam ändernder Status.
- **Kurzlebige Signale:** Cursorbewegung, Drag-Vorschau, Reaktionen, temporäre Agentenabsicht.

### Wichtige Nuance

Hochfrequente Cursorbewegungen sollten im Allgemeinen nicht als dauerhafter Datenbankstatus geschrieben werden. Je nach Plattform ist Presence selbst möglicherweise auch für sehr hochfrequente Updates ungeeignet;  Der offizielle Leitfaden vonSupabaseempfiehlt Broadcast statt Presence für sich schnell ändernde Cursordaten.

### Quellen

-Supabase, **Realtime** – Broadcast-, Presence- undPostgres-Änderungen:https://supabase.com/docs/guides/realtime-Supabase, **Presence** – Presence ist für langsamere Zustandsänderungen gedacht; Broadcast wird für hochfrequente Updates empfohlen:https://supabase.com/docs/guides/realtime/presence-InstantDB, **Präsenz und Themen**:https://www.instantdb.com/docs/presence-and-topics

---

## 10.Supabase: BehaltePostgresund setze die Echtzeitteile zusammen

### Geschichte

Zeigen Sie die Leinwand an, die unterschiedliche Informationen über verschiedene Spuren sendet:

- dauerhafte Knotenänderungen über die Datenbank;
- Cursorbewegung durch Broadcast;
- Teilnehmerstatus durch Anwesenheit.

Ein zweiter Kunde rekonstruiert das komplette Erlebnis aus diesen Kanälen.

### Animation

Verwenden Sie **V8– Drei Spuren: Dokument, Präsenz, Signal**, Phase 2 (die gleichen drei Spuren, jetzt überSupabase's Broadcast/Presence/Postgres-Änderungen geroutet und auf einem zweiten Client rekonstruiert). Dies ist die gleiche Szene wie in Abschnitt 9, Fortsetzung – keine neue Leinwand.

### Erklären Sie das Modell

SupabaseRealtimebietet mehrere Grundelemente:

- **Broadcast:** Nachrichten mit geringer Latenz zwischen Clients und durch die Datenbank ausgelöste Broadcasts;
- **Anwesenheit:** synchronisierter Teilnehmerstatus;
- **PostgresÄnderungen:** Abonnements für Datenbankänderungen.

In der aktuellen Dokumentation vonSupabasewird Broadcast für viele Anwendungsfälle von Datenbankänderungen empfohlen, wenn Anwendungen skaliert werden, währendPostgresChanges weiterhin für einfachere Abonnements praktisch ist.

### Warum es attraktiv ist

-Postgresbleibt das Aufzeichnungssystem.
– Bestehendes SQL, relationale Modelle und Sicherheit auf Zeilenebene bleiben relevant.
- Persistente und ephemere Informationen können getrennt modelliert werden.
– Teams können Echtzeitfunktionen hinzufügen, ohne das komplette Backend zu ersetzen.

### Kompromisse

- es handelt sich eher um eine Reihe von Grundelementen als um ein vollständiges Synchronisationsmodell;
- Die Anwendung verfügt weiterhin über optimistische Benutzeroberflächen- und Abstimmungsentscheidungen.
- Konfliktrichtlinien bleiben anwendungsspezifisch;
- Kanallebenszyklus, Wiederverbindung, Filterung und Quoten erfordern eine bewusste Handhabung;
- Der hochfrequente Cursorverkehr sollte gedrosselt und auf den entsprechenden Mechanismus übertragen werden.
- Sicherheit auf Zeilenebene und Fanout-Verhalten können sich auf Skalierung und Leistung auswirken.

### High-Level-Snippets

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

Erwähnen Sie, dass eine Produktionsarchitektur stattdessen Datenbankänderungen übertragen kann, wie in der aktuellenSupabase-Anleitung empfohlen.

### Quellen

-Supabase, **RealtimeArchitektur**:https://supabase.com/docs/guides/realtime/architecture-Supabase, **Realtime**:https://supabase.com/docs/guides/realtime-Supabase, **Abonnieren von Datenbankänderungen** – Empfehlung zur Verwendung von Broadcast für die meisten skalierten Anwendungsfälle:https://supabase.com/docs/guides/realtime/subscribing-to-database-changes-Supabase, **Übertragung**:https://supabase.com/docs/guides/realtime/broadcast-Supabase, **Anwesenheit**:https://supabase.com/docs/guides/realtime/presence-Supabase, **RealtimeGrenzwerte**:https://supabase.com/docs/guides/realtime/limits- AgileSoftLabs, **SupabaseRealtimein der Produktion** – nur als sekundäre Praktikerperspektive verwenden und sich ändernde Grenzwerte anhand der offiziellen Dokumentation vonSupabaseüberprüfen:https://www.agilesoftlabs.com/blog/2026/05/supabase-realtime-in-production-what

---

## 11.InstantDB: Abonnieren Sie die Form der Welt

### Geschichte

Wechsel vom ereignisorientierten Denken zum zustandsorientierten Denken. Der Client erklärt, dass er Knoten und Kanten benötigt. Wenn ein Mensch oder Agent diese Daten ändert, ändert sich auch das abonnierte Ergebnis.

Dann zeigen Sie einen optimistischen Widerstand:

1. Der Benutzer verschiebt den Knoten lokal;
2. es bewegt sich sofort;
3. Es erscheint eine kleine Warteanzeige.
4. Die Synchronisierung ist abgeschlossen.
5. Die Anzeige verschwindet.

### Animation

Verwenden Sie **V9—InstantDB: Abonnieren Sie die Welt** (inline).

### Erklären Sie die Abstraktion

InstantDBkombiniert eine Datenbankabstraktion mit reaktiven Clientabfragen, Transaktionen, optimistischem Zustand, Präsenz und kurzlebigen Themen.

Für die Beispiel-Leinwand:

- Knoten und Kanten sind dauerhafte Transaktionen;
- aktive Teilnehmer und Auswahlmöglichkeiten sind Präsenz;
- Kurzlebige visuelle Aktivitäten können Themen verwenden.

### High-Level-Snippets

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

### Warum es attraktiv ist

- Reaktive Abfragen reduzieren den Aufwand für manuelles erneutes Abrufen und Cache-Invalidierung.
- Optimistische Transaktionen sind Teil des Datenmodells;
- Persistenz und Synchronisation nutzen eine integrierte Abstraktion;
- Präsenz- und Übergangsthemen stehen neben dauerhaftem Zustand zur Verfügung;
- Frontend-Benutzer und Backend-Agenten können in dasselbe konzeptionelle Modell schreiben.

### Kompromisse

- es erfordert ein größeres Engagement für das Schema, die Abfragesprache, die Transaktionen und das Berechtigungsmodell vonInstantDB;
- Die Einführung kann eine größere architektonische Änderung bedeuten als das Hinzufügen von Echtzeitfunktionen zu einem vorhandenenPostgres-Backend.
- Das Synchronisierungsverhalten auf niedrigerer Ebene wird weniger direkt von der Anwendung gesteuert.
- Teams sollten die aktuellen Produktgrenzwerte und Betriebseigenschaften für ihre Arbeitslast überprüfen;
- Selbsthosting überträgt Überwachungs-, Backup- und Zuverlässigkeitsaufgaben an das Team.

### Neutraler Rahmen

>InstantDBentfernt mehr Synchronisierungsarbeit auf Anwendungsebene, besitzt aber auch einen größeren Teil der Datenarchitektur der Anwendung.

### Quellen

–InstantDB, **Datenbank im Browser, eine Spezifikation** – vom Anbieter verfasstes konzeptionelles Argument für reaktive Daten und lokale Konsistenz:https://www.instantdb.com/essays/db_browser-InstantDB, **Ein Backend für KI-codierte Apps** – aktuelle Architekturübersicht:https://www.instantdb.com/essays/architecture-InstantDB, **A Graph-BasedFirebase** – Designmotivationen, optimistische Updates, Multiplayer und Offline-Verhalten:https://www.instantdb.com/essays/next_firebase-InstantDB, **InstaQL**:https://www.instantdb.com/docs/instaql-InstantDB, **Präsenz und Themen**:https://www.instantdb.com/docs/presence-and-topics-InstantDB, **Berechtigungen**:https://www.instantdb.com/docs/permissions-InstantDB, **Selbsthosting**:https://www.instantdb.com/docs/self-hosting

---

## 12. Alternativen lösen verschiedene Ebenen

Halten Sie dies prägnant. Sein Zweck besteht darin, zu verhindern, dass der Aufsatz zu einem binärenSupabase-gegen-InstantDB-Vergleich wird.

**Visueller Hinweis:** Bei der Grafik dieses Abschnitts handelt es sich um ein statisches Diagramm/eine Tabelle, keine Animation – siehe „Statische Diagramme“ in`animations.md`(Tabelle der Kollaborationsebenen). Keine Leinwand, keine Cursor, keine Zeitleiste.

### Liveblocks

#### Positionierung

Eine spezielle Ebene für die Zusammenarbeit, die einer vorhandenen Anwendung hinzugefügt wurde.

#### Gute Passform

- kollaborative Leinwände und Dokumente;
- Anwesenheit, Kommentare, Cursor und gemeinsamer Speicher;
- Teams, die ein bestehendes Backend beibehalten möchten;
- Node-and-Edge-Canvas-Produkte, bei denen speziell entwickelte Kollaborationsintegrationen wertvoll sind.

#### Visuell

Zeile in der statischen Tabelle der Kollaborationsebenen (siehe`animations.md`).

#### Quellen

-Liveblocks-Dokumentation:https://liveblocks.io/docs

### Yjs

#### Positionierung

Ein aufCRDTbasierendes kollaboratives Datenmodell auf niedrigerer Ebene.

#### Gute Passform

- gleichzeitige Bearbeitungen, die zusammengeführt und nicht überschrieben werden sollten;
- Bearbeitung von Rich-Text- oder strukturierten Dokumenten;
- Offline-First-Verhalten;
- Teams, die bereit sind, Transport und Persistenz getrennt auszuwählen oder durchzuführen.

#### Visuell

Zeile in der statischen Tabelle der Kollaborationsebenen (siehe`animations.md`).

#### Quellen

-Yjs-Dokumentation:https://docs.yjs.dev/

### Firebase

#### Positionierung

Das etablierte Datenbank-zu-Client-Synchronisationsmodell und ein wichtiger historischer Vergleich für neuere synchronisationsorientierte Systeme.

#### Quellen

-FirebaseRealtimeDatenbankdokumentation:https://firebase.google.com/docs/database- Cloud Firestore-Echtzeit-Listener:https://firebase.google.com/docs/firestore/query-data/listen

### Benutzerdefinierte Synchronisierungs-Engine

#### Positionierung

Geeignet, wenn das Kollaborationsverhalten zum Kern des geistigen Eigentums gehört, die Konfliktsemantik ungewöhnlich ist oder das Skalenprofil den Besitz des gesamten Stacks rechtfertigt.

#### Quellen

-Figma, **So funktioniert die Multiplayer-Technologie vonFigma**:https://www.figma.com/blog/how-figmas-multiplayer-technology-works/-Figma, **Multiplayer zuverlässiger machen**:https://www.figma.com/blog/making-multiplayer-more-reliable/

---

## 13. Entscheidungshilfe: Wählen Sie die Ebene, die Sie tatsächlich benötigen

Dieser Abschnitt sollte eher ein neutraler Entscheidungsrahmen als eine Rangliste sein.

**Visueller Hinweis:** Bei der Grafik dieses Abschnitts handelt es sich um ein statisches Diagramm/eine statische Tabelle, keine Animation – siehe „Statische Diagramme“ in`animations.md`(Tabelle mit Entscheidungshilfen). Anforderungen in einer Spalte, Technologien in der anderen; kein Podium, keine Hierarchie.

### Verwenden Sie Umfragen, wenn

- Änderungen sind selten;
- Verzögerung ist akzeptabel;
- Die Benutzeroberfläche zeigt den Aufgabenstatus und nicht die gemeinsame Aktivität an.
- Einfachheit und staatenlose Infrastruktur sind Hauptanliegen.

### Verwenden SieSSE, wenn

- Informationen fließen hauptsächlich vom Server zum Browser;
- Token- oder Fortschritts-Streaming ist die zentrale Interaktion;
- Persistenter gemeinsamer Status wird separat behandelt.

### BenutzerdefiniertesWebSocketsverwenden, wenn

- das Protokoll ist hochspezialisiert;
- Das Team benötigt eine Kontrolle auf niedriger Ebene.
- Es kann über Verbindungsinfrastruktur, Synchronisationssemantik und betriebliche Komplexität verfügen.

### Verwenden SieSupabaseRealtime, wenn

-Postgressollte die Quelle der Wahrheit bleiben;
– Das Team möchte verwaltete Broadcast-, Präsenz- und Datenbankereignisse verwalten.
- Anwendungsspezifisches Optimismus- und Konfliktverhalten ist akzeptabel.

### Verwenden SieInstantDB, wenn

- Der synchronisierte Zustand ist für das Produkt von zentraler Bedeutung.
- Das Projekt kann eine synchronisierungsorientierte Backend-Abstraktion übernehmen.
- Die Reduzierung der Frontend-/Backend-Zustandsverteilung ist wertvoller als die Beibehaltung einer herkömmlichenPostgres-zentrierten Architektur.

### Verwenden SieLiveblocks, wenn

- Die Zusammenarbeit wird auf eine bestehende Anwendung geschichtet.
- eine Leinwand, ein Dokument, Kommentare oder Präsenz sind das Hauptmerkmal;
- Speziell entwickelte APIs für die Zusammenarbeit sind dem Ersetzen der Anwendungsdatenbank vorzuziehen.

### Verwenden SieYjs, wenn

- gleichzeitiges Zusammenführen ist eine entscheidende Anforderung;
- Offline-Bearbeitungsangelegenheiten;
– Das Team ist darauf vorbereitet, Transport, Autorisierung und Persistenz rund um die DatenstrukturenCRDTaufzubauen.

### Visuell

Die statische Entscheidungsleitfadentabelle (siehe`animations.md`), keine animierte Szene.

---

## 14. Zurück zur Leinwand: Benutzer und Agenten teilen sich eine Welt

### Geschichte

Kehren Sie zur Eröffnungsszene zurück, aber jetzt hat die Benutzeroberfläche klare Konventionen:

- Der Benutzer erstellt einen Problemknoten;
- Der Forschungsagent gibt seine Absicht bekannt und fügt Beweise hinzu;
- Der Strukturagent markiert zwei Ziele, bevor er sie verbindet.
– Der Benutzer verschiebt einen Knoten, während beide Agenten fortfahren.
- eine Aktion kollidiert mit einer anderen;
- Die ausgewählte Konfliktrichtlinie wird angewendet.
- Das Aktivitätsprotokoll zeichnet das Ergebnis auf;
– Der Benutzer macht eine Agentenaktion rückgängig.

Die endgültige Leinwand sollte sich ruhig und nicht überfüllt anfühlen.

### Animation

Verwenden Sie **V10 – Ein lesbarer Multi-Agent-Arbeitsbereich** (Ankerszene und Abschluss, volle Breite). V10 wird mit den Schlussüberschriften des Artikels fortgesetzt – siehe Abschnitt 15.

### Hauptargument

Eine erfolgreiche Agentenschnittstelle ist nicht nur Echtzeit. Es ist:

- lesbar;
- zurechenbar;
- unterbrechbar;
- erlaubt;
- reversibel;
- explizit auf Konflikte eingehen.

---

## 15. Fazit: Design für Teilnehmer, nicht für Wünsche

### Geschichte

Dieser Abschnitt verfügt über keine eigene Szene. Es ist der Schlussschlag von **V10** (Abschnitt 14): Sobald sich der Multi-Agenten-Arbeitsbereich in seinem ruhigen Schlussbild eingependelt hat, werden die Schlussunterschriften über derselben unbewegten Leinwand eingeblendet – zuerst die beiden Rahmenfragen unten, dann die letzte Zeile. Es gibt keine eigenständige „Evolution“-Wiedergabe; Der Leser hat gerade beobachtet, dass sich im gesamten Artikel eine Entwicklung vollzieht.

### Animation

Fortsetzung von **V10– Ein lesbarer Multi-Agent-Arbeitsbereich**: Die Schlussunterschrift übertönt den ruhigen letzten Frame.

### Abschließende Unterscheidung

Der Artikel sollte mit der Trennung von zwei Fragen enden:

> Wie erreicht eine Veränderung alle?

Und:

> Wie kann jeder diese Änderung verstehen und sicher darauf reagieren?

Polling,SSE, Sockets, Abonnements und Synchronisierungs-Engines adressieren die Zustellung und Statussynchronisierung auf verschiedenen Ebenen. Präsenz, Absicht, Namensnennung, Berechtigungen, Konfliktrichtlinien und Rückgängigmachen machen diesen gemeinsamen Zustand nutzbar.

### Vorgeschlagene letzte Zeile

> Die nächste Generation von KI-Produkten sollte nicht auf Anfragen ausgerichtet sein. Es sollte auf die Teilnehmer ausgerichtet sein.

---

# Vorgeschlagener Artikelsaldo

Für einen Artikel mit etwa 3.000 Wörtern:

- Eröffnungs- und Beteiligungsmodellarbeit: **20%**
- UX, Agentur und Konflikt-Framing: **25 %**
- Umfrage,SSEundWebSockets: **20 %**
-Supabase,InstantDBund Alternativen: **25 %**
- Entscheidungshilfe und Schlussfolgerung: **10 %**

InstantDBsollte nur einen Teil des technischen Abschnitts einnehmen. Der Artikel soll plausibel machen, dass ein Leser basierend auf seinen eigenen Einschränkungen zwischen Polling,Supabase,Liveblocks,Yjsoder einer benutzerdefinierten Socket-Architektur wählen kann.

---

# Redaktionelle Schutzmaßnahmen gegen Anbietervoreingenommenheit

- Kennzeichnen Sie Aufsätze von Anbietern als vom Anbieter verfasste Standpunkte.
- Bevorzugen Sie offizielle Dokumentation zu aktuellen Funktionen, Architektur, Kontingenten und Grenzwerten.
- Nutzen Sie Blog-Beiträge von Praktikern nur als sekundäre operative Perspektiven.
- Vergleichen Sie rohe Beispielcodezeilen nicht so, als würden sie die gesamte Produktionskomplexität widerspiegeln.
- Vergleichen Sie Tools auf der richtigen Abstraktionsebene.
- Geben Sie an, was jede Option **nicht** löst.
- Vermeiden Sie universelle Behauptungen wie „WebSocketsskaliert nicht“ oder „Synchronisierungs-Engines entfernen Konflikte“.
- Erklären Sie den Handel: Tools auf höherer Ebene nehmen Anwendungsarbeit ab, indem sie die Verantwortung für mehr Architektur übernehmen.
- Sorgen Sie dafür, dass der endgültige Entscheidungsleitfaden anforderungsorientiert ist, anstatt einen Gewinner zu ernennen.
