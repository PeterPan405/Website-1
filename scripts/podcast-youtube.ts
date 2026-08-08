/**
 * Lädt das fertige Video der Tagesfolge auf YouTube hoch.
 *
 * ## Was beim Hochladen gleich mitgesetzt wird
 *
 * Die drei Häkchen aus der Upload-Checkliste, damit sie nie vergessen werden:
 * nicht für Kinder, KI-Kennzeichnung (`containsSyntheticMedia`), und – falls
 * `YT_PLAYLIST_ID` hinterlegt ist – die Playlist. Der Titel kommt aus
 * `titel.txt`, die Beschreibung samt Kapitelmarken aus `beschreibung.txt`.
 *
 * ## Ohne Zugangsdaten kein Fehler
 *
 * Dasselbe Muster wie überall: Fehlen die Secrets, endet das Skript mit
 * null und sagt, was fehlt. Die Anmeldung ist ein einmaliger Schritt auf
 * dem eigenen Rechner – `scripts/youtube-anmelden.mjs` führt hindurch.
 *
 * ## Warum in zwei Schritten hochgeladen wird
 *
 * YouTube verlangt für Dateien den „resumable upload“: erst die Metadaten
 * anmelden, dann die Bytes an die zurückgegebene Adresse schicken. Ein
 * einzelner Multipart-Aufruf bricht bei fünf Minuten Video zu oft ab.
 *
 * Aufruf: npm run youtube
 */

import { readFileSync, statSync } from 'node:fs'

const CLIENT_ID = process.env.YT_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET?.trim()
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN?.trim()
const PLAYLIST = process.env.YT_PLAYLIST_ID?.trim()

const VIDEO = 'podcast-folge/video.mp4'

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.log(
    '[youtube] Keine Zugangsdaten hinterlegt – nichts zu tun.\n' +
      '          Einmalig anmelden mit: node scripts/youtube-anmelden.mjs\n' +
      '          Danach YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN als Secrets.'
  )
  process.exit(0)
}

/*
  Kein Video, aber Zugangsdaten? Dann ist das die Gelegenheit, sie zu prüfen.

  Sonst stellt sich erst am ersten echten Morgen heraus, ob Schlüssel und
  Token stimmen – und dann fehlt die Folge. Die Probe fragt nur den
  Kanalnamen ab; sie ändert nichts und kostet nichts.
*/
let video: Buffer | null = null
try {
  video = readFileSync(VIDEO)
} catch {
  console.log('[youtube] Kein Video unter podcast-folge/ – stattdessen Zugangsprobe.')
}

/* Zugangs-Token aus dem Refresh-Token – der einzige Schritt, der das
   Client-Secret braucht. */
const tokenAntwort = (await (
  await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
).json()) as { access_token?: string; error?: string }

if (!tokenAntwort.access_token) {
  console.error(`::error::[youtube] Anmeldung abgelehnt: ${JSON.stringify(tokenAntwort)}`)
  process.exit(1)
}
const token = tokenAntwort.access_token

if (!video) {
  const kanal = (await (
    await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json()) as { items?: { snippet?: { title?: string } }[] }

  const name = kanal.items?.[0]?.snippet?.title
  if (!name) {
    console.error(
      '::error::[youtube] Anmeldung ging durch, aber kein Kanal gefunden.\n' +
        '          Vermutlich wurde bei der Zustimmung das falsche Google-Konto gewählt.'
    )
    process.exit(1)
  }
  console.log(`[youtube] Zugang geprüft. Hochgeladen würde auf den Kanal: „${name}“`)
  process.exit(0)
}

const titelDatei = readFileSync('podcast-folge/titel.txt', 'utf8').split('\n')
const titel = titelDatei[0].trim()
const folgennummer = titelDatei[1]?.trim() ?? ''
const beschreibung = readFileSync('podcast-folge/beschreibung.txt', 'utf8').trim()

/* Schritt 1: Metadaten anmelden, Upload-Adresse entgegennehmen. */
const start = await fetch(
  'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(statSync(VIDEO).size),
      'X-Upload-Content-Type': 'video/mp4',
    },
    body: JSON.stringify({
      snippet: {
        title: folgennummer ? `${titel} | Marktupdate ${folgennummer}` : titel,
        description: beschreibung,
        categoryId: '25',
        defaultLanguage: 'de',
        defaultAudioLanguage: 'de',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
        containsSyntheticMedia: true,
      },
    }),
  }
)

const uploadAdresse = start.headers.get('location')
if (!start.ok || !uploadAdresse) {
  console.error(
    `::error::[youtube] Upload-Anmeldung fehlgeschlagen (Status ${start.status}): ` +
      (await start.text()).slice(0, 400)
  )
  process.exit(1)
}

/* Schritt 2: die Bytes. */
const hochladen = await fetch(uploadAdresse, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(video.length) },
  body: new Uint8Array(video),
})

const ergebnis = (await hochladen.json().catch(() => ({}))) as { id?: string }
if (!hochladen.ok || !ergebnis.id) {
  console.error(
    `::error::[youtube] Hochladen fehlgeschlagen (Status ${hochladen.status}).`
  )
  process.exit(1)
}

console.log(`[youtube] Hochgeladen: https://youtu.be/${ergebnis.id}`)

/* In die Playlist einsortieren – Scheitern ist eine Warnung, kein Abbruch:
   Das Video ist dann trotzdem online. */
if (PLAYLIST) {
  const einsortieren = await fetch(
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        snippet: {
          playlistId: PLAYLIST,
          resourceId: { kind: 'youtube#video', videoId: ergebnis.id },
        },
      }),
    }
  )
  if (einsortieren.ok) {
    console.log('[youtube] In die Playlist einsortiert.')
  } else {
    console.log(
      `::warning::[youtube] Playlist fehlgeschlagen (Status ${einsortieren.status}) – Video ist trotzdem online.`
    )
  }
}
