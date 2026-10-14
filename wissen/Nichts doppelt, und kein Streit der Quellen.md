---
titel: Nichts doppelt, und kein Streit der Quellen
datum: 2026-10-14
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Nichts doppelt, und kein Streit der Quellen – 14. Oktober 2026

Am 14. Oktober 2026 schickte der Betreiber drei Bildschirmfotos des
Karussells auf der Startseite und schrieb dazu: „wir brauchen keine news
doppelt" – und zu „Ölpreis: Übersicht nennt 107 Dollar, Kursleiste zeigt
106,37": „sowas klingt unsicher, ist verwirrend und unseriös."

## Was nachgezählt wurde

Über alle 521 Artikel an 86 Tagen:

- **Öl, Gold oder Silber** kamen an 79 von 86 Tagen vor, an 75 von 85
  aufeinanderfolgenden Tagespaaren an beiden. Das Karussell zeigt seit einem
  Nutzerwunsch zwei Erscheinungstage – also stand fast immer zweimal dasselbe
  darin, mit anderen Zahlen. „Gold nähert sich 4.200 Dollar" erschien am 10. und am 11. Oktober fast wortgleich.
- **Quellenstreit als Aufhänger** seit dem 1. August immer wieder: „Brent bei
  88,14 oder 90,12 Dollar? Beide Zahlen stimmen", „DAX vor dem Wochenstart:
  zwei Quellen, zwei Schlusskurse". „Kursleiste" – ein Bauteil der
  Quellseite, das kein Leser kennt – stand in 96 Artikeln.

## Das zweite war bestellt

Die Anweisung an den Agenten nannte unter „Der Ton" als Beispiel für
Spannung: „Zwei Portale nennen denselben Preis mit verschiedenen
Prozentzahlen." Der Agent hat das getan, was dastand. Zwei Zahlen für
denselben Preis sind aber keine Nachricht, sondern zwei Abrufzeitpunkte –
und für den Leser klingt die Website dabei, als wüsste sie es nicht.

Gestrichen. Der Widerspruch, der trägt, liegt in der **Sache**
(Auftragseingang steigt, Umsatz nicht), nie zwischen den Quellen. Weichen
zwei Quellen ab, wird eine genommen – die mit Uhrzeit, sonst die jüngere –
und mit Zeitpunkt genannt.

## Die Regel und ihr Netz

Die Regel steht in beiden Anweisungen (`nachrichten-agent.yml`,
`nachrichten-erzeugen.ts`): Ein Thema vom Vortag kommt nur mit einem neuen
Ereignis wieder, ein Preis allein ist keins, ein Thema ist ein Artikel. Die
API-Anweisung bekommt die Überschriften des Vortags mitgeliefert; der Agent
liest sie selbst.

Das Netz steht in `lib/nachrichten-wiederholung.ts` und im Riegel:

- **Wiederholung:** Jede Überschrift gegen die des letzten Erscheinungstags,
  Anteil gemeinsamer Themenwörter, Grenze ein Drittel. Am Bestand gewählt:
  acht Treffer, alle acht Wiederholungen; direkt darunter liegen die Fälle,
  die erlaubt sein müssen – HPE nach NetApp (0,30), ein neuer Vorfall vor
  Hormus (0,29), der Diesel-Deal mit den nachgetragenen Mengen (0,27). Beide
  Listen stehen am Wert und werden im Test gegen den Bestand geprüft.
- **Quellenstreit:** In Überschrift, Meta-Titel, Anreißer, Einleitung und
  Meldung **zurückgewiesen**, im Fließtext **gewarnt**.

Warum die Trennung: Hart über alles geprüft, hätte die Regel unter der alten
Anweisung 54 von 86 Tagen beanstandet, 46 davon nur wegen „Kursleiste" in
einem Absatz. Der Agent bessert in seiner Probe nach – gelingt ihm das
nicht, fehlt aber der ganze Tag, und das ist für ein Wort im Fließtext der
falsche Preis. Was der Leser im Karussell sieht und in der Folge hört,
bleibt hart: dort hätte es 15 von 86 Tagen getroffen, und jeder davon ist
einer der beanstandeten Fälle.

Geprüft am Entwurf selbst: Der Entwurf des Agenten vom 14. Oktober – im
Test als `tests/fixtures/entwurf-2026-10-14.json` – wird aus genau den zwei
gemeldeten Gründen zurückgewiesen und besteht, sobald sie behoben sind.

## Was das Netz nicht kann

Es vergleicht Wörter, nicht Inhalte. „Edelmetalle uneinheitlich" kommt nach
„Gold und Silber geben nach" durch. Die Regel ist die Anweisung; das Netz
fängt den bequemen Fall. Wer es für die Regel hält, liest daraus, dass alles
Erlaubte auch gewollt ist.
