import snapshot from '@/data/snapshots/markets.json'

import type { SeriesPoint } from '@/data/markets'
import type { MarketSnapshot, SnapshotInstrument } from '@/lib/providers/snapshot'

/**
 * Zugriff auf die abgerufenen Kurse.
 *
 * Die Momentaufnahme liegt als JSON im Repository und wird beim Bauen
 * eingebunden – zur Laufzeit gibt es keinen Server, der etwas nachladen könnte.
 * Erneuert wird sie werktäglich durch `.github/workflows/kurse.yml`.
 *
 * Nicht jedes Instrument ist enthalten. Für `msci-world` gibt es keine frei
 * zugängliche Quelle; solche Instrumente liefern hier `null`, und die
 * Service-Schicht fällt auf die gekennzeichneten Demo-Daten zurück. Dieser
 * Zustand ist dauerhaft vorgesehen, nicht bloß ein Übergang.
 */

const daten = snapshot as MarketSnapshot

/** Wann der Abruf zuletzt lief – `null`, solange noch keiner lief. */
export const snapshotFetchedAt: string | null = daten.fetchedAt

/** Herkunft der Kurse eines Instruments, wie sie unter dem Chart steht. */
export interface QuoteSource {
  label: string
  url: string
}

export interface LiveSeries {
  /** Aufsteigend nach Datum, ein Wert je Handelstag. */
  daily: SeriesPoint[]
  source: QuoteSource
  /** Handelstag des jüngsten Werts, YYYY-MM-DD. */
  asOf: string
}

/**
 * Die abgerufene Reihe eines Instruments – oder `null`.
 *
 * `null` heißt: keine echten Daten vorhanden. Entweder gibt es für dieses
 * Instrument keine Quelle, oder der Workflow lief noch nie.
 */
export function getLiveSeries(symbol: string): LiveSeries | null {
  const eintrag: SnapshotInstrument | undefined = daten.instruments[symbol]
  if (!eintrag || eintrag.points.length < 2) return null

  return {
    /*
      Umbenennung von `d`/`c` auf das Format der Website.

      Die Momentaufnahme benutzt kurze Schlüssel, weil sie werktäglich neu im
      Repository landet und jedes Zeichen mal Anzahl Punkte mal Anzahl Commits
      zählt. Nach außen bleibt es beim ausgeschriebenen Format – dort wiegt
      Lesbarkeit mehr als Größe.
    */
    daily: eintrag.points.map((punkt) => ({ t: punkt.d, value: punkt.c })),
    source: { label: eintrag.sourceLabel, url: eintrag.sourceUrl },
    asOf: eintrag.asOf,
  }
}

/** Alle Instrumente, für die echte Kurse vorliegen. */
export function liveSymbols(): string[] {
  return Object.keys(daten.instruments)
}
