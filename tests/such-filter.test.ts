/**
 * Filter über die Suchtreffer – und ob sie zeigen, was sie wegnehmen.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Ein Eintrag ohne Datum wird vom Altersfilter wie „von heute“
 *    behandelt.** `undefined` in einer Datumsrechnung ergibt `NaN`, und jeder
 *    Vergleich mit `NaN` ist falsch – je nachdem, wie herum man ihn schreibt,
 *    fällt der Eintrag heraus oder bleibt drin. Ein Kurs ist aber weder sieben
 *    Tage alt noch älter; er hat kein Alter.
 * 2. **Die Filterleiste erscheint, wenn sie nichts ausrichten kann.** Bei
 *    einer einzigen Art ist jeder Knopf ein Knopf ohne Wirkung.
 * 3. **Die Zahlen an den Knöpfen stimmen nicht mit dem überein, was der Klick
 *    übrig lässt.** Der Fehler, den man erst beim Zählen merkt.
 * 4. **Die Lernstufen werden nach Häufigkeit sortiert.** Beginner,
 *    Fortgeschritten, Profi ist eine Ordnung des Stoffes, keine der Zufälle.
 * 5. **Der Filter sortiert um.** Er soll streichen, nicht neu bewerten.
 */

import {
  alterInTagen,
  artenMitAnzahl,
  filtere,
  filterLohntSich,
  mitDatum,
  stufenMitAnzahl,
} from '@/lib/such-filter'
import type { SearchEntry } from '@/lib/search-match'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function eintrag(teil: Partial<SearchEntry> & { title: string }): SearchEntry {
  return { href: `/${teil.title}`, kind: 'Kurs', ...teil }
}

const HEUTE = '2026-08-18'

/*
  Eine Trefferliste, die die echte Verteilung nachbildet.

  Im Index sind 1.075 von 2.002 Einträgen Kurse – mehr als die Hälfte. Genau
  deshalb gibt es die Filter, und genau deshalb steht hier eine Liste, in der
  die Kurse überwiegen.
*/
const treffer: SearchEntry[] = [
  eintrag({ title: 'gold', kind: 'Kurs' }),
  eintrag({ title: 'silber', kind: 'Kurs' }),
  eintrag({ title: 'platin', kind: 'Kurs' }),
  eintrag({ title: 'rohstoffe-beginner', kind: 'Lernstufe', stufe: 'beginner' }),
  eintrag({ title: 'rohstoffe-profi', kind: 'Lernstufe', stufe: 'profi' }),
  eintrag({ title: 'goldpreis-meldung', kind: 'News', datum: '2026-08-16' }),
  eintrag({ title: 'alte-meldung', kind: 'News', datum: '2026-07-01' }),
  eintrag({ title: 'goldstandard', kind: 'Begriff' }),
]

const STUFEN = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'fortgeschritten', label: 'Fortgeschritten' },
  { id: 'profi', label: 'Profi' },
]

/* ------------------------------------------------------------ Die Arten */

const arten = artenMitAnzahl(treffer)

pruefen(
  'Die häufigste Art steht vorn',
  arten[0].wert === 'Kurs' && arten[0].anzahl === 3,
  `${arten.map((a) => `${a.wert}:${a.anzahl}`).join(', ')} – die häufigste ist die,\n` +
    '     die den Rest verdeckt, und die will man zuerst wegklicken.'
)

pruefen(
  'Jede vorkommende Art ist dabei',
  arten
    .map((a) => a.wert)
    .sort()
    .join() === 'Begriff,Kurs,Lernstufe,News',
  `${arten.map((a) => a.wert).join(', ')}`
)

pruefen(
  'Bei gleicher Zahl entscheidet der Name',
  (() => {
    const gleich = [
      eintrag({ title: 'a', kind: 'Zeta' }),
      eintrag({ title: 'b', kind: 'Alpha' }),
    ]
    return artenMitAnzahl(gleich)[0].wert === 'Alpha'
  })(),
  'Sonst wackelt die Leiste zwischen zwei gleich häufigen Arten.'
)

/*
  Die Zahl am Knopf muss das sein, was der Klick übrig lässt.

  Der Fehler, den man erst beim Zählen merkt: Da steht „Kurs 3“, und nach dem
  Klick sind es vier – weil gezählt und gefiltert an zwei Stellen stehen.
*/
for (const art of arten) {
  const nachKlick = filtere(treffer, { art: art.wert }, HEUTE)
  pruefen(
    `„${art.wert} ${art.anzahl}“ lässt auch ${art.anzahl} übrig`,
    nachKlick.length === art.anzahl,
    `${nachKlick.length} statt ${art.anzahl}`
  )
}

/* ------------------------------------------------- Der Filter sortiert nicht um */

console.log('')

pruefen(
  'Der Filter streicht, er sortiert nicht',
  filtere(treffer, { art: 'Kurs' }, HEUTE)
    .map((e) => e.title)
    .join() === 'gold,silber,platin',
  'Die Reihenfolge ist die der Suche – eine Umsortierung wäre eine zweite Suche.'
)

pruefen(
  'Ein leerer Filter lässt alles stehen',
  filtere(treffer, {}, HEUTE).length === treffer.length
)

/* --------------------------------------------------------- Die Lernstufen */

console.log('')

const stufen = stufenMitAnzahl(treffer, STUFEN)

pruefen(
  'Nur die vorkommenden Stufen erscheinen',
  stufen.map((s) => s.wert).join() === 'beginner,profi',
  `${stufen.map((s) => s.wert).join(', ')} – „fortgeschritten“ kommt nicht vor.`
)

pruefen(
  'Sie stehen in der Reihenfolge des Lernwegs, nicht nach Häufigkeit',
  (() => {
    const mehrProfi = [
      ...treffer,
      eintrag({ title: 'x', kind: 'Lernstufe', stufe: 'profi' }),
      eintrag({ title: 'y', kind: 'Lernstufe', stufe: 'profi' }),
    ]
    return (
      stufenMitAnzahl(mehrProfi, STUFEN)
        .map((s) => s.wert)
        .join() === 'beginner,profi'
    )
  })(),
  'Profi hat hier drei Treffer, Beginner einen – und steht trotzdem hinten.\n' +
    '     Beginner, Fortgeschritten, Profi ist eine Ordnung des Stoffes.'
)

pruefen(
  'Die Stufe filtert',
  filtere(treffer, { stufe: 'beginner' }, HEUTE)
    .map((e) => e.title)
    .join() === 'rohstoffe-beginner'
)

pruefen(
  'Ohne Lernstufen unter den Treffern gibt es keine Stufenfilter',
  stufenMitAnzahl([eintrag({ title: 'gold', kind: 'Kurs' })], STUFEN).length === 0,
  'Ein Filter, der nichts ausrichten kann, wird nicht gezeigt.'
)

/* ------------------------------------------------------------- Das Alter */

console.log('')

pruefen('Heute ist null Tage alt', alterInTagen('2026-08-18', HEUTE) === 0)
pruefen('Vorgestern sind zwei Tage', alterInTagen('2026-08-16', HEUTE) === 2)
pruefen('Ohne Datum gibt es kein Alter', alterInTagen(undefined, HEUTE) === null)
pruefen('Ein unlesbares Datum ergibt null', alterInTagen('irgendwann', HEUTE) === null)

/*
  Die Zeitzonenprobe.

  `new Date('2026-08-18')` liest ISO-Daten als UTC, `new Date(2026, 7, 18)`
  als Ortszeit. Westlich von Greenwich kippte die erste Variante um einen Tag –
  und ein Artikel wäre je nach Standort einen Tag älter. Derselbe Fehler wie
  bei den australischen Kursen, nur harmloser.
*/
pruefen(
  'Das Alter hängt nicht an der Zeitzone',
  alterInTagen('2026-01-01', '2026-12-31') === 364,
  `${alterInTagen('2026-01-01', '2026-12-31')} – 2026 ist kein Schaltjahr.`
)

pruefen(
  'Ein Zeitstempel wird auf den Tag gekürzt',
  alterInTagen('2026-08-16T23:30:00.000Z', HEUTE) === 2,
  'Die Nachrichten tragen volle Zeitstempel, die Ausgaben nur den Tag.'
)

/*
  Der wichtigste Fall dieser Datei.

  `undefined` in einer Datumsrechnung ergibt `NaN`. Jeder Vergleich mit `NaN`
  ist falsch – je nachdem, wie herum man ihn schreibt, fällt ein Kurs aus dem
  Altersfilter heraus oder bleibt drin. Drinbleiben wäre die Behauptung, er sei
  von heute.
*/
const jung = filtere(treffer, { hoechstensTageAlt: 7 }, HEUTE)
pruefen(
  'Der Altersfilter lässt nur datierte Treffer durch',
  jung.every((e) => typeof e.datum === 'string'),
  `${jung.map((e) => `${e.title}(${e.datum ?? 'ohne'})`).join(', ')}\n` +
    '     Ein Kurs ist nicht sieben Tage alt und auch nicht älter – er hat kein Alter.'
)

pruefen(
  'Und nur die jungen davon',
  jung.map((e) => e.title).join() === 'goldpreis-meldung',
  `${jung.map((e) => e.title).join(', ')} – die Meldung vom 1. Juli ist 48 Tage alt.`
)

pruefen(
  'Wie viele überhaupt ein Datum haben, ist abfragbar',
  mitDatum(treffer) === 2,
  `${mitDatum(treffer)} – die Zahl gehört neben den Filter, damit die\n` +
    '     Streichung keine stille ist.'
)

/* --------------------------------------------- Lohnt sich die Leiste? */

console.log('')

pruefen('Bei mehreren Arten lohnt sich die Leiste', filterLohntSich(treffer))

pruefen(
  'Bei einer einzigen Art nicht',
  !filterLohntSich([
    eintrag({ title: 'gold', kind: 'Kurs' }),
    eintrag({ title: 'silber', kind: 'Kurs' }),
  ]),
  'Ein Knopf, der die Liste unverändert lässt, ist keiner.'
)

pruefen('Bei leerer Trefferliste auch nicht', !filterLohntSich([]))

/* ------------------------------------------------- Filter greifen zusammen */

console.log('')

pruefen(
  'Zwei Filter schränken gemeinsam ein',
  filtere(treffer, { art: 'News', hoechstensTageAlt: 7 }, HEUTE).length === 1,
  'Sonst gewinnt der zuletzt geprüfte, und der erste ist Zierde.'
)

pruefen(
  'Ein Filter, den nichts erfüllt, ergibt eine leere Liste',
  filtere(treffer, { art: 'Rechner' }, HEUTE).length === 0,
  'Und nicht etwa alles – das wäre die gefährlichste Antwort.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
