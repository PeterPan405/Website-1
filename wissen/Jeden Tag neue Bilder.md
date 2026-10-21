---
titel: Jeden Tag neue Bilder
datum: 2026-10-21
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Jeden Tag neue Bilder – 21. Oktober 2026

Am Morgen nach „es findet sich immer etwas" nahm der Betreiber den Beitrag
wieder heraus: „Er hatte die gleichen Bilder drin wie … News vor ein paar
Tagen. Es soll immer neue Bilder geben. Es gibt ja genug Bilder auf der
Welt." Frankreich, Hafen und Euro-Geld standen schon am 20.10. in den
Kacheln. Mit 21 festen Motiven war das vorgezeichnet: Ein Thema, das
wiederkehrt, bekommt dasselbe Foto.

Seitdem sucht `instagram-bilder.yml` jeden Morgen für jede Kachel ein Foto
auf Wikimedia Commons (`scripts/instagram-bilder.ts`): nach festen
englischen Begriffen je Motiv, mit dem Land der Überschrift davor und dem
Firmennamen zuerst. Genommen wird nur, was gemeinfrei oder CC0 ist, quer,
mindestens 1200 Pixel breit, ohne Einschränkung – und was nicht im Register
`data/instagram/bilder.json` steht. **Ein Bild, das einmal auf einer Kachel
stand, kommt nie wieder.**

Der Lauf hängt zwischen Paketbau und Beitrag: `paket-bauen.yml` stößt ihn
an, solange der Tag im Register fehlt, und er stößt den Bau wieder an. Der
Tag wird auch eingetragen, wenn nichts gefunden wurde – sonst drehte die
Kette sich im Kreis. Wo nichts gefunden wurde, bleibt das feste Motiv, aber
keins vom Vortag (`motiveVomVortag()`).

Was nicht gelöst ist: Ein Treffer kann zum Suchbegriff passen und trotzdem
zur Meldung nicht. Die Begriffe sind deshalb gegenständlich („container
ship", nicht „trade"), und ein Firmenname zählt nur, wenn er im Dateititel
steht.

## Nachtrag: Gemeinfrei reicht nicht – 21. Oktober 2026

Derselbe Tag, dreimal gelöscht. Der Morgenlauf fand Stadtplan, Diagramm und
Eisvogel; die Wahl von Hand dann eine Gedenkflamme für „Soldaten-Einsatz",
eine Sparkassen-Fassade für „Haushaltsvermögen", ein Ferienwohnzimmer für
Netflix und ein Rechenzentrum in einer Windparklandschaft für Google. Der
Betreiber: „Hast du denn überhaupt kein Feingefühl für Ästhetik?"

Der Grund war die Lizenz. Gemeinfreie und CC0-Fotos zu Unternehmen und
aktueller Politik gibt es kaum; was es gibt, sind Behördenfotos und alte
Archivaufnahmen. Die Bilder der Tage davor sahen gut aus, weil sie aus den
eigenen Titelbildern stammten. Seitdem sind auch **CC BY und CC BY-SA**
erlaubt (Betreiber: „CC BY/BY-SA erlauben"), mit Urheber und Lizenz im
Beitragstext (`bildnachweis()`). NC und ND bleiben draußen: Der Kanal wirbt,
und der Zuschnitt ist eine Bearbeitung.

**Eine Regel, die nur die erlaubte Menge verkleinert, macht die Auswahl
nicht besser – nur ärmer.**
