/**
 * Holt die Kurse und schreibt die Momentaufnahme.
 *
 * Läuft nicht beim Bauen, sondern werktäglich in einem GitHub-Workflow
 * (`.github/workflows/kurse.yml`). Das Ergebnis landet als Datei im Repository;
 * der Build liest nur noch diese Datei und braucht selbst kein Netz.
 *
 * Der Grund für diese Trennung: Ein Build, der von fremden Servern abhängt,
 * fällt aus, sobald einer davon hustet – und bei Hostinger heißt das
 * Bereitstellung rot. Hier bleibt ein Fehlschlag folgenlos: Es wird nichts
 * committet, und die Website zeigt weiter den letzten guten Stand.
 *
 * ## Grundsatz: zusammenführen, nie verwerfen
 *
 * Schlägt ein einzelner Abruf fehl oder ist das Ergebnis unplausibel, behält
 * das Instrument seinen bisherigen Wert. Die Momentaufnahme ist damit immer
 * vollständig, und ein hängender Anbieter macht nicht die halbe Marktseite
 * leer – er lässt nur ein Datum älter werden, und das steht sichtbar dabei.
 *
 * Aufruf: `npm run kurse`
 */

import { marketDefinitions, marketSources } from '../data/markets.ts'
import { fetchEcbHistoryFull, seriesForCurrency } from '../lib/providers/ecb.ts'
import {
  checkPoints,
  EMPTY_SNAPSHOT,
  serializeSnapshot,
  thinPoints,
  type MarketSnapshot,
  type SnapshotInstrument,
  type SnapshotPoint,
} from '../lib/providers/snapshot.ts'
import { fetchTwelveDataDaily } from '../lib/providers/twelvedata.ts'
import { fetchYahooDaily } from '../lib/providers/yahoo.ts'

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const ZIEL = 'data/snapshots/markets.json'

const QUELLEN = {
  ecb: {
    label: 'Europäische Zentralbank',
    url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  },
  yahoo: { label: 'Yahoo Finance', url: 'https://finance.yahoo.com/' },
  twelvedata: { label: 'Twelve Data', url: 'https://twelvedata.com/' },
} as const

/**
 * Schlüssel für Twelve Data, falls hinterlegt.
 *
 * Ist er gesetzt, wird er benutzt; sonst bleibt es bei Yahoo. Die Umschaltung
 * ist damit eine Einstellung im Repository und keine Codeänderung.
 */
const TWELVEDATA_KEY = process.env.TWELVEDATA_API_KEY?.trim() || undefined

/**
 * Holt Index- und Rohstoffkurse beim ersten Anbieter, der antwortet.
 *
 * Zuerst Twelve Data, wenn ein Schlüssel vorliegt – die Schnittstelle ist
 * dokumentiert und für diesen Zweck vorgesehen. Ohne Schlüssel Yahoo, das ohne
 * Registrierung auskommt.
 */
async function holeMarktkurs(
  yahooSymbol: string,
  twelveSymbol: string
): Promise<{ punkte: SnapshotPoint[]; quelle: 'yahoo' | 'twelvedata' } | null> {
  if (TWELVEDATA_KEY) {
    const tage = await fetchTwelveDataDaily(twelveSymbol, TWELVEDATA_KEY)
    if (tage) {
      return {
        punkte: tage.map((tag) => ({ d: tag.date, c: tag.close })),
        quelle: 'twelvedata',
      }
    }
    console.warn(`[kurse] ${twelveSymbol}: Twelve Data ohne Ergebnis, versuche Yahoo.`)
  }

  const tage = await fetchYahooDaily(yahooSymbol)
  if (!tage) return null
  return { punkte: tage.map((tag) => ({ d: tag.date, c: tag.close })), quelle: 'yahoo' }
}

function ladeBisherige(): MarketSnapshot {
  try {
    const inhalt = readFileSync(ZIEL, 'utf8')
    const daten = JSON.parse(inhalt) as MarketSnapshot
    if (daten && typeof daten === 'object' && daten.instruments) return daten
  } catch {
    // Erster Lauf oder beschädigte Datei – beides ist kein Grund abzubrechen.
  }
  return EMPTY_SNAPSHOT
}

/** Sammelt die Devisenreihen. Ein Abruf deckt alle Währungen ab. */
async function holeDevisen(): Promise<Map<string, SnapshotPoint[]>> {
  const ergebnis = new Map<string, SnapshotPoint[]>()
  const tage = await fetchEcbHistoryFull()
  if (!tage) return ergebnis

  for (const [symbol, quelle] of Object.entries(marketSources)) {
    if (quelle.provider !== 'ecb') continue
    const reihe = seriesForCurrency(tage, quelle.currency)
    if (reihe.length > 0) {
      ergebnis.set(
        symbol,
        reihe.map((punkt) => ({ d: punkt.date, c: punkt.value }))
      )
    }
  }
  return ergebnis
}

/**
 * Rundet auf die Genauigkeit, die die Website anzeigt.
 *
 * Yahoo liefert Fließkommazahlen in voller Maschinengenauigkeit: Der DAX kam
 * als 24763.119140625 an, Silber als 59.689998626708984. Angezeigt werden davon
 * zwei Stellen. Die übrigen sind kein Informationsgewinn, sondern Rauschen –
 * sie blähen die Datei auf und erzeugen bei jedem Abruf Unterschiede in
 * Stellen, die niemand sieht.
 */
function runde(wert: number, stellen: number): number {
  const faktor = 10 ** stellen
  return Math.round(wert * faktor) / faktor
}

async function main(): Promise<void> {
  const bisher = ladeBisherige()
  const instrumente: Record<string, SnapshotInstrument> = { ...bisher.instruments }

  const bekannt = new Set(marketDefinitions.map((definition) => definition.symbol))
  const uebernommen: string[] = []
  const behalten: string[] = []

  const devisen = await holeDevisen()

  for (const [symbol, quelle] of Object.entries(marketSources)) {
    if (!bekannt.has(symbol)) {
      console.warn(`[kurse] ${symbol} steht in marketSources, aber in keiner Definition.`)
      continue
    }

    let roh: SnapshotPoint[] | null
    let quellenId: keyof typeof QUELLEN

    if (quelle.provider === 'ecb') {
      roh = devisen.get(symbol) ?? null
      quellenId = 'ecb'
    } else {
      const ergebnis = await holeMarktkurs(quelle.yahoo, quelle.twelvedata)
      roh = ergebnis?.punkte ?? null
      quellenId = ergebnis?.quelle ?? 'yahoo'
    }

    if (!roh) {
      behalten.push(`${symbol} (Abruf fehlgeschlagen)`)
      continue
    }

    const stellen =
      marketDefinitions.find((definition) => definition.symbol === symbol)?.decimals ?? 4
    const punkte = thinPoints(roh).map((punkt) => ({
      d: punkt.d,
      c: runde(punkt.c, stellen),
    }))
    const probleme = checkPoints(punkte, instrumente[symbol]?.points)
    if (probleme.length > 0) {
      for (const problem of probleme) console.warn(`[kurse] ${symbol}: ${problem}`)
      behalten.push(`${symbol} (unplausibel)`)
      continue
    }

    instrumente[symbol] = {
      sourceLabel: QUELLEN[quellenId].label,
      sourceUrl: QUELLEN[quellenId].url,
      asOf: punkte[punkte.length - 1].d,
      points: punkte,
    }
    uebernommen.push(symbol)
  }

  /*
    Unterschiedlich alte Stände sichtbar machen.

    Beim ersten erfolgreichen Lauf standen die Indizes auf dem 23. Juli, die
    Wechselkurse auf dem 24. und die Edelmetalle auf dem 27. – ohne dass etwas
    fehlgeschlagen wäre. Ein Anbieter kann einen Handelstag später nachliefern
    oder eine Lücke haben; solange das unbemerkt bleibt, steht auf der Website
    eine ältere Zahl, als es müsste.

    Verglichen wird gegen den jüngsten Stand aller Instrumente. Vier Tage
    Abstand decken ein Wochenende samt Feiertag ab, ohne jeden Montag zu warnen.
  */
  const staende = Object.values(instrumente).map((eintrag) => eintrag.asOf)
  const juengster = staende.sort().at(-1)
  if (juengster) {
    const grenze = Date.parse(`${juengster}T00:00:00Z`) - 4 * 86_400_000
    const hinterher = Object.entries(instrumente)
      .filter(([, eintrag]) => Date.parse(`${eintrag.asOf}T00:00:00Z`) < grenze)
      .map(([symbol, eintrag]) => `${symbol} (${eintrag.asOf})`)

    if (hinterher.length > 0) {
      console.log(
        `::warning title=Ältere Stände als ${juengster}::${hinterher.join(', ')}`
      )
    }
  }

  if (uebernommen.length === 0) {
    console.error('[kurse] Kein einziger Abruf war erfolgreich – Datei bleibt unberührt.')
    process.exitCode = 1
    return
  }

  console.log(
    `[kurse] ${uebernommen.length} Instrumente aktualisiert: ${uebernommen.join(', ')}`
  )
  if (behalten.length > 0) {
    console.log(`[kurse] Bisheriger Stand behalten für: ${behalten.join(', ')}`)
  }

  /*
    Teilausfälle sichtbar machen.

    Der erste Lauf endete grün, obwohl sechs von elf Instrumenten nichts
    bekamen – „zusammenführen statt verwerfen“ funktionierte wie vorgesehen, nur
    stand das Ergebnis ausschließlich mitten im Protokoll. Wer nur auf das grüne
    Häkchen schaut, hält den Lauf für vollständig.

    Eine Warnung erscheint dagegen oben auf der Übersicht des Laufs. Der Lauf
    bleibt trotzdem erfolgreich: Ein Teilausfall ist ausdrücklich vorgesehen und
    soll die Bereitstellung der übrigen Kurse nicht verhindern.
  */
  if (behalten.length > 0) {
    console.log(
      `::warning title=${behalten.length} von ${behalten.length + uebernommen.length} Instrumenten ohne neue Kurse::` +
        `${behalten.join(', ')} – diese Instrumente behalten ihren bisherigen Stand.`
    )
  }

  /*
    Nichts schreiben, wenn sich kein Kurs geändert hat.

    `fetchedAt` ändert sich bei jedem Lauf. Ohne diesen Vergleich entstünde
    deshalb auch dann ein Commit, wenn die Kurse identisch sind – und weil ein
    Push nach `main` die Bereitstellung bei Hostinger auslöst, würde die ganze
    Website neu gebaut, um einen Zeitstempel zu ändern, den niemand sieht.

    Genau das ist am ersten Tag dreimal passiert: drei Commits „Kurse: Stand
    2026-07-27“ hintereinander, drei Bereitstellungen, kein einziger neuer Kurs.
  */
  const vorher = serializeSnapshot({ fetchedAt: null, instruments: bisher.instruments })
  const nachher = serializeSnapshot({ fetchedAt: null, instruments: instrumente })
  if (vorher === nachher) {
    console.log('[kurse] Keine Kursänderung – Datei bleibt unberührt.')
    return
  }

  const neu: MarketSnapshot = {
    fetchedAt: new Date().toISOString(),
    instruments: instrumente,
  }

  mkdirSync(dirname(ZIEL), { recursive: true })
  writeFileSync(ZIEL, serializeSnapshot(neu))

  const punkteGesamt = Object.values(instrumente).reduce(
    (summe, eintrag) => summe + eintrag.points.length,
    0
  )

  console.log(`[kurse] ${punkteGesamt} Kurswerte in ${ZIEL}`)
  for (const [symbol, eintrag] of Object.entries(instrumente)) {
    const letzte = eintrag.points.slice(-3).map((punkt) => `${punkt.d}=${punkt.c}`)
    console.log(`[kurse]   ${symbol.padEnd(15)} ${letzte.join('  ')}`)
  }
}

await main()
