---
titel: Die Regel galt für zwei von drei Wegen
datum: 2026-10-01
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Regel galt für zwei von drei Wegen – 1. Oktober 2026

Gefragt hat der Betreiber: „Wurde mittlerweile alles in der Webseite richtig
vertont? Ohne Sprachfehler. Und richtige Aussprache. Auch alles lückenlos."

Drei Fragen, drei verschiedene Antworten.

## Lückenlos – ja, bei den Lernseiten

Nachgezählt gegen `data/lese-audio.json`:

    172 Aufgaben, 172 Aufnahmen
    ohne Aufnahme            0
    veralteter Fingerabdruck 0
    verwaiste Aufnahme       0
    Seiten mit weniger Marken als Abschnitten   0

Die letzte Zeile ist die interessante. `lese-stimme-erzeugen.py` überspringt
ein Stück, das sich nicht sprechen lässt, und kostet damit den Satz statt der
Seite – das war am 10. August 2026 ausdrücklich so entschieden. Wäre das
passiert, hätte die Seite weniger Kapitelmarken als Abschnitte. Hat keine.

Nebenbei korrigiert: In `AGENTS.md` stand „12 von 172 Seiten sind gesprochen".
Diese Zahl ist seit dem 25. September falsch – an jenem Tag hat der Lauf alle
172 gesprochen und dabei den Paketbau gesprengt, weil das Kopieren von 280
Megabyte abgeschossen wurde. Der Befund wurde behoben, die Zahl daneben nicht.

## Lückenlos – nein, beim Podcast

    68 Tagesausgaben     25.07. bis 01.10.
    59 Folgen            30.07. bis 01.10.
    64 Tage seit der ersten Folge – 5 davon ohne Folge:
       01.08. · 02.08. · 08.08. · 09.08. · 21.08.

An diesen fünf Tagen steht eine Tagesausgabe auf der Website und es gibt keine
Folge dazu. Das sind die Tage, an denen der Vertonungslauf scheiterte, bevor
die Kette die Form von heute hatte. **Nachgeholt wird hier nichts von selbst:**
Der Lauf fragt immer nur den heutigen Tag.

Ob zwei Monate alte Nachrichten noch vertont gehören, ist keine technische
Frage – das entscheidet der Betreiber. Vermerkt ist es, damit die Lücke nicht
als Zufall durchgeht.

## Richtige Aussprache – nein, und zwar grundsätzlich

`AGENTS.md` führt die Regel unter der Überschrift „Stimme, Podcast **und
Vorlesefassungen**":

> **Was englisch ist, wird englisch gesprochen** – `ENGLISCHE_NAMEN`, zuerst
> angewandt.

Sie galt für zwei der drei dort genannten Wege. `lib/vorlese-text.ts`
importierte aus `sprechfassung.ts` **nur** `ordnungszahlenSprechbar` – nicht
`englischeNamenSprechbar`, nicht `sprechbar`. Die Umschrifttabelle hat den
Vorlesetext nie berührt.

Nachgezählt an allen 172 Seiten: **28 der 148 Muster treffen, an 219 Stellen.**

    92 ×  Spread          9 ×  Carry          3 ×  Cash
    37 ×  US              9 ×  Software       3 ×  Performance
    15 ×  Cashflow        4 ×  Hardware       2 ×  Bank of England
    14 ×  Value           …                   2 ×  Dow Jones
    10 ×  Bitcoin

„Value" wurde als /ˈvaluə/ gelesen, „Cashflow" deutsch, „US" als Silbe – und
das 219-mal, auf 71 von 172 Seiten, in 607 von 1.333 Minuten Aufnahme.

## Warum die Begründung dagegen nicht trug

Im Quelltext stand, weiter gehe die Umschrift „bewusst nicht": Zahlen blieben
Zahlen, denn eine Lernseite zeige „26.364,45" auch, und ein Text, der Ziffern
in Wörter tauscht, wäre „für das Auge unbrauchbar".

Das erste Argument trägt und bleibt – Zahlen werden weiter nicht
ausgeschrieben. Das zweite trägt **überhaupt nicht**, und zwar aus einem Grund,
der sich nachsehen lässt: **Dieser Text bekommt kein Auge zu sehen.**
`vorleseAbschnitte()` geht an genau zwei Stellen hin – in
`SpeechSynthesisUtterance` (`components/ui/Vorlesen.tsx`, Zeile 174) und in die
Arbeitsliste des Sprechlaufs. Angezeigt wird davon nichts außer „Abschnitt 12
von 40". Ob dort „Value" oder „Wällju" steht, sieht niemand; gehört wird es von
jedem.

Eine Begründung, die für einen Teil des Falls gilt und als Ganzes gelesen wird,
ist dieselbe Falle wie eine Regel, die nur an zwei von drei Stellen greift.

## Was das in Gang setzt

Die Umschrift ändert den Fingerabdruck von **71 der 172 Seiten**. Damit nimmt
sich `lese-stimme.yml` sie in seiner eigenen Reihenfolge wieder vor – Beginner
zuerst, dann die Akademie –, mit 240 Minuten Rechenzeit je Nacht. 607 Minuten
Audio bei einem Echtzeitfaktor um 0,08 sind rund 800 Läuferstunden; verteilt
auf die nächtlichen Läufe dauert das Wochen.

**Ein Loch entsteht dabei nicht.** Die alte Aufnahme bleibt liegen, bis eine
neue daneben steht: Der Lauf schreibt die Datei erst nach dem Sprechen, und
der Paketbau kopiert seit dem 25. September mit `cp -au` statt `rm -rf` plus
`cp -a`. Wer in der Zwischenzeit eine noch nicht neu gesprochene Seite anhört,
hört die alte Fassung – nicht Stille.

## Was offen bleibt, und ehrlich offen

**Falle 1 der deutschen Rechtschreibung.** „Spread" wird zu „Spredd" und damit
/ʃprɛt/ gesprochen; „sp" am Wortanfang ist im Deutschen /ʃp/, und dagegen hilft
nur Zusammenschreiben mit einem Wort davor, das es hier nicht gibt. Der Vokal
wird richtig, der Anlaut bleibt falsch – bei 92 der 219 Stellen. Dasselbe gilt
für „Spin-off" → „Spinnof".

Das ist keine neue Erkenntnis, sondern dieselbe, die bei `ENGLISCHE_NAMEN`
unter „Was offen bleibt" für „Stoxx Europe" steht. Sie wird hier nicht zum
zweiten Mal gelöst, sondern zum zweiten Mal benannt.

**Und die 56 Folgen.** Von 59 veröffentlichten Podcastfolgen tragen 56 die
Aussprache von vor dem 29. September. Eine Aufnahme wird nicht nachträglich
richtig: Sie müsste neu gesprochen werden, und das braucht eine erhöhte
`fassung` – „überall eine neue Folge". Richtig gesprochen sind die Folgen vom 29. September an.

---
