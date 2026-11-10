---
titel: Dauerthemen
datum: 2026-11-10
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Dauerthemen – 10. November 2026

Der Betreiber: „bei den Nachrichten lasse ich die Sachen nicht immer doppeln
… es kam jetzt schon öfters dran mit EZB-Spitze, wer da wen vorschlägt …
Oder Öl. Hin und her. Das kann man schon drin lassen, aber vielleicht dann
immer auf die letzte Seite packen. Und wenn es dann nichts wirklich Neues
gibt, dann muss man das ja auch nicht täglich mit reinnehmen."

**Warum „Nichts doppelt" das nicht fing.** `wiederholungen()` vergleicht
Überschriften Wort für Wort, Grenze ein Drittel. „EZB-Nachfolge:
Finanzminister drängen auf schnelle Entscheidung" gegen „EZB-Nachfolge:
Spanien nominiert Hernández de Cos" liegt bei 0,18 – so hoch wie viele
verschiedene Themen. Die Grenze zu senken hätte Dutzende Fehlgriffe gebracht.
Ein Dauerthema erkennt man nicht an der Überschrift, sondern am **Namen**,
der immer wiederkommt.

**Die Regel.** Ein Name (wie in `themenwoerter()` von `lib/instagram-plan.ts`:
Länder, Firmen, Institutionen), der an **mindestens zwei** der letzten sieben
Erscheinungstage in einer Überschrift stand, macht die Meldung zum
Dauerthema. Höchstens eins je Ausgabe, und das auf dem **letzten Platz**
(`dauerthemen()` in `lib/nachrichten-wiederholung.ts`, Riegel in
`scripts/nachrichten-erzeugen.ts`). Auf Instagram darf ein Thema der letzten
drei Tage nur noch auf die **letzte Kachel** (`themaWiederholt()`); vorher
war es ganz verboten. Ob es „wirklich Neues" ist, entscheidet der Agent –
die Prüfung sieht nur den Namen.

**Gemessen am Bestand 01.10.–10.11.2026.** Mit zwei Tagen trifft es EZB
(fünfmal seit 30.10.), Fed, Frankreich, Binance, Iran, China, Anfang Oktober
Öl, Gold und Silber fast täglich. Mit einem Tag wären es zwei bis vier
Meldungen täglich gewesen, darunter Microsoft vor und nach seinen Zahlen –
zwei Ereignisse. Fehlgriffe, als Nicht-Themen eingetragen: „Tage", „Linie"
(200-Tage-Linie), „Tag", „Druck", „Reden", „Angriff", „Wall Street",
„Erwartungen", „Marke", „Stellen", „Ökonomen". Der Prüfstein im Test ist die
Ausgabe vom 10.11.: erkannt wird die EZB-Nachfolge, und nur sie.

Der Agenten-Prompt stand bei 20.756 von 20.800 Bytes; die Regel kam als
gekürzter Satz hinein (20.719), den Rest erklärt die Meldung der Probe.
