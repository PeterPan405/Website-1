---
titel: Der Kalender liest ForexFactory
datum: 2026-10-16
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Kalender liest ForexFactory – 16. Oktober 2026

Auftrag des Betreibers: „Kalender ausbauen mit Daten von ForexFactory".
Bis dahin standen Konjunkturdaten nur von Hand im Kalender, 18 in drei
Monaten.

**Die Quelle** ist der Export, den ForexFactory selbst anbietet:
`nfs.faireconomy.media/ff_calendar_thisweek.json`. Am 16.10.2026 von einem
Läufer geholt: 111 Einträge der laufenden Woche mit Uhrzeit (New Yorker
Zeit mit Versatz), Einstufung, Prognose und Vorwert, aber ohne Ist-Wert.
Eine Folgewoche gibt es dort nicht (`…_nextweek.json` antwortet 404); der
Kalender reicht damit bis Samstag. Die Seite `forexfactory.com/calendar`
selbst liefert dem Läufer nur das Menü – gelesen wird der Export.

**Nicht alles kommt hinein.** Nur sechs Märkte, nur „High" und „Medium"
(aus Deutschland zusätzlich Inflation, Wachstum, Stimmung), und nur, wofür
eine Einordnung in `FAMILIEN` steht. `bedeutung` ist im Kalender Pflicht;
eine Zeile ohne Einordnung bekäme sonst eine erfundene. Was hoch eingestuft
ist, aber keine Familie hat, nennt der Abruf im Protokoll – so wächst die
Liste an dem, was wirklich vorkommt. In der ersten Woche griffen zwölf der
17 Familien; Zinsentscheid, PCE, US-Arbeitsmarktbericht und
Einkaufsmanager kamen nicht vor und sind nur am Muster geprüft.

**Nichts doppelt:** Steht ein Termin derselben Familie am selben Tag am
selben Ort schon von Hand drin, gewinnt der gepflegte – er hat die bessere
Einordnung.

**Die Uhrzeit wird gerechnet, nicht addiert.** New York und Berlin stellen
an verschiedenen Tagen um; in der letzten Oktoberwoche liegen fünf Stunden
dazwischen, sonst sechs. `inBerlin()` rechnet über die Zeitzone, der Test
prüft genau diese Woche. Mitternacht New Yorker Zeit heißt bei
ForexFactory „ganztägig" oder „noch offen" – dann steht keine Uhrzeit da.
