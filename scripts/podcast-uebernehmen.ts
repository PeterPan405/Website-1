/**
 * Holt die bestehenden Folgen vom bisherigen Hoster in den eigenen Feed.
 *
 * ## Warum das vor dem Umzug passieren muss
 *
 * Bei Spotify trägt man eine Umleitung auf den neuen Feed ein. Danach ist
 * der neue Feed die Wahrheit – **was darin fehlt, verschwindet.** Zieht man
 * um, solange nur die Folgen von morgen darin stehen, sind die bisherigen
 * für jeden Hörer weg, samt Abrufzahlen und Verlinkungen.
 *
 * Dieses Skript liest deshalb den alten Feed, lädt jede Audiodatei herunter
 * und trägt die Folge ins eigene Register ein. Danach enthält der neue Feed
 * dieselben Folgen wie der alte – und der Umzug ist folgenlos.
 *
 * ## Was übernommen wird und was nicht
 *
 * Titel, Beschreibung, Datum und die Audiodatei. **Nicht** die Abrufzahlen:
 * Die liegen beim Hoster und lassen sich nicht mitnehmen. Wer sie braucht,
 * schreibt sie vorher aus dem Verwaltungsbereich ab.
 *
 * Die Folgennummer wird aus dem Erscheinungstag gerechnet: Der 30. Juli 2026
 * ist Folge 1, danach fortlaufend je Werktagsfolge – dieselbe Zählung, die
 * `podcast-folge-erzeugen.ts` verwendet.
 *
 * Aufruf: npm run uebernehmen        (nur planen, nichts laden)
 *         npm run uebernehmen -- --laden  (Dateien wirklich holen)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { leseFeed } from '../lib/podcast-feed.ts'

const FEED = process.env.PODCAST_RSS_URL?.trim()
const REGISTER = 'data/podcast-eigener-feed.json'
const ORDNER = 'podcast-archiv'
const LADEN = process.argv.includes('--laden')

if (!FEED) {
  console.error('[übernehmen] PODCAST_RSS_URL fehlt – ohne Quelle nichts zu holen.')
  process.exit(1)
}

interface Eintrag {
  datum: string
  titel: string
  nummer: number
  beschreibung: string
  dauerSekunden: number
  bytes: number
}

const register = JSON.parse(readFileSync(REGISTER, 'utf8')) as { folgen: Eintrag[] }

const antwort = await fetch(FEED, {
  headers: { 'User-Agent': 'IM-Invests Podcastumzug' },
})
if (!antwort.ok) {
  console.error(`[übernehmen] Feed nicht abrufbar (Status ${antwort.status}).`)
  process.exit(1)
}
const xml = await antwort.text()
const folgen = leseFeed(xml)

/*
  Die Audioadresse steht im `enclosure`-Element, nicht im `link` – der zeigt
  auf die Abspielseite beim Hoster. `lib/podcast-feed.ts` liest sie bisher
  nicht mit, weil die Website nur verlinkt und nichts abspielt; für den
  Umzug ist sie das Entscheidende.
*/
const bloecke = xml.split(/<item(?:\s[^>]*)?>/i).slice(1)
const audioAdressen = bloecke.map(
  (block) => block.match(/<enclosure[^>]*\surl="([^"]+)"/i)?.[1] ?? null
)

console.log(`[übernehmen] ${folgen.length} Folgen im alten Feed.`)
if (!LADEN) console.log('[übernehmen] Nur Übersicht – zum Holen mit --laden aufrufen.\n')

/** Der 30. Juli 2026 ist Folge 1; gezählt werden nur Werktage. */
function folgennummer(datum: string): number {
  const start = new Date('2026-07-30T00:00:00Z')
  const tag = new Date(`${datum}T00:00:00Z`)
  let nummer = 0
  for (let d = new Date(start); d <= tag; d.setUTCDate(d.getUTCDate() + 1)) {
    const wochentag = d.getUTCDay()
    if (wochentag !== 0 && wochentag !== 6) nummer += 1
  }
  return nummer
}

if (LADEN) mkdirSync(ORDNER, { recursive: true })

for (const [i, folge] of folgen.entries()) {
  const adresse = audioAdressen[i]
  const nummer = folgennummer(folge.datum)

  if (!adresse) {
    console.error(`::warning::[übernehmen] ${folge.datum}: keine Audioadresse im Feed.`)
    continue
  }
  if (!LADEN) {
    console.log(`  Folge ${nummer}  ${folge.datum}  ${folge.titel.slice(0, 55)}`)
    continue
  }

  const ziel = `${ORDNER}/${folge.datum}.mp3`
  if (existsSync(ziel)) {
    console.log(`  ${folge.datum}: liegt schon vor.`)
  } else {
    const datei = await fetch(adresse)
    if (!datei.ok) {
      console.error(`::warning::[übernehmen] ${folge.datum}: Status ${datei.status}.`)
      continue
    }
    writeFileSync(ziel, Buffer.from(await datei.arrayBuffer()))
    console.log(`  ${folge.datum}: geladen.`)
  }

  const bytes = readFileSync(ziel).length
  register.folgen = register.folgen.filter((e) => e.datum !== folge.datum)
  register.folgen.push({
    datum: folge.datum,
    titel: folge.titel,
    nummer,
    beschreibung: folge.beschreibung,
    /* Ohne Längenangabe im alten Feed lieber rechnen als raten: 128 kbit/s
       sind der übliche Wert eines Sprach-Podcasts. */
    dauerSekunden: folge.dauerSekunden ?? Math.round(bytes / 16000),
    bytes,
  })
}

if (LADEN) {
  register.folgen.sort((a, b) => (a.datum < b.datum ? 1 : -1))
  writeFileSync(REGISTER, JSON.stringify(register, null, 2) + '\n')
  console.log(`\n[übernehmen] Register: ${register.folgen.length} Folgen.`)
}
