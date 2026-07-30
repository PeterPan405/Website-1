/**
 * Prüfungen für die Auswertung der Dividendenreihen.
 *
 * Der Fehler, um den es hier geht, ist eine Zahl, die plausibel aussieht und
 * falsch ist: eine Rendite von 1,2 Prozent, weil von vier Quartalszahlungen
 * nur zwei in den Zeitraum fielen, oder ein erwarteter Termin, der sich mit
 * jedem Quartal weiter vom tatsächlichen entfernt. Beides fällt beim Ansehen
 * der Website nicht auf.
 */

import { rhythmusLabel, werteDividenden, type Zahlung } from '../lib/dividenden.ts'

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

const HEUTE = '2026-07-30'

/** Baut eine Reihe mit festem Abstand, jüngste Zahlung zuletzt. */
function reihe(
  letzterTag: string,
  abstand: number,
  anzahl: number,
  betrag: number
): Zahlung[] {
  const tage: Zahlung[] = []
  let zeit = Date.parse(`${letzterTag}T00:00:00Z`)
  for (let i = 0; i < anzahl; i += 1) {
    tage.push({ date: new Date(zeit).toISOString().slice(0, 10), amount: betrag })
    zeit -= abstand * 86400000
  }
  return tage.reverse()
}

console.log('\n— Rhythmus —')

const quartal = reihe('2026-05-08', 91, 12, 0.25)
const q = werteDividenden(quartal, 100, HEUTE)
pruefe(
  'vier Zahlungen im Jahr gelten als vierteljährlich',
  q?.rhythmus === 'quartalsweise',
  String(q?.rhythmus)
)
pruefe(
  'halbjährlich wird erkannt',
  werteDividenden(reihe('2026-06-01', 182, 6, 1), 100, HEUTE)?.rhythmus ===
    'halbjaehrlich'
)
pruefe(
  'jährlich wird erkannt',
  werteDividenden(reihe('2026-05-20', 365, 4, 3), 100, HEUTE)?.rhythmus === 'jaehrlich'
)
pruefe(
  'monatlich wird erkannt',
  werteDividenden(reihe('2026-07-01', 30, 24, 0.1), 100, HEUTE)?.rhythmus === 'monatlich'
)

/*
  Eine einzelne Zahlung ist kein Muster. Wer daraus einen Rhythmus ableitet,
  behauptet mehr, als die Daten hergeben.
*/
pruefe(
  'eine einzige Zahlung ergibt keinen Rhythmus',
  werteDividenden([{ date: '2026-03-02', amount: 2 }], 100, HEUTE)?.rhythmus ===
    'unregelmaessig'
)
pruefe(
  'und dann auch keinen erwarteten Termin',
  werteDividenden([{ date: '2026-03-02', amount: 2 }], 100, HEUTE)?.naechsterErwartet ===
    null
)
pruefe('ohne jede Zahlung kommt nichts zurück', werteDividenden([], 100, HEUTE) === null)

console.log('\n— Rendite —')

pruefe(
  'vier Quartalszahlungen von 0,25 bei Kurs 100 sind ein Prozent',
  Math.abs((q?.renditeProzent ?? 0) - 1) < 1e-9,
  String(q?.renditeProzent)
)
pruefe(
  'die Summe der zwölf Monate steht daneben',
  Math.abs((q?.summeZwoelfMonate ?? 0) - 1) < 1e-9
)
pruefe('und wie viele Zahlungen darin stecken', q?.zahlungenZwoelfMonate === 4)

/*
  Der Kern dieser Prüfung: Liegen nur zwei von vier Quartalszahlungen im
  Zeitraum – etwa weil ein Unternehmen erst vor einem halben Jahr mit der
  Ausschüttung begonnen hat –, dann ist die Summe unvollständig. Eine daraus
  gebildete Rendite wäre halb so groß und sähe trotzdem aus wie eine
  Eigenschaft der Aktie.
*/
const halbesJahr = werteDividenden(reihe('2026-06-15', 91, 2, 0.25), 100, HEUTE)
pruefe(
  'bei unvollständigem Jahr gibt es keine Rendite',
  halbesJahr?.renditeProzent === null,
  String(halbesJahr?.renditeProzent)
)
pruefe(
  'die Summe steht aber trotzdem da',
  Math.abs((halbesJahr?.summeZwoelfMonate ?? 0) - 0.5) < 1e-9
)
pruefe(
  'ohne Kurs keine Rendite',
  werteDividenden(quartal, null, HEUTE)?.renditeProzent === null
)
pruefe(
  'mit Kurs null keine Rendite',
  werteDividenden(quartal, 0, HEUTE)?.renditeProzent === null
)

/*
  Die Einheit kürzt sich heraus. Ein britischer Titel steht in Pence, seine
  Dividende auch – die Rendite ist deshalb dieselbe wie in Pfund gerechnet.
  Genau hier liegt der Unterschied zu Kurs-Gewinn- und Kurs-Buchwert-
  Verhältnis, wo die Bilanz in Pfund und der Kurs in Pence steht.
*/
const inPence = werteDividenden(reihe('2026-05-08', 91, 8, 25), 10000, HEUTE)
pruefe(
  'in Pence gerechnet ergibt dieselbe Rendite wie in Pfund',
  Math.abs((inPence?.renditeProzent ?? 0) - (q?.renditeProzent ?? 0)) < 1e-9,
  `${inPence?.renditeProzent} gegen ${q?.renditeProzent}`
)

console.log('\n— Erwarteter nächster Termin —')

pruefe(
  'er liegt in der Zukunft',
  (q?.naechsterErwartet ?? '') > HEUTE,
  String(q?.naechsterErwartet)
)
pruefe(
  'bei vierteljährlicher Zahlung etwa ein Quartal nach der letzten',
  q?.naechsterErwartet === '2026-08-07',
  String(q?.naechsterErwartet)
)
pruefe('die Grundlage der Schätzung wird genannt', Boolean(q?.schaetzungBasis))

/*
  Eine Reihe, deren letzte Zahlung lange zurückliegt, darf keinen Termin in
  der Vergangenheit ausgeben – sonst stünde im Kalender ein Datum, das schon
  vorbei ist, und der Leser hielte es für einen versäumten Termin.
*/
const alt = werteDividenden(reihe('2024-03-01', 91, 8, 0.25), 100, HEUTE)
pruefe(
  'auch bei alter Reihe liegt der geschätzte Termin in der Zukunft',
  (alt?.naechsterErwartet ?? '') > HEUTE,
  String(alt?.naechsterErwartet)
)

console.log('\n— Streuung und Beschriftung —')

pruefe('bei festem Abstand ist die Streuung null', q?.streuungTage === 0)
const schwankend: Zahlung[] = [
  { date: '2025-02-10', amount: 1 },
  { date: '2025-05-20', amount: 1 },
  { date: '2025-08-12', amount: 1 },
  { date: '2025-11-25', amount: 1 },
  { date: '2026-02-09', amount: 1 },
  { date: '2026-05-18', amount: 1 },
]
const s = werteDividenden(schwankend, 200, HEUTE)
pruefe(
  'bei schwankenden Abständen wird die Streuung ausgewiesen',
  (s?.streuungTage ?? 0) > 0,
  String(s?.streuungTage)
)
pruefe(
  'jeder Rhythmus hat eine deutsche Beschriftung',
  Object.values(rhythmusLabel).every((l) => l.length > 3)
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
