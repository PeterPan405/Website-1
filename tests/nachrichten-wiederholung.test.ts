/**
 * Nichts vom Vortag noch einmal – und keine Quellen gegeneinander.
 *
 * Ausführen mit `npm test`. Geprüft wird `lib/nachrichten-wiederholung.ts`
 * und der Riegel in `scripts/nachrichten-erzeugen.ts`, der es benutzt.
 *
 * ## Der Anlass
 *
 * Am 14. Oktober 2026 schickte der Betreiber drei Bildschirmfotos des
 * Karussells: „wir brauchen keine news doppelt", und zu „Ölpreis: Übersicht
 * nennt 107 Dollar, Kursleiste zeigt 106,37": „klingt unsicher, ist
 * verwirrend und unseriös."
 *
 * `tests/fixtures/entwurf-2026-10-14.json` ist der Entwurf des Agenten von
 * diesem Morgen, unverändert vom Zweig `nachrichten-entwurf`. Er ist der
 * Prüfstein: Der Riegel muss ihn aus genau diesen beiden Gründen
 * zurückweisen – und darf ihn nicht mehr zurückweisen, sobald sie behoben
 * sind.
 */

import { readFileSync } from 'node:fs'
import {
  aehnlichkeit,
  quellenstreit,
  themenwoerter,
  ueberschriftenVortag,
  wiederholungen,
  WIEDERHOLUNG_AB,
} from '@/lib/nachrichten-wiederholung.ts'
import { pruefe } from '@/scripts/nachrichten-erzeugen.ts'

let failed = 0
function pruefeDass(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* --------------------------------------------------------- Die Bausteine */

pruefeDass(
  '„Ölpreis" und „Öl" sind dasselbe Thema',
  themenwoerter('Ölpreis steigt').has('öl')
)
pruefeDass(
  'derselbe Titel ist eine Wiederholung',
  aehnlichkeit('Gold hält 4.200', 'Gold hält 4.200') === 1
)
pruefeDass(
  'zwei fremde Themen sind keine',
  aehnlichkeit('Evotec übertrifft Erwartungen', 'Lagarde spricht in Frankfurt') === 0
)
pruefeDass(
  '„Kursleiste" wird erkannt',
  quellenstreit('laut Kursleiste 106,37') === 'Kursleiste'
)
pruefeDass(
  'ein gewöhnlicher Satz nicht',
  quellenstreit('Brent steigt auf 107 Dollar.') === null
)

/* ------------------------------------------- Die Überschriften des Vortags */

const news = readFileSync('data/news.ts', 'utf8')
const GESTERN_13_10 = [
  'Drei Notenbanker sprechen am Dienstag, deutsche Inflation im Fokus',
  'Öl steigt auf 106 Dollar, Gold und Silber geben nach',
  'Dow im Plus, Technologiewerte unter Druck vor der Berichtssaison',
  'US-Midterms: BofA sieht für Aktien ein Entweder-oder',
  'Dax erholt sich weiter, Rüstungswerte bleiben gefragt',
]
const gelesen = ueberschriftenVortag(news, '2026-10-14')
pruefeDass(
  'der Vortag des 14. Oktober ist der 13., mit seinen fünf Überschriften',
  JSON.stringify([...gelesen].sort()) === JSON.stringify([...GESTERN_13_10].sort()),
  `gelesen: ${JSON.stringify(gelesen)}`
)
/* Lange Titel stehen in zwei Zeilen: `title:` und darunter der Text. */
const zweizeilig = ueberschriftenVortag(
  "export const news = [\n  {\n    slug: 'a',\n    title:\n      'Ein sehr langer Titel',\n    publishedAt: '2026-01-01T07:00:00+01:00',\n  },\n]\n",
  '2026-01-02'
)
pruefeDass(
  'ein zweizeiliger Titel wird gelesen',
  zweizeilig[0] === 'Ein sehr langer Titel'
)
pruefeDass(
  'der Stichtag selbst zählt nicht als Vortag',
  ueberschriftenVortag(news, '2026-10-13').every((t) => !GESTERN_13_10.includes(t))
)

/* ------------------------------------------------- Die Grenze am Bestand */

/*
  Gemessen am 14. Oktober 2026 über alle Tage bis dahin. Neue Tage ändern
  daran nichts – geprüft wird nur, was bis zu diesem Tag erschienen ist.
  Ändert sich eine der beiden Listen, wurde an Grenze oder Füllwörtern
  gedreht, und der Kommentar an `WIEDERHOLUNG_AB` gehört neu geschrieben.
*/
const proTag = new Map<string, string[]>()
for (const block of news.split(/\n {2}\{\n/).slice(1)) {
  const titel = block.match(/^ {4}title:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/m)?.[1]
  const tag = block.match(/^ {4}publishedAt:\s*'(\d{4}-\d{2}-\d{2})/m)?.[1]
  if (!titel || !tag || tag > '2026-10-14') continue
  if (!proTag.has(tag)) proTag.set(tag, [])
  proTag.get(tag)!.push(titel)
}
const gefunden = new Set<string>()
for (const [tag, titel] of proTag)
  for (const w of wiederholungen(titel, ueberschriftenVortag(news, tag)))
    gefunden.add(w.titel)

const MUSS = [
  'Gold pendelt nahe 4.200 Dollar, Silber gibt weiter nach',
  'Öl steigt auf 106 Dollar, Gold und Silber geben nach',
  'Silber nähert sich 61 Dollar, Gold hält die Linie',
  'Gold nähert sich 4.200 Dollar, Spekulanten bauen ab',
  'Gold nähert sich 4.200 Dollar – trotz steigender Renditen',
  'Fünf PMI-Werte und zwei EZB-Reden zum Wochenstart',
  'Der Dax schließt erstmals über 26.000 Punkten – und zwei Quellen nennen zwei Zahlen',
  'Brent bei 88,14 oder 90,12 Dollar? Beide Zahlen stimmen',
]
const DARF_NICHT = [
  'HPE übertrifft alle Erwartungen – die Aktie fällt trotzdem',
  'Öl fällt trotz neuer Zwischenfälle in der Straße von Hormus',
  'Diesel-Deal mit Russland: Diese Mengen hat Trump zugesagt',
]
for (const t of MUSS)
  pruefeDass(`Wiederholung erkannt: ${t.slice(0, 50)}`, gefunden.has(t))
for (const t of DARF_NICHT)
  pruefeDass(`neue Entwicklung erlaubt: ${t.slice(0, 50)}`, !gefunden.has(t))
pruefeDass(
  `genau ${MUSS.length} Treffer bis zum 14. Oktober, nicht mehr`,
  gefunden.size === MUSS.length,
  `gefunden: ${[...gefunden].filter((t) => !MUSS.includes(t)).join(' | ')}`
)
pruefeDass(
  'die Grenze steht bei einem Drittel',
  Math.abs(WIEDERHOLUNG_AB - 1 / 3) < 1e-12
)

/* ------------------------------------------- Der Riegel am echten Entwurf */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entwurf = any
const entwurf: Entwurf = JSON.parse(
  readFileSync('tests/fixtures/entwurf-2026-10-14.json', 'utf8')
)

/*
  Alles, was nicht zu dieser Prüfung gehört, wird aus dem Entwurf selbst
  erlaubt: seine Themen, seine Symbole, keine vorhandenen Slugs. Der
  Entwurf hat die Probe am 14. Oktober bestanden – stehen jetzt Fehler da,
  dann diese.
*/
function riegel(e: Entwurf, vortag: string[]): string[] {
  const themen = new Set<string>(e.artikel.flatMap((a: Entwurf) => a.relatedTopics))
  const symbole = new Set<string>(e.artikel.flatMap((a: Entwurf) => a.relatedSymbols))
  return pruefe(e, themen, symbole, new Set(), vortag)
}
const WDH = 'wiederholt die Überschrift vom Vortag'
const STREIT = 'eine Abweichung zwischen Quellen ist kein Thema'

const vorher = riegel(entwurf, GESTERN_13_10)
pruefeDass(
  'der Entwurf vom 14. Oktober bestand ohne diese Prüfung alles andere',
  vorher.every((s) => s.includes(WDH) || s.includes(STREIT)),
  vorher.filter((s) => !s.includes(WDH) && !s.includes(STREIT)).join('\n     ')
)
pruefeDass(
  'Gold/Silber wird als Wiederholung vom 13. zurückgewiesen',
  vorher.some((s) => s.includes(WDH) && s.includes('Gold pendelt nahe 4.200'))
)
/* Je Feld einzeln – sonst trüge der Anreißer die Prüfung des Titels mit. */
for (const feld of ['title', 'metaTitle', 'teaser']) {
  pruefeDass(
    `der Öl-Artikel wird im Feld ${feld} als Quellenstreit zurückgewiesen`,
    vorher.some(
      (s) =>
        s.includes(STREIT) &&
        s.includes(`oelpreis-uebersicht-nennt-107-kursleiste-106", ${feld}:`)
    )
  )
}
pruefeDass(
  'und die Meldung der Tagesausgabe ebenso',
  vorher.some((s) => s.includes(STREIT) && s.startsWith('Meldung „Brent über 107'))
)

/* Und behoben: zwei Artikel neu überschrieben, „Kursleiste" heraus. */
const behoben: Entwurf = JSON.parse(JSON.stringify(entwurf))
const raus = (t: string) =>
  t
    .replace(/,? ?(laut |die |auf der )?Kursleiste[^,.–]*/g, '')
    .replace(/zwei Quellen/g, 'die Quelle')
for (const a of behoben.artikel) {
  if (a.slug.startsWith('oelpreis')) {
    a.title = 'Brent steigt über 107 Dollar, Raketen auf Kiew'
    a.metaTitle = undefined
    a.teaser =
      'Brent steigt laut wallstreet-online am Mittwochmorgen über 107 Dollar; in der Nacht trafen Raketen die ukrainische Hauptstadt.'
  }
  if (a.slug.startsWith('gold-silber')) a.title = 'Evotec-Zahlen ziehen Biotech-Werte mit'
  a.teaser = raus(a.teaser)
  if (a.metaTitle) a.metaTitle = raus(a.metaTitle)
}
behoben.intro = raus(behoben.intro)
for (const m of [...behoben.top, ...behoben.further]) {
  m.headline = raus(m.headline)
  m.summary = m.summary.map(raus)
  m.whyItMatters = raus(m.whyItMatters)
}
const nachher = riegel(behoben, GESTERN_13_10).filter(
  (s) => s.includes(WDH) || s.includes(STREIT)
)
pruefeDass(
  'behoben, besteht derselbe Entwurf – der Riegel weist nicht alles zurück',
  nachher.length === 0,
  nachher.join('\n     ')
)
pruefeDass(
  'ohne Vortag gibt es keine Wiederholung',
  !riegel(entwurf, []).some((s) => s.includes(WDH))
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
