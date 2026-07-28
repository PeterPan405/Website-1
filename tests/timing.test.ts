/**
 * Prüfungen für die Timing-Rechnung.
 *
 * Der heikle Punkt ist die Verkettung: Renditen werden multipliziert, nicht
 * addiert. Wer sie addiert, bekommt bei kleinen Werten ein plausibel
 * aussehendes und trotzdem falsches Ergebnis – und genau diese Zahl stünde
 * dann als Tabelle im Lerntext. Deshalb wird gegen von Hand nachgerechnete
 * Fälle geprüft, in denen sich Addition und Verkettung sichtbar
 * unterscheiden.
 */

import {
  bestePerioden,
  noetigeTrefferquote,
  ohneBestePerioden,
  perioden,
  type Kurspunkt,
} from '../lib/timing.ts'

let failed = 0

function nahe(name: string, actual: number, expected: number, toleranz = 1e-9) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

const reihe: Kurspunkt[] = [
  { d: '2024-01-01', c: 100 },
  { d: '2024-01-02', c: 110 }, // +10 %
  { d: '2024-01-03', c: 99 }, // −10 %
  { d: '2024-01-04', c: 118.8 }, // +20 %
]

console.log('\n— Perioden —')
const p = perioden(reihe)
wahr('drei Perioden aus vier Punkten', p.length === 3)
nahe('erste Periode +10 %', p[0].rendite, 10)
nahe('zweite Periode −10 %', p[1].rendite, -10)
nahe('dritte Periode +20 %', p[2].rendite, 20)
wahr('Datum ist das des Endpunkts', p[0].datum === '2024-01-02')

console.log('\n— Verkettung statt Addition —')
// Addiert wären es +20 %. Verkettet: 1,1 × 0,9 × 1,2 = 1,188 → +18,8 %
const ohne = ohneBestePerioden(reihe, [0])
nahe('Gesamtrendite verkettet, nicht addiert', ohne[0].rendite, 18.8, 1e-9)
wahr('und damit nicht 20 %', Math.abs(ohne[0].rendite - 20) > 1)

console.log('\n— Beste Perioden auslassen —')
const stufen = ohneBestePerioden(reihe, [0, 1, 2, 3])
// Ohne die beste (+20 %): 1,1 × 0,9 = 0,99 → −1 %
nahe('ohne die beste Periode', stufen[1].rendite, -1, 1e-9)
// Ohne die zwei besten (+20 und +10): nur noch 0,9 → −10 %
nahe('ohne die zwei besten', stufen[2].rendite, -10, 1e-9)
// Ohne alle drei: nichts bleibt übrig → 0 %
nahe('ohne alle Perioden', stufen[3].rendite, 0, 1e-9)
wahr(
  'jede weitere Auslassung verschlechtert das Ergebnis',
  stufen[0].rendite > stufen[1].rendite && stufen[1].rendite > stufen[2].rendite
)

console.log('\n— Beste und schlechteste —')
const extrem = bestePerioden(reihe, 2)
nahe('beste Periode ist +20 %', extrem.beste[0].rendite, 20)
nahe('schlechteste ist −10 %', extrem.schlechteste[0].rendite, -10)
wahr('beste absteigend sortiert', extrem.beste[0].rendite >= extrem.beste[1].rendite)
wahr(
  'schlechteste aufsteigend sortiert',
  extrem.schlechteste[0].rendite <= extrem.schlechteste[1].rendite
)

console.log('\n— Unbrauchbare Punkte —')
const mitLuecke: Kurspunkt[] = [
  { d: 'a', c: 0 },
  { d: 'b', c: 100 },
  { d: 'c', c: 110 },
]
wahr('Nullkurs erzeugt keine Periode', perioden(mitLuecke).length === 1)
nahe('die verbleibende ist korrekt', perioden(mitLuecke)[0].rendite, 10, 1e-9)

console.log('\n— Nötige Trefferquote —')
nahe('ohne Kosten genügen 50 Prozent', noetigeTrefferquote(5, 0)!, 50, 1e-9)
wahr('mit Kosten liegt sie darüber', noetigeTrefferquote(5, 1)! > 50)
wahr(
  'höhere Kosten heben die Schwelle',
  noetigeTrefferquote(5, 2)! > noetigeTrefferquote(5, 1)!
)
wahr(
  'übersteigen die Kosten den Gewinn, ist sie unerreichbar',
  noetigeTrefferquote(1, 5) === null
)
wahr('ohne Gewinnpotenzial ebenfalls null', noetigeTrefferquote(0, 1) === null)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
