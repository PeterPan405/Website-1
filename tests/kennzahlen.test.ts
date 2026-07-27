/**
 * Prüfungen für die gerechneten Kennzahlen.
 *
 * Die heikelste Stelle ist dieselbe wie in `lib/market-range.ts`: Zeiträume
 * müssen in **Kalendertagen** gezählt werden, nicht in Punkten. Dieser Fehler
 * ist in diesem Projekt schon einmal aufgetreten und ist niemandem beim Lesen
 * des Codes aufgefallen, sondern erst einem Nutzer auf der Seite.
 */

import {
  abstandZumDurchschnitt,
  anteilGewinntage,
  berechneKennzahlen,
  maxRueckgang,
  schwankungProzent,
  type Kurspunkt,
} from '../lib/kennzahlen.ts'

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

function nahe(name: string, actual: number | null, expected: number, toleranz = 0.01) {
  const ok = actual !== null && Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ~${expected}\n     erhalten ${actual}`}`
  )
}

/** Eine Reihe aus Tagesschritten ab einem Startdatum. */
function reihe(start: string, werte: number[]): Kurspunkt[] {
  const beginn = Date.parse(`${start}T00:00:00Z`)
  return werte.map((value, i) => ({
    t: new Date(beginn + i * 86_400_000).toISOString().slice(0, 10),
    value,
  }))
}

// ------------------------------------------------------- Maximaler Rückgang

const berg: Kurspunkt[] = [
  { t: '2026-01-01', value: 100 },
  { t: '2026-01-02', value: 200 },
  { t: '2026-01-03', value: 100 },
  { t: '2026-01-04', value: 150 },
]

const tief = maxRueckgang(berg)
nahe('der Rückgang misst vom Hoch zum Tief', tief?.prozent ?? null, -50)
check('und nennt den Tag des Hochs', tief?.von, '2026-01-02')
check('und den Tag des Tiefs', tief?.bis, '2026-01-03')

check(
  'eine nur steigende Reihe hat keinen Rückgang',
  maxRueckgang([
    { t: '2026-01-01', value: 100 },
    { t: '2026-01-02', value: 110 },
  ]),
  null
)

/*
  Der zweite Einbruch ist tiefer, liegt aber nach einem niedrigeren Hoch.
  Gesucht ist der größte Abstand Hoch → Tief, nicht der niedrigste Kurs.
*/
const zweiTaeler: Kurspunkt[] = [
  { t: '2026-01-01', value: 100 },
  { t: '2026-01-02', value: 60 }, // −40 %
  { t: '2026-01-03', value: 80 },
  { t: '2026-01-04', value: 40 }, // −50 % vom Hoch bei 100
]
nahe(
  'der tiefste Punkt zählt gegen das vorherige Hoch',
  maxRueckgang(zweiTaeler)?.prozent ?? null,
  -60
)

// ---------------------------------------------------------------- Schwankung

check('unter dreißig Werten gibt es keine Schwankung', schwankungProzent(berg), null)

// Eine Reihe, die stur um denselben Faktor steigt, schwankt nicht.
const stetig = reihe(
  '2026-01-01',
  Array.from({ length: 60 }, (_, i) => 100 * 1.001 ** i)
)
nahe('eine gleichmäßige Reihe hat Schwankung null', schwankungProzent(stetig), 0, 0.0001)

// Abwechselnd +10 % und −10 %: deutlich sichtbare Schwankung.
const zickzack = reihe(
  '2026-01-01',
  Array.from({ length: 60 }, (_, i) => (i % 2 === 0 ? 100 : 110))
)
const schwankt = schwankungProzent(zickzack)
check('eine springende Reihe schwankt messbar', (schwankt ?? 0) > 100, true)

// ------------------------------------------------------- Abstand zum Schnitt

check(
  'ohne genug Punkte kein Abstand zum Durchschnitt',
  abstandZumDurchschnitt(berg, 200),
  null
)
nahe(
  'liegt der Kurs auf dem Schnitt, ist der Abstand null',
  abstandZumDurchschnitt(reihe('2026-01-01', Array(200).fill(50)), 200),
  0
)

// ------------------------------------------------------------- Gewinntage

check('unter dreißig Werten kein Anteil', anteilGewinntage(berg), null)
nahe(
  'bei abwechselnd auf und ab liegt der Anteil bei der Hälfte',
  anteilGewinntage(zickzack),
  50,
  2
)

// ------------------------------------------- Zeiträume zählen Kalendertage

/*
  Der Fehler, um den es geht.

  Die Reihe hat eine Lücke: nach dem 1. Januar folgt erst der 1. Juli. Wer in
  Punkten zählt, hält den zweiten Punkt für „einen Tag später“. Gezählt wird
  aber in Kalendertagen – ein Monat zurück vom Ende landet deshalb im Juli,
  nicht im Januar.
*/
const mitLuecke: Kurspunkt[] = [
  { t: '2026-01-01', value: 100 },
  { t: '2026-07-01', value: 200 },
  { t: '2026-07-20', value: 220 },
]
const kennzahlen = berechneKennzahlen(mitLuecke)

/*
  Zur Lücke gehört kein Startwert – also gibt es keine Monatszahl.

  Die erste Fassung lieferte hier 120 Prozent: Sie nahm den Januarwert, weil er
  der jüngste vor dem Stichtag war, und schrieb die Halbjahresentwicklung unter
  die Überschrift „1 Monat“. Lieber keine Zahl als eine falsch beschriftete.
*/
check(
  'zur Lücke gibt es keine Monatszahl',
  kennzahlen.performance.some((e) => e.zeitraum === '1M'),
  false
)

const sechsMonate = kennzahlen.performance.find((e) => e.zeitraum === '6M')
nahe('sechs Monate zurück landen im Januar', sechsMonate?.prozent ?? null, 120)

// Ohne Lücke muss der Monatswert dagegen kommen.
const dicht = reihe(
  '2026-01-01',
  Array.from({ length: 200 }, (_, i) => 100 + i)
)
const dichteKennzahlen = berechneKennzahlen(dicht)
check(
  'bei lückenloser Reihe gibt es die Monatszahl',
  dichteKennzahlen.performance.some((e) => e.zeitraum === '1M'),
  true
)

check(
  'ohne fünf Jahre Reihe gibt es keine Fünfjahreszahl',
  kennzahlen.performance.some((e) => e.zeitraum === '5J'),
  false
)

// Unsortierte Eingabe darf nichts durcheinanderbringen.
const verdreht = [...mitLuecke].reverse()
check(
  'die Reihenfolge der Eingabe ist egal',
  JSON.stringify(berechneKennzahlen(verdreht).performance),
  JSON.stringify(kennzahlen.performance)
)

// Leere Reihe darf nicht werfen.
const leer = berechneKennzahlen([])
check('eine leere Reihe liefert lauter null', leer.schwankung, null)
check('und keine Zeiträume', leer.performance.length, 0)

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
process.exit(failed === 0 ? 0 : 1)
