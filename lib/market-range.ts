/**
 * Zuschnitt und Ausdünnung von Kursreihen.
 *
 * Eigenes Modul ohne Importe, damit sich die Regeln unter `tests/` direkt prüfen
 * lassen – dieselbe Aufteilung wie bei `lib/search-match.ts`. Anlass war ein
 * Fehler, der genau hier saß und den erst ein Nutzer bemerkt hat: Die Zeiträume
 * zählten Punkte statt Kalendertage.
 */

/** Ein Punkt einer Zeitreihe. `t` beginnt mit `YYYY-MM-DD`. */
export interface RangePoint {
  t: string
  value: number
}

/** Die auswählbaren Zeiträume. */
export type RangeId = '1W' | '1M' | '1J' | '5J'

/**
 * Reduziert eine Reihe auf höchstens `maxPoints` Werte.
 *
 * Charts brauchen keine 1.300 Punkte auf 800 Pixel Breite – jeder überflüssige
 * Punkt wandert sonst unnötig ins Browser-Bundle. Erster und letzter Wert
 * bleiben immer erhalten, damit Start und aktueller Kurs exakt stimmen.
 */
export function downsample(points: RangePoint[], maxPoints: number): RangePoint[] {
  if (points.length <= maxPoints) return points

  const step = (points.length - 1) / (maxPoints - 1)
  const result: RangePoint[] = []
  for (let i = 0; i < maxPoints - 1; i += 1) {
    result.push(points[Math.round(i * step)])
  }
  result.push(points[points.length - 1])
  return result
}

/**
 * Länge eines Zeitraums in Kalendertagen, plus die Obergrenze an Punkten.
 *
 * `days` fehlt bei „fünf Jahre“ – dort wird die ganze Reihe genommen.
 *
 * ## Warum Kalendertage und nicht Punkte
 *
 * Vorher stand hier die Anzahl der Handelstage: fünf für eine Woche, 22 für
 * einen Monat, 252 für ein Jahr. Bei Aktien und Indizes geht das ungefähr auf,
 * weil ein Börsenjahr etwa 252 Handelstage hat – aber eben nur dort.
 *
 * **Bitcoin handelt an sieben Tagen die Woche.** 252 Punkte sind dort gut acht
 * Monate, nicht ein Jahr; 22 Punkte sind 22 Tage, nicht ein Monat. Die
 * Zeitraumschalter zeigten damit für Kryptowährungen durchweg einen zu kurzen
 * Ausschnitt, und zwar ohne dass die Beschriftung es verraten hätte.
 *
 * Dasselbe Problem betrifft die Vergangenheit: Die gespeicherte Reihe ist
 * jenseits von 400 Tagen auf einen Wert je Woche verdichtet. Punkte zu zählen
 * hieße dort, ein Vielfaches des gemeinten Zeitraums zu zeigen.
 *
 * Nach Datum zu schneiden ist gegen beides unempfindlich – und es ist das, was
 * die Beschriftung verspricht.
 */
const rangeConfig: Record<RangeId, { days?: number; maxPoints: number }> = {
  '1W': { days: 7, maxPoints: 30 },
  '1M': { days: 31, maxPoints: 40 },
  '1J': { days: 366, maxPoints: 130 },
  '5J': { maxPoints: 260 },
}

/**
 * Schneidet die letzten `days` Kalendertage heraus.
 *
 * Bezugspunkt ist der letzte vorhandene Wert, nicht der heutige Tag – sonst
 * wäre der Ausschnitt an einem Montagmorgen leer, wenn der jüngste Schlusskurs
 * vom Freitag stammt.
 */
export function sliceByDays(daily: readonly RangePoint[], days: number): RangePoint[] {
  const letzter = daily[daily.length - 1]
  if (!letzter) return []

  const grenze = Date.parse(`${letzter.t.slice(0, 10)}T00:00:00Z`) - days * 86_400_000
  return daily.filter(
    (point) => Date.parse(`${point.t.slice(0, 10)}T00:00:00Z`) >= grenze
  )
}

/** Schneidet die passende Teilreihe für einen Zeitraum zu. */
export function sliceRange(daily: readonly RangePoint[], range: RangeId): RangePoint[] {
  const config = rangeConfig[range]
  if (!config.days) return downsample([...daily], config.maxPoints)

  /*
    Bezugspunkt ist der letzte vorhandene Wert, nicht der heutige Tag.

    Sonst wäre „eine Woche“ am Montagmorgen leer, wenn der jüngste Schlusskurs
    vom Freitag stammt – und über ein langes Wochenende erst recht.
  */
  return downsample(sliceByDays(daily, config.days), config.maxPoints)
}
