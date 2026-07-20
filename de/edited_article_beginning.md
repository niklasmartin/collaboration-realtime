# Ihr nächstes KI-Interface ist ein Multiplayer-Interface

## Schnittstellen waren früher einfach

Die meiste Zeit der Softwaregeschichte folgten Schnittstellen einem einfachen Rhythmus:

Eine Person hat etwas getan. Die Software hat reagiert.

Die Aktion könnte das Klicken auf eine Schaltfläche, das Absenden eines Formulars, das Bearbeiten einer Tabellenzelle oder das Verschieben eines Objekts auf einer Leinwand gewesen sein. Die Kontrolle selbst spielte keine Rolle. Entscheidend war, dass die Person die Änderung initiierte und die Anwendung darauf reagierte.

[V1: Ein Benutzer, eine Aktion – Eine Person initiiert eine Änderung in einer ansonsten passiven Anwendung. Siehe`animations_updated.md`.]

Dieses Modell machte es einfach, über Schnittstellen nachzudenken.

Wenn sich etwas änderte, war die Ursache meist offensichtlich: Der Benutzer hatte gerade etwas getan. Die Schnittstelle musste nicht erklären, wer verantwortlich war, da es nur eine plausible Antwort gab. Rückgängig machen bedeutete, die letzte Aktion der Person rückgängig zu machen. Eine Ladeanzeige bedeutete, dass die Anwendung ihre Anfrage verarbeitete. Während der Benutzer wartete, blieb die Schnittstelle still.

Sogar Software, die von großen Teams verwendet wird, bewahrt dieses Modell oft lokal. Hunderte von Personen könnten Zugriff auf dasselbe Projekt haben, aber jeder einzelne Bildschirm verhielt sich immer noch so, als ob gerade eine Person die Kontrolle in der Hand hätte.

Es gab eine klare Grenze zwischen Akteur und Werkzeug.

Die Person hat gehandelt. Die Software wartete.

## Dann begann auch die Software zu handeln

Ein Agent ist nicht einfach eine weitere Möglichkeit, eine herkömmliche Anfrage auszulösen. Es kann nach dem auslösenden Klick weiterarbeiten. Es kann Informationen prüfen, Entscheidungen treffen, Objekte erstellen, Ideen verbinden und dieselbe Schnittstelle aktualisieren, die die Person noch verwendet.

Der Benutzer ist nicht mehr der einzige aktive Teilnehmer.

[V2: Ein zweiter Akteur tritt ein – Der Benutzer fügt eine Idee hinzu, während ein Forschungsagent parallel arbeitet. Das Layout schafft Raum für den Vorschlag des Agenten, und spätere Recherchen bleiben vorläufig, bis der Benutzer sie bestätigt.]

Dies führt zu einer anderen Klasse von Schnittstellenproblemen.

Wenn ein neuer Knoten erscheint, wurde er von der Person oder vom Agenten erstellt? Ist es ein fertiger Beitrag oder nur ein Vorschlag? Kann die Person es bearbeiten, während der Agent noch arbeitet? Können sie den Betrieb unterbrechen? Wenn sie auf „Rückgängig“ drücken, machen sie dann ihre eigene Aktion oder die des Agenten rückgängig?

Dabei handelt es sich nicht in erster Linie um Fragen zur künstlichen Intelligenz. Es handelt sich um Fragen zur geteilten Handlungsfähigkeit.

Schnittstellen unterstützen die Automatisierung seit Jahrzehnten, der Großteil der Automatisierung blieb jedoch hinter dem Bildschirm. Eine Berechnung wurde ausgeführt, ein Workflow abgeschlossen oder ein Server hat ein Ergebnis zurückgegeben. Die Anwendung hat möglicherweise komplexe Aufgaben ausgeführt, aus Sicht des Benutzers reagierte sie jedoch immer noch auf eine Anfrage.

Agenten erledigen ihre Arbeit zunehmend innerhalb der Schnittstelle selbst.

Sie geben nicht nur Antworten zurück. Sie manipulieren dieselben Objekte wie der Benutzer. Sie hinterlassen Entwürfe, Entscheidungen, Beziehungen, Kommentare und teilweise abgeschlossene Arbeiten. Sie können handeln, während der Benutzer dasselbe Material liest, bearbeitet oder sich darauf vorbereitet, darauf zu reagieren.

Dadurch wird die Benutzeroberfläche von einem Bedienfeld in einen Arbeitsbereich umgewandelt.

Die visuelle Unterscheidung ist wichtig. In V2 kommen der Benutzerbeitrag und der Vorschlag des Agenten nicht einfach als zwei anonyme Aktualisierungen an. Sie haben unterschiedliche Identitäten, unterschiedliche Zustände und unterschiedliche Ebenen des Engagements. Der Benutzer kann sehen, dass der Agent denkt. Der Vorschlag des Agenten schafft Platz für sich selbst, anstatt stillschweigend die Arbeit des Benutzers zu ersetzen. Zusätzliche Recherchen erscheinen als vorläufiges Element, bevor sie Teil der gemeinsamen Leinwand werden.

Die Benutzeroberfläche beginnt nicht nur zu erklären, **was sich geändert hat**, sondern auch, **wer es geändert hat** und **ob die Änderung endgültig ist**.

Dieses Gebiet ist nicht ganz neu. Die Forschung zu Schnittstellen für gemischte Initiativen untersucht seit langem Systeme, in denen Menschen und Software die Kontrolle über eine Aufgabe teilen. Neu ist, wie alltäglich das Muster wird. Forschungsassistenten, Coding-Agenten, Design-Tools, Support-Copiloten und Workflow-Agenten sind alle irgendwo zwischen „einem Tool, das ich bediene“ und „einem Teilnehmer, der neben mir arbeitet“ angesiedelt.

Ein Benutzer und ein Agent sind bereits schwieriger als herkömmliche Request-Response-Software.

Es ist wahrscheinlich auch die einfachste Version dessen, was als nächstes kommt.

**Quellen:** Eric Horvitz,[Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/); Microsoft Research,[Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/)

## Aus einem Assistenten wird ein Raum voller Teilnehmer

Es ist verlockend, die Benutzer-Agenten-Schnittstelle als eine private Beziehung zu betrachten: eine Person wird von einem intelligenten Assistenten begleitet.

Die nützlichste Software ist jedoch bereits in Unternehmen vorhanden.

Projekte haben Eigentümer und Prüfer. Dokumente haben Autoren und Herausgeber. An Entscheidungen sind Forscher, Designer, Ingenieure, Kunden und Manager beteiligt. Sobald Agenten diese Umgebungen betreten, betreten sie keinen leeren Raum. Sie schließen sich Arbeiten an, die bereits geteilt wurden.

Und es ist unwahrscheinlich, dass es nur einen davon gibt.

Ein Rechercheagent sammelt möglicherweise Beweise, während ein Planungsagent sie neu organisiert. Ein Compliance-Beauftragter kann ein Risiko markieren, während ein menschlicher Prüfer noch den entsprechenden Abschnitt bearbeitet. Eine andere Person könnte denselben Arbeitsbereich öffnen, um den Fortschritt zu überprüfen oder eine Annahme zu korrigieren.

Die Schnittstelle verfügt nun über mehrere unabhängige Teilnehmer, von denen jeder seinen eigenen Zeitplan, seine eigenen Verantwortlichkeiten und sein eigenes Verständnis der Aufgabe hat.

[V3: Die Leinwand wird überfüllt – Zwei Personen und zwei spezialisierte Agenten arbeiten auf derselben Leinwand. Siehe`animations_updated.md`.]

Dies kann zunächst wie eine einfache Steigerung der Aktivität aussehen. Weitere Cursor. Mehr Knoten. Mehr Änderungen kommen schneller.

Der eigentliche Unterschied liegt jedoch nicht in der Anzahl der Animationen auf dem Bildschirm. Es liegt daran, dass die Kausalität nicht mehr offensichtlich ist.

Ein Knoten kann verschoben werden, ohne dass der aktuelle Benutzer ihn berührt. Während sie einen anderen Teil der Leinwand lesen, kann eine Kante erscheinen. Ein Agent kann mit Umstrukturierungsarbeiten beginnen, die ein anderer Teilnehmer noch für unvollendet hält. Zwei Teilnehmer können individuell sinnvolle Entscheidungen treffen, die nicht beide zum Endzustand werden können.

Die Annahmen, die die ursprüngliche Schnittstelle einfach machten, sind verschwunden:

- Es gibt nicht mehr einen offensichtlichen Eigentümer jeder Aktion.
- Änderungen erfolgen nicht unbedingt als Reaktion auf die Eingaben des aktuellen Benutzers.
- Die Schnittstelle kann nicht davon ausgehen, dass die Teilnehmer denselben Kontext teilen.
- Das Rückgängigmachen kann sich auf die Arbeit einer anderen Person auswirken.
- Eine Änderung kann technisch gültig sein und dennoch im falschen Moment eintreffen.
- Zwei Teilnehmer können gleichzeitig versuchen, dasselbe Objekt zu ändern.

Dies ist der Punkt, an dem eine Agentenschnittstelle zu einer Multiplayer-Schnittstelle wird.

„Multiplayer“ bedeutet nicht nur das Anzeigen mehrerer Cursor. Das bedeutet, dass mehrere unabhängige Akteure eine Welt teilen, die kohärent bleiben muss, während sie sie verändern.

Das gibt dem System zwei getrennte Verantwortlichkeiten.

Erstens muss sichergestellt werden, dass jeder Teilnehmer letztendlich den richtigen Status sieht.

Zweitens muss es jedem Teilnehmer helfen zu verstehen, was in diesem Staat geschieht: Wer ist anwesend, was tut er, welche Änderungen sind vorläufig, was darf er ändern und was passiert, wenn sich seine Handlungen überschneiden.

Die meisten Echtzeittechnologien konzentrieren sich auf die erste Verantwortung.

Das schwierigere Schnittstellenproblem beginnt mit dem zweiten.

**Quellen:**Figma,[How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/);Figma,[Making multiplayer more reliable](https://www.figma.com/blog/making-multiplayer-more-reliable/)

## Realtime ist nicht dasselbe wie verständlich

Stellen Sie sich vor, die Leinwand sei technisch perfekt.

Jeder Teilnehmer sieht jede Änderung sofort. Ein Knoten bewegt sich auf einem Bildschirm und erscheint überall an seiner neuen Position. Eine von einem Agenten erstellte Kante trifft ohne Verzögerung ein. Eine von einem anderen Benutzer geänderte Beschriftung wird synchronisiert, bevor jemand die Seite aktualisieren kann.

Der Zustand ist korrekt.

Die Erfahrung kann sich immer noch eindringlich anfühlen.

Objekte bewegen sich ohne Erklärung. Verbindungen tauchen aus dem Nichts auf. Etiketten ändern sich, während jemand sie liest. Der Benutzer kann nicht erkennen, ob eine Änderung von einer anderen Person, einem Agenten oder dem System selbst stammt. Sie wissen nicht, ob eine Operation abgeschlossen ist, ob ein Eingreifen sicher ist oder ob ihre eigene Arbeit bald überschrieben wird.

[V4: Von der Haunted Canvas zum Shared Workspace – Dieselben synchronisierten Änderungen werden zuerst ohne Kontext, dann mit Cursorn, Identitäten, Absicht, Zuordnung und Rückgängig angezeigt. Siehe`animations_updated.md`.]

An den zugrunde liegenden Daten muss sich zwischen diesen beiden Versionen nichts ändern. Was sich ändert, ist die Erklärung dieser Daten durch die Schnittstelle.

Die zweite Version stellt die Informationen wieder her, die Einzelbenutzersoftware zuvor implizit hinterlassen konnte:

- dessen Cursor sich einem Objekt nähert;
- welcher Teilnehmer hat es aktuell ausgewählt;
- was ein Agent zu tun beabsichtigt, bevor er es tut;
- ob eine Änderung aussteht, vorläufig oder festgeschrieben ist;
- Wer hat jede abgeschlossene Aktion ausgeführt?
- und wie der Benutzer es rückgängig machen oder unterbrechen kann.

DieRealtime-Synchronisierung ermöglicht einen gemeinsamen Arbeitsbereich. Es macht diesen Arbeitsbereich nicht verständlich.

Fünf Fragen trennen den synchronisierten Zustand von der nutzbaren Zusammenarbeit:

1. **Status** – Was enthält das freigegebene Dokument?
2. **Anwesenheit** – Wer ist gerade hier?
3. **Absicht** – Was macht oder wird jeder Teilnehmer tun?
4. **Autorität** – Wer darf welche Objekte ändern?
5. **Konflikt** – Was passiert, wenn zwei Änderungen dasselbe betreffen?

Das Übertragen von Informationen von einer Maschine auf eine andere beantwortet nur die erste Frage.

Die anderen vier machen aus einem schnellen System eine Schnittstelle, der die Menschen vertrauen können.

**Quellen:** Microsoft Research,[Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/);Figma,[How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
