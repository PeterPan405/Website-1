/**
 * Prüfungen für die Geometrie der Lerngrafiken.
 *
 * Eine Grafik hat keinen Fehlerzustand. Sie stürzt nicht ab, sie wirft keine
 * Meldung – sie zeichnet einfach etwas Falsches, und zwar in einer Form, die
 * bis auf die Achsenbeschriftung plausibel aussieht. Die beiden Fälle, die das
 * am ehesten auslösen, stehen deshalb ganz oben: eine y-Achse, die auf dem Kopf
 * steht, und ein Wertebereich der Breite null.
 */

import {
  flaechenpfad,
  linienpfad,
  skaliereX,
  skaliereY,
  teilstriche,
  type Plotflaeche,
} from '../lib/figure-geometry.ts'

let failed = 0

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

const flaeche: Plotflaeche = { links: 60, oben: 20, breite: 400, hoehe: 200 }

// ------------------------------------------------------------------- x-Achse

check('x: der kleinste Wert liegt am linken Rand', skaliereX(0, 0, 40, flaeche), 60)
check('x: der größte Wert liegt am rechten Rand', skaliereX(40, 0, 40, flaeche), 460)
check('x: die Mitte liegt in der Mitte', skaliereX(20, 0, 40, flaeche), 260)
check(
  'x: ein Bereich der Breite null bleibt am linken Rand statt NaN zu liefern',
  skaliereX(5, 5, 5, flaeche),
  60
)

// ------------------------------------------------------------------- y-Achse

/*
  Der wichtigste Fall: SVG zählt y nach unten, das Diagramm nach oben. Der
  größte Wert muss deshalb bei der kleinsten Koordinate landen.
*/
check('y: der größte Wert liegt oben', skaliereY(100, 0, 100, flaeche), 20)
check('y: der kleinste Wert liegt unten', skaliereY(0, 0, 100, flaeche), 220)
check('y: die Mitte liegt in der Mitte', skaliereY(50, 0, 100, flaeche), 120)
check(
  'y: ein Bereich der Breite null bleibt auf der Grundlinie',
  skaliereY(7, 7, 7, flaeche),
  220
)

// -------------------------------------------------------------------- Pfade

check(
  'Linienpfad beginnt mit M und setzt danach L',
  linienpfad([
    { x: 0, y: 10 },
    { x: 5, y: 20 },
    { x: 10, y: 0 },
  ]),
  'M0 10 L5 20 L10 0'
)
check('Linienpfad ohne Punkte ist leer', linienpfad([]), '')
check(
  'Linienpfad rundet auf zwei Nachkommastellen',
  linienpfad([
    { x: 1 / 3, y: 2 / 3 },
    { x: 1, y: 1 },
  ]),
  'M0.33 0.67 L1 1'
)

/*
  Die Fläche muss geschlossen werden. Ohne das abschließende Z füllt der Browser
  die Lücke selbst, und zwar auf dem direkten Weg vom letzten zum ersten Punkt –
  bei einer gekrümmten Linie sichtbar falsch.
*/
check(
  'Flächenpfad führt auf die Grundlinie zurück und schließt',
  flaechenpfad(
    [
      { x: 0, y: 10 },
      { x: 10, y: 4 },
    ],
    50
  ),
  'M0 10 L10 4 L10 50 L0 50 Z'
)

// ------------------------------------------------------------- Teilstriche

check('Teilstriche für 100 in vier Schritten', teilstriche(100, 4), [0, 25, 50, 75, 100])
check('Teilstriche beginnen bei null', teilstriche(102_857, 4)[0], 0)
check(
  'der oberste Teilstrich liegt über dem größten Wert',
  teilstriche(102_857, 4).at(-1)! >= 102_857,
  true
)
check(
  'der oberste Teilstrich ist ein runder Wert',
  teilstriche(102_857, 4).at(-1)! % 1000,
  0
)
check(
  'der Achsenkopf verschwendet höchstens die Hälfte der Höhe',
  teilstriche(102_857, 4).at(-1)! <= 102_857 * 1.5,
  true
)
check('ein Maximum von null ergibt einen einzigen Strich', teilstriche(0), [0])
check(
  'Teilstriche liefern immer anzahl + 1 Werte, weil die Null mitzählt',
  teilstriche(480_000, 5).length,
  6
)

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
process.exit(failed === 0 ? 0 : 1)
