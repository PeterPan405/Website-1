/**
 * Die Regeln aus dem Briefing des Betreibers vom 14. Oktober 2026, soweit sie
 * sich prüfen lassen: direkte Links, höchstens zwei Sätze je Kachel, und ein
 * Sammler, dessen Adressen die Prüfung kennt.
 *
 * Ausführen mit `npm test`.
 */
import { readFileSync } from 'node:fs'
import { keinDirekterLink } from '@/lib/quellenlink.ts'
import { saetze, SAETZE_MAX, pruefeInstagramPlan } from '@/lib/instagram-plan.ts'
import { nachrichtenquellen } from '@/data/nachrichtenquellen.ts'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------------- Direkte Links */

const direkt = [
  'https://www.wallstreet-online.de/nachricht/21521533-oelpreis-106-us-dollar-huthis',
  'https://www.tagesschau.de/wirtschaft/finanzen/us-staatsanleihen-100.html',
  'https://www.wallstreet-online.de/rohstoffe/oelpreis-brent',
]
const nicht = [
  // Die drei häufigsten Quellen der Website bis zum 14. Oktober 2026.
  'https://www.wallstreet-online.de/nachrichten',
  'https://www.finanzen.net/nachrichten/',
  'https://www.onvista.de/news/',
  'https://www.goldreporter.de/',
  // Tief, aber eine Übersicht – nur über die Quellenliste erkennbar.
  'https://www.bundesbank.de/de/presse/pressenotizen',
  'https://www.bundesbank.de/de/presse/pressenotizen/',
  'http://bundesbank.de/de/presse/pressenotizen',
  // Ein Feed ist keine Meldung.
  'https://www.tagesschau.de/wirtschaft/index~rss2.xml',
  'kein Link',
]
for (const u of direkt) pruefe(`direkt: ${u}`, keinDirekterLink(u) === null)
for (const u of nicht) pruefe(`kein direkter Link: ${u}`, keinDirekterLink(u) !== null)

/* ------------------------------------------- Der Sammler und die Liste */

/*
  Jede Adresse, die der Sammler abruft, muss in `data/nachrichtenquellen.ts`
  stehen – sonst kennt `keinDirekterLink` sie nicht als Übersicht, und eine
  tiefe Übersichtsseite käme als „direkter Link" durch. Zwei Listen mit
  demselben Zweck gehen auseinander; diese Prüfung vergleicht sie.
*/
const sammler = readFileSync('.github/workflows/quellen-sammeln.yml', 'utf8')
const abgerufen = ['ADRESSEN', 'FEEDS'].flatMap((name) => {
  const block =
    sammler.match(new RegExp(`${name}: >-\\n((?:\\s+https\\S+\\n)+)`))?.[1] ?? ''
  return block.split(/\s+/).filter((a) => a.startsWith('http'))
})
const gepflegt = new Set(
  nachrichtenquellen.flatMap((r) => r.quellen.map((q) => q.adresse))
)
pruefe(
  'der Sammler ruft Seiten und Feeds ab',
  abgerufen.length >= 13,
  `${abgerufen.length}`
)
for (const a of abgerufen) pruefe(`in der Quellenliste: ${a}`, gepflegt.has(a))
for (const a of abgerufen)
  pruefe(`als Übersicht erkannt: ${a}`, keinDirekterLink(a) !== null)

/* --------------------------------------------- Zwei Sätze je Kachel */

const faelle: [string, number][] = [
  ['Der Nasdaq gab nach. TSMC meldete einen Rekordumsatz.', 2],
  ['Umsatz 2,3 Mrd. Euro im 3. Quartal. Die Aktie stieg.', 2],
  ['Die U.S. Fed hebt an, z. B. um 0,25 Punkte.', 1],
  ['Eins. Zwei. Drei.', 3],
  ['Wer gewinnt? Die Anleger.', 2],
  ['', 0],
]
for (const [text, n] of faelle)
  pruefe(`${n} Sätze: „${text}"`, saetze(text) === n, `gezählt: ${saetze(text)}`)

/* Die Gegenprobe am echten Plan: Er besteht, mit einem dritten Satz nicht mehr. */
const entwurf = JSON.parse(readFileSync('tests/fixtures/entwurf-2026-10-14.json', 'utf8'))
pruefe(
  'der Plan vom 14. Oktober hat höchstens zwei Sätze je Kachel',
  pruefeInstagramPlan(entwurf.instagram).length === 0,
  pruefeInstagramPlan(entwurf.instagram).join(' | ')
)
const drei = JSON.parse(JSON.stringify(entwurf.instagram))
drei.kacheln[0].text =
  'Brent steigt. Gold fällt. Silber auch, und zwar um 0,4 Prozent bis zum Abend.'.padEnd(
    110,
    ' '
  )
pruefe(
  `ein dritter Satz wird beanstandet (höchstens ${SAETZE_MAX})`,
  pruefeInstagramPlan(drei).some((s) => s.startsWith('Kachel 1: 3 Sätze'))
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
