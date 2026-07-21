# Animations-Playbook: Aktualisierte Eröffnung

Dieses Dokument definiert die visuelle Geschichte für V1, V3 und V4. V2 ist bereits implementiert und fungiert als Brücke zwischen der Einzelbenutzerwelt und der Mehrspielerwelt.

## Gemeinsame visuelle Sprache

Alle Eröffnungsanimationen sollten sich wie Teile desselben Produkts und derselben Geschichte anfühlen.

- Dunkle, zurückhaltende Leinwand.
- Dünne neutrale Ränder.
- Sanfte Bewegung ohne Sprünge oder übertriebene Lockerung.
- Eine primäre Aktion nach der anderen.
- Cursor fungieren als Zeichen.
- Die Agentenidentität wird durch einen beschrifteten Cursor und einen subtilen Akzent angezeigt.
- Die menschliche Identität wird durch einen Standardcursor und ein kompaktes Namensschild angezeigt.
- Änderungen werden wirksam, bevor die nächste Aktion beginnt.
- Jede Animation sollte sauber wiederholt werden.
- Es ist keine Benutzerinteraktion erforderlich.
- Die Kamera bleibt fixiert.
- Die Animation sollte auch ohne das Lesen einer Bildunterschrift verständlich bleiben.

Die Szenen sollten sich redaktionell anfühlen und eher einem Figma-Ingenieuraufsatz als einer Produkt-Onboarding-Animation ähneln.

---

# V1 – Ein Benutzer, eine Aktion

## Rolle im Artikel

V1 führt das alte Interaktionsmodell ein:

> Eine Person handelt. Die Software reagiert.

Seine Aufgabe ist es nicht, eine beeindruckende Benutzeroberfläche zu zeigen. Seine Aufgabe ist es, eine ruhige, offensichtliche Kausalität herzustellen. Im Vergleich zu allem, was folgt, sollte sich die Szene fast ereignislos anfühlen.

## Verbindung zu V2

V1 sollte dieselbe Canvas-Sprache wie V2 verwenden, jedoch ohne Agent und mit viel weniger Aktivität.

V2 fühlt sich dann wie das gleiche Produkt an, nachdem ein zweiter Schauspieler eingestiegen ist.

## Canvas-Setup

Verwenden Sie einen einfachen Entscheidungsbereich mit drei Elementen:

- Ein Top-Eingabeaufforderungsknoten: „Warum wechseln Kunden ab?“.
- Ein leerer oder gedämpfter Lösungsbereich darunter.
- Ein kompaktes Aktionsfeld oder eine Schaltfläche mit der Bezeichnung „Idee hinzufügen“.

Es ist nur ein menschlicher Cursor vorhanden.

Die Leinwand ist völlig still, bevor sich der Cursor bewegt.

## Story-Sequenz

### 1. Ruhe dich aus

Die Leinwand bleibt etwa eine Sekunde lang unverändert.

Kein Ladeflimmern. Keine Umgebungsagentenaktivität. Keine unerklärliche Bewegung.

### 2. Der Benutzer nähert sich

Der Cursor mit der Bezeichnung „Sie“ bewegt sich in Richtung „Idee hinzufügen“.

Die Bewegung sollte direkt und ohne Eile sein.

### 3. Der Benutzer handelt

Der Cursor klickt.

Es erscheint ein kurzer Textwert:

„Onboarding-E-Mails“.

Die Aktionssteuerung bestätigt die Eingabe mit einem zurückhaltenden gedrückten Zustand.

### 4. Das System antwortet

Unterhalb der ursprünglichen Frage wird ein neuer Knoten angezeigt.

Es sollte nicht dramatisch platzen. Es kann verblassen und von etwa 0,98 auf 1 skalieren, während die Verbindungskante eingezogen wird.

### 5. Der Staat beruhigt sich

Der Cursor bewegt sich leicht weg.

Der neue Knoten bleibt bestehen.

Sonst passiert nichts.

### 6. Loop halten

Halten Sie den abgeschlossenen Zustand lange genug fest, damit der Leser den Ursache-Wirkungs-Zusammenhang erkennen kann.

Anschließend mit einem kurzen Crossfade zurücksetzen.

## Visuelle Kernidee

Für den neuen Knoten gibt es nur eine plausible Erklärung:

Der Benutzer hat es erstellt.

Es ist keine Attributions-Benutzeroberfläche erforderlich. Es ist kein Aktivitätsprotokoll erforderlich. Es ist keine Anwesenheit erforderlich. Die Einfachheit ist der Punkt.

## Optionale minimale Beschriftung

> Eine Aktion hat einen offensichtlichen Eigentümer.

Vermeiden Sie Bildunterschriften, die die Mechanik erläutern, wie zum Beispiel:

> Sie klicken auf „Idee hinzufügen“ und ein Knoten erscheint.

Das zeigt schon die Animation.

## Timing

Empfohlene Gesamtdauer: 6–7 Sekunden.

- Pause: 1,0 s
- Cursorbewegung: 0,8 s
- Klicken und Eingabe: 0,7 s
- Knotenerstellung: 0,8 s
- Beruhigter Halt: 2,0 s
- Zurücksetzen: 0,7 s

## Implementierungshinweise

- Verwenden Sie deterministische Keyframes.
- Verwenden Sie keinen echten Eingang.
– Der eingegebene Wert kann als zwei oder drei Schnelltextgruppen statt Zeichen für Zeichen animiert werden.
- Halten Sie die Knotenerstellung im Einklang mit der visuellen Sprache von V2.
- Behalten Sie nach Möglichkeit die gleichen Leinwandabmessungen und Typografie wie in V2 bei.

---

# V2 – Vorhandene Brückenanimation

## Aktuelles endgültiges Konzept

V2 enthält einen Benutzer und einen Forschungsagenten.

Der Benutzer gibt „Onboarding-E-Mails“ ein, während der Agent arbeitet.

Die Karte des Benutzers wird nach links verschoben, um Platz für den Vorschlag des Agenten zu schaffen. Das Rechercheergebnis wird später als vorläufiger, gestrichelter Inhalt auf der Karte des Benutzers verschachtelt, bis es bestätigt wird.

## Story-Funktion

V2 stellt vier Ideen vor, ohne dass sie in Prosa dargelegt werden müssen:

- Die Software ist jetzt ein Akteur.
- Die Aktionen von Menschen und Agenten können sich überschneiden.
- Agentenarbeit kann vorläufig sein.
- Die Schnittstelle muss Platz für einen zweiten Teilnehmer schaffen.

V3 sollte direkt aus dieser Szene aufbauen, anstatt auf ein nicht verwandtes Produkt zurückzusetzen.

---

# V3 – Die Leinwand wird überfüllt

## Rolle im Artikel

V3 erweitert das Interaktionsmodell:

> Aus einem Benutzer und einem Agenten werden mehrere Menschen und mehrere Agenten.

Die Szene sollte nicht sofort chaotisch werden. Es sollte als natürliche Fortsetzung von V2 beginnen und erst dann schwierig werden, wenn sich die Teilnehmer annähern.

## Verbindung zu V2

Beginnen Sie mit einer Leinwand, die V2 ähnelt, nachdem sowohl die Idee des Benutzers als auch der Vorschlag des Forschungsagenten angenommen wurden.

Vorgeschlagene vorhandene Knoten:

- „Warum wechseln Kunden ab?“
- „Onboarding-E-Mails“.
- „Rückgewinnungsangebot“.
- „Willkommen zur Serienrecherche“.

Das Bild sollte sich so anfühlen, als ob der Artikel leicht verkleinert wurde und zeigt, dass derselbe Arbeitsbereich mehr Teilnehmer hat.

## Teilnehmer

Nutzen Sie vier Teilnehmer:

- „Du“ – Mensch
- „Maya“ – zweiter Mensch
- „Forschungsagent“.
- „Strukturagent“.

Die beiden Agenten sollten unterschiedliche, stabile Rollen haben.

### Forschungsagent

Fügt Beweise oder Kontext hinzu.

### Strukturagent

Verbindet, gruppiert oder ordnet vorhandenes Material neu.

## Story-Sequenz

### 1. Vertrauter Ausgangspunkt

Zeigen Sie das akzeptierte Ergebnis von V2 an.

„Sie“ bleibt in der Nähe des Knotens „Onboarding-E-Mails“.

Der „Forschungsagent“ ist anwesend, aber für einen Moment inaktiv.

### 2. Der Arbeitsbereich öffnet sich

Ein zweiter menschlicher Cursor, „Maya“, kommt von rechts herein.

Ein zweiter Agentencursor, „Strukturagent“, wird vom oberen oder unteren Rand eingegeben.

Stellen Sie nicht alle gleichzeitig vor. Gestaffelte Ankünfte.

### 3. Die selbstständige Arbeit beginnt

Jeder Teilnehmer führt eine andere, verständliche Aktion aus:

- „Research Agent“ erstellt einen kleinen Beweisknoten unter „Onboarding-E-Mails“.
- „Strukturagent“ beginnt, eine Beziehung zu „Rückgewinnungsangebot“ herzustellen.
- „Maya“ wählt die Hauptabwanderungsfrage aus.
- „Sie“ beginnen, „Onboarding-E-Mails“ leicht nach links zu ziehen.

Die Aktionen können sich überschneiden, sollten aber jeweils optisch lesbar bleiben.

### 4. Der erste Moment der Spannung

Während „Sie“ noch „Onboarding-E-Mails“ in der Hand hält, bewegt sich der „Strukturagent“ auf denselben Knoten zu, weil er ihn neu positionieren oder verbinden möchte.

Der Zielknoten erhält zwei subtile Absichtsindikatoren.

Lösen Sie den Konflikt noch nicht.

### 5. Eine zweite Konvergenz

„Maya“ bewegt sich auf die oberste Frage zu, während der „Forschungsagent“ darauf abzielt, eine Beweisverbindung herzustellen.

Die Leinwand enthält nun mehrere vernünftige Aktionen, die einzeln harmlos, aber insgesamt mehrdeutig sind.

### 6. Bleiben Sie bei der Frage stehen

Halten Sie die Taste kurz gedrückt, während zwei Teilnehmer auf dasselbe Objekt blicken.

Der letzte Rahmen sollte die Frage ohne Text deutlich machen:

Wer kontrolliert dieses Objekt jetzt?

### 7. Zurücksetzen

Blenden Sie zuerst die Cursor der Teilnehmer aus und stellen Sie dann den ursprünglich akzeptierten V2-Status wieder her.

## Visuelle Kernidee

Das Problem besteht nicht darin, dass es vier Teilnehmer gibt.

Das Problem besteht darin, dass vier Teilnehmer unabhängig voneinander auf den gemeinsamen Zustand reagieren können und die Schnittstelle sich nicht mehr auf offensichtliche Kausalität verlassen kann.

## Optionale minimale Beschriftung

> Mehr Teilnehmer verändern mehr als die Menge an Aktivität.

Alternative:

> Ein gemeinsamer Zustand erfordert gemeinsame Regeln.

## Was noch nicht gezeigt werden soll

Lösen Sie den Konflikt in V3 nicht.

Fügen Sie kein vollständiges Aktivitätsprotokoll hinzu.

Sperren, Rückgängigmachen oder Konfliktlösung werden nicht angezeigt.

Diese gehören in spätere Visualisierungen. V3 sollte das Problem verursachen.

## Timing

Empfohlene Gesamtdauer: 9–11 Sekunden.

- Bekannter Zustand: 1,0 s
- Ankunft der Teilnehmer: 1,5 s
- Unabhängige Aktionen: 3,0 s
- Konvergenz: 2,0 s
- Halten: 1,5 s
- Zurücksetzen: 1,0 s

## Implementierungshinweise

- Knotenpositionen und visuelle Komponenten aus V2 wiederverwenden.
- Halten Sie die Cursorpfade bewusst.
- Vermeiden Sie vier gleichzeitige Textbeschriftungen.
- Verwenden Sie Zielmarkierungen, um die Absicht vor der Mutation anzuzeigen.
- Beschränken Sie neu erstellte Inhalte auf einen kleinen Beweisknoten.
- Lassen Sie eine Kante teilweise zeichnen und halten Sie dann inne, während der Konflikt entsteht.
- Die Schleife sollte vor jeder Lösung enden, sodass die offene Frage erhalten bleibt.

---

# V4 – Von der unheimlichen Arbeitsfläche zum gemeinsamen Arbeitsbereich

## Rolle im Artikel

V4 zeigt den Unterschied zwischen:

- synchronisierter Zustand;
- verständliche Zusammenarbeit.

Beide Hälften der Animation sollten die gleichen grundlegenden Änderungen aufweisen. Lediglich die erklärenden Schnittstellenschichten sollten sich unterscheiden.

## Anbindung an V3

Verwenden Sie denselben Mehrteilnehmer-Canvas und ähnliche Aktionen.

V3 endete mit Unklarheiten.

V4 zeigt, dass eine schnellere Synchronisierung allein diese Unklarheit nicht beseitigt.

## Präsentationsformat

Verwenden Sie eine Leinwand in zwei aufeinanderfolgenden Phasen anstelle eines Split-Screen-Vergleichs.

Dadurch fühlt sich die Transformation stärker an:

1. Die Leinwand läuft in einem „Haunted“-Modus.
2. Es wird zurückgesetzt.
3. Die exakt gleiche Sequenz läuft noch einmal mit Hinweisen zur Zusammenarbeit.

In einer Ecke kann eine subtile Phasenbezeichnung erscheinen:

- „Nur Staat“.
- „Zustand + Kontext“.

## Phase 1 – Spukende Leinwand

### Aufstellen

Es sind keine Teilnehmercursor sichtbar.

Es werden keine Agentennamen angezeigt.

Es werden keine ausgewählten Status oder Absichtsvorschauen angezeigt.

Es wird kein Aktivitätsverlauf angezeigt.

### Reihenfolge

- „Onboarding-E-Mails“ verschiebt sich leicht nach links.
- Darunter erscheint ein neuer Beweisknoten.
- Eine Kante verläuft vom Beweisknoten zum „Win-Back-Angebot“.
- Die oberste Frage ändert sich von einem neutralen Zustand zu „Überprüft“.

Alle Änderungen erfolgen reibungslos und perfekt synchronisiert.

Aber nichts erklärt sie.

### Ton

Die Leinwand sollte keine Fehler aufweisen.

Es sollte einwandfrei funktionieren und sich trotzdem unangenehm anfühlen.

Diese Unterscheidung ist wichtig: Dies ist kein kaputtes Echtzeitsystem. Es ist technisch korrekt, aber gesellschaftlich unleserlich.

## Übergang

Bringen Sie die Leinwand wieder in den Ausgangszustand zurück.

Zeigen Sie das Etikett der zweiten Phase an:

„Zustand + Kontext“.

## Phase 2 – Gemeinsamer Arbeitsbereich

Führen Sie dieselben Aktionen noch einmal aus, mit erklärenden Ebenen.

### Bevor sich der Knoten bewegt

- „Du“ erscheint.
- Der Cursor nähert sich „Onboarding-E-Mails“.
- Der Knoten zeigt einen subtilen Umriss der menschlichen Selektion.
- Der Cursor zieht es nach links.

### Bevor Beweise erscheinen

- „Forschungsagent“ erscheint.
- Auf einem kurzen Etikett steht „Beweis hinzufügen“.
- Eine vorläufige Übersicht zeigt, wo der neue Beweisknoten landen wird.
– Der Knoten wird nach seinem Erscheinen festgeschrieben.

### Bevor die Kante gezogen wird

- „Strukturagent“ nähert sich dem Quellknoten.
- Sowohl Quell- als auch Zielknoten werden hervorgehoben.
- Auf einem kurzen Etikett steht „Verbindungsbeweis“.
- Die Kante zieht.

### Bevor sich der Überprüfungsstatus ändert

- „Maya“ wählt die oberste Frage aus.
- Ihr Name erscheint neben dem Cursor.
- Der Status ändert sich in „Überprüft“.

### Nach jeder Aktion

Fügen Sie unten einen kompakten Aktivitätseintrag hinzu:

- „Sie haben Onboarding-E-Mails verschoben“.
- „Forscher hat Beweise hinzugefügt“.
- „Struktur-Agent-verbundene Beweise“.
- „Maya hat die Frage als überprüft markiert“.

Der neueste Eintrag kann kurz erscheinen und dann in einer kompakten Liste oder einem Ticker zusammengefasst werden.

### Kontrollschicht

Nachdem die vom Agenten erstellte Kante erreicht ist, wird neben dem neuesten Aktivitätseintrag eine kleine Aktion „Rückgängig“ angezeigt.

Es muss nicht angeklickt werden.

Seine Anwesenheit kommuniziert Reversibilität.

## Visuelle Kernidee

Der Zustand ist in beiden Phasen identisch.

Die zweite Phase wird nutzbar, weil die Schnittstelle Folgendes bereitstellt:

- Anwesenheit;
- Identität;
- Absicht;
- Namensnennung;
- vorläufiger Zustand;
- Reversibilität.

## Optionale minimale Beschriftung

> Gleicher Zustand. Unterschiedliches Verständnis.

Dies ist einer Beschriftung vorzuziehen, die jede visuelle Ebene auflistet.

## Timing

Empfohlene Gesamtdauer: 14–16 Sekunden.

### Spukphase

- Starthalt: 0,8 s
- Vier ungeklärte Änderungen: 3,5 s
- Halten: 1,0 s

### Übergang

- Zurücksetzen: 0,8 s
- Phasenbezeichnung: 0,5 s

### Geteilte Phase

- Vier erläuterte Änderungen: 5,5 s
- Letzter Halt: 1,5 s
- Zurücksetzen: 0,8 s

## Implementierungshinweise

- Verwenden Sie in beiden Phasen exakt die gleichen Knotenpositionen und Endzustände.
- Halten Sie den zeitlichen Ablauf der Aktionen nahezu identisch.
- Beim Vergleich sollte es um den Kontext gehen, nicht um die Geschwindigkeit.
- Aktivitätseinträge sollten gegenüber der Leinwand zweitrangig bleiben.
– Absichtsbezeichnungen sollten vor Aktionen erscheinen und kurz danach verschwinden.
- Die Anwesenheit ist vorübergehend; Die Zuordnung bleibt im Aktivitätsverlauf erhalten.
- Verwenden Sie eine kleine ausstehende oder vorläufige Behandlung nur für den vom Agenten erstellten Knoten.
– Vermeiden Sie hier das Hinzufügen von Berechtigungskontrollen. Autorität wird in der Prosa eingeführt, kann aber später visualisiert werden.

---

# Eröffnungssequenz als Ganzes

Die ersten vier Visualisierungen bilden nun eine kontinuierliche Eskalation:

## V1

Ein Benutzer steuert eine passive Anwendung.

## V2

Ein Agent beginnt, mit dem Benutzer zusammenzuarbeiten.

## V3

Mehrere Menschen und Agenten teilen sich denselben Zustand.

## V4

Synchronisierung allein reicht nicht aus; Die Schnittstelle muss die Aktivität erklären.

Die visuelle These lautet:

> Single-User-Schnittstellen könnten Kausalität implizit hinterlassen. Multiplayer-Agentenschnittstellen müssen es sichtbar machen.
