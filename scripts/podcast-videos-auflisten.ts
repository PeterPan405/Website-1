/**
 * Listet die jüngsten Videos des eigenen YouTube-Kanals auf.
 *
 * ## Warum es das braucht
 *
 * Am 10. August 2026 lagen zwei Videos desselben Tages auf dem Kanal, und
 * eines davon hatte vier Sekunden Quietschen. Zu wissen, **welches** gelöscht
 * werden muss, war überraschend schwer: Das Register kennt nur eine Kennung,
 * die des doppelten Uploads steht in keiner Datei, und aus dem Protokoll des
 * Laufs ließ sie sich nachträglich nicht mehr herausholen.
 *
 * Übrig blieb, den Betreiber danach zu fragen – also ihn eine Kennung aus
 * einer URL abtippen zu lassen, die ein Läufer in einer Sekunde bekommt. Das
 * ist die falsche Arbeitsteilung.
 *
 * Dieser Lauf beantwortet die Frage selbst: Kennung, Titel, Länge und
 * Veröffentlichungszeit der jüngsten Videos. Er ändert nichts.
 *
 * ## Warum nicht über den Feed
 *
 * Der RSS-Feed der Sendung verweist auf die MP3-Dateien, nicht auf YouTube.
 * Und die Momentaufnahme unter `data/snapshots/podcast.json` kennt nur, was
 * beim letzten Abruf im Register stand – ein Doppel-Upload steht dort
 * naturgemäß nicht.
 *
 * Aufruf: `ANZAHL=10 npm run videos`
 */

/* Ohne Import oder Export gilt die Datei als Skript, und dort ist `await`
   auf oberster Ebene nicht erlaubt. */
export {}

const CLIENT_ID = process.env.YT_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET?.trim()
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN?.trim()

const ANZAHL = Math.min(Number(process.env.ANZAHL ?? '10') || 10, 50)

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('::error::[videos] Keine YouTube-Zugangsdaten hinterlegt.')
  process.exit(1)
}

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
).json()) as { access_token?: string }

if (!tokenAntwort.access_token) {
  console.error('::error::[videos] Anmeldung bei YouTube abgelehnt.')
  process.exit(1)
}

const kopf = { Authorization: `Bearer ${tokenAntwort.access_token}` }

/*
  Der Weg zu den eigenen Videos führt über die Wiedergabeliste „uploads“ des
  Kanals. Die Suche (`search.list`) wäre der naheliegende Griff und der
  falsche: Sie kostet hundert Einheiten des Tageskontingents statt einer und
  zeigt frisch hochgeladene Videos mitunter minutenlang nicht an.
*/
const kanal = (await (
  await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
    { headers: kopf }
  )
).json()) as {
  items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
}

const uploads = kanal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
if (!uploads) {
  console.error('::error::[videos] Der Kanal nennt keine Upload-Liste.')
  process.exit(1)
}

const liste = (await (
  await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails` +
      `&playlistId=${encodeURIComponent(uploads)}&maxResults=${ANZAHL}`,
    { headers: kopf }
  )
).json()) as { items?: { contentDetails?: { videoId?: string } }[] }

const kennungen = (liste.items ?? [])
  .map((eintrag) => eintrag.contentDetails?.videoId)
  .filter((id): id is string => Boolean(id))

if (kennungen.length === 0) {
  console.log('[videos] Der Kanal hat keine Videos.')
  process.exit(0)
}

/* Länge und Titel stehen nicht in der Wiedergabeliste – ein zweiter Abruf,
   aber für alle Kennungen auf einmal. */
const einzelheiten = (await (
  await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status` +
      `&id=${kennungen.join(',')}`,
    { headers: kopf }
  )
).json()) as {
  items?: {
    id: string
    snippet?: { title?: string; publishedAt?: string }
    contentDetails?: { duration?: string }
    status?: { privacyStatus?: string }
  }[]
}

/** `PT4M16S` → `4:16`. */
function alsZeit(iso: string | undefined): string {
  const treffer = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? '')
  if (!treffer) return '?'
  const [, h, m, s] = treffer
  const minuten = Number(h ?? 0) * 60 + Number(m ?? 0)
  return `${minuten}:${String(Number(s ?? 0)).padStart(2, '0')}`
}

console.log(`[videos] Die ${kennungen.length} jüngsten Videos des Kanals:\n`)
for (const video of einzelheiten.items ?? []) {
  console.log(
    `  ${video.id}  ${alsZeit(video.contentDetails?.duration).padStart(6)}  ` +
      `${(video.snippet?.publishedAt ?? '').slice(0, 19).replace('T', ' ')}  ` +
      `${video.status?.privacyStatus ?? '?'}  ${video.snippet?.title ?? ''}`
  )
}
