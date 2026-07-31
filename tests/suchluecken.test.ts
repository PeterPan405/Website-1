/**
 * Prüfungen für das Protokoll erfolgloser Suchen.
 *
 * Ausführen mit `npm test`.
 *
 * Der Fall, der hier zählt, ist das Tippen: Jede Vorsilbe einer erfolgreichen
 * Suche ist unterwegs eine erfolglose. Ein Protokoll, das das nicht aufräumt,
 * besteht zu neun Zehnteln aus Bruchstücken – und sieht dabei völlig in
 * Ordnung aus, weil jeder einzelne Eintrag stimmt.
 */

import {
  HOECHSTZAHL,
  alsText,
  aufzeichenswert,
  entferneVorsilben,
  gesamtzahl,
  raeumeAuf,
  vereinheitliche,
  zaehle,
  type Suchluecke,
} from '../lib/suchluecken.ts'

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

/* ------------------------------------------------------- Vereinheitlichung */

check('Leerraum am Rand fällt weg', vereinheitliche('  Rürup  '), 'rürup')
check('mehrfacher Leerraum wird einer', vereinheitliche('etf   sparplan'), 'etf sparplan')
check(
  'Umlaute bleiben Umlaute – anders als in der Suche selbst',
  vereinheitliche('Rürup'),
  'rürup'
)

check('zwei Zeichen sind zu kurz', aufzeichenswert('et'), false)
check('drei Zeichen reichen', aufzeichenswert('etf'), true)
check('nur Leerraum ist nichts', aufzeichenswert('   '), false)
check('ein ganzer Absatz ist zu lang', aufzeichenswert('x'.repeat(81)), false)
check('achtzig Zeichen sind gerade noch erlaubt', aufzeichenswert('x'.repeat(80)), true)

/* -------------------------------------------------------------- Zählen */

const t1 = new Date('2026-07-01T10:00:00Z')
const t2 = new Date('2026-07-02T10:00:00Z')

let p: Suchluecke[] = []
p = zaehle(p, 'rürup', t1)
check('der erste Eintrag', p, [
  { anfrage: 'rürup', anzahl: 1, zuletzt: t1.toISOString() },
])

p = zaehle(p, 'Rürup ', t2)
check('dieselbe Anfrage zählt hoch statt sich zu verdoppeln', p, [
  { anfrage: 'rürup', anzahl: 2, zuletzt: t2.toISOString() },
])

p = zaehle(p, 'et', t2)
check('zu Kurzes wird nicht aufgenommen', p.length, 1)

p = zaehle(p, 'wohnriester', t2)
check(
  'häufigste zuerst',
  p.map((e) => e.anfrage),
  ['rürup', 'wohnriester']
)

const p3 = zaehle(zaehle(p, 'wohnriester', t2), 'wohnriester', t2)
check(
  'die Rangfolge folgt der Anzahl',
  p3.map((e) => `${e.anfrage}:${e.anzahl}`),
  ['wohnriester:3', 'rürup:2']
)

check('Gesamtzahl zählt die Suchen, nicht die Einträge', gesamtzahl(p3), 5)

/* Die Höchstzahl greift und wirft das Seltenste heraus. */
let voll: Suchluecke[] = []
for (let i = 0; i < HOECHSTZAHL + 5; i += 1) {
  voll = zaehle(voll, `anfrage-${String(i).padStart(3, '0')}`, t1)
}
check('die Liste bleibt begrenzt', voll.length, HOECHSTZAHL)

const mitHaeufiger = zaehle(zaehle(voll, 'anfrage-000', t2), 'anfrage-000', t2)
check('die häufigste überlebt das Aussortieren', mitHaeufiger[0].anfrage, 'anfrage-000')
check('und die Liste bleibt trotzdem begrenzt', mitHaeufiger.length, HOECHSTZAHL)

/* ----------------------------------------------------------- Vorsilben */

const beimTippen = ['nes', 'nest', 'nestl', 'test'].reduce<Suchluecke[]>(
  (liste, wort) => zaehle(liste, wort, t1),
  []
)

check(
  'ein Treffer räumt die Vorsilben weg, aber nicht das gleich lange Fremdwort',
  entferneVorsilben(beimTippen, 'Nestlé ').map((e) => e.anfrage),
  ['test']
)
check(
  'die vollständige Anfrage selbst bleibt, wenn sie protokolliert ist',
  entferneVorsilben(zaehle([], 'nestle', t1), 'nestle').map((e) => e.anfrage),
  ['nestle']
)
check(
  'eine leere Eingabe räumt nichts weg',
  entferneVorsilben(beimTippen, '  ').length,
  4
)

/* ------------------------------------------------------------ Aufräumen */

const alt: Suchluecke[] = [
  { anfrage: 'gestern', anzahl: 4, zuletzt: '2026-07-30T10:00:00Z' },
  { anfrage: 'vorvorjahr', anzahl: 9, zuletzt: '2024-01-05T10:00:00Z' },
  { anfrage: 'kaputt', anzahl: 2, zuletzt: 'kein Datum' },
]
check(
  'nur Frisches bleibt, Unlesbares fliegt mit',
  raeumeAuf(alt, new Date('2026-07-31T10:00:00Z')).map((e) => e.anfrage),
  ['gestern']
)

/* --------------------------------------------------------------- Ausgabe */

check('der Text ist Zeile für Zeile lesbar', alsText(p3), '  3× wohnriester\n  2× rürup')
check('ein leeres Protokoll ergibt leeren Text', alsText([]), '')

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
