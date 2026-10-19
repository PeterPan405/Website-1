/**
 * Teilt die Tagesnews oder die Zahlenkarte auf X (Twitter).
 *
 *     node --experimental-strip-types scripts/x-veroeffentlichen.ts tagesnews
 *     node --experimental-strip-types scripts/x-veroeffentlichen.ts zahlenkarte
 *
 * Gestartet von `.github/workflows/x-beitrag.yml`. Anordnung des Betreibers
 * vom 17.10.2026: „Ich möchte die News und Beiträge auch auf Twitter (X)
 * automatisch teilen." Texte aus `/x/heute.json` (`lib/x-text.ts`), Bilder
 * aus `/instagram/` – dieselben, die Instagram bekommt.
 *
 * ## Riegel, alle vor dem ersten Aufruf bei X
 *
 *   0. Die vier Schlüssel sind da – sonst ist X noch nicht eingerichtet, und
 *      der Lauf endet grün mit einem Hinweis (`werkzeuge/x-einrichten.md`).
 *   1. Die Website zeigt den Beitrag von **heute** (deutscher Kalendertag).
 *   2. Zahlenkarte: Freigabe ist heute, und es ist 15 Uhr vorbei – dieselben
 *      Regeln wie bei Instagram (`lib/zahlenkarten-wecker.ts`).
 *   3. In der Marke (`x-gepostet.txt` auf dem Zweig `x-gepostet`) steht für
 *      heute und diese Art noch nichts. Gefragt wird die Marke, nicht der
 *      Kanal: Jede gelesene Post kostet bei X Geld.
 *   4. Jedes Bild antwortet als JPEG.
 *
 * Ohne `SCHARF=ja` ist es ein **Trockenlauf**: Texte und Bilder werden
 * geprüft und gezeigt, hinaus geht nichts.
 *
 * ## Anmeldung
 *
 * OAuth 1.0a im Namen des Kontos – vier Werte aus der App im
 * X-Entwicklerportal: `X_API_KEY`, `X_API_SECRET` (die App) und
 * `X_ACCESS_TOKEN`, `X_ACCESS_SECRET` (das Konto, mit Lese- und
 * Schreibrecht erzeugt). Signiert wird nur über die OAuth-Werte: Bei JSON
 * und multipart gehört der Rumpf nicht in die Signatur.
 *
 * **Ungeprüft gegen die echte Schnittstelle**, als es entstand – diese
 * Umgebung erreicht X nicht. Der erste Lauf ist deshalb ein Trockenlauf und
 * der zweite einer mit `scharf`, von Hand und beobachtet.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs'

import { oauthKopf, type XSchluessel } from '../lib/x-oauth.ts'
import { AB_MINUTE, berlinJetzt } from '../lib/zahlenkarten-wecker.ts'

const ART = process.argv[2]
if (ART !== 'tagesnews' && ART !== 'zahlenkarte') {
  console.error('Aufruf: x-veroeffentlichen.ts tagesnews|zahlenkarte')
  process.exit(2)
}

const API = 'https://api.x.com/2'
const BASIS = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iminvests.de').replace(
  /\/+$/,
  ''
)
const SCHLUESSEL: XSchluessel = {
  key: process.env.X_API_KEY?.trim() ?? '',
  secret: process.env.X_API_SECRET?.trim() ?? '',
  token: process.env.X_ACCESS_TOKEN?.trim() ?? '',
  tokenSecret: process.env.X_ACCESS_SECRET?.trim() ?? '',
}
const SCHARF = process.env.SCHARF === 'ja'
const MARKE = process.env.MARKE ?? 'x-gepostet.txt'
const NEU = process.env.MARKE_NEU ?? 'x-gepostet-neu.txt'

const melde = (s: string) => console.log(`[x] ${s}`)
/* Eine Funktion, kein Pfeil: nur so engt TypeScript nach dem Aufruf ein. */
function halt(s: string): never {
  melde(s)
  melde('Es geht nichts hinaus.')
  process.exit(0)
}

// Riegel 0
if (Object.values(SCHLUESSEL).some((v) => !v)) {
  console.log(
    '::notice::X ist noch nicht eingerichtet (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET) – siehe werkzeuge/x-einrichten.md.'
  )
  halt('Keine Schlüssel.')
}

const { tag: HEUTE, minute } = berlinJetzt(new Date())

type Heute = {
  tagesnews:
    | {
        datum: string
        haupt: string
        antwort: string
        bilder: { haupt: number[]; antwort: number[] }
      }
    | { datum: string; grund: string }
  zahlenkarte: { datum: string; freigabe: string | null; text: string } | null
}
const antwort = await fetch(`${BASIS}/x/heute.json?d=${HEUTE}`, { cache: 'no-store' })
if (!antwort.ok) halt(`${BASIS}/x/heute.json antwortet mit ${antwort.status}.`)
const heute = (await antwort.json()) as Heute

/* Was hinausginge: ein oder zwei Posts, jeder mit Text und Bildern. */
const posts: { text: string; bilder: string[] }[] = []

if (ART === 'tagesnews') {
  const t = heute.tagesnews
  // Riegel 1
  if (t.datum !== HEUTE)
    halt(`Die Website zeigt die Ausgabe vom ${t.datum}, nicht von heute (${HEUTE}).`)
  if ('grund' in t) halt(`Heute kein Tagesbeitrag: ${t.grund}`)
  const bild = (n: number) => `${BASIS}/instagram/${n}.jpg?d=${HEUTE}`
  posts.push({ text: t.haupt, bilder: t.bilder.haupt.map(bild) })
  if (t.bilder.antwort.length > 0)
    posts.push({ text: t.antwort, bilder: t.bilder.antwort.map(bild) })
} else {
  const k = heute.zahlenkarte
  if (!k) halt('Es gibt keine Zahlenkarte.')
  // Riegel 2
  if (minute < AB_MINUTE)
    halt('Die Zahlenkarte geht frühestens um 15 Uhr hinaus – wie auf Instagram.')
  if (k.freigabe !== HEUTE)
    halt(`Freigabe „${k.freigabe ?? '–'}" ist nicht heute (${HEUTE}).`)
  // Riegel 1
  if (k.datum !== HEUTE) halt(`Die Website zeigt die Karte vom ${k.datum}.`)
  posts.push({ text: k.text, bilder: [`${BASIS}/instagram/zahlenkarte.jpg?d=${HEUTE}`] })
}

// Riegel 3
const marken = existsSync(MARKE) ? readFileSync(MARKE, 'utf8') : ''
const schon = marken.split('\n').find((z) => z.startsWith(`${HEUTE} ${ART} `))
if (schon) halt(`Steht schon auf X: ${schon}`)

// Riegel 4
const jpegs: Buffer[][] = []
for (const p of posts) {
  const liste: Buffer[] = []
  for (const adresse of p.bilder) {
    const r = await fetch(adresse, { cache: 'no-store' })
    const daten = Buffer.from(await r.arrayBuffer())
    if (!r.ok || daten[0] !== 0xff || daten[1] !== 0xd8)
      halt(`${adresse} ist kein JPEG (${r.status}, ${r.headers.get('content-type')}).`)
    liste.push(daten)
  }
  jpegs.push(liste)
}

for (const [i, p] of posts.entries()) {
  melde(`Post ${i + 1}/${posts.length}, ${p.bilder.length} Bild(er):`)
  for (const zeile of p.text.split('\n')) melde(`  ${zeile}`)
}

if (!SCHARF) halt('Trockenlauf – zum Veröffentlichen SCHARF=ja.')

/** Was X zurückgibt – nur die Felder, die hier gelesen werden. */
type XAntwort = { data?: { id?: string }; media_id_string?: string }

async function rufe(adresse: string, init: RequestInit): Promise<XAntwort> {
  const r = await fetch(adresse, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: oauthKopf(init.method ?? 'GET', adresse, SCHLUESSEL),
    },
  })
  const text = await r.text()
  if (!r.ok) {
    const warum =
      r.status === 402
        ? 'Guthaben leer – im Entwicklerportal aufladen.'
        : r.status === 401
          ? 'Schlüssel ungültig.'
          : r.status === 403
            ? 'Keine Berechtigung – die App braucht „Read and write", danach Zugangsschlüssel neu erzeugen.'
            : r.status === 429
              ? 'Zu viele Anfragen.'
              : ''
    throw new Error(`${adresse}: ${r.status} ${warum}\n${text.slice(0, 500)}`)
  }
  return text ? (JSON.parse(text) as XAntwort) : {}
}

async function hochladen(jpeg: Buffer): Promise<string> {
  const form = new FormData()
  form.append(
    'media',
    new Blob([new Uint8Array(jpeg)], { type: 'image/jpeg' }),
    'bild.jpg'
  )
  form.append('media_category', 'tweet_image')
  const j = await rufe(`${API}/media/upload`, { method: 'POST', body: form })
  const id = j.data?.id ?? j.media_id_string
  if (!id) throw new Error(`Hochladen ohne Kennung: ${JSON.stringify(j).slice(0, 300)}`)
  return String(id)
}

async function poste(
  text: string,
  medien: string[],
  antwortAuf?: string
): Promise<string> {
  const j = await rufe(`${API}/tweets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      media: { media_ids: medien },
      ...(antwortAuf ? { reply: { in_reply_to_tweet_id: antwortAuf } } : {}),
    }),
  })
  const id = j.data?.id
  if (!id) throw new Error(`Post ohne Kennung: ${JSON.stringify(j).slice(0, 300)}`)
  return String(id)
}

/* ------------------------------------------------------------ Hinaus */

let erster: string | undefined
try {
  for (const [i, p] of posts.entries()) {
    const medien: string[] = []
    for (const jpeg of jpegs[i]) medien.push(await hochladen(jpeg))
    const id = await poste(p.text, medien, erster)
    melde(`Post ${i + 1} veröffentlicht: https://x.com/i/status/${id}`)
    if (!erster) {
      erster = id
      /*
        Die Marke steht, sobald der erste Post draußen ist – scheitert die
        Antwort, darf der nächste Lauf den ersten nicht ein zweites Mal
        schicken.
      */
      appendFileSync(NEU, `${HEUTE} ${ART} ${id}\n`)
    }
  }
} catch (fehler) {
  console.log(`::error::${(fehler as Error).message}`)
  if (erster) console.log('  Der erste Post steht; die Marke ist gesetzt.')
  process.exit(1)
}
