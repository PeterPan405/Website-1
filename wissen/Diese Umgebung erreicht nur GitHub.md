---
titel: Diese Umgebung erreicht nur GitHub
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Diese Umgebung erreicht nur GitHub

`WebFetch` und `curl` scheitern hier an jeder Adresse außerhalb von GitHub und
npm — der Egress-Proxy antwortet mit `CONNECT tunnel failed, response 403`. Das
gilt für **alles**: destatis, Eurostat, Bundesbank, EZB, Yahoo, jedes
Nachrichtenportal, sogar `example.com` und `iminvests.de` selbst.

Das ist eine Regel der Umgebung, kein Fehler. Prüfen lässt sie sich mit
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

## Aber: es gilt nicht für jede Sitzung — erst nachsehen

**Am 5. September 2026 lief eine Sitzung auf dem MacBook des Betreibers, und
die hatte vollen Netzzugang.** In einer Stunde erledigte sie zwei Durchsichten,
die vier Wochen lang als „von hier nicht möglich" notiert waren:

- **Die Steuersätze.** `gesetze-im-internet.de` antwortete auf alle vier
  Adressen mit **200** – dieselben vier, an denen der Läufer am 28. August
  zweimal ins `urlopen error timed out` lief. § 32d EStG, § 4 SolzG, § 20 EStG
  und § 20 InvStG waren in zehn Minuten wörtlich belegt.
- **Die acht ETF-Kostenquoten.** Vier Wochen lang stand die Liste leer, weil
  das Basisinformationsblatt „nicht durchkommt". Zwei Anbieter geben es sehr
  wohl heraus (Vanguard, DWS), und für die übrigen sechs liefern vier bis
  sieben Portale übereinstimmend dieselbe Zahl.

**Die Lehre ist nicht „der Proxy ist weg".** Er ist da, wo er war. Die Lehre
ist, dass die Notiz „aus dieser Umgebung nicht erreichbar" eine Aussage über
**die Umgebung** war und als Aussage über **die Quelle** gelesen wurde. Wer
sie so liest, sucht beim nächsten Mal gar nicht erst — und das kostete hier
vier Wochen an einer Arbeit von einer Stunde.

Deshalb gehört in eine solche Notiz immer beides: **das Datum und der Ort.**
Und vor den Umweg gehört die eine Zeile, die klärt, ob es ihn überhaupt
braucht:

```
curl -sS -o /dev/null -w "%{http_code}\n" --max-time 12 https://example.org/
```

**Was auch mit vollem Zugang nicht geht** – gesetzte Schranken, die nicht
umgangen werden: `ishares.com` und `blackrock.com` antworten mit 403 vor jedem
Inhalt (auch auf die PDFs, und ohne die Anlegertyp-Abfrage, die man dort
vermutet); ebenso `fondsweb.com`, `finanzen.net`, `morningstar.com`. Die
BMF-Seiten stehen hinter einem Bot-Schutz (302 auf `validate.perfdrive.com`).
`boerse-frankfurt.de` leitet auf eine Seite um, die ihre Zahlen per JavaScript
nachlädt – für einen Abruf ohne Browser also leer.

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

## Hat die Ausgabe etwas kaputt gemacht? – die Frage, die der Riegel stellt

Zwischen dem 4. und dem 10. September 2026 stand an drei Morgen keine
Tagesausgabe auf der Website, und damit auch keine Folge. Nachgezählt, woran
es jeweils hing:

    04.09.  ein Test mit festem Stichtag, aus dem Bestand herausgealtert
    05.09.  zwei Prüfungen in derselben Testdatei, die sich widersprachen –
            aufgedeckt vom ersten angekündigten Quartalstermin
    10.09.  die Paketprüfung zählte `&amp;` als vier Zeichen und wies einen
            Teaser von exakt 160 Zeichen mit 164 ab

Drei verschiedene Fehler, jeder in einer Stunde behoben, jeder mit einem
Pull Request und einer Gegenprobe. Und trotzdem derselbe Ausgang, weil alle
drei denselben Riegel trafen: `nachrichten.yml` ließ vor dem Veröffentlichen
die vollständige Prüfkette laufen – `tsc`, `lint`, 126 Testdateien, Bau,
Paketprüfung, Formatierung – und brach beim ersten Rot ab. Die Frage, die der
Riegel stellte, war: **Ist irgendwo etwas rot?**

Das ist die falsche Frage. Zwei der drei Befunde standen schon rot, **bevor**
die Ausgabe geschrieben wurde; sie hätten an jedem beliebigen Tag angeschlagen
und hatten mit den Nachrichten nichts zu tun. Der dritte betraf zwar die neue
Artikelseite – aber auf eine Weise, die kein Besucher je gesehen hätte. Ein
Riegel, der bei jedem Rot im Bestand die Tagesausgabe zurückhält, macht aus
jedem gealterten Test einen Tag ohne Nachrichten. Und gealterte Tests gibt es
in einem Bestand von 126 Dateien mit Stichtagen, Kalendern und Fristen nicht
gelegentlich, sondern regelmäßig.

Der Betreiber hat am 10. September entschieden: _Es darf nicht mehr
vorkommen._

### Die Frage ändern, nicht die Prüfung abschaffen

Der naheliegende Umbau wäre, die Prüfkette vor dem Veröffentlichen zu
streichen oder auf den Bau zu kürzen. Das wäre die Absicherung abgeschafft,
die am 9. August eine Ausgabe mit doppeltem Datum vom Build ferngehalten hat.

Stattdessen stellt der Riegel seit dem 10. September eine andere Frage:
**Hat die Ausgabe etwas kaputt gemacht?** Dafür läuft dieselbe Kette zweimal –
einmal auf dem unberührten Stand von `main`, einmal nach dem Schreiben – und
`lib/pruefvergleich.ts` vergleicht Befund für Befund:

- Ein Befund, der erst mit der Ausgabe rot geworden ist, hält sie auf.
  Nichts wird gepusht, der Lauf ist rot.
- Ein Befund, der wortgleich schon vorher da war, hält sie **nicht** auf. Sie
  wird veröffentlicht, Paketbau und Folge werden angestoßen – und der Lauf
  endet **trotzdem rot**, als letzter Schritt. Ein grüner Lauf mit einer
  Warnung darin wäre der stille Fehler; ein roter Lauf ohne Ausgabe der teure.
  Ein roter Lauf **mit** Ausgabe ist beides nicht.
- Der Bau blockiert immer, gleich seit wann er rot ist. Ein Stand, der nicht
  baut, kann nicht ausgeliefert werden – ihn nach `main` zu schieben nützte
  nichts und schadete dem nächsten, der bauen will.
- Fehlt der Vorbefund, gilt alles als neu. Im Zweifel streng.

Verglichen wird am Wortlaut: bei `npm test` die gescheiterten Dateien, bei
`npm run pruefen` die einzelnen Beanstandungen. `tsc`, `lint` und die
Formatierung nennen nichts Vergleichbares – dort entscheidet allein, ob sie
schon vorher rot waren.

### Was ein Besucher sieht, und was nicht

Der Fall vom 10. September hätte auch mit dem Vergleich blockiert: Die neue
Artikelseite gab es im Vorbefund nicht, ihr Befund war zwangsläufig neu. Die
zweite Änderung gilt deshalb der Paketprüfung selbst, und sie folgt der
Trennlinie aus dem Abschnitt darüber – _sieht ein Besucher deshalb etwas
anderes?_

Eine Meta-Description von 164 Zeichen kürzt die Suchmaschine um vier Zeichen.
Ein Titel von 70 Zeichen bekommt drei Punkte. Zwei Seiten mit demselben Titel
sind für die Suchmaschine unschön. Nichts davon sieht ein Besucher, nichts
davon rechtfertigt einen Tag ohne Nachrichten. Diese vier Befunde sind seither
**Warnungen**: `npm run pruefen` schreibt sie als `::warning::`-Zeilen und
bleibt grün. Eine **fehlende** Angabe bleibt ein Fehler – ohne `<title>` steht
im Reiter die Adresse, das sieht jeder.

Der Nutzen des Vergleichs ist damit nicht abgeschafft. Er war es, der die
Fälle vom 4. und 5. September getragen hätte; die Warnung trägt den vom 10.

### Was das kostet und was es nicht löst

Ein zweiter Bau, rund vier Minuten je Lauf. Der Regelweg – Anstoß durch den
Agenten gegen 00:35 UTC – hat drei Stunden Luft bis zur Zusage. Der letzte
Rückfalltermin um 02:47 UTC wird knapp; das war er vorher auch.

Nicht gelöst ist, dass die gealterten Tests weiter altern. Der Vergleich sorgt
dafür, dass sie die Ausgabe nicht mehr kosten – nicht dafür, dass sie behoben
werden. Dafür ist der rote Schritt am Ende da: Er schickt die Mail, die vorher
auch kam, nur steht jetzt eine Ausgabe auf der Website, während sie gelesen
wird.

**Die Gegenprobe:** `tests/pruefvergleich.test.ts` legt dem Vergleich die drei
Morgen vor, jeden so, wie er war, und zu jedem den Zwilling, bei dem der
Befund erst mit der Ausgabe entstanden ist. Ließe er beide durch, wäre der
Riegel nicht verbessert, sondern weg. `tests/paket-pruefen-meta.test.ts`
prüft die Grenze zwischen Fehler und Warnung von beiden Seiten.
