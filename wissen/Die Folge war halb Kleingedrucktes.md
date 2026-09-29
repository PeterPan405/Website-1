---
titel: Die Folge war halb Kleingedrucktes
datum: 2026-09-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Folge war halb Kleingedrucktes – 28. September 2026

Gemeldet vom Betreiber, am Morgen nach der Folge: „Der Podcast von heute ist
viel zu kurz, das Intro und die Aufklärung danach gehen genauso lange wie der
Podcast, das ist komisch."

Nachgerechnet an der Folge vom 28. September:

    Begrüßung    35 Wörter
    Hinweise     39 Wörter   ← KI-Hinweis und Rechtshinweis
    vier Meldungen 86 Wörter
    Abschied     29 Wörter
    ─────────────────────
    Gerüst      103 Wörter
    Meldungen    86 Wörter   ← 46 % der Folge

Er hatte nicht ungefähr recht, sondern auf das Wort: Das Kleingedruckte war
länger als die Nachrichten.

## Das Gerüst war nicht der Täter

Der erste Gedanke ist, am Gerüst zu kürzen. Er ist falsch, und das lässt sich
zeigen. Über alle 65 Folgen seit dem 25. Juli 2026 gemessen:

    Gerüst      min 103 · Median 109 · max 116 Wörter
    Anteil      min 15 % · Median 29 % · max 54 %

(Gemessen vor dem Zusammenziehen der Umschriften, das am selben Tag
dazukam – „Uh Ess“ zählte als zwei Wörter, „Juh-Ess“ zählt als eins.
Danach sind es 99 bis 110, Median 104. Die Grenze `GERUEST_WOERTER = 110`
ist der Höchstwert dieser Spanne: Die Meldungen sollen mehr wiegen als
das Gerüst an seinem längsten Tag.)

Das Gerüst ist fester Text – Gruß, Datum, `intro`, KI-Hinweis,
Rechtshinweis, Abschied – und war am schlechtesten Tag keine Zeile länger als
am besten. Gewachsen ist nichts; geschrumpft ist die Nachricht. Wer hier
kürzt, verliert Pflichtangaben und hat weiterhin eine kurze Folge.

Der Anteil von 54 % ist zudem ein Einzelfall: Der zweithöchste liegt bei
43 %, und über 50 % kommt in 65 Folgen sonst nie vor.

## Die Ursache stand in der Ausgabe, nicht in der Folge

Die Tagesausgabe vom 28. September hatte **vier** Meldungen. Der Tag hatte
**sechs** Artikel.

Das Material lag also vor. Es kam nur nicht in die Ausgabe – und gesprochen
wird ausschließlich, was in der Ausgabe steht. Ein Leser bekam sechs
Meldungen, ein Hörer vier.

Im Prompt steht seit jeher: „Die Tagesausgabe fasst dieselben Meldungen
zusammen." Geprüft hat das niemand. Geprüft wurde:

    artikel.length < 5                  → Abbruch   (die Website)
    top.length + further.length < 3     → Abbruch   (der Podcast)

Fünf für das Geschriebene, drei für das Gesprochene. Die Lücke dazwischen ist
genau das, was am 28. September durchfiel.

**Ein Satz im Prompt ist keine Regel, solange ihn kein Prüfer liest.** Das ist
dieselbe Lehre wie am Tag davor beim Satzrhythmus, wo sieben Wochen lang
„Kurze Hauptsätze, keine Schachtelsätze" dastand und nichts band.

## Zwei Zahlen, und woran sie gewählt sind

**Fünf Meldungen** (`MELDUNGEN_MIN` in `scripts/nachrichten-erzeugen.ts`).
Meldungen je Ausgabe über 65 Tage:

    unter fünf:  5 Tage   28.09. (4) · 27.09. (4) · 17.09. (3) ·
                          13.08. (4) · 02.08. (4)
    fünf:       18 Tage
    sechs+:     42 Tage

An vier dieser fünf Tage standen mehr Artikel als Meldungen bereit; die
Grenze hätte einen zweiten Anlauf verlangt, nicht einen Tag gekostet. Der
fünfte (02.08.) hatte selbst nur vier Artikel und wäre schon an der alten
Grenze gescheitert. Die neue verwirft damit **keinen** Tag, den die alte
durchgelassen hätte.

**110 Wörter `summary`** (`GERUEST_WOERTER`, ebenda). Die Summe aller
`summary`-Absätze, aufsteigend über 65 Ausgaben:

    79 · 130 · 159 · 159 · 162 · 162 · 167 · 178 · 184 · 188 · …
    Median 246, Höchstwert 529

Genau eine Ausgabe liegt darunter – die gemeldete. Zur zweitdünnsten sind es
51 Wörter Abstand. Die Zahl ist nicht gerundet, sondern abgelesen: So viel
wiegt das Gerüst an seinem längsten Tag, und mehr müssen die Meldungen
wiegen. Das ist der Satz des Betreibers, in eine Zahl übersetzt.

## Warum der Riegel vorn sitzt und die Warnung hinten

Zurückgewiesen wird beim **Entwurf**, in `scripts/nachrichten-erzeugen.ts`.
Dort ist noch nichts geschrieben, und `nachrichten-agent.yml` läuft um 02:33,
03:03 und 03:33; danach greift das Modell über die Schnittstelle. Ein
verworfener Entwurf kostet eine halbe Stunde, keine Ausgabe.

In `scripts/podcast-folge-erzeugen.ts` steht dieselbe Frage noch einmal, aber
nur als **Warnung** (`folgengewicht()` in `lib/sprechfassung.ts`). Dort ist
die Ausgabe längst geschrieben; eine dünne Folge zurückzuhalten hieße, gar
keine zu senden, und das ist der Tausch, den dieses Projekt nicht macht.

Die Warnung ist trotzdem kein Zierrat: Sie fängt den Fall, den die beiden
Zahlen vorn nicht sehen – eine Ausgabe, die den Riegel passiert und deren
Meldungen später gekürzt werden. `tests/sprechfassung.test.ts` legt ihr die
Folge vom 28. September nachgebaut vor; beanstanden muss sie sie.

---
