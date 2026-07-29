/**
 * Prüfungen für die Kostenrechnung.
 *
 * Die Rechnung ist eine Zinseszinsformel mit einem zweiten Prozentsatz, und
 * genau darin liegt die Fehlerquelle: Ein Vorzeichen oder ein vergessener
 * Klammerausdruck liefert kein Fehlschlagen, sondern eine Zahl in derselben
 * Größenordnung. Geprüft wird deshalb gegen Verhältnisse, die von Hand
 * nachvollziehbar sind.
 */

import { nettorendite, vergleiche, verlauf } from '../lib/kosten.ts'

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

function nahe(a: number, b: number, toleranz: number): boolean {
  return Math.abs(a - b) < toleranz
}

console.log('\n— Die Nettorendite —')

/*
  Mit Toleranz und nicht mit `===`: (1 + 0,07) × 1 − 1 ergibt in Fliesskomma
  0,07000000000000006. Ein Vergleich auf Gleichheit hätte hier einen Fehler
  gemeldet, wo keiner ist – und beim nächsten Mal denselben ignoriert.
*/
pruefe('ohne Kosten bleibt die Bruttorendite', nahe(nettorendite(0.07, 0), 0.07, 1e-12))
pruefe(
  '7 Prozent brutto und 1,5 Prozent Kosten ergeben 5,395 Prozent',
  nahe(nettorendite(0.07, 0.015), 0.05395, 1e-9),
  String(nettorendite(0.07, 0.015))
)
/*
  Der Punkt, um den es geht: Die verbreitete Näherung „brutto minus Kosten“
  ergäbe 5,5 Prozent. Sie liegt zu hoch, weil die Gebühr auch auf den
  Wertzuwachs des Jahres erhoben wird.
*/
pruefe(
  'die Näherung brutto minus Kosten liegt zu hoch',
  nettorendite(0.07, 0.015) < 0.07 - 0.015
)

console.log('\n— Der Verlauf —')

const ohneZeit = verlauf({
  einmalanlage: 1000,
  sparrate: 100,
  jahre: 0,
  bruttorendite: 0.07,
  kostenquote: 0.002,
})
pruefe('ohne Laufzeit bleibt die Einmalanlage stehen', ohneZeit.endwert === 1000)
pruefe('und es fallen keine Gebühren an', ohneZeit.gebuehren === 0)

const ohneRendite = verlauf({
  einmalanlage: 1000,
  sparrate: 100,
  jahre: 10,
  bruttorendite: 0,
  kostenquote: 0,
})
pruefe(
  'ohne Rendite und ohne Kosten ist der Endwert die Summe der Einzahlungen',
  nahe(ohneRendite.endwert, 1000 + 100 * 120, 1e-6),
  String(ohneRendite.endwert)
)
pruefe('und die Einzahlung wird richtig gezählt', ohneRendite.eingezahlt === 13000)

const mitRendite = verlauf({
  einmalanlage: 10000,
  sparrate: 0,
  jahre: 10,
  bruttorendite: 0.07,
  kostenquote: 0,
})
pruefe(
  '10.000 Euro zu 7 Prozent werden in zehn Jahren zu 19.672 Euro',
  nahe(mitRendite.endwert, 10000 * 1.07 ** 10, 1e-6),
  String(Math.round(mitRendite.endwert))
)

console.log('\n— Der Vergleich —')

const dreissig = vergleiche(
  { einmalanlage: 0, sparrate: 250, jahre: 30, bruttorendite: 0.07 },
  0.002,
  0.015
)

pruefe(
  'die günstige Anlage endet höher',
  dreissig.guenstig.endwert > dreissig.teuer.endwert
)
pruefe(
  'beide zahlen dieselbe Summe ein',
  dreissig.guenstig.eingezahlt === dreissig.teuer.eingezahlt
)
pruefe(
  'der Unterschied ist die Differenz der Endwerte',
  nahe(dreissig.unterschied, dreissig.guenstig.endwert - dreissig.teuer.endwert, 1e-9)
)

/*
  Die Zahl, um derentwillen der Rechner existiert: 1,3 Prozentpunkte mehr
  Kosten fressen über dreissig Jahre rund ein Fünftel des Endvermögens. Die
  Grenzen sind weit gesetzt – geprüft wird die Größenordnung, nicht die
  Nachkommastelle.
*/
pruefe(
  'der Unterschied liegt zwischen 15 und 30 Prozent des Endvermögens',
  dreissig.anteil > 0.15 && dreissig.anteil < 0.3,
  `${(dreissig.anteil * 100).toFixed(1)} %`
)

pruefe(
  'die Gebühren enthalten den entgangenen Zinsertrag und sind grösser als die reine Entnahme',
  dreissig.teuer.gebuehren > dreissig.teuer.eingezahlt * 0.015 * 30
)

console.log('\n— Was nicht schiefgehen darf —')

const gleich = vergleiche(
  { einmalanlage: 5000, sparrate: 100, jahre: 20, bruttorendite: 0.06 },
  0.005,
  0.005
)
pruefe('gleiche Kosten ergeben keinen Unterschied', nahe(gleich.unterschied, 0, 1e-9))
pruefe('und einen Anteil von null', nahe(gleich.anteil, 0, 1e-12))

const negativ = verlauf({
  einmalanlage: -100,
  sparrate: -50,
  jahre: 10,
  bruttorendite: 0.05,
  kostenquote: 0.01,
})
pruefe('negative Eingaben werden nicht zu negativem Vermögen', negativ.endwert === 0)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
