/**
 * Die Lage eines Kurses in seiner Zwölfmonatsspanne.
 *
 * ## Was hier geprüft wird – und warum gerade das
 *
 * Nicht, dass eine Division funktioniert. Sondern die drei Stellen, an denen
 * diese Rechnung eine Aussage über echte Daten macht, die schiefgehen kann:
 *
 * 1. **Die Vorzeichen.** `abstandHoch` darf nie positiv werden, `abstandTief`
 *    nie negativ. Das hängt an einer Zusicherung von `computeQuoteFigures()`
 *    (der angezeigte Kurs zählt beim Bilden von Hoch und Tief mit). Fiele die
 *    weg, stünde auf der Seite „+3 % Abstand zum Hoch" – eine Angabe, die
 *    ihrem eigenen Wort widerspricht. Geprüft wird deshalb gegen den **echten
 *    Bestand**, nicht gegen erfundene Zahlen.
 *
 * 2. **Die Lücke.** Ein Instrument mit genau einem bekannten Kurs hat
 *    Hoch = Tief, und die Position wäre 0/0. Sie muss `null` sein und darf
 *    nicht als „100 % – am Jahreshoch" durchgehen.
 *
 * 3. **Die Sortierung mit Lücken.** `null` in einem Zahlenvergleich ergibt
 *    `NaN`, und `NaN` heißt „weder kleiner noch größer". Eine Sortierung, die
 *    das nicht abfängt, ist nicht falsch sortiert, sondern **zufällig**
 *    sortiert – und das fällt bei zwanzig Zeilen niemandem auf.
 */

import { getQuotes } from '@/lib/markets'
import {
  abstandZumHoch,
  abstandZumTief,
  jahresspanne,
  sortiereSpanne,
  spannenPosition,
  spannenwert,
  type Spannenwert,
} from '@/lib/jahresspanne'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------------------ Die Rechnung */

pruefen(
  'Am Jahreshoch ist der Abstand null',
  abstandZumHoch({ value: 100, high52w: 100 }) === 0
)

pruefen(
  'Zehn Prozent unter dem Hoch sind −10',
  Math.abs(abstandZumHoch({ value: 90, high52w: 100 }) - -10) < 1e-9
)

pruefen(
  'Am Jahrestief ist der Abstand null',
  abstandZumTief({ value: 50, low52w: 50 }) === 0
)

pruefen(
  'Achtzig Prozent über dem Tief sind +80',
  Math.abs(abstandZumTief({ value: 90, low52w: 50 }) - 80) < 1e-9
)

/*
  Das Beispiel aus dem Kopf von `lib/jahresspanne.ts`: zwei Titel mit
  demselben Abstand zum Hoch und sehr verschiedener Lage in der Spanne. Steht
  es im Text, gehört es geprüft – sonst veraltet die Begründung still.
*/
const eng = { value: 90, high52w: 100, low52w: 85 }
const weit = { value: 90, high52w: 100, low52w: 50 }

pruefen(
  'Gleicher Abstand zum Hoch bei beiden Beispielen',
  Math.abs(abstandZumHoch(eng) - abstandZumHoch(weit)) < 1e-9
)
pruefen(
  'Enge Spanne: Position im unteren Drittel (33 %)',
  Math.abs((spannenPosition(eng) ?? -1) - (100 * 5) / 15) < 1e-9
)
pruefen(
  'Weite Spanne: Position im oberen Fünftel (80 %)',
  Math.abs((spannenPosition(weit) ?? -1) - 80) < 1e-9
)

/* --------------------------------------------------------------- Die Lücke */

pruefen(
  'Hoch gleich Tief ergibt keine Position, sondern null',
  spannenPosition({ value: 42, high52w: 42, low52w: 42 }) === null,
  'Ein Wert mit einem einzigen bekannten Kurs stünde sonst „am Jahreshoch".'
)

pruefen(
  'Ein Hoch von null ergibt 0 statt Unendlich',
  Number.isFinite(abstandZumHoch({ value: 0, high52w: 0 }))
)

/* ------------------------------------------- Die Vorzeichen am echten Stand */

const quotes = await getQuotes()

pruefen(
  `Der Bestand liefert Kurse (${quotes.length})`,
  quotes.length > 20,
  'Ohne Material prüft der Rest dieser Datei nichts.'
)

const werte = jahresspanne(quotes)

const ueberHoch = werte.filter((w) => w.abstandHoch > 1e-9)
pruefen(
  'Kein Kurs steht über seinem Jahreshoch',
  ueberHoch.length === 0,
  ueberHoch
    .slice(0, 3)
    .map((w) => `${w.name}: ${w.value} > ${w.high52w}`)
    .join('\n     ')
)

const unterTief = werte.filter((w) => w.abstandTief < -1e-9)
pruefen(
  'Kein Kurs steht unter seinem Jahrestief',
  unterTief.length === 0,
  unterTief
    .slice(0, 3)
    .map((w) => `${w.name}: ${w.value} < ${w.low52w}`)
    .join('\n     ')
)

const ausserhalb = werte.filter(
  (w) => w.position !== null && (w.position < 0 || w.position > 100)
)
pruefen(
  'Jede Position liegt zwischen 0 und 100',
  ausserhalb.length === 0,
  ausserhalb
    .slice(0, 3)
    .map((w) => `${w.name}: ${w.position}`)
    .join('\n     ')
)

/*
  Die Gegenprobe zur Gegenprobe.

  Die drei Prüfungen oben können nur greifen, wenn im Bestand überhaupt Werte
  vorkommen, die nicht am Hoch kleben. Wären alle Abstände exakt null, wären
  sie erfüllt und hätten nichts gezeigt.
*/
const bewegt = werte.filter((w) => w.abstandHoch < -0.5)
pruefen(
  `Es gibt Werte mit echtem Abstand zum Hoch (${bewegt.length} von ${werte.length})`,
  bewegt.length > 5,
  'Sonst prüfen die Vorzeichenproben an lauter Nullen vorbei.'
)

/* ---------------------------------------------------------- Die Sortierung */

pruefen(
  'Voreinstellung: der Wert am nächsten am Hoch steht oben',
  werte.length > 1 && werte[0].abstandHoch >= werte[werte.length - 1].abstandHoch
)

const nachHoch = sortiereSpanne(werte, 'abstandHoch', 'asc')
pruefen(
  'Aufsteigend sortiert steigt der Abstand monoton',
  nachHoch.every((w, i) => i === 0 || nachHoch[i - 1].abstandHoch <= w.abstandHoch)
)

/*
  Lücken hinten – in beiden Richtungen.

  Der Bestand hat heute womöglich keinen Wert ohne Spanne; darauf darf sich
  diese Prüfung nicht verlassen. Sie legt sich das Material deshalb selbst
  hin, damit sie beanstanden **muss**, wenn die Behandlung von `null` wegfällt.
*/
function beispiel(name: string, position: number | null): Spannenwert {
  return {
    ...spannenwert(quotes[0]),
    name,
    symbol: name,
    position,
  }
}

const mitLuecken = [
  beispiel('Ohne Spanne A', null),
  beispiel('Mit 10', 10),
  beispiel('Ohne Spanne B', null),
  beispiel('Mit 90', 90),
]

for (const richtung of ['asc', 'desc'] as const) {
  const sortiert = sortiereSpanne(mitLuecken, 'position', richtung)
  const letzteZwei = sortiert.slice(-2).every((w) => w.position === null)
  pruefen(
    `Sortierung nach Position (${richtung}): Lücken stehen hinten`,
    letzteZwei,
    sortiert.map((w) => `${w.name} → ${w.position}`).join(', ')
  )
}

pruefen(
  'Sortierung nach Position (asc): 10 vor 90',
  sortiereSpanne(mitLuecken, 'position', 'asc')[0].position === 10
)
pruefen(
  'Sortierung nach Position (desc): 90 vor 10',
  sortiereSpanne(mitLuecken, 'position', 'desc')[0].position === 90
)

pruefen(
  'Sortierung nach Namen ist umkehrbar',
  sortiereSpanne(werte, 'name', 'asc')[0].name ===
    sortiereSpanne(werte, 'name', 'desc')[werte.length - 1].name
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
