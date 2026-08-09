# Prüfbericht Inhalte — 9. August 2026

Geprüft im Auftrag des Betreibers. Erstellt in der Nacht vom 8. auf den 9. August 2026, Stand `main` = `6e580ca`.

## Was diese Prüfung leisten konnte — und was nicht

**Von dieser Umgebung aus ist nur GitHub erreichbar.** Jede externe Adresse
scheitert am Egress-Proxy (`CONNECT tunnel failed, response 403`) — destatis,
Bundesfinanzministerium, EZB, Yahoo, jedes Nachrichtenportal. Der Auftrag
verlangte, „jede Zahl gegen eine verlässliche Quelle zu prüfen und die Quelle
im Bericht zu nennen“. Das war in dieser Nacht **nicht durchgängig möglich**.

Daraus folgt die Gliederung dieses Berichts, und sie ist die wichtigste
Information darin:

| Klasse                       | Bedeutung                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **A — belegt**               | Im Repository selbst nachgewiesen: gemessen, nachgerechnet oder ein innerer Widerspruch. Kein Fremdbeleg nötig. |
| **B — begründeter Verdacht** | Aus Fachkenntnis auffällig, aber **ohne Quellenbeleg**. Vor einer Korrektur nachschlagen.                       |
| **C — offen**                | Konnte gar nicht geprüft werden. Steht hier, damit die Lücke sichtbar bleibt.                                   |

Ein Befund der Klasse B ist **keine Feststellung**. Wer ihn ohne Nachschlagen
übernimmt, tauscht einen möglichen Fehler gegen einen sicheren.

Für Klasse C gibt es einen Weg, den diese Nacht nicht mehr hergab:
`.github/workflows/quellen-holen.yml` holt Adressen auf einem Läufer und legt
den Text ins Protokoll. Der neue Turnus (siehe unten) nutzt ihn.

---

## Behoben — Klasse A

### A1 · „Heute vor 2 Jahren“ behauptete Tagesverluste, die Wochenverluste waren

**kritisch** · `lib/boersengeschichte.ts`, `app/page.tsx`

Der gemeldete Fehler ist echt, aber die Ursache ist eine andere als vermutet:
Die Zahl ist **nicht getippt**, sie wird aus den Kursreihen gerechnet. Ein
Zahlendreher war es also nie — es war ein Datenfehler mit Breitenwirkung.

Die Fünfjahresreihen sind nicht gleichmäßig dicht. Nachgezählt über die acht
Leitwerte der Startseite:

```
Lücke 1–3 Tage   2.271 Paare   jüngerer Teil, echte Handelstage
Lücke 7 Tage     1.372 Paare   älterer Teil, nur Wochenwerte
```

Wer zwei Jahre zurückblickt, landet im wöchentlichen Teil. `punkte[index - 1]`
liegt dort **sieben Tage** zurück, und der Satz „an einem einzigen
Handelstag“ stand über einer Wochenbewegung.

Beim Nikkei 225 am 5. August 2024 heißt das konkret:

|                                             | Wert                                |
| ------------------------------------------- | ----------------------------------- |
| Schlussstand 05.08.2024 (im Bestand, Yahoo) | 31.458,42 ✓                         |
| Vorheriger Punkt der Reihe                  | **29.07.2024**, nicht der 02.08.    |
| Daraus gerechnet                            | −18,2 %                             |
| Tatsächlicher Tagesverlust                  | rund −12,4 % _(Klasse B, siehe B1)_ |

Der vorhandene `HOECHSTABSTAND_TAGE` half nicht: Er bewacht den Abstand zum
**Jahrestag**, nicht den zum Vorpunkt. Der Test von damals nannte die Gefahr
sogar beim Namen — „sonst würde ein Wochenschluss als Tagesbewegung
ausgegeben“ — und maß trotzdem die falsche Strecke.

**Behoben:** Die Spanne wird aus den Daten übernommen (`spanneTage`). Bis vier
Kalendertage heißt es „an einem einzigen Handelstag“ (Freitag → Montag), sonst
„binnen einer Woche“. Ein echter Tagesausschlag schlägt in der Rangfolge jede
größere Wochenbewegung — sonst zeigte die Kachel dauerhaft Wochenwerte, weil
die betragsmäßig fast immer gewinnen.

Wirkung am echten Bestand:

```
vorher    Heute vor 2 Jahren · Bitcoin fiel an einem einzigen Handelstag um 19,2 %
nachher   Heute vor einem Jahr · Nikkei 225 stieg an einem einzigen Handelstag um 1,9 %
```

Weniger dramatisch, aber wahr. Fünf neue Prüfungen in
`tests/boersengeschichte.test.ts` halten es fest.

### A2 · Die Überschrift sagte „heute“, das Ereignis lag drei Tage daneben

**mittel** · `lib/boersengeschichte.ts`, `app/page.tsx`

Auch das stimmt wie gemeldet. Der Kasten sucht den nächstgelegenen Handelstag
im Umkreis von drei Tagen; am 8. August fand er den 5. August. Die Überschrift
behauptete trotzdem „Heute vor 2 Jahren“.

**Behoben:** `geschichtsvorspann()` sagt „Heute vor …“ nur, wenn der gefundene
Tag wirklich der Jahrestag ist (`abstandTage === 0`), sonst „Vor …“.

Nebenbei beseitigt: Überschrift und Satz begannen beide mit „Heute vor X
Jahren“ — der Vorspann stand doppelt.

### A3 · Der KI-Hinweis fehlte oder war überholt — auf **allen** sieben Folgen

**kritisch (rechtlich)** · `data/podcast-eigener-feed.json`

Der Verdacht zu Folge 1 trifft zu, und er reicht weiter:

| Folge          | Stand vorher                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2–7            | „Die **Stimme** wurde mit künstlicher Intelligenz erzeugt. Auswahl, Text und Einordnung stammen von IM Invests.“ |
| 1 (30.07.2026) | **gar kein KI-Hinweis**                                                                                          |

Der alte Wortlaut ist nicht nur veraltet, er ist **inhaltlich unzutreffend
geworden**: Er sagt zu, Text und Einordnung stammten vom Betreiber. Seit der
Entwurf vom Modell kommt, gilt das so nicht mehr.

**Behoben:** Alle sieben Folgen tragen jetzt den vom Betreiber festgelegten
Wortlaut. Kontrolle: 7 von 7 mit neuem Hinweis, 0 mit altem.

> **Nicht behoben und außerhalb des Repositories:** Die Beschreibungen bei
> **YouTube und Spotify** wurden beim Hochladen von Hand gesetzt und tragen
> weiterhin den alten Text. Sie müssen dort nachgezogen werden — sieben
> Beschreibungen. Das ist Handarbeit in den jeweiligen Oberflächen.

### A3b · Der neue KI-Hinweis sagt etwas zu, was die Technik nicht einhält

**kritisch (rechtlich)** · `lib/sprechfassung.ts:373` · **nicht behoben, weil
es eine Entscheidung des Betreibers ist**

Der Wortlaut, den der Betreiber festgelegt hat, enthält diesen Halbsatz:

> „… und werden **vor der Veröffentlichung von einem Menschen inhaltlich
> geprüft**; die redaktionelle Verantwortung liegt beim Betreiber.“

Ab dem 9. August veröffentlicht `podcast-erzeugen.yml` um 4:53 Uhr ohne Halt:
Text, Stimme, Video, YouTube, Server. Die Folge ist gegen 5:36 Uhr online.
**Zwischen Erzeugung und Veröffentlichung steht kein Mensch.**

Der Satz ist damit im Regelbetrieb unzutreffend — und ein unzutreffender
Hinweis ist schlechter als keiner: Er beschreibt ein Verfahren, das es nicht
gibt, und genau darauf würde man sich im Streitfall berufen.

Bemerkenswert: **Der Code weiß es.** Direkt über der Konstante steht seit dem 8. August:

> „**Der Satz enthält eine Zusage, die die Technik nicht einhalten kann.** […]
> Wer den Satz stehen lässt, muss die Folge morgens tatsächlich vor der
> Freigabe lesen – oder den Halbsatz streichen.“

Drei Wege, und alle drei sind vertretbar:

1. **Halbsatz streichen** — „… entstehen mit Unterstützung von KI-Werkzeugen;
   die redaktionelle Verantwortung liegt beim Betreiber.“ Bleibt wahr, ohne
   etwas aufzugeben.
2. **Auf Stichproben umstellen** — „… werden regelmäßig stichprobenartig
   geprüft“, wenn das tatsächlich geschieht.
3. **Freigabe einbauen** — die Folge wartet, bis der Betreiber sie freigibt.
   Kostet die 6-Uhr-Zusage.

Ich habe **nichts geändert**: Der Wortlaut ist eine ausdrückliche Vorgabe des
Betreibers, und eine rechtliche Erklärung umzuformulieren ist keine Reparatur,
die man nachts nebenbei vornimmt.

### A4 · 1987 im Crash-Datensatz widerspricht seiner eigenen Definition

**mittel** · `data/crashes.ts:52`

Das Feld ist im selben File definiert als „Rückgang vom **Höchststand bis zum
Tiefpunkt**, in Prozent“, die Werte folgen „breiten US-Indizes ohne
Dividenden“.

```
{ name: '1987', rueckgangProzent: 20, erholungJahre: 2 }
```

20 Prozent ist der **Tagesverlust** des 19. Oktober 1987, nicht der Rückgang
bis zum Tief. Der Kopfkommentar mischt beides sogar selbst: „1987 war der
**Tagesverlust** dramatisch“. Unter der dokumentierten Definition gehört dort
eine Zahl um 34, unter der Tagesverlust-Lesart eine um 23.

**Nicht geändert** — welche der beiden Lesarten gemeint ist, ist eine
inhaltliche Entscheidung des Betreibers, keine Reparatur. Siehe B2 für die
Zahlen, die zu belegen wären.

### A5 · Eine Zahl im Fließtext ist um den Faktor neun daneben

**kosmetisch** · `scripts/kurse-abrufen.ts:276`

```
steht „120 Instrumente“, tatsächlich sind es 1075
```

Gefunden von `npm run frische`, das es längst gibt. Betrifft einen Kommentar
im Skript, keine Seite. **Nicht geändert**, weil derselbe Lauf ihn künftig
meldet (siehe Turnus) — er ist der Beleg dafür, dass die Prüfung greift.

---

## Belegt, aber nicht von mir zu entscheiden — Klasse A

### A6 · Der Basiszins für die Vorabpauschale ist ein Jahr alt — **behoben am 9. August**

**kritisch** · `data/stichtagswerte.ts:61`

```
basiszins: 2,53 %   gilt: 2025   turnus: jaehrlich
```

Es ist August 2026. Das Bundesfinanzministerium veröffentlicht den Wert jeweils
im Januar. Der Steuerrechner rechnet damit seit sieben Monaten mit dem Zins des
Vorjahres.

Der Wert für 2025 (2,53 %) ist korrekt. Der für 2026 ließ sich in der Nacht
nicht beschaffen — er steht **nur in der PDF** des BMF-Schreibens, und
`quellen-holen.yml` konnte damals keine PDFs lesen.

**Am 9. August nachgetragen:** 3,20 % für 2026, wörtlich aus dem BMF-Schreiben
vom 13. Januar 2026 (GZ IV C 1 - S 1980/00230/012/001). `npm run frische`
meldet seither „Alle Werte gelten für 2026." Der Läufer liest jetzt PDFs;
das war die eigentliche Lücke.

Bemerkenswert: Das Projekt **weiß es bereits**. `npm run frische` meldet es
wortgenau, samt Pflegehinweis. Nur läuft die Prüfung nirgends automatisch —
das ist der eigentliche Befund, siehe unten.

### A7 · Der Kostenrechner hat für keinen einzigen ETF die laufenden Kosten

**kritisch** · gemeldet von `npm run frische`

```
Laufende Kosten der ETFs: 0 von 8 hinterlegt.
```

Alle acht ETFs des Katalogs — MSCI World, FTSE All-World, S&P 500, EM IMI, DAX,
Stoxx 600, World Small Cap, Geldmarkt — stehen ohne TER. Ein Kostenrechner ohne
Kostendaten ist der Kern der Sache, nicht ein Randfall.

Die ISINs sind hinterlegt, es fehlen nur die Werte. **Klasse C** für die Zahlen
selbst, siehe C2.

**Am 9. August versucht und bewusst nicht eingetragen.** fondsweb.com ist
abrufbar und nennt unter „Summe laufende Kosten" Werte, die systematisch über
der TER des Anbieters liegen — null bis vier Hundertstel, immer in dieselbe
Richtung. Das ist eine andere Größe, keine Rundung. Das
Basisinformationsblatt des Anbieters antwortet mit `text/html` statt mit der
PDF, weil iShares die Anlegertyp-Abfrage davorschiebt. Der Befund samt
Messwerten steht im Kopf von `data/etf-kosten.ts`.

---

## Begründeter Verdacht — Klasse B

**Diese Punkte sind nicht belegt.** Sie stammen aus Fachkenntnis, nicht aus
einer geprüften Quelle. Vor jeder Korrektur nachschlagen.

### B1 · Der Nikkei-Tagesverlust vom 5. August 2024

Die im Auftrag genannten Werte — −12,4 Prozent, minus 4.451,28 Punkte auf
31.458,42, größter Tagesverlust seit 1987, Zweitagesverlust 18,2 Prozent —
decken sich mit meiner Kenntnis, und der **Schlussstand 31.458,42 ist im
Bestand belegt**. Der Vergleichswert des Vortags (2. August 2024) fehlt in der
Reihe; die Prozentzahl selbst ist damit **nicht aus dem Repository
nachweisbar**.

Für A1 spielt das keine Rolle mehr: Die Kachel nennt jetzt die Spanne, die die
Daten hergeben, statt eine Zahl zu behaupten.

### B2 · Zwei weitere Werte im Crash-Datensatz wirken niedrig

| Eintrag          | steht | üblich genannt                           |
| ---------------- | ----- | ---------------------------------------- |
| 1929             | 85 %  | rund 86 % (S&P/Cowles) bis 89 % (Dow)    |
| Finanzkrise 2008 | 50 %  | rund 57 % (S&P 500, Okt 2007 → Mär 2009) |
| Dotcom 2000      | 50 %  | rund 49 % (S&P 500) — passt              |
| Pandemie 2020    | 34 %  | rund 34 % — passt                        |

Der Kopfkommentar nennt die Werte ausdrücklich „Größenordnungen, keine
Messwerte“ und begründet, warum eine Nachkommastelle dort eine Lüge wäre. Unter
diesem Maßstab ist 1929 mit 85 vertretbar; **2008 mit 50 statt 57 liegt am
Rand**, weil sieben Punkte mehr als Rundung sind.

### B3 · Steuerliche Angaben — geprüft, soweit von hier möglich

Der Rechenkern in `lib/kapitalertragsteuer.ts` ist **fachlich sauber** und
stimmt mit der auf der Seite angegebenen Methodik überein:

|                              | im Code                                                                   | Bewertung                                    |
| ---------------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| Abgeltungsteuer              | 25 %                                                                      | stimmt                                       |
| Solidaritätszuschlag         | 5,5 % auf die Steuer                                                      | stimmt                                       |
| Sparerpauschbetrag           | 1.000 / 2.000 €                                                           | stimmt (seit 2023)                           |
| Teilfreistellung Aktienfonds | 30 %                                                                      | stimmt                                       |
| Teilfreistellung Mischfonds  | 15 %                                                                      | stimmt                                       |
| Teilfreistellung Immobilien  | 60 % / 80 % Ausland                                                       | stimmt                                       |
| Kirchensteuer                | `/ (4 + k)`                                                               | stimmt — die korrekte Formel, nicht `× 0,25` |
| Vorabpauschale               | Wert × Basiszins × 0,7, gedeckelt auf den Wertzuwachs, minus Ausschüttung | stimmt, § 18 InvStG                          |

Der Code kommentiert die Kirchensteuer-Formel sogar mit dem Grund, warum sie
nicht `× 0,25` lautet. Das ist die Stelle, an der die meisten Rechner im Netz
falsch liegen.

**Einziger Mangel ist der veraltete Basiszins (A6)** — nicht die Logik.

### B4 · Fachliche Definitionen

Stichprobe an den im Auftrag genannten Begriffen. Der Nikkei-Text
(`data/markets.ts:586`) beschreibt die Preisgewichtung korrekt, nennt den TOPIX
als fachlich besseres Maß und trennt sauber zwischen Indexstand und
Euro-Rendite. Das ist überdurchschnittlich sorgfältig.

Eine **systematische** Prüfung aller Definitionen — Performance- gegen
Kursindex, Gewichtungsmethoden, Rückkauf gegen Dividende, FFO, Book-to-Bill,
KUV — war in dieser Nacht nicht zu leisten. Sie gehört in den Vier-Wochen-Takt
des neuen Turnus. **Klasse C.**

---

## Nicht geprüft — Klasse C

|            | Was fehlt                                                          | Warum                                                                         | Wer kann es               |
| ---------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------- |
| ~~**C1**~~ | ~~Basiszins 2026~~                                                 | **erledigt am 9. August** — 3,20 %, belegt aus dem BMF-Schreiben              | `quellen-holen.yml`       |
| **C2**     | TER der acht ETFs                                                  | Anbieter-PDF hinter Zustimmungssperre; fondsweb nennt eine andere Größe       | ein Mensch mit Browser    |
| **C3**     | Historische Zahlen in 102 Lernstufen, 34 Themen, Akademie, Glossar | Umfang; keine Quelle erreichbar                                               | Vier-Wochen-Takt          |
| **C4**     | Die 12 Rechner je ein Beispiel von Hand                            | Umfang — nur der Steuerrechner wurde gelesen                                  | Vier-Wochen-Takt          |
| **C5**     | Innere Widersprüche über alle Dateien                              | Teilweise: `npm run frische` deckt Zahlen im Fließtext ab und fand einen (A5) | läuft künftig automatisch |

---

## Der eigentliche Befund

**Die Prüfung, die der Betreiber sich wünscht, gibt es schon — sie läuft nur
nirgends.**

`npm run frische` prüft Zahlen im Fließtext, Stichtagswerte mit Turnus,
ETF-Kosten und das Alter jeder Momentaufnahme. Es findet A5, A6 und A7 in
sieben Sekunden. Es steht in `package.json` und in **keinem einzigen
Workflow**.

Damit hing die inhaltliche Aktualität an dem Zufall, dass jemand von Hand
`npm run frische` tippt. Der Basiszins ist seit sieben Monaten alt, und niemand
hat es erfahren — nicht weil es unbemerkbar war, sondern weil niemand
nachgesehen hat.

Der Turnus unten schließt genau diese Lücke.

---

## Vorschlag: der Turnus

Umgesetzt als `.github/workflows/inhalte-pruefen.yml`. Die Gliederung folgt
**der Geschwindigkeit, mit der ein Inhalt altert**, nicht dem Kalender.

| Takt              | Was                                                                         | Warum dieser Takt                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **wöchentlich**   | Zahlen im Fließtext, Datenstände, Verträge der Schnittstellen               | Kostet 30 Sekunden. Was billig ist, prüft man oft.                                                                                   |
| **alle 2 Wochen** | Werte mit Verfallsdatum: Steuersätze, Freibeträge, Basiszins, TER, Leitzins | Ändern sich zu festen Terminen, aber unangekündigt. Zwei Wochen ist der Abstand, in dem ein Jahreswert nicht sieben Monate alt wird. |
| **alle 4 Wochen** | Fachtexte, Definitionen, Akademie, Glossar, historische Zahlen              | Ändern sich fast nie. Häufiger zu prüfen erzeugt Lärm ohne Ertrag.                                                                   |
| **alle 4 Wochen** | Rechtliches: Impressum, Datenschutz, KI-Hinweise, Haftungsausschlüsse       | Gesetze ändern sich selten, aber Folgen sind teuer.                                                                                  |

Ergebnis jeder Runde: ein **Bericht als Artefakt** und, wenn etwas zu tun ist,
ein **GitHub-Issue**. Ein roter Lauf schickt eine Mail — der Kanal, über den in
diesem Projekt schon zweimal ein stiller Ausfall aufgefallen ist.

Zum Zweiwochen-Takt: `cron` kennt ihn nicht. Der Workflow läuft deshalb
wöchentlich und entscheidet über die Kalenderwoche, welche Stufe fällig ist —
gerade Woche für den Zwei-Wochen-Takt, jede vierte für die großen.

---

## Was ich nicht getan habe

- **Keine Zahl geändert, die ich nicht belegen konnte.** A4, B1 und B2 stehen
  als Vorschlag da, nicht als Korrektur. Eine plausible Zahl gegen eine andere
  plausible Zahl zu tauschen, ist keine Verbesserung.
- **Nichts an YouTube und Spotify angefasst.** Die alten KI-Hinweise dort sind
  veröffentlichte Inhalte auf fremden Plattformen; das ändert der Betreiber.
- **Die Kursreihen nicht verdichtet.** Solange der ältere Teil nur wöchentlich
  dicht ist, kann „Heute vor X Jahren“ echte Tagesausschläge nur aus dem
  jüngsten Jahr holen. Das zu ändern hieße, fünf Jahre Tagesdaten für 1.075
  Instrumente zu holen und abzulegen — eine eigene Aufgabe mit Folgen für die
  Größe des Repositories.
