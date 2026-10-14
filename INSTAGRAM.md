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

Eine einzelne weiße Kachel, kein Karussell. Oben mittig Logo und Wortmarke
„IM Invests". Überschrift schwarz mit **dunkelgrün hervorgehobenen Wörtern**.
Darunter die Grafik: schwarzer Balken gegen dunkelgrünen, Werte darüber, die
Differenz dunkelrot dazwischen. Unten eine Fußzeile:

    Stand: 10.10.2026 | Quellen: Kursdaten, STOXX Europe 600, EZB

Die jüngste Sorte – die erste erschien am 11.10.2026. Der Betreiber will davon
künftig mehr.

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

### Das Label „KI-Inhalte"

Steht an allen Beiträgen. Über die Schnittstelle setzt es `is_ai_generated`
am Beitrag – beim Karussell am Sammelbehälter, nicht an den einzelnen Kacheln
(Metas Referenz zu `/{ig-user-id}/media`, nachgelesen am 11.10.2026).

## Musik

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
- Die Schrift des Fließtexts in den alten Kacheln ist nicht frei verfügbar;
  Noto Sans kommt ihr am nächsten und bricht im Prüfsatz an denselben Stellen
  um.
