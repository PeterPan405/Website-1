/**
 * Veröffentlicht die Zahlenkarte des Tages – ein Bild, kein Karussell.
 *
 * Gestartet von `.github/workflows/instagram-zahlenkarte.yml` – angestoßen
 * vom Dauerlauf ab 15 Uhr, Cron als Rückfall, oder von Hand. Die Freigabe
 * steht als Datum an der Karte und kommt mit dem Bau auf die Website; nur
 * wenn es heute ist, geht etwas hinaus – ein Datum läuft um Mitternacht ab,
 * ein Schalter nicht (`ENTSCHEIDUNGEN.md`, „Der vierte Riegel ist ein Datum").
 *
 * Fünf Riegel, alle vor dem ersten Aufruf bei Meta:
 *
 *   0. Es ist 15 Uhr deutscher Zeit oder später (bis 18.10.2026: 16 Uhr) – „der Beitrag des Tages
 *      kommt immer erst um 16 Uhr" (Betreiber, 15.10.2026, nachdem die erste
 *      Karte um 08:59 hinausgegangen war; `lib/zahlenkarten-wecker.ts`)
 *   1. Freigabe = heute (deutscher Kalendertag), gelesen von der Website
 *   2. Die Website zeigt die Karte von heute (`/instagram/zahlenkarte.txt`)
 *   3. Das Bild antwortet mit 200 und ist ein JPEG
 *   4. Im Kanal steht diese Karte noch nicht – gefragt wird nach **ihrem**
 *      Aufhänger, nicht nach „irgendein Beitrag heute": Die Tagesnews stehen
 *      um 17 Uhr längst drin.
 */
import { nachgang } from '../lib/instagram-nachgang.ts'
import {
  AB_MINUTE,
  berlinJetzt,
  leseZahlenkarteText,
} from '../lib/zahlenkarten-wecker.ts'

const API = 'https://graph.facebook.com/v21.0'
const TOKEN = process.env.IG_ACCESS_TOKEN?.trim() ?? ''
const KONTO = process.env.IG_USER_ID?.trim() ?? ''
const BASIS = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iminvests.de').replace(
  /\/+$/,
  ''
)

const melde = (s: string) => console.log(`[zahlenkarte] ${s}`)
const halt = (s: string): never => {
  melde(s)
  melde('Es geht nichts hinaus.')
  process.exit(0)
}

const { tag: HEUTE, minute } = berlinJetzt(new Date())

// Riegel 0
if (minute < AB_MINUTE)
  halt(
    `Es ist ${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')} Uhr – die Zahlenkarte geht frühestens um 15 Uhr hinaus.`
  )

const textAntwort = await fetch(`${BASIS}/instagram/zahlenkarte.txt`, {
  cache: 'no-store',
})
if (!textAntwort.ok)
  halt(`${BASIS}/instagram/zahlenkarte.txt antwortet mit ${textAntwort.status}.`)
const { datum, freigabe, beschriftung } = leseZahlenkarteText(await textAntwort.text())

// Riegel 1
if (freigabe !== HEUTE)
  halt(
    `Freigabe „${freigabe ?? '–'}" ist nicht heute (${HEUTE}) – ohne Freigabe geht nichts hinaus.`
  )

// Riegel 2
if (datum !== HEUTE)
  halt(
    `Die Website zeigt die Karte vom ${datum}, nicht von heute – der Bau ist noch nicht übertragen.`
  )
if (!beschriftung.includes('KI erstellt'))
  halt('Die Beschriftung trägt keinen KI-Hinweis.')
const aufhaenger = beschriftung.split('\n')[0].trim()
melde(`Karte vom ${HEUTE}: ${aufhaenger}`)

// Riegel 3
/* Jedes Mal eine neue Adresse – Meta merkt sich Bilder an ihr (18.10.2026). */
const bildAdresse = `${BASIS}/instagram/zahlenkarte.jpg?d=${HEUTE}&t=${Date.now()}`
const bild = await fetch(bildAdresse, { method: 'HEAD', cache: 'no-store' })
if (!bild.ok || !(bild.headers.get('content-type') ?? '').includes('image/jpeg'))
  halt(
    `Das Bild antwortet mit ${bild.status} (${bild.headers.get('content-type') ?? '?'}).`
  )

if (!TOKEN || !KONTO) {
  melde(
    'Kein IG_ACCESS_TOKEN/IG_USER_ID – Trockenlauf. Bild und Beschriftung stehen bereit.'
  )
  process.exit(0)
}

// Riegel 4
const bestand = (await (
  await fetch(
    `${API}/${KONTO}/media?fields=timestamp,caption,permalink&limit=15&access_token=${encodeURIComponent(TOKEN)}`
  )
).json()) as {
  data?: { timestamp?: string; caption?: string; permalink?: string }[]
  error?: { message?: string }
}
if (bestand.error) {
  melde(`Der Kanal ist nicht lesbar: ${bestand.error.message ?? 'ohne Grund'}`)
  melde('Ohne ihn lässt sich ein doppelter Beitrag nicht ausschließen.')
  process.exit(1)
}
const doppelt = (bestand.data ?? []).find((m) =>
  (m.caption ?? '').trim().startsWith(aufhaenger)
)
if (doppelt)
  halt(`Diese Karte steht schon im Kanal: ${doppelt.permalink ?? '(ohne Adresse)'}`)

async function graph(pfad: string, felder: Record<string, string>) {
  const antwort = await fetch(`${API}/${pfad}`, {
    method: 'POST',
    body: new URLSearchParams({ ...felder, access_token: TOKEN }),
  })
  const daten = (await antwort.json()) as Record<string, unknown> & {
    error?: { message?: string; code?: number }
  }
  if (daten.error)
    throw new Error(
      `Meta lehnt ab (${daten.error.code ?? '?'}): ${daten.error.message ?? 'ohne Grund'}`
    )
  return daten
}

const behaelter = String(
  (
    await graph(`${KONTO}/media`, {
      image_url: bildAdresse,
      caption: beschriftung,
      is_ai_generated: 'true',
    })
  ).id
)
const frist = Date.now() + 90_000
for (;;) {
  const z = (await (
    await fetch(
      `${API}/${behaelter}?fields=status_code&access_token=${encodeURIComponent(TOKEN)}`
    )
  ).json()) as {
    status_code?: string
  }
  if (z.status_code === 'FINISHED') break
  if (z.status_code === 'ERROR' || Date.now() > frist)
    throw new Error(`Behälter ${behaelter}: ${z.status_code ?? 'unbekannt'}`)
  await new Promise((r) => setTimeout(r, 3000))
}
const veroeffentlicht = await graph(`${KONTO}/media_publish`, { creation_id: behaelter })
melde(`Veröffentlicht: ${String(veroeffentlicht.id)}`)
melde('https://www.instagram.com/im_invests/')

// Kommentare an (`lib/instagram-nachgang.ts`). Die Story teilt der
// Betreiber in der App – nur dort trägt sie den Verweis zum Beitrag.
await nachgang({ api: API, token: TOKEN, beitrag: String(veroeffentlicht.id), melde })

export {}
