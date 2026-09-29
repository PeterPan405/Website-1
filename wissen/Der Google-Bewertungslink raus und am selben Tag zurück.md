---
titel: "Der Google-Bewertungslink: raus und am selben Tag zurück"
datum: 2026-08-29
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Google-Bewertungslink: raus und am selben Tag zurück – 29. August 2026

**Ergebnis vorweg: Der Link steht wieder da, wie zuvor.** Entfernt in #329,
zurückgeholt in derselben Sitzung. Was dazwischen lag, ist der Grund, warum
dieser Abschnitt trotzdem stehen bleibt – die Recherche darin ist die Arbeit,
nicht der Umbau.

Der Betreiber hatte entschieden, das Google-Unternehmensprofil aufzugeben, und
damit war der Textlink „IM Invests bei Google bewerten" hinfällig. Beim
Löschen des Profils stellte sich heraus: **Es geht nicht.** Google entfernt
das Profil eines existierenden, bestätigten Unternehmens nicht.

- „Actions → Remove" nimmt es nur aus dem Konto. Der Dialog sagt es selbst:
  „Some business information (name, address, etc.) will still appear on Google
  Maps, Search, and elsewhere on Google." Die eigenen Inhalte wären gelöscht,
  das Profil sichtbar geblieben, niemand hätte es mehr verwaltet.
- „Als dauerhaft geschlossen markieren" lässt es ebenfalls stehen, nur mit
  einem Vermerk, der falsch wäre, solange die Website arbeitet.
- Das Profil hat gar keine Adresse (`No location; deliveries and home services
only`), ist also ein reines Servicegebiet-Profil ohne Kartenpin. Google
  lässt dort nicht einmal das Servicegebiet leeren: „Service area can't be
  removed if the listing doesn't have an address."

Damit war der Grund für die Entfernung weg: Ein Link auf ein Profil, das
ohnehin bestehen bleibt, zeigt nicht ins Leere. Also zurück in den Zustand
davor.

## Der Anlass stimmte nicht, die Entscheidung steht trotzdem

Auslöser war die Beobachtung, HKCM habe keinen Maps-Eintrag. Das war ein
Lesefehler: Die Suche nach „HKCM" liefert drei Treffer, und der dritte ist
„HKCM Engineering Inh. Möller Helmut", Ottestraße 20, 5,0 Sterne aus einer
Rezension – von Google in die Kategorie **Engineer** einsortiert, was die
Verwechslung erklärt. Die ersten beiden Treffer sind Namensvettern.

**Nachgesehen wurde dann bei sechs Häusern, und alle sechs hatten einen
Eintrag:**

| Haus                      | Eintrag                        |
| ------------------------- | ------------------------------ |
| HKCM Engineering          | 5,0 (1), Kategorie „Engineer"  |
| Montega AG                | gepflegt, Fotos, 0 Rezensionen |
| First Berlin              | 5,0 (1), **nicht beansprucht** |
| GBC AG                    | 4,8 (**17**)                   |
| SMC Research (sc-consult) | vorhanden, 0 Rezensionen       |
| Warburg Research          | **1,0 (1)**                    |
| BörseGo AG                | 3,4 (10), Inhaberfotos         |

Die Zahlen wurden dem Betreiber vorgelegt; er blieb zunächst bei seiner
Entscheidung. Sie stehen hier, damit niemand die Frage ein zweites Mal am
ersten Suchtreffer entscheidet.

## Was daran bemerkenswert ist

**Warburg Research steht bei 1,0 aus einer einzigen Rezension.** Ein Profil,
um das sich niemand kümmert, verschwindet nicht – es sammelt weiter. Genau das
wäre der Ausgang gewesen: Die Rezensionen hängen am Eintrag, nicht am Konto,
und wären mit ihm stehen geblieben. Verloren gegangen wäre nur die
Möglichkeit, etwas dazu zu sagen.

## Die Lehre

**Ein Vergleich mit dem Wettbewerb ist erst eine Grundlage, wenn er über den
ersten Treffer hinausgeht.** Drei Ergebnisse standen auf dem Schirm; gelesen
wurde eines. Wer aus „ich sehe nichts" auf „es gibt nichts" schließt, hat
nicht die Konkurrenz gemessen, sondern die eigene Suchanfrage.

Und: **Wer etwas entfernt, weil etwas anderes verschwinden soll, sollte zuerst
prüfen, ob das andere überhaupt verschwinden kann.** Der Link war in zwei
Minuten draußen. Die Frage, ob das Profil dahinter löschbar ist, wurde erst
danach gestellt – die Antwort war nein, und damit war der ganze Umbau
hinfällig. Die Reihenfolge war falsch, nicht die Absicht.

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

Jetzt: `herkunft` an der Vorhersage, `TERMINQUELLEN` als Verzeichnis,
`herkunftVon()` als die eine Stelle, die entscheidet. Fehlt das Feld, ist es
der Sammelkalender – ein Bestand aus einem früheren Lauf muss deswegen nicht
neu geschrieben werden.

### Und genau dort ist es dann doch schiefgegangen – 25. August 2026

Die Tabelle hieß `ANGEKUENDIGTE_QUELLEN`, und der Name war der Fehler.

`herkunftVon()` fragte in dieser Reihenfolge:

    if (!vorhersage.angekuendigt) return daten.quelle   // SEC
    return ANGEKUENDIGTE_QUELLEN[vorhersage.herkunft ?? 'kalender']

Solange alle fremden Quellen **angekündigte** Termine lieferten, stimmte das.
Am 25. August hat der nächtliche Lauf zum ersten Mal die abgeleiteten Tokioter
Termine eingespielt: 268 Stück, `angekuendigt` nicht gesetzt, weil sie
geschätzt sind – und damit fiel jeder einzelne in den ersten Zweig.

Unter Toyota, Sony und Hitachi stand danach „US-Börsenaufsicht SEC – Formular
8-K". Keines dieser Unternehmen reicht ein 8-K ein. Genau der Fall, vor dem
der Kommentar über der Tabelle warnt, drei Absätze weiter oben – eingetreten,
weil eine **neue Art von Termin durch eine alte Fallunterscheidung lief**.

Die Herkunft wird jetzt zuerst gefragt, und die Tabelle heißt nach dem, was
sie enthält: Quellen von Terminen, nicht Quellen von Ankündigungen. Ein Name,
der eine Teilmenge behauptet, lädt dazu ein, genau diese Teilmenge abzufragen.

## Ein Mittelwert kann nichts finden, was er verdünnt – der Fall dazu

**25. August 2026.** Derselbe Lauf hat noch einen Wächter zum Anschlagen
gebracht, und dieser hatte recht.

`tests/quartalstermine.test.ts` verlangt, dass mindestens 80 Prozent der
Termine eine Uhrzeit tragen. Der Zweck steht daneben: Fällt das Feld in der
Quelle aus, stürzt der Anteil auf null, und das wäre der stille Datenausfall,
den sonst niemand bemerkt.

Mit den 268 Tokioter Terminen fiel der Anteil von 92 auf 75 Prozent. **Kein
Ausfall** – die JPX-Liste hat schlicht keine Spalte für die Uhrzeit, und
AGENTS.md verbietet ausdrücklich, eine zu ergänzen.

Die Grenze zu senken wäre der bequeme Weg gewesen und der falsche. Bei 75
Prozent hätte ein echter Ausfall in New York erst auffallen müssen, nachdem er
die Hälfte der amerikanischen Termine erwischt hat: Zwei Bestände mit
verschiedenen Eigenschaften in einem Mittelwert, und der eine verdünnt den
anderen so weit, dass der Wächter stumpf wird.

Gezählt wird deshalb dort, wo eine Uhrzeit überhaupt möglich ist – außerhalb
Tokios; dort steht der Anteil wieder bei 92 Prozent. Für Tokio gilt die
umgekehrte Prüfung: Dort darf **keine** Uhrzeit stehen, denn eine dort wäre
erfunden. Und weil eine Trennung selbst zur stillen Absicherung werden kann,
prüft eine dritte Zeile, dass beide Töpfe überhaupt besetzt sind.

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

## Ein Störgeräusch ist häufiger ein Ton als ein Rauschen

Am 20. August 2026 meldete der Betreiber, es gebe im Podcast **immer noch**
Störgeräusche. Das war die dritte Meldung dieser Art, und zweimal davor hatte
die Prüfung danach gegriffen. Also nachgerechnet, statt weiterzuschrauben.

`auffaellige_stellen()` suchte bis dahin nach **rauen** Stellen: viele
Nulldurchgänge oder viele Werte am Anschlag. Die Nulldurchgangsrate eines
reinen Tons ist zweimal seine Frequenz geteilt durch die Abtastrate. Bei
24 kHz heißt das:

     200 Hz  → 0,017     1.000 Hz → 0,083     2.000 Hz → 0,167

Die Grenze stand bei 0,22. **Jeder gehaltene Ton unter rund 2.600 Hz war
unsichtbar.** Gefunden wurde nur, was zusätzlich rauschte – wie der Pfeifton
vom 10. August, dem ein Rauschen aufgesetzt war.

Das ist kein Grenzfall. Ein erzeugtes Geräusch ist häufiger ein Ton als ein
Rauschen; die Prüfung deckte die seltenere Hälfte ab und sah dabei aus wie
eine ganze.

### Der erste Anlauf war falsch, und warum das lehrreich ist

Der naheliegende Gedanke: Sprache moduliert, ein Ton steht still. Also die
Schwankung der Lautstärke über eine halbe Sekunde messen.

Beim ersten Durchlauf schlug die Prüfung **achtzehnmal am sauberen
Probesignal** an. Der Grund steht in der Prüfung selbst: Der Effektivwert wird
über ein Viertel einer Sekunde gemittelt, und Silben dauern ungefähr so lang.
Die Mittelung bügelt genau die Schwankung weg, die gemessen werden sollte.

**Eine Fallunterscheidung über ein Merkmal, das der Stoff nicht hergibt, ist
keine** – dieselbe Lehre wie bei den handelsfreien Tagen, nur andersherum:
Dort fehlte dem Material das Merkmal, hier zerstört die Vorverarbeitung es.

### Was stattdessen gemessen wird

Nicht, ob der Ton steht, sondern **wie schmal er ist**. Ein Sinus legt seine
ganze Energie in eine Frequenz; ein gesprochener Laut verteilt sie über eine
Obertonreihe und ein Formantgebirge, ein Zischlaut über das halbe Band.

Gemessen wird der Anteil der Energie in der stärksten Frequenz samt zwei
Nachbarplätzen zu jeder Seite. Die Nachbarn sind nicht Großzügigkeit: Das
Ausschneiden eines Fensters verschmiert jede Frequenz, und ohne sie käme ein
reiner Sinus je nach Zufall auf 0,6 statt auf 0,99.

Nachgemessen, nicht geschätzt:

     reiner Ton bei 900 Hz   1,00
     sprachähnliches Signal  0,75
     Rauschen                0,017

Die Grenze liegt bei 0,90, dazwischen. Echte Sprache liegt eher noch unter
0,75, weil sie neben der Obertonreihe auch Reibegeräusche trägt.

### Zwei Fälle im Selbsttest, die vorher durchgelaufen wären

Ein gehaltener Ton bei 900 Hz und ein Brummen bei 180 Hz, beide weit unter dem
Anschlag und weit unter der Zischgrenze. Beide werden jetzt gefunden und
gedämpft, und beide standen vorher als „nichts zu beanstanden" da.

### Und manchmal ist es keins von beidem – der 19. September 2026

Der Betreiber meldete in der Folge vom 19. September bei 2:56 ein Geräusch
„zwischen Stuhl verschieben und flatulieren". Gemessen sah es so aus:

    Sekunde  Effektiv  Nulldurchg.  Anschlag  Tonanteil  Tiefenanteil
     175.50    0.1667        0.067     0.000      0.529         0.943
     175.62    0.3390        0.020     0.000      0.400         0.019
     175.75    0.3499        0.006     0.000      0.715         0.963
     175.88    0.1887        0.006     0.000      0.657         0.998

Alle drei Merkmale sahen daran vorbei, und nicht knapp: 0,006 gegen eine
Zischgrenze von 0,22, nichts am Anschlag, 0,72 gegen einen Tonanteil von 0,90.
Dabei sind das die **lautesten** Fenster ihrer Umgebung.

Der Grund ist eine Lücke in der Form der Prüfung, nicht in einer Zahl:
`ZISCHGRENZE` fragt nach **zu vielen** Nulldurchgängen. Nach unten stand
keine Grenze. Ein Poltern ist aber genau das – tiefe Energie ohne Formanten.

#### Der Tiefenanteil allein trennt nichts

Der erste Versuch maß den Anteil der Energie unter 200 Hz und ging davon aus,
dass dort bei Sprache „nur ein Teil, nie der größte" sitzt. Über die 1238
lauten Fenster derselben Folge nachgemessen:

    Perzentil        10      25      50      75      90      95      99
    Tiefenanteil  0.099   0.288   0.524   0.736   0.860   0.922   0.993

Der Median liegt bei 0,52. Die Grundfrequenz dieser Stimme liegt unter 200 Hz
und trägt mehr Energie als alle Formanten zusammen. Eine Grenze auf den
Tiefenanteil allein wäre bei 0,90 wirkungslos gewesen (null Funde, auch der
gemeldete nicht) und bei 0,70 verheerend (vierzehn Stellen, allesamt Sprache).

#### Zwei falsche Formen, bevor die richtige stand

**Und je Fenster.** Beide Merkmale für jedes Viertelsekundenfenster zu
verlangen, fand die Stelle in _keiner_ Kombination von Grenzen. Jedes der
vier Fenster verfehlt mindestens eine Bedingung; übrig blieben zwei, 0,375 s,
und damit scheiterte es um 25 Millisekunden an `STOERUNG_MINDESTENS_S`. Ein
Poltern ist kein gleichförmiger Ton – es schlägt an, rollt aus und schwankt
dabei. Wieder eine Fallunterscheidung über ein Merkmal, das der Stoff nicht
hergibt.

**Lauf, dann Median.** Also erst einen Lauf aus allen stillen Fenstern bilden
und ihn als Ganzes beurteilen. Das fand die echte Stelle – und fiel im
Selbsttest durch, bevor es in einen Lauf kam: `_probeton` liegt durchgehend
bei 0,009 Nulldurchgängen, der Lauf wuchs über das eingebaute Poltern hinaus
auf Sekunden an, und sein Median sank auf den Wert des Probetons. **Ein
Mittelwert kann nichts finden, was er verdünnt** – derselbe Fehler wie beim
Prüfen ganzer Stücke, nur eine Ebene tiefer.

Was steht, ist ein **fester Abschnitt**: drei Fenster am Stück, das kleinste,
das 0,4 s erreicht. Er kann nicht wachsen und deshalb nichts verdünnen, und
sein Median überhört genau einen Ausreißer – einer ist da, bei 175,62.

#### Wie die Grenze gewählt wurde

An der Aufnahme, mit der gemeldeten Stelle als Prüfstein, gerechnet mit
derselben Funktion, die später urteilt:

    Nulldurchg. bis   Tiefe ab   Stellen   die gemeldete dabei
              0,015       0,80         2   ja
              0,015       0,90         2   ja
              0,020       0,80         7   ja
              0,020       0,90         3   ja
              0,030       0,90         4   ja

Bei 0,015/0,90 bleiben in 232 Sekunden genau zwei Stellen, und beide tragen
dieselbe Handschrift:

    2:09  0,50 s  Tiefe 0,998  Nulldurchg. 0,006
    2:55  0,50 s  Tiefe 0,963  Nulldurchg. 0,006   ← die gemeldete

Dass 2:09 mitkommt, ohne gemeldet worden zu sein, ist kein Fehlalarm: 99,8
Prozent der Energie unter 200 Hz über eine halbe Sekunde kann keine Sprache
sein – dann bliebe nichts, woran ein Laut zu erkennen wäre.

Die fünf, die bei 0,020/0,80 dazukommen, liegen bei einer Tiefe von 0,81 bis
0,86 und 0,016 bis 0,023 Nulldurchgängen: eine andere Sorte, und zwar
gesprochene. Das ist kein Feilschen um Kommastellen. `nachbessern()` meldet
nicht nur, es **dämpft** – fünf Fehlalarme je Folge wären fünf gedämpfte
Stellen gesprochener Sprache.

#### Die Gegenprobe an den anderen Folgen

Eine Grenze, die an einer einzigen Aufnahme gewählt wurde, ist an einem
Einzelfall gewählt. Gegen sechs weitere Folgen laufen gelassen: kein einziger
Fund am 20. und am 18. September, einer am 16. September (2:35, Tiefe 0,90,
Nulldurchgänge 0,012) – in der Folge, über die der Betreiber vier Tage zuvor
geklagt hatte. Die übrigen Funde dort sind „rau" und damit älter als diese
Änderung.

#### Was im Selbsttest dazukam

Ein nachgestelltes Poltern aus drei tiefen Teiltönen mit Anschlag und
Ausrollen – ein einzelner Sinus wäre der falsche Prüfstein, den fände schon
der Tonanteil. Geprüft wird zusätzlich, dass es als **Rumpeln** gefunden wird
und nicht als Ton oder Rauschen: Fände es ein altes Merkmal mit, wäre die neue
Grenze eine Doppelung, die beim nächsten Umbau niemand vermisst, und der
gemeldete Fall bliebe trotzdem offen. Dazu sieben saubere Probetöne, die
unbeanstandet bleiben müssen, und die Nachbesserung, die das Poltern danach
nicht mehr finden darf.

## Eine Regel im Kommentar ist keine Regel

Am selben Tag beanstandete der Betreiber die Aussprache englischer Wörter.
Über der Umschrifttabelle in `lib/sprechfassung.ts` stand seit dem 11. August
ein Kommentar mit den Fallen der deutschen Rechtschreibung – darunter
ausdrücklich: „Für den englischen /w/-Laut steht ‚U'."

Nachgezählt: **Neun Einträge derselben Tabelle verletzten diesen Kommentar.**
„Häthaweh", „Schwobb", „Bittweiß", „Ohwerwejt", „Anderwejt", „Softwer",
„Hardwer" – überall stand „w" für einen englischen /w/-Laut, und deutsches
„w" ist /v/. Gesprochen wurde daraus „Häthaveh", „Softver", „Bittveiß". Dazu
„Riserv" für „Reserve": Ein „v" am Wortende ist im Deutschen /f/, wie in
„aktiv".

Der Kommentar war richtig, ausführlich und begründet – und wirkungslos, weil
niemand die Tabelle danach durchgesehen hat.

**Was sich mechanisch entscheiden lässt, gehört in einen Test.** Ob ein
englisches Wort an einer Stelle /v/ oder /w/ hat, ist keine Geschmacksfrage:
Es steht in der Schreibweise des englischen Wortes. Ein „w" vor einem Vokal
ist /w/ und braucht in der Umschrift ein „u"; ein „v" ist /v/ und braucht ein
„w". `tests/sprechfassung-aussprache.test.ts` prüft beides, samt Gegenprobe
gegen die alten Fassungen.

Nicht geprüft wird die dritte Falle, das „st" am Wortanfang. Sie lässt sich
nicht überall umgehen – „Stoxx Europe" bleibt „Schtocks", und die deutsche
Rechtschreibung hat kein Zeichen für ein hartes /st/ an dieser Stelle. Ein
Test, der eine unvermeidbare Stelle beanstandet, wird abgeschaltet statt
befolgt; deshalb steht sie als offener Punkt im Kommentar und nicht als
Prüfung.

## Der KI-Hinweis: nicht das Erste, aber vor der ersten Meldung

Am 17. August kam der gesprochene KI-Hinweis in die Folge, und zwar ganz nach
vorn – mit der Begründung, er sei „die Bedingung, unter der alles Folgende zu
hören ist".

Am 20. August hat der Betreiber widersprochen: „Dann schreckt das nicht ganz
so ab." Er meint die Stelle, nicht den Hinweis.

Er hat recht, und die Begründung ist keine kosmetische. Ein Podcast hat drei
Sekunden, um jemanden zu halten. Wer in diesen drei Sekunden „automatisiert
mit KI-Werkzeugen" hört, bevor er weiß, worum es überhaupt geht, hört auf –
und dann erreicht der Hinweis niemanden, weil niemand mehr da ist. Ein
Hinweis, der seine Hörer vertreibt, erfüllt seinen Zweck nicht besser als
keiner.

Ans Ende gehört er trotzdem nicht: Nach fünf Minuten hat sich jeder längst
eine Meinung gebildet. Die Stelle dazwischen ist die richtige – nach Gruß,
Datum und dem Satz über den Tag, noch vor der ersten Meldung. Da weiß der
Hörer, was ihn erwartet, und hat noch nichts geglaubt, was nicht stimmt.

Der Test prüft weiterhin die **Reihenfolge** und nicht bloß, dass beides
vorkommt. Die alte Grenze „in den ersten 200 Zeichen" ist entfallen: Sie
zählte, solange der Hinweis das Erste war, und wäre danach eine Zahl ohne
Bedeutung gewesen – die Begrüßung ist je nach Tagesausgabe verschieden lang.

### Und dahinter der Rechtshinweis – 25. August 2026

Der Betreiber hat verlangt, hinter dem KI-Hinweis auch zu sagen, dass es keine
Anlageberatung ist und dass nicht gehaftet wird.

Das ist dieselbe Lücke, die der KI-Hinweis am 17. August hatte, und aus
demselben Grund gefährlicher, als sie aussieht. Der ausführliche Satz stand
längst unter jeder Folge, und `RECHTSHINWEIS_KERN` steht auf jeder Seite der
Website. Wer die Folge in einer Podcast-App hört, im Auto oder beim Laufen,
sieht beides nie – und hört fünf Minuten lang Kurse, Zahlen und Einordnungen.
Genau dort entsteht der Eindruck, hier spreche jemand darüber, was zu tun ist.

**Drei Punkte, nicht einer.** „Keine Anlageberatung" allein lässt weg, wonach
ausdrücklich gefragt wurde. Gesprochen wird deshalb: keine Beratung, keine
Empfehlung zu kaufen oder zu verkaufen, keine Haftung. Der Test prüft alle drei
einzeln – wer den Satz später kürzt, stößt dort an und nicht erst bei jemandem,
der sich darauf verlassen hat.

**Im selben Absatz wie der KI-Hinweis, nicht in einem eigenen.**
Kleingedrucktes gehört an eine Stelle. Zwei getrennte Absätze wären zwei
Unterbrechungen statt einer, und die zweite trifft einen Hörer, der die erste
schon überstanden hat. Zusammen sind es vier Sätze in rund zwanzig Sekunden;
danach fängt die Folge an und wird nicht wieder angehalten.

Das ist auch technisch nicht gleichgültig: Ein Absatzumbruch ist im fertigen
Ton eine Pause von 0,95 s, und die Pausen tragen die Kapitelmarken. Auf die
Marken wirkt sich der längere Einstieg trotzdem nicht aus – der Läufer nimmt
eine Pause erst dann als Kapitelanfang, wenn sie mindestens dreißig Sekunden
nach der vorigen liegt, und die Pausen der Begrüßung liegen sämtlich davor.
Der Test hält den fehlenden Umbruch fest, damit niemand ihn versehentlich
einzieht.

### Zwei Punkte, nicht drei – 27. August 2026

Am Tag darauf hat der Betreiber den mittleren gestrichen:

> „keine Empfehlung zum Kauf oder Verkauf einer Aktie" lässt Lücken und klingt
> kindisch – sag es wie andere Podcasts: keine Anlageberatung, und wir haften
> nicht.

Beides trifft zu, und der erste Einwand ist der schwerere.

**Die Lücke.** Wer „Aktie" aufzählt, hat Anleihen, Fonds, ETFs und
Zertifikate nicht genannt. Eine Aufzählung schließt aus, was in ihr fehlt –
und ein Hinweis, der weniger abdeckt, als er soll, ist schlechter als der
Oberbegriff. „Keine Anlageberatung" deckt die Empfehlung bereits ab: Eine
Empfehlung ist der Kern dessen, was eine Beratung ausmacht. Der dritte Satz
machte die Aussage länger und enger zugleich.

**Der Ton.** Ein Hinweis, der eine Selbstverständlichkeit umständlich
ausbuchstabiert, klingt nach Absicherung statt nach Redaktion. Die
gebräuchliche Formulierung tut es in einem Satz und wird verstanden.

Gesprochen wird jetzt:

> Und noch eins: Das ist keine Anlageberatung, und für Anlageentscheidungen
> übernehmen wir keine Haftung.

Der Vorspann schrumpft damit von rund zwanzig auf **rund fünfzehn Sekunden**,
und der Wortbedarf von dreißig auf vierzehn Wörter der 740 – ein knapper
halber Themenabsatz zurück im Tag.

Der Test prüft weiterhin beide verbliebenen Punkte **einzeln** und zusätzlich,
dass die gestrichene Aufzählung nicht zurückkommt. Ohne diese Gegenprobe wäre
das Streichen eine Absicht ohne Halt: Die nächste Erweiterung schriebe sie
wieder hinein, und niemand merkte es.

Unter der Folge, im Impressum und in der Fußzeile steht der vollständige Satz
unverändert weiter – dort ist Platz dafür.

**Was es kostet:** rund dreißig Wörter der 740, also etwa ein halber
Themenabsatz an einem reichen Tag. Die Kürzungsschleife nimmt sie von hinten,
die Rangfolge der Ausgabe bleibt gewahrt. Der Einstieg ist damit von acht auf
rund zwanzig Sekunden gewachsen – die Grenze dessen, was vor der ersten Meldung
vertretbar ist. Wer hier noch etwas hinzufügen will, streicht zuerst etwas
anderes.

## Eine Doppelung mit guter Begründung altert trotzdem

**23. August 2026.** Die Zuordnung „Sitzland → warum fehlen die
Unternehmenszahlen“ stand zweimal im Projekt: in `lib/abdeckung.ts` für die
Seite `/quellen`, und in `scripts/abdeckung.ts` für `npm run abdeckung`.

Die Doppelung war begründet, und die Begründung stand als Kommentar daneben:
Das Skript laufe ohne Next.js und dürfe den Alias `@/` nicht benutzen, die
Bibliothek müsse ihn benutzen. Was beide teilten, seien nur die Sätze – „und
die ändern sich nur, wenn sich die Quellenlage ändert“.

Genau das geschah dann.

Am **31. Juli 2026** klärte `scripts/quellen-probe-esef-de.ts` eine lange offene
Frage: Im offenen ESEF-Verzeichnis auf `filings.xbrl.org` trägt **kein
einziger** Abschluss das Land `DE`. Deutsche Emittenten reichen beim
Unternehmensregister ein, dessen Bestand dort nicht einfließt. Die 86 fehlenden
deutschen Titel liegen also an der Quelle und nicht an einer fehlenden
Zuordnung – ein Unterschied, der über Tage Arbeit entscheidet.

`lib/abdeckung.ts` wurde berichtigt. Das Skript nicht.

Drei Wochen lang gab dieselbe Website zwei Auskünfte über dieselbe Sache:

| Wo                  | Was dort stand                                            |
| ------------------- | --------------------------------------------------------- |
| `/quellen`          | „das offene Verzeichnis führt keine deutschen Abschlüsse“ |
| `npm run abdeckung` | „ESEF – Zuordnung fehlt noch“                             |

Das Skript schrieb darunter noch einen ganzen Absatz aus: Deutschland sei „der
ärgerlichste“ Block, die Quelle sei da, es fehle nur „die geprüfte Zeile je
Unternehmen“. Also eine Arbeitsanweisung für Arbeit, die nichts gebracht hätte.
Wer sie befolgt hätte, hätte 86 Namen gegen ein Verzeichnis abgeglichen, das
keinen davon führt – und wäre nach einem halben Tag bei der Frage angekommen,
die die Sonde drei Wochen vorher schon beantwortet hatte.

### Warum es niemandem auffiel

Weil beide Fassungen gepflegt aussahen. Kein Test verglich sie, keine Prüfung
konnte es: Sie standen in verschiedenen Modulen, in verschiedenen Formaten
(die eine nach Ländernummer, die andere nach Ländername) und wurden von
verschiedenen Zielgruppen gelesen. Der Betreiber liest `/quellen`, ein Agent
liest das Skript. Beide sahen nur ihre Hälfte.

Und die Begründung im Kommentar stimmte zum Zeitpunkt des Schreibens sogar.
Sie hörte nur irgendwann auf zu stimmen: Seit `scripts/alias-hook.mjs` gibt es
den Alias `@/` auch außerhalb des Bündlers – dieselbe Datei, die AGENTS.md seit
Monaten unter „Der Alias `@/` gilt auch außerhalb des Bündlers“ erklärt.

### Was jetzt gilt

`quellenlage` steht einmal, in `lib/abdeckung.ts`. Das Skript importiert sie
über den Alias-Hook. Der Absatz „Woran es liegt“ wird nicht mehr getippt,
sondern aus derselben Tabelle gruppiert – wer eine Quellenlage berichtigt,
ändert damit auch, was im Terminal steht.

Nebenbei ergibt die Gruppierung eine bessere Arbeitsliste als der alte Absatz.
Der größte Block, an dem sich etwas ändern lässt, ist nicht Deutschland:

    97  ESEF – teilweise zugeordnet
        Vereinigtes Königreich 36, Frankreich 25, Niederlande 14,
        Schweden 10, Spanien 7, Italien 5

Das sind die Titel, bei denen die Quelle nachweislich liefert und nur die
geprüfte Zeile fehlt. Deutschland mit 86 steht daneben – gleich groß, aber
nicht dieselbe Aufgabe.

`tests/abdeckung.test.ts` sichert den zweiten stillen Fehler ab, den dieselbe
Tabelle erlaubt: Ihr Schlüssel ist der deutsche Ländername. Ein Schlüssel, den
`data/laender/namen.ts` nicht kennt – „Grossbritannien“ statt „Vereinigtes
Königreich“ –, führt auf `/quellen` still zum Rückfall „nicht untersucht“.
Nichts bricht, nichts warnt, die Auskunft ist weg. Der Test prüft jeden
Schlüssel gegen die Länderliste, hält einen erfundenen Schlüssel dagegen, und
verlangt für jedes „teilweise zugeordnet“, dass wenigstens ein Titel dieses
Landes tatsächlich Zahlen hat. Deutschland bekommt eine eigene Zeile: Die alte
Behauptung klingt zu richtig, um nicht zurückzukommen.

### Die Lehre

Eine Doppelung mit guter Begründung ist immer noch eine Doppelung. Die
Begründung schützt sie beim Anlegen, nicht danach – und sie kann selbst
veralten, ohne dass jemand den Kommentar noch einmal liest.

Wer eine zweite Stelle stehen lässt, schuldet ihr eine Prüfung, die beide
vergleicht. Gibt es die nicht, gibt es die zweite Stelle nicht: Dann wird
zusammengeführt.

## Eine Grafik hat zwei Leser, und sie bekamen Verschiedenes

**23. August 2026.** Jede Lerngrafik trägt eine Beschreibung für alle, die sie
nicht sehen können. Gelesen wird sie auf zwei Wegen, die nie zusammenkamen:

| Wer liest                  | Woher                                   |
| -------------------------- | --------------------------------------- |
| Screenreader               | `<desc>` im gezeichneten SVG            |
| Vorleseleiste und Aufnahme | `vorleseAbschnitte()` über `figureMeta` |

Von 135 Grafiken hatten **70** ihre Beschreibung nicht in `data/figures.ts`,
sondern in der Zeichnung. Das war kein Versehen, sondern eine bewusste
Entscheidung, und sie steht auch so dokumentiert: Ihre Zahlen kommen aus einem
Datensatz, und eine festgeschriebene Beschreibung wäre nach der ersten
Aktualisierung falsch – „und zwar unbemerkt, weil sie niemand sieht, der die
Grafik sehen kann“.

Der Satz war richtig. Er beschrieb nur die falsche Gefahr.

### Was tatsächlich passierte

`vorleseAbschnitte(bloecke, figureMeta)` sah diese Sätze nie. Der Rückfall in
der Funktion lautet `description ?? caption`, also sprach die Aufnahme bei 47
Grafiken die **Bildunterschrift** statt der Beschreibung.

Bei weiteren 23 war es schlimmer. Dort stand in `data/figures.ts` zusätzlich
eine **Formbeschreibung**, und die wurde gesprochen:

> Waagerechte Balken, oben der kleinste Verlust, unten der größte. Jeder Balken
> zeigt, wie viel Gewinn nötig ist, um genau diesen Verlust auszugleichen.

Der Screenreader bekam bei derselben Grafik:

> 10 % Verlust brauchen 11 % Gewinn, 20 % Verlust brauchen 25 % Gewinn,
> 30 % Verlust brauchen 43 % Gewinn, 50 % Verlust brauchen 100 % Gewinn …

Wer die Grafik nicht sehen kann, erfuhr also, wie sie **aussieht**, statt was
in ihr steht. Und `data/figures.ts` verlangt in seinem eigenen Kopf das
Gegenteil: „inhaltlich, nicht formal: ‚Die Kurve verdreifacht sich in vierzig
Jahren‘ hilft, ‚Ein Liniendiagramm mit zwei Kurven‘ nicht.“

### Warum es niemandem auffiel

`FigureSvg` wirft, wenn **beides** fehlt. Es kann nicht werfen, wenn beides da
ist und Verschiedenes sagt. Jede der beiden Beschreibungen war für sich
richtig, gepflegt und plausibel. Der Fehler lag nicht in einer Zeile, sondern
zwischen zwei Dateien – und dort schaut kein Compiler hin.

Aufgefallen ist es erst, als jemand für einen ganz anderen Zweck – die Frage,
ob die Vertonung wieder scharf gestellt werden kann – nachzählte, wie viele
Grafiken keine `description` in `figureMeta` haben.

### Warum der naheliegende Weg nicht ging

Die Beschreibung beim Bauen aus der gezeichneten Grafik zu lesen, wäre die
sauberste Ableitung. Sie scheitert an einer Kleinigkeit:
`scripts/lese-texte-schreiben.ts` läuft unter `node --experimental-strip-types`
und kann keine `.tsx` laden – `ERR_UNKNOWN_FILE_EXTENSION`. Alles, was
gesprochen werden soll, muss in reinem TypeScript stehen.

Damit war die Richtung vorgegeben: nicht die Vorlesefassung zur Zeichnung
holen, sondern die Beschreibung aus der Zeichnung heraus.

### Was jetzt gilt

`lib/grafik-beschreibungen.ts` rechnet alle 70 Beschreibungen, aus denselben
Modulen wie vorher die Zeichnung. `FigureSvg` liest sie, `vorlesegrafiken()`
führt sie mit `figureMeta` zusammen, und alle drei Vorlese-Wege nehmen diese
Zusammenführung. Zwei Dinge mussten dafür aus `.tsx` heraus – `FARBEN` nach
`farben.ts` und die Kastenreihen nach `kastenreihen.ts`.

**Entweder dort oder hier, nie beides.** Die 23 Formbeschreibungen sind
gestrichen.

### Wie es geprüft wird – und warum nicht als Test

Der Vergleich liest jedes `<desc>` aus `out/` und hält es gegen das, was
gesprochen würde. Er braucht also das gebaute Paket, und in CI laufen die Tests
**vor** dem Bau. Als Test wäre er entweder ständig rot oder – schlimmer – er
überspränge sich selbst und meldete grün.

Er steht deshalb in `scripts/paket-pruefen.ts`, dort wo `out/` ohnehin gelesen
wird. `tests/grafik-beschreibungen.test.ts` behält, was ohne Bau prüfbar ist:
dass jede Grafik eine Vorlesefassung hat und dass keine zwei trägt.

Beim Umbau wurden vorher alle 135 `<desc>` gesichert und nach jedem Schritt
dagegen gehalten. Der fertige Bau liefert 135 von 135 zeichengleich – dieselben
Sätze, nur an einer Stelle statt an zweien.

### Die Lehre

**Wo eine Angabe zwei Abnehmer hat, die sie auf verschiedenen Wegen holen, ist
sie zwei Angaben.** Ein Pflichtfeld, das nur die Anwesenheit erzwingt, sichert
davon nichts: `FigureSvg` hätte auch dann nicht gewarnt, wenn eine der beiden
Fassungen offenkundiger Unsinn gewesen wäre.

Und: **Eine Entscheidung altert nicht dadurch, dass ihre Begründung falsch
wird, sondern dadurch, dass ein zweiter Abnehmer dazukommt.** Als die
gerechneten Beschreibungen entstanden, gab es die Vorlesefassung noch nicht.
Niemand hat etwas falsch gemacht; es hat nur niemand nachgesehen, was der neue
Weg eigentlich liest.
