/**
 * Die Tagesfrage – und die Fälle, in denen sie nicht gestellt werden darf.
 *
 * ## Der Fehler, um den es geht
 *
 * Eine Quizfrage aus Marktdaten ist in dem Augenblick wertlos, in dem zwei
 * Antworten gleich gut sind. „Welcher lag vorn?" hat keine richtige Antwort,
 * wenn zwei Werte um 0,41 und 0,42 Prozent gestiegen sind – wer die zweite
 * anklickt, bekommt zu Unrecht „falsch" gesagt, und die angezeigten Zahlen
 * sind auf zwei Nachkommastellen dieselben.
 *
 * Das ist kein Randfall. An einem ruhigen Tag liegen vier Indizes regelmäßig
 * innerhalb weniger Zehntel. Die Prüfungen hier drehen sich deshalb fast alle
 * um das **Verwerfen**, nicht um das Auswählen.
 *
 * ## Was noch geprüft wird
 *
 * - **Determinismus.** Derselbe Tag muss dieselbe Frage ergeben, sonst zeigen
 *   zwei Bauläufe zwei verschiedene „Fragen des Tages".
 * - **Ein Datenstand.** Vier Werte von zwei verschiedenen Handelstagen zu
 *   vergleichen ergibt keine falsch beantwortete Frage, sondern eine falsch
 *   gestellte.
 * - **Die Gegenprobe.** Bei deutlichen Abständen muss eine Frage entstehen –
 *   sonst wäre die Antwort auf alles `null`, und alle Prüfungen oben gingen
 *   durch, ohne etwas zu zeigen.
 */

import {
  ANTWORTEN,
  MINDESTABSTAND,
  frageAus,
  gleicheGattung,
  tagesfrage,
  type Kandidat,
} from '@/lib/tagesfrage'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const STAND = '2026-08-17'

function wert(
  symbol: string,
  changePercent: number,
  extra: Partial<Kandidat> = {}
): Kandidat {
  return {
    symbol,
    name: symbol.toUpperCase(),
    kind: 'index',
    changePercent,
    ytdPercent: 5,
    value: 100,
    high52w: 110,
    asOf: STAND,
    ...extra,
  }
}

/* ------------------------------------------------------ Der deutliche Fall */

const deutlich = [wert('a', 2.4), wert('b', 0.3), wert('c', -0.8), wert('d', -1.5)]
const frage = frageAus(deutlich, 'tagesgewinner')

pruefen('Bei deutlichen Abständen entsteht eine Frage', frage !== null)

if (frage) {
  pruefen('Sie hat vier Antworten', frage.antworten.length === ANTWORTEN)
  pruefen(
    'Die richtige ist die mit dem größten Wert',
    frage.antworten[frage.richtigIndex].symbol === 'a',
    frage.antworten[frage.richtigIndex].symbol
  )
  pruefen(
    'Die Auflösung nennt beide Zahlen',
    frage.aufloesung.includes('2,40') && frage.aufloesung.includes('0,30'),
    `${frage.aufloesung}\n     – ohne den Zweiten ist die Auflösung eine Behauptung.`
  )
  pruefen(
    'Sie nennt den Handelstag der Daten und nicht „gestern“',
    frage.stand === STAND && !frage.frage.includes('gestern'),
    `${frage.stand} / ${frage.frage}`
  )
}

/* ---------------------------------------------------- Der knappe Fall */

console.log('')

/*
  Der Fall, um den es geht. 0,42 gegen 0,41 – in der Anzeige stünde zweimal
  dasselbe, und die zweite Antwort wäre genauso richtig.
*/
pruefen(
  'Zwei fast gleiche Werte ergeben keine Frage',
  frageAus(
    [wert('a', 0.42), wert('b', 0.41), wert('c', -1), wert('d', -2)],
    'tagesgewinner'
  ) === null,
  'Sonst bekommt jemand für die richtige Antwort ein „falsch“ gesagt.'
)

pruefen(
  'Genau am Mindestabstand wird die Frage gestellt',
  frageAus(
    [wert('a', MINDESTABSTAND.tagesgewinner), wert('b', 0), wert('c', -1), wert('d', -2)],
    'tagesgewinner'
  ) !== null,
  'Die Grenze schließt nicht aus, was sie gerade noch erlaubt.'
)

pruefen(
  'Knapp darunter nicht',
  frageAus(
    [
      wert('a', MINDESTABSTAND.tagesgewinner - 0.01),
      wert('b', 0),
      wert('c', -1),
      wert('d', -2),
    ],
    'tagesgewinner'
  ) === null
)

pruefen(
  'Ein Gleichstand ergibt keine Frage',
  frageAus([wert('a', 1), wert('b', 1), wert('c', 0), wert('d', -1)], 'tagesgewinner') ===
    null,
  'Der offensichtliche Fall – und der, den man beim Bauen nie zu sehen bekommt.'
)

/*
  Die Jahresfrage hat einen anderen Maßstab.

  Ein Abstand von 0,4 Prozentpunkten ist bei Tagesbewegungen deutlich und bei
  Jahresrenditen nichts. Ein gemeinsamer Schwellwert wäre für die eine Frage
  zu streng und für die andere zu lasch – und zu lasch ist der gefährlichere
  Fehler.
*/
pruefen(
  'Bei Jahreswerten reicht ein halber Prozentpunkt nicht',
  frageAus(
    [
      wert('a', 0, { ytdPercent: 12.5 }),
      wert('b', 0, { ytdPercent: 12 }),
      wert('c', 0, { ytdPercent: 3 }),
      wert('d', 0, { ytdPercent: -4 }),
    ],
    'jahresbester'
  ) === null,
  `Mindestabstand für Jahreswerte: ${MINDESTABSTAND.jahresbester} Prozentpunkte.`
)

/* -------------------------------------------------- Ein einziger Datenstand */

console.log('')

pruefen(
  'Vier Werte von zwei Handelstagen ergeben keine Frage',
  frageAus(
    [
      wert('a', 2.4),
      wert('b', 0.3),
      wert('c', -0.8, { asOf: '2026-08-14' }),
      wert('d', -1.5),
    ],
    'tagesgewinner'
  ) === null,
  'Das wäre keine falsch beantwortete Frage, sondern eine falsch gestellte.'
)

/*
  Der Fehler, den erst das gebaute HTML zeigte.

  Laufende Kurse tragen einen vollen Zeitstempel, und der unterscheidet sich
  zwischen zwei Abrufen um Sekunden. Beim ersten Anlauf verglich der Riegel
  oben die ganze Zeichenkette – damit war nie eine Frage möglich, der Build war
  grün, und die Startseite hatte still keine Tagesfrage.
*/
pruefen(
  'Zeitstempel derselben Sitzung gelten als ein Handelstag',
  frageAus(
    [
      wert('a', 2.4, { asOf: '2026-08-17T19:35:36.000Z' }),
      wert('b', 0.3, { asOf: '2026-08-17T19:35:34.000Z' }),
      wert('c', -0.8, { asOf: '2026-08-17T16:00:00.000Z' }),
      wert('d', -1.5, { asOf: '2026-08-17' }),
    ],
    'tagesgewinner'
  ) !== null,
  'Die Sekunde des Abrufs sagt über den Handelstag nichts.'
)

pruefen(
  'Und der Stand ist dann der Tag, nicht der Zeitstempel',
  frageAus(
    [
      wert('a', 2.4, { asOf: '2026-08-17T19:35:36.000Z' }),
      wert('b', 0.3, { asOf: '2026-08-17T19:35:34.000Z' }),
      wert('c', -0.8, { asOf: '2026-08-17T16:00:00.000Z' }),
      wert('d', -1.5, { asOf: '2026-08-17' }),
    ],
    'tagesgewinner'
  )?.stand === '2026-08-17'
)

/*
  Und die Gegenrichtung: ein wirklich veralteter Kurs.

  Unter den 22 geführten Indizes stand am 18. August 2026 einer mit einem Kurs
  vom 24. Juli. Ihn mitzuvergleichen wäre keine falsch beantwortete Frage,
  sondern eine falsch gestellte.
*/
pruefen(
  'Ein Kurs von einem anderen Tag verhindert die Frage weiterhin',
  frageAus(
    [
      wert('a', 2.4, { asOf: '2026-08-17T19:35:36.000Z' }),
      wert('b', 0.3, { asOf: '2026-08-17T19:35:34.000Z' }),
      wert('c', -0.8, { asOf: '2026-07-24T17:30:00+02:00' }),
      wert('d', -1.5, { asOf: '2026-08-17' }),
    ],
    'tagesgewinner'
  ) === null,
  'Ein 25 Tage alter Kurs neben drei aktuellen.'
)

pruefen(
  'Eine fehlende Zahl ebenso',
  frageAus(
    [wert('a', Number.NaN), wert('b', 0.3), wert('c', -0.8), wert('d', -1.5)],
    'tagesgewinner'
  ) === null
)

pruefen(
  'Und drei Werte reichen nicht für vier Antworten',
  frageAus([wert('a', 2.4), wert('b', 0.3), wert('c', -0.8)], 'tagesgewinner') === null
)

/* ------------------------------------------------------- Der Abstand zum Hoch */

console.log('')

const amHoch = frageAus(
  [
    wert('a', 0, { value: 109, high52w: 110 }),
    wert('b', 0, { value: 90, high52w: 110 }),
    wert('c', 0, { value: 70, high52w: 110 }),
    wert('d', 0, { value: 50, high52w: 110 }),
  ],
  'abstandZumHoch'
)

pruefen('Der Abstand zum Hoch ergibt eine Frage', amHoch !== null)
pruefen(
  'Der dem Hoch nächste gewinnt',
  amHoch?.antworten[amHoch.richtigIndex].symbol === 'a',
  amHoch?.antworten[amHoch.richtigIndex].symbol +
    ' – der Abstand ist negativ, gesucht ist der größte Wert.'
)

/* ------------------------------------------------------------ Determinismus */

console.log('')

const viele: Kandidat[] = [
  wert('a', 3.1),
  wert('b', 1.2),
  wert('c', -0.4),
  wert('d', -2.2),
  wert('e', 0.7, { ytdPercent: 30 }),
  wert('f', 0.2, { ytdPercent: -8 }),
  wert('g', -1.1, { ytdPercent: 14 }),
  wert('h', -3.3, { ytdPercent: 2 }),
]

const erste = tagesfrage(viele, '2026-08-18')
const zweite = tagesfrage(viele, '2026-08-18')

pruefen('Es kommt eine Frage zustande', erste !== null)
pruefen(
  'Derselbe Tag ergibt dieselbe Frage',
  JSON.stringify(erste) === JSON.stringify(zweite),
  'Sonst zeigen zwei Bauläufe zwei verschiedene „Fragen des Tages“.'
)

/*
  Und über ein Jahr hinweg darf nicht immer dieselbe Art herauskommen.

  Ohne das Drehen der Fragearten wäre die Tagesfrage wochenlang dieselbe – die
  Kandidaten wechseln, die Art nicht.
*/
const arten = new Set<string>()
for (let tag = 1; tag <= 60; tag++) {
  const datum = `2026-${String(Math.ceil(tag / 28)).padStart(2, '0')}-${String(((tag - 1) % 28) + 1).padStart(2, '0')}`
  const f = tagesfrage(viele, datum)
  if (f) arten.add(f.art)
}
pruefen(
  'Über die Tage kommen mehrere Fragearten vor',
  arten.size > 1,
  `${[...arten].join(', ')} – eine einzige Art über sechzig Tage wäre keine Tagesfrage,\n` +
    '     sondern dieselbe Frage mit wechselnden Zahlen.'
)

pruefen(
  'Ohne genug Kandidaten gibt es keine Frage',
  tagesfrage(viele.slice(0, 3), '2026-08-18') === null
)

/*
  Der Fall, in dem gar nichts geht: acht Werte, alle fast gleich.

  Dann darf keine Frage entstehen – auch nicht bei der dritten Frageart, auch
  nicht bei der zweiten Vierergruppe.
*/
const flach = Array.from({ length: 8 }, (_, i) =>
  wert(`x${i}`, 0.01 * i, { ytdPercent: 5 + 0.01 * i, value: 100, high52w: 110 })
)
pruefen(
  'Ein völlig flacher Tag ergibt keine Frage',
  tagesfrage(flach, '2026-08-18') === null,
  'Lieber keine Tagesfrage als eine, die den Falschen tadelt.'
)

/* ---------------------------------------------------------- Die Gattungen */

console.log('')

const gemischt: Kandidat[] = [
  wert('dax', 1, { kind: 'index' }),
  wert('gold', 1, { kind: 'commodity' }),
  wert('sap', 1, { kind: 'stock' }),
  wert('nasdaq', 1, { kind: 'index' }),
]

pruefen(
  'Gefiltert wird auf eine Gattung',
  gleicheGattung(gemischt, 'index')
    .map((k) => k.symbol)
    .join() === 'dax,nasdaq',
  'Sonst wäre die eine Aktie unter drei Indizes die auffällige Antwort.'
)

pruefen(
  'Werte ohne brauchbare Zahlen fallen heraus',
  gleicheGattung([wert('a', Number.NaN), wert('b', 1)], 'index')
    .map((k) => k.symbol)
    .join() === 'b'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
