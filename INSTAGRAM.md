# Was bei @im_invests hinausgeht

Diese Datei beschreibt **nicht, was schön wäre**, sondern was im Kanal schon
steht. Sie ist am 11. Oktober 2026 aus 130 veröffentlichten Beiträgen
abgeleitet worden, auf Anordnung des Betreibers: _„Schau dir die Beiträge an,
die wir schon haben, und nutze die als Vorgabe."_

Wer einen Beitrag baut, baut ihn so. Wer davon abweichen will, ändert zuerst
diese Datei – mit dem Grund daneben.

> [!warning] Es geht nichts ohne Freigabe hinaus
> Täglich wird zuerst besprochen, **welche Sorte** kommt, dann sieht der
> Betreiber den Entwurf, und erst danach wird freigegeben:
>
>     gh variable set INSTAGRAM_FREIGABE --body JJJJ-MM-TT
>
> Ohne passendes Datum bleibt jeder Lauf ein Trockenlauf. Warum ein Datum und
> kein Schalter, steht in `ENTSCHEIDUNGEN.md` unter „Der vierte Riegel ist ein
> Datum, kein Schalter".

## Drei Sorten, und sie sehen verschieden aus

### A — „Top-News des Tages"

Der Tagesbeitrag. **Deckblatt:** ein Foto, darüber in sehr fetter, schmaler
Grotesk zweizeilig „Top-News des Tages", links oben, mit Rand. Schrift weiß
oder schwarz, je nachdem, was auf dem Foto lesbar ist – nicht nach Laune,
sondern nach dem oberen Bilddrittel. Danach je Meldung eine Kachel.

### B — Erklärbeitrag

Acht bis zehn Kacheln. Zwei Arten von Deckblatt, beide auf Foto:

- eine **Frage**: „Was ist ein Spin-off?", „Wann ist eine Aktie günstig?",
  „Warum laufen gleiche ETFs unterschiedlich?"
- eine **Aussage mit Unterzeile**: „Importregulierung" / „Die aktuelle Lage im
  europäischen Automarkt."

Auch eine Nachricht darf so verpackt werden, wenn sie erklärt wird: „LVMH
verliert 167 Milliarden", „Warren Buffet tritt ab", „Klage gegen Netflix".

**Die Innenkacheln sind bei A und B dieselben:** weißer Grund, blasses
IMI-Wasserzeichen in der Mitte, eine kurze fette Überschrift oben –
abwechselnd mittig und rechtsbündig –, darunter unten links zwei bis drei
Sätze in leichter Schrift. Die letzte Kachel ist die Folgerung („Das Ziel",
„Die Folgen"), **keine Aufforderung zu folgen.**

### C — Zahlenkarte

Eine einzelne weiße Kachel, kein Karussell. Oben mittig Logo und Wortmarke
„IM Invests". Überschrift schwarz mit **dunkelgrün hervorgehobenen Wörtern**.
Darunter die Grafik: schwarzer Balken gegen dunkelgrünen, Werte darüber, die
Differenz dunkelrot dazwischen. Unten eine Fußzeile:

    Stand: 10.10.2026 | Quellen: Kursdaten, STOXX Europe 600, EZB

Die jüngste Sorte – der erste lief am 11.10.2026.

## Die Beschriftung hat eine feste Grammatik

In dieser Reihenfolge, durch Leerzeilen getrennt:

1. **Der Aufhänger** – ein Satz oder eine Frage, die den Beitrag trägt.
2. **Ein bis zwei kurze Absätze**: was es bedeutet, was erklärt wird.
3. **`Quellen: …`** – namentlich, mit Komma getrennt. Keine erfundenen.
4. **Der Rechtshinweis**, unverändert, beginnend mit „Keine Anlageberatung –
   nur Wissensvermittlung" und endend mit dem Hinweis, dass die Inhalte mit
   Unterstützung von KI erstellt wurden.
5. **Vier bis fünf Schlagworte**, **zum Thema** – `#china #eu #import #hybrid
#autos` beim Autobeitrag, `#wissen #news #neu #finanzen #investieren` beim
   Erklärbeitrag. Keine feste Liste.

## Was das Repository heute erzeugt – und warum es nicht passt

**Die Kacheln kommen aus dem Repository**, Meta holt sie von
`iminvests.de/instagram/N.jpg`; erzeugt werden sie in `lib/instagram-bild.tsx`.
**Die Beschriftung kam bisher aus dem Make-Szenario**, nicht aus
`app/instagram/beschriftung.txt/route.ts`.

Nachgesehen am 11.10.2026, beides nebeneinander:

|           | Kanal                                             | `lib/instagram-bild.tsx`                                                                                |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Deckblatt | Foto, „Top-News des Tages" in fetter Grotesk      | weiß, Logo, Datum, „DIE MELDUNGEN DES TAGES" in blauen Versalien, drei Schlagzeilen mit farbigen Linien |
| Innen     | weiß, Wasserzeichen, fette Überschrift, 2–3 Sätze | Rubrik + „1 von 3", Schlagzeile, „WAS DARAUS FOLGT"                                                     |
| Kacheln   | sechs bis zehn                                    | vier                                                                                                    |
| Fuß       | keiner                                            | `iminvests.de` · „Keine Anlageberatung" · vierfarbiger Balken                                           |

Die Beschriftung aus dem Repository hat weder Aufhänger noch die
Quellenzeile, einen anderen Rechtshinweis und feste statt thematischer
Schlagworte.

**Daraus folgt:** Der erste Beitrag, der direkt über die Graph-Schnittstelle
hinausgeht, bricht die Reihe – es sei denn, Kachelsatz und Beschriftung werden
vorher angeglichen. Das ist offene Arbeit und kein Versehen des Generators: Er
ist für die Website gebaut worden, nicht für diesen Kanal.

**Einen Erzeuger für Sorte B und C gibt es im Repository gar nicht.** Die
Beiträge dieser Sorten sind bisher außerhalb entstanden.

## Zwei Dinge, die beim Durchsehen auffielen

- Im Kacheltext vom 11.10. stehen unter der Rubrik **„MÄRKTE"** drei
  Meldungen, von denen zwei Kriegsmeldungen sind („23 Tote nach russischem
  Angriff", „Zwölf Tote bei Huthi-Angriff"). Auf einem Finanzbildungskanal
  unter dieser Rubrik ist das zumindest erklärungsbedürftig.
- Ein veröffentlichter Beitrag trägt den Titel **„Anthrophic X Nvidia?"** –
  das Unternehmen heißt Anthropic.
