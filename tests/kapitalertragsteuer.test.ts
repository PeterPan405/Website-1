/**
 * Prüfungen für die Steuer auf Kapitalerträge.
 *
 * Hier steht mehr auf dem Spiel als bei den übrigen Rechnungen dieses Projekts:
 * Wer eine Steuerlast falsch angezeigt bekommt, plant falsch. Geprüft wird
 * deshalb nicht nur, dass etwas herauskommt, sondern gegen die Sätze, die im
 * Gesetz stehen und sich unabhängig nachrechnen lassen.
 */

import {
  ABGELTUNGSTEUERSATZ,
  berechneSteuer,
  berechneVorabpauschale,
  gesamtsteuersatz,
  SPARERPAUSCHBETRAG_EINZELN,
} from '../lib/kapitalertragsteuer.ts'

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

function nahe(a: number, b: number, toleranz = 1e-9): boolean {
  return Math.abs(a - b) < toleranz
}

console.log('\n— Die Gesamtbelastung —')

pruefe(
  'ohne Kirchensteuer sind es 26,375 Prozent',
  nahe(gesamtsteuersatz(0), 0.26375),
  `${(gesamtsteuersatz(0) * 100).toFixed(4)} %`
)
pruefe(
  'mit 9 Prozent Kirchensteuer sind es 27,99 Prozent',
  nahe(gesamtsteuersatz(0.09), 0.279951, 1e-5),
  `${(gesamtsteuersatz(0.09) * 100).toFixed(4)} %`
)
pruefe(
  'mit 8 Prozent Kirchensteuer sind es 27,82 Prozent',
  nahe(gesamtsteuersatz(0.08), 0.278186, 1e-5),
  `${(gesamtsteuersatz(0.08) * 100).toFixed(4)} %`
)

/*
  Die Gegenprobe zum häufigsten Rechenfehler: Wer 25 Prozent nimmt und die
  Kirchensteuer obendrauf schlägt, kommt auf 28,375 Prozent. Das ist zu viel,
  weil die Kirchensteuer ihre eigene Bemessungsgrundlage mindert.
*/
const naiv = ABGELTUNGSTEUERSATZ * (1 + 0.055 + 0.09)
pruefe('die naive Rechnung liegt zu hoch', gesamtsteuersatz(0.09) < naiv)

console.log('\n— Der Regelfall —')

const ohneAlles = berechneSteuer({
  ertrag: 10_000,
  fondsart: 'sonstige',
  freibetrag: 0,
  kirchensteuersatz: 0,
})
pruefe(
  '10.000 Euro Zinsen ohne Freibetrag kosten 2.637,50 Euro',
  nahe(ohneAlles.steuerGesamt, 2637.5, 1e-6),
  ohneAlles.steuerGesamt.toFixed(2)
)
pruefe('davon 2.500 Euro Kapitalertragsteuer', nahe(ohneAlles.kapitalertragsteuer, 2500))
pruefe(
  'und 137,50 Euro Solidaritätszuschlag',
  nahe(ohneAlles.solidaritaetszuschlag, 137.5)
)
pruefe('Kirchensteuer fällt keine an', ohneAlles.kirchensteuer === 0)

console.log('\n— Sparerpauschbetrag —')

const kleinerErtrag = berechneSteuer({
  ertrag: 800,
  fondsart: 'sonstige',
  freibetrag: SPARERPAUSCHBETRAG_EINZELN,
  kirchensteuersatz: 0,
})
pruefe(
  '800 Euro Ertrag unter dem Freibetrag kosten nichts',
  kleinerErtrag.steuerGesamt === 0
)
pruefe('und 200 Euro Freibetrag bleiben übrig', kleinerErtrag.freibetragRest === 200)

const knappDarueber = berechneSteuer({
  ertrag: 1200,
  fondsart: 'sonstige',
  freibetrag: SPARERPAUSCHBETRAG_EINZELN,
  kirchensteuersatz: 0,
})
pruefe(
  'nur die 200 Euro über dem Freibetrag werden besteuert',
  nahe(knappDarueber.bemessungsgrundlage, 200)
)
pruefe(
  'das ergibt 52,75 Euro Steuer',
  nahe(knappDarueber.steuerGesamt, 52.75, 1e-6),
  knappDarueber.steuerGesamt.toFixed(2)
)

console.log('\n— Teilfreistellung —')

const aktienfonds = berechneSteuer({
  ertrag: 10_000,
  fondsart: 'aktienfonds',
  freibetrag: 0,
  kirchensteuersatz: 0,
})
pruefe(
  'bei einem Aktienfonds bleiben 3.000 Euro steuerfrei',
  nahe(aktienfonds.teilfreigestellt, 3000)
)
pruefe('besteuert werden 7.000 Euro', nahe(aktienfonds.bemessungsgrundlage, 7000))
pruefe(
  'der effektive Satz sinkt damit auf 18,46 Prozent',
  nahe(aktienfonds.effektiverSatz, 0.26375 * 0.7, 1e-9),
  `${(aktienfonds.effektiverSatz * 100).toFixed(2)} %`
)

/*
  Die Reihenfolge ist entscheidend und wird hier festgenagelt: Erst
  Teilfreistellung, dann Freibetrag. Andersherum käme bei kleinen Beträgen zu
  viel Steuer heraus.
*/
const reihenfolge = berechneSteuer({
  ertrag: 1400,
  fondsart: 'aktienfonds',
  freibetrag: 1000,
  kirchensteuersatz: 0,
})
pruefe(
  'erst Teilfreistellung, dann Freibetrag: 1.400 Euro Aktienfondsertrag bleiben steuerfrei',
  reihenfolge.steuerGesamt === 0,
  `${reihenfolge.steuerGesamt.toFixed(2)} €`
)

console.log('\n— Vorabpauschale —')

const thesaurierend = berechneVorabpauschale({
  wertJahresbeginn: 10_000,
  wertJahresende: 11_000,
  ausschuettung: 0,
  basiszins: 0.0253,
})
pruefe(
  'der Basisertrag sind 70 Prozent des Basiszinses',
  nahe(thesaurierend.basisertrag, 10_000 * 0.0253 * 0.7),
  thesaurierend.basisertrag.toFixed(2)
)
pruefe(
  'bei 1.000 Euro Wertzuwachs greift die Begrenzung nicht',
  nahe(thesaurierend.vorabpauschale, 177.1, 1e-6),
  thesaurierend.vorabpauschale.toFixed(2)
)

const gefallen = berechneVorabpauschale({
  wertJahresbeginn: 10_000,
  wertJahresende: 9_000,
  ausschuettung: 0,
  basiszins: 0.0253,
})
pruefe('bei Wertverlust gibt es keine Vorabpauschale', gefallen.vorabpauschale === 0)
pruefe('und der Grund wird benannt', gefallen.grund === 'wertverlust')

const kaumGestiegen = berechneVorabpauschale({
  wertJahresbeginn: 10_000,
  wertJahresende: 10_050,
  ausschuettung: 0,
  basiszins: 0.0253,
})
pruefe(
  'der Basisertrag wird auf den Wertzuwachs begrenzt',
  nahe(kaumGestiegen.vorabpauschale, 50),
  kaumGestiegen.vorabpauschale.toFixed(2)
)

const ausschuettend = berechneVorabpauschale({
  wertJahresbeginn: 10_000,
  wertJahresende: 11_000,
  ausschuettung: 300,
  basiszins: 0.0253,
})
pruefe(
  'Ausschüttungen über dem Basisertrag lassen nichts übrig',
  ausschuettend.vorabpauschale === 0
)
pruefe(
  'und auch dieser Grund wird benannt',
  ausschuettend.grund === 'ausschuettungGedeckt'
)

const teilweise = berechneVorabpauschale({
  wertJahresbeginn: 10_000,
  wertJahresende: 11_000,
  ausschuettung: 100,
  basiszins: 0.0253,
})
pruefe(
  'kleinere Ausschüttungen werden abgezogen',
  nahe(teilweise.vorabpauschale, 77.1, 1e-6),
  teilweise.vorabpauschale.toFixed(2)
)

console.log('\n— Was nicht schiefgehen darf —')

const negativ = berechneSteuer({
  ertrag: -5000,
  fondsart: 'sonstige',
  freibetrag: 1000,
  kirchensteuersatz: 0,
})
pruefe('ein Verlust ergibt keine negative Steuer', negativ.steuerGesamt === 0)
pruefe('und verbraucht keinen Freibetrag', negativ.freibetragRest === 1000)

const ohneErtrag = berechneSteuer({
  ertrag: 0,
  fondsart: 'aktienfonds',
  freibetrag: 1000,
  kirchensteuersatz: 0.09,
})
pruefe(
  'ohne Ertrag ist der effektive Satz null und nicht NaN',
  ohneErtrag.effektiverSatz === 0
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
