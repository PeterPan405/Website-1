---
titel: Das Briefing für die tägliche Recherche
datum: 2026-10-14
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Das Briefing für die tägliche Recherche – 14. Oktober 2026

Am 14. Oktober 2026 gab der Betreiber ein Briefing „IM Invest – Tägliche
News-Recherche" vor: fünf sorgfältig recherchierte, aktuelle und
abwechslungsreiche Nachrichten bis spätestens 6:30 Uhr, aus vielen seriösen
und unabhängigen Quellen, mit direkten Links, ohne Wiederholungen aus den
letzten sieben Tagen, für Instagram mit höchstens zwei kurzen Sätzen je
Kachel, und eine Schlusskontrolle vor der Abgabe.

Umgesetzt wurde es am Bestand gemessen, nicht nur hingeschrieben. Was die
Messung ergab, steht hier – mit dem, was sich daraus änderte.

## Fünf statt fünf bis neun

„Wähle … die fünf relevantesten Nachrichten des Tages." Die Untergrenze
war schon fünf; neu ist, dass sie zugleich die Obergrenze ist. Fünf
Artikel, fünf Meldungen, fünf Kacheln – in einer Rangfolge, die für
Website, Folge und Instagram dieselbe ist. Der Riegel weist sechs zurück
wie vier.

## Welche Quellen ein Läufer überhaupt lesen kann

Das Briefing nennt Reuters, Bloomberg, Financial Times, CNBC, Wall Street
Journal, Handelsblatt, WirtschaftsWoche, FAZ, Tagesschau und die SEC. Am 14. Oktober 2026, 08:26 UTC, von einem GitHub-Läufer abgerufen:

    200  Tagesschau, Handelsblatt, WirtschaftsWoche, CNBC (Seite und Feed)
    200  FAZ – nur der Feed; die Seite antwortet mit 302
    401  Reuters, Wall Street Journal
    403  Bloomberg, Financial Times, SEC-Pressemitteilungen

Die fünf offenen kamen als **Feed** in den Sammler und in
`data/nachrichtenquellen.ts` – ein Feed trägt Überschrift, Kurztext,
Zeitstempel und den direkten Link. Die gesperrten stehen mit Datum in der
Liste: ein Zwischenstand, kein Urteil. Aus ihnen wird nur zitiert, was eine
gelesene Quelle wiedergibt.

## Direkte Links – und warum es sie vorher nicht gab

Nachgezählt: **819 von 1.078** Quellenlinks der Website zeigten auf eine
Übersicht, 317-mal `wallstreet-online.de/nachrichten`. In den letzten
dreißig Tagen 320 von 377.

Das lag nicht am Agenten. Die Aufbereitung im Sammler machte aus
`<a href="/nachricht/…">Schlagzeile</a>` die Schlagzeile allein – der
Link ging verloren, bevor die Quellendatei entstand. Wer daraus schrieb,
konnte nur die Übersicht angeben. Ein stiller Fehler: Nichts wurde je rot.

Die Aufbereitung steht jetzt in `scripts/quellentext.py`, mit Selbsttest,
und behält jeden Link hinter einer Schlagzeile (Linktext ab 25 Zeichen,
Ziel mit mindestens zwei Pfadteilen) in ⟨spitzen Klammern⟩. Erst damit ist
die neue Prüfung fair: `lib/quellenlink.ts` weist eine Quelle zurück, die
eine Start- oder Rubrikseite ist oder in der Quellenliste steht – die
führt per Definition Übersichten.

## Sieben Tage statt Vortag

Gegen den Vortag gemessen, fand die Wiederholungsprüfung 8 Fälle; gegen
sieben Erscheinungstage 22, davon 21 echte Wiederholungen – „Euro fällt auf
17-Monats-Tief" am 6. und 8. Oktober fast wortgleich, „Dax klettert zurück
über 25.000" am 3. und 10. Einer ist ein Fehlgriff (zwei Chartlinien, zwei
Anlagen) und steht als solcher am Wert `WIEDERHOLUNG_TAGE`. „Unter" kam als
Füllwort hinzu; die Grenze von einem Drittel blieb.

Der Agent liest dieselbe Liste, gegen die geprüft wird:
`scripts/ueberschriften-woche.ts`. Vorher stand dort ein `grep`, der die
Zahl der Tage nur ungefähr traf.

## Mehrere unabhängige Quellen – laut, aber kein Abbruch

250 von 521 Artikeln stützten sich auf eine einzige Website. Das Briefing
verlangt die Prüfung „möglichst" an mehreren. Der Riegel warnt deshalb und
bricht nicht ab: Manche Meldung gibt es am frühen Morgen nur an einer
Stelle – dann wird sie als unbestätigt gekennzeichnet, nicht gestrichen.

## Zwei Sätze je Kachel

Bis dahin galten „zwei bis drei" – abgelesen an den 54 Beiträgen davor,
auf Anordnung „keine Experimente". Das Briefing sagt „maximal zwei kurze
Sätze", und es kommt von derselben Stelle. `saetze()` in
`lib/instagram-plan.ts` zählt sie; Abkürzungen, Ordnungszahlen und
einzelne Buchstaben („z. B.", „U.S.") beenden keinen Satz.

## Die Uhrzeit

Das Briefing nennt 6:30 Uhr. Die Zusage dieser Website ist 6:00 Uhr – sie
bleibt, und sie liegt davor.
