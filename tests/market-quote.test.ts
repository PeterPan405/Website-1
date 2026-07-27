/**
 * Prüfungen für die Kurs-Kennzahlen.
 *
 * Anlass waren drei Fehler in einer einzigen Funktion, die von aussen nur als
 * „die Zahlen stimmen nicht“ auffielen. Der erste davon steht ganz oben: Nach
 * Boersenschluss wurde die Tagesveraenderung null, weil der laufende Kurs gegen
 * den Schlusskurs desselben Tages verglichen wurde - also gegen sich selbst.
 */

import { computeQuoteFigures, type QuotePoint } from '../lib/market-quote.ts'

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

const woche: QuotePoint[] = [
  { t: '2026-07-22', value: 100 },
  { t: '2026-07-23', value: 110 },
  { t: '2026-07-24', value: 120 },
]

// ------------------------------------------------- Der eigentliche Fehler

// Nach Handelsschluss liefert der Anbieter denselben Wert zweimal: als
// Schlusskurs in der Reihe und als laufenden Kurs. Verglichen werden muss
// trotzdem gegen den Vortag.
check(
  'vergleicht nicht mit sich selbst',
  computeQuoteFigures(woche, { value: 120, at: '2026-07-24T17:35:00Z' }).previousClose,
  110
)
check(
  'Tagesveraenderung wird nach Boersenschluss nicht null',
  computeQuoteFigures(woche, { value: 120, at: '2026-07-24T17:35:00Z' }).change,
  10
)

// Waehrend der Handelszeit am Folgetag: Vergleich gegen den letzten Schluss.
check(
  'vergleicht am Folgetag gegen den letzten Schluss',
  computeQuoteFigures(woche, { value: 126, at: '2026-07-27T14:32:00Z' }).previousClose,
  120
)
check(
  'rechnet die Veraenderung in Prozent',
  computeQuoteFigures(woche, { value: 126, at: '2026-07-27T14:32:00Z' }).changePercent,
  5
)

// Ohne laufenden Kurs: letzter Schluss gegen vorletzten.
// ytdPercent ist hier 20, nicht 0: Die Reihe enthaelt keinen Wert aus dem
// Vorjahr, also greift der Rueckfall auf den aeltesten vorhandenen Punkt (100).
check('ohne laufenden Kurs zaehlt der Vortag', computeQuoteFigures(woche, null), {
  value: 120,
  previousClose: 110,
  change: 10,
  changePercent: (10 / 110) * 100,
  high52w: 120,
  low52w: 100,
  ytdPercent: 20,
  intraday: false,
})

// ------------------------------------------- Jahreshoch nach Tagen, nicht Punkten

/** Reihe mit einem Punkt je Kalendertag - so handelt Bitcoin. */
function taeglich(tage: number, bis = '2026-07-24'): QuotePoint[] {
  const ende = Date.parse(`${bis}T00:00:00Z`)
  const punkte: QuotePoint[] = []
  for (let i = tage - 1; i >= 0; i -= 1) {
    // Vor ueber einem Jahr lag der Kurs deutlich hoeher.
    punkte.push({
      t: new Date(ende - i * 86_400_000).toISOString().slice(0, 10),
      value: i > 366 ? 900 : 100,
    })
  }
  return punkte
}

// 252 Punkte waeren bei taeglichem Handel nur gut acht Monate - die 900 aus der
// Zeit davor duerfen im Jahreshoch nicht auftauchen, aber die Grenze muss bei
// 366 Tagen liegen und nicht bei 252 Punkten.
const btc = taeglich(1000)
check('Jahreshoch reicht 366 Tage zurueck', computeQuoteFigures(btc, null).high52w, 100)

// Gegenprobe: Liegt der hohe Wert innerhalb des Jahres, muss er auftauchen.
const mitHoch = [...taeglich(1000)]
mitHoch[mitHoch.length - 100] = { t: mitHoch[mitHoch.length - 100].t, value: 500 }
check(
  'Hoch innerhalb des Jahres zaehlt mit',
  computeQuoteFigures(mitHoch, null).high52w,
  500
)

// Der angezeigte Wert zaehlt beim Hoch mit, sonst laege er darueber.
check(
  'laufender Kurs zaehlt beim Jahreshoch mit',
  computeQuoteFigures(woche, { value: 999, at: '2026-07-27T14:00:00Z' }).high52w,
  999
)

// ------------------------------------------------------------- Jahresvergleich

const ueberJahreswechsel: QuotePoint[] = [
  { t: '2025-12-30', value: 200 },
  { t: '2026-01-02', value: 210 },
  { t: '2026-07-24', value: 240 },
]
check(
  'misst gegen den letzten Schluss des Vorjahres',
  computeQuoteFigures(ueberJahreswechsel, null).ytdPercent,
  20
)

// ------------------------------------------------------------------ Randfaelle

check(
  'kommt mit einem einzigen Punkt klar',
  computeQuoteFigures([{ t: '2026-07-24', value: 50 }], null).change,
  0
)
check(
  'kommt mit einem Punkt und laufendem Kurs klar',
  computeQuoteFigures([{ t: '2026-07-24', value: 50 }], {
    value: 55,
    at: '2026-07-27T10:00:00Z',
  }).previousClose,
  50
)

console.log(
  failed === 0 ? 'Alle Pruefungen bestanden' : `${failed} Pruefung(en) fehlgeschlagen`
)
if (failed > 0) process.exitCode = 1
