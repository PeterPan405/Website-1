/**
 * Zweite ESEF-Runde: Holt für die Kandidaten die tatsächlichen Zahlen.
 *
 * ## Was die erste Runde offenließ
 *
 * `quellen-probe-esef.ts` hat gezeigt, dass das Verzeichnis antwortet und dass
 * sich 98 der fehlenden Werte darin über den Namen wiederfinden. Damit ist die
 * Quelle bestätigt – aber eine Namensgleichheit ist noch keine Zahl, und dieses
 * Projekt hat schon einmal erlebt, was ein Namenstreffer wert ist: `MRK.DE`
 * traf Merck & Co., `RELIANCE.NS` einen Stahlhändler in Los Angeles.
 *
 * Diese Runde holt deshalb je Kandidat den jüngsten Abschluss und liest die
 * fünf gesuchten Größen heraus. Das Ergebnis ist eine Vorlage zum Durchsehen:
 * Erst wenn Umsatz und Eigenkapital in der erwarteten Größenordnung stehen,
 * darf eine Zuordnung in das Abrufskript.
 *
 * ## Wie ESEF-Abschlüsse aufgebaut sind
 *
 * Unter `json_url` liegt der Abschluss als xBRL-JSON: eine flache Liste von
 * Fakten, jeder mit `value` und `dimensions`. In den Dimensionen stehen der
 * Begriff (`concept`), der Zeitraum (`period`) und die Einheit (`unit`).
 *
 * Zwei Fallen stecken darin:
 *
 * 1. **Aufgegliederte Fakten.** Derselbe Umsatz steht ein Dutzend Mal in der
 *    Datei – einmal als Konzernumsatz und elfmal je Sparte oder Region. Die
 *    Aufgliederungen tragen zusätzliche Dimensionen. Genommen wird nur der
 *    Fakt, der außer Begriff, Zeitraum und Einheit nichts weiter trägt.
 * 2. **Vorjahreszahlen.** Ein Abschluss enthält immer auch das Vorjahr zum
 *    Vergleich. Maßgeblich ist der Zeitraum, der auf das Ende der Berichtsperiode
 *    läuft – nicht der erste Fakt, den man findet.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`; aus der
 * Entwicklungsumgebung ist außer npm und GitHub nichts erreichbar.
 */

import { readFile, writeFile } from 'node:fs/promises'

const VERZEICHNIS = 'https://filings.xbrl.org/api/filings'
const SNAPSHOT = 'data/snapshots/fundamentaldaten.json'
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']
const BERICHT = 'esef-werte.json'

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/vnd.api+json, application/json',
}

/** Rechtsformen und Beiwerk, die im Namensvergleich nichts zu suchen haben. */
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
  'ABP',
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
  'GROUPE',
  'GRP',
  'PUBLIC',
  'GMBH',
  'KGAA',
  'BV',
  'CV',
  'NA',
  'SASA',
  'SPOLKA',
  'AKCYJNA',
  'AKTIENGESELLSCHAFT',
  'SOCIETE',
  'ANONYME',
  'KONZERN',
  'SANV',
])

function normalisiere(name: string): string {
  return name
    .toUpperCase()
    .replace(/[ÄÀÁÂÃÅ]/g, 'A')
    .replace(/[ÖÒÓÔÕØ]/g, 'O')
    .replace(/[ÜÙÚÛ]/g, 'U')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/Ç/g, 'C')
    .replace(/Ñ/g, 'N')
    .replace(/ß/g, 'SS')
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, ' ')
    .split(' ')
    .filter((wort) => wort && !BEIWERK.has(wort))
    .join(' ')
    .trim()
}

/**
 * Die gesuchten Größen nach IFRS.
 *
 * Dieselben Bezeichner, aus denen das Abrufskript bereits die IFRS-Melder der
 * SEC liest – ESEF schreibt genau diese Taxonomie vor. Die Reihenfolge ist die
 * Rangfolge: Der erste Bezeichner, der einen Wert liefert, gewinnt.
 */
const GROESSEN = [
  {
    feld: 'umsatz' as const,
    tags: ['Revenue', 'RevenueFromContractsWithCustomers'],
    zeitraum: true,
  },
  {
    feld: 'gewinn' as const,
    tags: ['ProfitLossAttributableToOwnersOfParent', 'ProfitLoss'],
    zeitraum: true,
  },
  {
    feld: 'cashflow' as const,
    tags: ['CashFlowsFromUsedInOperatingActivities'],
    zeitraum: true,
  },
  {
    feld: 'eigenkapital' as const,
    tags: ['Equity', 'EquityAttributableToOwnersOfParent'],
    zeitraum: false,
  },
  {
    /*
      Die Aktienzahl ist der wacklige Teil.

      Ein ESEF-Abschluss muss sie nicht enthalten – anders als bei der SEC, wo
      sie auf dem Deckblatt jeder Meldung steht. `NumberOfSharesOutstanding`
      ist eine Angabe im Anhang, und wer sie auszeichnet, tut das freiwillig.
      Fehlt sie, fehlt das Kurs-Gewinn-Verhältnis – die Zahl selbst wird davon
      nicht falsch.
    */
    feld: 'aktien' as const,
    tags: [
      'NumberOfSharesOutstanding',
      'NumberOfSharesIssued',
      'WeightedAverageShares',
      'WeightedAverageNumberOfOrdinarySharesOutstanding',
    ],
    zeitraum: false,
  },
]

type Feld = (typeof GROESSEN)[number]['feld']

interface Aktie {
  ticker: string
  name: string
  waehrung: string
}

async function katalog(): Promise<Aktie[]> {
  const aktien: Aktie[] = []
  for (const datei of KATALOG) {
    const text = await readFile(datei, 'utf8')
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

async function hole(url: string): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, {
      headers: KOPFZEILEN,
      signal: AbortSignal.timeout(60_000),
    })
    if (!antwort.ok) {
      console.log(`  ${antwort.status} bei ${url}`)
      // Den Rumpf schließen, sonst bleibt die Verbindung halb gelesen stehen
      // und Node bricht später aus dem HTTP-Unterbau ab.
      await antwort.body?.cancel()
      return null
    }
    return await antwort.json()
  } catch (fehler) {
    console.log(
      `  Fehler bei ${url}: ${fehler instanceof Error ? fehler.message : fehler}`
    )
    return null
  }
}

interface Eintrag {
  id?: string
  attributes?: Record<string, unknown>
  relationships?: { entity?: { data?: { id?: string } } }
}
interface Seite {
  data?: Eintrag[]
  included?: { id?: string; type?: string; attributes?: Record<string, unknown> }[]
  links?: { next?: string }
  meta?: { count?: number }
}

/** Ein Abschluss, so weit er hier gebraucht wird. */
interface Abschluss {
  entitaet: string
  name: string
  land: string
  periodenende: string
  json: string
}

/**
 * Das Verzeichnis durchblättern und je Unternehmen den jüngsten Abschluss
 * behalten.
 *
 * Gefiltert wird nicht nach Land: Der Ländereintrag ist der Sitz der
 * Sammelstelle, nicht der des Unternehmens.
 */
async function verzeichnis(): Promise<Map<string, Abschluss>> {
  const namen = new Map<string, string>()
  const jeEntitaet = new Map<string, Abschluss>()

  let seite: string | null = `${VERZEICHNIS}?page%5Bsize%5D=500&include=entity`
  let seiten = 0

  while (seite && seiten < 60) {
    const antwort = (await hole(seite)) as Seite | null
    if (!antwort) break
    seiten += 1

    for (const e of antwort.included ?? []) {
      if (e.type !== 'entity' || !e.id) continue
      const name = String(e.attributes?.name ?? '')
      if (name) namen.set(e.id, name)
    }

    for (const f of antwort.data ?? []) {
      const entitaet = f.relationships?.entity?.data?.id
      const json = f.attributes?.json_url
      if (!entitaet || typeof json !== 'string' || !json) continue

      const periodenende = String(f.attributes?.period_end ?? f.attributes?.fy_end ?? '')
      const vorhanden = jeEntitaet.get(entitaet)
      if (vorhanden && vorhanden.periodenende >= periodenende) continue

      jeEntitaet.set(entitaet, {
        entitaet,
        name: namen.get(entitaet) ?? '',
        land: String(f.attributes?.country ?? ''),
        periodenende,
        json: new URL(json, 'https://filings.xbrl.org/').toString(),
      })
    }

    seite = antwort.links?.next
      ? new URL(antwort.links.next, VERZEICHNIS).toString()
      : null
    await new Promise((fertig) => setTimeout(fertig, 150))
  }

  console.log(`${seiten} Seiten gelesen, ${jeEntitaet.size} Unternehmen mit Abschluss.`)

  // Namen nachtragen, die erst auf einer späteren Seite mitkamen.
  const nachName = new Map<string, Abschluss>()
  for (const abschluss of jeEntitaet.values()) {
    const name = abschluss.name || namen.get(abschluss.entitaet) || ''
    if (!name) continue
    const schluessel = normalisiere(name)
    if (!schluessel || nachName.has(schluessel)) continue
    nachName.set(schluessel, { ...abschluss, name })
  }
  return nachName
}

interface Fakt {
  value?: unknown
  dimensions?: Record<string, string>
}
interface Bericht {
  facts?: Record<string, Fakt>
}

/** Dimensionen, die jeder Fakt trägt – alles Weitere ist eine Aufgliederung. */
const GRUNDDIMENSIONEN = new Set([
  'concept',
  'entity',
  'period',
  'unit',
  'language',
  'noteId',
])

function istKonzernwert(fakt: Fakt): boolean {
  const dimensionen = fakt.dimensions ?? {}
  return Object.keys(dimensionen).every((name) => GRUNDDIMENSIONEN.has(name))
}

/** Aus `2023-01-01T00:00:00/2024-01-01T00:00:00` wird `2024-01-01`. */
function periodenende(period: string | undefined): string {
  if (!period) return ''
  const teil = period.includes('/') ? period.split('/')[1] : period
  return teil.slice(0, 10)
}

/** Ob ein Zeitraum ein Jahr umfasst – ein Quartal unter derselben Überschrift wäre falsch. */
function istJahr(period: string | undefined): boolean {
  if (!period || !period.includes('/')) return false
  const [von, bis] = period.split('/')
  const tage = (Date.parse(bis) - Date.parse(von)) / 86_400_000
  return tage > 300 && tage < 430
}

interface Werte {
  umsatz?: number
  gewinn?: number
  cashflow?: number
  eigenkapital?: number
  aktien?: number
  waehrung?: string
  stichtag?: string
}

/**
 * Die fünf Größen aus einem Abschluss lesen.
 *
 * Maßgeblich ist der jüngste Stichtag, den die Datei kennt: Ein Abschluss
 * enthält immer auch das Vorjahr, und der erste gefundene Fakt ist genauso oft
 * der falsche wie der richtige.
 */
function werteAus(bericht: Bericht): Werte {
  const fakten = Object.values(bericht.facts ?? {})
  if (fakten.length === 0) return {}

  // Der jüngste Stichtag aller Zeitraumfakten – das Ende der Berichtsperiode.
  let stichtag = ''
  for (const fakt of fakten) {
    if (!istJahr(fakt.dimensions?.period)) continue
    const ende = periodenende(fakt.dimensions?.period)
    if (ende > stichtag) stichtag = ende
  }
  if (!stichtag) return {}

  const werte: Werte = { stichtag }

  for (const groesse of GROESSEN) {
    for (const tag of groesse.tags) {
      const passend = fakten.filter((fakt) => {
        const dimensionen = fakt.dimensions ?? {}
        if (dimensionen.concept !== `ifrs-full:${tag}`) return false
        if (!istKonzernwert(fakt)) return false
        if (periodenende(dimensionen.period) !== stichtag) return false
        if (groesse.zeitraum && !istJahr(dimensionen.period)) return false
        if (!groesse.zeitraum && dimensionen.period?.includes('/')) return false
        return typeof fakt.value === 'number' || typeof fakt.value === 'string'
      })
      if (passend.length === 0) continue

      const zahl = Number(passend[0].value)
      if (!Number.isFinite(zahl)) continue

      werte[groesse.feld as Feld] = zahl
      const einheit = passend[0].dimensions?.unit ?? ''
      // `iso4217:EUR` → `EUR`; die Aktienzahl trägt `xbrli:shares`.
      if (groesse.feld !== 'aktien' && einheit.includes(':') && !werte.waehrung) {
        werte.waehrung = einheit.split(':').pop() ?? ''
      }
      break
    }
  }

  return werte
}

async function main() {
  const aktien = await katalog()
  const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8')) as {
    unternehmen: Record<string, unknown>
  }
  const haben = new Set(Object.keys(snapshot.unternehmen))
  const offen = aktien.filter((a) => !haben.has(a.ticker))
  console.log(`${offen.length} Aktien ohne Zahlen.\n`)

  const nachName = await verzeichnis()

  const kandidaten: { aktie: Aktie; abschluss: Abschluss }[] = []
  for (const aktie of offen) {
    const gesucht = normalisiere(aktie.name)
    if (!gesucht) continue
    const abschluss =
      nachName.get(gesucht) ??
      [...nachName.entries()].find(
        ([k]) =>
          gesucht.length >= 5 &&
          (k.startsWith(gesucht + ' ') || gesucht.startsWith(k + ' '))
      )?.[1]
    if (abschluss) kandidaten.push({ aktie, abschluss })
  }

  console.log(`\n${kandidaten.length} Kandidaten mit Abschluss. Werte holen …\n`)

  const ergebnisse: {
    ticker: string
    name: string
    kurswaehrung: string
    verzeichnis: string
    land: string
    stichtag: string
    quelle: string
    werte: Werte
    vollstaendig: boolean
  }[] = []

  for (const { aktie, abschluss } of kandidaten) {
    const bericht = (await hole(abschluss.json)) as Bericht | null
    const werte = bericht ? werteAus(bericht) : {}
    const vollstaendig = Boolean(werte.umsatz && werte.gewinn && werte.eigenkapital)

    ergebnisse.push({
      ticker: aktie.ticker,
      name: aktie.name,
      kurswaehrung: aktie.waehrung,
      verzeichnis: abschluss.name,
      land: abschluss.land,
      stichtag: werte.stichtag ?? abschluss.periodenende,
      quelle: abschluss.json,
      werte,
      vollstaendig,
    })

    const mio = (wert: number | undefined) =>
      typeof wert === 'number' ? (wert / 1e6).toFixed(0).padStart(9) : '        –'
    console.log(
      `${aktie.ticker.padEnd(12)} ${(werte.waehrung ?? '???').padEnd(4)}` +
        ` Ums${mio(werte.umsatz)} Gew${mio(werte.gewinn)} CF${mio(werte.cashflow)}` +
        ` EK${mio(werte.eigenkapital)} Aktien${
          werte.aktien ? (werte.aktien / 1e6).toFixed(0).padStart(8) : '       –'
        }  ${aktie.name} = ${abschluss.name}`
    )
    await new Promise((fertig) => setTimeout(fertig, 200))
  }

  const brauchbar = ergebnisse.filter((e) => e.vollstaendig)
  const mitAktien = brauchbar.filter((e) => e.werte.aktien)
  console.log(
    `\n${brauchbar.length} von ${ergebnisse.length} mit Umsatz, Gewinn und Eigenkapital.`
  )
  console.log(`${mitAktien.length} davon auch mit Aktienzahl.`)

  await writeFile(BERICHT, JSON.stringify(ergebnisse, null, 2))
  console.log(`\nWerte in ${BERICHT}.`)
}

await main()
