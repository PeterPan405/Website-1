/**
 * Der Entnahmeplan – gegen eine Rechnung geprüft, die anders zustande kommt.
 *
 * ## Warum eine geschlossene Formel danebensteht
 *
 * Ein Test, der den Verlauf noch einmal Jahr für Jahr nachrechnet, prüft die
 * Schleife gegen sich selbst: Derselbe Denkfehler steht dann zweimal da und
 * bestätigt sich. Die Reichweite lässt sich aber auch geschlossen ausrechnen —
 *
 *     N = ln( W / (W − K·r) ) / ln(1 + r)
 *
 * – über den Logarithmus statt über die Iteration. Zwei Wege, ein Ergebnis;
 * weichen sie ab, ist einer von beiden falsch, und das ist mehr, als ein
 * Nachrechnen je zeigen könnte.
 *
 * ## Was hier sonst schiefgehen kann
 *
 * 1. **Die Inflation fällt unter den Tisch.** Der häufigste Fehler in
 *    Entnahmerechnern und der teuerste: Eine feste Entnahme in Euro rechnet
 *    eine Kürzung ein, die niemand beschlossen hat, und die Reichweite fällt
 *    zu freundlich aus. Hier wird gegengeprüft, dass Inflation die Reichweite
 *    tatsächlich verkürzt.
 * 2. **„Trägt dauerhaft" und „reicht über den Horizont hinaus" verschwimmen.**
 *    Beides ergäbe `reichweiteJahre === null`, ist aber nicht dasselbe.
 * 3. **Die Vergleichsbeträge stimmen nicht mit dem Verlauf überein.** Wer die
 *    ausgerechnete Entnahme für die Zieldauer einsetzt, muss am Ende dieser
 *    Dauer bei null landen – sonst rechnen Anzeige und Verlauf verschiedene
 *    Dinge.
 */

import {
  dauerhafteEntnahme,
  entnahmeFuerDauer,
  entnahmeplan,
  MAX_JAHRE,
  type Entnahmeeingabe,
} from '@/lib/entnahme'
import { realRatePercent } from '@/lib/finance'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function nahe(a: number, b: number, toleranz = 0.5): boolean {
  return Math.abs(a - b) <= toleranz
}

const basis: Entnahmeeingabe = {
  kapital: 500_000,
  entnahmeProMonat: 2_000,
  renditeProzent: 5,
  inflationProzent: 2,
  zieldauerJahre: 30,
}

/* ------------------------------------------- Gegen die geschlossene Formel */

/**
 * Die Reichweite über den Logarithmus – der zweite, unabhängige Weg.
 *
 * Gibt `null` zurück, wenn die Entnahme den realen Ertrag nicht übersteigt:
 * Dann wird der Logarithmus einer nicht-positiven Zahl verlangt, und das ist
 * kein Rechenfehler, sondern der Fall „das Kapital wächst trotz Entnahme".
 */
function reichweiteGeschlossen(
  kapital: number,
  entnahmeProJahr: number,
  realzinsProzent: number
): number | null {
  const r = realzinsProzent / 100
  if (Math.abs(r) < 1e-9) return kapital / entnahmeProJahr

  const nenner = entnahmeProJahr - kapital * r
  if (nenner <= 0) return null

  return Math.log(entnahmeProJahr / nenner) / Math.log(1 + r)
}

console.log('Reichweite: Schleife gegen geschlossene Formel\n')

for (const [rendite, inflation, entnahme] of [
  [5, 2, 2_000],
  [5, 2, 3_000],
  [7, 2, 2_500],
  [3, 3, 1_800],
  [2, 4, 2_200],
  [6, 0, 4_000],
] as const) {
  const plan = entnahmeplan({
    ...basis,
    renditeProzent: rendite,
    inflationProzent: inflation,
    entnahmeProMonat: entnahme,
  })
  const real = realRatePercent(rendite, inflation)
  const formel = reichweiteGeschlossen(basis.kapital, entnahme * 12, real)

  if (formel === null || formel > MAX_JAHRE) {
    pruefen(
      `${rendite} % / ${inflation} % / ${entnahme} € – nicht aufgebraucht`,
      plan.reichweiteJahre === null,
      `Die Formel sagt ${formel === null ? 'trägt dauerhaft' : `${formel.toFixed(1)} Jahre`}, ` +
        `der Verlauf ${plan.reichweiteJahre}.`
    )
    continue
  }

  /*
    Die Schleife zählt ganze Jahre und meldet das Jahr, in dem nichts mehr da
    ist – die Formel liefert den Bruchteil. Erwartet wird deshalb die
    Aufrundung, nicht Gleichheit.
  */
  pruefen(
    `${rendite} % / ${inflation} % / ${entnahme} € – ${plan.reichweiteJahre} Jahre`,
    plan.reichweiteJahre === Math.ceil(formel),
    `Formel: ${formel.toFixed(2)} → erwartet ${Math.ceil(formel)}, Verlauf: ${plan.reichweiteJahre}`
  )
}

/* ------------------------------------------------- Die Inflation wirkt */

console.log('')

/*
  Die Gegenprobe zum häufigsten Fehler.

  Würde die Entnahme nicht mit der Inflation steigen, wäre die Reichweite bei
  drei Prozent Inflation dieselbe wie bei null – und der Unterschied ist
  gewaltig, nicht fein.
*/
/*
  2.500 € statt der 2.000 € aus `basis`.

  Bei 2.000 € und ohne Inflation liegt die Entnahme mit 4,8 % unter dem
  Realzins von 5 % – der Plan trägt dann dauerhaft, und „dauerhaft gegen 27
  Jahre" ist kein Vergleich zweier Reichweiten. Beim ersten Anlauf stand hier
  genau das, und die Prüfung hat es gemeldet.
*/
const ohneTeuerung = entnahmeplan({
  ...basis,
  entnahmeProMonat: 2_500,
  inflationProzent: 0,
})
const mitTeuerung = entnahmeplan({
  ...basis,
  entnahmeProMonat: 2_500,
  inflationProzent: 3,
})

pruefen(
  'Inflation verkürzt die Reichweite deutlich',
  ohneTeuerung.reichweiteJahre !== null &&
    mitTeuerung.reichweiteJahre !== null &&
    mitTeuerung.reichweiteJahre < ohneTeuerung.reichweiteJahre - 5,
  `ohne Inflation: ${ohneTeuerung.reichweiteJahre}, mit 3 %: ${mitTeuerung.reichweiteJahre}. ` +
    'Sind die gleich, steigt die Entnahme nicht mit – der klassische Fehler.'
)

pruefen(
  'Die nominale Entnahme wächst, die reale bleibt',
  (() => {
    const erstes = mitTeuerung.verlauf[0]
    /*
      Das vorletzte Jahr, nicht das letzte.

      Im Jahr der Erschöpfung wird nur noch entnommen, was da ist – die
      Entnahme ist dann absichtlich kleiner. Gegen dieses Jahr zu prüfen hieße,
      eine richtige Rechnung zu beanstanden.
    */
    const volles = mitTeuerung.verlauf.at(-2)
    if (!volles || !erstes) return false
    return (
      nahe(erstes.entnahme, volles.entnahme, 1) &&
      volles.entnahmeNominal > erstes.entnahmeNominal * 1.5
    )
  })(),
  'Real konstant, nominal steigend – genau das ist die Aussage des Rechners.'
)

pruefen(
  'Im letzten Jahr wird nur entnommen, was noch da ist',
  (() => {
    const letztes = mitTeuerung.verlauf.at(-1)
    const volles = mitTeuerung.verlauf.at(-2)
    return (
      letztes !== undefined &&
      volles !== undefined &&
      letztes.entnahme < volles.entnahme &&
      letztes.endwert === 0
    )
  })(),
  'Sonst stünde im Verlauf eine Entnahme, die es nicht gegeben hat.'
)

/* --------------------------------------- Dauerhaft ist ein eigener Befund */

console.log('')

/*
  Drei Fälle, die alle `reichweiteJahre === null` liefern könnten – und von
  denen nur einer „trägt dauerhaft" ist.
*/
const knappDrunter = entnahmeplan({
  ...basis,
  entnahmeProMonat: 1_100, // 13.200 € auf 500.000 € = 2,64 % < Realzins 2,94 %
})
pruefen(
  'Entnahme unter dem realen Ertrag: trägt dauerhaft',
  knappDrunter.dauerhaft && knappDrunter.reichweiteJahre === null,
  `dauerhaft=${knappDrunter.dauerhaft}, reichweite=${knappDrunter.reichweiteJahre}`
)

const knappDrueber = entnahmeplan({
  ...basis,
  entnahmeProMonat: 1_300, // 15.600 € = 3,12 % > Realzins
})
pruefen(
  'Entnahme knapp über dem realen Ertrag: trägt nicht dauerhaft',
  !knappDrueber.dauerhaft,
  'Knapp darüber heißt: Es dauert lange, aber es endet. Das ist etwas anderes.'
)

pruefen(
  'Und es fällt trotzdem nicht mit „aufgebraucht" zusammen',
  knappDrueber.reichweiteJahre === null,
  `Bei dieser Entnahme reicht es über ${MAX_JAHRE} Jahre hinaus – ` +
    'gemeldet wird das als „nicht aufgebraucht", nicht als „dauerhaft".'
)

pruefen(
  'Negativer Realzins: dauerhaft gibt es nicht',
  dauerhafteEntnahme(500_000, -1) === 0 &&
    !entnahmeplan({ ...basis, renditeProzent: 1, inflationProzent: 3 }).dauerhaft,
  'Wenn die Inflation die Rendite schlägt, verliert das Kapital auch ohne Entnahme.'
)

/* ------------------------------ Die Vergleichsbeträge passen zum Verlauf */

console.log('')

/*
  Die Probe aufs Exempel: Wer genau den ausgewiesenen Betrag entnimmt, muss am
  Ende der Zieldauer bei null landen. Anzeige und Verlauf dürfen nicht zwei
  verschiedene Rechnungen sein.
*/
for (const jahre of [15, 25, 30, 40]) {
  const plan = entnahmeplan({ ...basis, zieldauerJahre: jahre })
  const probe = entnahmeplan({
    ...basis,
    zieldauerJahre: jahre,
    entnahmeProMonat: plan.fuerZieldauerProMonat,
  })
  const amEnde = probe.verlauf.find((j) => j.jahr === jahre)

  pruefen(
    `Entnahme für ${jahre} Jahre (${plan.fuerZieldauerProMonat.toFixed(0)} €/Monat) endet bei null`,
    amEnde !== undefined && nahe(amEnde.endwert, 0, 5),
    `Rest nach ${jahre} Jahren: ${amEnde?.endwert.toFixed(2)} € statt 0.`
  )
}

pruefen(
  'Ohne Ertrag ist es Kapital durch Jahre',
  nahe(entnahmeFuerDauer(300_000, 30, 0), 10_000, 0.01),
  `${entnahmeFuerDauer(300_000, 30, 0).toFixed(2)} statt 10.000 – der Grenzfall ` +
    'des Realzinses null, an dem die Rentenformel durch null teilt.'
)

pruefen(
  'Negativer Realzins liefert weniger als Kapital durch Jahre',
  entnahmeFuerDauer(300_000, 30, -1.5) < 10_000,
  'Sonst wäre der Fall „Inflation über Rendite" nicht abgebildet.'
)

pruefen(
  'Die dauerhafte Entnahme trägt die Zieldauer sicher',
  (() => {
    const plan = entnahmeplan(basis)
    return plan.dauerhaftProMonat < plan.fuerZieldauerProMonat
  })(),
  'Wer das Kapital erhalten will, kann weniger entnehmen als wer es aufbraucht. ' +
    'Steht es andersherum, ist eine der beiden Formeln falsch.'
)

/* --------------------------------------------------------- Ränder */

console.log('')

pruefen(
  'Kein Kapital: keine Reichweite, keine Division durch null',
  (() => {
    const plan = entnahmeplan({ ...basis, kapital: 0 })
    return (
      plan.reichweiteJahre === 1 &&
      plan.entnahmequoteProzent === 0 &&
      !plan.dauerhaft &&
      Number.isFinite(plan.fuerZieldauerProMonat)
    )
  })(),
  'Ein leeres Depot ist eine erlaubte Eingabe und darf keine NaN erzeugen.'
)

pruefen(
  'Keine Entnahme: das Kapital wächst',
  (() => {
    const plan = entnahmeplan({ ...basis, entnahmeProMonat: 0 })
    const letztes = plan.verlauf.at(-1)
    return (
      plan.reichweiteJahre === null &&
      plan.dauerhaft &&
      letztes !== undefined &&
      letztes.endwert > basis.kapital
    )
  })(),
  'Ohne Entnahme wächst es real – bei positivem Realzins.'
)

pruefen(
  'Der Verlauf hört auf, wenn nichts mehr da ist',
  (() => {
    const plan = entnahmeplan({ ...basis, entnahmeProMonat: 8_000 })
    return (
      plan.reichweiteJahre !== null &&
      plan.verlauf.length === plan.reichweiteJahre &&
      plan.verlauf.at(-1)?.endwert === 0
    )
  })(),
  'Zeilen mit null Euro Depotwert und weiterlaufender Entnahme wären erfunden.'
)

pruefen(
  'Die Entnahmequote ist die Jahresentnahme am Kapital',
  nahe(entnahmeplan(basis).entnahmequoteProzent, (24_000 / 500_000) * 100, 0.001),
  'Die Zahl, an der die bekannte Vier-Prozent-Regel hängt.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
