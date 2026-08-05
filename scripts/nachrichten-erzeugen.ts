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

// ---------------------------------------------------------------- Regelwerk

/** Aus `lib/news-validate.ts` – hier gespiegelt, damit der Bruch früh kommt. */
const TEASER_MIN = 100
const TEASER_MAX = 160
const INTRO_MIN = 110
const INTRO_MAX = 165
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

Die Tagesausgabe fasst dieselben Meldungen zusammen: ein bis drei unter \`top\`, der Rest unter \`further\`. \`whyItMatters\` ist der eigentliche Zweck der Rubrik – ein Satz darüber, was der Leser damit anfängt.

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
  const modell = process.env.NACHRICHTEN_MODELL || 'claude-opus-5'

  const antwort = await fetch('https://api.anthropic.com/v1/messages', {
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
  if (ergebnis.top.length + ergebnis.further.length < 3) {
    f('Die Tagesausgabe braucht mindestens drei Meldungen insgesamt.')
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

  const quellen = readFileSync(pflicht('QUELLENDATEI'), 'utf8')
  const kopf = quellen.split('\n')[0] ?? ''
  if (!kopf.includes(heute)) {
    console.log(
      `::warning::Die Quellendatei ist nicht von heute (${kopf.trim().slice(0, 120)}).`
    )
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
 * Quellenlage laut Kopf der Datei: ${kopf.replace(/^#\s*/, '').trim()}
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

main().catch((fehler) => {
  console.error(`::error::${fehler instanceof Error ? fehler.message : String(fehler)}`)
  process.exit(1)
})
