/**
 * Prüfungen für die Bewertungskennzahlen.
 *
 * Die heikelste Stelle ist nicht die Formel, sondern die Frage, wann eine Zahl
 * **nicht** entstehen darf. Ein Kurs-Gewinn-Verhältnis von −12 ist rechnerisch
 * korrekt und inhaltlich irreführend: Es liest sich wie „billig“ und bedeutet
 * „macht Verlust“. Dasselbe gilt für ein negatives Eigenkapital.
 *
 * Zweiter Schwerpunkt: Eine fehlende Aktienzahl muss **alle** Verhältniszahlen
 * ausfallen lassen, nicht nur die Marktkapitalisierung. Sie steckt in jeder
 * einzelnen Formel.
 */

import {
  berechneFundamentalkennzahlen,
  type Bilanzzahlen,
} from '../lib/fundamentalkennzahlen.ts'

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

/*
  Ein glatt gerechnetes Unternehmen.

  100 Millionen Aktien, 50 Millionen Gewinn, also 0,50 Gewinn je Aktie. Bei
  einem Kurs von 10 ergibt das ein Kurs-Gewinn-Verhältnis von genau 20 – eine
  Zahl, die man im Kopf nachrechnen kann, was bei einem Test die halbe Miete
  ist.
*/
const gesund: Bilanzzahlen = {
  umsatz: 500_000_000,
  gewinn: 50_000_000,
  cashflow: 80_000_000,
  eigenkapital: 250_000_000,
  aktien: 100_000_000,
}

console.log('\n— Der Normalfall —')
{
  const k = berechneFundamentalkennzahlen(gesund, 10)
  nahe(
    'Marktkapitalisierung ist Kurs mal Aktienzahl',
    k.marktkapitalisierung.wert,
    1e9,
    1
  )
  nahe('Kurs-Gewinn-Verhältnis 10 / 0,50', k.kgv.wert, 20)
  nahe('Kurs-Umsatz-Verhältnis 10 / 5,00', k.kuv.wert, 2)
  nahe('Kurs-Buchwert-Verhältnis 10 / 2,50', k.kbv.wert, 4)
  nahe('Cashflow je Aktie 80 Mio. / 100 Mio.', k.cashflowJeAktie.wert, 0.8)
  check('alle fünf belegt', k.belegt, 5)
  check('kein Ausfallgrund gesetzt', k.kgv.grund, null)
}

console.log('\n— Verlustjahr —')
{
  const k = berechneFundamentalkennzahlen({ ...gesund, gewinn: -20_000_000 }, 10)
  check('Kurs-Gewinn-Verhältnis fällt aus', k.kgv.wert, null)
  check('… und sagt warum', k.kgv.grund, 'verlust')
  nahe('Kurs-Umsatz-Verhältnis bleibt', k.kuv.wert, 2)
  check('vier statt fünf Zahlen', k.belegt, 4)
}

console.log('\n— Gewinn genau null —')
{
  /*
    Die Null gehört zum Verlustfall, nicht zum Normalfall.

    Rechnerisch ergäbe sie Unendlich, und `Infinity` würde auf der Seite als
    „∞“ oder „NaN“ landen. Ein Unternehmen ohne Gewinn hat kein
    Kurs-Gewinn-Verhältnis – Punkt.
  */
  const k = berechneFundamentalkennzahlen({ ...gesund, gewinn: 0 }, 10)
  check('Null zählt als Verlust', k.kgv.grund, 'verlust')
  check('kein Unendlich', k.kgv.wert, null)
}

console.log('\n— Negatives Eigenkapital —')
{
  const k = berechneFundamentalkennzahlen({ ...gesund, eigenkapital: -40_000_000 }, 10)
  check('Kurs-Buchwert-Verhältnis fällt aus', k.kbv.wert, null)
  check('… mit eigenem Grund', k.kbv.grund, 'negativesEigenkapital')
  nahe('Kurs-Gewinn-Verhältnis bleibt unberührt', k.kgv.wert, 20)
}

console.log('\n— Fehlende Aktienzahl —')
{
  const ohneAktien: Bilanzzahlen = { ...gesund }
  delete ohneAktien.aktien
  const k = berechneFundamentalkennzahlen(ohneAktien, 10)
  check('Marktkapitalisierung fällt aus', k.marktkapitalisierung.wert, null)
  check('Kurs-Gewinn-Verhältnis auch', k.kgv.wert, null)
  check('Kurs-Umsatz-Verhältnis auch', k.kuv.wert, null)
  check('Kurs-Buchwert-Verhältnis auch', k.kbv.wert, null)
  check('Cashflow je Aktie auch', k.cashflowJeAktie.wert, null)
  check('gar nichts belegt', k.belegt, 0)
  check('Grund ist „fehlt“, nicht „verlust“', k.kgv.grund, 'fehlt')
}

console.log('\n— Nur eine Größe gemeldet —')
{
  const k = berechneFundamentalkennzahlen(
    { cashflow: 80_000_000, aktien: 100_000_000 },
    10
  )
  nahe('Cashflow je Aktie steht', k.cashflowJeAktie.wert, 0.8)
  nahe('Marktkapitalisierung steht', k.marktkapitalisierung.wert, 1e9, 1)
  check('die drei Verhältniszahlen nicht', k.belegt, 2)
}

console.log('\n— Kein brauchbarer Kurs —')
{
  /*
    Ein Kurs von null kommt bei einer Aktie nicht vor, aber die Funktion darf
    daran nicht zerbrechen: Sie bekäme ihn, wenn eine Kursquelle ausfällt.
    Wichtig ist, dass der Cashflow je Aktie trotzdem dasteht – er ist die
    einzige der fünf Zahlen, die ohne Kurs auskommt.
  */
  const k = berechneFundamentalkennzahlen(gesund, 0)
  check('Marktkapitalisierung fällt aus', k.marktkapitalisierung.wert, null)
  check('Kurs-Gewinn-Verhältnis fällt aus', k.kgv.wert, null)
  nahe('Cashflow je Aktie bleibt', k.cashflowJeAktie.wert, 0.8)
  check('genau eine Zahl', k.belegt, 1)
}

console.log('\n— Negativer Cashflow ist eine gültige Zahl —')
{
  const k = berechneFundamentalkennzahlen({ ...gesund, cashflow: -30_000_000 }, 10)
  nahe('… und wird nicht unterdrückt', k.cashflowJeAktie.wert, -0.3)
  check('zählt als belegt', k.belegt, 5)
}

console.log('\n— Unbrauchbare Werte aus der Quelle —')
{
  const k = berechneFundamentalkennzahlen(
    { umsatz: Number.NaN, gewinn: 50_000_000, aktien: 100_000_000 },
    10
  )
  check('NaN gilt als nicht gemeldet', k.kuv.wert, null)
  check('… und nicht als Wert', k.kuv.grund, 'fehlt')
  nahe('der Rest rechnet weiter', k.kgv.wert, 20)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
