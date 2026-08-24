/**
 * Zweite Runde: dieselben Börsen, andere Adressen.
 *
 * ## Warum es eine zweite Runde gibt
 *
 * Die Sonde `boersen` hat am 24. August 2026 zweiundzwanzig Adressen geprüft
 * und drei offene gefunden – Indien, die Schweizer Abfrageschnittstelle und
 * den Listungs-Proxy in São Paulo. Der Rest antwortete mit 404, 403 oder mit
 * einer Seite, die ihre Tabelle erst im Browser zusammenbaut.
 *
 * Bei genauem Hinsehen sind die 404 aber **keine Absagen, sondern Fehlgriffe
 * meinerseits**. Vier Börsen liefern ihre eigenen Seiten aus einer offenen
 * Schnittstelle, die schlicht woanders liegt als geraten:
 *
 * - **ASX**: `www.asx.com.au/asx/1/...` ist seit Jahren abgeschaltet. Die
 *   heutige Seite zieht ihre Daten von `asx.api.markitdigital.com`.
 * - **TWSE**: `openapi.twse.com.tw/v1/` ist nur die Startseite der
 *   Dokumentation. Das Verzeichnis der Datensätze steht in `swagger.json`.
 * - **TMX**: `money.tmx.com` fragt `app-money.tmx.com/graphql` – eine Adresse,
 *   die auf einen GET gar nicht antworten kann und deshalb als 404 erschien.
 * - **HKEX**: `hkexnews.hk` führt seine Meldungen unter `/ncms/`.
 *
 * Das ist der Unterschied zwischen „geprüft und nichts gefunden" und „an der
 * falschen Tür geklopft". AGENTS.md hält den Satz fest:
 *
 * > „Geprüft und nichts gefunden" ist ein Zwischenstand, kein Ergebnis.
 *
 * ## Was hier gefragt wird
 *
 * Für jede Adresse dieselben vier Fragen wie bei der indischen Sonde, und die
 * dritte ist die, an der es zuletzt gescheitert ist:
 *
 * 1. Antwortet sie ohne Schlüssel?
 * 2. Steht in der Antwort ein **Datum in der Zukunft**?
 * 3. Steht darin ein **Ergebnistermin** – oder nur Dividenden, Splits und
 *    Hauptversammlungen? Ein Kalender voller Kapitalmaßnahmen sieht aus wie
 *    ein Fund und trägt keinen einzigen unserer Titel.
 * 4. Deckt sie **den Markt** ab oder nur das eine abgefragte Unternehmen?
 *
 * Frage 4 entscheidet über die Bauart. Tokio liefert eine Tabelle für alle;
 * eine Schnittstelle je Unternehmen bedeutet bei 26 australischen Titeln
 * 26 Abrufe – machbar, aber etwas anderes.
 *
 * ## Was hier nicht passiert
 *
 * Kein Cookie, keine Sitzung, keine im Browser errechnete Kennung. Abgerufen
 * wird mit einem gewöhnlichen `User-Agent`. Wer mehr verlangt, hat eine Sperre
 * gesetzt, und die wird nicht nachgebaut – dieselbe Entscheidung wie bei
 * Yahoo, Stooq, Euronext und der Börse Frankfurt.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `boersen2`.
 */

import { writeFile } from 'node:fs/promises'

const BERICHT = 'boersen2-kalender.json'

const KOPFZEILEN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en,de;q=0.8',
  Accept: 'application/json, text/plain, */*',
}

interface Kandidat {
  wo: string
  betrifft: string
  url: string
  /** Was dort zu finden sein müsste, damit es zählt. */
  gesucht: string
  /** Deckt die Adresse den ganzen Markt ab oder nur ein Unternehmen? */
  umfang: 'markt' | 'je-unternehmen'
  /** Ein POST braucht einen Körper; ohne bleibt es bei GET. */
  koerper?: { inhalt: string; typ: string }
}

/**
 * Die Kandidaten, nach der Größe der Lücke sortiert.
 *
 * Zahlen aus `npm run abdeckung` vom 24. August 2026: 711 Aktien ohne
 * kommenden Termin, davon China 42, Kanada 33, Schweiz 27, Australien 26,
 * Brasilien 21, Südkorea 18, Taiwan 12.
 *
 * Deutschland (90), Vereinigtes Königreich (63), Frankreich (52) und die
 * Niederlande (25) stehen **nicht** in dieser Liste. Dort ist die Antwort aus
 * der ersten Runde keine Fehladresse, sondern eine gesetzte Sperre: Euronext
 * schickt `antibot`, die Börse Frankfurt verlangt eine im Browser errechnete
 * Kennung. Eine zweite Runde ändert daran nichts.
 */
const KANDIDATEN: Kandidat[] = [
  /* ----------------------------------------------------------- China: 42 */
  {
    wo: 'HKEX (Meldungen)',
    betrifft: 'China 42',
    url: 'https://www1.hkexnews.hk/ncms/script/eds/newlisting_c.json',
    gesucht: 'ob das Meldeverzeichnis überhaupt offene JSON-Dateien führt',
    umfang: 'markt',
  },
  {
    wo: 'HKEX (Kalender)',
    betrifft: 'China 42',
    url: 'https://www.hkex.com.hk/services/trading/securities/securitieslists/ListOfSecurities.xlsx',
    gesucht: 'die Wertpapierliste als Tabelle – trägt sie eine Terminspalte?',
    umfang: 'markt',
  },

  /* ---------------------------------------------------------- Kanada: 33 */
  {
    wo: 'TMX (GraphQL)',
    betrifft: 'Kanada 33',
    url: 'https://app-money.tmx.com/graphql',
    gesucht: 'die Schnittstelle hinter money.tmx.com – kennt sie Termine?',
    umfang: 'je-unternehmen',
    koerper: {
      typ: 'application/json',
      inhalt: JSON.stringify({
        operationName: 'getQuoteBySymbol',
        variables: { symbol: 'RY', locale: 'en' },
        query:
          'query getQuoteBySymbol($symbol: String, $locale: String) { ' +
          'getQuoteBySymbol(symbol: $symbol, locale: $locale) { ' +
          'symbol name price peRatio dividendFrequency __typename } }',
      }),
    },
  },

  /* --------------------------------------------------------- Schweiz: 27 */
  {
    wo: 'SIX (Termine je Titel)',
    betrifft: 'Schweiz 27',
    url: 'https://www.six-group.com/fqs/ref.json?select=ISIN,ShortName,NextEventDate,NextEventName&where=ValorSymbol=NESN',
    gesucht: 'ob die offene Abfrage überhaupt ein Terminfeld kennt',
    umfang: 'je-unternehmen',
  },
  {
    wo: 'SIX (Ereignisse)',
    betrifft: 'Schweiz 27',
    url: 'https://www.six-group.com/fqs/events.json?select=*&where=ValorSymbol=NESN',
    gesucht: 'eine eigene Ereignis-Abfrage neben ref und delayed',
    umfang: 'je-unternehmen',
  },
  {
    wo: 'SIX (Mitteilungen)',
    betrifft: 'Schweiz 27',
    url: 'https://www.six-group.com/exchanges/newsboard/api/v1/news?limit=50&language=en',
    gesucht: 'das Mitteilungsboard – dort kündigen Emittenten ihre Termine an',
    umfang: 'markt',
  },

  /* ------------------------------------------------------ Australien: 26 */
  {
    wo: 'ASX (Ereignisse)',
    betrifft: 'Australien 26',
    url: 'https://asx.api.markitdigital.com/asx-research/1.0/companies/BHP/key-events',
    gesucht: 'die Schnittstelle hinter der heutigen ASX-Seite, Termine je Titel',
    umfang: 'je-unternehmen',
  },
  {
    wo: 'ASX (Stammdaten)',
    betrifft: 'Australien 26',
    url: 'https://asx.api.markitdigital.com/asx-research/1.0/companies/BHP/header',
    gesucht: 'ob dieselbe Schnittstelle ohne Schlüssel antwortet',
    umfang: 'je-unternehmen',
  },
  {
    wo: 'ASX (Meldungen)',
    betrifft: 'Australien 26',
    url: 'https://asx.api.markitdigital.com/asx-research/1.0/companies/BHP/announcements?count=20',
    gesucht: 'Pflichtmeldungen – dort steht die Ankündigung des Termins',
    umfang: 'je-unternehmen',
  },

  /* ------------------------------------------------------- Brasilien: 21 */
  {
    wo: 'B3 (Ereignisse)',
    betrifft: 'Brasilien 21',
    url:
      'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetListedSupplementCompany/' +
      Buffer.from(JSON.stringify({ issuingCompany: 'PETR', language: 'pt-br' })).toString(
        'base64'
      ),
    gesucht: 'die Zusatzdaten einer Gesellschaft – steht dort ein Termin?',
    umfang: 'je-unternehmen',
  },
  {
    wo: 'B3 (Kalender)',
    betrifft: 'Brasilien 21',
    url:
      'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetListedCorporateEvents/' +
      Buffer.from(
        JSON.stringify({ issuingCompany: 'PETR', language: 'pt-br', dateInitial: '' })
      ).toString('base64'),
    gesucht: 'die Unternehmensereignisse – Ergebnistermin oder nur Dividenden?',
    umfang: 'je-unternehmen',
  },

  /* -------------------------------------------------------- Südkorea: 18 */
  {
    wo: 'KIND (Seoul)',
    betrifft: 'Südkorea 18',
    url: 'https://kind.krx.co.kr/disclosure/todaydisclosure.do?method=searchTodayDisclosureMain',
    gesucht: 'das Meldeportal der Börse Seoul – antwortet es ohne Sitzung?',
    umfang: 'markt',
  },
  {
    wo: 'DART (Verzeichnis)',
    betrifft: 'Südkorea 18',
    url: 'https://opendart.fss.or.kr/api/list.json?corp_code=00126380&bgn_de=20260101',
    gesucht: 'die amtliche Schnittstelle – die Absage nennt, ob nur ein Schlüssel fehlt',
    umfang: 'markt',
  },

  /* ---------------------------------------------------------- Taiwan: 12 */
  {
    wo: 'TWSE (Verzeichnis)',
    betrifft: 'Taiwan 12',
    url: 'https://openapi.twse.com.tw/v1/swagger.json',
    gesucht: 'das Verzeichnis aller offenen Datensätze – steht ein Kalender darin?',
    umfang: 'markt',
  },
  {
    wo: 'TWSE (Meldungen)',
    betrifft: 'Taiwan 12',
    url: 'https://openapi.twse.com.tw/v1/opendata/t187ap04_L',
    gesucht: 'ein Datensatz zur Probe – antwortet die Schnittstelle wirklich?',
    umfang: 'markt',
  },
]

/**
 * Ein Datum im Text, das in der Zukunft liegt – der eigentliche Fund.
 *
 * Nur zwei Schreibweisen, und beide sind eindeutig: `2026-11-04` und
 * `20261104`. Die dritte verbreitete – `04/11/2026` – bleibt draußen, weil
 * niemand ihr ansieht, ob sie den 4. November oder den 11. April meint. Ein
 * Datum, das in der Hälfte der Fälle falsch ist, ist als Messwert wertlos.
 */
const DATUMSMUSTER = [/\b(20\d\d)-(\d\d)-(\d\d)\b/g, /\b(20\d\d)(\d\d)(\d\d)\b/g]

/** Wörter, die einen Ergebnistermin bezeichnen – in vier Sprachen. */
const ERGEBNISWORTE =
  /(financial|quarterly|interim|annual|half.?year|full.?year)\s*(results?|report|statement)|earnings|resultado|balanço|決算|실적|재무제표|Jahresabschluss|Quartalszahlen/i

/** Wörter, die etwas anderes bezeichnen – der häufigste Fehlalarm. */
const ANDERE_WORTE = /dividend|split|meeting|agm|egm|buyback|rights\s*issue|dividendo/i

function datenInDerZukunft(text: string, heute: string): string[] {
  const gefunden = new Set<string>()
  for (const muster of DATUMSMUSTER) {
    for (const [, jahr, monat, tag] of text.matchAll(muster)) {
      if (monat < '01' || monat > '12' || tag < '01' || tag > '31') continue
      const iso = `${jahr}-${monat}-${tag}`
      if (iso > heute && iso < '2030-01-01') gefunden.add(iso)
    }
  }
  return [...gefunden].sort()
}

interface Ergebnis extends Kandidat {
  status: number | string
  typ: string
  laenge: number
  /** Oberste Schlüssel, wenn die Antwort JSON ist. */
  schluessel?: string[]
  /** Datumsangaben in der Zukunft – die Frage, auf die es ankommt. */
  kuenftig?: string[]
  /** Steht ein Wort für „Ergebnistermin" darin? */
  ergebnisworte?: boolean
  /** Steht ein Wort für Dividende, Split oder Hauptversammlung darin? */
  andereWorte?: boolean
  anfang: string
}

async function pruefe(kandidat: Kandidat, heute: string): Promise<Ergebnis> {
  try {
    const antwort = await fetch(kandidat.url, {
      method: kandidat.koerper ? 'POST' : 'GET',
      headers: kandidat.koerper
        ? { ...KOPFZEILEN, 'Content-Type': kandidat.koerper.typ }
        : KOPFZEILEN,
      body: kandidat.koerper?.inhalt,
      signal: AbortSignal.timeout(30_000),
      redirect: 'follow',
    })
    const typ = antwort.headers.get('content-type') ?? '(ohne)'
    const roh = await antwort.text()

    let schluessel: string[] | undefined
    try {
      const daten: unknown = JSON.parse(roh)
      schluessel = Array.isArray(daten)
        ? [`Array mit ${daten.length}`, ...Object.keys((daten[0] as object) ?? {})]
        : Object.keys(daten as object)
    } catch {
      /* Kein JSON – dann sagen Datumsangaben und Wortwahl umso mehr. */
    }

    return {
      ...kandidat,
      status: antwort.status,
      typ,
      laenge: roh.length,
      schluessel,
      kuenftig: datenInDerZukunft(roh, heute).slice(0, 12),
      ergebnisworte: ERGEBNISWORTE.test(roh),
      andereWorte: ANDERE_WORTE.test(roh),
      anfang: roh.slice(0, 400).replace(/\s+/g, ' '),
    }
  } catch (fehler) {
    return {
      ...kandidat,
      status: (fehler as Error).name,
      typ: '(kein Abruf)',
      laenge: 0,
      anfang: (fehler as Error).message,
    }
  }
}

async function main() {
  const heute = new Date().toISOString().slice(0, 10)
  console.log(`${KANDIDATEN.length} Adressen, Stichtag ${heute}.\n`)

  const ergebnisse: Ergebnis[] = []
  for (const kandidat of KANDIDATEN) {
    const ergebnis = await pruefe(kandidat, heute)
    ergebnisse.push(ergebnis)

    console.log('='.repeat(78))
    console.log(`${ergebnis.wo}  (${ergebnis.betrifft}, ${ergebnis.umfang})`)
    console.log(`  ${ergebnis.url}`)
    console.log(`  gesucht: ${ergebnis.gesucht}`)
    console.log(
      `  STATUS ${ergebnis.status}  ${ergebnis.typ}  ${ergebnis.laenge} Zeichen`
    )
    if (ergebnis.schluessel) console.log(`  JSON: ${ergebnis.schluessel.join(', ')}`)
    if (ergebnis.kuenftig?.length) {
      console.log(`  künftige Daten: ${ergebnis.kuenftig.join(', ')}`)
    }
    console.log(
      `  Ergebnisworte: ${ergebnis.ergebnisworte ? 'ja' : 'nein'}` +
        `   Dividende/HV/Split: ${ergebnis.andereWorte ? 'ja' : 'nein'}`
    )
    console.log(`  Anfang: ${ergebnis.anfang.slice(0, 240)}`)

    // Anderthalb Sekunden zwischen zwei Abrufen – niemand wird hier gedrängt.
    await new Promise((f) => setTimeout(f, 1500))
  }

  /* ------------------------------------------------------- Die Kurzfassung */

  console.log(`\n${'='.repeat(78)}\nWas trägt\n`)
  const traegt = ergebnisse.filter(
    (e) => e.status === 200 && (e.kuenftig?.length ?? 0) > 0 && e.ergebnisworte
  )
  if (traegt.length === 0) {
    console.log('  keine Adresse liefert ein künftiges Datum mit Ergebnisbezug')
  }
  for (const e of traegt) {
    console.log(`  ${e.wo}  (${e.betrifft}, ${e.umfang})  ${e.kuenftig?.length} Daten`)
  }

  await writeFile(BERICHT, JSON.stringify({ geprueft: heute, ergebnisse }, null, 2))
  console.log(`\nVollständig in ${BERICHT}.`)
}

await main()
