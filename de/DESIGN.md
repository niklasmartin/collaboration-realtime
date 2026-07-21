# DESIGN.md — Redaktioneller Minimalismus (von Linear inspiriert)

Maßgebliche Quelle für alle visuellen Entscheidungen in diesem Artikel. Alle Agenten und Mitwirkenden
folgen dieser Datei. Im Zweifel: ruhiger, flacher, weniger Farben.

## 1. Visuelles Thema & Atmosphäre

Redaktioneller Minimalismus. Präzise. Zurückhaltend. Jeder Pixel hat seine Berechtigung.
Schweizer Grafikdesign der späten 90er trifft auf modernes SaaS. Stimmung: präzise, schnell, leise selbstbewusst.

Dies ist ein ausführlicher technischer Essay, keine SaaS-App — die Informationsdichte ist entsprechend anzupassen:
Prosa erhält eine angenehme Lesebreite; die *Animationen und Diagramme* tragen das
Ethos hoher Informationsdichte.

## 2. Farbpalette & Rollen

```css
--bg:              #ffffff;
--bg-alt:          #fafafa;
--surface:         #f4f4f5;
--text:            #0f0f14;
--text-muted:      #6b6b76;
--text-dim:        #a0a0ab;
--border:          #e4e4e7;
--border-strong:   #d4d4d8;
--accent:          #5e6ad2;   /* sparsam einsetzen — Satzzeichen, kein Absatz */
--accent-hover:    #4e5acb;
```

Regeln:
- Akzent nur für: Links, Fokusringe, Agenten-Cursor/Absichts-Kennzeichnungen in Animationen
  und höchstens eine Hervorhebung pro Szene. Nie auf Hintergründen. Niemals eine zweite Akzentfarbe.
- Nirgends Verläufe. Keine Schatten auf Karten/Schaltflächen; ein einzelnes
  `0 2px 8px rgba(0,0,0,0.04)` ist ausschließlich für schwebende Einblendungen reserviert.

## 3. Typografie

- Überschriften + Fließtext: `Inter`, Ausweichschrift system-ui. Nur die Schriftschnitte 400/500/600.
  Zeichenabstand −0.5 % bei Überschriftgrößen (≥28px).
- Inter über `<link>` von Google Fonts oder rsms.me/inter laden (kein Erstellungsschritt).
- Nichtproportional: `Berkeley Mono`, Ausweichschriften `SF Mono`, `ui-monospace`, monospace.
- Skala (px): 11 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64.
- Keine Serifenschrift. Keine Kursivschrift zur Hervorhebung — Schriftschnitt 600 verwenden.
- Fließtext: 16px (bis zu 18px sind für die Lesespalte akzeptabel), Zeilenhöhe ~1.65.
- Bildunterschriften und Beschriftungen: 13px, Schriftschnitt 500, `--text-muted`.

## 4. Layout

- Lesespalte: maximal ~680px für Prosa.
- Animationen und Diagramme in voller Breite dürfen sich zentriert bis auf ~960px erstrecken
  (ein „Ausbruch“ über die Prosa-Spalte hinaus — der charakteristische Rhythmus des Artikels).
- 4px-Basiseinheit; Abstands-Skala 4/8/12/16/24/32/48/64.
- Radius: 6px für kleine Elemente, maximal 8px für Karten/Zeichenflächen. Nie mehr als 8px.
- Tiefe: flach, durch Ränder erzeugt. 1px `--border`, beim Darüberfahren/Hervorheben zu `--border-strong` wechseln.

## 5. Sprache der Animations-Zeichenflächen

Leitprinzip: **abstraktes Diagramm, kein Oberflächen-Mockup.** Die Szenen dürfen nicht wie
Bildschirmaufnahmen einer shadcn-artigen Oberfläche wirken. Referenzqualität: technische Strichzeichnungen —
haarfeine Linien, ungefüllte Formen, maximale Zurückhaltung. Flächen treten zurück; die
*Interaktion* (Bewegung, Timing, Ursache und Wirkung) ist das Einzige, was den Blick anzieht.

- Liniendisziplin: überall haarfeine Linien — 0.75px-SVG-Linien
  (`vector-effect: non-scaling-stroke`), Farbe `--border-strong` für die Struktur,
  `--text-muted` für aktive/hervorgehobene Elemente. Nichts auf der Zeichenfläche verwendet eine
  gefüllte dunkle Fläche.
- Rahmen der Zeichenfläche: Hintergrund `--bg-alt`, 1px `--border`, Radius 8px. Punktraster sehr
  dezent oder nicht vorhanden — vorzugsweise nicht vorhanden, außer eine Szene benötigt räumliche Orientierung.
- Knoten: **nur Kontur** — keine Füllung (Zeichenfläche scheint durch), haarfeine 0.75px-Linie
  `--border-strong`, Radius 6px, kompakt. Beschriftungen 11px Inter 500 `--text-muted`,
  innerhalb oder unterhalb der Kontur.
  - Vorläufig (Vorschlag eines Agenten): gestrichelte Haarlinie in `--accent`.
  - Geisterhaft (ausstehend/abgelehnt/historisch): Haarlinie bei 35 % Deckkraft.
  - Ausgewählt/Ziel: ein zweiter Haarlinienring, 3px außerhalb des Knotens, in der
    Linienfarbe des Teilnehmenden — kein dicker 2px-Ring.
- Schaltflächen/Bedienelemente innerhalb von Szenen: abstrakte Auslöser (ein kleiner haarfeiner Kreis oder
  abgerundete Kontur mit einer 11px-Beschriftung), niemals eine gefüllte UI-Schaltfläche.
- Kanten: haarfeine 0.75px-Kurven; Einzeichnen über stroke-dashoffset.
- Cursor: Identität über **Form + Beschriftung**, nie allein über Farbe. Als haarfeine
  Konturen gezeichnet, nicht als gefüllte Flächen.
  - Menschen: klassische Pfeilkontur, Linie `--text`; zweiter Mensch `--text-muted`.
  - Agenten: kleine umrandete Raute/abgerundete Markierung, Linie `--accent`.
- Beschriftungen/Markierungen: schlichter 10–11px-Text mit nichtproportionaler Schrift in `--text-dim`, kein Hintergrund, kein Rand —
  Text schwebt nahe seinem Besitzer. (Die Gestaltung als kbd-Markierung gehört zum Artikeltext,
  nicht zur Zeichenfläche.)
- Absichts-Kennzeichnungen: gleiche Gestaltung als schwebender Text, `--text-muted`, erscheinen 200ms vor
  der Aktion, die sie ankündigen.
- Aktivitätsprotokoll: 10px-Zeilen mit nichtproportionaler Schrift, `--text-dim`, unterer Streifen, kein Hintergrund.
- Fortschritt/Impulse: dünne haarfeine Bögen und sich ausdehnende haarfeine Kreise; `--accent`
  ist ausschließlich für Agent-Aktivität reserviert.
- Schärfe: Haarlinien müssen klar, nicht blass und unscharf gerendert werden. Eher leicht
  dunklere statt dickere Linien verwenden (die Struktur darf von `--border-strong`
  in Richtung `--text-dim` gehen, wenn Bildschirmaufnahmen ausgewaschen wirken), Text in ganzen Pixel-
  größen halten und Transformationen vermeiden, die Elemente im Ruhezustand auf Teilpixeln platzieren.
  Zurückhaltung bedeutet wenige Elemente, nicht niedrigen Kontrast.

### Dunkle Zeichenflächen-Variante (experimentell — zum Vergleich)

Auf die Zeichenfläche begrenztes dunkles Farbschema (die Artikelseite selbst bleibt hell):

```css
--canvas-bg-dark:        #0f0f14;
--canvas-surface-dark:   #1a1a20;
--canvas-stroke-dark:    #3a3a44;  /* Haarlinien der Struktur */
--canvas-stroke-strong:  #8a8a96;  /* aktiv/hervorgehoben */
--canvas-text-dark:      #a0a0ab;  /* Beschriftungen */
--accent:                #5e6ad2;  /* unverändert; auf dunklem Grund gut lesbar */
```

Gleiche Regeln wie für hell: Haarlinien, keine Füllungen, Violett nur für Agenten. Weiße/beinahe weiße
Linien auf beinahe schwarzem Grund sollten sparsam eingesetzt werden (Referenzoptik: dunkle Objekte,
haarfeine helle Kanten).

## 5b. Vertrag zwischen Prosa und Animation

Die Prosa darf die Animationen NICHT nacherzählen („In der Animation unten erscheint ein Cursor
…“). Szenen sprechen für sich; die Bildunterschrift (eine Zeile) benennt, was die
Lesenden sehen; die Prosa führt die Argumentation anhand des durchgehenden Beispiels und funktioniert
eigenständig für Lesende mit reduzierter Bewegung. Eine Takt-für-Takt-Szenenbeschreibung steht ausschließlich in
animations.md.

## 6. Bewegungsregeln

- Ease-in-out für alles; Cursorbewegungen erhalten leichte natürliche Bögen.
- 180–350ms für kleine Benutzeroberflächen-Übergänge; 500–900ms für Cursorbewegungen; Schlüsselzustände 800–1500ms halten.
- Kein Überschwingen durch Federn, Hüpfen, Schütteln oder zelebrierende Effekte.
- Schleifen: 6–18s mit einem Ruhezustand vor einem sanften Ausblenden/Zurücksetzen — niemals ein harter Sprung.
- `prefers-reduced-motion` berücksichtigen: einen repräsentativen Endzustand oder stufenweises Ausblenden zeigen.
- Szenen außerhalb des Sichtbereichs pausieren.

## 7. Was tun / Was vermeiden

**Tun:** Violett als Satzzeichen; 1px-Ränder; dichte, präzise Diagramme; Markierungen im kbd-Stil;
großzügiger Weißraum zwischen Artikelabschnitten.

**Vermeiden:** Karten mit Schatten; mehrfarbige Paletten; stark pillenförmige Elemente; piktogrammlastige Visuals;
Aufmacher-Illustrationen; Verläufe; eine zweite Akzentfarbe; Radius > 8px.
