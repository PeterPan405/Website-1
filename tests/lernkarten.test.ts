/**
 * Die Rückseiten der Lernkarten.
 *
 * ## Der Fehler, um den es geht
 *
 * Ein Bogen mit acht Karten wird beidseitig gedruckt. Druckt man die Rückseite
 * in derselben Reihenfolge wie die Vorderseite, steht die Antwort zu Karte 1
 * hinter Karte 2 – auf jedem Blatt, und am Bildschirm sieht nichts falsch aus.
 * Man merkt es mit der Schere in der Hand.
 *
 * Beim Wenden über die lange Kante dreht sich das Blatt um seine senkrechte
 * Achse: Was vorn links liegt, liegt hinten rechts. Die Rückseite muss also
 * zeilenweise gespiegelt werden.
 *
 * ## Warum das hier ausgeschrieben steht
 *
 * Weil eine Prüfung, die die Spiegelung mit derselben Formel nachrechnet, nur
 * bestätigt, dass die Formel gleich geblieben ist. Die Sollreihenfolge steht
 * deshalb als Zahlenreihe im Test, von Hand hingeschrieben – gegen sie wird
 * geprüft, nicht gegen einen zweiten Aufruf derselben Funktion.
 *
 * Dazu die Probe, die den Fehler wirklich fängt: **Nach dem Wenden muss hinter
 * jeder Karte ihre eigene Rückseite liegen.** Das ist die Bedingung, um die es
 * geht, und sie wird hier nachgestellt statt behauptet.
 */

import {
  KARTEN_JE_BOGEN,
  SPALTEN,
  ausBegriffen,
  ausFragen,
  boegen,
  rueckseiten,
  umfang,
  type Lernkarte,
  type Platz,
} from '@/lib/lernkarten'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function karte(nummer: number): Lernkarte {
  return { id: `k${nummer}`, art: 'begriff', vorn: `V${nummer}`, hinten: `H${nummer}` }
}

const acht = Array.from({ length: 8 }, (_, index) => karte(index + 1))

/* ------------------------------------------------------- Die Spiegelung */

/*
  Von Hand hingeschrieben, nicht gerechnet.

     vorn      hinten (gedruckt)
     1  2      2  1
     3  4      4  3
     5  6      6  5
     7  8      8  7
*/
const SOLL = [2, 1, 4, 3, 6, 5, 8, 7]

pruefen(
  'Die Rückseite steht zeilenweise gespiegelt',
  rueckseiten(acht)
    .map((platz) => platz?.id)
    .join() === SOLL.map((n) => `k${n}`).join(),
  rueckseiten(acht)
    .map((platz) => platz?.id ?? '_')
    .join(', ')
)

/*
  Die Probe, um die es geht: das Wenden nachgestellt.

  Beim Wenden über die lange Kante tauscht in jeder Zeile links und rechts die
  Seite. Wer das auf die gedruckte Rückseite anwendet, muss wieder bei der
  Vorderseitenreihenfolge landen – dann und nur dann liegt hinter jeder Karte
  ihre eigene Rückseite.
*/
function wenden(bogen: readonly Platz[]): Platz[] {
  const gewendet: Platz[] = []
  for (let zeile = 0; zeile < bogen.length; zeile += SPALTEN) {
    gewendet.push(...bogen.slice(zeile, zeile + SPALTEN).reverse())
  }
  return gewendet
}

pruefen(
  'Nach dem Wenden liegt hinter jeder Karte ihre eigene Rückseite',
  wenden(rueckseiten(acht))
    .map((platz) => platz?.id)
    .join() === acht.map((k) => k.id).join(),
  'Sonst steht die Antwort zu Karte 1 hinter Karte 2 – auf jedem Blatt.'
)

/*
  Die Gegenprobe. Eine ungespiegelte Rückseite muss auffallen.

  Ohne sie wäre nicht geprüft, dass die Spiegelung überhaupt etwas tut: Bei
  einer einspaltigen Anordnung wären beide Reihenfolgen gleich, und der Test
  oben ginge durch, ohne etwas zu zeigen.
*/
pruefen(
  'Eine ungespiegelte Rückseite ist eine andere Reihenfolge',
  rueckseiten(acht)
    .map((platz) => platz?.id)
    .join() !== acht.map((k) => k.id).join(),
  'Bei zwei Spalten müssen sich die beiden Reihenfolgen unterscheiden – sonst\n' +
    '     prüft die Zeile darüber nichts.'
)

/* ----------------------------------------------------- Die Lücken zählen mit */

console.log('')

/*
  Ein Bogen mit drei Karten.

     vorn        hinten
     1  2        2  1
     3  _        _  3
     _  _        _  _
     _  _        _  _

  Ließe man die Lücken weg, rutschte Karte 3 in die falsche Spalte – der
  Fehler wäre nur auf dem letzten Bogen und deshalb erst recht spät sichtbar.
*/
const drei = boegen(acht.slice(0, 3))
pruefen('Drei Karten ergeben einen Bogen', drei.length === 1)
pruefen(
  'Der Bogen wird mit leeren Plätzen aufgefüllt',
  drei[0].vorderseite.length === KARTEN_JE_BOGEN &&
    drei[0].vorderseite.filter((platz) => platz === null).length === 5
)
pruefen(
  'Die Lücken werden mitgespiegelt',
  drei[0].rueckseite.map((platz) => platz?.id ?? '_').join() === 'k2,k1,_,k3,_,_,_,_',
  drei[0].rueckseite.map((platz) => platz?.id ?? '_').join(', ')
)

const neun = boegen([...acht, karte(9)])
pruefen('Neun Karten ergeben zwei Bögen', neun.length === 2)
pruefen(
  'Der zweite Bogen trägt die neunte Karte an erster Stelle',
  neun[1].vorderseite[0]?.id === 'k9'
)
pruefen(
  'Und ihre Rückseite liegt richtig',
  neun[1].rueckseite[1]?.id === 'k9',
  neun[1].rueckseite.map((platz) => platz?.id ?? '_').join(', ') +
    ' – bei einer einzigen Karte in der Zeile wandert sie nach rechts.'
)

pruefen('Ohne Karten gibt es keinen Bogen', boegen([]).length === 0)

pruefen(
  'Die Bögen sind von eins an durchnummeriert',
  neun.map((bogen) => bogen.nummer).join() === '1,2'
)

/* ----------------------------------------------------- Woraus Karten werden */

console.log('')

const begriffskarten = ausBegriffen([
  { slug: 'aktie', begriff: 'Aktie', kurz: 'Ein Anteil am Unternehmen.' },
])
pruefen(
  'Aus einem Begriff wird Vorderseite und Rückseite',
  begriffskarten[0].vorn === 'Aktie' &&
    begriffskarten[0].hinten === 'Ein Anteil am Unternehmen.'
)

const fragenkarten = ausFragen(
  [
    {
      question: 'Was ist eine Aktie?',
      options: ['Ein Darlehen', 'Ein Anteil', 'Ein Zins', 'Ein Konto'],
      correctIndex: 1,
      explanation: 'Weil sie Miteigentum verbrieft.',
    },
  ],
  'beginner',
  'aktie'
)

pruefen(
  'Die Vorderseite trägt die Frage ohne die Auswahlantworten',
  fragenkarten[0].vorn === 'Was ist eine Aktie?' &&
    !fragenkarten[0].vorn.includes('Ein Darlehen'),
  'Mit den vier Möglichkeiten prüft die Karte Wiedererkennen, ohne sie Wissen.'
)

pruefen(
  'Die Rückseite trägt Antwort und Begründung',
  fragenkarten[0].hinten.startsWith('Ein Anteil') &&
    fragenkarten[0].hinten.includes('Miteigentum')
)

/*
  Eine Frage, deren Antwortindex ins Leere zeigt, darf keine Karte werden.
  Eine Karte mit leerer Rückseite ist keine – sie wäre ausgedruckt, zugeschnitten
  und wertlos.
*/
pruefen(
  'Eine Frage ohne gültige Antwort ergibt keine Karte',
  ausFragen(
    [
      {
        question: 'Kaputt',
        options: ['a', 'b'],
        correctIndex: 7,
        explanation: 'x',
      },
    ],
    'beginner',
    'test'
  ).length === 0
)

/* -------------------------------------------------------------- Der Umfang */

console.log('')

const gemischt = [...begriffskarten, ...fragenkarten, ...acht]
const zahl = umfang(gemischt)
pruefen('Der Umfang zählt alle Karten', zahl.karten === gemischt.length)
pruefen('Er trennt Begriffe und Fragen', zahl.begriffe === 9 && zahl.fragen === 1)
pruefen(
  'Und rechnet die Bögen auf',
  zahl.boegen === 2,
  `${zahl.karten} Karten ergeben ${zahl.boegen} Bögen – zehn Karten passen nicht auf einen.`
)
pruefen('Ohne Karten null Bögen', umfang([]).boegen === 0)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
