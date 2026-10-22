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

Der Maßstab für die Bildsprache, ebenfalls vom Betreiber an diesem Tag:
„Orientiere dich an anderen Nachrichtenagenturen, zum Beispiel Trade
Republic … auch von der HKCM. Das ist ästhetisch seriös und sieht gut aus."
Heißt: Bei einem Unternehmen die Marke – Logo, Schild, Schriftzug –, bei
einem Land ein erkennbarer Ort oder die Lage selbst (Soldaten auf Streife,
nicht eine Gedenkflamme), bei Geld ein sauberes Sachfoto. Kein
Ferienwohnzimmer, keine Fassade, die nur zufällig zur Branche gehört. Die
Morgensuche fragt deshalb bei Firmen zuerst nach „logo" und „sign".

Und: „Bevor du es jetzt wieder hochlädst, erst mal hier die Designs
reinschicken." Dafür gibt es `data/instagram/halt.txt` – steht der Tag dort,
geht die Tagesnews erst nach dem OK hinaus.

## Nachtrag: Der erste Treffer ist nicht das Bild – 22. Oktober 2026

Am Morgen danach, automatisch: Wasserbüffel am Mekong für „UK-Inflation auf
3,5 %" und ein graues Laborgerät für „EQT übernimmt Qiagen". Der Betreiber:
„Schau dir die Bilder an und versuch zu verstehen, was ich daran schrecklich
fand." Drei Fehler, alle im Code:

1. **Ein Stichwort reichte.** „piggy bank" fand „river bank" – genommen
   wird jetzt nur, wenn **jedes** Wort als ganzes Wort im Titel steht.
2. **„UK" war kein Land.** Und hätte es eins gegeben, wäre „United Kingdom
   piggy bank" gesucht worden. Jetzt steht bei allgemeinen Motiven (Geld,
   Börse, Konsum, Tresor) das Wahrzeichen des Landes vorn: Bank of England,
   Westminster, Tokyo Tower (`WAHRZEICHEN`).
3. **Der bloße Firmenname** fand ein Produkt statt der Marke. Jetzt nur noch
   Logo, Schild, Sitz, Gebäude (`MARKENBILD`) – sonst kein Firmenbild.

Und das Grundsätzliche: Ästhetik prüft der Lauf nicht. Alles, was keine
Marke ist, kommt deshalb nur noch aus den ausgezeichneten Fotos von Commons
(Quality images). Findet sich dort nichts, nimmt die Kachel ein eigenes
Motiv – die hochwertigen, die nie beanstandet wurden –, aber keins vom
Vortag. **Ein Lauf, der nicht sehen kann, darf nur aus dem wählen, was
jemand schon angesehen hat.**

## Nachtrag: Der Mensch, nicht die Fassade – und nur, was die Masse packt – 22. Oktober 2026

Zum Ersatz, der Bank of England als Gebäude, der Betreiber: „das kennt man
nicht mal. Dort gibt es … einen Head of the Zentralbank, der bestimmt mal
gesprochen hat mit Fahnen im Hintergrund." Und zu „EQT übernimmt Qiagen":
„kennt kein Schwein … auf Insta sollen die Beiträge wirklich interessant
sein, spannend sein und die Masse abholen." Auf der Website darf so eine
Meldung stehen, auf Instagram nicht.

- **Die Auswahl:** `ANWEISUNG_INSTAGRAM` (beide Fassungen) verlangt, was
  die breite Masse packt – Zins, Inflation, Öl, Gold, DAX, Bitcoin,
  Weltkonzerne. Fehlt in der Ausgabe eine fünfte solche Meldung, kommt sie
  aus den Quellen, nicht aus der Nische.
- **Das Bild:** Geht es um Inflation oder Zins, sucht der Lauf zuerst den
  Notenbankchef – Pressekonferenz, Rede, dann jedes Foto (`NOTENBANKCHEFS`).
  Gesucht wird über die **Commons-Kategorie**, nie über den Namen: „Andrew
  Bailey" fand als ersten Treffer einen Baseballspieler der Red Sox.
  Bei einem Amtsträger gelten „conference" und „meeting" nicht als
  Ausschluss, der Hinweis auf Persönlichkeitsrechte auch nicht – er betrifft
  Werbung, nicht die Nachricht über ein Amt.

Geprüft und gefunden, 22.10.2026, über einen Läufer: Von Andrew Bailey gibt
es auf Commons genau ein freies Querformat (mit Janet Yellen, IWF 2021);
die Fotos der Bank of England selbst sind nicht frei. Von Kevin Warsh gibt
es gemeinfreie Fotos der Pressekonferenz, von Lagarde und Ueda viele.
**Ein Bild, das die Person zeigt, schlägt eins, das ihr Haus zeigt – wenn
es die Person ist.**
