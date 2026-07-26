# IM Invests

Deutschsprachige Finanzbildungs-Plattform: 23 Themen in je drei Lernstufen, fünf
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
  layout/               Header mit Mega-Menü und Suche, Footer, Theme-Umschalter,
                        gleitendes Scrollen
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
| `lib/news.ts`    | `getNewsArticles()`, `getNewsArticle()`, `getNewsHeadlines()`  |
| `lib/learn.ts`   | `getLearnTopics()`, `getLearnLevel()`, `getRelatedTopics()`    |
| `lib/debt.ts`    | `getCountryDebts()`, `getDebtSummary()`                        |

Alle Funktionen sind bereits `async`. Für echte APIs muss deshalb nur der jeweilige
Funktionsrumpf ausgetauscht werden – kein Aufrufer ändert sich.

## Lernbereich und Wissenscheck

Jede Lernstufe endet mit einem **Wissenscheck**: Multiple-Choice-Fragen mit genau einer
richtigen Antwort, Frage für Frage, mit Begründung nach jeder Antwort – auch bei richtiger
Antwort, denn dort liegt der Lernwert. Am Ende folgt eine Auswertung; ab 60 Prozent
richtiger Antworten kann die Stufe als erledigt markiert werden.

- Fragen liegen zentral in `data/learn/quizzes.ts`, Schlüssel `themen-slug:stufe`.
- Aktuell 24 Fragen zu den sechs vollständig ausformulierten Stufen (`aktie`,
  `zinseszins`). Stufen ohne Fragen zeigen einen entsprechenden Hinweis – Fragen zu
  einer Gliederung wären nicht beantwortbar.
- **Regel bei neuen Fragen:** Die Position der richtigen Antwort muss wechseln. Liegt sie
  immer an derselben Stelle, lässt sich das Quiz ohne Lesen bestehen. Derzeit verteilen
  sich die 24 Fragen gleichmäßig auf die vier Positionen.
- Fortschritt und Bestergebnisse liegen ausschließlich im localStorage
  (`fk-learn-progress`, `fk-quiz-results`) – kein Konto, keine Serverübertragung.

## Unternehmensphilosophie

`app/unternehmensphilosophie/page.tsx` steht als Gerüst bereit, der Text wird redaktionell
verfasst. Bearbeitet wird ausschließlich `data/philosophy.ts`:

1. Je Abschnitt `paragraphs` füllen – der Text ersetzt dann automatisch den Arbeitshinweis.
2. Ist alles geschrieben: `PHILOSOPHY_PUBLISHED` auf `true` setzen.

Solange die Seite nicht veröffentlicht ist, wird sie mit `noindex` ausgeliefert und **nicht**
in die Sitemap aufgenommen; eine fast leere Seite im Index würde die Sichtbarkeit der
gesamten Domain belasten. Über die Fußzeile bleibt sie zum Korrekturlesen erreichbar.

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

## Suche

Die Lupe in der Kopfzeile öffnet eine Suche über alle Inhalte – Bereichsseiten,
23 Lernthemen mit ihren 69 Stufen, fünf Rechner, alle Kurse, Nachrichten,
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

- **Eigene Seite je Inhalt**, keine Anker auf einer Monolith-Seite: 121 indexierbare
  URLs, davon 69 Lernstufen-Seiten (23 Themen × 3 Stufen).
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

Verifiziert wurde das über alle 121 Sitemap-URLs (h1-Anzahl, canonical, `og:image`,
JSON-LD, Breadcrumb, Titel- und Description-Länge, Überschriftensprünge) sowie über
48 Seiten-Viewport-Kombinationen im Browser (kein horizontaler Overflow, keine
JS-Fehler bei 360/768/1440 px).

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

## Was noch fehlt

1. **Echte Live-Daten.** Kurse, News und Verschuldungszahlen sind Demo-Daten. Die
   Kursverläufe werden in `lib/market-series.ts` deterministisch erzeugt (fester
   Zufalls-Seed, daher reproduzierbare Builds). Auf jeder betroffenen Seite steht das
   sichtbar. Für echte Daten: `lib/markets.ts` bzw. `lib/news.ts` umstellen, API-Keys
   über Umgebungsvariablen einbinden.
2. **Fließtext für 20 Lernthemen.** Vollständig ausformuliert sind `aktie` und
   `zinseszins` (je drei Stufen). Die übrigen Themen haben funktionsfähige Seiten mit
   Meta-Daten, Permalink und inhaltlicher Gliederung; der Status `outline` wird auf der
   Seite ausgewiesen.
3. **Rechtliche Prüfung von Impressum und Datenschutzerklärung.** Beide Seiten sind
   ausgefüllt – Anbieter, Anschrift und Kontakt stehen in `lib/provider.ts`, die
   Erklärung beschreibt, was die Website tatsächlich tut. Zwei Angaben fehlen noch:
   Firmierung und Anschrift des Hosters sowie dessen Speicherdauer für
   Protokolldateien. Sie stehen in dessen eigener Datenschutzerklärung und sind dort
   nachzutragen, statt sie zu schätzen. Eine anwaltliche Prüfung vor dem endgültigen
   Live-Gang bleibt zu empfehlen, bei Finanzinhalten erst recht.
4. **Quizfragen für die übrigen 20 Themen.** Sie entstehen jeweils zusammen mit dem
   Fließtext der Stufe – Struktur und Komponente stehen bereits.
5. **Text der Unternehmensphilosophie** (siehe Abschnitt oben).
6. **Kontaktformular.** Aktuell nur ein E-Mail-Link, weil die Seite statisch
   ausgeliefert wird. Ein Formular braucht serverseitige Verarbeitung, Spam-Schutz und
   eine Ergänzung der Datenschutzerklärung.

## Hinweis zu den Inhalten

Alle Inhalte dienen der Information und Bildung. Sie sind keine Anlage-, Steuer- oder
Rechtsberatung. Kurse, News und Verschuldungszahlen dieser Fassung sind Beispieldaten.
