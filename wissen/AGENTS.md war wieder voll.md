---
titel: AGENTS.md war wieder voll
datum: 2026-09-05
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# AGENTS.md war wieder voll – 5. September 2026

Die Datei stand bei **23.978 von 24.000 Zeichen**. Zweiundzwanzig Zeichen
Luft; das nächste dort ergänzte Wort hätte `tests/agents-md.test.ts` rot
gemacht – und weil `nachrichten.yml` vor dem Veröffentlichen `npm test` laufen
lässt, hätte es die **Tagesausgabe** aufgehalten. Genau so ist die
Sechs-Uhr-Zusage am 4. und 5. September gerissen, damals wegen
`tests/quartalstermine.test.ts`.

Aufgefallen ist es beim Versuch, eine einzige Regel zu ergänzen: dass diese
Umgebung nicht immer eingesperrt ist. Der Test wies sie ab, mit genau der
richtigen Frage – „gehört die Ergänzung in die Regeln, oder ist sie eine
Begründung?"

## Was entfernt wurde, und wohin

Der Test hatte recht: Nach der Trennung im August lag `AGENTS.md` bei gut
16.000 Zeichen. Der Zuwachs auf 23.978 war nicht neue Regel, sondern
zurückgekehrte Begründung – jeder Vorfall bringt den Wunsch mit, die
Vorgeschichte gleich danebenzuschreiben.

Entfernt wurden acht Vorfallsbelege, deren Regel ohne sie vollständig bleibt
und deren Inhalt hier bereits steht: die 41 Standardwerte im Sammelkalender,
das Datum der `TarifSperre`, der Fund des Sammelkalenders, die 2.600 Hz der
Störgeräuschprüfung, die zwei Anordnungsdaten des Betreibers, der eine
`kurse.yml`-Lauf zwischen 00:00 und 04:20 UTC, der 28. August beim
Dauerlauf-Wächter und das Abschaffungsdatum des Notbehelfs.

**Ein Beleg stand hier noch nicht** und wird deshalb nachgetragen: Am 23. August 2026 ließ `npm run pruefen` **vier Überschriftensprünge** glatt
durch und meldete grün, weil es `out/` liest – also den letzten Bau und nicht
die Änderung. Die CI fand sie danach. Das ist der Fall zur Lehre
„`npm run pruefen` liest `out/`, nicht deine Änderung".

## Was daraus folgt

**Die Datumsangaben in `AGENTS.md` sind der häufigste Zuwachs.** Ein Datum in
einer Regel beantwortet die Frage „seit wann gilt das?" – aber die stellt beim
Arbeiten niemand, und für „warum gilt das?" gibt es diese Datei. Wer eine
Regel notiert, lässt das Datum hier; wer eines in `AGENTS.md` findet, darf es
streichen, sobald der Fall hier steht.

Die Datei hat nach dem Aufräumen wieder rund 400 Zeichen Luft. Das ist kein
Polster für ein Jahr – es ist Platz für zwei, drei Regeln. Wer mehr braucht,
räumt weiter auf, statt die Grenze anzuheben: Sie ist nicht der Gegner,
sondern das Einzige, was die Trennung am Leben hält.
