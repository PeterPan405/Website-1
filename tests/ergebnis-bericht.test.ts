/**
 * Prüfungen für den Ergebnisbericht der Rechner.
 *
 * Ausführen mit `npm test`.
 *
 * Der Schwerpunkt liegt auf dem, was rechtlich und zur Einordnung auf dem
 * Dokument stehen **muss**. Ein Formatierungsfehler fällt beim ersten Blick
 * auf das PDF auf; ein fehlender Hinweis fällt niemandem auf – bis er fehlt.
 */

import { alsPdfZeilen, dateiname, type Ergebnisbericht } from '../lib/ergebnis-bericht.ts'
import { DOKUMENT_HINWEISE, RECHTSHINWEIS_KERN } from '../lib/rechtshinweis.ts'

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

const JETZT = new Date('2026-07-31T14:05:00')

const bericht: Ergebnisbericht = {
  titel: 'Zinsrechner',
  pfad: '/rechner/zinsrechner',
  annahmen: [
    { bezeichnung: 'Startkapital', wert: '10.000,00 €' },
    { bezeichnung: 'Sparrate monatlich', wert: '250,00 €' },
    { bezeichnung: 'Zinssatz', wert: '7,00 %', hinweis: 'Annahme, keine Zusage.' },
    { bezeichnung: 'Laufzeit', wert: '30 Jahre' },
  ],
  ergebnisse: [
    { bezeichnung: 'Endkapital', wert: '381.000,00 €' },
    { bezeichnung: 'davon Einzahlungen', wert: '100.000,00 €' },
  ],
  grenzen: ['Eine konstante Rendite gibt es an der Börse nicht.'],
  datenstand: ['Leitzins der EZB: 2,40 % (Stand 31.07.2026)'],
}

// ------------------------------------------------------- Pflicht: die Hinweise

const zeilen = alsPdfZeilen(bericht, JETZT)
const text = zeilen.map((z) => z.text ?? '').join('\n')

check('der Kernhinweis steht im PDF', text.includes(RECHTSHINWEIS_KERN), true)
check(
  'jeder Dokumenthinweis steht im PDF',
  DOKUMENT_HINWEISE.every((h) => text.includes(h)),
  true
)
check('die Grenzen des Rechners stehen darin', text.includes('konstante Rendite'), true)
check('der Datenstand steht darin', text.includes('Stand 31.07.2026'), true)
check('das Erstellungsdatum steht darin', text.includes('31.07.2026 um 14:05'), true)

/*
  Die Hinweise beginnen auf einer neuen Seite. Am Seitenende abgeschnittene
  Rechtshinweise sind schlechter als gar keine – sie erwecken den Eindruck, es
  sei alles gesagt worden.
*/
const umbruch = zeilen.findIndex((z) => z.art === 'seitenumbruch')
const kernAn = zeilen.findIndex((z) => z.text === RECHTSHINWEIS_KERN)
check('es gibt einen Seitenumbruch vor den Hinweisen', umbruch >= 0, true)
check('der Kernhinweis steht dahinter', kernAn > umbruch, true)

// ----------------------------------------------- Pflicht: die Annahmen

check('die Annahmen stehen im PDF', text.includes('Sparrate monatlich'), true)
check(
  'die Annahmen stehen vor dem Ergebnis',
  zeilen.findIndex((z) => z.text === 'Womit gerechnet wurde') <
    zeilen.findIndex((z) => z.text === 'Ergebnis'),
  true
)

/*
  Ein Bericht ohne Annahmen ist ein Blatt mit einer Zahl darauf – genau das
  Dokument, das später missverstanden wird. Es soll laut scheitern statt leise
  etwas Falsches auszugeben.
*/
let geworfen = false
try {
  alsPdfZeilen({ ...bericht, annahmen: [] }, JETZT)
} catch {
  geworfen = true
}
check('ohne Annahmen wird nicht ausgegeben, sondern geworfen', geworfen, true)

// ------------------------------------------------------------ Hervorhebung

const abschluesse = zeilen.filter((z) => z.art === 'abschluss')
check('genau ein Ergebnis ist hervorgehoben', abschluesse.length, 1)
check('und zwar das erste', abschluesse[0].text, 'Endkapital')

// ------------------------------------------------------- Fließtext im Block

/*
  Ein ganzer Satz in einem Block muss umbrechen. Als Wertepaar gesetzt lief er
  im ersten erzeugten PDF rechts aus dem Blatt – die Beobachtungen zur
  Verteilung waren nach zwei Dritteln abgeschnitten.
*/
const mitSatz = alsPdfZeilen(
  {
    ...bericht,
    bloecke: [
      {
        titel: 'Was auffällt',
        zeilen: [
          { bezeichnung: 'Ein langer Satz ohne eigenen Wert daneben.', wert: '' },
          { bezeichnung: 'Halbleiter', wert: '52,2 %' },
        ],
      },
    ],
  },
  JETZT
)
check(
  'ein Satz ohne Wert wird als Fließtext gesetzt',
  mitSatz.find((z) => z.text?.startsWith('Ein langer Satz'))?.art,
  'hinweis'
)
check(
  'ein Wertepaar bleibt ein Wertepaar',
  mitSatz.find((z) => z.text === 'Halbleiter')?.art,
  'zeile'
)

// -------------------------------------------------------------- Dateiname

check(
  'Dateiname ohne Umlaute und Leerzeichen',
  dateiname('Depotanalyse', JETZT, 'pdf'),
  'im-invests-depotanalyse-2026-07-31.pdf'
)
check(
  'Umlaute werden ausgeschrieben',
  dateiname('Vermögensübersicht groß', JETZT, 'csv'),
  'im-invests-vermoegensuebersicht-gross-2026-07-31.csv'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfungen fehlgeschlagen.`
)
if (failed > 0) process.exit(1)
