/**
 * Schreibt die Tagesausgabe – auf einem Läufer, nicht in einer Sitzung.
 *
 * ## Warum es das gibt
 *
 * Weil die Nachrichten-Routine zwischen dem 31. Juli und dem 5. August 2026 an
 * keinem einzigen Tag eine Ausgabe erzeugt hat. Nachgezählt: Alle fünf
 * Ausgaben dieser Woche entstanden in einer interaktiven Sitzung und wurden
 * über einen Pull Request gemergt. Die Automatik feuerte jeden Morgen
 * pünktlich, lieferte nichts, und niemand erfuhr davon.
 *
 * Der Grund liegt außerhalb dieses Repositorys: Die Sitzung einer Routine
 * bekommt eine feste Werkzeugliste ohne `mcp__github__*`, kommt damit weder an
 * eine Nachrichtenseite (Egress-Proxy, 403) noch an den Läufer, der es könnte –
 * und ihre Protokolle sind von außen nicht einsehbar. Ein Fehler dort ist nicht
 * diagnostizierbar, und was sich nicht diagnostizieren lässt, lässt sich nicht
 * reparieren.
 *
 * Dieses Skript dreht die Abhängigkeit um: Der Läufer holt die Quellen, ruft
 * das Modell und schreibt die Dateien. Alles steht im Workflow-Protokoll, jeder
 * Fehlschlag ist ein roter Lauf, und ein roter Lauf schickt eine Mail.
 *
 * ## Warum das Modell strukturierte Daten liefert und keine Dateien schreibt
 *
 * Weil eine TypeScript-Datei hundert Arten hat, falsch zu sein, und ein JSON
 * mit festem Schema genau eine: Es fehlt ein Feld. Das Modell liefert deshalb
 * Artikel und Ausgabe als Daten; dieses Skript prüft sie gegen dieselben Regeln
 * wie der Build und erzeugt daraus den Quelltext.
 *
 * Wird eine Regel verletzt, bricht der Lauf ab, **bevor** etwas geschrieben
 * ist. Eine halbe Ausgabe im Repository wäre schlimmer als keine.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { positionierungen } from '../lib/editions-validate.ts'

// ---------------------------------------------------------------- Regelwerk

/** Aus `lib/news-validate.ts` – hier gespiegelt, damit der Bruch früh kommt. */
const TEASER_MIN = 100
const TEASER_MAX = 160
const INTRO_MIN = 110
/*
  160, nicht 165 – dieselbe Zahl wie `BESCHREIBUNG_MAX` in
  `scripts/paket-pruefen.ts`. Die Tagesseite setzt das `intro` unverändert als
  Meta-Description; alles darüber bricht den Bau. Am 16. August 2026 hat genau
  das die Ausgabe des Tages gekostet. `tests/intro-grenze.test.ts` hält die
  drei Stellen zusammen.
*/
const INTRO_MAX = 160
const TITEL_OHNE_META_MAX = 65

/**
 * Aus `lib/editions-validate.ts` – und der Grund, warum dieses Skript eine
 * Trockenprobe hat.
 *
 * Beim ersten Durchgang fehlten diese beiden Grenzen hier. Die Prüfung im
 * Skript lief durch, die Dateien wurden geschrieben, und erst `npm run build`
 * brach ab: „whyItMatters fehlt oder ist zu knapp". Im echten Lauf wäre das
 * ein roter Workflow nach dem Schreiben gewesen – reparierbar, aber unnötig.
 */
const SUMMARY_MIN = 40
const WARUM_MIN = 40
const TOP_MAX = 6
const MELDUNGEN_MAX = 12

/**
 * Wie viele Meldungen die Tagesausgabe mindestens trägt.
 *
 * ## Warum hier fünf steht und in `lib/editions-validate.ts` drei
 *
 * Weil die beiden Zahlen verschiedene Fragen beantworten. `ITEMS_MIN = 3`
 * dort fragt: „Ist diese Ausgabe noch eine Ausgabe?" – das ist die Grenze,
 * unter der die Website bricht, und sie muss niedrig bleiben, weil fünf
 * Ausgaben im Bestand darunter liegen. Diese Zahl hier fragt: „Hat das
 * Modell geliefert, was bestellt war?" – und bestellt sind laut `AGENTS.md`
 * fünf bis zehn Artikel und laut Prompt dieselben Meldungen in der Ausgabe.
 *
 * ## Der Anlass
 *
 * Die Folge vom 28. September 2026. Der Betreiber: „viel zu kurz, das Intro
 * und die Aufklärung danach gehen genauso lange wie der Podcast." Sie hatte
 * 86 Wörter Nachricht gegen 103 Wörter Gerüst.
 *
 * Die Ausgabe hatte **vier** Meldungen – und der Tag **sechs** Artikel. Das
 * Material lag vor, es kam nur nicht in die Ausgabe. Im Prompt steht seit
 * jeher „Die Tagesausgabe fasst dieselben Meldungen zusammen"; geprüft hat
 * das niemand. Geprüft wurde `artikel.length < 5` – die Zahl, die auf der
 * Website landet – und `< 3` für die Meldungen, die gesprochen werden.
 *
 * **Ein Satz im Prompt ist keine Regel, solange ihn kein Prüfer liest.**
 * Dieselbe Lehre wie beim Satzrhythmus am Tag davor.
 *
 * ## Woran die Zahl gewählt ist, und was sie sonst fände
 *
 * An den 65 Ausgaben seit dem 25. Juli 2026. Meldungen je Ausgabe:
 *
 *     unter fünf:  5 Tage   28.09. (4) · 27.09. (4) · 17.09. (3) ·
 *                           13.08. (4) · 02.08. (4)
 *     fünf:       18 Tage
 *     sechs+:     42 Tage
 *
 * An vier dieser fünf Tage standen **mehr Artikel als Meldungen** bereit;
 * die Grenze hätte also einen zweiten Anlauf verlangt und nicht einen Tag
 * gekostet. Der fünfte (02.08.) hatte selbst nur vier Artikel und wäre
 * schon an `artikel.length < 5` gescheitert – die neue Grenze verwirft
 * damit keinen Tag, den die alte durchgelassen hätte.
 *
 * ## Warum ein Abbruch hier vertretbar ist und in der Folge nicht
 *
 * Weil noch nichts geschrieben ist. `nachrichten-agent.yml` läuft um 02:33,
 * 03:03 und 03:33; danach greift das Modell über die Schnittstelle. Ein
 * verworfener Entwurf kostet eine halbe Stunde, keine Ausgabe.
 */
const MELDUNGEN_MIN = 5

/**
 * Das feste Gerüst der Folge in Wörtern – und damit die Untergrenze für alles,
 * was gesprochen wird.
 *
 * Begrüßung, KI-Hinweis, Rechtshinweis und Abschied stehen wörtlich in
 * `lib/sprechfassung.ts` und wachsen nicht mit. Nachgemessen an allen 65
 * Folgen seit dem 25. Juli 2026: zwischen 99 und 110 Wörtern, Median 104.
 * (Vor dem Zusammenziehen der Umschriften am selben Tag waren es 103 bis
 * 116 – „Uh Ess“ zählte als zwei Wörter, „Juh-Ess“ zählt als eins.)
 *
 * 110 ist der **Höchstwert** dieser Spanne, nicht ihr Mittel: Die Meldungen
 * sollen mehr wiegen als das Gerüst an seinem längsten Tag.
 *
 * Die Grenze ist der Satz des Betreibers vom 28. September 2026, in eine Zahl
 * übersetzt: Die Meldungen müssen mehr wiegen als das Kleingedruckte. Die
 * `summary`-Absätze aller 65 Ausgaben, aufsteigend:
 *
 *     79 · 130 · 159 · 159 · 162 · 162 · 167 · 178 · 184 · 188 · …
 *     Median 246, Höchstwert 529
 *
 * Genau eine Ausgabe liegt darunter – die gemeldete. Zur zweitdünnsten sind
 * es 51 Wörter Abstand; das ist keine Grenze, die den guten Tag gerade eben
 * trägt.
 *
 * Gezählt wird nur `summary`: `whyItMatters` steht seit dem 16. September
 * 2026 nicht mehr in der Folge, sondern nur noch auf der Website.
 */
const GERUEST_WOERTER = 110

const KATEGORIEN = [
  'Geldpolitik',
  'Märkte',
  'Vorsorge',
  'Steuern & Recht',
  'Geldanlage',
] as const

interface Quelle {
  label: string
  url: string
}

interface Artikel {
  slug: string
  title: string
  metaTitle?: string
  teaser: string
  category: string
  readingMinutes: number
  tags: string[]
  relatedTopics: string[]
  relatedSymbols: string[]
  sources: Quelle[]
  body: { type: 'paragraph' | 'heading'; text: string; level?: number }[]
}

interface Meldung {
  headline: string
  summary: string[]
  category: string
  whyItMatters: string
  relatedTopics: string[]
  relatedSymbols: string[]
  sources: Quelle[]
}

interface Antwort {
  intro: string
  artikel: Artikel[]
  top: Meldung[]
  further: Meldung[]
}

// ------------------------------------------------------------------ Eingabe

function pflicht(name: string): string {
  const wert = process.env[name]
  if (!wert) {
    console.error(`::error::${name} fehlt.`)
    if (name === 'ANTHROPIC_API_KEY') {
      console.error(
        '  Der Schlüssel gehört als Repository-Secret hinterlegt:\n' +
          '  Settings > Secrets and variables > Actions > New repository secret.\n' +
          '  Ohne ihn kann dieser Lauf keine Ausgabe schreiben.'
      )
    }
    process.exit(1)
  }
  return wert
}

/**
 * Wohin die Anfrage geht – voreingestellt die Anthropic-Schnittstelle.
 *
 * ## Warum das einstellbar ist
 *
 * Der Betreiber hat am 20. August 2026 nach einem Zwischendienst gefragt, der
 * Anfragen auf mehrere Anbieter verteilt. Diese Zeile ist die kleinste
 * Antwort darauf: Wer so etwas davorschalten will, setzt ein Secret und nimmt
 * es wieder weg. Es steht kein Anbieter im Code, es hängt keine Abhängigkeit
 * daran, und ohne die Variable ändert sich **nichts**.
 *
 * ## Was zu bedenken ist, bevor jemand sie setzt
 *
 * Der Prompt dieses Laufs enthält den gelesenen Quelltext der Meldungen, und
 * das Ergebnis erscheint am nächsten Morgen auf einer öffentlichen Website.
 * Ein Zwischendienst sieht beides. Und wer unterwegs Prompts kürzt – manche
 * werben damit –, kürzt hier an Zahlen, Namen und Zeitangaben: genau dem
 * Material, für das `AGENTS.md` „keine erfundenen Zahlen" verlangt.
 *
 * Deshalb Vorgabe ist die Schnittstelle selbst, und die Umleitung ein
 * ausdrücklicher Handgriff.
 *
 * Die Adresse wird ohne abschließenden Schrägstrich geführt; `/v1/messages`
 * hängt der Aufrufer an. Eine Adresse mit Pfad bleibt erhalten, damit ein
 * Zwischendienst unter einem Unterpfad liegen darf.
 */
export function basisadresse(): string {
  const gesetzt = (process.env.ANTHROPIC_BASE_URL || '').trim()
  if (!gesetzt) return 'https://api.anthropic.com'

  /*
    Nur https, und die Antwort darauf ist keine Förmlichkeit: Über diese
    Verbindung geht der Schlüssel als `x-api-key` mit. Eine Adresse ohne
    Verschlüsselung gäbe ihn im Klartext weiter, und das darf keine
    Umgebungsvariable versehentlich können.
  */
  if (!gesetzt.startsWith('https://')) {
    console.error(
      `::error::ANTHROPIC_BASE_URL muss mit https:// beginnen – gesetzt ist „${gesetzt}".\n` +
        '  Über diese Verbindung geht der API-Schlüssel mit.'
    )
    process.exit(1)
  }

  return gesetzt.replace(/\/+$/, '')
}

/*
  Was der Lauf gekostet hat, in Dollar, im Protokoll.

  Nicht der Buchhaltung wegen, sondern damit die Frage „lohnt das?" eine Zahl
  hat statt einer Schätzung. Die Preise sind Stand 24. Juni 2026 und je Million
  Tokens; ändert Anthropic sie, stimmt die Zeile nicht mehr — sie ist ein
  Anhaltspunkt, keine Rechnung.
*/
const PREISE: Record<string, { hinein: number; hinaus: number }> = {
  'claude-opus-5': { hinein: 5, hinaus: 25 },
  'claude-sonnet-5': { hinein: 3, hinaus: 15 },
  'claude-haiku-4-5': { hinein: 1, hinaus: 5 },
}

function preisSatz(
  modell: string,
  nutzung: { input_tokens: number; output_tokens: number }
): string {
  const preis = PREISE[modell]
  if (!preis) return 'unbekannt – für dieses Modell ist hier kein Preis hinterlegt.'
  const dollar =
    (nutzung.input_tokens * preis.hinein + nutzung.output_tokens * preis.hinaus) /
    1_000_000
  return `${dollar.toFixed(3)} $ (rund ${(dollar * 30).toFixed(2)} $ im Monat, wenn jeder Tag so aussieht)`
}

/**
 * Woher die Ausgabe stammt – ein Satz für den Kopf der Ausgabedatei.
 *
 * Ohne Quellendatei darf dort nicht „Quellenlage laut Kopf der Datei:" mit
 * einem leeren Wert stehen. Das sähe nach einer Angabe aus, wo keine ist –
 * und eine leere Herkunftsangabe ist schlimmer als eine ehrliche Lücke.
 */
function herkunftssatz(kopf: string): string {
  const sauber = kopf.replace(/^#\s*/, '').trim()
  return sauber
    ? `Quellenlage laut Kopf der Datei: ${sauber}`
    : 'Ohne gesammelte Quellendatei erzeugt – die Herkunft steht an jedem Artikel.'
}

function erlaubteWerte(datei: string, muster: RegExp): Set<string> {
  const inhalt = readFileSync(datei, 'utf8')
  const treffer = new Set<string>()
  for (const m of inhalt.matchAll(muster)) treffer.add(m[1])
  return treffer
}

// -------------------------------------------------------------------- Modell

/**
 * Das Schema, an das sich die Antwort halten muss.
 *
 * Bewusst als Werkzeug und nicht als Bitte im Fließtext: Ein Werkzeugaufruf
 * wird von der Schnittstelle gegen das Schema geprüft, ein „bitte antworte in
 * JSON" nicht.
 */
const WERKZEUG = {
  name: 'tagesausgabe',
  description: 'Die fertige Nachrichtenausgabe des Tages.',
  input_schema: {
    type: 'object',
    required: ['intro', 'artikel', 'top', 'further'],
    properties: {
      intro: {
        type: 'string',
        description: `Anreißer der Tagesausgabe, ${INTRO_MIN} bis ${INTRO_MAX} Zeichen.`,
      },
      artikel: {
        type: 'array',
        minItems: 5,
        maxItems: 9,
        items: {
          type: 'object',
          required: [
            'slug',
            'title',
            'teaser',
            'category',
            'readingMinutes',
            'tags',
            'relatedTopics',
            'relatedSymbols',
            'sources',
            'body',
          ],
          properties: {
            slug: { type: 'string', description: 'kleinbuchstaben-mit-bindestrichen' },
            title: { type: 'string' },
            metaTitle: {
              type: 'string',
              description: `Nur nötig, wenn title länger als ${TITEL_OHNE_META_MAX} Zeichen ist.`,
            },
            teaser: {
              type: 'string',
              description: `${TEASER_MIN} bis ${TEASER_MAX} Zeichen. Zugleich die Meta-Description.`,
            },
            category: { type: 'string', enum: [...KATEGORIEN] },
            readingMinutes: { type: 'integer', minimum: 3, maximum: 8 },
            tags: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
            relatedTopics: { type: 'array', items: { type: 'string' }, minItems: 1 },
            relatedSymbols: { type: 'array', items: { type: 'string' } },
            sources: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['label', 'url'],
                properties: { label: { type: 'string' }, url: { type: 'string' } },
              },
            },
            body: {
              type: 'array',
              minItems: 5,
              items: {
                type: 'object',
                required: ['type', 'text'],
                properties: {
                  type: { type: 'string', enum: ['paragraph', 'heading'] },
                  text: { type: 'string' },
                  level: { type: 'integer', enum: [2, 3] },
                },
              },
            },
          },
        },
      },
      top: {
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: { $ref: '#/$defs/meldung' },
      },
      further: { type: 'array', maxItems: 6, items: { $ref: '#/$defs/meldung' } },
    },
    $defs: {
      meldung: {
        type: 'object',
        required: [
          'headline',
          'summary',
          'category',
          'whyItMatters',
          'relatedTopics',
          'relatedSymbols',
          'sources',
        ],
        properties: {
          headline: { type: 'string' },
          summary: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 },
          category: { type: 'string', enum: [...KATEGORIEN] },
          whyItMatters: { type: 'string' },
          relatedTopics: { type: 'array', items: { type: 'string' }, minItems: 1 },
          relatedSymbols: { type: 'array', items: { type: 'string' } },
          sources: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['label', 'url'],
              properties: { label: { type: 'string' }, url: { type: 'string' } },
            },
          },
        },
      },
    },
  },
}

function anweisung(
  heute: string,
  themen: string[],
  symbole: string[],
  quellen: string
): string {
  return `Du schreibst die Nachrichtenausgabe vom ${heute} für IM Invests, eine deutschsprachige Website zur Finanzbildung.

# Der wichtigste Grundsatz

**Keine erfundenen Meldungen. Keine erfundenen Zahlen. Keine Quelle, die du nicht gesehen hast.**

Unten stehen die Nachrichtenübersichten, die heute früh von einem Läufer abgerufen wurden – mit Adresse, Statuscode und Zeitstempel je Abschnitt. **Nur was dort steht, darfst du verwenden.**

Eine Ticker-Zeile ist eine Tatsachenbehauptung mit Zeitstempel: „7:21 Uhr — Lufthansa verdient im 2. Quartal weniger als erwartet". Diese Tatsache darfst du wiedergeben. **Die Begründung darfst du nicht ergänzen.** Steht in der Zeile kein Warum, schreibst du kein Warum – sag im Artikel ausdrücklich, dass die Begründung aus der Meldung nicht hervorgeht. Das ist ehrlicher und für den Leser lehrreicher als eine plausible Erfindung.

Gesponserte oder als „Anzeige" gekennzeichnete Texte sind keine Quelle.

# Was einen Artikel trägt

Nicht die Meldung, sondern der **Lehrwinkel**. Die Meldung ist der Anlass; der Leser soll danach etwas können, das er vorher nicht konnte. Bewährte Muster: Guidance gegen Ist-Zahlen · Auftragseingang gegen Umsatz · Umsatz gegen Marge · Rückkauf gegen Dividende · Performanceindex gegen Kursindex · nachbörslicher Handel · Abzinsung · Korrelation gegen Gegenläufigkeit · Risikoprämie · eingepreiste Erwartung.

Jeder Artikel endet mit einem Absatz, der mit „**Was daraus folgt:**" beginnt. Der endet mit einer Überlegung, **nie** mit einer Empfehlung zu kaufen oder zu verkaufen – diese Website gibt keine Anlageberatung.

Ton: sachlich, erklärend, per Du zum Leser nur wo es passt, keine Ausrufezeichen, keine Superlative. \`**fett**\` und \`*kursiv*\` funktionieren im Fließtext.

# Umfang und Mischung

Fünf bis neun Artikel aus **mehreren Quellen zu mehreren Themen**. Lieber fünf belegte als neun mit einem geratenen. Eine einzelne Quelle, aus der fünf Artikel stammen und alle dasselbe Thema haben, erfüllt die Zahl und verfehlt die Sache.

Die Tagesausgabe fasst dieselben Meldungen zusammen: ein bis drei unter \`top\`, der Rest unter \`further\`. **Jeder Artikel bekommt seine Meldung** – die Ausgabe wählt nicht aus, sie ordnet. Weniger als ${MELDUNGEN_MIN} Meldungen werden zurückgewiesen.

Die Folge am nächsten Morgen besteht aus diesen \`summary\`-Absätzen und sonst nichts. Begrüßung, KI-Hinweis, Rechtshinweis und Abschied sind zusammen rund ${GERUEST_WOERTER} Wörter – festes Gerüst, das nicht mitwächst. Bei vier knappen Meldungen ist die Hälfte der Folge Kleingedrucktes, und genau das hat der Betreiber am 28. September 2026 beanstandet.

**Alle \`summary\`-Absätze zusammen müssen deshalb mehr als ${GERUEST_WOERTER} Wörter ergeben** – sonst wird die Ausgabe zurückgewiesen. Der Mittelwert der letzten zwei Monate liegt bei 246; 40 bis 70 Wörter je Meldung treffen ihn.

# Die Tagesausgabe ist zugleich der Podcast

\`summary\` wird **wörtlich gesprochen**. Die Folge am nächsten Morgen besteht aus nichts anderem als diesen Absätzen, der Reihe nach. Daraus folgen drei Dinge:

**1. \`summary\` und \`whyItMatters\` werden nicht vermischt.**

- \`summary\` ist die **Nachricht**: was geschehen ist, mit Zahlen, Namen und Uhrzeiten. Keine Erklärung, keine Herleitung, keine Lehre.
- \`whyItMatters\` ist die **Einordnung** – ein Satz darüber, was der Leser damit anfängt. Er steht auf der Website und kommt **nicht** in die Folge.

Ein Satz wie „Steigende Renditen drücken Aktienbewertungen über die Abzinsung künftiger Gewinne" gehört nach \`whyItMatters\`. In \`summary\` gehört: „Die Rendite zehnjähriger US-Anleihen stieg über 4,67 Prozent."

**2. Die Folge handelt von Wirtschaft und Politik.** Die Rangfolge unter \`top\` ist die Rangfolge der Folge; oben steht, was den Tag bestimmt:

- **Notenbanken und Konjunktur** – Zinsentscheide, Inflations- und Arbeitsmarktdaten, Protokolle, Reden mit Marktrelevanz.
- **Politik mit Marktwirkung** – Handelskonflikte, Zölle, Sanktionen, Haushalte, Wahlen, militärische Eskalation.
- **Der Markt im Ganzen** – Indizes, Renditen, Rohstoffe, Wechselkurse.

**Einzelne Aktien tragen die Folge nicht.** Ein einzelnes Unternehmen kommt hinein, wenn es ein großer, allgemein bekannter Name ist **und** die Meldung darüber hinaus erheblich ist – eine Übernahme, ein Ausfall, eine Zahl, die einen Index bewegt. Quartalszahlen eines Einzelwerts sind kein Aufmacher. Zwei Nachkommastellen beim Gewinn je Aktie gehören in den Artikel, nicht in die gesprochene Meldung.

**4. Der Rhythmus trägt die Folge – und er wird gemessen.**

Am 27. September 2026 hat der Betreiber gemeldet, der Podcast klinge langweilig und monoton. Nachgemessen an den zehn Folgen davor, 125 gesprochene Sätze:

\`\`\`
Wörter je Satz   Median 24 · p75 34 · max 58
Sätze <=  8 Wörter    4 %
Sätze >= 25 Wörter   49 %
mit Semikolon        42 von 125
\`\`\`

„Kurze Hauptsätze" stand da schon seit sieben Wochen. Ein Adjektiv ohne Zahl bindet nicht, also hier die Zahlen:

- **Jeder Absatz beginnt mit einem Satz unter zwölf Wörtern.** Er nennt den Vorgang. Die Zahlen kommen danach.
- **Kein Satz über 25 Wörter.** Gesprochen sind das elf Sekunden in einem Atem; ein Hörer kann nicht zurückspringen.
- **Mindestens jeder vierte Satz hat höchstens acht Wörter.** Kurze Sätze sind kein Stilmittel, sie sind die Luft dazwischen.
- **Kein Semikolon.** Es klebt zwei Hauptsätze zusammen, die gesprochen zwei sein müssen. Mach zwei Sätze draus.

Das ist nicht Geschmack. Die Sprechstimme bemisst ihre **Pausen an der Satzlänge** – kurzer Satz, längere Pause. Sind alle Sätze gleich lang, sind alle Pausen gleich lang, und dann klingt es monoton, egal wie gut die Stimme ist.

**3. Objektiv, ohne Position.** Berichtet wird, was geschehen ist und wer was gesagt hat – mit Zuschreibung. Keine eigene Bewertung, keine Parteinahme, keine Vermutung über Absichten, keine urteilenden Adjektive. Das gilt besonders für politische und militärische Ereignisse.

- Richtig: „Russland griff Ziele in der Westukraine nahe der polnischen Grenze an. Polen meldete eine Verletzung seines Luftraums und berief sich auf Artikel 4 des Nato-Vertrags."
- Falsch: „Russlands rücksichtsloser Angriff …" · „Der Markt hat überreagiert." · „Anleger sollten jetzt …"

# Was heute ansteht, gehört hinein

**Mindestens ein Artikel oder Absatz nennt die Termine des Tages** – und zwar
konkret, mit Uhrzeit, wo sie in den Übersichten steht:

- **Konjunkturdaten**: Verbraucherpreise, Erzeugerpreise, Arbeitsmarkt,
  Einkaufsmanagerindizes, BIP, ifo, ZEW.
- **Notenbanken**: Zinsentscheid, Protokolle, Reden mit Marktrelevanz.
- **Quartalszahlen** der großen Werte – DAX-Konzerne und die bekannten
  US-Namen. Ein Mittelständler ohne Indexgewicht gehört nicht dazu.

Der Betreiber hat das am 11. August 2026 ausdrücklich gewünscht, nachdem in
der Folge ein Hinweis auf die anstehenden Verbraucherpreise stand: Genau das
macht den Unterschied zwischen einem Rückblick und etwas, mit dem der Leser
in den Tag geht.

**Nur, was in den Übersichten steht.** Ein Termin, den du nicht gelesen hast,
ist eine erfundene Zahl mit Datum – der Grundsatz oben gilt hier genauso.
Findest du keinen, lässt du es weg; eine erfundene Terminvorschau wäre der
schlimmere Fehler.

# Harte Grenzen

- \`teaser\`: ${TEASER_MIN} bis ${TEASER_MAX} Zeichen. Zähle nach.
- \`intro\`: ${INTRO_MIN} bis ${INTRO_MAX} Zeichen. Zähle nach.
- \`title\` über ${TITEL_OHNE_META_MAX} Zeichen ⇒ zusätzlich \`metaTitle\` (kürzer).
- \`slug\`: nur Kleinbuchstaben, Ziffern, Bindestriche.
- \`relatedTopics\`: **nur** aus dieser Liste – ${themen.join(', ')}
- \`relatedSymbols\`: **nur** aus dem Katalog. Die meisten Einzelaktien aus deutschen Tickermeldungen fehlen dort; nimm dann den Index (\`dax\`). Erlaubt sind unter anderem: ${symbole.slice(0, 60).join(', ')} – und weitere; im Zweifel weglassen.
- \`whyItMatters\` und jeder \`summary\`-Absatz: mindestens 40 Zeichen. Ein Halbsatz reicht nicht.
- \`title\`, \`metaTitle\`, \`teaser\` und \`headline\` müssen sich **zwischen den Artikeln unterscheiden**. Zwei gleiche Meta-Descriptions sehen in einer Suchergebnisliste aus wie derselbe Artikel.
- \`sources\`: mindestens eine je Artikel, \`https://\`, mit lesbarer Beschriftung nach dem Muster „finanzen.net, News-Ticker vom ${heute}, 7:21 Uhr: „…"".
- \`body\`: mindestens fünf Blöcke, davon mindestens ein \`heading\` (level 2). Kein Block leer.

# Die Quellen von heute

${quellen}`
}

async function frageModell(prompt: string): Promise<Antwort> {
  /*
    Ein Weg ohne Schnittstelle – für die Probe und für die Fehlersuche.

    Bricht ein Lauf beim Schreiben ab, liegt die Antwort des Modells im
    Protokoll. Mit `ANTWORT_DATEI` lässt sie sich hier wieder einspeisen, ohne
    das Modell ein zweites Mal zu bezahlen und ohne dass eine zweite Ausgabe
    entsteht. Und die Probe unten prüft damit, dass der erzeugte Quelltext
    übersetzt – der Teil, der beim ersten echten Lauf sonst niemandem auffällt.
  */
  const ersatz = process.env.ANTWORT_DATEI
  if (ersatz) {
    console.log(`Antwort aus ${ersatz} statt von der Schnittstelle.`)
    return JSON.parse(readFileSync(ersatz, 'utf8')) as Antwort
  }

  const schluessel = pflicht('ANTHROPIC_API_KEY')
  /*
    Sonnet statt Opus, und das ist eine Kostenentscheidung: Opus kostet 5 $ je
    Million Tokens hinein und 25 $ hinaus, Sonnet 3 $ und 15 $ (bis zum
    31.08.2026 sogar 2 $ und 10 $). Ein Lauf schickt rund 22.000 Tokens hinein
    und bekommt rund 14.000 heraus – das sind mit Opus etwa 50 Cent, mit
    Sonnet etwa 20.

    Die Aufgabe rechtfertigt den Aufpreis nicht: Was hier verlangt wird, ist
    Zusammenfassen und Erklären entlang einer engen, ausformulierten Vorschrift,
    kein offenes Problem. Und die Form prüft ohnehin `pruefe()` – ein Modell,
    das die Längen verfehlt, kommt nicht durch, egal welches.

    Umstellbar ohne Codeänderung: im Handstart das Feld `modell` setzen.
  */
  const modell = process.env.NACHRICHTEN_MODELL || 'claude-sonnet-5'

  /*
    Eine Umleitung wird laut gesagt.

    Der Sinn der Variablen ist, dass jemand sie setzt und wieder wegnimmt –
    und dazwischen soll im Protokoll stehen, wohin der Lauf tatsächlich
    gegangen ist. Eine stille Umleitung wäre genau der Zustand, den dieses
    Projekt an allen Ecken abschafft: nicht kaputt, nur anders, und ohne
    Meldung.
  */
  const basis = basisadresse()
  if (basis !== 'https://api.anthropic.com') {
    console.log(
      `::warning::Die Anfrage geht über ${basis} statt an die Anthropic-Schnittstelle.`
    )
  }

  const antwort = await fetch(`${basis}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': schluessel,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: modell,
      max_tokens: 32_000,
      tools: [WERKZEUG],
      tool_choice: { type: 'tool', name: WERKZEUG.name },
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!antwort.ok) {
    const text = await antwort.text()
    throw new Error(
      `Die Schnittstelle antwortet mit ${antwort.status}: ${text.slice(0, 500)}`
    )
  }

  const daten = (await antwort.json()) as {
    content: { type: string; name?: string; input?: unknown }[]
    usage?: { input_tokens: number; output_tokens: number }
  }

  if (daten.usage) {
    console.log(
      `Modell ${modell}: ${daten.usage.input_tokens} Tokens hinein, ${daten.usage.output_tokens} hinaus.`
    )
    console.log(`Kosten dieses Laufs: ${preisSatz(modell, daten.usage)}`)
  }

  const werkzeug = daten.content.find(
    (t) => t.type === 'tool_use' && t.name === WERKZEUG.name
  )
  if (!werkzeug?.input) {
    throw new Error('Die Antwort enthält keinen Werkzeugaufruf – nichts zu schreiben.')
  }
  return werkzeug.input as Antwort
}

// ------------------------------------------------------------------ Prüfung

function pruefe(
  ergebnis: Antwort,
  themen: Set<string>,
  symbole: Set<string>,
  vorhandeneSlugs: Set<string>
): string[] {
  const fehler: string[] = []
  const f = (satz: string) => fehler.push(satz)

  if (ergebnis.intro.length < INTRO_MIN || ergebnis.intro.length > INTRO_MAX) {
    f(
      `intro hat ${ergebnis.intro.length} Zeichen, erlaubt sind ${INTRO_MIN}–${INTRO_MAX}.`
    )
  }
  if (ergebnis.artikel.length < 5)
    f(`Nur ${ergebnis.artikel.length} Artikel – mindestens fünf.`)
  if (ergebnis.top.length < 1) f('Die Tagesausgabe braucht mindestens eine Top-Meldung.')
  if (ergebnis.top.length > TOP_MAX)
    f(`${ergebnis.top.length} Top-Meldungen, erlaubt sind höchstens ${TOP_MAX}.`)
  if (ergebnis.top.length + ergebnis.further.length > MELDUNGEN_MAX) {
    f(
      `${ergebnis.top.length + ergebnis.further.length} Meldungen, erlaubt sind höchstens ${MELDUNGEN_MAX}.`
    )
  }
  const meldungen = ergebnis.top.length + ergebnis.further.length
  if (meldungen < MELDUNGEN_MIN) {
    f(
      `Nur ${meldungen} Meldungen in der Tagesausgabe – mindestens ${MELDUNGEN_MIN}. ` +
        `Es liegen ${ergebnis.artikel.length} Artikel vor; die Ausgabe fasst dieselben ` +
        `Meldungen zusammen, sie wählt nicht aus.`
    )
  }

  /*
    Und die Meldungen müssen mehr wiegen als das Kleingedruckte davor.

    Vier Meldungen zu je zwanzig Wörtern erfüllen jede Einzelgrenze – 40
    Zeichen je Absatz, drei Meldungen insgesamt – und ergeben trotzdem eine
    Folge, die zur Hälfte aus Begrüßung und Hinweisen besteht. Die Grenzen
    darunter messen das Stück; diese misst die Summe. Siehe `GERUEST_WOERTER`.
  */
  const summaryWoerter = [...ergebnis.top, ...ergebnis.further].reduce(
    (summe, m) =>
      summe +
      m.summary.reduce((s, p) => s + p.trim().split(/\s+/).filter(Boolean).length, 0),
    0
  )
  if (summaryWoerter <= GERUEST_WOERTER) {
    f(
      `Die summary-Absätze ergeben zusammen nur ${summaryWoerter} Wörter – das ist ` +
        `weniger als das feste Gerüst der Folge (${GERUEST_WOERTER} Wörter aus ` +
        `Begrüßung, Hinweisen und Abschied). Die Folge bestünde zur Hälfte aus ` +
        `Kleingedrucktem.`
    )
  }

  /*
    Titel, Meta-Titel und Anreißer müssen sich unterscheiden.

    Die dritte Regel, die erst die Trockenprobe zutage gefördert hat: `npm run
    pruefen` beanstandet gleiche Titel und gleiche Meta-Descriptions über
    mehrere Seiten – zu Recht, denn in einer Suchergebnisliste sähen fünf
    Artikel desselben Tages dann identisch aus. Ein Modell, das acht Artikel in
    einem Zug schreibt, ist genau dafür anfällig.
  */
  const einmalig = (feld: string, werte: (string | undefined)[]) => {
    const zaehler = new Map<string, number>()
    for (const w of werte) {
      if (!w) continue
      zaehler.set(w, (zaehler.get(w) ?? 0) + 1)
    }
    for (const [wert, anzahl] of zaehler) {
      if (anzahl > 1)
        f(`${anzahl} Artikel teilen sich denselben ${feld}: „${wert.slice(0, 60)}…"`)
    }
  }
  einmalig(
    'title',
    ergebnis.artikel.map((a) => a.title)
  )
  einmalig(
    'metaTitle',
    ergebnis.artikel.map((a) => a.metaTitle)
  )
  einmalig(
    'teaser',
    ergebnis.artikel.map((a) => a.teaser)
  )
  einmalig(
    'headline',
    [...ergebnis.top, ...ergebnis.further].map((m) => m.headline)
  )

  const gesehen = new Set<string>()
  for (const a of ergebnis.artikel) {
    const wo = `Artikel „${a.slug}"`
    if (!/^[a-z0-9-]+$/.test(a.slug)) f(`${wo}: der Slug enthält unerlaubte Zeichen.`)
    if (gesehen.has(a.slug)) f(`${wo}: doppelter Slug.`)
    gesehen.add(a.slug)
    if (vorhandeneSlugs.has(a.slug)) f(`${wo}: diesen Slug gibt es schon.`)

    if (a.teaser.length < TEASER_MIN || a.teaser.length > TEASER_MAX) {
      f(
        `${wo}: teaser hat ${a.teaser.length} Zeichen, erlaubt sind ${TEASER_MIN}–${TEASER_MAX}.`
      )
    }
    if (a.title.length > TITEL_OHNE_META_MAX && !a.metaTitle) {
      f(`${wo}: title ist ${a.title.length} Zeichen lang und braucht einen metaTitle.`)
    }
    if (!KATEGORIEN.includes(a.category as (typeof KATEGORIEN)[number])) {
      f(`${wo}: „${a.category}" ist keine gültige Kategorie.`)
    }
    for (const t of a.relatedTopics)
      if (!themen.has(t)) f(`${wo}: Lernthema „${t}" gibt es nicht.`)
    for (const s of a.relatedSymbols)
      if (!symbole.has(s)) f(`${wo}: Symbol „${s}" gibt es nicht.`)
    for (const q of a.sources) {
      if (!q.url.startsWith('https://'))
        f(`${wo}: Quelle „${q.label}" ist kein https-Link.`)
    }
    if (a.body.length < 5) f(`${wo}: nur ${a.body.length} Textblöcke, mindestens fünf.`)
    if (!a.body.some((b) => b.type === 'heading')) f(`${wo}: keine Zwischenüberschrift.`)
    if (a.body.some((b) => !b.text.trim())) f(`${wo}: ein Textblock ist leer.`)
  }

  for (const m of [...ergebnis.top, ...ergebnis.further]) {
    const wo = `Meldung „${m.headline}"`
    if (m.whyItMatters.trim().length < WARUM_MIN) {
      f(
        `${wo}: whyItMatters hat ${m.whyItMatters.trim().length} Zeichen, mindestens ${WARUM_MIN}.`
      )
    }
    if (!m.summary.length || m.summary.some((s) => s.trim().length < SUMMARY_MIN)) {
      f(`${wo}: jeder summary-Absatz braucht mindestens ${SUMMARY_MIN} Zeichen.`)
    }
    /*
      Objektiv, ohne Position – dieselbe Prüfung wie im Build.

      `summary` wird wörtlich zur Podcastfolge. Die Wortliste steht in
      `lib/editions-validate.ts` und wird von dort geholt, nicht abgeschrieben:
      `AGENTS.md` verlangt, dass diese Prüfung den Build spiegelt, und zwei
      Listen mit demselben Zweck gehen auseinander.

      Hier zu scheitern ist billig – der Entwurf wird verworfen, bevor er eine
      Ausgabe wird, und der Lauf sagt im Protokoll, welcher Satz es war.
    */
    for (const { art, fund } of positionierungen(m.summary.join(' '))) {
      f(`${wo}: „${fund}" in summary – ${art}. Das gehört in whyItMatters.`)
    }
    for (const t of m.relatedTopics)
      if (!themen.has(t)) f(`${wo}: Lernthema „${t}" gibt es nicht.`)
    for (const s of m.relatedSymbols)
      if (!symbole.has(s)) f(`${wo}: Symbol „${s}" gibt es nicht.`)
  }

  return fehler
}

// ----------------------------------------------------------------- Schreiben

/** Ein String für TypeScript – einfache Anführungszeichen, alles Nötige maskiert. */
function ts(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

function liste(werte: string[]): string {
  return `[${werte.map(ts).join(', ')}]`
}

function quellenBlock(quellen: Quelle[], einzug: string): string {
  return quellen
    .map(
      (q) =>
        `${einzug}{\n${einzug}  label: ${ts(q.label)},\n${einzug}  url: ${ts(q.url)},\n${einzug}},`
    )
    .join('\n')
}

function artikelQuelltext(a: Artikel, zeitpunkt: string): string {
  const koerper = a.body
    .map((b) =>
      b.type === 'heading'
        ? `      {\n        type: 'heading',\n        level: ${b.level ?? 2},\n        text: ${ts(b.text)},\n      },`
        : `      {\n        type: 'paragraph',\n        text: ${ts(b.text)},\n      },`
    )
    .join('\n')

  return `  {
    slug: ${ts(a.slug)},
    title: ${ts(a.title)},
${a.metaTitle ? `    metaTitle: ${ts(a.metaTitle)},\n` : ''}    teaser: ${ts(a.teaser)},
    category: ${ts(a.category)},
    publishedAt: ${ts(zeitpunkt)},
    author: 'Redaktion IM Invests',
    readingMinutes: ${a.readingMinutes},
    tags: ${liste(a.tags)},
    relatedTopics: ${liste(a.relatedTopics)},
    relatedSymbols: ${liste(a.relatedSymbols)},
    sources: [
${quellenBlock(a.sources, '      ')}
    ],
    body: [
${koerper}
    ],
  },`
}

function meldungQuelltext(m: Meldung): string {
  return `    {
      headline: ${ts(m.headline)},
      summary: [
${m.summary.map((s) => `        ${ts(s)},`).join('\n')}
      ],
      category: ${ts(m.category)},
      whyItMatters: ${ts(m.whyItMatters)},
      relatedTopics: ${liste(m.relatedTopics)},
      relatedSymbols: ${liste(m.relatedSymbols)},
      sources: [
${quellenBlock(m.sources, '        ')}
      ],
    },`
}

// ---------------------------------------------------------------------- Lauf

async function main() {
  const heute = process.env.STICHTAG || new Date().toISOString().slice(0, 10)
  const ausgabedatei = `data/editions/${heute}.ts`

  /*
    Die Probe: alles tun, nichts schreiben.

    Sie beantwortet die Frage, die man vor dem ersten echten Lauf hat – ist der
    Schlüssel richtig, kommt eine Antwort, hält sie die Regeln ein? – ohne dass
    eine Ausgabe entsteht, die niemand bestellt hat. Deshalb übergeht sie auch
    die Prüfung „steht schon": Sonst täte sie an genau den Tagen nichts, an
    denen man sie braucht.
  */
  const probe = process.env.NUR_PRUEFEN === '1'

  if (!probe && existsSync(ausgabedatei)) {
    console.log(`Die Ausgabe vom ${heute} steht bereits – nichts zu tun.`)
    return
  }

  /*
    Die Quellendatei ist nur nötig, wenn tatsächlich ein Modell gefragt wird.

    Bis zum 6. August 2026 stand hier `pflicht('QUELLENDATEI')` – unbedingt,
    noch vor dem Ausstieg über `ANTWORT_DATEI`. Damit stürzte ausgerechnet der
    Notbehelf ab, wenn keine Quellen vorlagen: Fehlen sie, entfernt
    `nachrichten.yml` die Datei und rechnet die Ausgabe aus dem eigenen
    Bestand – und dieser Lauf brach dann hier ab, statt zu schreiben.

    Genau der Fall, für den der Notbehelf gebaut wurde, war der einzige, in
    dem er nicht funktionierte. Aufgefallen ist es beim Durchgehen vor dem
    ersten Agentenlauf, nicht im Betrieb.
  */
  const quellendatei = process.env.QUELLENDATEI
  const ausAntwortdatei = Boolean(process.env.ANTWORT_DATEI)

  let quellen = ''
  let kopf = ''
  if (quellendatei && existsSync(quellendatei)) {
    quellen = readFileSync(quellendatei, 'utf8')
    kopf = quellen.split('\n')[0] ?? ''
    if (!kopf.includes(heute)) {
      console.log(
        `::warning::Die Quellendatei ist nicht von heute (${kopf.trim().slice(0, 120)}).`
      )
    }
  } else if (ausAntwortdatei) {
    console.log(
      'Ohne Quellendatei – die Antwort liegt bereits vor, es wird kein Modell gefragt.'
    )
  } else {
    console.error('::error::QUELLENDATEI fehlt oder zeigt ins Leere.')
    console.error('  Ohne gelesene Quelle wird keine Ausgabe geschrieben.')
    process.exit(1)
  }

  const themen = new Set<string>()
  for (const datei of readdirSync('data/learn/topics')) {
    if (!datei.endsWith('.ts')) continue
    for (const s of erlaubteWerte(
      `data/learn/topics/${datei}`,
      /slug: '([a-z0-9-]+)'/g
    )) {
      themen.add(s)
    }
  }
  const symbole = erlaubteWerte('data/markets.ts', /^ {4}symbol: '([a-z0-9-]+)'/gm)
  for (const s of erlaubteWerte(
    'data/markets-aktien.ts',
    /^ {4}symbol: '([a-z0-9-]+)'/gm
  )) {
    symbole.add(s)
  }
  const vorhandeneSlugs = erlaubteWerte('data/news.ts', /^ {4}slug: '([a-z0-9-]+)'/gm)

  console.log(
    `Stichtag ${heute} · ${themen.size} Lernthemen · ${symbole.size} Symbole · ${vorhandeneSlugs.size} vorhandene Artikel`
  )

  const ergebnis = await frageModell(anweisung(heute, [...themen], [...symbole], quellen))

  const fehler = pruefe(ergebnis, themen, symbole, vorhandeneSlugs)
  if (fehler.length > 0) {
    console.error(`::error::Die Ausgabe hält ${fehler.length} Regeln nicht ein:`)
    for (const satz of fehler) console.error(`  – ${satz}`)
    console.error('Es wurde nichts geschrieben.')
    process.exit(1)
  }

  if (probe) {
    console.log('')
    console.log('── Probe bestanden. Es wurde nichts geschrieben. ──')
    console.log('')
    console.log(`Anreißer der Ausgabe (${ergebnis.intro.length} Zeichen):`)
    console.log(`  ${ergebnis.intro}`)
    console.log('')
    console.log(`${ergebnis.artikel.length} Artikel:`)
    for (const a of ergebnis.artikel) {
      console.log(`  • ${a.title}`)
      console.log(`    ${a.teaser}`)
      console.log(`    Quelle: ${a.sources[0]?.label ?? '—'}`)
    }
    console.log('')
    console.log(
      `Tagesausgabe: ${ergebnis.top.length} Top-Meldungen, ${ergebnis.further.length} weitere.`
    )
    for (const m of [...ergebnis.top, ...ergebnis.further])
      console.log(`  • ${m.headline}`)
    return
  }

  /*
    Erscheinungszeiten absteigend ab 07:50 Uhr, im Abstand von fünf Minuten.

    Die Reihenfolge auf der Seite ergibt sich aus `publishedAt`; ohne
    Staffelung stünden alle Artikel auf derselben Minute, und die Sortierung
    wäre dem Zufall überlassen.
  */
  const artikelText = ergebnis.artikel
    .map((a, i) => {
      const minute = 50 - i * 5
      const stunde = 7 + Math.floor((minute < 0 ? minute - 59 : minute) / 60)
      const m = ((minute % 60) + 60) % 60
      const zeit = `${heute}T${String(stunde).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+02:00`
      return artikelQuelltext(a, zeit)
    })
    .join('\n')

  const news = readFileSync('data/news.ts', 'utf8')
  const anker = 'export const newsArticles: NewsArticle[] = [\n'
  if (!news.includes(anker)) throw new Error('Der Anker in data/news.ts fehlt.')
  writeFileSync('data/news.ts', news.replace(anker, anker + artikelText + '\n'))

  const kurz = heute.replace(/-/g, '')
  writeFileSync(
    ausgabedatei,
    `import type { DailyEdition } from './types'

/**
 * Ausgabe vom ${heute}.
 *
 * Erzeugt von \`scripts/nachrichten-erzeugen.ts\` auf einem GitHub-Läufer aus
 * den Quellen, die \`quellen-sammeln.yml\` am selben Morgen abgerufen hat.
 * ${herkunftssatz(kopf)}
 */
export const edition: DailyEdition = {
  date: ${ts(heute)},
  intro: ${ts(ergebnis.intro)},
  top: [
${ergebnis.top.map(meldungQuelltext).join('\n')}
  ],
  further: [
${ergebnis.further.map(meldungQuelltext).join('\n')}
  ],
}
`
  )

  const index = readFileSync('data/editions/index.ts', 'utf8')
  const letzterImport = index.lastIndexOf("} from './")
  const zeilenende = index.indexOf('\n', letzterImport)
  const mitImport =
    index.slice(0, zeilenende + 1) +
    `import { edition as edition${kurz} } from './${heute}'\n` +
    index.slice(zeilenende + 1)
  writeFileSync(
    'data/editions/index.ts',
    mitImport.replace(
      /export const editions: DailyEdition\[\] = \[\n/,
      `export const editions: DailyEdition[] = [\n  edition${kurz},\n`
    )
  )

  console.log(
    `Geschrieben: ${ergebnis.artikel.length} Artikel, ${ergebnis.top.length} Top-Meldungen, ${ergebnis.further.length} weitere.`
  )
  for (const a of ergebnis.artikel) console.log(`  – ${a.title}`)
}

/*
  Nur beim direkten Aufruf loslaufen.

  Bis zum 20. August 2026 stand hier ein blankes `main()`. Damit war die Datei
  nicht importierbar: Wer eine einzelne Funktion daraus prüfen wollte, löste
  den ganzen Nachrichtenlauf aus – Dateien lesen, an die Schnittstelle gehen,
  eine Ausgabe schreiben. Aufgefallen ist es, als der erste Test dazu die
  Zeile „Die Ausgabe vom 2026-08-20 steht bereits" ausgab, die ein Test
  niemals ausgeben sollte.

  Derselbe Riegel wie in `quartalstermine-abrufen.ts`. Am Aufruf über
  `node scripts/nachrichten-erzeugen.ts` ändert er nichts.
*/
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((fehler) => {
    console.error(`::error::${fehler instanceof Error ? fehler.message : String(fehler)}`)
    process.exit(1)
  })
}
