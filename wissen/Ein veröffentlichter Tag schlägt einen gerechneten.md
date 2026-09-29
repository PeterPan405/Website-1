---
titel: Ein veröffentlichter Tag schlägt einen gerechneten
datum: 2026-09-07
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Ein veröffentlichter Tag schlägt einen gerechneten – 7. September 2026

Der Betreiber sah auf der Kalenderseite, Oracle melde am 8. September. Oracle
meldete am 10. Sein Satz dazu: „Die Quartalszahlen sind absolut nicht korrekt."

## Was die Messung ergab

Erst nachgesehen, dann geurteilt. Der Nasdaq-Kalender führt für die nächsten
acht Wochen **186** unserer Titel. Gegen unsere Hochrechnung:

| Befund                        | Zahl |
| ----------------------------- | ---- |
| taggenau gleich               | 122  |
| abweichend                    | 58   |
| davon um mehr als zwei Wochen | 25   |
| bei uns ohne jeden Termin     | 6    |

Die groben Fälle sind die eigentliche Nachricht: **Tesla stand 155 Tage
daneben**, Regeneron 183, IBM 98, Honeywell 98, Goldman Sachs 93. Nicht um
Tage verrutscht – um ein ganzes Quartal. Die Seite sagte „nächste Zahlen im
Januar", während sie im Oktober kamen.

Zwei Dinge aus der Beschwerde stimmten dabei nicht, und das gehört
dazugeschrieben: Adobe **stand** im Kalender, am 10. September, und der
Nasdaq-Kalender bestätigt genau diesen Tag. Und Oracles 8. September war nie
eine Ankündigung, sondern eine Hochrechnung, als solche gekennzeichnet. Der
Befund des Betreibers war trotzdem richtig – nur größer, als er dachte.

## Warum die Hochrechnung so danebenliegt

Sie kann nicht anders. Sie nimmt den Vorjahrestag und legt ein Jahr drauf. Wo
ein Unternehmen sein Meldemuster verschiebt – anderer Wochentag, anderes
Quartalsende, ein ausgefallener Termin –, wandert die Schätzung mit dem alten
Muster weiter und trifft das nächste Quartal.

**Der eigentliche Fehler lag davor:** Die Quelle für _angekündigte_ Termine
ist der Sammelkalender von Alpha Vantage, und `ALPHAVANTAGE_API_KEY` ist nie
hinterlegt worden. Im Bestand vom 29. August stand dazu
`kalender: {kuerzelMitTermin: 0, beigetragen: 0}` – die Zahl war da, seit
Wochen, und niemand hat sie gelesen. Jeder einzelne US-Termin dieser Website
war eine Hochrechnung, und der Lauf blieb dabei grün.

## Die Nasdaq, und warum ausgerechnet die

Weil sie den Terminplan ohne Schlüssel und ohne Anmeldung herausgibt –
dieselbe Eigenschaft, die die Tokioter Börse zur besten Quelle für Japan
macht. Der Endpunkt hinter der Kalenderseite antwortet auf einen Tag mit den
Meldungen dieses Tages.

Gemessene Grenzen, keine geschätzten: **acht Wochen Reichweite** (am 7. September Zeilen bis zum 30. Oktober, danach nichts), **ein Tag je
Abruf**, keine Dokumentation. Deshalb läuft sie **nach** dem SEC-Durchgang:
Die SEC liefert die Historie und daraus vier Quartale, die Nasdaq nur das
nächste. Umgekehrt verlöre die Seite drei Quartale – und der Betreiber hat
ausdrücklich vier verlangt.

## Der dritte Zustand, und warum es ihn geben muss

Bisher gab es zwei: angekündigt (das Unternehmen hat den Tag genannt) und
hochgerechnet (`geschaetzt`, mit Vorjahrestag als Beleg). Der Nasdaq-Plan ist
keines von beiden.

Ihn als **angekündigt** auszugeben wäre die teure Richtung: Nach einem
angekündigten Termin darf jemand eine Order legen, und die Quelle sagt nicht,
ob das Unternehmen den Tag bestätigt hat. Ihn als **hochgerechnet**
auszugeben wäre schlicht falsch – und `geschaetzt.basis` trüge statt eines
Vorjahrestags ein Quartalsende wie `Aug/2026`, das die ICS-Ausgabe als „im
Vorjahr am Aug/2026" ausgibt.

Also drei. Das einzige belastbare Signal für „angekündigt" ist die
**Sitzungslage**: Steht in der Zeile `time-after-hours` oder
`time-pre-market`, weiß die Nasdaq, wann am Tag gemeldet wird – und das weiß
man nur von einem Unternehmen, das seinen Termin herausgegeben hat. 30 von 186. Nur diese tragen „angekündigt".

## Was der Tausch gekostet hat, und warum er richtig ist

Der Anteil der Termine mit Minutenangabe fiel von 92 auf 69 Prozent: Die 156
ersetzten Hochrechnungen trugen eine Minute aus dem SEC-Zeitstempel, der
Terminplan nennt nur die Lage. Der Wächter schlug an, und die Versuchung war,
die Grenze zu senken.

**Ein richtiger Tag ohne Minute ist mehr wert als ein falscher Tag mit
Minute.** Oracle stand auf dem 8. September mit „22:13 Uhr" – die Minute war
präzise und der Tag zwei Tage daneben. Die Grenze bleibt bei 80 Prozent;
gezählt wird nur dort, wo eine Minute überhaupt herkommen kann. Dieselbe
Trennung wie bei Tokio, und aus demselben Satz: _Ein Mittelwert kann nichts
finden, was er verdünnt._

## Und ein Test, der an seinem eigenen Datum gealtert ist

`STICHTAG = '2026-08-20'` stand fest im Test, damit „bald" nicht an der
Systemuhr hängt. Der Bestand wanderte weiter, der Stichtag nicht – nach dem
Abruf im September lag kein Termin mehr in den vierzehn Tagen danach, und die
Prüfung „einige Titel melden bald" stand auf `0 von 394`, ohne dass an der
Sache etwas kaputt war.

Der Stichtag kommt jetzt aus dem Bestand: der früheste Termin darin. Bei
gleichen Daten immer derselbe, und an ihm ist per Konstruktion mindestens ein
Titel „bald".

## Die Lehre

**Eine Quelle, die nie etwas beigetragen hat, sagt das in ihren eigenen
Zahlen – wenn jemand sie liest.** `beigetragen: 0` stand seit Wochen im
Bestand. Der Lauf war grün, die Seite sah vollständig aus, und die Termine
waren durchweg geraten. Wer eine Herkunftsangabe in die Daten schreibt,
schuldet ihr einen Blick.

Und: **Ein Datum in einem Test ist eine Zusage über die Zukunft.** Wer eines
hinschreibt, schreibt einen Ablauftermin dazu, den niemand notiert hat.

Nachtrag vom selben Tag: Der Stichtag im Test war zu diesem Zeitpunkt bereits
behoben – am 4. September, und dort steht auch, was er angerichtet hat. Zwei
Sitzungen haben denselben Fehler unabhängig gefunden; beim Zusammenführen hat
die frühere, gründlichere Fassung gewonnen.
