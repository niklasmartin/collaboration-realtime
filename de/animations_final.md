# Animations-Playbook – endgültig

## Zweck

Diese Datei definiert das visuelle System und den endgültigen Satz animierter und statischer Illustrationen für den Artikel.

Das Ziel besteht nicht darin, jeden technischen Abschnitt zu animieren. Die visuelle Geschichte sollte selektiv bleiben:

1. ein Benutzer;
2. ein Benutzer und ein Agent;
3. mehrere Menschen und Agenten;
4. synchronisierte, aber verwirrende Zusammenarbeit;
5. ein endgültiger, lesbarer Multiplayer-Arbeitsbereich.

Der technische Teil verwendet kompakte Diagramme und Tabellen anstelle zusätzlicher vollständiger Erzählanimationen.

Alle visuellen Token folgen [`DESIGN.md`](./DESIGN.md). Der Artikeltext sollte auf diese Datei verweisen, in der visuelle Platzhalter erscheinen.

Bei den Animationen handelt es sich um deterministische redaktionelle Illustrationen, nicht um interaktive Produktdemos. Sie sollten minimal, glatt und verständlich sein, ohne dass der Leser auf etwas klicken muss.

Die Implementierung ist einfaches JavaScript:

- SVG für Knoten, Kanten, Hervorhebungen und Diagrammstruktur;
- positionierte HTML-Overlays für Cursor, Beschriftungen, Impulse und Aktivitätsverlauf;
- deterministische Keyframe-Zeitleisten;
- direkte DOM- und SVG-Updates;
– kein React, JSX, Animationsframework oder Build-Schritt.

---

# Endgültige visuelle Bestandsaufnahme

## Narrative Animationen

- **V1 – Ein Benutzer, eine Aktion**
- **V2 – Ein zweiter Schauspieler tritt hinzu**
- **V3 – Die Leinwand wird voll**
- **V4 – Von der unheimlichen Arbeitsfläche zum gemeinsamen Arbeitsbereich**
- **V5 – Ein lesbarer Multi-Agent-Arbeitsbereich**

## Technische Diagramme

- **D1 – Polling, SSE und WebSockets**
- **D2 – Eine Kollision, drei Richtlinien**
- **D3 – Dokument, Präsenz und Signal**
- **D4 – Ereignisorientierte und abfrageorientierte Synchronisierung**
- **D5 – Entscheidungsleitfaden**

## Statischer Vergleich

- **S1 – Alternativen lösen verschiedene Ebenen**

Dies gibt dem Artikel fünf echte Animationen. Alles andere sollte statisch oder nur leicht animiert sein.

---

# Bildsprache

## Gesamtcharakter

Die Bilder sollten erklärenden Abbildungen aus einem Figma-, Linear- oder Stripe-Engineering-Artikel ähneln:

- eher ruhig als theatralisch;
- großzügiger Leerraum;
- eingeschränkte Bewegung;
- eine klare Idee pro Figur;
- keine unnötigen Kontrollen;
- kein realistisches Produktchrom;
- minimaler Text innerhalb der Leinwand;
- feste Kamera, es sei denn, Bewegung selbst ist das Konzept;
– genau eine Akzentfarbe, `--accent`, die als Interpunktion und nicht als Dekoration verwendet wird.

## Leinwand

- Hintergrund: `--bg-alt`
- Rand: 1px `--border`
- Radius: maximal 8px
- Optionales subtiles Punktraster im 24-Pixel-Abstand
- Feste Abmessungen zwischen V1 und V5, wo praktisch möglich

## Knoten

- **Festgeschriebener Knoten:** weiße Füllung, 1 Pixel `--border-strong`, 6 Pixel Radius
- **Vorläufiger Knoten:** gestrichelter 1px `--accent`-Rand, `--bg-alt`-Füllung
- **Geisterknoten:** 40 % Deckkraft
- **Ausgewählter Knoten:** 2px-Teilnehmerring mit 2px-Offset

## Kanten

- 1px `--border-strong`
- Glatte, einfache Kurven
- Zeichnen Sie mit „Stroke-Dashoffset“.
- Vermeiden Sie dekorative Partikel

## Cursor als Zeichen

Identität wird durch Form und Etikett kommuniziert, nicht nur durch Farbe.

- Mensch: konventioneller Zeiger
- Agent: abgerundeter oder geometrischer Zeiger
- Systemaktion: Impuls ohne Cursor
- Teilnehmeretikett: Kompaktchip mit 11px Mono oder Inter 500

## Absicht vor Tat

Agentenaktionen sollten diesem Rhythmus folgen:

1. Cursorannäherungen;
2. Ziel-Highlights;
3. Prägnantes Absichtsabzeichen erscheint;
4. Aktion findet statt;
5. Zuschreibung bleibt kurz bestehen;
6. Die Schnittstelle kehrt in den Ruhezustand zurück.

## Bewegung

– Kleine UI-Übergänge: 180–350 ms
- Cursorbewegung: 500–900 ms
- Wichtige Haltezeiten: 800–1.500 ms
- Bevorzugen Sie ein einfaches Ein- und Aussteigen
- Vermeiden Sie Hüpfen, Schütteln, Überschießen und feierliche Bewegungen

## Schleife

- Kleine Szenen: 6–10 Sekunden
- Hauptszenen: 10–16 Sekunden
- Schlussszene: bis zu 20 Sekunden
- Ruhen Sie sich vor dem Neustart kurz aus
- Zurücksetzen mit einem Fade- oder Reverse-Übergang

## Barrierefreiheit

- Respektieren Sie „Prefers-Reduced-Motion“.
- Szenen außerhalb des Ansichtsfensters anhalten
- Der bewegungsreduzierte Modus sollte einen repräsentativen Endzustand anzeigen
- Erwägen Sie eine Pause beim Schweben
- Bildunterschriften müssen das Konzept vermitteln, ohne sich allein auf die Bewegung zu verlassen

---

# Gemeinsames Implementierungsmodell

Jede Szene ist eine deterministische Funktion der verstrichenen Zeit.

```js
const scene = [
  { at: 0, action: 'show', target: 'canvas' },
  { at: 500, action: 'moveCursor', actor: 'user', target: 'addIdea' },
  { at: 1300, action: 'click', actor: 'user', target: 'addIdea' },
  { at: 1800, action: 'createNode', nodeId: 'onboarding-emails' },
];
```

Empfohlene Innenform:

```js
const animations = {
  V1: {
    duration: 7000,
    initialState: {},
    events: [],
  },
};
```

Zur Laufzeit:

```js
const state = reduce(
  initialState,
  events.filter((event) => event.at <= elapsed),
);
```

Dadurch bleiben Schleifen wiederholbar und Screenshots werden deterministisch.

## Technologiespaltung

Verwenden Sie SVG für:

- Knoten;
- Kanten;
- Diagrammpositionen;
- Auswahlringe;
- Ziel-Highlights;
- Geisterzustände.

Verwenden Sie positioniertes HTML für:

- Cursor;
- Teilnehmeretiketten;
- Absichtsabzeichen;
- Hülsenfrüchte;
- Phasenbezeichnungen;
- Aktivitätsverlauf;
- Kontrollen rückgängig machen.

---

# Narrative Animationen

## V1 – Ein Benutzer, eine Aktion

### Referenziert in

`article.md`, Abschnitt **Schnittstellen waren früher einfach**.

### Zweck

Erstellen Sie den alten Interaktionsvertrag:

> Eine Person handelt. Die Anwendung antwortet.

Die Szene sollte sich ruhig und fast ereignislos anfühlen.

### Szene

Die Leinwand enthält:

- „Warum wechseln Kunden ab?“
- ein leerer Lösungsbereich;
- ein kompaktes Steuerelement „Idee hinzufügen“;
- ein menschlicher Cursor mit der Aufschrift „Du“.

### Zeitleiste

1. Die Leinwand ruht.
2. „Sie“ bewegt sich in Richtung „Idee hinzufügen“.
3. Der Cursor klickt.
4. Als eingegebener Wert erscheint „Onboarding-E-Mails“.
5. Unterhalb der Frage wird ein neuer Knoten eingeblendet.
6. Die Verbindungskante wird gezogen.
7. Der Cursor bewegt sich weg.
8. Sonst passiert nichts.
9. Halten Sie die Taste gedrückt und setzen Sie sie dann vorsichtig zurück.

### Kernidee

Für die Änderung gibt es nur eine plausible Erklärung: Der Nutzer hat sie verursacht.

Es sind keine Zuordnungs-, Anwesenheits-, Aktivitätsprotokoll- oder Konfliktregeln erforderlich.

### Untertitel

> Eine Aktion hat einen offensichtlichen Eigentümer.

### Dauer

6–7 Sekunden.

---

## V2 – Ein zweiter Schauspieler tritt ein

### Status

Bereits implementiert.

### Referenziert in

`article.md`, Abschnitt **Dann begann auch die Software zu handeln**.

### Zweck

Stellen Sie einen Benutzer und einen Agenten vor, die in derselben Schnittstelle arbeiten.

### Letztes Szenario

Der Benutzer fügt „Onboarding-E-Mails“ hinzu.

Während der Benutzer noch anwesend ist, beginnt der Rechercheagent mit der Arbeit. Das Layout schafft Platz für den Vorschlag des Agenten, anstatt den Beitrag des Benutzers zu ersetzen.

Das Rechercheergebnis erscheint später als vorläufiger, gestrichelter Inhalt, der in der Karte des Benutzers verschachtelt ist. Es wird erst nach der Bestätigung festgeschrieben.

### Erforderliche Ideen

Die Szene sollte diese Konzepte sichtbar machen:

- Die Software ist jetzt ein Akteur;
- Die Aktionen von Menschen und Agenten können sich überschneiden.
- Die Arbeit des Agenten kann provisorisch sein.
- Die Schnittstelle unterscheidet den Besitz;
- ein zweiter Teilnehmer benötigt sichtbaren Platz.

### Untertitel

> Der Benutzer ist nicht mehr der einzige aktive Teilnehmer.

### Implementierungshinweis

V3 sollte mit einer Leinwand beginnen, die dem akzeptierten Endzustand von V2 ähnelt.

---

## V3 – Die Leinwand wird überfüllt

### Referenziert in

`article.md`, Abschnitt **Ein Assistent wird zu einem Raum voller Teilnehmer**.

### Zweck

Erweitern Sie das Modell von einem Benutzer und einem Agenten auf mehrere Menschen und mehrere Agenten.

Die Szene sollte das Koordinationsproblem erzeugen, ohne es zu lösen.

### Ausgangszustand

Das akzeptierte Ergebnis von V2 wiederverwenden.

Vorgeschlagene Knoten:

- „Warum wechseln Kunden ab?“
- „Onboarding-E-Mails“.
- „Rückgewinnungsangebot“.
- „Willkommen zur Serienrecherche“.

### Teilnehmer

- „Du“.
- „Maya“.
- „Forschungsagent“.
- „Strukturagent“.

### Zeitleiste

1. Beginnen Sie mit der akzeptierten V2-Leinwand.
2. „Maya“ kommt von rechts.
3. „Strukturagent“ tritt von einer anderen Kante ein.
4. Die selbstständige Arbeit beginnt:
   - „Forschungsagent“ erstellt einen kleinen Beweisknoten.
   - „Strukturagent“ beginnt mit dem Zeichnen einer Beziehung.
   - „Maya“ wählt die Hauptfrage aus.
   - „Sie“ beginnen mit dem Verschieben von „Onboarding-E-Mails“.
5. Während „Sie“ noch den Knoten halten, zielt der „Strukturagent“ auf dasselbe Objekt.
6. Auf diesem Knoten erscheinen zwei subtile Absichtsindikatoren.
7. An anderer Stelle stimmen „Maya“ und „Forschungsagent“ in der Hauptfrage überein.
8. Halten Sie an der ungelösten Unklarheit fest.
9. Zurücksetzen auf den akzeptierten V2-Status.

### Kernidee

Das Problem ist nicht einfach mehr Aktivität.

Das Problem besteht darin, dass unabhängige Teilnehmer auf denselben Zustand reagieren können und die Kausalität nicht mehr offensichtlich ist.

### Untertitel

> Ein gemeinsamer Zustand erfordert gemeinsame Regeln.

### Nicht anzeigen

- Konfliktlösung;
- Schlösser;
- rückgängig machen;
- ein vollständiges Aktivitätsprotokoll;
- ein erfolgreicher Endzustand.

V3 verursacht das Problem.

### Dauer

9–11 Sekunden.

---

## V4 – Von der verwunschenen Leinwand zum gemeinsamen Arbeitsbereich

### Referenziert in

`article.md`, Abschnitt **Echtzeit ist nicht dasselbe wie verständlich**.

### Zweck

Zeigen Sie, dass ein perfekt synchronisierter Zustand immer noch sozial unleserlich sein kann.

Führen Sie dieselbe Sequenz zweimal aus:

1. nur Zustand;
2. Zustand plus Kontext.

### Präsentation

Verwenden Sie eine Leinwand in zwei Phasen statt eines geteilten Bildschirms.

Phasenbezeichnungen:

- „Nur Zustand“.
- „Zustand + Kontext“.

### Phase 1 – Nur Staat

Keine Cursor, Namen, Auswahl, Absicht, Zuschreibung oder Verlauf.

Sequenz:

1. „Onboarding-E-Mails“ wird nach links verschoben.
2. Ein Beweisknoten wird angezeigt.
3. Ein Vorteil verbindet es mit dem „Win-Back-Angebot“.
4. Die Hauptfrage wird zu „Überprüft“.

Alles funktioniert reibungslos.

Nichts erklärt warum.

### Übergang

Auf den Ausgangszustand zurücksetzen.

„Zustand + Kontext“ anzeigen.

### Phase 2 – Zustand plus Kontext

Wiederholen Sie die gleichen Änderungen mit Erklärung:

1. „Sie“ nähern sich und verschieben „Onboarding-E-Mails“.
2. „Forschungsagent“ erscheint mit „Beweis hinzufügen“.
3. Vor dem Commit wird ein vorläufiger Knoten angezeigt.
4. „Strukturagent“ hebt Quelle und Ziel hervor, bevor die Kante gezeichnet wird.
5. „Maya“ wählt die Hauptfrage aus, bevor sie als „Überprüft“ markiert wird.
6. Ein kompakter Aktivitätsverlauf ordnet jede Aktion zu.
7. Für die vom Agenten erstellte Verbindung wird ein kleines Steuerelement „Rückgängig“ angezeigt.

### Kernidee

Der zugrunde liegende Zustand ist identisch.

Die zweite Version wird verwendbar, weil sie Folgendes offenlegt:

- Anwesenheit;
- Identität;
- Absicht;
- vorläufiger Zustand;
- Namensnennung;
- Reversibilität.

### Untertitel

> Gleicher Zustand. Unterschiedliches Verständnis.

### Dauer

14–16 Sekunden.

---

## V5 – Ein übersichtlicher Multi-Agent-Arbeitsbereich

### Referenziert in

`article.md`, Abschnitt **Zurück zur Leinwand** und die Schlussfolgerung.

### Zweck

Schließen Sie die visuelle Geschichte ab, indem Sie zur überfüllten Leinwand zurückkehren, nachdem der Leser die technischen Optionen darunter gesehen hat.

Die Aktivität sollte hoch bleiben, die Benutzeroberfläche sollte sich jedoch ruhig anfühlen.

### Teilnehmer

- „Du“.
- „Maya“.
- „Forschungsagent“.
- „Strukturagent“.

### Zeitleiste

1. „Sie“ schaffen eine Idee.
2. „Forschungsbeauftragter“ kündigt „Beweise hinzufügen“ an.
3. Ein gestrichelter Vorschlag erscheint und wird dann übernommen.
4. „Strukturagent“ hebt zwei Ziele hervor und kündigt „Ideen verbinden“ an.
5. Die Kante zeichnet.
6. „Maya“ geht die Hauptfrage noch einmal durch.
7. „Sie“ verschieben einen Knoten, während ein Agent auf dasselbe Objekt abzielt.
8. Die Schnittstelle wendet eine Richtlinie für sichtbare Konflikte an.
9. Der Aktivitätsverlauf zeichnet das Ergebnis auf.
10. Eine entsprechende Rückgängig- oder Genehmigungsaktion wird angezeigt.
11. Alle Teilnehmer bleiben sichtbar, versetzen sich jedoch in einen Ruhezustand.
12. Bleiben Sie ruhig im letzten Bild.

### Schlusstitel

Blenden Sie diese nacheinander am unteren Rand des Rahmens ein:

1. „Wie erreicht eine Veränderung alle?“
2. „Wie kann jeder diese Änderung verstehen und sicher darauf reagieren?“
3. „Entwirf für Teilnehmer, nicht für Anfragen.“

### Erforderliche Schnittstellenkonventionen

- sichtbare Identitäten;
- Absicht vor der Änderung;
- vorläufiger Zustand;
- dauerhafte Zuordnung;
- explizites Konfliktverhalten;
- Benutzerkontrolle durch Pause, Genehmigung oder Rückgängigmachen.

### Kernidee

Die endgültige Leinwand ist nicht deshalb ruhiger, weil weniger geschieht.

Sie ist ruhiger, weil jede Aktion verständlich ist.

### Dauer

18–22 Sekunden.

---

# Technische Diagramme

Dies sind keine narrativen Animationen. Sie sollten statisch sein oder nur subtile Impulse und Übergänge verwenden.

## D1 — Polling, SSE und WebSockets

### Referenziert in

Den Abschnitten:

- **Polling: „Gibt es etwas Neues?“**
- **Streaming: Der Agent kann sprechen, aber keine gemeinsame Welt teilen**
- **WebSockets: Die Leitung ist schnell; bauen Sie jetzt den Raum**

### Zweck

Vergleichen Sie drei Übertragungsmodelle in einer kompakten Abbildung.

### Layout

Drei horizontale Zeilen mit denselben Browser- und Serversymbolen.

#### Polling

```text
Browser ── Anfrage ──> Server
Browser <─ Antwort ── Server
          wiederholt
```

Beschriftung:

> Geplante Prüfungen

#### SSE

```text
Browser <════════════ Server
        kontinuierlicher unidirektionaler Stream
```

Beschriftung:

> Server-zu-Browser-Stream

#### WebSocket

```text
Browser ════════════ Server
        dauerhafter bidirektionaler Kanal
```

Beschriftung:

> Bidirektionale Übertragung

### Bewegung

Optional:

- wiederholter kleiner Impuls für Polling;
- langsamer kontinuierlicher Impuls für SSE;
- ein Impuls in jede Richtung für WebSockets.

Machen Sie daraus keine drei vollständigen Szenarien.

### Kernidee

Diese Technologien unterscheiden sich darin, wie Informationen übertragen werden, nicht darin, wie Konflikte gelöst werden.

---

## D2 — Eine Kollision, drei Richtlinien

### Referenziert in

`article.md`, Abschnitt **Delivering both changes does not resolve the conflict**.

### Zweck

Vergleichen Sie die Konfliktsemantik ohne eine weitere lange Animation.

### Layout

Drei parallele Panels zeigen denselben Knotenkonflikt.

#### Der spätere Wert gewinnt

Zwei Geisterpositionen erscheinen. Eine endgültige Position bleibt bestehen.

Beschriftung:

> Der spätere Wert gewinnt

#### Sperre

Ein Teilnehmer besitzt den Knoten. Der zweite wird blockiert.

Beschriftung:

> Beim Bearbeiten sperren

#### Zusammenführen

Ein Teilnehmer ändert die Beschriftung. Ein anderer ändert die Kategorie. Beides bleibt erhalten.

Beschriftung:

> Unabhängige Felder zusammenführen

### Bewegung

Optionale einmalige Mikroanimation in jedem Panel.

Die Abbildung sollte auch im statischen Zustand verständlich bleiben.

### Kernidee

Die Konfliktauflösung wird pro Operation gewählt, nicht einmalig für die gesamte Anwendung.

---

## D3 — Dokument, Präsenz und Signal

### Referenziert in

Die Abschnitte:

- **Nicht alles gehört in die Datenbank**
- **Supabase: Echtzeitspuren rund um Postgres zusammensetzen**

### Zweck

Etablieren Sie eine herstellerneutrale Taxonomie und verwenden Sie sie anschließend für die Zuordnung zu Supabase.

### Layout

Eine kleine Leinwand mit drei Erläuterungen.

#### Dokument

Beispiel:

- erstellter Knoten;
- akzeptierte Kante;
- dauerhafte Beschriftung.

Verhalten:

> Bleibt bestehen, nachdem die Teilnehmer die Verbindung getrennt haben.

#### Präsenz

Beispiel:

- Teilnehmer-Cursor;
- Auswahl;
- Arbeitsstatus.

Verhalten:

> Existiert, solange der Teilnehmer verbunden ist.

#### Signal

Beispiel:

- Cursorbewegung;
- Ziehvorschau;
- `Agent zielt auf diesen Knoten`.

Verhalten:

> Erscheint kurz und hinterlässt keine dauerhafte Änderung.

### Wiederverwendung für Supabase

Kennzeichnen Sie im Supabase-Abschnitt dieselbe Abbildung:

- Dokument → Postgres oder datenbankausgelöstes Broadcast
- Präsenz → Presence
- Signal → Broadcast

Erstellen Sie keine separate Supabase-Animation.

### Kernidee

Die Anwendung sollte entscheiden, welche Art von Information sie verarbeitet, bevor sie den Transport auswählt.

---

## D4 — Ereignisorientierte und abfrageorientierte Synchronisierung

### Referenziert in

`article.md`, Abschnitt **InstantDB: subscribe to the state you need**.

### Zweck

Vergleichen Sie zwei Programmiermodelle, ohne den Eindruck zu erwecken, die Komplexität verschwinde.

### Layout

Zwei parallele Pfade.

#### Ereignisorientiert

```text
Ereignis empfangen
→ Typ prüfen
→ lokalen Zustand aktualisieren
→ optimistischen Zustand abgleichen
```

#### Abfrageorientiert

```text
Knoten und Kanten abonnieren
→ das abonnierte Ergebnis bleibt aktuell
```

### Optionale Mikroanimation

Neben dem abfrageorientierten Pfad:

1. Der Benutzer verschiebt einen Knoten;
2. der Knoten wird sofort aktualisiert;
3. `Ausstehend` erscheint;
4. `Synchronisiert` ersetzt es und blendet aus.

### Kernidee

Eine Synchronisierungs-Engine verlagert mehr Synchronisierungsverhalten in die Datenschicht.

Sie beseitigt die zugrunde liegende Komplexität nicht.

---

## D5 — Entscheidungsleitfaden

### Referenziert in

`article.md`, Abschnitt **Choose the layer the interface actually needs**.

### Format

Verwenden Sie eine statische Tabelle.

| Anforderung der Schnittstelle | Praktischer Ausgangspunkt |
|---|---|
| Prüfen, ob eine Hintergrundaufgabe abgeschlossen ist | Polling |
| Agentenausgabe oder Fortschritt streamen | SSE |
| Ein spezialisiertes Echtzeitprotokoll entwickeln | WebSockets |
| Echtzeitfunktionen rund um Postgres ergänzen | Supabase |
| Ein integriertes synchronisierungsorientiertes Backend einsetzen | InstantDB |
| Zusammenarbeit zu einer bestehenden Anwendung hinzufügen | Liveblocks |
| Gleichzeitige oder Offline-Änderungen zusammenführen | Yjs |

### Visuelle Hinweise

- Keine Rangfolge und keinen Gewinner
- Anforderungen in gedämpfter Schrift
- Technologienamen mit stärkerer Gewichtung
- Vermeiden Sie Herstellerlogos, sofern nicht alle Optionen gleich behandelt werden

---

# Statischer Vergleich

## S1 — Alternativen lösen verschiedene Ebenen

### Referenziert in

`article.md`, Abschnitt **Alternatives solve different layers**.

### Format

Verwenden Sie eine statische Tabelle oder parallele Karten.

### Einträge

#### Liveblocks

Einordnung:

> Zusammenarbeit zu einem bestehenden Produkt hinzufügen

Geeignet für:

- Präsenz;
- Cursor;
- gemeinsamen Speicher;
- Kommentare;
- kollaborative Leinwände.

#### Yjs

Einordnung:

> Zusammenführbare gemeinsame Datenstrukturen

Geeignet für:

- Offline-Bearbeitung;
- Rich-Text;
- gleichzeitiges Zusammenführungsverhalten.

#### Firebase

Einordnung:

> Etablierte Synchronisierung zwischen Datenbank und Client

Geeignet für:

- Echtzeit-Anwendungszustand;
- Client-Abonnements;
- bestehende Firebase-Ökosysteme.

#### Benutzerdefinierte Synchronisierungs-Engine

Einordnung:

> Vollständige Kontrolle über die Semantik der Zusammenarbeit

Geeignet für:

- spezialisierte Protokolle;
- ungewöhnliche Konfliktregeln;
- Zusammenarbeit als Kerninfrastruktur.

### Visuelle Hinweise

- Stellen Sie die Optionen parallel und nicht als Rangfolge dar
- Verwenden Sie dieselbe Typografie und dasselbe Randsystem wie bei den Animationsleinwänden
- Kleine flache SVG-Symbole sind zulässig
- Keine Screenshots

---

# Empfohlene Platzierung

## Narrative erste Hälfte

### Schnittstellen waren früher einfach

**V1 — Ein Benutzer, eine Aktion**

### Dann begann auch die Software zu handeln

**V2 — Ein zweiter Schauspieler tritt hinzu**

### Ein Assistent wird zu einem Raum voller Teilnehmer

**V3 — Die Leinwand wird voll**

### Echtzeit ist nicht dasselbe wie Verständlichkeit

**V4 — Von der verwunschenen Leinwand zum gemeinsamen Arbeitsbereich**

## Technische Hälfte

### Polling, SSE und WebSockets

**D1 — Polling, SSE und WebSockets**

### Konfliktauflösung

**D2 — Eine Kollision, drei Richtlinien**

### Dokumentzustand, Präsenz und Signale

**D3 — Dokument, Präsenz und Signal**

Verwenden Sie D3 im Supabase-Abschnitt mit Supabase-Beschriftungen wieder.

### InstantDB

**D4 — Ereignisorientierte und abfrageorientierte Synchronisierung**

### Alternativen

**S1 — Alternativen lösen verschiedene Ebenen**

### Entscheidungsleitfaden

**D5 — Entscheidungsleitfaden**

## Schluss

### Zurück zur Leinwand

**V5 — Ein übersichtlicher Multi-Agent-Arbeitsbereich**

---

# Visueller Rhythmus

Der Artikel sollte nicht in jedem Abschnitt eine vollständige Animation enthalten.

Empfohlener Rhythmus:

1. narrative Animation;
2. Fließtext;
3. eine weitere narrative Animation;
4. technische Diagramme und Code;
5. abschließende narrative Animation.

Die technische Hälfte sollte schneller und analytischer wirken als der Einstieg.

## Größenhierarchie

### Narrative Anker in voller Breite

- V2
- V3
- V4
- V5

### Kleinere Einstiegsszene

- V1

### Kompakte technische Abbildungen

- D1
- D2
- D3
- D4
- D5
- S1

---

# Wiederverwendbare Szenenkomponenten

Bauen Sie ein kleines Animations-Kit in einfachem JavaScript.

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

Jede Factory sollte Folgendes bereitstellen:

```js
{
  update(state) {},
  destroy() {},
}
```

## Nützliche Zeitleistenaktionen

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

## Szenenzustand

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

- Szenen nur in der Nähe des Ansichtsfensters einhängen
- `requestAnimationFrame` anhalten, wenn eine Szene ausgeblendet ist
- Transformationen gegenüber Layoutänderungen bevorzugen
- SVG- und DOM-Elemente wiederverwenden
- Knoten- und Kantenzahl gering halten
- Pfade und Keyframes vorab berechnen
- Keine echte Vernetzung implementieren
- Deterministische Zeitabläufe verwenden
- Deterministische Seeds verwenden, falls eine visuelle Variation eingeführt wird

---

# Redaktionelle Checkliste

Bestätigen Sie vor der Abnahme jeder Visualisierung:

1. Vermittelt sie eine zentrale Idee?
2. Kann ein nichttechnischer Leser erklären, was sich geändert hat?
3. Interpretiert der Fließtext die Visualisierung, statt sie nur zu beschreiben?
4. Ist die Handlungsautorität vor folgenreichen Agentenaktionen sichtbar?
5. Ist die Schleife nach einmaligem Ansehen verständlich?
6. Bewahrt der Modus für reduzierte Bewegung die Aussage?
7. Erhält ein Hersteller mehr visuelle Ausarbeitung als die Alternativen?
8. Sind dauerhafter Zustand, Präsenz und Signale korrekt dargestellt?
9. Zeigt die Konfliktabbildung eine ausdrückliche Richtlinie, statt anzudeuten, Konflikte verschwänden?
10. Bleibt das Schlussbild ruhig?
11. Ist diese Visualisierung notwendig, oder würde ein statisches Diagramm die Aussage effizienter vermitteln?
