---
titel: Ein Kurs ist so alt wie die Stelle, die ihn anzeigt
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

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

#### Derselbe Satz gilt für die Prüfungen selbst

Am 5. September 2026 hat er zum zweiten Mal in zwei Tagen eine Tagesausgabe
gekostet – diesmal, weil er auf `tests/quartalstermine.test.ts` angewandt
gehört hätte und niemand ihn dort gelesen hat.

Drei Prüfungen standen nebeneinander:

    Ein angekündigter Termin trägt kein „geschätzt"    angekündigt → kein geschaetzt
    Und ein hochgerechneter trägt es                   hochgerechnet → geschaetzt
    Jeder Termin ist als geschätzt gekennzeichnet      ALLE → geschaetzt

Die erste und die dritte **widersprechen einander**. Nicht subtil, sondern
unmittelbar: Was die eine verlangt, verbietet die andere. Trotzdem standen
sie wochenlang grün nebeneinander, weil es keinen einzigen angekündigten
Termin gab. Über einer leeren Menge sind beide wahr.

Die dritte stammt aus der Zeit vor dem Begriff „angekündigt". Als er im
August eingeführt wurde, blieb sie stehen – nichts konnte sie stören. In der
Nacht auf den 5. September lieferte die Tokioter Börse zum ersten Mal drei
angekündigte Termine, und `nachrichten.yml` schrieb nichts mehr.

**Was daraus folgt, über den Fall hinaus:**

- Ein neuer Begriff macht die Prüfungen, die es vorher gab, nicht ungültig –
  aber er kann sie **falsch** machen, und zwar lautlos, solange er kein
  Material hat. Wer einen einführt, liest die vorhandenen Prüfungen daneben
  noch einmal und fragt: Welche davon sprechen über „alle", und stimmt das
  noch?
- Zwei Prüfungen, die sich widersprechen, sind kein Problem der Prüfungen,
  sondern eine offene Frage über die Sache. Hier lautete sie: _Trägt jeder
  Termin eine Kennzeichnung, oder trägt jeder Termin dieselbe?_ Die Antwort
  war seit August die erste, und eine Zeile Code sagte weiter die zweite.
- **Der Ersatz für eine gestrichene Prüfung ist nicht nichts.** An ihre
  Stelle kamen zwei: dass angekündigt und hochgerechnet zusammen jeden Termin
  abdecken (eine dritte Sorte fiele sonst durch beide hindurch), und dass
  kein Termin ohne Kennzeichnung dasteht – die eigentliche Zusage, jetzt so
  formuliert, dass sie beide Sorten meint.

Nachgesucht wurde anschließend im ganzen Testbestand nach derselben Gestalt:
sechzehn Stellen, an denen `.every()` über eine gefilterte Menge läuft. Alle
sechzehn tragen eine Wache – eine Nichtleer-Prüfung, einen Abgleich der
Anzahl oder eine benachbarte Prüfung, die die Menge besetzt hält. Der Fall
oben war der einzige, und sein Merkmal war nicht die leere Menge allein,
sondern **der Widerspruch daneben**, den die leere Menge verdeckt hat.

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

## Die Folge ist eine Nachrichtensendung, kein Lehrstück

Am 16. September 2026 hat der Betreiber vier Dinge auf einmal beanstandet:

> im podcast gibt es noch immer viele sprachfehler und es soll dort nichts
> erklärt werden sondern nur die daily news kommen wirtschaft und politik du
> brauchst auch nicht so sehr auf einzelne titel eingehen wenn dann nur auf
> die big titel wenn es etwas sehr wichtiges gibt ansonsten halt auch wichtig
> events zb fed zinsentscheide usw oder jetzt wo russland die ukraine nage der
> polnischen grenze angriff aber alles objektiv ohne positionierung oder
> meinung

### Was in der Folge wirklich stand

Nachgesehen wurde nicht im Kopf, sondern am erzeugten Sprechtext. Die Folge
zum 30. Juli, 669 Wörter, enthielt unter anderem:

    „der Ess und Pie fünfhundert"            → stand da als „S und P"
    „der Nässdackminus einhundert"           → aus „Nasdaq-100"
    „der USminus dreißig"                    → aus „US-30"
    „Ein neun-zuminus drei-Stillhalten"      → aus „9-zu-3"
    „WTI", „Bank of England", „Warsh"        → gar nicht umgeschrieben

**Der Fehler mit dem Minus war eine einzige Zeile.** Die Vorzeichenregel in
`sprechbar()` fasste jeden Bindestrich vor einer Ziffer. Ein Bindestrich in
einem zusammengesetzten Wort ist kein Minuszeichen; unterscheiden lassen sich
die beiden an dem, was links davon steht. Das ist wieder der Satz aus den
Lehren: **Eine Fallunterscheidung über Merkmale, die der Stoff nicht hat, ist
keine.** „Strich vor Ziffer" ist kein Merkmal eines Vorzeichens.

### Warum die Aussprachetabelle trotz Prüfung weiter driftete

`tests/sprechfassung-aussprache.test.ts` prüfte die Regeln seit dem 20. August
2026 maschinell – **an einer handgepflegten Liste von siebzehn Wörtern.** Die
Tabelle hatte zu diesem Zeitpunkt über hundert Einträge.

Das ist eine Stichprobe, die wie eine Zusicherung aussieht. Wer einen Namen
einträgt, denkt nicht daran, ihn zusätzlich in eine Testdatei zu schreiben; die
Prüfung bleibt grün und sagt nichts darüber, was sie nicht angesehen hat.

Seither läuft die Regel über **jeden** Eintrag. Das Probewort entsteht aus dem
Muster selbst, und lässt es sich nicht ablesen, fällt der Eintrag durch, statt
übersprungen zu werden – eine Prüfung, die still auslässt, was sie nicht
versteht, ist wieder eine Stichprobe.

**Beim ersten Lauf fand sie sofort einen Fehler:** „Private Equity" stand als
„Preiwet Ekwiti" da. Deutsches „kw" ist /kv/, gesprochen wurde also „Ekwiti".
Dieselbe Falle wie bei „Squeeze" → „Skwies", das ein Mensch beim Zuhören
gefunden hatte. Die alte Regel konnte beide nicht sehen: Sie suchte ein „w" im
**englischen** Wort, und in „Squeeze" und „Equity" steht keins – das /w/ steckt
im „qu".

### Nichts erklären heißt: das Feld weglassen, nicht kürzen

Die Folge trug bis dahin zweimal Erklärung: `whyItMatters` hing an jedem
Themenabsatz, und das „Fazit" am Schluss trug den Satz der wichtigsten Meldung
ein zweites Mal vor. Beides ist weg.

**Das Feld bleibt in den Daten und auf der Website.** Es ist dort der erklärte
Zweck der Rubrik, und der Abschluss der Folge verweist genau darauf: „Alle
Themen ausführlich und mit Einordnung findest du auf iminvests.de." Der
Unterschied ist nicht der Umfang, sondern die Gattung – wer morgens
Nachrichten hört, will wissen, was passiert ist.

Dieselbe Ausgabe ergibt damit 472 statt 669 Wörter. Die Beschreibung sagt
seither nicht mehr „rund fünf Minuten", sondern rechnet die Spieldauer aus dem
Sprechtext: Eine Angabe, die einmal gestimmt hat und seither mitgeschleppt
wird, ist genau der stille Fehler.

### Warum die Mischung nicht im Code entschieden wird

Der naheliegende Schritt wäre ein Riegel in `baueFolge()`: Einzeltitel
erkennen und nach hinten sortieren. Nachgezählt an allen 291 Meldungen aus 47
Ausgaben, ob sich das überhaupt entscheiden lässt – das Ergebnis war **nein**.
Das beste verfügbare Merkmal, „genau ein `relatedSymbol`", trifft 137 von 291
und steht gleichermaßen unter „Apple stellt faltbares iPhone vor" und unter
„Gaspreis steigt erstmals seit 2022 über 80 Euro".

Ein Klassifikator auf Merkmalen, die der Stoff nicht trägt, hätte sortiert und
dabei geraten. Also steht die Mischung dort, wo der Text entsteht: im Prompt,
in `scripts/nachrichten-erzeugen.ts` **und** `nachrichten-agent.yml`. Die
Rangfolge unter `top` ist die Rangfolge der Folge.

### Objektivität: Prompt plus Grenze

Eine Anweisung an ein Modell ist eine Bitte, keine Zusage – derselbe Satz wie
bei den geplanten Läufen. Deshalb prüft `positionierungen()` in
`lib/editions-validate.ts` zusätzlich, und `scripts/nachrichten-erzeugen.ts`
holt dieselbe Funktion, statt die Liste abzuschreiben.

Geprüft wird **nur `summary`** – der Text, der gesprochen wird – und nur, was
sich mechanisch entscheiden lässt: Anlageempfehlung und eigene Meinung.
Urteilende Adjektive stehen bewusst nicht in der Liste: In einem Zitat mit
Zuschreibung sind sie richtig, und eine Wortliste, die das nicht unterscheiden
kann, beanstandet irgendwann eine korrekte Meldung und wird dann abgeschaltet
statt befolgt.

Über alle 47 Ausgaben findet die Regel keinen Treffer. Dass sie trotzdem
arbeitet, zeigt `tests/editions-objektiv.test.ts` an neun Sätzen, die sie
beanstanden **muss**, und sieben, die durchgehen müssen – darunter die heiklen
„Der Bericht sollte um 14:30 Uhr erscheinen" und „Die Fed dürfte den Leitzins
halten".

### Der Nebenbefund: Kapitelnamen aus Dezimalkommas

Beim Nachsehen fiel auf, dass `kernDerUeberschrift()` an `[:–—,]` trennte –
also auch am **Dezimalkomma**. In einem Börsentext steht in fast jeder
Überschrift eines. Herausgekommen ist „Öl springt 7" als Kapitelname, und in
jeder Folgenbeschreibung stand „Wir sprechen über Öl springt 7, Microsoft
springt, Heute." Dazu kam der Stummel: „Heute:" und „Wall Street:" sind
Rubriken, kein Kern.

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
