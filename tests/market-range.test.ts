/**
 * Prüfungen für den Zuschnitt der Kursreihen.
 *
 * Anlass war ein Fehler, den erst ein Nutzer bemerkt hat: Die Zeiträume zählten
 * Punkte statt Kalendertage – fünf für eine Woche, 22 für einen Monat, 252 für
 * ein Jahr. Bei Aktien geht das ungefähr auf, weil ein Börsenjahr rund 252
 * Handelstage hat. Bitcoin handelt aber an sieben Tagen die Woche: Dort waren
 * „252 Punkte“ gut acht Monate, und der Zeitraumschalter zeigte etwas anderes
 * als seine eigene Beschriftung.
 *
 * Der erste Fall unten ist genau dieser.
 */

import { downsample, sliceRange, type RangePoint } from '../lib/market-range.ts'

let failed = 0

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

/** Reihe mit einem Punkt je Kalendertag – so handelt Bitcoin. */
function taeglich(tage: number, bis = '2026-07-27'): RangePoint[] {
  const ende = Date.parse(`${bis}T00:00:00Z`)
  const punkte: RangePoint[] = []
  for (let i = tage - 1; i >= 0; i -= 1) {
    punkte.push({
      t: new Date(ende - i * 86_400_000).toISOString().slice(0, 10),
      value: 100 + i,
    })
  }
  return punkte
}

/** Reihe nur an Wochentagen – so handeln Aktien und Indizes. */
function werktags(tage: number, bis = '2026-07-27'): RangePoint[] {
  return taeglich(tage, bis).filter((p) => {
    const wochentag = new Date(`${p.t}T00:00:00Z`).getUTCDay()
    return wochentag !== 0 && wochentag !== 6
  })
}

/** Ältester und jüngster Tag eines Ausschnitts. */
function spanne(punkte: RangePoint[]): [string, string] {
  return [punkte[0].t, punkte[punkte.length - 1].t]
}

// ------------------------------------------------- Der eigentliche Fehler

const btc = taeglich(1500)

check(
  '1J deckt bei taeglichem Handel ein volles Jahr ab',
  spanne(sliceRange(btc, '1J')),
  ['2025-07-26', '2026-07-27']
)
check('1M deckt einen Monat ab, nicht 22 Tage', spanne(sliceRange(btc, '1M')), [
  '2026-06-26',
  '2026-07-27',
])
check('1W deckt sieben Tage ab', spanne(sliceRange(btc, '1W')), [
  '2026-07-20',
  '2026-07-27',
])
check('1W enthaelt bei taeglichem Handel acht Punkte', sliceRange(btc, '1W').length, 8)

// Derselbe Zeitraum, andere Handelstage: Die Spanne muss gleich bleiben,
// nur die Anzahl der Punkte unterscheidet sich.
const aktie = werktags(1500)
check('1W enthaelt werktags weniger Punkte', sliceRange(aktie, '1W').length < 8, true)
check(
  'die Woche endet trotzdem am letzten vorhandenen Tag',
  sliceRange(aktie, '1W').at(-1)?.t,
  aktie.at(-1)?.t
)

// -------------------------------------------------------- Randfaelle

// Am Montag ist der juengste Schlusskurs oft der von Freitag. Bezugspunkt ist
// deshalb der letzte vorhandene Wert, nicht der heutige Tag - sonst waere die
// Woche leer.
const bisFreitag = werktags(400, '2026-07-24')
check('leere Woche gibt es nicht', sliceRange(bisFreitag, '1W').length > 0, true)
check(
  'die Woche endet am letzten Schlusskurs',
  sliceRange(bisFreitag, '1W').at(-1)?.t,
  '2026-07-24'
)

check('5J nimmt die ganze Reihe', sliceRange(taeglich(100), '5J').length, 100)
check('kommt mit einer leeren Reihe klar', sliceRange([], '1M'), [])
check('kommt mit einem einzigen Punkt klar', sliceRange(taeglich(1), '1J').length, 1)

// ------------------------------------------------------- Ausduennung

const lang = taeglich(1500)
const wenige = downsample(lang, 260)
check('duennt auf die Obergrenze aus', wenige.length, 260)
check('behaelt den ersten Wert', wenige[0], lang[0])
check('behaelt den letzten Wert', wenige.at(-1), lang.at(-1))
check('laesst kurze Reihen unberuehrt', downsample(lang.slice(-10), 260).length, 10)
check(
  'bleibt aufsteigend sortiert',
  [...wenige].sort((a, b) => a.t.localeCompare(b.t)),
  wenige
)

// Ein Jahr darf nicht mehr Punkte liefern, als der Chart zeichnen soll.
check('1J bleibt unter der Punktgrenze', sliceRange(btc, '1J').length <= 130, true)

console.log(
  failed === 0 ? 'Alle Pruefungen bestanden' : `${failed} Pruefung(en) fehlgeschlagen`
)
if (failed > 0) process.exitCode = 1
