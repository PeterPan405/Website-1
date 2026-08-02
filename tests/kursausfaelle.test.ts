/**
 * Prüfungen für den 404-Sammler des Kurslaufs.
 *
 * Die heikelste Regel zuerst: Der Halbstundenlauf darf einen schon gezählten
 * Tag nicht noch einmal zählen – sonst wird aus dem Tageszähler doch wieder
 * ein Läufezähler samt 42 Commits am Tag.
 */

import { auffaelligeAusfaelle, schreibeAusfaelleFort } from '../lib/kursausfaelle.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

const erster = schreibeAusfaelleFort(
  {},
  new Map([
    ['tot', '404'],
    ['gesund', 'ok'],
    ['wacklig', 'stoerung'],
  ]),
  '2026-07-30'
)
pruefe(
  'ein neues 404 beginnt mit Tag eins',
  erster.tot?.tage === 1 && erster.tot.seit === '2026-07-30'
)
pruefe('ok und Störung erzeugen keinen Eintrag', Object.keys(erster).length === 1)

const selberTag = schreibeAusfaelleFort(erster, new Map([['tot', '404']]), '2026-07-30')
pruefe(
  'derselbe Tag zählt nicht doppelt',
  selberTag.tot.tage === 1,
  `tage=${selberTag.tot.tage}`
)
pruefe(
  'ohne Änderung bleibt der Stand wörtlich gleich',
  JSON.stringify(selberTag) === JSON.stringify(erster)
)

const naechsterTag = schreibeAusfaelleFort(
  erster,
  new Map([['tot', '404']]),
  '2026-07-31'
)
pruefe(
  'der nächste Tag erhöht auf zwei und behält seit',
  naechsterTag.tot.tage === 2 &&
    naechsterTag.tot.seit === '2026-07-30' &&
    naechsterTag.tot.zuletzt === '2026-07-31'
)

const stoerung = schreibeAusfaelleFort(
  naechsterTag,
  new Map([['tot', 'stoerung']]),
  '2026-08-01'
)
pruefe('eine Störung löscht den Zähler nicht', stoerung.tot?.tage === 2)

const nichtGefragt = schreibeAusfaelleFort(naechsterTag, new Map(), '2026-08-01')
pruefe('ein nicht abgefragtes Symbol behält seinen Stand', nichtGefragt.tot?.tage === 2)

const geheilt = schreibeAusfaelleFort(
  naechsterTag,
  new Map([['tot', 'ok']]),
  '2026-08-01'
)
pruefe('ok tilgt den Eintrag', !('tot' in geheilt))

const dritterTag = schreibeAusfaelleFort(
  naechsterTag,
  new Map([['tot', '404']]),
  '2026-08-01'
)
pruefe(
  'unter drei Tagen wird nicht gemeldet',
  auffaelligeAusfaelle(naechsterTag).length === 0
)
pruefe(
  'ab drei Tagen wird gemeldet',
  auffaelligeAusfaelle(dritterTag)
    .map((a) => a.symbol)
    .join(',') === 'tot'
)

const sortiert = auffaelligeAusfaelle({
  b: { seit: '2026-07-01', zuletzt: '2026-08-01', tage: 5 },
  a: { seit: '2026-07-20', zuletzt: '2026-08-01', tage: 3 },
  c: { seit: '2026-07-01', zuletzt: '2026-08-01', tage: 5 },
})
pruefe(
  'Meldung sortiert nach Dauer, dann Name',
  sortiert.map((a) => a.symbol).join(',') === 'b,c,a'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
