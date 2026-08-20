# Entscheidungen und ihre Vorgeschichte

Hier steht, **warum** die Regeln in `AGENTS.md` so lauten: was schiefging, was
nachgezählt wurde, welcher Weg verworfen wurde und woran er scheiterte.

## Wozu diese Datei

`AGENTS.md` wird bei **jedem Zug** mitgeschickt – in jeder Sitzung und in
jedem Agentenlauf. Sie war am 14. August 2026 rund 90.000 Zeichen groß, also
etwa 22.500 Token, die gelesen werden, bevor irgendjemand irgendetwas tut.
Zum Vergleich: Der ganze Prompt, mit dem der Agent die Nachrichten schreibt,
ist ein Sechstel davon.

Gekürzt wurde deshalb nichts. Getrennt wurde: **Regeln** stehen in
`AGENTS.md` und laufen mit, **Begründungen** stehen hier und werden gelesen,
wenn jemand sie braucht.

## Wann du hier nachschlägst

**Bevor du eine Regel aus `AGENTS.md` änderst oder für überflüssig hältst.**
Fast jede von ihnen ist die Antwort auf einen Fehler, der Geld, eine Folge
oder einen Tag gekostet hat, und fast jede sieht ohne ihre Vorgeschichte nach
einer willkürlichen Einschränkung aus. Genau das ist die Falle: Der
naheliegende Umbau ist oft der, der schon einmal danebenging.

Die Abschnittsüberschriften sind dieselben wie die Verweise in `AGENTS.md`.

---

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

| Deutsche Zeit | UTC   | Was                                                            |
| ------------- | ----- | -------------------------------------------------------------- |
| 02:03         | 00:03 | `quellen-pruefen.yml` – welcher Kanal ist heute offen?         |
| 02:09 / 02:29 | 00:09 | `quellen-sammeln.yml` – legt `quellen-heute` an, zwei Termine  |
| **02:33**     | 00:33 | `nachrichten-agent.yml` – der Agent schreibt den **Entwurf**   |
| **↳ sofort**  | –     | der Agent **stößt den Nachrichtenlauf an**                     |
| 03:03 / 03:33 | 01:03 | zweiter und dritter Anlauf des Agenten                         |
| **↳ ~03:00**  | 01:00 | `nachrichten.yml` – prüfen, bauen, senden → **live ab ~03:20** |
| **↳ sofort**  | –     | der Nachrichtenlauf **stößt den Podcast an**                   |
| **~04:00**    | 02:00 | **die Folge ist online** – zwei Stunden vor der Frist          |
| 03:13 … 04:47 | 01:13 | `nachrichten.yml` als Cron – vier Rückfalltermine              |
| 03:53 / 04:33 | 01:53 | `podcast-erzeugen.yml` als Cron – zwei Rückfalltermine         |
| ab 03:00      | 01:00 | `kurse.yml` stößt an, was fehlt – siebzehnmal am Tag           |
| 05:11         | 03:11 | `ausgabe-waechter.yml` – der Alarm kommt **vor** der Frist     |
| 07:41         | 05:41 | `paket-bauen.yml` – der nächtliche Bau, unabhängig davon       |
| 07:51         | 05:51 | `betriebsuebersicht.yml` – sechs Zeilen: steht alles?          |

### Die Kette hängt aneinander, nicht an der Uhr

**Das ist die Umstellung vom 11. August 2026, und sie ist der Kern der
Zusage.** Vorher stand jedes Glied auf einem eigenen Cron und hoffte, dass
das vorige rechtzeitig fertig war. An dem Morgen ging das schief:

    02:53 UTC   Termin des Podcasts
    04:07 UTC   ausgeführt – 74 Minuten zu spät
    06:20 UTC   die Folge war oben, 8:20 deutscher Zeit

Seither stößt jedes Glied das nächste an, sobald es fertig ist: der Agent
den Nachrichtenlauf, der Nachrichtenlauf den Podcast. Die Crons bleiben als
Rückfall stehen – vier für die Nachrichten, zwei für die Folge –, aber der
Regelweg wartet auf niemanden.

Gerechnet mit dem ersten Agententermin um 02:33 deutscher Zeit ist die Folge
gegen 04:00 online. Selbst wenn **alles** danebengeht und erst der letzte
Rückfalltermin um 04:47 greift, sind es 05:24 – immer noch vor der Frist.

Wer hier etwas ändert, lässt die Anstöße stehen. Ein doppelter Anstoß kostet
vierzig Sekunden; ein fehlender kostet den Tag.

Die Routine **„Zeitumstellung"** zieht sie zweimal im Jahr gemeinsam um eine
Stunde nach. Wer eine Zeit ändert, ändert alle.

### Die Folge erscheint **täglich** – seit dem 9. August 2026

Sieben Tage die Woche, 365 Tage im Jahr. So hat der Betreiber es festgelegt.

Davor lief `podcast-erzeugen.yml` werktags, und daran hingen vier Dinge, die
alle mit umgestellt werden mussten. Wer den Takt je wieder ändert, findet
hier die Liste:

1. **Der Cron** in `podcast-erzeugen.yml` – `1-5` wurde `*`. Der zweite
   Eintrag für Sonntage und die Eingabe `trotzdem` sind entfallen.
2. **Der Riegel im selben Workflow** – die Frage „ist heute ein
   Erscheinungstag?" gibt es nicht mehr. Geblieben ist nur die nach dem
   doppelten Upload.
3. **Der Anstoß aus `kurse.yml`** – dort stand derselbe Wochenend-Riegel.
   Zusammen mit ihm ist `data/podcast-probetage.txt` weggefallen: eine
   Ausnahmeliste für ein Wochenende, an dem nichts erscheint, hat keinen
   Gegenstand mehr.
4. **`folgennummer()` in `lib/sprechfassung.ts`** – siehe unten, das ist die
   heikelste Stelle.

Der Nachrichtenlauf lief ohnehin schon täglich; die Tagesausgabe, die der
Podcast vertont, ist also auch am Samstag da.

Der Abschlusssatz ist außerdem für alle Tage derselbe. Freitags stand
„Bis Montag früh, schönes Wochenende" – eine Ankündigung, die jetzt nicht
mehr einträfe.

#### Die Folgennummer darf keine Lücke bekommen

Die naheliegende Umstellung wäre gewesen, statt Werktagen einfach
Kalendertage seit dem 30. Juli 2026 zu zählen. Das Ergebnis: Der 10. August
hätte Folge **12** getragen, obwohl im Register Folge 7 die letzte ist.

Eine Folgennummer ist eine Ordnungszahl. Sie darf nicht springen, nur weil
sich der Takt ändert. `folgennummer()` zählt deshalb zweiteilig, mit einer
Naht am 9. August:

    bis 09.08.2026     Werktage seit dem 30.07.        →  7
    ab  10.08.2026     7 + Kalendertage seit dem 09.08. →  8, 9, 10 …

Die Naht liegt genau dort, weil am 9. August keine Folge im Register steht –
die des Tages wurde zurückgenommen. Es gibt also keine veröffentlichte
Nummer, die durch die Umstellung ihren Wert ändert.

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
3. ~~**Bestand** – Marktzahlen statt Meldungen, ausdrücklich ein Notbehelf~~

Wer hier etwas ändert, ändert nichts an dieser Reihenfolge. Weg 3 ist der
Grund, warum nie „gar nichts" dasteht; Weg 1 der Grund, warum er selten
gebraucht werden sollte.

> **Weg 3 gibt es seit dem 11. August 2026 nicht mehr.** Der Absatz darüber
> steht bewusst so stehen, weil er die Begründung enthält, die damals galt –
> und weil sie sich als falsch erwiesen hat.
>
> Der Gedanke war: lieber eine schmale Ausgabe als keine. Am 9. August kam
> heraus, was das in der Praxis heißt – auf der Website standen aufbereitete
> eigene Kurszahlen, die aussahen wie Nachrichten, und der Wächter wäre grün
> geblieben. Seither gilt das Gegenteil: **Besser keine Nachrichten als
> welche, die keine sind.** `nachrichten.yml` bricht rot ab, wenn weder
> Entwurf noch Modell liefern.
>
> `scripts/nachrichten-aus-bestand.ts` liegt noch im Repository, wird aber
> von keinem Workflow mehr aufgerufen.
>
> **Die Folge davon, ausgeschrieben:** Ohne Modell gibt es keine Ausgabe, und
> ohne Ausgabe keine Podcastfolge – `npm run folge` bricht ab. Kurse,
> Paketbau, Übertragung und Lernseiten laufen davon unberührt weiter.

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

   **Seit dem 9. August prüft er auch, woher die Ausgabe kommt.** „Ist sie
   da?" reicht als Frage nicht mehr, seit der Notbehelf aus dem Kursbestand
   immer eine liefert: An dem Tag war die Ausgabe vollständig, der Wächter
   wäre grün geblieben, und trotzdem standen auf der Website aufbereitete
   eigene Zahlen statt Meldungen. `nachrichten.yml` schreibt beim Rückfall
   zwar ein `::warning::` – aber eine Warnung in einem grünen Lauf schickt
   keine Mail und ist damit genau der stille Fehler, den der Wächter
   abschaffen soll.

   Erkannt wird der Notbehelf an seinen Quellen: Er kann nur auf den eigenen
   Bestand verweisen. Über die Ausgaben vom 1. bis 9. August lag der Anteil
   externer Verweise bei den recherchierten zwischen 80 und 100 Prozent, beim
   Notbehelf bei 17 – die Hälfte ist die Grenze.

Wer hier etwas ändert, lässt Punkt 3 stehen. Die anderen beiden sind Versuche,
das Problem zu lösen; der Wächter ist die Zusicherung, dass ein Scheitern
auffällt.

## Ein roter Lauf ist ein Vorrat, und er lässt sich aufbrauchen

Der Abschnitt darüber sagt: Der teuerste Fehler ist der stille. Das stimmt –
und hat einen Zwilling, der am 9. August 2026 fällig wurde. Der Betreiber
meldete, er bekomme ständig Fehlermails. Nachgezählt über diesen einen Tag:

    17×  Paket bauen          – davon 5 von 30 Läufen allein an diesem Tag
     5×  Kurse aktualisieren

**Alle an derselben Stelle, alle mit demselben Ausgang.** Der SSH-Port des
Hosters antwortete ein paar Minuten nicht und danach wieder: 21:09 lief die
Übertragung durch, 21:14 nicht, 22:07 wieder. Kein Lauf davon hat etwas
kaputtgemacht, keiner brauchte eine Handlung, jeder schrieb eine Mail.

Damit ist das Warnsystem nicht laut, sondern taub. Wer täglich fünf Mails
über Störungen bekommt, die sich von selbst erledigen, liest die sechste
nicht mehr – und die sechste ist die vom Nachrichtenlauf, der wirklich
ausgefallen ist. Ein roter Lauf ist Aufmerksamkeit, und Aufmerksamkeit ist
endlich.

### Die Trennlinie: Was sagt der Fehlschlag über den Zustand der Website?

Nicht „ist etwas schiefgegangen?“, sondern **„sieht ein Besucher deshalb
etwas anderes?“**

- Ein misslungener Upload sagt **nichts**. Auf dem Server liegt weiter der
  vorige Build, die Seite ist vollständig, und der nächste Lauf trägt den
  Stand nach – `paket-bauen.yml` läuft dreißigmal am Tag, `kurse.yml`
  siebzehnmal. → **Warnung.**
- Ein unbrauchbarer Schlüssel, ein halb getauschtes Verzeichnis, ein
  zerbrochener Build sagen **alles**. Sie erledigen sich durch Abwarten
  nicht. → **roter Lauf.**

Danach sind seit dem 9. August umgestellt: der Port und der `ssh-keyscan` in
`paket-bauen.yml` und `kurse.yml`, das Hochladen des Archivs, die
Kursübertragung und eine Antwort `000` (also gar keine) bei der Prüfung von
außen. Hart geblieben ist alles ab dem Augenblick, in dem auf dem Server
umgehängt wird.

**Die einmal täglich laufenden Workflows bleiben unangetastet.** Bei
`podcast-erzeugen.yml` heißt ein Fehlschlag: heute gibt es keine Folge. Eine
Mail dafür ist genau richtig; sie kommt höchstens einmal am Tag.

### Wer aufpasst, wenn niemand mehr schreit

Eine gemilderte Meldung ist nur dann in Ordnung, wenn die Aufsicht bleibt.
Die Beruhigung „der nächste Lauf trägt es nach“ ist richtig, solange ein Lauf
ausfällt, und falsch, wenn der Server tagelang niemanden heranlässt. Der
Unterschied ist von außen ablesbar – am Bauzeitpunkt in `version.txt`, den
jeder Bau mitschreibt.

`kurse.yml` fragt ihn deshalb bei **jedem** Lauf ab, rund siebzehnmal am Tag:

    ab 10 Stunden   Warnung, und ein Bau wird angestoßen
    ab 18 Stunden   roter Lauf

Die Grenzen sind aus dem Fahrplan gerechnet, nicht gegriffen: Der letzte Bau
des Abends und der nächtliche um 05:41 UTC liegen im ungünstigsten Fall gut
acht Stunden auseinander. Alles darunter schlüge jede Nacht an und wäre nach
einer Woche wieder Rauschen.

Dazu kommt die Frage, die es vorher schon gab – antwortet die Startseite? –,
nur mit längerem Atem: **fünf Versuche über vier Minuten** statt drei über
eine. Drei waren zu wenig; am 9. August um 22:05 meldeten sie dreimal `000`
und färbten den Lauf rot, während zwei Minuten später ein vollständiger
Paketbau gegen denselben Server durchlief.

**Wer eine Meldung leiser stellt, baut die Gegenprobe dazu.** Ohne sie ist es
kein Abwägen, sondern Wegsehen – und dann ist der Abschnitt darüber wieder
dran.

# Ein Kurs ist so alt wie die Stelle, die ihn anzeigt

Nicht so alt wie der Abruf. Das klingt selbstverständlich und war es nicht:
Am 10. August 2026 meldete der Betreiber um 17:48, dass Brent auf dem Stand
von 17:02 stehe und EUR/USD auf dem Schlusskurs vom 6. August. Beides stimmte,
und beides hatte eine eigene Ursache.

**Die Zusage lautet seither: höchstens sechs Minuten.** Nicht „alle zwei
Stunden“, nicht „einmal nach Börsenschluss“.

## Drei Stellen, drei Alter – so war es vorher

    kurse-aktuell.json      15:43 UTC   der Abruf selbst, aktuell
    /kurse-live.json        15:43 UTC   liegt auf dem Server, wird ersetzt
    gebautes HTML           letzter Bau bis zu zwei Stunden alt

Gelesen wurde die mittlere Datei von **einer** Stelle: der Kopfzeile einer
Instrumentseite (`KursLive`). Die Marktübersicht mit ihren vierzig Kacheln las
sie nicht – dort stand die gebaute Zahl. Wer also eine Kachel ansah, sah den
Stand des letzten Baus, während zwei Klicks weiter derselbe Kurs frisch war.

Behoben über `lib/kurse-live-speicher.ts`: **ein** Abruf je Seite, alle
Kacheln hören zu (`components/markets/Kachelzahlen.tsx`). Wer eine neue Stelle
baut, die einen Kurs zeigt, hängt sie an diesen Speicher – nicht an ein
eigenes `fetch`.

### Und dann fehlten die Zeilen

Derselbe Abend, dieselbe Seite, eine Ebene tiefer. Die Kacheln waren
umgestellt, die **über tausend Aktienzeilen darunter** nicht – `QuoteRow` war
eine reine Serverkomponente und zeigte weiter die gebaute Zahl. Um 20:12
deutscher Zeit stand Amazon auf dem Kurs von 19:05, während `/kurse-live.json`
zwei Minuten alt war.

Der Satz darüber war schon geschrieben, als es passierte. Er hat nur nicht
verhindert, dass beim Umbau die eine Stelle angefasst wurde, die im
Bildausschnitt zu sehen war, und die andere nicht.

**Also ausdrücklich: Es gibt keine Kurse zweiter Klasse.** Kachel, Zeile,
Kopfzeile, Vergleich – wer eine Zahl zeigt, die sich stündlich ändert, liest
sie aus dem Speicher. Die drei Stellen heute:

    components/markets/Kachelzahlen.tsx   Kacheln (Indizes, ETFs, Rohstoffe …)
    components/markets/Zeilenzahlen.tsx   Aktienzeilen, auch auf Branchenseiten
    components/markets/KursLive.tsx       Kopfzeile der Instrumentseite

Der Aufbau ist bei allen dreien derselbe und hat einen Grund: Nur Kurs und
Veränderung wandern in den Browser. Kürzel, Name, Verweisziel und der
Verlaufsgraph bleiben auf dem Server – sonst zöge eine Liste mit tausend
Zeilen tausend Namen ins Client-Bündel.

## Was der Fünf-Minuten-Lauf holt, bestimmt `lib/leitwerte.ts`

Und zwar **alles, was als Kachel auf der Übersicht steht** – 46 Werte:
Indizes, ETFs, Rohstoffe, Krypto, Devisen. Vorher waren es dreizehn, ausgewählt
nach „was am meisten gesehen wird“. Das Ergebnis war auf einer Seite
nebeneinander sichtbar: S&P 500 von 17:43, Kupfer von 17:02 – bei gleich
aussehenden Kacheln.

Die Sorge hinter der kurzen Liste hat sich erledigt. Teuer war nie der Abruf,
sondern der Neubau: Der Fünf-Minuten-Lauf baut nicht, er legt
`kurse-live.json` auf den Server. Dreizehn oder sechsundvierzig Kurse ändern
daran Sekunden.

Hier stand: „Die Einzelaktien bleiben beim Zwei-Stunden-Takt. Über tausend
Titel alle fünf Minuten wären 288.000 Abrufe am Tag für Kacheln, die niemand
ansieht." **Beide Hälften waren falsch**, und das kam am selben Abend heraus –
siehe den Dauerlauf weiter unten. Der Fünf-Minuten-Lauf in `kurse.yml` holt
weiter nur die Leitwerte; der Dauerlauf holt alles.

## Die EZB ist eine Tagesquelle – und wurde zweimal darum gebracht

EUR/USD stand am Montagnachmittag auf dem Kurs von Donnerstag. Zwei Fehler,
beide in `scripts/kurse-abrufen.ts`, beide mit derselben Wurzel: Die
Sonderbehandlung für „liefert keinen laufenden Kurs“ war zu breit geraten.

1. **Übersprungen.** `if (NUR_PREIS && provider === 'ecb') continue` – und
   `NUR_PREIS` trägt auch der Zwei-Stunden-Lauf. Damit blieb als einzige
   Gelegenheit der volle Lauf um 21:47 an Werktagen. Jetzt greift der
   Riegel nur noch im Fünf-Minuten-Lauf (`NUR_LEITWERTE`), wo er richtig ist.
2. **Verworfen.** `ohneHeute()` entfernt den heutigen Punkt, weil Yahoo den
   laufenden Tag als unfertige Kerze mitliefert. Ein EZB-Referenzkurs ist
   dagegen fertig, sobald er gegen 16:00 Uhr feststeht. Ihn wegzuwerfen hieß,
   den aktuellsten vorhandenen Wert zu verwerfen.

Zusammen: freitags 21:47 wird die Reihe bis Donnerstag geschrieben, Samstag und
Sonntag läuft nichts, und der Montag kommt erst um 21:47. Vier Tage.

**Die Lehre ist allgemeiner als der Fall.** Eine Ausnahme für eine Quelle
gehört an die Bedingung, die sie meint – nicht an die nächstgelegene, die
gerade zur Hand ist.

## Ein Rohstoffkurs bei einer freien Quelle ist verzögert

Nach all dem bleibt ein Rest, und der lässt sich nicht wegprogrammieren: Yahoo
liefert Rohstoffe und manche Indizes mit Verzögerung. Am 10. August meldete
der Abruf um 15:43 UTC für Brent einen Stand von 15:33 – zehn Minuten alt an
der Quelle, nicht bei uns.

Das ist der Preis einer Quelle ohne Rechnung und gehört nicht wegdiskutiert,
sondern ausgewiesen: Die Stand-Zeile nennt den Zeitstempel der Quelle, nicht
den des Abrufs.

## Der Fünf-Minuten-Takt hat nie stattgefunden

Alles darüber war richtig und reichte trotzdem nicht. Am selben Abend
nachgezählt, über die 22 Stunden bis zum 10. August 2026, 15:43 UTC – der
Zeitplan sieht in diesem Fenster **264** Läufe vor:

    ausgeführt                      29
    kleinster Abstand              2,4 Minuten
    mittlerer Abstand             36,7 Minuten
    größter Abstand              144,6 Minuten
    Abstände unter sechs Minuten    11 %

**Der Takt, auf dem die Zusage beruhte, existierte nur in der Cron-Zeile.**
Damit war „höchstens sechs Minuten" keine zu optimistische Schätzung, sondern
eine Behauptung über etwas, das nicht stattfand – und Brent um 17:48 auf dem
Stand von 17:02 war nicht die Ausnahme, sondern der Normalfall.

Die Bauregel dagegen stand seit dem 6. August zwei Abschnitte weiter unten:
_Was zu einer bestimmten Zeit passiert sein muss, darf nicht an `schedule`
hängen._ Fünf Minuten sind eine bestimmte Zeit.

### Also bringt der Lauf seine Uhr selbst mit

`.github/workflows/kurse-dauerlauf.yml`: **ein** Job, fünfeinhalb Stunden
lang, der alle zwei Minuten den **vollen Bestand** holt und `kurse-live.json`
auf den Server legt. Kein Termin, der verworfen werden könnte – die Schleife
zählt selbst.

    Abruf              76 Sekunden für 1.059 Werte  (gemessen, Lauf 31407697704)
    Schleifentakt      2 Minuten
    Übertragung        wenige Sekunden
    Browser-Takt       bis zu 1 Minute   (TAKT_MS in kurse-live-speicher.ts)
    ---------------------------------------------------------------------
    zusammen           gut 3 Minuten im ungünstigsten Fall

**Der volle Bestand, nicht nur die 46 Leitwerte** – so seit dem Abend jenes
Montags, und die erste Fassung lag hier daneben. Sie holte `NUR_LEITWERTE` mit
der Begründung, tausend Titel alle zwei Minuten seien Abrufe „für Kacheln, die
niemand ansieht". Amazon um 20:12 auf dem Stand von 19:05, mitten in der
US-Sitzung, hat das widerlegt: Wer eine Aktienseite offen hat, sieht sie an.

Und teuer ist es auch nicht. Der volle **Preis**abruf – `range=1d`, 80 ms
Starttakt – dauert 76 Sekunden und passt in den Takt, ohne ihn zu dehnen. Die
sieben Minuten, die in der alten Rechnung steckten, galten dem vollen Lauf
**mit Historie und Dividenden**; die beiden holt weiter `kurse.yml` alle zwei
Stunden, denn Tageskerzen ändern sich nicht alle zwei Minuten.

Was bleibt, ist die Last bei Yahoo: knapp neun Anfragen je Sekunde, rund um
die Uhr, an einer freien Schnittstelle ohne Vertrag. Dagegen hört die Schleife
auf das, was zurückkommt – der Abruf meldet „N Instrumente aktualisiert", und
bricht diese Zahl auf unter zwei Drittel ein, verdoppelt sich der Takt bis zur
Erholung (höchstens acht Minuten). Wer die Zahl 80 in `ABSTAND_MS` anfasst,
fasst damit auch diesen Dauerbetrieb an.

Am Leben bleibt er über zwei Ketten: Er startet am Ende seinen eigenen
Nachfolger (`workflow_dispatch`, der einzige Weg, der dem `GITHUB_TOKEN`
offensteht), und `kurse.yml` sieht bei **jedem** Lauf nach, ob noch einer
läuft. Dieselbe Umkehrung wie beim Nachrichtenlauf und beim Podcast: Nicht
die Uhr passt auf, sondern der Workflow, der nachweislich feuert.

**Zwei Bremsen gehören dazu und dürfen nicht wegfallen.** Ein Workflow, der
sich selbst startet, ist eine Schleife:

1. Der Dauerlauf startet **keinen** Nachfolger, wenn er selbst weniger als
   zehn Minuten gearbeitet hat. Ein Lauf, der früher endet, ist gestolpert –
   und ein Stolpern, das sich alle vierzig Sekunden wiederholt, wären
   hunderttausend rote Läufe.
2. Der Wächter in `kurse.yml` wartet nach einem Fehlschlag eine Stunde. Sonst
   gäbe derselbe Defekt zwanzig gleichlautende Mails am Tag – und dann ist der
   Kanal für den nächsten Ernstfall verbraucht (siehe „Ein roter Lauf ist ein
   Vorrat").

Die Fünf-Minuten-Crons in `kurse.yml` bleiben trotzdem stehen. Sie sind jetzt
Beiwerk für die Kurse, tragen aber die Aufsicht: Steht die Website noch, ist
der Bau frisch, fehlt die Nachrichtenausgabe, ist der Podcast gelaufen.

### Warum keine Live-Verbindung im Browser

Der Betreiber hat sie vorgezogen. Sie wäre auch das Richtige – nur gibt es
sie für diese Website nicht:

- **Kein eigener Server.** Ein statischer Export auf einem Webspace hat keine
  Stelle, die im Auftrag des Browsers etwas abrufen könnte.
- **Yahoo lässt den Browser nicht heran.** Keine `Access-Control-Allow-Origin`;
  ein `fetch` von `iminvests.de` bricht mit einem CORS-Fehler ab. Das ist
  nichts, was sich hier einstellen ließe.
- **Ein Schlüssel im Browser ist keiner.** Die Anbieter, die CORS erlauben,
  verlangen einen – und der stünde für jeden lesbar in der Seite.

Krypto und Devisen ließen sich einzeln direkt anbinden. Für Indizes, ETFs,
Rohstoffe und Aktien – den weit größeren Teil – gibt es diesen Weg nicht, und
zwei Bezugswege für dieselbe Kachel wären schlimmer als einer.

### Nachtrag zur Kostenrechnung

Der Kopf von `lib/leitwerte.ts` rechnet mit „8.000 Minuten im Monat bei 2.000
enthaltenen". Das galt der **Bauzeit** und ist für den Dauerlauf gegenstandslos:
Er baut nichts. Und dieses Repository ist öffentlich – für öffentliche
Repositories sind die Standardläufer bei GitHub Actions unbegrenzt und
kostenlos. Wer die alte Rechnung als Argument gegen einen dichteren Takt
anführt, führt sie gegen etwas an, das sie nie gemeint hat.

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

### Die Kehrseite: ein verspäteter Lauf ist einer zu viel

Der Anstoß aus `kurse.yml` hat einen Preis, und der wurde am 9. August 2026
fällig. Der Sonntags-Cron des Podcasts wurde **nicht verworfen, sondern 72
Minuten zu spät ausgeführt**: 04:05 statt 02:53 UTC. Ein Handstart um 03:04
hatte die Folge da längst gebaut und hochgeladen. Der verspätete Lauf baute
sie noch einmal – und lud sie noch einmal hoch.

Auf YouTube lagen danach zwei Videos desselben Tages. Im Repository sah alles
richtig aus: Der zweite Lauf überschrieb den Eintrag im Register, dort stand
genau eine Folge. Aufgefallen ist es dem Betreiber auf seinem Kanal, nicht
der Technik.

**Also gehört zu jedem Lauf, der etwas nach außen gibt, die Frage: Steht das
Ergebnis des Tages schon?** `nachrichten.yml` fragt sie seit dem 5. August,
`podcast-erzeugen.yml` seit dem 9. Ein doppelter Anstoß ist gewollt und
billig – ein doppeltes Ergebnis nicht.

### Wer fragt, ob etwas schon passiert ist, fragt die Gegenwart

Am 10. August 2026 lagen wieder zwei Videos desselben Tages auf dem Kanal –
obwohl der Riegel von gestern genau dagegen gebaut war und **funktioniert
hat**. Die Zeitstempel, auf die Sekunde:

    04:15:44   Lauf 1 startet (Anstoß aus kurse.yml)
    04:18:59   Lauf 2 startet (der verspätete Cron) und wird von
               `concurrency` in die Warteschlange gestellt
    04:31:04   Lauf 1 trägt die Folge auf main ein
    04:31:34   Lauf 2 läuft an, fragt „steht die Folge schon?" – und sagt nein
    04:45:11   Lauf 2 lädt das zweite Video hoch

**Dreißig Sekunden.** Die Sperre hat ihre Arbeit getan, Lauf 2 hat zwölf
Minuten gewartet. Nur half das nichts: `actions/checkout` holt den Stand, der
beim **Auslösen** galt – hier 04:18:59 –, und in dem stand die Folge
naturgemäß noch nicht.

Ein Riegel, der eine Datei aus der Vergangenheit liest, ist keiner. Gefragt
wird deshalb seither `origin/main` von jetzt (`git fetch` + `git show`),
genau wie es `kurse.yml` bei der Nachrichtenausgabe längst tat.

**Wer eine solche Prüfung schreibt, prüft zuerst, woher ihre Daten kommen.**
Der Arbeitsordner eines Laufs ist eine Momentaufnahme, kein Spiegel.

### Eine ausgetauschte Datei erreicht keinen Hörer

Der dritte Teil desselben Vorfalls. Die kaputte Fassung lag bei Spotify, die
saubere lag auf dem Server – und das blieb sechs Stunden lang so, obwohl unter
derselben Adresse längst die richtige Datei stand.

**Spotify holt eine Folge genau einmal.** Es erkennt sie an ihrer Kennung im
Feed, und die hing am Datum: `iminvests-marktupdate-2026-08-10`. Eine
gleichbleibende Kennung heißt „kenne ich schon"; die MP3 dahinter wird nie
wieder abgerufen. Wer die Datei auf dem Server ersetzt, ändert damit für einen
Abonnenten **nichts**. Dasselbe gilt für Apple und jeden anderen Abspieler.

Deshalb trägt eine Folge seither eine `fassung`. Sie fehlt bei der ersten,
und ab der zweiten hängt sie an der Kennung: `…-2026-08-10-2`. Für Spotify ist
das eine neue Folge – es lädt sie, und die alte verschwindet mit dem nächsten
Feedabruf.

Hochgezählt wird sie **von selbst**: `podcast-feed-schreiben.ts eintragen`
schaut nach, ob der Tag schon im Register steht, und erhöht die Fassung, wenn
ja. Ein zweiter Lauf am selben Tag ist genau der Fall, in dem eine neue
Audiodatei entstanden ist – die Handkorrektur vom 10. August war nachgeholte
Arbeit, keine Ausnahme.

Nach draußen kommt das über `podcast-schaufenster.yml`: Feed neu schreiben,
Feed übertragen, keine Folge anfassen.

**Wer sparsam damit umgeht, hat recht.** Eine erhöhte Fassung ohne Grund
erzeugt bei jedem Hörer eine „neue Folge", die er schon kennt.

### Eine Frist prüft die Laufzeit, nicht das Ergebnis

Der doppelte Lauf vom 10. August hatte ein Gutes: Er lieferte **zwei Fassungen
derselben Folge**, und der Betreiber hat beide gehört. Die erste hatte bei 1:21
vier Sekunden Quietschen und Rauschen, die zweite war sauber – gleicher Text,
gleiches Modell, gleicher Aufbau.

Damit ist die Sache entschieden: **Das Modell würfelt.** Es erzeugt Ton, bis es
ein Schlusszeichen setzt, und gelegentlich entgleist ein Stück dabei.

Die Absicherung, die es gab, fing genau einen Fall: das Stück, das **hängt**
(`SIGALRM`, siehe `sprich`). Ein Stück, das schnell zurückkommt und Unsinn
enthält, lief ungeprüft in die Folge. Es gab keine einzige Frage an das
Ergebnis, nur an die Laufzeit – und das ist der Denkfehler, nicht die Zahl.

`brauchbar()` fragt seither nach dem Ergebnis und nicht nur nach der Laufzeit.
Beides sind **Anzeichen, keine Beweise**; die Antwort ist deshalb ein neuer
Versuch – bis zu drei – und kein Abbruch: Gewürfelt wird bei jedem neu, und
genau das hat die zweite Fassung bewiesen. Nach drei entgleisten Anläufen
kommt das Stück trotzdem hinein, mit Warnung. Ein Loch bricht das
Zusammenfügen ab und kostet die ganze Folge; ein schiefes Stück kostet vier
Sekunden.

### Ein Mittelwert kann nichts finden, was er verdünnt

Der Abschnitt darüber war richtig gedacht und in der Ausführung falsch. Am
Abend desselben 10. August meldete der Betreiber **dieselbe Störung noch
einmal** – diesmal in der Vorlesefassung einer Lernseite, bei 1:36. Die
Prüfung war da, lief mit, schrieb nie eine Warnung.

Nachgestellt und damit belegt: Ein dreißig Sekunden langes Stück mit vier
Sekunden eingeklebtem Pfeifton kam durch. Zwei Gründe, unabhängig voneinander:

1. **Die Dauer stimmte.** Vier Sekunden Unsinn _statt_ vier Sekunden Sprache
   ändern an der Gesamtlänge nichts. Die Dauerprüfung fängt das Stück, das
   entgleist _und dabei die Länge verliert_ – nicht das, das mittendrin kippt
   und sich wieder fängt.
2. **Die Übersteuerungsprüfung war abgeschaltet.** Sie verlangte zusätzlich
   eine Gesamtspitze von 0,99. Lag die Störung bei 0,97, wurde gar nicht erst
   gezählt – und selbst darüber wäre ihr Anteil an dreißig Sekunden unter der
   Schwelle geblieben.

**Die Lehre ist allgemeiner als der Fall: Eine Kennzahl über das Ganze findet
keinen Fehler, der einen Bruchteil davon ausmacht. Sie verdünnt ihn.**

`sprechstimme.auffaellige_stellen()` sieht deshalb jedes Viertel einer Sekunde
für sich an und meldet, ab welcher Sekunde etwas nicht wie Sprache aussieht:

    laut          gemessen am lauten Teil des Stücks selbst – Atem und
                  Raumton sehen sonst aus wie Rauschen
    rau           viele Nulldurchgänge (Rauschen, Pfeifen) oder viele
                  Werte am Anschlag (Quietschen)
    anhaltend     mindestens 0,4 s am Stück

**Die dritte Bedingung trägt das Ganze.** Ein „sch" hat dieselbe
Nulldurchgangsrate wie ein Pfeifton; was es davon unterscheidet, ist, dass es
nach einem Zehntel einer Sekunde vorbei ist.

### Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe

Das ist der eigentliche Grund, warum es zweimal passieren konnte. Die Prüfung
war nachweislich vorhanden und meldete nie etwas – und das las sich wie „alles
in Ordnung" statt wie „diese Prüfung findet nichts".

Deshalb gibt es `python scripts/sprechstimme.py --selbsttest`. Er legt der
Prüfung sechs Fälle vor, drei saubere und drei kaputte, darunter genau die
Störung von jenem Tag. Er braucht kein Modell, kein Netz und keine Sekunde –
und steht in `lese-stimme.yml` und `podcast-erzeugen.yml` **vor** dem
Sprechen.

Wer eine Schwelle in `sprechstimme.py` anfasst, sieht dort, ob sie noch trägt.

### Eine Fallunterscheidung über Merkmale, die der Stoff nicht hat, ist keine

Am 13. August 2026 meldete der Betreiber, die Folge brauche „etwas Emotion
beim Sprechen". Der naheliegende Verdacht – die Stimme sei zu flach – ließ
sich messen und war **falsch**. Gegenübergestellt wurden die Referenzaufnahme
und eine Hörprobe des Modells:

    Referenz   Tonhöhe Median 104 Hz   Streuung 4,30 Halbtöne
    Modell     Tonhöhe Median  92 Hz   Streuung 5,06 Halbtöne

Das Modell bewegt sich also **mehr** als der Mensch, den es klont. An der
Tonhöhe zu drehen – höhere `temperature`, anderes Sampling – hätte nichts
verbessert und das Entgleisungsrisiko erhöht, gegen das drei Abschnitte
weiter oben eine ganze Prüfkette steht.

Der Takt war es. Nachgezählt an der Folge vom 13. August, 352 Wörter,
16 Stücke:

    0,5  s (Satz)     9 ×
    0,95 s (Absatz)   7 ×
    0,66 s (Frage)    0 ×
    0,34 s (Ankündig.) 0 ×

Am 9. August war die Pause auf das **Satzzeichen** umgestellt worden, genau
gegen das Metronom aus zwei Werten. Vier Zweige, sauber geschrieben, im
Protokoll nachlesbar – und in der Praxis wieder zwei: `PAUSE_FRAGE` und
`PAUSE_ANKUENDIGUNG` verlangen ein `?`, `!`, `:` oder `–` am Satzende, und in
352 Wörtern Nachrichtentext steht davon **keines**. Eine Meldung besteht aus
Aussagesätzen mit Punkt.

**Die Abhilfe sah vier Tage lang wie eine aus und war keine.** Wer eine
Fallunterscheidung baut, zählt nach, wie oft jeder Zweig an echtem Material
greift – nicht, ob es ihn gibt.

Gehängt wird die Pause seither an etwas, das jeder Satz hat: **seine Länge.**
Ein kurzer Satz ist eine Pointe und bekommt Raum, ein langer hat dem Ohr
unterwegs schon Ruhe gegeben. Aus zwei wirksamen Werten werden damit an
derselben Folge fünfzehn, Spanne 0,30–1,02 s statt zweier Häufchen. Die
Summe bleibt nahezu gleich (10,8 s gegen 11,1 s) – die Folge wird nicht
länger, nur ungleichmäßiger, und die Frist um sechs Uhr bleibt unberührt.

Zwei Grenzen stehen fest und dürfen nicht wegfallen:

- **Das Absatzende bleibt bei 0,95 s.** Danach sucht der Kapitelschritt
  (`silencedetect … d=0.6`); es zu spreizen hieße, Kapitelmarken gegen
  Sprechrhythmus zu tauschen.
- **Der Mittelwert der Satzpausen bleibt bei rund einer halben Sekunde.**
  Sonst verschiebt sich die Fünf-Minuten-Rechnung.

Beides prüft `--selbsttest` mit. Und weil die erste Fassung dieses Tests
zählte, wie viele **verschiedene** Pausen herauskommen – woran die alte Logik
nicht scheiterte, weil die Streuung von ±0,07 s aus einem festen Wert schon
sechs verschiedene Zahlen macht –, misst er jetzt die **Spanne** gegen die
Streuung. Das ist derselbe Fehler eine Ebene höher: gezählt wurde das
Rauschen, nicht das Signal.

`stimme-erzeugen.py` rechnet die Pause nicht mehr selbst, sondern ruft
`sprechstimme.pause_fuer`. Der Import steht **in** der Funktion, aus dem
Grund, der bei `brauchbar` steht.

#### Eine Hörprobe ohne Rhythmus kann zum Rhythmus nichts sagen

`stimme-messen.py` gab den ganzen Probetext in **einen** Modellaufruf. Für die
Messung ist das richtig; für das Hören führte es in die Irre, denn eine echte
Folge besteht aus zwanzig bis dreißig Stücken mit Pausen dazwischen – und
genau das ist, was „monoton" meint. Seit dem 13. August spricht die Hörprobe
in Stücken, mit denselben Pausen wie die Folge.

Der Echtzeitfaktor zählt dabei weiter **nur gesprochene** Sekunden. Zählte
die eingefügte Stille mit, sähe die Stimme umso schneller aus, je mehr Pausen
man einbaut – eine Kennzahl, die sich selbst verbessert, ohne dass etwas
besser geworden ist.

#### Was danach noch offen ist

Der Takt ist die eine Hälfte. Die andere ist der **Text**, und die ist nicht
angefasst: In denselben 352 Wörtern steht kein Fragezeichen, kein
Ausrufezeichen, kein Doppelpunkt und ein Gedankenstrich; die Sätze liegen im
Median bei 20 Wörtern, und jeder Themenabsatz beginnt mit „Laut einer …
Meldung vom …". Ein Mensch, der das vorliest, klingt auch flach.

Das ließe sich ändern – im Agentenprompt, der die Meldungen schreibt. Es
betrifft dann aber die Website mit, nicht nur die Folge, und die strenge
Quellenangabe ist Absicht. Deshalb wurde es hier **nicht** mitgemacht,
sondern liegengelassen, bis der Betreiber die Wirkung des Takts gehört hat.

### Geprüft wird, was gesendet wird – nicht sein Vorprodukt

Am 11. August 2026 hat die neue Prüfung nachweislich gearbeitet: Im Protokoll
steht „Stück 8, Anlauf 1 verworfen – 0.5 s rau statt gesprochen", und das
Stück wurde neu gesprochen. Trotzdem meldete der Betreiber wieder
Störgeräusche, und `aufnahmen-nachpruefen.yml` fand sie in derselben Datei auf
Anhieb:

    2026-08-11.mp3: 5:28 lang, 1 auffällige Stelle(n):
      4:08–4:09  0.5 s rau statt gesprochen (Nulldurchgänge 0.28)

**Derselbe Maßstab, dieselbe Aufnahme, ein Fund mehr.** Der Unterschied liegt
allein daran, worauf er angewandt wurde: beim Sprechen auf ein einzelnes von
fünfundzwanzig Stücken, hinterher auf die ganze Folge. `auffaellige_stellen`
misst „laut" am lauten Teil des Betrachteten selbst – in einem leisen Stück
bleibt eine Störung unter dieser Schwelle, im Ganzen liegt sie darüber.

Das ist dieselbe Lehre wie beim doppelten Video: **Ein Riegel ist so gut wie
die Quelle, die er fragt.** Wer wissen will, ob die Folge sauber ist, fragt die
Folge.

Also läuft `sprechstimme.nachbessern()` seither dort, wo die Aufnahme fertig
ist – in `stimme-zusammenfuegen.py` und in `lese-stimme-erzeugen.py`, jeweils
unmittelbar nach dem Zusammenfügen.

#### Und sie wird gedämpft, nicht nur gemeldet

Die Prüfung beim Sprechen antwortet mit einem neuen Anlauf, und das ist die
bessere Antwort: Sie rettet den Text. Am Ende der Kette gibt es kein Modell
mehr, also bleibt nur der Eingriff in den Ton – die Stelle wird mit einer
Blende von dreißig Millisekunden auf Stille gezogen.

Das klingt nach Verschlimmbessern und ist es nicht. Wo eine halbe Sekunde
Pfeifen steht, steht keine halbe Sekunde Wort mehr; das Wort ist bereits
verloren. Die Wahl ist nicht „Wort oder Stille", sondern **„Quietschen oder
Pause"**, und eine Pause wirft niemanden aus dem Text.

Die Länge bleibt dabei unverändert – wichtig für die Lernseiten, deren
Abschnittsmarken an Sekunden hängen.

Der Selbsttest deckt beides ab: dass eine eingebaute Störung nach dem Dämpfen
weg ist, und dass eine saubere Aufnahme **Wert für Wert unverändert** bleibt.
Die zweite Hälfte ist die wichtigere: Ein Eingriff ohne Gegenprobe wäre genau
das Risiko, das er verhindern soll.

### Was englisch ist, wird englisch gesprochen – auch Anglizismen

„Alphabet" und „Goldman Sachs" liest eine deutsche Stimme deutsch, und im Ohr
ist das der Bruch, den der Betreiber am 11. August meldete. Ein Sprachmodell
für Deutsch kennt keine englische Aussprache; es kennt nur Buchstaben.

`ENGLISCHE_NAMEN` in `lib/sprechfassung.ts` schreibt sie deshalb so, wie sie
klingen sollen – „Ällfabett", „Goldmänn Sacks", „Berkschir Häthaweh". Das ist
keine Lautschrift, sondern deutsche Rechtschreibung für einen englischen Klang;
alles andere spräche das Modell wieder als Buchstaben.

Die Tabelle wird **zuerst** angewandt, vor jeder anderen Regel. „Nasdaq 100"
muss `Nässdack` heißen, bevor die Regel für Buchstabe-plus-Ziffer oder die
Zahlregel den Ausdruck anfasst, und „Johnson & Johnson" vor allem, was das
Kaufmannsund umschreibt.

Wer einen Namen vermisst, trägt ihn dort nach. Deutsche Namen gehören nicht
hinein – „Siemens" und „Allianz" spricht die Stimme richtig.

#### Die Regel gilt nicht nur für Namen

Am 11. August 2026 hat der Betreiber sie ausgeweitet: **auch Anglizismen.**
Und das ist keine Kleinigkeit – ein Börsentext besteht zur Hälfte aus ihnen.
Die Stimme las „Boom" als „Bohm", „Rating" als „Ratting", „Cashflow" als
„Kaschflow", und selbst der Name der Sendung ging als „Marktupdahte" durch.

Die Tabelle deckt deshalb neben den Namen ab, was in Börsentexten ständig
vorkommt: Rating, Guidance, Outlook, Earnings, Cashflow, Buyback, Spread,
Leverage, Blue Chips, Private Equity, CEO, IPO und so fort.

**Zusammengesetzte Ausdrücke stehen vor ihren Bestandteilen** – „Cashflow"
vor „Cash", „Marktupdate" vor „Update". Umgekehrt zerlegte die kürzere Regel
das längere Wort.

Nicht hinein gehört, was im Deutschen längst deutsch gesprochen wird: „ETF",
„KI", „Broker", „Bond", „Trend". Wer hier zu viel einträgt, macht aus einer
Nachrichtensendung eine Karikatur – der Satz aus dem Kopf von
`lib/sprechfassung.ts` gilt für Anglizismen genauso.

#### Eine Liste ist nie fertig – deshalb meldet der Lauf, was fehlt

Jeder dieser Fälle ist bisher **beim Hören** aufgefallen, nicht beim Bauen.
Das kostet jedes Mal eine Folge, eine Meldung und einen zweiten Lauf.

`verdaechtigeAnglizismen()` dreht das um: `podcast-folge-erzeugen.ts`
schreibt vor dem Sprechen ins Protokoll, welche Wörter englisch aussehen und
keine Umschrift haben. Erkannt wird das an Schreibweisen, die es im Deutschen
kaum gibt – `-ing` am Ende (außer `-ling`), `tch`, `sh` am Wortende, `y` hinter
einem Konsonanten, `th` am Wortende.

**Es ist ein Hinweis, kein Urteil**, und nichts wird von selbst ersetzt: Ob
ein Wort englisch klingen soll, entscheidet ein Ohr. Der Lauf wird davon
weder rot noch abgebrochen.

Die Gegenprobe ist die wichtigere Hälfte und steht als Test fest: Der Melder
muss bei „Frühling", „Zwilling", „Lehrling", „Wachstum" und „Mythos"
schweigen – und **bei allem, was die Tabelle schon umschreibt.** Ein Melder,
der jeden Tag dieselben Wörter anzeigt, wird nach einer Woche überlesen; das
ist dieselbe Rechnung wie beim roten Lauf, der zum Rauschen wird.

#### Die Endung einer Adresse wird buchstabiert

„punkt de" sprach die Stimme als Silbe – irgendwo zwischen „deh" und „die",
und im Ohr war es weder Wort noch Endung. Seit dem 11. August 2026 heißt es
**„punkt D E"**, geschrieben als deutsche Buchstabennamen: `punkt Deh Eh`.
Ein „DE" läse das Modell wieder als Wort.

Die Tabelle `ENDUNG` in `lib/sprechfassung.ts` deckt `.de`, `.com` und `.net`
ab und gilt für **jede** Adresse, nicht nur die eigene – auch „reuters punkt
Zeh Oh Emm".

Der Abschlusssatz trägt die Adresse deshalb als Adresse und nicht als fertige
Lautschrift; `sprechbar()` macht daraus, was zu sprechen ist. Sonst stünde die
Aussprache an zwei Stellen und ginge beim nächsten Mal auseinander.

#### Der eigene Name war der schlimmste Fall

„IM" ist im Deutschen ein Wort. Die Stimme las „das Marktupdate von IM
Invests" deshalb als „vom **im** Invests" – zwei Buchstaben, die die Marke
tragen sollen, verschluckt zu einer Präposition. Und „iminvests punkt de" kam
als ein einziges deutsches Wort heraus.

Beides fiel jeden Morgen zweimal, in Begrüßung und Abschluss, und niemandem
auf – bis der Betreiber es am 11. August hörte.

Gesprochen wird die Marke jetzt englisch und buchstabiert: **„Ei Emm
Inwests"**, die Adresse als „Ei Emm Inwests punkt de". Zwei Dinge gehören
dazu:

- Das Muster steht **groß und ohne `i`-Schalter**. Ein unempfindliches
  `\bIM\b` träfe jedes deutsche „im" – ein Test hält beides fest.
- Begrüßung und Abschluss stehen im Code weiter als „IM Invests" und laufen
  durch `englischeNamenSprechbar()`. Eine fertige Lautschrift an drei Stellen
  im Quelltext ginge beim nächsten Mal auseinander.

### Die Prüfung gibt es genau einmal

`stimme-erzeugen.py` hatte seine eigene Fassung von `brauchbar()`. Das war als
Übergang gedacht (siehe „`sprechstimme.py` und `stimme-erzeugen.py` stehen
doppelt da") und hat sich am selben Abend gerächt: Ein Fehler, der an zwei
Stellen auftritt, weil die Prüfung an zwei Stellen dieselbe Lücke hat, ist
nicht behoben, wenn man eine davon repariert.

Der Podcast ruft jetzt `sprechstimme.brauchbar` auf. Der Import steht **in**
der Funktion, nicht im Kopf der Datei: Beide Module richten beim Laden einen
`SIGALRM`-Wecker ein, und wer sie in der falschen Reihenfolge lädt, hebelt die
Zeitgrenze des anderen aus.

### Was schon aufgenommen ist, prüft `aufnahmen-nachpruefen.yml`

Fertige Aufnahmen sind unter der alten Prüfung entstanden. Sie alle anzuhören
kostet eine Stunde, sie alle neu zu sprechen vier Läuferstunden. Der Lauf legt
denselben Maßstab nachträglich an und sagt, **an welcher Sekunde** man
hinhören sollte – unter zwei Minuten, nur ffmpeg und numpy.

Er wird nicht rot. Ein Fund ist ein Hinweis, kein Beweis; ob eine Stelle
wirklich kaputt ist, entscheidet ein Ohr.

### Wer wissen will, ob ein Video auf dem Kanal liegt, fragt den Kanal

Zweimal hintereinander – am 9. und am 10. August 2026 – lagen zwei Videos
desselben Tages auf YouTube. Beide Male gab es einen Riegel, beide Male hat er
nicht getragen, und beide Male aus **demselben Grund**: Er fragte einen
Stellvertreter.

    9. August    gefragt: der eigene Checkout des Feeds
                 daneben:  ein Handstart hatte längst hochgeladen
    10. August   gefragt: origin/main beim Auslösen des Laufs
                 daneben:  Lauf 1 trug erst dreißig Sekunden später ein

Nach dem zweiten Mal wurde auf `origin/main` von jetzt umgestellt. Das war
richtig und reicht trotzdem nicht – denn am selben Tag trat der Fall ein,
gegen den **kein** Feed-Riegel hilft: Ein Lauf lud hoch, schrieb den Feed und
scheiterte danach am Commit. Auf dem Kanal lag ein Video, im Register stand
keins. Jede Prüfung, die das Register liest, hätte danach „gibt es noch nicht"
gesagt.

Seit dem 10. August fragt deshalb `scripts/podcast-youtube.ts` **den Kanal
selbst**, und zwar unmittelbar vor dem Upload – nicht vierzig Minuten davor in
einem anderen Job. Erkannt wird die Folge des Tages an zweierlei, eins genügt:

    derselbe Titel               aus der Tagesausgabe gebaut, je Tag eindeutig
    dasselbe Erscheinungsdatum   eine Sendung, eine Folge je Tag

Kein roter Lauf: Dass die Folge schon oben ist, ist der Zustand, den der
Riegel herstellen soll. `nochmal: true` setzt ihn außer Kraft, wenn eine Folge
wirklich ersetzt werden soll.

**Die Lehre gilt über den Fall hinaus.** Ein Riegel ist so gut wie die Quelle,
die er fragt. Wer prüft, ob etwas veröffentlicht wurde, prüft dort, wo es
veröffentlicht wird – nicht in der Buchhaltung darüber. Die kann fehlen,
veraltet sein oder gar nicht erst geschrieben worden sein.

### Ein Push, der nach der Veröffentlichung scheitert, ist rot

Die zweite Hälfte desselben Vorfalls, und die unangenehmere. Lauf 2 hatte
hochgeladen, den Feed geschrieben und **auf den Server gelegt** – und
scheiterte danach am Commit: Konflikt im Register, drei Versuche, alle
vergebens. Der Lauf blieb **grün**.

Zurück blieb ein Zustand, den man von außen nicht sieht und von innen nicht
vermutet: Auf dem Webspace lag ein `feed.xml`, das auf eine Folge zeigte, von
der `main` nichts wusste. Website und Spotify erzählten verschiedene Dinge.

Das ist kein Fall für die Trennlinie oben. Ein misslungener Upload sagt
nichts über den Zustand der Website – ein misslungener Registereintrag
**nach** einer Veröffentlichung sagt alles: Zwei Wahrheiten laufen
auseinander, und keine spätere Wiederholung räumt das auf. Also roter Lauf.

Nebenbei fiel dabei auf, dass die Wiederholschleife gar keine war: Ein
abgebrochener Rebase lässt ungelöste Konflikte in der Arbeitskopie zurück,
und die beiden Folgeversuche scheiterten nur noch an
`Pulling is not possible because you have unmerged files`. Wer eine Schleife
um `git pull --rebase` legt, räumt zwischen den Runden mit
`git rebase --abort` auf.

### Ein Riegel, der auf die Reihenfolge baut, baut auf nichts

Am 9. August 2026 standen auf der Website aufbereitete eigene Zahlen statt
Meldungen, obwohl der Agent zweimal grün gelaufen war. Er hatte beide Male
**nichts getan**, und zwar völlig ordnungsgemäß.

Der Ablauf, in UTC:

    01:27 / 01:41   Termin des Agenten
    01:57           Termin des Nachrichtenlaufs

    tatsächlich:
    02:29           nachrichten.yml – schreibt den Notbehelf
    03:15 / 03:19   der Agent – „Die Ausgabe steht bereits", Ende

Beide Läufe waren verspätet, aber **unterschiedlich stark**, und damit
kippte die Reihenfolge. Der erste Schritt des Agenten fragte
`[ -f data/editions/$tag.ts ]` – und die Datei war da.

Das ist derselbe Denkfehler, den der Wächter zwei Tage zuvor abgelegt hatte:
**„Ist eine Ausgabe da?" ist die falsche Frage, seit der Notbehelf immer
eine liefert.** Der Agent fragt seither nach der Herkunft, mit demselben
Maßstab – weniger als die Hälfte externer Quellen heißt Notbehelf.

**Und der Entwurf wird auch genommen.** Seit demselben Tag ersetzt
`nachrichten.yml` einen stehenden Notbehelf durch den recherchierten
Entwurf – unter zwei Bedingungen, beide im Schritt „Steht die Ausgabe
schon?" geprüft:

1. **Ein Entwurf von heute liegt auf `nachrichten-entwurf`.** Ohne ihn gibt
   es nichts Besseres, und ein Ersetzen ohne Ersatz wäre nur Bewegung.
2. **Der Podcast hat den Notbehelf noch nicht vertont.** Danach ist der Zug
   abgefahren: Website und Folge müssen dasselbe erzählen, und eine
   Website, die andere Nachrichten zeigt als die Folge des Tages, wäre
   schlimmer als der Notbehelf.

Das Ersetzen selbst ist ein `git revert` des Notbehelf-Commits plus die
normale Schreibkette, zusammen in **einem** Commit – kein eigenes Skript,
das Artikel aus `news.ts` schneidet, keine zweite Stelle, die die Struktur
der Datei kennen muss. Scheitert der Entwurf dabei an der Prüfung, bricht
der Lauf rot ab und lässt den Notbehelf stehen; ein Rückfall auf Weg 3
würde denselben Notbehelf noch einmal schreiben, den der Revert gerade
entfernt hat.

Angestoßen wird das nicht nur vom eigenen Zeitplan: `kurse.yml` prüft bei
jedem Lauf die Herkunft der stehenden Ausgabe und stößt den Nachrichtenlauf
an, wenn Notbehelf + frischer Entwurf + noch kein Podcast zusammenkommen.
Ein Notbehelf hat damit den ganzen Vormittag Gelegenheiten, ersetzt zu
werden – bis 04:53 deutscher Zeit, wenn der Podcast ihn festschreibt.

## Die Lernseiten sprechen mit derselben Stimme wie der Podcast

Seit dem 10. August 2026. Vorher las die Leiste über `speechSynthesis` mit der
Stimme des Geräts – auf jedem Telefon eine andere, auf vielen Rechnern eine
Computerstimme, und auf etlichen Geräten ist überhaupt keine männliche
deutsche Stimme installiert.

**Gesprochen wird jetzt vorher.** Ein Modell, das im Browser klont, gibt es
nicht; ein Vorlesedienst bekäme jeden Absatz zu sehen; einen eigenen Server
hat diese Website nicht. Bleibt: einmal auf einem Läufer sprechen, als Datei
ablegen, im Browser abspielen.

    scripts/lese-texte-schreiben.ts   was zu sprechen ist (Arbeitsliste)
    scripts/sprechstimme.py           wie gesprochen wird (Zerlegung, Pausen)
    scripts/lese-stimme-erzeugen.py   spricht und wandelt in AAC
    .github/workflows/lese-stimme.yml der Lauf, nachts um 23:19 UTC
    data/lese-audio.json              das Verzeichnis – **das Einzige in `main`**
    components/ui/Aufnahmeleiste.tsx  der Abspieler

### Die Zahlen, an denen alles hängt

Gemessen, nicht geschätzt: **172 Seiten** (102 Lernstufen, 70
Akademielektionen), **710.000 Zeichen**, **4.889 Abschnitte**. Das sind rund
**13,6 Stunden** Sprache, als AAC bei 48 kbit/s mono etwa **280 MB**, und bei
dem am Podcast gemessenen Echtzeitfaktor gut **170 Läuferstunden**.

Daraus folgt alles Übrige:

- **Es passt in keinen Lauf.** Der Workflow hat ein Budget je Läufer und
  arbeitet sich vor – zwölf Läufer, vier Stunden Rechenzeit, dann ist Schluss
  und der Rest bleibt für die nächste Nacht liegen.
- **Die Reihenfolge ist die Zuteilung.** Beginner zuerst, dann die Akademie,
  dann Fortgeschritten, zuletzt Profi. Wer bei null anfängt, hört die eigene
  Stimme in der ersten Nacht; die Sonderfälle folgen. Umgekehrt wäre es falsch
  herum, und ein Test hält die Reihenfolge fest.
- **Die Aufnahmen liegen nicht im Repository und nicht im Paket.** 280 MB
  wären Ballast in jedem Klon und zwanzig Minuten Übertragung bei jedem der
  dreißig täglichen Bauten. Sie liegen unter `~/lese-audio` auf dem Webspace,
  genau wie die Podcastdateien, und `paket-bauen.yml` kopiert sie beim
  Umhängen mit.

### Der Ausbau läuft über drei Wochen – und die Vertonung wartet

Am 10. August 2026 hat der Betreiber entschieden, die Lerntexte vor der
Vertonung inhaltlich auszubauen. Der Grund für die Reihenfolge steht eine
Ebene tiefer: **Der Fingerabdruck hängt an den gesprochenen Abschnitten.**
Wer erst vertont und dann schreibt, spricht dieselbe Seite zweimal – vier
Läuferstunden je Nacht für ein Ergebnis, das bis zum Morgen überholt ist.

Deshalb ist der Zeitplan in `lese-stimme.yml` seit demselben Tag wieder
auskommentiert. **Er ist nicht kaputt**; er wartet. Wieder scharf stellen,
sobald die Inhalte stehen.

Der Ausbau ist auf drei Wochen verteilt, und zwar auf Wunsch des Betreibers
gegen den Verbrauch: Alles in einer Woche zu schreiben, frisst das Kontingent.

| Woche | Lernstufe           | Grafiken ohne Vorlesefassung | Akademie      |
| ----- | ------------------- | ---------------------------- | ------------- |
| 1     | Beginner, 34        | 21                           | ~23 Lektionen |
| 2     | Fortgeschritten, 34 | 26                           | ~23 Lektionen |
| 3     | Profi, 34           | 27                           | ~24 Lektionen |

Die Grafiken sind kein eigenes Paket. Sie stecken in den Stufen, in denen
sie vorkommen – wer eine Beginner-Stufe ausbaut, schreibt die
Vorlesefassungen ihrer Grafiken gleich mit.

### Eine Bildunterschrift ist keine Vorlesefassung

Von 135 Erklärgrafiken hatten am 10. August 2026 nur 61 eine eigene
`description`. Bei den übrigen 74 spricht die Leiste die Bildunterschrift –
und die ist für jemanden geschrieben, der das Bild **daneben sieht**.

    Bildunterschrift   „Zwei Terminkurven im Vergleich"
    Vorlesefassung     „Im Contango kosten spätere Liefermonate mehr als
                        frühere: Beim Weiterrollen wird jedes Mal teurer
                        gekauft, und genau das kostet Rendite …"

Die vorhandenen 61 liegen zwischen 220 und 1.124 Zeichen, im Mittel bei rund 600. Das ist der Maßstab: Wer eine ergänzt, erklärt, was im Bild zu sehen
ist und was man daraus abliest – nicht, wie das Bild heißt.

### Eine Seite ohne Aufnahme ist kein Fehler

Das ist der Grund, warum das Ganze überhaupt schrittweise gehen darf: Findet
die Leiste kein Verzeichniseintrag, spricht wieder das Gerät. Der Unterschied
ist **besser oder normal**, nicht gut oder kaputt.

Dasselbe gilt, wenn die Datei fehlt, obwohl das Verzeichnis sie kennt – ein
halb übertragener Ordner, ein Bau, der neuer ist als die Aufnahmen. Das
`onError` des `<audio>` fällt dann auf die Gerätestimme zurück, statt einen
Knopf stehen zu lassen, der nichts tut.

### Der Fingerabdruck ist die ganze Buchhaltung

Jede Aufgabe trägt einen Hash über ihre **gesprochenen Abschnitte**. Ändert
sich ein Lerntext, ändert sich der Hash, und die Seite steht in der nächsten
Nacht wieder vorn. Ohne ihn gäbe es nur zwei Möglichkeiten, und beide sind
schlecht: jede Nacht dreizehn Stunden neu sprechen, oder Änderungen von Hand
nachhalten.

Deshalb gilt: **Die Abschnitte kommen aus `vorleseAbschnitte()`, nicht aus
einer zweiten Zerlegung.** Stünde hier eine eigene, spräche die Aufnahme etwas
anderes als die Ersatzstimme – und es fiele niemandem auf, bis jemand beides
nacheinander hört.

### Die Marken sind der Grund, warum die Abschnittsanzeige bleibt

Mit der Gerätestimme entstand sie von selbst: Jeder Abschnitt war ein eigener
Auftrag. Eine einzelne Audiodatei hat diese Fugen nicht mehr, also schreibt
der Vertoner die Sekunde mit, in der jeder Abschnitt beginnt. Das kostet beim
Sprechen nichts – die Zeit steht ohnehin da – und trägt „Abschnitt 12 von 40"
samt Vor- und Zurückspringen.

Ein Test prüft, dass zu jeder **gültigen** Aufnahme so viele Marken gehören
wie Abschnitte. Ohne ihn zeigte die Leiste irgendwann „Abschnitt 14 von 12".

### `sprechstimme.py` und `stimme-erzeugen.py` stehen doppelt da

Ausdrücklich Absicht, und ausdrücklich vorläufig. Als das Modul entstand, lief
die nächste Podcastfolge in vier Stunden; ein Umbau des Skripts, das sie
erzeugt, hätte sie riskiert, ohne dass an ihr etwas besser geworden wäre.

**`stimme-erzeugen.py` wird nachgezogen, sobald eine Folge Abstand dazwischen
liegt.** Bis dahin: Wer an den Pausen, der Stücklänge oder der Frist etwas
ändert, ändert es an beiden Stellen.

### Gesprochen wird gebeugt

Geschrieben steht „am 9. August“, und das ist vollständig – wer liest, ergänzt
die Endung im Kopf. Eine Stimme tut das nicht. Sie sagt „am **neunte** August“,
und im Ohr ist das der Unterschied zwischen Sprache und Vorlesemaschine.

Eine Ordnungszahl ist ein Adjektiv. Welche Endung sie trägt, entscheidet das
Wort davor:

    der 9. August       der neunte August       Nominativ
    am 9. August        am neunten August       Dativ
    den 9. August       den neunten August      Akkusativ
    Stand 9. August     Stand neunter August    ohne Artikel

`ordnungszahlenSprechbar()` in `lib/sprechfassung.ts` macht das für Monate,
Quartale und Halbjahre. **Beide Sprechwege benutzen sie** – die Folge über
`sprechbar()`, die Lernseiten über `nurText()` in `lib/vorlese-text.ts`.

Die Lernseiten nehmen ausdrücklich **nur** diese Regel, nicht die ganze
Umschrift: In der Folge wird „26.364,45“ zum Wort, auf einer Lernseite bleibt
es die Zahl, die daneben auch zu sehen ist.

Aufgefallen ist es am 10. August 2026 dem Betreiber beim Hören, keiner
Prüfung. Wer eine weitere Stelle baut, an der Text gesprochen wird, führt ihn
durch dieselbe Funktion.

## Der Alias `@/` gilt jetzt auch außerhalb des Bündlers

`scripts/alias-hook.mjs` löst ihn auf. Eingehängt über `--import`:

    node --experimental-strip-types --import ./scripts/alias-hook.mjs skript.ts

Vorher war der Alias das Vorrecht von Next.js, und beides hat sich darum
herumgearbeitet: Skripte importierten relativ (`../data/…`), Tests lasen
Daten aus **Dateinamen** statt aus den Modulen – `fortschritt.test.ts` holt
die Lernthemen bis heute so. Das geht, solange das geladene Modul selbst
keinen Alias verwendet, und genau daran endete der Weg, als die Lerndaten
gebraucht wurden: `data/learn/index.ts` holt seine 34 Themen über `@/`.

Der Testläufer hängt den Haken seit dem 10. August für **alle** Tests ein. Die
vorhandenen Umwege dürfen bleiben, wo sie für sich Sinn ergeben; neue braucht
es nicht mehr.

### Was die Sendung über sich sagt, steht nicht in `main`

Beschreibung, Titelbild und Autor der Podcast-Sendung stehen in **einer
Datei auf dem Webspace**: `podcast-audio/feed.xml`. Spotify liest sie, nicht
das Repository.

Erneuert wurde sie bis zum 9. August 2026 nur bei zwei Gelegenheiten – wenn
eine Folge erschien und wenn eine zurückgenommen wurde. Beides sind
Ereignisse an einer **Folge**. Ändert sich etwas an der **Sendung**, gab es
keinen Weg nach draußen; man musste auf die nächste Folge warten.

Genau so blieb der Name „IM Investments" bei Spotify stehen, nachdem er im
Repository längst berichtigt war: richtig im Code, grün im Bau, alt beim
Hörer. **`podcast-schaufenster.yml`** schließt die Lücke – Feed neu
schreiben, Feed und Titelbild übertragen, keine Folge anfassen.

Dass die Datei liegt, heißt noch nicht, dass jemand sie gelesen hat: Spotify
und Apple holen den Feed in eigenem Takt, meist binnen Stunden. Das
Titelbild braucht regelmäßig länger als der Text.

Und wenn doch einmal eines zu viel entsteht:
`.github/workflows/podcast-zuruecknehmen.yml` nimmt eine Folge vollständig
zurück – Video gelöscht, Registereintrag entfernt, Feed neu geschrieben
**und auf den Server gelegt.** Die letzte Hälfte ist die, die man vergisst:
Der Feed, den Spotify abonniert, liegt auf dem Webspace, nicht im
Repository. Wer nur den Eintrag ändert, ändert für einen Hörer nichts.

### Eine Grenze, die den guten Tag gerade eben trägt, ist eine Wette

Am 8. August 2026 schrieb `nachrichten-agent.yml` seinen Entwurf in 40
Zügen. Am 9. August endete er nach 3 Minuten 25 mit `max_turns` bei 41 – und
die Website bekam den Notbehelf aus Kursdaten statt recherchierter
Nachrichten.

Die Zahl 40 war nie geprüft worden, sie hatte nur nie gestört. Das ist das
Muster: **Eine Obergrenze, die beim letzten Mal gerade so gereicht hat, ist
kein Beleg, dass sie reicht.** Züge werden verbraucht, nicht bezahlt; die
Grenze, die wirklich schützt, ist `timeout-minutes` am Job.

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

## Ein Artefakt ist kein Ergebnis, das jemand sieht

Der zweite Teil der Frage wird leicht überlesen. Am 9. August 2026 lag eine
fertige Hörprobe der neuen Stimme als Artefakt an einem Lauf – 32 Sekunden
Audio, tadellos erzeugt. Gesehen hat sie niemand: Ein Artefakt ist ein ZIP
hinter einer Anmeldung, und der Egress-Proxy dieser Umgebung lässt weder
`api.github.com` noch den Artefakt-Speicher durch (`CONNECT tunnel failed,
response 403`). Beides prüfbar über `curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

**`git` ist der einzige Kanal, der von hier aus trägt.** Also legt
`hoerprobe.yml` die Aufnahme zusätzlich auf einen wurzellosen Zweig
`hoerprobe` – dieselbe Bauart wie `quellen-heute`: nie gebaut, nie
veröffentlicht, jeder Lauf ersetzt ihn vollständig, keine Historie.

    git fetch origin hoerprobe
    git show origin/hoerprobe:probe.wav > probe.wav

Wer einen Lauf baut, dessen Ergebnis eine **Datei** ist, hängt sie nicht nur
als Artefakt an, sondern legt sie auf einen solchen Zweig. Sonst ist sie
entstanden und trotzdem nicht da.

Der Lauf war übrigens rot, und das war der zweite Grund, warum die Probe
unbeachtet blieb. Rot wegen eines veralteten Urteils: Gemessen wurde **ein**
Läufer, gesprochen wird seit dem 8. August von **vier**. Die Zahl stimmte,
der Satz daneben nicht – nachgezogen in `scripts/stimme-messen.py`.

# Der erste Besuch ist weiß

Wer die Website zum ersten Mal öffnet, sieht sie hell – **auch auf einem Gerät,
das auf Dunkel gestellt ist.** Der Betreiber hat das am 13. August 2026
festgelegt.

Die Rangfolge in `startSkript()` (`lib/theme.ts`) hat seither nur noch zwei
Stufen: gespeicherte Wahl, sonst Weiß. `prefers-color-scheme` kommt darin nicht
mehr vor.

(Der Satz stand hier bis zum 14. August 2026 anders: `viewport.themeColor`
nenne „jetzt eine einzige helle Farbe statt zweier nach Systemvorgabe". Das
galt einen Tag lang. Wie es weiterging, steht zwei Abschnitte tiefer – am Ende
liefert das Layout **gar keine** Farbe mehr aus.)

**Das ist die Stelle, an der der nächste Umbau danebengreift.** Die Fassung mit
der Systemvorgabe –

    var t = s==='dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark' : 'weiss'

– steht in jeder Anleitung, sieht wie eine Verbesserung aus und fällt niemandem
auf, der auf einem hell gestellten Rechner entwickelt: Dort verhalten sich beide
Fassungen gleich. Genau deshalb führt `tests/farbschema-start.test.ts` das
Skript **aus** statt seinen Quelltext zu lesen, in allen vier Kombinationen aus
gespeicherter Wahl und Systemvorgabe, und schlägt schon beim bloßen Aufruf von
`matchMedia` an.

Der dunkle Modus ist damit nicht abgeschafft, nur nicht mehr vorgeschlagen: Der
Umschalter im Kopf ist einen Klick entfernt, und die Wahl überlebt jedes
Neuladen.

`colorScheme` steht aus demselben Grund auf `'light'` statt `'light dark'`. Die
Angabe entscheidet, in welcher Farbe der Browser malt, bevor das Stylesheet
gelesen ist; `light dark` hieße „nimm die Systemvorgabe“ und damit ein dunkles
Aufblitzen vor einer weißen Seite. Für den dunklen Modus ist das ohne Belang –
`[data-theme='dark']` in `app/globals.css` setzt `color-scheme: dark`, und die
CSS-Eigenschaft sticht die Meta-Angabe.

## Die Browserleiste wird ersetzt, nicht geändert

Am selben 13. August, wenige Stunden später, meldete der Betreiber einen
**weißen Balken über der dunklen Seite** auf dem Telefon. Eine Regression aus
genau der Umstellung darüber – und lehrreich genug für einen eigenen Abschnitt.

Vorher standen im `<head>` **zwei** `theme-color`-Angaben mit `media`-Bedingung.
Auf einem dunkel gestellten Gerät griff die dunkle schon beim Parsen, ohne eine
Zeile JavaScript. Daneben stand eine JS-Korrektur, die dasselbe noch einmal
tat – sie war nie nötig und wurde deshalb **nie geprüft**.

Seit der erste Besuch weiß ist, ist die Systemvorgabe bedeutungslos: Eine
`media`-Bedingung fragt genau das ab, worauf es nicht mehr ankommt. Also blieb
nur der JS-Weg übrig, und der trug nicht – **zweimal nicht:**

    setAttribute('content', …)   Chromium: wirkt   Safari: wirkt nicht
    Knoten austauschen           Chromium: wirkt   Safari: wirkt nicht

Der zweite Anlauf war der naheliegende Schluss aus dem ersten und ging live,
bevor jemand ihn auf einem Telefon gesehen hatte. Er half nichts. Vorher
ausgeschlossen: Zwischenspeicher scheiden aus, HTML geht mit `no-store`
heraus (`public/.htaccess`), und der Dienstarbeiter fasst die Startseite
nicht an.

**Safari liest `theme-color` beim Parsen und danach nicht mehr.** Damit kann
kein Skript eine Angabe retten, die schon im HTML steht – und ein statischer
Export weiß nicht, welches Schema der Besucher gewählt hat.

### Der dritte Anlauf: gar keine mehr – und warum das schiefging

Am 16. August 2026 wurde die Angabe **ganz gestrichen**. `app/layout.tsx`
lieferte keine `themeColor` mehr aus, angelegt wurde sie ausschließlich vom
Startskript. Die Begründung lautete:

> **Safari** sieht nie eine und färbt den Bereich nach dem
> **Seitenhintergrund**. Der steht schon vor dem ersten Malen richtig, weil
> das Startskript `data-theme` setzt und das CSS die Fläche.

**Das ist falsch.** Am 17. August 2026 hat der Betreiber die Startseite auf
dem Telefon gezeigt – im **hellen** Modus, beige Seite, und darüber ein
**schwarzer** Balken. `html` trägt `background-color: var(--c-canvas)`; der
Seitenhintergrund stand also richtig und wurde trotzdem nicht genommen. Ohne
`theme-color` malt Safari die Fläche schwarz, unabhängig vom Schema.

Bemerkenswert daran ist nicht der Irrtum, sondern **wie er zustande kam**: Er
war die einzige Erklärung, die zu den beiden gescheiterten JS-Anläufen passte,
und wurde deshalb für belegt gehalten. Belegt war aber nur, dass die JS-Wege
nicht tragen – über die Farbgebung ohne Angabe war nie eine Messung gemacht
worden. Eine Annahme, die eine Lücke füllt, sieht aus wie ein Befund.

### Der vierte Anlauf: die helle Farbe stand wieder im HTML – halb richtig

`app/layout.tsx` lieferte `themeColor: LEISTENFARBE.weiss` aus, und das
Startskript änderte den Knoten ab, statt ihn zu ersetzen.

**Ergebnis, am selben Tag gemessen:** Die helle Angabe wird von Safari
genommen – das war der Fortschritt. Die Änderung durch das Skript wird
ignoriert – auf einem dunkel geschalteten Telefon stand ein beiger Balken über
schwarzer Seite. Der alte Fehler, ein viertes Mal.

Damit war die Tabelle vollständig:

| Lage                                    | Safari       |
| --------------------------------------- | ------------ |
| keine Angabe im HTML                    | malt schwarz |
| feste Angabe im HTML                    | nimmt sie    |
| Skript ändert sie danach (setAttribute) | ignoriert    |
| Skript tauscht den Knoten aus           | ignoriert    |

**Safari friert den Wert beim Parsen ein.** Die gespeicherte Wahl steht erst
danach fest. Drei Anläufe waren Varianten desselben unmöglichen Vorhabens, und
das war nach dem ersten schon absehbar – es fehlte nur die Bereitschaft, die
Anforderung selbst infrage zu stellen statt immer neue Umgehungen zu suchen.

### Der fünfte Anlauf: `media` – und warum der Betreiber ihn zurückwies

Zwei Angaben nach `prefers-color-scheme`. Damit folgte der Balken dem **Gerät**
statt der Website. Der Betreiber hat das am selben Tag beanstandet:

> Der Balken soll im White Mode Beige sein, an dem Dark Mode dunkel wie die
> anderen Farben.

Er will, dass der Balken der **Wahl** folgt. Genau das schien unmöglich – und
war es auch, solange nur DOM-Wege versucht wurden.

### Der sechste Anlauf: `document.write`

Alle gescheiterten Wege haben das DOM **nach** dem Parsen verändert:
`setAttribute`, `appendChild`, Knoten austauschen. `document.write` in einem
Skript, das während des Parsens läuft, ist etwas anderes: Der Text geht in den
**Token-Strom des Parsers**, und der baut das Element selbst – wie bei
Quelltext. Genau daran hängt Safaris Auswertung.

Das Startskript steht im `<head>` und läuft synchron, während der Parser noch
im `<head>` ist. Es schreibt:

    <meta name="theme-color" content="#f2ebdd">

mit der Farbe, die zur gespeicherten Wahl gehört.

**Drei Stücke tragen das, und einzeln ist keines etwas wert:**

1. das `document.write` statt einer DOM-Änderung,
2. seine Stellung im `<head>` **vor** dem Rückfall,
3. der Rückfall in `<noscript>`.

Zu (3): Next zieht jede Meta-Angabe, die es sieht, an den Anfang des `<head>` –
also vor das Skript. Bei mehreren passenden Angaben nimmt der Browser die
erste; der Rückfall gewönne dann immer, und der ganze Umbau wäre wirkungslos,
und zwar lautlos. In `<noscript>` sieht Next ihn nicht. Inhaltlich gehört er
ohnehin dorthin: Wo das Skript läuft, schreibt es die richtige Farbe; wo es
nicht läuft, ist die Systemvorgabe die beste verfügbare Schätzung.

### Der Umschalter lädt neu

`document.write` wirkt nur, während geparst wird. Ohne Neuladen bliebe der
Balken nach einem Umschalten in der alten Farbe – und weil diese Website
clientseitig navigiert, die ganze Sitzung lang. Genau der Zustand, den der
Betreiber fünfmal gemeldet hat.

Der Preis ist ein kurzes Neuladen bei einem Klick, den kaum jemand öfter als
einmal macht. Verloren geht dabei wenig: Rechner, Merkliste und Lesezeichen
liegen im `localStorage`.

### Was die Prüfung daraus gelernt hat

`tests/farbschema-start.test.ts` hat drei kaputte Fassungen abgesegnet. Nicht
aus Nachlässigkeit: Sie maß das **Verhalten in einem Nachbau**, und der Nachbau
machte alles mit. Ein `setAttribute` wirkt dort immer.

Sie prüft jetzt die **Bauart**: dass zwei `media`-Angaben ausgeliefert werden,
dass beide Farben aus `LEISTENFARBE` kommen – und dass in `lib/theme.ts`,
`app/layout.tsx` und `ThemeToggle.tsx` außerhalb von Kommentaren kein
`theme-color` mehr vorkommt.

Dazu ist der Nachbau von einer Attrappe zu einer **Falle** geworden:
`document.head`, `createElement` und `querySelectorAll` werfen. Ein Skript, das
sie anfasst, bricht ab und meldet sich. Nachgestellt – die Falle schnappt zu.

**Die allgemeine Lehre:** Ein Nachbau, der alles mitmacht, bestätigt jede
Fassung. Wo die einzige prüfbare Umgebung nicht die ist, in der es kaputtgeht,
muss die Prüfung an der Bauart ansetzen, nicht am Verhalten.

`startSkript` setzt die Farbe außerdem **immer** statt nur bei gespeicherter
Wahl – ein Zweig, der fast nie durchlaufen wird, wird nie geprüft und trägt
beim ersten Mal nicht, an dem er zählt.

Die Arbeit gibt es zwangsläufig zweimal: einmal als Zeichenkette fürs
Startskript, einmal als Funktion für den Umschalter – das eine ist Text im
`<head>`, das andere eine React-Komponente, sie können sich keinen Aufruf
teilen. `tests/farbschema-start.test.ts` lässt deshalb **beide** über dieselbe
nachgebaute Seite laufen und vergleicht das Ergebnis.

**Die allgemeine Lehre:** Wer eine Absicherung entfernt, die etwas anderes
verdeckt hat, deckt damit den verdeckten Fehler auf – und zwar erst beim
Nutzer. Beim Streichen einer redundanten Stelle gehört geprüft, ob die
verbliebene je gearbeitet hat.

**Und die zweite:** Der zweite Anlauf ging live, weil er in Chromium grün war
und plausibel klang. Geprüft war damit nur, was ohnehin schon funktioniert
hatte. Wo die einzige Umgebung, in der sich etwas prüfen lässt, nicht die ist,
in der es kaputtgeht, ist ein „müsste jetzt gehen" keine Aussage – dann gehört
der Weg gewählt, der **ohne** die ungeprüfte Annahme auskommt.

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

## Warten und selbst mergen – Auto-Merge greift hier **nicht**

Der Anlass ist ein Fehler vom 9. August 2026: Bei #160 stand im Chat „ich
merge, sobald der Check grün ist“ – und dann endete der Zug. Der PR lag, bis
der Betreiber ihn von Hand mergte. Bei #157 bis #159 hatte dieselbe Sitzung
gewartet und gemergt; es hing an nichts als der Aufmerksamkeit.

Naheliegende Abhilfe: Auto-Merge. Der Betreiber hat ihn noch am selben Abend
freigeschaltet (Settings → General → Pull Requests → Allow auto-merge).
**Es funktioniert trotzdem nicht**, und der Grund ist wichtig genug, um ihn
festzuhalten, damit niemand ein zweites Mal darauf baut:

```
sofort nach dem Anlegen:   "already in clean status (all checks passed)"
während der Check läuft:   "unstable status"
```

Auto-Merge setzt einen **erforderlichen** Status-Check voraus – etwas, worauf
GitHub warten kann. Auf `main` ist keiner hinterlegt, also gilt ein frischer
PR sofort als mergefähig, und die Anmeldung wird abgelehnt. Ein PR mit
Pflichtcheck hieße direkt nach dem Anlegen `blocked`, nicht `clean`.

Damit bleibt es beim Handbetrieb, und der ist eine Regel, keine Absicht:

**Wer einen Pull Request anlegt, beendet den Zug nicht, bevor er gemergt
ist.** Prüfung abwarten – sie dauert vier bis fünf Minuten –, Ergebnis
ansehen, mergen. „Ich merge gleich“ ist kein Zustand, den man hinterlässt.

Soll Auto-Merge doch greifen, müsste „Bauen und prüfen“ unter Settings →
Branches als Required status check für `main` eingetragen werden. Das ist
eine Entscheidung des Betreibers: Sie sperrt dann auch ihn selbst aus, wenn
die Prüfung rot ist.

## Nebenwirkung: `workflow_dispatch` braucht `main`

GitHub startet über `workflow_dispatch` nur Workflows, die auf der
Standardverzweigung liegen. Ein neuer Workflow auf einem Nebenzweig antwortet
mit **404**, und das sieht aus wie „gibt es nicht“ statt wie „noch nicht
gemergt“. Wer einen Workflow zum Starten von Hand braucht, muss ihn erst nach
`main` bringen — `zinsen.yml` hing genau daran.

## Ein Wächter, der seinen eigenen Alarm fortschreibt, ist keiner

`lib/website-zahlen.ts` zählt beim Bauen, wie viel auf dieser Website steht –
Lernstufen, Kurse, Artikel, Quellen. Die Seite `/zahlen` zeigt es, aber der
Grund für die Zählung ist ein anderer: **Diese Zahlen fallen nicht von selbst.**
Ein Artikel verschwindet nicht, ein Instrument wird nicht weniger, eine
Podcastfolge löscht sich nicht.

Fällt trotzdem eine, hat sich ein Bestand geleert – ein Abruf hat eine Datei
halb geschrieben, ein Import kam leer zurück, ein Verzeichnis ist beim Umbau
liegengeblieben. Genau der Fehler, gegen den in diesem Repository fast jede
Regel steht: Der Bau gelingt, die Paketprüfung ist zufrieden, alle Tests sind
grün — es steht nur weniger da.

`data/zahlen-stand.json` hält den letzten bekannten Stand, `npm run zahlen`
vergleicht. Zwei Dinge daran sind nicht offensichtlich, und beide sind die
Antwort auf eine Falle, in die dieses Projekt schon getappt ist:

**Erstens: Der Stand muss fortgeschrieben werden, sonst wird der Wächter
stumpf.** Bliebe er bei 165 Artikeln stehen, während es 400 werden, wäre ein
Absturz auf 200 kein Rückgang mehr. Die Absicherung stünde jahrelang auf Grün,
ohne je etwas gesehen zu haben — _eine Absicherung, die nie anschlägt, sieht
aus wie Ruhe._ Deshalb schreibt der nächtliche Bau (`paket-bauen.yml`, nur im
`schedule`-Lauf) den Stand fort und committet ihn.

**Zweitens: Ein Rückgang hält genau dieses Fortschreiben an.** Das ist der
Punkt, an dem sich der Wächter sonst selbst aufhebt: Fiele eine Zahl in der
Nacht, würde der gefallene Wert in derselben Nacht zum neuen Maßstab. Die
Warnung stünde einmal in einem Protokoll, das niemand liest, und am nächsten
Morgen wäre alles wieder ruhig. Der Stand bleibt deshalb auf dem höheren Wert
stehen, und die Warnung wiederholt sich bei **jedem** Lauf, bis jemand
entscheidet: `ANWENDEN=1 TROTZDEM=1 npm run zahlen`, von Hand, nicht in einem
Workflow.

Ein Rückgang ist eine Warnung und kein roter Lauf. Es gibt legitime: Ein
Instrument ohne Quelle fliegt raus, zwei Lektionen werden zusammengelegt. Eine
Prüfung, die dabei rot wird, schaltet jemand ab – und dann fängt sie auch den
echten Fall nicht mehr.

**Umbenennen ist der dritte Weg, auf dem das kaputtgeht.** Der Abgleich hängt
allein an `id`. Ein umbenannter Schlüssel meldet einmal einen Sturz auf null –
sieht also aus wie ein Datenausfall – und ist danach ein neuer Schlüssel ohne
Vorgeschichte. `tests/website-zahlen.test.ts` prüft deshalb jeden im Stand
festgehaltenen Schlüssel gegen die Zählung und fängt die Umbenennung im Pull
Request, statt sie am nächsten Morgen als Fehlalarm auftauchen zu lassen.

## Ein Weg, der nie etwas geliefert hat, sieht aus wie ein Weg

Am 20. August 2026 wollte der Betreiber wissen, warum Alibaba an dem Tag
Zahlen vorlegte und weder im Kalender noch auf der Aktienseite etwas davon
stand. Die Antwort auf diese eine Frage war schnell da – Alibaba ist ein
ausländischer Emittent und reicht kein `8-K` mit Punkt 2.02 ein. Die Antwort
auf die Frage dahinter war es nicht.

Nachgezählt: **318 der 1.029 geführten Aktien** haben einen Meldetermin, und
**302 davon sind amerikanisch.** Acht kommen aus Irland, drei aus der Schweiz,
je einer aus fünf weiteren Ländern. SAP, Siemens, Allianz, Bayer, LVMH,
Nestlé, Toyota, Samsung, Alibaba: nichts.

Für genau diese Lücke ist im Juli 2026 ein zweiter Weg gebaut worden, über
Twelve Data. Er ist seitdem jede Nacht gelaufen, 75 Minuten lang, und hat
**nie eine einzige Zeile geliefert.**

### Es stand im Protokoll, 578-mal

    ABBV: 403 – {"code":403,"message":"/earnings is available exclusively
    with grow or pro or ultra or venture or enterprise plans. …"}
    ABEV3: 403 – {"code":403, …
    ABI: 403 – {"code":403, …

Und darunter, als Zusammenfassung des Laufs, in einer Zeile:

    Über Twelve Data ist nichts dazugekommen.

Der Lauf war grün. Jeden Tag. Der Endpunkt ist im kostenlosen Tarif nicht
enthalten – nicht bei europäischen Kürzeln, nicht bei asiatischen, auch nicht
bei amerikanischen. Der Demo-Schlüssel der ersten Probe konnte `AAPL`
abrufen; ein echter kostenloser Schlüssel kann es nicht.

Im Kopf von `quellen-probe.yml` stand die Frage sogar wörtlich: „Was ein
Schlüssel nicht beantwortet, solange keiner hinterlegt ist: ob der kostenlose
Tarif den Endpunkt `/earnings` überhaupt freischaltet. … Beides zeigt sich
beim ersten Lauf." Es hat sich beim ersten Lauf gezeigt. Niemand hat
hingesehen.

### Was daran allgemein ist

_Der teuerste Fehler ist nicht der rote Lauf, sondern der stille._ Das steht
seit Monaten in `AGENTS.md`, und hier ist die Bauform, in der er sich
versteckt: **Ein Weg, der scheitert und dabei grün bleibt, ist von einem Weg,
der funktioniert, nicht zu unterscheiden – außer man zählt nach, was er
geliefert hat.**

Die Zahl stand da. Sie stand unter 578 Warnzeilen, und eine Zusammenfassung,
die man erst nach 578 Zeilen liest, ist keine.

Daraus zwei Regeln:

1. **Wer einen zweiten Weg baut, prüft nach dem ersten Lauf, ob er getragen
   hat** – nicht ob er lief. „Hat geantwortet" ist keine Aussage; „hat _n_
   Einträge beigesteuert" ist eine.
2. **Ein Fehler, der sich nicht von selbst erledigt, wird beim ersten Mal
   laut und danach nicht mehr wiederholt.** `TarifSperre` in
   `lib/providers/twelvedata-termine.ts` bricht deshalb nach der ersten
   Antwort dieser Art ab: Die zweite Anfrage bekäme dieselbe Antwort und die
   achthundertste auch. Aus 75 Minuten werden Sekunden, und aus 578 Zeilen
   eine.

Der Weg selbst bleibt stehen. Er funktioniert an dem Tag, an dem jemand einen
Tarif bucht – und das ist eine Geldentscheidung des Betreibers, keine des
Skripts.

### Und ein Satz, der auf der Website falsch geworden war

Auf der Kalenderseite stand: „Für die übrigen Werte kommt deshalb eine zweite
Quelle hinzu, sobald sie bereitsteht." Sie stand längst bereit und lieferte
nichts.

Ein Satz, der eine Lösung ankündigt, die es nicht gibt, ist schlechter als
das Eingeständnis: **Er hält die Frage für erledigt.** Wer ihn liest, hakt die
Lücke innerlich ab und fragt nicht weiter. Er ist ersetzt durch das, was gilt
– sieben Quellen geprüft, keine kostenlose gefunden, die Lücke bleibt und
steht seitdem nicht nur auf der Kalenderseite, sondern auf jeder betroffenen
Aktienseite.

## Zwischen New York und Berlin liegen nicht immer sechs Stunden

Derselbe Auftrag verlangte, dass im Kalender steht, „um wie viel Uhr
europäischer Zeit die Zahlen veröffentlicht werden". Die Quelle gibt das her,
und zwar besser als erwartet: `acceptanceDateTime` in der submissions-Datei
der SEC ist die Sekunde, in der die Börsenaufsicht die Meldung angenommen hat.
Näher kommt eine freie Quelle nicht an den Moment der Veröffentlichung – ein
Unternehmen reicht das `8-K` minutennah zur Pressemitteilung ein.

Nachgemessen am 20. August 2026: `2026-08-06T20:01:12.000Z`. Das sind 16:01
Uhr New Yorker Zeit, eine Minute nach Börsenschluss. Das `Z` ist echtes UTC
und keine Ortszeit mit einem Buchstaben dahinter – geprüft an einem zweiten
Zeitstempel, `2026-08-11T00:56:26.000Z`, den EDGAR trotz des Datums noch dem 10. August zurechnet, weil es dort 20:56 Uhr war.

### Die Falle

Naheliegend wäre, sechs Stunden zu addieren. Das ist an rund elf Monaten im
Jahr richtig und an drei Wochen falsch: **Amerika stellt die Uhr am zweiten
Sonntag im März um, Europa am letzten.** Dazwischen beträgt der Abstand fünf
Stunden.

Und genau in diese drei Wochen fällt die amerikanische Berichtssaison für das
erste Quartal. Wer stumpf sechs addiert, schreibt für jeden Termin dieser
Wochen 22:00 Uhr hin, wo 21:00 Uhr richtig wäre – für die Termine, die am
häufigsten gelesen werden.

### Deshalb wird die Wanduhr fortgeschrieben und nicht der Zeitpunkt

Ein Unternehmen meldet nach _seinem_ Börsenschluss, und der liegt das ganze
Jahr über um 16:00 Uhr New Yorker Zeit. Festgehalten wird deshalb die **New
Yorker Wanduhrzeit** der Vorjahresmeldung. Die deutsche Zeit entsteht erst in
der Anzeige, aus dem erwarteten Tag – über `Intl.DateTimeFormat` und die
Zeitzonennamen, nicht über eine eigene Umstellungstabelle. Eine Tabelle wäre
eine Kopie der Regeln, die niemand nachzieht, wenn ein Land seine ändert.

Wer den _Zeitpunkt_ um ein Jahr verschöbe, verschöbe die Zonenlage mit: Aus
16:01 Uhr im August würde im Februar 15:01 Uhr.

### Warum die Lage vor der Minute steht

Was feststeht, ist die Lage zur Handelssitzung: Ein Unternehmen, das seit
Jahren nach dem US-Schluss meldet, meldet auch dieses Mal nach dem
US-Schluss. Daran hängt die einzige Frage, die ein Anleger hier wirklich hat –
bewegt sich der Kurs noch heute oder erst morgen früh?

Was schwankt, ist die Minute: 16:01 im einen Jahr, 16:32 im nächsten. Sie
steht deshalb dahinter und mit dem Wort, das sie einordnet: „im Vorjahr". Eine
Zeitangabe ohne dieses Wort wäre eine Zusage, die die Quelle nicht deckt –
dieselbe Überlegung wie beim Tag, der `geschaetzt` trägt.

Eine Uhrzeit entsteht überhaupt nur, wenn **zwei aufeinanderfolgende Jahre in
derselben Lage** gemeldet haben. Ein einzelner Zeitstempel ist kein Muster,
und zu einem ohnehin geschätzten Tag käme sonst eine falsche Stunde dazu.
Verglichen wird die Lage und nicht die Minute: Zwischen 16:01 und 16:35 liegen
fünfunddreißig Minuten und keine Aussage, zwischen 8:30 und 16:05 liegt ein
Handelstag.

## `000` ist der Hoster, `404` sind wir

Am Morgen des 20. August 2026 kam die zweite Fehlermail aus `kurse.yml` binnen
sechs Stunden. Beide Male hatte `iminvests.de` eine gute halbe Stunde nicht
geantwortet – 23:09 bis 23:43 und noch einmal um 04:58 –, beide Male stand die
Website danach von selbst wieder. Um 05:19 antwortete sie mit 200, mit einem
Bau von 05:07 und Kursen von 05:17.

Der Fall steht in `AGENTS.md` unter „Ein roter Lauf ist ein Vorrat": „`000`
von außen → **Warnung.** Der nächste Lauf trägt es nach." Im Workflow stand
etwas anderes, mit einer eigenen Begründung: „Dass die eigene Website nicht
antwortet, ist der lauteste Fall, den es hier gibt."

Beides klingt richtig, und beides ist es – für verschiedene Fälle. **Der
Unterschied stand im Antwortcode, und zwar in dem, den es schon gab:**

- **`000`** heißt: Auf Port 443 antwortet niemand. Kein TCP, keine
  TLS-Aushandlung, nichts. Ein leerer oder halb getauschter Webordner sähe
  anders aus – ein Webserver, der läuft und nichts findet, antwortet mit
  **403 oder 404**. `000` ist der Host. Und gegen den hilft kein Neubau; das
  stand sogar in der Meldung, die trotzdem einen anforderte.
- **Jeder gelesene Code außer 200** heißt: Die Maschine steht, sie liefert nur
  das Falsche. Das ist unser Fehler, ein Neubau hilft, und dafür ist der rote
  Lauf da.

### Und warum es trotzdem rot werden kann

_Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe._ Ein Hoster, der
eine Stunde weg ist, ist kein Zucken mehr – nur merkt man den Unterschied
nicht an einem einzelnen Lauf, sondern erst am zweiten.

Gefragt wird deshalb, wie der **vorige** Lauf ausging. War der auch schon rot,
ist es kein Flattern mehr, und dann kommt die Mail. Gefragt wird die Laufliste
bei GitHub und nicht die eigene Vermutung – _wer wissen will, ob etwas
passiert ist, fragt die Gegenwart._ Antwortet die Liste nicht, wird rot
angenommen; im Zweifel lieber eine Mail zu viel.

Nicht gewählt wurde der naheliegende Weg, „seit wann läuft kein erfolgreicher
Lauf mehr" zu messen. Der Abstand zwischen zwei `kurse.yml`-Läufen schwankte
in derselben Nacht zwischen 40 und 107 Minuten – geplante Läufe werden hier
regelmäßig verworfen. Eine Zeitgrenze hätte an einer normalen Lücke
angeschlagen und an einem echten Ausfall vorbeigemessen. Der vorige Ausgang
hängt an nichts davon ab.

## Der Betreiber hatte recht: es gab noch eine Quelle

Auf den Befund, dass 711 von 1.029 Aktien keinen Meldetermin haben, kam am 20. August 2026 der Widerspruch: „das kann ja nicht sein, diese Daten sind für
jeden zugänglich."

Er hatte recht, und der Satz davor war zu bequem. „Sieben Quellen geprüft,
keine gefunden" ist eine Aussage über sieben Quellen und keine über die Welt.
Ein Unternehmen, das Quartalszahlen vorlegt, kündigt den Tag an – auf seiner
eigenen Seite, im Finanzkalender, in einer Pflichtmitteilung. Die Frage war nie,
ob die Angabe öffentlich ist. Sie war, ob es eine **Sammelstelle** gibt, die
sie maschinenlesbar führt und die man abrufen darf.

### Was der zweite Durchgang gemessen hat

Nicht geraten, sondern über `quellen-holen.yml` von einem Läufer abgerufen:

- **Yahoo**, drei Pfade (`v10`, `v6`, `v7`): **401**. Der Kalender verlangt
  weiterhin einen Crumb, also Cookie und Einmalkennung aus dem Browser. Das
  bleibt eine gesetzte Zugangssperre, und die wird nicht nachgebaut.
- **Financial Modeling Prep**, **Finnhub**: **401** ohne Schlüssel.
- **Euronext**: Die Seite `/en/financial-calendars` antwortet mit 200 und trägt
  die Rubrik – die Termine selbst rendert sie erst im Browser nach. Der
  geratene JSON-Pfad: 404.
- **London Stock Exchange**: `api.londonstockexchange.com/.../alldata/AZN`
  antwortet mit **200 JSON**, ohne Schlüssel – aber nur mit Stammdaten
  (ISIN, SEDOL, Segment), ohne Termine.
- **Alpha Vantage, `EARNINGS_CALENDAR`: 200, und zwar mit Daten.**

### Die Quelle, die es doch gibt

Ein CSV, ein Abruf, alle angekündigten Termine der nächsten drei Monate.
Gemessen: 1.706 Zeilen, 95 KB, Spalten

    symbol,name,reportDate,fiscalDateEnding,estimate,currency,timeOfTheDay

Zwei Dinge sind daran besser als alles, was diese Website bisher hatte:

1. **Es sind angekündigte Tage, keine hochgerechneten.** Bisher leitet der
   Abruf den nächsten Meldetag aus dem Muster der Vorjahre ab und weist ihn als
   `geschaetzt` aus. Hier steht der Tag, den das Unternehmen selbst genannt hat.
2. **`timeOfTheDay` sagt `pre-market` oder `post-market`** – dieselbe Aussage,
   die vorher aus dem Annahmezeitstempel der SEC abgeleitet werden musste, nur
   direkt von der Quelle.

Und der Fall, der alles ausgelöst hat, steht darin:

    BABA,ALIBABA GROUP HOLDING LIMITED,2026-08-20,2026-06-30,1.77,USD,pre-market

### Was sie nicht kann – gemessen, nicht vermutet

Von 41 europäischen und asiatischen Standardwerten standen **drei** im
Kalender: Novartis, Banco Santander und TotalEnergies, jeweils unter ihrem
US-Kürzel. Siemens, Allianz, Bayer, BASF, LVMH, Nestlé, Roche, AstraZeneca,
Unilever, Toyota, Sony, Samsung: nicht enthalten.

Der Kalender führt also, was in New York notiert – einschließlich der
Hinterlegungsscheine ausländischer Unternehmen. Das ist genau die Lücke, die
die SEC-Quelle prinzipiell nicht schließen kann: Ein ausländischer Emittent
reicht kein `8-K` mit Punkt 2.02 ein und fehlt dort zwangsläufig.

Für Unternehmen, die nur an ihrer Heimatbörse notieren, bleibt die Lücke offen.
Die beiden Spuren dorthin sind benannt und nicht weiterverfolgt worden:
Euronext und die LSE führen Termine, geben sie aber nur an ihre eigene
Oberfläche heraus. Beides nachzubauen wäre dasselbe wie bei Yahoo.

### Warum trotzdem zwei Wege nebeneinander stehen bleiben

Der Kalender läuft **vor** der SEC und gewinnt, wo er etwas weiß: Ein
angekündigter Tag schlägt jede Hochrechnung. Die Ableitung bekommt, was übrig
bleibt – und das sind die 318 US-Unternehmen, die sie lückenlos abdeckt.

Zwei Quellen mit verschiedenen Stärken, und keine ersetzt die andere. Auf der
Seite ist der Unterschied sichtbar: „angekündigt" statt „erwartet", ohne den
Absatz über das Meldemuster, ohne `geschaetzt` und mit der Quelle, aus der der
Tag wirklich stammt. Zwei verschiedene Zusagen dürfen nicht gleich aussehen –
die eine trägt eine Order, die andere nicht.

### Und die Lehre, die über den Fall hinausgeht

**„Geprüft und nichts gefunden" ist ein Zwischenstand, kein Ergebnis.** Er
gehört mit dem Datum und der Liste des Geprüften hingeschrieben, damit der
nächste Anlauf dort weitermacht statt von vorn zu beginnen – und er darf nicht
als Beweis gelesen werden, dass es nichts gibt.

Beim ersten Durchgang wurde nach _Terminen je Unternehmen_ gesucht. Gefunden
wurde die Quelle erst, als jemand nach einem _Sammelkalender_ fragte. Die
Antwort hing an der Form der Frage, nicht an der Verfügbarkeit der Daten.

## Die Börse selbst ist die beste Quelle – man muss sie nur lesen können

Am 20. August 2026, nach dem Fund des Sammelkalenders, kam die nächste
Ansage des Betreibers: „es muss alles vollständig sein es gibt genug quellen
und daten." Und auf die Rückfrage, ob es der bezahlte Tarif werden soll:
„musst du doch wissen / aber free."

Also der freie Weg, und die Reihenfolge nach Ertrag. Der erste Halt war Tokio.

### Was dort liegt

`jpx.co.jp/listing/event-schedules/financial-announcement/` führt „Scheduled
Dates for Earnings Announcements" – die geplanten Meldetermine **aller**
gelisteten Unternehmen, als XLSX, börsentäglich gegen 17:00 Uhr Ortszeit neu.
Kein Schlüssel, keine Anmeldung, kein Kontingent.

Das ist besser als jeder Datenhändler: Zwischen dem Unternehmen und dieser
Website sitzt genau eine Stelle, und die ist die Börse, bei der das
Unternehmen den Termin selbst anmeldet.

### Warum es trotzdem drei Anläufe gebraucht hat

Weil das Werkzeug fehlte, nicht die Quelle.

1. Im lesbar gemachten Text der Seite stand die **Überschrift** der Rubrik,
   aber nicht, wohin sie führt: `quellen-holen.yml` entfernt jedes Markup und
   damit jedes `href`. Daraus wurde `verweise` (PR #289).
2. Der gefundene Verweis zeigte auf eine XLSX, und von der sah man nur, dass
   sie mit 200 antwortet. Daraus wurde der Tabellenzweig im selben Workflow
   (PR #291).
3. Erst danach war die Kopfzeile lesbar – und damit die Frage beantwortbar,
   ob die Codes in der Datei zu unseren Kürzeln passen. Sie tun es: `7203` zu
   `7203.T`, ohne Brücke.

**Die Lehre**: Eine Quelle, die man nicht lesen kann, ist von einer, die es
nicht gibt, nicht zu unterscheiden. Wer nach neun Anbietern aufhört, hat
vielleicht bloß das falsche Werkzeug.

### Warum ein eigener XLSX-Leser

`lib/xlsx.ts`, 250 Zeilen, keine Abhängigkeit. Eine XLSX ist ein ZIP aus XML,
und Node bringt `zlib` mit – dasselbe Argument wie beim eigenen PDF-Erzeuger
und beim eigenen CSV-Zerleger. Die verbreitete Bibliothek dafür wiegt
Hunderttausende Zeilen, von denen dieses Projekt Formeln, Formate und
Diagramme nie braucht.

Zwei Fallen stecken darin, und beide erzeugen Zahlen, die wie Daten aussehen:

- **Text steht nicht in der Zelle.** Die Zelle trägt `t="s"` und eine Nummer;
  der Text liegt in `sharedStrings.xml`. Wer das übersieht, bekommt eine
  Tabelle voller Indizes – und an einer Datumsstelle sieht ein Index aus wie
  ein Datum.
- **Die Excel-Epoche ist der 30. Dezember 1899.** Excel hält 1900 für ein
  Schaltjahr, weil Lotus 1-2-3 das tat und alte Dateien weiter stimmen
  sollten. Wer vom 31. rechnet, liegt bei jedem Datum nach Februar 1900 um
  einen Tag daneben. Bei einem Meldetermin ist das kein Schönheitsfehler: Wer
  am Vortag kauft, kauft in die Zahlen hinein.

Geprüft wird der Leser gegen eine Datei, die **Pythons `zipfile`** geschrieben
hat und die als Base64 im Test steht. Ein Leser, der gegen seinen eigenen
Schreiber geprüft wird, prüft nur, ob beide denselben Irrtum teilen.

### Drei Entscheidungen im Anschluss, jede gegen einen stillen Ausfall

- **Die Adresse wird gesucht, nicht eingetragen.** Der Dateiname trägt ein
  Datum (`kessan06_0807.xlsx`), und es sind zwei Dateien nebeneinander.
  Fest verdrahtet hielte das ein paar Wochen und lieferte danach still nichts
  mehr.
- **Gelesen wird die japanische Seite.** Die englische Fassung trägt **null**
  XLSX-Verweise – gemessen, nicht vermutet. Sie verweist für die Liste auf die
  japanische. Wer die englische nähme, bekäme kein Ergebnis und keinen Fehler.
- **Eine Zahl gilt nur zwischen 32.874 und 73.050 als Seriendatum.** Ohne die
  Schranke würde Toyotas Börsencode 7203 zum 24. September 1919.

Und ein Umbau der Datei wirft, statt eine leere Liste zurückzugeben: Eine
leere Liste wäre von „heute meldet niemand" nicht zu unterscheiden.

### Was Tokio nicht hergibt

Die Uhrzeit. Die Tabelle nennt den Tag und sonst nichts, und es gibt keine
zweite JPX-Datei, die sie hätte.

Die Versuchung, sie zu ergänzen, ist groß: In Tokio meldet fast jedes
Unternehmen nach Handelsschluss um 15:00 Uhr Ortszeit. Das ist eine
Faustregel, keine Angabe. Dieses Projekt schreibt keine Zahl hin, die niemand
gelesen hat – und bei einer Uhrzeit, nach der jemand eine Order legt, am
wenigsten.

### Die Folge im Code: die Herkunft hängt am Termin

`ANGEKUENDIGT_QUELLE` war fest auf den Sammelkalender gestellt, weil
„angekündigt" und „Alpha Vantage" bis dahin dasselbe bedeuteten. Mit Tokio
stünde unter 72 Titeln die falsche Quelle – und wer sie nachschlägt und dort
nichts findet, hält danach zu Recht auch den Termin für erfunden.

Jetzt: `herkunft` an der Vorhersage, `ANGEKUENDIGTE_QUELLEN` als Verzeichnis,
`herkunftVon()` als die eine Stelle, die entscheidet. Fehlt das Feld, ist es
der Sammelkalender – ein Bestand aus einem früheren Lauf muss deswegen nicht
neu geschrieben werden.

Dasselbe bei `quartalsterminLuecke()`: Ein japanischer Titel ohne Termin fehlt
nicht in der Quelle, sondern nur in ihrem Zeitfenster. Der Satz über die
US-Börsenaufsicht wäre auf Toyotas Seite schlicht falsch, und eine falsche
Begründung ist schlechter als gar keine.

### Was der erste Lauf gegen die echte Datei ergeben hat

Grün, 3.209 Zeilen gelesen, **null** Termine beigesteuert. Zwei Befunde
stecken darin, und der zweite ist der wichtigere.

**Der Kopf steht über zwei Zeilen.** Zeile 5 trägt die japanischen
Beschriftungen, Zeile 6 die englischen, darüber Titel und Stand. Der erste
Zerleger nahm eine davon, fand darin `Scheduled Dates` und `コード` – also
Meldetag und Code an den richtigen Stellen – und ließ Firmenname und
Geschäftsjahresende still leer. Ein halber Treffer, der von außen wie ein
ganzer aussieht, weil das, was gefunden wurde, stimmt.

Gelesen wird jetzt der ganze Kopfblock: alle Zeilen vor der ersten Datenzeile,
Spalte für Spalte zusammengefasst. Und die erste Datenzeile findet sich selbst
– sie ist die erste mit einem vierstelligen Börsencode **und** einem Datum.

**Die Datei war leer an Zukunft.** „As of 2026/8/6", letzter Termin darin der 6. August. Die japanische Berichtssaison für das erste Quartal war durch.
Toyota steht mit Code 7203 und dem 4. August darin, Sony mit dem 30. Juli,
Nintendo mit dem 6. August: Der Abgleich Kürzel → Börsencode hat also
funktioniert. Es lag bloß kein Tag mehr vor uns.

### Die Lehre daraus: eine Null ist keine Auskunft

„0 Termine beigesteuert" hat drei Ursachen, und sie verlangen entgegengesetzte
Reaktionen:

1. Die Datei ist unlesbar – Ausfall.
2. Unsere Kürzel passen nicht auf ihre Codes – Fehler im Abgleich.
3. Die Berichtssaison ist durch – Normalzustand, nichts zu tun.

Eine einzelne Null unterscheidet die drei nicht, und daraus wird der stille
Ausfall. Der Lauf zählt deshalb getrennt, wie viele geführte Titel überhaupt in
der Liste stehen und wie viele davon einen kommenden Tag haben, und nennt
Zeitraum und Stand der Datei. **Gewarnt wird nur bei Fall 2.** Eine Warnung,
die dreimal im Jahr wochenlang steht, wird nach der zweiten Woche nicht mehr
gelesen – und dann auch nicht, wenn sie einmal recht hat.

### Und ein Loch, das dabei aufgefallen ist

`quartalsterminLuecke()` gab `null` zurück, sobald ein Titel im Bestand stand –
auch wenn alle seine Termine abgelaufen waren. `getQuartalsterminbefund()` gab
dann ebenfalls `null`, und der Abschnitt auf der Aktienseite verschwand
**ganz**: kein Termin, keine Erklärung.

Der Test dazu hat den Fall beschrieben und ausdrücklich durchgelassen –
„selten und heilt beim nächsten Abruf". Er heilt nicht von selbst, solange das
Unternehmen seinen nächsten Tag nicht angekündigt hat, und für jeden
japanischen Titel ist das zwischen zwei Saisons der Zustand.

Ein Test, der einen Fall benennt und dann durchwinkt, ist die teuerste Sorte:
Er beweist, dass jemand hingesehen hat, und verhindert trotzdem nichts.

### Was offen bleibt

Euronext, LSE, Deutsche Börse, SIX, HKEX, KRX, TWSE, NSE, ASX, TSX, B3. Jede
mit eigenem Format und eigener Sprache. Tokio war der größte Einzelposten und
der einzige mit einer fertigen Tabelle; die übrigen kommen einzeln dran.
