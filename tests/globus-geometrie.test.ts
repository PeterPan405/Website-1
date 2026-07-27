/**
 * Prüfungen für die Rechnung hinter dem Globus.
 *
 * Vier Fälle stehen hier, weil sie in einer Kugelansicht besonders leicht
 * durchrutschen: das Umkippen am Pol, das Vorzeichen beim Anspringen eines
 * Landes, der Weg über die Datumsgrenze – und die Farbklasse für ein Land
 * ohne Daten. Der letzte ist der folgenreichste: Landet „keine Angabe“ in der
 * untersten Klasse, sieht ein Land ohne Daten aus wie ein Land ohne
 * Wirtschaft, und niemand sieht der Karte an, dass sie lügt.
 */

import {
  MAX_NEIGUNG,
  MAX_ZOOM,
  MIN_ZOOM,
  ZUG_GRAD_JE_RADIUS,
  drehungNachZug,
  drehungZu,
  drehungZwischen,
  kuerzesteStrecke,
  normalisiereLaenge,
  quantilsgrenzen,
  stufeFuer,
  weich,
  zoomSchritt,
} from '../lib/globus-geometrie.ts'

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

// ---------------------------------------------------------------- Drehung

/*
  Die Kugel klebt am Zeiger – beide Achsen ziehen mit, keine dagegen.

  Der zweite Fall ist der, den ein Nutzer gemeldet hat: Nach unten zu ziehen
  drehte den Globus nach oben. Waagerecht stimmte es, senkrecht nicht.
*/
check(
  'Ziehen nach rechts dreht nach Osten',
  drehungNachZug({ lambda: 0, phi: 0 }, 100, 0, 100).lambda,
  ZUG_GRAD_JE_RADIUS
)
check(
  'Ziehen nach unten blickt weiter nach Norden',
  drehungNachZug({ lambda: 0, phi: 0 }, 0, 100, 100).phi,
  ZUG_GRAD_JE_RADIUS
)
check(
  'Ziehen nach oben blickt weiter nach Süden',
  drehungNachZug({ lambda: 0, phi: 0 }, 0, -100, 100).phi,
  -ZUG_GRAD_JE_RADIUS
)
/*
  Beide Achsen müssen bei gleichem Weg gleich weit drehen. Ein Unterschied
  fühlt sich beim schrägen Ziehen an, als würde die Kugel wegrutschen.
*/
check(
  'beide Achsen drehen bei gleichem Weg gleich weit',
  Math.abs(drehungNachZug({ lambda: 0, phi: 0 }, 70, 0, 200).lambda),
  Math.abs(drehungNachZug({ lambda: 0, phi: 0 }, 0, 70, 200).phi)
)
/*
  Die Empfindlichkeit selbst: Ein Zug über den ganzen Radius darf die Kugel
  nicht herumreißen. Physikalisch genau wären 90 Grad, gewollt sind weniger.
*/
check(
  'ein Zug über den ganzen Radius dreht spürbar weniger als eine Vierteldrehung',
  ZUG_GRAD_JE_RADIUS < 90,
  true
)
check(
  'aber genug, um die Kugel in zwei Zügen herumzudrehen',
  ZUG_GRAD_JE_RADIUS * 2 >= 90,
  true
)
check(
  'die Neigung kippt nicht über den Pol',
  drehungNachZug({ lambda: 0, phi: 80 }, 0, 400, 180).phi,
  MAX_NEIGUNG
)
check(
  'auch nach unten nicht',
  drehungNachZug({ lambda: 0, phi: -80 }, 0, -400, 180).phi,
  -MAX_NEIGUNG
)
/*
  Derselbe Weg in Pixeln muss bei jedem Radius dieselbe Strecke auf der Kugel
  bedeuten. Sonst fühlt sich das Ziehen auf jeder Zoomstufe anders an.
*/
check(
  'ein doppelt so großer Globus dreht bei gleichem Weg halb so weit',
  drehungNachZug({ lambda: 0, phi: 0 }, 90, 0, 360).lambda,
  drehungNachZug({ lambda: 0, phi: 0 }, 45, 0, 180).lambda
)

check('Längengrade bleiben zwischen -180 und 180', normalisiereLaenge(540), -180)
check('auch negativ', normalisiereLaenge(-190), 170)

// ------------------------------------------------------------ Land anspringen

/*
  Das Vorzeichen: Um Berlin (13° Ost) nach vorn zu holen, muss die Kugel um
  13 Grad nach Westen gedreht werden.
*/
check('ein östlicher Punkt braucht eine negative Drehung', drehungZu(13, 52).lambda, -13)
check('die Breite wird übernommen', drehungZu(13, 52).phi, 52)
check('eine unmögliche Breite wird begrenzt', drehungZu(0, 120).phi, MAX_NEIGUNG)

check('kürzeste Strecke geht über die Datumsgrenze', kuerzesteStrecke(170, -170), 20)
check('und nicht einmal herum', kuerzesteStrecke(-170, 170), -20)

check(
  'die Zwischenposition nimmt denselben kurzen Weg',
  drehungZwischen({ lambda: 170, phi: 0 }, { lambda: -170, phi: 0 }, 0.5).lambda,
  180 - 360
)
check(
  'bei Anteil 0 steht die Startdrehung',
  drehungZwischen({ lambda: 30, phi: 10 }, { lambda: 90, phi: 40 }, 0),
  {
    lambda: 30,
    phi: 10,
  }
)

check('die Beschleunigung beginnt bei null', weich(0), 0)
check('und endet bei eins', weich(1), 1)
check('die Mitte liegt in der Mitte', weich(0.5), 0.5)

// -------------------------------------------------------------------- Zoom

check('Zoom bleibt oben begrenzt', zoomSchritt(MAX_ZOOM, 4), MAX_ZOOM)
check('und unten', zoomSchritt(MIN_ZOOM, 0.1), MIN_ZOOM)
check('ein Schritt wirkt multiplikativ', zoomSchritt(2, 1.5), 3)

// ---------------------------------------------------------------- Farbskala

const werte = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

check(
  'Quantile liefern höchstens stufen − 1 Grenzen',
  quantilsgrenzen(werte, 5).length,
  4
)
check('die Grenzen steigen streng', quantilsgrenzen(werte, 5), [2, 4, 6, 8])
check('ohne Werte gibt es keine Grenzen', quantilsgrenzen([], 5), [])
check(
  'bei lauter gleichen Werten gibt es keine Grenze',
  quantilsgrenzen([7, 7, 7, 7], 5),
  []
)

/*
  Der Fall, der auf der fertigen Seite aufgefallen ist.

  Bei der Kennzahl „Kurse auf dieser Seite“ haben 163 von 177 Ländern den Wert
  null. Mit reinen Quantilen lagen alle vier Grenzen bei null, und weil eine
  Grenze als erreicht gilt, sobald der Wert sie nicht unterschreitet, landeten
  diese 163 Länder in der höchsten Klasse: Die Karte behauptete, fast überall
  gäbe es besonders viele Kurse.
*/
const meistNull = [...Array(163).fill(0), 1, 1, 2, 2, 3, 3, 3, 4, 5, 6, 24, 59]
const grenzenNull = quantilsgrenzen(meistNull, 5)
check(
  'die Mehrheitsklasse verschiebt die Grenzen nicht auf null',
  grenzenNull[0] > 0,
  true
)
check('null bleibt in der untersten Klasse', stufeFuer(0, grenzenNull), 0)
check('der größte Wert steht oben', stufeFuer(59, grenzenNull), grenzenNull.length)
check(
  'kein Land ohne Kurse landet oben',
  meistNull
    .filter((wert) => wert === 0)
    .every((wert) => stufeFuer(wert, grenzenNull) === 0),
  true
)

/*
  Der Fall, um den es hier eigentlich geht: Eine Verteilung, in der ein Land
  zwanzigtausendmal so groß ist wie das kleinste. Gleich breite Klassen würden
  alle bis auf zwei Länder in die unterste legen.
*/
const schief = [1, 2, 3, 4, 5, 6, 7, 8, 5_000, 20_000]
const grenzenSchief = quantilsgrenzen(schief, 5)
const besetzung = [0, 1, 2, 3, 4].map(
  (stufe) => schief.filter((wert) => stufeFuer(wert, grenzenSchief) === stufe).length
)
check(
  'bei schiefer Verteilung bleibt jede Klasse besetzt',
  besetzung.every((anzahl) => anzahl > 0),
  true
)

check('ein Wert unter der ersten Grenze liegt in Klasse 0', stufeFuer(1, [3, 5, 7, 9]), 0)
check('ein Wert auf einer Grenze zählt zur höheren Klasse', stufeFuer(5, [3, 5, 7, 9]), 2)
check('der größte Wert liegt in der obersten Klasse', stufeFuer(99, [3, 5, 7, 9]), 4)

// Der wichtigste Fall der Datei.
check('null ist keine Klasse, sondern -1', stufeFuer(null, [3, 5, 7, 9]), -1)
check('undefined ebenso', stufeFuer(undefined, [3, 5, 7, 9]), -1)
check('NaN ebenso', stufeFuer(Number.NaN, [3, 5, 7, 9]), -1)
check('eine Null als echter Wert bleibt Klasse 0', stufeFuer(0, [3, 5, 7, 9]), 0)

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
process.exit(failed === 0 ? 0 : 1)
