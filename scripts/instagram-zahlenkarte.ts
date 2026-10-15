/**
 * Veröffentlicht die Zahlenkarte des Tages – ein Bild, kein Karussell.
 *
 * Gestartet von `.github/workflows/instagram-zahlenkarte.yml`, und zwar erst
 * **nach** der Freigabe im Chat (Anordnung vom 15.10.2026: Entwurf um 16 Uhr,
 * Freigabe, bis 17 Uhr online). Die Freigabe kommt als Datum herein; nur wenn
 * es heute ist, geht etwas hinaus – ein Datum läuft um Mitternacht ab, ein
 * Schalter nicht (`ENTSCHEIDUNGEN.md`, „Der vierte Riegel ist ein Datum").
 *
 * Vier Riegel, alle vor dem ersten Aufruf bei Meta:
 *
 *   1. Freigabe = heute (deutscher Kalendertag)
 *   2. Die Website zeigt die Karte von heute (`/instagram/zahlenkarte.txt`)
 *   3. Das Bild antwortet mit 200 und ist ein JPEG
 *   4. Im Kanal steht diese Karte noch nicht – gefragt wird nach **ihrem**
 *      Aufhänger, nicht nach „irgendein Beitrag heute": Die Tagesnews stehen
 *      um 17 Uhr längst drin.
 */
const API = 'https://graph.facebook.com/v21.0'
const TOKEN = process.env.IG_ACCESS_TOKEN?.trim() ?? ''
const KONTO = process.env.IG_USER_ID?.trim() ?? ''
const BASIS = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iminvests.de').replace(
  /\/+$/,
  ''
)
const FREIGABE = (process.env.FREIGABE ?? '').trim()

const melde = (s: string) => console.log(`[zahlenkarte] ${s}`)
const halt = (s: string): never => {
  melde(s)
  melde('Es geht nichts hinaus.')
  process.exit(0)
}

const HEUTE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(
  new Date()
)

// Riegel 1
if (FREIGABE !== HEUTE) halt(`Freigabe „${FREIGABE || '–'}" ist nicht heute (${HEUTE}).`)

// Riegel 2
const textAntwort = await fetch(`${BASIS}/instagram/zahlenkarte.txt`, {
  cache: 'no-store',
})
if (!textAntwort.ok)
  halt(`${BASIS}/instagram/zahlenkarte.txt antwortet mit ${textAntwort.status}.`)
const [datum, ...rest] = (await textAntwort.text()).split('\n')
const beschriftung = rest.join('\n').trim()
if (datum.trim() !== HEUTE)
  halt(
    `Die Website zeigt die Karte vom ${datum.trim()}, nicht von heute – der Bau ist noch nicht übertragen.`
  )
if (!beschriftung.includes('KI erstellt'))
  halt('Die Beschriftung trägt keinen KI-Hinweis.')
const aufhaenger = beschriftung.split('\n')[0].trim()
melde(`Karte vom ${HEUTE}: ${aufhaenger}`)

// Riegel 3
const bildAdresse = `${BASIS}/instagram/zahlenkarte.jpg?d=${HEUTE}`
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

export {}
