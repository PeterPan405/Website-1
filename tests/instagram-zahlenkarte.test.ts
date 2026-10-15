/**
 * Die Zahlenkarte: Daten, Beschriftung und das gesetzte Bild.
 *
 * Ausführen mit `npm test`. Anlass und Form in `lib/instagram-zahlenkarte.ts`.
 */
import { readFileSync } from 'node:fs'

import { zahlenkarten, aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { RECHTSHINWEIS } from '@/lib/instagram-plan'
import {
  beschriftungZahlenkarte,
  pruefeZahlenkarte,
  zahlenkartePng,
  ZK_BREITE,
  ZK_HOEHE,
  type Zahlenkarte,
} from '@/lib/instagram-zahlenkarte'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

for (const k of zahlenkarten)
  pruefe(
    `Karte vom ${k.datum} hält die Form ein`,
    pruefeZahlenkarte(k).length === 0,
    pruefeZahlenkarte(k).join(' | ')
  )
pruefe(
  'jedes Datum höchstens einmal',
  new Set(zahlenkarten.map((k) => k.datum)).size === zahlenkarten.length
)

/* Die Prüfung muss beanstanden, was das Muster verfehlt. */
const gut = aktuelleZahlenkarte()!
const kaputt: Zahlenkarte = {
  ...gut,
  titel: [{ text: 'Ohne Pointe' }],
  fusszeile: 'Stand: 2025',
  schlagworte: ['a b', 'zwei'],
  text: 'Kein Quellenhinweis',
}
const fehler = pruefeZahlenkarte(kaputt)
for (const teil of [
  'grüne Pointe',
  'keine Quelle',
  'Quellen',
  'genau fünf',
  'Schlagwort „a b"',
])
  pruefe(
    `beanstandet: ${teil}`,
    fehler.some((f) => f.includes(teil)),
    fehler.join(' | ')
  )

/* Beschriftung: Rechtshinweis mit KI-Hinweis wörtlich, fünf Schlagworte. */
const b = beschriftungZahlenkarte(gut)
pruefe('die Beschriftung trägt den Rechtshinweis wörtlich', b.includes(RECHTSHINWEIS))
pruefe('und den KI-Hinweis', b.includes('mit Unterstützung von KI erstellt'))
pruefe('fünf Schlagworte', (b.match(/#[a-zäöüß0-9]+/g) ?? []).length === 5)

/*
  Die Zahlen der Karte vom 15.10.2026 stammen aus dem Datenbestand der
  Website – und dürfen sich nicht unbemerkt davon lösen.
*/
const laender = JSON.parse(readFileSync('data/snapshots/laender.json', 'utf8')).laender
const wohnen = zahlenkarten.find((k) => k.datum === '2026-10-15')!
pruefe(
  'Deutschland wie im Bestand',
  wohnen.links.wert === laender.DEU.wohneigentumsquote.wert
)
pruefe('Polen wie im Bestand', wohnen.rechts.wert === laender.POL.wohneigentumsquote.wert)
pruefe(
  'die Differenz ist gerechnet, nicht getippt',
  wohnen.differenz.text ===
    `+${(wohnen.rechts.wert - wohnen.links.wert).toFixed(1).replace('.', ',')}`
)

/* Das Bild: PNG im Format 1080 × 1350. */
const png = await zahlenkartePng(gut, readFileSync('public/logo.svg', 'utf8'))
pruefe('das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
pruefe(
  `im Format ${ZK_BREITE} × ${ZK_HOEHE}`,
  png.readUInt32BE(16) === ZK_BREITE && png.readUInt32BE(20) === ZK_HOEHE,
  `${png.readUInt32BE(16)} × ${png.readUInt32BE(20)}`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
