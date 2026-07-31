---
name: newsupdate
description: Aktualisiert die Nachrichten auf im-invests – recherchiert echte Meldungen der letzten 24 Stunden, schreibt sie als eigene Artikel in data/news.ts, schiebt Ältere per rollierendem System ins Archiv und legt die Tagesausgabe an. Aufrufen, wenn der Nutzer /newsupdate schreibt oder sinngemäß sagt, die News seien veraltet und sollten erneuert werden.
---

# Nachrichten aktualisieren

Ein Durchlauf erzeugt neun neue Artikel aus echten Meldungen der letzten
24 Stunden plus eine Tagesausgabe, prüft alles und pusht auf den Arbeitsbranch.

Rechne mit 45–70 Minuten. Der Löwenanteil ist Recherche, nicht Tippen.

## Der wichtigste Grundsatz

**Keine erfundenen Meldungen. Keine erfundenen Zahlen. Keine Quelle, die du
nicht gesehen hast.** Bis Juli 2026 standen hier Beispieltexte; sie wurden
ersatzlos entfernt, und dorthin geht es nicht zurück. Jede Zahl im Text muss
über die angegebene Quelle nachprüfbar sein. Wenn sich zu einem Thema nichts
Belastbares finden lässt, schreibe lieber acht Artikel als neun mit einem
geratenen.

## 1. Recherche

**Erst der Zugang, dann die Themen.** `WebFetch` erreicht aus dieser Umgebung
keine einzige Nachrichtenquelle — der Egress-Proxy antwortet mit 403. Das ist
kein Grund abzubrechen, sondern der Grund für
`.github/workflows/quellen-holen.yml`: Ein GitHub-Läufer holt die Seiten und
schreibt ihren Text ins Protokoll, das du lesen kannst. Der Ablauf steht in
`AGENTS.md` unter „Diese Umgebung erreicht nur GitHub“.

Damit gilt die Arbeitsteilung:

- **`WebSearch` findet Adressen.** Seine Zusammenfassungen sind **kein Beleg** —
  sie haben zum selben Goldpreis schon zwei einander widersprechende Zahlen
  geliefert. Nimm daraus die Links, nicht die Werte.
- **`quellen-holen.yml` liefert den Text**, der im Artikel belegt wird.
- Primärquellen bevorzugen; Portale mit viel Navigationsbeiwerk (finanzen.net,
  boerse.de) kommen fast nur als Menüleisten heraus.

Was gebraucht wird:

- **Neun Meldungen aus den letzten 24 Stunden.** Prüfe das Datum, nicht nur die
  Überschrift — Suchmaschinen liefern gerne Evergreens und Ratgeberseiten aus.
- **Deutschsprachige, benennbare Quellen bevorzugt**: ifo, Bundesbank, EZB,
  Handelsblatt, onvista, wallstreet-online, boersennews, Finanztip, LBBW,
  Goldreporter, Unternehmens-IR-Seiten. Aggregatoren aus Drittländern nur, wenn
  es nichts Besseres gibt — und dann mit vorsichtiger Formulierung.
- **Zahlen gegenprüfen.** Kursangaben unterscheiden sich je nach Uhrzeit stark.
  Wenn zwei Quellen sich widersprechen (Brent „auf 92 Dollar" gegen „auf 88
  Dollar"), sind meist beide richtig und meinen verschiedene Tageszeiten:
  Schreib die Uhrzeit dazu, statt dich für eine Zahl zu entscheiden.

An einem Tag mit einem beherrschenden Thema (Notenbank, Geopolitik) sind sechs
von neun Artikeln zu diesem Thema normal und richtig. Erfinde keine Vielfalt,
die es an dem Tag nicht gab.

Suchanfragen, die verlässlich etwas bringen:

```
Börse Nachrichten <Datum> DAX Wall Street
<Datum> ifo Geschäftsklimaindex / Inflation / Arbeitsmarkt
Fed Zinsentscheid <Datum> Erwartung Leitzins
Goldpreis <Datum> aktuell   ·   Bitcoin Kurs <Datum>
Ölpreis Brent <Datum>       ·   Quartalszahlen Woche <Datum>
```

## 2. Schreiben

Ziel ist **nicht**, eine Meldung nachzuerzählen. Ziel ist, an ihr etwas zu
erklären, das der Leser danach dauerhaft kann. Jeder Artikel braucht einen
Lehrwinkel — die Meldung ist der Anlass, nicht der Inhalt.

Bewährte Muster:

| Meldung                               | Lehrwinkel                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Index springt nach Wochenendnachricht | Was eine Kurslücke ist und warum Markttiming daran scheitert               |
| Rohstoff bricht ein                   | Bezugspunkt entscheidet; warum ein Rohstoff schneller fällt als eine Aktie |
| Stimmungsindex steigt                 | Lage gegen Erwartung; ein Index ohne Einheit                               |
| Notenbank tagt                        | Erwartetes ist eingepreist — es bewegt nur die Abweichung                  |
| Quartalszahlen                        | Warum ein Kurs nach Rekordzahlen fallen kann                               |
| Gold in Dollar und Euro               | Ein Euro-Preis hat zwei Ursachen                                           |
| Krypto am Wochenende                  | 365 gegen 252 Handelstage, Vergleiche werden schief                        |

Rechtlicher Rahmen, kurz: Tatsachen sind frei (§ 49 Abs. 2 UrhG), die
Formulierung ist geschützt (§ 2 UrhG). **Also zusammenfassen, nie spiegeln** —
keine Volltexte, keine längeren Auszüge, keine fremden Bilder. Der Link auf die
Quelle ist Pflicht und zugleich der Grund, warum das zulässig ist.

Und: keine Anlageberatung. „Was daraus folgt" endet mit einer Überlegung, nie
mit einer Empfehlung, etwas zu kaufen oder zu verkaufen.

## 3. Eintragen

Neue Artikel kommen **an den Anfang** von `newsArticles` in `data/news.ts`.
Nichts löschen: Was hinten herausfällt, ist das Archiv und bleibt vollständig
erreichbar. Die Grenze zwischen „Aktuelles" und „Weitere Artikel" zieht allein
`CURRENT_NEWS_COUNT` in `lib/news.ts` (aktuell 9) — kein Kennzeichen in den
Daten, kein Umtragen von Hand.

**Das Archiv ist dauerhaft.** Es gibt keine Verfallszeit, weder dreißig Tage
noch sonst eine: Ein einmal veröffentlichter Artikel bleibt. Also auch beim
Aufräumen keine alten Artikel entfernen — jeder Verweis, der je auf ihn gesetzt
wurde, hinge sonst in der Luft, und jede Tagesausgabe verlöre ihre Hälfte.

Pflichtfelder je Artikel siehe `interface NewsArticle`. Was `lib/news-validate.ts`
beim Bauen erzwingt — daran scheitert der Build, nicht nur eine Warnung:

- `slug`: nur Kleinbuchstaben, Ziffern, Bindestriche; eindeutig
- `teaser`: **100 bis 200 Zeichen** (er ist zugleich die Meta-Description)
- `title` über 65 Zeichen ⇒ zusätzlich `metaTitle`
- `publishedAt`: ISO 8601 **mit Zeitzone** (`+02:00`), unser Erscheinungsdatum
- `sources`: mindestens eine, `https://`, mit lesbarer Beschriftung
- `relatedTopics`: nur existierende Slugs aus `data/learn`
- `relatedSymbols`: nur existierende Symbole aus `data/markets.ts`

Die beiden Listen holst du dir so:

```bash
grep -oE "slug: '[a-z0-9-]+'" data/learn/topics/*.ts | sed "s/.*slug: '//;s/'//" | sort -u
grep -oE "^    symbol: '[a-z0-9-]+'" data/markets.ts | sed "s/.*symbol: '//;s/'//"
```

Verfügbare Blocktypen im `body` stehen in `data/content.ts`: `paragraph`,
`heading` (Ebene 2/3), `list`, `callout` (`info` | `tip` | `warning`), `quote`,
`table`, `formula`, `keyfacts`, `figure`. `**fett**` funktioniert im Fließtext.

Kategorien: `Geldpolitik` · `Märkte` · `Vorsorge` · `Steuern & Recht` ·
`Geldanlage`.

## 4. Tagesausgabe

Der Tagesüberblick unter `/news/tag/<datum>` ist ein **eigener** Datenbestand
und veraltet sonst still mit. Aus derselben Recherche entsteht er in Minuten:

1. `data/editions/JJJJ-MM-TT.ts` anlegen — die wichtigsten Meldungen als `top`,
   weitere als `further`. Drei plus zwei ist der Regelfall und eine gute
   Voreinstellung, aber **keine Vorschrift**: Erzwungen sind nur mindestens eine
   Top-Meldung und mindestens drei insgesamt (`lib/editions-validate.ts`). Gibt
   der Tag zwei her, die diesen Namen verdienen, schreibe zwei; gibt er sieben
   her, schreibe sieben. Bis Juli 2026 stand hier ein Tupel-Typ, der 3 + 2
   erzwang — eine Regel über die Nachrichtenlage, an die sich die Nachrichtenlage
   nicht hält.
2. In `data/editions/index.ts` importieren **und** in das Array eintragen.
   Beides, sonst schlägt `tests/` oder der Build fehl.
3. `intro`: **110 bis 165 Zeichen**. Das ist die häufigste Fehlerquelle —
   vorher zählen: `python3 -c "print(len('…'))"`.
4. `whyItMatters` ist Pflicht je Meldung und der eigentliche Zweck der Rubrik.

## 5. Prüfen

Alles muss durchlaufen, in dieser Reihenfolge:

```bash
npx prettier --write data/ lib/
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Der Build ist die scharfe Prüfung: `assertNewsValid` und
`assertEditionsValid` werfen beim Laden der Module. Eine fehlerhafte Meldung
bricht ihn ab — das ist Absicht.

Danach die gebaute Seite ansehen, nicht nur den grünen Build glauben:

```bash
(npx --yes http-server out -p 4180 -s &) ; sleep 4
```

Mit Playwright (`executablePath: '/opt/pw-browsers/chromium'`) prüfen, dass
unter „Aktuelles" auf `/news/` genau `CURRENT_NEWS_COUNT` Artikel stehen und
der Tagesüberblick das neue Datum trägt.

## 6. Ausliefern

```bash
git add -A
git commit   # Betreff: "Nachrichten: Ausgabe vom <Datum>"
git push -u origin claude/webseite-aktueller-stand-ntky1w
```

**Danach dem Nutzer sagen, dass es noch nicht live ist.** Hostinger baut erst
bei einem Push auf `main`. Solange nicht gemerged wurde, steht auf der Website
weiterhin die alte Ausgabe — dieser Punkt geht am häufigsten unter.

## Nach dem Durchlauf berichten

- Welche neun Meldungen, mit Datum und Quelle
- Was ins Archiv gerutscht ist (Anzahl, nicht Aufzählung)
- Ob eine Recherche ergebnislos blieb und warum
- Der Merge-Hinweis aus Schritt 6
