/**
 * Prüfungen für Median und Platzierung des Branchenvergleichs.
 */

import { median, platzVon } from '../lib/vergleichsrechnung.ts'

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

pruefe('Median einer leeren Reihe: null', median([]) === null)
pruefe('Median bei ungerader Zahl: die Mitte', median([3, 1, 2]) === 2)
pruefe('Median bei gerader Zahl: Mittel der Mitte', median([4, 1, 2, 3]) === 2.5)
pruefe('ein Ausreißer regiert den Median nicht', median([10, 12, 11, 400]) === 11.5)
pruefe(
  'die Eingabe bleibt unsortiert',
  (() => {
    const reihe = [3, 1, 2]
    median(reihe)
    return reihe.join(',') === '3,1,2'
  })()
)

pruefe('der höchste Wert ist Platz 1', platzVon(9, [9, 5, 7]).platz === 1)
pruefe('der niedrigste Wert ist der letzte Platz', platzVon(5, [9, 5, 7]).platz === 3)
pruefe('„von“ zählt die ganze Reihe', platzVon(7, [9, 5, 7]).von === 3)
pruefe('Gleichstand teilt sich den Platz', platzVon(7, [9, 7, 7, 5]).platz === 2)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
