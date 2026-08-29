<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Regeln für dieses Repository

Diese Datei läuft bei **jedem Zug** mit. Sie enthält deshalb nur, was beim
Arbeiten gilt – die Begründungen stehen in **`ENTSCHEIDUNGEN.md`**, unter
denselben Überschriften, auf die hier verwiesen wird.

**Lies dort nach, bevor du eine Regel änderst oder für überflüssig hältst.**
Fast jede ist die Antwort auf einen Fehler, der eine Folge, einen Tag oder
Geld gekostet hat, und ohne ihre Vorgeschichte sieht fast jede nach einer
willkürlichen Einschränkung aus. Der naheliegende Umbau ist hier oft der, der
schon einmal danebenging.

## Wie berichtet wird

**Ausführlich arbeiten, kurz berichten.** Der Betreiber hat das am 16. August
2026 verlangt: **zwei bis drei Zeilen**, so kurz wie möglich.

Das gilt für den Text im Chat – nicht für Commits, Pull Requests und
Kommentare. Die bleiben ausführlich: Sie sind das Gedächtnis des Projekts, und
zwischen zwei Sitzungen trägt nichts anderes.

Was in die drei Zeilen gehört: was getan ist, was gefunden wurde, was der
Betreiber entscheiden muss. Tabellen und Aufzählungen nur, wenn sie kürzer
sind als der Satz, den sie ersetzen. Kein Nacherzählen des Wegs.

## Arbeitsweise

- **Ist etwas offen, wird es abgearbeitet** – ohne Rückfrage, ob. Anordnung
  des Betreibers vom 29. August 2026. Gilt für rote Läufe, gemeldete Befunde,
  offene Issues und alles, was eine Sitzung als „bleibt offen" hinterließ.
- **Selbst mergen, ohne zu fragen.** Pull Request anlegen, Prüfung abwarten
  (vier bis fünf Minuten), Ergebnis ansehen, mergen. Anordnung des Betreibers
  vom 8. August 2026.
- **Nur bei grüner Prüfung**, und nichts, was du selbst für kaputt hältst –
  ein Merge geht auf eine öffentliche Website. Ungutes Gefühl gehört in den
  Pull Request, als Frage zur Sache.
- **Wer einen Pull Request anlegt, beendet den Zug nicht, bevor er gemergt
  ist.** „Ich merge gleich" ist kein Zustand, den man hinterlässt. Auto-Merge
  greift hier nicht (kein Pflicht-Check auf `main`).
- Löschen und Überschreiben von Bestand, Zugangsdaten und alles Unumkehrbare
  fällt **nicht** darunter – da wird weiter gefragt.
- `workflow_dispatch` startet nur Workflows, die auf `main` liegen. Ein neuer
  Workflow auf einem Nebenzweig antwortet mit 404.
- **Manchmal geht `workflow_dispatch` gar nicht** (403) – ein `push` auf den
  Arbeitszweig schon. Dann hängt der Lauf an `push` mit **Pfadfilter** auf eine
  Anstoßdatei; Vorbild: `.github/sonde-anstoss.txt` in `quellen-probe.yml`.

→ `ENTSCHEIDUNGEN.md`: „Selbst mergen, ohne zu fragen"

## Diese Umgebung erreicht nur GitHub

`WebFetch` und `curl` scheitern an **jeder** Adresse außer GitHub und npm
(`CONNECT tunnel failed, response 403`) – auch an `iminvests.de` selbst. Das
ist eine Regel der Umgebung, kein Fehler; prüfbar mit
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

**Der Ausweg: ein Läufer holt es.** GitHub-Läufer haben vollen Netzzugang.

- `.github/workflows/quellen-holen.yml` – nimmt Adressen, holt sie, schreibt
  den Text ins Protokoll (`actions_list` + `get_job_logs`).
- `.github/workflows/quellen-sammeln.yml` – legt `quellen.txt` auf den
  wurzellosen Zweig `quellen-heute`; zu lesen mit
  `git show origin/quellen-heute:quellen.txt`.
- **Ein Lauf, dessen Ergebnis eine Datei ist, legt sie auf einen wurzellosen
  Zweig** – nicht als Artefakt. Das ist ein ZIP hinter einer Anmeldung und von
  hier aus unerreichbar.

**Suchergebnisse sind kein Ersatz für eine gelesene Quelle.**

→ `ENTSCHEIDUNGEN.md`: „Diese Umgebung erreicht nur GitHub"

## Nachrichten

- **„Aktuell" heißt der jüngste Erscheinungstag**, nicht eine Anzahl.
  Maßgeblich ist `tagVon()` in `lib/news.ts` – die ersten zehn Zeichen von
  `publishedAt`, kein Umweg über `new Date`. Die Regel gilt an **jeder**
  Stelle: `getCurrentNews()`, `getFurtherNews()`, `getFurtherNewsByDay()`.
  `CURRENT_NEWS_COUNT` ist nur noch eine Anzeigegrenze.
- **Ausnahme Karussell:** `getNewsHeadlines()` zeigt die **zwei** jüngsten
  Erscheinungstage. Nutzerwunsch, nicht „zurückreparieren".
- **Das Archiv ist zugeklappt**, jeder Tag, auch der jüngste – kein
  `<details>` in `app/news/page.tsx` trägt `open`.
- **Eine Tagesausgabe** braucht `data/editions/JJJJ-MM-TT.ts`, eingetragen in
  `data/editions/index.ts` – Import **und** Array. Mindestens eine Top-Meldung,
  drei insgesamt, `intro` 110–160 Zeichen.
- **Die Termine des Tages gehören hinein** – Konjunkturdaten, Notenbanken,
  Quartalszahlen der großen Werte, mit Uhrzeit, wo sie in den Quellen steht.
  Nur was dort steht. Die Anweisung steht in `scripts/nachrichten-erzeugen.ts`
  **und** `nachrichten-agent.yml`; wer eine ändert, ändert beide.
- **Umfang:** fünf bis zehn Artikel aus mehreren Quellen zu mehreren Themen.
- **Keine erfundenen Meldungen, keine erfundenen Zahlen, keine Quelle, die
  niemand gesehen hat.** Steht in der Meldung kein Warum, schreibst du kein
  Warum – und sagst das ausdrücklich.
- Eine Adresse, die niemand abgerufen hat, gehört nicht in
  `data/nachrichtenquellen.ts`.

**Die Rangfolge der Ausgabe** (in `nachrichten.yml`) – **zwei** Wege, nicht
drei:

1. Entwurf vom Agenten (`nachrichten-agent.yml`, im Abo) – der Regelfall
2. Modell über die Anthropic-Schnittstelle (~0,20 $, braucht `ANTHROPIC_API_KEY`)

**Liefert keiner, wird nichts geschrieben und der Lauf bricht rot ab.** Der
Notbehelf aus dem Kursbestand ist seit dem 11. August 2026 abgeschafft –
besser keine Nachrichten als eigene Kurszahlen, die wie Nachrichten aussehen.

**Wohin die Anfrage geht, ist einstellbar** – `ANTHROPIC_BASE_URL` als Secret,
voreingestellt `api.anthropic.com`. Ein Zwischendienst bekommt den Quelltext
der Meldungen **und** den Schlüssel; deshalb nur `https://`, deshalb warnt der
Lauf. Wer Prompts kürzt, kürzt an Zahlen, Namen und Uhrzeiten.

**Ohne Modell keine Ausgabe – und ohne Ausgabe keine Folge** (`npm run folge`
bricht ab). Alles andere läuft weiter: Kurse, Bau, Übertragung, Lernseiten.

Die Prüfung in `scripts/nachrichten-erzeugen.ts` spiegelt `lib/news-validate.ts`,
`lib/editions-validate.ts` und `npm run pruefen`. **Wer eine Regel im Build
ändert, ändert sie dort mit.**

→ `ENTSCHEIDUNGEN.md`: „heißt der jüngste Erscheinungstag", „Der Agent
schreibt, der Läufer veröffentlicht", „Warum es Auffangnetz und Wächter gibt"

## Der Fahrplan – Zusage ist 6:00 Uhr deutscher Zeit, für Nachrichten und Folge

| Deutsche Zeit | UTC   | Was                                                          |
| ------------- | ----- | ------------------------------------------------------------ |
| 02:03         | 00:03 | `quellen-pruefen.yml` – welcher Kanal ist heute offen?       |
| 02:09 / 02:29 | 00:09 | `quellen-sammeln.yml` – `quellen-heute`, weckt den Agenten   |
| **02:33**     | 00:33 | `nachrichten-agent.yml` – der Agent schreibt den **Entwurf** |
| **↳ sofort**  | –     | der Agent **stößt den Nachrichtenlauf an**                   |
| 03:03 / 03:33 | 01:03 | zweiter und dritter Anlauf des Agenten                       |
| **↳ ~03:00**  | 01:00 | `nachrichten.yml` – prüfen, bauen, senden → live ab ~03:20   |
| **↳ sofort**  | –     | der Nachrichtenlauf **stößt den Podcast an**                 |
| **~04:00**    | 02:00 | **die Folge ist online**                                     |
| 03:13 … 04:47 | 01:13 | `nachrichten.yml` als Cron – vier Rückfalltermine            |
| 03:53 / 04:33 | 01:53 | `podcast-erzeugen.yml` als Cron – zwei Rückfalltermine       |
| ab 03:00      | 01:00 | `kurse.yml` stößt an, was fehlt – alle 5 Minuten geplant     |
| 05:11         | 03:11 | `ausgabe-waechter.yml` – der Alarm kommt **vor** der Frist   |
| 07:41         | 05:41 | `paket-bauen.yml` – der nächtliche Bau                       |
| 07:51         | 05:51 | `betriebsuebersicht.yml` – steht alles?                      |

- **Die Kette hängt aneinander, nicht an der Uhr.** Jedes Glied stößt das
  nächste an, die Crons sind Rückfall. Wer hier etwas ändert, lässt die
  Anstöße stehen – ein doppelter kostet vierzig Sekunden, ein fehlender den Tag.
- **Wer eine Zeit ändert, ändert alle.** Die Routine „Zeitumstellung" zieht
  sie zweimal im Jahr gemeinsam nach.
- Der Podcast **muss nach** der Nachrichtenausgabe laufen – er vertont sie.
- Die Folge erscheint **täglich**, sieben Tage die Woche.
- `folgennummer()` in `lib/sprechfassung.ts` zählt zweiteilig, mit einer Naht
  am 9. August 2026. Eine Folgennummer darf keine Lücke bekommen.

→ `ENTSCHEIDUNGEN.md`: „Wann die Nachrichten entstehen – und wann der Podcast"

## Geplante Läufe sind eine Bitte, keine Zusage

GitHub verwirft `schedule`-Läufe ohne Meldung, und zwar **regelmäßig**, nicht
gelegentlich. Daraus folgt:

- **Was zu einer bestimmten Zeit passiert sein muss, darf nicht an `schedule`
  hängen** – am 28. August 2026 lieferte GitHub von `kurse.yml` (alle fünf
  Minuten) zwischen 00:00 und 04:20 UTC **einen** Lauf. Der Einstieg in den Tag
  hängt deshalb am Dauerlauf: `kurse-dauerlauf.yml` fragt alle zehn Minuten, ob
  die Ausgabe auf `main` steht, und weckt sonst `quellen-sammeln.yml`
  (`lib/tageswecker.ts`). Ein laufender Prozess lässt sich nicht verwerfen.
- **Krumme Minuten.** Wer einen neuen Workflow anlegt, sucht sich eine Minute,
  die noch keiner hat – runde Minuten sind am dichtesten belegt.
- **Ein Commit vom Bot löst nichts aus.** Ein Push mit dem `GITHUB_TOKEN`
  startet keinen weiteren Workflow. Wer Daten nach `main` committet, stößt den
  Neubau selbst an (`gh workflow run`, dafür `permissions: actions: write`).
- **Zu jedem Lauf, der etwas nach außen gibt, gehört die Frage: Steht das
  Ergebnis des Tages schon?** Gefragt wird `origin/main` von **jetzt**
  (`git fetch` + `git show`), nicht der Checkout – der ist eine Momentaufnahme
  vom Auslösen.
- **Ein Riegel ist so gut wie die Quelle, die er fragt** (siehe „Lehren"): Der
  Upload fragt den YouTube-Kanal, nicht das Register.
- **Ein Push, der nach der Veröffentlichung scheitert, ist rot.** Sonst laufen
  zwei Wahrheiten auseinander. Wer eine Schleife um `git pull --rebase` legt,
  räumt zwischen den Runden mit `git rebase --abort` auf.
- `kurse.yml` koppelt seine Crons an Zeichenketten-Vergleiche (`NUR_ARTEN`,
  `NUR_PREIS`). Ein geänderter Cron ohne angepassten Vergleich schaltet
  stillschweigend den vollen Abruf ein.

→ `ENTSCHEIDUNGEN.md`: „Geplante Läufe sind eine Bitte, keine Zusage",
„Ein Commit vom Bot löst nichts aus"

## Ein roter Lauf ist ein Vorrat

Die Frage ist nicht „ist etwas schiefgegangen?", sondern **„sieht ein Besucher
deshalb etwas anderes?"**

- Misslungener Upload, `000` von außen, SSH-Aussetzer → **Warnung.** Der
  nächste Lauf trägt es nach.
- Unbrauchbarer Schlüssel, halb getauschtes Verzeichnis, zerbrochener Bau,
  auseinanderlaufende Wahrheiten → **roter Lauf.**
- Täglich laufende Workflows bleiben hart: Ein Fehlschlag heißt dort „heute
  gibt es keine Folge", und dafür ist eine Mail richtig.

**Wer eine Meldung leiser stellt, baut die Gegenprobe dazu.** `kurse.yml`
prüft jeden Lauf den Bauzeitpunkt aus `version.txt`: ab 10 Stunden Warnung und
ein Bau, ab 18 Stunden rot.

**`000` ist der Hoster, `404` sind wir.** Antwortet auf Port 443 niemand, ist
der Host weg, und dagegen hilft kein Neubau → **Warnung**, und rot erst, wenn
schon der vorige Lauf rot war. Antwortet der Server mit einem gelesenen Code
außer 200, läuft er und findet nichts – das ist unser Webordner → **roter
Lauf** und Neubau.

→ `ENTSCHEIDUNGEN.md`: „Ein roter Lauf ist ein Vorrat", „`000` ist der Hoster,
`404` sind wir"

## Der Zahlenwächter

`lib/website-zahlen.ts` zählt beim Bauen, wie viel hier steht; `/zahlen` zeigt
es. Der Zweck ist der stille Datenausfall: **Diese Zahlen fallen nicht von
selbst.** Fällt eine, hat sich ein Bestand geleert – und alles andere bleibt
grün.

- **Der Stand wird fortgeschrieben, sonst wird der Wächter stumpf.** Der
  nächtliche Bau tut das (`paket-bauen.yml`, nur im `schedule`-Lauf).
- **Ein Rückgang hält das Fortschreiben an**, sonst wird der Alarm in derselben
  Nacht zum neuen Maßstab. Über einen gewollten Rückgang hinweg nur von Hand:
  `ANWENDEN=1 TROTZDEM=1 npm run zahlen`.
- **Ein `id` wird nie umbenannt** – der Abgleich hängt allein daran. Ein neuer
  Schlüssel meldet einen Sturz auf null und hat danach keine Vorgeschichte
  mehr.

→ `ENTSCHEIDUNGEN.md`: „Ein Wächter, der seinen eigenen Alarm fortschreibt,
ist keiner"

## Quartalstermine

- **Drei Quellen, und die angekündigte gewinnt.** Der Sammelkalender
  (`ALPHAVANTAGE_API_KEY`, ein Abruf für alle) und die Tokioter Börse nennen
  Tage, die die Unternehmen **selbst angekündigt** haben; die SEC-Ableitung
  rechnet hoch. Wo mehrere etwas wissen, gilt der angekündigte Tag – er trägt
  kein `geschaetzt`, heißt auf der Seite „angekündigt" und nennt seine eigene
  Quelle.
- **Die Herkunft hängt am Termin, nicht am Code.** `herkunft` in der Vorhersage,
  aufgelöst über `TERMINQUELLEN` in `herkunftVon()`, und **vor** der Frage nach
  `angekuendigt` – sonst zitiert ein abgeleiteter Tokio-Termin die SEC. Wer eine
  vierte Quelle anschließt, trägt sie **dort** ein.
- **Der Sammelkalender führt, was in New York notiert** – auch die
  Hinterlegungsscheine ausländischer Emittenten, und damit Alibaba. Von 41
  europäischen und asiatischen Standardwerten waren drei enthalten. Wer keinen
  Termin hat, bekommt den Satz warum (`quartalsterminLuecke()`) – eine
  Leerstelle erklärt sich nicht selbst, und der Satz hängt am Handelsplatz:
  „fehlt in der Quelle" und „fehlt in ihrem Zeitfenster" sind zweierlei.
- **Tokio liefert den Tag, nie die Uhrzeit.** Die Liste hat keine Spalte dafür.
  Dass dort fast alles nach Handelsschluss um 15:00 Uhr Ortszeit gemeldet wird,
  ist eine Faustregel und keine Angabe – nicht „ergänzen".
- **Die JPX-Adresse wird gesucht, nicht eingetragen.** Der Dateiname trägt ein
  Datum (`kessan06_0807.xlsx`), es sind zwei Dateien, und gelesen wird die
  **japanische** Übersichtsseite – die englische trägt null Verweise.
- **Der Weg über Twelve Data ist tarifgesperrt** und hat noch nie etwas
  geliefert. Er bricht seit dem 20. August 2026 nach der ersten Absage ab
  (`TarifSperre`). Nicht „reparieren": Es fehlt ein bezahlter Tarif, nicht Code.
- **Beide Anbieter antworten auf eine Absage mit Statuscode 200.** Geprüft wird
  der Inhalt, nicht der Code – sonst landet eine Absage als leere Liste im
  Bestand, und der Lauf bleibt grün.
- **Die Uhrzeit ist die New Yorker Wanduhr**, in der Momentaufnahme; die
  deutsche entsteht erst in der Anzeige aus dem erwarteten Tag. Sechs Stunden
  zu addieren ist an drei Wochen im Jahr falsch – und genau in die fällt die
  Berichtssaison des ersten Quartals.
- **Eine Zeit entsteht nur bei zwei Jahren in derselben Sitzungslage**, und
  „während des US-Handels" wird nie angezeigt: Dort misst der Zeitstempel das
  nachgereichte Formular, nicht die Meldung.
- **Zwei Wochen heißt zwei Wochen** – `BALD_TAGE = 14`, Grenze eingeschlossen.
  Der Abschnitt auf der Aktienseite bleibt **offen**; das Zeichen im Kopf
  springt hinein, und ein Sprungziel im zugeklappten `<details>` führt ins
  Nichts.

**„Geprüft und nichts gefunden" ist ein Zwischenstand, kein Ergebnis.** Er
gehört mit Datum und Liste hingeschrieben – nicht als Beweis gelesen, dass es
nichts gibt. Der Sammelkalender wurde erst gefunden, als jemand statt nach
Terminen je Unternehmen nach einer Sammelstelle fragte.

→ `ENTSCHEIDUNGEN.md`: „Ein Weg, der nie etwas geliefert hat", „Zwischen New
York und Berlin liegen nicht immer sechs Stunden", „Der Betreiber hatte recht"

## Kurse

**Ein Kurs ist so alt wie die Stelle, die ihn anzeigt** – nicht wie der Abruf.
Zusage: höchstens sechs Minuten.

- **Es gibt keine Kurse zweiter Klasse.** Wer eine Zahl zeigt, die sich
  stündlich ändert, liest sie aus `lib/kurse-live-speicher.ts`, nicht aus
  eigenem `fetch`. Drei Stellen: `components/markets/Kachelzahlen.tsx`,
  `Zeilenzahlen.tsx`, `KursLive.tsx`.
- `lib/leitwerte.ts` bestimmt, was der Fünf-Minuten-Lauf holt: alle 46 Kacheln
  der Übersicht.
- `.github/workflows/kurse-dauerlauf.yml` bringt seine Uhr selbst mit: ein
  Job, fünfeinhalb Stunden, alle zwei Minuten der volle Bestand. **Zwei
  Bremsen dürfen nicht wegfallen:** kein Nachfolger unter zehn Minuten
  Laufzeit, und der Wächter in `kurse.yml` wartet nach einem Fehlschlag eine
  Stunde. An ihm hängt seit dem 28. August auch der Wecker der Tagesausgabe.
- **Ihn von Hand anzustoßen tötet den laufenden** (`cancel-in-progress`).
  Kommt der neue nicht hoch – der SSH-Port flattert –, stehen die Kurse, bis
  der Wächter greift: eine Stunde statt sechs Minuten. Am 28. August 2026 so
  passiert. Nur anstoßen, wenn keiner läuft oder der laufende kaputt ist.
- Wer `ABSTAND_MS` anfasst, fasst den Dauerbetrieb bei Yahoo mit an.
- **Eine Ausnahme gehört an die Bedingung, die sie meint** – nicht an die
  nächstgelegene. Die EZB-Sonderbehandlung greift nur im Fünf-Minuten-Lauf
  (`NUR_LEITWERTE`), ihr Referenzkurs überlebt `ohneHeute()`.
- Rohstoffe kommen bei Yahoo verzögert. Die Stand-Zeile nennt den Zeitstempel
  der **Quelle**, nicht den des Abrufs.

→ `ENTSCHEIDUNGEN.md`: „Ein Kurs ist so alt wie die Stelle, die ihn anzeigt"

## Stimme, Podcast und Vorlesefassungen

- **Die Pause hängt an der Satzlänge**, nicht am Satzzeichen. Absatzende
  bleibt bei 0,95 s (danach sucht der Kapitelschritt), der Mittelwert der
  Satzpausen bei rund einer halben Sekunde. Beides prüft
  `python scripts/sprechstimme.py --selbsttest`.
- **Der Selbsttest läuft vor dem Sprechen** – `podcast-erzeugen.yml`,
  `lese-stimme.yml`, `aufnahmen-nachpruefen.yml`.
- **Geprüft wird die fertige Aufnahme, nicht das einzelne Stück.**
  `sprechstimme.nachbessern()` läuft nach dem Zusammenfügen und dämpft, statt
  nur zu melden.
- `sprechstimme.py` und `stimme-erzeugen.py` stehen doppelt da: **Wer an
  Pausen, Stücklänge oder Frist etwas ändert, ändert beide Stellen.**
- **Was englisch ist, wird englisch gesprochen** – `ENGLISCHE_NAMEN` in
  `lib/sprechfassung.ts`, zuerst angewandt, zusammengesetzte Ausdrücke vor
  ihren Bestandteilen. Nicht hinein gehört, was im Deutschen deutsch
  gesprochen wird („ETF", „KI", „Broker", „Bond", „Trend").
- **Drei Fallen der deutschen Rechtschreibung, und die Tabelle hat sie schon
  neunmal übersehen:** „st"/„sp" am Wortanfang sind /scht/ und /schp/; „w" ist
  **immer** /v/, für englisches /w/ steht **„u"**; „v" am Wortende ist /f/,
  dort steht ebenfalls „w". `tests/sprechfassung-aussprache.test.ts` prüft die
  letzten beiden maschinell – steht im englischen Wort ein „w" vor einem
  Vokal, muss in der Umschrift ein „u" stehen, und ein „v" verlangt ein „w".
- **Kleingedrucktes steht hinter der Begrüßung**, als zweiter Absatz, vor der
  ersten Meldung: erst der KI-Hinweis, dann der Rechtshinweis – eine Stelle,
  nicht zwei. Nicht davor (drei Sekunden halten den Hörer), nicht am Ende.
  Beides Nutzerwunsch.
- **Ein Störgeräusch ist häufiger ein Ton als ein Rauschen.** Die Prüfung sah
  bis zum 20. August 2026 nur „rau" und war für jeden gehaltenen Ton unter
  2.600 Hz blind. Erkannt wird jetzt auch, dass die Energie in **einer**
  Frequenz sitzt (`TONANTEIL_GRENZE`) – wer daran etwas ändert, misst nach.
- **Gesprochen wird gebeugt:** `ordnungszahlenSprechbar()`. Wer eine weitere
  Stelle baut, an der Text gesprochen wird, führt ihn durch dieselbe.
- **Eine ausgetauschte Datei erreicht keinen Hörer.** Spotify holt eine Folge
  einmal, erkannt an ihrer Kennung. Eine zweite Fassung braucht eine erhöhte
  `fassung` – sparsam, sie erzeugt bei jedem Hörer eine „neue Folge".
- Der Feed der **Sendung** liegt auf dem Webspace, nicht in `main`;
  `podcast-schaufenster.yml` bringt Änderungen daran nach draußen.
- **Lernseiten:** Die Abschnitte kommen aus `vorleseAbschnitte()`, die
  Grafiktexte aus `vorlesegrafiken()` – nie aus `figureMeta` allein, sonst
  fehlen 70 gerechnete Beschreibungen. Der Fingerabdruck hängt an ihnen.
  Reihenfolge Beginner → Akademie → Fortgeschritten → Profi. Ohne Aufnahme
  spricht das Gerät – kein Fehler.
- `lese-stimme.yml` läuft nach Zeitplan (23:19 UTC); 12 von 172 Seiten sind
  gesprochen.

→ `ENTSCHEIDUNGEN.md`: „Eine Fallunterscheidung über Merkmale, die der Stoff
nicht hat, ist keine", „Was englisch ist, wird englisch gesprochen",
„Die Lernseiten sprechen mit derselben Stimme wie der Podcast"

## Farbschema

- **Der erste Besuch ist weiß**, ausnahmslos – auch auf einem dunkel
  gestellten Gerät. Die Rangfolge in `startSkript()` (`lib/theme.ts`) hat nur
  zwei Stufen: gespeicherte Wahl, sonst Weiß. `prefers-color-scheme` kommt
  nicht mehr vor.
- **Die Leistenfarbe entsteht per `document.write` im Startskript.** Safari
  liest `theme-color` beim Parsen; jede spätere DOM-Änderung ist wirkungslos
  (viermal nachgemessen). `document.write` schiebt den Text in den Token-Strom
  – der Parser baut das Element selbst, wie bei Quelltext.
- **Drei Stücke, die zusammengehören:** das `document.write`, seine Stellung
  im `<head>` **vor** dem Rückfall, und der Rückfall in `<noscript>` (sonst
  zieht Next ihn nach vorn, und die erste Angabe gewinnt). Jedes einzeln
  entfernt ergibt wieder einen falschen Balken.
- **Der Umschalter lädt die Seite neu.** Ohne Neuladen wird nicht neu geparst
  – die Website navigiert clientseitig, der Balken bliebe die Sitzung falsch.
- `tests/farbschema-start.test.ts` fängt `document.write` auf und lässt
  `head`, `createElement`, `querySelectorAll` **werfen**.
- `colorScheme` steht auf `'light'`, nicht `'light dark'`.
- Am `--c-canvas` des hellen Schemas hängen `LEISTENFARBE` in `lib/theme.ts`
  **und** das App-Icon (`python scripts/app-icon-faerben.py`).

→ `ENTSCHEIDUNGEN.md`: „Der erste Besuch ist weiß"

## Der Alias `@/` gilt auch außerhalb des Bündlers

`scripts/alias-hook.mjs`, eingehängt über `--import`:

    node --experimental-strip-types --import ./scripts/alias-hook.mjs skript.ts

Der Testläufer hängt ihn für alle Tests ein. Vorhandene Umwege dürfen bleiben;
neue braucht es nicht.

## Lehren, die über ihren Fall hinausgehen

Diese Sätze sind aus Fehlern entstanden, die sich in anderer Gestalt
wiederholen. Die Fälle dazu stehen in `ENTSCHEIDUNGEN.md`.

- **Der teuerste Fehler ist nicht der rote Lauf, sondern der stille.**
- **`npm run pruefen` liest `out/`, nicht deine Änderung.** Ohne vorheriges
  `npm run build` prüft es den letzten Bau und meldet grün – am 23. August 2026
  vier Überschriftensprünge glatt durchgelassen, die CI dann fand.
- **Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.** Wer eine baut,
  legt ihr etwas vor, das sie beanstanden **muss**.
- **Eine Fallunterscheidung über Merkmale, die der Stoff nicht hat, ist
  keine.** Zähl nach, wie oft jeder Zweig an echtem Material greift – nicht,
  ob es ihn gibt.
- **Ein Mittelwert kann nichts finden, was er verdünnt.**
- **Ein Riegel ist so gut wie die Quelle, die er fragt.** Wer fragt, ob etwas
  passiert ist, fragt die Gegenwart – nicht den eigenen Arbeitsordner.
- **Eine Grenze, die den guten Tag gerade eben trägt, ist eine Wette.**
- **Wer eine Absicherung entfernt, die etwas anderes verdeckt hat, deckt den
  verdeckten Fehler auf – und zwar erst beim Nutzer.** Beim Streichen einer
  redundanten Stelle gehört geprüft, ob die verbliebene je gearbeitet hat.
- **Wo die einzige prüfbare Umgebung nicht die ist, in der es kaputtgeht, ist
  „müsste jetzt gehen" keine Aussage.** Dann gehört der Weg gewählt, der ohne
  die ungeprüfte Annahme auskommt.
- **Die richtige Frage ist nicht „komme ich an die Seite?", sondern „wer kommt
  an sie, und wie bekomme ich sein Ergebnis?"**
- **Eine Doppelung mit guter Begründung altert trotzdem** – die Begründung
  schützt sie beim Anlegen, nicht danach. Wer eine zweite Stelle stehen lässt,
  schuldet ihr eine Prüfung, die beide vergleicht; sonst wird zusammengeführt.
