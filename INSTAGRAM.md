# Was bei @im_invests hinausgeht

Diese Datei beschreibt **nicht, was schön wäre**, sondern was im Kanal schon
steht. Sie ist am 11. Oktober 2026 aus allen 130 veröffentlichten Beiträgen
abgeleitet worden – Beschriftungen und 872 Kacheln, abgezogen über die
Graph-Schnittstelle –, auf Anordnung des Betreibers: _„Schau dir die Beiträge
an, die wir schon haben, und nutze die als Vorgabe … keine neuen Experimente."_

Wer einen Beitrag baut, baut ihn so. Wer davon abweichen will, ändert zuerst
diese Datei – mit dem Grund daneben.

> **Die Namen:** „Daily News" ist das Karussell „Top-News des Tages", gebaut aus den News auf iminvests.de, und geht von selbst hinaus. „Tagesbeitrag" ist der zweite Beitrag des Tages mit eigenem Thema, abgestimmt und vom Betreiber freigegeben (Klarstellung des Betreibers, 11.10.2026).
>
> [!warning] Was von selbst hinausgeht – und was nicht
> **„Top-News des Tages" geht täglich vollautomatisch hinaus**, nach der
> nächtlichen Ausgabe – Anordnung vom 11.10.2026, abends; seit dem 17.10.2026
> auch samstags und sonntags („mache aber jetzt täglich News des Tages"). Aber nur in genau
> der Form unten; ein Plan, der sie verfehlt, ergibt „kein Beitrag".
>
> **Alles andere** – Erklärbeitrag, Zahlenkarte – braucht die Freigabe für
> genau seinen Tag:
>
>     gh variable set INSTAGRAM_FREIGABE --body JJJJ-MM-TT
>
> Begründung in `ENTSCHEIDUNGEN.md` unter „Der vierte Riegel ist ein Datum,
> kein Schalter".

## Der Rhythmus

Gezählt über 77 Tage, 27.07. bis 11.10.2026:

| Was                      | Wann                                                       | Wie oft                                  |
| ------------------------ | ---------------------------------------------------------- | ---------------------------------------- |
| „Top-News des Tages"     | morgens, meist zwischen 06:45 und 07:45 Uhr (Median 07:02) | **nur montags bis freitags** – 54 von 54 |
| Erklär- oder Zahlbeitrag | nachmittags oder abends                                    | **jeden Tag**, auch am Wochenende        |

Bis dahin gab es an Samstagen und Sonntagen nie Daily News. **Seit dem
17.10.2026 erscheinen sie täglich** – Anordnung des Betreibers. Ein Wochenende
ohne „Top-News" ist seither ein Ausfall.

## Vier Sorten

### A — „Top-News des Tages"

**Immer genau sechs Kacheln** – ein Deckblatt und fünf Meldungen. 54 von 54.

**Deckblatt:** ein Foto, darüber in Anton zweizeilig „Top-News / des Tages",
links oben. Schrift weiß oder schwarz, je nachdem, was auf dem Foto lesbar ist.
Bis zum 17. August stand darunter noch „Die wichtigsten Entwicklungen für deine
Finanzen." – seither nicht mehr.

**Meldungskacheln:** weißer Grund, blasses IMI-Wasserzeichen in der Mitte,
oben **rechtsbündig** eine kurze Überschrift in Anton („KI-Werte unter
Druck", „Öl +10 %", „EZB"), ein- oder zweizeilig, unten links bündig zwei bis
drei Sätze, drei bis fünf Zeilen. Gemessen (1080 × 1350): Überschrift 108 px,
rechter Rand 42 px; Text 46 px, Zeilenabstand 1,4, letzte Zeile bei y ≈ 1315.

**Seit dem 16.10.2026 mit Foto und Kursverlauf.** Der Betreiber: „Insta-Beitrag
ab heute mit etwas mehr Bildern, also spannender gestalten". Zwischen
Überschrift und Text (y 365–960) steht jetzt ein Foto zum Thema, und nennt die
Überschrift einen Kurs (Brent, Dax, Gold, ein Unternehmen beim Namen), darunter
dessen Verlauf der letzten 30 Tage mit Wert und Veränderung. Die Fotos sind aus
den eigenen Deckblättern geschnitten (`lib/instagram/motive/`, 16 Motive), die
Kurse kommen aus dem Bestand der Website. Zugeordnet wird über den Inhalt der
Kachel, kein Motiv zweimal im Beitrag; ohne passendes Bild bleibt die Kachel
wie vorher. Regeln und Gründe in `lib/instagram-motive.ts`.

**Keine Skylines, Deckblatt zum Thema** (18.10.2026). Der Betreiber: „Die
Bilder müssen immer auch zum Thema passen. Ansonsten einfach kein Bild
nehmen, bevor du eine Skyline nimmst." Frankfurt, Banken, Finanzviertel,
Deutschland, Europa und New York sind keine Motive mehr. Das Deckblatt nimmt das Titelbild zum Thema der
wichtigsten Meldung (Fed, EZB, Luftfahrt, Bahn, Industrie, Wohnen), sonst
reihum.

**Jede Kachel bekommt ein Bild** (20.10.2026). Der Betreiber: „bitte auf
jede Seite ein Bild" – „neue Regel: es findet sich immer etwas". Findet eine
Kachel kein Motiv zu ihrem Thema, nimmt sie das erste freie aus `RUECKFALL`
(Börsenparkett, Euro-Geld, Tresor, Einkaufswagen). Neu dazu: Frankreich
(Palais Bourbon), Bank of England, Gericht, Smartphone.

**Jeden Tag neue Bilder** (21.10.2026). Der Betreiber: „Es soll immer neue
Bilder geben." `instagram-bilder.yml` sucht jeden Morgen für jede Kachel ein
Foto auf Wikimedia Commons, das noch nie verwendet wurde (Register
`data/instagram/bilder.json`); die festen Motive sind nur noch Rückfall,
und keins vom Vortag.

**Bildsprache wie Trade Republic und HKCM** (21.10.2026): seriös und klar –
bei Unternehmen Logo, Schild oder Schriftzug, bei Ländern ein erkennbarer
Ort oder die Lage selbst, bei Geld ein sauberes Sachfoto. Kein Behelfsbild.
Im Zweifel erst zeigen: Ein Tag in `data/instagram/halt.txt` hält die
Tagesnews bis zum OK des Betreibers an.

**CC BY und CC BY-SA mit Nennung** (21.10.2026): Unter dem Beitrag steht je Foto Urheber und Lizenz (`bildnachweis()`). NC und ND nie. Zuvor galt: **Bilder von außen nur gemeinfrei oder CC0** (18.10.2026): Trump, Kapitol und Weißes
Haus sind Werke der US-Regierung (Wikimedia Commons, `herkunft` am Motiv),
geholt mit `bilder-holen.yml`. Bilder unter CC-BY-SA verlangen eine Nennung
im Beitrag – die gibt es nicht, also werden sie nicht genommen.

**Wochenende** (18.10.2026): Samstag bildet den Freitag ab, Sonntag und
Montag das Wochenende – an diesen beiden Tagen drei bis fünf Kacheln
(`kachelnErlaubt()`), kein Thema aus dem Beitrag des Vortags ohne neues
Ereignis, gern politische Ereignisse und anstehende Termine der Woche.

**Eine Grafik sagt dasselbe wie die Kachel – oder es gibt keine** (seit dem
17.10.2026, `lib/instagram-kurs.ts`). Sie endet mit dem letzten Handelstag vor
der Ausgabe (der laufende Kurs schließt die Tagesreihe ab), die Prozentzahl
ist die **zum Vortag**, und jeder Preis in der Kachel muss auf 3 % zum
gezeigten Wert passen, jedes „steigt"/„fällt" zur Richtung des Tages. Sonst
entfällt die Grafik, das Foto bleibt. Jede Grafik hat eine **Y-Achse mit
runden Kurswerten und eine X-Achse mit vier Tagen** – „sonst kann man damit
nichts anfangen".

Kriege und Politik kamen nur über ihre Marktfolge vor („Öl über 100", „USA &
Iran", „UN-Protest"). In den Beschriftungen aller 54 Daily News steht kein
Wort wie „Tote" oder „Opfer", auf den durchgesehenen Kacheln ebenso wenig.

### B — Erklärbeitrag

Sechs bis neun Kacheln (einmal elf). Zwei Arten von Deckblatt, beide auf Foto:

- eine **Frage**: „Was ist ein Spin-off?", „Wann ist eine Aktie günstig?",
  „Warum laufen gleiche ETFs unterschiedlich?"
- eine **Aussage, manchmal mit Unterzeile**: „Importregulierung" / „Die
  aktuelle Lage im europäischen Automarkt.", „Klage gegen Netflix" / „Darf
  dein Abo teurer werden?"

Auch eine Nachricht darf so verpackt werden, wenn sie erklärt wird: „LVMH
verliert 167 Milliarden", „Warren Buffet tritt ab".

**Innen** seit Ende August wie bei A: weiß, Wasserzeichen, Überschrift
rechtsbündig, Text unten links. Im August lagen die Innenkacheln noch auf
einem blassen Foto. Die letzte Kachel ist die Folgerung („Das Ziel", „Die
Folgen", „Fazit"), **keine Aufforderung zu folgen.** Gelegentlich steht eine
Übersicht als Grafik dazwischen („Unsere Steuern").

### C — Zahlenkarte

**Vorbild HKCM – aktuell, eine Zahl, ein Kontrast** (Betreiber, 19.10.2026:
„Die Themen dürfen auch gern immer aktuell bezogen sein … Es müssen nicht
immer so trockene Fakten sein … ein bisschen durchmischt."). Aus vier
Beiträgen von @hkc_management abgelesen:

- **Ein aktueller Anlass** – die Woche an der Börse („Konsumaktien schlagen
  Tech um 12,7 Prozentpunkte"), eine Unternehmenszahl (Berkshires
  Cashquote), eine neue Statistik (Chinas Erwerbstätige) – oder ein
  historischer Vergleich, der zur Lage passt (Nasdaq 2000–2002: fünf
  Rallyes, am Ende −78 %).
- **Überschrift mit der Zahl und einem Kontrast oder einer Frage**, zwei
  Zeilen, ein Teil in der Akzentfarbe. Darunter **ein Satz Einordnung**,
  der sagt, was die Zahl bedeutet – nur, was die Quelle hergibt.
- **Die Grafik hebt hervor**: den einen Wert (Etikett am Linienende, der
  markierte Balken, die große Differenz in einem eigenen Kasten); Rest
  zurückhaltend.
- **Quelle mit Datum und Zeitraum** in der Fußzeile, wie bei uns.
- **Durchmischt:** etwa jeder zweite Tagesbeitrag mit aktuellem Anlass,
  dazwischen Länder- und Langfristzahlen.

**Form und Farbe wechseln täglich.** Die Akzentfarbe läuft durch die vier
Logofarben (Grün, Navy, Rot, Anthrazit – `akzentfarbe()`), die Form darf nie
zwei Tage hintereinander dieselbe sein (`form()`: Vergleich, Häuschen,
Balken, Kacheln; der Test prüft es). Betreiber, 17. und 18.10.2026: „Das
soll sich durchrotieren, genauso wie die Farben. Sonst wirkt das
langweilig."

**Immer eine Seite.** Am 16.10.2026 ging der Tagesbeitrag kurz als Karussell
aus Titelbild mit Foto und Karte; der Betreiber zur Karte: „Ja, das passt",
zum Titelbild: „das andere nicht – wo es nur eine Seite ist, mit Chart, immer
nur eine Seite". Das Titelbild ist wieder entfernt. Fotos gibt es in den
Kacheln der Tagesnews, nicht hier.

Eine einzelne weiße Kachel, kein Karussell. Oben mittig das Signet (ohne
„IMI" in der Mitte) und die Wortmarke „IM Invests" in Open Sans, schwarz,
klein – nachgemessen am Beitrag vom 12.10.2026. Überschrift in Anton, alles
andere in Open Sans. Überschrift schwarz mit **dunkelgrün hervorgehobenen Wörtern**.
Darunter die Grafik: schwarzer Balken gegen dunkelgrünen, Werte darüber, die
Differenz dunkelrot dazwischen. Unten eine Fußzeile:

**Die Vorlage ist Schrift und Logo, nicht das Diagramm.** Der Betreiber am
15.10.2026 zum ersten Entwurf: „mache mehrere Länder in den Vergleich, es
muss auch nicht immer so ein Balkendiagramm sein, sei ein wenig kreativ – ich
meinte mit Vorlage Schrift und dass unser Logo oben drauf ist." Fest bleiben
Anton, das Logo oben und die Fußzeile; die Grafik wechselt. Der Generator
(`lib/instagram-zahlenkarte.ts`) kennt zwei Formen: `vergleich` (zwei Balken)
und `rangliste` (bis elf Zeilen, je zehn Häuschen – eins je zehn Prozent –,
eine Zeile hervorgehoben, ein Schnitt gestrichelt eingereiht). Eine neue Form
wird dort angelegt, nicht im Datensatz.

    Stand: 10.10.2026 | Quellen: Kursdaten, STOXX Europe 600, EZB

**Der Hausstil – `INSTAGRAM-STIL.md`** (seit 31.10.2026).

Am 30.10.2026 hat der Betreiber vier Fassungen derselben Karte verworfen:
Balken, Kacheln, Phantom-Schwarz und Weiß mit Leuchtlinie. Er verlangte
„eigene Design-Vorgaben … ein Muster“.

Die Vorgaben stehen jetzt in `INSTAGRAM-STIL.md`:

- weißer Grund, Logo oben mittig
- Titel in zwei Zeilen, schwarz und Navy
- alles frei auf Weiß, kein Kasten, keine Leiste
- Heldenzahl, feine Linien, Pillen

Die erste Karte im Hausstil ist die Kurvenkarte (`art: 'kurven'`). Die
älteren Arten werden umgestellt.

Die jüngste Sorte – die erste erschien am 11.10.2026. Der Betreiber will davon
künftig mehr.

**Seit dem 15.10.2026 täglich, und jede abgesprochen.** Der Betreiber: „Ich
möchte, dass die Themen der Beiträge mit mir bzw. mit unserer
Social-Media-Abteilung abgesprochen werden … Du machst mir immer ein paar
Vorschläge, ich sage dann, was ich haben möchte" – und: „die täglichen
Beiträge immer so um 16 Uhr mir schicken, dass wir das bis 17 Uhr online
bekommen".

1. **Vorschläge** – drei bis fünf Themen, jedes mit Zahl, Quelle und Stand.
   Wichtiges wird vorgezogen, der Rest rückt nach.
2. **Wahl** – durch den Betreiber oder die Social-Media-Abteilung.
3. **Karte eintragen** – `data/instagram-zahlenkarten.ts`; gesetzt von
   `lib/instagram-zahlenkarte.ts`, ausgeliefert unter
   `/instagram/zahlenkarte.jpg` und `/instagram/zahlenkarte.txt`.
4. **Entwurf gegen 14 Uhr in den Chat** – Bild und Beschriftung (Betreiber
   am 15.10.2026: „14:00 Uhr passt"). Eine Stunde reicht für Änderungen,
   Freigabe und Bau vor 15 Uhr.
5. **Freigabe**, sonst Änderung und neuer Entwurf. Nach dem „passt" wird
   `freigabe: '<heute>'` an die Karte geschrieben, gemergt, gebaut – und
   **nicht** von Hand veröffentlicht. Ein „passt" gilt **für heute**:
   Kommt es nach 15 Uhr, geht die Karte sofort hinaus, nicht am nächsten
   Tag (Betreiber, 24.10.2026: „nein heute" – „sofort"). Eine Karte mit
   späterem Datum verdrängt außerdem die heutige: `aktuelleZahlenkarte()`
   zeigt die jüngste im Bestand.
6. **Online ab 15 Uhr** (bis 18.10.2026: 16 Uhr; Betreiber am 19.10.: „mach
   15 Uhr, wenn es schon fertig ist, zukünftig") – der Dauerlauf
   (`kurse-dauerlauf.yml`) fragt ab 15:00 alle zehn Minuten und stößt `instagram-zahlenkarte.yml` an, sobald
   die Website die Karte von heute mit Freigabe von heute zeigt; zwei Crons
   (15:07 Sommer- und Winterzeit) sind Rückfall. Kommt die Freigabe später,
   geht die Karte beim nächsten Blick hinaus.

**„Passt" heißt freigegeben, nicht „jetzt hochladen".** Am 15.10.2026 ging
die erste Karte nach dem „passt" um 08:59 Uhr hinaus. Der Betreiber: „warum
hast du es schon hochgeladen" – „der Beitrag des Tages kommt immer erst um
16 Uhr". Seitdem hält der Veröffentlicher selbst vor der Uhrzeit an (seit 19.10. 15 Uhr), auch von
Hand gestartet (`lib/zahlenkarten-wecker.ts`).

Die Sperre gegen Doppelposts fragt nach **dieser** Karte (ihrem Aufhänger),
nicht nach „irgendein Beitrag heute" – um 16 Uhr stehen die Tagesnews schon
im Kanal. Umgekehrt hält der Tagesnews-Veröffentlicher an, sobald heute
irgendetwas im Kanal steht: Ein Rückfalllauf der Tagesnews **nach** 17 Uhr
schickt deshalb nichts mehr. Bewusst so gelassen – die Tagesnews gehen
nachts hinaus, ein Nachzügler am Abend wäre keine Tagesnachricht mehr.

### D — Zahlenstrahl (Karussell zum Wischen)

**Neu seit 07.11.2026, Anordnung des Betreibers.** Er schickte ein
Bildschirmvideo eines Karussells von @traderepublic_de („Unternehmenswerte im
Vergleich“, 11 Kacheln, gespeichert am 07.11.) und schrieb: „das könnten wir
auch … mit so einem Zeitstrahl oder mehrere Seiten Swipe … mehrere Slides 2
oder würden auch gehen. Dieser Zeitstrahl mit mehreren, das ist auch sehr
interessant und interaktiv cool gestaltet“ – und ausdrücklich: das gehört
**ins Regelwerk für den Content**. Damit gilt für den Tagesbeitrag nicht mehr
nur „immer eine Seite“ (16.10.): Die Zahlenkarte bleibt eine Seite, der
**Zahlenstrahl ist ein Karussell**.

**Was das Vorbild ausmacht** (abgelesen an 4 von 11 Kacheln – Titel, 4, 9
und 11; die übrigen liefen im 8-Sekunden-Video zu schnell durch):

- **Titelkachel:** oben links groß „Vergleich“, darunter eine Zeile
  „Deutsche Konzerne und Big Tech im Maßstab.“ – darunter nur die Achse mit
  drei leeren Punkten, die nach rechts aus dem Bild läuft. Kein Foto, kein
  Logo des Absenders auf der Kachel.
- **Eine waagrechte Achse läuft durch alle Kacheln.** Wer wischt, wandert
  auf ihr nach rechts – zu immer größeren Werten. Die Linie endet nie am
  Kachelrand, sie geht in die nächste über; der Punkt eines Werts kann auf
  der einen Kachel liegen und sein Etikett auf der nächsten anfangen.
- **Jeder Wert ist ein Punkt auf der Linie mit einem Bild daran** –
  Firmenlogo im weißen Rundkästchen, bei Personen ein Foto, bei Ländern ein
  Stadtbild –, **abwechselnd über und unter der Linie**, dazu die Zahl
  („880 Mrd. €“, „4,4 Bio. €“) und klein, was es ist („Vermögen von Elon
  Musk“, „BIP Niederlande 2025“).
- **Unten ein Satz, der den Vergleich zuspitzt** – mal links, mal rechts
  unten, je nachdem, wo Platz ist – ein Kontrast, den man nicht erwartet:
  „Adidas, VW, Siemens, SAP und Coca-Cola kommen zusammen auf rund 873 Mrd.
  €. Walmart allein ist mehr wert.“ – „NVIDIA liegt 130 Mrd. € vor Apple …
  VW passt 125-mal in NVIDIA.“ Oder eine Einordnung mit Rang: „Microsoft,
  bekannt für Windows und Office, ist mit 3,4 Bio. € das drittwertvollste
  Unternehmen der Welt.“ (Kachel 9).
- **Fremde Größen dazwischen** machen die Zahlen greifbar: ein
  Privatvermögen, das BIP eines Landes. Ohne sie wären es nur Firmen.
- Weißer Grund, viel Luft, Zähler oben rechts („4/11“), Wiederholung der
  Reihenfolge klein → groß.

**Bei uns** gilt der Hausstil (`INSTAGRAM-STIL.md`): weißer Grund, Logo oben
mittig auf der ersten Kachel, Überschrift in Anton (schwarz und Navy), alles
andere Open Sans, feine Linien. Dazu fest:

1. **5 bis 8 Kacheln**, erste Kachel = Titel („Die Billionen-Liga“) mit der
   Achse, die schon hereinläuft; letzte Kachel = der größte Wert und die
   Folgerung, keine Aufforderung zu folgen.
2. **Maßstab linear und durchgehend** – sonst lügt die Strecke. Liegen
   Werte zu dicht, rücken die Bilder auseinander (über/unter), nie der
   Punkt.
3. **Jede Zahl aus unserem Bestand oder einer genannten Quelle, mit Stand.**
   Börsenwerte: Kurs × Aktienzahl wie auf der Website
   (`getFundamentalkennzahlen()`), umgerechnet mit dem EZB-Kurs aus
   `kurse-aktuell.json`. Fußzeile auf jeder Kachel: „Stand: TT.MM.JJJJ |
   Quellen: …“. Ein Satz unten sagt nur, was die Zahlen hergeben.
4. **Kein Thema des Vorbilds nachbauen.** Eigene Vergleiche, eigene Sätze –
   wir übernehmen die Form, nicht den Inhalt.
5. **Freigabe wie jeder Tagesbeitrag** – Vorschlag, Entwurf aller Kacheln,
   erst nach „passt“ hinaus (siehe C, Schritte 1–6).

**Technisch umgesetzt** (07.11.2026, Cloud-Chat): Kartenart `zahlenstrahl`
in `lib/instagram-zahlenkarte.ts`. Felder: `punkte`
(`{ name, wert, anzeige, zusatz, logo, hervor }`), `saetze` (je Kachel ab 2),
`kacheln`, `bis`, `schritt` und `einheit`. Aus einer Panoramafläche von
`kacheln` × 1080 px werden die Kacheln geschnitten. Ein Etikett bleibt immer
ganz auf der Kachel seines Punkts. `zahlenkarteSeiten()` und
`zahlenkarteSeitePng()` liefern die Kacheln aus, über
`/instagram/zahlenkarte-2.jpg` … `-8.jpg`. `zahlenkarte.txt` meldet
„seiten N“, und der Veröffentlicher setzt daraus das Karussell. Logos liegen
in `lib/instagram/logos/` und kommen über `bilder-holen.yml` von Commons.
Gemeinfrei sind Facebook, Visa, Alibaba, SK Hynix, Saudi Aramco und SpaceX.

**Erster Entwurf, für den 08.11.2026** – „Die Billionen-Liga“, Börsenwerte
aus unserem Bestand (Kurse 06.11.2026 Schluss, Aktienzahl aus den
SEC-Meldungen, 1 € = 1,1165 US-$, EZB 06.11.):

    Broadcom     1,40 Bio. $  ≈ 1,26 Bio. €
    Tesla        1,42 Bio. $  ≈ 1,27 Bio. €
    Meta         1,55 Bio. $  ≈ 1,39 Bio. €
    Amazon       2,80 Bio. $  ≈ 2,51 Bio. €
    Alphabet     3,50 Bio. $  ≈ 3,14 Bio. €
    Microsoft    3,94 Bio. $  ≈ 3,53 Bio. €
    Nvidia       4,50 Bio. $  ≈ 4,03 Bio. €
    Apple        5,00 Bio. $  ≈ 4,48 Bio. €

Vor dem Entwurf **mit dem Kurs vom Tag neu rechnen**: Das Vorbild nannte drei
Tage zuvor Nvidia 4,4 und Apple 4,3 Bio. €, bei uns liegt Apple vorn – das
ist entweder Kursbewegung oder eine veraltete Aktienzahl; vor dem Posten
klären. Ein deutscher Bezugspunkt (BIP Deutschland 2025, Destatis) kommt nur
mit abgerufener Quelle hinein.

## Was der Betreiber beanstandet hat – und was es seitdem abfängt

Gesammelt, weil sich dieselben drei Fehler in immer neuer Gestalt
wiederholt haben: **das Bild passt nicht, ein Bild kommt doppelt, ein Thema
kommt doppelt.** Wer an der Bebilderung oder der Auswahl etwas ändert,
liest diese Liste vorher.

| Tag    | Beanstandet                                                                                 | Was es seitdem abfängt                                                    |
| ------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 18.10. | Skylines, Bilder ohne Bezug zum Thema                                                       | keine Skylines; Deckblatt zum Thema                                       |
| 20.10. | Kacheln ohne Bild                                                                           | jede Kachel ein Bild (`RUECKFALL`)                                        |
| 21.10. | dieselben Bilder wie Tage zuvor                                                             | täglich neue Bilder, Register `bilder.json`                               |
| 22.10. | Wasserbüffel für UK-Inflation, Laborgerät für Qiagen; EQT/Qiagen „kennt kein Schwein"       | Notenbankchef am Pult (`NOTENBANKCHEFS`); nur, was die Masse packt        |
| 24.10. | „räudige" Amex-Karte statt Tower; kein Bild für Munich Re                                   | Bild vom Betreiber; sonst Kursverlauf (`kurs` im Register)                |
| 26.10. | dreimal dasselbe Börsenfoto, Gebärdensprache für Alphabet, olympische Ringe zum zweiten Mal | kein Motiv doppelt im Beitrag; Kurs vor Markensuche; `ABGELEHNT`          |
| 26.10. | Frankreich an vielen Tagen; nicht nach Relevanz sortiert                                    | `themaWiederholt()` über drei Tage; Rangfolge nach Relevanz               |
| 26.10. | gelöschter Beitrag kam von selbst zurück                                                    | Gedächtnis `instagram-gepostet`; neu nur mit `nochmal`                    |
| 26.10. | Ifo-Kachel zeigte das Audi-Werk                                                             | `dateiname()`, `doppelteBilder()` – und **die Prüfung vor dem Hochladen** |
| 30.10. | harter Übergang Weiß/Foto auf dem Deckblatt                                                 | `VERLAUF_WEISS`, 100 px als S-Kurve                                       |
| 01.11. | Nationalversammlung hinter Glas, gespiegelt                                                 | Sichtprüfung: unscharf, Glas, Spiegelung = passt nicht                    |
| 01.11. | Quellenangabe fehlte (drei Logos ohne Nennung, keine Quellen der Meldungen)                 | `bildnachweis()` nennt jedes Bild, `quellenzeile()` die Quellen           |
| 03.11. | Deckblatt: leerer, dunkler Handelssaal – „nicht ästhetisch und nicht schön"                 | Sichtprüfung: Deckblatt muss hell und ein Blickfang sein; keine Säle      |
| 07.11. | Zahlenkarte: Gold als Balken und Kurve „langweilig … das weiß schon jeder"                  | Überraschendes vorschlagen, nicht Bekanntes                               |
| 07.11. | Zahlenkarte: Emoji unter den Säulen „sehen aus wie Kindersymbole"                           | echte Produktfotos (`symbol` der Säulenkarte), mit Nachweis               |
| 07.11. | Titel „Essen an der Börse" „klingt nicht gut"                                               | Sprache wie im Wirtschaftsteil: „Lebensmittel", nicht „Essen"             |
| 07.11. | Unterzeile „Oben: … Unten: …" – „macht keinen Sinn", zu lang                                | Unterzeile in Stichpunkten, keine Sätze, eine Zeile; keine Umgangssprache |

**Die Prüfung vor dem Hochladen** (seit 26.10.2026, `instagram-beitrag.yml`,
`lib/instagram-bildpruefung.ts`): Ein Modell sieht jede Kachel an (passt
das Bild zur Meldung?), ein Skript rechnet (dasselbe Bild zweimal, eine
Kachel ohne Bild, ein Bild der letzten 14 Tage). Beanstandet eine, geht
nichts hinaus. Die Liste ist der Prüfstein: Jeder Fall darin ist einer,
den sie beanstanden soll – ein neuer Fall gehört hinein.

## Die Beschriftung

### Bei „Top-News des Tages" – fest

So seit dem 8. Oktober, und so erzeugt sie `lib/instagram-plan.ts`
(`tests/instagram-tagesnews.test.ts` baut die des 9. Oktober zeichengenau nach):

    Die wichtigsten Börsennews des Tages. 📈

    <ein bis zwei Sätze, die die fünf Themen nennen>

    📌 <Überschrift der Kachel>
    <die Einordnung derselben Meldung aus der Tagesausgabe, ein bis zwei Sätze>
    … je Kachel ein Block

    Alle fünf Entwicklungen im Überblick. Quelle: iminvests.de

    Keine Anlageberatung – nur Wissensvermittlung
    Alle Inhalte dieses Accounts dienen … Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt. #a #b #c #d #e

**Die Blöcke mit 📌 seit dem 29.10.2026** (Betreiber: „ganz cool, wenn
generell … die Beschreibungen etwas länger wären, wenn da Themen noch etwas
erläutert werden"). Der Text ist das `whyItMatters` der Meldung, die
dieselbe Nachricht trägt – zugeordnet über gemeinsame Wörter
(`erlaeuterungen()`), nie erfunden. Ohne sichere Zuordnung kein Block;
passt nicht alles unter 2.200 Zeichen, ein Satz je Kachel, sonst keiner.

### Bei den anderen – eine Grammatik

1. **Der Aufhänger** – ein Satz oder eine Frage, die den Beitrag trägt, oft
   mit einem Zeichen am Ende (📈 📊 📉).
2. **Die Zahlen** in ein bis zwei kurzen Absätzen.
3. **Bei der Zahlenkarte immer zwei Abschnitte mehr** (29.10.2026, Gas-Schere:
   „eine kurze Erklärung, warum das so ist. Und was das für Auswirkungen …
   hat"): **„Warum …?"** und **„Und jetzt?"** bzw. die passende Frage
   („Und im Winter?") – beides nur aus gelesenen Quellen, mit „laut …",
   keine eigene Prognose. Sagt keine Quelle etwas zu den Folgen, steht
   das so da, statt einer Vermutung.
4. **`Quellen: …`** – namentlich, mit Komma getrennt. Keine erfundenen.
5. **Der Rechtshinweis**, unverändert, mit dem KI-Hinweis am Ende.

### Schlagworte

**Genau fünf**, kleingeschrieben, am letzten Satz des Rechtshinweises – 127
von 130 Beiträgen. Ein bis drei zum Thema, der Rest allgemein. Am häufigsten:
`#news` (79), `#investment` (45), `#finance` (42), `#finanzen` (30),
`#aktien` (23). Beim Autobeitrag `#china #eu #import #hybrid #autos`.

**Seit dem 15.10.2026: viral und themenbezogen.** Der Betreiber: „# müssen
viral sein und themenbezogen (maximal sind 5 möglich)". Zwei bis drei zum
Thema, so wie danach gesucht wird (`ölpreis`, `ezb`, `wohneigentum`), der
Rest aus großen deutschen Finanz-Hashtags (`börse`, `aktien`, `finanzen`,
`investieren`, `geldanlage`, `wirtschaft`). Füllwörter wie `#news`, `#top`,
`#daily` fallen weg – danach sucht niemand. Die Anweisung steht in
`lib/instagram-plan.ts` **und** `nachrichten-agent.yml`.

### Das Label „KI-Inhalte"

Steht an allen Beiträgen. Über die Schnittstelle setzt es `is_ai_generated`
am Beitrag – beim Karussell am Sammelbehälter, nicht an den einzelnen Kacheln
(Metas Referenz zu `/{ig-user-id}/media`, nachgelesen am 11.10.2026).

## Gestaltungsrichtlinien

Vom Betreiber, 16.10.2026, für alle IM-Invest-Beiträge:

1. **Kleine Texte einheitlich in Canva Sans** – Fließtext, Erklärungen,
   Ergänzungen. Canva Sans darf außerhalb von Canva nicht verwendet werden;
   was hier gesetzt wird (Tageskacheln, Zahlenkarte), nimmt **Open Sans**
   als Ersatz. Wer in Canva gestaltet, nimmt Canva Sans selbst.
2. **Überschriften bleiben in Anton.**
3. **Die Deckblattüberschrift überschneidet sich möglichst nicht mit
   auffälligen Bildelementen**, der Hintergrund lässt sie gut lesen. Die
   Überschrift ist in die Deckblätter eingebrannt; zehn von 28 sind deshalb
   aus der Reihe genommen (`NICHT_ALS_DECKBLATT` in `lib/instagram-bild.ts`,
   je mit Grund). `tests/instagram-tagesnews.test.ts` misst jedes Deckblatt
   in der Reihe hinter der Überschrift: Kontrast mindestens 110, keine
   unruhige Fläche. Ein neues Deckblatt muss diese Messung bestehen.

## Nach dem Beitrag

Anordnung des Betreibers vom 15.10.2026, für Tagesnews und Zahlenkarte:

| Wunsch                     | Wer                                                             |
| -------------------------- | --------------------------------------------------------------- |
| Kommentare erlaubt         | der Lauf – `comment_enabled=true` (`lib/instagram-nachgang.ts`) |
| Als KI-Inhalt markiert     | der Lauf – `is_ai_generated` am Beitrag                         |
| In die Story, anklickbar   | **der Betreiber in der App** – „Zu deiner Story hinzufügen"     |
| Likes und Teilen verbergen | **der Betreiber in der App**, je Beitrag                        |
| Sound                      | **der Betreiber in der App** – siehe „Musik"                    |

**Die Story kann die Schnittstelle nicht so, wie sie gemeint ist.** Gewollt
ist der geteilte Beitrag, „dass man das anklicken kann und dann zum Beitrag
geleitet wird". Meta stellt per Schnittstelle nur ein eigenes Bild als Story
ein, ohne Verweis; Sticker sind nicht unterstützt. Eine solche Story lief
einen Tag lang mit (#402) und ist wieder entfernt – sie wäre neben der
geteilten eine zweite gewesen.

Scheitert das Einschalten der Kommentare, warnt der Lauf; der Beitrag steht
dann schon.

## Musik

Gewünscht (15.10.2026): bei den Tagesnews **„Walker" von blackboxnorth**; bei
der Zahlenkarte ein Sound nach Wahl.

**Sound und das Verbergen der Likes macht der Betreiber selbst in der App**,
bei jedem Beitrag (15.10.2026: „ich mache es selbst, Likes und Sound"). Die
Automatik soll beides nicht nachbauen – kein Reel als Umweg.

**Über die Schnittstelle nur bei Reels.** Metas „Instagram Audio API" (Stand
16.06.2026) sucht aktuelle Titel und hängt sie „bei der Erstellung von Reels"
an; für Bild- und Karussellbeiträge sieht die Referenz kein Feld vor.
Automatisch veröffentlichte Karussells haben daher keine Musik. Wer Musik will,
braucht Reels – das wäre eine neue Form und damit eine eigene Entscheidung.

## Was das Repository erzeugt

Seit dem 11.10.2026 Sorte A, nach dem Muster oben:

| Was                       | Wo                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Kurztexte und Schlagworte | der Nachrichten-Agent, neben der Tagesausgabe, als `data/instagram/<tag>.json`      |
| Prüfung                   | `lib/instagram-plan.ts` – hält die Ausgabe **nie** auf                              |
| Kacheln                   | `lib/instagram-bild.ts`, gerendert beim Bau                                         |
| Deckblätter               | 28 gebrauchte aus dem Kanal, `lib/instagram/titelbilder/`, reihum                   |
| Abrufadressen             | `/instagram/stand.txt`, `/instagram/beschriftung.txt`, `/instagram/1.jpg` … `6.jpg` |

Die Deckblätter sind gebraucht, weil jedes neue Foto eine neue Bildquelle
bräuchte – genau das Experiment, das nicht gewünscht war. Bei 28 Bildern und
fünf Beiträgen je Woche kehrt eines nach gut fünf Wochen wieder.

**Für die Sorten B und C gibt es noch keinen Erzeuger.** Sie sind bisher
außerhalb entstanden.

## Was beim Durchsehen auffiel

- Ein veröffentlichter Beitrag trägt den Titel **„Anthrophic X Nvidia?"** –
  das Unternehmen heißt Anthropic.
- Die Schrift des Fließtexts in den alten Kacheln ist Canva Sans – eine
  Hausschrift von Canva, außerhalb von Canva nicht verwendbar. Ersatz seit
  16.10.2026 überall Open Sans (vorher in den Kacheln Noto Sans; gleiche
  Umbrüche auf allen 25 gemessenen Kacheln).
