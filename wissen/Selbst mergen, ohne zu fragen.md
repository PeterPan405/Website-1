---
titel: Selbst mergen, ohne zu fragen
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

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

## Ein Glied, das nur an der Uhr hing – 27. August 2026

An diesem Morgen standen weder Nachrichten noch Podcast auf der Website. Die
erste Diagnose lautete „GitHub hat die Läufe verworfen" und war falsch: Sie
entstand um 04:40 UTC, als die Läufe noch nicht da waren. Sie kamen später.

**Verzögert, nicht verworfen** – um rund neuneinhalb Stunden:

| Lauf                 | geplant (UTC)         | tatsächlich           |
| -------------------- | --------------------- | --------------------- |
| `quellen-pruefen`    | 00:03                 | 09:24                 |
| `quellen-sammeln`    | 00:09 / 00:29         | 09:35 / 10:01         |
| `nachrichten-agent`  | 00:33 / 01:03 / 01:33 | 10:10 / 10:55 / 11:55 |
| `nachrichten` (Cron) | 01:13 … 02:47         | 11:10 … 13:05         |
| `ausgabe-waechter`   | 03:11                 | 14:05                 |

Die Kette selbst hat funktioniert. `kurse.yml` läuft alle fünf Minuten und war
pünktlich; sie stieß um 02:12 `nachrichten.yml` an, das seinerseits den Sammler
weckte. Beide taten, was sie sollten.

**Nur den Agenten konnte niemand wecken.** Er war das einzige Glied der Kette,
das ausschließlich an seinen drei Crons hing – und die standen um 02:12 noch in
GitHubs Warteschlange. `nachrichten.yml` fand deshalb nur den Entwurf von
gestern und brach richtigerweise rot ab.

AGENTS.md sagt genau das seit Langem:

> Was zu einer bestimmten Zeit passiert sein muss, darf nicht an `schedule`
> hängen. Wer einen Lauf anlegt, dessen Ergebnis jemand vermissen würde, hängt
> ihn an die Kette statt an eine Uhrzeit.

Der Agent war die Ausnahme von dieser Regel, und sie ist niemandem aufgefallen,
solange die Uhr stimmte. Eine Regel, die eine Ausnahme hat, von der niemand
weiß, ist keine Regel, sondern eine Gewohnheit.

### Die Abhilfe und ihre drei Riegel

`quellen-sammeln.yml` weckt jetzt zum Schluss den Agenten. Damit hängt kein
Glied mehr allein an der Uhr:

    quellen-pruefen ─┐
    kurse.yml ───────┼─→ quellen-sammeln ─→ nachrichten-agent
                     │                            │
                     └────────────────────────────┴─→ nachrichten ─→ Podcast

Der Agent stößt seinerseits den Sammler an, wenn ihm die Quellen fehlen. Ohne
Riegel entstünde daraus eine Schaukel, und deshalb sind es drei:

1. **Läuft schon ein Agent?** Dann hat er uns gerufen und wartet gerade auf
   uns – er pollt selbst auf die Datei.
2. **Steht der Entwurf von heute?** Dann ist er fertig; sonst weckte ihn der
   zweite Cron-Termin des Sammlers ein zweites Mal.
3. **Steht die Ausgabe von heute auf `origin/main`?** Dann ist der Tag
   erledigt. Gefragt wird `origin/main` von **jetzt**, nicht der Checkout.

Jeder Riegel für sich beendet die Schaukel. Riegel 3 ist an echtem Bestand
geprüft: Für den 27. August greift er, für einen Tag ohne Ausgabe nicht.

### Was damit **nicht** behoben ist

Verzögert GitHub auch `kurse.yml`, hat die Kette keinen pünktlichen Einstieg
mehr, und dann hilft kein weiteres Glied. Der Wächter fängt das nicht auf: Er
hängt selbst an einem Cron und kam an diesem Tag elf Stunden zu spät. Ein
Alarm, der mit der Störung zusammen ausfällt, ist keiner.

Ein wirklich unabhängiger Wecker müsste **außerhalb** von GitHub Actions
laufen – eine Überwachung, die morgens die Website abruft und nachsieht, ob die
Ausgabe des Tages dasteht. Das ist eine Entscheidung des Betreibers über einen
weiteren Dienst, kein fehlender Code.

Und: Solange `ANTHROPIC_API_KEY` nicht hinterlegt ist, hat die Rangfolge nur
einen Weg. Der Agent ist jetzt zuverlässiger erreichbar – aber wenn er selbst
ausfällt, gibt es weiterhin keine Ausgabe.

## Der Einstieg in den Tag hängt jetzt an einem laufenden Prozess – 28. August 2026

Am Morgen danach war es wieder so: keine Nachrichten, keine Folge. Diesmal
ließ sich die Ursache in zwei Schichten zerlegen, und beide waren neu.

### Erste Schicht: der Riegel, den ich am Vortag selbst eingebaut hatte

Am 27. August war die Lücke, dass `nachrichten-agent.yml` als einziges Glied
der Kette nur an seiner eigenen Uhr hing – niemand weckte ihn. Der Fix:
`quellen-sammeln.yml` weckt ihn seither mit `gh workflow run`.

Das funktionierte. Um 04:23 UTC startete der Agentenlauf, wie vorgesehen. Und
brach sofort ab:

```
Actor type: Bot
Workflow initiated by non-human actor: github-actions (type: Bot).
Add bot to allowed_bots list or use '*' to allow all bots.
```

`anthropics/claude-code-action` weist Bot-Actors ab, solange nichts anderes
dasteht. Solange der Workflow **nur** per `schedule` lief, war der Actor der
letzte Mensch, der auf `main` gepusht hatte – deshalb ist es vorher nie
aufgefallen. Ein Anstoß mit dem `GITHUB_TOKEN` macht daraus
`github-actions[bot]`.

Das ist ein Lehrstück für sich: **Wer ein Glied anders auslöst als bisher,
ändert damit auch, wer es auslöst.** Der Actor war nirgends Teil der Überlegung
– er stand in keiner Zeile, die ich angefasst hatte. Bemerkt wurde es erst am
nächsten Morgen, an derselben Stelle, die der Fix hatte retten sollen.

Behoben mit `allowed_bots: 'github-actions'` – ausdrücklich nicht `*`. Die
Sperre ist dafür da, dass nicht jeder beliebige Bot einen Agentenlauf auf
Kosten des Abonnements startet.

### Zweite Schicht: die Uhr selbst war weg

Der eigentliche Befund steckte darunter. Von `kurse.yml` – einem Workflow mit
einem geplanten Termin **alle fünf Minuten** – lieferte GitHub an diesem Tag
zwischen 00:00 und 04:20 UTC genau **einen** Lauf aus. `quellen-pruefen.yml`
(00:03) lief gar nicht. `ausgabe-waechter.yml` (03:11) lief gar nicht. Am Tag
davor war `quellen-pruefen` um 09:24 gekommen, neuneinhalb Stunden zu spät.

Bisher stand in `AGENTS.md` die Regel, aber nicht ihre Anwendung: _Was zu einer
bestimmten Zeit passiert sein muss, darf nicht an `schedule` hängen._ Nur hing
jeder Einstieg in den Tag genau daran. Die Kette hängt zwar Glied an Glied –
aber das erste Glied wurde von einer Uhr gezogen, und die Uhr fiel aus.

### Was tatsächlich lief

Eine Sache lief in dieser Nacht durchgehend: `kurse-dauerlauf.yml`. Der Lauf
33124431577 begann um 22:56 UTC und übergab um 04:16 an seinen Nachfolger –
**ein einziger Job**, fünfeinhalb Stunden, alle zwei Minuten eine Runde.

Und das ist der Punkt: **Ein laufender Prozess lässt sich nicht verwerfen.** Er
steht in keiner Warteschlange, aus der GitHub etwas streichen könnte; er läuft
bereits. Während jeder geplante Termin der Nacht fiel, holte diese Schleife
alle zwei Minuten Kurse und lud sie hoch.

Der Einstieg in den Tag hängt deshalb jetzt dort mit dran. Alle fünf Runden –
also alle zehn Minuten – fragt der Dauerlauf, ob die Ausgabe des Tages auf
`main` steht, und weckt sonst `quellen-sammeln.yml`. Von dort läuft die Kette
weiter wie gehabt.

### Was daran absichtlich umständlich ist

**Die Entscheidung steht nicht in der Shell.** Sie steht in
`lib/tageswecker.ts`, als reine Funktion, und in `tests/tageswecker.test.ts`
liegt zu jeder einzelnen Bedingung ein Fall, den sie abweisen **muss**, neben
einem, den sie durchlassen muss. Der Grund ist der Satz, an dem sich dieses
Projekt schon zweimal die Finger verbrannt hat: _Eine Absicherung, die nie
anschlägt, sieht aus wie Ruhe._ Ein Wecker, der immer `false` zurückgibt, wäre
im Protokoll von einem richtigen nicht zu unterscheiden – er stünde nur still.

**Die eine Tatsache von außen holt der Workflow selbst**, mit `curl` gegen die
GitHub-Schnittstelle: `200` heißt, die Ausgabe steht, `404` heißt, sie fehlt.
Ein Abruf aus dem Skript heraus wäre ein Weg gewesen, der sich in der
Arbeitsumgebung hier nicht prüfen lässt – _wo die einzige prüfbare Umgebung
nicht die ist, in der es kaputtgeht, ist „müsste jetzt gehen" keine Aussage._
Und gefragt wird die **Gegenwart**, nicht der Checkout des Dauerlaufs: Der ist
beim Start gemacht worden und kann sechs Stunden alt sein.

**Bei einer unklaren Antwort wird nicht geweckt.** Kein Netz, Fehler 500,
Gegenstelle stumm – dann steht eine Warnung im Protokoll und sonst nichts. Ein
Weckruf ins Blaue startet die ganze Kette; eine ausgefallene Nachfrage ist in
zehn Minuten wieder da.

**Drei Bremsen gegen eine Schleife:** höchstens drei Weckrufe je Dauerlauf,
eine halbe Stunde Abstand dazwischen, und ein Fenster von 00:10 bis 05:00 UTC.
Vor 00:10 hat die geplante Kette Vorrang – `quellen-sammeln.yml` ist um 00:09
selbst an der Reihe, und wer davor weckt, startet denselben Lauf zweimal. Dazu
kommen die drei Riegel in `quellen-sammeln.yml` selbst (läuft schon ein Agent?
steht der Entwurf? steht die Ausgabe?) und die `concurrency`-Gruppen aller drei
beteiligten Workflows.

**Der Wecker steht im stündlichen Lebenszeichen, mit Begründung.** An einem
guten Tag schweigt er den ganzen Lauf über – und ein Riegel, der nur schweigt,
ist von einem kaputten nicht zu unterscheiden. Deshalb steht in jeder
Lebenszeichen-Zeile, was er zuletzt entschieden hat: „außerhalb des Fensters",
„steht bereits auf main", „blieb unklar". Steht dort stundenlang „blieb
unklar", antwortet die Nachfrage bei GitHub nicht mehr – das fiele sonst erst
an dem Morgen auf, an dem sie gebraucht wird.

**Ein gescheiterter Anstoß macht den Lauf nicht rot.** Der Dauerlauf hält die
Kurse aktuell; ihn wegen der Nachrichten abzubrechen wäre der schlechtere
Tausch. Es bleibt bei einer Warnung, und der nächste Versuch kommt in einer
halben Stunde.

### Was das nicht löst

Der Dauerlauf selbst startet aus einem Cron (`13 1,7,13,19 * * *`). Er hält
sich danach von allein am Leben – jeder Lauf startet seinen Nachfolger –, aber
wenn die Kette einmal ganz abreißt, muss ein geplanter Termin sie wieder
anwerfen. Das ist eine deutlich kleinere Angriffsfläche als vorher, aber keine
Null.

Und die Prüfung des Bot-Wegs steht noch aus: Der Anstoß am 28. August lief
unter einem menschlichen Actor, weil ich ihn von Hand ausgelöst habe.
`allowed_bots` bekommt seinen ersten echten Test in der Nacht darauf.

## Den Dauerlauf von Hand anzustoßen hält die Kurse an – 28. August 2026

Direkt nach dem Einbau des Weckers wollte ich ihn auf einem echten Läufer
sehen. Der laufende Dauerlauf trug noch den alten Stand, also habe ich
`kurse-dauerlauf.yml` von Hand angestoßen. Das war der Fehler.

`concurrency: { group: kurse-dauerlauf, cancel-in-progress: true }` ist für den
Regelfall richtig gedacht: Der Nachfolger löst den Vorgänger ab, damit nie zwei
Schleifen gleichzeitig bei Yahoo klopfen. Ein Anstoß von Hand ist für diese
Gruppe aber nicht von einem Nachfolger zu unterscheiden – er **tötet den
gesunden Lauf**.

Und der neue kam nicht hoch: `ssh-keyscan` bekam auf Port 65002 fünfmal keine
Antwort, der Lauf brach ab, und die zweite Bremse („kein Nachfolger unter zehn
Minuten Laufzeit") verhinderte richtigerweise, dass er sich selbst neu startet.
Ergebnis: **kein Dauerlauf mehr**, die Live-Kurse standen.

Zwei Minuten später lief `kurse.yml` planmäßig durch – mit demselben Zugang,
über dieselbe SSH-Verbindung, grün. Der Port war also nicht weg. Wahrscheinlich
hat der abgelöste Lauf noch Verbindungen offengehalten, während der neue fünf
`ssh-keyscan` in hundert Sekunden abfeuerte; der Hoster begrenzt so etwas.
_„Der Port dieses Hosters flattert"_ stand schon vorher hier.

Ein zweiter Anstoß – jetzt, wo wirklich keiner mehr lief – kam sofort hoch. Die
Kurse standen vierzehn Minuten statt der zugesagten sechs. Kein Besucher hat
etwas anderes gesehen als eine etwas ältere Zahl, aber die Zusage war gerissen,
und zwar nicht von GitHub, sondern von mir.

**Die Regel steht jetzt in `AGENTS.md`:** Den Dauerlauf nur anstoßen, wenn
keiner läuft oder der laufende kaputt ist. Wer die neue Fassung sehen will,
wartet auf die nächste Übergabe – sie kommt spätestens nach fünfeinhalb
Stunden.

Die allgemeinere Form davon: **Eine Ablösung ist kein Neustart.** Wo
`cancel-in-progress` steht, ist jeder Anstoß von außen ein Abbruch mit
Wiederanlauf – und ein Wiederanlauf kann scheitern, wo der laufende Prozess
längst über seine eigene Anlaufhürde hinweg war.

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
