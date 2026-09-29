---
titel: "Nachrichten: „Aktuell\" heißt der jüngste Erscheinungstag"
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Nachrichten: „Aktuell" heißt der jüngste Erscheinungstag

Was von heute ist, steht vorn. **Alles Ältere gehört ins Archiv** – nach Tagen
gruppiert, zugeklappt, aufzuklappen von dem, der es sehen will.

Die Grenze verläuft am **Erscheinungstag**, nicht an einer Anzahl. Bis Juli 2026
nahm sie schlicht die neuesten neun Artikel nach Rang, und das ging so lange
gut, wie jeder Tag genau neun lieferte. Hatte einer weniger, füllte die Liste
mit dem Vortag auf – aufgeklappt, mit vollem Anriss, mitten unter den heutigen.

Maßgeblich ist `tagVon()` in `lib/news.ts`: die ersten zehn Zeichen von
`publishedAt`, also der Kalendertag in der Zone, in der der Artikel erschienen
ist. Kein Umweg über `new Date`, der nach UTC verschiebt.

## Die Regel gilt an **jeder** Stelle, die Artikel als „aktuell" zeigt

Das wurde zweimal übersehen, und beide Male fiel es nur auf, weil ein Foto vom
Handy kam:

- `getCurrentNews()` – die Nachrichtenseite. Beim ersten Mal umgestellt.
- `getNewsHeadlines()` – **das Karussell der Startseite.** Beim ersten Mal
  vergessen; am 31. Juli stand dort um halb neun noch eine Meldung vom 30.
  **Seit dem 2. August gilt hier eine bewusste Ausnahme:** Das Karussell
  zeigt die **zwei** jüngsten Erscheinungstage (heutige zuerst, das Datum
  steht an jeder Schlagzeile). Nutzerwunsch – an einem dünnen Sonntag soll
  der Samstag auf der Startseite sichtbar bleiben. Nicht „zurückreparieren“.
- `getFurtherNews()` und `getFurtherNewsByDay()` – das Archiv, die Gegenseite
  derselben Grenze.

Wer eine weitere Stelle anlegt, an der Artikel als aktuell erscheinen, filtert
über denselben Tag. `CURRENT_NEWS_COUNT` ist **nur noch** eine Obergrenze für
die Anzeige, keine Grenze zwischen aktuell und Archiv.

## Das Archiv ist zugeklappt – **jeder** Tag, auch der jüngste

In `app/news/page.tsx` trägt kein `<details>` des Archivs ein `open`. Bis Juli
2026 stand der oberste Tag offen; auf dem Telefon lief das Archiv damit über
den halben Bildschirm, und der Unterschied zu „Aktuelles" darüber verschwand –
zwei Listen mit vollen Anrissen untereinander sehen aus wie eine.

Der Vortag ist eine Kachel mit Datum und Anzahl. Wer ihn sehen will, klickt ihn
auf.

## Was eine Tagesausgabe braucht

Zu jedem Tag gehört eine Datei `data/editions/JJJJ-MM-TT.ts`, eingetragen in
`data/editions/index.ts` – Import **und** Array. Ohne sie fehlt der Tag unter
`/news/tag/<datum>` und damit in der Bibliothek. Mindestens eine Top-Meldung,
mindestens drei insgesamt, `intro` zwischen 110 und 160 Zeichen.

## Was heute ansteht, gehört in die Ausgabe

**Mindestens ein Artikel oder Absatz nennt die Termine des Tages** – konkret,
mit Uhrzeit, wo sie in den Quellen steht:

- **Konjunkturdaten**: Verbraucherpreise, Erzeugerpreise, Arbeitsmarkt,
  Einkaufsmanagerindizes, BIP, ifo, ZEW
- **Notenbanken**: Zinsentscheid, Protokolle, Reden mit Marktrelevanz
- **Quartalszahlen der großen Werte** – DAX-Konzerne und die bekannten
  US-Namen. Ein Mittelständler ohne Indexgewicht gehört nicht dazu.

Der Betreiber hat das am 11. August 2026 gewünscht, nachdem in der Folge ein
Hinweis auf die anstehenden Verbraucherpreise stand: **Genau das macht den
Unterschied zwischen einem Rückblick und etwas, mit dem der Leser in den Tag
geht.**

Die Anweisung steht an beiden Stellen, an denen geschrieben wird – im Prompt
von `scripts/nachrichten-erzeugen.ts` und im Agentenprompt in
`nachrichten-agent.yml`. Wer eine ändert, ändert beide.

**Nur, was in den Quellen steht.** Ein Termin, den niemand gelesen hat, ist
eine erfundene Zahl mit Datum – der Grundsatz „keine erfundenen Meldungen"
gilt hier genauso. Findet sich keiner, bleibt er weg.

## Umfang und Mischung

Die Vortage sind der Maßstab: **fünf bis zehn Artikel aus mehreren Quellen zu
mehreren Themen.** Am 29. und 30. Juli waren es je neun aus sieben bis acht
Quellen – Notenbank, Öl, Halbleiter, Krypto, Gold, Stimmungsindex, Bilanzen,
Indizes.

Sechs Artikel, von denen fünf aus einem einzigen Bericht stammen und alle
dasselbe Thema haben, erfüllen die Zahl und verfehlen die Sache. Wenn eine
Quelle mehrere Lehrwinkel hergibt, ist das ein Gewinn – aber kein Ersatz dafür,
mehrere Quellen zu lesen.
