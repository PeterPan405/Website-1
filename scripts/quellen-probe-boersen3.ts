/**
 * Dritte Runde: fünf offene Türen, und hinter jeder die richtige Frage.
 *
 * ## Was die zweite Runde ergeben hat
 *
 * Fünfzehn Adressen, und diesmal keine pauschale Absage. Fünf Schnittstellen
 * antworten **ohne Schlüssel mit echten Daten**:
 *
 * | Börse | Adresse | Antwort |
 * | --- | --- | --- |
 * | TMX (Kanada) | `app-money.tmx.com/graphql` | 200, Kurs und Name der Royal Bank |
 * | ASX (Australien) | `asx.api.markitdigital.com` | 200, Stammdaten und Pflichtmeldungen |
 * | TWSE (Taiwan) | `openapi.twse.com.tw` | 200, `swagger.json` mit 306 KB Verzeichnis |
 * | SIX (Schweiz) | `six-group.com/fqs/ref.json` | 400 – **und nennt das ungültige Feld** |
 * | KIND (Südkorea) | `kind.krx.co.kr` | 200, 90 KB mit einem künftigen Datum |
 *
 * Keine davon liefert schon einen Termin. Aber „antwortet mit Daten" ist etwas
 * anderes als 403, und die Anschlussfrage ist bei jeder eine andere:
 *
 * 1. **TMX** – GraphQL beantwortet nur, wonach man fragt. Kennt das Schema ein
 *    Feld für Meldetermine? Wenn die Introspektion offen ist, steht die
 *    Antwort in einer einzigen Abfrage.
 * 2. **ASX** – `key-events` gibt es nicht („Cannot GET /1.0/companies/BHP/
 *    key-events"). Unter welchem Namen dann? Sieben Kandidaten.
 * 3. **TWSE** – das Verzeichnis ist da. Diesmal wird es **gelesen**: alle
 *    Pfade samt Beschreibung, gefiltert auf alles, was nach Termin klingt.
 * 4. **SIX** – die Fehlermeldung „Invalid name 'NextEventDate'" ist eine
 *    Einladung: Die Schnittstelle sagt, welche Namen sie nicht kennt. Also
 *    wird gefragt, welche sie kennt.
 * 5. **KIND** – 90 KB Antwort mit dem Wort „results" und einem künftigen
 *    Datum. Steht darin eine Liste von Ergebnisterminen oder eine Anmeldemaske?
 *
 * ## Warum das kein Herumraten ist
 *
 * Bei vier der fünf ist die Frage geschlossen und wird von der Quelle selbst
 * beantwortet: Ein Schema nennt seine Felder, ein Verzeichnis nennt seine
 * Datensätze, eine Fehlermeldung nennt den falschen Namen. Nur bei ASX werden
 * Pfade durchprobiert – und auch dort sind es die Namen, die die eigene Seite
 * benutzt, keine erfundenen.
 *
 * ## Was hier nicht passiert
 *
 * Kein Cookie, keine Sitzung, keine nachgebaute Kennung, anderthalb Sekunden
 * zwischen zwei Abrufen. Antwortet eine Börse damit nicht, ist das die
 * Antwort – dieselbe Entscheidung wie bei Yahoo, Stooq, Euronext und der
 * Börse Frankfurt.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `boersen3`.
 */

import { writeFile } from 'node:fs/promises'

const BERICHT = 'boersen3-kalender.json'

const KOPFZEILEN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en,de;q=0.8',
  Accept: 'application/json, text/plain, */*',
}

/** Wörter, die einen Ergebnistermin bezeichnen – in fünf Sprachen. */
const ERGEBNISWORTE =
  /earnings|(financial|quarterly|interim|annual|half.?year|full.?year)[\s_-]*(results?|report)|财报|決算|법인|실적|공시|財務報告|法人說明會|Termin/i

const bericht: Record<string, unknown> = { geprueft: new Date().toISOString() }

/** Anderthalb Sekunden zwischen zwei Abrufen – niemand wird hier gedrängt. */
function warten() {
  return new Promise((f) => setTimeout(f, 1500))
}

async function hole(
  url: string,
  koerper?: string
): Promise<{ status: number; text: string }> {
  const antwort = await fetch(url, {
    method: koerper ? 'POST' : 'GET',
    headers: koerper ? { ...KOPFZEILEN, 'Content-Type': 'application/json' } : KOPFZEILEN,
    body: koerper,
    signal: AbortSignal.timeout(30_000),
    redirect: 'follow',
  })
  return { status: antwort.status, text: await antwort.text() }
}

function ueberschrift(was: string) {
  console.log(`\n${'='.repeat(78)}\n${was}\n${'='.repeat(78)}`)
}

/* ==================================================================== TMX */

/**
 * Kanada, 33 Titel.
 *
 * GraphQL beantwortet nur, wonach gefragt wird – und sagt bei einem
 * unbekannten Feld, dass es das nicht gibt. Ist die Introspektion offen, nennt
 * eine einzige Abfrage alle Felder, die es gibt. Ist sie zu, bleibt die
 * Fehlermeldung: Auch sie ist eine Auskunft, denn GraphQL schlägt bei einem
 * Tippfehler den richtigen Namen vor.
 */
async function tmx() {
  ueberschrift('TMX Kanada (33 Titel) – kennt das Schema einen Meldetermin?')

  const versuche: { name: string; abfrage: string }[] = [
    {
      name: 'Introspektion: alle Felder der Wurzel',
      abfrage: '{ __schema { queryType { fields { name description } } } }',
    },
    {
      name: 'Introspektion: die Felder eines Unternehmens',
      abfrage: '{ __type(name: "Company") { fields { name description } } }',
    },
    {
      name: 'geraten: ein Terminfeld an der Kursabfrage',
      abfrage:
        'query q($symbol: String, $locale: String) { getQuoteBySymbol(symbol: $symbol, locale: $locale) ' +
        '{ symbol name nextEarningsDate earningsDate reportDate } }',
    },
  ]

  const ergebnisse: unknown[] = []
  for (const versuch of versuche) {
    const koerper = JSON.stringify({
      query: versuch.abfrage,
      variables: { symbol: 'RY', locale: 'en' },
    })
    try {
      const { status, text } = await hole('https://app-money.tmx.com/graphql', koerper)
      console.log(`\n  ${versuch.name}\n    STATUS ${status}, ${text.length} Zeichen`)

      /*
        Bei der Introspektion sind die Feldnamen die eigentliche Antwort.
        Bei einer Absage ist es die Fehlermeldung – GraphQL schlägt darin oft
        den richtigen Namen vor („Did you mean ...?").
      */
      const namen = [...text.matchAll(/"name":"([^"]+)"/g)].map((t) => t[1])
      const treffer = namen.filter((n) => ERGEBNISWORTE.test(n))
      if (namen.length > 0) {
        console.log(`    ${namen.length} Namen, davon mit Terminbezug: ${treffer.length}`)
        if (treffer.length > 0) console.log(`    → ${treffer.join(', ')}`)
      }
      console.log(`    ${text.slice(0, 500).replace(/\s+/g, ' ')}`)
      ergebnisse.push({
        versuch: versuch.name,
        status,
        namen: namen.slice(0, 200),
        treffer,
      })
    } catch (fehler) {
      console.log(`  FEHLER ${(fehler as Error).message}`)
      ergebnisse.push({ versuch: versuch.name, fehler: String(fehler) })
    }
    await warten()
  }
  bericht.tmx = ergebnisse
}

/* ==================================================================== ASX */

/**
 * Australien, 26 Titel.
 *
 * `key-events` gibt es nicht. Die Schnittstelle sagt es unmissverständlich:
 * „Cannot GET /1.0/companies/BHP/key-events". Also werden die Namen probiert,
 * die die ASX-Seite selbst benutzt – und nur die.
 */
async function asx() {
  ueberschrift('ASX Australien (26 Titel) – unter welchem Namen liegen die Termine?')

  const pfade = [
    'events',
    'company-events',
    'key-statistics',
    'financial-calendar',
    'dividends',
    'upcoming-events',
    'calendar',
  ]

  const ergebnisse: unknown[] = []
  for (const pfad of pfade) {
    const url = `https://asx.api.markitdigital.com/asx-research/1.0/companies/BHP/${pfad}`
    try {
      const { status, text } = await hole(url)
      const kuenftig = [...text.matchAll(/\b(20[2-3]\d-\d\d-\d\d)/g)]
        .map((t) => t[1])
        .filter((d) => d > new Date().toISOString().slice(0, 10))
      console.log(
        `  ${pfad.padEnd(20)} ${String(status).padStart(4)}  ${String(text.length).padStart(7)} Zeichen  ` +
          `künftig ${kuenftig.length}  Ergebnisbezug ${ERGEBNISWORTE.test(text) ? 'ja' : 'nein'}`
      )
      if (status === 200) console.log(`      ${text.slice(0, 400).replace(/\s+/g, ' ')}`)
      ergebnisse.push({
        pfad,
        status,
        laenge: text.length,
        kuenftig: [...new Set(kuenftig)].slice(0, 10),
        ergebnisbezug: ERGEBNISWORTE.test(text),
        anfang: text.slice(0, 300),
      })
    } catch (fehler) {
      console.log(`  ${pfad.padEnd(20)} FEHLER ${(fehler as Error).message}`)
      ergebnisse.push({ pfad, fehler: String(fehler) })
    }
    await warten()
  }
  bericht.asx = ergebnisse
}

/* =================================================================== TWSE */

/**
 * Taiwan, 12 Titel.
 *
 * Das Verzeichnis war in der zweiten Runde schon da – 306 KB – und wurde nicht
 * gelesen, nur gezählt. Genau davor warnt AGENTS.md: „Geprüft und nichts
 * gefunden" ist ein Zwischenstand. Diesmal wird jeder Pfad samt Beschreibung
 * aufgeschrieben, und was nach Termin klingt, kommt in eine eigene Liste.
 */
async function twse() {
  ueberschrift('TWSE Taiwan (12 Titel) – was steht wirklich im Verzeichnis?')

  try {
    const { status, text } = await hole('https://openapi.twse.com.tw/v1/swagger.json')
    console.log(`  STATUS ${status}, ${text.length} Zeichen`)
    const verzeichnis = JSON.parse(text) as {
      paths: Record<string, Record<string, { summary?: string; description?: string }>>
    }
    const eintraege = Object.entries(verzeichnis.paths).map(([pfad, methoden]) => {
      const erste = Object.values(methoden)[0] ?? {}
      return { pfad, text: `${erste.summary ?? ''} ${erste.description ?? ''}`.trim() }
    })
    console.log(`  ${eintraege.length} Datensätze im Verzeichnis.\n`)

    const passend = eintraege.filter((e) => ERGEBNISWORTE.test(`${e.pfad} ${e.text}`))
    console.log(`  ${passend.length} mit Termin- oder Ergebnisbezug:`)
    for (const e of passend)
      console.log(`    ${e.pfad.padEnd(38)} ${e.text.slice(0, 60)}`)

    bericht.twse = { status, anzahl: eintraege.length, passend, alle: eintraege }
  } catch (fehler) {
    console.log(`  FEHLER ${(fehler as Error).message}`)
    bericht.twse = { fehler: String(fehler) }
  }
  await warten()
}

/* ==================================================================== SIX */

/**
 * Schweiz, 27 Titel.
 *
 * Die Schnittstelle hat in der zweiten Runde mit 400 geantwortet und dabei
 * gesagt, welches Feld sie nicht kennt: „Invalid name 'NextEventDate' in
 * select parameter". Eine Schnittstelle, die den falschen Namen benennt,
 * beantwortet auch die Frage nach dem richtigen – man muss nur fragen.
 *
 * Zuerst `select=*`: Wenn der Stern gilt, stehen alle Felder in der Antwort.
 * Sonst nacheinander die naheliegenden Namen; jede Absage streicht einen.
 */
async function six() {
  ueberschrift('SIX Schweiz (27 Titel) – welche Felder kennt die Abfrage?')

  const versuche = [
    'select=*&where=ValorSymbol=NESN',
    'select=ISIN,ShortName&where=ValorSymbol=NESN',
    'select=NextEvent&where=ValorSymbol=NESN',
    'select=EventDate&where=ValorSymbol=NESN',
    'select=FinancialCalendar&where=ValorSymbol=NESN',
  ]

  const ergebnisse: unknown[] = []
  for (const abfrage of versuche) {
    const url = `https://www.six-group.com/fqs/ref.json?${abfrage}`
    try {
      const { status, text } = await hole(url)
      console.log(`\n  ${abfrage}\n    STATUS ${status}, ${text.length} Zeichen`)
      console.log(`    ${text.slice(0, 500).replace(/\s+/g, ' ')}`)
      ergebnisse.push({ abfrage, status, anfang: text.slice(0, 600) })
    } catch (fehler) {
      console.log(`  FEHLER ${(fehler as Error).message}`)
      ergebnisse.push({ abfrage, fehler: String(fehler) })
    }
    await warten()
  }
  bericht.six = ergebnisse
}

/* =================================================================== KIND */

/**
 * Südkorea, 18 Titel.
 *
 * Neunzig Kilobyte, das Wort „results" darin und ein künftiges Datum. Das kann
 * eine Liste von Meldeterminen sein oder eine Anmeldemaske mit einem
 * Datumsfeld. Beides sieht in einer Zählung gleich aus – deshalb wird diesmal
 * hineingesehen: Wie viele Tabellenzeilen hat die Antwort, und wie viele
 * Börsenkürzel stehen darin?
 */
async function kind() {
  ueberschrift('KIND Südkorea (18 Titel) – Liste oder Anmeldemaske?')

  const url =
    'https://kind.krx.co.kr/disclosure/todaydisclosure.do?method=searchTodayDisclosureMain'
  try {
    const { status, text } = await hole(url)
    const zeilen = (text.match(/<tr[\s>]/gi) ?? []).length
    const formulare = (text.match(/<form[\s>]/gi) ?? []).length
    const kuerzel = new Set([...text.matchAll(/\b(\d{6})\b/g)].map((t) => t[1]))
    console.log(`  STATUS ${status}, ${text.length} Zeichen`)
    console.log(
      `  ${zeilen} Tabellenzeilen, ${formulare} Formulare, ${kuerzel.size} sechsstellige Kürzel`
    )
    console.log(`  Ergebnisbezug: ${ERGEBNISWORTE.test(text) ? 'ja' : 'nein'}`)
    console.log(`  ${text.slice(0, 400).replace(/\s+/g, ' ')}`)
    bericht.kind = {
      status,
      laenge: text.length,
      zeilen,
      formulare,
      kuerzel: kuerzel.size,
      anfang: text.slice(0, 800),
    }
  } catch (fehler) {
    console.log(`  FEHLER ${(fehler as Error).message}`)
    bericht.kind = { fehler: String(fehler) }
  }
  await warten()
}

/* =================================================================== main */

async function main() {
  await tmx()
  await asx()
  await twse()
  await six()
  await kind()

  await writeFile(BERICHT, JSON.stringify(bericht, null, 2))
  console.log(`\nVollständig in ${BERICHT}.`)
}

await main()
