# IM Invests

Deutschsprachige Finanzbildungs-Plattform: 22 Themen in je drei Lernstufen, fünf
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
`sitemap.xml` und `robots.txt`. Ohne sie greift die Platzhalter-Domain
`https://www.im-invests.example`.

```bash
cp .env.example .env.local   # und die echte Domain eintragen
```

> **Vor dem Live-Gang zwingend setzen.** Andernfalls zeigen alle canonical-URLs und
> die komplette Sitemap auf die Platzhalter-Domain.

## Projektstruktur

```
app/                    Routen (App Router), sitemap.ts, robots.ts, opengraph-image.tsx
components/
  calculators/          Rechner-Oberflächen und Formularbausteine
  charts/               Recharts-Diagramme, Sparkline (reines SVG), Chart-Tokens
  content/              Renderer für das Inhalts-Blockmodell
  debt/                 Ländervergleich (sortier- und filterbar)
  home/                 Rotierende News-Säule
  layout/               Header mit Mega-Menü, Footer, Theme-Umschalter
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

Der Workflow `paket-bauen.yml` baut die Website bei jedem Push auf `main` sowie
täglich um 04:15 UTC und legt sie als Paket unter _Actions → Artifacts → website_
zum Herunterladen ab. Hochgeladen wird über den Dateimanager des Hosters:

1. Paket herunterladen (eine ZIP-Datei)
2. Den Dateimanager über _Websites → iminvests.de → Dateimanager_ öffnen, **nicht**
   über den allgemeinen Dateimanager im Hauptmenü. Nur der erste Weg führt sicher
   in das Verzeichnis dieser Domain; der zweite öffnet `/public_html`, was bei
   einer Zusatzdomain der Ordner einer anderen Website ist.
3. Verzeichnis leeren – `.well-known` stehen lassen, darüber erneuert der Hoster
   das SSL-Zertifikat. Versteckte Dateien dafür einblenden.
4. ZIP hochladen und dort entpacken, „vorhandene Dateien überschreiben" anhaken
5. Prüfen, dass `index.html` direkt im Verzeichnis liegt und nicht in einem
   Unterordner – sonst liefert die Domain weiterhin nichts aus
6. ZIP löschen
7. Cache leeren (_Erweitert → Cache-Manager_) und `/version.txt` aufrufen: Stimmt
   der dort genannte Commit mit dem erwarteten überein, ist der Upload angekommen

**Warum von Hand:** Der Hoster hat den FTP-Zugang gesperrt. Nach drei
vollständigen Uploads mit zusammen rund 4.500 Zugriffen kommt die Verbindung zum
Port 21 nicht mehr zustande – belegt durch sieben Abfragen mit identischem
Ergebnis. Für 1.230 Einzeldateien ist FTP das falsche Werkzeug; der Upload einer
einzelnen Datei über den Browser funktioniert dagegen zuverlässig.

Der Workflow prüft vor dem Ablegen ausdrücklich, dass ein Stylesheet im Paket
liegt, dass mindestens 100 Seiten entstanden sind, dass `.htaccess` und
`version.txt` vorhanden sind und dass die echte Domain in der Sitemap steht.
Grund: Ein früherer Stand wurde ohne Stylesheet ausgeliefert, und niemand hat es
vor dem Hochladen bemerkt.

`version.txt` nennt Commit, Bauzeitpunkt und Laufnummer und ist nach dem Upload
unter `/version.txt` abrufbar. Die Datei ist aus einem konkreten Vorfall
entstanden: Über Tage lag ein Stand auf dem Server, der aus den ersten
25 Minuten des Projekts stammte – erkennbar allein daran, dass die Seite noch den
alten Markennamen trug. Welcher Stand ausgeliefert wird, darf keine Detektivarbeit
sein.

**Automatisch wird es wieder,** sobald ein Übertragungsweg ohne 1.230
Einzelverbindungen zur Verfügung steht – eine Git-Anbindung oder SSH beim Hoster.
Beides setzt einen Tarif voraus, der das anbietet.

## SEO

- **Eigene Seite je Inhalt**, keine Anker auf einer Monolith-Seite: 121 indexierbare
  URLs, davon 66 Lernstufen-Seiten (22 Themen × 3 Stufen).
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
3. **Impressum und Datenschutzerklärung** enthalten Platzhalter (`[BITTE ERSETZEN]`).
   Vor der Veröffentlichung durch echte Angaben ersetzen und rechtlich prüfen lassen –
   bei Finanzinhalten sind zusätzliche Anforderungen möglich.
4. **Quizfragen für die übrigen 20 Themen.** Sie entstehen jeweils zusammen mit dem
   Fließtext der Stufe – Struktur und Komponente stehen bereits.
5. **Text der Unternehmensphilosophie** (siehe Abschnitt oben).
6. **Kontaktformular.** Aktuell nur ein E-Mail-Link, weil die Seite statisch
   ausgeliefert wird. Ein Formular braucht serverseitige Verarbeitung, Spam-Schutz und
   eine Ergänzung der Datenschutzerklärung.

## Hinweis zu den Inhalten

Alle Inhalte dienen der Information und Bildung. Sie sind keine Anlage-, Steuer- oder
Rechtsberatung. Kurse, News und Verschuldungszahlen dieser Fassung sind Beispieldaten.
