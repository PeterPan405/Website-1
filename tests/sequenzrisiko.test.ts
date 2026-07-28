/**
 * Prüfungen für das Sequenzrisiko.
 *
 * Die zentrale Behauptung des Lerntexts lautet: Ohne Entnahme ist die
 * Reihenfolge der Renditejahre gleichgültig, mit Entnahme entscheidet sie über
 * das Ergebnis. Beide Hälften werden hier geprüft – die erste, weil sie sonst
 * nur behauptet wäre, die zweite, weil sie die Grafik im Thema trägt.
 *
 * Der heikelste Fall ist das leergelaufene Depot: Eine Rechnung, die ins
 * Negative läuft, sieht in einer Tabelle plausibel aus und beschreibt einen
 * Zustand, den es nicht gibt.
 */

import {
  entnahmeverlauf,
  mittlereRendite,
  reihenfolgevergleich,
} from '../lib/sequenzrisiko.ts'

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

console.log('— Ohne Entnahme ist die Reihenfolge gleichgültig —')
{
  const renditen = [20, -10, 8, -25, 15]
  const vorwaerts = entnahmeverlauf(100_000, renditen, 0).endwert
  const rueckwaerts = entnahmeverlauf(100_000, [...renditen].reverse(), 0).endwert
  // Multiplikation ist kommutativ – ohne Entnahme muss dasselbe herauskommen.
  nahe('vorwärts und rückwärts ergeben dasselbe', vorwaerts, rueckwaerts, 1e-6)
}

console.log('\n— Mit Entnahme entscheidet sie —')
{
  const renditen = [20, -10, 8, -25, 15]
  const vergleich = reihenfolgevergleich(100_000, renditen, 6_000)
  wahr(
    'gute Jahre zuerst lassen mehr übrig',
    vergleich.gutZuerst.endwert > vergleich.schlechtZuerst.endwert
  )
  wahr('der Unterschied ist positiv', vergleich.unterschied > 0)
  // Die mittlere Rendite ist in beiden Fällen dieselbe Zahl – das ist der Punkt.
  nahe(
    'die mittlere Rendite hängt nicht an der Reihenfolge',
    mittlereRendite(renditen),
    mittlereRendite([...renditen].reverse()),
    1e-12
  )
}

console.log('\n— Die Rechnung im Einzelnen —')
{
  // 100.000, ein Jahr plus zehn Prozent, dann 10.000 entnommen: 100.000 übrig.
  const ergebnis = entnahmeverlauf(100_000, [10], 10_000)
  nahe('erst Rendite, dann Entnahme', ergebnis.endwert, 100_000, 1e-9)
  nahe('das Entnommene wird mitgezählt', ergebnis.entnommen, 10_000, 1e-9)
  wahr('das Depot ist nicht erschöpft', ergebnis.erschoepftImJahr === null)
}

console.log('\n— Das leergelaufene Depot —')
{
  const ergebnis = entnahmeverlauf(10_000, [0, 0, 0], 6_000)
  wahr(
    'der Wert wird nie negativ',
    ergebnis.verlauf.every((z) => z.wert >= 0)
  )
  nahe('am Ende steht null', ergebnis.endwert, 0, 1e-9)
  wahr('das Erschöpfungsjahr wird gemeldet', ergebnis.erschoepftImJahr === 2)
  // Entnommen wurde nur, was da war – nicht die volle Rate im zweiten Jahr.
  nahe('entnommen wurde nur das Vorhandene', ergebnis.entnommen, 10_000, 1e-9)
}

console.log('\n— Die mittlere Rendite —')
{
  // Plus 50 und minus 50 Prozent: arithmetisch null, geometrisch deutlich darunter.
  nahe(
    'plus und minus 50 heben sich nicht auf',
    mittlereRendite([50, -50]),
    -13.397459621556138,
    1e-9
  )
  nahe('gleichbleibende Rendite bleibt sie selbst', mittlereRendite([7, 7, 7]), 7, 1e-9)
  nahe('eine leere Reihe ergibt null', mittlereRendite([]), 0, 1e-12)
  // Ein Totalverlust lässt sich nicht mitteln – die Reihe endet bei minus hundert.
  nahe('ein Totalverlust ergibt minus hundert', mittlereRendite([-100, 50]), -100, 1e-12)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
