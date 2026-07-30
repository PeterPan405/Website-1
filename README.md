# IM Invests

Deutschsprachige Finanzbildungs-Plattform: 33 Themen in je drei Lernstufen, fünf
Rechner mit offengelegter Methodik, Marktdaten mit Erklärung, eingeordnete News und
ein interaktiver Staatsverschuldungs-Vergleich.

Gebaut mit **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4**,
**Recharts** und **Framer Motion**.

## Schnellstart

```bash
npm install
npm run dev        # Entwicklungsserver auf http://localhost:3000
```

Weitere Skripte:

| Skript              | Zweck                                     |
| ------------------- | ----------------------------------------- |
| `npm run build`     | Produktions-Build (statisch vorgerendert) |
| `npm start`         | Produktions-Server (nach `build`)         |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | TypeScript ohne Emit                      |
| `npm run format`    | Prettier über das ganze Projekt           |

### Umgebungsvariable

`NEXT_PUBLIC_SITE_URL` bestimmt die Basis-URL für canonical-Tags, Open-Graph-Bilder,
`sitemap.xml` und `robots.txt`. **Sie ist optional:** Ohne sie greift die echte Domain
aus `lib/resolve-site-url.ts`. Gesetzt wird sie nur, wenn eine andere Adresse gelten
soll – etwa für eine Vorschau unter eigener Domain.

```bash
cp .env.example .env.local   # nur bei abweichender Adresse nötig
```

> Dort stand früher eine Platzhalter-Domain mit reservierter `.example`-TLD, die
> greifen sollte, solange nichts gesetzt ist. Die Idee war, niemals versehentlich eine
> fremde Domain als canonical-URL auszuliefern – für die eigene Domain leistet ein
> Platzhalter das aber nicht. Zweimal an einem Tag ging die Website live und meldete
> Suchmaschinen Adressen unter `im-invests.example`: einmal, weil die Variable nie
> gesetzt war, einmal, weil sie beim Neuanlegen der Website beim Hoster verlorenging.
> Im Browser ist davon nichts zu sehen. Steht der richtige Wert im Code, ist er auch
> in einer Build-Umgebung richtig, die niemand konfiguriert hat.

## Projektstruktur

```
app/                    Routen (App Router), sitemap.ts, robots.ts, opengraph-image.tsx
components/
  calculators/          Rechner-Oberflächen und Formularbausteine
  charts/               Recharts-Diagramme, Sparkline (reines SVG), Chart-Tokens
  content/              Renderer für das Inhalts-Blockmodell
  debt/                 Ländervergleich (sortier- und filterbar)
  home/                 Rotierende News-Säule
  layout/               Header mit Mega-Menü und Suche, Footer, Theme-Umschalter
  learn/                Fortschrittslogik, Stufen-Navigation, Themen-Kacheln
  markets/              Kurskacheln
  seo/                  JSON-LD-Ausgabe
  ui/                   Design-System-Bausteine (Karten, Buttons, Icons, Callouts …)
data/                   Typisierte Inhalte und Demo-Daten
lib/                    Service-Schicht, Finanzmathematik, SEO- und Format-Helfer
```

### Datenzugriff: bewusst hinter einer Service-Schicht

Komponenten sprechen **nie** direkt mit `data/`, sondern ausschließlich über `lib/`:

| Modul            | Funktionen (Auszug)                                            |
| ---------------- | -------------------------------------------------------------- |
| `lib/markets.ts` | `getExchangeRate()`, `getIndex()`, `getQuote()`, `getSeries()` |
| `lib/news.ts`    | `getCurrentNews()`, `getFurtherNews()`, `getNewsArticle()`     |
| `lib/learn.ts`   | `getLearnTopics()`, `getLearnLevel()`, `getRelatedTopics()`    |
| `lib/debt.ts`    | `getCountryDebts()`, `getDebtSummary()`                        |

Alle Funktionen sind bereits `async`. Für echte APIs muss deshalb nur der jeweilige
Funktionsrumpf ausgetauscht werden – kein Aufrufer ändert sich.

## Marktdaten

Kurse kommen aus echten Quellen, nicht mehr aus einem Zufallsgenerator:

| Instrumente                                           | Quelle                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| Die fünf Euro-Wechselkurse                            | Europäische Zentralbank (amtlich, kostenlos, Quellenangabe genügt) |
| DAX, S&P 500, Euro Stoxx 50, Nasdaq 100, Gold, Silber | Yahoo Finance, ersatzweise Twelve Data                             |
| MSCI World                                            | keine – bleibt gekennzeichneter Demo-Kurs                          |

### Warum der Abruf nicht im Build läuft

Die Seite wird statisch exportiert; zur Laufzeit kann niemand Kurse holen. Der
naheliegende Weg wäre, im `next build` abzurufen – aber ein Build, der von fremden
Servern abhängt, fällt aus, sobald einer davon hustet. Bei Hostinger heißt das:
Bereitstellung rot.

Stattdessen:

```
.github/workflows/kurse.yml   werktags alle 30 Min., 07:00–21:00 UTC
  └─ npm run kurse            holt EZB und Yahoo Finance
  ├─ data/snapshots/kurse-aktuell.json   ~70 kB, ändert sich fast jeden Lauf
  ├─ data/snapshots/markets.json         ~19 MB, wächst je Handelstag
  └─ data/snapshots/dividenden.json      nur bei neuer Zahlung
       └─ jede Datei nur bei Änderung committet
            └─ Push nach main → Hostinger baut
                 └─ next build liest die Dateien, ohne Netz
```

Ein Fehlschlag bleibt damit folgenlos: Es wird nichts committet, und die Website
zeigt weiter den letzten guten Stand. Der Push nach `main` ist zugleich der
einzige Weg auf den Webspace – der Workflow ist also nicht nur Datenpflege,
sondern der Takt, in dem die Website neu gebaut wird.

### Warum die Kurse in zwei Dateien liegen

Weil sich die beiden Hälften verschieden schnell ändern. Die Tagesreihe wächst
einmal je Börsentag um einen Punkt; der zuletzt gehandelte Preis ändert sich
alle dreißig Minuten. Solange beides in `markets.json` stand, wurden bei jedem
Lauf neunzehn Megabyte vollständig neu geschrieben – zweiundvierzig Mal am Tag,
und Git speichert jede Fassung. Fünfzehn davon wogen zusammen 179 Megabyte.

Getrennt schreibt der halbstündliche Lauf nur noch `kurse-aktuell.json` mit
rund siebzig Kilobyte. `lib/market-live.ts` führt beide Dateien wieder
zusammen, sodass der Rest der Website davon nichts merkt.

### Wie vollständig die Daten sind

`npm run abdeckung` rechnet es aus – aus denselben Dateien, die auch die
Website liest, ohne Netz und ohne etwas zu verändern:

```
Kursverlauf         1029 von 1029 (100 %)
Dividendenhistorie   919 von 1029 (89 %)
Unternehmenszahlen   495 von 1029 (48 %)
Quartalstermine      158 von 1029 (15 %)
```

Die Zahlen stehen hier bewusst nicht als Fließtext, sondern als Befehl: Eine
abgetippte Abdeckung ist nach einer Woche falsch, ohne dass es jemandem
auffiele.

Zu den beiden Lücken:

**Quartalstermine** liegen bei 158, weil das genau die Unternehmen sind, die
bei der SEC ein 8-K einreichen. Der zweite Weg über Twelve Data ist gebaut und
braucht einen Schlüssel; danach füllt er das Feld über zwei Wochenläufe.
Warum zwei und nicht einer, steht in `EINRICHTUNG.md`.

**Unternehmenszahlen** liegen bei 48 %, und der größte einzelne Block ist
Deutschland mit 86 Titeln – Allianz, Münchener Rück, Siemens. Das ist der
ärgerlichste, denn deutsche Emittenten melden nach ESEF wie alle anderen an
einem geregelten EU-Markt, und dieses Projekt liest ESEF bereits. Die
Zuordnungsliste in `scripts/esef-abrufen.ts` enthält aber 26 französische und
13 britische Titel und keinen einzigen deutschen.

Sie ist von Hand geführt, und das aus gutem Grund: Ein Namenstreffer ist keine
Zuordnung. Nestlé traf einmal die US-Finanzierungstochter mit 31 Milliarden
Umsatz statt der Gruppe mit 91. Was fehlt, ist also nicht die Quelle, sondern
die geprüfte Zeile je Unternehmen – und die Kandidaten dafür liefert
`scripts/quellen-probe-esef.ts` über den Workflow „Quellen abklopfen“.

### Warum zwei Anbieter für Indizes

Der erste Versuch lief über Stooq und scheiterte vollständig: Statt der
CSV-Datei kam eine HTML-Seite mit dem Satz „This site requires JavaScript to
verify your browser“ – eine Bot-Prüfung, und zwar mit Statuscode 200, weshalb
es von außen wie Erfolg aussah. Das ist eine bewusst gesetzte Zugangssperre des
Betreibers und nichts, was sich wegkonfigurieren ließe.

Seitdem:

- **Yahoo Finance** ist der Regelweg – keine Registrierung, kein Schlüssel. Die
  Schnittstelle ist allerdings nicht offiziell dokumentiert.
- **Twelve Data** springt ein, sobald das Repository-Secret
  `TWELVEDATA_API_KEY` gesetzt ist. Dokumentierte Schnittstelle, kostenloser
  Tarif mit 800 Abrufen je Tag – gebraucht werden sechs. Die Umschaltung ist
  eine reine Einstellung und braucht keine Codeänderung.

Gold und Silber kommen bei Yahoo als COMEX-Terminkontrakt, bei Twelve Data als
Kassakurs. Beides ist vertretbar, aber es ist nicht dieselbe Zahl – ein
Anbieterwechsel ist an einem kleinen Sprung erkennbar.

### Zwei Grundsätze

**Zusammenführen, nie verwerfen.** Schlägt ein einzelner Abruf fehl oder ist das
Ergebnis unplausibel (`checkPoints` in `lib/providers/snapshot.ts` prüft auf
verrutschte Dezimalzeichen und unbrauchbare Werte), behält das Instrument seinen
bisherigen Wert. Die Momentaufnahme ist immer vollständig; ein hängender Anbieter
lässt nur ein Datum älter werden – und das steht sichtbar dabei.

**Kennzeichnung am einzelnen Wert.** Solange echte und erzeugte Kurse
nebeneinander vorkommen, kann keine Angabe für die ganze Seite stimmen.
`MarketQuote.source` ist `null` bei Demo-Daten, und `components/markets/SourceNote.tsx`
schreibt an jede Liste, woher die Zahlen stammen und was noch erzeugt ist.

### Zwei Preisarten, sauber getrennt

Auf der Kachel steht der **zuletzt gehandelte Preis** mit Zeitpunkt („Stand
27.07., 16:32“), im Chart stehen **Tagesschlusskurse**. Das ist Absicht: Ein
Verlauf aus Schlusskursen mit einem laufenden Preis am Ende hätte dort einen
Knick, der nichts bedeutet. `MarketQuote.intraday` sagt der Oberfläche, welche
der beiden Arten gerade angezeigt wird – „Stand“ mit Uhrzeit gegen „Schluss“ mit
Datum.

Die Tagesveränderung misst beim laufenden Kurs gegen den letzten Schlusskurs,
nicht gegen den vorletzten. So wird sie überall sonst auch gerechnet.

Den laufenden Preis liefert nur Yahoo (`meta.regularMarketPrice`). Bei der EZB
gibt es ihn nicht – Referenzkurse sind Tagesfixings; bei Twelve Data bräuchte es
eine zweite Abfrage. In beiden Fällen zeigt die Kachel den Schlusskurs.

### Kein Intraday-Verlauf

Der Zeitraum „Ein Handelstag“ ist entfallen. Alle Quellen liefern einen
Schlusskurs je Handelstag; die Demo-Daten hatten einen Verlauf innerhalb des
Tages erzeugt, echte Daten geben ihn nicht her.

### Größe der Momentaufnahme

Die letzten 400 Tage in voller Auflösung, davor ein Wert je Woche, insgesamt fünf
Jahre – rund 250 KB. Geschrieben wird ein Kurspunkt je Zeile: kompakter als
eingerücktes JSON und in einem Diff lesbar. Ein Börsentag mehr ist genau elf neue
Zeilen.

### Zwei Aktien vergleichen

Unter `/maerkte/vergleich` stehen zwei Titel nebeneinander. Die eigentliche
Arbeit steckt nicht in der Tabelle, sondern in `lib/vergleich.ts`: der Frage,
**welche** Gegenüberstellung überhaupt etwas bedeutet. Drei Regeln, alle in
`tests/vergleich.test.ts` festgehalten:

- **Kein Sieger ohne Richtung.** Kurs, Börsenwert, Branche und Tagesbewegung
  tragen nie eine Markierung. Ein Kurs von 320 gegen einen von 41 sagt nichts:
  Er hängt daran, in wie viele Stücke ein Unternehmen zerlegt wurde.
- **Kein Sieger bei zu kleinem Abstand.** Ein Prozentpunkt bei Prozentangaben,
  fünf Prozent relativ bei Verhältniszahlen. Absolut wäre bei den Letzteren
  falsch: Bei einem KGV von 6 gegen 7 ist ein Punkt viel, bei 60 gegen 61
  nichts.
- **Kein Bewertungsvergleich über Branchengrenzen.** KGV, KUV und KBV bleiben
  unmarkiert, sobald die Branchen auseinandergehen – ein Versorger und ein
  Softwarehaus werden aus guten Gründen verschieden bewertet.

Dazu die Vorbehalte über der Tabelle statt darunter: verschiedene Währungen,
verschiedene Branchen, verschiedene Sitzländer (und damit verschiedene
Quellensteuer), ungleich lange Kursreihen. Wer sie erst nach den Zahlen liest,
hat die Zahlen schon geglaubt.

Die Seite entsteht beim Bauen und trägt die Daten aller 1.029 Aktien im Paket –
wie die Merkliste, und aus demselben Grund: Welche zwei Titel jemand vergleicht,
weiß erst der Browser, und eine Seite je Paarung wären über eine halbe Million.
Die Zahlen werden vor dem Ausliefern auf die Stellen gerundet, die die Tabelle
auch zeigt; das allein hat die Seite von 772 auf 666 Kilobyte gebracht
(übertragen, also gezippt: 193 auf 128).

## Reihenfolge der Lernthemen

Die 33 Themen stehen nicht alphabetisch und nicht nach Beliebtheit, sondern in der
Reihenfolge, in der sie aufeinander aufbauen – in sechs Abschnitten:

| #     | Abschnitt                | Worum es geht                                            |
| ----- | ------------------------ | -------------------------------------------------------- |
| 1–6   | Bevor es losgeht         | Budget, Zeit, Kaufkraft, Risiko und das eigene Verhalten |
| 7–9   | Der sichere Sockel       | Notgroschen, Einlagensicherung, Schulden                 |
| 10–13 | Wie Märkte funktionieren | Börse, Kursbildung, Notenbanken, Depot                   |
| 14–25 | Die Anlageklassen        | Aktie bis Option, jeweils mit ihrem Risiko               |
| 26–31 | Aus Bausteinen ein Depot | Streuung, Aufteilung, Sparplan, Kosten, Crashs           |
| 32–33 | Steuern und Vorsorge     | Sparerpauschbetrag, Rente                                |

Die Abschnitte stehen als `learnSections` in `data/learn/index.ts` und sind die
**einzige** Stelle mit einer Reihenfolge – die Themenliste wird daraus abgeleitet.
Wer dort etwas verschiebt, verschiebt es auch auf `/lernen`, wo die Abschnitte als
Zwischenüberschriften erscheinen. Steht ein Thema in keinem oder in zwei Abschnitten,
bricht der Build ab; ein neu angelegtes Thema wäre sonst still unsichtbar geblieben.

Die Themenzahl steht zusätzlich als `LEARN_TOPIC_COUNT` in `lib/site.ts`, weil die
Kopfzeile eine Client-Komponente ist und ein Import der Lerndaten den kompletten
Datensatz ins Browser-Bundle zöge. `lib/learn.ts` prüft beim Bauen, ob die Zahl
stimmt – sie stand schon einmal längere Zeit auf einem falschen Wert.

## Lernbereich und Wissenscheck

Jede Lernstufe endet mit einem **Wissenscheck**: Multiple-Choice-Fragen mit genau einer
richtigen Antwort, Frage für Frage, mit Begründung nach jeder Antwort – auch bei richtiger
Antwort, denn dort liegt der Lernwert. Am Ende folgt eine Auswertung; ab 60 Prozent
richtiger Antworten kann die Stufe als erledigt markiert werden.

- Fragen liegen zentral in `data/learn/quizzes.ts`, Schlüssel `themen-slug:stufe`.
- 396 Fragen zu allen 99 Stufen – jede Stufe hat vier.
- **Regel bei neuen Fragen:** Die Position der richtigen Antwort muss wechseln. Liegt sie
  immer an derselben Stelle, lässt sich das Quiz ohne Lesen bestehen. Die Verteilung ist
  nicht gleichmäßig, aber ohne Muster (95 / 126 / 104 / 71); bei neuen Fragen bitte die
  bisher seltenste Position bevorzugen.
- Fortschritt und Bestergebnisse liegen ausschließlich im localStorage
  (`fk-learn-progress`, `fk-quiz-results`) – kein Konto, keine Serverübertragung.

## Globus

`/globus` zeigt eine drehbare Kugel: ziehen dreht, Mausrad zoomt, ein Klick auf ein
Land öffnet seine Kennzahlen und die Kurse, die von dort kommen. Im Menü steht der
Punkt zwischen **Lernen** und **Staatsverschuldung** – er beantwortet die Frage, die
zwischen beiden liegt: wo auf der Welt findet das statt, worüber die Lernthemen
sprechen, und wie groß ist es dort.

### Vier Quellen, absichtlich getrennt

| Was                        | Woher                                                               | Pflege                     |
| -------------------------- | ------------------------------------------------------------------- | -------------------------- |
| Formen der Länder          | Natural Earth über `world-atlas`, als TopoJSON in `public/globus/`  | `npm run globus-geometrie` |
| BIP und Einwohner          | Weltbank-Reihen, Momentaufnahme in `data/snapshots/laender.json`    | `npm run laender`          |
| Schulden, Gehalt, Vermögen | `data/laender/kennzahlen.ts`, Wert für Wert mit Quelle und Zeitraum | von Hand                   |
| Indizes und Aktien je Land | `data/laender/markt-zuordnung.ts` über `data/markets.ts`            | von Hand                   |

Zusammengeführt wird ausschließlich in `lib/laender.ts`; Komponenten sehen nur das
Ergebnis. `lib/laender-validate.ts` bricht den Build ab, wenn ein Index oder eine
Aktie kein Herkunftsland hat, eine Kennzahl auf eine unbekannte Länderkennung zeigt
oder eine Quelle ohne Link oder ohne Abgrenzung dasteht.

### Drei Entscheidungen, die den Unterschied machen

**Canvas statt SVG.** 177 Länder bei jedem Bild einer Drehung als DOM-Knoten neu zu
schreiben, bringt jeden Browser ins Stocken. Getroffen wird trotzdem exakt – nicht
über Trefferflächen, sondern über `projection.invert` und `geoContains`.

**Quantile statt gleich breiter Klassen.** Die größte Volkswirtschaft ist rund
zwanzigtausendmal so groß wie die kleinste. Bei gleich breiten Klassen läge alles
außer zwei Ländern in derselben Farbe. Der Preis: Die Farbe zeigt den Rang, nicht
den Abstand – das steht so in der Legende, und die genaue Zahl steht bei jedem Land
im Klartext.

**„Keine Angabe“ ist keine Farbstufe.** `stufeFuer()` liefert für `null` bewusst
`-1`, und diese Länder bekommen ein neutrales Grau außerhalb der Farbtreppe. Ein Land
ohne Datensatz darf nicht aussehen wie ein Land ohne Schulden – der teuerste
denkbare Fehler dieser Seite, weil ihn niemand der Karte ansieht. `tests/globus-geometrie.test.ts`
prüft genau diesen Fall.

### Warum die Abdeckung ungleich ist

BIP und Einwohnerzahl liegen für über 150 Länder vor und werden automatisch geholt.
Schuldenquote, Durchschnittsgehalt und Vermögen veröffentlichen IWF, Eurostat, OECD
und UBS dagegen in Berichten und hinter Abfragemasken, nicht als offene Datei –
diese Werte sind von Hand gepflegt und decken bisher nur wenige Länder ab. Die
Alternative wäre gewesen, sie aus dem Gedächtnis zu ergänzen und eine plausible
Quelle darunterzuschreiben; das wäre nicht nachprüfbar und als Fehler nicht
erkennbar. Die Seite nennt die Abdeckung deshalb je Kennzahl.

Besonders bei der Staatsverschuldung ist die Abgrenzung keine Formalie: Eine Quote
nach Maastricht (Eurostat) und eine nach IWF-Abgrenzung sind verschiedene Größen und
unterscheiden sich für dieselben USA um mehrere Prozentpunkte. Jeder Wert trägt
deshalb seine eigene Quelle, und die Detailtafel zeigt sie an.

### Zugänglichkeit

Eine Zeichenfläche ist für Screenreader leer. Ersetzt wird das dreifach: Die Karte
lässt sich mit den Pfeiltasten drehen und mit +/− zoomen, die Detailtafel ist eine
`aria-live`-Region, und unter der Karte steht derselbe Datenbestand als vollständige
Tabelle im HTML – ohne JavaScript lesbar und von Suchmaschinen erfassbar.

## Erklärgrafiken

100 Diagramme, verteilt auf 103 Stellen – jede der 99 Lernstufen hat mindestens eines,
dazu `/maerkte/msci-world`. Alle als **handgeschriebenes SVG im HTML**, nicht als
Bilddateien. Verzeichnis in `data/figures.ts`, Zeichnungen unter
`components/content/figures/`, eingesetzt über den Inhaltsblock
`{ type: 'figure', figure: '…' }`.

Vier Gründe für gezeichnetes SVG statt Bildmaterial:

- **Rechte.** Ein fremdes Bild bräuchte Lizenz und Bildnachweis. Gezeichnetes gehört uns.
- **Zahlen.** Die Werte kommen aus `lib/zins-beispiele.ts` – denselben Funktionen, aus
  denen die Tabellen daneben entstehen. Ein Bild wäre eine zweite Quelle für dieselbe
  Zahl. Genau das war der Zustand vorher: Die Sparplantabelle wies 478.000 Euro aus,
  gerechnet sind es rund 454.000; in der Kostentabelle stimmte eine von vier Zeilen.
- **Darstellung.** Skaliert mit der Spaltenbreite, wechselt mit hellem und dunklem Theme,
  braucht kein JavaScript – die Grafik steht fertig im statisch gebauten HTML.
- **Zugänglichkeit.** Jede Grafik trägt `<title>` und `<desc>` mit einem inhaltlichen
  Satz. Wo die Zahlen aus einem Datensatz stammen (Ländergewichtung), wird auch die
  Vorlesefassung daraus gebaut – sonst wäre sie nach der ersten Aktualisierung falsch,
  und zwar unbemerkt.

**Karikaturen und Illustrationen gibt es bewusst nicht.** Sie ließen sich hier nicht
ehrlich herstellen: gezeichnet wird nicht von Hand, und fremdes Bildmaterial brächte eine
Lizenzfrage mit, die eine Bildungsseite sich nicht einhandeln sollte.

Zwei Fallen, beide bereits eingetreten und deshalb festgehalten:

- **SVG-Text bricht nicht um.** Was nicht in die `viewBox` passt, wird abgeschnitten –
  ohne Fehler. Längere Aussagen gehören in die `figcaption` darunter, die umbricht. Der
  letzte Teilstrich einer Achse braucht Rand, sonst ragt seine Beschriftung zur Hälfte
  hinaus.
- **Eine Grafik hat keinen Fehlerzustand.** Eine vertauschte y-Achse oder eine
  Gewichtung, die auf 94 statt 100 Prozent kommt, sieht plausibel aus. Deshalb liegt die
  Geometrie importfrei in `lib/figure-geometry.ts` mit Prüfungen unter
  `tests/figure-geometry.test.ts`, und `assertZusammensetzungVollstaendig()` wirft beim
  Bauen, statt zu warnen.

### Ländergewichtung des MSCI World

`data/index-zusammensetzung.ts` hält die Aufteilung in der Einteilung des Anbieters – die
fünf größten Länder einzeln, der Rest als Sammelposition. Der Datensatz trägt ein
sichtbares `stand`-Datum und einen Link auf das Factsheet: Anders als der Kurs wird er
nicht stündlich abgerufen, sondern von Hand gepflegt. Eine Gewichtung ohne Datum wäre eine
Behauptung. Den „Rest“ selbst auf einzelne Länder zu verteilen hieße, Zahlen zu erfinden,
die in der Quelle nicht stehen.

## Unternehmensphilosophie

Verfasst und veröffentlicht (`PHILOSOPHY_PUBLISHED = true`). Fünf Abschnitte in
`data/philosophy.ts`: warum es die Website gibt, die inhaltlichen
Grundüberzeugungen, die redaktionelle Arbeitsweise, die Abgrenzung und die
Finanzierung.

Die Abschnitte sind Daten, keine Seitenstruktur – `heading` wird als `<h2>`
ausgegeben, jeder Eintrag in `paragraphs` als Absatz. Umformulieren, ergänzen
oder streichen geht damit, ohne die Seite anzufassen. Das `hint`-Feld bleibt bei
jedem Abschnitt stehen, obwohl es nicht mehr angezeigt wird: Es beschreibt, was
in den Abschnitt gehört, und ist die Prüffrage für eine spätere Überarbeitung.

Solange `PHILOSOPHY_PUBLISHED` auf `false` steht, wird die Seite mit `noindex`
ausgeliefert und **nicht** in die Sitemap aufgenommen; eine fast leere Seite im
Index würde die Sichtbarkeit der gesamten Domain belasten.

Der Abschnitt zur Finanzierung nennt: keine Werbung, keine Provisionen, keine
Affiliate-Links, kein Abonnement, privat finanziert. **Das ist eine Aussage über
das Geschäft und muss stimmen** – ändert sich daran etwas, gehört es dort
geändert, bevor es woanders auffällt.

## Nachrichten und das rollierende Prinzip

Die Artikel unter `/news` beziehen sich auf tatsächliche Ereignisse und nennen
ihre Quellen. Bis Juli 2026 standen dort erfundene Beispieltexte; sie sind
ersatzlos entfernt.

Vorne stehen unter **Aktuelles** die neun jüngsten Artikel, alles Ältere rutscht
in **Weitere Artikel** – das ist das Archiv, kein eigener Datenbestand. Dieselbe
Auswahl zeigt das Karussell auf der Startseite. Die Aufteilung steht **nicht** in
den Daten – sie ergibt sich in `lib/news.ts` allein aus `publishedAt`. Einen
neuen Artikel anzulegen genügt also; das Ältere wandert von selbst nach hinten,
ohne dass jemand ein Kennzeichen umsetzt oder etwas löscht.

Die Grenze läuft bewusst nach Rang (`CURRENT_NEWS_COUNT`) und nicht nach
Uhrzeit. Bei einer statisch gebauten Seite wäre „alles aus den letzten 24
Stunden“ auf den Zeitpunkt des letzten Builds bezogen – nach ein paar Tagen ohne
neue Ausgabe stünde die Startseite ohne Meldungen da. Die 24 Stunden sind die
redaktionelle Vorgabe für die Recherche, nicht die Anzeigelogik.

Neun statt vorher fünf: An einem Tag mit einem beherrschenden Thema –
Notenbank, Geopolitik – gehören die Meldungen zusammen gelesen. Fünf hätten die
Hälfte einer Tagesausgabe sofort ins Archiv geschoben.

### Der Ablauf steckt in einer Skill

`.claude/skills/newsupdate/SKILL.md` beschreibt den vollständigen Durchlauf:
Recherche mit Datumsprüfung, Lehrwinkel je Artikel, die Grenzwerte der
Build-Prüfungen (Teaser 100–200 Zeichen, `intro` der Tagesausgabe 110–165), die
Befehle für die Slug-Listen und der Hinweis, dass nichts live ist, bevor auf
`main` gemerged wurde. Aufruf mit `/newsupdate`; nach dem Anlegen einmal
`/reload-skills`.

Der Tagesüberblick unter `/news/tag/<datum>` ist ein **eigener** Datenbestand
und veraltet sonst still mit – die Skill legt ihn im selben Durchlauf mit an.

Redaktionell gilt dasselbe wie beim Tagesüberblick: selbst zusammenfassen, nie
spiegeln, und **mindestens eine Quelle je Artikel**. `lib/news-validate.ts`
bricht den Build ab, wenn eine Quelle, ein Zeitzonen-Suffix in `publishedAt`
oder ein referenziertes Lernthema fehlt. `publishedAt` ist dabei unser
Erscheinungsdatum, nicht das der Quelle.

### Verlinkte Schlagwörter

Die Begriffe unter einem Nachrichtenartikel („Schlagwörter“) und unter einem
Lernthema („Begriffe in diesem Thema“) sind Verweise, wo es ein Ziel gibt –
gemeinsame Komponente `components/ui/TagLinks.tsx`, Auflösung in
`lib/tag-links.ts`. Die Rangfolge:

1. **Slug oder Titel eines Lernthemas** – ein Wort, das ein Thema benennt.
2. **Zuordnungen von Hand** (`TAG_ALIASES`) für Nachrichtenvokabular wie
   „Dot Plot“ oder „Brent“; auch Rechner und Kurse sind dort zulässige Ziele.
3. **Stichwörter eines Lernthemas** – das schwächste Signal.
4. **Kurse** über Symbol, Kürzel oder Name.

Bewusst keine Volltextsuche im Hintergrund: Sie würde denselben Begriff nach
einer Textänderung woanders hinführen, ohne dass es jemandem auffällt.

Zwei Regeln, die den Unterschied machen: Zu **sich selbst** verweist niemand –
steht „Gold“ bei den Begriffen des Themas Rohstoffe, führt es zum Goldkurs statt
im Kreis. Und wo **nichts** passt, bleibt der Begriff unverlinkt und gestrichelt
statt auf etwas ungefähr Passendes zu zeigen.

## Tagesüberblick

Jeden Morgen erscheint unter `/news/tag/JJJJ-MM-TT` eine Ausgabe mit fünf
Meldungen, davon drei Top-Themen. Alle bisherigen Ausgaben stehen unter
`/news/tag` in einer nach Monaten gruppierten Bibliothek.

Die Zusammenfassungen sind selbst geschrieben und verlinken auf ihre Quellen.
Das ist nicht nur redaktionell besser, sondern rechtlich notwendig: Fremde
Artikel dürfen weder im Volltext noch in längeren Auszügen gespiegelt werden.

Eine Ausgabe anlegen heißt: Datei unter `data/editions/` erstellen **und** in
`data/editions/index.ts` eintragen. Die Liste dort ist absichtlich
ausgeschrieben, damit der Compiler jede Ausgabe kennt und vorrendern kann.

Die Aufteilung in drei plus zwei Meldungen erzwingt der Typ (`top` und `further`
sind Tupel). Alles Weitere prüft `lib/editions-validate.ts` **beim Bauen**:
Länge der Einleitung, Pflichtfeld `whyItMatters`, mindestens eine Quelle je
Meldung, https-Links, und ob die verwiesenen Lernthemen und Kurse überhaupt
existieren. Stimmt etwas nicht, bricht der Build ab, statt eine fehlerhafte
Ausgabe zu veröffentlichen – die Ausgaben entstehen automatisch, also darf ein
Fehler darin nicht still durchgehen.

## Podcast

Unter `/podcast` stehen die Folgen des Podcasts, jede mit eigener Adresse unter
`/podcast#<slug>`. Sie kommen aus dem **RSS-Feed** des Podcast-Hosters, nicht
aus der Spotify-Schnittstelle: Die verlangt eine Registrierung als Anwendung
samt Geheimnis und gibt Folgen nur nach OAuth heraus, während der Feed ohne
Zugangsdaten lesbar ist und beim Hoster liegt – zieht der Podcast auf eine
andere Plattform, bleibt er derselbe.

| Datei                           | Aufgabe                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `lib/podcast-feed.ts`           | zerlegt den Feed, ohne Importe und daher unter `tests/` prüfbar |
| `scripts/podcast-abrufen.ts`    | holt den Feed und schreibt die Momentaufnahme                   |
| `lib/podcast.ts`                | die Service-Schicht für die Seiten                              |
| `.github/workflows/podcast.yml` | ruft täglich ab und committet bei Änderung                      |

**Damit Folgen erscheinen, muss die Feed-Adresse hinterlegt werden.** Sie steht
im Verwaltungsbereich des Hosters (bei „Spotify for Creators" unter
_Settings → Distribution_) und gehört unter _GitHub → Settings → Secrets and
variables → Actions_ in die **Variablen** unter dem Namen `PODCAST_RSS_URL` –
nicht in die Secrets: Ein Podcast-Feed ist öffentlich, jeder Abspieler liest
ihn. Aus der Spotify-Adresse allein lässt sie sich nicht ableiten, und geraten
wird sie nicht: Ein falscher Feed brächte fremde Folgen unter unserem Namen auf
die Seite.

Ohne diese Angabe bleibt die Liste leer. Das ist ein gültiger Zustand: Die
Seite steht trotzdem und verweist auf Spotify.

Drei Entscheidungen, die nicht offensichtlich sind:

- **Eine Seite mit Sprungmarken, nicht eine Seite je Folge.** Erst der zwingende
  Grund: Ein `[slug]`-Verzeichnis, dessen `generateStaticParams()` eine leere
  Liste zurückgibt, bricht den Build ab – `output: export` verlangt mindestens
  eine vorgerenderte Adresse, und genau dieser Zustand liegt ohne Feed-Adresse
  vor. Der Fehler kam erst im Build, nicht in `tsc` oder `lint`. Dann der
  inhaltliche: Was ein Feed je Folge hergibt, sind ein Titel, ein Datum und ein
  Ankündigungsabsatz – daraus entstünden dünne Seiten. Eine eigene Adresse hat
  jede Folge trotzdem, genau wie jeder Glossarbegriff unter `/glossar#<slug>`.
- **Kein eingebetteter Abspieler.** Er lädt beim bloßen Seitenaufruf die Skripte
  seines Anbieters nach und setzt Kennungen, bevor jemand auf „Play" gedrückt
  hat. Verlinkt wird die Folge, gehört wird sie beim Anbieter.
- **Was einmal im Bestand war, bleibt darin.** Viele Hoster liefern nur die
  letzten fünfzig oder hundert Folgen aus. Wer den Feed eins zu eins übernimmt,
  löscht die älteren aus dem Bestand – und jede Sprungmarke, die je
  weitergegeben wurde, zeigt ins Leere.

## Suche

Die Lupe in der Kopfzeile öffnet eine Suche über alle Inhalte – Bereichsseiten,
33 Lernthemen mit ihren 99 Stufen, fünf Rechner, alle Kurse, Nachrichten,
Tagesausgaben und die festen Seiten. Tastenkürzel: `Strg`/`Cmd` + `K`.

Sie läuft vollständig im Browser, weil die Website statisch ausgeliefert wird
und es keinen Server gibt, der eine Anfrage beantworten könnte. Der Index wird
erst geladen, wenn jemand die Lupe anklickt – vorher steckte er in den Daten
jeder Seite und kostete dort rund 32 KB pro Aufruf. Aufgeteilt in
vier Teile:

| Datei                                | Aufgabe                                                       |
| ------------------------------------ | ------------------------------------------------------------- |
| `lib/search.ts`                      | baut den Index beim Bauen aus der Service-Schicht             |
| `app/suchindex.json/route.ts`        | legt ihn als eigene Datei unter `/suchindex.json` ab          |
| `lib/search-match.ts`                | die Suchregeln, ohne Importe und daher unter `tests/` prüfbar |
| `components/layout/SearchDialog.tsx` | die Oberfläche                                                |

Drei Regeln bestimmen die Treffer:

- **Umlaute werden ausgeschrieben**, nicht zerlegt. Wer `maerkte` tippt, meint
  „Märkte"; eine reine Diakritika-Entfernung machte daraus `markte` und träfe
  die Eingabe nicht.
- **Jeder Suchbegriff muss vorkommen.** Zwei Begriffe schränken ein, statt die
  Treffermenge zu erweitern.
- **Ein Treffer am Titelanfang wiegt am schwersten**, dann weiter hinten im
  Titel, dann in den Schlagwörtern. Bei Gleichstand entscheidet die Reihenfolge
  im Index, und die ist in `lib/search.ts` bewusst gesetzt.

Neue Inhalte landen automatisch im Index, solange sie über die Service-Schicht
erreichbar sind. Eine neue Seite ohne Datenquelle – etwa eine weitere feste
Seite – muss dort von Hand ergänzt werden.

## Veröffentlichen

Die Website wird als **statischer Export** gebaut: `npm run build` legt sie als
HTML, CSS und JavaScript in `out/` ab. Sie braucht keinen Node-Server und läuft
auf jedem Webspace, der Dateien ausliefern kann.

Möglich ist das, weil das Projekt keine Server-Funktionen verwendet: keine Route
Handler, keine Middleware, keine Server Actions, kein `next/image`. Alle Seiten
werden ohnehin beim Build vorgerendert.

Zwei Einstellungen in `next.config.ts` sind dafür nötig und sollten so bleiben:

- `output: 'export'` erzeugt den Ordner `out/`.
- `trailingSlash: true` legt jede Seite als `news/index.html` statt als
  `news.html` ab. Ohne das findet Apache bei `/news` einen Ordner ohne
  `index.html` und liefert einen Fehler statt der Seite. Aus demselben Grund
  hängt `absoluteUrl()` einen Schrägstrich an – sonst nennt die Sitemap eine
  andere Schreibweise als der Canonical der Seite.

`public/.htaccess` wird mitkopiert und setzt auf Apache und LiteSpeed die
Fehlerseite. Mehr steht bewusst nicht darin: Eine frühere Fassung mit erzwungenen
Dateitypen, Sicherheits-Headern und Cache-Regeln lieferte die Website ohne jede
Formatierung aus. Weitere Anweisungen kommen nur einzeln und geprüft zurück.

### Veröffentlichen

**Push auf `main` genügt.** Der Hoster ist über seine GitHub-Anbindung mit dem
Repository verbunden, baut die Website in einem eigenen Container mit
`npm run build` und stellt das Ergebnis bereit. Es wird nichts hochgeladen,
weder von Hand noch aus einem Workflow.

Nach ein bis zwei Minuten steht der neue Stand. Zur Kontrolle
`iminvests.de/version.txt` aufrufen: Nennt die Datei den erwarteten Commit, ist
er live.

Wichtig für die Build-Einstellungen beim Hoster: Ausgabeverzeichnis `out`,
Node 22, Build-Befehl `npm run build`. `NEXT_PUBLIC_SITE_URL` ist dort **nicht**
nötig – die echte Domain steht in `lib/resolve-site-url.ts`. Die Variable ist
bei einer Neuanlage der Website schon zweimal verlorengegangen, deshalb hängt
nichts mehr daran.

#### Der Notweg

Derselbe Stand liegt zusätzlich als ZIP unter _Actions → Artifacts → website_.
Gebraucht wird er nur, wenn die Anbindung ausfällt: herunterladen, im
Dateimanager des Hosters das Verzeichnis leeren (`.well-known` stehen lassen,
darüber läuft die Erneuerung des SSL-Zertifikats), ZIP hochladen, entpacken,
ZIP löschen, Cache leeren.

#### Warum der Workflow trotzdem läuft

`paket-bauen.yml` baut bei jedem Push auf `main` und täglich um 04:15 UTC. Er
liefert nicht aus, sondern prüft – und zwar das Ergebnis, nicht die Absicht:
mindestens ein Stylesheet, mindestens 100 Seiten, `.htaccess` und `version.txt`
vorhanden, keine Platzhalter-Domain in der Sitemap.

Jede dieser Prüfungen steht für einen Vorfall. Ein früherer Stand wurde ohne
Stylesheet ausgeliefert und fiel erst im Browser auf. Ein Deploy-Workflow
übersprang den Upload stillschweigend, wenn ein Secret fehlte, und meldete
trotzdem Erfolg – tagelang stand eine veraltete Fassung online, ohne dass ein
einziger Lauf rot wurde.

`version.txt` entsteht als `prebuild` und liegt deshalb in jedem Build, auch in
dem des Hosters. Sie nennt Commit und Bauzeitpunkt und ist unter `/version.txt`
abrufbar. Anlass: Über Tage lag ein Stand auf dem Server, der aus den ersten
25 Minuten des Projekts stammte – erkennbar allein am alten Markennamen im
Seitenkopf. Welcher Stand ausgeliefert wird, darf keine Detektivarbeit sein.

## SEO

- **Eigene Seite je Inhalt**, keine Anker auf einer Monolith-Seite: rund 300
  indexierbare URLs, davon 99 Lernstufen-Seiten (33 Themen × 3 Stufen) und 134
  Kursseiten.
- **`lib/seo.ts`** erzeugt Title, Description, canonical, Open Graph und Twitter-Card
  zentral. Im Entwicklungsmodus warnt es, wenn Title (30–62 Zeichen) oder Description
  (110–165 Zeichen) aus dem Zielkorridor fallen.
- **JSON-LD** aus `lib/jsonld.ts`: `Organization` + `WebSite` global, dazu je Seitentyp
  `NewsArticle`, `LearningResource`, `WebApplication`, `Dataset`, `CollectionPage` –
  plus `BreadcrumbList` auf allen Unterseiten.
- **`app/sitemap.ts`** und **`app/robots.ts`** werden aus derselben Service-Schicht
  gespeist wie die Seiten. Eine neue Seite kann deshalb nicht in der Sitemap fehlen.
- **`app/opengraph-image.tsx`** erzeugt das Vorschaubild zur Build-Zeit ohne externe
  Assets oder Schriften.
- Genau ein `<h1>` pro Seite, lückenlose Überschriftenhierarchie.
- Der Unternehmensname steht ausschließlich in `siteConfig.name`; Seitentitel setzen ihn
  über `withBrand()` an. Eine Umbenennung betrifft daher genau eine Zeile.

Verifiziert wird das bei jedem Lauf über alle Sitemap-URLs – derzeit 738 – durch
`scripts/paket-pruefen.ts`: h1-Anzahl, canonical, `og:image`, JSON-LD, Breadcrumb,
Titel- und Description-Länge, Überschriftensprünge, tote Links und seit Neuestem die
Geometrie jeder Lerngrafik.

**Was diese Prüfung nicht sieht:** Layout. Sie liest HTML, sie rechnet es nicht aus.
Hier stand deshalb lange die Behauptung, es gebe „keinen horizontalen Overflow bei
360/768/1440 px“ – zu einem Zeitpunkt, als die Artikelseiten bei 320 bis 430 px um bis
zu 210 Pixel über den Rand liefen und das Telefon die ganze Seite herauszoomte. Die
Messung war einmal gemacht und danach als Zusage stehen geblieben. Wer eine solche
Aussage wieder aufnimmt, muss sie messen, nicht erinnern.

## Barrierefreiheit und Performance

- Sprungmarke „Direkt zum Inhalt“ als erster Tab-Stop.
- Mega-Menü mit `aria-expanded`, Escape zum Schließen, Öffnen nur per Klick/Enter.
- News-Karussell nach W3C-Muster: Pause bei Hover und Fokus, expliziter Pause-Knopf,
  Pfeiltasten, `aria-live` erst nach eigener Interaktion – plus alle Schlagzeilen als
  statische Liste für Suchmaschinen und Screenreader.
- Sortierbare Tabelle mit `aria-sort`, Fortschrittsbalken mit `role="progressbar"`.
- `prefers-reduced-motion` schaltet Animationen global ab.
- Recharts wird dynamisch nachgeladen; die Sparklines auf der Startseite sind reines
  server-gerendertes SVG ohne JavaScript.
- Hell-/Dunkelmodus über ein Inline-Script im `<head>` – kein Aufblitzen beim Laden.
- Schriften werden über `next/font` zur Build-Zeit eingebunden und selbst
  ausgeliefert; zur Laufzeit gibt es keine Verbindung zu Google.

## Zahlen im Fließtext gehören abgeleitet

Auf `/ueber-uns` stand monatelang „Aktie und Zinseszins sind ausformuliert, die
übrigen 20 Themen haben eine Gliederung“. Beides war irgendwann falsch:
`rohstoffe` kam dazu, und aus 20 übrigen wurden 30. Dieselbe Sorte Fehler steckte
in der Themenzahl im Menü und in der Aussage, Kurse und News seien Beispieldaten.

Die Regel daraus: **Eine Zahl, die jemand beim Erweitern mitpflegen muss, wird
irgendwann vergessen.** Solche Angaben kommen deshalb aus der Service-Schicht –
auf `/ueber-uns` über `getLearnStats()` und `getCompleteTopics()`, im Lernbereich
über `stats.topicCount`. Wo das nicht geht, weil eine Client-Komponente die Daten
sonst ins Browser-Bundle zöge, steht die Zahl einmal als Konstante und wird beim
Bauen gegen die Wirklichkeit geprüft (`LEARN_TOPIC_COUNT`).

Was strukturell feststeht – „drei Stufen“, „fünf Rechner“ – darf im Text stehen.
Was mit den Daten wächst, nicht.

## Was noch fehlt

Diese Liste stand über Wochen falsch da: Sie führte Fließtext, Quizfragen und den
Philosophietext als offen, obwohl alle drei fertig waren. Das ist derselbe Fehler,
vor dem der Abschnitt „Zahlen im Fließtext gehören abgeleitet“ weiter unten warnt –
nur in Prosa statt in einer Zahl, und deshalb von keiner Prüfung zu fangen. **Wer
hier einen Punkt erledigt, streicht ihn hier.**

### Offen, und zwar bei uns

1. **Echte Zahlen zur Staatsverschuldung.** Der einzige verbliebene Demo-Datensatz
   neben `msci-world`; `data/debt.ts` weist das im Kopf und die Übersichtsseite es
   sichtbar aus. Kurse, Länderdaten, Fundamentalzahlen und Quartalstermine kommen
   inzwischen aus echten Quellen.

   **Die Daten sind längst da.** `scripts/laender-abrufen.ts` holt seit dem Ausbau
   der Länderdaten die Schuldenquote des IWF (`GGXWDG_NGDP` über die
   Datamapper-Schnittstelle), das BIP der Weltbank und die Einwohnerzahlen.
   `data/snapshots/laender.json` enthält damit **178 Länder mit allen drei
   Größen** – darunter alle 18 des Demo-Datensatzes. Umzustellen ist nur
   `lib/debt.ts`; dort steht seit jeher der Kommentar, dass beim Umstieg genau
   diese eine Datei angepasst wird.

   Zwei Entscheidungen sind vorher zu treffen, und beide sind inhaltlich, nicht
   technisch:

   - **Umrechnungskurs.** Das BIP der Weltbank steht in laufenden US-Dollar des
     Bezugsjahres (derzeit 2023). Umgerechnet werden muss mit dem
     Durchschnittskurs _desselben_ Jahres, nicht mit dem heutigen – sonst stünde
     eine Zahl von 2023 zu einem Kurs von heute da. Die EZB-Reihe in
     `data/snapshots/markets.json` reicht weit genug zurück.
   - **Regionen.** `DebtRegion` kennt heute fünf handverlesene Gruppen
     (`Eurozone`, `EU ohne Euro`, …). Bei 178 Ländern kommen Afrika und der Nahe
     Osten hinzu; die Einteilung muss entweder auf die UN-Regionen des Snapshots
     wechseln oder die Auswahl bleibt bewusst auf eine Ländergruppe beschränkt.
     Das ist eine Produktentscheidung.

2. **Kontaktformular.** Aktuell nur ein E-Mail-Link, weil die Seite statisch
   ausgeliefert wird. Ein Formular braucht serverseitige Verarbeitung, Spam-Schutz und
   eine Ergänzung der Datenschutzerklärung.

### Offen, und zwar außerhalb

3. **Zugangsdaten für die drei Automatiken.** Ohne sie bauen alle Workflows durch,
   liefern aber nichts aus beziehungsweise holen keine Termine. Was wohin gehört,
   steht Schritt für Schritt in [`EINRICHTUNG.md`](./EINRICHTUNG.md).
4. **Zwei Angaben in der Datenschutzerklärung.** Firmierung und Anschrift des Hosters
   sowie dessen Speicherdauer für Protokolldateien. Sie stehen in dessen eigener
   Erklärung und sind dort abzuschreiben, statt sie zu schätzen.
5. **Anwaltliche Prüfung von Impressum und Datenschutzerklärung.** Beide Seiten sind
   inhaltlich vollständig – Anbieter, Anschrift und Kontakt in `lib/provider.ts`, die
   Erklärung beschreibt, was die Website tatsächlich tut. Eine Prüfung vor dem
   endgültigen Live-Gang bleibt zu empfehlen, bei Finanzinhalten erst recht.

### Erledigt, hier nur noch als Beleg

- **Fließtext:** alle 99 Stufen stehen auf `status: 'complete'`; den Status `outline`
  gibt es in `data/learn/topics/` nicht mehr.
- **Quizfragen:** 396 Fragen, vier je Stufe, alle 99 Stufen abgedeckt.
- **Erklärgrafiken:** 100 Zeichnungen an 103 Stellen, jede Stufe hat mindestens eine.
- **Unternehmensphilosophie:** `PHILOSOPHY_PUBLISHED` steht auf `true`, die Seite ist
  in der Sitemap.

## Hinweis zu den Inhalten

Alle Inhalte dienen der Information und Bildung. Sie sind keine Anlage-, Steuer- oder
Rechtsberatung. Kurse und Verschuldungszahlen dieser Fassung sind Beispieldaten; die
Nachrichten beziehen sich auf tatsächliche Ereignisse und verlinken ihre Quellen.
