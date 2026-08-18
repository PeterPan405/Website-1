/**
 * Das Ausgabenband – und was in ihm nicht fehlen darf.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Eine Meldung fehlt im Band.** Ein Band, der neunzehn von zwanzig
 *    Meldungen enthält, sieht vollständig aus. Niemand zählt beim Lesen nach.
 * 2. **Der Jahresband ist Zeichen für Zeichen der Monatsband.** Solange nur ein
 *    Monat Ausgaben hat, wären es zwei Dateien mit identischem Inhalt – und
 *    eine davon wird beim nächsten Monat still falsch.
 * 3. **Die Reihenfolge steht auf dem Kopf.** Das Archiv listet neueste zuerst;
 *    ein Band, den man von hinten nach vorn liest, wäre eine Zeitung in
 *    umgekehrter Reihenfolge.
 * 4. **Die Quellen fallen weg.** Auf Papier ist eine Adresse unbequem – und
 *    ohne sie steht dort eine Behauptung.
 */

import type { DailyEdition, EditionItem } from '@/data/editions/types'
import {
  baende,
  bandDateiname,
  bandDokument,
  bandName,
  meldungszahl,
} from '@/lib/ausgabenband'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function meldung(kennung: string): EditionItem {
  return {
    headline: `Schlagzeile ${kennung}`,
    summary: [`Erster Absatz zu ${kennung}.`, `Zweiter Absatz zu ${kennung}.`],
    category: 'Märkte',
    whyItMatters: `Warum ${kennung} zählt.`,
    relatedTopics: [],
    relatedSymbols: [],
    sources: [{ label: `Quelle ${kennung}`, url: `https://example.org/${kennung}` }],
  }
}

function ausgabe(datum: string, anzahl = 2): DailyEdition {
  return {
    date: datum,
    intro: `Einleitung vom ${datum}, lang genug für einen Absatz im Band.`,
    top: [meldung(`${datum}-top`)],
    further: Array.from({ length: anzahl - 1 }, (_, i) => meldung(`${datum}-w${i}`)),
  } as DailyEdition
}

/* --------------------------------------------------------------- Die Bände */

const einMonat = [ausgabe('2026-08-01'), ausgabe('2026-08-02'), ausgabe('2026-08-03')]

pruefen(
  'Ein Monat ergibt genau einen Band',
  baende(einMonat).length === 1 && baende(einMonat)[0].art === 'monat',
  baende(einMonat)
    .map((b) => `${b.art}:${b.schluessel}`)
    .join(', ')
)

/*
  Der Fall, um den es geht.

  Solange nur ein Monat Ausgaben hat, wäre der Jahresband Zeichen für Zeichen
  der Monatsband. Zwei Dateien mit identischem Inhalt sind eine zu viel – und
  die überflüssige wird beim nächsten Monat still falsch.
*/
pruefen(
  'Bei einem einzigen Monat gibt es keinen Jahresband',
  !baende(einMonat).some((band) => band.art === 'jahr'),
  'Er wäre derselbe Band mit anderer Überschrift.'
)

const zweiMonate = [...einMonat, ausgabe('2026-07-30'), ausgabe('2026-07-31')]
const mitJahr = baende(zweiMonate)

pruefen(
  'Ab zwei Monaten kommt der Jahresband dazu',
  mitJahr.filter((band) => band.art === 'jahr').length === 1,
  mitJahr.map((b) => `${b.art}:${b.schluessel}`).join(', ')
)

pruefen(
  'Der Jahresband enthält alle Ausgaben',
  mitJahr.find((band) => band.art === 'jahr')?.ausgaben.length === zweiMonate.length
)

pruefen(
  'Die Bände stehen neueste zuerst',
  mitJahr.map((b) => `${b.schluessel}`).join() === '2026-08,2026-07,2026',
  mitJahr.map((b) => b.schluessel).join(', ')
)

/*
  Innerhalb eines Bandes wird aufsteigend gelesen.

  Das Archiv listet neueste zuerst – ein Band aber ist ein Heft, und ein Heft
  fängt vorn an.
*/
pruefen(
  'Im Band stehen die Ausgaben aufsteigend',
  mitJahr
    .find((band) => band.art === 'jahr')
    ?.ausgaben.map((a) => a.date)
    .join() === '2026-07-30,2026-07-31,2026-08-01,2026-08-02,2026-08-03',
  mitJahr
    .find((band) => band.art === 'jahr')
    ?.ausgaben.map((a) => a.date)
    .join(', ')
)

pruefen('Ohne Ausgaben gibt es keinen Band', baende([]).length === 0)

/* ---------------------------------------------------------- Die Vollständigkeit */

console.log('')

const jahresband = mitJahr.find((band) => band.art === 'jahr')!
const dokument = bandDokument(jahresband, '18.08.2026', 'IM Invests')

pruefen(
  'Die Meldungen werden gezählt, nicht geschätzt',
  meldungszahl(jahresband) === 10,
  `${meldungszahl(jahresband)} – fünf Ausgaben zu je zwei Meldungen.`
)

/*
  Die Prüfung, die zählt: Jede einzelne Schlagzeile muss im Dokument stehen.

  Ein Band mit neunzehn von zwanzig Meldungen sieht vollständig aus – niemand
  zählt beim Lesen nach.
*/
const texte = dokument.zeilen
  .map((zeile) => ('text' in zeile ? zeile.text : ''))
  .join('\n')

const fehlend = jahresband.ausgaben
  .flatMap((a) => [...a.top, ...a.further])
  .filter((m) => !texte.includes(m.headline))

pruefen(
  'Jede Meldung steht im Band',
  fehlend.length === 0,
  `${fehlend.map((m) => m.headline).join(', ')} fehlt/fehlen.`
)

pruefen(
  'Jeder Absatz jeder Zusammenfassung steht drin',
  jahresband.ausgaben
    .flatMap((a) => [...a.top, ...a.further])
    .flatMap((m) => m.summary)
    .every((absatz) => texte.includes(absatz)),
  'Ein Band, der kürzt, wäre ein zweiter Text neben dem ersten.'
)

pruefen(
  'Und jedes „warum es zählt“',
  jahresband.ausgaben
    .flatMap((a) => [...a.top, ...a.further])
    .every((m) => texte.includes(m.whyItMatters))
)

pruefen(
  'Die Quellen kommen mit',
  jahresband.ausgaben
    .flatMap((a) => [...a.top, ...a.further])
    .flatMap((m) => m.sources)
    .every((q) => texte.includes(q.url)),
  'Ohne Fundstelle steht dort eine Behauptung.'
)

pruefen(
  'Jede Einleitung steht drin',
  jahresband.ausgaben.every((a) => texte.includes(a.intro))
)

/*
  Jede Ausgabe beginnt auf einer neuen Seite – bis auf die erste. Ein Band, in
  dem der 5. August mitten auf der Seite des 4. anfängt, lässt sich nicht
  durchblättern, und genau dafür gibt es ihn.
*/
pruefen(
  'Zwischen den Ausgaben steht ein Seitenumbruch',
  dokument.zeilen.filter((z) => z.art === 'seitenumbruch').length ===
    jahresband.ausgaben.length - 1,
  `${dokument.zeilen.filter((z) => z.art === 'seitenumbruch').length} bei ${jahresband.ausgaben.length} Ausgaben` +
    ' – vor der ersten gehört keiner.'
)

pruefen(
  'Der Kopf nennt Umfang und Stand',
  (dokument.untertitel ?? '').includes('5 Ausgaben') &&
    (dokument.untertitel ?? '').includes('10 Meldungen') &&
    (dokument.untertitel ?? '').includes('18.08.2026'),
  dokument.untertitel ?? ''
)

/* -------------------------------------------------------------- Die Namen */

console.log('')

pruefen('Ein Monatsschlüssel wird ausgeschrieben', bandName('2026-08') === 'August 2026')
pruefen('Ein Jahresschlüssel bleibt die Zahl', bandName('2026') === '2026')
pruefen('Der Januar trifft den ersten Namen', bandName('2026-01') === 'Januar 2026')
pruefen('Und der Dezember den letzten', bandName('2026-12') === 'Dezember 2026')

pruefen(
  'Der Dateiname enthält kein Leerzeichen',
  !bandDateiname(jahresband).includes(' '),
  bandDateiname(jahresband) +
    ' – ein Dateiname mit Leerzeichen kommt aus jedem zweiten Werkzeug anders wieder heraus.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
