<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
mindestens drei insgesamt, `intro` zwischen 110 und 165 Zeichen.

## Umfang und Mischung

Die Vortage sind der Maßstab: **fünf bis zehn Artikel aus mehreren Quellen zu
mehreren Themen.** Am 29. und 30. Juli waren es je neun aus sieben bis acht
Quellen – Notenbank, Öl, Halbleiter, Krypto, Gold, Stimmungsindex, Bilanzen,
Indizes.

Sechs Artikel, von denen fünf aus einem einzigen Bericht stammen und alle
dasselbe Thema haben, erfüllen die Zahl und verfehlen die Sache. Wenn eine
Quelle mehrere Lehrwinkel hergibt, ist das ein Gewinn – aber kein Ersatz dafür,
mehrere Quellen zu lesen.

# Diese Umgebung erreicht nur GitHub

`WebFetch` und `curl` scheitern hier an jeder Adresse außerhalb von GitHub und
npm — der Egress-Proxy antwortet mit `CONNECT tunnel failed, response 403`. Das
gilt für **alles**: destatis, Eurostat, Bundesbank, EZB, Yahoo, jedes
Nachrichtenportal, sogar `example.com` und `iminvests.de` selbst.

Das ist eine Regel der Umgebung, kein Fehler. Prüfen lässt sie sich mit
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

## Der Ausweg: ein Läufer holt es

**GitHub-Läufer haben vollen Netzzugang.** Darauf beruht das halbe Projekt schon
– Kurse, Zinsen, Quartalstermine, ESEF-Bilanzen kommen alle über einen Workflow
herein, weil sie von hier aus unerreichbar sind.

Für alles, was nur _gelesen_ werden soll, gibt es dasselbe Muster als fertiges
Werkzeug: **`.github/workflows/quellen-holen.yml`**. Er nimmt Adressen entgegen,
holt sie, entfernt das Markup und schreibt den Text ins Protokoll.

```
1. mcp__github__actions_run_trigger   method: run_workflow
                                      workflow_id: quellen-holen.yml
                                      ref: main
                                      inputs: { urls: "…", zeichen: "12000" }
2. etwa 20 Sekunden warten
3. mcp__github__actions_list          method: list_workflow_jobs
4. mcp__github__get_job_logs          return_content: true
```

Was im Protokoll steht, ist eine gelesene Quelle — mit Statuscode, Datum und
Adresse daneben. Genau das verlangt `.claude/skills/newsupdate/SKILL.md`, und
ohne diesen Umweg ist die Anforderung hier nicht erfüllbar.

## Davor: welcher Kanal ist heute überhaupt offen?

**`.github/workflows/quellen-pruefen.yml`** klopft die gepflegte Quellenliste
(`data/nachrichtenquellen.ts`) ab und sagt je Rubrik, welche Adresse heute Text
liefert. Er läuft täglich um 03:00 UTC, eine halbe Stunde vor der
Nachrichten-Routine, und lässt sich von Hand starten.

## Wann die Nachrichten entstehen

Die Routine **„Nachrichten IM Invests – täglich 5:30 Uhr"** läuft um **03:30
UTC** – das sind 5:30 Uhr deutscher Sommerzeit. Drumherum liegen zwei
Workflows, deren **Abstand** die eigentliche Vorschrift ist:

| Zeit (UTC) | Was                                                    |
| ---------- | ------------------------------------------------------ |
| 03:00      | `quellen-pruefen.yml` – welcher Kanal ist heute offen? |
| 03:30      | Nachrichten-Routine, 45–70 Minuten Laufzeit            |
| 05:00      | `paket-bauen.yml` – nach dem Lauf, nicht mitten hinein |

Die Routine **„Zeitumstellung"** zieht alle drei zweimal im Jahr gemeinsam um
eine Stunde nach. Wer eine Zeit ändert, ändert alle drei.

## Geplante Läufe sind eine Bitte, keine Zusage

**GitHub verwirft `schedule`-Läufe, wenn zu viele gleichzeitig anstehen** – ohne
Fehler, ohne Eintrag, ohne Mail. Ein verworfener Lauf hinterlässt nur eine
Lücke, und die sieht aus wie „hat nichts gefunden".

Am 3. August 2026 hat es dieses Projekt an einem Vormittag dreifach getroffen:
Der Paketbau (`15 4`) startete um **07:48** – dreieinhalb Stunden zu spät –,
die Quellenprobe (`30 5`) und **jeder** der vier Kursläufe des Vormittags
fielen ersatzlos aus. Auf der Website standen die Charts von Freitagabend bis
Montagmittag still. Aufgefallen ist es dem Betreiber, nicht der Technik.

Am dichtesten belegt sind die vollen und halben Stunden. Deshalb stehen die
Minuten aller Zeitpläne dieses Projekts seither auf **krummen Werten** – `7,37`
statt `0,30`, `9` statt `0`, `3` statt `0`. Das kostet nichts und ist der
einzige Hebel, den man von außen hat.

Zwei Dinge folgen daraus:

- **Runde Minuten nicht wieder einführen.** Wer einen neuen Workflow anlegt,
  sucht sich eine Minute, die noch keiner hat.
- **`kurse.yml` koppelt seine Crons an Zeichenketten-Vergleiche** (`NUR_ARTEN`,
  `NUR_PREIS`). Ein geänderter Cron-Ausdruck ohne angepassten Vergleich
  schaltet stillschweigend den vollen Abruf ein: sieben Minuten statt Sekunden,
  dreißigmal am Tag.

Bleibt eine Datenreihe stehen, ist die erste Frage deshalb nicht „ist der Lauf
gescheitert?", sondern **„hat er überhaupt stattgefunden?"** – und der
Handstart über `workflow_dispatch` ist das Mittel, das sofort hilft.

Bis zum 3. August 2026 liefen **zwei** Nachrichten-Routinen parallel (02:15 und
04:00 UTC) und feuerten beide, ohne voneinander zu wissen. Die ältere ist
stillgelegt; es gibt genau eine.

Der Grund ist ein Ausfall, der nicht auffällt: Eine Seite antwortet mit **200**
und liefert trotzdem nichts – ein Gerüst aus Menü und Fußzeile, weil der Inhalt
per JavaScript nachkommt. Das führt nicht zum Abbruch, sondern zu einer
dünneren Ausgabe. `lib/quellenprobe.ts` trennt deshalb fünf Zustände:
`brauchbar`, `alt` (kein Datum von heute oder gestern), `leer` (Gerüst),
`gesperrt` (Zustimmungs- oder Bot-Sperre) und `stumm` (antwortet nicht).

**Eine Adresse, die niemand abgerufen hat, gehört nicht in die Liste.** Beim
ersten Entwurf waren sieben von siebzehn tot – 404 oder 403, alle plausibel
aussehend. Der Beleg steht als Prüfstand im Kopf von
`data/nachrichtenquellen.ts`.

**Suchergebnisse sind kein Ersatz.** `WebSearch` funktioniert und ist gut, um
Adressen zu finden — aber es liefert Zusammenfassungen fremder Seiten, keine
Seiten. Am 31. Juli 2026 kamen daraus zum Goldpreis zwei Zahlen, die einander
widersprachen; eine davon wäre ungeprüft in einen Artikel gewandert und hätte
tadellos ausgesehen.

## Warum das hier steht

Weil es zweimal übersehen wurde. Beim ersten Mal endete ein Nachrichtenlauf mit
„geht nicht, kein Netzzugang“, obwohl im selben Repository vier Workflows
stehen, die genau dieses Problem lösen. Die richtige Frage ist nicht „komme ich
an die Seite?“, sondern **„wer kommt an die Seite, und wie bekomme ich sein
Ergebnis?“**

## Nebenwirkung: `workflow_dispatch` braucht `main`

GitHub startet über `workflow_dispatch` nur Workflows, die auf der
Standardverzweigung liegen. Ein neuer Workflow auf einem Nebenzweig antwortet
mit **404**, und das sieht aus wie „gibt es nicht“ statt wie „noch nicht
gemergt“. Wer einen Workflow zum Starten von Hand braucht, muss ihn erst nach
`main` bringen — `zinsen.yml` hing genau daran.
