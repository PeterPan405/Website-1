/**
 * Prüfungen für die Vorbelegung der Rechner aus der Adresse.
 *
 * Ausführen mit `npm test`.
 *
 * Die Adresse kommt von außen. Geprüft wird deshalb vor allem, was passiert,
 * wenn darin Unsinn steht: `NaN` breitet sich durch jede Rechnung aus, bis
 * irgendwo „–“ erscheint, und eine Laufzeit von einer Milliarde Jahren
 * blockiert den Browserstrang. Beides sieht man dem Aufruf nicht an.
 */

import {
  leseAuswahl,
  leseRaute,
  leseZahl,
  rechnerlink,
} from '../lib/rechner-vorbelegung.ts'

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

/* ------------------------------------------------------------------ Raute */

check('mit Raute davor', leseRaute('#a=1&b=2'), { a: '1', b: '2' })
check('ohne Raute davor', leseRaute('a=1&b=2'), { a: '1', b: '2' })
check('leere Raute', leseRaute('#'), {})
check('leere Zeichenkette', leseRaute(''), {})
check('ein Anker ohne Gleichheitszeichen wird übergangen', leseRaute('#land-360'), {})
check('leerer Wert bleibt leer', leseRaute('#a='), { a: '' })
check('Prozentfolgen werden aufgelöst', leseRaute('#name=A%20B'), { name: 'A B' })
check('ein Gleichheitszeichen im Wert bleibt darin', leseRaute('#formel=a=b'), {
  formel: 'a=b',
})
check(
  'eine kaputte Prozentfolge verwirft nur ihr eigenes Paar',
  leseRaute('#gut=1&kaputt=%E0%A4%A&auch=2'),
  { gut: '1', auch: '2' }
)

/* ------------------------------------------------------------------ Zahlen */

const grenzen = { min: 0, max: 100 }

check('eine normale Zahl', leseZahl('42', 7, grenzen), 42)
check('fehlender Wert ergibt die Vorgabe', leseZahl(undefined, 7, grenzen), 7)
check('leerer Wert ergibt die Vorgabe', leseZahl('   ', 7, grenzen), 7)
check('Buchstaben ergeben die Vorgabe', leseZahl('abc', 7, grenzen), 7)
check('NaN kommt nicht durch', Number.isNaN(leseZahl('abc', 7, grenzen)), false)
check('Unendlich kommt nicht durch', leseZahl('Infinity', 7, grenzen), 7)
check('Komma zählt als Dezimaltrennzeichen', leseZahl('5,5', 7, grenzen), 5.5)
check('Punkt auch', leseZahl('5.5', 7, grenzen), 5.5)
check('zu groß wird beschnitten, nicht verworfen', leseZahl('1e9', 7, grenzen), 100)
check('zu klein wird beschnitten', leseZahl('-40', 7, grenzen), 0)
check(
  'ganzzahlige Felder runden',
  leseZahl('24,6', 7, { min: 1, max: 50, ganzzahl: true }),
  25
)
check(
  'und beschneiden vor dem Runden',
  leseZahl('999', 7, { min: 1, max: 50, ganzzahl: true }),
  50
)

/* ---------------------------------------------------------------- Auswahl */

const arten = ['monatlich', 'jaehrlich'] as const
check('bekannte Auswahl', leseAuswahl('jaehrlich', 'monatlich', arten), 'jaehrlich')
check('unbekannte Auswahl', leseAuswahl('taeglich', 'monatlich', arten), 'monatlich')
check('fehlende Auswahl', leseAuswahl(undefined, 'monatlich', arten), 'monatlich')

/* ------------------------------------------------------------------ Links */

check(
  'ein Link mit Werten',
  rechnerlink('/rechner/zinsrechner', { start: 5000, zins: 6 }),
  '/rechner/zinsrechner#start=5000&zins=6'
)
check(
  'ohne Werte bleibt der Pfad nackt',
  rechnerlink('/rechner/zinsrechner', {}),
  '/rechner/zinsrechner'
)
check(
  'leere Werte fallen heraus',
  rechnerlink('/rechner/zinsrechner', { start: 5000, zins: '' }),
  '/rechner/zinsrechner#start=5000'
)
check(
  'Sonderzeichen werden maskiert',
  rechnerlink('/rechner/x', { art: 'a b&c' }),
  '/rechner/x#art=a%20b%26c'
)

/* Hin und zurück – der eigentliche Vertrag zwischen den beiden Funktionen. */
const werte = { start: 5000, zins: 6.5, jahre: 25, art: 'monatlich' }
check(
  'was der Link baut, liest die Raute wieder aus',
  leseRaute(rechnerlink('/rechner/zinsrechner', werte).split('#')[1]),
  { start: '5000', zins: '6.5', jahre: '25', art: 'monatlich' }
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
