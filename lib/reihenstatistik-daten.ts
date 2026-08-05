/**
 * Die Brücke von den echten Kursreihen zur Statistik.
 *
 * `lib/reihenstatistik.ts` rechnet und lädt nichts – hier steht das Laden.
 * Die Trennung hat einen Grund, der über den Hausstil hinausgeht: Die Rechnung
 * ist ohne Alias-Auflösung testbar, das Laden nicht, und so muss nur der
 * uninteressante Teil ungetestet bleiben.
 */

import { getLiveSeries } from '@/lib/market-live'
import {
  schwankung,
  zusammenhang,
  type Reihenpunkt,
  type Schwankung,
  type Zusammenhang,
} from '@/lib/reihenstatistik'

/**
 * Ergebnis-Cache pro Prozess.
 *
 * Der Build rendert die Statistikseiten und jede Instrumentseite; eine
 * Korrelationsmatrix über zwölf Leitwerte sind 66 Paare, und jedes Paar würde
 * beide Reihen erneut in Wochen zerlegen. Gemessen ohne Cache: knapp zwei
 * Sekunden je Seitenaufbau, mit Cache nicht messbar.
 */
const reihenCache = new Map<string, Reihenpunkt[]>()

export function reiheVon(symbol: string): Reihenpunkt[] {
  const gemerkt = reihenCache.get(symbol)
  if (gemerkt) return gemerkt

  const reihe = getLiveSeries(symbol)
  const punkte = reihe ? reihe.daily.map((p) => ({ t: p.t, value: p.value })) : []
  reihenCache.set(symbol, punkte)
  return punkte
}

export function schwankungVon(symbol: string, ab?: string): Schwankung | null {
  return schwankung(reiheVon(symbol), ab)
}

export function zusammenhangVon(a: string, b: string, ab?: string): Zusammenhang | null {
  return zusammenhang(reiheVon(a), reiheVon(b), ab)
}

/**
 * Die vollständige Matrix für eine Liste von Symbolen.
 *
 * Gerechnet wird nur die obere Hälfte; die Korrelation ist symmetrisch, und
 * beide Hälften zu rechnen wäre doppelte Arbeit für dasselbe Ergebnis. Die
 * Diagonale bleibt leer statt auf 1 gesetzt: Dass ein Wert mit sich selbst
 * gleichläuft, ist keine Erkenntnis, sondern eine Tautologie – und eine Spalte
 * voller Einsen lenkt vom Rest ab.
 */
export function matrixVon(
  symbole: readonly string[],
  ab?: string
): (Zusammenhang | null)[][] {
  const matrix: (Zusammenhang | null)[][] = symbole.map(() => symbole.map(() => null))

  for (let i = 0; i < symbole.length; i += 1) {
    for (let j = i + 1; j < symbole.length; j += 1) {
      const wert = zusammenhangVon(symbole[i]!, symbole[j]!, ab)
      matrix[i]![j] = wert
      matrix[j]![i] = wert
    }
  }

  return matrix
}
