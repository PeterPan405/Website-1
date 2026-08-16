/**
 * Veröffentlicht das Karussell der jüngsten Tagesausgabe bei @im_invests.
 *
 * Aufruf:  npm run instagram            – Trockenlauf, es geht nichts hinaus
 *          VEROEFFENTLICHEN=ja npm run instagram
 *
 * ## Der Weg bei Meta hat drei Stufen
 *
 * Ein Karussell entsteht nicht in einem Zug. Meta verlangt:
 *
 *   1. je Bild einen **Behälter** (`is_carousel_item=true`) → Kennung
 *   2. einen **Sammelbehälter** (`media_type=CAROUSEL`) mit diesen Kennungen
 *      und der Beschriftung → Kennung
 *   3. **Veröffentlichen** (`media_publish`) mit der Sammelkennung
 *
 * Erst Schritt 3 macht den Beitrag sichtbar. Die Schritte 1 und 2 lassen sich
 * also fahren, ohne dass jemand etwas sieht – genau das tut der Trockenlauf
 * nicht, denn auch ein unveröffentlichter Behälter kostet Kontingent. Er hört
 * vorher auf.
 *
 * ## Meta holt die Bilder selbst
 *
 * Übergeben wird eine **Adresse**, keine Datei. Die Bilder müssen also
 * öffentlich erreichbar sein, bevor dieser Lauf startet – sie entstehen beim
 * Bau unter `/instagram/1.png` und liegen nach der Übertragung auf dem
 * Webspace.
 *
 * Daraus folgt die Reihenfolge im Workflow: **erst bauen und übertragen, dann
 * veröffentlichen.** Wer das dreht, schickt Meta auf Adressen, die es noch
 * nicht gibt, und bekommt einen Beitrag mit Lücken oder gar keinen.
 *
 * ## Warum der Trockenlauf die Voreinstellung ist
 *
 * Ein Beitrag bei Instagram ist nicht zurückzunehmen, nur zu löschen – und
 * gesehen haben ihn dann schon welche. Der Lauf muss deshalb ausdrücklich
 * scharf gestellt werden. Dieselbe Vorsicht wie beim Podcast-Upload.
 */

import { existsSync, readFileSync } from 'node:fs'

const API = 'https://graph.facebook.com/v21.0'

const TOKEN = process.env.IG_ACCESS_TOKEN?.trim() ?? ''
const KONTO = process.env.IG_USER_ID?.trim() ?? ''
const SCHARF = process.env.VEROEFFENTLICHEN?.trim().toLowerCase() === 'ja'
const BASIS = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iminvests.de').replace(
  /\/+$/,
  ''
)

function melde(text: string): void {
  console.log(`[instagram] ${text}`)
}

/**
 * Ein Aufruf an die Graph-Schnittstelle, mit sprechendem Fehler.
 *
 * Meta antwortet auf fast jeden Fehler mit `200` und einem `error`-Feld im
 * Rumpf – wer nur den Statuscode ansieht, hält einen Fehlschlag für Erfolg.
 */
async function graph(
  pfad: string,
  felder: Record<string, string>
): Promise<Record<string, unknown>> {
  const rumpf = new URLSearchParams({ ...felder, access_token: TOKEN })
  const antwort = await fetch(`${API}/${pfad}`, { method: 'POST', body: rumpf })
  const daten = (await antwort.json()) as Record<string, unknown>

  const fehler = daten.error as { message?: string; code?: number } | undefined
  if (fehler) {
    throw new Error(
      `Meta lehnt ab (${fehler.code ?? '?'}): ${fehler.message ?? 'ohne Grund'}`
    )
  }
  if (!antwort.ok) {
    throw new Error(`Meta antwortet mit ${antwort.status}.`)
  }
  return daten
}

/**
 * Wartet, bis Meta ein Bild geholt und verarbeitet hat.
 *
 * `media_publish` auf einen Behälter, der noch `IN_PROGRESS` ist, scheitert.
 * Meta lädt das Bild von der übergebenen Adresse – das dauert, und wie lange,
 * hängt an ihrem Server, nicht an unserem.
 */
async function warteAufFertig(kennung: string, sekunden = 60): Promise<void> {
  const frist = Date.now() + sekunden * 1000
  while (Date.now() < frist) {
    const antwort = await fetch(
      `${API}/${kennung}?fields=status_code&access_token=${encodeURIComponent(TOKEN)}`
    )
    const daten = (await antwort.json()) as {
      status_code?: string
      error?: { message?: string }
    }
    if (daten.error) throw new Error(`Zustand nicht lesbar: ${daten.error.message}`)
    if (daten.status_code === 'FINISHED') return
    if (daten.status_code === 'ERROR') {
      throw new Error(`Meta konnte das Bild nicht verarbeiten (Behälter ${kennung}).`)
    }
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error(`Behälter ${kennung} wurde in ${sekunden} s nicht fertig.`)
}

// ---------------------------------------------------------------- Vorbereiten

if (!existsSync('out/instagram')) {
  melde('Kein Verzeichnis out/instagram – erst `npm run build`, dann dieser Lauf.')
  process.exit(1)
}

const { readdirSync } = await import('node:fs')
const kacheln = readdirSync('out/instagram')
  .filter((n) => /^\d+\.png$/.test(n))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

if (kacheln.length < 2) {
  melde(`Nur ${kacheln.length} Kachel(n) – ein Karussell braucht mindestens zwei.`)
  process.exit(1)
}
if (kacheln.length > 10) {
  // Instagram nimmt höchstens zehn. Mehr wäre ein Fehler, der erst bei Meta
  // auffiele – also hier abfangen, wo der Grund noch sichtbar ist.
  melde(`${kacheln.length} Kacheln – Instagram nimmt höchstens zehn.`)
  process.exit(1)
}

/*
  Die Beschriftung kommt aus demselben Bau wie die Kacheln
  (`app/instagram/beschriftung.txt/route.ts`). Fehlt sie, wird ohne Text
  veröffentlicht – ein Beitrag ohne Beschriftung ist mager, aber kein Grund,
  die Bilder zurückzuhalten.
*/
const TEXTDATEI = 'out/instagram/beschriftung.txt'
const beschriftung = existsSync(TEXTDATEI) ? readFileSync(TEXTDATEI, 'utf8').trim() : ''

const adressen = kacheln.map((n) => `${BASIS}/instagram/${n}`)

melde(`${kacheln.length} Kacheln, Basis ${BASIS}`)
for (const a of adressen) melde(`  ${a}`)

if (!SCHARF) {
  melde('')
  melde('Trockenlauf – es geht nichts hinaus.')
  melde('Scharf stellen mit VEROEFFENTLICHEN=ja.')
  process.exit(0)
}

if (!TOKEN || !KONTO) {
  melde('IG_ACCESS_TOKEN oder IG_USER_ID fehlt – siehe EINRICHTUNG.md, Abschnitt 3.7.')
  process.exit(1)
}

// ---------------------------------------------------------------- Hochladen

melde('')
const kennungen: string[] = []
for (const [i, adresse] of adressen.entries()) {
  const antwort = await graph(`${KONTO}/media`, {
    image_url: adresse,
    is_carousel_item: 'true',
  })
  const kennung = String(antwort.id)
  await warteAufFertig(kennung)
  kennungen.push(kennung)
  melde(`Kachel ${i + 1}/${adressen.length} bei Meta: ${kennung}`)
}

const sammel = await graph(`${KONTO}/media`, {
  media_type: 'CAROUSEL',
  children: kennungen.join(','),
  ...(beschriftung ? { caption: beschriftung } : {}),
})
const sammelKennung = String(sammel.id)
await warteAufFertig(sammelKennung, 120)
melde(`Sammelbehälter: ${sammelKennung}`)

const veroeffentlicht = await graph(`${KONTO}/media_publish`, {
  creation_id: sammelKennung,
})

melde('')
melde(`Veröffentlicht: ${String(veroeffentlicht.id)}`)
melde('https://www.instagram.com/im_invests/')
