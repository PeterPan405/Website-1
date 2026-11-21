---
titel: Ein Name der letzten drei Tage gehört nach hinten
datum: 2026-11-21
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Ein Name der letzten drei Tage gehört nach hinten – 21. November 2026

**Anlass.** Am 20.11. stand „IG Metall startet Warnstreiks gegen
VW-Sparplan" in der Ausgabe, am 21.11. „IG Metall weitet Warnstreiks aus:
150.000 im 24-Stunden-Streik" als Top-Meldung. Der Betreiber: „die news
doppeln sich schon wieder mit denen der letzten tage zb warnstreik … wenn
sich was doppelt … dann nach hinten, wenn es überhaupt relevant ist, sonst
einfach etwas anderes interessantes finden."

**Warum keine Prüfung anschlug.** Drei Lücken auf einmal:

- `wiederholungen()` misst Wortüberschneidung: 0,25, unter einem Drittel.
- `dauerthemen()` verlangt zwei Vortage; IG Metall stand an einem.
- Beide sahen nur `data/news.ts` – die Artikelüberschrift lautete
  „150.000 Beschäftigte legen für 24 Stunden die Arbeit nieder" und trägt
  **keinen Namen**. „IG Metall" stand nur in der Schlagzeile der
  Tagesausgabe, also genau in dem, was im Karussell zu sehen war.

**Was jetzt gilt.** `themenDerLetztenTage()` vergleicht je Stelle
Artikelüberschrift **und** Schlagzeile mit allen Überschriften und
Schlagzeilen der letzten `NACHGANG_TAGE = 3` Erscheinungstage, über die
Namen aus `lib/instagram-plan.ts` – dieselbe Spanne wie
`themaWiederholt()` bei Instagram. Höchstens eine solche Stelle, und nur
die letzte; sonst weist `pruefe()` die Ausgabe zurück. Ob die Meldung
überhaupt etwas Neues bringt, kann die Prüfung nicht wissen – das sagt die
Anweisung, in **beiden** Prompts. `ueberschriften-woche.ts` zeigt dem
Agenten jetzt auch die Schlagzeilen, damit er gegen dieselbe Liste plant,
gegen die geprüft wird.

**Gemessen** über Überschriften und Schlagzeilen vom 23.10. bis 21.11.2026:
Ohne Nicht-Themen hätten „seit fünf Jahren", „Jahreshoch", „Ausfall",
„Agenten", „Vorstand", „Bundesregierung" verschiedene Themen verbunden; sie
stehen jetzt in `KEIN_THEMA`. Was bleibt, sind echte Wiederholungen –
Nvidia 16.–18.11., Fed und Commerzbank 17./19.11., Anthropic 14./19./20.11.,
IG Metall 20./21.11. An etwa jedem vierten Tag stand mehr als eine in der
Ausgabe; das sind die Tage, an denen der Agent jetzt ersetzen muss.

**Prüfstein** in `tests/nachrichten-wiederholung.test.ts`: die Ausgabe vom
21.11. gegen den Bestand – IG Metall vorn wird zurückgewiesen, die
Artikelüberschrift allein hätte es nicht gefunden, und dieselbe Meldung
auf dem letzten Platz neben neuen Themen geht durch.
