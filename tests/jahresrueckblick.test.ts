/**
 * Prüfungen für den Jahresrückblick.
 *
 * Ausführen mit `npm test`.
 *
 * Drei Dinge gehen hier erfahrungsgemäß schief, und alle drei liefern eine
 * Zahl, die plausibel aussieht:
 *
 * 1. **Der Bezugspunkt.** Wer vom ersten Kurs des Jahres statt vom letzten des
 *    Vorjahres rechnet, unterschlägt die Kurslücke über den Jahreswechsel.
 * 2. **Der Rückschlag über die Jahresgrenze.** Er muss innerhalb des Jahres
 *    gemessen werden, sonst zählt ein Absturz im Dezember zweimal.
 * 3. **Der Kalendertag eines Artikels.** Über `new Date` verschiebt sich ein
 *    Artikel vom 1. Januar 02:00 Uhr MEZ nach UTC in den 31. Dezember – und
 *    damit in den Rückblick des Vorjahres.
 */

import {
  archivJeMonat,
  bilanzsatz,
  zahlwortDativ,
  archivabdeckung,
  bilanz,
  monatsschritte,
  raender,
  rechenbareJahre,
  tagVon,
  type Archiveintrag,
  type Kurspunkt,
} from '../lib/jahresrueckblick.ts'

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
function nahe(name: string, actual: number, expected: number, toleranz = 1e-6) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

function reihe(werte: [string, number][]): Kurspunkt[] {
  return werte.map(([d, c]) => ({ d, c }))
}

/* ---------------------------------------------------------------- Bilanz */

/*
  Ein Jahr mit einer Kurslücke über den Jahreswechsel: Der letzte Kurs des
  Vorjahres steht bei 100, der erste des Jahres bei 110. Wer vom 110er aus
  rechnet, meldet für dieses Jahr +9,09 statt +20 Prozent.
*/
const mitLuecke = reihe([
  ['2024-12-30', 100],
  ['2025-01-02', 110],
  ['2025-06-30', 130],
  ['2025-09-30', 105],
  ['2025-12-30', 120],
])

const b = bilanz(mitLuecke, 2025)!
check('Bezugspunkt ist der letzte Kurs des Vorjahres', b.basisTag, '2024-12-30')
nahe('… und damit +20 Prozent, nicht +9,09', b.prozent, 20)
check('Ende ist der letzte Kurs im Jahr', b.endeTag, '2025-12-30')
check('Hoch', b.hoch.d, '2025-06-30')
/* Das Tief ist der September mit 105, nicht der Januar mit 110. */
check('Tief', b.tief.d, '2025-09-30')
nahe('größter Rückschlag: 130 auf 105', b.rueckschlag!.prozent, -19.230769, 1e-5)
check('vom Hoch am 30.06.', b.rueckschlag!.vonTag, '2025-06-30')
check('das Jahr reicht bis zum Ende', b.vollesJahr, true)

/*
  Der Rückschlag darf nicht über die Jahresgrenze greifen. Hier fällt der Kurs
  im Dezember 2024 von 200 auf 100 – im Rückblick auf 2025 hat das nichts zu
  suchen, dort beginnt die Messung bei 110.
*/
const absturzDavor = reihe([
  ['2024-12-01', 200],
  ['2024-12-30', 100],
  ['2025-03-31', 110],
  ['2025-06-30', 99],
  ['2025-12-31', 120],
])
const b2 = bilanz(absturzDavor, 2025)!
nahe('der Absturz des Vorjahres zählt nicht mit', b2.rueckschlag!.prozent, -10, 1e-9)
check('gemessen erst ab dem ersten Kurs des Jahres', b2.rueckschlag!.vonTag, '2025-03-31')

/* Ohne Vorjahreskurs gibt es keine Bilanz – und keine geschätzte. */
check(
  'ein Jahr ohne Vorjahresschluss ist nicht rechenbar',
  bilanz(reihe([['2025-01-02', 100]]), 2025),
  null
)
check(
  'ein Jahr ohne eigenen Kurs auch nicht',
  bilanz(reihe([['2024-12-30', 100]]), 2025),
  null
)

/* Ein laufendes Jahr wird als solches gekennzeichnet. */
const laufend = bilanz(
  reihe([
    ['2025-12-30', 100],
    ['2026-07-30', 120],
  ]),
  2026
)!
check('ein Jahr ohne Dezember ist kein volles', laufend.vollesJahr, false)
nahe('die Veränderung steht trotzdem da', laufend.prozent, 20)

/* Die Auflösung: zwölf Punkte in zwölf Monaten sind Wochen-, keine Tageskurse. */
const monatlich = reihe([
  ['2024-12-31', 100],
  ...Array.from(
    { length: 12 },
    (_, i) => [`2025-${String(i + 1).padStart(2, '0')}-28`, 100 + i] as [string, number]
  ),
])
check('ein Punkt je Monat', bilanz(monatlich, 2025)!.punkteJeMonat, 1)

/* ------------------------------------------------------- Monatsschritte */

const schritte = monatsschritte(monatlich, 2025)
check('zwölf Monate', schritte.length, 12)
nahe('der Januar bezieht sich auf den Vorjahresschluss', schritte[0].prozent, 0)
nahe('der Februar auf den Januar', schritte[1].prozent, 1)
const lueckenhaft = monatsschritte(mitLuecke, 2025)
check(
  'Monate ohne Kurs fehlen, statt null zu heißen',
  lueckenhaft.map((s) => s.monat),
  [1, 6, 9, 12]
)
/*
  Einzeln und mit Toleranz verglichen, nicht als JSON: Die Werte entstehen aus
  Divisionen, und 18.181818181818183 gegen 18.181818181818187 ist kein Fehler,
  sondern die letzte Stelle einer Gleitkommazahl.
*/
nahe(
  '… und schließen aneinander an: Juni auf Januar',
  lueckenhaft[1].prozent,
  (130 / 110 - 1) * 100,
  1e-9
)
nahe('September auf Juni', lueckenhaft[2].prozent, (105 / 130 - 1) * 100, 1e-9)
nahe('Dezember auf September', lueckenhaft[3].prozent, (120 / 105 - 1) * 100, 1e-9)

/* --------------------------------------------------- Rechenbare Jahre */

check(
  'das erste Jahr der Reihe fällt heraus – ihm fehlt der Vorjahresschluss',
  rechenbareJahre(
    reihe([
      ['2021-08-02', 1],
      ['2022-01-03', 1],
      ['2023-01-02', 1],
    ])
  ),
  [2023, 2022]
)

/* --------------------------------------------------------------- Archiv */

/*
  Der Fall, um den es geht: 02:00 Uhr am 1. Januar in Mitteleuropa ist nach UTC
  der 31. Dezember, 23:00 Uhr. Über `new Date` landete dieser Artikel im
  Rückblick des Vorjahres.
*/
check(
  'der Kalendertag kommt aus der Zeichenkette',
  tagVon('2026-01-01T02:00:00+01:00'),
  '2026-01-01'
)

const artikel: Archiveintrag[] = [
  { slug: 'a', title: 'A', publishedAt: '2026-07-31T08:00:00+02:00', category: 'Märkte' },
  { slug: 'b', title: 'B', publishedAt: '2026-07-29T09:00:00+02:00', category: 'Märkte' },
  {
    slug: 'c',
    title: 'C',
    publishedAt: '2026-03-02T09:00:00+01:00',
    category: 'Steuern',
  },
  { slug: 'd', title: 'D', publishedAt: '2025-12-31T09:00:00+01:00', category: 'Märkte' },
]

const monate = archivJeMonat(artikel, 2026)
check(
  'nur die Monate mit Artikeln',
  monate.map((m) => m.monat),
  [7, 3]
)
check('jüngster Monat zuerst', monate[0].monat, 7)
check(
  'und im Monat der jüngste Artikel zuerst',
  monate[0].artikel.map((a) => a.slug),
  ['a', 'b']
)
check('das Vorjahr bleibt draußen', archivJeMonat(artikel, 2025).length, 1)

const deckung = archivabdeckung(artikel, 2026, '2026-07-31')
check('zwei Monate mit Artikeln', deckung.monateMitArtikeln, 2)
check('von sieben vergangenen', deckung.monateVergangen, 7)
check('drei Artikel im Jahr', deckung.gesamtzahl, 3)
check('erster Artikeltag', deckung.vonTag, '2026-03-02')
check('letzter', deckung.bisTag, '2026-07-31')

check(
  'ein abgeschlossenes Jahr hat zwölf vergangene Monate',
  archivabdeckung(artikel, 2025, '2026-07-31').monateVergangen,
  12
)
check(
  'ein Jahr ohne Artikel meldet null statt zu fehlen',
  archivabdeckung([], 2026, '2026-07-31'),
  {
    monateMitArtikeln: 0,
    monateVergangen: 7,
    gesamtzahl: 0,
    vonTag: null,
    bisTag: null,
  }
)

/* ----------------------------------------------------------- Bilanzsatz */

check(
  'Plus und Minus',
  bilanzsatz([1, 2, 3, -1, -2]),
  'Von fünf beobachteten Märkten stehen drei im Plus und zwei im Minus.'
)
check(
  'genau null zählt als unverändert, nicht als Plus',
  bilanzsatz([1, 0, -1]),
  'Von drei beobachteten Märkten stehen ein im Plus, ein im Minus und ein unverändert.'
)
check(
  'alle im Plus – kein „und null im Minus"',
  bilanzsatz([1, 2]),
  'Von zwei beobachteten Märkten stehen zwei im Plus.'
)
check(
  'über zwölf werden es Ziffern',
  bilanzsatz(Array.from({ length: 14 }, () => 1)),
  'Von 14 beobachteten Märkten stehen 14 im Plus.'
)
check(
  'ohne Reihen kein Satz über Reihen',
  bilanzsatz([]),
  'Für dieses Jahr liegen keine Kursreihen vor.'
)

check('nur die Eins beugt sich im Dativ', zahlwortDativ(1), 'einem')
check('zwei bleibt zwei', zahlwortDativ(2), 'zwei')
check('und darüber die Ziffer', zahlwortDativ(20), '20')

/* --------------------------------------------------------------- Ränder */

/*
  Drei Titel mit verschiedenen Jahren. „ruhig“ ist der Fall, um den es geht:
  Er endet schwächer als „gerutscht“ und ist trotzdem nicht der Titel mit dem
  tiefsten Rückschlag. Endstand und Weg dorthin sind zwei Fragen – wer sie
  zusammenwirft, meldet für das ruhigste Papier die schlimmste Achterbahn.
*/
const gerutscht = reihe([
  ['2024-12-31', 100],
  ['2025-01-31', 100],
  ['2025-06-30', 40], // −60 Prozent unterwegs, und zwar innerhalb des Jahres
  ['2025-12-31', 105], // am Ende trotzdem im Plus
])
const ruhig = reihe([
  ['2024-12-31', 100],
  ['2025-06-30', 97],
  ['2025-12-31', 95],
])

const r = raender([
  { symbol: 'hoch', bilanz: bilanz(mitLuecke, 2025)! },
  { symbol: 'gerutscht', bilanz: bilanz(gerutscht, 2025)! },
  { symbol: 'ruhig', bilanz: bilanz(ruhig, 2025)! },
])!
check('die stärkste Bewegung', r.staerkste.symbol, 'hoch')
check('die schwächste', r.schwaechste.symbol, 'ruhig')
check('der tiefste Rückschlag ist eine andere Frage', r.tiefster.symbol, 'gerutscht')
check('ohne Bilanzen nichts', raender([]), null)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
