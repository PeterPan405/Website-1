/**
 * Prüfungen für den Rückblick auf echte Kursreihen.
 *
 * Zwei Fehler wären hier möglich und beide sähen plausibel aus: ein
 * Startkurs, der vor dem gewünschten Tag liegt, und ein mittlerer
 * Einstandskurs, der arithmetisch statt harmonisch gemittelt ist. Der zweite
 * verfehlt genau den Effekt, den ein Sparplan hat – und die Zahl wäre nur ein
 * paar Prozent daneben, also unauffällig.
 */

import { abTag, einmalanlage, sparplan, type Kurspunkt } from '../lib/rueckblick.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

/** Eine Reihe mit einem Punkt je Monatsersten. */
function monatsreihe(kurse: number[], abJahr = 2021): Kurspunkt[] {
  return kurse.map((c, i) => {
    const jahr = abJahr + Math.floor(i / 12)
    const monat = String((i % 12) + 1).padStart(2, '0')
    return { d: `${jahr}-${monat}-01`, c }
  })
}

console.log('\n— Starttag —')

const reihe: Kurspunkt[] = [
  { d: '2021-01-04', c: 100 },
  { d: '2021-02-01', c: 110 },
  { d: '2021-03-01', c: 120 },
]

/*
  Wer den 1. Januar waehlt, meint „ab Anfang des Jahres“. Der naechstgelegene
  Handelstag waere der 30. Dezember – ein Kauf vor dem gewuenschten Tag.
*/
pruefe(
  'nimmt den ersten Handelstag ab dem Wunschtag',
  abTag(reihe, '2021-01-01')?.d === '2021-01-04'
)
pruefe('trifft einen Handelstag genau', abTag(reihe, '2021-02-01')?.d === '2021-02-01')
pruefe('nach dem Ende der Reihe gibt es nichts', abTag(reihe, '2022-01-01') === null)

console.log('\n— Einmalanlage —')

const einmal = einmalanlage(reihe, 1000, '2021-01-01')
pruefe('kauft zum Kurs des Starttags', einmal?.startkurs === 100)
pruefe(
  'rechnet den Endwert aus dem Endkurs',
  Math.abs((einmal?.endwert ?? 0) - 1200) < 1e-9,
  String(einmal?.endwert)
)
pruefe('und die Gesamtveraenderung', Math.abs((einmal?.gesamtProzent ?? 0) - 20) < 1e-9)

/*
  Anteile statt ganzer Stuecke: Bei einem Kurs von 800 und 1.000 Euro Einsatz
  blieben sonst 200 Euro liegen, und aus einer Nebenrechnung wuerde die
  Hauptaussage.
*/
const teuer = einmalanlage(
  [
    { d: '2021-01-01', c: 800 },
    { d: '2026-01-01', c: 1600 },
  ],
  1000,
  '2021-01-01'
)
pruefe(
  'kauft Anteile und keine ganzen Stuecke',
  Math.abs((teuer?.endwert ?? 0) - 2000) < 1e-9,
  String(teuer?.endwert)
)

/*
  Unter einem Jahr keine Jahresrate: Aus zwei Monaten eine Jahresrate
  hochzurechnen ergibt eine Zahl, die niemand gemessen hat.
*/
pruefe('unter einem Jahr keine Jahresrate', einmal?.jahresProzent === null)

const langeReihe = monatsreihe([
  100,
  ...Array(59)
    .fill(0)
    .map((_, i) => 100 + i),
])
const lang = einmalanlage(langeReihe, 1000, '2021-01-01')
pruefe('ueber ein Jahr gibt es eine Jahresrate', typeof lang?.jahresProzent === 'number')
/*
  Verdoppelung ueber genau fuenf Jahre sind rund 14,9 Prozent im Jahr.
*/
const verdoppelt = einmalanlage(
  [
    { d: '2021-01-01', c: 100 },
    { d: '2026-01-01', c: 200 },
  ],
  1000,
  '2021-01-01'
)
pruefe(
  'eine Verdoppelung in fuenf Jahren sind rund 14,9 Prozent im Jahr',
  Math.abs((verdoppelt?.jahresProzent ?? 0) - 14.87) < 0.1,
  String(verdoppelt?.jahresProzent)
)

console.log('\n— Randfaelle —')

pruefe(
  'eine zu kurze Reihe ergibt nichts',
  einmalanlage([{ d: '2021-01-01', c: 100 }], 1000, '2021-01-01') === null
)
pruefe(
  'ein Einsatz von null ergibt nichts',
  einmalanlage(reihe, 0, '2021-01-01') === null
)
/*
  Nicht null als Ergebnis: Das waere die Aussage „alles verloren“, und die
  waere falsch.
*/
pruefe(
  'ein Zeitraum ausserhalb der Reihe ergibt nichts',
  einmalanlage(reihe, 1000, '2030-01-01') === null
)

console.log('\n— Sparplan —')

/*
  Der Kern: Bei schwankenden Kursen liegt der mittlere Einstandskurs unter dem
  Durchschnitt der Monatskurse, weil eine feste Rate bei niedrigem Kurs mehr
  Anteile kauft. Wer arithmetisch mittelt, verfehlt genau das.
*/
const schwankend = monatsreihe([100, 50, 100, 50])
const plan = sparplan(schwankend, 100, '2021-01-01')
pruefe('kauft je Monat einmal', plan?.raten === 4, String(plan?.raten))
pruefe('summiert die Einzahlungen', plan?.eingezahlt === 400)

const arithmetisch = (100 + 50 + 100 + 50) / 4
pruefe(
  'der mittlere Einstandskurs liegt unter dem Durchschnitt der Kurse',
  (plan?.mittlererKurs ?? 0) < arithmetisch,
  `${plan?.mittlererKurs} gegen ${arithmetisch}`
)
/*
  Nachgerechnet: 100/100 + 100/50 + 100/100 + 100/50 = 1+2+1+2 = 6 Anteile
  fuer 400 Euro, also 66,67 je Anteil – nicht 75.
*/
pruefe(
  'und betraegt genau 400 geteilt durch 6',
  Math.abs((plan?.mittlererKurs ?? 0) - 400 / 6) < 1e-9,
  String(plan?.mittlererKurs)
)
pruefe(
  'der Endwert sind sechs Anteile zum Schlusskurs',
  Math.abs((plan?.endwert ?? 0) - 6 * 50) < 1e-9,
  String(plan?.endwert)
)

/*
  Mehrere Handelstage im selben Monat duerfen nicht mehrfach kaufen.
*/
const dicht: Kurspunkt[] = [
  { d: '2021-01-04', c: 100 },
  { d: '2021-01-05', c: 101 },
  { d: '2021-01-06', c: 102 },
  { d: '2021-02-01', c: 110 },
]
pruefe(
  'kauft trotz vieler Handelstage nur einmal je Monat',
  sparplan(dicht, 100, '2021-01-01')?.raten === 2
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
