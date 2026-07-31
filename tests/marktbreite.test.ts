/**
 * Prüfungen für die Aufzeichnung der Marktbreite.
 *
 * Zwei Fehler wären hier teuer und beide unauffällig: eine zweite Zeile für
 * denselben Tag – der Kursabruf läuft zweiundvierzigmal täglich – und eine
 * Einordnung, die aus drei Tagen einen Maßstab macht.
 */

import {
  einordnungssatz,
  fuegeEin,
  median,
  nurZusammenhaengend,
  ordneBreiteEin,
  serialisiereBreite,
  type Breitenpunkt,
} from '../lib/marktbreite.ts'

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

function punkt(d: string, breite: number): Breitenpunkt {
  return { d, steigend: 500, fallend: 500, unveraendert: 29, schnitt: 0.1, breite }
}

/** Eine Reihe mit fortlaufenden Tagen und den mitgegebenen Breiten. */
function reihe(breiten: number[]): Breitenpunkt[] {
  return breiten.map((breite, index) =>
    punkt(`2026-01-${String(index + 1).padStart(2, '0')}`, breite)
  )
}

console.log('\n— Eintragen —')

pruefe(
  'ein leerer Bestand nimmt den ersten Punkt',
  fuegeEin([], punkt('2026-01-05', 50)).length === 1
)

/*
  Der wichtigste Fall: Der Kursabruf laeuft alle dreissig Minuten. Wuerde jeder
  Lauf eine Zeile anhaengen, staenden nach einem Handelstag zweiundvierzig
  Zeilen fuer denselben Tag im Bestand — und der Median waere danach der Median
  eines einzigen Tages.
*/
{
  const nachher = fuegeEin(reihe([40, 50]), punkt('2026-01-02', 77))
  pruefe('derselbe Tag ersetzt statt ergaenzt', nachher.length === 2)
  pruefe('und zwar mit dem neuen Wert', nachher[1].breite === 77)
}

pruefe(
  'die Reihe bleibt sortiert',
  fuegeEin(reihe([40, 50]), punkt('2025-12-31', 60))[0].d === '2025-12-31'
)

pruefe(
  'aeltere Tage fallen ueber der Hoechstzahl heraus',
  fuegeEin(reihe([1, 2, 3]), punkt('2026-02-01', 9), 2).length === 2
)
pruefe(
  'und zwar die aeltesten',
  fuegeEin(reihe([1, 2, 3]), punkt('2026-02-01', 9), 2)[0].d === '2026-01-03'
)

console.log('\n— Zusammenhaengender Teil —')

/*
  Der echte Fall, an dem das aufgefallen ist: Die Nachrechnung aus der
  Kurshistorie lieferte einen einzelnen Tag im August 2021 — den Rand der
  Momentaufnahme, wo der letzte woechentliche Punkt zufaellig an einen
  benachbarten Handelstag grenzt. Richtig gerechnet und trotzdem irrefuehrend:
  In einer Linie neben den Tagen der letzten Monate legt er einen Verlauf ueber
  vier Jahre nahe, den es nicht gibt.
*/
{
  const mitInsel: Breitenpunkt[] = [
    punkt('2021-08-02', 62),
    punkt('2026-06-25', 48),
    punkt('2026-06-26', 51),
  ]
  const gefiltert = nurZusammenhaengend(mitInsel)
  pruefe('die Insel faellt heraus', gefiltert.length === 2)
  pruefe('der Rest bleibt', gefiltert[0].d === '2026-06-25')
}

pruefe(
  'eine luecklose Reihe bleibt vollstaendig',
  nurZusammenhaengend(reihe([40, 50, 60])).length === 3
)
/*
  Ein Wochenende ist keine Luecke. Freitag auf Montag sind drei Tage; wer
  daran schneidet, zerlegt jede Reihe in Wochen.
*/
pruefe(
  'ein Wochenende trennt nicht',
  nurZusammenhaengend([punkt('2026-06-26', 50), punkt('2026-06-29', 52)]).length === 2
)
pruefe('leere Reihe bleibt leer', nurZusammenhaengend([]).length === 0)

console.log('\n— Median —')

pruefe('bei ungerader Anzahl der mittlere', median([1, 5, 9]) === 5)
pruefe('bei gerader das Mittel der beiden', median([1, 3, 5, 9]) === 4)
pruefe('unsortierte Eingabe stoert nicht', median([9, 1, 5]) === 5)
pruefe('leere Reihe ergibt null', median([]) === null)

console.log('\n— Einordnung —')

/*
  Kein Massstab aus drei Tagen. Ein Median aus drei Zahlen ist die mittlere von
  dreien; ihn als „Median der letzten Handelstage“ auszugeben, waere genau die
  Sorte Zahl, die diese Website nicht ausgibt.
*/
pruefe(
  'unter der Mindestzahl gibt es keine Einordnung',
  ordneBreiteEin(reihe([40, 50, 60]), 55) === null
)

{
  const werte = Array.from({ length: 40 }, (_, index) => 30 + index)
  const befund = ordneBreiteEin(reihe(werte), 69)
  pruefe('ab genug Tagen kommt eine Einordnung', befund !== null)
  pruefe('mit der Zahl der Tage', befund?.tage === 40)
  pruefe('mit dem niedrigsten Wert', befund?.niedrigster === 30)
  pruefe('mit dem hoechsten', befund?.hoechster === 69)
  pruefe('und dem Rang', Math.round(befund?.rangProzent ?? -1) === 98)
}

{
  const befund = ordneBreiteEin(reihe(Array.from({ length: 30 }, () => 50)), 50)
  pruefe('bei lauter gleichen Werten ist der Rang null', befund?.rangProzent === 0)
  pruefe('und der Median der Wert selbst', befund?.median === 50)
}

console.log('\n— Der Satz dazu —')

pruefe(
  'ohne Geschichte sagt der Satz genau das',
  einordnungssatz(null).includes('reicht die Aufzeichnung noch nicht')
)

{
  const hoch = ordneBreiteEin(reihe(Array.from({ length: 30 }, (_, i) => 20 + i)), 95)
  pruefe(
    'ein hoher Wert wird als breit getragen beschrieben',
    einordnungssatz(hoch).includes('Breiter getragen')
  )
}
{
  const tief = ordneBreiteEin(reihe(Array.from({ length: 30 }, (_, i) => 20 + i)), 5)
  pruefe('ein tiefer als geteilt', einordnungssatz(tief).includes('Geteilter'))
}
/*
  Und dazwischen keine Wertung. „Der Markt ist gesund“ liesse sich aus dieser
  Zahl nicht ableiten — der Satz nennt deshalb nur Median und Spanne.
*/
{
  const mitte = ordneBreiteEin(reihe(Array.from({ length: 30 }, (_, i) => 20 + i)), 35)
  const satz = einordnungssatz(mitte)
  pruefe('dazwischen steht der Median', satz.includes('Median'))
  pruefe('und keine Wertung', !/gesund|schwach|gut|schlecht/i.test(satz))
}

console.log('\n— Schreibweise —')

{
  const text = serialisiereBreite({
    abgerufenAm: '2026-07-30T12:00:00Z',
    reihe: reihe([40, 50]),
  })
  pruefe(
    'eine Zeile je Tag',
    text.split('\n').filter((z) => z.includes('"d"')).length === 2
  )
  pruefe(
    'gueltiges JSON',
    (() => {
      try {
        return JSON.parse(text).reihe.length === 2
      } catch {
        return false
      }
    })()
  )
  pruefe('mit Zeitstempel', text.includes('2026-07-30T12:00:00Z'))
}

pruefe(
  'auch leer gueltig',
  (() => {
    try {
      return (
        JSON.parse(serialisiereBreite({ abgerufenAm: null, reihe: [] })).reihe.length ===
        0
      )
    } catch {
      return false
    }
  })()
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
