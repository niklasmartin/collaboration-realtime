# Animations-Playbook

## Zweck

Diese Datei definiert das visuelle System und einzelne Animationsszenen für den in [`story.md`](./story.md) beschriebenen Aufsatz. Visuelle Token (Farbe, Typ, Abstand, Bewegung) folgen [`DESIGN.md`](./DESIGN.md), der Quelle der Wahrheit für alle visuellen Entscheidungen in diesem Projekt.

Bei den Animationen handelt es sich um erklärende Illustrationen, nicht um interaktive Produktdemos. Sie sollten deterministisch, minimal, glatt und verständlich sein, ohne dass der Leser auf etwas klicken muss.

Jede Szene wird von Hand gerollt: einfaches SVG für Diagrammelemente (Knoten, Kanten) und positionierte HTML-Overlays für Cursor, Beschriftungen, Impulse und Protokolle, gesteuert durch eine deterministische Keyframe-Zeitleiste in Vanilla-JavaScript. Es gibt kein React, kein JSX und keinen Build-Schritt – der Zustand ist eine reine Funktion der verstrichenen Zeit, berechnet durch einfache Funktionen und gerendert mit „element.setAttribute“/CSS-Transformationen.

---

# Bildsprache

## Gesamtcharakter

Die Animationen sollten sich gemäß der redaktionell-minimalistischen Ausrichtung von DESIGN.md wie redaktionelle Diagramme aus einem hochwertigen Linear-, Figma- oder Stripe-Engineering-Blogartikel anfühlen:

- eher ruhig als auffällig;
- großzügiger Leerraum;
- eingeschränkte Bewegung;
- eine Idee pro Szene;
- keine unnötigen Kontrollen;
- keine realistische Anwendung von Chrom;
- minimaler Text innerhalb der Leinwand;
- Schleifen, die nach einmaligem Betrachten verstanden werden können;
- genau eine Akzentfarbe (`--accent`, `#5e6ad2`) wird als Interpunktion verwendet, niemals als Hintergrund, niemals mit einem zweiten Akzent verdoppelt.

## Kernelemente

Alle folgenden Werte sind DESIGN.md-Tokens (Abschnitt 5, „Animation Canvas-Sprache“); Implementierer sollten sie von dort lesen, nicht von Hardcode-Duplikaten.

### Leinwand

- `--bg-alt` (`#fafafa`) Hintergrund.
- 1 Pixel `--border`, 8 Pixel Radius-Clipping-Container (die Radiusobergrenze von DESIGN.md – niemals überschreiten).
– Schwaches Punktraster bei 24-Pixel-Abstand, Punkte in `--border` bei geringer Deckkraft oder kein Raster.
- Die Kamera wurde in den meisten Szenen repariert.

### Knoten

Verwenden Sie ein kleines Vokabular gemäß DESIGN.md:

- **Standardknoten:** freigegebener Status festgeschrieben. Weiße Füllung, 1 Pixel `--border-strong`, 6 Pixel Radius, 13 Pixel Inter 500-Label.
- **Vorläufiger (gestrichelter) Knoten:** Agentenvorschlag noch nicht festgeschrieben. Gestrichelter 1-Pixel-`--accent`-Rand, `--bg-alt`-Füllung.
- **Ghost-Knoten:** ausstehender, konkurrierender, abgelehnter oder historischer Status. 40 % Deckkraft, keine Beschriftungsbetonung.
- **Ausgewählter/Zielknoten:** aktuelles Ziel oder aktuelle Auswahl. 2-Pixel-Ring in der Identitätsfarbe des Teilnehmers, 2-Pixel-Versatz.

### Kanten

- 1px `--border-strong`-Kurven, gezeichnet mit „Stroke-Dashoffset“.
- Nur einfache Kurven.
- Vermeiden Sie animierte Partikel, es sei denn, die Szene erklärt ausdrücklich die Nachrichtenübermittlung (z. B. V4, V6, V8).

### Cursor als Zeichen

Cursor tragen die Erzählung. Die Identität wird durch **Form + Etikettenchip, niemals allein durch Farbe** getragen:

- Mensch: klassischer Pfeilcursor, `--text` (dunkelneutral); ein zweiter Mensch nutzt `--text-muted`.
- Agent: abgerundeter oder rautenförmiger geometrischer Zeiger, `--accent`-Familie.
- Systemaktion: Impuls ohne Cursor.
- Jeder aktive Teilnehmer erhält einen kleinen Etikettenchip: 11 Pixel Mono- oder Inter 500-Text, `--surface`-Hintergrund, 1 Pixel `--border`, 4 Pixel Radius (kbd-ähnlicher Stil).

### Absicht vor Tat

Agentenaktionen sollten diesem Rhythmus folgen:

1. Cursor nähert sich dem Ziel;
2. Ziel-Highlights;
3. Prägnantes Absichtsabzeichen erscheint (gleicher Chip-Stil wie Teilnehmeretiketten), 200 ms vor der Aktion, die es ankündigt;
4. Veränderung findet statt;
5. Die Namensnennung bleibt kurz bestehen (im Aktivitätsprotokoll: 11px mono, `--text-dim`, unterer Streifen der Leinwand);
6. Die Schnittstelle kehrt in den Ruhezustand zurück.

### Antrag

- Bevorzugen Sie die Easy-In-Out-Interpolation.
- Die Cursorbewegung sollte leichte natürliche Bögen aufweisen.
– Verwenden Sie 180–350 ms für kleine UI-Übergänge.
- Verwenden Sie 500–900 ms für die bewusste Bewegung des Cursors.
- Halten Sie wichtige Zustände 800–1.500 ms lang.
- Vermeiden Sie ein Überschwingen der Feder, es sei denn, es ist äußerst subtil.
- Kein schnelles Hüpfen, Schütteln oder feierliche Effekte.

### Schleife

- Typische Dauer: 6–12 Sekunden.
- Große Erzählszenen: 12–18 Sekunden.
- Zusammengeführte Szenen mit zwei Phasen (V2, V8) können 18–20 Sekunden dauern, mit einem deutlichen Takt zwischen den Phasen.
- Fügen Sie vor dem Neustart einen kurzen Ruherahmen hinzu.
- Zurücksetzen mit einem sanften Fade- oder Rückwärtsübergang, nicht mit einem harten Sprung.

### Barrierefreiheit

- Respektieren Sie „Prefers-Reduced-Motion“.
- Der bewegungsreduzierte Modus sollte einen repräsentativen Endzustand anzeigen oder durch bewegungsarme Überblendungen schrittweise erfolgen.
- Szenen außerhalb des Ansichtsfensters anhalten.
- Erwägen Sie eine Pause beim Schweben, damit Leser die Etiketten prüfen können.
- Stellen Sie sicher, dass Bildunterschriften das Konzept erläutern, ohne sich ausschließlich auf Animationen zu verlassen.

---

# Gemeinsames Implementierungsmodell

Jede Szene wird durch eine deterministische Zeitleiste gesteuert und nicht durch echte Vernetzung oder zufälliges autonomes Verhalten.

```js
const scene = [
  { at: 0, action: 'show', target: 'canvas' },
  { at: 500, action: 'moveCursor', actor: 'user', target: 'runButton' },
  { at: 1300, action: 'click', actor: 'user', target: 'runButton' },
  { at: 1800, action: 'setStatus', value: 'Working' },
  { at: 3400, action: 'createNode', nodeId: 'result' },
];
```

Empfohlene interne Architektur:

```js
const animations = {
  V1: {
    duration: 14000,
    initialState: {},
    events: [],
  },
};
```

Ein Szenenläufer leitet den visuellen Zustand aus der Zeitleiste und der aktuell verstrichenen Zeit ab („state = Reduce(initialState, events.filter(e => e.at <= t))“). Dadurch bleibt jede Schleife wiederholbar und Artikel-Screenshots sind deterministisch.

## Technologiespaltung

Verwenden Sie einfaches SVG für:

- Knoten und Kanten;
- Knotenpositionen und -pfade;
- Auswahlringe und Hervorhebungszustände;
- Diagramm der Kontinuität zwischen Phasen innerhalb einer Szene.

Verwenden Sie positionierte HTML-Overlays für:

- Cursor;
- Teilnehmer-Label-Chips;
- Hülsenfrüchte;
- Server-/Datenbanksymbole;
- Ereignispakete;
- Geisterpositionen;
- Statushinweise;
- kleine Aktivitätsprotokolle.

Verwenden Sie zur Interpolation einfache CSS-Transformationen oder die Web Animations API. Es ist keine Animationsbibliothek erforderlich; Szenen bleiben deklarativ und zeitliniengesteuert – ein einfaches Objekt, das Ereignisse beschreibt, und eine kleine Runner-Funktion, die die verstrichene Zeit liest und Attribute/Stile schreibt.

---

# Animationskatalog

## V1 – Ein Benutzer, eine Aktion

Kleine Inline-Szene. Der bewusste Aufbau der gesamten Eröffnungssequenz: eine ruhige, fast ereignislose Interaktion, die den alten Einzeldarstellervertrag etabliert, bevor spätere Szenen ihn im Gegensatz dazu aktiver machen.

### Referenziert in

`article.md`, Abschnitt 1: **Schnittstellen waren früher einfach**.

### Zweck

Etablieren Sie das alte Interaktionsmodell – eine Person handelt, die Software reagiert – und sorgen Sie dafür, dass sich seine Kausalität offensichtlich und trivial anfühlt.

### Szene

Ein einfacher Entscheidungsbereich mit drei Elementen:

- Ein Top-Eingabeaufforderungsknoten: „Warum wechseln Kunden ab?“.
- Ein leerer oder gedämpfter Lösungsbereich darunter.
- Eine kompakte Aktionssteuerung mit der Bezeichnung „Idee hinzufügen“.

Es ist nur ein menschlicher Cursor mit der Bezeichnung „Sie“ vorhanden. Die Leinwand ist völlig still, bevor sich der Cursor bewegt.

### Zeitleiste

1. **Ruhe** – Die Leinwand bleibt etwa eine Sekunde lang unverändert. Kein Ladeflimmern, keine Umgebungsaktivität, keine unerklärliche Bewegung.
2. **Der Benutzer nähert sich** – Der Cursor mit der Bezeichnung „Sie“ bewegt sich in Richtung „Idee hinzufügen“. Direkte, gemächliche Bewegung.
3. **Der Benutzer handelt** – Der Cursor klickt. Es erscheint ein kurzer Textwert: „Onboarding-E-Mails“. Die Aktionssteuerung bestätigt die Eingabe mit einem zurückhaltenden gedrückten Zustand.
4. **Das System antwortet** – Unter der ursprünglichen Frage erscheint ein neuer Knoten. Es sollte nicht dramatisch platzen; es kann verblassen und von etwa „0,98“ auf „1“ skalieren, während die Verbindungskante eingezogen wird.
5. **Der Zustand beruhigt sich** – Der Cursor bewegt sich leicht weg. Der neue Knoten bleibt bestehen. Sonst passiert nichts.
6. **Loop Hold** – Halten Sie den abgeschlossenen Zustand lange genug, um Ursache und Wirkung zu registrieren. Anschließend mit einem kurzen Crossfade zurücksetzen.

### Visuelle Kernidee

Für den neuen Knoten gibt es nur eine plausible Erklärung: Der Benutzer hat ihn erstellt. Keine Attributions-Benutzeroberfläche, kein Aktivitätsprotokoll, keine Anwesenheit erforderlich. Die Einfachheit ist der Punkt.

### Optionale minimale Beschriftung

> Eine Aktion hat einen offensichtlichen Eigentümer.

Vermeiden Sie Erzählmechanismen („Sie klicken auf ‚Idee hinzufügen‘ und ein Knoten erscheint“) – die Animation zeigt dies bereits.

### Visuelle Notizen

- Verwenden Sie deterministische Keyframes; Verwenden Sie keine echte Eingabe.
– Der eingegebene Wert kann als zwei oder drei Schnelltextgruppen statt Zeichen für Zeichen animiert werden.
- Halten Sie die Knotenerstellung an der visuellen Sprache von V2.
- Behalten Sie die Leinwandabmessungen und die Typografie nach Möglichkeit mit V2 bei.

### Dauer

6–7 Sekunden (Ruhe 1,0 s, Cursorbewegung 0,8 s, Klicken und Eingabe 0,7 s, Knotenerstellung 0,8 s, beruhigtes Halten 2,0 s, Zurücksetzen 0,7 s).

---

## V2 – Von der Stille zum zweiten Schauspieler

Zwei-Phasen-Szene. Phase 1 ist die bewusste Einrichtung: ein ruhiger, linearer Anfrage-Antwort-Vertrag auf einer Leinwand. Phase 2 durchbricht diese Stille, indem sie einen Agenten auf die gleiche Leinwand bringt – der Kontrast ist der Punkt, daher müssen beide Phasen das gleiche Rahmen- und Knotenvokabular verwenden.

### Referenziert in

`story.md`, Abschnitt 2: **Software, die vorgibt, einen Benutzer zu haben**, und Abschnitt 3: **Dann betritt ein Agent die Schnittstelle**.

### Zweck

Erstellen Sie den traditionellen Interaktionsvertrag für einen einzelnen Teilnehmer und zeigen Sie dann, dass er von einem zweiten, unabhängig agierenden Teilnehmer in derselben Schnittstelle gebrochen wird.

### Szene

Ein Canvas enthält einen Knoten, ein „Run“-Steuerelement und ein „Research“-Steuerelement, die in Phase 2 eingeführt wurden.

### Zeitleiste

#### Phase 1: Benutzer agiert, System reagiert (noch)

1. 700 ms lang bewegt sich nichts.
2. Der menschliche Cursor tritt ein und nähert sich „Ausführen“.
3. Taste wird gedrückt.
4. Eine kleine Fortschrittsanzeige erscheint.
5. Der Cursor bleibt während des Wartens bewegungslos.
6. Ein Ergebnisknoten wird in die Leinwand eingeblendet.
7. Der Cursor bewegt sich, um ihn zu untersuchen.
8. Markieren Sie unten nacheinander: „Benutzer handelt“ → „System antwortet“ → „Benutzer handelt erneut“.
9. Halten Sie den ruhigen, statischen Rahmen für einen vollen Takt bei – diese Stille ist gewollt, keine Pause zwischen den Clips.

#### Phase 2: Der erste Agent betritt den Raum (gleiche Leinwand)

10. Der Mensch klickt auf „Recherche“.
11. Ein Agentencursor erscheint mit der Beschriftung „Research Agent“.
12. Agent bewegt sich zwischen den vorhandenen Knoten; Die Statusbezeichnung ändert sich von „Lesen“ zu „Beweis hinzufügen“.
13. Highlights des Zielbereichs.
14. Der Agent erstellt einen gestrichelten vorläufigen Knoten.
15. Der menschliche Cursor nähert sich dem Knoten, während der Agent noch arbeitet.
16. Der Agent macht eine Pause – ein Beweis für die Unterbrechbarkeit.
17. Ein kleiner Genehmigungsindikator erscheint.
18. Der provisorische Knoten wird fest.
19. Halten Sie die jetzt aktive Leinwand gedrückt. Der Kontrast zur Stille der Phase 1 sollte ohne Beschriftung lesbar sein.

### Visuelle Notizen

- Phase 1 muss sich bewusst ruhig und linear anfühlen – spätere Szenen werden durch den Kontrast aktiver und diese Szene ist die Basislinie, an der sie gemessen werden.
- Der Agent in Phase 2 sollte sich nicht wie ein unsichtbarer Hintergrundprozess anfühlen; seine Absicht wird sichtbar, bevor sich die Leinwand verändert.
- Die Pause, wenn sich der Mensch in Phase 14–16 nähert, ist der erste Beweis für die Unterbrechbarkeit in dem Artikel.

### Dauer

18–20 Sekunden (Phase 1 ≈ 7–8 Sekunden, ein kurzer Schlag, Phase 2 ≈ 10–12 Sekunden).

---

## V3 – Die Leinwand wird überfüllt

**Ankerszene.** Sehen Sie sich zunächst das Multiplayer-Problem an, bevor Sie die Terminologie einführen: Mehrere Menschen und mehrere Agenten, die denselben Zustand teilen, brechen die Annahme einer offensichtlichen Kausalität.

### Referenziert in

`article.md`, Abschnitt 3: **Ein Assistent wird zu einem Raum voller Teilnehmer**.

### Zweck

Erweitern Sie das Interaktionsmodell von einem Benutzer und einem Agenten auf mehrere Menschen und mehrere Agenten und zeigen Sie, dass das Problem nicht in der Anzahl der Animationen auf dem Bildschirm liegt, sondern im Verlust der offensichtlichen Kausalität.

### Szene

Beginnen Sie mit einer Arbeitsfläche, die V2 ähnelt, nachdem sowohl die Idee des Nutzers („Onboarding-E-Mails“) als auch der Vorschlag des Recherche-Agenten („Rückgewinnungsangebot“) und das verschachtelte Rechercheergebnis („Recherche zur Willkommensserie“) angenommen wurden.

Vorgeschlagene vorhandene Knoten:

- „Warum wechseln Kunden ab?“
- „Onboarding-E-Mails“.
- „Rückgewinnungsangebot“.
- „Willkommen zur Serienrecherche“.

Das Bild sollte sich so anfühlen, als ob der Artikel leicht verkleinert wurde und zeigt, dass derselbe Arbeitsbereich mehr Teilnehmer hat.

### Teilnehmer

Vier Teilnehmer:

- „Du“ – Mensch
- „Maya“ – zweiter Mensch
- „Forschungsagent“ – fügt Beweise oder Kontext hinzu
- „Strukturagent“ – verbindet, gruppiert oder ordnet vorhandenes Material neu

Die beiden Agenten sollten unterschiedliche, stabile Rollen und visuell unterschiedliche Cursor haben.

### Zeitleiste

1. **Vertrauter Ausgangspunkt** – Zeigen Sie das akzeptierte Ergebnis von V2 an. „Sie“ bleibt in der Nähe des Knotens „Onboarding-E-Mails“. Der „Forschungsagent“ ist anwesend, aber für einen Moment inaktiv.
2. **Der Arbeitsbereich öffnet sich** – Ein zweiter menschlicher Cursor, „Maya“, kommt von rechts herein. Ein zweiter Agentencursor, „Strukturagent“, wird vom oberen oder unteren Rand eingegeben. Stellen Sie nicht alle gleichzeitig vor, sondern versetzen Sie die Ankünfte.
3. **Die selbstständige Arbeit beginnt** – Jeder Teilnehmer führt eine andere, verständliche Aktion aus:
   - „Research Agent“ erstellt einen kleinen Beweisknoten unter „Onboarding-E-Mails“.
   - „Strukturagent“ beginnt, eine Beziehung zu „Rückgewinnungsangebot“ herzustellen.
   - „Maya“ wählt die Hauptabwanderungsfrage aus.
   - „Sie“ beginnen, „Onboarding-E-Mails“ leicht nach links zu ziehen.

Aktionen können sich überschneiden, aber jede sollte visuell lesbar bleiben.
4. **Der erste Moment der Spannung** – Während „Sie“ noch „Onboarding-E-Mails“ in der Hand halten, bewegt sich der „Strukturagent“ auf denselben Knoten zu, weil er ihn neu positionieren oder verbinden möchte. Der Zielknoten erhält zwei subtile Absichtsindikatoren. Lösen Sie den Konflikt noch nicht.
5. **Eine zweite Konvergenz** – „Maya“ bewegt sich auf die oberste Frage zu, während der „Forscher“ darauf abzielt, eine Beweisverbindung herzustellen. Die Leinwand enthält nun mehrere vernünftige Aktionen, die einzeln harmlos, aber insgesamt mehrdeutig sind.
6. **Bei der Frage einfrieren** – Halten Sie kurz inne, während zwei Teilnehmer sich dem gleichen Objekt nähern. Der letzte Frame sollte die Frage ohne Text deutlich machen: *Wer kontrolliert dieses Objekt jetzt?*
7. **Zurücksetzen** – Blenden Sie zuerst die Cursor der Teilnehmer aus und stellen Sie dann den ursprünglich akzeptierten V2-Status wieder her.

### Visuelle Kernidee

Das Problem besteht nicht darin, dass es vier Teilnehmer gibt. Das Problem besteht darin, dass vier Teilnehmer unabhängig voneinander auf den gemeinsamen Zustand reagieren können und die Schnittstelle sich nicht mehr auf offensichtliche Kausalität verlassen kann.

### Optionale minimale Beschriftung

> Mehr Teilnehmer verändern mehr als die Menge an Aktivität.

Alternative:

> Ein gemeinsamer Zustand erfordert gemeinsame Regeln.

### Was noch nicht gezeigt werden soll

Lösen Sie den Konflikt in V3 nicht. Fügen Sie kein vollständiges Aktivitätsprotokoll hinzu. Sperren, Rückgängigmachen oder Konfliktlösung werden nicht angezeigt. Diese gehören in spätere Visualisierungen. V3 sollte das Problem verursachen.

### Visuelle Notizen

- Knotenpositionen und visuelle Komponenten aus V2 wiederverwenden.
- Halten Sie die Cursorpfade bewusst.
- Vermeiden Sie vier gleichzeitige Textbeschriftungen.
- Verwenden Sie Zielmarkierungen, um die Absicht vor der Mutation anzuzeigen.
- Beschränken Sie neu erstellte Inhalte auf einen kleinen Beweisknoten.
- Lassen Sie eine Kante teilweise zeichnen und halten Sie dann inne, während der Konflikt entsteht.
- Die Schleife sollte vor jeder Lösung enden, sodass die offene Frage erhalten bleibt.

### Dauer

9–11 Sekunden (vertrauter Zustand 1,0 s, Teilnehmerankünfte 1,5 s, unabhängige Aktionen 3,0 s, Konvergenz 2,0 s, Halten 1,5 s, Zurücksetzen 1,0 s).

---

## V4 – Von der unheimlichen Arbeitsfläche zum gemeinsamen Arbeitsbereich

**Ankerszene.** Zweiphasenszene. Phase 1 führt die Leinwand in einem „Spuk“-Modus aus; In Phase 2 werden dieselben Aktionen erneut mit Hinweisen zur Zusammenarbeit ausgeführt. Verwenden Sie eine Leinwand in zwei aufeinanderfolgenden Phasen anstelle eines Split-Screen-Vergleichs – dadurch wirkt die Transformation stärker.

### Referenziert in

`article.md`, Abschnitt 4: **Echtzeit ist nicht dasselbe wie verständlich**.

### Zweck

Demonstrieren Sie den Unterschied zwischen synchronisiertem Zustand und verständlicher Zusammenarbeit. In beiden Phasen treten die gleichen zugrunde liegenden Veränderungen auf; Lediglich die erklärenden Schnittstellenschichten unterscheiden sich.

### Szene

Derselbe Mehrteilnehmer-Canvas und ähnliche Aktionen wie V3, präsentiert in zwei aufeinanderfolgenden Phasen auf demselben Canvas. In einer Ecke kann eine subtile Phasenbezeichnung erscheinen:

- Phase 1: „Nur Staat“.
- Phase 2: „Zustand + Kontext“.

### Zeitleiste

#### Phase 1: Spukende Leinwand

Es sind keine Teilnehmercursor, Agentennamen, ausgewählten Status, Absichtsvorschauen oder Aktivitätsverlauf sichtbar.

1. „Onboarding-E-Mails“ verschiebt sich leicht nach links.
2. Darunter erscheint ein neuer Beweisknoten.
3. Eine Kante verläuft vom Beweisknoten zum „Win-back-Angebot“.
4. Die oberste Frage wechselt vom neutralen Zustand in „Überprüft“.

Alle Änderungen erfolgen reibungslos und perfekt synchronisiert. Aber nichts erklärt sie. Die Leinwand sollte keine Störungen aufweisen – sie sollte einwandfrei funktionieren und sich trotzdem unangenehm anfühlen. Dies ist kein kaputtes Echtzeitsystem; es ist technisch korrekt, aber gesellschaftlich unleserlich.

#### Übergang

5. Blenden Sie die Leinwand wieder in ihren Ausgangszustand zurück.
6. Zeigen Sie die Bezeichnung der zweiten Phase an: „Zustand + Kontext“.

#### Phase 2: Gemeinsamer Arbeitsbereich

Führen Sie dieselben Aktionen noch einmal aus, mit erklärenden Ebenen.

7. „Du“ erscheint; Der Cursor nähert sich „Onboarding-E-Mails“, der Knoten zeigt einen subtilen menschlichen Auswahlumriss und der Cursor zieht ihn nach links.
8. „Research Agent“ erscheint; auf einem kurzen Etikett steht „Beweis hinzufügen“; ein vorläufiger Überblick zeigt, wo der neue Beweisknoten landen wird; Der Knoten wird nach seinem Erscheinen festgeschrieben.
9. „Strukturagent“ nähert sich dem Quellknoten; Sowohl Quell- als auch Zielknoten werden hervorgehoben. auf einem kurzen Etikett steht „Verbindungsbeweis“; die Kante zieht.
10. „Maya“ wählt die oberste Frage aus; Ihr Name erscheint in der Nähe des Cursors. Der Status ändert sich in „Überprüft“.
11. Fügen Sie nach jeder Aktion unten einen kompakten Aktivitätseintrag hinzu („Sie haben Onboarding-E-Mails verschoben“, „Forschungsmitarbeiter hat Beweise hinzugefügt“, „Strukturagent hat Beweise verbunden“, „Maya hat die Frage überprüft“). Der neueste Eintrag kann kurz erscheinen und dann in einer kompakten Liste oder einem Ticker zusammengefasst werden.
12. Nachdem die vom Agenten erstellte Kante erreicht ist, wird neben dem neuesten Aktivitätseintrag eine kleine Aktion „Rückgängig“ angezeigt. Es muss nicht angeklickt werden – seine Anwesenheit kommuniziert Reversibilität.

### Ebenenanzeige

Ein optionaler kompakter Stapel, der zwischen den Phasen animiert:

```text
State
+ Presence
+ Intent
+ Attribution
+ Control
```

### Visuelle Kernidee

Der Zustand ist in beiden Phasen identisch. Die zweite Phase wird nutzbar, weil die Schnittstelle Präsenz, Identität, Absicht, Zuschreibung, vorläufigen Zustand und Reversibilität offenlegt.

### Optionale minimale Beschriftung

> Gleicher Zustand. Unterschiedliches Verständnis.

Dies ist einer Beschriftung vorzuziehen, die jede visuelle Ebene auflistet.

### Visuelle Notizen

- Verwenden Sie in beiden Phasen exakt die gleichen Knotenpositionen und Endzustände.
- Halten Sie den zeitlichen Ablauf der Aktionen nahezu identisch.
- Beim Vergleich sollte es um den Kontext gehen, nicht um die Geschwindigkeit.
- Aktivitätseinträge sollten gegenüber der Leinwand zweitrangig bleiben.
– Absichtsbezeichnungen sollten vor Aktionen erscheinen und kurz danach verschwinden.
- Die Anwesenheit ist vorübergehend; Die Zuordnung bleibt im Aktivitätsverlauf erhalten.
- Verwenden Sie eine kleine ausstehende oder vorläufige Behandlung nur für den vom Agenten erstellten Knoten.
– Vermeiden Sie hier das Hinzufügen von Berechtigungskontrollen. Autorität wird in der Prosa eingeführt, kann aber später visualisiert werden.

### Dauer

14–16 Sekunden (Spukphase ≈ 5 s, Übergang ≈ 1,3 s, geteilte Phase ≈ 8 s).

---

## V4 – Umfrage: Sind wir schon da?

### Referenziert in

`story.md`, Abschnitt 5: **Die erste Implementierung: „Gibt es etwas Neues?“**.

### Zweck

Erklären Sie Polling visuell, ohne die Szene in ein Netzwerkdiagramm umzuwandeln.

### Szene

Links Canvas, rechts kompaktes Server- oder Datenbanksymbol.

### Zeitleiste

1. Ein kleiner Impuls wandert von der Leinwand zum Server.
2. Die Antwort lautet: „Keine Änderung“.
3. Wiederholen Sie den Vorgang zweimal.
4. Bei der vierten Anfrage lautet die Antwort „Aktualisiert“.
5. Ein Ergebnisknoten wird angezeigt.
6. Der optionale zweite Client tritt mit einem langsameren Abfragerhythmus ein und bleibt kurzzeitig veraltet.

### Visuelle Notizen

- Die leeren Anfragen sollten sich wiederholend und nicht katastrophal wirken.
- Das Server-Icon sollte abstrakt und klein bleiben.
– Verwenden Sie einen geisterhaften fehlenden Knoten auf dem veralteten Client.

### Dauer

9–11 Sekunden.

---

## V5 – Der Agent kann sprechen, aber keine Welt teilen

Kleine Inline-Szene.

### Referenziert in

`story.md`, Abschnitt 6: **Streaming ist kein Mehrspielermodus**.

### Zweck

Unterscheiden Sie die gestreamte Ausgabe vom synchronisierten Anwendungsstatus.

### Szene

Teilen Sie den Rahmen subtil auf:

- links: Streaming-Text oder Fortschritt;
- rechts: Diagrammleinwand.

### Zeitleiste

1. Der Agent-Cursor erscheint in der Nähe des Streams.
2. Es treffen fortlaufend kurze Textfragmente ein.
3. Der Graph bleibt völlig ruhig.
4. Der Stream ist abgeschlossen.
5. Ein festgeschriebener Knoten wird im Diagramm angezeigt.

### Visuelle Notizen

- Die linke Seite sollte eine flüssige, kontinuierliche Bewegung haben.
- Die rechte Seite sollte bis zum endgültigen Commit bewusst statisch bleiben.
- Vermeiden Sie die Reproduktion einer vollständigen Chat-Oberfläche.

### Dauer

8–10 Sekunden.

---

## V6 – WebSockets Lösen Sie die Pipe

### Referenziert in

`story.md`, Abschnitt 7: **WebSockets: Die Pipe ist schnell; Jetzt baue den Raum**.

### Zweck

Zeigen Sie, dass die sofortige bidirektionale Bereitstellung das Verhalten bei der Zusammenarbeit nicht definiert.

### Szene

Zwei kleine Leinwände sind mit einem zentralen Dienst verbunden.

### Zeitleiste

1. Beginnen Sie mit periodischen Abfrageimpulsen.
2. Ersetzen Sie sie durch eine dauerhafte Verbindung.
3. Verschieben Sie einen Knoten auf Client A.
4. Der Knoten bewegt sich sofort zu Client B.
5. Als Erfolgszustand kurz halten.
6. Stellen Sie Fragen rund um die Verbindung: „Wieder verbinden?“ „Bestellen?“ „Berechtigungen?“ „Behalten?“ „Konflikt?“
7. Die einzelne elegante Linie erhält zusätzliche subtile Stränge: Ereignisse, Präsenz, Bestätigungen, Wiederholungsversuche, Beharrlichkeit.

### Visuelle Notizen

Die Eskalation sollte gelassen bleiben. Machen Sie kein Durcheinander; zeigen sich häufende Verantwortlichkeiten.

### Dauer

11–13 Sekunden.

---

## V7 – Überschreiben, sperren oder zusammenführen?

**Ankerszene.**

### Referenziert in

`story.md`, Abschnitt 8: **Was passiert, wenn zwei Teilnehmer denselben Knoten aktualisieren?**.

### Zweck

Machen Sie die Konfliktsemantik konkret und einprägsam.

### Szene

Ein Knoten ist zentriert. Zwei menschliche Cursor nähern sich aus entgegengesetzten Richtungen.

### Sequenz 1: Der zuletzt akzeptierte Wert gewinnt

1. Beide Cursor greifen den Knoten.
2. Es erscheinen zwei durchscheinende Geisterpositionen, links und rechts.
3. Die linke Position wird zuerst akzeptiert.
4. Die richtige Position kommt später.
5. Der Knoten bewegt sich sanft nach rechts.
6. Aktivitätsstreifen zeichnet beide Bewegungen auf.
7. Das schwache Nachbild der überschriebenen Position verblasst.

### Sequenz 2: Sperren

1. Knoten zurücksetzen.
2. Der erste Cursor beginnt zu ziehen.
3. Der Knoten erhält eine Eigentumsübersicht.
4. Der zweite Cursor nähert sich, kann ihn aber nicht greifen.
5. Beschriftung erscheint: „Niklas bearbeitet“.

### Sequenz 3: Zusammenführung auf Eigenschaftsebene

1. Knoten zurücksetzen.
2. Der erste Teilnehmer ändert das Label.
3. Der zweite Teilnehmer ändert eine separate Kategoriemarkierung.
4. Beide Änderungen bleiben bestehen.

### Abschnittsbeschriftungen

```text
Overwrite → Lock → Merge
```

### Visuelle Notizen

- Die Richtlinie sollte aus der Bewegung heraus verständlich sein, bevor das Etikett erscheint.
- Geisterzustände sind hier besonders nützlich.

### Dauer

16–18 Sekunden.

---

## V8 – Drei Spuren: Dokument, Präsenz, Signal

Zwei-Phasen-Szene. In Phase 1 wird die Taxonomie Dokument/Anwesenheit/Signal abstrakt festgelegt. Phase 2 leitet dieselben drei Arten von Informationen durch die drei konkreten Kanäle von Supabase und rekonstruiert die Szene auf einem zweiten Client. Die Taxonomie ist der bewusste Aufbau für die Supabase-Zuordnung – eine Szene, nicht zwei.

### Referenziert in

`story.md`, Abschnitt 9: **Drei Arten von Echtzeitinformationen** und Abschnitt 10: **Supabase: Postgres behalten und die Echtzeitteile zusammensetzen**.

### Zweck

Schaffen Sie die konzeptionelle Brücke von „Was ist das für eine Information?“ zu „Welches verwaltete Grundelement trägt es?“

### Szene

Dieselbe Leinwand, zunächst als drei horizontale Bahnen dargestellt, dann als drei Bahnen, die einen zweiten Kunden versorgen.

### Zeitleiste

#### Phase 1: Dokument, Präsenz, Signal

1. **Spur 1 – Dokument:** ein Knoten wird erstellt; alle Teilnehmer gehen; Der Knoten bleibt bestehen.
2. **Spur 2 – Präsenz:** Ein Cursor und eine Auswahl werden angezeigt. der Teilnehmer trennt die Verbindung; Cursor und Auswahl verschwinden.
3. **Spur 3 – Signal:** Eine kleine Welle oder ein „Agent zielt auf diesen Knoten“-Impuls erscheint und verschwindet, ohne das Dokument zu ändern.
4. Beschriftungen bleiben unter jeder Spur bestehen: „Dokument“, „Anwesenheit“, „Signal“.
5. Behalten Sie die drei beschrifteten Spuren als festgelegte Taxonomie bei.

#### Phase 2: Durch Supabase geroutet, auf einem zweiten Client rekonstruiert

6. Spurbezeichnungen werden an Ort und Stelle neu beschriftet: „Dokument“ → „Postgres-Änderungen“, „Anwesenheit“ → „Anwesenheit“, „Signal“ → „Broadcast“.
7. Ein Benutzer zieht einen Knoten.
8. Die dauerhafte Knotenposition bewegt sich entlang der Spur „Postgres Changes“.
9. Die Cursorbewegung verläuft entlang der „Broadcast“-Spur.
10. Der Teilnehmerstatus läuft entlang der Spur „Anwesenheit“.
11. Ein zweiter Client empfängt alle drei Streams und rekonstruiert die gesamte Szene.
12. Kurze Unterbrechung: Der kurzlebige Cursor verschwindet; Permanente Knotenänderungen werden an anderer Stelle fortgesetzt. Durch erneutes Verbinden wird der Dokumentstatus wiederhergestellt. Präsenz beginnt neu.

### Visuelle Notizen

- Die drei Fahrspuren sollten in beiden Phasen koordiniert, aber unterschiedlich erscheinen.
- Stellen Sie nicht alle Postgres- oder Realtime-Internen dar – der Punkt ist, dass die Anwendung entscheidet, was in welche Spur gehört.
- Die Umbenennung in Schritt 6 sollte als „die gleichen drei Arten von Informationen, jetzt in einem konkreten Zuhause“ lauten, nicht als Szenenwechsel.

### Dauer

18–20 Sekunden (Phase 1 ≈ 8–9 s, Phase 2 ≈ 10–11 s).

---

## V9 – InstantDB: Abonnieren Sie die Welt

### Referenziert in

`story.md`, Abschnitt 11: **InstantDB: Abonnieren Sie die Form der Welt**.

### Zweck

Erklären Sie den Unterschied zwischen ereignisorientiertem Plumbing und reaktivem Shared State.

### Szene

Neben der Leinwand befindet sich eine kompakte Abfragekarte:

```text
nodes
edges
```

### Zeitleiste

1. Canvas rendert aus dem aktuellen Abfrageergebnis.
2. Ein Remote-Agent ändert einen Knoten.
3. Abfragekarte leuchtet kurz auf.
4. Lokale Canvas-Updates.
5. Der Mensch zieht einen anderen Knoten.
6. Knoten bewegt sich sofort.
7. Ein kleiner „ausstehender“ Punkt erscheint.
8. Die Synchronisierung ist abgeschlossen.
9. Der Punkt wechselt zu „synced“ und wird ausgeblendet.

### Optionales Ende nebeneinander

#### Eventorientiert

```text
Receive event
→ inspect type
→ update cache
→ reconcile state
```

#### Abfrageorientiert

```text
Data changed
→ subscribed result updates
```

### Visuelle Notizen

Bedeuten Sie nicht, dass die Komplexität verschwindet. Die Animation zeigt, dass die Datenschicht mehr Synchronisationsverhalten besitzt.

### Dauer

12–14 Sekunden.

---

## V10 – Ein übersichtlicher Multi-Agent-Arbeitsbereich

**Ankerszene und Abschluss.** Nimmt die alte eigenständige Schlussszene auf: Sie endet mit den Schlussüberschriften „Design für Teilnehmer, nicht für Wünsche“, die über dem ruhigen letzten Bild liegen, und nicht mit einer separaten komprimierten Wiederholung.

### Referenziert in

`story.md`, Abschnitt 14: **Zurück zur Leinwand: Benutzer und Agenten teilen sich eine Welt** und die Schlussfolgerung: **Design für Teilnehmer, nicht für Anfragen**.

### Zweck

Demonstrieren Sie das vollständige Designmodell des Artikels und gehen Sie dann auf den zentralen Unterschied ein.

### Teilnehmer

- Menschlicher Benutzer.
- Forschungsagent.
- Strukturagent.

Die Rollen sollten auch dann stabil bleiben, wenn die Anzeigenamen variieren.

### Zeitleiste

1. Der Mensch erstellt einen Knoten „Kundenproblem“.
2. Der Recherche-Agent kommt herein und zeigt „Beweise hinzufügen“ an, bevor er einen gestrichelten Knoten erstellt.
3. Beweise werden bestätigt.
4. Der Strukturagent hebt zwei Knoten hervor und zeigt „Verknüpfung verwandter Ideen“ an.
5. Kante wird gezeichnet.
6. Der Mensch bewegt einen anderen Knoten, während beide Agenten aktiv bleiben.
7. Der Strukturagent versucht eine widersprüchliche Positionsänderung.
8. Die gewählte Richtlinie wird sichtbar angewendet.
9. Das Aktivitätsprotokoll ordnet das Ergebnis zu.
10. Der Mensch wählt „Agentenaktion rückgängig machen“ aus.
11. Canvas kehrt in einen stabilen gemeinsamen Zustand zurück; Agenten bleiben sichtbar, aber inaktiv.
12. Behalten Sie den ruhigen letzten Frame bei. Blenden Sie die Schlusstitel nacheinander ein, wobei jeder den letzten ersetzt, tief und unauffällig am unteren Rand des Bildes:
    - „Wie erreicht eine Veränderung alle?“
    - „Wie kann jeder diese Änderung verstehen und sicher darauf reagieren?“
    - „Design für Teilnehmer, nicht für Wünsche.“
13. Halten Sie vor dem Zurücksetzen die letzte Beschriftung über die stillstehende, inaktive Leinwand.

### Erforderliche Schnittstellenkonventionen

- sichtbare Cursor und Identitäten;
- Zielhervorhebung vor der Mutation des Wirkstoffs;
- vorläufiger Zustand;
- anhaltende Zuschreibung;
- klares Konfliktverhalten;
- Benutzer pausieren oder Steuerung rückgängig machen.

### Visuelle Notizen

Dies ist die ausgefeilteste Szene im Artikel. Trotz dreier aktiver Teilnehmer sollte sich das letzte Bild geordnet und ruhig anfühlen – die Schlussuntertitel dürfen diese Stille nicht stören; Sie verblassen an Ort und Stelle, anstatt zu gleiten oder einzuspringen.

### Dauer

20–24 Sekunden (Arbeitsbereichssequenz ≈ 16–18 Sekunden, Schlussuntertitel ≈ 4–6 Sekunden).

---

# Statische Diagramme

In zwei Abschnitten des Artikels werden Werkzeuge verglichen, anstatt einen Mechanismus zu demonstrieren. Dies sind **keine** Animationen – es handelt sich um statische, gestaltete Diagramme und Tabellen, die mit denselben DESIGN.md-Tokens erstellt wurden (flach, randbasiert, ein Akzent, 8-Pixel-Radius-Obergrenze), sodass sie sich wie Teil desselben visuellen Systems anfühlen, ohne dass eine Zeitleiste erforderlich ist.

## Tabelle der Kollaborationsebenen (alt A12)

### Referenziert in

`story.md`, Abschnitt 12: **Alternativen lösen verschiedene Schichten**.

### Format

Eine statische Vergleichstabelle oder Kartenzeile – Liveblocks, Yjs, Firebase, benutzerdefinierte Synchronisierungs-Engine – jeweils mit einer einzeiligen Positionierungsanweisung und einer kurzen „Good Fit“-Liste. Keine Bewegung, keine Cursor.

### Visuelle Notizen

- Verwenden Sie dieselben Knoten-/Rahmen-/Typ-Tokens wie in den animierten Szenen, damit der Artikel nicht den Eindruck erweckt, als würde er mitten auf der Seite das Designsystem wechseln.
- Liveblocks und Yjs erhalten möglicherweise jeweils ein kleines statisches illustratives Symbol (z. B. ein Layer-Overlay-Glyph für Liveblocks, ein Glyph zum Zusammenführen von zwei Dokumenten für Yjs), das als flaches SVG und nicht als Screenshot gerendert wird.
- Kein Podium, keine Rangfolge – als parallele Karten oder Tischreihen vorhanden.

## Entscheidungsleitfadentabelle (alt A13)

### Referenziert in

`story.md`, Abschnitt 13: **Entscheidungshilfe: Wählen Sie die Ebene, die Sie tatsächlich benötigen**.

### Format

Eine statische Anforderungs-zu-Optionstabelle: eine Zeile pro Bedingung („Gelegentlicher Status“, „Server-Streams-Ausgabe“, „Benutzerdefiniertes bidirektionales Protokoll“, „Postgres + verwaltete Echtzeitprimitive“, „Integriertes reaktives Synchronisierungsmodell“, „Zu einer vorhandenen App hinzugefügte Zusammenarbeit“, „Gleichzeitige Zusammenführung und Offline-Daten“), Zuordnung zur entsprechenden Technologie.

### Visuelle Notizen

- Präsentieren Sie Anforderungen in der linken Spalte und Technologien in der rechten Spalte – niemals eine Hierarchie oder ein Siegerpodest.
- Verwenden Sie `--text-muted` für den Anforderungstext und `--text` mit der Gewichtung 600 für den Technologienamen, im Einklang mit der eingeschränkten Hervorhebungsregel von DESIGN.md (Gewicht, nicht Farbe, nicht kursiv).

---

# Empfohlene Platzierung und Dichte

## Wichtige Szenen in voller Breite (Anker)

Verwenden Sie diese als visuelle Anker – vier Szenen, gleichmäßig verteilt über den Artikel:

1. **V1 – Die Leinwand wird überfüllt** (Eröffnung)
2. **V3 – Von der Haunted Canvas zum Shared Workspace** (erstes Drittel)
3. **V7 – Überschreiben, Sperren oder Zusammenführen?** (Mitte des Artikels)
4. **V10 – Ein lesbarer Multi-Agent-Arbeitsbereich** (Abschluss)

## Kleinere Inline-Animationen

Sechs kompakte Szenen befinden sich neben oder zwischen den Absätzen:

- V2 – Von der Stille zum zweiten Schauspieler
- V4 – Umfrage: Sind wir schon da?
- V5 – Der Agent kann sprechen, aber keine Welt teilen
- V6 – WebSockets lösen die Pipe
- V8 – Drei Spuren: Dokument, Präsenz, Signal
- V9 – InstantDB: Abonnieren Sie die Welt

Die beiden statischen Diagramme (Zusammenarbeitsebenen, Entscheidungsleitfaden) sind keine Animationen und werden als reguläre Figuren in den Abschnitten 12–13 platziert.

## Vermeiden Sie visuelle Überlastung

Für den Artikel muss nicht jede Szene gleich groß sein. Der wichtige Rhythmus ist:

1. Erzählszene;
2. erklärende Prosa;
3. kompakte technische Szene;
4. Code, Tabelle oder Entscheidungsrahmen;
5. Rückkehr zur narrativen Leinwand.

Mit 10 animierten Szenen (4 Anker, 6 Inline) und 2 statischen Diagrammen in etwa 15 Abschnitten erhalten die meisten Abschnitte genau ein Bild – im Einklang mit dem Ziel von ~3.000 Wörtern in `story.md`.

---

# Wiederverwendbare Szenenkomponenten

Erstellen Sie ein kleines internes Animationskit – einfache Fabrikfunktionen, keine Framework-Komponenten – anstatt jede Szene einzeln zu implementieren.

## Vorgeschlagene Fabriken

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

Jede Factory gibt ein kleines Objekt zurück, das Aktualisierungs-/Teardown-Funktionen verfügbar macht (`{ update(state), destroy() }`), damit der Szenenläufer es ohne Framework-Lebenszyklus aus dem Timeline-Status heraus steuern kann.

## Nützliche Aktionen

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

## Beispiel für den Szenenzustand

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

Der Renderschritt einer Szene ist eine einfache Funktion „render(state)“, die den aktuellen Status durchläuft und die von den oben genannten Fabriken erstellten SVG/DOM-Knoten zwingend aktualisiert – kein virtuelles DOM, kein abweichendes Framework.

---

# Leistungsüberlegungen

- Montieren Sie nur Animationen in der Nähe des Ansichtsfensters.
- Stoppen Sie „requestAnimationFrame“-Schleifen, wenn sie ausgeblendet sind.
– Vermeiden Sie unnötige DOM-Schreibvorgänge für jedes Pixel, bei dem CSS-Transformationen oder die Webanimations-API Interpolation verarbeiten können.
- Halten Sie die Anzahl der SVG-Knoten/Kanten pro Szene sehr klein; Verwenden Sie vorhandene Elemente wieder, anstatt sie in jedem Frame neu zu erstellen.
- Bevorzugen Sie transformbasierte Bewegungen gegenüber Layoutänderungen.
- Berechnen Sie Pfade und Keyframes nach Möglichkeit im Voraus.
- Vermeiden Sie es, Artikelanimationen als echte Echtzeitanwendungen zu schreiben.
- Verwenden Sie deterministische Seeds, wenn visuelle Variationen hinzugefügt werden.

---

# Redaktionelle Prüfungen für jede Animation

Bevor Sie eine Szene akzeptieren, bestätigen Sie Folgendes:

1. Kann ein technisch nicht versierter Leser erklären, was sich geändert hat?
2. Zeigt die Szene genau eine Grundidee?
3. Ist die Handlungsfähigkeit vor Folgeänderungen sichtbar?
4. Kann die Szene verstanden werden, ohne Code zu lesen?
5. Lässt sich die Schleife reibungslos zurücksetzen?
6. Kommuniziert es weiterhin im reduzierten Bewegungsmodus?
7. Wird ein Anbieter eher durch visuellen Glanz als durch Substanz repräsentiert?
8. Unterscheidet die Szene korrekt zwischen anhaltendem Zustand, vorübergehender Anwesenheit und vorübergehenden Signalen?
9. Zeigt eine Konfliktszene die gewählte Politik und impliziert sie nicht, dass Konflikte verschwinden?
10. Bleibt der Endzustand optisch ruhig?
