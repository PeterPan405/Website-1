# Der Hausstil der Instagram-Beiträge

Stand 30.10.2026. Alle Zahlenkarten und Erklärbeiträge folgen diesem Muster.
Die Website hat ihre eigene Gestaltung (`GESTALTUNG.md`).

**Warum es diese Datei gibt.** Am 30.10.2026 gingen vier Fassungen derselben
Karte durch. Der Betreiber sagte zu jeder:

| Fassung                 | Urteil                                        |
| ----------------------- | --------------------------------------------- |
| Zwei Balken             | „voll langweilig“                             |
| Zwölf Monatskacheln     | „sieht sehr billig nach Vibecoding aus“       |
| Schwarz mit Leuchtlinie | „in schwarz sieht es sehr billig aus“         |
| Weiß mit Leuchtlinie    | „KI-Slop … nicht ein wirklich eigenes Design“ |

Seine Forderung: „eigene Design-Vorgaben, … dass wir ein Muster haben und uns
daran orientieren können, … einen eigenen Style, der nicht nach Slop aussieht“.

Die erste Karte in diesem Stil ist die Kurvenkarte vom 31.10.2026
(`art: 'kurven'`, `kurvenBild()` in `lib/instagram-zahlenkarte.ts`). Die Werte
stehen dort in `STIL`. **Wer hier etwas ändert, zieht `STIL` nach.**

## Woran man uns erkennt

1. **Weiß.** Weißer Grund, keine dunklen Flächen, kein Verlauf. Dazu der
   Betreiber: „Designs in weiß, da das cleaner aussieht“.
2. **Logo oben mittig.** Signet 44 px und Wortmarke „IM Invests“ in
   Montserrat 700, 26 px, bei y = 48. Auf **jeder** Karte, nie links. Dazu der
   Betreiber: „Überall … oben in die Mitte“.
3. **Die Vierfarbleiste.** Über jedem Datenfeld liegt ein Band von 8 px in den
   vier Logofarben, in ihrer Reihenfolge im Signet: Navy `#17296F`, Grau
   `#6E6E6E`, Grün `#205437`, Rot `#8B2225`. Das ist unser Wiedererkennungs-
   zeichen; keine andere Marke trägt es.
4. **Titel in zwei Zeilen, zwei Farben.** Montserrat 800, 64 px. Die erste
   Zeile ist schwarz (`#0b1220`) und nennt das Thema, die zweite ist Navy
   (`#17296F`) und bringt die Pointe. Jedes Stück steht auf einer eigenen
   Zeile; ein Umbruch mitten im Satz ist ein Fehler.

## Aufbau einer Karte (1080 × 1350)

| Bereich    | Lage                            | Inhalt                                                               |
| ---------- | ------------------------------- | -------------------------------------------------------------------- |
| Kopf       | y 48                            | Logo mittig                                                          |
| Titel      | ab y 132                        | zwei Zeilen, höchstens 22 Zeichen je Zeile                           |
| Unterzeile | ab y 300                        | Montserrat 400, 28 px, Grau `#5b6472`, höchstens zwei Zeilen         |
| Datenfeld  | ab y 432 bis 44 px vor dem Rand | `#f5f7fa`, Rand 1,5 px `#e3e7ee`, Radius 26, oben die Vierfarbleiste |

Im Datenfeld, von oben nach unten:

- **Stichzeile:** gesperrte Großbuchstaben, Montserrat 700, 17 px, Abstand 3,
  in Navy: „DAX · 100 € AB JANUAR 1990“. Sie sagt, **was** gemessen wird.
- **Heldenzahl:** Montserrat 800, 96 px, Laufweite −3. Höchstens zwei
  nebeneinander, getrennt durch einen feinen senkrechten Strich. Über jeder
  steht ihr Name in gesperrten Großbuchstaben, Grau.
- **Die Grafik:** feine Linien (3,5 px) ohne Leuchten und ohne Fläche.
  Waagerechte Hilfslinien durchgezogen in `#e3e7ee`, die Nulllinie etwas
  dunkler. Die Achsenbeschriftung steht **rechts**, 17 px, Hellgrau. Ein
  hohler Punkt markiert jedes Linienende. Immer mit x- und y-Achse.
- **Kennzahlen als Pillen:** weiß, Rand `#e3e7ee`, ganz rund. Links der Name
  (Grau, 22 px), rechts der Wert (800, 26 px).
- **Quelle:** im Feld unten, 16 px, Hellgrau `#8a93a0`, mit Stand.

## Farben – wofür welche

| Farbe    | Wert      | Nur für                           |
| -------- | --------- | --------------------------------- |
| Tinte    | `#0b1220` | Titel, neutrale Werte             |
| Navy     | `#17296F` | Pointe im Titel, Stichzeile       |
| Grün     | `#205437` | steigt, Gewinn                    |
| Rot      | `#8B2225` | fällt, Verlust                    |
| Grau     | `#5b6472` | Fließtext, Namen                  |
| Hellgrau | `#8a93a0` | Achsen, Quelle, Namen über Zahlen |

Grün und Rot tragen **nur** eine Richtung, nie Schmuck. Eine Zahl ohne
Richtung ist Tinte.

## Was wir nicht machen

Jeder Punkt ist einmal danebengegangen oder sieht nach Baukasten aus:

- **Kein Leuchten, kein Glühen, keine Neonfarben, kein schwarzer Grund.**
  Das war die Phantom-Fassung.
- **Keine Kachelwände.** Zwölf gleich große Kästchen sind eine Tabelle, keine
  Aussage. Das war die Kalenderfassung.
- **Keine Emojis, Kürbisse oder Clipart im Bild.** Zu einem Anlass passt das
  Thema, nicht die Deko. Emojis gehören höchstens in die Beschreibung.
- **Keine Rangnummern bei einer Auswahl**, kein „Rekordhoch“, das die Quelle
  nicht sagt (`AGENTS.md`).
- **Nicht mehr als eine Heldenzahl je Seite**, zwei nur im direkten
  Vergleich.
- **Keine fremde Marke im Stil.** Vorbilder (HKCM, Phantom, Trade Republic)
  zeigen das Niveau. Übernommen wird nichts, woran man sie erkennt.

## Schrift

Montserrat 400, 700 und 800 liegen in `lib/instagram/schriften/` (SIL OFL,
Lizenz daneben). Anton und Open Sans tragen die älteren Kartenarten, bis sie
umgestellt sind.

## Offen

Die älteren Kartenarten tragen noch die Anton-Vorlage:

- `vergleich`
- `rangliste`
- `verlauf`
- `duell`
- `steckbrief`
- `geschichte`
- `pyramide`
- `torte`

Ihr Logo steht schon oben mittig. Sie werden nach und nach auf diesen Stil
umgestellt, jede mit einem Probebild für den Betreiber.
