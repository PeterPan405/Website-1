/**
 * Führt außer Tokio noch eine Börse einen Sammelkalender?
 *
 * ## Warum diese Sonde
 *
 * Von 1.029 Aktien haben 318 einen kommenden Meldetermin, und **302 davon
 * kommen aus einer einzigen Quelle**: den 8-K-Meldungen der US-Börsenaufsicht.
 * Alles außerhalb der USA fehlt fast vollständig.
 *
 * Sieben Anbieter wurden dafür geprüft und sind dokumentiert – Yahoo, Financial
 * Modeling Prep, Finnhub, Twelve Data, Euronext, LSE, Alpha Vantage. Das Muster
 * war überall dasselbe: Schlüssel, Tarif oder eine Kennung aus dem Browser.
 *
 * Was dabei **nicht** gefragt wurde: die Börsen selbst. Und genau dort lag die
 * Antwort schon einmal. AGENTS.md hält es als Lehre fest:
 *
 * > Der Sammelkalender wurde erst gefunden, als jemand statt nach Terminen je
 * > Unternehmen nach einer Sammelstelle fragte.
 *
 * Die Tokioter Börse veröffentlicht die geplanten Meldetermine aller
 * gelisteten Unternehmen als Tabelle, ohne Schlüssel, ohne Anmeldung. Sie ist
 * die einzige, die bisher gefragt wurde. Diese Sonde fragt die übrigen.
 *
 * ## Was gefragt wird und was nicht
 *
 * Abgerufen wird mit einem gewöhnlichen `User-Agent` und sonst nichts. Wer
 * eine im Browser errechnete Kennung verlangt, bekommt hier keine – das ist
 * eine gesetzte Zugangssperre, und die wird nicht nachgebaut. Dieselbe
 * Entscheidung wie bei Yahoo, Stooq und der Börse Frankfurt.
 *
 * Gemessen wird je Adresse:
 *
 * - Statuscode, Inhaltstyp, Länge
 * - ob die Antwort JSON ist und wie ihre obersten Schlüssel heißen
 * - ob eine HTML-Seite auf **Tabellen** verweist (`.xlsx`, `.xls`, `.csv`)
 * - die ersten Zeilen, damit „200" nicht mit „liefert etwas" verwechselt wird
 *
 * Der letzte Punkt ist kein Beiwerk. Die Börse Frankfurt hat in der ersten
 * Runde 200 geliefert, und der Körper war ein leeres Objekt.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `boersen`.
 */

import { writeFile } from 'node:fs/promises'

const BERICHT = 'boersen-kalender.json'

/** Ein gewöhnliches Browser-Kennzeichen – mehr wird nicht mitgegeben. */
const KOPFZEILEN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en,de;q=0.8',
}

interface Kandidat {
  /** Börse oder Stelle, in einem Wort. */
  wo: string
  /** Wie viele unserer Titel dort hingen, wenn es trägt. */
  betrifft: string
  url: string
  /** Was dort zu finden sein müsste, damit es zählt. */
  gesucht: string
}

/**
 * Die Kandidaten, nach der Größe der Lücke sortiert.
 *
 * Die Zahlen stammen aus `npm run abdeckung` vom 24. August 2026: 711 Aktien
 * ohne kommenden Termin, davon Deutschland 90, Japan 72, Vereinigtes
 * Königreich 63, Frankreich 52, Indien 50, China 42, Kanada 33, Schweiz 27,
 * Australien 26, Niederlande 25, Brasilien 21, Südkorea 18, Schweden 17,
 * Taiwan 12, Italien 12, Spanien 12.
 *
 * Die Reihenfolge ist Absicht: Wer die Liste von oben liest, sieht zuerst,
 * was am meisten trüge.
 */
const KANDIDATEN: Kandidat[] = [
  /* ------------------------------------------------------ Deutschland: 90 */
  {
    wo: 'Deutsche Börse',
    betrifft: 'Deutschland 90',
    url: 'https://www.deutsche-boerse-cash-market.com/dbcm-de/instrumente-statistiken/statistiken/unternehmenskalender',
    gesucht: 'Unternehmenskalender als Seite oder Tabelle',
  },
  {
    wo: 'Bundesanzeiger',
    betrifft: 'Deutschland 90',
    url: 'https://www.bundesanzeiger.de/pub/de/suche?4',
    gesucht: 'Finanzkalender als regulierte Mitteilung',
  },
  {
    wo: 'EQS/DGAP',
    betrifft: 'Deutschland 90',
    url: 'https://www.eqs-news.com/de/news/finanzkalender',
    gesucht: 'gesammelte Finanzkalender der Emittenten',
  },

  /* ------------------------------- Vereinigtes Königreich: 63 */
  {
    wo: 'FCA – National Storage Mechanism',
    betrifft: 'UK 63',
    url: 'https://api.data.fca.org.uk/search?index=nsm&from=0&size=5&q=%22notice%20of%20results%22',
    gesucht: 'amtliches Archiv der Pflichtmitteilungen, „Notice of Results"',
  },
  {
    wo: 'London Stock Exchange',
    betrifft: 'UK 63',
    url: 'https://www.londonstockexchange.com/news?tab=upcoming-events',
    gesucht: 'Terminliste statt Stammdaten',
  },

  /* --------------------------------------- Euronext: Frankreich 52, NL 25 */
  {
    wo: 'Euronext',
    betrifft: 'Frankreich 52, Niederlande 25, Belgien, Portugal, Norwegen',
    url: 'https://live.euronext.com/en/products/equities/company-results-calendar',
    gesucht: 'Ergebniskalender – die Rubrik gibt es, die Frage ist das Format',
  },
  {
    wo: 'Euronext (Datei)',
    betrifft: 'dieselbe',
    url: 'https://live.euronext.com/en/financial-calendars',
    gesucht: 'Verweis auf XLSX oder CSV auf der Kalenderseite',
  },

  /* ------------------------------------------------------------ Indien: 50 */
  {
    wo: 'NSE Indien',
    betrifft: 'Indien 50',
    url: 'https://www.nseindia.com/api/event-calendar',
    gesucht: 'Terminkalender als JSON',
  },
  {
    wo: 'NSE Indien (Ergebnisse)',
    betrifft: 'Indien 50',
    url: 'https://www.nseindia.com/api/corporates-financial-results?index=equities',
    gesucht: 'gemeldete und geplante Ergebnistermine',
  },

  /* --------------------------------------------------- China und Hongkong */
  {
    wo: 'HKEX',
    betrifft: 'China 42, Hongkong 10',
    url: 'https://www1.hkexnews.hk/ncms/script/eds/newsheadlines_c.json',
    gesucht: 'Meldungsköpfe als JSON statt Suchmaske',
  },

  /* ------------------------------------------------------------ Kanada: 33 */
  {
    wo: 'SEDAR+ (Kanada)',
    betrifft: 'Kanada 33',
    url: 'https://www.sedarplus.ca/csa-party/service/create.html',
    gesucht: 'amtliches Einreichungsregister – Gegenstück zur SEC',
  },

  /* ------------------------------------------------------------ Schweiz: 27 */
  {
    wo: 'SIX Swiss Exchange',
    betrifft: 'Schweiz 27',
    url: 'https://www.six-group.com/fqs/ref.json?select=ISIN,ShortName&where=ValorSymbol=NESN',
    gesucht: 'die offene Abfrageschnittstelle – und ob sie Termine kennt',
  },
  {
    wo: 'SIX (Termine)',
    betrifft: 'Schweiz 27',
    url: 'https://www.six-group.com/en/products-services/the-swiss-stock-exchange/market-data/news-tools/upcoming-events.html',
    gesucht: 'Terminübersicht als Seite oder Tabelle',
  },

  /* --------------------------------------------------------- Australien: 26 */
  {
    wo: 'ASX',
    betrifft: 'Australien 26',
    url: 'https://www.asx.com.au/asx/1/company/BHP/announcements?count=10&market_sensitive=false',
    gesucht: 'die alte offene Schnittstelle – Meldungen je Unternehmen',
  },
  {
    wo: 'ASX (Kalender)',
    betrifft: 'Australien 26',
    url: 'https://www.asx.com.au/markets/trade-our-cash-market/upcoming-floats-and-listings',
    gesucht: 'Terminübersicht',
  },

  /* ---------------------------------------------------------- Südkorea: 18 */
  {
    wo: 'KRX',
    betrifft: 'Südkorea 18',
    url: 'http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd',
    gesucht: 'die offene Datenschnittstelle der Börse Seoul',
  },

  /* ------------------------------------------------------------ Taiwan: 12 */
  {
    wo: 'TWSE (Verzeichnis)',
    betrifft: 'Taiwan 12',
    url: 'https://openapi.twse.com.tw/v1/',
    gesucht:
      'das Verzeichnis aller offenen Datensätze – dort steht, ob ein Terminkalender dabei ist',
  },

  /* ------------------------------------------------ Italien 12, Spanien 12 */
  {
    wo: 'Borsa Italiana',
    betrifft: 'Italien 12',
    url: 'https://www.borsaitaliana.it/borsa/calendario-eventi-societari.html',
    gesucht: 'Kalender der Unternehmensereignisse',
  },
  {
    wo: 'BME (Madrid)',
    betrifft: 'Spanien 12',
    url: 'https://www.bolsasymercados.es/bme-exchange/en/Reports-Statistics',
    gesucht: 'Berichte und Statistiken – gibt es eine Terminliste?',
  },

  /* ------------------------------------------ Skandinavien: Schweden 17 u. a. */
  {
    wo: 'Nasdaq Nordic',
    betrifft: 'Schweden 17, Dänemark, Finnland',
    url: 'https://api.nasdaq.com/api/nordic/calendar/financial?date=2026-10-01',
    gesucht: 'Finanzkalender der nordischen Börsen',
  },

  /* ------------------------------------------------------------ Brasilien 21 */
  {
    wo: 'B3 (São Paulo)',
    betrifft: 'Brasilien 21',
    url: 'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetInitialCompanies/eyJsYW5ndWFnZSI6InB0LWJyIiwicGFnZU51bWJlciI6MSwicGFnZVNpemUiOjIwfQ==',
    gesucht: 'die offene Proxy-Schnittstelle der Listungsseite',
  },
]

interface Ergebnis extends Kandidat {
  status: number | string
  typ: string
  laenge: number
  /** Oberste Schlüssel, wenn die Antwort JSON ist. */
  schluessel?: string[]
  /** Verweise auf Tabellen, wenn die Antwort HTML ist. */
  tabellen?: string[]
  anfang: string
}

/** Verweise auf Tabellendateien in einer HTML-Seite, absolut. */
function tabellenverweise(html: string, basis: string): string[] {
  const gefunden = new Set<string>()
  for (const [, ziel] of html.matchAll(
    /href\s*=\s*["']([^"']+\.(?:xlsx|xls|csv))["']/gi
  )) {
    try {
      gefunden.add(new URL(ziel.trim(), basis).toString())
    } catch {
      /* Eine Adresse, die sich nicht auflösen lässt, ist kein Fund. */
    }
  }
  return [...gefunden]
}

async function pruefe(kandidat: Kandidat): Promise<Ergebnis> {
  try {
    const antwort = await fetch(kandidat.url, {
      headers: KOPFZEILEN,
      signal: AbortSignal.timeout(30_000),
    })
    const typ = antwort.headers.get('content-type') ?? '?'
    const text = await antwort.text()

    const ergebnis: Ergebnis = {
      ...kandidat,
      status: antwort.status,
      typ,
      laenge: text.length,
      anfang: text.slice(0, 400).replace(/\s+/g, ' '),
    }

    if (typ.includes('json')) {
      try {
        const daten: unknown = JSON.parse(text)
        ergebnis.schluessel = Array.isArray(daten)
          ? [`Array mit ${daten.length} Einträgen`]
          : Object.keys(daten as Record<string, unknown>).slice(0, 20)
      } catch {
        ergebnis.schluessel = ['(als JSON angekündigt, aber nicht lesbar)']
      }
    } else if (typ.includes('html')) {
      ergebnis.tabellen = tabellenverweise(text, kandidat.url)
    }

    return ergebnis
  } catch (fehler) {
    return {
      ...kandidat,
      status: `${(fehler as Error).name}: ${(fehler as Error).message.slice(0, 120)}`,
      typ: '—',
      laenge: 0,
      anfang: '',
    }
  }
}

async function main() {
  console.log(`${KANDIDATEN.length} Adressen, nach der Größe der Lücke sortiert.\n`)

  const ergebnisse: Ergebnis[] = []

  for (const kandidat of KANDIDATEN) {
    const e = await pruefe(kandidat)
    ergebnisse.push(e)

    console.log('='.repeat(78))
    console.log(`${e.wo}  –  ${e.betrifft}`)
    console.log(`  ${e.url}`)
    console.log(`  gesucht: ${e.gesucht}`)
    console.log(`  STATUS ${e.status}   TYP ${e.typ}   ${e.laenge} Zeichen`)
    if (e.schluessel) console.log(`  JSON-Schlüssel: ${e.schluessel.join(', ')}`)
    if (e.tabellen?.length) {
      console.log(`  ${e.tabellen.length} Tabellen verlinkt:`)
      for (const t of e.tabellen.slice(0, 10)) console.log(`     ${t}`)
    } else if (e.tabellen) {
      console.log('  keine Tabelle verlinkt')
    }
    if (e.anfang) console.log(`  Anfang: ${e.anfang.slice(0, 260)}`)

    // Eine Sekunde zwischen zwei Häusern – niemand wird hier gedrängt.
    await new Promise((fertig) => setTimeout(fertig, 1000))
  }

  /*
    Die Zusammenfassung am Ende, nicht nur die Einzelzeilen.

    Zweiundzwanzig Abschnitte liest niemand zu Ende; die Frage lautet „welche
    trägt", und die gehört an die Stelle, an der man aufhört zu lesen.
  */
  console.log(`\n${'='.repeat(78)}\nWas geantwortet hat\n${'='.repeat(78)}`)
  for (const e of ergebnisse) {
    const traegt =
      e.status === 200 && (e.schluessel !== undefined || (e.tabellen?.length ?? 0) > 0)
    console.log(
      `  ${traegt ? '→ ansehen ' : '          '}${String(e.status).padEnd(6)} ` +
        `${e.wo.padEnd(30)} ${e.betrifft}`
    )
  }

  await writeFile(BERICHT, JSON.stringify(ergebnisse, null, 2))
  console.log(`\nVollständig in ${BERICHT}.`)
}

await main()
