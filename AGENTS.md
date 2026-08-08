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
liefert. Er läuft täglich um 01:03 UTC – 3:03 Uhr deutscher Zeit, eine gute
halbe Stunde vor dem Nachrichtenlauf – und lässt sich von Hand starten.

## Die Routine kommt nicht an den Läufer heran

Der Weg über `quellen-holen.yml` setzt voraus, dass man **Workflow-Protokolle
lesen** kann – also `mcp__github__actions_list` und `get_job_logs` hat. In einer
normalen Sitzung ist das so. **Die Sitzung der Nachrichten-Routine bekommt diese
Werkzeuge nicht:** Ihre Liste steht bei der Anlage fest (`allowed_tools`) und
enthält weder `mcp__github__*` noch `ToolSearch`; `update_trigger` hat keinen
Parameter, mit dem sich das nachträglich ändern ließe.

Damit lief die Routine gegen eine Wand: Sie darf recherchieren, erreicht aber
keine Nachrichtenseite (403) und nicht den Läufer, der es könnte. Am 4. August
2026 feuerte sie um 03:34 UTC und legte **nichts** an; die Ausgabe des Tages
entstand von Hand.

**Also kommt der Läufer zu ihr.** `.github/workflows/quellen-sammeln.yml` holt
um 01:13 und 01:23 UTC dieselben Übersichten und legt den Text als `quellen.txt` auf einem
**wurzellosen Zweig `quellen-heute`** ab – nie gebaut, nie veröffentlicht, jeder
Lauf ersetzt ihn vollständig (`push --force`), keine Historie, keine Ansammlung.
Die Routine liest ihn mit `git show origin/quellen-heute:quellen.txt`; `git` und
`Read` hat sie.

Der Satz aus dem Kopf von `quellen-holen.yml` – fremde Texte gehören nicht ins
Repository – bleibt damit gewahrt: Es ist eine einzige, täglich überschriebene
Arbeitsdatei außerhalb von `main`, gekürzt auf die Köpfe der Übersichtsseiten.

## Wann die Nachrichten entstehen – und wann der Podcast

**Die Zusage lautet: 6:00 Uhr deutscher Zeit. Für beides.** Nicht nur für die
Nachrichten, auch für die Folge des Tages – so hat der Betreiber es am 8. August 2026 festgelegt, und alles darunter ist rückwärts davon gerechnet,
nicht gewählt.

Der Fahrplan steht in **deutscher Zeit**, weil die Zusage in deutscher Zeit
gegeben ist. Die Crons in den Workflows stehen in UTC, weil GitHub nichts
anderes kennt; im Sommer sind das zwei Stunden weniger, im Winter eine.

| Deutsche Zeit | UTC   | Was                                                           |
| ------------- | ----- | ------------------------------------------------------------- |
| 03:03         | 01:03 | `quellen-pruefen.yml` – welcher Kanal ist heute offen?        |
| 03:13         | 01:13 | `quellen-sammeln.yml` – legt `quellen-heute` an               |
| 03:23         | 01:23 | `quellen-sammeln.yml` – zweiter Termin                        |
| **03:27**     | 01:27 | `nachrichten-agent.yml` – der Agent schreibt den **Entwurf**  |
| **03:41**     | 01:41 | zweiter Anlauf des Agenten                                    |
| **03:57**     | 01:57 | `nachrichten.yml` – prüfen, bauen, senden → **live ab 04:30** |
| **04:17**     | 02:17 | zweiter Anlauf, falls der erste verworfen wurde               |
| ab 04:07      | 02:07 | `kurse.yml` stößt den Nachrichtenlauf an, falls er ausfiel    |
| **04:47**     | 02:47 | dritter Anlauf – der letzte, der 6:00 noch schafft            |
| **04:53**     | 02:53 | `podcast-erzeugen.yml` – Text, Stimme, Video, Upload          |
| **~05:36**    | 03:36 | **die Folge ist online** – rund 25 Minuten vor der Frist      |
| ab 05:07      | 03:07 | `kurse.yml` stößt den Podcast an, falls er ausfiel            |
| 05:11         | 03:11 | `ausgabe-waechter.yml` – der Alarm kommt **vor** der Frist    |
| 07:41         | 05:41 | `paket-bauen.yml` – der nächtliche Bau, unabhängig davon      |
| 07:51         | 05:51 | `betriebsuebersicht.yml` – sechs Zeilen: steht alles?         |

Die Routine **„Zeitumstellung"** zieht sie zweimal im Jahr gemeinsam um eine
Stunde nach. Wer eine Zeit ändert, ändert alle.

### Am Wochenende erscheint keine Folge – außer an einem Probetag

`podcast-erzeugen.yml` läuft werktags. Das ist gewollt: Die Montagsfolge deckt
Freitag bis Montag ab.

Damit lässt sich der volle Weg **bis zum Upload** an einem Wochenende aber
nicht prüfen, und ein Lauf mit `nur_proben` überspringt genau die Schritte, auf
die es ankommt – YouTube und Server. Dafür gibt es
`data/podcast-probetage.txt`: Steht der heutige Tag dort, gilt er als Werktag,
und es wird wirklich veröffentlicht.

Zwei Wege stoßen ihn an, wie überall hier: der eigene Sonntags-Cron um 02:53
UTC und, falls der verworfen wird, der Anstoß aus `kurse.yml` um 03:08. Ohne
Eintrag endet der Sonntagslauf nach zwanzig Sekunden.

Die Daten tragen das Jahr. Ein stehengebliebener Eintrag kann deshalb nicht
im nächsten Jahr erneut feuern; alte Zeilen sind Protokoll.

**Soll die Folge später täglich erscheinen**, ist das eine Zeile: `1-5` wird
`*`, der Sonntags-Cron und der Riegel fallen weg. Bis dahin bleibt es bei
werktags.

### Wie sich das rechnet

Gemessen am 8. August 2026, nicht geschätzt:

- **Nachrichtenlauf** 20–25 Minuten, **Paketbau samt Übertragung** 6 Minuten.
  Der letzte Start, der 6:00 noch hält, ist damit 04:47 deutscher Zeit.
- **Podcast**: Text 1 Minute, Stimme rund 25 (vier Läufer gleichzeitig, seit
  den kürzeren Stücken eher mehr), Video und Upload 5, Paketbau 6. Macht gut
  37 Minuten – Start 04:53, fertig gegen 05:36.

Der Podcast **muss nach der Nachrichtenausgabe laufen**: Er vertont die
Tagesausgabe, und ohne sie hat er nichts zu sprechen. Deshalb liegt sein
Termin hinter dem dritten Anlauf des Nachrichtenlaufs und nicht davor.

### Der Fehler, aus dem diese Tabelle entstanden ist

Bis zum 8. August 2026 stand der Podcast auf 04:53 **UTC** – also 6:53 Uhr
deutscher Zeit. Online wäre er damit gegen halb acht gewesen, fast zwei
Stunden nach der Zusage. Die Nachrichten hielten ihre Frist, der Podcast
konnte sie nie halten, und niemandem war es aufgefallen, weil die Tabelle
nur UTC nannte und 04:53 neben 04:00 harmlos aussieht.

**Deshalb steht die deutsche Zeit hier vorn.** Eine Frist, die in deutscher
Zeit gegeben ist, prüft man nicht in UTC.

## Der Agent schreibt, der Läufer veröffentlicht

Das ist seit dem 6. August 2026 die Arbeitsteilung, und sie ist der Kern des
Ganzen.

**Was sich nicht rechnen lässt:** aus „07:04 Siemens erzielt
Rekordauftragseingang" einen Artikel machen. Den Lehrwinkel wählen, selbst
formulieren, die Begründung weglassen, die in der Meldung nicht steht. Dafür
muss ein Modell die rund 100.000 Zeichen der Quellendatei lesen.
`scripts/nachrichten-aus-bestand.ts` kann Zahlen ordnen, aber keine
Nachrichten schreiben – es ist ein Notbehelf und nichts sonst.

**Wo das Modell läuft, ist die entscheidende Frage.** Drei Antworten wurden
probiert:

| Weg                         | Kosten       | Protokoll einsehbar | Netzzugang | Bilanz                      |
| --------------------------- | ------------ | ------------------- | ---------- | --------------------------- |
| Sitzungs-Routine            | im Abo       | **nein**            | nein (403) | 7 von 7 Tagen ohne Ergebnis |
| Anthropic-Schnittstelle     | ~0,20 $/Lauf | ja                  | –          | läuft, kostet               |
| **`nachrichten-agent.yml`** | **im Abo**   | **ja**              | **voll**   | der Weg                     |

`anthropics/claude-code-action` startet den Agenten **auf dem Läufer**. Der
Eingabewert `claude_code_oauth_token` erlaubt die Anmeldung über ein
bestehendes Pro- oder Max-Abonnement statt über einen API-Schlüssel – erzeugt
wird er einmalig mit `claude setup-token` und liegt als Repository-Secret
`CLAUDE_CODE_OAUTH_TOKEN`.

Damit fallen beide Nachteile der Routine weg: Jeder Schritt steht im
Protokoll, ein Fehlschlag ist ein roter Lauf mit Mail, und der Läufer kommt
ins Netz – der Agent kann Quellen selbst nachschlagen statt nur die
gesammelte Datei zu lesen.

Die Sitzungs-Routine ist deshalb stillgelegt. Sie war derselbe Gedanke ohne
die Sichtbarkeit.

**Der Agent veröffentlicht nicht.** Er legt `entwurf.json` auf dem
wurzellosen Zweig `nachrichten-entwurf` ab – aber erst, nachdem ein
**eigener** Schritt danach die Probe unabhängig wiederholt hat. Ein
ungeprüfter Entwurf wäre gefährlicher als keiner: `nachrichten.yml` würde ihn
nehmen, und der Build bräche zwei Stunden später.

`nachrichten.yml` um 02:57 hat damit drei Wege, in dieser Rangfolge:

1. **Entwurf vom Agenten** – recherchiert, im Abo enthalten, der Regelfall
2. **Modell über die Schnittstelle** – dasselbe Ergebnis, ~0,20 $, braucht
   `ANTHROPIC_API_KEY`
3. **Bestand** – Marktzahlen statt Meldungen, ausdrücklich ein Notbehelf

Wer hier etwas ändert, ändert nichts an dieser Reihenfolge. Weg 3 ist der
Grund, warum nie „gar nichts" dasteht; Weg 1 der Grund, warum er selten
gebraucht werden sollte.

Zur Selbstprüfung eines Entwurfs dient dieselbe Probe, die beide Workflows
fahren:

```
ANTWORT_DATEI=entwurf.json QUELLENDATEI=quellen.txt \
  STICHTAG=$(date -u +%Y-%m-%d) NUR_PRUEFEN=1 \
  node --experimental-strip-types scripts/nachrichten-erzeugen.ts
```

## Warum die Ausgabe aus einem Workflow kommt und nicht aus einer Routine

Bis zum 5. August 2026 lag die Aufgabe bei einer Sitzungs-Routine. Nachgezählt:
Von den fünf Ausgaben zwischen dem 31. Juli und dem 4. August kam **keine
einzige** aus ihr. Alle fünf entstanden in einer interaktiven Sitzung und
wurden über einen Pull Request gemergt.

Der Grund ließ sich von hier aus nicht beheben: Die Sitzung einer Routine
bekommt eine feste Werkzeugliste ohne `mcp__github__*`, erreicht damit weder
eine Nachrichtenseite (403) noch den Läufer, der es könnte – und **ihre
Protokolle sind nicht einsehbar.** Was sich nicht diagnostizieren lässt, lässt
sich nicht reparieren.

`nachrichten.yml` dreht die Abhängigkeit um: Der Läufer holt die Quellen, ruft
das Modell über die Anthropic-Schnittstelle, prüft das Ergebnis gegen dieselben
Regeln wie der Build und schreibt die Dateien. Alles steht im Protokoll, jeder
Fehlschlag ist ein roter Lauf.

## Der Schlüssel ist eine Verbesserung, keine Bedingung

Das Repository-Secret `ANTHROPIC_API_KEY` war bis zum 5. August 2026 die
Voraussetzung dafür, dass `nachrichten.yml` überhaupt etwas schreiben konnte.
Damit hing die Zusage „die Nachrichten stehen morgens" an einer laufenden
Rechnung — bei Opus 5 rund 15 $ im Monat, bei Sonnet 5 rund 6 $.

Das ist aufgelöst. `scripts/nachrichten-aus-bestand.ts` rechnet die Ausgabe aus
den Momentaufnahmen unter `data/snapshots/`: Leitindizes, Marktbreite, Zins
gegen Inflation, Gold in zwei Währungen, die Spanne unter den Aktien. Fünf
Artikel, kein Netzzugang, kein Modell, keine Kosten — und jede Zahl mit
Stand-Zeitpunkt belegt. Die Ausgabe geht als JSON über `ANTWORT_DATEI` in
`nachrichten-erzeugen.ts` und durch **dieselbe** Prüfung wie eine recherchierte.

Damit gilt: mit Schlüssel eine bessere Ausgabe an Ausfalltagen (rund 0,20 $ je
Lauf mit Sonnet, und nur dann), ohne Schlüssel eine schmalere — aber nie mehr
keine. Wer den Schlüssel hinterlegt, tut es in Settings → Secrets and variables
→ Actions; er gehört nie in einen Chat und nie in ein Protokoll.

**Was dieser Weg nicht kann:** Er nennt keine Ursachen. Aus einer Kursdatei
geht hervor, _dass_ sich etwas bewegt hat, nicht _warum_. Jeder Artikel daraus
sagt das ausdrücklich, statt eine plausible Begründung zu erfinden — das ist
die Grundregel des Projekts, und sie gilt hier genauso.

Die Prüfung in `scripts/nachrichten-erzeugen.ts` spiegelt bewusst die Regeln
aus `lib/news-validate.ts` **und** `lib/editions-validate.ts` **und**
`npm run pruefen`. Drei davon sind erst durch die Trockenprobe aufgefallen –
Mindestlänge von `whyItMatters` und `summary`, und die Eindeutigkeit von Titel,
Meta-Titel und Anreißer. Wer eine Regel im Build ändert, ändert sie hier mit;
sonst schreibt der Lauf eine Ausgabe, an der zehn Minuten später der Build
scheitert.

`ANTWORT_DATEI` ersetzt den Modellaufruf durch eine JSON-Datei. Damit lässt
sich der ganze Weg bis zum fertigen Build ohne Schnittstelle proben – genau so
sind die drei fehlenden Regeln gefunden worden.

## Warum es Auffangnetz und Wächter gibt

Am 5. August 2026 nachgezählt: Von den fünf Ausgaben zwischen dem 31. Juli und
dem 4. August kam **keine einzige aus der Routine.** Alle fünf entstanden in
einer interaktiven Sitzung und wurden über einen Pull Request gemergt – die
Automatik lief jeden Morgen, lieferte nichts, und niemand erfuhr davon.

Der teuerste Fehler dieses Projekts ist nicht der rote Lauf, sondern der
stille. Deshalb liegen jetzt drei Dinge übereinander:

1. **Mehr als eine Gelegenheit für den Sammler.** `quellen-sammeln.yml` hat
   zwei eigene Termine, und `quellen-pruefen.yml` stößt ihn am Ende zusätzlich
   an. Es müssen drei Wege gleichzeitig ausfallen, damit die Quellendatei
   fehlt. Der Lauf dauert zwanzig Sekunden – Redundanz kostet hier nichts.
2. **Ein zweiter Anlauf auf einem Läufer** (`nachrichten.yml`, 02:17 UTC). Er
   prüft zuerst, ob die Ausgabe schon steht, und hört dann auf – zwei Ausgaben
   zum selben Datum brechen den Build ab. Kommt er zum Zug, kann er **nicht
   ergebnislos enden**: Fehlt der Schlüssel oder die Quellendatei, rechnet
   `nachrichten-aus-bestand.ts` die Ausgabe aus dem eigenen Datenbestand.
   Die Routine „Auffangnetz“ ist dafür stillgelegt worden – zwei
   Sitzungen mit überlappender Laufzeit waren ein Risiko ohne Gegenwert.
3. **Ein Wächter, der aus dem stillen Ausfall einen lauten macht.**
   `ausgabe-waechter.yml` prüft um 03:11 UTC – 5:11 Uhr deutscher Zeit, also
   **vor** der Frist –, ob Ausgabendatei,
   Registereintrag und mindestens ein Artikel mit dem heutigen `publishedAt`
   vorhanden sind, und färbt den Lauf sonst rot. Ein roter Lauf schickt eine
   Mail, und die kommt an – über genau diesen Kanal sind die Paketbau-Fehler
   aufgefallen.

Wer hier etwas ändert, lässt Punkt 3 stehen. Die anderen beiden sind Versuche,
das Problem zu lösen; der Wächter ist die Zusicherung, dass ein Scheitern
auffällt.

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

## Geplante Läufe werden hier **regelmäßig** verworfen, nicht gelegentlich

Der Abschnitt oben nennt den 3. August als Einzelfall. Das war zu freundlich.
Am 6. August 2026 nachgezählt, über alle `schedule`-Läufe des Tages:

**Genau einer wurde ausgeführt** – der Kursabruf um 04:24 UTC. Verworfen
wurden die Quellenprobe (03:03), beide Termine des Quellensammlers (03:07 und
03:17), der Nachrichtenlauf (04:47), der Wächter (05:19) und der Paketbau
(05:41). Am Vortag liefen sie, aber massiv verspätet: 03:03 wurde **05:49**,
03:07 wurde **05:59**, 05:09 wurde **07:45** – rund zweidreiviertel Stunden.

Krumme Minuten helfen dagegen nicht. Sie waren die richtige Maßnahme gegen
Läufe, die _zur vollen Stunde_ kollidieren; gegen eine Warteschlange, die
Stunden lang steht, sind sie wirkungslos.

**Daraus folgt eine Bauregel:** Was zu einer bestimmten Zeit passiert sein
_muss_, darf nicht an `schedule` hängen. `kurse.yml` läuft fünfzehn- bis
zwanzigmal am Tag; dass **alle** verworfen werden, ist ungleich
unwahrscheinlicher als dass ein einzelner Termin ausfällt. Deshalb prüft sein
letzter Schritt seit dem 6. August, ob die Ausgabe des Tages steht, und stößt
`nachrichten.yml` sonst über `workflow_dispatch` an.

Die Abhängigkeit ist damit umgedreht: Nicht die Uhr startet den
Nachrichtenlauf, sondern der erste Kursabruf des Tages, der die Lücke
bemerkt. Ein überflüssiger Anstoß kostet vierzig Sekunden – `nachrichten.yml`
prüft als Erstes, ob die Ausgabe schon steht.

Wer einen neuen Lauf anlegt, dessen Ergebnis jemand vermissen würde, hängt
ihn an dieselbe Kette statt an eine Uhrzeit.

## Ein Commit vom Bot löst nichts aus

Die zweite Hälfte desselben Problems, und die teurere: **Ein Push, den ein
Workflow mit dem `GITHUB_TOKEN` macht, startet keinen weiteren Workflow.**
GitHub verhindert damit Endlosschleifen. Es gibt dafür keine Meldung – nur
einen Commit auf `main`, hinter dem nichts passiert.

Am 4. August 2026 nachgezählt: Von sechzig Läufen des Paketbaus zwischen dem 30. Juli und dem 3. August war **kein einziger** durch einen Kurs-Commit
ausgelöst. Alle zwölf Push-Läufe stammten von einem Merge durch den Betreiber.
Neun Kurs-Commits vom 3. August (15:12 bis 22:43 UTC) erzeugten zusammen keinen
Bau.

Nach außen sah das aus wie „die Charts aktualisieren nicht": Im Repository
standen die Kurse richtig, auf der Website stand der Stand des letzten Merges.
Zeitplan, Leitwerte-Aufteilung, Preis-Modus – alles davon war für die
Sichtbarkeit ohne Wirkung, solange niemand von Hand mergte.

Ausgenommen von der Sperre sind **`workflow_dispatch` und
`repository_dispatch`**. Deshalb stößt `kurse.yml` den Paketbau jetzt
ausdrücklich an (`gh workflow run paket-bauen.yml`, dafür `permissions:
actions: write`), statt sich auf den Push zu verlassen.

**Wer einen Workflow schreibt, der Daten nach `main` committet, muss den
Neubau selbst anstoßen.** Betroffen sind auch `fundamentaldaten.yml`,
`laender.yml`, `podcast.yml`, `quartalstermine.yml`, `zinsen.yml` und
`quellenlinks.yml`; sie kommen bisher über den nächtlichen Bau um 05:09 UTC
mit, der seit dem 4. August ebenfalls veröffentlicht.

Und in `paket-bauen.yml` hängt die Veröffentlichung seither am **Zweig**, nicht
am Anlass: `main` und kein Pull Request. Die frühere Bedingung
`event_name == 'push'` hätte jeden dieser Wege still ins Leere laufen lassen.

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

# Selbst mergen, ohne zu fragen

Der Betreiber hat es am 8. August 2026 angeordnet: **„Merge ab jetzt alles von
selber in Zukunft, das ist schneller und effektiver."** Also nicht mehr den
Pull Request aufmachen und auf ein „ja“ warten — aufmachen, Prüfungen abwarten,
mergen, weiterarbeiten.

Der Grund liegt auf der Hand, wenn man die Ausgaben vom 31. Juli bis 4. August
nachzählt: Alle fünf entstanden in einer Sitzung und lagen dann als Pull
Request herum, bis jemand von Hand mergte. Der Bau hing nicht am Können,
sondern am Warten.

**Zwei Grenzen bleiben:**

1. **Nur bei grünen Prüfungen.** „Bauen und prüfen“ muss durch sein. Ein Merge
   geht hier auf eine öffentliche Website; ein roter Lauf, den man durchwinkt,
   steht zwanzig Minuten später online.
2. **Nichts, was man selbst für kaputt hält.** Grün ist eine Bedingung, kein
   Freibrief. Wer beim Schreiben ein ungutes Gefühl hat, schreibt es in den
   Pull Request und fragt — das ist keine Rückfrage zum Mergen, sondern zur
   Sache.

Löschen oder Überschreiben von Bestand, Zugangsdaten und alles, was sich nicht
zurücknehmen lässt, fällt weiter **nicht** hierunter. Die Anordnung galt dem
Mergen.

## Auto-Merge einschalten, direkt beim Anlegen

**Bei jedem Pull Request `enable_pr_auto_merge` aufrufen, sofort nach
`create_pull_request`.** Dann mergt GitHub selbst, sobald „Bauen und prüfen“
grün ist.

Der Grund ist ein Fehler vom 9. August 2026: Bei #160 stand im Chat „ich
merge, sobald der Check grün ist“ – und dann endete der Zug. Der PR lag, bis
der Betreiber ihn von Hand mergte. Bei #157 bis #159 hatte dieselbe Sitzung
gewartet und gemergt; es hing also an nichts als der Aufmerksamkeit.

Auto-Merge nimmt genau diese Abhängigkeit heraus. Der Betreiber hat es am
9. August im Repository freigeschaltet (Settings → General → Pull Requests →
Allow auto-merge).

Das ersetzt das Warten nicht, wo es um etwas geht: Bei einer Änderung, deren
Wirkung man sehen will, bleibt man dran und schaut nach. Es ist ein Netz für
den Fall, dass man es nicht tut.

## Nebenwirkung: `workflow_dispatch` braucht `main`

GitHub startet über `workflow_dispatch` nur Workflows, die auf der
Standardverzweigung liegen. Ein neuer Workflow auf einem Nebenzweig antwortet
mit **404**, und das sieht aus wie „gibt es nicht“ statt wie „noch nicht
gemergt“. Wer einen Workflow zum Starten von Hand braucht, muss ihn erst nach
`main` bringen — `zinsen.yml` hing genau daran.
