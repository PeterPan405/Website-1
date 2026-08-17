/**
 * Der Notgroschen – und die Frage, ob die Fallunterscheidung eine ist.
 *
 * ## Was hier wirklich schiefgehen kann
 *
 * Nicht die Arithmetik. Sie ist eine Addition von Monaten. Schiefgehen kann,
 * dass die **Unterscheidung keine ist**:
 *
 * 1. **Ein Zweig greift nie.** Eine Fallunterscheidung über Merkmale, die der
 *    Stoff nicht hat, ist keine – der Rechner sähe differenziert aus und gäbe
 *    allen dieselbe Zahl. Deshalb wird jeder Zweig hier einzeln vorgelegt und
 *    nachgezählt, ob er greift.
 * 2. **Die Beiträge heben sich auf.** Wenn Zu- und Abschläge in der Summe
 *    immer bei der Faustregel landen, war die ganze Rechnung Zierrat. Geprüft
 *    wird deshalb an den beiden Enden: Der vorsichtigste Fall muss deutlich
 *    über dem sorglosesten liegen.
 * 3. **Die Grenzen greifen zu früh.** Eine Deckelung, die den Normalfall schon
 *    abschneidet, macht aus einer begründeten Spanne wieder eine pauschale –
 *    nur mit mehr Aufwand.
 *
 * ## Und was ausdrücklich nicht geprüft wird
 *
 * Ob „selbstständig = plus drei Monate" die richtige Zahl ist. Das ist eine
 * Setzung, keine Messung, und ein Test kann sie nur wiederholen. Geprüft wird
 * die **Richtung** – dass ein Selbstständiger mehr braucht als eine Beamtin –
 * und die ist begründbar.
 */

import {
  beitraege,
  notgroschen,
  PAUSCHALE,
  SPANNE,
  type Beschaeftigung,
  type Haushaltslage,
} from '@/lib/notgroschen'
import { calculateBudget } from '@/lib/finance'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Ein durchschnittlicher Haushalt als Ausgangspunkt. */
const basis: Haushaltslage = {
  beschaeftigung: 'unbefristet',
  einkommen: 2,
  ausgabenProMonat: 3_000,
  fixkostenProMonat: 1_500, // 50 % – zwischen allen Schwellen
  unterhaltspflichten: 0,
}

/* ------------------------------------------ Greift jeder Zweig an Material? */

/*
  Nicht „gibt es den Zweig", sondern „hat er je zugeschlagen".

  Gezählt wird über echte Eingaben: Für jeden Zweig wird eine Lage gebaut, die
  ihn auslösen soll, und nachgesehen, ob ein Beitrag mit von null verschiedenen
  Monaten herauskommt. Ein Zweig, der bei seiner eigenen Eingabe nichts tut,
  ist toter Text.
*/
console.log('Greift jeder Zweig?\n')

const zweige: { name: string; lage: Haushaltslage; erwartet: number }[] = [
  {
    name: 'selbstständig',
    lage: { ...basis, beschaeftigung: 'selbststaendig' },
    erwartet: 3,
  },
  { name: 'Probezeit', lage: { ...basis, beschaeftigung: 'probezeit' }, erwartet: 2 },
  { name: 'befristet', lage: { ...basis, beschaeftigung: 'befristet' }, erwartet: 2 },
  { name: 'verbeamtet', lage: { ...basis, beschaeftigung: 'verbeamtet' }, erwartet: -1 },
  { name: 'ein Einkommen', lage: { ...basis, einkommen: 1 }, erwartet: 1 },
  { name: 'zwei Einkommen', lage: basis, erwartet: -1 },
  {
    name: 'Fixkosten ab 75 %',
    lage: { ...basis, fixkostenProMonat: 2_400 },
    erwartet: 2,
  },
  {
    name: 'Fixkosten 60–75 %',
    lage: { ...basis, fixkostenProMonat: 2_000 },
    erwartet: 1,
  },
  {
    name: 'Fixkosten unter 45 %',
    lage: { ...basis, fixkostenProMonat: 1_200 },
    erwartet: -1,
  },
  { name: 'ein Kind', lage: { ...basis, unterhaltspflichten: 1 }, erwartet: 1 },
  { name: 'drei Kinder', lage: { ...basis, unterhaltspflichten: 3 }, erwartet: 2 },
]

for (const zweig of zweige) {
  const gefunden = beitraege(zweig.lage).some((b) => b.monate === zweig.erwartet)
  pruefen(
    `„${zweig.name}" schlägt mit ${zweig.erwartet > 0 ? '+' : ''}${zweig.erwartet} Monaten zu`,
    gefunden,
    'Der Zweig greift bei seiner eigenen Eingabe nicht – dann ist er toter Text.\n' +
      `     Beiträge: ${beitraege(zweig.lage)
        .map((b) => `${b.grund} (${b.monate})`)
        .join(', ')}`
  )
}

/*
  Die Gegenprobe: Ein mittlerer Fixkostenanteil darf **keinen** Beitrag
  auslösen. Sonst greift die Unterscheidung immer und unterscheidet nichts.
*/
pruefen(
  'Ein Fixkostenanteil zwischen 45 und 60 % löst nichts aus',
  beitraege(basis).every((b) => !b.grund.startsWith('Fixkosten')),
  'Bei 50 % gibt es keinen Befund – der Bereich dazwischen muss leer bleiben.'
)

/* ------------------------------------------------ Die Enden liegen auseinander */

console.log('')

const vorsichtigst = notgroschen({
  beschaeftigung: 'selbststaendig',
  einkommen: 1,
  ausgabenProMonat: 3_000,
  fixkostenProMonat: 2_700, // 90 %
  unterhaltspflichten: 2,
})

const sorglosest = notgroschen({
  beschaeftigung: 'verbeamtet',
  einkommen: 2,
  ausgabenProMonat: 3_000,
  fixkostenProMonat: 900, // 30 %
  unterhaltspflichten: 0,
})

console.log(
  `  vorsichtigster Fall: ${vorsichtigst.monateVon}–${vorsichtigst.monateBis} Monate\n` +
    `  sorglosester Fall:   ${sorglosest.monateVon}–${sorglosest.monateBis} Monate\n`
)

pruefen(
  'Der vorsichtigste Fall liegt deutlich über dem sorglosesten',
  vorsichtigst.monateVon >= sorglosest.monateVon + 5,
  'Wenn sich die Beiträge in der Summe aufheben, war die Rechnung Zierrat.'
)

pruefen(
  'Der sorgloseste Fall liegt unter der Faustregel',
  sorglosest.monateVon < PAUSCHALE.min,
  `${sorglosest.monateVon} statt unter ${PAUSCHALE.min}. Eine Rechnung, die nie ` +
    'weniger empfiehlt als die Faustregel, ist ein Zuschlagsrechner.'
)

pruefen(
  'Der vorsichtigste Fall liegt über der Faustregel',
  vorsichtigst.monateVon > PAUSCHALE.max,
  `${vorsichtigst.monateVon} statt über ${PAUSCHALE.max}.`
)

pruefen(
  'Beide Enden bleiben in den Grenzen',
  vorsichtigst.monateBis <= SPANNE.max && sorglosest.monateVon >= SPANNE.min,
  `${sorglosest.monateVon} … ${vorsichtigst.monateBis}, erlaubt ${SPANNE.min} … ${SPANNE.max}`
)

pruefen(
  'Die Spannweite der Faustregel bleibt erhalten',
  [vorsichtigst, sorglosest, notgroschen(basis)].every(
    (e) => e.monateBis - e.monateVon === PAUSCHALE.max - PAUSCHALE.min
  ),
  'Es gibt keine richtige Zahl, es gibt einen Bereich – der darf nicht verloren gehen.'
)

/* ------------------------------------------------------ Der Sparmodus */

console.log('')

pruefen(
  'Bei niedrigen Fixkosten trägt derselbe Betrag länger',
  sorglosest.monateImSparmodus > sorglosest.monateBis * 2,
  `${sorglosest.monateImSparmodus.toFixed(1)} gegen ${sorglosest.monateBis} Monate. ` +
    'Bei 30 % Fixkosten muss der Puffer gut dreimal so lange tragen.'
)

pruefen(
  'Bei hohen Fixkosten bringt Sparen kaum etwas',
  vorsichtigst.monateImSparmodus < vorsichtigst.monateBis * 1.2,
  'Bei 90 % Fixkosten ist im Ernstfall nichts zu holen – genau das ist die Aussage.'
)

pruefen(
  'Ohne Fixkosten keine Division durch null',
  (() => {
    const e = notgroschen({ ...basis, fixkostenProMonat: 0 })
    return Number.isFinite(e.monateImSparmodus) && e.monateImSparmodus === e.monateBis
  })(),
  'Die richtige Antwort ist nicht „unendlich", sondern die Zahl ohne Sparen.'
)

pruefen(
  'Ohne Ausgaben keine NaN',
  (() => {
    const e = notgroschen({ ...basis, ausgabenProMonat: 0, fixkostenProMonat: 0 })
    return (
      e.euroVon === 0 && e.fixkostenanteilProzent === 0 && Number.isFinite(e.monateBis)
    )
  })(),
  'Ein leeres Formular ist eine erlaubte Eingabe.'
)

/* --------------------------------------- Die Faustregel steht an einer Stelle */

console.log('')

/*
  Der Haushaltsrechner zeigt dieselbe Faustregel.

  Stünde sie dort noch einmal als Zahl, könnten beide auseinanderlaufen – und
  dann empfähle dieselbe Website auf zwei Seiten Verschiedenes. Geprüft wird
  deshalb gegen die Konstante, nicht gegen 3 und 6.
*/
const budget = calculateBudget(
  [{ id: 'a', label: 'Gehalt', amount: 4_000 }],
  [{ id: 'b', label: 'Alles', amount: 3_000 }]
)

pruefen(
  'Der Haushaltsrechner benutzt dieselbe Faustregel',
  budget.emergencyFundRange.min === 3_000 * PAUSCHALE.min &&
    budget.emergencyFundRange.max === 3_000 * PAUSCHALE.max,
  `${budget.emergencyFundRange.min}–${budget.emergencyFundRange.max} bei 3.000 € Ausgaben ` +
    `und einer Faustregel von ${PAUSCHALE.min}–${PAUSCHALE.max}.`
)

/* ------------------------------------------- Jeder Beitrag ist erklärt */

console.log('')

const alleBeschaeftigungen: Beschaeftigung[] = [
  'verbeamtet',
  'unbefristet',
  'befristet',
  'probezeit',
  'selbststaendig',
]

let ohneErklaerung = 0
for (const b of alleBeschaeftigungen) {
  for (const kinder of [0, 1, 3]) {
    for (const fix of [900, 1_500, 2_000, 2_700]) {
      for (const einkommen of [1, 2]) {
        const liste = beitraege({
          beschaeftigung: b,
          einkommen,
          ausgabenProMonat: 3_000,
          fixkostenProMonat: fix,
          unterhaltspflichten: kinder,
        })
        for (const beitrag of liste) {
          if (beitrag.grund.trim().length < 8 || beitrag.erklaerung.trim().length < 60) {
            ohneErklaerung++
          }
        }
      }
    }
  }
}

pruefen(
  'Jeder Beitrag nennt einen Grund und erklärt ihn',
  ohneErklaerung === 0,
  `${ohneErklaerung} Beiträge über 120 Kombinationen ohne brauchbare Erklärung.\n` +
    '     Eine Zahl ohne Begründung ist genau das, was die Faustregel schon war.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
