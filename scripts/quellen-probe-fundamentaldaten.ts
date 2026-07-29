/**
 * Sucht bei der SEC nach den Aktien, für die es hier noch keine
 * Unternehmenszahlen gibt.
 *
 * ## Die Frage
 *
 * `scripts/fundamentaldaten-abrufen.ts` fragt die SEC nach Kürzeln. Für Apple
 * heißt das Kürzel dort wie hier `AAPL`, und alles passt. Für Allianz heißt es
 * hier `ALV.DE` – das Kürzel der Frankfurter Börse –, und die SEC kennt es
 * nicht. Bisher überbrückt eine Tabelle mit **vier** Einträgen diesen
 * Unterschied.
 *
 * Die naheliegende Annahme war: außerhalb der USA meldet niemand bei der SEC.
 * Das stimmt so nicht. Wer als ausländisches Unternehmen einen
 * Hinterlegungsschein in New York gelistet hat, reicht jedes Jahr einen
 * Geschäftsbericht als `20-F` ein – Kanadier als `40-F`. Diese Berichte liegen
 * im selben XBRL-Format wie die amerikanischen und sind genauso frei abrufbar.
 *
 * Wie viele der hier geführten Werte das betrifft, weiß niemand auswendig.
 * Diese Sonde zählt es aus.
 *
 * ## Warum über den Namen und nicht über das Kürzel
 *
 * Das Kürzel eines Hinterlegungsscheins hat mit dem Heimatkürzel oft nichts zu
 * tun: Aus `9988.HK` wird `BABA`, aus `PETR4.SA` wird `PBR`, aus `NOVO-B.CO`
 * wird `NVO`. Man kann das nicht ableiten, nur nachschlagen. Der Firmenname
 * dagegen steht auf beiden Seiten – in unterschiedlicher Schreibweise, aber
 * vergleichbar, wenn man Rechtsformzusätze abräumt.
 *
 * Der Abgleich schlägt deshalb Kandidaten vor und prüft jeden mit einem echten
 * Abruf nach. Was hier herauskommt, ist eine Vorlage zum Durchsehen und keine
 * Tabelle, die ungelesen ins Abrufskript wandert: Ein falsch zugeordnetes
 * Unternehmen fiele auf der Website niemandem auf, weil die Zahlen ja plausibel
 * aussähen.
 *
 * ## Warum das nicht in der Entwicklungsumgebung läuft
 *
 * Dort ist außer npm und GitHub nichts erreichbar. Diese Datei läuft auf einem
 * GitHub-Läufer, angestoßen über `.github/workflows/quellen-probe.yml`.
 *
 * Aufruf: `node --experimental-strip-types scripts/quellen-probe-fundamentaldaten.ts`
 */

import { readFile, writeFile } from 'node:fs/promises'

const KOPFZEILEN: Record<string, string> = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  'Accept-Encoding': 'gzip, deflate',
}

const TICKER_URL = 'https://www.sec.gov/files/company_tickers.json'
const FAKTEN_BASIS = 'https://data.sec.gov/api/xbrl/companyfacts'
const SNAPSHOT = 'data/snapshots/fundamentaldaten.json'
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']
const BERICHT = 'sec-kandidaten.json'

/**
 * Rechtsformen und Beiwerk, die im Namensvergleich nichts zu suchen haben.
 *
 * „Allianz SE“ und „ALLIANZ SE /FI“ sind dasselbe Unternehmen; „Toyota Motor“
 * und „TOYOTA MOTOR CORP/“ auch. Übrig bleiben soll der Kern des Namens.
 */
const BEIWERK = new Set([
  'THE',
  'AG',
  'SE',
  'NV',
  'PLC',
  'SA',
  'SAB',
  'SPA',
  'AB',
  'ASA',
  'AS',
  'OYJ',
  'INC',
  'CORP',
  'CORPORATION',
  'CO',
  'COMPANY',
  'LTD',
  'LIMITED',
  'HOLDING',
  'HOLDINGS',
  'GROUP',
  'GRP',
  'PUBLIC',
  'ADR',
  'ADS',
  'SPONSORED',
  'CLASS',
  'GMBH',
  'KGAA',
  'KGAA',
  'BV',
  'CV',
  'AKTIENGESELLSCHAFT',
  'SOCIETE',
  'ANONYME',
  'NEW',
  'ORD',
  'SHS',
])

function normalisiere(name: string): string {
  return name
    .toUpperCase()
    .replace(/[ÄÀÁÂÃÅ]/g, 'A')
    .replace(/[ÖÒÓÔÕØ]/g, 'O')
    .replace(/[ÜÙÚÛ]/g, 'U')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[Ç]/g, 'C')
    .replace(/[Ñ]/g, 'N')
    .replace(/ß/g, 'SS')
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, ' ')
    .split(' ')
    .filter((wort) => wort && !BEIWERK.has(wort))
    .join(' ')
    .trim()
}

interface Aktie {
  ticker: string
  name: string
  waehrung: string
}

/** Die Aktien aus dem Katalog – gelesen wie im Abrufskript, über den Dateitext. */
async function katalog(): Promise<Aktie[]> {
  const aktien: Aktie[] = []
  for (const datei of KATALOG) {
    const text = await readFile(datei, 'utf8')
    /*
      Der Name steht in einfachen **oder** doppelten Anführungszeichen.

      Drei Einträge tragen ein Apostroph im Namen – "McDonald's", "L'Oréal",
      "Sainsbury's" – und stehen deshalb in doppelten. Ein Muster nur für
      einfache übersieht genau diese drei, ohne dass etwas fehlschlägt.
    */
    for (const treffer of text.matchAll(
      /^\s*ticker: '([^']+)',\n\s*name: (?:'([^']*)'|"([^"]*)"),\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
    )) {
      if (treffer[4] !== 'stock') continue
      aktien.push({
        ticker: treffer[1],
        name: treffer[2] ?? treffer[3],
        waehrung: treffer[5],
      })
    }
  }
  return aktien
}

async function hole(url: string, stillBei404 = false): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      if (!(stillBei404 && antwort.status === 404)) {
        console.log(`  ${antwort.status} bei ${url}`)
      }
      return null
    }
    return await antwort.json()
  } catch (fehler) {
    console.log(`  Fehler: ${fehler instanceof Error ? fehler.message : fehler}`)
    return null
  }
}

/** Die fünf gesuchten Größen, je Rechnungslegung. */
const FELDER = {
  'us-gaap': {
    umsatz: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues'],
    gewinn: ['NetIncomeLoss'],
    cashflow: [
      'NetCashProvidedByUsedInOperatingActivities',
      'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
    ],
    eigenkapital: [
      'StockholdersEquity',
      'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
    ],
  },
  'ifrs-full': {
    umsatz: ['Revenue', 'RevenueFromContractsWithCustomers'],
    gewinn: ['ProfitLoss', 'ProfitLossAttributableToOwnersOfParent'],
    cashflow: ['CashFlowsFromUsedInOperatingActivities'],
    eigenkapital: ['Equity', 'EquityAttributableToOwnersOfParent'],
  },
} as const

interface Fakten {
  entityName?: string
  facts?: Record<string, Record<string, { units?: Record<string, unknown[]> }>>
}

/** Was in den Unternehmensfakten tatsächlich steht. */
function auswerten(fakten: Fakten) {
  const ergebnis: {
    taxonomie: string
    waehrungen: Set<string>
    felder: string[]
    aktien: boolean
  }[] = []

  for (const [taxonomie, gruppen] of Object.entries(FELDER)) {
    const vorhanden = fakten.facts?.[taxonomie]
    if (!vorhanden) continue
    const felder: string[] = []
    const waehrungen = new Set<string>()
    for (const [feld, tags] of Object.entries(gruppen)) {
      for (const tag of tags) {
        const einheiten = vorhanden[tag]?.units
        if (!einheiten) continue
        felder.push(feld)
        for (const einheit of Object.keys(einheiten)) {
          if (einheit !== 'shares' && einheit !== 'pure') waehrungen.add(einheit)
        }
        break
      }
    }
    if (felder.length) {
      ergebnis.push({
        taxonomie,
        waehrungen,
        felder,
        aktien: Boolean(fakten.facts?.dei?.EntityCommonStockSharesOutstanding),
      })
    }
  }
  return ergebnis
}

async function main() {
  console.log('Katalog lesen …')
  const aktien = await katalog()
  console.log(`${aktien.length} Aktien im Katalog.`)

  const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8')) as {
    unternehmen: Record<string, unknown>
  }
  const haben = new Set(Object.keys(snapshot.unternehmen))
  const offen = aktien.filter((a) => !haben.has(a.ticker))
  console.log(`${aktien.length - offen.length} haben Zahlen, ${offen.length} fehlen.\n`)

  console.log('Kürzelverzeichnis der SEC holen …')
  const roh = (await hole(TICKER_URL)) as Record<
    string,
    { cik_str: number; ticker: string; title: string }
  > | null
  if (!roh) throw new Error('Verzeichnis nicht erreichbar.')
  const secListe = Object.values(roh)
  console.log(`${secListe.length} Einträge bei der SEC.\n`)

  /*
    Namensschlüssel auf Kennnummern.

    Mehrere Kürzel je Kennnummer sind der Regelfall (Stamm- und Vorzugsaktien,
    verschiedene Gattungen). Gesucht wird das Unternehmen, nicht die Gattung.
  */
  const nachName = new Map<string, { cik: number; ticker: string; titel: string }[]>()
  /*
    Zweiter Schlüssel ohne Leerzeichen.

    „ExxonMobil“ steht hier als ein Wort, bei der SEC als „EXXON MOBIL CORP“.
    Nach dem Abräumen der Rechtsform bleibt „EXXONMOBIL“ gegen „EXXON MOBIL“ –
    zwei Zeichenketten, die kein Vergleich zusammenbringt, der Leerzeichen
    ernst nimmt. Dasselbe betrifft „Coca-Cola“, „T-Mobile“ und jeden Namen, bei
    dem die eine Seite trennt und die andere nicht.
  */
  const nachGepresst = new Map<string, { cik: number; ticker: string; titel: string }[]>()
  const nachKuerzel = new Map<string, { cik: number; ticker: string; titel: string }>()

  for (const e of secListe) {
    const eintrag = { cik: e.cik_str, ticker: e.ticker, titel: e.title }
    nachKuerzel.set(e.ticker, eintrag)

    const schluessel = normalisiere(e.title)
    if (!schluessel) continue
    nachName.set(schluessel, [...(nachName.get(schluessel) ?? []), eintrag])
    const gepresst = schluessel.replace(/ /g, '')
    nachGepresst.set(gepresst, [...(nachGepresst.get(gepresst) ?? []), eintrag])
  }

  const schluessel = [...nachName.keys()]

  /**
   * Kandidaten für eine Aktie.
   *
   * Zuerst das Kürzel: Wer hier `XOM` heißt, heißt bei der SEC auch `XOM` –
   * dafür braucht es keinen Namensvergleich, und ein Treffer über das Kürzel
   * ist sicherer als jeder über den Namen. Erst danach die Namenswege.
   */
  function kandidaten(aktie: Aktie) {
    const ueberKuerzel = nachKuerzel.get(aktie.ticker)
    if (ueberKuerzel) return [{ ...ueberKuerzel, art: 'Kürzel' as const }]

    const gesucht = normalisiere(aktie.name)
    if (!gesucht) return []

    const genau = nachName.get(gesucht)
    if (genau) return genau.map((k) => ({ ...k, art: 'Name' as const }))

    const gepresst = nachGepresst.get(gesucht.replace(/ /g, ''))
    if (gepresst)
      return gepresst.map((k) => ({ ...k, art: 'Name ohne Leerzeichen' as const }))

    // Nur ausreichend lange Namen, sonst trifft „BP“ auf alles.
    if (gesucht.length < 5) return []
    const treffer = schluessel.filter(
      (s) => s.startsWith(gesucht + ' ') || gesucht.startsWith(s + ' ')
    )
    return treffer.flatMap((s) =>
      nachName.get(s)!.map((k) => ({ ...k, art: 'Wortanfang' as const }))
    )
  }

  const zuPruefen: {
    aktie: Aktie
    cik: number
    secTicker: string
    titel: string
    art: string
  }[] = []
  const ohneKandidat: Aktie[] = []

  for (const aktie of offen) {
    const gefunden = kandidaten(aktie)
    if (!gefunden.length) {
      ohneKandidat.push(aktie)
      continue
    }
    // Je Kennnummer nur einmal prüfen; das kürzeste Kürzel ist meist das ADR.
    const proCik = new Map<number, (typeof gefunden)[number]>()
    for (const k of gefunden) {
      const bisher = proCik.get(k.cik)
      if (!bisher || k.ticker.length < bisher.ticker.length) proCik.set(k.cik, k)
    }
    for (const k of proCik.values()) {
      zuPruefen.push({
        aktie,
        cik: k.cik,
        secTicker: k.ticker,
        titel: k.titel,
        art: k.art,
      })
    }
  }

  console.log(
    `${zuPruefen.length} Kandidaten für ${offen.length - ohneKandidat.length} Aktien.`
  )
  console.log(`${ohneKandidat.length} Aktien ohne jeden Kandidaten.\n`)
  console.log('Jeden Kandidaten mit einem echten Abruf prüfen …\n')

  const bestaetigt: Record<string, unknown>[] = []
  let nr = 0

  for (const k of zuPruefen) {
    nr += 1
    const url = `${FAKTEN_BASIS}/CIK${String(k.cik).padStart(10, '0')}.json`
    const fakten = (await hole(url, true)) as Fakten | null
    // Die SEC bittet um Zurückhaltung: höchstens zehn Abrufe je Sekunde.
    await new Promise((fertig) => setTimeout(fertig, 130))
    if (!fakten) continue

    if (nr % 25 === 0) {
      console.log(`  … ${nr} von ${zuPruefen.length} geprüft`)
      // Zwischenstand sichern: Bricht der Lauf ab, ist nicht alles verloren.
      await writeFile(BERICHT, JSON.stringify({ bestaetigt, ohneKandidat }, null, 2))
    }

    const auswertung = auswerten(fakten)
    if (!auswertung.length) continue

    for (const a of auswertung) {
      const waehrungen = [...a.waehrungen]
      const passt = waehrungen.includes(k.aktie.waehrung)
      const zeile = {
        katalog: k.aktie.ticker,
        name: k.aktie.name,
        kursWaehrung: k.aktie.waehrung,
        secTicker: k.secTicker,
        secName: fakten.entityName ?? k.titel,
        cik: k.cik,
        taxonomie: a.taxonomie,
        berichtsWaehrungen: waehrungen,
        waehrungPasst: passt,
        felder: a.felder,
        aktienzahl: a.aktien,
        art: k.art,
      }
      bestaetigt.push(zeile)
      console.log(
        `${String(nr).padStart(3)}/${zuPruefen.length} ` +
          `${k.aktie.ticker.padEnd(12)} → ${k.secTicker.padEnd(6)} ` +
          `${a.taxonomie.padEnd(9)} ${waehrungen.join('/').padEnd(7)} ` +
          `${passt ? 'Währung passt' : `Kurs in ${k.aktie.waehrung}`}  ` +
          `${a.felder.length}/4 Größen  ${k.art === 'genau' ? '' : '(Wortanfang) '}` +
          `${k.aktie.name} = ${fakten.entityName ?? k.titel}`
      )
    }
  }

  console.log(`\n${'='.repeat(70)}`)
  console.log(`Bestätigt: ${bestaetigt.length} Datensätze`)
  const gleicheWaehrung = bestaetigt.filter((b) => b.waehrungPasst)
  console.log(`  davon in der Kurswährung: ${gleicheWaehrung.length}`)
  console.log(`  davon in fremder Währung: ${bestaetigt.length - gleicheWaehrung.length}`)
  console.log(`\nOhne Kandidat (${ohneKandidat.length}):`)
  console.log(ohneKandidat.map((a) => `${a.ticker} (${a.name})`).join(', '))

  await writeFile(BERICHT, JSON.stringify({ bestaetigt, ohneKandidat }, null, 2))
  console.log(`\nVollständige Liste in ${BERICHT}.`)
}

await main()
