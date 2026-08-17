/**
 * Kaufkraft und Wechselkurs – und die Frage, ob die Trennung eine ist.
 *
 * ## Was hier wirklich schiefgehen kann
 *
 * 1. **Die beiden Wirkungen sind gar nicht getrennt.** Genau dafür gibt es
 *    diesen Rechner. Wenn der Wechselkurseffekt in der Kaufkraftzahl steckte
 *    oder umgekehrt, fiele das an keiner einzelnen Zahl auf – wohl aber
 *    daran, dass sich die Kaufkraft bei einem Währungswechsel ändern würde.
 *    Sie darf es nicht: Was 100 € von 2015 in Deutschland kaufen, hat mit dem
 *    Dollar nichts zu tun.
 * 2. **Die Reihen sind falsch abgeschrieben.** Sie stammen aus einem
 *    Läuferprotokoll und sind von Hand in eine Datei gewandert – der klassische
 *    Weg für einen Zahlendreher. Geprüft wird deshalb gegen Eigenschaften, die
 *    eine echte Reihe haben muss, und an einzelnen Stützwerten aus dem Abruf.
 * 3. **Eine Lücke wird stillschweigend überbrückt.** Ein Jahr ohne Daten muss
 *    `null` liefern und keine Näherung – auf einer Seite, die von sich sagt,
 *    mit gemessenen Werten zu rechnen, wäre eine erfundene Zwischenzahl der
 *    schlimmste Fehler.
 */

import {
  BASISJAHR,
  ERSTES_JAHR,
  LETZTES_JAHR,
  PREISINDEX,
  WAEHRUNGEN,
  WECHSELKURSE,
} from '@/data/preisindex'
import { jahrVorhanden, vergleiche, verbliebeneKaufkraft } from '@/lib/kaufkraft'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function nahe(a: number, b: number, toleranz = 0.01): boolean {
  return Math.abs(a - b) <= toleranz
}

/* ------------------------------------------------ Die Reihen sind heil */

console.log(`Preisindex ${ERSTES_JAHR}–${LETZTES_JAHR}\n`)

pruefen(
  'Der Preisindex hat für jedes Jahr einen Wert',
  Array.from({ length: LETZTES_JAHR - ERSTES_JAHR + 1 }, (_, i) => ERSTES_JAHR + i).every(
    (jahr) => typeof PREISINDEX[jahr] === 'number'
  ),
  'Eine Lücke mitten in der Reihe wäre beim Abtippen entstanden.'
)

pruefen(
  `Das Basisjahr ${BASISJAHR} steht auf 100`,
  PREISINDEX[BASISJAHR] === 100,
  `${PREISINDEX[BASISJAHR]} statt 100 – dann ist es nicht die Basis, für die die Reihe steht.`
)

/*
  Preise steigen. Nicht jedes Jahr – 2009 stand der Index praktisch still –,
  aber ein Rückgang um mehr als ein Prozent käme in dieser Reihe nicht vor und
  wäre ein Zahlendreher.
*/
let sprünge = 0
for (let jahr = ERSTES_JAHR + 1; jahr <= LETZTES_JAHR; jahr++) {
  const rate = (PREISINDEX[jahr] / PREISINDEX[jahr - 1] - 1) * 100
  if (rate < -1 || rate > 12) sprünge++
}
pruefen(
  'Keine Jahresrate unter −1 % oder über 12 %',
  sprünge === 0,
  `${sprünge} Jahre außerhalb – jede solche Rate wäre in Deutschland ein Ereignis gewesen.`
)

/*
  Stützwerte aus dem Abruf.

  Nicht die ganze Reihe – das wäre dieselbe Abschrift ein zweites Mal. Diese
  drei Werte stehen für die drei Abschnitte: vor dem Euro, im Basisjahr, nach
  dem Preisschub von 2022.
*/
pruefen(
  'Stützwerte des Preisindex stimmen mit dem Abruf überein',
  PREISINDEX[1996] === 75.7 && PREISINDEX[2015] === 100.0 && PREISINDEX[2022] === 118.7,
  `1996: ${PREISINDEX[1996]}, 2015: ${PREISINDEX[2015]}, 2022: ${PREISINDEX[2022]}`
)

for (const waehrung of WAEHRUNGEN) {
  const reihe = WECHSELKURSE[waehrung.code]
  pruefen(
    `${waehrung.code}: für jedes Jahr ein Kurs`,
    reihe !== undefined &&
      Array.from(
        { length: LETZTES_JAHR - ERSTES_JAHR + 1 },
        (_, i) => ERSTES_JAHR + i
      ).every((jahr) => typeof reihe[jahr] === 'number' && reihe[jahr] > 0),
    'Eine Lücke oder eine Null wäre beim Abtippen entstanden.'
  )
}

pruefen(
  'Stützwerte der Wechselkurse stimmen mit dem Abruf überein',
  WECHSELKURSE.USD[1999] === 1.0658 &&
    WECHSELKURSE.USD[2015] === 1.1095 &&
    WECHSELKURSE.CHF[2015] === 1.0679 &&
    WECHSELKURSE.JPY[2015] === 134.31,
  'Die vier Werte, gegen die schon die Dekodierung des Abrufs geprüft wurde.'
)

/* ----------------------------------------- Die Trennung ist eine Trennung */

console.log('')

const usd = vergleiche(100, 2015, 2025, 'USD')
const jpy = vergleiche(100, 2015, 2025, 'JPY')

pruefen(
  'Beide Vergleiche liefern ein Ergebnis',
  usd !== null && jpy !== null,
  'Ohne Material prüft der Rest nichts.'
)

if (usd && jpy) {
  console.log(
    `  100 € von 2015 → ${usd.gleicheKaufkraft.toFixed(2)} € Kaufkraft, ` +
      `${usd.fremdDamals.toFixed(2)} USD damals, ${usd.fremdHeute.toFixed(2)} USD heute\n`
  )

  /*
    Die entscheidende Prüfung.

    Was 100 € von 2015 in Deutschland kaufen, hat mit dem Dollar nichts zu tun.
    Kommt bei zwei Währungen eine verschiedene Kaufkraft heraus, sind die
    beiden Wirkungen nicht getrennt – und der ganze Rechner wäre eine
    aufwendigere Art, dieselbe Vermischung zu zeigen, die er anprangert.
  */
  pruefen(
    'Die Kaufkraft hängt nicht an der Währung',
    usd.gleicheKaufkraft === jpy.gleicheKaufkraft,
    `${usd.gleicheKaufkraft} gegen ${jpy.gleicheKaufkraft} – dann steckt der ` +
      'Wechselkurs in der Kaufkraftzahl.'
  )

  pruefen(
    'Der Kurseffekt hängt nicht am Preisindex',
    nahe(usd.kurseffektProzent, (usd.kurse.heute / usd.kurse.damals - 1) * 100, 1e-9),
    'Sonst steckt die Inflation im Wechselkurseffekt.'
  )

  pruefen(
    'Die Kaufkraft rechnet mit dem Preisindex',
    nahe(usd.gleicheKaufkraft, (100 * PREISINDEX[2025]) / PREISINDEX[2015], 1e-9),
    `${usd.gleicheKaufkraft} statt ${(100 * PREISINDEX[2025]) / PREISINDEX[2015]}`
  )

  /*
    Und die dritte Zahl ist wirklich die Kombination – nicht eine vierte
    Rechnung, die zufällig in der Nähe liegt.
  */
  pruefen(
    'Die kombinierte Zahl ist Kaufkraft mal heutigem Kurs',
    nahe(usd.fremdMitKaufkraft, usd.gleicheKaufkraft * usd.kurse.heute, 1e-9),
    'Sonst rechnet die dritte Zahl etwas anderes als das, was sie behauptet.'
  )

  /*
    Die Gegenprobe zur Trennung: Bei zwei Währungen müssen die Kurseffekte
    verschieden sein. Wären sie gleich, prüfte die Trennung oben nichts – dann
    hinge schlicht keine Zahl an der Währung.
  */
  pruefen(
    'Verschiedene Währungen haben verschiedene Kurseffekte',
    Math.abs(usd.kurseffektProzent - jpy.kurseffektProzent) > 5,
    `${usd.kurseffektProzent.toFixed(1)} % gegen ${jpy.kurseffektProzent.toFixed(1)} % – ` +
      'liegen sie beieinander, prüft die Trennung oben nichts.'
  )
}

/* --------------------------------------------------- Richtungen und Raten */

console.log('')

pruefen(
  'Rückwärts gerechnet bleibt weniger übrig',
  (() => {
    const rest = verbliebeneKaufkraft(100, 2015, 2025)
    return rest !== null && rest < 100 && rest > 50
  })(),
  'Die zweite Leserichtung: was von 100 € übrig ist.'
)

pruefen(
  'Hin und zurück ergibt wieder den Ausgangsbetrag',
  (() => {
    const hin = vergleiche(100, 2005, 2020, 'USD')
    if (!hin) return false
    const zurueck = verbliebeneKaufkraft(hin.gleicheKaufkraft, 2005, 2020)
    return zurueck !== null && nahe(zurueck, 100, 1e-9)
  })(),
  'Beide Richtungen müssen dieselbe Reihe benutzen.'
)

/*
  Die jährliche Rate als geometrisches Mittel.

  Geteilt durch die Jahre käme eine zu hohe Zahl heraus, und sie stünde
  dauerhaft falsch auf der Seite. Geprüft wird an der Umkehrung: Die Rate über
  die Jahre verzinst muss die Gesamtteuerung ergeben.
*/
pruefen(
  'Die jährliche Rate ist geometrisch gemittelt',
  (() => {
    const v = vergleiche(100, 2015, 2025, 'USD')
    if (!v) return false
    const hochgerechnet = (1 + v.teuerungProJahrProzent / 100) ** 10 - 1
    return nahe(hochgerechnet * 100, v.teuerungProzent, 1e-6)
  })(),
  'Sonst ist es der arithmetische Mittelwert, und der liegt zu hoch.'
)

pruefen(
  'Gleiches Jahr: keine Teuerung, keine Division durch null',
  (() => {
    const v = vergleiche(100, 2020, 2020, 'USD')
    return (
      v !== null &&
      nahe(v.gleicheKaufkraft, 100, 1e-9) &&
      v.teuerungProzent === 0 &&
      v.teuerungProJahrProzent === 0 &&
      v.kurseffektProzent === 0
    )
  })(),
  'Der Fall tritt ein, sobald jemand beide Felder gleich setzt.'
)

/* --------------------------------------------------------- Lücken */

console.log('')

pruefen(
  'Ein Jahr außerhalb der Reihe liefert null',
  vergleiche(100, 1980, 2025, 'USD') === null &&
    vergleiche(100, 2015, 2099, 'USD') === null,
  'Eine Näherung wäre hier der schlimmste Fehler – die Seite behauptet, zu messen.'
)

pruefen(
  'Eine unbekannte Währung liefert null',
  vergleiche(100, 2015, 2025, 'XYZ') === null,
  'Und wirft nicht, weil der Aufruf aus einem Eingabefeld kommt.'
)

pruefen(
  'jahrVorhanden sagt dasselbe wie die Rechnung',
  jahrVorhanden(2015, 'USD') &&
    !jahrVorhanden(1980, 'USD') &&
    !jahrVorhanden(2015, 'XYZ'),
  'Zwei Auskünfte über dieselbe Sache dürfen nicht auseinanderlaufen.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
