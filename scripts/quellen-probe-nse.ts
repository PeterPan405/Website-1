/**
 * Was der Sammelkalender der indischen Börse hergibt.
 *
 * ## Warum diese Sonde
 *
 * Am 24. August 2026 hat die Sonde `boersen` eine offene Quelle gefunden:
 * `nseindia.com/api/event-calendar` antwortet mit **200 JSON ohne Schlüssel**
 * und führt Vorstandssitzungen samt Zweck. Das ist dieselbe Bauart wie die
 * Tokioter Terminliste – und die betrifft **50 geführte Titel**, den
 * viertgrößten Block der Lücke.
 *
 * Bevor daraus Code entsteht, sind vier Fragen zu beantworten. Keine davon
 * lässt sich raten, und drei davon entscheiden über die Bauart:
 *
 * 1. **Wie weit reicht der Kalender nach vorn?** Einunddreißig Einträge
 *    klingen nach wenigen Tagen. Zeigt er nur eine Woche, gilt dasselbe wie in
 *    Tokio: regelmäßig ernten, dazwischen ableiten.
 * 2. **Wie viele unserer fünfzig Titel stehen darin?** Unsere Kürzel enden auf
 *    `.NS`, die Schnittstelle führt das nackte Symbol. Der Abgleich müsste
 *    treffen – „müsste" ist keine Messung.
 * 3. **Was steht in `purpose` sonst noch?** Dividenden, Kapitalmaßnahmen,
 *    Splits. Nur Ergebnistermine gehören in den Kalender, und der Filter muss
 *    an dem hängen, was wirklich in der Spalte steht.
 * 4. **Gibt es einen zweiten Weg mit mehr Vorlauf?** Die Börse führt neben dem
 *    Kalender eine Liste der angekündigten Ergebnistermine. Wenn die weiter
 *    reicht, ist sie die bessere Quelle.
 *
 * ## Was hier nicht passiert
 *
 * Es wird kein Cookie geholt, keine Sitzung aufgebaut, keine Kennung
 * nachgebaut. Abgerufen wird mit einem gewöhnlichen `User-Agent`. Antwortet
 * die Börse damit nicht mehr, ist das die Antwort – und keine Aufforderung,
 * es anders zu versuchen.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `nse`.
 */

import { writeFile } from 'node:fs/promises'

import { marketDefinitions } from '../data/markets.ts'

const BERICHT = 'nse-kalender.json'

const KOPFZEILEN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
  Accept: 'application/json, text/plain, */*',
}

/** Die Adressen, die etwas über Termine sagen könnten. */
const ADRESSEN = [
  {
    name: 'Terminkalender',
    url: 'https://www.nseindia.com/api/event-calendar',
  },
  {
    name: 'Ergebnistermine (angekündigt)',
    url: 'https://www.nseindia.com/api/corporates-financial-results-calendar?index=equities',
  },
  {
    name: 'Vorstandssitzungen',
    url: 'https://www.nseindia.com/api/corporate-board-meetings?index=equities',
  },
]

interface Eintrag {
  symbol?: string
  company?: string
  purpose?: string
  bm_desc?: string
  date?: string
  bm_date?: string
  [weiteres: string]: unknown
}

/** Die NSE-Symbole unserer geführten Titel. */
function unsereSymbole(): Map<string, string> {
  const jeSymbol = new Map<string, string>()
  for (const eintrag of marketDefinitions) {
    if (eintrag.kind !== 'stock') continue
    const symbol = /^(.+)\.NS$/.exec(eintrag.ticker)?.[1]
    if (symbol) jeSymbol.set(symbol.toUpperCase(), eintrag.ticker)
  }
  return jeSymbol
}

async function hole(
  url: string
): Promise<{ status: number; daten: Eintrag[] | null; roh: string }> {
  const antwort = await fetch(url, {
    headers: KOPFZEILEN,
    signal: AbortSignal.timeout(30_000),
  })
  const roh = await antwort.text()
  try {
    const daten: unknown = JSON.parse(roh)
    return {
      status: antwort.status,
      daten: Array.isArray(daten) ? (daten as Eintrag[]) : null,
      roh,
    }
  } catch {
    return { status: antwort.status, daten: null, roh }
  }
}

async function main() {
  const jeSymbol = unsereSymbole()
  console.log(`${jeSymbol.size} geführte Titel mit NSE-Symbol.\n`)

  const bericht: Record<string, unknown> = { geprueft: new Date().toISOString() }

  for (const adresse of ADRESSEN) {
    console.log('='.repeat(78))
    console.log(`${adresse.name}\n  ${adresse.url}`)

    let ergebnis
    try {
      ergebnis = await hole(adresse.url)
    } catch (fehler) {
      console.log(`  FEHLER ${(fehler as Error).name}: ${(fehler as Error).message}`)
      bericht[adresse.name] = { fehler: String(fehler) }
      continue
    }

    console.log(`  STATUS ${ergebnis.status}, ${ergebnis.roh.length} Zeichen`)

    if (!ergebnis.daten) {
      console.log(
        `  kein Array – Anfang: ${ergebnis.roh.slice(0, 200).replace(/\s+/g, ' ')}`
      )
      bericht[adresse.name] = {
        status: ergebnis.status,
        anfang: ergebnis.roh.slice(0, 300),
      }
      continue
    }

    const eintraege = ergebnis.daten
    console.log(`  ${eintraege.length} Einträge`)
    if (eintraege.length === 0) {
      bericht[adresse.name] = { status: ergebnis.status, eintraege: 0 }
      await new Promise((f) => setTimeout(f, 1500))
      continue
    }

    console.log(`  Felder: ${Object.keys(eintraege[0]).join(', ')}`)

    /* ---------------------------------------- 1. Wie weit reicht er? */

    const tage = eintraege
      .map((e) => String(e.date ?? e.bm_date ?? ''))
      .filter((t) => t !== '')
      .sort()
    if (tage.length > 0) {
      console.log(`  Zeitraum: ${tage[0]} bis ${tage[tage.length - 1]}`)
    } else {
      console.log('  kein Datumsfeld erkannt – Felder oben prüfen')
    }

    /* ------------------------------------ 3. Was steht in `purpose`? */

    const zwecke = new Map<string, number>()
    for (const e of eintraege) {
      const zweck = String(e.purpose ?? '(ohne)').trim()
      zwecke.set(zweck, (zwecke.get(zweck) ?? 0) + 1)
    }
    console.log('  Zwecke:')
    for (const [zweck, anzahl] of [...zwecke].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
      console.log(`    ${String(anzahl).padStart(4)}  ${zweck.slice(0, 80)}`)
    }

    /* ------------------------------- 2. Wie viele davon sind unsere? */

    const unsere = eintraege.filter((e) =>
      jeSymbol.has(String(e.symbol ?? '').toUpperCase())
    )
    console.log(`  ${unsere.length} Einträge betreffen unsere Titel:`)
    for (const e of unsere.slice(0, 20)) {
      console.log(
        `    ${String(e.symbol).padEnd(14)} ${String(e.date ?? e.bm_date ?? '?').padEnd(12)} ` +
          `${String(e.purpose ?? '').slice(0, 40)}`
      )
    }

    bericht[adresse.name] = {
      status: ergebnis.status,
      eintraege: eintraege.length,
      felder: Object.keys(eintraege[0]),
      von: tage[0] ?? null,
      bis: tage[tage.length - 1] ?? null,
      zwecke: Object.fromEntries([...zwecke].sort((a, b) => b[1] - a[1])),
      unsere: unsere.map((e) => ({
        kuerzel: jeSymbol.get(String(e.symbol).toUpperCase()),
        symbol: e.symbol,
        datum: e.date ?? e.bm_date,
        zweck: e.purpose,
      })),
    }

    // Anderthalb Sekunden zwischen zwei Abrufen – niemand wird hier gedrängt.
    await new Promise((f) => setTimeout(f, 1500))
  }

  await writeFile(BERICHT, JSON.stringify(bericht, null, 2))
  console.log(`\nVollständig in ${BERICHT}.`)
}

await main()
