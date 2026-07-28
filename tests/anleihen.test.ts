/**
 * Prüfungen für die Anleiherechnung.
 *
 * Die Zahlen in `lib/anleihen.ts` landen ungeprüft im Lerntext. Ein
 * Vorzeichenfehler bei der Duration wäre dort nicht auffällig – er sähe aus
 * wie eine Aussage über den Markt. Deshalb hier die Stellen, an denen sich
 * eine falsche Formel verrät:
 *
 * - Steht der Marktzins genau auf dem Kupon, muss der Kurs exakt 100 sein.
 * - Bei einer Nullkuponanleihe ist die Macaulay-Duration exakt die Laufzeit.
 * - Die Konvexität hat ein festes Vorzeichen: Der tatsächliche Kurs liegt
 *   immer über dem, was die lineare Näherung vorhersagt – in beide
 *   Richtungen der Zinsänderung.
 */

import {
  kurs,
  macaulayDuration,
  modifizierteDuration,
  zinsschock,
} from '../lib/anleihen.ts'

let failed = 0

function nahe(name: string, actual: number, expected: number, toleranz = 1e-9) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

console.log('\n— Kurs bei Marktzins gleich Kupon —')
for (const jahre of [1, 5, 10, 30]) {
  nahe(
    `${jahre} Jahre, 3 % Kupon, 3 % Marktzins → 100`,
    kurs({ kuponProzent: 3, jahre }, 3),
    100,
    1e-9
  )
}

console.log('\n— Kurs über und unter pari —')
wahr('niedriger Marktzins → Kurs über 100', kurs({ kuponProzent: 4, jahre: 10 }, 2) > 100)
wahr('hoher Marktzins → Kurs unter 100', kurs({ kuponProzent: 4, jahre: 10 }, 6) < 100)

console.log('\n— Einzelwerte von Hand nachgerechnet —')
// Ein Jahr Restlaufzeit, 5 % Kupon, 10 % Marktzins: 105 / 1,1 = 95,4545…
nahe('1 Jahr, 5 % Kupon, 10 % Zins', kurs({ kuponProzent: 5, jahre: 1 }, 10), 105 / 1.1)
// Zwei Jahre, 0 % Kupon, 10 % Marktzins: 100 / 1,21
nahe('2 Jahre, Nullkupon, 10 % Zins', kurs({ kuponProzent: 0, jahre: 2 }, 10), 100 / 1.21)

console.log('\n— Duration —')
for (const jahre of [1, 5, 20]) {
  nahe(
    `Nullkupon über ${jahre} Jahre → Duration ${jahre}`,
    macaulayDuration({ kuponProzent: 0, jahre }, 3),
    jahre,
    1e-9
  )
}
wahr(
  'Kupon zieht die Duration unter die Laufzeit',
  macaulayDuration({ kuponProzent: 5, jahre: 10 }, 3) < 10
)
wahr(
  'höherer Kupon → kürzere Duration',
  macaulayDuration({ kuponProzent: 8, jahre: 10 }, 3) <
    macaulayDuration({ kuponProzent: 2, jahre: 10 }, 3)
)
wahr(
  'modifizierte Duration liegt unter der Macaulay-Duration',
  modifizierteDuration({ kuponProzent: 4, jahre: 10 }, 3) <
    macaulayDuration({ kuponProzent: 4, jahre: 10 }, 3)
)

console.log('\n— Zinsschock und Konvexität —')
const anleihe = { kuponProzent: 2, jahre: 10 }

const hoch = zinsschock(anleihe, 2, 1)
wahr('Zins steigt → Kurs fällt', hoch.tatsaechlichProzent < 0)
wahr('Näherung übertreibt den Verlust', hoch.tatsaechlichProzent > hoch.genaehertProzent)

const runter = zinsschock(anleihe, 2, -1)
wahr('Zins fällt → Kurs steigt', runter.tatsaechlichProzent > 0)
wahr(
  'Näherung untertreibt den Gewinn',
  runter.tatsaechlichProzent > runter.genaehertProzent
)

const gross = zinsschock(anleihe, 2, 4)
wahr(
  'bei großen Sprüngen wird die Abweichung größer',
  Math.abs(gross.tatsaechlichProzent - gross.genaehertProzent) >
    Math.abs(hoch.tatsaechlichProzent - hoch.genaehertProzent)
)

console.log('\n— Ausgangskurs —')
nahe('Kupon gleich Marktzins → vorher 100', zinsschock(anleihe, 2, 1).vorher, 100, 1e-9)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
