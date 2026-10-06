---
titel: Vier Beanstandungen an einer Folge
datum: 2026-10-06
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Vier Beanstandungen an einer Folge – 6. Oktober 2026

Gemeldet hat der Betreiber zur Folge vom 6. Oktober: „hat sich nicht wirklich
auf das Wesentlichste beschränkt … und er ging viel zu lange. Sechs Minuten.
Das darf so nicht sein. Lass ihn jetzt drin, aber ändere das für die kommenden
Tage. Zudem ist die Aussprache immer noch nicht gut. Und zum Beispiel Namen
wie Trump werden T-R-U-M-P ausgesprochen. Aber im Deutschen klingt es ja eher
T-R-A-M-P. Und solche Fehler passieren dort ständig auch irgendwelche
Störgeräusche im Hintergrund und so weiter."

Vier Befunde, und jeder hat eine andere Ursache.

## Erstens: zu lang – und das war die Wirkung einer eigenen Änderung

Die Folge hatte 631 Wörter in acht Meldungen und lief 6:02. Die Obergrenze
`WORTZIEL_MAX` stand bei 740 und hat nie etwas getan: Die längste Folge davor
hatte 686 Wörter.

Am 28. September kamen `MELDUNGEN_MIN = 5` und die 110 Wörter `summary` dazu,
weil die Folge zu **dünn** war. Seither wuchs sie, und gedeckelt hat sie
nichts:

    28.09.  183 W  1:46      02.10.  479 W  4:44
    29.09.  397 W  3:49      03.10.  449 W  4:00
    30.09.  348 W  3:29      04.10.  436 W  4:24
    01.10.  399 W  3:49      05.10.  487 W  5:01
                             06.10.  631 W  6:02   ← gemeldet

**Eine Untergrenze ohne wirksame Obergrenze kennt nur eine Richtung.** Das ist
die allgemeine Lehre aus diesem Punkt, und sie ist unangenehm, weil der
Auslöser eine Verbesserung von neun Tagen vorher war.

`WORTZIEL_MAX` steht jetzt auf **420**. Gewählt an der **gemessenen** Dauer:
Wortzahl gegen Spieldauer über alle 64 Folgen ergibt rund 104 Wörter je
Minute, die letzten zwölf zwischen 97 und 112. 420 sind damit rund vier
Minuten.

## Zweitens: nicht auf das Wesentlichste – dieselbe Änderung

Das war kein zweiter Hebel. Gekürzt wird **von hinten**, und die Rangfolge der
Ausgabe ist die Rangfolge der Folge: `top` zuerst, dann `further`. Am 6. Oktober wären Gold und Silber, der Ölpreis und eine Fondsübernahme
weggefallen, geblieben wären die Werkaufträge, Russland, die Bomber und der
Euro. Nachgerechnet kommt die Folge auf 368 Wörter in vier Meldungen.

**Auf der Website bleibt alles stehen.** Gekürzt wird die Folge, nicht die
Ausgabe; `MELDUNGEN_MIN = 5` in `scripts/nachrichten-erzeugen.ts` bleibt, und
ein Leser bekommt weiter alle acht Meldungen. Beide Prompts sagen das jetzt
ausdrücklich – die Reihenfolge entscheidet, was gesprochen wird.

## Und die Spieldauer in der Beschreibung war auch falsch

`WOERTER_JE_MINUTE` stand bei 134. Das war das Tempo der **reinen Sprache**,
nachgemessen im Juli und August. Angesagt wird aber die **Spieldauer**, und
zwischen den Stücken steht Stille. Jede Beschreibung versprach damit rund ein
Viertel zu wenig: Die Folge vom 6. Oktober sagte „rund fünf Minuten" an und
lief 6:02. Jetzt 104, aus der Messung oben.

Dieselbe Sorte Fehler wie die Zahl, gegen die der Kommentar dort anschreibt –
nur eine Ebene tiefer: gemessen wurde schon, aber an der falschen Größe.

## Drittens: „Trump" – und warum der Melder ihn nicht finden kann

`verdaechtigeAnglizismen` sucht **Schreibmerkmale**: „tch", „-ing", „-sh",
Konsonant plus „y", Großbuchstabenfolgen. **„Trump" ist nach deutscher
Rechtschreibung ein völlig gewöhnliches Wort** – wie „Trumpf" ohne f. Ein
Eigenname hat kein Merkmal, an dem man ihn erkennt.

Gefunden wurden die Namen deshalb anders: über den **eigenen** deutschen
Wortschatz. Die 172 Lernseiten sind von Hand geschriebenes Deutsch, 11.937
verschiedene Wörter. Jedes großgeschriebene Wort aus 70 Tagesausgaben, das
dort nicht vorkommt, ist ein Kandidat – 353 statt 2.337, und darin stehen die
Namen zwischen „Dienstagmorgen" und „Rheinmetall" sofort sichtbar.

Dreizehn Einträge sind daraus geworden: Trump (30×), Kevin (10×), Tech (10×),
Composite (8×), Lagarde (8×), Cipollone (6×), Pipeline (6×), Shanghai (6×),
Lane (6×), Micron (4×), Group (4×), Williams (3×) – dazu KKR und RAF, die der
Melder selbst gefunden hat.

Zwei Fallen dabei, beide aus den eigenen Regeln:

- **„Tech" muss hinter „Big-Tech" stehen.** Davor zerlegt es die
  Zusammensetzung: „Big-Tech" würde „Big-Teck", und das Muster darüber träfe
  nie mehr. Dieselbe Reihenfolge-Falle wie „Goldman Sachs" vor „Goldman".
- **„Williams" braucht ein „u", „Kevin" ein „w".** Falle 2 und Falle 3 der
  deutschen Rechtschreibung, und `tests/sprechfassung-aussprache.test.ts`
  hätte beide gemeldet.

**Das Verfahren ist keine Automatik und wird keine.** Ob „Rheinmetall" deutsch
klingt und „Micron" nicht, entscheidet weiter ein Kopf. Es macht aus einer
offenen Frage eine Liste von 353 Wörtern – und das ist der Unterschied
zwischen „geprüft" und „ständig passiert sowas".

## Viertens: die Störgeräusche – eine Regel, die nur dastand

Nachgemessen mit `scripts/aufnahmen-nachpruefen.py` an den vier letzten
veröffentlichten Folgen:

    06.10.  2:29 rau · 3:37 rau
    05.10.  3:30 rau
    04.10.  2:14 rau · 4:11 rau
    03.10.  0:01 Rumpeln · 1:34 rau · 2:05 Rumpeln

Acht Stellen in vier Folgen – **zwei je Folge, in jeder Folge.** Der Betreiber
hat nicht übertrieben, und „irgendwelche" war die genaue Beschreibung.

In `AGENTS.md` steht seit dem 11. August 2026: „Geprüft wird die fertige
Aufnahme, nicht das Stück. `nachbessern()` läuft nach dem Zusammenfügen und
dämpft, statt zu melden." Der Lernseitenlauf tut das.
**`scripts/stimme-erzeugen.py` hat die Funktion nie aufgerufen** – das Wort
kam in dieser Datei nicht ein einziges Mal vor.

Die Prüfung je Stück (`brauchbar`) lief und läuft. Sie findet genau das nicht,
wofür `nachbessern` geschrieben wurde: Eine Störung in einem leisen Stück
bleibt unter der Schwelle, die am Pegel **dieses Stücks** gemessen wird; gegen
den Pegel der **ganzen Folge** liegt sie darüber. Das steht wörtlich im
Docstring von `nachbessern`, mit dem Fall vom 11. August dazu – und war
seither nicht verdrahtet.

Der teuerste Fehler ist nicht der rote Lauf, sondern der stille: eine
dokumentierte Absicherung, die nach Ruhe aussah, während der Betreiber das
Ergebnis jeden Morgen hörte.

### Der Test, der seine eigene Gegenprobe nicht überstanden hat

`tests/stoergeraeusche.test.ts` prüft jetzt den **Aufruf** – in beiden
Sprechwegen, und vor der Klangkette, weil danach gedämpfte Stellen wieder
angehoben würden.

Die erste Fassung war grün, nachdem der Aufruf zum Versuch entfernt wurde. Sie
strich nur `#`-Kommentare; `stimme-erzeugen.py` dokumentiert mit Docstrings,
und in dem Absatz, der soeben dort hingeschrieben worden war, stand
„`nachbessern()` läuft nach dem Zusammenfügen" – mit Klammer.

**Der Test war blind für genau den Zustand, den er finden soll** – dieselbe
Falle wie der Fehler, den er bewacht: ein Name, der dasteht, ohne dass etwas
passiert. Ohne die Gegenprobe wäre er so eingecheckt worden.

## Was ausdrücklich nicht gemacht wurde

Die Folge vom 6. Oktober bleibt, wie sie ist – „lass ihn jetzt drin". Eine
zweite Fassung bräuchte eine erhöhte `fassung`, und das ist überall eine
„neue Folge".

Und die acht gemessenen Stellen in den vier Folgen werden nicht nachträglich
gedämpft: Dieselbe Begründung. Was ab morgen gesprochen wird, läuft durch
`nachbessern`.
