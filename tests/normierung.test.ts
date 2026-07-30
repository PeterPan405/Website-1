/**
 * Prüfungen für die Normierung zweier Kursreihen.
 *
 * Der Fehler, den es zu verhindern gilt, sieht aus wie ein Vergleich und ist
 * keiner: Zwei Reihen, die jeweils bei ihrem eigenen ersten Punkt auf 100
 * gesetzt werden, decken verschiedene Zeiträume ab. Die Kurve sähe richtig
 * aus, und die Aussage wäre falsch.
 */

import { leseKursCsv, normiere, spanne, type Kurspunkt } from '../lib/normierung.ts'

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

function reihe(paare: [string, number][]): Kurspunkt[] {
  return paare.map(([t, value]) => ({ t, value }))
}

/*
  Gleitkommazahlen. 220 / 200 * 100 ergibt 110.00000000000001 — ein Vergleich
  auf Gleichheit scheitert daran, und das ist kein Fehler der Normierung,
  sondern der binaeren Darstellung. Verglichen wird deshalb mit Toleranz.
*/
function ungefaehr(wert: number | undefined, soll: number): boolean {
  return wert !== undefined && Math.abs(wert - soll) < 1e-9
}

console.log('\n— Normieren —')

{
  const ergebnis = normiere(
    reihe([
      ['2026-01-01', 200],
      ['2026-01-02', 220],
    ]),
    reihe([
      ['2026-01-01', 50],
      ['2026-01-02', 45],
    ])
  )
  pruefe(
    'beide beginnen bei 100',
    ergebnis?.links[0].value === 100 && ergebnis?.rechts[0].value === 100
  )
  pruefe('plus zehn Prozent', ungefaehr(ergebnis?.links[1].value, 110))
  pruefe('minus zehn Prozent', ungefaehr(ergebnis?.rechts[1].value, 90))
  pruefe('der Anfangstag wird mitgegeben', ergebnis?.ab === '2026-01-01')
}

/*
  Der Kern: Zwei Reihen beginnen selten am selben Tag. Normiert wird auf den
  ersten Tag, den BEIDE haben — sonst vergleicht man verschiedene Zeitraeume
  und nennt es einen Vergleich.
*/
{
  const ergebnis = normiere(
    reihe([
      ['2021-01-01', 10],
      ['2026-01-01', 100],
      ['2026-01-02', 110],
    ]),
    reihe([
      ['2026-01-01', 50],
      ['2026-01-02', 60],
    ])
  )
  pruefe('der spaetere Anfang gewinnt', ergebnis?.ab === '2026-01-01')
  pruefe('die aeltere Reihe wird beschnitten', ergebnis?.links.length === 2)
  pruefe(
    'und ab dort auf 100 gesetzt',
    ungefaehr(ergebnis?.links[0].value, 100) && ungefaehr(ergebnis?.links[1].value, 110)
  )
  /*
    Ohne diese Regel haette die linke Reihe bei 10 begonnen und stuende am Ende
    bei 1.100 — ein Zuwachs von tausend Prozent gegen zwanzig. Beide Zahlen
    waeren richtig gerechnet und die Gegenueberstellung trotzdem sinnlos.
  */
}

console.log('\n— Was nicht geht —')

pruefe(
  'ohne Ueberschneidung kommt null',
  normiere(reihe([['2020-01-01', 5]]), reihe([['2026-01-01', 5]])) === null
)
pruefe('leere Reihe links', normiere([], reihe([['2026-01-01', 5]])) === null)
pruefe('leere Reihe rechts', normiere(reihe([['2026-01-01', 5]]), []) === null)
/*
  Ein Startwert von null ergaebe eine Division durch null und damit Infinity —
  im Diagramm eine senkrechte Linie, die sichtbar falsch ist, aber erst,
  nachdem sie jemandem auffaellt.
*/
pruefe(
  'ein Startwert von null ergibt null',
  normiere(
    reihe([
      ['2026-01-01', 0],
      ['2026-01-02', 5],
    ]),
    reihe([['2026-01-01', 5]])
  ) === null
)
pruefe(
  'ein negativer Startwert auch',
  normiere(reihe([['2026-01-01', -5]]), reihe([['2026-01-01', 5]])) === null
)

console.log('\n— Spanne —')

{
  const ergebnis = normiere(
    reihe([
      ['2026-01-01', 100],
      ['2026-01-02', 130],
    ]),
    reihe([
      ['2026-01-01', 100],
      ['2026-01-02', 80],
    ])
  )!
  const grenzen = spanne(ergebnis)
  pruefe('das Minimum kommt aus beiden Reihen', grenzen.min === 80)
  pruefe('das Maximum ebenso', grenzen.max === 130)
}

console.log('\n— CSV lesen —')

{
  const csv = [
    '# DAX (Deutscher Aktienindex) (DAX)',
    '# Einheit: Punkte',
    'Datum;Schlusskurs',
    '2026-01-01;15544.39',
    '2026-01-02;15600',
    '',
  ].join('\n')
  const punkte = leseKursCsv(csv)
  pruefe('der Kopfkommentar faellt heraus', punkte.length === 2)
  pruefe('die Ueberschriftenzeile auch', punkte[0].t === '2026-01-01')
  pruefe('mit Dezimalpunkt', punkte[0].value === 15544.39)
}

/*
  Kaputte Zeilen werden uebersprungen, nicht als Nullwert gelesen. Ein
  Kurspunkt von 0 zoege die Kurve auf die Grundlinie — sichtbar, aber erst
  nachdem es jemandem auffaellt.
*/
pruefe(
  'kaputte Zeilen werden uebersprungen',
  leseKursCsv('2026-01-01;abc\n2026-01-02;5').length === 1
)
pruefe('leerer Text ergibt nichts', leseKursCsv('').length === 0)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
