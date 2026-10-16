/**
 * Die Wirtschaftstermine von ForexFactory – an der echten Woche.
 *
 * Ausführen mit `npm test`. `tests/fixtures/forexfactory-2026-10-16.json`
 * ist die Antwort, die ein Läufer am 16.10.2026 um 07:33 UTC von
 * `nfs.faireconomy.media/ff_calendar_thisweek.json` geholt hat, unverändert.
 * Anlass und Regeln in `lib/konjunkturkalender.ts`.
 */
import { readFileSync } from 'node:fs'

import type { Termin } from '@/data/kalender/typen'
import { validateTermine } from '@/lib/kalender-validate'
import {
  FAMILIEN,
  inBerlin,
  konjunkturtermine,
  mischeFeed,
  pruefeFeed,
  serialisiereFf,
  wertDeutsch,
  type FfEreignis,
} from '@/lib/konjunkturkalender'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const woche: FfEreignis[] = JSON.parse(
  readFileSync('tests/fixtures/forexfactory-2026-10-16.json', 'utf8')
)

/* ---------------------------------------------------------- Die Antwort */

pruefe(
  'die echte Woche gilt als Kalender',
  pruefeFeed(woche).length === 0,
  pruefeFeed(woche).join(' | ')
)
pruefe('eine leere Liste nicht', pruefeFeed([]).length > 0)
pruefe(
  'eine Seite statt JSON-Liste nicht',
  pruefeFeed({ fehler: 'Rate limited' }).length > 0
)
pruefe(
  'Einträge ohne Datum nicht',
  pruefeFeed(woche.map((e) => ({ ...e, date: 'morgen' }))).length > 0
)

/* --------------------------------------------------------------- Zeiten */

pruefe(
  '08:30 New York im Oktober ist 14:30 in Berlin',
  inBerlin('2026-10-14T08:30:00-04:00').uhrzeit === '14:30 Uhr'
)
pruefe(
  'auch in der Woche, in der nur Europa umgestellt hat',
  inBerlin('2026-10-28T08:30:00-04:00').uhrzeit === '13:30 Uhr',
  JSON.stringify(inBerlin('2026-10-28T08:30:00-04:00'))
)
pruefe(
  'und im Winter wieder 14:30',
  inBerlin('2026-11-12T08:30:00-05:00').uhrzeit === '14:30 Uhr'
)
pruefe(
  '22:10 New York ist in Berlin der nächste Tag',
  inBerlin('2026-10-13T22:10:00-04:00').tag === '2026-10-14'
)
pruefe(
  'Mitternacht New York heißt: keine Uhrzeit',
  inBerlin('2026-10-14T00:00:00-04:00').uhrzeit === null
)

pruefe('0.3% → 0,3 %', wertDeutsch('0.3%') === '0,3 %')
pruefe('215K → 215 Tsd.', wertDeutsch('215K') === '215 Tsd.')
pruefe('-0.1% → -0,1 %', wertDeutsch('-0.1%') === '-0,1 %')
pruefe('leer bleibt leer', wertDeutsch('') === undefined)

/* -------------------------------------------------------------- Mischen */

const alt = {
  abgerufen: '2026-10-09T00:00:00Z',
  ereignisse: [
    {
      title: 'Alt behalten',
      country: 'USD',
      date: '2026-10-06T08:30:00-04:00',
      impact: 'High',
    },
    {
      title: 'Zu alt',
      country: 'USD',
      date: '2026-07-01T08:30:00-04:00',
      impact: 'High',
    },
    {
      title: 'Gestrichen',
      country: 'USD',
      date: '2026-10-13T08:30:00-04:00',
      impact: 'High',
    },
  ],
}
const gemischt = mischeFeed(alt, woche, new Date('2026-10-16T07:33:25Z'))
const titel = new Set(gemischt.ereignisse.map((e) => e.title))
pruefe('die Vorwoche bleibt stehen', titel.has('Alt behalten'))
pruefe('was älter als 70 Tage ist, fällt heraus', !titel.has('Zu alt'))
pruefe('was die neue Woche nicht mehr nennt, fällt heraus', !titel.has('Gestrichen'))
pruefe('die neue Woche ist ganz drin', gemischt.ereignisse.length === woche.length + 1)
pruefe(
  'zweimal dieselbe Woche verdoppelt nichts',
  mischeFeed(gemischt, woche, new Date('2026-10-16T09:00:00Z')).ereignisse.length ===
    gemischt.ereignisse.length
)
pruefe(
  'die Datei ist gültiges JSON',
  JSON.parse(serialisiereFf(gemischt)).ereignisse.length === gemischt.ereignisse.length
)

/* --------------------------------------------------------------- Termine */

const { termine, ohneEinordnung } = konjunkturtermine(woche)
const finde = (t: string) => termine.find((x) => x.titel === t)

const cpi = finde('USA: Verbraucherpreise')
pruefe(
  'US-Inflation steht drin – am 14.10. um 14:30 Uhr',
  cpi?.datum === '2026-10-14' && cpi?.uhrzeit === '14:30 Uhr',
  JSON.stringify(cpi)
)
pruefe('… als ein Termin mit vier Werten', cpi?.werte?.length === 4)
pruefe(
  '… mit Prognose und Vorwert wie in der Quelle',
  cpi?.werte?.some(
    (w) => w.name === 'CPI ggü. Vorjahr' && w.prognose === '3,6 %' && w.vorher === '3,4 %'
  ) ?? false,
  JSON.stringify(cpi?.werte)
)
pruefe(
  'Lagardes zwei Reden am 14.10. sind ein Termin',
  termine.filter((t) => t.titel.includes('Lagarde')).length === 1
)
pruefe(
  'Bailey nur mit der hoch eingestuften Rede',
  termine.filter((t) => t.titel.includes('Bailey')).length === 1
)
pruefe('Warsh (Fed) steht drin', !!termine.find((t) => t.titel.includes('Warsh (Fed)')))
pruefe(
  'Australien nicht – nicht unser Markt',
  !termine.some((t) => t.ort === 'Australien' || t.titel.includes('Employment Change'))
)
pruefe(
  'nichts niedrig Eingestuftes außer deutschen Kerndaten',
  termine.every(
    (t) => t.ort === 'Deutschland' || t.werte?.length || t.art === 'notenbank'
  )
)
pruefe(
  'ohne Einordnung bleibt draußen und wird genannt',
  ohneEinordnung.includes('EUR: EU Economic Summit')
)
pruefe(
  'jeder Termin besteht die Kalenderprüfung',
  validateTermine(termine).length === 0,
  validateTermine(termine).join(' | ')
)

/* Was von Hand drinsteht, kommt nicht doppelt. */
const gepflegt: Termin = {
  datum: '2026-10-14',
  titel: 'US-Verbraucherpreise für September',
  art: 'konjunktur',
  ort: 'USA',
  bedeutung: 'Von Hand gepflegt – mit besserer Einordnung als jede automatische.',
  quelle: { label: 'BLS', url: 'https://www.bls.gov/' },
}
const ohneDoppel = konjunkturtermine(woche, [gepflegt]).termine
pruefe(
  'der gepflegte Termin verdrängt den aus ForexFactory',
  !ohneDoppel.some((t) => t.titel === 'USA: Verbraucherpreise')
)
pruefe('… und nur ihn', ohneDoppel.length === termine.length - 1)

/* Wie oft greift jede Familie an echtem Material? Gemeldet, nicht verlangt. */
const treffer = FAMILIEN.map(
  (f) => `${f.id} ${woche.filter((e) => f.muster.test(e.title)).length}`
)
console.log(`     Familien in der Woche vom 12.10.: ${treffer.join(', ')}`)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
