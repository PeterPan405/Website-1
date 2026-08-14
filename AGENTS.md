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

## Arbeitsweise

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

→ `ENTSCHEIDUNGEN.md`: „Selbst mergen, ohne zu fragen"

## Diese Umgebung erreicht nur GitHub

`WebFetch` und `curl` scheitern an **jeder** Adresse außer GitHub und npm
(`CONNECT tunnel failed, response 403`) – auch an `iminvests.de` selbst. Das
ist eine Regel der Umgebung, kein Fehler; prüfbar mit
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

**Der Ausweg: ein Läufer holt es.** GitHub-Läufer haben vollen Netzzugang.

- `.github/workflows/quellen-holen.yml` – nimmt Adressen, holt sie, schreibt
  den Text ins Protokoll. Lesbar über `actions_list` + `get_job_logs`.
- `.github/workflows/quellen-sammeln.yml` – legt `quellen.txt` auf den
  wurzellosen Zweig `quellen-heute`; zu lesen mit
  `git show origin/quellen-heute:quellen.txt`.
- **Wer einen Lauf baut, dessen Ergebnis eine Datei ist, legt sie auf einen
  wurzellosen Zweig** – nicht nur als Artefakt. Ein Artefakt ist ein ZIP
  hinter einer Anmeldung und von hier aus unerreichbar.

**Suchergebnisse sind kein Ersatz für eine gelesene Quelle.**

→ `ENTSCHEIDUNGEN.md`: „Diese Umgebung erreicht nur GitHub"

## Nachrichten

- **„Aktuell" heißt der jüngste Erscheinungstag**, nicht eine Anzahl.
  Maßgeblich ist `tagVon()` in `lib/news.ts` – die ersten zehn Zeichen von
  `publishedAt`, kein Umweg über `new Date`. Die Regel gilt an **jeder**
  Stelle: `getCurrentNews()`, `getFurtherNews()`, `getFurtherNewsByDay()`.
  `CURRENT_NEWS_COUNT` ist nur noch eine Anzeigegrenze.
- **Ausnahme Karussell:** `getNewsHeadlines()` zeigt die **zwei** jüngsten
  Erscheinungstage. Nutzerwunsch – nicht „zurückreparieren".
- **Das Archiv ist zugeklappt**, jeder Tag, auch der jüngste. Kein `<details>`
  in `app/news/page.tsx` trägt `open`.
- **Eine Tagesausgabe** braucht `data/editions/JJJJ-MM-TT.ts`, eingetragen in
  `data/editions/index.ts` – Import **und** Array. Mindestens eine
  Top-Meldung, mindestens drei insgesamt, `intro` 110–165 Zeichen.
- **Die Termine des Tages gehören hinein** – Konjunkturdaten, Notenbanken,
  Quartalszahlen der großen Werte, mit Uhrzeit, wo sie in den Quellen steht.
  Nur was in den Quellen steht. Die Anweisung steht in
  `scripts/nachrichten-erzeugen.ts` **und** `nachrichten-agent.yml`; wer eine
  ändert, ändert beide.
- **Umfang:** fünf bis zehn Artikel aus mehreren Quellen zu mehreren Themen.
- **Keine erfundenen Meldungen, keine erfundenen Zahlen, keine Quelle, die
  niemand gesehen hat.** Steht in der Meldung kein Warum, schreibst du kein
  Warum – und sagst das ausdrücklich.
- Eine Adresse, die niemand abgerufen hat, gehört nicht in
  `data/nachrichtenquellen.ts`.

**Die Rangfolge, aus der die Ausgabe entsteht** (in `nachrichten.yml`):

1. Entwurf vom Agenten (`nachrichten-agent.yml`, im Abo) – der Regelfall
2. Modell über die Anthropic-Schnittstelle (~0,20 $, braucht `ANTHROPIC_API_KEY`)
3. `nachrichten-aus-bestand.ts` – Marktzahlen statt Meldungen, ein Notbehelf

An dieser Reihenfolge wird nichts geändert. Der Notbehelf wird durch einen
frischen Entwurf ersetzt, solange der Podcast ihn noch nicht vertont hat.
Erkannt wird er an seinen Quellen: unter der Hälfte externer Verweise.

Die Prüfung in `scripts/nachrichten-erzeugen.ts` spiegelt `lib/news-validate.ts`,
`lib/editions-validate.ts` und `npm run pruefen`. **Wer eine Regel im Build
ändert, ändert sie dort mit.**

→ `ENTSCHEIDUNGEN.md`: „heißt der jüngste Erscheinungstag", „Der Agent
schreibt, der Läufer veröffentlicht", „Warum es Auffangnetz und Wächter gibt"

## Der Fahrplan – Zusage ist 6:00 Uhr deutscher Zeit, für Nachrichten und Folge

| Deutsche Zeit | UTC   | Was                                                          |
| ------------- | ----- | ------------------------------------------------------------ |
| 02:03         | 00:03 | `quellen-pruefen.yml` – welcher Kanal ist heute offen?       |
| 02:09 / 02:29 | 00:09 | `quellen-sammeln.yml` – legt `quellen-heute` an              |
| **02:33**     | 00:33 | `nachrichten-agent.yml` – der Agent schreibt den **Entwurf** |
| **↳ sofort**  | –     | der Agent **stößt den Nachrichtenlauf an**                   |
| 03:03 / 03:33 | 01:03 | zweiter und dritter Anlauf des Agenten                       |
| **↳ ~03:00**  | 01:00 | `nachrichten.yml` – prüfen, bauen, senden → live ab ~03:20   |
| **↳ sofort**  | –     | der Nachrichtenlauf **stößt den Podcast an**                 |
| **~04:00**    | 02:00 | **die Folge ist online**                                     |
| 03:13 … 04:47 | 01:13 | `nachrichten.yml` als Cron – vier Rückfalltermine            |
| 03:53 / 04:33 | 01:53 | `podcast-erzeugen.yml` als Cron – zwei Rückfalltermine       |
| ab 03:00      | 01:00 | `kurse.yml` stößt an, was fehlt – siebzehnmal am Tag         |
| 05:11         | 03:11 | `ausgabe-waechter.yml` – der Alarm kommt **vor** der Frist   |
| 07:41         | 05:41 | `paket-bauen.yml` – der nächtliche Bau                       |
| 07:51         | 05:51 | `betriebsuebersicht.yml` – steht alles?                      |

- **Die Kette hängt aneinander, nicht an der Uhr.** Jedes Glied stößt das
  nächste an; die Crons sind nur Rückfall. Wer hier etwas ändert, lässt die
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
  hängen.** Wer einen Lauf anlegt, dessen Ergebnis jemand vermissen würde,
  hängt ihn an die Kette statt an eine Uhrzeit.
- **Krumme Minuten.** Wer einen neuen Workflow anlegt, sucht sich eine Minute,
  die noch keiner hat – runde Minuten sind am dichtesten belegt.
- **Ein Commit vom Bot löst nichts aus.** Ein Push mit dem `GITHUB_TOKEN`
  startet keinen weiteren Workflow. Wer Daten nach `main` committet, stößt den
  Neubau selbst an (`gh workflow run`, dafür `permissions: actions: write`).
- **Zu jedem Lauf, der etwas nach außen gibt, gehört die Frage: Steht das
  Ergebnis des Tages schon?** Gefragt wird `origin/main` von **jetzt**
  (`git fetch` + `git show`), nicht der Checkout – der ist eine Momentaufnahme
  vom Auslösen.
- **Ein Riegel ist so gut wie die Quelle, die er fragt.** Wer prüft, ob etwas
  veröffentlicht wurde, fragt dort nach, wo es veröffentlicht wird – der
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
- Einmal täglich laufende Workflows bleiben hart: Ein Fehlschlag heißt dort
  „heute gibt es keine Folge", und dafür ist eine Mail richtig.

**Wer eine Meldung leiser stellt, baut die Gegenprobe dazu.** `kurse.yml`
prüft deshalb bei jedem Lauf den Bauzeitpunkt aus `version.txt`: ab 10 Stunden
Warnung und ein Bau, ab 18 Stunden rot.

→ `ENTSCHEIDUNGEN.md`: „Ein roter Lauf ist ein Vorrat"

## Kurse

**Ein Kurs ist so alt wie die Stelle, die ihn anzeigt** – nicht wie der Abruf.
Zusage: höchstens sechs Minuten.

- **Es gibt keine Kurse zweiter Klasse.** Wer eine Zahl zeigt, die sich
  stündlich ändert, liest sie aus `lib/kurse-live-speicher.ts` – nicht aus
  einem eigenen `fetch`. Die drei Stellen heute:
  `components/markets/Kachelzahlen.tsx`, `Zeilenzahlen.tsx`, `KursLive.tsx`.
- `lib/leitwerte.ts` bestimmt, was der Fünf-Minuten-Lauf holt – alle 46
  Kacheln der Übersicht.
- `.github/workflows/kurse-dauerlauf.yml` bringt seine Uhr selbst mit: ein
  Job, fünfeinhalb Stunden, alle zwei Minuten der volle Bestand. **Zwei
  Bremsen dürfen nicht wegfallen:** kein Nachfolger unter zehn Minuten
  Laufzeit, und der Wächter in `kurse.yml` wartet nach einem Fehlschlag eine
  Stunde.
- Wer `ABSTAND_MS` anfasst, fasst den Dauerbetrieb bei Yahoo mit an.
- **Eine Ausnahme für eine Quelle gehört an die Bedingung, die sie meint** –
  nicht an die nächstgelegene. Die EZB-Sonderbehandlung greift nur im
  Fünf-Minuten-Lauf (`NUR_LEITWERTE`), und ihr Referenzkurs wird nicht von
  `ohneHeute()` verworfen.
- Rohstoffe kommen bei Yahoo verzögert. Die Stand-Zeile nennt den Zeitstempel
  der **Quelle**, nicht den des Abrufs.

→ `ENTSCHEIDUNGEN.md`: „Ein Kurs ist so alt wie die Stelle, die ihn anzeigt"

## Stimme, Podcast und Vorlesefassungen

- **Die Pause hängt an der Satzlänge**, nicht am Satzzeichen. Absatzende
  bleibt bei 0,95 s (danach sucht der Kapitelschritt), der Mittelwert der
  Satzpausen bei rund einer halben Sekunde. Beides prüft
  `python scripts/sprechstimme.py --selbsttest`.
- **Der Selbsttest läuft vor dem Sprechen** – in `podcast-erzeugen.yml`,
  `lese-stimme.yml`, `aufnahmen-nachpruefen.yml`.
- **Geprüft wird die fertige Aufnahme, nicht das einzelne Stück.**
  `sprechstimme.nachbessern()` läuft nach dem Zusammenfügen und dämpft
  auffällige Stellen, statt sie nur zu melden.
- `sprechstimme.py` und `stimme-erzeugen.py` stehen noch doppelt da: **Wer an
  Pausen, Stücklänge oder Frist etwas ändert, ändert es an beiden Stellen.**
- **Was englisch ist, wird englisch gesprochen** – `ENGLISCHE_NAMEN` in
  `lib/sprechfassung.ts`, zuerst angewandt, zusammengesetzte Ausdrücke vor
  ihren Bestandteilen. Nicht hinein gehört, was im Deutschen deutsch
  gesprochen wird („ETF", „KI", „Broker", „Bond", „Trend").
- **Gesprochen wird gebeugt:** `ordnungszahlenSprechbar()`. Wer eine weitere
  Stelle baut, an der Text gesprochen wird, führt ihn durch dieselbe Funktion.
- **Eine ausgetauschte Datei erreicht keinen Hörer.** Spotify holt eine Folge
  einmal, erkannt an ihrer Kennung. Eine zweite Fassung braucht eine erhöhte
  `fassung` – sparsam, sie erzeugt bei jedem Hörer eine „neue Folge".
- Der Feed der **Sendung** liegt auf dem Webspace, nicht in `main`;
  `podcast-schaufenster.yml` bringt Änderungen daran nach draußen.
- **Lernseiten:** Die Abschnitte kommen aus `vorleseAbschnitte()`, nicht aus
  einer zweiten Zerlegung. Der Fingerabdruck hängt an ihnen. Reihenfolge
  Beginner → Akademie → Fortgeschritten → Profi. Eine Seite ohne Aufnahme ist
  kein Fehler – dann spricht das Gerät.
- Der Zeitplan in `lese-stimme.yml` ist **auskommentiert und wartet**, bis die
  Inhalte stehen. Er ist nicht kaputt.

→ `ENTSCHEIDUNGEN.md`: „Eine Fallunterscheidung über Merkmale, die der Stoff
nicht hat, ist keine", „Was englisch ist, wird englisch gesprochen",
„Die Lernseiten sprechen mit derselben Stimme wie der Podcast"

## Farbschema

- **Der erste Besuch ist weiß**, ausnahmslos – auch auf einem dunkel
  gestellten Gerät. Die Rangfolge in `startSkript()` (`lib/theme.ts`) hat nur
  zwei Stufen: gespeicherte Wahl, sonst Weiß. `prefers-color-scheme` kommt
  nicht mehr vor.
- **`app/layout.tsx` liefert keine `themeColor` aus.** Safari liest
  `theme-color` beim Parsen und danach nie wieder; eine Angabe im HTML wäre
  endgültig und auf einem Gerät mit dunklem Schema ein heller Balken über
  schwarzer Seite. Angelegt wird sie nur vom Startskript – Safari färbt dann
  nach dem Seitenhintergrund, Chromium wertet den Knoten aus.
  `tests/farbschema-start.test.ts` hält das fest.
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
