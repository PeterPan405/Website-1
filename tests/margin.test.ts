/**
 * Prüfungen für die tägliche Abrechnung eines Terminkontrakts.
 *
 * Drei Dinge sind hier heikel:
 *
 * 1. **Der Eröffnungstag.** Die erste Zahl der Kursreihe beschreibt den Stand
 *    bei Eröffnung, keine Bewegung. Wer sie mitrechnet, lässt das Konto am
 *    ersten Tag bereits neben dem Ersteinschuss stehen.
 * 2. **Der Margin Call bleibt stehen.** Fällt das Konto unter die Grenze und
 *    steigt danach wieder darüber, war der Margin Call trotzdem. Die Position
 *    ist zu diesem Zeitpunkt geschlossen; ein späteres Erholen macht das nicht
 *    rückgängig. Genau darin liegt die Aussage der Grafik.
 * 3. **Kein Margin Call ist nicht dasselbe wie einer am letzten Tag.** Deshalb
 *    `null` und nicht die letzte Nummer.
 */

import { marginverlauf } from '../lib/margin.ts'

let failed = 0

function gleich(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${JSON.stringify(expected)}\n     erhalten ${JSON.stringify(actual)}`}`
  )
}

function nahe(name: string, actual: number, expected: number, toleranz = 0.5) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : ` – erwartet ${expected}, erhalten ${actual}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

console.log('— Der Eröffnungstag —')
{
  const { tage } = marginverlauf(100_000, 10, 7, [0, 0, 0])
  nahe('Ersteinschuss steht am ersten Tag', tage[0].konto, 10_000)
  nahe('ohne Bewegung bleibt er stehen', tage[2].konto, 10_000)
  gleich('Kurs startet bei 100', tage[0].kurs, 100)
}
{
  // Auch wenn die erste Zahl nicht null ist, wird sie nicht abgerechnet.
  const { tage } = marginverlauf(100_000, 10, 7, [-5, 0])
  nahe('die erste Zahl bewegt das Konto nicht', tage[1].konto, 10_000)
}

console.log('\n— Die Abrechnung —')
{
  const { tage } = marginverlauf(100_000, 10, 7, [0, -1, -1])
  // Ein Prozent auf 100.000 sind 1.000 Euro – zweimal.
  nahe('ein Prozent kostet ein Prozent des Kontraktwerts', tage[1].konto, 9_000)
  nahe('und noch einmal am nächsten Tag', tage[2].konto, 8_010, 5)
  nahe('der Kurs folgt der Reihe', tage[2].kurs, 98.01, 0.01)
}
{
  const { tage } = marginverlauf(100_000, 10, 7, [0, 2])
  nahe('Gewinne werden gutgeschrieben', tage[1].konto, 12_000)
}

console.log('\n— Der Margin Call —')
{
  const { margincall } = marginverlauf(100_000, 10, 7, [0, -1, -1, -1, -1])
  // Nach drei Prozent steht das Konto bei rund 7.030, nach vier bei rund 6.100.
  gleich('fällt am vierten Tag unter die Grenze', margincall, 4)
}
{
  const { margincall } = marginverlauf(100_000, 10, 7, [0, -1, -1])
  gleich('ohne Unterschreitung ist er null', margincall, null)
}
{
  const verlauf = marginverlauf(100_000, 10, 7, [0, -4, 5, 5])
  gleich('einmal ausgelöst, bleibt er stehen', verlauf.margincall, 1)
  wahr(
    'der Verlauf wird trotzdem weitergerechnet',
    verlauf.tage.length === 4 && verlauf.tage[3].konto > 10_000
  )
}
{
  // Die Grenze ist ein Unterschreiten, kein Erreichen.
  const genau = marginverlauf(100_000, 10, 7, [0, -3])
  gleich('genau auf der Grenze ist kein Margin Call', genau.margincall, null)
}

console.log('\n— Die Reihe —')
{
  const { tage } = marginverlauf(50_000, 20, 10, [0, -1, 1])
  gleich('ein Eintrag je Kursänderung', tage.length, 3)
  gleich(
    'die Tage sind durchnummeriert',
    tage.map((t) => t.tag),
    [0, 1, 2]
  )
  nahe('der Ersteinschuss folgt dem Kontraktwert', tage[0].konto, 10_000)
}
{
  const leer = marginverlauf(100_000, 10, 7, [])
  gleich('eine leere Reihe ergibt keine Tage', leer.tage.length, 0)
  gleich('und keinen Margin Call', leer.margincall, null)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
