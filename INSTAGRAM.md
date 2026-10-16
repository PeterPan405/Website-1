# Was bei @im_invests hinausgeht

Diese Datei beschreibt **nicht, was schön wäre**, sondern was im Kanal schon
steht. Sie ist am 11. Oktober 2026 aus allen 130 veröffentlichten Beiträgen
abgeleitet worden – Beschriftungen und 872 Kacheln, abgezogen über die
Graph-Schnittstelle –, auf Anordnung des Betreibers: _„Schau dir die Beiträge
an, die wir schon haben, und nutze die als Vorgabe … keine neuen Experimente."_

Wer einen Beitrag baut, baut ihn so. Wer davon abweichen will, ändert zuerst
diese Datei – mit dem Grund daneben.

> [!warning] Was von selbst hinausgeht – und was nicht
> **„Top-News des Tages" geht werktags vollautomatisch hinaus**, nach der
> nächtlichen Ausgabe – Anordnung vom 11.10.2026, abends. Aber nur in genau
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

An Samstagen und Sonntagen gab es nie einen Tagesbeitrag. Ein Wochenende ohne
„Top-News" ist also kein Ausfall.

## Drei Sorten

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

Kriege und Politik kamen nur über ihre Marktfolge vor („Öl über 100", „USA &
Iran", „UN-Protest"). In den Beschriftungen aller 54 Tagesbeiträge steht kein
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
   am 15.10.2026: „14:00 Uhr passt"). Zwei Stunden reichen für Änderungen,
   Freigabe und Bau vor 16 Uhr.
5. **Freigabe**, sonst Änderung und neuer Entwurf. Nach dem „passt" wird
   `freigabe: '<heute>'` an die Karte geschrieben, gemergt, gebaut – und
   **nicht** von Hand veröffentlicht.
6. **Online ab 16 Uhr** – der Dauerlauf (`kurse-dauerlauf.yml`) fragt ab
   16:00 alle zehn Minuten und stößt `instagram-zahlenkarte.yml` an, sobald
   die Website die Karte von heute mit Freigabe von heute zeigt; zwei Crons
   (16:07 Sommer- und Winterzeit) sind Rückfall. Kommt die Freigabe später,
   geht die Karte beim nächsten Blick hinaus.

**„Passt" heißt freigegeben, nicht „jetzt hochladen".** Am 15.10.2026 ging
die erste Karte nach dem „passt" um 08:59 Uhr hinaus. Der Betreiber: „warum
hast du es schon hochgeladen" – „der Beitrag des Tages kommt immer erst um
16 Uhr". Seitdem hält der Veröffentlicher selbst vor 16 Uhr an, auch von
Hand gestartet (`lib/zahlenkarten-wecker.ts`).

Die Sperre gegen Doppelposts fragt nach **dieser** Karte (ihrem Aufhänger),
nicht nach „irgendein Beitrag heute" – um 16 Uhr stehen die Tagesnews schon
im Kanal. Umgekehrt hält der Tagesnews-Veröffentlicher an, sobald heute
irgendetwas im Kanal steht: Ein Rückfalllauf der Tagesnews **nach** 17 Uhr
schickt deshalb nichts mehr. Bewusst so gelassen – die Tagesnews gehen
nachts hinaus, ein Nachzügler am Abend wäre keine Tagesnachricht mehr.

## Die Beschriftung

### Bei „Top-News des Tages" – fest

So seit dem 8. Oktober, und so erzeugt sie `lib/instagram-plan.ts`
(`tests/instagram-tagesnews.test.ts` baut die des 9. Oktober zeichengenau nach):

    Die wichtigsten Börsennews des Tages. 📈

    <ein bis zwei Sätze, die die fünf Themen nennen>

    Alle fünf Entwicklungen im Überblick. Quelle: iminvests.de

    Keine Anlageberatung – nur Wissensvermittlung
    Alle Inhalte dieses Accounts dienen … Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt. #a #b #c #d #e

### Bei den anderen – eine Grammatik

1. **Der Aufhänger** – ein Satz oder eine Frage, die den Beitrag trägt, oft
   mit einem Zeichen am Ende (📈 📊 📉).
2. **Ein bis zwei kurze Absätze**: was es bedeutet, was erklärt wird.
3. **`Quellen: …`** – namentlich, mit Komma getrennt. Keine erfundenen.
4. **Der Rechtshinweis**, unverändert, mit dem KI-Hinweis am Ende.

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
