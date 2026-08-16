/**
 * Die Datenstands-Ampel.
 *
 * ## Die Prüfung, um die es hier eigentlich geht
 *
 * Eine Ampel ist eine Absicherung, und für Absicherungen gilt in diesem
 * Projekt: **Wer eine baut, legt ihr etwas vor, das sie beanstanden muss.**
 * Eine Ampel, die in keinem Fall rot wird, sieht aus wie Ruhe.
 *
 * Der Weg, auf dem genau das passieren würde, ist hier nicht hypothetisch,
 * sondern der naheliegende: Diese Website wird **statisch gebaut**. Wer
 * `beurteile()` in einer Server-Komponente aufruft, friert das Ergebnis auf
 * die Bauzeit ein. Die Ampel stünde dann für immer auf Grün – der Wert war
 * beim Bauen ja frisch –, während der Besucher drei Tage später dieselbe
 * Seite aus dem Cache liest.
 *
 * Diese Datei prüft deshalb zwei Dinge, und das zweite ist das wichtigere:
 *
 * 1. dass jede Stufe an echtem Material erreichbar ist – auch Rot;
 * 2. dass die Bauart, die das Ganze aushebeln würde, nicht eintritt.
 */

import { readFileSync } from 'node:fs'

import { beurteile, taktErwartung, type Erwartung } from '@/lib/datenstand'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Ein fester Bezugspunkt – ein Mittwoch, damit Wochenenden nicht mitreden. */
const MITTWOCH = new Date('2026-08-12T18:00:00Z')

function tageVor(tage: number): string {
  return new Date(MITTWOCH.getTime() - tage * 86_400_000).toISOString().slice(0, 10)
}

/* ------------------------------------------------------ Alle drei Stufen */

const monatlich = taktErwartung('monatlich', 30)

const grün = beurteile(tageVor(3), monatlich, MITTWOCH)
const gelb = beurteile(tageVor(70), monatlich, MITTWOCH)
const rot = beurteile(tageVor(200), monatlich, MITTWOCH)

pruefen('Eine frische Zahl ist frisch', grün.frische === 'frisch', grün.satz)
pruefen('Nach zwei Takten steht sie auf älter', gelb.frische === 'aelter', gelb.satz)
pruefen('Nach sieben Monaten ist sie veraltet', rot.frische === 'veraltet', rot.satz)

/*
  Die Gegenprobe: Es müssen wirklich drei verschiedene sein.

  Eine Ampel, deren drei Zweige alle dieselbe Stufe liefern, bestünde die drei
  Prüfungen oben nicht – aber eine, die zwei Stufen zusammenfallen lässt,
  könnte sie bestehen und wäre trotzdem kaputt.
*/
pruefen(
  'Die drei Stufen sind drei',
  new Set([grün.frische, gelb.frische, rot.frische]).size === 3
)

pruefen(
  'Jede Stufe trägt einen ganzen Satz, nicht nur eine Farbe',
  [grün, gelb, rot].every((b) => b.satz.length > 30 && b.satz.endsWith('.')),
  [grün, gelb, rot].map((b) => `${b.frische}: ${b.satz}`).join('\n     ')
)

pruefen('Der Satz nennt den Takt der Quelle', grün.satz.includes('monatlich'), grün.satz)

/* --------------------------------------------- Handelsplätze statt Tage */

const apple: Erwartung = {
  art: 'handel',
  instrument: { symbol: 'apple', ticker: 'AAPL', kind: 'stock' },
}

/*
  Der Fall, für den `verpassteSitzungen` überhaupt existiert.

  Ein Kurs vom Freitagabend ist am Montagmorgen sechzig Stunden alt. Nach
  Tagen gerechnet wäre er auffällig; nach Handelsschlüssen ist er tadellos.
  Fiele diese Unterscheidung weg, stünde jeden Montag die halbe Website auf
  Gelb – und eine Ampel, die grundlos anschlägt, wird abgeschaltet.
*/
const freitagSchluss = '2026-08-07T20:00:00Z'
const montagFrueh = new Date('2026-08-10T07:00:00Z')
const uebersWochenende = beurteile(freitagSchluss, apple, montagFrueh)

pruefen(
  'Freitagskurs am Montagmorgen: kein Befund',
  uebersWochenende.frische === 'frisch',
  `${uebersWochenende.frische} – ${uebersWochenende.satz}`
)
pruefen(
  'Er ist trotzdem älter als zwei Tage – gemessen wird also nicht in Tagen',
  (uebersWochenende.alterTage ?? 0) >= 2,
  `alterTage = ${uebersWochenende.alterTage}`
)

/*
  Und die Gegenprobe dazu: Derselbe Kurs am Dienstag hat Sitzungen verpasst.

  Ohne diese Prüfung wäre oben nur belegt, dass die Ampel „frisch" sagen kann.
*/
const dienstagFrueh = new Date('2026-08-11T07:00:00Z')
const einenTagZuLang = beurteile(freitagSchluss, apple, dienstagFrueh)
pruefen(
  'Derselbe Kurs am Dienstagmorgen ist ein Befund',
  einenTagZuLang.frische !== 'frisch',
  `${einenTagZuLang.frische} – ${einenTagZuLang.satz}`
)

const langeWeg = beurteile('2026-07-20T20:00:00Z', apple, MITTWOCH)
pruefen(
  'Drei Wochen ohne neuen Kurs sind rot',
  langeWeg.frische === 'veraltet',
  langeWeg.satz
)
pruefen(
  'Der rote Satz nennt den Handelsplatz',
  langeWeg.satz.includes('Handelsplatz New York'),
  langeWeg.satz
)

/*
  Ohne Handelsplatz wird keine Farbe erfunden – aber auch nicht geschwiegen.

  Krypto und Devisen haben keinen Schluss. `handelsplatzFuer` gibt dort `null`
  zurück; die Ampel muss dann sagen, dass sie ohne Vergleich urteilt.
*/
const bitcoin: Erwartung = {
  art: 'handel',
  instrument: { symbol: 'bitcoin', ticker: 'BTC-USD', kind: 'crypto' },
}
const ohnePlatz = beurteile(tageVor(0), bitcoin, MITTWOCH)
pruefen(
  'Ohne Handelsplatz steht der Vorbehalt im Satz',
  ohnePlatz.satz.includes('kein Handelsplatz'),
  ohnePlatz.satz
)

/* ------------------------------------------------------- Unlesbare Angabe */

const kaputt = beurteile('kein Datum', monatlich, MITTWOCH)
pruefen(
  'Ein unlesbarer Zeitstempel ist rot, nicht grün',
  kaputt.frische === 'veraltet' && kaputt.alterTage === null,
  'Ein Fehler beim Lesen darf nicht als „alles in Ordnung" durchgehen.'
)

/* ---------------------------------------------------- Die Faustregel hält */

const taeglich = taktErwartung('werktäglich', 1)
pruefen(
  'Eine tägliche Quelle schlägt nicht schon nach zwei Tagen an',
  beurteile(tageVor(2), taeglich, MITTWOCH).frische === 'frisch',
  'Mindestens eine Woche Luft – sonst steht die Ampel nach jedem Wochenende auf Gelb.'
)

/* ================================================================= *
 *  Die eigentliche Prüfung: Die Ampel muss rot werden können.
 * ================================================================= */

const AMPEL = 'components/ui/Datenstandsampel.tsx'
const BIBLIOTHEK = 'lib/datenstand.ts'

const ampel = readFileSync(AMPEL, 'utf8')
const bibliothek = readFileSync(BIBLIOTHEK, 'utf8')

pruefen(
  'Die Ampel ist eine Browser-Komponente',
  /^'use client'/m.test(ampel),
  `Ohne \`'use client'\` rechnet ${AMPEL} beim Bauen. Das Ergebnis wäre auf\n` +
    '     die Bauzeit eingefroren – die Ampel stünde für immer auf Grün.'
)

/*
  Die Uhr kommt aus dem Browser, und der Server bekommt ausdrücklich keine.

  `useSyncExternalStore` verlangt eine dritte Funktion für Server und Bau.
  Gäbe sie dort dieselbe Uhr zurück wie im Browser, wäre der ganze Umweg
  umsonst – dann stünde die Bauzeit wieder im ausgelieferten HTML.
*/
pruefen(
  'Sie liest die Uhr über useSyncExternalStore',
  /useSyncExternalStore\(/.test(ampel) && /Date\.now\(\)/.test(ampel),
  'Die Uhr muss die des Besuchers sein, nicht die des Bauens.'
)

pruefen(
  'Für Server und Bau gibt es kein Urteil',
  /function beimBauen\(\): null/.test(ampel) && /return null/.test(ampel),
  'Ohne eigene Server-Momentaufnahme landet die Bauzeit im HTML.'
)

/*
  `beurteile` darf keinen Vorgabewert für `jetzt` haben.

  Mit `jetzt = new Date()` ließe sich die Funktion versehentlich in einer
  Server-Komponente aufrufen, ohne dass es auffiele – und genau dann friert
  das Ergebnis ein. Ein Pflichtargument zwingt jeden Aufrufer, sich zu
  entscheiden, welche Uhr gemeint ist.
*/
pruefen(
  '`jetzt` ist ein Pflichtargument ohne Vorgabewert',
  !/jetzt\s*[:=][^,)]*=\s*new Date\(\)/.test(bibliothek),
  'Ein Vorgabewert würde die Bauzeit stillschweigend zur Messzeit machen.'
)

/*
  Geprüft wird der Code, nicht die Prosa.

  Die erste Fassung dieser Prüfung schlug am eigenen Kommentar an: Im Kopf von
  `beurteile()` steht `jetzt = new Date()` als Beispiel für das, was gerade
  nicht getan werden soll. Eine Prüfung, die ihre eigene Begründung für einen
  Verstoß hält, ist unbrauchbar – und sie hätte niemanden davon abgehalten,
  den Kommentar zu löschen statt den Fehler zu beheben.
*/
const ohneKommentare = bibliothek
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')

pruefen(
  'Die Bibliothek hat keine eigene Uhr',
  !/\bnew Date\(\s*\)/.test(ohneKommentare) && !/Date\.now\(/.test(ohneKommentare),
  'Jede Uhr in dieser Datei ist beim Bauen die Bauzeit.'
)

/*
  Und die Gegenprobe: Der Kommentarfilter darf nicht so scharf sein, dass er
  auch den Code wegwirft. Dann bestünde die Prüfung immer.
*/
pruefen(
  'Der Kommentarfilter lässt den Code stehen',
  ohneKommentare.includes('export function beurteile') &&
    ohneKommentare.includes('verpassteSitzungen(platz'),
  'Nach dem Entfernen der Kommentare ist zu wenig übrig, um etwas zu prüfen.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
