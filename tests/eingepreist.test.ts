/**
 * Prüfungen für die umgekehrte Bewertung.
 *
 * Kern ist der Rundlauf: Ein angenommenes Wachstum ergibt ein KGV, und die
 * Umkehrung muss aus diesem KGV dasselbe Wachstum zurückgewinnen. Dazu die
 * Ränder, an denen das Modell ehrlich aufgeben muss.
 */

import { gerechtfertigtesKgv, implizitesWachstum } from '../lib/eingepreist.ts'

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

const standard = { jahre: 10, abzinsungProzent: 8, endKgv: 15 }

// Von Hand: g=0, r=8 %, n=10 → Rentenbarwertfaktor 6,7101, Endwert 15/1,08^10 = 6,9483.
const ohneWachstum = gerechtfertigtesKgv(0, standard)
pruefe(
  'ohne Wachstum: Rentenbarwertfaktor plus abgezinster Endwert',
  Math.abs(ohneWachstum - (6.7101 + 6.9483)) < 0.001,
  `kgv=${ohneWachstum}`
)

// Wachstum gleich Abzinsung: jeder Summand ist genau 1, der Endwert ungekürzt.
const gleichauf = gerechtfertigtesKgv(8, standard)
pruefe(
  'Wachstum gleich Abzinsung: Jahre plus End-KGV',
  Math.abs(gleichauf - 25) < 1e-9,
  `kgv=${gleichauf}`
)

pruefe(
  'mehr Wachstum rechtfertigt immer ein höheres KGV',
  gerechtfertigtesKgv(5, standard) < gerechtfertigtesKgv(6, standard)
)

for (const wachstum of [-10, 0, 4.2, 12, 25]) {
  const kgv = gerechtfertigtesKgv(wachstum, standard)
  const zurueck = implizitesWachstum(kgv, standard)
  pruefe(
    `Rundlauf bei ${wachstum} % Wachstum`,
    zurueck !== null && Math.abs(zurueck - wachstum) < 1e-6,
    `zurueck=${zurueck}`
  )
}

pruefe('KGV null: keine Antwort', implizitesWachstum(0, standard) === null)
pruefe('negatives KGV: keine Antwort', implizitesWachstum(-5, standard) === null)
pruefe(
  'ein KGV unterhalb des Modells: null statt Rand',
  implizitesWachstum(0.05, standard) === null
)
pruefe(
  'ein absurdes KGV oberhalb des Modells: null statt Rand',
  implizitesWachstum(100000, standard) === null
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
