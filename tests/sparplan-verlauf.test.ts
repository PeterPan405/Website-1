/**
 * Prüfungen für den Sparplan am echten Kursverlauf.
 *
 * Ausführen mit `npm test`.
 *
 * Die Rechnung hat eine Eigenschaft, die sie prüfbar macht: Läuft der Kurs
 * gleichmäßig, müssen beide Wege **exakt** dasselbe ergeben. Weicht das ab,
 * stimmt die Vergleichsrechnung nicht – und das wäre auf der Seite nicht zu
 * sehen, weil dort ohnehin zwei verschiedene Zahlen stehen.
 */

import { einordnung, vergleiche, type Kurspunkt } from '../lib/sparplan-verlauf.ts'

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
function nahe(name: string, actual: number, expected: number, toleranz = 1e-6) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

/** Ein Punkt je Monatsanfang. */
function reiheAus(kurse: number[], abJahr = 2021): Kurspunkt[] {
  return kurse.map((c, i) => {
    const monat = i % 12
    const jahr = abJahr + Math.floor(i / 12)
    return { d: `${jahr}-${String(monat + 1).padStart(2, '0')}-01`, c }
  })
}

/* ------------------------------------------------- Die Probe auf die Rechnung */

/*
  Ein Kurs, der jeden Monat um genau ein Prozent steigt. Beide Wege müssen
  auf denselben Endwert kommen – der gleichmäßige Weg ist hier der echte.
*/
const gleichmaessigeReihe = reiheAus(
  Array.from({ length: 24 }, (_, i) => 100 * 1.01 ** i)
)
const gleich = vergleiche(gleichmaessigeReihe, 100)!
nahe('gleichmäßiger Kurs: beide Wege identisch', gleich.echt, gleich.gleichmaessig, 1e-9)
check('kein Unterschied', Math.abs(gleich.unterschied) < 1e-9, true)
check('24 Raten', gleich.raten, 24)
check('2.400 € eingezahlt', gleich.eingezahlt, 2400)
nahe(
  'die Jahresrendite entspricht dem Monatsfaktor',
  gleich.jahresrenditeProzent,
  (1.01 ** 12 - 1) * 100,
  0.35
)

/* --------------------------------------------- Schwach zuerst, stark später */

/*
  Beide Reihen laufen von 100 nach 100 – dieselbe Gesamtentwicklung von null
  Prozent. Nur die Reihenfolge unterscheidet sie.
*/
const erstRunter = reiheAus([100, 80, 60, 60, 80, 100])
const erstHoch = reiheAus([100, 120, 140, 140, 120, 100])

const runter = vergleiche(erstRunter, 100)!
const hoch = vergleiche(erstHoch, 100)!

check(
  'bei Gesamtentwicklung null bleibt der gleichmäßige Weg beim Einsatz',
  Math.round(runter.gleichmaessig),
  600
)
check('erst runter, dann hoch: der echte Weg gewinnt', runter.unterschied > 0, true)
check('erst hoch, dann runter: der echte Weg verliert', hoch.unterschied < 0, true)
check(
  'beide haben dieselbe Gesamtentwicklung',
  Math.round(runter.jahresrenditeProzent) === Math.round(hoch.jahresrenditeProzent),
  true
)

/* ------------------------------------- Einstand liegt unter dem Durchschnitt */

check(
  'der mittlere Einstand liegt unter dem Durchschnitt der Kurse',
  runter.mittlererKurs < runter.durchschnittskurs,
  true
)
check(
  'und zwar auch in der anderen Richtung',
  hoch.mittlererKurs < hoch.durchschnittskurs,
  true
)
check(
  'bei gleichmäßigem Kurs liegt er ebenfalls darunter',
  gleich.mittlererKurs < gleich.durchschnittskurs,
  true
)

/* ---------------------------------------------------------------- Ausfälle */

check('eine zu kurze Reihe ergibt nichts', vergleiche(reiheAus([100]), 100), null)
check('eine leere Reihe ergibt nichts', vergleiche([], 100), null)
check('eine Rate von null ergibt nichts', vergleiche(erstRunter, 0), null)
check('eine negative Rate ergibt nichts', vergleiche(erstRunter, -50), null)

/*
  Ein Kurs von null würde durch null teilen. Die Punkte werden übersprungen;
  bleiben weniger als zwei Kauftage übrig, kommt `null` zurück.
*/
const mitNull: Kurspunkt[] = [
  { d: '2021-01-01', c: 0 },
  { d: '2021-02-01', c: 0 },
  { d: '2021-03-01', c: 100 },
]
check('lauter Nullkurse ergeben nichts', vergleiche(mitNull, 100), null)

/* Nur ein Kauf je Monat, auch bei täglichen Kursen. */
const taeglich: Kurspunkt[] = [
  { d: '2021-01-04', c: 100 },
  { d: '2021-01-05', c: 101 },
  { d: '2021-01-06', c: 102 },
  { d: '2021-02-01', c: 105 },
  { d: '2021-02-02', c: 106 },
  { d: '2021-03-01', c: 110 },
]
const proMonat = vergleiche(taeglich, 100)!
check('drei Monate, drei Raten', proMonat.raten, 3)
check('gekauft wird am ersten Handelstag des Monats', proMonat.vonTag, '2021-01-04')
check('bis zum letzten Punkt der Reihe', proMonat.bisTag, '2021-03-01')

/* Ein späterer Starttag schneidet vorne ab. */
const spaeter = vergleiche(taeglich, 100, '2021-02-01')!
check('mit Starttag: zwei Raten', spaeter.raten, 2)
check('und der Anfang stimmt', spaeter.vonTag, '2021-02-01')

/* ------------------------------------------------------------- Einordnung */

check(
  'gleichmäßig: beide Wege dicht beieinander',
  einordnung(gleich, 'Ein Titel').includes('dicht beieinander'),
  true
)
check(
  'schwach zuerst: der echte Verlauf schlägt den gleichmäßigen',
  einordnung(runter, 'Ein Titel').includes('geschlagen'),
  true
)
check(
  'stark zuerst: der echte Verlauf liegt darunter',
  einordnung(hoch, 'Ein Titel').includes('unter dem gleichmäßigen'),
  true
)
check(
  'ohne Empfehlung',
  /kaufen|verkaufen|solltest|empfehl/i.test(einordnung(runter, 'Ein Titel')),
  false
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
